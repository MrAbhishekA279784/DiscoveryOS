import React, { useState } from 'react';
import { 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  Settings2, 
  FileText, 
  Search,
  Loader2
} from 'lucide-react';
import { useDataSources } from '../utils/useDataSources';
import { useFileConnectors } from '../utils/useFileConnectors';

export default function DataSourcesView() {
  const { dataSources, isLoading, error, isEmpty, syncDataSource, connectDataSource } = useDataSources();
  const [syncStates, setSyncStates] = useState<Record<string, 'idle' | 'syncing'>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { connectors: fileConnectors, isLoading: fcLoading, error: fcError, refetch: refetchFc } = useFileConnectors();

  const integrations = dataSources.length > 0 ? dataSources.map(ds => ({
    id: ds.id,
    name: ds.serviceType || ds.name || 'Unknown',
    category: ds.serviceType || 'Integration',
    status: ds.status === 'connected' ? 'Connected' : ds.status === 'error' ? 'Error' : 'Setup Required',
    volume: ds.volume || '0 KB',
    health: ds.health ? `${ds.health}%` : '—',
    lastSync: ds.lastSyncAt || 'Never',
    desc: `${ds.serviceType} data source connector`
  })) : [
    { id: 'drive', name: 'Google Drive', category: 'Document Cloud', status: 'Connected', volume: '14.2 MB', health: '99.8%', lastSync: '10 mins ago', desc: 'Syncs team folders, interview transcripts, and customer research briefs.' },
    { id: 'notion', name: 'Notion Workspace', category: 'Product Knowledge', status: 'Connected', volume: '4.8 MB', health: '100%', lastSync: '1 hour ago', desc: 'Ingests product specification databases, epic trackers, and draft roadmaps.' },
    { id: 'jira', name: 'Jira Software', category: 'Sprint Tracking', status: 'Connected', volume: '124 KB', health: '98.5%', lastSync: '2 hours ago', desc: 'Cross-references active crash tickets, bug backlogs, and customer escalations.' },
    { id: 'slack', name: 'Slack Channels', category: 'Team Communications', status: 'Connected', volume: '1.2 MB', health: '99.4%', lastSync: '5 mins ago', desc: 'Polls beta tester support channels and feedback pipelines in real time.' },
    { id: 'linear', name: 'Linear', category: 'Issue Tracking', status: 'Connected', volume: '340 KB', health: '100%', lastSync: '4 hours ago', desc: 'Synchronizes product discovery issues directly with engineering cycles.' },
    { id: 'api', name: 'REST API Gateway', category: 'Custom Integrations', status: 'Setup Required', volume: '0 KB', health: '—', lastSync: 'Never', desc: 'Inward webhook channel to pipeline proprietary telemetry into vector indices.' }
  ];

  const handleSyncSource = async (id: string) => {
    setSyncStates(prev => ({ ...prev, [id]: 'syncing' }));
    try {
      await syncDataSource(id);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncStates(prev => ({ ...prev, [id]: 'idle' }));
    }
  };

  const filteredIntegrations = integrations.filter(it => 
    it.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    it.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6" role="region" aria-label="Data Sources View">
      
      {/* Top Banner Control Panel */}
      <div className="glass-panel p-4.5 rounded-2xl border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Data Ingestion Hub</span>
          <h2 className="text-sm font-bold text-white mt-0.5 font-sans">Connected Integrations & Core Connectors</h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={() => handleSyncSource('all')}
            className="px-3.5 py-2.5 bg-white/[0.02] border border-white/8 hover:bg-white/[0.04] text-xs font-bold text-zinc-300 rounded-xl flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Force Sync All</span>
          </button>
          
          <button className="px-4 py-2.5 bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.25)]">
            <Plus className="w-4 h-4" />
            <span>Add Integration Source</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-2.5 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connected platforms..."
            className="w-full bg-[#0E0E15]/90 border border-white/5 pl-10 pr-3 py-1.5 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-all"
            aria-label="Search connected platforms"
          />
        </div>
      </div>

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredIntegrations.map((it) => {
          const isSyncing = syncStates[it.id] === 'syncing' || syncStates['all'] === 'syncing';
          return (
            <div key={it.id} className="glass-panel p-4.5 rounded-2xl border-white/5 hover:border-white/10 transition-all flex flex-col gap-3.5 justify-between relative min-w-0">
              <div className="flex flex-col gap-2 min-w-0">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold font-mono tracking-wider text-zinc-500 uppercase">{it.category}</span>
                    <span className="text-sm font-extrabold text-white mt-1 truncate">{it.name}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                    it.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
                  }`}>
                    {it.status}
                  </span>
                </div>

                <p className="text-[10.5px] text-zinc-400 mt-2 leading-relaxed font-sans line-clamp-3">
                  {it.desc}
                </p>
              </div>

              {/* Metrics Ingestion footer */}
              <div className="flex flex-col gap-3.5 pt-3 border-t border-white/5 mt-1.5">
                <div className="grid grid-cols-3 gap-2 text-[9.5px] font-mono text-zinc-500 font-semibold uppercase">
                  <div className="flex flex-col gap-0.5">
                    <span>Data volume</span>
                    <strong className="text-white font-sans mt-0.5 font-semibold text-[10.5px]">{it.volume}</strong>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>Index Health</span>
                    <strong className="text-emerald-400 font-sans mt-0.5 font-semibold text-[10.5px]">{it.health}</strong>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>Last Synced</span>
                    <strong className="text-zinc-300 font-sans mt-0.5 font-semibold text-[10.5px] truncate">{it.lastSync}</strong>
                  </div>
                </div>

                {/* Operations bar */}
                <div className="flex gap-2 justify-end mt-0.5">
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all">
                    <Settings2 className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => handleSyncSource(it.id)}
                    disabled={isSyncing || it.status !== 'Connected'}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                      it.status !== 'Connected' 
                        ? 'bg-zinc-500/5 text-zinc-500 cursor-not-allowed border border-transparent' 
                        : 'bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/20 text-[#A855F7] active:scale-95'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#8B5CF6]' : 'text-zinc-400'}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Binary Document and Native File Uploaders */}
      <div className="flex flex-col gap-3" aria-label="File Connectors">
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">Raw File Indexes</span>

        {fcLoading && (
          <div className="glass-panel p-8 rounded-2xl border-white/5 flex items-center justify-center" aria-live="polite">
            <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
          </div>
        )}

        {fcError && !fcLoading && (
          <div className="glass-panel p-4 rounded-2xl border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs" role="alert">
            <AlertCircle className="w-4 h-4" />
            <span>{fcError}</span>
            <button onClick={refetchFc} className="ml-auto px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/20 text-[#A855F7] active:scale-95 transition-all">
              Retry
            </button>
          </div>
        )}

        {!fcLoading && !fcError && fileConnectors.length === 0 && (
          <div className="glass-panel p-4 rounded-2xl border-white/5 flex items-center justify-center text-zinc-500 text-xs">
            No file connectors configured
          </div>
        )}

        {!fcLoading && !fcError && fileConnectors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fileConnectors.map((fc) => (
            <div key={fc.id} className="glass-panel p-4 rounded-2xl border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20 shrink-0">
                  <FileText className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">{fc.name}</span>
                  <div className="flex items-center gap-2.5 text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">
                    <span>{fc.type}</span>
                    <span>•</span>
                    <span>{String(fc.count)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end text-right font-mono text-[10px] gap-1 shrink-0">
                <span className="text-emerald-400 font-bold uppercase bg-emerald-500/10 px-1.5 py-0.2 rounded">{fc.status}</span>
                <span className="text-zinc-400 font-semibold">{fc.volume} ingested</span>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

    </div>
  );
}
