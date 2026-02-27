import React from 'react';
import { X, Check } from 'lucide-react';

export const Comparison: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Por que escolher a MeiBiz?</h2>
          <p className="text-lg text-slate-600">Veja a diferença entre viver no passado e evoluir com a MeiBiz.</p>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-xl bg-white border border-slate-200">
          <div className="grid grid-cols-3 bg-slate-900 text-white py-6 px-4 sm:px-8 text-center font-bold text-sm sm:text-lg">
            <div className="text-left">Comparativo</div>
            <div className="opacity-70">Contabilidade Tradicional</div>
            <div className="text-brand-400">MeiBiz Digital</div>
          </div>

          {[
            { label: "Abertura de Empresa", old: "Custo alto e demorado", new: "Grátis e 100% Online" },
            { label: "Mensalidade", old: "A partir de meio salário mínimo", new: "A partir de R$ 89/mês" },
            { label: "Atendimento", old: "Presencial ou telefone (horário comercial)", new: "Chat estendido e WhatsApp" },
            { label: "Emissão de Notas", old: "Sistema da prefeitura (difícil)", new: "Emissor Próprio Simplificado" },
            { label: "Entrega de Documentos", old: "Malote ou E-mail", new: "Plataforma Automatizada" },
            { label: "Controle Financeiro", old: "Planilhas manuais", new: "Integrado na plataforma" },
          ].map((row, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-3 py-6 px-4 sm:px-8 items-center text-center ${
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
              }`}
            >
              <div className="text-left font-semibold text-slate-700 text-sm sm:text-base">{row.label}</div>
              <div className="text-red-500 font-medium text-sm sm:text-base flex justify-center items-center gap-2">
                <span className="hidden sm:inline"><X size={16} /></span>
                {row.old}
              </div>
              <div className="text-emerald-600 font-bold text-sm sm:text-base flex justify-center items-center gap-2 bg-emerald-50 py-1 px-2 rounded-full mx-auto w-fit">
                <Check size={16} />
                {row.new}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};