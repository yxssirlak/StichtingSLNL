import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createMollieClient } from "npm:@mollie/api-client";

// Dit vertelt de browser: "Ja, deze website mag met mij praten!"
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const mollieClient = createMollieClient({ apiKey: Deno.env.get("MOLLIE_TEST_API_KEY")! });

serve(async (req: Request) => {
  // 1. Vang het veiligheids-check verzoek (OPTIONS) van de browser af
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, description, orderId, returnUrl } = await req.json();

    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: amount.toFixed(2),
      },
      description: description,
      redirectUrl: returnUrl || 'https://stichtingslnl.nl/succes',
      webhookUrl: 'https://zegiegzhubsqqqiuskfh.supabase.co/functions/v1/mollie-webhook',
    });

    // SUCCES ANTWOORD: Geef de URL én het ID terug
    return new Response(JSON.stringify({ 
      checkoutUrl: payment.getCheckoutUrl(),
      paymentId: payment.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500, // Zorg dat hij op 500 staat
    });
  }
});