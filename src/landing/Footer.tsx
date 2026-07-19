import React from 'react';

export default function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'Documentation', 'Changelog', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
    Resources: ['API Reference', 'Guides', 'Tutorials', 'Community', 'Support'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies', 'Licenses'],
  };

  return (
    <footer className="border-t border-white/[0.03] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                <span className="text-[9px] font-bold text-white">D</span>
              </div>
              <span className="text-sm font-bold tracking-tight">DiscoveryOS</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xs">Turn customer feedback into product intelligence. AI-powered insights for modern product teams.</p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold mb-4">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-600 font-mono">&copy; 2026 DiscoveryOS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Twitter', 'GitHub', 'LinkedIn', 'YouTube'].map((social) => (
              <a key={social} href="#" className="text-[10px] text-zinc-500 hover:text-white transition-colors font-mono">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
