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

  const relevantEvents = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];
  
  if (relevantEvents.includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 1. Validação do Pagamento
    // Se for 'checkout.session.completed' mas não estiver pago (ex: Boleto pendente), ignoramos.
    // O evento 'checkout.session.async_payment_succeeded' cuidará disso depois.
    if (session.payment_status !== 'paid') {
      console.log(`Pagamento ainda não confirmado para sessão ${session.id}. Aguardando confirmação assíncrona.`);
      return new Response(JSON.stringify({ received: true, status: 'waiting_payment' }), { status: 200 });
    }

    const userId = session.client_reference_id;
    if (!userId) {
       console.error('User ID ausente no client_reference_id');
       return new Response('User ID ausente', { status: 400 });
    }
    
    const amountPaid = session.amount_total;
    let planType = 'premium'; // default
    
    // Mapeamento baseado nos preços definidos em Plans.tsx
    if (amountPaid === 8900) {
      planType = 'start';
    } else if (amountPaid === 12900) {
      planType = 'essencial';
    } else if (amountPaid === 16900) {
      planType = 'premium';
    } else if (session.metadata?.plano) {
      planType = session.metadata.plano;
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        plan_type: planType, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) {
      console.error(`Erro ao atualizar perfil do usuário ${userId}:`, error);
      return new Response('Erro ao atualizar DB', { status: 500 });
    }

    console.log(`Plano ${planType} liberado com sucesso para o usuário ${userId}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
