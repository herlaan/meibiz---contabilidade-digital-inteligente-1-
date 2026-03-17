import React, { useState } from 'react';
import { Calculator, Briefcase, Building2, CheckCircle2, ArrowLeft, Info, HelpCircle, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from './Button';

interface PjCltCalculatorProps {
    onBack: () => void;
}

export const PjCltCalculator: React.FC<PjCltCalculatorProps> = ({ onBack }) => {
    const [cltSalary, setCltSalary] = useState<string>('5000');

    const parsedSalary = parseFloat(cltSalary.replace(/\./g, '').replace(',', '.')) || 0;

    // Simplified CLT deductions
    const inssClt = parsedSalary * 0.11; // avg estimate
    const irrfClt = Math.max(0, (parsedSalary - inssClt - 2259.20) * 0.275 - 884.96); // Basic IRRF calc
    const netClt = parsedSalary - inssClt - irrfClt;

    // Simplified PJ estimates (assuming same net or same gross, let's compare same gross cost to company vs what PJ would get if they invoiced that gross + FGTS/INSS costs)
    // Let's just compare if the professional invoices 1.5x their CLT salary as PJ
    const pjInvoice = parsedSalary * 1.5;
    const pjTax = pjInvoice * 0.06; // Simples Nacional Anexo III (start)
    const pjAccounting = 149; // MeiBiz base cost
    const netPj = pjInvoice - pjTax - pjAccounting;

    const increase = netPj - netClt;

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] -z-0 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-400/10 rounded-full blur-[100px] -z-0 opacity-30"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">Voltar para a Home</span>
                </button>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="reveal active">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Calculator size={14} />
                            Simulador de Ganhos
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                            Calculadora <span className="text-brand-500">PJ x CLT</span>
                        </h1>

                        <p className="text-slate-400 text-lg mb-10 max-w-lg">
                            Descubra o quanto você poderia ganhar a mais trabalhando como Pessoa Jurídica (PJ) em comparação ao regime CLT.
                        </p>

                        <div className="space-y-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <DollarSign size={18} className="text-brand-500" />
                                    Seu Salário CLT Bruto Atual (R$)
                                </label>
                                <input
                                    type="number"
                                    value={cltSalary}
                                    onChange={(e) => setCltSalary(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                    placeholder="Ex: 5000"
                                />
                            </div>

                            <div className="bg-brand-900/20 p-4 rounded-xl border border-brand-500/20">
                                <div className="flex gap-3 text-brand-400">
                                    <Info size={20} className="shrink-0" />
                                    <p className="text-sm leading-relaxed">
                                        Nossa estimativa considera que como PJ você poderia cobrar cerca de 50% a mais do que seu salário bruto CLT, compensando benefícios, e pagando impostos reduzidos via Simples Nacional.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="reveal active delay-200">
                        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-1 rounded-[2.5rem] shadow-2xl shadow-brand-500/20">
                            <div className="bg-slate-900 rounded-[2.3rem] p-8 sm:p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>

                                <h3 className="text-white text-xl font-bold mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                                        <TrendingUp size={24} />
                                    </div>
                                    Comparativo Estimado
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-2">
                                            <Briefcase size={16} /> CLT
                                        </div>
                                        <div className="text-lg font-bold text-white">R$ {netClt.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div className="text-xs text-slate-500 mt-1">Líquido estimado</div>
                                    </div>

                                    <div className="bg-brand-600/10 p-4 rounded-2xl border border-brand-500/20">
                                        <div className="flex items-center gap-2 text-brand-400 text-sm font-medium mb-2">
                                            <Building2 size={16} /> PJ (Faturamento: R$ {pjInvoice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                        </div>
                                        <div className="text-lg font-bold text-white">R$ {netPj.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div className="text-xs text-brand-500 mt-1">Líquido estimado (Anexo III)</div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8 text-center">
                                    <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Sua vantagem como PJ</div>
                                    <div className="text-4xl font-bold text-green-400 flex items-center justify-center gap-2">
                                        + R$ {increase.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-2">por mês no seu bolso</div>
                                </div>

                                <Button variant="primary" fullWidth size="lg" className="rounded-2xl py-6 text-lg font-bold shadow-xl shadow-brand-500/30">
                                    Quero ser PJ agora
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
