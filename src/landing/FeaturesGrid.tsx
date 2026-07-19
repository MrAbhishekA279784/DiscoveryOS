import React from 'react';
import { 
  Bot, Search, BookOpen, BarChart3, FolderKanban, Database, 
  Lightbulb, TrendingUp, ArrowRight, Sparkles, FileText, MessageSquare 
} from 'lucide-react';

const features = [
  { icon: Bot, title: 'AI Copilot', desc: 'Ask natural language questions about your product data and get instant answers with source citations.', color: '#8B5CF6' },
  { icon: Search, title: 'Semantic Search', desc: 'Search across all your feedback, research, and documents with AI-powered semantic understanding.', color: '#10B981' },
  { icon: BookOpen, title: 'Research Hub', desc: 'Centralize user interviews, surveys, and market research in a single searchable knowledge base.', color: '#F59E0B' },
  { icon: BarChart3, title: 'Analytics & Insights', desc: 'Real-time dashboards showing pain points, sentiment trends, and KPI tracking.', color: '#EC4899' },
  { icon: FolderKanban, title: 'Projects & Roadmaps', desc: 'Auto-generate product roadmaps from customer feedback patterns and AI recommendations.', color: '#8B5CF6' },
  { icon: Database, title: 'Knowledge Graph', desc: 'Connected data model that maps relationships between feedback, features, and decisions.', color: '#10B981' },
  { icon: FileText, title: 'Reports & Export', desc: 'Generate executive summaries, PDF reports, and PowerPoint decks from your insights.', color: '#F59E0B' },
  { icon: MessageSquare, title: 'Feedback Aggregator', desc: 'Ingest data from Zendesk, Intercom, GitHub, Slack, Jira, and 10+ other sources.', color: '#EC4899' },
];

export default function FeaturesGrid() {
  return (
    <section className="py-28 px-6" data-reveal>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase font-bold mb-4 block">Core Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Everything You Need to <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">Understand Your Users</span></h2>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto font-light">From data ingestion to actionable insights — DiscoveryOS connects every piece of customer intelligence in one platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="group glass-panel p-5 rounded-2xl border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#8B5CF6]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/5" style={{ backgroundColor: `${f.color}10` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: f.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-light">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
