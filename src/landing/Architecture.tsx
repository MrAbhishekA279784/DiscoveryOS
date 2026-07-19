import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Upload, Cpu, Share2, BarChart3, Map } from 'lucide-react';

const steps = [
  { icon: Upload, label: 'Ingest Data', desc: 'Upload files, connect APIs, import from Slack, Jira, Zendesk, and more.' },
  { icon: Cpu, label: 'AI Processing', desc: 'Gemini-powered analysis extracts pain points, sentiment, and key themes.' },
  { icon: Share2, label: 'Knowledge Graph', desc: 'Relationships mapped between feedback, features, and business impact.' },
  { icon: BarChart3, label: 'Actionable Insights', desc: 'Real-time dashboards, trends, and AI recommendations.' },
  { icon: Map, label: 'Product Roadmap', desc: 'Auto-generated roadmap prioritized by customer impact and effort.' },
];

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = sectionRef.current?.querySelectorAll('.pipeline-step');
      if (panels) {
        gsap.fromTo(panels, { opacity: 0, x: -40 }, {
          opacity: 1, x: 0, duration: 0.8, stagger: 0.25, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        });
      }
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleY: 0 }, {
          scaleY: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
          transformOrigin: 'top center',
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6 bg-white/[0.01] border-y border-white/[0.03]" data-reveal>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase font-bold mb-4 block">Data Pipeline</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">From Raw Data to <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">Product Decisions</span></h2>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto font-light">DiscoveryOS processes your customer data through an intelligent pipeline that extracts, analyzes, and prioritizes.</p>
        </div>

        <div className="relative flex flex-col items-center gap-0">
          <div ref={lineRef} className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#8B5CF6]/60 via-[#A855F7]/30 to-transparent origin-top" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="pipeline-step relative flex items-start gap-6 w-full pl-8 pb-16 last:pb-0">
                <div className="relative z-10 w-10 h-10 rounded-xl bg-[#0C0C12] border border-[#8B5CF6]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                  <Icon className="w-4.5 h-4.5 text-[#8B5CF6]" />
                </div>
                <div className="flex-1 glass-panel p-5 rounded-2xl border-white/5">
                  <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase font-bold">Step {i + 1}</span>
                  <h3 className="text-base font-bold text-white mt-1 mb-1.5">{step.label}</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute left-[21px] top-14 bottom-0 w-px bg-gradient-to-b from-[#8B5CF6]/20 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
