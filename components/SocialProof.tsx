import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

export const SocialProof: React.FC = () => {
  const reviews = [
    {
      name: "Mariana Souza",
      role: "Arquiteta e Urbanista",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      text: "Eu tinha pavor de contabilidade até conhecer a MeiBiz. A plataforma é linda, super fácil de usar e quando preciso de ajuda, o suporte no WhatsApp resolve em minutos.",
      date: "Há 2 dias"
    },
    {
      name: "Pedro Alencar",
      role: "Dev Freelancer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      text: "Abri minha empresa de graça com eles. O processo foi transparente do início ao fim. O emissor de notas fiscais deles é mil vezes melhor que o da prefeitura.",
      date: "Há 1 semana"
    },
    {
      name: "Juliana Costa",
      role: "E-commerce de Moda",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      text: "Migrei de um escritório tradicional onde eu era só mais um número. Aqui tenho um assessor que conhece meu negócio e me ajuda a pagar menos imposto.",
      date: "Há 3 semanas"
    },
    {
      name: "Ricardo Ferraz",
      role: "Consultor Financeiro",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      text: "A tecnologia deles é impressionante. Integração total com minha conta PJ. Zero papelada, zero dor de cabeça. Recomendo para todos os meus clientes.",
      date: "Há 1 mês"
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand-50 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-gradient-to-tr from-slate-50 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 lg:mb-16 gap-8 reveal">
           <div className="max-w-2xl text-center md:text-left">
             <h2 className="text-3xl md:text-5xl font-medium text-slate-900 mb-4 lg:mb-6 tracking-tight">
               Não acredite apenas<br/> na nossa palavra.
             </h2>
             <p className="text-lg text-slate-500 leading-relaxed hidden lg:block">
               Junte-se a mais de 50.000 empreendedores que transformaram a gestão de seus negócios com a MeiBiz.
             </p>
           </div>

           {/* Aggregate Score Badge */}
           <div className="bg-slate-50 border border-slate-100 p-4 lg:p-6 rounded-2xl flex items-center justify-center md:justify-start gap-4 lg:gap-6 shadow-sm w-full md:w-auto md:min-w-[280px]">
              <div className="flex flex-col">
                 <span className="text-3xl lg:text-4xl font-bold text-slate-900">4.9<span className="text-lg lg:text-xl text-slate-400 font-medium">/5</span></span>
                 <span className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-wide font-medium mt-1">Baseado em 12k reviews</span>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="flex flex-col gap-1">
                 <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="lg:w-5 lg:h-5" />)}
                 </div>
                 <span className="text-xs font-medium text-brand-600">Google Reviews</span>
              </div>
           </div>
        </div>

        {/* Reviews - Infinite Marquee for Mobile */}
        <div className="lg:hidden relative w-full -mx-4">
             {/* Gradients removed */}

             <div className="flex gap-4 animate-marquee-slow pause-on-hover w-max px-4">
               {[...reviews, ...reviews].map((review, idx) => (
                <div 
                  key={`mob-rev-${idx}`} 
                  className="w-[320px] flex-shrink-0 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="relative">
                         <img 
                            src={review.image} 
                            alt={review.name} 
                            className="w-12 h-12 rounded-full object-cover border border-slate-100"
                         />
                         <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                           <CheckCircle2 size={16} className="text-brand-500 fill-brand-50" />
                         </div>
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-900 text-sm">{review.name}</h3>
                          <p className="text-xs text-slate-500">{review.role}</p>
                       </div>
                    </div>
                    <Quote size={20} className="text-brand-100 fill-brand-50" />
                  </div>

                  <p className="text-slate-600 leading-relaxed text-sm mb-6 relative z-10 min-h-[60px]">
                    "{review.text}"
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                     <div className="flex text-yellow-400 gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                     </div>
                     <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                  </div>
                </div>
               ))}
             </div>
        </div>
        
        {/* Desktop Grid */}
        <div className="hidden lg:grid md:grid-cols-2 gap-8">
            {reviews.map((review, idx) => (
            <div 
              key={idx} 
              className="
                reveal-scale group bg-white p-8 rounded-[2rem] border border-slate-100 
                shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] 
                hover:border-brand-100 transition-all duration-300
              "
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="relative">
                     <img 
                        src={review.image} 
                        alt={review.name} 
                        className="w-14 h-14 rounded-full object-cover border border-slate-100"
                     />
                     <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                       <CheckCircle2 size={16} className="text-brand-500 fill-brand-50" />
                     </div>
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900 text-lg">{review.name}</h3>
                      <p className="text-sm text-slate-500">{review.role}</p>
                   </div>
                </div>
                <Quote size={20} className="text-brand-100 fill-brand-50 w-6 h-6" />
              </div>
              <p className="text-slate-600 leading-relaxed text-lg mb-6 relative z-10 min-h-[80px]">
                "{review.text}"
              </p>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex text-yellow-400 gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" className="lg:w-4 lg:h-4" />)}
                 </div>
                 <span className="text-xs text-slate-400 font-medium">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};