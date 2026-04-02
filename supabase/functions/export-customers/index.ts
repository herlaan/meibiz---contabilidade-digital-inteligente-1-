import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Validar chave de acesso (Segurança)
    const clientApiKey = req.headers.get('x-api-key') || new URL(req.url).searchParams.get('api_key');
    const validApiKey = Deno.env.get('SYNC_API_KEY');

    if (!validApiKey || clientApiKey !== validApiKey) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado. Chave de API (SYNC_API_KEY) inválida ou ausente.' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      )
    }

    // 2. Inicializar cliente Supabase com Service Role para bypass do RLS (puxar todos os dados)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // 3. Buscar dados agregados dos clientes
    const { data: profiles, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 4. Retornar dados em formato JSON para a empresa parceira
    return new Response(
      JSON.stringify({ 
        total_records: profiles.length,
        timestamp: new Date().toISOString(),
        data: profiles 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
