import React, { useState } from 'react';
import { Calculator, DollarSign, ArrowLeft, PiggyBank, Receipt, LayoutDashboard } from 'lucide-react';
import { Button } from './Button';

interface RpaCalculatorProps {
    onBack: () => void;
}

export const RpaCalculator: React.FC<RpaCalculatorProps> = ({ onBack }) => {
    const [grossValue, setGrossValue] = useState<string>('3000');

    const parsedGross = parseFloat(grossValue.replace(/\./g, '').replace(',', '.')) || 0;

    // Simplified RPA deductions
    const inssRate = 0.11; // Basic INSS for autonomous
    const INSS = parsedGross * inssRate;

    // Basic IRRF calculation (simplified brackets)
    const baseIrrf = parsedGross - INSS;
    let IRRF = 0;
    if (baseIrrf > 4664.68) {
        IRRF = baseIrrf * 0.275 - 884.96;
    } else if (baseIrrf > 3751.06) {
        IRRF = baseIrrf * 0.225 - 651.73;
    } else if (baseIrrf > 2826.66) {
        IRRF = baseIrrf * 0.15 - 370.40;
    } else if (baseIrrf > 2259.20) {
        IRRF = baseIrrf * 0.075 - 158.40;
    }

    const ISS = parsedGross * 0.05; // Average ISS rate
    const netValue = parsedGross - INSS - IRRF - ISS;

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] -z-0 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-400/10 rounded-full blur-[100px] -z-0 opacity-30"></div>

            <div className="max-w-5xl mx-auto relative z-10">

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="reveal active">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Calculator size={14} />
                            Simulador Autônomo
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                            Calculadora de <span className="text-brand-500">RPA</span>
                        </h1>

                        <p className="text-slate-400 text-lg mb-10 max-w-lg">
                            Veja o quanto você perde recebendo por Recibo de Pagamento Autônomo em comparação com a abertura de um CNPJ.
                        </p>

                        <div className="space-y-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <DollarSign size={18} className="text-brand-500" />
                                    Valor Bruto do Serviço (R$)
                                </label>
                                <input
                                    type="number"
                                    value={grossValue}
                                    onChange={(e) => setGrossValue(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                    placeholder="Ex: 3000"
                                />
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10">
                                <h4 className="flex items-center gap-2 text-slate-300 font-medium mb-4">
                                    <Receipt size={16} /> Descontos Previstos
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>INSS (11%)</span>
                                        <span className="text-white">R$ {INSS.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>IRRF</span>
                                        <span className="text-white">R$ {Math.max(0, IRRF).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>ISS (Estimado 5%)</span>
                                        <span className="text-white">R$ {ISS.toFixed(2)}</span>
                                    </div>
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
                                        <PiggyBank size={24} />
                                    </div>
                                    Seu Recebimento Líquido
                                </h3>

                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8 text-center flex flex-col gap-2">
                                    <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Valor Líquido Recebido no RPA</div>
                                    <div className="text-5xl font-bold text-red-400">R$ {netValue.toFixed(2)}</div>
                                    <div className="text-xs text-slate-500 mt-2">Os descontos podem chegar a mais de 30% do valor do serviço.</div>
                                </div>

                                <div className="bg-brand-600/10 p-6 rounded-2xl border border-brand-500/20 mb-8 flex flex-col items-center">
                                    <div className="text-brand-400 text-sm font-medium mb-2 uppercase tracking-wide">Com um CNPJ MeiBiz</div>
                                    <div className="text-slate-300 text-center mb-4">Você poderia emitir nota via Simples Nacional pagando a partir de 6% ou como MEI pagando valor fixo reduzido.</div>
                                    <div className="text-xl font-bold text-white">Líquido estimado: R$ {(parsedGross - (parsedGross * 0.06)).toFixed(2)}</div>
                                </div>

                                <Button variant="primary" fullWidth size="lg" className="rounded-2xl py-6 text-lg font-bold shadow-xl shadow-brand-500/30">
                                    Abra seu CNPJ Agora
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
