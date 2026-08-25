import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createMollieClient } from "npm:@mollie/api-client";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Haal de API key veilig op
    const apiKey = Deno.env.get("MOLLIE_LIVE_API_KEY");
    if (!apiKey) {
      throw new Error("MOLLIE_LIVE_API_KEY ontbreekt in de server instellingen!");
    }

    const mollieClient = createMollieClient({ apiKey: apiKey });

    // 2. Lees de body
    const { amount, description, returnUrl } = await req.json();

    // 3. Controleer bedrag (Mollie vereist vaak minimaal 0.01, maar sommige banken 0.20)
    // Laten we minimaal 0.20 hanteren voor test/live betalingen
    const validAmount = amount < 0.20 ? 0.20 : amount;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: validAmount.toFixed(2),
      },
      description: description,
      redirectUrl: returnUrl || 'https://stichtingslnl.nl/succes',
      webhookUrl: 'https://zegiegzhubsqqqiuskfh.supabase.co/functions/v1/mollie-webhook',
    });

    return new Response(JSON.stringify({ 
      checkoutUrl: payment.getCheckoutUrl(),
      paymentId: payment.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error: any) {
    console.error("Fout in Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});