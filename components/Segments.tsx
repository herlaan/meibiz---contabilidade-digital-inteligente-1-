import React from 'react';
import { Briefcase, ShoppingBag, User, Stethoscope, ArrowRight } from 'lucide-react';

export const Segments: React.FC = () => {
  const segments = [
    {
      icon: <Briefcase size={32} />,
      title: "Prestadores de Serviços",
      desc: "TI, Marketing, Engenharia, Consultoria.",
      link: "#"
    },
    {
      icon: <ShoppingBag size={32} />,
      title: "Comércio",
      desc: "Lojas físicas e virtuais, vestuário, acessórios.",
      link: "#"
    },
    {
      icon: <User size={32} />,
      title: "Profissionais Liberais",
      desc: "Advogados, Arquitetos, Psicólogos, Dentistas.",
      link: "#"
    },
    {
      icon: <Stethoscope size={32} />,
      title: "Área da Saúde",
      desc: "Médicos, Clínicas, Fisioterapeutas e Nutricionistas.",
      link: "#"
    }
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-slate-900 mb-4">A contabilidade certa para o seu perfil</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Não importa o tamanho ou o ramo do seu negócio, temos especialistas prontos para te atender.
          </p>
        </div>

        {/* Mobile: Infinite Marquee */}
        <div className="lg:hidden relative w-full -mx-4">
             {/* Gradients removed */}
             
             <div className="flex gap-4 animate-marquee-reverse pause-on-hover w-max px-4">
                {[...segments, ...segments].map((segment, index) => (
                    <div key={`mob-seg-${index}`} className="w-[260px] flex-shrink-0 group p-6 rounded-xl border border-slate-200 bg-white">
                        <div className="w-14 h-14 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 mb-4">
                            {segment.icon}
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">{segment.title}</h3>
                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">{segment.desc}</p>
                    </div>
                ))}
             </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map((segment, index) => (
            <div key={index} className="group p-6 rounded-xl border border-slate-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50 transition-all duration-300 bg-white cursor-pointer">
              <div className="w-14 h-14 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                {segment.icon}
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">{segment.title}</h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">{segment.desc}</p>
              <div className="flex items-center text-brand-600 font-medium text-sm group-hover:gap-2 transition-all">
                Saiba mais <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};