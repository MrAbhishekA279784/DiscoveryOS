import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import TrustedBy from './TrustedBy';
import FeaturesGrid from './FeaturesGrid';
import Architecture from './Architecture';
import TechStack from './TechStack';
import Statistics from './Statistics';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-reveal]', {
        onEnter: (elements) => {
          elements.forEach((el) => {
            gsap.fromTo(el, { opacity: 0, y: 60 }, {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
            });
          });
        },
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-[#07070A] text-white overflow-x-hidden font-sans">
      <Navbar onGetStarted={onGetStarted} />
      <HeroSection onGetStarted={onGetStarted} />
      <TrustedBy />
      <FeaturesGrid />
      <Architecture />
      <TechStack />
      <Statistics />
      <Testimonials />
      <FAQ />
      <FinalCTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
