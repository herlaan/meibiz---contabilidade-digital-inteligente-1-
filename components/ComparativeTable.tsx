import React, { useState } from 'react';
import { Check, Minus, MoveHorizontal, Building2, Wrench } from 'lucide-react';

type PlanCategory = 'comercio' | 'servico';

export const ComparativeTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlanCategory>('servico');

  const baseFeatures = [
    { name: "Abertura gratuita (plano anual)", std: true, multi: true, exp: true },
    { name: "Declaração Anual incluída", std: true, multi: true, exp: true },
    { name: "Organização de documentos em nuvem", std: true, multi: true, exp: true },
    { name: "Lembretes mensais automáticos", std: true, multi: true, exp: true },
    { name: "Suporte", std: "Básico", multi: "Prioritário", exp: "Completo" },
    { name: "Emissão de notas fiscais", std: false, multi: "Até 20/mês", exp: "Ilimitadas" },
    { name: "Controle fiscal básico e conferência", std: false, multi: true, exp: true },
    { name: "Relatório trimestral", std: false, multi: true, exp: true },
    { name: "Consultoria mensal (vídeo/telefone)", std: false, multi: false, exp: true },
    { name: "Planejamento tributário anual", std: false, multi: false, exp: true },
    { name: "Análise do limite MEI e projeção", std: false, multi: false, exp: true },
    { name: "Suporte para migração MEI → ME", std: false, multi: false, exp: true },
  ];

  // For now both tabs show the same features, but state is ready for divergence.
  const featuresData = {
    comercio: baseFeatures,
    servico: baseFeatures
  };

  const features = featuresData[activeTab];

  const renderCell = (value: boolean | string) => {
    if (typeof value === 'string') {
      return <span className="font-medium text-slate-700">{value}</span>;
    }
    return value ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />;
  };

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-medium text-slate-900 text-center mb-8">Compare os benefícios</h2>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-50 rounded-full p-1.5 shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('servico')}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'servico'
                  ? 'text-white bg-brand-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <Wrench size={16} />
              Serviço
            </button>
            <button
              onClick={() => setActiveTab('comercio')}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'comercio'
                  ? 'text-white bg-brand-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <Building2 size={16} />
              Comércio
            </button>
          </div>
        </div>

        {/* Mobile Hint - Visible only on small screens */}
        <div className="lg:hidden flex items-center justify-center gap-2 text-slate-400 text-sm mb-4 animate-pulse">
          <MoveHorizontal size={16} />
          <span>Arraste para comparar</span>
        </div>

        {/* Table Container */}
        <div className="relative">
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-[800px] border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-6 px-6 text-left text-slate-500 font-medium w-1/3">Recursos inclusos</th>
                    <th className="py-6 px-4 text-center font-medium text-slate-800 w-1/5">MEI START</th>
                    <th className="py-6 px-4 text-center font-medium text-brand-600 w-1/5 bg-brand-50">MEI ESSENCIAL</th>
                    <th className="py-6 px-4 text-center font-medium text-slate-800 w-1/5">MEI PREMIUM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {features.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 text-slate-700 text-sm font-medium">{item.name}</td>
                      <td className="py-4 px-4 text-center text-sm">{renderCell(item.std)}</td>
                      <td className="py-4 px-4 text-center text-sm bg-brand-50/30">{renderCell(item.multi)}</td>
                      <td className="py-4 px-4 text-center text-sm">{renderCell(item.exp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};