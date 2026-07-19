import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const logos = [
  'Linear', 'Vercel', 'Stripe', 'Cursor', 'Notion', 'Perplexity', 'OpenAI', 'Raycast',
  'Supabase', 'Figma', 'Slack', 'GitHub',
];

export default function TrustedBy() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (marqueeRef.current) {
        const width = marqueeRef.current.scrollWidth / 2;
        gsap.to(marqueeRef.current, {
          x: -width, duration: 30, repeat: -1, ease: 'none',
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16 border-y border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Trusted by industry leaders</span>
      </div>
      <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
        <div ref={marqueeRef} className="flex items-center gap-16 w-max">
          {[...logos, ...logos].map((name, i) => (
            <div key={i} className="flex items-center gap-2 opacity-40 hover:opacity-60 transition-opacity shrink-0">
              <div className="w-6 h-6 rounded-md bg-white/5 border border-white/5 flex items-center justify-center">
                <span className="text-[8px] font-bold text-zinc-500">{name[0]}</span>
              </div>
              <span className="text-sm font-semibold text-zinc-500 tracking-tight whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
