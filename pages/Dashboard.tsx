import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Building2, FileText, MessageSquare, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  
  // Estados para os inputs de dados da empresa
  const [cnpj, setCnpj] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Preenche os inputs assim que o perfil é carregado
  useEffect(() => {
    if (profile) {
      setCnpj(profile.cnpj || '');
      setCompanyName(profile.company_name || '');
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
        cnpj: cnpj,
        company_name: companyName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      setSaveMessage({ type: 'error', text: 'Erro ao guardar os dados. Tente novamente.' });
    } else {
      setSaveMessage({ type: 'success', text: 'Dados da empresa atualizados com sucesso!' });
      await refreshProfile(); // Atualiza o contexto global com os novos dados
    }
    setIsSaving(false);
  };

  const isFreePlan = profile?.plan_type === 'gratis';

  return (
    <div className="min-h-screen pt-32 px-4 pb-20 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Coluna Principal: Dados da Empresa */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Olá, {profile?.full_name || 'Empreendedor'}</h1>
          <p className="text-slate-500 mt-1">Gira o seu negócio e a sua contabilidade num só lugar.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Dados da Empresa</h2>
          </div>

          <form onSubmit={handleSaveCompanyData} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Sua Empresa LTDA"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            {saveMessage && (
              <div className={`p-4 rounded-xl text-sm ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {saveMessage.text}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'A guardar...' : 'Guardar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Coluna Lateral: Status e Serviços */}
      <div className="w-full md:w-80 space-y-6">
        {/* Cartão de Plano */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">O seu Plano Atual</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold capitalize">{profile?.plan_type || 'Carregando...'}</span>
            {isFreePlan && (
              <span className="px-2 py-1 bg-white/10 text-xs font-medium rounded-full text-white/80">
                Básico
              </span>
            )}
          </div>
          
          {isFreePlan && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-slate-300 mb-4">Desbloqueie emissão de faturas, contabilidade completa e atendimento prioritário.</p>
              <Button variant="white" fullWidth className="!py-2">
                Fazer Upgrade
              </Button>
            </div>
          )}
        </div>

        {/* Regras de Negócio na UI */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Acesso Rápido</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
                <span className="font-medium text-slate-700 group-hover:text-slate-900">Suporte WhatsApp</span>
              </div>
            </button>
            
            <button 
              disabled={isFreePlan}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${isFreePlan ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 group'}`}
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-slate-400" />
                <span className="font-medium text-slate-700">Emitir Fatura</span>
              </div>
              {isFreePlan && <AlertCircle size={16} className="text-amber-500" title="Exclusivo para pagantes" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
