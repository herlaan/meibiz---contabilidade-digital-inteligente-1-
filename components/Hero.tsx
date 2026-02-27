import React, { useEffect, useState } from 'react';
import { ShieldCheck, Zap, Users, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Usando requestAnimationFrame para performance mais suave
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden bg-brand-950 text-white min-h-[95vh] flex items-center z-0">
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Tech Grid definido no index.html */}
        <div className="absolute inset-0 bg-tech-grid opacity-20"></div>
        
        {/* Gradientes de profundidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950 via-brand-950/90 to-brand-950"></div>
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-brand-900/20 to-transparent"></div>
        
        {/* Glow Effects (Cérebro/Luz) */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* --- COLUNA 1: CONTEÚDO --- */}
          <div 
            className="flex flex-col justify-center"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          >
            {/* Badge Tech */}
            <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 backdrop-blur-md mb-8 w-fit shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              <Zap size={14} className="text-accent-400 fill-accent-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent-100">Contabilidade do Futuro</span>
            </div>

            {/* Headline Principal */}
            <h1 className="reveal delay-100 text-4xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
              Da abertura do CNPJ até a contabilidade completa, <span className="text-gradient-animated font-semibold block mt-2">conte com a gente.</span>
            </h1>

            {/* Subtítulo */}
            <p className="reveal delay-200 text-slate-300 text-lg mb-8 max-w-xl leading-relaxed border-l-2 border-brand-500/30 pl-6">
              Liberte-se da burocracia com tecnologia de ponta e o suporte de especialistas reais que entendem a sua jornada.
            </p>

            {/* Botões CTA */}
            <div className="reveal delay-300 flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="h-16 px-10 text-lg shadow-[0_10px_40px_-10px_rgba(14,165,233,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(14,165,233,0.7)]">
                Abra sua empresa grátis
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-10 text-lg border-white/10 text-white hover:bg-white/5 backdrop-blur-sm">
                Fale com um contador
              </Button>
            </div>

            {/* Prova Social (Avatares) */}
            <div className="reveal delay-400 flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm w-fit">
              <div className="flex -space-x-4">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
                ].map((src, i) => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-brand-950 object-cover" src={src} alt="Cliente MeiBiz" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-brand-950 bg-brand-800 flex items-center justify-center text-xs font-bold text-white">
                  +50k
                </div>
              </div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[1,2,3,4,5].map(i => <Users key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  <span className="text-white font-bold">50.000+</span> clientes satisfeitos
                </p>
              </div>
            </div>
          </div>

          {/* --- COLUNA 2: VISUAL HUMANIZADO + TECH --- */}
          <div className="relative reveal delay-200 hidden lg:block perspective-1000">
            {/* Main Image Container */}
            <div 
               className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-brand-900/50 transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700 ease-out"
               style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-transparent z-10 opacity-60"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" 
                alt="Equipa MeiBiz trabalhando" 
                className="w-full h-auto object-cover scale-110"
              />
            </div>

            {/* Card Flutuante 1: Segurança (Top Right) */}
            <div 
              className="absolute -top-12 -right-12 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.3)] reveal delay-500 z-20 flex items-center gap-4 max-w-[240px] animate-float"
              style={{ animationDelay: '0s' }}
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Status</p>
                <p className="text-base font-bold text-white leading-tight">100% Regular</p>
              </div>
            </div>

            {/* Card Flutuante 2: Atendimento (Bottom Left) */}
            <div 
              className="absolute -bottom-12 -left-12 p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.3)] reveal delay-700 z-20 flex items-center gap-4 max-w-[240px] animate-float"
              style={{ animationDelay: '2s' }}
            >
              <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                <CheckCircle2 className="text-white" size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Processos</p>
                <p className="text-base font-bold text-white leading-tight">Zero Burocracia</p>
              </div>
            </div>

            {/* Decorative Elements behind image */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
          </div>

        </div>
      </div>
    </section>
  );
};