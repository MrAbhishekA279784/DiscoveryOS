import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const techs = [
  { name: 'React', desc: 'Modern component-based UI with server-side rendering capabilities.', category: 'Frontend' },
  { name: 'TypeScript', desc: 'Type-safe development with full IDE support and enhanced code quality.', category: 'Frontend' },
  { name: 'FastAPI', desc: 'High-performance Python backend with automatic OpenAPI documentation.', category: 'Backend' },
  { name: 'Gemini AI', desc: 'Google\'s advanced LLM for natural language understanding and generation.', category: 'AI' },
  { name: 'Supabase', desc: 'Open-source Firebase alternative with PostgreSQL, real-time subscriptions, and auth.', category: 'Database' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid, consistent, and responsive design.', category: 'Frontend' },
  { name: 'Firebase Auth', desc: 'Secure authentication with email/password, Google SSO, and session management.', category: 'Security' },
  { name: 'GSAP', desc: 'Professional-grade animation library for smooth, high-performance motion design.', category: 'Frontend' },
];

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.tech-card');
      if (cards) {
        gsap.fromTo(cards, { opacity: 0, y: 40, scale: 0.95 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-6" data-reveal>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase font-bold mb-4 block">Technology Stack</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Built With <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">Modern Technologies</span></h2>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto font-light">Every component is carefully chosen for performance, developer experience, and production reliability.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techs.map((tech, i) => (
            <div key={i} className="tech-card glass-panel p-5 rounded-2xl border-white/5 hover:border-[#8B5CF6]/20 transition-all duration-300 flex flex-col gap-2.5 group">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold">{tech.category}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{tech.name}</h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-light">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
