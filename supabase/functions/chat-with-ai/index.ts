import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, context } = await req.json()
    
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error("A GEMINI_API_KEY não está configurada no Supabase.");
    }

    // ── Contexto Dinâmico: Quem é e onde está? ──────────────────────────
    const { pathname = '/', isAdmin = false, plan = 'Visitante' } = context ?? {};

    let pageLabel = 'Página Pública do Site';
    if (pathname === '/dashboard') pageLabel = 'Dashboard do Cliente';
    else if (pathname === '/admin') pageLabel = 'Painel Administrativo (Admin)';
    else if (pathname?.startsWith('/calculadora')) pageLabel = 'Calculadora Financeira';
    else if (pathname === '/abrir-mei-gratis') pageLabel = 'Página de Abertura de MEI Grátis';

    let roleDescription = '';
    if (isAdmin) {
      roleDescription = `ATENÇÃO: Você está conversando com um ADMINISTRADOR DA MEIBIZ no ${pageLabel}. Use linguagem técnica e operacional. Pode ajudar com gestão de clientes, tickets, configurações da plataforma, regras fiscais avançadas e relatórios.`;
    } else if (pathname === '/dashboard') {
      roleDescription = `Você está no ${pageLabel} atendendo um CLIENTE ATIVO da MeiBiz (Plano atual: ${plan}). Ajude com dúvidas sobre notas fiscais, DAS, CNAE, obrigações mensais do MEI e funcionalidades da plataforma. Se não souber algo específico, oriente a abrir um Chamado de Suporte.`;
    } else {
      roleDescription = `Você está na ${pageLabel} atendendo um VISITANTE. Apresente os benefícios da MeiBiz, esclareça dúvidas gerais sobre MEI e incentive o cadastro gratuito. Seja simpático e motivador.`;
    }

    const systemInstruction = `Você é a MeiBiz IA — assistente virtual da MeiBiz, plataforma líder de contabilidade digital para Microempreendedores Individuais. Responda sempre em português brasileiro. Mantenha as respostas concisas, em tom empático, moderno e resolutivo. Use emojis com moderação. ${roleDescription} REGRA IMPORTANTE: Nunca invente valores, alíquotas ou prazos fiscais. Em caso de dúvida, diga que vai verificar e sugira a abertura de um Chamado de Suporte.`;
    // ────────────────────────────────────────────────────────────────────

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      systemInstruction,
    });

    // Converte histórico para o formato Google AI
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.type === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Fix crítico: Gemini retorna erro 400 se o histórico começa com 'model'
    // (A saudação inicial da IA não pode ser parte do histórico enviado)
    while (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }
    
    const lastUserMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUserMessage);
    const responseText = result.response.text();

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    )
  }
})
