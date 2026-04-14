import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Twitter, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2 lg:col-span-2 pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6 block w-max cursor-pointer hover:opacity-80 transition-opacity">
              <img src="/logos/logo-blue.png?v=2" alt="MeiBiz Logo" className="h-12 md:h-14 w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              A maior plataforma de contabilidade online do Brasil para micro e pequenas empresas. Simplificamos sua rotina para você focar no crescimento.
            </p>
            <div className="flex space-x-4 mb-8">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors"><Instagram size={18} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors"><Linkedin size={18} /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors"><Facebook size={18} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors"><Twitter size={18} /></a>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
               <span className="flex items-center gap-1"><Lock size={14} /> Site Seguro (SSL)</span>
               <span className="flex items-center gap-1"><ShieldCheck size={14} /> Dados Protegidos</span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-medium mb-4">A Empresa</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-600 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Imprensa</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Indique e Ganhe</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-medium mb-4">Serviços</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/abrir-mei-gratis" className="hover:text-brand-600 transition-colors">Abrir Empresa Grátis</Link></li>
              <li><Link to="/trocar-de-contador" className="hover:text-brand-600 transition-colors">Migrar Contabilidade</Link></li>
              <li><Link to="/contabilidade-completa" className="hover:text-brand-600 transition-colors">Contabilidade Completa</Link></li>
              <li><Link to="/calculadora-custo-abertura" className="hover:text-brand-600 transition-colors">Calculadora de Impostos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-medium mb-4">Conteúdos</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-brand-600 transition-colors">Blog MeiBiz</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Materiais Ricos</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Central de Ajuda</a></li>
              <li><Link to="/calculadora-pj-clt" className="hover:text-brand-600 transition-colors">Calculadora PJ x CLT</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} MeiBiz Contabilidade Ltda. CNPJ: 63.860.520/0001-94. Todos os direitos reservados.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-brand-600">Termos de Uso</a>
             <a href="#" className="hover:text-brand-600">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};