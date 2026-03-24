// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno"

// Inicializa o Stripe com a versão correta da API
const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// O provedor de criptografia nativo do Deno para validar a assinatura do Stripe
const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')

  if (!signature) {
    return new Response('Assinatura ausente', { status: 400 })
  }

  const body = await req.text()
  let event;

  try {
    // 1. VALIDAÇÃO DE SEGURANÇA: Garante que o pedido veio mesmo do Stripe
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error(`Erro na assinatura do Webhook: ${err.message}`)
    return new Response(`Erro de Webhook: ${err.message}`, { status: 400 })
  }

  // 2. REGRA DE NEGÓCIO: Se o checkout foi pago com sucesso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Recupera o ID do Supabase que injetámos na URL (client_reference_id)
    const userId = session.client_reference_id;

    if (userId) {
      // Cria um cliente Supabase com privilégios de Admin (Service Role) 
      // para conseguir editar o perfil ignorando as regras de RLS
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Atualiza o plano na base de dados
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ plan_type: 'completo', updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao atualizar plano no banco:', error)
        return new Response('Erro na base de dados', { status: 500 })
      }
      
      console.log(`Sucesso: Plano atualizado para o utilizador ${userId}`)
    }
  }

  // Responde ao Stripe para ele saber que recebemos a mensagem
  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
