import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileVideo, 
  FileText, 
  FileSpreadsheet, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  FileCode,
  FolderOpen
} from 'lucide-react';
import { FileItem } from '../types';

interface UploadExperienceProps {
  onUploadSuccess: (newFile: FileItem) => void;
  files: FileItem[];
}

export default function UploadExperience({ onUploadSuccess, files }: UploadExperienceProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'scanning' | 'analyzing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Simulated scanning step indicator
  const [scannedStep, setScannedStep] = useState(0);
  const scanSteps = [
    'Reading loaded document...',
    'Identifying recurring patterns...',
    'Analyzing emotional sentiment...',
    'Generating product insights...'
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
      case 'mp4':
        return <FileVideo className="w-4 h-4 text-[#8B5CF6]" />;
      case 'csv':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-4 h-4 text-amber-500" />;
      default:
        return <FileCode className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIconContainerStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
      case 'mp4':
        return 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20';
      case 'csv':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'xlsx':
      case 'xls':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  // Triggers simulated file scanning pipeline
  const processUploadedFile = (fileName: string, fileSize: string, type: string) => {
    setCurrentFile(fileName);
    setUploadState('uploading');
    setProgress(0);
    setScannedStep(0);

    // Step 1: Uploading progress
    let uploadProgress = 0;
    const uploadInterval = setInterval(() => {
      uploadProgress += 10;
      setProgress(uploadProgress);
      if (uploadProgress >= 100) {
        clearInterval(uploadInterval);
        setUploadState('scanning');
        
        // Step 2: Running through AI stages sequentially
        let step = 0;
        const scanInterval = setInterval(() => {
          step += 1;
          setScannedStep(step);
          if (step >= scanSteps.length) {
            clearInterval(scanInterval);
            setUploadState('completed');

            // Dispatch upload success to state
            setTimeout(() => {
              onUploadSuccess({
                id: Math.random().toString(36).substr(2, 9),
                name: fileName,
                size: fileSize,
                type: type,
                timestamp: 'Just now'
              });
              // Reset to idle
              setUploadState('idle');
            }, 1000);
          }
        }, 1200);
      }
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const ext = droppedFile.name.split('.').pop() || 'csv';
      const sizeStr = droppedFile.size > 1024 * 1024 
        ? `${(droppedFile.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(droppedFile.size / 1024).toFixed(0)} KB`;
      processUploadedFile(droppedFile.name, sizeStr, ext);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop() || 'csv';
      const sizeStr = selectedFile.size > 1024 * 1024 
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(selectedFile.size / 1024).toFixed(0)} KB`;
      processUploadedFile(selectedFile.name, sizeStr, ext);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* 1. Drag & Drop Upload Panel */}
      <div 
        id="drag-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer select-none text-center transition-all duration-300 min-h-[300px] h-full ${
          isDragOver 
            ? 'border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-[0_0_20px_rgba(139,92,246,0.15)] scale-[0.99]' 
            : uploadState !== 'idle'
            ? 'border-[#8B5CF6]/40 bg-[#0C0C12]/50 cursor-not-allowed'
            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
        }`}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          onChange={handleFileSelect} 
          className="hidden" 
          disabled={uploadState !== 'idle'} 
        />

        <AnimatePresence mode="wait">
          {uploadState === 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">Drag & Drop client feedback data</span>
                <p className="text-[10px] text-zinc-500 max-w-[240px] mx-auto leading-relaxed">
                  Support tickets, customer surveys, or raw audio/video recordings (.mp4, .csv, .xlsx).
                </p>
              </div>
              <span className="text-[10px] text-zinc-400 font-bold bg-white/[0.04] border border-white/5 px-2.5 py-1 rounded-lg">
                Or Browse Files
              </span>
            </motion.div>
          )}

          {uploadState === 'uploading' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4 w-full max-w-xs"
            >
              <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
              <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-zinc-300 truncate max-w-[180px]">{currentFile}</span>
                  <span className="font-mono text-[#8B5CF6] font-bold">{progress}%</span>
                </div>
                {/* Simulated bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase font-mono">Uploading securely...</span>
            </motion.div>
          )}

          {(uploadState === 'scanning' || uploadState === 'analyzing') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 w-full max-w-sm"
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] animate-spin" />
                <RefreshCw className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              
              <div className="text-center">
                <span className="text-xs font-bold text-white block mb-1">Discovery AI Processing...</span>
                <span className="text-[10px] text-zinc-400 font-mono italic block h-4">
                  {scanSteps[scannedStep] || 'Mining deep customer patterns...'}
                </span>
              </div>

              {/* Progress Step Nodes */}
              <div className="flex gap-2 mt-2">
                {scanSteps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                      i < scannedStep 
                        ? 'bg-[#10B981]' 
                        : i === scannedStep 
                        ? 'bg-[#8B5CF6] animate-ping' 
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {uploadState === 'completed' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">Completed</span>
              <p className="text-[10px] text-zinc-400 max-w-[200px] leading-relaxed">
                Source parsed and classified. Dashboard data metrics successfully synced.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Recent Uploads Archive List */}
      <div id="recent-uploads" className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px] h-full">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">Recent Uploads</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-500">Live Database</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${getIconContainerStyle(file.type)}`}>
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-white truncate block w-full">
                      {file.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 truncate">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase font-mono shrink-0">{file.type}</span>
                      <span className="text-[9px] text-zinc-600 font-mono">•</span>
                      <span className="text-[9px] text-zinc-500 font-mono truncate">{file.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[9px] text-zinc-500 font-mono">{file.timestamp}</span>
                  <span className="text-[8px] font-bold text-emerald-400 font-mono uppercase bg-emerald-500/10 px-1 py-0.2 rounded mt-1">
                    Ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full mt-4 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/[0.02] border border-white/5 rounded-xl transition-all">
          <span>View upload diagnostics</span>
        </button>
      </div>
    </div>
  );
}
