import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface NavbarProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export default function Navbar({ onLogin, onGetStarted }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -80px',
        onUpdate: (self) => {
          if (self.progress > 0) {
            nav.classList.add('backdrop-blur-xl', 'bg-[#07070A]/80', 'border-b', 'border-white/5', 'shadow-[0_4px_30px_rgba(0,0,0,0.3)]');
          } else {
            nav.classList.remove('backdrop-blur-xl', 'bg-[#07070A]/80', 'border-b', 'border-white/5', 'shadow-[0_4px_30px_rgba(0,0,0,0.3)]');
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.3)]">
              <span className="text-xs font-bold text-white">D</span>
            </div>
            <span className="text-sm font-bold tracking-tight">DiscoveryOS</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Technology', 'Architecture', 'Pricing'].map((item) => (
              <a key={item} href="#" className="text-xs text-zinc-400 hover:text-white transition-colors font-medium tracking-wide">
                {item} {item === 'Pricing' && <span className="text-[8px] text-[#8B5CF6] ml-1 font-semibold">Soon</span>}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-medium">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>GitHub</span>
          </a>
          <button onClick={onLogin} className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/[0.03] transition-all">
            Login
          </button>
          <button onClick={onGetStarted} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-[0.97] text-xs font-bold text-white transition-all shadow-[0_4px_12px_rgba(139,92,246,0.3)]">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
