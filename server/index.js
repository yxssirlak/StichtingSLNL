const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const nodemailer = require('nodemailer');

// Create a payment (uses Mollie when MOLLIE_API_KEY is provided, otherwise fallback to mock)
app.post('/api/create-payment', async (req, res) => {
  const { event_title, name, email, amount } = req.body;
  const mollieKey = process.env.MOLLIE_API_KEY || '';

  // If no Mollie key configured, return a mock payment for local testing
  if (!mollieKey || mollieKey === 'PLACEHOLDER') {
    const paymentId = 'mock_' + crypto.randomBytes(6).toString('hex');
    const paymentUrl = `https://example.com/mock-pay?payment_id=${paymentId}&amount=${encodeURIComponent(amount)}`;
    return res.json({ payment_id: paymentId, payment_url: paymentUrl, amount: Number(amount) });
  }

  try {
    const redirectUrl = process.env.PAYMENT_REDIRECT_URL || 'https://example.com/payment-return';
    const webhookUrl = process.env.PAYMENT_WEBHOOK_URL || (req.protocol + '://' + req.get('host') + '/api/webhook');

    const body = {
      amount: { currency: 'EUR', value: Number(amount).toFixed(2) },
      description: `${event_title} — ${name} (${email})`,
      redirectUrl,
      webhookUrl
    };

    const resp = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mollieKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error('Mollie create payment error', data);
      return res.status(500).json({ error: 'Mollie error', details: data });
    }

    // return Mollie payment id and checkout URL
    return res.json({ payment_id: data.id, payment_url: data._links?.checkout?.href, amount: body.amount.value });
  } catch (err) {
    console.error('Create payment failed', err);
    return res.status(500).json({ error: 'create-payment-failed', details: String(err) });
  }
});

// Placeholder webhook endpoint for payment status updates
// Mollie webhook handler: fetch payment status from Mollie and update Supabase
app.post('/api/webhook', async (req, res) => {
  // Mollie sends either form-encoded or JSON with an "id" field
  const mollieId = (req.body && (req.body.id || req.body.payment_id)) || null;
  console.log('Webhook received, mollie id:', mollieId);

  if (!mollieId) {
    return res.status(400).send('missing id');
  }

  const mollieKey = process.env.MOLLIE_API_KEY || '';
  if (!mollieKey || mollieKey === 'PLACEHOLDER') {
    console.log('No Mollie key configured — webhook will not query Mollie.');
    return res.status(200).send('ok');
  }

  try {
    const resp = await fetch(`https://api.mollie.com/v2/payments/${encodeURIComponent(mollieId)}`, {
      headers: { 'Authorization': `Bearer ${mollieKey}` }
    });
    const payment = await resp.json();

    const status = payment.status; // e.g. 'paid', 'open', 'canceled', 'failed'
    const amount = payment.amount?.value || null;

    // Update Supabase inschrijvingen row matching payment_id
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (supabaseUrl && supabaseServiceKey) {
      // First update the row
      const updateResp = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/inschrijvingen?payment_id=eq.${encodeURIComponent(mollieId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ payment_status: status, payment_amount: amount })
      });

      if (!updateResp.ok) {
        console.error('Failed to update supabase with payment status', await updateResp.text());
      } else {
        console.log('Supabase updated with payment status for', mollieId);
        // If payment is paid, fetch the updated row and send an email notification
        if (status === 'paid') {
          try {
            const getResp = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/inschrijvingen?payment_id=eq.${encodeURIComponent(mollieId)}&select=*`, {
              headers: { 'apikey': supabaseServiceKey, 'Authorization': `Bearer ${supabaseServiceKey}` }
            });
            if (getResp.ok) {
              const rows = await getResp.json();
              const row = rows && rows[0];
              if (row && row.email) {
                // send email via nodemailer if SMTP configured
                const smtpHost = process.env.SMTP_HOST || '';
                const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 0;
                const smtpUser = process.env.SMTP_USER || '';
                const smtpPass = process.env.SMTP_PASS || '';
                const emailFrom = process.env.EMAIL_FROM || 'no-reply@example.com';

                if (smtpHost && smtpPort && smtpUser && smtpPass) {
                  const transporter = nodemailer.createTransport({ host: smtpHost, port: smtpPort, secure: smtpPort === 465, auth: { user: smtpUser, pass: smtpPass } });
                  const mailOptions = {
                    from: emailFrom,
                    to: row.email,
                    subject: `Betaling ontvangen: ${row.evenement_titel}`,
                    text: `Beste ${row.naam},\n\nWe hebben je betaling van €${amount} ontvangen voor ${row.evenement_titel}.\n\nDank je!\n`,
                    html: `<p>Beste ${row.naam},</p><p>We hebben je betaling van <strong>€${amount}</strong> ontvangen voor <strong>${row.evenement_titel}</strong>.</p><p>Dank je!</p>`
                  };
                  transporter.sendMail(mailOptions).then(() => console.log('Payment email sent to', row.email)).catch(err => console.error('Failed to send email', err));
                } else {
                  console.log('SMTP not configured — skip sending payment confirmation email.');
                }
              }
            }
          } catch (err) {
            console.error('Failed to fetch inschrijving after update', err);
          }
        }
      }
    } else {
      console.log('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured — skipping DB update.');
    }

    res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook processing error', err);
    res.status(500).send('error');
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Placeholder payment server running on port ${port}`));
