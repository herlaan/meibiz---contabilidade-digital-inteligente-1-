import React from 'react';
import { Button } from './Button';
import { UserPlus, FileSearch, Landmark, Rocket, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    { 
      icon: <UserPlus className="w-6 h-6 lg:w-8 lg:h-8" />,
      title: "Cadastro e Contratação", 
      desc: "Crie sua conta em menos de 2 minutos e escolha o plano ideal.",
      fullDesc: "Crie sua conta em menos de 2 minutos e escolha o plano ideal para o perfil do seu negócio.",
      color: "bg-brand-500"
    },
    { 
      icon: <FileSearch className="w-6 h-6 lg:w-8 lg:h-8" />,
      title: "Análise e Documentação", 
      desc: "Nossa equipe analisa seus dados. Tudo 100% digital.",
      fullDesc: "Nossa equipe analisa seus dados e solicita apenas os documentos essenciais. Tudo 100% digital.",
      color: "bg-indigo-500"
    },
    { 
      icon: <Landmark className="w-6 h-6 lg:w-8 lg:h-8" />,
      title: "Registro e Taxas", 
      desc: "Cuidamos do registro na Junta e Prefeitura para você.",
      fullDesc: "Orientamos sobre o pagamento das taxas governamentais e cuidamos do registro na Junta e Prefeitura.",
      color: "bg-violet-500"
    },
    { 
      icon: <Rocket className="w-6 h-6 lg:w-8 lg:h-8" />,
      title: "Empresa Aberta", 
      desc: "CNPJ ativo, conta aberta e emissão de notas liberada.",
      fullDesc: "Pronto! Seu CNPJ está ativo, conta bancária aberta e você já pode emitir notas fiscais.",
      color: "bg-emerald-500"
    }
  ];

  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-20 reveal">
          <span className="text-brand-600 font-medium uppercase tracking-wider text-sm mb-3 block">Processo Simplificado</span>
          <h2 className="text-3xl lg:text-4xl font-medium text-slate-900 mb-4 lg:mb-6">Sua empresa aberta em 4 passos</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto hidden lg:block">
            Eliminamos a papelada e a burocracia do processo tradicional. 
            Com a MeiBiz, você acompanha cada etapa em tempo real pelo app.
          </p>
        </div>

        {/* MOBILE LAYOUT: Compact Vertical List */}
        <div className="lg:hidden space-y-6 relative mb-12">
            {/* Linha vertical conectora */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>

            {steps.map((step, index) => (
                <div key={index} className="relative z-10 flex items-start gap-4 reveal">
                    <div className={`w-12 h-12 rounded-xl ${step.color} text-white flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-white`}>
                        {step.icon}
                    </div>
                    <div className="pt-1">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {step.title}
                            {index === steps.length - 1 && <CheckCircle2 size={16} className="text-emerald-500" />}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mt-1">
                            {step.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>

        {/* DESKTOP LAYOUT: Full Cards */}
        <div className="hidden lg:block relative">
            <div className="absolute top-[60px] left-0 w-full h-1 bg-gradient-to-r from-brand-100 via-brand-200 to-brand-100 rounded-full z-0"></div>
            
            <div className="grid grid-cols-4 gap-6 relative z-10">
                {steps.map((step, index) => (
                <div 
                    key={index} 
                    className="reveal-scale flex flex-col group relative"
                    style={{ transitionDelay: `${index * 150}ms` }}
                >
                    <div className="flex items-center justify-center mb-8 relative">
                        <div className="w-32 h-32 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:border-brand-100 transition-all duration-300">
                            <div className={`w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
                                {step.icon}
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-md">
                                {index + 1}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-brand-100/50 hover:border-brand-200 transition-all duration-300 flex-grow text-left">
                        <h3 className="font-medium text-slate-900 text-xl mb-3 flex items-center gap-2">
                            {step.title}
                            <ChevronRight size={16} className="text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0" />
                        </h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            {step.fullDesc}
                        </p>
                    </div>
                </div>
                ))}
            </div>
        </div>

        <div className="text-center mt-8 lg:mt-16 reveal delay-300">
            <Button size="lg" className="shadow-[0_20px_50px_-12px_rgba(59,130,246,0.5)] w-full sm:w-auto">
                Quero abrir minha empresa <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="mt-6 text-sm text-slate-400">
                Já tem CNPJ? <a href="#" className="text-brand-600 hover:underline font-medium">Veja como migrar</a>
            </p>
        </div>
      </div>
    </section>
  );
};