import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.char');
        gsap.fromTo(chars, { opacity: 0, y: 80, rotateX: -40 }, {
          opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.03, ease: 'power3.out', delay: 0.3,
        });
      }
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out',
        });
      }
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6, delay: 1.3, ease: 'power3.out',
        });
      }
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.2, opacity: 0.6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to('[data-parallax]', { x: x * 20, y: y * 20, duration: 1, ease: 'power2.out', overwrite: 'auto' });
    };
    container.addEventListener('mousemove', onMove);
    return () => container.removeEventListener('mousemove', onMove);
  }, []);

  const title = "Turn Customer Feedback\nInto Product Intelligence.";

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#8B5CF6]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#A855F7]/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMjBoNDBNMjAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 text-[10px] font-mono text-[#8B5CF6] tracking-widest uppercase font-bold">
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Product Intelligence Platform</span>
        </div>

        <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl">
          {title.split('').map((char, i) => (
            <span key={i} className={`char inline-block ${char === '\n' ? 'block h-0' : ''}`}
              style={char === '\n' ? { display: 'block', height: 0 } : undefined}>
              {char === '\n' ? '' : char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p ref={subtitleRef} className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed font-light">
          Transform scattered customer feedback, research data, and feature requests into actionable product intelligence. DiscoveryOS analyzes everything — from support tickets to user interviews — and generates an AI-driven product roadmap automatically.
        </p>

        <div ref={ctaRef} className="flex items-center gap-4">
          <button onClick={onGetStarted} className="group px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-[0.97] text-sm font-bold text-white flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)]">
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className="px-6 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] active:scale-[0.97] text-sm font-bold text-zinc-300 flex items-center gap-2 transition-all">
            <Play className="w-4 h-4" />
            <span>Watch Demo</span>
          </button>
        </div>

        <div className="mt-8 relative w-full max-w-[900px]" data-parallax>
          <div ref={glowRef} className="absolute -inset-4 bg-gradient-to-r from-[#8B5CF6]/10 via-transparent to-[#A855F7]/10 rounded-3xl blur-xl" />
          <div className="relative rounded-2xl border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden bg-[#0C0C12]">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              <div className="ml-4 px-3 py-1 rounded-md bg-white/5 text-[8px] font-mono text-zinc-500">dashboard.discoveryos.dev</div>
            </div>
            <div className="p-4 flex gap-3" style={{ minHeight: 340 }}>
              <div className="w-1/4 flex flex-col gap-2">
                <div className="h-8 rounded-lg bg-white/5" />
                <div className="h-8 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20" />
                <div className="h-8 rounded-lg bg-white/5" />
                <div className="h-8 rounded-lg bg-white/5" />
                <div className="h-8 rounded-lg bg-white/5" />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex gap-3">
                  {[60, 45, 55, 40, 50].map((w, i) => (
                    <div key={i} className="flex-1 p-3 rounded-xl bg-white/5">
                      <div className="h-2 w-2/3 rounded bg-white/10 mb-2" />
                      <div className="h-4 w-1/2 rounded bg-gradient-to-r from-[#8B5CF6]/40 to-[#A855F7]/40" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-1">
                  <div className="flex-[3] p-3 rounded-xl bg-white/5 flex flex-col gap-2">
                    <div className="h-2 w-1/3 rounded bg-white/10" />
                    <div className="flex-1 rounded bg-gradient-to-b from-[#8B5CF6]/10 to-transparent" />
                  </div>
                  <div className="flex-[2] p-3 rounded-xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 flex flex-col gap-2">
                    <div className="h-2 w-1/2 rounded bg-white/10" />
                    {[70, 50, 80, 40, 60].map((h, j) => (
                      <div key={j} className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]" style={{ width: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
