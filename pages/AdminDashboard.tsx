import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../contexts/AuthContext';
import { Search, UploadCloud, Loader2, Users, FileText, Download, Trash2, Eye, Filter, Phone, Mail, Building2, ChevronDown, Activity, AlertCircle, X, MapPin, DollarSign, Briefcase, MessageCircle, Check, Clock, Inbox } from 'lucide-react';
import { Button } from '../components/Button';

interface ServiceRequest {
  id: string;
  user_id: string;
  type: string;
  status: string;
  details: any;
  created_at: string;
  profiles?: any;
}

export const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('todos');
  
  // Modals and Side Panels
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Document Management State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [userDocs, setUserDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null);

  useEffect(() => { 
    fetchProfiles(); 
    fetchRequests();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!error && data) setProfiles(data as Profile[]);
    setLoading(false);
  };

  const fetchRequests = async () => {
    setLoadingReqs(true);
    const { data, error } = await supabase
       .from('service_requests')
       .select('*, profiles:user_id(full_name, email, document_number)')
       .neq('status', 'completed')
       .order('created_at', { ascending: false });
    if (!error && data) setRequests(data as any[]);
    setLoadingReqs(false);
  };

  // 1. Mudança de Plano
  const changePlan = async (id: string, newPlan: string) => {
    const { error } = await supabase.from('profiles').update({ plan_type: newPlan }).eq('id', id);
    if (!error) {
      setProfiles(profiles.map(p => p.id === id ? { ...p, plan_type: newPlan } : p));
    } else alert("Erro ao alterar o plano: " + error.message);
  };

  // 2. Fetch User Docs (Cofre)
  const fetchUserDocs = async (userId: string) => {
    setLoadingDocs(true);
    const { data, error } = await supabase.storage.from('documentos').list(userId);
    if (!error && data) setUserDocs(data);
    else setUserDocs([]);
    setLoadingDocs(false);
  };

  const openDocModal = (profile: Profile) => {
    setSelectedProfile(profile);
    fetchUserDocs(profile.id);
    setIsDocModalOpen(true);
  };

  const handleFileUpload = async (userId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingId(userId);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${safeName}`;
    const { error } = await supabase.storage.from('documentos').upload(filePath, file, { cacheControl: '3600', upsert: true });
    if (error) alert(`Erro ao fazer upload: ${error.message}`);
    else await fetchUserDocs(userId);
    setUploadingId(null);
    event.target.value = '';
  };

  const handleDeleteDoc = async (userId: string, docName: string) => {
    if(!window.confirm(`Tem certeza que deseja deletar "${docName}"?`)) return;
    setDeletingDoc(docName);
    const { error } = await supabase.storage.from('documentos').remove([`${userId}/${docName}`]);
    if (!error) setUserDocs(userDocs.filter(d => d.name !== docName));
    else alert('Erro ao deletar: '+error.message);
    setDeletingDoc(null);
  };

  const downloadDoc = async (userId: string, docName: string) => {
    const { data, error } = await supabase.storage.from('documentos').createSignedUrl(`${userId}/${docName}`, 60);
    if (!error && data) window.open(data.signedUrl, '_blank');
  };

  const updateReqStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('service_requests').update({ status }).eq('id', id);
    if (!error) {
       if (status === 'completed') {
           // Arquivar imediatamente da vista
           setRequests(requests.filter(r => r.id !== id));
       } else {
           setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
       }
    }
    else alert("Erro ao atualizar.");
  };

  const updateProfileFields = async (id: string, field: string, value: any) => {
    const updates = { [field]: value };
    const { error } = await supabase.from('profiles').update(updates).eq('id', id);
    if (!error) {
       setProfiles(profiles.map(p => p.id === id ? { ...p, ...updates } : p));
       if(selectedProfile?.id === id) setSelectedProfile({ ...selectedProfile, ...updates });
       alert("Atualizado com sucesso!");
    } else alert("Erro ao salvar: " + error.message);
  };

  // Filtros Avançados
  const filteredProfiles = profiles.filter(p => {
    const searchMatch = 
      p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.document_number?.includes(searchTerm) ||
      p.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm);
    const planMatch = planFilter === 'todos' || (p.plan_type || 'gratis') === planFilter;
    return searchMatch && planMatch;
  });

  const getPlanBadge = (plan: string) => {
    const plans: any = {
      'gratis': { label: 'Lead / Grátis', class: 'bg-slate-100 text-slate-600 border-slate-200' },
      'start': { label: 'MEI Start', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'essencial': { label: 'Essencial', class: 'bg-brand-50 text-brand-700 border-brand-200' },
      'premium': { label: 'Premium', class: 'bg-purple-50 text-purple-700 border-purple-200' }
    };
    const p = plans[plan || 'gratis'];
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${p.class}`}>{p.label}</span>;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Portal do Contador</h1>
          <p className="text-slate-500">Gestão 360º de assinaturas, pendências e documentos seguros.</p>
        </div>
      </div>

      {/* Caixa de Entrada (Solicitações) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Inbox className="text-brand-500"/> Caixa de Entrada de Serviços</h2>
        <div className="overflow-x-auto">
          {loadingReqs ? (
            <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={24}/></div>
          ) : requests.length === 0 ? (
            <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Nenhum chamado ou pedido recebido.</div>
          ) : (
             <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {requests.map(r => (
                  <div key={r.id} className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${r.type==='nf_emission'?'bg-blue-50 text-blue-600':'bg-purple-50 text-purple-600'}`}>
                         {r.type==='nf_emission' ? <FileText size={20}/> : <MessageCircle size={20}/>}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400">{new Date(r.created_at).toLocaleString('pt-BR')}</span>
                        <h4 className="font-bold text-slate-900">{r.type === 'nf_emission' ? 'Pedido de NF Emitida' : 'Ticket de Suporte'}</h4>
                        <p className="text-sm text-slate-600 mt-1 max-w-md">
                          <span className="font-semibold">{r.profiles?.full_name}:</span> {r.type === 'nf_emission' ? `Emitir NF no valor R$ ${r.details.value} para ${r.details.client_document}` : r.details.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <select 
                         value={r.status} 
                         onChange={(e)=>updateReqStatus(r.id, e.target.value)}
                         className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${r.status==='completed'?'bg-emerald-50 text-emerald-700 border-emerald-200':r.status==='in_progress'?'bg-amber-50 text-amber-700 border-amber-200':'bg-slate-100 text-slate-600 border-slate-200'} cursor-pointer`}
                       >
                         <option value="pending">Pendente</option>
                         <option value="in_progress">Em Andamento</option>
                         <option value="completed">Concluída</option>
                       </select>
                    </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>

      {/* FERRAMENTAS & FILTROS C.R.M. */}
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-8"><Users className="text-brand-500"/> Diretório de Clientes</h2>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Buscar por nome, email, telefone, CNPJ..." 
            maxLength={100}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full text-sm focus:ring-brand-500 focus:border-brand-500"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400 shrink-0" />
          <select 
            className="w-full md:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-brand-500 focus:border-brand-500 cursor-pointer"
            value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="todos">Todos os Planos</option>
            <option value="start">MEI START</option>
            <option value="essencial">MEI ESSENCIAL</option>
            <option value="premium">MEI PREMIUM</option>
            <option value="gratis">Apenas Leads (Grátis)</option>
          </select>
        </div>
      </div>

      {/* TABELA DE CLIENTES */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 font-bold">Data & Identificação</th>
              <th className="px-6 py-4 font-bold">Empresa / Documento</th>
              <th className="px-6 py-4 font-bold">Plano Ativo</th>
              <th className="px-6 py-4 font-bold text-center">Ações de Gestão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400"><Loader2 className="animate-spin mx-auto" size={24} /></td></tr>
            ) : filteredProfiles.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhum cliente encontrado.</td></tr>
            ) : (
              filteredProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-400 mb-1">{new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                    <div className="font-bold text-slate-900">{p.full_name}</div>
                    <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs"><Mail size={12}/>{p.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {p.company_name ? (
                      <div className="font-medium text-slate-800 flex items-center gap-1.5"><Building2 size={14}/><span>{p.company_name}</span></div>
                    ) : (
                      <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-100 flex inline-flex items-center gap-1"><AlertCircle size={12}/> Pendente</span>
                    )}
                    {p.document_number && (<div className="text-xs font-mono text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 w-max">{p.document_type}: {p.document_number}</div>)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      {getPlanBadge(p.plan_type || 'gratis')}
                      <div className="relative group/select">
                        <select 
                          value={p.plan_type || 'gratis'} onChange={(e) => changePlan(p.id, e.target.value)}
                          className="appearance-none pr-8 pl-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:border-brand-500 cursor-pointer"
                        >
                          <option value="gratis">Mudar: Grátis</option>
                          <option value="start">Mudar: Start</option>
                          <option value="essencial">Mudar: Essencial</option>
                          <option value="premium">Mudar: Premium</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <button onClick={() => { setSelectedProfile(p); setIsDetailModalOpen(true); }} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100" title="Ver & Editar Perfil">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => openDocModal(p)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-xs font-semibold shadow-sm">
                        <FileText size={14} /> Cofre
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Cofre de Documentos */}
      {isDocModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><FileText className="text-brand-500" /> Cofre: {selectedProfile.full_name?.split(' ')[0]}</h3>
                <p className="text-sm text-slate-500 mt-1">Envie documentos para o cliente através do uploader abaixo.</p>
              </div>
              <button onClick={() => setIsDocModalOpen(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-white flex-1 custom-scrollbar">
              <div className="space-y-3">
                {loadingDocs ? (
                  <div className="py-12 flex justify-center"><Loader2 size={32} className="animate-spin text-slate-300" /></div>
                ) : userDocs.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <FileText size={48} className="text-slate-300 mb-4" />
                    <p className="font-medium">Cofre Vazio.</p>
                  </div>
                ) : (
                  userDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all">
                      <div className="flex flex-col"><span className="font-medium text-slate-700 text-sm">{doc.name}</span></div>
                      <div className="flex gap-2">
                        <button onClick={() => downloadDoc(selectedProfile.id, doc.name)} className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg"><Download size={16} /></button>
                        <button onClick={() => handleDeleteDoc(selectedProfile.id, doc.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Zona de Upload Admin */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0">
              <label className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-brand-300 bg-brand-50/50 hover:bg-brand-50 rounded-2xl cursor-pointer">
                <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(selectedProfile.id, e)} disabled={uploadingId === selectedProfile.id}/>
                 {uploadingId === selectedProfile.id ? (
                  <div className="flex flex-col items-center text-brand-600"><Loader2 size={32} className="animate-spin mb-2" /><span className="font-semibold text-sm">Enviando PDF...</span></div>
                ) : (
                  <div className="flex flex-col items-center text-brand-600"><UploadCloud size={24} className="mb-2" /><span className="font-semibold text-sm">Upload "Sair Nota / DAS" (PDF)</span></div>
                )}
              </label>
            </div>

          </div>
        </div>
      )}

      {/* Modal 2: Perfil Editável 360º */}
      {isDetailModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm z-[100]">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setIsDetailModalOpen(false)} className="fixed md:absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full z-[110] border"><X size={20} /></button>
            
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 pb-12 pt-10 text-white rounded-t-3xl">
              <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{selectedProfile.full_name}</h2>
                  <p className="text-brand-200 mt-1 flex items-center gap-2"><Mail size={16} /> {selectedProfile.email}</p>
                </div>
              </div>
            </div>

            <div className="p-8 pb-10 bg-slate-50 -mt-6 rounded-t-3xl border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Atributos Financeiros Admin (Novos Parametros) */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><Activity size={14}/> Controlo Operacional Dashboard</h4>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      
                      {/* Faturamento Anual (Feedback Dashboard Termometro) */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5"><DollarSign size={12}/> Faturamento Fechado (Declared YTD)</label>
                        <div className="flex gap-2">
                           <input 
                             type="number" max="999999999" defaultValue={(selectedProfile as any).declared_revenue || 0} 
                             onBlur={(e)=>updateProfileFields(selectedProfile.id, 'declared_revenue', Number(e.target.value))}
                             className="flex-1 border bg-slate-50 rounded-lg px-3 py-2 text-sm focus:ring-brand-500" 
                           />
                           <div className="text-xs text-slate-400 max-w-[120px]">Salvo automaticamente. (Impacta termómetro)</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5"><AlertCircle size={12}/> Status DASN-SIMEI</label>
                         <select 
                           defaultValue={(selectedProfile as any).dasn_status || 'pending'}
                           onChange={(e)=>updateProfileFields(selectedProfile.id, 'dasn_status', e.target.value)}
                           className="w-full border bg-slate-50 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 font-medium"
                         >
                           <option value="pending">Pendente (Azul)</option>
                           <option value="analysis">Em Análise (Laranja)</option>
                           <option value="transmitted">Transmitida (Verde)</option>
                         </select>
                      </div>

                       {/* Poupança (Opcional, se o widget voltar depois, fica salvo) */}
                      <div className="pt-3 border-t border-slate-100">
                         <label className="text-xs font-bold text-slate-500 mb-1 block">Economia Tributária Real ($)</label>
                         <input 
                           type="number" max="999999999" defaultValue={(selectedProfile as any).tax_savings || 0} 
                           onBlur={(e)=>updateProfileFields(selectedProfile.id, 'tax_savings', Number(e.target.value))}
                           className="w-full border bg-slate-50 rounded-lg px-3 py-2 text-sm" 
                         />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados Basicos (Read only mode ou Info Extra) */}
                <div className="space-y-6">
                   <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><Briefcase size={14}/> Dados Originais do Cadastro</h4>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-sm">
                      <p><strong>C/CPF:</strong> {selectedProfile.document_number}</p>
                      <p><strong>Empresa:</strong> {selectedProfile.company_name}</p>
                      <p><strong>Telefone:</strong> {selectedProfile.phone}</p>
                      <p><strong>CEP:</strong> {selectedProfile.zip_code}</p>
                      <p><strong>Estimativa Info:</strong> {selectedProfile.monthly_revenue}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
