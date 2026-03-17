import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden font-sans text-slate-900 bg-offwhite">
        <Navbar isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculadora-custo-abertura" element={<CostCalculator />} />
            <Route path="/calculadora-pj-clt" element={<NavigationWrapper element={PjCltCalculator} />} />
            <Route path="/calculadora-fator-r" element={<NavigationWrapper element={FactorRCalculator} />} />
            <Route path="/calculadora-rpa" element={<NavigationWrapper element={RpaCalculator} />} />
            <Route path="/calculadora-reforma-tributaria" element={<NavigationWrapper element={TaxReformCalculator} />} />
            <Route path="/abrir-mei-gratis" element={<NavigationWrapper element={OpenMeiFree} />} />
            <Route path="/deixar-de-ser-mei" element={<NavigationWrapper element={LeaveMeiPage} />} />
            <Route path="/trocar-de-contador" element={<NavigationWrapper element={ChangeAccountantPage} />} />
            <Route path="/contabilidade-completa" element={<NavigationWrapper element={CompleteAccountingPage} />} />
            <Route path="/assessoria-contabil" element={<NavigationWrapper element={AccountingAdvisoryPage} />} />
          </Routes>
        </main>
        <AiChatWidget isLoggedIn={isLoggedIn} />
        <Footer />
      </div>
    </Router>
  );
};

// Helper to wrap components that expect onBack
const NavigationWrapper: React.FC<{ element: React.FC<any> }> = ({ element: Element }) => {
  const navigate = useNavigate();
  return <Element onBack={() => navigate('/')} />;
};

export default App;