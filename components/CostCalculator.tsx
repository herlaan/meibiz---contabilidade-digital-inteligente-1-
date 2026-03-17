import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, MapPin, Building, CreditCard, CheckCircle2, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { Button } from './Button';

type StateFee = {
    uf: string;
    name: string;
    juntaFee: number;
};

const stateFees: StateFee[] = [
    { uf: 'SP', name: 'São Paulo', juntaFee: 312 },
    { uf: 'RJ', name: 'Rio de Janeiro', juntaFee: 457 },
    { uf: 'MG', name: 'Minas Gerais', juntaFee: 388 },
    { uf: 'PR', name: 'Paraná', juntaFee: 295 },
    { uf: 'RS', name: 'Rio Grande do Sul', juntaFee: 340 },
    { uf: 'SC', name: 'Santa Catarina', juntaFee: 280 },
    { uf: 'BA', name: 'Bahia', juntaFee: 310 },
    { uf: 'DF', name: 'Distrito Federal', juntaFee: 365 },
].sort((a, b) => a.name.localeCompare(b.name));

const otherUFs = [
    'AC', 'AL', 'AP', 'AM', 'CE', 'ES', 'GO', 'MA', 'MT', 'MS', 'PA', 'PB', 'PI', 'RN', 'RO', 'RR', 'SE', 'TO'
].map(uf => ({ uf, name: uf, juntaFee: 350 }));

const allStates = [...stateFees, ...otherUFs].sort((a, b) => a.name.localeCompare(b.name));

export const CostCalculator: React.FC = () => {
    const navigate = useNavigate();
    const [selectedUF, setSelectedUF] = useState<string>('SP');
    const [companyType, setCompanyType] = useState<'ME' | 'EPP'>('ME');
    const [hasDigitalCert, setHasDigitalCert] = useState<boolean>(false);

    const currentJuntaFee = allStates.find(s => s.uf === selectedUF)?.juntaFee || 350;
    const digitalCertCost = hasDigitalCert ? 0 : 220;
    const municipalFee = 180;
    const totalCost = currentJuntaFee + digitalCertCost + municipalFee;

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] -z-0 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-400/10 rounded-full blur-[100px] -z-0 opacity-30"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">Voltar para a Home</span>
                </button>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Form Side */}
                    <div className="reveal active">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Calculator size={14} />
                            Simulador de Abertura
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                            Quanto custa abrir o seu <span className="text-brand-500">CNPJ?</span>
                        </h1>

                        <p className="text-slate-400 text-lg mb-10 max-w-lg">
                            Os custos variam conforme o seu estado e o tipo de empresa. Simule agora e descubra como a MeiBiz economiza seu dinheiro.
                        </p>

                        <div className="space-y-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            {/* UF Selection */}
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <MapPin size={18} className="text-brand-500" />
                                    Estado da Sede
                                </label>
                                <select
                                    value={selectedUF}
                                    onChange={(e) => setSelectedUF(e.target.value)}
                                    title="Selecione o Estado"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all cursor-pointer"
                                >
                                    {allStates.map(state => (
                                        <option key={state.uf} value={state.uf}>{state.name} ({state.uf})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Company Type */}
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <Building size={18} className="text-brand-500" />
                                    Porte da Empresa
                                    <div className="group relative">
                                        <HelpCircle size={14} className="text-slate-500 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-xs text-slate-300 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                                            ME (Microempresa) fatura até R$ 360 mil/ano. EPP fatura até R$ 4,8 milhões/ano.
                                        </div>
                                    </div>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setCompanyType('ME')}
                                        className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${companyType === 'ME'
                                            ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/20'
                                            : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
                                            }`}
                                    >
                                        ME (Microempresa)
                                    </button>
                                    <button
                                        onClick={() => setCompanyType('EPP')}
                                        className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${companyType === 'EPP'
                                            ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/20'
                                            : 'bg-slate-900/50 border-white/10 text-slate-400 hover:border-white/20'
                                            }`}
                                    >
                                        EPP (Pequeno Porte)
                                    </button>
                                </div>
                            </div>

                            {/* Digital Cert Toggle */}
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-4">
                                    <CreditCard size={18} className="text-brand-500" />
                                    Já possui Certificado Digital e-CPF?
                                </label>
                                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                                    <button
                                        onClick={() => setHasDigitalCert(true)}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${hasDigitalCert ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        Sim
                                    </button>
                                    <button
                                        onClick={() => setHasDigitalCert(false)}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${!hasDigitalCert ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        Não
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Side */}
                    <div className="reveal active delay-200">
                        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-1 rounded-[2.5rem] shadow-2xl shadow-brand-500/20 sticky top-32">
                            <div className="bg-slate-900 rounded-[2.3rem] p-8 sm:p-10 relative overflow-hidden">
                                {/* Decorative Pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>

                                <h3 className="text-white text-xl font-bold mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    Resumo do Investimento
                                </h3>

                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between items-center text-slate-300 group">
                                        <span className="flex items-center gap-2">
                                            Taxa da Junta Comercial ({selectedUF})
                                            <Info size={14} className="text-slate-600 group-hover:text-slate-400" />
                                        </span>
                                        <span className="font-bold text-white">R$ {currentJuntaFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-slate-300 group">
                                        <span className="flex items-center gap-2">
                                            Certificado Digital e-CPF
                                            <Info size={14} className="text-slate-600 group-hover:text-slate-400" />
                                        </span>
                                        <span className="font-bold text-white">R$ {digitalCertCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-slate-300 group">
                                        <span className="flex items-center gap-2">
                                            Alvarás e Taxas Municipais (est.)
                                            <Info size={14} className="text-slate-600 group-hover:text-slate-400" />
                                        </span>
                                        <span className="font-bold text-white">R$ {municipalFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-brand-400 font-bold">Honorários MeiBiz</span>
                                        <span className="text-green-400 font-bold text-lg">GRÁTIS*</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
                                    <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2 text-center">Total Estimado</div>
                                    <div className="text-5xl font-bold text-white text-center">
                                        <span className="text-2xl font-medium text-slate-500 mr-2 uppercase">R$</span>
                                        {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>

                                <Button variant="primary" fullWidth size="lg" className="rounded-2xl py-6 text-lg font-bold shadow-xl shadow-brand-500/30">
                                    Abra sua empresa agora
                                </Button>

                                <p className="text-center text-slate-500 text-xs mt-6">
                                    *A gratuidade nos honorários é válida mediante a contratação do plano de contabilidade anual. Taxas do governo não inclusas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
