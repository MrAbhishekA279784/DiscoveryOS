import React from 'react';
import { FolderOpen, FileVideo, FileText, FileSpreadsheet, FileCode, Plus } from 'lucide-react';
import { FileItem } from '../types';

interface RecentUploadsCardProps {
  files: FileItem[];
  onUploadClick: () => void;
}

export default function RecentUploadsCard({ files, onUploadClick }: RecentUploadsCardProps) {
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
      case 'mp4':
        return <FileVideo className="w-4 h-4 text-[#8B5CF6]" />;
      case 'csv':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      default:
        return <FileCode className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIconContainerStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
      case 'mp4':
        return 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#8B5CF6]';
      case 'csv':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'xlsx':
      case 'xls':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  return (
    <div id="recent-uploads-card" className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full min-h-[290px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">Recent Uploads</span>
          </div>
          <button 
            onClick={onUploadClick} 
            className="text-[10px] text-[#8B5CF6] font-semibold hover:underline flex items-center gap-1"
          >
            <span>View all</span>
          </button>
        </div>

        {/* File list */}
        <div className="flex flex-col gap-2.5">
          {files.slice(0, 4).map((file) => (
            <div 
              key={file.id} 
              className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${getIconContainerStyle(file.type)}`}>
                  {getFileIcon(file.type)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-white truncate block w-full">
                    {file.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-mono text-zinc-500 truncate">
                    <span className="uppercase shrink-0">{file.type}</span>
                    <span>•</span>
                    <span className="truncate">{file.size}</span>
                    <span>•</span>
                    <span className="truncate">{file.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 ml-2">
                <span className="text-[8px] font-bold text-emerald-400 font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                  Ready
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload action trigger */}
      <button 
        onClick={onUploadClick}
        className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-[#8B5CF6]/10 border border-dashed border-white/10 hover:border-[#8B5CF6]/40 rounded-xl transition-all"
      >
        <Plus className="w-3.5 h-3.5 text-[#8B5CF6]" />
        <span>Sync & Upload Data</span>
      </button>
    </div>
  );
}
