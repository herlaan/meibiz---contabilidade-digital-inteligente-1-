import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../contexts/AuthContext';
import { Search, UploadCloud, Loader2, Users, FileText, Download, Trash2, Eye, Filter, Phone, Mail, Building2, ChevronDown, Activity, AlertCircle, X, MapPin, DollarSign, Briefcase, MessageCircle } from 'lucide-react';
import { Button } from '../components/Button';

export const AdminDashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => { fetchProfiles(); }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!error && data) setProfiles(data as Profile[]);
    setLoading(false);
  };

  // 1. Mudança de Plano
  const changePlan = async (id: string, newPlan: string) => {
    const { error } = await supabase.from('profiles').update({ plan_type: newPlan }).eq('id', id);
    if (!error) {
      setProfiles(profiles.map(p => p.id === id ? { ...p, plan_type: newPlan } : p));
    } else {
      alert("Erro ao alterar o plano: " + error.message);
    }
  };

  // 2. Fetch User Docs (Cofre)
  const fetchUserDocs = async (userId: string) => {
    setLoadingDocs(true);
    const { data, error } = await supabase.storage.from('documentos').list(userId);
    if (!error && data) {
      setUserDocs(data);
    } else {
      setUserDocs([]);
    }
    setLoadingDocs(false);
  };

  // Abre Modal de Documentos
  const openDocModal = (profile: Profile) => {
    setSelectedProfile(profile);
    fetchUserDocs(profile.id);
    setIsDocModalOpen(true);
  };

  // 3. Upload de Documentos Interno ao Modal
  const handleFileUpload = async (userId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(userId);

    // Formata nome para evitar bugs
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${safeName}`;

    const { error } = await supabase.storage
      .from('documentos')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      alert(`Erro ao fazer upload: ${error.message}`);
    } else {
      await fetchUserDocs(userId); // Atualiza a lista!
    }

    setUploadingId(null);
    event.target.value = '';
  };

  // 4. Deleção e Download de Documentos (Controle Total Admin)
  const handleDeleteDoc = async (userId: string, docName: string) => {
    if(!window.confirm(`Tem certeza que deseja deletar "${docName}"? O cliente perderá acesso ao arquivo.`)) return;
    
    setDeletingDoc(docName);
    const { error } = await supabase.storage.from('documentos').remove([`${userId}/${docName}`]);
    if (!error) {
      setUserDocs(userDocs.filter(d => d.name !== docName));
    } else {
      alert('Erro ao deletar: '+error.message);
    }
    setDeletingDoc(null);
  };

  const downloadDoc = async (userId: string, docName: string) => {
    const { data, error } = await supabase.storage.from('documentos').createSignedUrl(`${userId}/${docName}`, 60);
    if (!error && data) {
      window.open(data.signedUrl, '_blank');
    }
  };

  // Filtros Avançados On-The-Fly
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

  // Analytics KPIs
  const totalClients = profiles.length;
  const activeSubscribers = profiles.filter(p => p.plan_type && p.plan_type !== 'gratis').length;
  const leadClients = profiles.filter(p => !p.plan_type || p.plan_type === 'gratis').length;

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

  // Funções de Contato Rápido
  const contactWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if(cleanPhone) window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const contactEmail = (email: string) => {
    window.open(`mailto:${email}`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* HEADER & KPIS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">CRM de Clientes & Cofre</h1>
          <p className="text-slate-500">Gestão 360º de assinaturas, pendências e documentos seguros.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Membro(s) na Plataforma</p>
              <h2 className="text-3xl font-bold text-slate-900">{loading ? '...' : totalClients}</h2>
            </div>
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Assinantes Pagantes</p>
              <h2 className="text-3xl font-bold text-brand-600">{loading ? '...' : activeSubscribers}</h2>
            </div>
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
              <Activity size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Leads (Grátis)</p>
              <h2 className="text-3xl font-bold text-slate-700">{loading ? '...' : leadClients}</h2>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* FERRAMENTAS & FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Buscar por nome, email, telefone, CNPJ..." 
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

      {/* TABELA PRINCIPAL CRM */}
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
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhum cliente cadastrado ou encontrado.</td></tr>
            ) : (
              filteredProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* IDENTIFICAÇÃO */}
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-400 mb-1">{new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                    <div className="font-bold text-slate-900 line-clamp-1">{p.full_name}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-500 truncate max-w-[150px]">{p.email}</span>
                    </div>
                    {p.phone && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Phone size={12} className="text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-500">{p.phone}</span>
                      </div>
                    )}
                  </td>
                  
                  {/* EMPRESA & DOCS */}
                  <td className="px-6 py-4">
                    {p.company_name ? (
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Building2 size={14} className="text-slate-400" />
                        <span className="line-clamp-1">{p.company_name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 flex inline-flex items-center gap-1 w-max">
                        <AlertCircle size={12}/> Dados Pendentes
                      </span>
                    )}
                    {p.document_number && (
                      <div className="text-xs font-mono text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 w-max">
                        {p.document_type || 'DOC'}: {p.document_number}
                      </div>
                    )}
                  </td>

                  {/* CONTROLE DE PLANO */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      {getPlanBadge(p.plan_type || 'gratis')}
                      <select 
                        value={p.plan_type || 'gratis'}
                        onChange={(e) => changePlan(p.id, e.target.value)}
                        className="opacity-0 w-0 h-0 absolute pointer-events-none" // Esconde o select orginal
                        aria-hidden="true"
                      />
                      {/* Select visual customizado para o admin */}
                      <div className="relative group/select">
                        <select 
                          value={p.plan_type || 'gratis'}
                          onChange={(e) => changePlan(p.id, e.target.value)}
                          className="appearance-none pr-8 pl-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-brand-500 focus:ring-brand-500 cursor-pointer shadow-sm"
                        >
                          <option value="gratis">FORÇAR: Grátis</option>
                          <option value="start">FORÇAR: MEI START</option>
                          <option value="essencial">FORÇAR: MEI ESSENCIAL</option>
                          <option value="premium">FORÇAR: MEI PREMIUM</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </td>

                  {/* AÇÕES DE GESTÃO */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => { setSelectedProfile(p); setIsDetailModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                        title="Ver Perfil 360"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openDocModal(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                        title="Abrir Cofre de Documentos do Cliente"
                      >
                        <FileText size={14} /> Cofre
                      </button>
                      {p.phone && (
                        <button 
                          onClick={() => contactWhatsApp(p.phone!)}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                          title="Chamar no WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAIS DE GESTÃO --- */}


      {/* Modal 1: Cofre de Documentos (Gestão Total) */}
      {isDocModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm z-[100]">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Header / Fechar */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-brand-500" /> Cofre: {selectedProfile.full_name?.split(' ')[0]}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Gerencie os arquivos na pasta cloud deste cliente.</p>
              </div>
              <button onClick={() => setIsDocModalOpen(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Listagem do Cofre */}
            <div className="p-6 overflow-y-auto bg-white flex-1 custom-scrollbar">
              <div className="space-y-3">
                {loadingDocs ? (
                  <div className="py-12 flex justify-center"><Loader2 size={32} className="animate-spin text-slate-300" /></div>
                ) : userDocs.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <FileText size={48} className="text-slate-300 mb-4" />
                    <p className="font-medium">O cofre deste cliente está vazio.</p>
                    <p className="text-sm text-slate-500 text-center max-w-sm mt-1">Nenhum Das, Relatório ou NF enviado ainda.</p>
                  </div>
                ) : (
                  userDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all group">
                      <div className="flex flex-col min-w-0 pr-4">
                        <span className="font-medium text-slate-700 truncate text-sm">{doc.name}</span>
                        <span className="text-xs text-slate-400 mt-0.5">
                          Enviado em: {new Date(doc.created_at).toLocaleDateString('pt-BR')} às {new Date(doc.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      
                      {/* Ações do Arquivo */}
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => downloadDoc(selectedProfile.id, doc.name)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-200" title="Baixar"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDoc(selectedProfile.id, doc.name)}
                          disabled={deletingDoc === doc.name}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Deletar Arquivo"
                        >
                          {deletingDoc === doc.name ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Zona de Upload (Footer) */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0">
              <label 
                htmlFor={`upload-${selectedProfile.id}`}
                className={`relative flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${
                  uploadingId === selectedProfile.id 
                    ? 'border-brand-400 bg-brand-50' 
                    : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-brand-400 group/upload'
                }`}
              >
                <input
                  type="file" id={`upload-${selectedProfile.id}`} className="hidden"
                  onChange={(e) => handleFileUpload(selectedProfile.id, e)}
                  disabled={uploadingId === selectedProfile.id}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                />
                
                {uploadingId === selectedProfile.id ? (
                  <div className="flex flex-col items-center text-brand-600">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <span className="font-semibold text-sm">Enviando para o cofre seguro...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500 group-hover/upload:text-brand-600 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover/upload:bg-brand-100 flex items-center justify-center mb-3 transition-colors">
                      <UploadCloud size={24} />
                    </div>
                    <span className="font-semibold text-sm">Clique para enviar novo arquivo</span>
                    <span className="text-xs text-slate-400 mt-1">PDF, JPG, PNG até 50MB permitidos.</span>
                  </div>
                )}
              </label>
            </div>

          </div>
        </div>
      )}

      {/* Modal 2: Perfil Completo 360º */}
      {isDetailModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm z-[100]">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
            <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white text-slate-500 rounded-full transition-colors z-10 backdrop-blur-sm shadow-sm border border-slate-100">
              <X size={20} />
            </button>
            
            {/* Cabecalho de Identificação */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 pb-12 pt-10 text-white flex flex-col gap-4 relative">
              <div className="absolute inset-0 opacity-10 blur-xl mix-blend-overlay" style={{backgroundImage: 'radial-gradient(circle at top right, white, transparent)'}}></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-end justify-between">
                <div>
                  <div className="mb-3">{getPlanBadge(selectedProfile.plan_type || 'gratis')}</div>
                  <h2 className="text-3xl font-bold">{selectedProfile.full_name}</h2>
                  <p className="text-brand-200 mt-1 flex items-center gap-2">
                    <Mail size={16} /> {selectedProfile.email}
                  </p>
                </div>
                <div className="flex gap-3">
                  {selectedProfile.phone && (
                   <Button variant="outline" className="border-brand-400 text-white hover:bg-brand-500/50 bg-brand-500/20 shadow-none py-2" onClick={() => contactWhatsApp(selectedProfile.phone!)}>
                     <MessageCircle size={16} className="mr-2" /> Falar
                   </Button>
                  )}
                  <Button variant="outline" className="border-brand-400 text-white hover:bg-brand-500/50 bg-brand-500/20 shadow-none py-2" onClick={() => contactEmail(selectedProfile.email!)}>
                     <Mail size={16} />
                   </Button>
                </div>
              </div>
            </div>

            {/* Corpo dos Detalhes Contábeis */}
            <div className="p-8 pb-10 bg-slate-50 -mt-6 rounded-t-3xl relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Dados Pessoais & Empresa */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><Building2 size={14}/> Detalhes da Empresa</h4>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Razão Social</p>
                        <p className="font-semibold text-slate-800">{selectedProfile.company_name || <span className="text-slate-400 italic font-normal">Não informado</span>}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-0.5">{selectedProfile.document_type || 'Documento'}</p>
                        <p className="font-mono text-sm font-semibold text-slate-700 bg-slate-50 w-max px-2 py-1 rounded">{selectedProfile.document_number || '---'}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-0.5 flex items-center gap-1.5"><MapPin size={12}/> CEP / Endereço</p>
                        <p className="text-sm text-slate-700 font-medium">
                          {selectedProfile.zip_code ? <span className="text-brand-600 block mb-1">{selectedProfile.zip_code}</span> : null}
                          {selectedProfile.address || <span className="text-slate-400 italic">Endereço não informado</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perfil Operacional */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><Briefcase size={14}/> Perfil Operacional</h4>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                       <div>
                        <p className="text-xs text-slate-500 mb-0.5 flex items-center gap-1.5"><DollarSign size={12}/> Receita Estimada</p>
                        <p className="font-semibold text-emerald-600">{selectedProfile.monthly_revenue || <span className="text-slate-400 italic font-normal text-sm">Não mapeado</span>}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-0.5">Ramo de Atuação</p>
                         <p className="font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg break-words text-sm border border-slate-100">
                          {selectedProfile.business_segment || <span className="text-slate-400 italic font-normal">Sem segmento</span>}
                        </p>
                      </div>
                       <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Telefone Principal</p>
                        <p className="font-semibold text-slate-700">{selectedProfile.phone || <span className="text-slate-400 italic font-normal text-sm">Sem telefone</span>}</p>
                      </div>
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
