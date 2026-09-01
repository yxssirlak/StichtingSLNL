import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createMollieClient } from "npm:@mollie/api-client";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const mollieClient = createMollieClient({ apiKey: Deno.env.get("MOLLIE_LIVE_API_KEY")! });
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

serve(async (req: Request) => {
  try {
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const paymentId = params.get('id');

    if (!paymentId) return new Response("OK - Ping ontvangen", { status: 200 });

    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status === 'paid') {
      
      // HAAL *ALLE* TICKETS OP VAN DEZE BETALING (dus niet .single() gebruiken)
      const { data: inschrijvingen, error: fetchError } = await supabase
        .from('inschrijvingen')
        .select('*')
        .eq('payment_id', paymentId);

      if (fetchError || !inschrijvingen || inschrijvingen.length === 0) {
        return new Response("OK", { status: 200 }); 
      }

      // Zet ze ALLEMAAL op 'paid'
      const { error: updateError } = await supabase
        .from('inschrijvingen')
        .update({ payment_status: 'paid' })
        .eq('payment_id', paymentId);

      if (updateError) return new Response("Database Error", { status: 500 });

      const hoofdkoper = inschrijvingen[0];
      const totaalBedrag = inschrijvingen.reduce((total: number, t: any) => total + Number(t.payment_amount), 0);

      // Maak een HTML blokje voor ELK los ticket
      let ticketsHtml = '';
      for (const ticket of inschrijvingen) {
        // BELANGRIJK: De QR code gebruikt nu het ticket.id (de database rij), niet meer de paymentId!
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.id}`;
        
        ticketsHtml += `
          <div style="margin: 0 40px 30px; background-color: #f9fbfb; border: 2px dashed #114232; border-radius: 16px; padding: 30px; text-align: center;">
            <h2 style="margin: 0 0 5px 0; color: #114232; font-size: 22px;">${ticket.evenement_titel}</h2>
            <p style="margin: 0 0 25px 0; color: #777; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Toegang voor: <strong>${ticket.naam}</strong></p>

            <div style="background: white; display: inline-block; padding: 15px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 25px;">
              <img src="${qrCodeUrl}" alt="QR Code Ticket" width="200" height="200" style="display: block; border: 0;" />
            </div>

            <p style="margin: 0; color: #666; font-size: 14px;"><strong>Ticket ID:</strong> ${ticket.id}</p>
          </div>
        `;
      }

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e0e6e3; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">

            <div style="text-align: center; padding: 40px 20px 20px; background-color: #ffffff;">
              <img src="https://somalilandnederland.nl/SLNL_logo.png" alt="Stichting SLNL Logo" style="width: 120px; height: auto; margin-bottom: 20px;" />
              <h1 style="color: #114232; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">Je Toegangstickets</h1>
            </div>

            <div style="padding: 10px 40px 20px;">
              <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Beste <strong>${hoofdkoper.naam}</strong>,</p>
              <p style="font-size: 16px; line-height: 1.6; color: #555;">Bedankt voor je groepsboeking! We hebben je betaling van €${totaalBedrag.toFixed(2)} ontvangen. Hieronder vind je alle persoonlijke tickets. Elke bezoeker heeft zijn eigen QR-code nodig bij de ingang.</p>
            </div>

            ${ticketsHtml}

            <div style="background-color: #114232; padding: 30px; text-align: center; color: #ffffff;">
              <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">We kijken ernaar uit jullie te zien!</p>
              <p style="margin: 0; font-size: 14px; opacity: 0.85;">Heb je vragen? Neem contact met ons op via <a href="mailto:info@somalilandnederland.nl" style="color: #ffffff; text-decoration: underline;">info@somalilandnederland.nl</a></p>
            </div>

          </div>
        </div>
      `;

      // STUUR DE EMAIL
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Stichting SLNL <order@tickets.somalilandnederland.nl>',
          to: hoofdkoper.email,
          subject: `🎟️ Jouw ${inschrijvingen.length} tickets voor ${hoofdkoper.evenement_titel}`,
          html: emailHtml
        })
      });
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Fatale webhook error:", error);
    return new Response("Server Error", { status: 500 });
  }
});