import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Configuração de CORS para permitir que o Vite chame a função
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()
    
    // Obte a chave a partir das variáveis de ambiente na nuvem
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error("A GEMINI_API_KEY não está configurada no Supabase.");
    }

    // Inicializa o GenAI com Gemini 1.5 Flash (Super rápido e Barato)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    // Converte o histórico para o formato do Google
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.type === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    const lastUserMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history,
      systemInstruction: "Você é a assistente virtual da MeiBiz e ajuda as pessoas MEI (Microempreendedor Individual) em Portugal ou Brasil a focar nas suas empresas enquanto cuidamos da contabilidade. Mantenha as respostas curtas, num tom empático, moderno e solucionador. Se o cliente perguntar algo sobre faturamento, nota fiscal ou DAS que você não saiba responder com clareza, indique que deve abrir um Chamado ou contactar o contador no chat.",
    });

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
