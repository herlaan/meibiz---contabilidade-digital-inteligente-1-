import React, { useState } from 'react';
import { Calculator, DollarSign, Users, Briefcase, Activity, CheckCircle2, ArrowLeft, Info, PieChart } from 'lucide-react';
import { Button } from './Button';

interface FactorRCalculatorProps {
    onBack: () => void;
}

export const FactorRCalculator: React.FC<FactorRCalculatorProps> = ({ onBack }) => {
    const [revenue, setRevenue] = useState<string>('15000');
    const [payroll, setPayroll] = useState<string>('4200'); // Fator R = 28% -> anexo III

    const parsedRevenue = parseFloat(revenue.replace(/\./g, '').replace(',', '.')) || 0;
    const parsedPayroll = parseFloat(payroll.replace(/\./g, '').replace(',', '.')) || 0;

    const factorR = parsedRevenue > 0 ? (parsedPayroll / parsedRevenue) * 100 : 0;

    // Anexo III se >= 28%, senão Anexo V (para atividades sujeitas ao Fator R)
    const isAnexoIII = factorR >= 28;
    const taxRate = isAnexoIII ? '6.0%' : '15.5%';
    const taxAmount = parsedRevenue * (isAnexoIII ? 0.06 : 0.155);

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] -z-0 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-400/10 rounded-full blur-[100px] -z-0 opacity-30"></div>

            <div className="max-w-5xl mx-auto relative z-10">

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="reveal active">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Calculator size={14} />
                            Simulador Tributário
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                            Calculadora de <span className="text-brand-500">Fator R</span>
                        </h1>

                        <p className="text-slate-400 text-lg mb-10 max-w-lg">
                            Descubra em qual anexo do Simples Nacional sua empresa se enquadra (III ou V) e o impacto nos seus impostos.
                        </p>

                        <div className="space-y-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <DollarSign size={18} className="text-brand-500" />
                                    Faturamento Bruto Últimos 12 Meses (R$)
                                </label>
                                <input
                                    type="number"
                                    value={revenue}
                                    onChange={(e) => setRevenue(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <Users size={18} className="text-brand-500" />
                                    Folha de Pagamento Últimos 12 Meses (R$)
                                </label>
                                <input
                                    type="number"
                                    value={payroll}
                                    onChange={(e) => setPayroll(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-2 ml-1">
                                    Inclua FGTS, Pro Labore e salários.
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
                                        <PieChart size={24} />
                                    </div>
                                    Seu Fator R
                                </h3>

                                <div className="flex justify-center mb-8">
                                    <div className={`w-40 h-40 rounded-full border-[12px] flex items-center justify-center relative ${isAnexoIII ? 'border-green-500' : 'border-red-500'}`}>
                                        <div className="absolute inset-0 rounded-full blur-[20px] opacity-30 bg-current"></div>
                                        <div className="text-center z-10">
                                            <div className="text-4xl font-bold text-white">{factorR.toFixed(1)}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-6 mb-8 text-center">
                                    <div className="text-slate-400 text-sm font-medium mb-2">Você se enquadra no</div>
                                    <div className={`text-2xl font-bold uppercase ${isAnexoIII ? 'text-green-400' : 'text-red-400'}`}>
                                        Anexo {isAnexoIII ? 'III' : 'V'} ({taxRate} impostos)
                                    </div>
                                    <div className="text-slate-500 text-sm mt-2">
                                        {isAnexoIII ? 'Parabéns! Sua folha é suficiente para você pagar menos imposto.' : 'Atenção: Sua folha deve atingir 28% para reduzir seus impostos.'}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/10 mb-8">
                                    <span className="text-slate-400">Imposto Estimado Mês</span>
                                    <span className="text-xl font-bold text-white uppercase">R$ {taxAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>

                                <Button variant="primary" fullWidth size="lg" className="rounded-2xl py-6 text-lg font-bold shadow-xl shadow-brand-500/30">
                                    Fale com Especialista MeiBiz
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
