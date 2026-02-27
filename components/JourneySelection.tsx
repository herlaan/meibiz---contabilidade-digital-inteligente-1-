import React from 'react';
import { ArrowRight, Store, RefreshCw } from 'lucide-react';

export const JourneySelection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-medium text-center mb-12">Já tem empresa ou vai começar?</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <a href="#" className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:border-brand-400 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-brand-500/30">
              <Store size={32} />
            </div>
            <h3 className="text-2xl font-medium mb-3 group-hover:text-brand-400 transition-colors">Abrir empresa grátis</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
                Tire sua ideia do papel sem custos de abertura. Nós cuidamos de toda a burocracia para você focar no negócio.
            </p>
            <div className="flex items-center text-white font-medium group-hover:gap-3 transition-all">
                Começar agora <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </a>

          {/* Card 2 */}
          <a href="#" className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:border-blue-400 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-500/30">
              <RefreshCw size={32} />
            </div>
            <h3 className="text-2xl font-medium mb-3 group-hover:text-blue-400 transition-colors">Trocar de contador</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
                Traga sua empresa para a MeiBiz. Migração gratuita, segura e sem dores de cabeça.
            </p>
            <div className="flex items-center text-white font-medium group-hover:gap-3 transition-all">
                Fazer migração <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};