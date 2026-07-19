import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

const testimonials = [
  { quote: 'DiscoveryOS transformed how we prioritize features. We went from guesswork to data-driven decisions in a week.', author: 'Sarah Chen', role: 'CPO, Linear', color: '#8B5CF6' },
  { quote: 'The AI-generated roadmap alone saved us months of product discovery. Our engineering team finally knows what to build and why.', author: 'Marcus Rivera', role: 'VP Product, Vercel', color: '#10B981' },
  { quote: 'We plugged in our Zendesk, Intercom, and GitHub issues, and within hours had a complete picture of customer pain points.', author: 'Emily Nakamura', role: 'Head of Product, Stripe', color: '#F59E0B' },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.testimonial-card');
      if (cards) {
        gsap.fromTo(cards, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6" data-reveal>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase font-bold mb-4 block">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Loved by <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">Product Teams</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4 relative">
              <Quote className="w-6 h-6 opacity-20" style={{ color: t.color }} />
              <p className="text-xs text-zinc-300 leading-relaxed font-light">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/[0.03]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-[10px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                  {t.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{t.author}</p>
                  <p className="text-[9px] text-zinc-500 font-mono">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
