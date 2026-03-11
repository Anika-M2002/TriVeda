import React, { useState, useCallback } from 'react';
import VideoIntro from './landing/VideoIntro';
import Navbar from './landing/Navbar';
import HeroSection from './landing/HeroSection';
import AboutSection from './landing/AboutSection';
import FeaturesSection from './landing/FeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import WhoItsForSection from './landing/WhoItsForSection';
import TestimonialsSection from './landing/TestimonialsSection';
import CTASection from './landing/CTASection';
import FooterSection from './landing/FooterSection';

export default function LandingPage() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {!introComplete && <VideoIntro onComplete={handleIntroComplete} />}

      <div
        className={`transition-opacity duration-700 ${introComplete ? 'opacity-100' : 'opacity-0'}`}
      >
        <Navbar visible={introComplete} />
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WhoItsForSection />
        <TestimonialsSection />
        <CTASection />
        <FooterSection />
      </div>
    </div>
  );
}
