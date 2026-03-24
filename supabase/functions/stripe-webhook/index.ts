import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  if (!signature) return new Response('Assinatura ausente', { status: 400 })

  const body = await req.text()
  let event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET')!, undefined, cryptoProvider)
  } catch (err) {
    return new Response(`Erro: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    
    // Tática alternativa inteligente: Identificar o plano pelo valor pago!
    const amountPaid = session.amount_total;
    let planType = 'premium'; // default
    
    if (amountPaid === 8900) {
      planType = 'start';
    } else if (amountPaid === 12900) {
      planType = 'essencial';
    } else if (amountPaid === 16900) {
      planType = 'premium';
    } else if (session.metadata?.plano) {
      planType = session.metadata.plano; // Tenta o metadado como último recurso
    }
    if (userId) {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseAdmin
        .from('profiles')
        .update({ plan_type: planType, updated_at: new Date().toISOString() })
        .eq('id', userId)
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
