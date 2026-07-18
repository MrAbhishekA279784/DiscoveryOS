import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  CheckCircle, 
  Calendar, 
  ChevronRight, 
  X, 
  ArrowRight,
  Info,
  Sliders,
  Settings,
  Grid
} from 'lucide-react';

import BackgroundEffect from './components/BackgroundEffect';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HeroSection from './components/HeroSection';
import KpiCards from './components/KpiCards';
import { 
  TopPainPointsCard, 
  FeedbackTrendCard, 
  SentimentOverviewCard, 
  AiRecommendationsCard 
} from './components/InteractiveCharts';
import RecentUploadsCard from './components/RecentUploadsCard';
import UploadExperience from './components/UploadExperience';
import AiCopilot from './components/AiCopilot';
import { FileItem, KpiItem, PainPoint, Recommendation } from './types';
import { generateDashboardPDF } from './utils/pdf';

// Module Page Views
import ResearchView from './components/ResearchView';
import InsightsView from './components/InsightsView';
import RoadmapView from './components/RoadmapView';
import AiCopilotView from './components/AiCopilotView';
import ReportsView from './components/ReportsView';
import ProjectsView from './components/ProjectsView';
import DataSourcesView from './components/DataSourcesView';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMetric, setSelectedMetric] = useState('feedback');
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Default Files loaded from the mockup
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([
    { id: '1', name: 'User Interviews - May 2025.mp4', size: '24 MB', type: 'video', timestamp: '2h ago' },
    { id: '2', name: 'Customer Survey Results.csv', size: '18 KB', type: 'csv', timestamp: '5h ago' },
    { id: '3', name: 'Support Tickets - Week 20.csv', size: '45 KB', type: 'csv', timestamp: '1d ago' },
    { id: '4', name: 'App Store Reviews.xlsx', size: '22 KB', type: 'xlsx', timestamp: '2d ago' },
  ]);

  const [storageUsage, setStorageUsage] = useState(82); // represents 82%
  const [tokenUsage, setTokenUsage] = useState(13); // represents 13%

  const [isExporting, setIsExporting] = useState(false);
  const [activeDateRange, setActiveDateRange] = useState('May 12 - May 19, 2025');

  interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    // Simulate a brief generation delay for premium UX
    setTimeout(() => {
      try {
        const kpis: KpiItem[] = [
          {
            title: 'Total Feedback',
            value: '1,284',
            change: '12.5%',
            isPositive: true,
            type: 'feedback',
            iconName: 'MessageSquare',
            sparklineData: [40, 45, 38, 52, 48, 62, 58, 65, 74, 85, 80, 92]
          },
          {
            title: 'Pain Points Identified',
            value: '32',
            change: '8.3%',
            isPositive: true,
            type: 'painpoints',
            iconName: 'AlertTriangle',
            sparklineData: [20, 24, 22, 28, 25, 30, 28, 35, 31, 38, 34, 42]
          },
          {
            title: 'AI Accuracy',
            value: '96%',
            change: '4.2%',
            isPositive: true,
            type: 'accuracy',
            iconName: 'Target',
            sparklineData: [90, 91, 89, 92, 93, 92, 94, 95, 94, 96, 95, 96]
          },
          {
            title: 'Avg. Response Time',
            value: '1.2s',
            change: '-0.3s',
            isPositive: true,
            type: 'responsetime',
            iconName: 'Clock',
            sparklineData: [1.8, 1.7, 1.6, 1.5, 1.5, 1.4, 1.3, 1.3, 1.2, 1.2, 1.2, 1.2]
          }
        ];

        const painPoints: PainPoint[] = [
          { id: '1', name: 'Offline Mode', count: 432, percentage: 33.6 },
          { id: '2', name: 'Dark Mode', count: 310, percentage: 24.1 },
          { id: '3', name: 'Navigation Issues', count: 220, percentage: 17.1 },
          { id: '4', name: 'Seat Search', count: 158, percentage: 12.3 },
          { id: '5', name: 'Price Transparency', count: 96, percentage: 7.5 },
          { id: '6', name: 'Language Support', count: 68, percentage: 5.4 }
        ];

        const sentimentData = [
          { name: 'Positive', value: 512, percentage: 39.9, color: '#22C55E' },
          { name: 'Neutral', value: 423, percentage: 32.9, color: '#F59E0B' },
          { name: 'Negative', value: 278, percentage: 21.7, color: '#EF4444' },
          { name: 'Mixed', value: 71, percentage: 5.5, color: '#A855F7' }
        ];

        const recommendations: Recommendation[] = [
          {
            id: 'r1',
            title: 'Prioritize Offline Mode',
            freqImpact: 'High frequency + High impact',
            confidence: 94,
            iconName: 'Sparkles'
          },
          {
            id: 'r2',
            title: 'Improve Navigation Flow',
            freqImpact: 'Medium frequency + High impact',
            confidence: 78,
            iconName: 'Zap'
          },
          {
            id: 'r3',
            title: 'Add Dark Mode Support',
            freqImpact: 'High frequency + Medium impact',
            confidence: 71,
            iconName: 'Moon'
          }
        ];

        generateDashboardPDF({
          workspace: 'StadiumIQ',
          activeDateRange: activeDateRange,
          kpis,
          painPoints,
          sentimentData,
          recommendations,
          uploadedFilesCount: uploadedFiles.length
        });

        showToast('Executive summary report downloaded successfully.', 'success');
      } catch (err) {
        console.error('Failed to generate PDF report:', err);
        showToast('Failed to download executive summary report.', 'error');
      } finally {
        setIsExporting(false);
      }
    }, 1000);
  };

  // Callback when a simulated file is loaded
  const handleNewUpload = (newFile: FileItem) => {
    setUploadedFiles(prev => [newFile, ...prev]);
    // Gently increment stats
    setStorageUsage(prev => Math.min(100, prev + 3));
    setTokenUsage(prev => Math.min(100, prev + 5));
    setActiveStep(2); // Advanced state to Analyze
    showToast(`Successfully uploaded & sync'd: ${newFile.name}`, 'success');
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    if (index === 1) {
      // Open uploader modal on step 1 click
      setIsUploadOpen(true);
    } else if (index === 2) {
      // Set to active analysis
      setSelectedMetric('accuracy');
    } else if (index === 3) {
      // Highlight metrics
      setSelectedMetric('painpoints');
    } else if (index === 4) {
      // Generate roadmap
      setRoadmapOpen(true);
    }
  };

  const handleSearchCommand = (cmdText: string) => {
    // Scroll or trigger views
    if (cmdText.toLowerCase().includes('analyze') || cmdText.toLowerCase().includes('interview')) {
      setCurrentView('dashboard');
      setActiveStep(2);
    } else if (cmdText.toLowerCase().includes('linear') || cmdText.toLowerCase().includes('roadmap')) {
      setRoadmapOpen(true);
    } else if (cmdText.toLowerCase().includes('settings')) {
      setCurrentView('settings');
    }
  };

  // Simulated Roadmap items for the popup
  const roadmapItems = [
    { quarter: 'Q3 2026', title: 'Local SQLite DB & Sync Engine', priority: 'Critical', confidence: '94%', complexity: 'Medium', items: ['Offline SQLite state storage', 'Atomic background sync loop', 'Delta record conflict resolver'] },
    { quarter: 'Q3 2026', title: 'Intelligent Nav Flow Refactoring', priority: 'High', confidence: '78%', complexity: 'High', items: ['Multi-panel workspace router', 'Predictive action item caching', 'Universal hotkey drawer'] },
    { quarter: 'Q4 2026', title: 'Universal Dark Mode Ecosystem', priority: 'Medium', confidence: '71%', complexity: 'Low', items: ['Dynamic contrast-shifting themes', 'Hardware-level media matchers', 'Luminance adjustment controller'] }
  ];

  return (
    <div id="application-root" className="min-h-screen relative font-sans text-white bg-[#07070A] p-6 flex flex-col xl:grid xl:grid-cols-[320px_minmax(0,1fr)] gap-6 max-w-[1920px] mx-auto min-w-0">
      {/* Cinematic Live Background Mesh and Ambient Glows */}
      <BackgroundEffect />

      {/* Left Sidebar Menu */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        storageUsage={storageUsage}
        tokenUsage={tokenUsage}
        onUploadClick={() => setIsUploadOpen(true)}
        onStartAIAnalysis={() => showToast('AI analysis pipeline initialized on current workspace files.', 'success')}
        onGenerateRoadmap={() => setRoadmapOpen(true)}
      />

      {/* Main Workspace Frame (Middle and Right merged into flex grid) */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 z-10">
        
        {/* Top Control Bar */}
        <TopBar 
          onSearchCommand={handleSearchCommand} 
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />

        <AnimatePresence mode="wait">
          {currentView === 'dashboard' ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start min-w-0"
            >
              
              {/* Central Panel */}
              <div className="flex-1 flex flex-col gap-6 min-w-0">
                
                {/* Hero Headers and the 4 Animated Progress pipelines */}
                <HeroSection 
                  activeStep={activeStep} 
                  onStepClick={handleStepClick} 
                />

                {/* Dashboard Subheader & KPI Cards Grid */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">Key Performance Indicators</span>
                    <span className="text-[9px] text-zinc-600 font-mono">Click metric to highlight</span>
                  </div>
                  <KpiCards 
                    onCardClick={setSelectedMetric} 
                    selectedMetric={selectedMetric} 
                  />
                </div>

                {/* Row 2: Analytics & Chart Row (Perfect alignment ratios) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  <div className="lg:col-span-5 h-full min-w-0">
                    <TopPainPointsCard />
                  </div>
                  <div className="lg:col-span-7 h-full min-w-0">
                    <FeedbackTrendCard />
                  </div>
                </div>

                {/* Row 3: Double Bento + Recent Uploads Grid (Unified bento bottom row) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-stretch">
                  <RecentUploadsCard 
                    files={uploadedFiles} 
                    onUploadClick={() => setIsUploadOpen(true)} 
                  />
                  <SentimentOverviewCard />
                  <AiRecommendationsCard />
                </div>

              </div>

              {/* Right Side AI Copilot Panel */}
              <AiCopilot 
                onTriggerRoadmap={() => setRoadmapOpen(true)}
                onSearchCommand={handleSearchCommand}
              />

            </motion.div>
          ) : currentView === 'settings' ? (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 glass-panel p-8 rounded-2xl border-white/8 max-w-4xl mx-auto my-4 flex flex-col gap-6"
            >
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-[#8B5CF6]" />
                  DiscoveryOS Configuration
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Configure workspace variables, developer targets, and security tokens.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Workspace Slug</label>
                  <input type="text" value="stadium-iq-enterprise" disabled className="w-full bg-white/[0.02] border border-white/5 p-3 rounded-xl text-xs text-zinc-400 font-mono cursor-not-allowed mt-1" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Discovery AI Version</label>
                  <input type="text" value="Discovery-v3.5-Omni-Pro (Staging)" disabled className="w-full bg-white/[0.02] border border-white/5 p-3 rounded-xl text-xs text-zinc-400 font-mono cursor-not-allowed mt-1" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Sync Interval</label>
                  <select className="w-full bg-[#121218] border border-white/5 p-3 rounded-xl text-xs text-zinc-300 font-mono mt-1 focus:border-[#8B5CF6]/50 outline-none">
                    <option>Real-Time Push Hooks</option>
                    <option>Hourly cron</option>
                    <option>Daily batch ingest</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Stripe Subscription</label>
                  <div className="w-full bg-white/[0.02] border border-white/5 p-3 rounded-xl flex items-center justify-between text-xs mt-1">
                    <span className="font-bold text-emerald-400">StadiumIQ Pro Tier</span>
                    <span className="text-[10px] text-zinc-500 font-mono">$490 / month</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Environment Status Flags</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1.5">
                  {[
                    { label: 'Gemini Keys API', val: 'Active', color: 'text-emerald-400 bg-emerald-500/10' },
                    { label: 'Cloud Run Ingress', val: 'Connected', color: 'text-emerald-400 bg-emerald-500/10' },
                    { label: 'Linear Sync Integration', val: 'Idle', color: 'text-amber-400 bg-amber-500/10' },
                    { label: 'OAuth Gateway', val: 'Configured', color: 'text-[#8B5CF6] bg-[#8B5CF6]/10' },
                    { label: 'DB Cluster Replica', val: '99.99% Up', color: 'text-emerald-400 bg-emerald-500/10' },
                    { label: 'Secure Socket Layers', val: 'Active', color: 'text-emerald-400 bg-emerald-500/10' }
                  ].map((flag, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-zinc-400">{flag.label}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase rounded px-1.5 py-0.5 mt-1 w-fit ${flag.color}`}>{flag.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                <button onClick={() => setCurrentView('dashboard')} className="px-4 py-2 rounded-xl hover:bg-white/[0.03] text-xs font-bold text-zinc-400">
                  Cancel
                </button>
                <button onClick={() => setCurrentView('dashboard')} className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#A855F7] text-xs font-bold text-white transition-all shadow-[0_4px_12px_rgba(139,92,246,0.3)]">
                  Save Changes
                </button>
              </div>
            </motion.div>
          ) : currentView === 'research' ? (
            <motion.div
              key="research-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full min-w-0"
            >
              <ResearchView />
            </motion.div>
          ) : currentView === 'insights' ? (
            <motion.div
              key="insights-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full min-w-0"
            >
              <InsightsView />
            </motion.div>
          ) : currentView === 'roadmap' ? (
            <motion.div
              key="roadmap-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full min-w-0"
            >
              <RoadmapView />
            </motion.div>
          ) : currentView === 'copilot' ? (
            <motion.div
              key="copilot-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full min-w-0"
            >
              <AiCopilotView />
            </motion.div>
          ) : currentView === 'reports' ? (
            <motion.div
              key="reports-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full min-w-0"
            >
              <ReportsView />
            </motion.div>
          ) : currentView === 'projects' ? (
            <motion.div
              key="projects-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full min-w-0"
            >
              <ProjectsView />
            </motion.div>
          ) : currentView === 'datasources' ? (
            <motion.div
              key="datasources-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full min-w-0"
            >
              <DataSourcesView />
            </motion.div>
          ) : (
            <motion.div
              key="generic-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 glass-panel p-12 rounded-2xl border-white/8 text-center max-w-2xl mx-auto my-12 flex flex-col items-center justify-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)] mb-2">
                <Grid className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h2 className="text-2xl font-serif text-white">Focus Panel Deployed</h2>
              <p className="text-xs text-zinc-400 max-w-sm">The <strong>{currentView}</strong> utility panel is connected. You can seamlessly access and map intelligence in real time.</p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="mt-4 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#A855F7] text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.25)]"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic AI Product Roadmap Generator Popup Modal */}
      <AnimatePresence>
        {roadmapOpen && (
          <>
            {/* Modal Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-all duration-300"
              onClick={() => setRoadmapOpen(false)}
            />

            {/* Modal Body container */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ type: 'spring', duration: 0.45 }}
                className="w-full max-w-2xl bg-[#0C0C12] border border-[#8B5CF6]/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.25)] pointer-events-auto"
              >
                {/* Header */}
                <div className="relative bg-white/[0.02] border-b border-white/10 px-6 py-4.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center border border-[#8B5CF6]/30">
                      <Sparkles className="w-4.5 h-4.5 text-[#8B5CF6] animate-pulse" />
                      <div className="absolute inset-0 rounded-lg bg-[#8B5CF6]/30 blur-sm -z-10" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">AI Product Roadmap</h3>
                      <p className="text-[10px] text-zinc-500 font-medium">Derived automatically from 1,284 customer feedback points</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setRoadmapOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/5 text-zinc-400 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
                  
                  {/* Summary Box */}
                  <div className="flex gap-3 bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 p-3.5 rounded-2xl items-start">
                    <Info className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      This roadmap targets the high frequency friction points detected on your dashboard: <strong>Offline Mode (33.6%)</strong>, <strong>Dark Mode (24.1%)</strong>, and <strong>Navigation Bugs (17.1%)</strong>. Features are prioritized automatically by customer volume and developer effort ratio.
                    </p>
                  </div>

                  {/* Roadmap Timeline */}
                  <div className="flex flex-col gap-4 relative pl-4 border-l border-white/5 ml-2">
                    {roadmapItems.map((item, idx) => (
                      <div key={idx} className="relative flex flex-col gap-2">
                        {/* Bullet point node */}
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] border-2 border-[#07070A] shadow-[0_0_8px_#8B5CF6]" />
                        
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold font-mono tracking-wider bg-white/[0.04] text-zinc-400 border border-white/5 px-2 py-0.5 rounded-md">
                              {item.quarter}
                            </span>
                            <span className="text-xs font-extrabold text-white">{item.title}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold font-mono text-[#8B5CF6] bg-[#8B5CF6]/10 px-1.5 py-0.2 rounded">
                              {item.priority} Priority
                            </span>
                            <span className="text-[9px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                              {item.confidence} Confidence
                            </span>
                          </div>
                        </div>

                        {/* List of actions */}
                        <ul className="flex flex-col gap-1 pl-4 list-disc text-[10px] text-zinc-400 leading-relaxed font-sans">
                          {item.items.map((it, i) => (
                            <li key={i} className="marker:text-zinc-600">{it}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-t border-white/10">
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Sync with Jira / Linear active
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setRoadmapOpen(false)}
                      className="px-4 py-2 rounded-xl hover:bg-white/[0.03] text-xs font-bold text-zinc-400"
                    >
                      Dismiss
                    </button>
                    <button 
                      onClick={() => setRoadmapOpen(false)}
                      className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#A855F7] text-xs font-bold text-white flex items-center gap-1 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
                    >
                      <span>Export to Linear</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Sync / Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <>
            {/* Modal Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 transition-all duration-300"
              onClick={() => setIsUploadOpen(false)}
            />

            {/* Modal Body container */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-xl bg-[#0C0C12] border border-[#8B5CF6]/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.25)] pointer-events-auto p-6 flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex flex-col text-left">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Sync & Ingest Data</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Upload user survey reports, recordings, or customer ticket lists</p>
                  </div>
                  <button 
                    onClick={() => setIsUploadOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Upload Panel */}
                <UploadExperience 
                  onUploadSuccess={(file) => {
                    handleNewUpload(file);
                    setIsUploadOpen(false);
                  }} 
                  files={uploadedFiles} 
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-xs sm:max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-[#09090F]/95 backdrop-blur-md border shadow-lg ${
                toast.type === 'error' 
                  ? 'border-rose-500/30 shadow-rose-500/5' 
                  : 'border-emerald-500/30 shadow-emerald-500/5'
              }`}
            >
              {toast.type === 'error' ? (
                <div className="w-5.5 h-5.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5.5 h-5.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              )}
              
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-white tracking-wide">
                  {toast.type === 'error' ? 'Export Failed' : 'Export Succeeded'}
                </span>
                <p className="text-[10px] text-zinc-400 font-medium leading-normal break-words">
                  {toast.message}
                </p>
              </div>

              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="p-1 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors shrink-0 mt-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
