import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Building2, FileText, MessageSquare, AlertCircle, TrendingUp, Phone, MapPin, Briefcase, DollarSign } from 'lucide-react';

// NÚMERO DE ATENDIMENTO DA CONTABILIDADE (Ex: 5511999999999)
const WHATSAPP_NUMBER = '5575988927727'; 

export const Dashboard: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentType, setDocumentType] = useState('CNPJ');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [businessSegment, setBusinessSegment] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setDocumentNumber(profile.document_number || '');
      setDocumentType(profile.document_type || 'CNPJ');
      setCompanyName(profile.company_name || '');
      setPhone(profile.phone || '');
      setZipCode(profile.zip_code || '');
      setAddress(profile.address || '');
      setMonthlyRevenue(profile.monthly_revenue || '');
      setBusinessSegment(profile.business_segment || '');
    }
  }, [profile]);

  const handleSaveCompanyData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setSaveMessage(null);

    const { error } = await supabase
      .from('profiles')
      .update({ 
        document_number: documentNumber,
        document_type: documentType,
        company_name: companyName,
        phone,
        zip_code: zipCode,
        address,
        monthly_revenue: monthlyRevenue,
        business_segment: businessSegment,
        updated_at: new Date().toISOString() 
      })
      .eq('id', user.id);

    if (error) {
      setSaveMessage({ type: 'error', text: 'Erro ao guardar os dados. Tente novamente.' });
    } else {
      setSaveMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
      await refreshProfile();
    }
    setIsSaving(false);
  };

  const isFreePlan = profile?.plan_type === 'gratis';

  const handleWhatsAppRedirect = (action: string) => {
    const nome = profile?.full_name || 'Empreendedor';
    const empresa = profile?.company_name ? `da empresa ${profile.company_name}` : '';
    const doc = profile?.document_number ? `(${profile.document_type}: ${profile.document_number})` : '';
    
    let text = `Olá! Sou ${nome} ${empresa} ${doc}. `;
    
    if (action === 'suporte') {
      text += 'Preciso de ajuda com a minha contabilidade.';
    } else if (action === 'upgrade') {
      text += 'Gostaria de fazer o upgrade do meu plano para ter acesso à contabilidade completa e emissão de faturas.';
    } else if (action === 'fatura') {
      text += 'Preciso de ajuda para emitir uma fatura/nota fiscal.';
    }

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
  };

  const handleUpgradeIntent = async () => {
    // TODO: Futuramente, este log pode ser salvo em uma tabela 'analytics_events'
    console.info(`Lead Interessado: ${profile?.email} - Plano atual: ${profile?.plan_type}`);
    handleWhatsAppRedirect('upgrade');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Coluna Principal: Dados da Empresa */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Olá, {profile?.full_name || 'Empreendedor'}</h1>
          <p className="text-slate-500 mt-1">Mantenha os dados do seu negócio atualizados para um melhor atendimento.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Perfil Profissional</h2>
          </div>

          <form onSubmit={handleSaveCompanyData} className="space-y-8">
            {/* Seção 1: Identificação */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Identificação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Documento</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="CNPJ">CNPJ</option>
                    <option value="CPF">CPF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número do Documento</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder={documentType === 'CNPJ' ? "00.000.000/0000-00" : "000.000.000-00"}
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social / Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Sua Empresa LTDA ou Nome Civil"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Seção 2: Contacto e Localização */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-t pt-6">Contacto e Localização</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="00000-000"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Informações do Negócio */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-t pt-6">Negócio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ramo de Atuação</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Ex: Tecnologia, Comércio, Saúde"
                    value={businessSegment}
                    onChange={(e) => setBusinessSegment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Faturamento Mensal Estimado</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                  >
                    <option value="">Selecione uma faixa</option>
                    <option value="Ate 5k">Até R$ 5.000</option>
                    <option value="5k a 10k">R$ 5.000 a R$ 10.000</option>
                    <option value="10k a 20k">R$ 10.000 a R$ 20.000</option>
                    <option value="Mais de 20k">Mais de R$ 20.000</option>
                  </select>
                </div>
              </div>
            </div>

            {saveMessage && (
              <div className={`p-4 rounded-xl text-sm ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {saveMessage.text}
              </div>
            )}

            <div className="flex justify-end border-t pt-6">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'A guardar...' : 'Guardar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Coluna Lateral: Status e Serviços Operacionais */}
      <div className="w-full lg:w-80 space-y-6">
        
        {/* Cartão de Upsell (Gerador de Receita) */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          {/* Elemento decorativo */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <TrendingUp size={64} />
          </div>

          <h3 className="text-slate-400 text-sm font-medium mb-2 relative z-10">O seu Plano Atual</h3>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <span className="text-2xl font-bold capitalize">{profile?.plan_type || 'Carregando...'}</span>
            {isFreePlan && (
              <span className="px-2 py-1 bg-white/10 text-xs font-medium rounded-full text-white/80 border border-white/20">
                Básico
              </span>
            )}
          </div>
          
          {isFreePlan && (
            <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Desbloqueie a emissão de notas fiscais, declaração anual e atendimento prioritário.
              </p>
              <Button 
                variant="primary" 
                fullWidth 
                className="!py-2.5 shadow-lg shadow-brand-500/30"
                onClick={handleUpgradeIntent}
              >
                Fazer Upgrade Agora
              </Button>
            </div>
          )}
        </div>

        {/* Central de Ações (Regras de Negócio na UI) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Central de Atendimento</h3>
          <div className="space-y-3">
            
            <button 
              onClick={() => handleWhatsAppRedirect('suporte')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                  <MessageSquare size={18} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">Falar com Contador</span>
              </div>
            </button>
            
            <button 
              onClick={() => !isFreePlan ? handleWhatsAppRedirect('fatura') : handleWhatsAppRedirect('upgrade')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                isFreePlan 
                  ? 'bg-slate-50 border-slate-100 cursor-pointer hover:bg-slate-100' 
                  : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${isFreePlan ? 'bg-slate-200 text-slate-500' : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100'}`}>
                  <FileText size={18} />
                </div>
                <span className={`font-medium ${isFreePlan ? 'text-slate-500' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  Emitir Guia/Nota
                </span>
              </div>
              {isFreePlan && <AlertCircle size={16} className="text-amber-500" title="Requer plano premium" />}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
