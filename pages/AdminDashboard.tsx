import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../contexts/AuthContext';
import { Users, Building, Phone, BadgeDollarSign, Search } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setProfiles(data);
    setLoading(false);
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
          <p className="text-slate-500">Administre os utilizadores e acompanhe o crescimento da MeiBiz.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Procurar por nome, email ou CNPJ..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full md:w-80 focus:ring-brand-500 focus:border-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Cliente / Empresa</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Documento</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Contacto</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Plano</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Faturamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">A carregar dados...</td></tr>
              ) : filteredProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.full_name}</div>
                    <div className="text-xs text-slate-500">{p.email}</div>
                    <div className="text-xs text-brand-600 font-medium">{p.company_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {p.document_number || 'Não informado'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {p.phone || 'Sem tel'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      p.plan_type === 'completo' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.plan_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 italic">
                    {p.monthly_revenue || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
