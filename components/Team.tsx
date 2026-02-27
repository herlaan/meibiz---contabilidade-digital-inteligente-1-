import React from 'react';

export const Team: React.FC = () => {
  const members = [
    { 
      name: "Mariana Silva", 
      role: "Contadora Sênior", 
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" 
    },
    { 
      name: "Ricardo Santos", 
      role: "Especialista em MEI", 
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" 
    },
    { 
      name: "Beatriz Costa", 
      role: "Consultora Tributária", 
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop" 
    },
    // Duplicate for loop if needed, but we handle duplication in the render for infinite effect
    { 
      name: "Felipe Gomes", 
      role: "Atendimento", 
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop" 
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4">Gente real cuidando da sua empresa</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto hidden lg:block">
            Por trás da nossa tecnologia, existe um time de especialistas prontos para tomar as decisões complexas pelo seu negócio.
          </p>
        </div>

        {/* Mobile: Infinite Marquee | Desktop: Grid */}
        <div className="lg:hidden relative w-full overflow-hidden">
           {/* Gradients removed as requested */}
           
           <div className="flex gap-4 animate-marquee pause-on-hover w-max">
              {[...members, ...members, ...members].map((member, idx) => (
                <div 
                    key={`mobile-${idx}`} 
                    className="w-[280px] flex-shrink-0 group cursor-default"
                >
                  <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] mb-6 shadow-md border border-slate-100">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-sm font-medium bg-brand-600/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block shadow-sm">CRC Ativo</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-slate-900">{member.name}</h3>
                    <p className="text-brand-600 font-medium">{member.role}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid md:grid-cols-4 gap-8">
          {members.map((member, idx) => (
            <div 
                key={idx} 
                className="reveal-scale group cursor-default" 
                style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] mb-6 shadow-md group-hover:shadow-xl transition-all duration-500 border border-slate-100">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <p className="text-sm font-medium bg-brand-600/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block shadow-sm">CRC Ativo</p>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-medium text-slate-900">{member.name}</h3>
                <p className="text-brand-600 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};