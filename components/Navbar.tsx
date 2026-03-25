import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronUp, ChevronRight, LogOut, User } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';

const CCC_URL = 'https://dfe-portal.svrs.rs.gov.br/Nfe/Ccc';

const brazilStates = [
  { uf: 'AC', name: 'Acre', href: 'https://sefazonline.ac.gov.br/sefazonline/app.wmsintegralista' },
  { uf: 'AL', name: 'Alagoas', href: 'https://sintegra.sefaz.al.gov.br/#/' },
  { uf: 'AP', name: 'Amapá', href: 'https://www.sefaz.ap.gov.br/sate/seg/SEGf_AcessarFuncao.jsp?cdFuncao=CAD_011' },
  { uf: 'AM', name: 'Amazonas', href: 'http://online.sefaz.am.gov.br/sintegra/index.asp' },
  { uf: 'BA', name: 'Bahia', href: 'https://portal.sefaz.ba.gov.br/scripts/cadastro/cadastroBa/consultaBa.asp' },
  { uf: 'CE', name: 'Ceará', href: 'http://internet-consultapublica.apps.sefaz.ce.gov.br/sintegra/preparar-consultar' },
  { uf: 'DF', name: 'Distrito Federal', href: 'http://agnet.fazenda.df.gov.br/area.cfm?id_area=1140' },
  { uf: 'ES', name: 'Espírito Santo', href: CCC_URL }, // No specific link provided, keeping CCC
  { uf: 'GO', name: 'Goiás', href: 'http://appasp.sefaz.go.gov.br/Sintegra/Consulta/default.html' },
  { uf: 'MA', name: 'Maranhão', href: 'https://sistemas1.sefaz.ma.gov.br/sintegra/jsp/consultaSintegra/consultaSintegraFiltro.jsf' },
  { uf: 'MT', name: 'Mato Grosso', href: 'https://www.sefaz.mt.gov.br/cadastro/emissaocartao/emissaocartaocontribuinteacessodireto' },
  { uf: 'MS', name: 'Mato Grosso do Sul', href: 'https://cpe.sefaz.ms.gov.br/' },
  { uf: 'MG', name: 'Minas Gerais', href: CCC_URL }, // No specific link provided, keeping CCC
  { uf: 'PA', name: 'Pará', href: 'https://app.sefa.pa.gov.br/sintegra/' },
  { uf: 'PB', name: 'Paraíba', href: 'https://www.sefaz.pb.gov.br/sintegra/SINf_ConsultaSintegra.jsp' }, // Adjusted to https and removed digit in www
  { uf: 'PR', name: 'Paraná', href: 'http://www.sintegra.fazenda.pr.gov.br/sintegra/' },
  { uf: 'PE', name: 'Pernambuco', href: CCC_URL },
  { uf: 'PI', name: 'Piauí', href: CCC_URL },
  { uf: 'RJ', name: 'Rio de Janeiro', href: 'https://sucief-sincad-web.fazenda.rj.gov.br/sincad-web/index.jsf' },
  { uf: 'RN', name: 'Rio Grande do Norte', href: 'https://uvt2.set.rn.gov.br/#/services/consultaContribuinte' },
  { uf: 'RS', name: 'Rio Grande do Sul', href: 'https://www.sefaz.rs.gov.br/consultas/contribuinte' },
  { uf: 'RO', name: 'Rondônia', href: 'https://portalcontribuinte.sefin.ro.gov.br/Publico/parametropublica.jsp' },
  { uf: 'RR', name: 'Roraima', href: 'https://portalweb.sefaz.rr.gov.br/sintegra/servlet/wp_siate_consultasintegra' },
  { uf: 'SC', name: 'Santa Catarina', href: 'https://sat.sef.sc.gov.br/tax.NET/tax.net.cadastro/conssc_sitcad.aspx' },
  { uf: 'SP', name: 'São Paulo', href: 'https://www.cadesp.fazenda.sp.gov.br/(S(gh1x0gzmwq5esd0ijx1ygt1o))/Pages/Cadastro/Consultas/ConsultaPublica/ConsultaPublica.aspx' },
  { uf: 'SE', name: 'Sergipe', href: 'https://security.sefaz.se.gov.br/SIC/sintegra/index.jsp' },
  { uf: 'TO', name: 'Tocantins', href: 'http://sintegra.sefaz.to.gov.br/sintegra/servlet/wpsico01' }
];

type MenuItem = {
  label: string;
  href?: string;
  to?: string;
  isStateList?: boolean;
};

type MenuColumn = {
  title: string;
  items: MenuItem[];
};

export const Navbar: React.FC = () => {
  const { isLoggedIn, login, logout, signOut, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileContentsOpen, setIsMobileContentsOpen] = useState(false);
  const [mobileStateListOpen, setMobileStateListOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceColumns: MenuColumn[] = [
    {
      title: "Serviços de contabilidade:",
      items: [
        { label: "Abrir MEI Grátis", to: "/abrir-mei-gratis" },
        { label: "Deixar de ser MEI", to: "/deixar-de-ser-mei" },
        { label: "Trocar de contador", to: "/trocar-de-contador" },
        { label: "Contabilidade completa", to: "/contabilidade-completa" },
        { label: "Assessoria Contábil", to: "/assessoria-contabil" }
      ]
    },
    {
      title: "Serviços Gratuitos:",
      items: [
        { label: "Consulta CNPJ Receita Federal", href: "https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp" },
        { label: "Consulta Inscrição Estadual", isStateList: true },
        { label: "Consulta Inscrição Municipal SP", href: "https://ccm.prefeitura.sp.gov.br/login/contribuinte?tipo=F" }
      ]
    }
  ];

  const contentColumns: MenuColumn[] = [
    {
      title: "Calculadoras:",
      items: [
        { label: "Calculadora de Custo para abrir CNPJ", to: "/calculadora-custo-abertura" },
        { label: "Calculadora PJ x CLT", to: "/calculadora-pj-clt" },
        { label: "Calculadora de Fator R", to: "/calculadora-fator-r" },
        { label: "Calculadora de RPA online", to: "/calculadora-rpa" },
        { label: "Calculadora de Reforma Tributária", to: "/calculadora-reforma-tributaria" }
      ]
    },
    {
      title: "Nosso blog:",
      items: [
        { label: "Abertura de Empresa" },
        { label: "Simples Nacional" },
        { label: "Comparativo CLT x PJ" },
        { label: "Tabela Simples Nacional" },
        { label: "Ebook: Guia para ser PJ" }
      ]
    }
  ];

  const isActuallyScrolled = isScrolled || isMobileMenuOpen;
  const textColorClass = isActuallyScrolled ? 'text-slate-700 hover:text-brand-600' : 'text-white/90 hover:text-white';
  const logoTextClass = isActuallyScrolled ? 'text-slate-900' : 'text-white';
  const mobileTextClass = isActuallyScrolled ? 'text-slate-900' : 'text-white';
  const logoBgClass = isActuallyScrolled ? 'bg-brand-600 text-white' : 'bg-white text-brand-950';

  return (
    <header
      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
      className={`fixed z-50 ${
        isMobileMenuOpen
          ? 'top-0 left-0 w-full bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-100 shadow-sm'
          : isScrolled
            ? 'top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-full py-3 px-6'
            : 'top-0 left-0 w-full bg-transparent py-6 px-4 sm:px-6 lg:px-8 border-b border-transparent'
      }`}
    >
      <div className={`mx-auto ${isScrolled ? 'w-full' : 'max-w-7xl'}`}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <img 
              src={isActuallyScrolled ? "/logos/logo-blue.png" : "/logos/logo-white.png"} 
              alt="MeiBiz" 
              className="h-10 md:h-12 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center space-x-8">
              <li>
                <Link to="/" className={`font-medium transition-colors text-sm ${textColorClass}`}>
                  Home
                </Link>
              </li>
              <li className="relative group">
                <button className={`flex items-center gap-1 font-medium transition-colors text-sm focus:outline-none py-2 ${textColorClass}`}>
                  Serviços <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-0 w-[750px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 mt-2 z-50 cursor-default">
                  <div className="absolute top-0 left-8 -mt-2 w-4 h-4 bg-white border-t border-l border-slate-100 transform rotate-45"></div>
                  <div className="grid grid-cols-2 gap-8">
                    {serviceColumns.map((col, idx) => (
                      <div key={idx}>
                        <h4 className="font-medium text-slate-900 mb-4 text-sm">{col.title}</h4>
                        <ul className="space-y-3">
                          {col.items.map((item, i) => (
                            <li key={i} className="relative group/state">
                              {item.isStateList ? (
                                <>
                                  <button className="text-slate-500 hover:text-brand-600 text-sm transition-colors w-full text-left flex items-center justify-between">
                                    {item.label} <ChevronRight size={14} />
                                  </button>
                                  <div className="absolute left-full top-0 pl-2 w-[480px] hidden group-hover/state:block z-[60]">
                                    <div className="bg-white border border-slate-100 shadow-xl rounded-xl p-6">
                                      <h5 className="font-medium text-slate-900 mb-4 text-xs uppercase tracking-wide border-b border-slate-100 pb-2">Selecione o Estado</h5>
                                      <div className="grid grid-cols-3 gap-2">
                                        {brazilStates.map((st) => (
                                          <a key={st.uf} href={st.href} target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:text-brand-600 hover:bg-brand-50 p-2 rounded transition-colors text-center font-medium">
                                            {st.name} ({st.uf})
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : item.href ? (
                                <a href={item.href} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-600 text-sm transition-colors block">
                                  {item.label}
                                </a>
                              ) : item.to ? (
                                <Link to={item.to} className="text-slate-500 hover:text-brand-600 text-sm transition-colors block text-left">
                                  {item.label}
                                </Link>
                              ) : (
                                <button className="text-slate-500 hover:text-brand-600 text-sm transition-colors block text-left">
                                  {item.label}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </li>

              <li>
                <Link to="/#planos" className={`font-medium transition-colors text-sm ${textColorClass}`}>
                  Planos
                </Link>
              </li>

              <li className="relative group">
                <button className={`flex items-center gap-1 font-medium transition-colors text-sm focus:outline-none py-2 ${textColorClass}`}>
                  Conteúdos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[750px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-4 group-hover:translate-y-0 mt-2 z-50 cursor-default">
                  <div className="absolute top-0 left-1/2 -ml-2 -mt-2 w-4 h-4 bg-white border-t border-l border-slate-100 transform rotate-45"></div>
                  <div className="grid grid-cols-2 gap-8">
                    {contentColumns.map((col, idx) => (
                      <div key={idx}>
                        <h4 className="font-medium text-slate-900 mb-4 text-sm">{col.title}</h4>
                        <ul className="space-y-3">
                          {col.items.map((item, i) => (
                            <li key={i}>
                              {item.to ? (
                                <Link to={item.to} className="text-slate-500 hover:text-brand-600 text-sm transition-colors block text-left w-full">
                                  {item.label}
                                </Link>
                              ) : (
                                <button className="text-slate-500 hover:text-brand-600 text-sm transition-colors block text-left w-full">
                                  {item.label}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </li>

              <li><Link to="/#como-funciona" className={`font-medium transition-colors text-sm ${textColorClass}`}>Como funciona</Link></li>
              <li><Link to="/#faq" className={`font-medium transition-colors text-sm ${textColorClass}`}>Dúvidas?</Link></li>
            </ul>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isScrolled ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/10 border-white/20 text-white'}`}>
                  <User size={16} />
                  <span className="text-sm font-medium">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'}</span>
                </div>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors ${textColorClass} hover:underline`}
                >
                  Painel
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors" 
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className={`font-medium transition-colors text-sm hover:underline ${textColorClass}`}
                >
                  Entrar
                </Link>
                <Link to="/cadastro">
                  <Button variant={isScrolled ? 'primary' : 'white'} size="sm" className="font-medium rounded-full px-6">
                    Começar agora
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors ${mobileTextClass}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute top-full left-0 right-0 h-[calc(100vh-64px)] overflow-y-auto px-4 pt-4 text-slate-900 pb-20 shadow-xl rounded-b-2xl mt-0 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-2">
            <Link to="/" className="block text-lg font-medium py-3 border-b border-slate-100 text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <div className="border-b border-slate-100 pb-2">
              <button onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)} className="w-full flex justify-between items-center text-lg font-medium py-3 text-slate-900">
                Serviços {isMobileServicesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <div className={`space-y-6 overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? 'max-h-[1000px] pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                {serviceColumns.map((col, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl">
                    <h4 className="font-medium text-brand-600 mb-3 text-sm uppercase">{col.title}</h4>
                    <ul className="space-y-3 pl-2 border-l-2 border-slate-200">
                      {col.items.map((item, i) => (
                        <li key={i}>
                          {item.isStateList ? (
                            <div>
                              <button onClick={() => setMobileStateListOpen(!mobileStateListOpen)} className="text-slate-600 text-sm flex items-center w-full justify-between">
                                {item.label} {mobileStateListOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                              {mobileStateListOpen && (
                                <div className="mt-4 grid grid-cols-2 gap-2 pl-3 border-l-2 border-brand-100">
                                  {brazilStates.map((st) => (
                                    <a key={st.uf} href={st.href} target="_blank" rel="noreferrer" className="text-xs text-slate-500 py-1.5 block font-medium">
                                      {st.name} ({st.uf})
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : item.href ? (
                            <a href={item.href} target="_blank" rel="noreferrer" className="text-slate-600 text-sm block">{item.label}</a>
                          ) : item.to ? (
                            <Link to={item.to} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 text-sm block">{item.label}</Link>
                          ) : (
                            <button className="text-slate-600 text-sm block">{item.label}</button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/#planos" className="block text-lg font-medium py-3 border-b border-slate-100 text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Planos</Link>

            <div className="border-b border-slate-100 pb-2">
              <button onClick={() => setIsMobileContentsOpen(!isMobileContentsOpen)} className="w-full flex justify-between items-center text-lg font-medium py-3 text-slate-900">
                Conteúdos {isMobileContentsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <div className={`space-y-6 overflow-hidden transition-all duration-300 ${isMobileContentsOpen ? 'max-h-[1000px] pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                {contentColumns.map((col, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl">
                    <h4 className="font-medium text-brand-600 mb-3 text-sm uppercase">{col.title}</h4>
                    <ul className="space-y-3 pl-2 border-l-2 border-slate-200">
                      {col.items.map((item, i) => (
                        <li key={i}>
                          {item.to ? (
                            <Link to={item.to} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 text-sm block">{item.label}</Link>
                          ) : (
                            <button className="text-slate-600 text-sm block">{item.label}</button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/#como-funciona" className="block text-lg font-medium py-3 border-b border-slate-100 text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Como funciona</Link>
            <Link to="/#faq" className="block text-lg font-medium py-3 border-b border-slate-100 text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>Dúvidas?</Link>

            <div className="pt-6 flex flex-col gap-3">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-lg font-bold">
                      {user?.user_metadata?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 truncate max-w-[200px]">{user?.user_metadata?.name || user?.email?.split('@')[0]}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">{user?.email}</div>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-center block"
                  >
                    Painel de Controle
                  </Link>
                  <button onClick={handleLogout} className="w-full py-4 rounded-2xl border border-red-100 text-red-500 font-bold flex items-center justify-center gap-2">
                    <LogOut size={20} /> Sair
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="w-full py-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-center block"
                  >
                    Entrar
                  </Link>
                  <Link to="/cadastro" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth className="py-4 rounded-2xl">
                      Abrir minha empresa
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};