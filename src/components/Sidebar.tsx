import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Search, 
  Lightbulb, 
  Milestone, 
  Sparkles, 
  FileText, 
  Folder, 
  Database, 
  Settings, 
  ChevronDown, 
  Layers,
  ArrowUpRight,
  FileUp,
  Wand2
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  storageUsage: number; // e.g. 82
  tokenUsage: number; // e.g. 13
  onUploadClick?: () => void;
  onStartAIAnalysis?: () => void;
  onGenerateRoadmap?: () => void;
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  storageUsage = 82, 
  tokenUsage = 13,
  onUploadClick,
  onStartAIAnalysis,
  onGenerateRoadmap
}: SidebarProps) {
  const [dragActive, setDragActive] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'research', label: 'Research', icon: Search, badge: 'New' },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'roadmap', label: 'Roadmap', icon: Milestone },
    { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (onUploadClick) onUploadClick();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (onUploadClick) onUploadClick();
    }
  };

  // Circular progress helper
  const renderCircularGauge = (percentage: number, color: string, glowColor: string, size = 48) => {
    const radius = size * 0.4;
    const strokeWidth = 3.5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Ring with Glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${glowColor})`,
              transition: 'stroke-dashoffset 0.8s ease-in-out'
            }}
          />
        </svg>
        {/* Percentage Label inside */}
        <span className="absolute text-[11px] font-mono font-semibold text-white">
          {percentage}%
        </span>
      </div>
    );
  };

  return (
    <aside 
      id="main-sidebar" 
      className="w-full xl:w-[320px] shrink-0 flex flex-col xl:h-[calc(100dvh-3rem)] xl:sticky xl:top-6 z-20 glass-panel rounded-2xl border-white/8 text-white p-4 justify-between overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="flex flex-col gap-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#D946EF] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <Layers className="w-5 h-5 text-white" />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#D946EF] opacity-30 blur-sm -z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight font-sans text-white leading-none">DiscoveryOS</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-wider mt-0.5 uppercase">Product Intelligence</span>
          </div>
        </div>

        {/* Upload Documents Module */}
        <div className="flex flex-col gap-2.5 px-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Upload Documents</span>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#8B5CF6]/15 text-[#A855F7] border border-[#8B5CF6]/20 flex items-center gap-1 shrink-0">
              <Sparkles className="w-2 h-2 animate-pulse" /> AI Ready
            </span>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={onUploadClick}
            className={`group cursor-pointer relative overflow-hidden rounded-xl border border-dashed p-3.5 flex flex-col items-center justify-center text-center transition-all duration-300 ${
              dragActive 
                ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
            }`}
          >
            {/* Hidden Input */}
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.csv,.xlsx,.xls,.txt,.mp3,.mp4"
            />

            <div className="relative w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileUp className="w-4 h-4 text-zinc-400 group-hover:text-[#8B5CF6] transition-colors" />
            </div>

            <p className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed">
              Drag & drop files here
            </p>
            <p className="text-[8px] text-zinc-500 mt-1 font-mono tracking-tight leading-normal">
              PDF, DOCX, CSV, XLSX, TXT, MP3, MP4
            </p>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onUploadClick) onUploadClick();
              }}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white font-semibold text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.25)]"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Upload Files</span>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 px-3 uppercase mb-1">Navigation</span>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-300 outline-none ${
                  isActive 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute inset-0 bg-[#8B5CF6]/12 border-l-[3px] border-[#8B5CF6] rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? 'text-[#8B5CF6]' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#8B5CF6]/20 text-[#A855F7] border border-[#8B5CF6]/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Storage and Quick Actions Modules */}
      <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
        {/* Storage Indicator */}
        <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-xl">
          {renderCircularGauge(storageUsage, '#8B5CF6', 'rgba(139, 92, 246, 0.4)')}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Storage</span>
            <span className="text-xs font-semibold text-white mt-0.5">{(storageUsage / 10).toFixed(1)} GB / 10 GB</span>
          </div>
        </div>

        {/* AI Tokens Usage */}
        <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-xl">
          {renderCircularGauge(tokenUsage, '#10B981', 'rgba(16, 185, 129, 0.4)')}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">AI Tokens</span>
            <span className="text-xs font-semibold text-white mt-0.5">125K / 1M used</span>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 px-1 uppercase mb-1">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={onUploadClick}
              className="flex flex-col items-start gap-1.5 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all text-left group"
            >
              <FileUp className="w-4 h-4 text-[#8B5CF6] group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-white truncate">Upload</span>
                <span className="text-[8px] text-zinc-500 truncate">Add sources</span>
              </div>
            </button>

            <button 
              onClick={onStartAIAnalysis}
              className="flex flex-col items-start gap-1.5 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all text-left group"
            >
              <Wand2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-white truncate">Analyze</span>
                <span className="text-[8px] text-zinc-500 truncate">Run AI engine</span>
              </div>
            </button>

            <button 
              onClick={onGenerateRoadmap}
              className="flex flex-col items-start gap-1.5 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all text-left group"
            >
              <Milestone className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-white truncate">Roadmap</span>
                <span className="text-[8px] text-zinc-500 truncate">View timeline</span>
              </div>
            </button>

            <button 
              onClick={() => onViewChange('copilot')}
              className="flex flex-col items-start gap-1.5 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all text-left group"
            >
              <Sparkles className="w-4 h-4 text-[#A855F7] group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-white truncate">Copilot</span>
                <span className="text-[8px] text-zinc-500 truncate">Ask assistant</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
