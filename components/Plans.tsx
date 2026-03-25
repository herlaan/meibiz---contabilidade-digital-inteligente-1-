import React, { useState } from 'react';
import { Check, Star, Building2, Wrench } from 'lucide-react';
import { Button } from './Button';
import { TouchCarousel } from './TouchCarousel';

type PlanCategory = 'comercio' | 'servico';

export const Plans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlanCategory>('servico');

  const basePlans = [
    {
      name: "MEI START",
      price: "89",
      desc: "Ideal para MEIs iniciantes ou com baixo movimento",
      features: [
        "Abertura gratuita (plano anual)",
        "Declaração Anual incluída",
        "Suporte básico via WhatsApp",
        "Organização de documentos em nuvem",
        "Lembretes mensais automáticos",
        "Ideal para MEIs iniciantes ou com baixo movimento"
      ],
      highlight: false,
      link: "https://buy.stripe.com/test_7sYdR89dt0hg6dxeKJdAk01"
    },
    {
      name: "MEI ESSENCIAL",
      price: "129",
      desc: "Perfeito para MEIs que já emitem notas frequentemente",
      features: [
        "Inclui tudo do MEI START +:",
        "Emissão de até 20 notas fiscais/mês",
        "Controle fiscal básico e conferência de notas",
        "Relatório trimestral",
        "Suporte prioritário",
        "Perfeito para MEIs que já emitem notas frequentemente"
      ],
      highlight: true,
      tag: "Mais Escolhido",
      link: "https://buy.stripe.com/test_eVqeVcfBR7JI7hB321dAk02"
    },
    {
      name: "MEI PREMIUM",
      price: "169",
      desc: "Melhor opção para quem deseja expandir com segurança",
      features: [
        "Inclui tudo do MEI ESSENCIAL +:",
        "Notas fiscais ilimitadas",
        "Consultoria mensal por vídeo/telefone",
        "Planejamento tributário anual",
        "Análise do limite MEI e projeção de crescimento",
        "Suporte completo para migração MEI → ME",
        "Melhor opção para quem deseja expandir com segurança"
      ],
      highlight: false,
      link: "https://buy.stripe.com/test_7sYcN4blBe867hB321dAk03"
    }
  ];

  // For now, both categories use the same plans as requested.
  const plansData = {
    comercio: basePlans,
    servico: basePlans
  };

  const currentPlans = plansData[activeTab];

  return (
    <section id="planos" className="relative py-24 bg-offwhite overflow-hidden">
      {/* Geometric Tech Slant Divider */}
      <div className="absolute top-0 left-0 w-full h-16 pointer-events-none overflow-hidden z-10">
        <div 
          className="absolute inset-0 bg-brand-900/5" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 40%)' }}
        ></div>
        <div 
          className="absolute inset-0 bg-white" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)' }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 reveal">
          <h2 className="text-3xl lg:text-4xl font-medium text-slate-900 mb-6">Planos e Preços</h2>
          
          {/* Tab Selector */}
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-slate-200 mb-8 mx-auto relative z-20">
            <button
              onClick={() => setActiveTab('servico')}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'servico'
                  ? 'text-white bg-brand-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Wrench size={16} />
              Para Serviços
            </button>
            <button
              onClick={() => setActiveTab('comercio')}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'comercio'
                  ? 'text-white bg-brand-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 size={16} />
              Para Comércio
            </button>
          </div>
        </div>

        {/* MOBILE: Infinite Marquee (Looping) */}
        <div className="lg:hidden relative w-full -mx-4 mb-8 pt-4">
          <TouchCarousel
            className="w-full"
            innerClassName="flex gap-4 animate-marquee-slow pause-on-hover w-max px-4"
          >
                {[...currentPlans, ...currentPlans].map((plan, index) => (
                    <div 
                      key={`mob-plan-${index}`}
                      className={`relative rounded-[2rem] p-6 flex flex-col w-[300px] flex-shrink-0 border transition-all duration-300 ${
                        plan.highlight 
                          ? 'bg-brand-950 text-white shadow-xl border-brand-800 scale-100 z-10' 
                          : 'bg-white text-slate-900 border-slate-200 shadow-sm'
                      }`}
                    >
                      {plan.highlight && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg whitespace-nowrap">
                          <Star size={10} fill="currentColor" /> {plan.tag}
                        </div>
                      )}
                      
                      <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
                      
                      <div className="mb-4 flex items-baseline">
                        <span className="text-xs font-medium opacity-70">R$</span>
                        <span className="text-4xl font-medium tracking-tight mx-1">{plan.price}</span>
                        <span className="text-xs font-medium opacity-70">/mês</span>
                      </div>
                      
                      <p className={`text-xs leading-relaxed mb-6 h-8 ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                        {plan.desc}
                      </p>

                      <Button 
                        variant={plan.highlight ? 'primary' : 'outline'} 
                        fullWidth
                        size="sm"
                        className="mb-6"
                        onClick={() => window.location.href = plan.link}
                      >
                        Contratar
                      </Button>

                      <div className="space-y-2">
                          {plan.features.map((feat, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs">
                                  <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.highlight ? 'text-accent-400' : 'text-brand-600'}`} />
                                  <span className={plan.highlight ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                              </div>
                          ))}
                      </div>
                    </div>
              ))}
          </TouchCarousel>
          <p className="text-center text-xs text-slate-400 mt-4 animate-pulse">Arraste para explorar os planos</p>
        </div>


        {/* DESKTOP: Grid */}
        <div className="hidden lg:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pb-4">
          {currentPlans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`animate-enter relative rounded-[2rem] p-8 flex flex-col transition-all duration-300 group hover:-translate-y-2 ${
                plan.highlight 
                  ? 'bg-brand-950 text-white shadow-2xl scale-105 z-10 border border-brand-800' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 150}ms`, opacity: 0 }}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent-500 text-white px-4 py-1 rounded-full text-xs font-medium uppercase tracking-wide flex items-center gap-1 shadow-lg whitespace-nowrap">
                  <Star size={12} fill="currentColor" /> {plan.tag}
                </div>
              )}
              
              <h3 className="text-xl font-medium mb-4">{plan.name}</h3>
              
              <div className="mb-6 flex items-baseline">
                <span className={`text-sm font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>R$</span>
                <span className="text-5xl font-medium tracking-tight mx-1">{plan.price}</span>
                <span className={`text-sm font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>/mês</span>
              </div>
              
              <p className={`text-sm leading-relaxed mb-8 h-10 ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                {plan.desc}
              </p>

              <Button 
                variant={plan.highlight ? 'primary' : 'outline'} 
                fullWidth
                className="mb-8"
                onClick={() => window.location.href = plan.link}
              >
                Contratar
              </Button>

              <div className="space-y-3">
                  {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                          <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-accent-400' : 'text-brand-600'}`} />
                          <span className={plan.highlight ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                      </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};