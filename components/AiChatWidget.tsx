import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useLocation, Link } from 'react-router-dom';

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

export const AiChatWidget: React.FC = () => {
    const { profile, isLoggedIn } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            content: 'Olá! Sou a assistente virtual da MeiBiz. Como posso ajudar com a sua contabilidade hoje?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Plano grátis não tem acesso à IA
    const isFreePlan = isLoggedIn && profile?.plan_type === 'gratis';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const { data, error } = await supabase.functions.invoke('chat-with-ai', {
                body: {
                    messages: [...messages, newUserMessage].map(m => ({ type: m.type, content: m.content })),
                    context: {
                        pathname: location.pathname,
                        isAdmin: profile?.is_admin || false,
                        plan: profile?.plan_type || 'Visitante/Deslogado'
                    }
                }
            });

            if (error) {
                console.error("Supabase Error Object:", error);
                
                // Tenta extrair a mensagem de erro que vem do Body da resposta enviada pela função
                let serverError = 'Erro desconhecido da API';
                try {
                    // O erro de função pode vir no context (Response)
                    if (error.context && typeof error.context.json === 'function') {
                        const errJson = await error.context.json();
                        serverError = errJson.error || JSON.stringify(errJson);
                    }
                } catch(e) {}
                
                throw new Error(serverError !== 'Erro desconhecido da API' ? serverError : error.message);
            }

            const newBotMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: data?.response || 'Tive um pequeno lapso. Pode repetir?',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newBotMessage]);
        } catch (err: any) {
            console.error(err);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: `Erro técnico: ${err.message || 'Desconhecido'}. Por favor, me avise qual foi esse erro para que eu consiga arrumar!`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    if (!isLoggedIn) return null;

    return (
        <>
            {/* Botão Flutuante */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-slate-800 text-white scale-90' : 'bg-brand-500 hover:bg-brand-600 text-white hover:scale-110'}`}
                    aria-label="Abrir Assistente AI"
                >
                    {isOpen ? <X size={24} /> : (
                        <div className="relative">
                            <Sparkles size={24} />
                            {!isFreePlan && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                            )}
                            {isFreePlan && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Lock size={6} className="text-white" />
                                </div>
                            )}
                        </div>
                    )}
                </button>
            </div>

            {/* Janela de Chat */}
            {isOpen && (
                <div className="fixed bottom-24 left-6 z-50 w-full max-w-[350px] sm:max-w-[400px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">

                    {/* Header */}
                    <div className="bg-slate-950 p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                                <Bot className="text-brand-400" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium flex items-center gap-2">
                                    MeiBiz IA
                                    <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] uppercase font-bold tracking-wider border border-brand-500/20">
                                        Beta
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${isFreePlan ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                    {isFreePlan ? 'Bloqueado' : 'Online'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* ===== PLANO GRÁTIS: TELA DE BLOQUEIO ===== */}
                    {isFreePlan ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 gap-5">
                            {/* Ícone de Cadeado */}
                            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center shadow-xl">
                                <div className="relative">
                                    <Sparkles size={28} className="text-brand-400" />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                        <Lock size={10} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">IA exclusiva para assinantes</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    A assistente inteligente MeiBiz está disponível a partir do plano <strong className="text-slate-700">MEI START</strong>. Faça upgrade para tirar dúvidas fiscais, contábeis e muito mais!
                                </p>
                            </div>

                            <div className="w-full space-y-3">
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-100 rounded-xl p-3">
                                    <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                                        <Bot size={12} className="text-brand-600" />
                                    </div>
                                    Dúvidas fiscais respondidas em segundos
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-100 rounded-xl p-3">
                                    <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                                        <Sparkles size={12} className="text-brand-600" />
                                    </div>
                                    Análise personalizada da sua empresa
                                </div>
                            </div>

                            <Link
                                to="/#planos"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold text-center transition-colors shadow-lg shadow-brand-600/30"
                            >
                                Ver Planos e Fazer Upgrade
                            </Link>
                        </div>
                    ) : (
                        /* ===== CHAT NORMAL (PAGO OU NÃO LOGADO) ===== */
                        <>
                            {/* Área de Mensagens */}
                            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                                <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg flex items-start gap-2 mb-4">
                                    <AlertCircle className="text-sky-500 shrink-0 mt-0.5" size={16} />
                                    <p className="text-xs text-sky-700 leading-relaxed">
                                        Nossa IA inteligente analisa sua conta MEI e tira dúvidas fiscais. Algumas respostas podem precisar de conferência humana temporariamente.
                                    </p>
                                </div>

                                {messages.map((message) => (
                                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex max-w-[85%] gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto ${message.type === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-slate-900 text-brand-400'}`}>
                                                {message.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className={`p-3 rounded-2xl ${message.type === 'user' ? 'bg-brand-500 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}`}>
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                                </div>
                                                <span className={`text-[10px] text-slate-400 ${message.type === 'user' ? 'text-right mr-1' : 'text-left ml-1'}`}>
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-900 text-brand-400 flex items-center justify-center shrink-0">
                                                <Loader2 size={14} className="animate-spin" />
                                            </div>
                                            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 h-10 w-16">
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Área de Input */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Pergunte sobre sua empresa..."
                                        className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm rounded-full py-3 px-4 outline-none border border-transparent focus:border-brand-500/50 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                        disabled={isTyping}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isTyping}
                                        className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center hover:bg-brand-600 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:bg-slate-950 disabled:hover:-translate-y-0 transition-all shrink-0"
                                    >
                                        <Send size={18} className="translate-x-0.5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};
