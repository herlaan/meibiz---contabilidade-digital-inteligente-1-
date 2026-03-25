import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MeiOpportunity } from './components/MeiOpportunity';
import { OfficeFeatures } from './components/OfficeFeatures';
import { Segments } from './components/Segments';
import { JourneySelection } from './components/JourneySelection';
import { HowItWorks } from './components/HowItWorks';
import { Plans } from './components/Plans';
import { SavingsSimulator } from './components/SavingsSimulator';
import { SuccessStories } from './components/SuccessStories';
import { ComparativeTable } from './components/ComparativeTable';
import { AdditionalSolutions } from './components/AdditionalSolutions';
import { FAQ } from './components/FAQ';
import { SocialProof } from './components/SocialProof';
import { Institutional } from './components/Institutional';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { TechDivider } from './components/TechDivider';
import { CostCalculator } from './components/CostCalculator';
import { PjCltCalculator } from './components/PjCltCalculator';
import { FactorRCalculator } from './components/FactorRCalculator';
import { RpaCalculator } from './components/RpaCalculator';
import { TaxReformCalculator } from './components/TaxReformCalculator';
import { OpenMeiFree } from './components/OpenMeiFree';
import { LeaveMeiPage } from './components/LeaveMeiPage';
import { ChangeAccountantPage } from './components/ChangeAccountantPage';
import { CompleteAccountingPage } from './components/CompleteAccountingPage';
import { AccountingAdvisoryPage } from './components/AccountingAdvisoryPage';
import { AiChatWidget } from './components/AiChatWidget';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// ScrollToTop component to handle window scroll and hash navigation
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const HomePage: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    const elements = document.querySelectorAll('.reveal, .reveal-scale');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="snap-y snap-proximity lg:snap-mandatory">
      <div className="snap-start"><Hero /></div>
      <TechDivider />
      <div className="snap-start"><MeiOpportunity /></div>
      <TechDivider />
      <OfficeFeatures />
      <Segments />
      <div className="snap-start"><SavingsSimulator /></div>
      <HowItWorks />
      <div className="snap-start" id="planos"><Plans /></div>
      <ComparativeTable />
      <SuccessStories />
      <JourneySelection />
      <AdditionalSolutions />
      <div id="faq"><FAQ /></div>
      <SocialProof />
      <Institutional />
      <CallToAction />
    </div>
  );
};

// Novo Layout Público (Casca para quem não está no Dashboard)
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden font-sans text-slate-900 bg-slate-950">
      <Navbar />
      <main className="flex-grow bg-offwhite">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// ProtectedRoute component for access control
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando...</div>;
  
  if (!isLoggedIn) {
    // Redirect to home and try to scroll to plans after a short delay via state or hash
    return <Navigate to="/#planos" replace />;
  }
  return element;
};

// Componente para proteger rotas exclusivas de Admin
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { profile, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen flex items-center justify-center font-sans text-slate-400">A validar permissões...</div>;
  
  // Se não for admin, volta para o Dashboard comum
  if (!profile?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* MUNDO PÚBLICO: Usa a Navbar e o Footer tradicionais */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        
        {/* Calculadoras Públicas */}
        <Route path="/calculadora-custo-abertura" element={<CostCalculator />} />
        <Route path="/calculadora-pj-clt" element={<NavigationWrapper element={PjCltCalculator} />} />
        <Route path="/calculadora-fator-r" element={<NavigationWrapper element={FactorRCalculator} />} />
        <Route path="/calculadora-rpa" element={<NavigationWrapper element={RpaCalculator} />} />
        <Route path="/calculadora-reforma-tributaria" element={<NavigationWrapper element={TaxReformCalculator} />} />
        <Route path="/abrir-mei-gratis" element={<NavigationWrapper element={OpenMeiFree} />} />
        
        {/* Páginas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        
        {/* Serviços Públicos */}
        <Route path="/deixar-de-ser-mei" element={<NavigationWrapper element={LeaveMeiPage} />} />
        <Route path="/trocar-de-contador" element={<NavigationWrapper element={ChangeAccountantPage} />} />
        <Route path="/contabilidade-completa" element={<NavigationWrapper element={CompleteAccountingPage} />} />
        <Route path="/assessoria-contabil" element={<NavigationWrapper element={AccountingAdvisoryPage} />} />
      </Route>

      {/* MUNDO PRIVADO (SaaS): Usa a Sidebar e esconde a Navbar/Footer */}
      <Route element={<ProtectedRoute element={<DashboardLayout />} />}>
        {/* O Dashboard será renderizado DENTRO do DashboardLayout */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rota de Admin protegida */}
        <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <AiChatWidget />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

// Helper to wrap components that expect onBack
const NavigationWrapper: React.FC<{ element: React.FC<any> }> = ({ element: Element }) => {
  const navigate = useNavigate();
  return <Element onBack={() => navigate('/')} />;
};

export default App;