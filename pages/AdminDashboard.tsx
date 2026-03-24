// src/pages/AdminDashboard.tsx - Versão Interativa
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../contexts/AuthContext';
import { Search, Phone, ShieldCheck, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchProfiles(); }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!error && data) setProfiles(data as Profile[]);
    setLoading(false);
  };

  // FUNÇÃO CRÍTICA: Permite que o Admin mude o plano do cliente manualmente
  const togglePlan = async (id: string, currentPlan: string) => {
    const newPlan = currentPlan === 'gratis' ? 'completo' : 'gratis';
    const { error } = await supabase.from('profiles').update({ plan_type: newPlan }).eq('id', id);
    if (!error) {
      setProfiles(profiles.map(p => p.id === id ? { ...p, plan_type: newPlan } : p));
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.document_number?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestão de Clientes</h1>
          <p className="text-slate-500">Controle de acesso e liberação de planos premium.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" placeholder="Nome ou Documento..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full md:w-80 focus:ring-brand-500"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-sm font-bold text-slate-700">Cliente / Empresa</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-700">Plano</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProfiles.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{p.full_name}</div>
                  <div className="text-xs text-slate-500">{p.email}</div>
                  <div className="text-xs text-brand-600">{p.document_number}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    p.plan_type === 'completo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.plan_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => togglePlan(p.id, p.plan_type || 'gratis')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      p.plan_type === 'gratis' 
                      ? 'bg-brand-600 text-white hover:bg-brand-700' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.plan_type === 'gratis' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    {p.plan_type === 'gratis' ? 'Ativar Premium' : 'Rebaixar Plano'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

