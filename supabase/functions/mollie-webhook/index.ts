import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createMollieClient } from "npm:@mollie/api-client";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialiseer clients. Let op: SUPABASE_SERVICE_ROLE_KEY is cruciaal om de database te mogen overschrijven!
const mollieClient = createMollieClient({ apiKey: Deno.env.get("MOLLIE_TEST_API_KEY")! });
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

serve(async (req) => {
  try {
    // Lees de body als ruwe tekst (robuuster voor zowel form-data als JSON/ping)
    const bodyText = await req.text();
    console.log("Raw body ontvangen:", bodyText);

    const params = new URLSearchParams(bodyText);
    const paymentId = params.get('id');

    // 1. PING CHECK (Voorkomt fouten bij de 'Test' knop in het Mollie Dashboard)
    if (!paymentId) {
      console.log("Geen payment ID gevonden. Dit is waarschijnlijk een hook.ping test van Mollie.");
      return new Response("OK - Ping ontvangen", { status: 200 });
    }

    // 2. HAAL BETALING OP BIJ MOLLIE
    console.log(`Betaling ID ${paymentId} ophalen bij Mollie...`);
    const payment = await mollieClient.payments.get(paymentId);
    console.log(`Status van betaling ${paymentId} is: ${payment.status}`);

    // 3. ALS BETAALD: UPDATE DATABASE EN STUUR MAIL
    if (payment.status === 'paid') {
      console.log("Betaling is succesvol! Inschrijving zoeken in database...");

      // Haal de inschrijving op
      const { data: inschrijving, error: fetchError } = await supabase
        .from('inschrijvingen')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

      if (fetchError || !inschrijving) {
        console.error("FOUT: Inschrijving niet gevonden in database:", fetchError);
        // Geef toch 200 terug, anders blijft Mollie het proberen
        return new Response("OK", { status: 200 }); 
      }

      console.log(`Inschrijving gevonden voor ${inschrijving.naam}. Database updaten...`);

      // Update de database naar 'paid'
      const { error: updateError } = await supabase
        .from('inschrijvingen')
        .update({ payment_status: 'paid' })
        .eq('payment_id', paymentId);

      if (updateError) {
        console.error("FOUT bij het updaten van de database:", updateError);
        return new Response("Database Error", { status: 500 });
      }

      console.log("Database succesvol geüpdatet naar 'paid'. E-mail voorbereiden...");

      // 4. MAAK QR CODE EN EMAIL TEMPLATE
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${paymentId}`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #E2F0E9; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #114232; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Je ticket voor ${inschrijving.evenement_titel}</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px;">Beste <strong>${inschrijving.naam}</strong>,</p>
            <p style="font-size: 16px;">We hebben je betaling succesvol ontvangen. Dit is jouw officiële toegangsbewijs. Laat de onderstaande QR-code scannen bij de ingang.</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <img src="${qrCodeUrl}" alt="QR Code Ticket" width="200" height="200" style="border: 2px solid #114232; padding: 10px; border-radius: 12px;"/>
            </div>
            
            <div style="background-color: #F8FAF9; padding: 20px; border-radius: 8px;">
              <p style="margin: 0 0 10px 0;"><strong>Evenement:</strong> ${inschrijving.evenement_titel}</p>
              <p style="margin: 0 0 10px 0;"><strong>Betaald bedrag:</strong> €${Number(inschrijving.payment_amount).toFixed(2)}</p>
              <p style="margin: 0; color: #666; font-size: 14px;"><strong>Bestelnummer:</strong> ${paymentId}</p>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">We kijken ernaar uit je te zien!</p>
            <p style="font-size: 16px; color: #666;">Met vriendelijke groet,<br/><strong>Stichting SLNL</strong></p>
          </div>
        </div>
      `;

      console.log(`E-mail verzenden naar ${inschrijving.email}...`);

      // 5. STUUR DE EMAIL VIA RESEND
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Stichting SLNL <onboarding@resend.dev>', // Let op: test met je eigen email (waarmee je bent ingelogd bij Resend) als je een gratis account hebt!
          to: inschrijving.email,
          subject: `🎟️ Je ticket voor ${inschrijving.evenement_titel}`,
          html: emailHtml
        })
      });

      if (!resendRes.ok) {
         const resendError = await resendRes.text();
         console.error("FOUT bij het versturen van e-mail via Resend:", resendError);
      } else {
         console.log("E-mail succesvol verzonden!");
      }
    }

    // Mollie verwacht altijd een 200 OK als het script is ontvangen
    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Fatale webhook error:", error);
    return new Response("Server Error", { status: 500 });
  }
});