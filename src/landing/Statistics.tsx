import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const stats = [
  { value: 1284, label: 'Files Processed', suffix: '+', prefix: '' },
  { value: 98, label: 'AI Accuracy', suffix: '%', prefix: '' },
  { value: 47, label: 'Integrations', suffix: '+', prefix: '' },
  { value: 2.4, label: 'Avg Response Time', suffix: 's', prefix: '', decimals: 1 },
  { value: 99.9, label: 'Uptime', suffix: '%', prefix: '' },
];

export default function Statistics() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      countersRef.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        gsap.fromTo(el, { textContent: 0 }, {
          textContent: stat.value, duration: 2, ease: 'power3.out', delay: 0.2 * i,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          snap: { textContent: stat.decimals ? 0.1 : 1 },
          onUpdate: () => {
            const current = parseFloat(el.textContent || '0');
            el.textContent = stat.decimals ? current.toFixed(stat.decimals) : Math.round(current).toString();
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6 bg-white/[0.01] border-y border-white/[0.03]" data-reveal>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase font-bold mb-4 block">By The Numbers</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Trusted by <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">Growing Teams</span></h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border-white/5 text-center flex flex-col items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {stat.prefix}<span ref={(el) => { countersRef.current[i] = el; }}>0</span>{stat.suffix}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
