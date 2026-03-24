import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../contexts/AuthContext';
import { Search } from 'lucide-react';

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

  // NOVA FUNÇÃO: Muda para o plano específico selecionado
  const changePlan = async (id: string, newPlan: string) => {
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestão de Clientes</h1>
          <p className="text-slate-500">Altere manualmente os planos dos utilizadores abaixo.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" placeholder="Nome ou Documento..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full md:w-80"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-sm font-bold text-slate-700">Cliente / Empresa</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-700">Controlo de Plano</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProfiles.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{p.full_name}</div>
                  <div className="text-xs text-slate-500">{p.email}</div>
                  <div className="text-xs text-brand-600">{p.document_number}</div>
                </td>
                <td className="px-6 py-4">
                  {/* DROPDOWN DINÂMICO PARA ALTERAÇÃO DE PLANO */}
                  <select 
                    value={p.plan_type || 'gratis'}
                    onChange={(e) => changePlan(p.id, e.target.value)}
                    aria-label="Plano de usuário"
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-brand-500 focus:border-brand-500 cursor-pointer"
                  >
                    <option value="gratis">Grátis</option>
                    <option value="start">MEI START</option>
                    <option value="essencial">MEI ESSENCIAL</option>
                    <option value="premium">MEI PREMIUM</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

