import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
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

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Public Calculators */}
      <Route path="/calculadora-custo-abertura" element={<CostCalculator />} />
      <Route path="/calculadora-pj-clt" element={<NavigationWrapper element={PjCltCalculator} />} />
      <Route path="/calculadora-fator-r" element={<NavigationWrapper element={FactorRCalculator} />} />
      <Route path="/calculadora-rpa" element={<NavigationWrapper element={RpaCalculator} />} />
      <Route path="/calculadora-reforma-tributaria" element={<NavigationWrapper element={TaxReformCalculator} />} />
      <Route path="/abrir-mei-gratis" element={<NavigationWrapper element={OpenMeiFree} />} />
      
      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route 
        path="/deixar-de-ser-mei" 
        element={<ProtectedRoute element={<NavigationWrapper element={LeaveMeiPage} />} />} 
      />
      <Route 
        path="/trocar-de-contador" 
        element={<ProtectedRoute element={<NavigationWrapper element={ChangeAccountantPage} />} />} 
      />
      <Route 
        path="/contabilidade-completa" 
        element={<ProtectedRoute element={<NavigationWrapper element={CompleteAccountingPage} />} />} 
      />
      <Route 
        path="/assessoria-contabil" 
        element={<ProtectedRoute element={<NavigationWrapper element={AccountingAdvisoryPage} />} />} 
      />

      <Route path="/auth/callback" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col w-full overflow-x-hidden font-sans text-slate-900 bg-slate-950">
          <Navbar />
          <main className="flex-grow bg-offwhite">
            <AppRoutes />
          </main>
          <AiChatWidget />
          <Footer />
        </div>
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