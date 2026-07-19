import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onGetStarted: () => void;
}

export default function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 text-[10px] font-mono text-[#8B5CF6] tracking-widest uppercase font-bold">
          <Sparkles className="w-3 h-3" />
          <span>Start Your Free Trial</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-2xl">
          Start Building <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">Smarter Products</span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed font-light">
          Join forward-thinking product teams who use DiscoveryOS to turn customer feedback into their competitive advantage. No credit card required.
        </p>
        <div className="flex items-center gap-4">
          <button onClick={onGetStarted} className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-[0.97] text-sm font-bold text-white flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)]">
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a href="#" className="flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] text-sm font-bold text-zinc-300 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
