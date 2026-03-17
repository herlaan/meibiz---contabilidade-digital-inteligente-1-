import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

export const AiChatWidget: React.FC = () => {
    const { isLoggedIn } = useAuth();
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

    // Auto-scroll para a última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    if (!isLoggedIn) return null;

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Adiciona a mensagem do usuário
        const newUserMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simula a resposta da IA (será substituído pelo backend real)
        setTimeout(() => {
            const newBotMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: 'No momento, minha integração principal ainda está sendo configurada! Mas você sabia que sou treinada na legislação para te ajudar logo logo a crescer o seu MEI?',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newBotMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Botão Flutuante */}
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-slate-800 text-white scale-90' : 'bg-brand-500 hover:bg-brand-600 text-white hover:scale-110'
                        }`}
                    aria-label="Abrir Assistente AI"
                >
                    {isOpen ? <X size={24} /> : (
                        <div className="relative">
                            <Sparkles size={24} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                    )}
                </button>
            </div>

            {/* Janela de Chat */}
            {isOpen && (
                <div className="fixed bottom-24 left-6 z-50 w-full max-w-[350px] sm:max-w-[400px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-slate-950 p-4 border-b border-white/10 flex items-center justify-between">
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
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Área de Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                        {/* Aviso Informativo */}
                        <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg flex items-start gap-2 mb-4">
                            <AlertCircle className="text-sky-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-sky-700 leading-relaxed">
                                Nossa IA inteligente analisa sua conta MEI e tira dúvidas fiscais. Algumas respostas podem precisar de conferência humana temporariamente.
                            </p>
                        </div>

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex max-w-[85%] gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto ${message.type === 'user'
                                            ? 'bg-slate-200 text-slate-600'
                                            : 'bg-slate-900 text-brand-400'
                                        }`}>
                                        {message.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>

                                    {/* Balão de Mensagem */}
                                    <div className="flex flex-col gap-1">
                                        <div className={`p-3 rounded-2xl ${message.type === 'user'
                                                ? 'bg-brand-500 text-white rounded-br-sm'
                                                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                                            }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                        <span className={`text-[10px] text-slate-400 ${message.type === 'user' ? 'text-right mr-1' : 'text-left ml-1'
                                            }`}>
                                            {formatTime(message.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Indicador de Digitação */}
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
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-2"
                        >
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
                </div>
            )}
        </>
    );
};
