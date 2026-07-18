import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Smile, 
  Frown, 
  MessageSquare, 
  Heart, 
  BarChart3, 
  Lightbulb, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function InsightsView() {
  const [selectedSentiment, setSelectedSentiment] = useState('all');

  const kpis = [
    { title: 'Total Feedbacks', value: '1,284', change: '+12.5%', isPositive: true, subtext: 'indexed from connected sources', icon: MessageSquare, color: '#8B5CF6' },
    { title: 'Detected Pain Points', value: '412', change: '+4.2%', isPositive: false, subtext: 'resolved or mitigated: 184', icon: AlertTriangle, color: '#F59E0B' },
    { title: 'Positive Signals', value: '512', change: '+18.1%', isPositive: true, subtext: 'high client satisfaction rate', icon: Smile, color: '#10B981' },
    { title: 'Negative Signals', value: '278', change: '-8.4%', isPositive: true, subtext: 'majorly around loading states', icon: Frown, color: '#EF4444' },
    { title: 'Net Sentiment Score', value: '72/100', change: '+6.1%', isPositive: true, subtext: 'healthy customer outlook', icon: Heart, color: '#EC4899' }
  ];

  const quotes = [
    { text: "Offline sync logic is incredibly buggy. I lost half my team's sprint planning because my socket reconnected while I was in transit.", source: "Enterprise Customer Support Call Transcript", date: "2 hours ago", sentiment: "negative", impact: "high" },
    { text: "Love the new bento design language. It is incredibly clean and fast, though dark mode is desperately needed at night.", source: "Beta tester Slack community", date: "1 day ago", sentiment: "positive", impact: "medium" },
    { text: "The app frequently freezes when opening the navigation side drawer on standard viewport sizes under 1440px.", source: "GitHub Issue #482", date: "3 days ago", sentiment: "negative", impact: "medium" },
    { text: "Adding reports exports to PowerPoint will fully replace our internal product dashboard tools. Great progress!", source: "Executive Account QBR Feedback", date: "5 days ago", sentiment: "positive", impact: "high" }
  ];

  const categories = [
    { name: 'Database Sync & Offline Failures', count: 432, percentage: 33.6, color: '#8B5CF6' },
    { name: 'Dark Mode & Interface Contrast', count: 310, percentage: 24.1, color: '#10B981' },
    { name: 'Navigation Flow & Core Lag', count: 220, percentage: 17.1, color: '#F59E0B' },
    { name: 'Pro Tier Stripe Billing UI', count: 182, percentage: 14.2, color: '#EF4444' },
    { name: 'PowerPoint & PDF Export Errors', count: 140, percentage: 11.1, color: '#EC4899' }
  ];

  const recommendations = [
    { action: "Implement SQLite client-side replica", benefit: "Solves 33.6% offline sync crashes", type: "Critical", icon: Lightbulb, color: '#8B5CF6' },
    { action: "Inject dark mode system matchers", benefit: "Resolves contrast readability requests", type: "High Impact", icon: Sparkles, color: '#10B981' },
    { action: "Stagger layout shifts via dynamic skeleton loaders", benefit: "Eliminates core lag metrics", type: "Medium", icon: CheckCircle2, color: '#F59E0B' }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* KPI Section */}
      <div>
        <div className="mb-3.5 flex items-center justify-between px-1">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Insights Core KPIs</span>
          <span className="text-[9px] text-zinc-600 font-mono">Data synced: Live</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col gap-2 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-semibold text-zinc-400 tracking-wide truncate">{kpi.title}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/5" style={{ backgroundColor: `${kpi.color}10` }}>
                    <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-extrabold text-white leading-none font-sans">{kpi.value}</span>
                  <span className={`text-[9px] font-bold font-mono px-1 rounded ${kpi.isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                    {kpi.change}
                  </span>
                </div>
                
                <span className="text-[9px] text-zinc-500 leading-tight font-sans mt-1.5">{kpi.subtext}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Category Distribution (Left) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Category Distribution</span>
            <h3 className="text-sm font-bold text-white mt-1">Detected Feedback Issue Clusters</h3>
          </div>

          <div className="flex flex-col gap-3.5 mt-2">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 min-w-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-300 truncate pr-4">{cat.name}</span>
                  <span className="font-mono text-zinc-400 font-semibold shrink-0">
                    {cat.count} <span className="text-[10px] text-zinc-500 font-normal">({cat.percentage}%)</span>
                  </span>
                </div>
                
                {/* Horizontal Progress bar */}
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Matrix & Risk Index (Right) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Priority Matrix</span>
            <h3 className="text-sm font-bold text-white mt-1">AI Severity & Risk Analysis</h3>
          </div>

          <div className="flex flex-col gap-4 mt-2 justify-between flex-1">
            {/* Real risk status indicators */}
            <div className="flex items-center gap-4 bg-[#EF4444]/5 border border-[#EF4444]/15 p-3 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-[#EF4444] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white">Critical Churn Risk Index</span>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                  Offline db sync failures have an immediate impact on Enterprise churn scores.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Actioned Metrics</span>
                <span className="text-sm font-extrabold text-emerald-400">44.6%</span>
                <span className="text-[9px] text-zinc-500 leading-none">Issues solved this cycle</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Sync Ingestion Lag</span>
                <span className="text-sm font-extrabold text-[#8B5CF6]">124 ms</span>
                <span className="text-[9px] text-zinc-500 leading-none">Average real-time latency</span>
              </div>
            </div>

            {/* Simple scatter grid plot to represent priority */}
            <div className="p-2 bg-[#0E0E14] rounded-xl border border-white/5 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono px-1 uppercase">
                <span>Effort vs Impact Allocation</span>
                <span className="text-[#8B5CF6]">Matrix Map</span>
              </div>
              <div className="grid grid-cols-4 h-12 gap-1 border-l border-b border-white/10 items-stretch pl-1 pb-1">
                <div className="bg-[#EF4444]/10 rounded border border-[#EF4444]/20 flex items-center justify-center text-[8px] font-bold text-red-400">Sync</div>
                <div className="bg-[#F59E0B]/10 rounded border border-[#F59E0B]/20 flex items-center justify-center text-[8px] font-bold text-amber-400 font-mono">Drawer</div>
                <div className="bg-[#8B5CF6]/10 rounded border border-[#8B5CF6]/20 flex items-center justify-center text-[8px] font-bold text-purple-400">Theme</div>
                <div className="bg-[#10B981]/10 rounded border border-[#10B981]/20 flex items-center justify-center text-[8px] font-bold text-emerald-400">Exports</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bento: Customer Quotes and AI Recommendation Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* Customer Quotes (Left Column) */}
        <div className="xl:col-span-8 flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Customer Quotes Timeline</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedSentiment('all')} className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${selectedSentiment === 'all' ? 'bg-[#8B5CF6]/20 text-[#A855F7] border border-[#8B5CF6]/30' : 'text-zinc-500'}`}>All</button>
              <button onClick={() => setSelectedSentiment('positive')} className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${selectedSentiment === 'positive' ? 'bg-[#10B981]/20 text-emerald-400 border border-[#10B981]/30' : 'text-zinc-500'}`}>Positive</button>
              <button onClick={() => setSelectedSentiment('negative')} className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${selectedSentiment === 'negative' ? 'bg-[#EF4444]/20 text-red-400 border border-[#EF4444]/30' : 'text-zinc-500'}`}>Negative</button>
            </div>
          </div>

          <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col gap-3.5 max-h-[360px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {quotes
              .filter(q => selectedSentiment === 'all' || q.sentiment === selectedSentiment)
              .map((quote, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-semibold text-[#8B5CF6] truncate">{quote.source}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] text-zinc-500 font-mono">{quote.date}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono uppercase font-bold ${
                        quote.sentiment === 'positive' ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                      }`}>
                        {quote.sentiment}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans italic">
                    "{quote.text}"
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* AI Action Recommendations (Right Column) */}
        <div className="xl:col-span-4 flex flex-col gap-4 h-full min-w-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">AI Action Plan</span>
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          </div>

          <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col gap-4 flex-1 justify-between">
            <div className="flex flex-col gap-3.5">
              {recommendations.map((rec, idx) => {
                const Icon = rec.icon;
                return (
                  <div key={idx} className="flex gap-3 items-start min-w-0">
                    <div className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center shrink-0" style={{ backgroundColor: `${rec.color}10` }}>
                      <Icon className="w-4 h-4" style={{ color: rec.color }} />
                    </div>
                    <div className="flex flex-col min-w-0 leading-normal">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-white truncate">{rec.action}</span>
                        <span className="text-[8px] font-bold font-mono px-1 rounded text-zinc-400 bg-white/5 shrink-0">{rec.type}</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 mt-0.5 truncate">{rec.benefit}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/5">
              <button className="w-full py-2 px-3.5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white font-semibold text-[10.5px] rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.25)]">
                <span>Initialize AI Sprint Allocation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
