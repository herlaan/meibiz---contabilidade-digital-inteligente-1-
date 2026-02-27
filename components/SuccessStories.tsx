import React from 'react';
import { Button } from './Button';
import { ArrowRight, Quote } from 'lucide-react';

export const SuccessStories: React.FC = () => {
  return (
    <section className="py-24 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            
            {/* Image Side */}
            <div className="relative h-96 lg:h-auto min-h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop" 
                alt="Empreendedora em seu escritório" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            </div>

            {/* Content Side */}
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-8">
                <Quote size={24} fill="currentColor" className="opacity-80" />
              </div>
              
              <h2 className="text-3xl font-medium text-slate-900 mb-6 leading-tight">
                "A MeiBiz me devolveu 10 horas por mês. Agora eu foco em criar, não em planilhas."
              </h2>
              
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Ana Clara, fundadora de um estúdio de design, sofria com guias atrasadas e burocracia. Com a migração gratuita, ela regularizou a empresa em 48h e reduziu seus custos fixos em 40%.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex items-center gap-4">
                    <img 
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=150&auto=format&fit=crop" 
                        alt="Avatar Ana" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div>
                        <p className="text-slate-900 font-medium">Ana Clara</p>
                        <p className="text-slate-400 text-sm">CEO, Studio Clara</p>
                    </div>
                </div>
                
                <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                
                <Button variant="ghost" className="text-brand-600 hover:text-brand-700 p-0 hover:bg-transparent font-medium">
                    Ler história completa <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};