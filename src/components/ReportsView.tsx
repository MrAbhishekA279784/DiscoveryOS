import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useReports } from '../utils/useReports';

export default function ReportsView() {
  const { reports, isLoading, error, isEmpty, generateReport, downloadReport } = useReports();
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const exportCards = [
    { type: 'PowerPoint Vector', size: '12.4 MB', desc: 'Editable high-fidelity corporate presentation slides with vector graphs', extension: 'PPTX', color: '#EC4899' },
    { type: 'Executive Report Document', size: '3.1 MB', desc: 'Summary of database conflict pain points and roadmap plans', extension: 'PDF', color: '#EF4444' },
    { type: 'Granular Feedback Index', size: '420 KB', desc: 'Raw spreadsheet of all 1,284 user reviews with sentiment vectors', extension: 'CSV', color: '#10B981' }
  ];

  const handleCreateReport = async () => {
    setIsGenerating(true);
    setGenError(null);
    try {
      await generateReport('pdf');
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (reportId: string) => {
    try {
      const blob = await downloadReport(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" role="region" aria-label="Reports View">
      
      {/* Top Banner Control Panel */}
      <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Executive Analytics</span>
          <h2 className="text-sm font-bold text-white mt-0.5 font-sans">Report Compilation Hub</h2>
        </div>

        <div className="flex items-center gap-3">
          {genError && (
            <span className="text-[10px] text-rose-400 font-medium">{genError}</span>
          )}
          <button 
            onClick={handleCreateReport}
            disabled={isGenerating}
            className="px-4 py-2.5 bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.3)] shrink-0"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Generating Core Vectors...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Compile Executive Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Executive Summary Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Executive summary statement list (Col-span-7) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Executive Summary</span>
            <h3 className="text-sm font-bold text-white mt-1">Cross-Functional AI Assessment</h3>
          </div>

          <div className="flex flex-col gap-3 mt-1 text-[11px] leading-relaxed text-zinc-300 font-sans">
            <div className="flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
              <p>
                <strong>Revenue Impact Lock:</strong> Resolving the critical offline database sync issue is projected to mitigate up to <strong>14.2%</strong> of current mid-market renewal contract churn.
              </p>
            </div>
            
            <div className="flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
              <p>
                <strong>Developer Efficiency:</strong> Auto-allocating two core frontend engineers from telemetry systems into local database synchronization structures will reduce milestone cycle delays by <strong>18%</strong>.
              </p>
            </div>

            <div className="flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
              <p>
                <strong>Sentiment Outlook:</strong> Net customer satisfaction remains elevated at <strong>72/100</strong>, though negative clusters are heavily concentrated around mobile nav frozen threads.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3.5 pt-3 border-t border-white/5 mt-1">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Sentiment Trend</span>
              <span className="text-xs font-bold text-emerald-400 mt-1">+6.1% this week</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Milestones Met</span>
              <span className="text-xs font-bold text-white mt-1">3 / 4 completed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Active Licenses</span>
              <span className="text-xs font-bold text-[#8B5CF6] mt-1">470 Premium</span>
            </div>
          </div>
        </div>

        {/* Risk & Recommendation Quick Card (Col-span-5) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Risk Indexes</span>
            <h3 className="text-sm font-bold text-white mt-1">Vulnerabilities & Blocking Constraints</h3>
          </div>

          <div className="flex flex-col gap-3 mt-1 justify-between flex-1">
            <div className="flex gap-3 bg-[#EF4444]/5 border border-[#EF4444]/15 p-3 rounded-xl items-start">
              <ShieldAlert className="w-4.5 h-4.5 text-[#EF4444] shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-white">Database Sync Overlap (Critical)</span>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                  Friction in delta database merges continues to block enterprise-wide sign-offs.
                </p>
              </div>
            </div>

            <div className="flex gap-3 bg-amber-500/5 border border-amber-500/15 p-3 rounded-xl items-start">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-white">UI Thread Freezing (High)</span>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                  Layout shifts inside navigation sidebar blocks trigger user reload loops.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Export Channels (PPTX, PDF, CSV) */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">Export Channels</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportCards.map((ec, idx) => (
            <div key={idx} className="glass-panel p-4.5 rounded-2xl border-white/5 hover:border-white/10 transition-all flex flex-col gap-3 min-w-0 justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">{ec.type}</span>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-normal">{ec.desc}</p>
                </div>
                
                <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: `${ec.color}15`, color: ec.color }}>
                  {ec.extension}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                <span className="text-[10px] text-zinc-500 font-mono">Size: {ec.size}</span>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#8B5CF6]/15 border border-white/5 text-zinc-300 hover:text-white text-[10px] font-bold flex items-center gap-1.5 transition-all">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Compilation History logs */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">Historical Compilation Logs</span>
        
        {isLoading && (
          <div className="glass-panel p-8 rounded-2xl border-white/5 flex items-center justify-center" aria-live="polite">
            <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
          </div>
        )}

        {error && !isLoading && (
          <div className="glass-panel p-4 rounded-2xl border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs" role="alert">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && (
          <div className="glass-panel overflow-x-auto rounded-2xl border-white/5">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Report Title</th>
                  <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Date Compiled</th>
                  <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Author</th>
                  <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Format</th>
                  <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Size</th>
                  <th className="py-3.5 px-4 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {(reports.length > 0 ? reports : []).map((hr, idx) => (
                  <tr key={hr.id || idx} className="border-b border-white/5 hover:bg-white/[0.01] last:border-0 transition-all">
                    <td className="py-3 px-4 flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                      <span className="text-xs font-bold text-white truncate max-w-[280px]">{hr.title || `Report ${hr.id}`}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400 font-mono">{hr.createdAt || hr.date || '-'}</td>
                    <td className="py-3 px-4 text-xs font-semibold text-zinc-300">{'author' in hr ? hr.author : 'AI Agent'}</td>
                    <td className="py-3 px-4">
                      <span className="text-[8px] font-bold font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-zinc-400">{hr.format || 'PDF'}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400 font-mono">{'size' in hr ? hr.size : '-'}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDownload(hr.id)} className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors" aria-label={`Download report ${hr.id}`}>
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && !isLoading && !error && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">No reports generated yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
