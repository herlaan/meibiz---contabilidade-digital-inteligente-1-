import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MeiOpportunity } from './components/MeiOpportunity';
import { OfficeFeatures } from './components/OfficeFeatures';
import { Segments } from './components/Segments';
import { JourneySelection } from './components/JourneySelection';
import { HowItWorks } from './components/HowItWorks';
import { Plans } from './components/Plans';
import { SavingsSimulator } from './components/SavingsSimulator';
import { SuccessStories } from './components/SuccessStories'; // Added
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
import { Settings, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  type ViewState = 'home' | 'cost-calculator' | 'pj-clt' | 'factor-r' | 'rpa' | 'tax-reform' | 'abrir-mei' | 'deixar-mei' | 'trocar-contador' | 'contabilidade-completa' | 'assessoria';
  const [currentView, setCurrentView] = React.useState<ViewState>('home');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

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
  }, [currentView]); // Re-observe when view changes

  const navigateTo = (view: ViewState) => {
    const protectedViews = ['deixar-mei', 'trocar-contador', 'contabilidade-completa', 'assessoria'];

    // Redirect to plans if trying to access protected route while logged out
    if (protectedViews.includes(view) && !isLoggedIn) {
      setCurrentView('home');
      setTimeout(() => {
        const planosEl = document.getElementById('planos');
        if (planosEl) planosEl.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  if (currentView !== 'home') {
    return (
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden font-sans text-slate-900 bg-slate-950">
        <Navbar onNavigate={navigateTo} isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />
        <main className="flex-grow">
          {currentView === 'cost-calculator' && <CostCalculator onBack={() => navigateTo('home')} />}
          {currentView === 'pj-clt' && <PjCltCalculator onBack={() => navigateTo('home')} />}
          {currentView === 'factor-r' && <FactorRCalculator onBack={() => navigateTo('home')} />}
          {currentView === 'rpa' && <RpaCalculator onBack={() => navigateTo('home')} />}
          {currentView === 'tax-reform' && <TaxReformCalculator onBack={() => navigateTo('home')} />}
          {currentView === 'abrir-mei' && <OpenMeiFree onBack={() => navigateTo('home')} />}
          {currentView === 'deixar-mei' && <LeaveMeiPage onBack={() => navigateTo('home')} />}
          {currentView === 'trocar-contador' && <ChangeAccountantPage onBack={() => navigateTo('home')} />}
          {currentView === 'contabilidade-completa' && <CompleteAccountingPage onBack={() => navigateTo('home')} />}
          {currentView === 'assessoria' && <AccountingAdvisoryPage onBack={() => navigateTo('home')} />}
        </main>
        <AiChatWidget isLoggedIn={isLoggedIn} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden font-sans text-slate-900 bg-offwhite snap-y snap-proximity lg:snap-mandatory">
      <Navbar onNavigate={navigateTo} isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />
      <main className="flex-grow">
        <div className="snap-start"><Hero /></div>
        <TechDivider />

        {/* Humanization Step 1: Specialist Image in MeiOpportunity */}
        <div className="snap-start"><MeiOpportunity /></div>

        {/* Tech Transition */}
        <TechDivider />
        <OfficeFeatures />
        <Segments />

        <div className="snap-start"><SavingsSimulator /></div>

        <HowItWorks />
        <div className="snap-start"><Plans /></div>
        <ComparativeTable />

        {/* Humanization Step 3: Success Story Case Study */}
        <SuccessStories />

        <JourneySelection />
        <AdditionalSolutions />

        <FAQ />

        {/* Humanization Step 4: Real Client Photos */}
        <SocialProof />

        {/* Humanization Step 5: Behind the Scenes */}
        <Institutional />

        <CallToAction />
      </main>
      <AiChatWidget isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
};

export default App;