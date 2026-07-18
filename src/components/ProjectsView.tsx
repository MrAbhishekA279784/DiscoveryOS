import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Folder, 
  Plus, 
  Grid, 
  List, 
  Search, 
  Filter, 
  Users, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function ProjectsView() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const projects = [
    { id: 1, name: 'StadiumIQ Local Database Sync', status: 'Active', progress: 82, members: 4, docs: 12, deadline: 'Aug 15, 2026', risk: 'Low', desc: 'Implementing a local client replica database sync engine to prevent data drop issues.' },
    { id: 2, name: 'DiscoveryOS Theme Engine Refactor', status: 'Active', progress: 45, members: 2, docs: 6, deadline: 'Sep 02, 2026', risk: 'Low', desc: 'Refactoring stylesheet theme contexts to support dynamic dark mode system layouts.' },
    { id: 3, name: 'Navigation Threading Stability', status: 'Review', progress: 95, members: 3, docs: 15, deadline: 'Jul 28, 2026', risk: 'High', desc: 'Debugging frozen rendering thread and layout shifts on nav sidebar events.' },
    { id: 4, name: 'PowerPoint Slide Vector Compiler', status: 'Planning', progress: 10, members: 2, docs: 4, deadline: 'Oct 10, 2026', risk: 'Low', desc: 'Compiling real-time dashboard analytics charts into native PowerPoint vector shapes.' },
    { id: 5, name: 'Legacy Workspace Deprecation', status: 'Archived', progress: 100, members: 1, docs: 2, deadline: 'Completed', risk: 'None', desc: 'De-indexing legacy databases and pruning cold telemetry streams.' }
  ];

  const recentActivity = [
    { user: 'abhishekgupta8arollno29@gmail.com', action: 'Uploaded interview_user_382.txt to', project: 'StadiumIQ Local Database Sync', time: '12 mins ago' },
    { user: 'DiscoveryOS AI Agent', action: 'Generated structural recommendations for', project: 'Navigation Threading Stability', time: '1 hour ago' },
    { user: 'abhishekgupta8arollno29@gmail.com', action: 'Created new project', project: 'PowerPoint Slide Vector Compiler', time: '3 hours ago' }
  ];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Banner Control Panel */}
      <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Workspace Management</span>
          <h2 className="text-sm font-bold text-white mt-0.5">Projects and Workspace Repository</h2>
        </div>

        <button className="px-4 py-2.5 bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.3)] shrink-0">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and View Toggles Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
        <div className="flex flex-1 items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-[#0E0E15]/90 border border-white/5 pl-9 pr-3 py-1.5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#12121A] border border-white/5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-zinc-300 focus:border-[#8B5CF6]/30 outline-none"
          >
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="review">In Review</option>
            <option value="planning">Planning</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Grid / List Layout toggle */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#8B5CF6] text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#8B5CF6] text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or List View of Projects */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((p) => (
            <div key={p.id} className="glass-panel p-4.5 rounded-2xl border-white/5 hover:border-white/10 transition-all flex flex-col gap-3.5 justify-between relative min-w-0">
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono tracking-wider text-zinc-500 uppercase">{p.deadline}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                    p.status === 'Active' ? 'bg-[#8B5CF6]/15 text-[#A855F7]' : p.status === 'Review' ? 'bg-amber-500/10 text-amber-400' : p.status === 'Planning' ? 'bg-zinc-500/10 text-zinc-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 mt-1">
                  <span className="text-sm font-extrabold text-white truncate hover:text-[#8B5CF6] transition-colors cursor-pointer">{p.name}</span>
                  <p className="text-[10.5px] text-zinc-400 mt-2 leading-relaxed font-sans line-clamp-3">
                    {p.desc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t border-white/5 mt-1">
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono font-bold shrink-0">{p.progress}%</span>
                </div>

                {/* Team & Artifacts count */}
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 font-bold uppercase">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{p.members} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>{p.docs} sources</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel overflow-x-auto rounded-2xl border-white/5">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Project Name</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Workspace Status</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Deadline</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Progress</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Roster</th>
                <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Documents</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.01] last:border-0 transition-all">
                  <td className="py-3.5 px-4 min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white hover:text-[#8B5CF6] transition-colors cursor-pointer truncate max-w-[280px]">{p.name}</span>
                      <span className="text-[10px] text-zinc-500 mt-1 truncate max-w-[340px] font-sans font-medium">{p.desc}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                      p.status === 'Active' ? 'bg-[#8B5CF6]/15 text-[#A855F7]' : p.status === 'Review' ? 'bg-amber-500/10 text-amber-400' : p.status === 'Planning' ? 'bg-zinc-500/10 text-zinc-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>{p.status}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-zinc-400 font-mono">{p.deadline}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 max-w-[110px]">
                      <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold shrink-0">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-zinc-400 font-mono">{p.members} team</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-[#8B5CF6] font-mono">{p.docs} files</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Workspace Activity Log */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">Workspace Activity Logs</span>
        
        <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-3">
          {recentActivity.map((act, idx) => (
            <div key={idx} className="flex items-start justify-between gap-3 text-xs p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse shrink-0" />
                <p className="text-zinc-400 min-w-0 truncate">
                  <strong className="text-zinc-200 font-sans font-medium">{act.user}</strong> {act.action} <strong className="text-white">{act.project}</strong>
                </p>
              </div>

              <span className="text-[10px] text-zinc-500 font-mono shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
