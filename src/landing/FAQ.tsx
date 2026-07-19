import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const faqs = [
  { q: 'What is DiscoveryOS?', a: 'DiscoveryOS is an AI-powered product intelligence platform that ingests customer feedback from multiple sources, analyzes it using advanced AI, and generates actionable product insights and roadmaps.' },
  { q: 'How does the AI analysis work?', a: 'Our system uses Google Gemini to process customer feedback, support tickets, user interviews, and survey responses. It identifies pain points, sentiment trends, feature requests, and prioritizes them based on frequency and business impact.' },
  { q: 'What data sources are supported?', a: 'We support Zendesk, Intercom, GitHub Issues, Slack, Jira, Linear, email imports, CSV/Excel uploads, PDF documents, and direct API integrations.' },
  { q: 'Is my data secure?', a: 'Yes. All data is encrypted at rest and in transit. We use Firebase Authentication with Google SSO and Supabase for secure data storage. Your workspace is fully isolated from others.' },
  { q: 'Can I export my insights?', a: 'Absolutely. DiscoveryOS supports PDF executive summaries, PowerPoint presentations, CSV exports, and direct integration with Jira and Linear for roadmap items.' },
  { q: 'How much does it cost?', a: 'Pricing is coming soon. We offer a free tier for small teams and enterprise pricing for organizations with advanced needs. Contact us for early access.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-28 px-6 bg-white/[0.01]" data-reveal>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase font-bold mb-4 block">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Frequently Asked <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">Questions</span></h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`glass-panel rounded-2xl border ${isOpen ? 'border-[#8B5CF6]/20' : 'border-white/5'} transition-all duration-300 overflow-hidden`}>
                <button onClick={() => setOpenIndex(isOpen ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  <Plus className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5 px-5' : 'max-h-0'}`}>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
