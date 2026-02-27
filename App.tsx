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

const App: React.FC = () => {
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

    // Observe both standard reveal and scale reveal elements
    const elements = document.querySelectorAll('.reveal, .reveal-scale');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden font-sans text-slate-900 bg-offwhite snap-y snap-proximity lg:snap-mandatory">
      <Navbar />
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
      <Footer />
    </div>
  );
};

export default App;