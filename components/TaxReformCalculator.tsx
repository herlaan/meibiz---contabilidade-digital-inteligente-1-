import React, { useState } from 'react';
import { Calculator, DollarSign, ArrowLeft, Percent, Scale, TrendingDown, BookOpen } from 'lucide-react';
import { Button } from './Button';

interface TaxReformCalculatorProps {
    onBack: () => void;
}

export const TaxReformCalculator: React.FC<TaxReformCalculatorProps> = ({ onBack }) => {
    const [revenue, setRevenue] = useState<string>('50000');
    const [regime, setRegime] = useState<'simples' | 'presumido'>('simples');

    const parsedRevenue = parseFloat(revenue.replace(/\./g, '').replace(',', '.')) || 0;

    // Basic estimation for context
    let currentTaxRate = 0;
    let futureTaxRate = 0;

    if (regime === 'simples') {
        currentTaxRate = 0.06; // Avg simple anexo III
        futureTaxRate = 0.06; // Simples doesn't change much initially, but they can opt
    } else {
        currentTaxRate = 0.1633; // Avg Presumido for services
        futureTaxRate = 0.265; // Estimated new CBS/IBS base rate
    }

    const currentTax = parsedRevenue * currentTaxRate;
    const futureTax = parsedRevenue * futureTaxRate;

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] -z-0 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-400/10 rounded-full blur-[100px] -z-0 opacity-30"></div>

            <div className="max-w-5xl mx-auto relative z-10">

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="reveal active">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Calculator size={14} />
                            Previsão Tributária
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                            Calculadora de <span className="text-brand-500">Reforma Tributária</span>
                        </h1>

                        <p className="text-slate-400 text-lg mb-10 max-w-lg">
                            Veja o impacto estimado da transição para a CBS (Contribuição sobre Bens e Serviços) e IBS (Imposto sobre Bens e Serviços) no seu negócio.
                        </p>

                        <div className="space-y-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <DollarSign size={18} className="text-brand-500" />
                                    Faturamento Mensal (R$)
                                </label>
                                <input
                                    type="number"
                                    value={revenue}
                                    onChange={(e) => setRevenue(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                    placeholder="Ex: 50000"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <Scale size={18} className="text-brand-500" />
                                    Regime Atual
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setRegime('simples')}
                                        className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${regime === 'simples'
                                                ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/20'
                                                : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
                                            }`}
                                    >
                                        Simples Nacional
                                    </button>
                                    <button
                                        onClick={() => setRegime('presumido')}
                                        className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${regime === 'presumido'
                                                ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/20'
                                                : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
                                            }`}
                                    >
                                        Lucro Presumido
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10">
                                <h4 className="flex items-center gap-2 text-slate-300 font-medium mb-2">
                                    <BookOpen size={16} /> Entendendo a Reforma
                                </h4>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Empresas do Simples Nacional terão a opção de manter o recolhimento unificado atual ou segregar a CBS/IBS para tomar crédito na cadeia produtiva.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="reveal active delay-200">
                        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-1 rounded-[2.5rem] shadow-2xl shadow-brand-500/20">
                            <div className="bg-slate-900 rounded-[2.3rem] p-8 sm:p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>

                                <h3 className="text-white text-xl font-bold mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                                        <TrendingDown size={24} />
                                    </div>
                                    Impacto Estimado
                                </h3>

                                <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/5 mb-6">
                                    <div className="flex justify-between items-center text-slate-300 mb-2">
                                        <span className="text-sm font-medium uppercase tracking-wide">Carga Atual Estimada</span>
                                        <span className="text-xs text-brand-400 border border-brand-500/20 bg-brand-900/20 px-2 py-0.5 rounded">{(currentTaxRate * 100).toFixed(2)}%</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">R$ {currentTax.toFixed(2)}</div>
                                    <div className="text-xs text-slate-500">Valor mensal baseado no perfil indicado</div>
                                </div>

                                <div className="p-6 bg-brand-600/10 rounded-2xl border border-brand-500/20 mb-8">
                                    <div className="flex justify-between items-center text-brand-300 mb-2">
                                        <span className="text-sm font-medium uppercase tracking-wide">Previsão Nova Carga</span>
                                        <span className="text-xs bg-brand-500 text-white px-2 py-0.5 rounded font-bold">{(futureTaxRate * 100).toFixed(2)}%</span>
                                    </div>
                                    <div className="text-3xl font-bold text-brand-400 mb-1">R$ {futureTax.toFixed(2)}</div>
                                    <div className="text-xs text-brand-500/70">A partir da transição (IVA Dual estimado)</div>
                                </div>

                                <div className="text-center bg-slate-800/80 rounded-xl p-4 border border-white/10 mb-8">
                                    <p className="text-sm text-slate-300">
                                        {regime === 'simples'
                                            ? "A MeiBiz fará as simulações detalhadas para definir se será vantajoso segregar os impostos no seu Simples Nacional para dar crédito aos seus clientes."
                                            : "O Lucro Presumido para serviços será fortemente impactado. A MeiBiz elaborará um planejamento tributário antes da transição para mitigar perdas."}
                                    </p>
                                </div>

                                <Button variant="primary" fullWidth size="lg" className="rounded-2xl py-6 text-lg font-bold shadow-xl shadow-brand-500/30">
                                    Planejamento com a MeiBiz
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
