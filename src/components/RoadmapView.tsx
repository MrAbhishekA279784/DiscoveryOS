import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Milestone, 
  Clock, 
  AlertTriangle, 
  GitMerge, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  ChevronRight, 
  ShieldAlert,
  Sliders,
  Play
} from 'lucide-react';

export default function RoadmapView() {
  const [activeQuarter, setActiveQuarter] = useState('Q3');

  const milestones = [
    { title: 'Offline Replica Core', date: 'Aug 15', status: 'In Progress', progress: 65, color: '#8B5CF6' },
    { title: 'Contrast-Shift Theme', date: 'Sep 02', status: 'Scheduled', progress: 0, color: '#10B981' },
    { title: 'Drawer Navigation Refactor', date: 'Oct 20', status: 'Scheduled', progress: 0, color: '#F59E0B' },
    { title: 'PowerPoint Export Pipeline', date: 'Nov 12', status: 'Deferred', progress: 0, color: '#EC4899' }
  ];

  const timelineItems = [
    {
      phase: 'Now',
      quarter: 'Q3 2026',
      items: [
        { title: 'Local SQLite Delta Database & Sync Engine', priority: 'Critical', effort: 'Medium', impact: 'Extreme', dependencies: 'None', desc: 'Offline storage client to prevent data loss on network drops.', owner: 'Core Tech Team', risk: 'Low' },
        { title: 'Intelligent Navigation Flow & Drawer Refactoring', priority: 'High', effort: 'High', impact: 'High', dependencies: 'SQLite core', desc: 'Recalculating layout drawer widths and states dynamically to eliminate freezing.', owner: 'UI Core', risk: 'Medium' }
      ]
    },
    {
      phase: 'Next',
      quarter: 'Q4 2026',
      items: [
        { title: 'Universal Dark Mode Ecosystem', priority: 'Medium', effort: 'Low', impact: 'Medium', dependencies: 'Theme manager', desc: 'Dynamic luminance adjustment system matched to operating system presets.', owner: 'Frontends', risk: 'Low' },
        { title: 'PowerPoint (PPTX) & CSV Report Builder', priority: 'High', effort: 'Medium', impact: 'High', dependencies: 'PDF renderer', desc: 'Server-side report generator compiling charts into editable vectors.', owner: 'Backends', risk: 'Low' }
      ]
    },
    {
      phase: 'Later',
      quarter: 'Q1 2027',
      items: [
        { title: 'Self-Organizing Semantic Workspace Search', priority: 'Low', effort: 'High', impact: 'High', dependencies: 'Gemini indexer', desc: 'Automated document grouping inside workspace index lists.', owner: 'AI Team', risk: 'High' }
      ]
    }
  ];

  const sprintAllocations = [
    { name: 'Sprint 14: Core Sync', start: 'Jul 20', developers: 4, tasks: 12, status: 'Active' },
    { name: 'Sprint 15: Navigation Hub', start: 'Aug 03', developers: 3, tasks: 8, status: 'Scheduled' },
    { name: 'Sprint 16: Theme Engine', start: 'Aug 17', developers: 2, tasks: 6, status: 'Scheduled' }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Banner and Export Row */}
      <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Release Milestones</span>
          <h2 className="text-sm font-bold text-white mt-0.5">Automated Product Intelligence Roadmap</h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button className="px-3.5 py-2.5 bg-white/[0.02] border border-white/8 hover:bg-white/[0.04] text-xs font-bold text-zinc-300 rounded-xl flex items-center gap-2 transition-all">
            <Download className="w-4 h-4 text-zinc-400" />
            <span>Export CSV</span>
          </button>
          
          <button className="px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.25)]">
            <Download className="w-4 h-4" />
            <span>Export PowerPoint</span>
          </button>
        </div>
      </div>

      {/* Milestones Progress Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {milestones.map((ms, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-3 min-w-0 relative overflow-hidden">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">{ms.date}</span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                ms.status === 'In Progress' ? 'bg-[#8B5CF6]/15 text-[#A855F7]' : ms.status === 'Scheduled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-500'
              }`}>
                {ms.status}
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[11.5px] font-bold text-white truncate">{ms.title}</span>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${ms.progress}%`, backgroundColor: ms.color }} />
                </div>
                <span className="text-[10px] text-zinc-400 font-mono font-bold shrink-0">{ms.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Roadmap Timeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Timeline (Now, Next, Later) - Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-5 min-w-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Timeline Stream</span>
            <span className="text-[9px] text-zinc-600 font-mono">Prioritized via AI Severity Model</span>
          </div>

          <div className="flex flex-col gap-5 relative pl-4 border-l border-white/5 ml-2">
            {timelineItems.map((phaseGroup, idx) => (
              <div key={idx} className="relative flex flex-col gap-3">
                {/* Node connector dot */}
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] border-2 border-[#07070A] shadow-[0_0_8px_#8B5CF6]" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{phaseGroup.phase}</span>
                    <span className="text-[9.5px] font-mono text-zinc-500">({phaseGroup.quarter})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {phaseGroup.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="glass-panel p-4 rounded-xl border-white/5 hover:border-white/10 transition-all flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[12px] font-bold text-white leading-snug">{item.title}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold font-mono uppercase bg-[#8B5CF6]/15 text-[#A855F7] border border-[#8B5CF6]/20">
                            {item.priority} Priority
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold font-mono uppercase bg-emerald-500/10 text-emerald-400">
                            Impact: {item.impact}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-normal">
                        {item.desc}
                      </p>

                      <div className="flex items-center justify-between pt-2.5 border-t border-white/5 flex-wrap gap-2 text-[9px] font-mono text-zinc-500 font-semibold">
                        <div className="flex items-center gap-3">
                          <span>Owner: <strong className="text-zinc-300 font-sans font-medium">{item.owner}</strong></span>
                          <span>Effort: <strong className="text-zinc-300">{item.effort}</strong></span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span>Risk: <strong className={item.risk === 'High' ? 'text-red-400' : 'text-zinc-400'}>{item.risk}</strong></span>
                          <span>Dependencies: <strong className="text-[#8B5CF6]">{item.dependencies}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Priority Matrix Parameters, Sprints, Risks */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full min-w-0">
          
          {/* Sprint Allocation Card */}
          <div className="flex flex-col gap-3 min-w-0">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">Sprint Allocation</span>
            
            <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-3.5">
              {sprintAllocations.map((sp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-bold text-white">{sp.name}</span>
                    <span className={`text-[8px] font-mono font-bold uppercase rounded px-1.5 py-0.2 ${
                      sp.status === 'Active' ? 'bg-[#8B5CF6]/25 text-white border border-[#8B5CF6]/30' : 'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {sp.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono font-semibold">
                    <span>Starts: {sp.start}</span>
                    <span>Staff: {sp.developers} Engineers</span>
                    <span>Tasks: {sp.tasks} Items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Indicators Card */}
          <div className="flex flex-col gap-3 min-w-0">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">AI Recommendation & Risks</span>
            
            <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col gap-4.5">
              <div className="flex gap-3 bg-amber-500/5 border border-amber-500/15 p-3 rounded-xl items-start">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0 leading-relaxed">
                  <span className="text-[11px] font-bold text-white">Dependency Risk Alert</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                    Refactoring navigation hinges on SQLite db engine completion. Stagger these timelines.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-[#8B5CF6]/5 border border-[#8B5CF6]/15 p-3 rounded-xl items-start">
                <Sparkles className="w-4.5 h-4.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0 leading-relaxed">
                  <span className="text-[11px] font-bold text-white">AI Resource Optimizer</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                    Reallocating 1 developer from exporting functions to SQLite speeds up milestone 1 by 4 days.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
