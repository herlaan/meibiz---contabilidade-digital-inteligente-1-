// src/components/OnboardingModal.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { Building2, FileText, Phone, Briefcase } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { user, profile, refreshProfile, isLoading } = useAuth();
  
  // Estados do formulário
  const [docType, setDocType] = useState('CNPJ');
  const [docNumber, setDocNumber] = useState(profile?.document_number || '');
  const [companyName, setCompanyName] = useState(profile?.company_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [segment, setSegment] = useState(profile?.business_segment || '');
  const [revenue, setRevenue] = useState(profile?.monthly_revenue || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Regra de negócio: Se ele já tem o documento preenchido ou os dados estão carregando, não mostramos o modal
  if (isLoading || profile?.document_number) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        document_type: docType,
        document_number: docNumber,
        company_name: companyName,
        phone: phone,
        business_segment: segment,
        monthly_revenue: revenue,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      setError('Ocorreu um erro ao guardar os dados. Tente novamente.');
      setIsSaving(false);
    } else {
      // Atualiza o contexto global e o modal desaparece automaticamente
      await refreshProfile();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="bg-brand-600 p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Bem-vindo à MeiBiz! 🎉</h2>
          <p className="text-brand-100">Para personalizarmos a sua experiência e libertarmos o seu painel, precisamos de conhecer um pouco mais sobre o seu negócio.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Entidade</label>
                <select 
                  value={docType} 
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 bg-white"
                >
                  <option value="CNPJ">Pessoa Coletiva (CNPJ)</option>
                  <option value="CPF">Pessoa Singular (CPF)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Documento ({docType}) *</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 bg-slate-50" placeholder={docType === 'CNPJ' ? '00.000.000/0000-00' : '000.000.000-00'} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome / Razão Social *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 bg-slate-50" placeholder="Nome da sua empresa" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telemóvel / WhatsApp *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 bg-slate-50" placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ramo de Atividade *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select required value={segment} onChange={(e) => setSegment(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 bg-white">
                    <option value="" disabled>Selecione uma opção</option>
                    <option value="Comércio">Comércio</option>
                    <option value="Serviços">Prestação de Serviços</option>
                    <option value="Tecnologia">Tecnologia / TI</option>
                    <option value="Saúde">Saúde e Estética</option>
                    <option value="Construção">Construção Civil</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Faturamento Mensal (Opcional)</label>
                <select value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 bg-white">
                  <option value="">Prefiro não informar</option>
                  <option value="Até 5k">Até R$ 5.000</option>
                  <option value="5k a 10k">R$ 5.001 a R$ 10.000</option>
                  <option value="10k a 30k">R$ 10.001 a R$ 30.000</option>
                  <option value="Mais de 30k">Mais de R$ 30.000</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" disabled={isSaving} className="w-full md:w-auto px-8">
              {isSaving ? 'A guardar...' : 'Aceder ao meu Painel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
