import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { 
  Building2, FileText, MessageSquare, AlertCircle, TrendingUp, Phone, MapPin, 
  Briefcase, DollarSign, X, Check, DownloadCloud, Loader2, Calendar, Upload, 
  Bell, ChevronRight, CheckCircle2, Shield, PlayCircle, Gift, ExternalLink, 
  UserCircle, LifeBuoy, CreditCard, ChevronDown, Clock, Activity, FileCheck
} from 'lucide-react';

// NÚMERO DE ATENDIMENTO DA CONTABILIDADE
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
  
  // Modais e UI States
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isNfModalOpen, setIsNfModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [showOnboardingTour, setShowOnboardingTour] = useState(true); // UX Tour
  const [activeDocTab, setActiveDocTab] = useState<'todos' | 'impostos' | 'notas'>('todos'); // Pastas Premium
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false); // Collapsible

  // Estados dos Documentos
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  
  // Estado de Tickets do Cliente
  const [myTickets, setMyTickets] = useState<any[]>([]);

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

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchMyTickets();
    }
  }, [user]);

  const fetchMyTickets = async () => {
    if (!user) return;
    const { data } = await supabase.from('service_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
    if (data) setMyTickets(data);
  };

  const fetchDocuments = async () => {
    if (!user) return;
    setLoadingDocs(true);
    const { data, error } = await supabase.storage.from('documentos').list(user.id);
    if (!error && data) {
      setDocuments(data);
    }
    setLoadingDocs(false);
  };

  const downloadDocument = async (fileName: string) => {
    if (!user) return;
    const { data, error } = await supabase.storage.from('documentos').createSignedUrl(`${user.id}/${fileName}`, 60);
    if (error) {
      alert('Erro ao baixar o documento. Ele pode ter expirado ou sido removido.');
    } else if (data) {
      window.open(data.signedUrl, '_blank');
    }
  };

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
      setIsProfileFormOpen(false); // Recoil form on save
    }
    setIsSaving(false);
  };

  const isFreePlan = profile?.plan_type === 'gratis';

  const handleWhatsAppRedirect = (action: string) => {
    const nome = profile?.full_name || 'Empreendedor';
    const empresa = profile?.company_name ? `da empresa ${profile.company_name}` : '';
    const doc = profile?.document_number ? `(${profile.document_type}: ${profile.document_number})` : '';

    let text = `Olá! Sou ${nome} ${empresa} ${doc}. `;

    if (action === 'suporte') text += 'Preciso de ajuda com a minha contabilidade.';
    else if (action === 'upgrade') text += 'Gostaria de fazer o upgrade do meu plano para ter acesso à contabilidade completa e emissão de faturas.';
    else if (action === 'fatura') text += 'Preciso de ajuda para emitir uma fatura/nota fiscal.';

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
  };

  const handleUpgradeIntent = () => setIsUpgradeModalOpen(true);

  const handleDynamicUpgrade = (stripeLink: string) => {
    if (!user) return;
    try {
      const checkoutUrl = new URL(stripeLink);
      checkoutUrl.searchParams.append('client_reference_id', user.id);
      if (profile?.email) checkoutUrl.searchParams.append('prefilled_email', profile.email);
      window.location.href = checkoutUrl.toString();
    } catch (e) {
      console.error("Erro ao gerar URL do Stripe:", e);
      handleWhatsAppRedirect('upgrade');
    }
  };

  // --- LÓGICAS DAS NOVAS FEATURES (20 MELHORIAS) ---

  // Gamificação (Profile Completeness)
  const calculateCompleteness = () => {
    let score = 20; // Base por criar a conta
    if (documentNumber) score += 20;
    if (companyName) score += 20;
    if (phone) score += 20;
    if (businessSegment) score += 20;
    return score;
  };
  const completeness = calculateCompleteness();

  // Termômetro do Limite MEI
  const getEstimatedYTD = () => {
    if (monthlyRevenue === 'Ate 5k') return 45000;
    if (monthlyRevenue === '5k a 10k') return 75000;
    if (monthlyRevenue === '10k a 20k') return 120000;
    return 10000; // Default
  };
  const meiLimit = 81000;
  const realAnnualRev = (profile as any)?.declared_revenue || 0; // Se houver um campo na DB, usar
  const estimatedRev = realAnnualRev > 0 ? realAnnualRev : getEstimatedYTD();
  const limitPercentage = Math.min((estimatedRev / meiLimit) * 100, 100);
  const limitColor = limitPercentage > 90 ? 'bg-red-500' : limitPercentage > 75 ? 'bg-amber-500' : 'bg-green-500';



  // 3. Agenda Fiscal (Data de Pagamento DAS)
  const getNextDASDate = () => {
    const today = new Date();
    let dasDate = new Date(today.getFullYear(), today.getMonth(), 20);
    if (today.getDate() > 20) dasDate.setMonth(dasDate.getMonth() + 1);
    const diffTime = dasDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { date: dasDate, daysLeft: diffDays };
  };
  const { date: dasDate, daysLeft: dasDaysLeft } = getNextDASDate();



  // Filtro Categórico do Cofre Digital baseado em palavras-chave no nome do arquivo
  const filteredDocs = documents.filter(doc => {
    if (activeDocTab === 'todos') return true;
    const nameLower = doc.name.toLowerCase();
    if (activeDocTab === 'impostos') return nameLower.includes('das') || nameLower.includes('imposto') || nameLower.includes('simples') || nameLower.includes('gps');
    if (activeDocTab === 'notas') return nameLower.includes('nota') || nameLower.includes('nf') || nameLower.includes('recibo') || nameLower.includes('fatura');
    return false;
  });

  // --- Lógicas de Backend Conectadas ---

  // 1. Enviar arquivo para a Cloud (Upload pelo Cliente)
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    
    // Mostra um aviso de loading provisório
    setLoadingDocs(true);
    const fileName = `enviados/${Date.now()}_${file.name}`;
    
    const { error } = await supabase.storage.from('documentos').upload(`${user.id}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
      alert("Erro ao enviar ficheiro. Tente novamente.");
      setLoadingDocs(false);
    } else {
      alert("Ficheiro enviado com sucesso para a contabilidade!");
      fetchDocuments(); // Recarrega o cofre
    }
  };

  // 2. Download Direto do DAS do Mês
  const handleDownloadDAS = () => {
    const dasDoc = documents.find(d => d.name.toLowerCase().includes('das'));
    if (dasDoc) {
      downloadDocument(dasDoc.name);
    } else {
      alert("Ainda não recebemos o DAS deste mês. A nossa equipa irá disponibilizá-lo nos próximos dias antes do dia 20.");
    }
  };

  // 3. Solicitar Emissão de NF
  const [nfClientDoc, setNfClientDoc] = useState('');
  const [nfValue, setNfValue] = useState('');
  const [isSubmittingNf, setIsSubmittingNf] = useState(false);

  const handleSubmitNf = async () => {
    if (!user || !nfClientDoc || !nfValue) {
      alert("Preencha todos os campos do pedido de nota fiscal.");
      return;
    }
    
    setIsSubmittingNf(true);
    const { error } = await supabase.from('service_requests').insert({
      user_id: user.id,
      type: 'nf_emission',
      details: { client_document: nfClientDoc, value: nfValue }
    });

    setIsSubmittingNf(false);
    
    if (error) {
      alert("Erro ao enviar a solicitação. Tente pelo WhatsApp provisoriamente.");
    } else {
      fetchMyTickets();
      alert("Pedido enviado com sucesso! Acompanhe-o no painel de chamados.");
      setNfClientDoc('');
      setNfValue('');
      setIsNfModalOpen(false);
    }
  };

  const [ticketText, setTicketText] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);

  const handleOpenTicket = async () => {
     if (!ticketText.trim() || !user) return;
     setIsSubmittingTicket(true);

     const { error } = await supabase.from('service_requests').insert({
       user_id: user.id,
       type: 'support_ticket',
       details: { description: ticketText }
     });
     
     setIsSubmittingTicket(false);

     if (error) alert("Erro ao abrir chamado.");
     else {
        fetchMyTickets();
        alert("Chamado aberto com sucesso! Acompanhe-o na secção Meus Chamados.");
        setIsSupportModalOpen(false);
        setShowTicketForm(false);
        setTicketText('');
     }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8 bg-slate-50/50">

      {/* 20. Modal de Boas-Vindas In-App (Tour Guiado Ocultável) */}
      {showOnboardingTour && (
        <div className="bg-gradient-to-r from-brand-600 to-accent-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 reveal active">
          <div className="absolute -right-10 -top-10 opacity-10"><Building2 size={120} /></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Activity size={24} className="text-white" /></div>
            <div>
              <h2 className="text-xl font-bold mb-1">Bem-vindo(a) ao seu novo Escritório Virtual!</h2>
              <p className="text-white/80 text-sm max-w-2xl">
                O seu painel agora é inteligente. Acompanhe os seus impostos, emita notas e converse com a sua equipa - tudo num só lugar. Complete o seu perfil para debloquear todas as funcionalidades!
              </p>
            </div>
          </div>
          <Button variant="white" size="sm" className="relative z-10 shrink-0" onClick={() => setShowOnboardingTour(false)}>
            Entendido, começar!
          </Button>
        </div>
      )}

      {/* TOPO: Informações de Alto Nível (1, 9, 13) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 13. Gamificação do Perfil */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeDasharray={`${completeness}, 100`} />
            </svg>
            <span className="absolute text-sm font-bold text-slate-700">{completeness}%</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Força do Perfil</h3>
            <p className="text-xs text-slate-500 mb-2">Completar o perfil acelera o seu atendimento.</p>
            {completeness < 100 && (
              <button onClick={() => setIsProfileFormOpen(true)} className="text-xs text-brand-600 font-medium hover:underline">Completar Agora &rarr;</button>
            )}
          </div>
        </div>

        {/* 1. Termômetro do Limite MEI */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><TrendingUp size={16} className="text-brand-500"/> Termômetro Limite MEI</h3>
            <span className="text-xs font-bold text-slate-500">R$ 81k/ano</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
            <div className={`h-2.5 rounded-full transition-all duration-1000 ${limitColor}`} style={{ width: `${limitPercentage}%` }}></div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Est. YTD: <b className="text-slate-700">R$ {estimatedRev.toLocaleString()}</b></span>
            <span className={limitPercentage > 90 ? 'text-red-600 font-bold' : 'text-slate-500'}>
              {limitPercentage > 90 ? 'Atenção ao Limite!' : 'Seguro'}
            </span>
          </div>
        </div>

        {/* 9. Card "Seu Contador" + 18. SLA de Tempo */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-14 h-14 bg-gradient-to-tr from-brand-100 to-brand-50 rounded-full flex items-center justify-center p-1 shrink-0">
             <div className="w-full h-full bg-white rounded-full flex items-center justify-center border border-brand-200 text-brand-600 font-bold text-lg">
                JA {/* Fake Avata Initials */}
             </div>
          </div>
          <div className="z-10">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">O seu Contador Dedicado</p>
            <h3 className="font-bold text-slate-900 mb-1">Julia Albuquerque</h3>
            <div className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full inline-flex font-medium border border-green-100">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               Resposta em até {isFreePlan ? '24h' : '2h'}
            </div>
          </div>
          {/* SLA Premium Upsell Hint */}
          {isFreePlan && (
            <div className="absolute inset-0 bg-slate-900/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20 p-4 text-center">
              <span className="text-xs font-medium mb-2">Quer prioridade VIP (1 hora)?</span>
              <Button variant="primary" size="sm" className="!py-1.5 !text-xs" onClick={handleUpgradeIntent}>Fazer Upgrade</Button>
            </div>
          )}
        </div>

      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* COLUNA ESQUERDA (Principal Operacional) */}
        <div className="flex-1 space-y-6">

          {/* 12. Mural de Avisos Contábil */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-0.5"><Bell size={16} /></div>
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Avisos Importantes: Mudança no Emissor de NF</h4>
              <p className="text-xs text-blue-800/80 leading-relaxed mb-2">
                A partir de 1º de Setembro, todos os MEIs deverão emitir nota fiscal de serviço através do portal Nacional e não mais pelos portais das prefeituras.
              </p>
              <button className="text-xs font-bold text-brand-600 hover:text-brand-700">Ler comunicado completo &rarr;</button>
            </div>
          </div>

          {/* 5, 3, 6, 11 - Ações Rápidas (Painel de Controlo) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={() => !isFreePlan ? setIsNfModalOpen(true) : handleUpgradeIntent()} className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center text-center group ${isFreePlan ? 'bg-slate-50 border-slate-200 opacity-80 cursor-not-allowed' : 'bg-white border-brand-100 hover:border-brand-400 hover:shadow-md hover:shadow-brand-500/10'}`}>
               <div className={`p-3 rounded-[1rem] mb-3 transition-transform group-hover:-translate-y-1 ${isFreePlan ? 'bg-slate-200 text-slate-500' : 'bg-brand-50 text-brand-600'}`}>
                 <FileText size={20} />
               </div>
               <span className="text-sm font-bold text-slate-800">Emitir Nota</span>
               {isFreePlan && <span className="text-[10px] text-amber-600 font-medium mt-1 flex items-center gap-1"><AlertCircle size={10}/> Plano Premium</span>}
            </button>
            
            <button onClick={handleDownloadDAS} className="bg-white border border-brand-100 hover:border-brand-400 p-4 rounded-2xl shadow-sm hover:shadow-md hover:shadow-brand-500/10 transition-all flex flex-col items-center justify-center text-center group">
               <div className="p-3 bg-brand-50 text-brand-600 rounded-[1rem] mb-3 transition-transform group-hover:-translate-y-1">
                 <DownloadCloud size={20} />
               </div>
               <span className="text-sm font-bold text-slate-800 leading-tight">Baixar DAS<br/>do Mês</span>
            </button>

            <button onClick={() => fileInputRef.current?.click()} className="bg-white border border-brand-100 hover:border-brand-400 p-4 rounded-2xl shadow-sm hover:shadow-md hover:shadow-brand-500/10 transition-all flex flex-col items-center justify-center text-center group">
               <div className="p-3 bg-brand-50 text-brand-600 rounded-[1rem] mb-3 transition-transform group-hover:-translate-y-1">
                 <Upload size={20} />
               </div>
               <span className="text-sm font-bold text-slate-800 leading-tight">Enviar<br/>Documento</span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleUploadDocument} />

            <button onClick={() => setIsSupportModalOpen(true)} className="bg-white border border-brand-100 hover:border-brand-400 p-4 rounded-2xl shadow-sm hover:shadow-md hover:shadow-brand-500/10 transition-all flex flex-col items-center justify-center text-center group">
               <div className="p-3 bg-brand-50 text-brand-600 rounded-[1rem] mb-3 transition-transform group-hover:-translate-y-1">
                 <LifeBuoy size={20} />
               </div>
               <span className="text-sm font-bold text-slate-800 leading-tight">Abrir<br/>Chamado</span>
            </button>
          </div>


          {/* 17. Cofre de Documentos Otimizado por Pastas */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Cofre Digital</h3>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-100 pb-2 overflow-x-auto custom-scrollbar">
              {['todos', 'impostos', 'notas'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveDocTab(t as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${activeDocTab === t ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {loadingDocs ? (
                <div className="flex items-center justify-center p-8 text-slate-400"><Loader2 size={24} className="animate-spin" /></div>
              ) : filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <FileText size={32} className="text-slate-300" />
                  <p className="text-sm text-slate-500 max-w-xs">Ainda não existem documentos nesta categoria do seu cofre.</p>
                </div>
              ) : (
                filteredDocs.map((doc, index) => (
                  <div key={index} className="flex flex-col gap-2 p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg shrink-0"><FileText size={16} /></div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Adicionado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <button onClick={() => downloadDocument(doc.name)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"><DownloadCloud size={18} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 18. Quadro de Chamados e Solicitações */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><MessageSquare size={18} className="text-brand-500"/> Meus Chamados de Atendimento</h3>
            <p className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-lg w-fit"><Clock size={14} className="text-brand-500"/> Prazo máximo de resposta da nossa equipa: <strong className="text-slate-700">até 4 horas úteis</strong>.</p>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
               {myTickets.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Você ainda não possui chamados abertos.</div>
               ) : (
                  myTickets.map(t => (
                    <div key={t.id} className="p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white hover:bg-slate-50/50 transition-colors">
                       <div className="flex gap-4 items-center">
                         <div className={`p-2.5 rounded-xl shrink-0 ${t.type === 'nf_emission' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                           {t.type === 'nf_emission' ? <FileText size={18}/> : <MessageSquare size={18}/>}
                         </div>
                         <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{new Date(t.created_at).toLocaleDateString('pt-BR')} às {new Date(t.created_at).toLocaleTimeString('pt-BR').slice(0,5)}</p>
                           <h4 className="text-sm font-bold text-slate-800">{t.type === 'nf_emission' ? 'Emissão de NF' : 'Suporte Financeiro / Dúvida'}</h4>
                           <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-sm">{t.type === 'nf_emission' ? `Cliente: ${t.details.client_document} | R$ ${t.details.value}` : t.details.description}</p>
                         </div>
                       </div>
                       <div className="shrink-0 flex self-end md:self-auto">
                         <span className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border ${t.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : t.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                           {t.status === 'completed' ? 'Concluído' : t.status === 'in_progress' ? 'Em Andamento' : 'Pendente (Aguardando)'}
                         </span>
                       </div>
                    </div>
                  ))
               )}
            </div>
          </div>

          {/* Acordeão do Perfil (Formulário Antigo Recolhível) */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all">
             <button onClick={() => setIsProfileFormOpen(!isProfileFormOpen)} className="flex items-center justify-between w-full p-6 md:px-8 bg-white hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><Briefcase size={20} /></div>
                  <div className="text-left">
                     <h2 className="font-bold text-slate-900">Editar Perfil e Dados Empresariais</h2>
                     <p className="text-xs text-slate-500">CNPJ, Morada, Contacto e Faturamento</p>
                  </div>
                </div>
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isProfileFormOpen ? 'rotate-180' : ''}`}/>
             </button>
             
             {isProfileFormOpen && (
               <div className="p-6 md:p-8 border-t border-slate-100">
                  <form onSubmit={handleSaveCompanyData} className="space-y-6">
                    {/* (Mesmo form de antes, compactado verticalmente) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-slate-600 mb-1 block">Tipo Doc</label><select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={documentType} onChange={e=>setDocumentType(e.target.value)}><option>CNPJ</option><option>CPF</option></select></div>
                      <div><label className="text-xs font-bold text-slate-600 mb-1 block">Número</label><input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="00.000.000/0000-00" value={documentNumber} onChange={e=>setDocumentNumber(e.target.value)}/></div>
                      <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600 mb-1 block">Razão Social</label><input type="text" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={companyName} onChange={e=>setCompanyName(e.target.value)}/></div>
                      <div><label className="text-xs font-bold text-slate-600 mb-1 block">Telefone</label><input type="tel" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={phone} onChange={e=>setPhone(e.target.value)}/></div>
                      <div><label className="text-xs font-bold text-slate-600 mb-1 block">CEP</label><input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={zipCode} onChange={e=>setZipCode(e.target.value)}/></div>
                      <div className="md:col-span-2"><label className="text-xs font-bold text-slate-600 mb-1 block">Ramo de Atuação</label><input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={businessSegment} onChange={e=>setBusinessSegment(e.target.value)}/></div>
                    </div>
                    {saveMessage && <div className={`p-4 rounded-xl text-sm ${saveMessage.type==='success'?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>{saveMessage.text}</div>}
                    <div className="flex justify-end pt-4"><Button variant="outline" size="sm" type="submit" disabled={isSaving}>{isSaving ? 'A guardar...' : 'Guardar Alterações'}</Button></div>
                  </form>
               </div>
             )}
          </div>

        </div>

        {/* COLUNA DIREITA (Widgets Auxiliares) */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-6">


          {/* Upsell Widget */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Plano Atual</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold capitalize">{profile?.plan_type || 'Carregando...'}</span>
              {isFreePlan && <span className="px-2 py-0.5 bg-white/10 text-[10px] font-bold rounded text-white border border-white/20">Basic</span>}
            </div>
            {isFreePlan && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <Button variant="primary" fullWidth size="sm" className="!py-2" onClick={handleUpgradeIntent}>Desbloquear Contabilidade Completa</Button>
              </div>
            )}
          </div>

          {/* 2. Calendário Fiscal Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Calendar size={16} className="text-brand-500"/> Agenda Fiscal</h3>
            <div className="space-y-3">
               <div className={`flex items-start gap-3 p-3 rounded-xl border ${dasDaysLeft <= 5 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                 <div className={`bg-white font-bold border rounded-lg min-w-[40px] min-h-[40px] flex flex-col items-center justify-center shadow-sm ${dasDaysLeft <= 5 ? 'text-red-600 border-red-200' : 'text-blue-600 border-blue-200'}`}>
                   <span className="text-[10px] uppercase leading-none mb-0.5">Dia</span>
                   <span className="text-lg leading-none">20</span>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-800">Pagamento DAS</h4>
                   <p className={`text-xs font-medium ${dasDaysLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                     {dasDaysLeft === 0 ? 'Vence Hoje!' : dasDaysLeft < 0 ? 'Atrasado!' : `Vence em ${dasDaysLeft} dias`}
                   </p>
                 </div>
               </div>

            </div>
          </div>

          {/* 8. Gestor de Certificado Digital */}
          {!isFreePlan && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield size={16} className="text-brand-500"/> Certificado A1</h3>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0"><CheckCircle2 size={24}/></div>
                 <div>
                   <p className="text-sm font-bold text-slate-800">Ativo e Configurado</p>
                   <p className="text-xs text-slate-400">Válido até 12/10/2026</p>
                 </div>
               </div>
            </div>
          )}




          {/* 16. Atalhos Gov.br */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Links Oficiais GOV</h3>
             <div className="grid grid-cols-2 gap-2">
               <a href="https://acesso.gov.br/" target="_blank" className="flex flex-col items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200 text-slate-600">
                 <ExternalLink size={16} /> <span className="text-[10px] font-bold">Gov.br</span>
               </a>
               <a href="https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao" target="_blank" className="flex flex-col items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200 text-slate-600">
                 <ExternalLink size={16} /> <span className="text-[10px] font-bold">PGMEI</span>
               </a>
             </div>
          </div>

        </div>
      </div>

      {/* --- MODAIS DE SUPORTE SIMULADAS --- */}

      {/* Modal Emitir NF */}
      {isNfModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsNfModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full"><X size={20}/></button>
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6"><FileText size={24}/></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Solicitar Emissão</h2>
            <p className="text-sm text-slate-500 mb-6">Preencha os dados básicos. A nossa equipa emitirá a nota e disponibilizará no cofre.</p>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-slate-700 block mb-1">CNPJ/CPF do Cliente</label><input type="text" value={nfClientDoc} onChange={e => setNfClientDoc(e.target.value)} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500" placeholder="00.000.000/0000-00"/></div>
              <div><label className="text-xs font-bold text-slate-700 block mb-1">Valor do Serviço (R$)</label><input type="number" value={nfValue} onChange={e => setNfValue(e.target.value)} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500" placeholder="Ex: 1500.00"/></div>
              <Button fullWidth onClick={handleSubmitNf} disabled={isSubmittingNf}>{isSubmittingNf ? 'Enviando...' : 'Enviar Pedido'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suporte Aberto */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => { setIsSupportModalOpen(false); setShowTicketForm(false); setTicketText(''); }} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full"><X size={20}/></button>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"><MessageSquare size={32}/></div>
            
            {!showTicketForm ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Como prefere ser atendido?</h2>
                <div className="space-y-3">
                  <Button fullWidth onClick={() => handleWhatsAppRedirect('suporte')} className="bg-[#25D366] hover:bg-[#1ebd5b] text-white border-0">Chamar no WhatsApp Direto</Button>
                  <Button variant="outline" fullWidth onClick={() => setShowTicketForm(true)}>Abrir Ticket no Painel</Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">Abrir Chamado de Suporte</h2>
                <p className="text-sm text-slate-500 mb-6 text-center">Descreva a sua dúvida ou solicitação e a nossa equipa entrará em contacto.</p>
                <div className="space-y-4">
                   <textarea 
                     value={ticketText} onChange={e => setTicketText(e.target.value)} 
                     rows={4}
                     className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 custom-scrollbar" 
                     placeholder="Ex: Preciso de ajuda para parcelar os meus atrasos..."
                   ></textarea>
                   <div className="flex gap-2">
                     <Button variant="outline" fullWidth onClick={() => setShowTicketForm(false)}>Voltar</Button>
                     <Button fullWidth onClick={handleOpenTicket} disabled={isSubmittingTicket || !ticketText.trim()}>{isSubmittingTicket ? 'Enviando...' : 'Enviar Chamado'}</Button>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE UPGRADE (Original Preservado) */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setIsUpgradeModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-full z-10"><X size={20} /></button>
            <div className="p-8 md:p-12">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete a sua contabilidade</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Planos Cards (Simplificados na view atual, mas preservando hrefs) */}
                <div className="border border-slate-200 rounded-3xl p-6 hover:border-brand-500">
                  <h3 className="text-xl font-bold">MEI START</h3>
                  <div className="text-3xl font-bold mt-2 mb-6">R$ 89<span className="text-lg text-slate-500">/mês</span></div>
                  <Button variant="outline" fullWidth onClick={() => handleDynamicUpgrade('https://buy.stripe.com/test_7sYdR89dt0hg6dxeKJdAk01')}>Assinar</Button>
                </div>
                <div className="border-2 border-brand-500 rounded-3xl p-6 shadow-xl relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">RECOMENDADO</span>
                  <h3 className="text-xl font-bold text-brand-900">MEI ESSENCIAL</h3>
                  <div className="text-3xl font-bold mt-2 mb-6">R$ 129<span className="text-lg text-slate-500">/mês</span></div>
                  <Button variant="primary" fullWidth onClick={() => handleDynamicUpgrade('https://buy.stripe.com/test_eVqeVcfBR7JI7hB321dAk02')}>Assinar</Button>
                </div>
                <div className="border border-slate-200 rounded-3xl p-6 hover:border-slate-400 bg-slate-50">
                  <h3 className="text-xl font-bold">MEI PREMIUM</h3>
                  <div className="text-3xl font-bold mt-2 mb-6">R$ 169<span className="text-lg text-slate-500">/mês</span></div>
                  <Button variant="outline" fullWidth className="bg-white" onClick={() => handleDynamicUpgrade('https://buy.stripe.com/test_7sYcN4blBe867hB321dAk03')}>Assinar</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
