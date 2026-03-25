import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, User, Building2, MapPin, Send, AlertCircle } from 'lucide-react';

interface OpenMeiFreeProps {
    onBack: () => void;
}

interface FormData {
    // Passo 1
    nome: string;
    cpf: string;
    nascimento: string;
    email: string;
    telefone: string;
    // Passo 2
    rg: string;
    tituloEleitor: string;
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    // Passo 3
    nomeFantasia: string;
    atividade: string;
    capital: string;
}

export const OpenMeiFree: React.FC<OpenMeiFreeProps> = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        nome: '', cpf: '', nascimento: '', email: '', telefone: '',
        rg: '', tituloEleitor: '', cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
        nomeFantasia: '', atividade: '', capital: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]); // Sobe para o topo ao mudar de passo

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.nome || !formData.cpf || !formData.nascimento || !formData.email || !formData.telefone) {
                alert("Por favor, preencha todos os campos obrigatórios antes de avançar.");
                return;
            }
        } else if (step === 2) {
            if (!formData.rg || !formData.cep || !formData.rua || !formData.numero || !formData.bairro || !formData.cidade || !formData.estado) {
                alert("Por favor, preencha todos os campos obrigatórios antes de avançar.");
                return;
            }
        }
        setStep(s => Math.min(s + 1, 3));
    };
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const phone = "5575988927727";
        const message = `Olá equipe MeiBiz! Quero realizar a abertura gratuita do meu MEI. Seguem meus dados para análise:

📝 *DADOS PESSOAIS*
*Nome:* ${formData.nome}
*CPF:* ${formData.cpf}
*Nascimento:* ${formData.nascimento}
*Email:* ${formData.email}
*Telefone:* ${formData.telefone}

🏠 *DOCUMENTOS E ENDEREÇO*
*RG:* ${formData.rg}
*Título de Eleitor:* ${formData.tituloEleitor || 'Não informado'}
*CEP:* ${formData.cep}
*Endereço:* ${formData.rua}, ${formData.numero} ${formData.complemento ? ' - ' + formData.complemento : ''}
*Bairro/Cidade:* ${formData.bairro} - ${formData.cidade}/${formData.estado}

💼 *SOBRE O NEGÓCIO*
*Nome Fantasia:* ${formData.nomeFantasia || 'Apenas meu nome'}
*Atividade Principal:* ${formData.atividade}
*Capital Social (Investimento):* R$ ${formData.capital}

Aguardo o retorno do contador para prosseguir!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

        // Simula carregamento
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            setIsSubmitting(false);
            // Poderia redirecionar para uma página de Obrigado aqui
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 font-sans text-slate-900 selection:bg-brand-500 selection:text-white">
            {/* Header / Hero reduzido */}
            <div className="bg-slate-950 pt-8 pb-16 lg:pt-12 lg:pb-24 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group w-fit"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/5">
                            <ArrowLeft size={16} />
                        </div>
                        <span className="text-sm font-medium">Voltar para a Home</span>
                    </button>

                    <div className="text-center reveal active">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-4">
                            <CheckCircle2 size={16} />
                            Serviço 100% Gratuito
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-4 tracking-tight">
                            Abertura de MEI Rápida
                        </h1>
                        <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
                            Preencha os dados abaixo e entraremos em contato via WhatsApp com tudo preparado para abrir o seu CNPJ.
                        </p>
                    </div>
                </div>
            </div>

            {/* Formulário Principal */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 -mt-8 sm:-mt-12">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 reveal active">

                    {/* Stepper Header */}
                    <div className="flex items-center justify-between mb-8 sm:mb-12 relative">
                        {/* Linha de progresso no fundo */}
                        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
                        <div
                            className="absolute left-0 top-1/2 h-1 bg-brand-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        ></div>

                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-medium transition-colors ${step >= 1 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                                <User size={20} />
                            </div>
                            <span className={`text-[10px] sm:text-xs font-medium uppercase tracking-wide ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>Pessoal</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-medium transition-colors ${step >= 2 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-50 border-2 border-slate-200 text-slate-400'}`}>
                                <MapPin size={20} />
                            </div>
                            <span className={`text-[10px] sm:text-xs font-medium uppercase tracking-wide ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>Endereço</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-medium transition-colors ${step >= 3 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-50 border-2 border-slate-200 text-slate-400'}`}>
                                <Building2 size={20} />
                            </div>
                            <span className={`text-[10px] sm:text-xs font-medium uppercase tracking-wide ${step >= 3 ? 'text-brand-600' : 'text-slate-400'}`}>Negócio</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* PASSO 1 */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="mb-6 border-l-4 border-brand-500 pl-4 py-1">
                                    <h3 className="text-xl font-medium text-slate-900">1. Dados Pessoais</h3>
                                    <p className="text-sm text-slate-500 mt-1">Informações do titular do CNPJ.</p>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="sm:col-span-2 lg:col-span-3 space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Nome Completo *</label>
                                        <input required name="nome" value={formData.nome} onChange={handleChange} type="text" placeholder="Como no RG/CNH" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">CPF *</label>
                                        <input required name="cpf" value={formData.cpf} onChange={handleChange} type="text" placeholder="000.000.000-00" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Data de Nascimento *</label>
                                        <input required name="nascimento" value={formData.nascimento} onChange={handleChange} type="date" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 lg:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">E-mail *</label>
                                        <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="seu@email.com" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Celular / WhatsApp *</label>
                                        <input required name="telefone" value={formData.telefone} onChange={handleChange} type="tel" placeholder="(00) 00000-0000" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASSO 2 */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="mb-6 border-l-4 border-brand-500 pl-4 py-1 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-medium text-slate-900">2. Documentos e Endereço</h3>
                                        <p className="text-sm text-slate-500 mt-1">Necessários para registrar o CNPJ e Alvará.</p>
                                    </div>
                                </div>

                                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex items-start gap-3 mb-6">
                                    <AlertCircle className="text-sky-500 shrink-0 mt-0.5" size={18} />
                                    <p className="text-sm text-sky-700 leading-relaxed font-medium">
                                        O título de eleitor é exigido pela Receita Federal para validar se você declara Imposto de Renda. O endereço cadastrado será o local fiscal da empresa.
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <div className="space-y-1 lg:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Número do RG *</label>
                                        <input required name="rg" value={formData.rg} onChange={handleChange} type="text" placeholder="Sem pontos ou traços" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 lg:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Título de Eleitor</label>
                                        <input name="tituloEleitor" value={formData.tituloEleitor} onChange={handleChange} type="text" placeholder="Apenas números" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>

                                    <div className="col-span-2 lg:col-span-4 pt-4 border-t border-slate-100 mt-2">
                                        <h4 className="font-medium text-slate-800 mb-4">Endereço da Empresa (ou Residencial)</h4>
                                    </div>

                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">CEP *</label>
                                        <input required name="cep" value={formData.cep} onChange={handleChange} type="text" placeholder="00000-000" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2 lg:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Rua / Avenida *</label>
                                        <input required name="rua" value={formData.rua} onChange={handleChange} type="text" placeholder="Av. Paulista..." className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Número *</label>
                                        <input required name="numero" value={formData.numero} onChange={handleChange} type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Complemento <span className="text-slate-400 font-normal">(Opcional)</span></label>
                                        <input name="complemento" value={formData.complemento} onChange={handleChange} type="text" placeholder="Apto, Sala..." className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Bairro *</label>
                                        <input required name="bairro" value={formData.bairro} onChange={handleChange} type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Cidade *</label>
                                        <input required name="cidade" value={formData.cidade} onChange={handleChange} type="text" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Estado UF *</label>
                                        <input required name="estado" value={formData.estado} onChange={handleChange} type="text" placeholder="SP" maxLength={2} className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all uppercase" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASSO 3 */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="mb-6 border-l-4 border-brand-500 pl-4 py-1">
                                    <h3 className="text-xl font-medium text-slate-900">3. Seu Novo Negócio</h3>
                                    <p className="text-sm text-slate-500 mt-1">Como vamos registrar seu novo CNPJ.</p>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Nome Fantasia <span className="text-slate-400 font-normal">(Opcional)</span></label>
                                        <input name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} type="text" placeholder="Nome como a empresa será conhecida" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                        <p className="text-[11px] text-slate-500">A Razão Social obrigatoriamente será seu Nome + CPF.</p>
                                    </div>

                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Atividade Principal *</label>
                                        <input required name="atividade" value={formData.atividade} onChange={handleChange} type="text" placeholder="Ex: Venda de roupas online, Programador..." className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                        <p className="text-[11px] text-slate-500">O contador escolherá o CNAE mais adequado.</p>
                                    </div>

                                    <div className="space-y-1 lg:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Capital Social (R$) *</label>
                                        <input required name="capital" value={formData.capital} onChange={handleChange} type="text" placeholder="Ex: 1.000,00" className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                                        <p className="text-[11px] text-slate-500">Qualquer valor simbólico. Ex: R$ 500,00.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Controles do Formulário */}
                        <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all text-sm flex items-center gap-2"
                                >
                                    <ArrowLeft size={16} /> Voltar
                                </button>
                            ) : <div></div>} {/* Espaçador */}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-8 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-brand-600 transition-all text-sm flex items-center gap-2 shadow-lg shadow-slate-900/20"
                                >
                                    Avançar passo <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-600 transition-all text-sm flex items-center gap-2 shadow-lg shadow-sky-500/30 disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Enviando ao contador...' : 'Concluir envio no WhatsApp'}
                                    {!isSubmitting && <Send size={16} />}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center flex flex-col items-center gap-3">
                    <p className="text-slate-500 text-sm flex items-center gap-2 justify-center">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Toda abertura é revisada por um contador humano.
                    </p>
                    <p className="text-slate-400 text-xs max-w-lg">
                        Fique tranquilo: estes dados são usados apenas para a emissão do Requerimento do Empresário no Portal gov.br de forma oficial e de acordo com a LGPD.
                    </p>
                </div>
            </div>
        </div>
    );
};
