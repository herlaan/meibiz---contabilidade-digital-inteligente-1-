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

    const generalKnowledge = `
INFORMAÇÕES OFICIAIS DA MEIBIZ:
1. Slogan: "Solução contábil para sua empresa!" (Sempre trate a MeiBiz com essa postura).
2. O que a MeiBiz faz? Somos uma Contabilidade Digital especializada. Oferecemos: Abertura de MEI grátis, gestão contábil mensal (emissão de notas, cálculo de DAS, DASN), desenquadramento de MEI para ME, troca de contador e assessoria especializada.
3. WhatsApp Humano/Atendimento: Caso o cliente queira falar com um contador ou humano, forneça SEMPRE o nosso WhatsApp oficial: +55 11 91492-8772 (Link: wa.me/5511914928772).
4. Abertura de CNPJ MEI: A abertura na MeiBiz é 100% gratuita. O cliente só arcará com as guias oficiais (DAS). Ele pode se cadastrar no site para liberar a plataforma.
5. Tom de Voz: Empático, seguro, rápido e muito humano. Se o cliente tiver uma dor fiscal pesada (multas do governo), tranquilize-o e envie ele pro WhatsApp.

REGRA CRÍTICA: NUNCA INVENTE TAXAS, VALORES DE MULTAS OU PRAZOS FISCAIS INEXISTENTES. Se a dúvida fiscal for complexa, envie o WhatsApp da empresa.`;

    const systemInstruction = `Você é a MeiBiz IA — assistente virtual oficial da plataforma MeiBiz. Mantenha as respostas concisas e no formato de texto limpo ou markdown leve (sem tabelas pesadas). \n\n${generalKnowledge}\n\nContexto Atual do Usuário: ${roleDescription}`;
    // ────────────────────────────────────────────────────────────────────

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
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
