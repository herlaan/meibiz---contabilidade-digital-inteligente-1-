// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Building2, FileText, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { OnboardingModal } from '../components/OnboardingModal';

export const DashboardLayout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Painel Geral', path: '/dashboard' },
  ];

  // Se for admin, injetamos a opção extra no menu
  if (profile?.is_admin) {
    menuItems.push({ icon: Settings, label: 'Admin / Clientes', path: '/admin' });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <OnboardingModal />
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-slate-300 border-r border-slate-800">
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer block w-max">
          <img src="/logos/logo-white.png" alt="MeiBiz" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-brand-600/10 text-brand-500 font-medium' 
                    : 'hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Mobile & Top Bar */}
        <header className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500">
              <Menu size={24} />
            </button>
            <Link to="/" className="cursor-pointer">
              <img src="/logos/logo-blue.png" alt="MeiBiz" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
          </div>
          
          <div className="hidden md:block">
            {/* Espaço vazio à esquerda no desktop */}
          </div>

          {/* Perfil no Topo */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{profile?.full_name || 'Usuário'}</p>
              <p className="text-xs text-slate-500 capitalize">Plano {profile?.plan_type || 'Básico'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Menu Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 md:hidden flex">
            <aside className="w-64 bg-slate-950 h-full flex flex-col">
              <div className="p-4 flex justify-end border-b border-slate-800">
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-2 mt-4">
                 {/* Reutilizamos os mesmos links do menu desktop aqui */}
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-900"
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Aqui é onde as páginas (Dashboard, Configurações, etc) serão renderizadas */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
