import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle2, TrendingUp, ShieldCheck, FileText, Headphones, MessageCircle } from 'lucide-react';

interface LeaveMeiPageProps {
    onBack: () => void;
}

export const LeaveMeiPage: React.FC<LeaveMeiPageProps> = ({ onBack }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleWhatsAppClick = () => {
        const phone = "5575988927727";
        const message = "Olá! Gostaria de falar com um contador sobre o desenquadramento do meu MEI.";
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative lg:pb-0 selection:bg-brand-500 selection:text-white">

            {/* Floating WhatsApp Button (Mobile & Desktop) */}
            <button
                onClick={handleWhatsAppClick}
                className="fixed bottom-6 right-6 z-50 bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
                aria-label="Falar no WhatsApp"
            >
                <MessageCircle size={28} />
                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out ml-0 group-hover:ml-3 font-medium text-sm">
                    Falar com contador
                </span>
            </button>

            {/* Hero Section */}
            <section className="relative bg-slate-950 text-white pt-10 pb-20 lg:pt-16 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
                {/* Background Accents (Orange Gradient) */}
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-accent-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

                <div className="max-w-6xl mx-auto relative z-10">

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="max-w-2xl reveal active">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-medium uppercase tracking-wider mb-6">
                                <ShieldCheck size={16} />
                                Segurança Contábil
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-6 leading-tight">
                                Deixar de ser MEI com segurança e orientação contábil
                            </h1>

                            <p className="text-xl sm:text-2xl text-slate-300 mb-8 font-medium leading-snug">
                                Cuidamos de todo o processo de desenquadramento do MEI para você continuar crescendo sem riscos.
                            </p>

                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-medium text-lg px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg shadow-sky-500/30"
                            >
                                Falar com um contador no WhatsApp
                            </button>

                            <div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
                                <div className="flex -space-x-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#020817] flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-brand-500" />
                                        </div>
                                    ))}
                                </div>
                                <p>Atendemos MEIs em todo o Brasil com atendimento rápido, claro e humanizado.</p>
                            </div>
                        </div>

                        {/* Context Card */}
                        <div className="relative reveal active delay-200">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-accent-600 rounded-3xl transform rotate-3 scale-[1.02] opacity-50 blur-sm"></div>
                            <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl relative text-slate-300 border border-white/10">
                                <div className="w-12 h-12 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center mb-6">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="text-2xl font-medium mb-4 text-white">
                                    O crescimento traz novas responsabilidades
                                </h3>
                                <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                                    <p>
                                        Quando o seu negócio cresce, continuar como MEI pode gerar multas, impostos incorretos e problemas com a Receita Federal.
                                    </p>
                                    <p>
                                        Seja por faturamento acima do limite, contratação de funcionários ou mudança de atividade, o desenquadramento do MEI precisa ser feito da forma correta.
                                    </p>
                                    <div className="pt-4 border-t border-white/10 mt-4">
                                        <p className="text-brand-400 font-medium">
                                            Nossa equipe cuida de todo o processo para você migrar com tranquilidade e segurança, sem burocracia e sem surpresas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-offwhite relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 reveal active">
                        <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 mb-6">
                            O que está incluso no serviço
                        </h2>
                        <p className="text-lg text-slate-600">
                            Uma transição transparente, sem letras miúdas. Você acompanha cada etapa enquanto nossa equipe técnica resolve a burocracia.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="bg-white p-8 rounded-3xl hover:shadow-xl transition-all group reveal active border border-slate-100">
                            <div className="w-14 h-14 shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all bg-white text-slate-900">
                                <FileText className="text-brand-600" size={24} />
                            </div>
                            <h4 className="text-xl font-medium text-slate-900 mb-3">Análise de Situação</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Análise completa da sua situação atual para definir a melhor estratégia de migração.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl hover:shadow-xl transition-all group reveal active delay-100 border border-slate-100">
                            <div className="w-14 h-14 shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all bg-white text-slate-900">
                                <ShieldCheck className="text-brand-600" size={24} />
                            </div>
                            <h4 className="text-xl font-medium text-slate-900 mb-3">Desenquadramento</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Ato oficial do desenquadramento do MEI perante a Receita Federal e Prefeitura.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl hover:shadow-xl transition-all group reveal active delay-200 border border-slate-100">
                            <div className="w-14 h-14 shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all bg-white text-slate-900">
                                <TrendingUp className="text-brand-600" size={24} />
                            </div>
                            <h4 className="text-xl font-medium text-slate-900 mb-3">Orientação Tributária</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Instruções claras sobre os novos impostos (Simples Nacional) e obrigações futuras da sua ME.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl hover:shadow-xl transition-all group reveal active delay-300 border border-slate-100">
                            <div className="w-14 h-14 shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all bg-white text-slate-900">
                                <Headphones className="text-brand-600" size={24} />
                            </div>
                            <h4 className="text-xl font-medium text-slate-900 mb-3">Suporte Integral</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Suporte contábil constante por WhatsApp durante e após toda a fase de transição.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust CTA Section */}
            <section className="bg-offwhite py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto bg-slate-950 rounded-[2.5rem] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl reveal active">
                    <div className="absolute inset-0 bg-brand-600/10 opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-medium text-white mb-6">
                            Pronto para dar o próximo passo?
                        </h2>
                        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
                            Sua empresa merece uma contabilidade que acompanhe o seu ritmo de crescimento. Fale conosco agora e resolva isso com rapidez.
                        </p>
                        <button
                            onClick={handleWhatsAppClick}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-medium text-lg px-8 py-4 rounded-full inline-flex items-center justify-center transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30"
                        >
                            Falar com um contador no WhatsApp
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};
