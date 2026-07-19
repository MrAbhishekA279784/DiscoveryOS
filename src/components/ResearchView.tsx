import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Cpu, 
  Sparkles, 
  Plus, 
  ChevronRight, 
  FileText, 
  CheckCircle, 
  Loader2,
  ArrowRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { useSearch } from '../utils/useSearch';
import { useCopilot } from '../utils/useCopilot';

export default function ResearchView() {
  const [searchQuery, setSearchQuery] = useState('Analyze user feedback regarding offline database sync conflicts');
  const [activeSession, setActiveSession] = useState('db-sync');
  const { results, isLoading: searchLoading, error: searchError, search } = useSearch();
  const { messages: copilotMessages, isLoading: copilotLoading, error: copilotError, streamMessage } = useCopilot();
  const isSearching = searchLoading || copilotLoading;
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, copilotLoading]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
      streamMessage(searchQuery, () => {});
    }
  };

  const sessions = [
    { id: 'db-sync', title: 'Offline database sync conflicts', date: 'Jul 18, 2026', count: 12 },
    { id: 'dark-mode', title: 'Luminance & contrast feedback', date: 'Jul 15, 2026', count: 8 },
    { id: 'nav-issues', title: 'Navigation & layout shift friction', date: 'Jul 10, 2026', count: 15 },
    { id: 'billing-ux', title: 'Pro Tier Checkout drop-offs', date: 'Jul 04, 2026', count: 6 }
  ];

  const timelineMessages = copilotMessages.length > 0 ? copilotMessages.map(m => ({
    sender: m.sender,
    text: m.text,
    time: m.timestamp,
    isAi: m.sender === 'ai',
    loading: m.isStreaming || false
  })) : [
    { sender: 'user', text: "What are the primary friction points users encounter with offline data synchronization?", time: "10:42 AM" },
    { sender: 'ai', isAi: true, text: copilotLoading ? '' : 'Ask the AI Copilot to analyze your data.', time: "10:43 AM", loading: false }
  ];

  const sourcesTable = searchLoading ? [] : results.length > 0 ? results.slice(0, 4).map(r => ({
    name: r.title,
    format: r.source || 'Document',
    size: '-',
    matchScore: `${r.matchScore}%`,
    status: 'Indexed'
  })) : [
    { name: 'interview_user_382.txt', format: 'TXT', size: '24 KB', matchScore: '98%', status: 'Indexed' },
    { name: 'db_sync_error_stack.log', format: 'LOG', size: '152 KB', matchScore: '94%', status: 'Indexed' },
    { name: 'offline_sync_improvement_v2.docx', format: 'DOCX', size: '1.2 MB', matchScore: '89%', status: 'Indexed' },
    { name: 'customer_support_sync_tickets.xlsx', format: 'XLSX', size: '420 KB', matchScore: '82%', status: 'Indexed' }
  ];

  return (
    <div className="w-full flex flex-col gap-6" role="region" aria-label="Research View">
      {/* Top Search Query & Filter Row */}
      <form onSubmit={handleSearchSubmit} className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research repository or ask discovery engine..."
              className="w-full bg-[#0E0E15]/80 border border-white/8 pl-11 pr-4 py-2.5 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#8B5CF6]/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all"
              aria-label="Search research repository or ask discovery engine"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSearching}
            className="px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-[0_4px_12px_rgba(139,92,246,0.25)]"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
            <span>{isSearching ? 'Analyzing...' : 'Query AI'}</span>
          </button>
        </div>

        {/* Filters and Selection pills */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] font-bold text-zinc-400 font-mono uppercase">
            <Filter className="w-3.5 h-3.5" /> Filters
          </div>

          <select className="bg-[#12121A] border border-white/5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300 focus:border-[#8B5CF6]/30 outline-none">
            <option>All Sources (47 docs)</option>
            <option>Client Interviews</option>
            <option>System Diagnostics</option>
            <option>Support Logs</option>
          </select>

          <select className="bg-[#12121A] border border-white/5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300 focus:border-[#8B5CF6]/30 outline-none">
            <option>Confidence Over 80%</option>
            <option>All confidence scores</option>
          </select>

          <select className="bg-[#12121A] border border-white/5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300 focus:border-[#8B5CF6]/30 outline-none font-mono">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>All Time</option>
          </select>
        </div>
      </form>

      {/* Main Grid: Left List, Center Timeline, Right Meta Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Research Session Panel */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-full min-w-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Research Sessions</span>
            <button className="p-1 rounded-md bg-white/5 hover:bg-[#8B5CF6]/20 border border-white/5 text-zinc-400 hover:text-white transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-panel p-2 rounded-2xl border-white/5 flex flex-col gap-1.5 flex-1 max-h-[460px] overflow-y-auto" role="list" aria-label="Research sessions">
            {sessions.map((session) => {
              const isActive = activeSession === session.id;
              return (
                <button
                  key={session.id}
                  role="listitem"
                  onClick={() => {
                    setActiveSession(session.id);
                    if (session.id === 'db-sync') {
                      setSearchQuery('Analyze user feedback regarding offline database sync conflicts');
                    } else if (session.id === 'dark-mode') {
                      setSearchQuery('Summarize all complaints regarding lighting contrast ratio inside workspace');
                    } else if (session.id === 'nav-issues') {
                      setSearchQuery('Detail customer layout shifts and screen freezing on drawer close');
                    } else {
                      setSearchQuery('Check Pro checkout drop-off rate triggers');
                    }
                    search(searchQuery);
                  }}
                  className={`w-full p-3 rounded-xl flex flex-col gap-1.5 text-left transition-all ${
                    isActive 
                      ? 'bg-[#12121D] border border-[#8B5CF6]/30 shadow-[0_4px_12px_rgba(139,92,246,0.1)] text-white' 
                      : 'border border-transparent hover:bg-white/[0.01] hover:border-white/5 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[9px] font-bold font-mono text-zinc-500 uppercase">{session.date}</span>
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-white/5 text-zinc-400 font-mono">
                      {session.count} sources
                    </span>
                  </div>
                  <span className="text-[11px] font-bold leading-normal truncate w-full">{session.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Conversation Timeline */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Discovery Timeline</span>
            <span className="text-[9px] text-zinc-600 font-mono">Active Model: Gemini 3.5 Omni</span>
          </div>

          <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col gap-4 flex-1 h-[460px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" aria-live="polite" aria-label="Discovery Timeline">
            {timelineMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col gap-1.5 max-w-[88%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div className="flex items-center gap-1.5">
                  {msg.isAi && <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                  <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">
                    {msg.sender === 'user' ? 'Researcher' : 'DiscoveryOS AI'} • {msg.time}
                  </span>
                </div>

                <div 
                  className={`p-3.5 rounded-2xl text-[11px] leading-relaxed border ${
                    msg.sender === 'user'
                      ? 'bg-white/[0.02] border-white/8 text-zinc-100 rounded-tr-none'
                      : 'bg-[#12121E]/70 border-[#8B5CF6]/15 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  {msg.loading ? (
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
                      <span>Processing vector database index...</span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: AI Summary Card & KPI Meta Columns */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full min-w-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Discovery Metrics</span>
            <Bookmark className="w-4 h-4 text-[#8B5CF6]" />
          </div>

          <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col gap-4.5 flex-1 justify-between">
            {/* Metadata Stats Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-1.5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Research Progress</span>
                <span className="text-sm font-extrabold text-white">88% Complete</span>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#12121F] border border-[#8B5CF6]/20 flex flex-col gap-1.5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Confidence Score</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-[#A855F7]">94.2%</span>
                  <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase bg-emerald-500/10 px-1 rounded">High</span>
                </div>
                <span className="text-[8px] text-zinc-500 leading-none">Strictly cross-validated</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Documents Used</span>
                <span className="text-sm font-extrabold text-white">47 Files</span>
                <span className="text-[8px] text-zinc-500 leading-none">All schemas indexed</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Insights Generated</span>
                <span className="text-sm font-extrabold text-emerald-400">14 Clusters</span>
                <span className="text-[8px] text-zinc-500 leading-none">Mapped to product roadmap</span>
              </div>
            </div>

            {/* Follow-up Questions list */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">Suggested Follow-Ups</span>
              <div className="flex flex-col gap-1.5">
                {[
                  'What specific DB schemas are reporting conflicts?',
                  'Analyze crash frequencies across mobile platforms.',
                  'Recommend atomic CRDT open-source packages.'
                ].map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setSearchQuery(q);
                      search(q);
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-white/[0.01] border border-white/5 hover:bg-[#8B5CF6]/5 hover:border-[#8B5CF6]/25 transition-all flex items-center justify-between group min-w-0"
                  >
                    <span className="text-[9.5px] text-zinc-300 truncate pr-2 font-medium">{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#8B5CF6] transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex gap-2.5 pt-3.5 border-t border-white/5">
              <button className="flex-1 py-2 px-3 rounded-xl bg-white/[0.02] border border-white/8 hover:bg-white/[0.04] text-[10px] font-bold text-zinc-300 flex items-center justify-center gap-1.5 transition-all">
                <Share2 className="w-3.5 h-3.5 text-zinc-400" /> Share Logs
              </button>
              <button className="flex-1 py-2 px-3 rounded-xl bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/20 text-[10px] font-bold text-[#A855F7] flex items-center justify-center gap-1.5 transition-all">
                <span>View Full Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Sources Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Connected Research Artifacts</span>
          <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Sync verified
          </span>
        </div>

        <div className="glass-panel overflow-x-auto rounded-2xl border-white/5">
          <table className="w-full text-left border-collapse min-w-[600px]" aria-label="Connected Research Artifacts">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Artifact Name</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Format</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Size</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">AI Relevance</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Workspace Status</th>
              </tr>
            </thead>
            <tbody>
              {sourcesTable.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors last:border-0">
                  <td className="py-3 px-4 flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                    <span className="text-xs font-bold text-white truncate max-w-[240px]">{item.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[9px] font-bold font-mono text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{item.format}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-zinc-400 font-mono">{item.size}</td>
                  <td className="py-3 px-4 text-xs font-mono font-bold text-emerald-400">{item.matchScore}</td>
                  <td className="py-3 px-4">
                    <span className="text-[9px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
