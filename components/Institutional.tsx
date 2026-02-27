import React from 'react';
import { Users, MapPin, Award, TrendingUp, ShieldCheck } from 'lucide-react';

export const Institutional: React.FC = () => {
  const stats = [
    {
      value: "50k+",
      label: "Empreendedores",
      sub: "Confiam na MeiBiz",
      icon: <Users className="w-6 h-6 text-brand-400" />,
      delay: "100"
    },
    {
      value: "100+",
      label: "Especialistas",
      sub: "Contadores Reais",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      delay: "200"
    },
    {
      value: "1.200",
      label: "Cidades",
      sub: "Em todo o Brasil",
      icon: <MapPin className="w-6 h-6 text-amber-400" />,
      delay: "300"
    },
    {
      value: "98%",
      label: "Satisfação",
      sub: "Avaliação 5 Estrelas",
      icon: <Award className="w-6 h-6 text-pink-400" />,
      delay: "400"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-brand-950 text-white relative overflow-hidden">
      {/* 1. Tech Divider & Glows */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
      
      {/* Background Texture (Dot Grid) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Imagem Humanizada (Bastidores) - HIDDEN ON MOBILE */}
        <div className="hidden lg:block relative rounded-[2.5rem] overflow-hidden h-96 mb-20 reveal shadow-2xl border border-white/10 group ring-1 ring-white/5">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" 
              alt="Contador analisando dados financeiros" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/50 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-1 bg-brand-500 rounded-full mb-6"></div>
                <p className="text-white font-medium text-4xl italic max-w-4xl leading-relaxed drop-shadow-lg">
                    "Nossa missão não é apenas calcular impostos, é ver o seu negócio prosperar com segurança."
                </p>
            </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          {/* Texto Institucional (2 colunas) */}
          <div className="lg:col-span-2 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-700 bg-brand-900/50 backdrop-blur-sm mb-6">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
               </span>
               <span className="text-xs font-medium text-brand-200 uppercase tracking-wide">Transparência Total</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-medium mb-6 leading-tight">
              Contabilidade séria com <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-white">tecnologia de ponta</span>
            </h2>
            
            <p className="text-slate-400 leading-relaxed mb-8 text-lg">
              A MeiBiz nasceu para democratizar o acesso a serviços contábeis de alta qualidade.
            </p>

            <ul className="space-y-4 text-slate-300">
               <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-900 flex items-center justify-center border border-brand-700">
                    <ShieldCheck size={14} className="text-brand-400" />
                  </div>
                  <span>Segurança de dados bancária</span>
               </li>
               <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-900 flex items-center justify-center border border-brand-700">
                    <TrendingUp size={14} className="text-brand-400" />
                  </div>
                  <span>Auditoria fiscal contínua</span>
               </li>
            </ul>
          </div>
          
          {/* Grid de Estatísticas (3 colunas) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-3 lg:gap-4 reveal delay-200">
             {stats.map((stat, idx) => (
               <div 
                 key={idx}
                 className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-5 lg:p-6 rounded-2xl hover:bg-white/10 hover:border-brand-500/30 transition-all duration-300"
               >
                  
                  <div className="relative flex items-start justify-between mb-3 lg:mb-4">
                     <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors">
                        {stat.icon}
                     </div>
                  </div>
                  
                  <div className="relative">
                    <p className="text-2xl lg:text-5xl font-medium text-white mb-1 lg:mb-2 tracking-tight">
                        {stat.value}
                    </p>
                    <p className="text-brand-100 font-medium text-xs lg:text-sm uppercase tracking-wider mb-1">
                        {stat.label}
                    </p>
                    <p className="text-slate-500 text-[10px] lg:text-xs">
                        {stat.sub}
                    </p>
                  </div>
               </div>
             ))}
          </div>

        </div>
      </div>
    </section>
  );
}