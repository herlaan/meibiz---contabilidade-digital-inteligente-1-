import React from 'react';
import { MapPin, FileKey, Scale, PieChart, Landmark, ArrowRight, ChevronRight } from 'lucide-react';

export const AdditionalSolutions: React.FC = () => {
  const solutions = [
    {
      icon: <MapPin size={24} />,
      title: "Escritório Virtual",
      desc: "Endereço fiscal gratuito.",
      fullDesc: "Endereço fiscal gratuito em endereços prestigiados para abrir seu CNPJ sem precisar alugar sala comercial.",
      color: "text-brand-600",
      bg: "bg-brand-50",
      hover: "group-hover:bg-brand-600"
    },
    {
      icon: <FileKey size={24} />,
      title: "Certificado Digital",
      desc: "e-CNPJ A1 com desconto.",
      fullDesc: "Emissão de e-CNPJ A1 com desconto para clientes. Essencial para emitir notas fiscais eletrônicas.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      hover: "group-hover:bg-amber-600"
    },
    {
      icon: <Scale size={24} />,
      title: "Registro de Marca",
      desc: "Proteção no INPI.",
      fullDesc: "Proteja o nome do seu negócio. Assessoria completa junto ao INPI para garantir a exclusividade da sua marca.",
      color: "text-slate-600",
      bg: "bg-slate-100",
      hover: "group-hover:bg-slate-800"
    },
    {
      icon: <PieChart size={24} />,
      title: "BPO Financeiro",
      desc: "Terceirização financeira.",
      fullDesc: "Terceirize seu financeiro. Contas a pagar, receber e fluxo de caixa geridos por especialistas.",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      hover: "group-hover:bg-indigo-600"
    },
    {
      icon: <Landmark size={24} />,
      title: "Recuperação Tributária",
      desc: "Reembolso de impostos.",
      fullDesc: "Análise inteligente para identificar impostos pagos a mais nos últimos 5 anos e solicitar reembolso.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      hover: "group-hover:bg-emerald-600"
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 lg:mb-16 max-w-3xl mx-auto reveal">
          <span className="text-brand-600 font-bold uppercase tracking-wider text-sm mb-3 block">Ecossistema Completo</span>
          <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4 lg:mb-6">
            Muito mais que contabilidade
          </h2>
          <p className="text-slate-500 text-lg hidden lg:block">
            Oferecemos um hub de soluções para que você resolva todas as pendências da sua empresa em um único lugar, com condições exclusivas.
          </p>
        </div>
        
        {/* Mobile: Infinite Marquee */}
        <div className="lg:hidden relative w-full -mx-4">
            {/* Gradients removed */}

            <div className="flex gap-4 animate-marquee pause-on-hover w-max px-4">
                {[...solutions, ...solutions].map((item, idx) => (
                    <div 
                      key={`mob-sol-${idx}`}
                      className="group w-[280px] flex-shrink-0 p-8 rounded-[2rem] bg-white shadow-sm border border-slate-100 flex flex-col items-start"
                    >
                      <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                        {item.icon}
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {item.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                        {item.desc}
                      </p>
                      
                      <div className="flex items-center text-slate-900 font-medium text-sm w-full">
                        Ver detalhes <ChevronRight size={16} className="ml-auto" />
                      </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {solutions.map((item, idx) => (
            <div 
              key={idx}
              className="
                group p-8 rounded-[2rem] bg-white shadow-sm border border-slate-100 
                hover:border-slate-200 hover:shadow-xl transition-all duration-300 
                hover:-translate-y-1 flex flex-col items-start cursor-pointer reveal-scale
              "
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className={`${item.bg} ${item.color} ${item.hover} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:text-white shadow-sm`}>
                {item.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                {item.fullDesc}
              </p>
              
              <div className="flex items-center text-slate-900 font-medium text-sm group-hover:gap-2 transition-all group-hover:text-brand-600">
                Ver detalhes <ArrowRight size={16} className="ml-2 text-slate-400 group-hover:text-brand-600" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};