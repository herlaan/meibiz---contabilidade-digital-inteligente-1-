import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

export const MeiOpportunity: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // CUSTOM INTERSECTION OBSERVER
  // We handle this locally to ensure the specific 0.85 opacity and TranslateY values 
  // requested in the prompt are met precisely for this transition.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    // SECTION WRAPPER (The "Sheet" Layer)
    // -mt-20 / -mt-40: This negative margin creates the overlap effect.
    // rounded-t-[3rem]: Creates the physical card curve.
    // z-20: MUST be higher than Hero (z-0) to sit on top.
    <section 
      ref={sectionRef}
      className={`
        relative z-20 -mt-24 lg:-mt-40 pb-16 bg-[#F8FAFC] 
        rounded-t-[2.5rem] lg:rounded-t-[4rem] 
        shadow-[0_-25px_60px_-15px_rgba(0,0,0,0.4)] 
        border-t border-white/40 overflow-hidden
        transform transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-85 translate-y-6'}
      `}
    >
      
      {/* 
        Decorative Top Highlight 
        Adds a glossy edge to the rounded top, simulating light catching the edge of the "paper".
      */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-28">
        
        {/* Content Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500">
            
            <div className="flex-1 relative z-10">
                <div className="inline-flex items-center gap-2 text-brand-600 font-medium mb-6 bg-brand-50 px-4 py-1.5 rounded-full text-xs uppercase tracking-wide border border-brand-100">
                    <TrendingUp size={14} /> Oportunidade
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-medium text-slate-900 mb-6 tracking-tight">
                  Sua empresa precisa deixar de ser MEI?
                </h2>
                
                <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                  Cresceu e o limite de faturamento ficou pequeno? Migre para ME com segurança e continue expandindo seu negócio sem multas.
                </p>
                
                <button className="group/btn bg-brand-950 text-white px-8 py-4 rounded-full font-medium inline-flex items-center hover:bg-brand-900 transition-all shadow-lg shadow-brand-900/20 hover:shadow-brand-900/40 hover:-translate-y-0.5">
                    Deixar de ser MEI 
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="flex-1 flex justify-center w-full md:w-auto relative z-10">
                {/* Image Container with organic shape mask hint */}
                <div className="relative">
                  {/* Decorative backdrop for image */}
                  <div className="absolute inset-0 bg-brand-600 rounded-2xl rotate-3 opacity-20 scale-105 blur-sm transition-transform duration-700 group-hover:rotate-6"></div>
                  
                  <img 
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop" 
                      alt="Especialista com tablet" 
                      className="relative rounded-2xl shadow-sm w-full max-w-sm object-cover h-64 md:h-80 grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
            </div>

            {/* Background Orbs inside the card for "Glassmorphism" hint */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-50 to-accent-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-50 to-brand-50 rounded-full blur-3xl opacity-60 -ml-10 -mb-10 pointer-events-none mix-blend-multiply"></div>
        </div>
      </div>
    </section>
  );
};