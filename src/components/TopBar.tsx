import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles,
  Command,
  TrendingUp,
  FileCode,
  Sliders,
  FileDown,
  Loader2,
  User,
  Shield,
  HelpCircle,
  LogOut,
  AlertCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearch } from '../utils/useSearch';
import { useNotifications } from '../utils/useNotifications';

interface TopBarProps {
  onSearchCommand?: (cmd: string) => void;
  onExportPDF?: () => void;
  isExporting?: boolean;
}

export default function TopBar({ onSearchCommand, onExportPDF, isExporting }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { results, isLoading: searchLoading, error: searchError, isEmpty, search } = useSearch();
  const { notifications, isLoading: notifLoading, error: notifError, refetch: refetchNotif } = useNotifications();

  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      search(value);
    }
  }, [search]);

  // Keyboard shortcut listener for Command+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const suggestedCommands = [
    { icon: Sparkles, text: 'Analyze user interviews from May', action: 'analyze_interviews' },
    { icon: TrendingUp, text: 'Show sentiment breakdown by source', action: 'show_sentiment' },
    { icon: FileCode, text: 'Export high priority tickets to Linear', action: 'export_linear' },
    { icon: Sliders, text: 'Configure custom ML classification models', action: 'config_ml' }
  ];

  const handleCommandClick = (cmdText: string) => {
    setSearchQuery(cmdText);
    if (onSearchCommand) {
      onSearchCommand(cmdText);
    }
    setTimeout(() => {
      setSearchOpen(false);
    }, 400);
  };

  return (
    <header id="top-bar" className="w-full flex items-center justify-between py-2.5 px-0 bg-transparent z-30 shrink-0 select-none">
      
      {/* Spacer or Left branding if needed. In screenshot search is centered or left-aligned */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-full bg-[#121218]/80 hover:bg-[#181824]/90 border border-white/5 transition-all duration-300 text-left outline-none"
            aria-label="Open search"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-400 font-medium">Search anything...</span>
            </div>
            <div className="flex items-center gap-0.5 bg-white/5 px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-400 border border-white/5">
              <Command className="w-2 h-2" />
              <span>K</span>
            </div>
          </button>
        </div>
      </div>

      {/* Right side: Export, Notifications, Avatar */}
      <div className="flex items-center gap-4">
        
        {/* Premium Export PDF Action */}
        <motion.button 
          onClick={onExportPDF}
          disabled={isExporting}
          layout
          initial={false}
          animate={{
            opacity: isExporting ? 0.6 : 1,
            backgroundColor: isExporting ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.1)',
            scale: isExporting ? 0.98 : 1,
          }}
          whileHover={isExporting ? {} : { scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.18)' }}
          whileTap={isExporting ? {} : { scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#8B5CF6]/25 text-[11px] font-bold text-[#C084FC] hover:text-white transition-all ${isExporting ? 'cursor-wait' : ''}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isExporting ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="flex items-center justify-center shrink-0"
                >
                  <Loader2 className="w-3.5 h-3.5 text-[#A855F7]" />
                </motion.div>
                <span>Exporting...</span>
              </motion.div>
            ) : (
              <motion.div
                key="export-text"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <FileDown className="w-3.5 h-3.5 text-[#A855F7] shrink-0" />
                <span>Export as PDF</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-full hover:bg-white/5 text-zinc-300 transition-all duration-300"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {!notifLoading && !notifError && notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#8B5CF6] text-[8px] font-extrabold text-white flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2.5 w-80 rounded-2xl bg-[#0F0F16] border border-white/10 p-3 shadow-2xl z-20"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    <button className="text-[10px] text-[#8B5CF6] font-semibold hover:underline">Mark all read</button>
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto" aria-live="polite">
                    {notifLoading && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
                      </div>
                    )}

                    {notifError && !notifLoading && (
                      <div className="p-3 text-center">
                        <div className="flex items-center gap-2 text-rose-400 text-xs mb-2 justify-center">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{notifError}</span>
                        </div>
                        <button
                          onClick={refetchNotif}
                          className="text-[10px] text-[#8B5CF6] font-semibold hover:underline"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {!notifLoading && !notifError && notifications.length === 0 && (
                      <div className="p-6 text-center text-zinc-500 text-xs">
                        No notifications yet
                      </div>
                    )}

                    {!notifLoading && !notifError && notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          !notif.isRead 
                            ? 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20' 
                            : 'bg-white/[0.01] border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-white leading-tight">{notif.title}</span>
                          {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-1 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-snug">{notif.description}</p>
                        <span className="text-[9px] font-mono text-zinc-500 mt-1.5 block">{notif.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
            <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-white/5 transition-all text-left"
            aria-expanded={profileOpen}
            aria-label="User profile"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#8B5CF6]/40">
              {/* Fallback initials with visual avatar styling */}
              <div className="w-full h-full bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-xs font-bold text-white uppercase font-sans">
                AG
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-none">Abhishek</span>
              <span className="text-[9px] text-zinc-500 font-medium tracking-wide mt-0.5">Product Team</span>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Profile menu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2.5 w-52 rounded-2xl bg-[#0F0F16] border border-white/10 p-1.5 shadow-2xl z-20"
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                    <p className="text-xs font-bold text-white leading-none">Abhishek Gupta</p>
                    <span className="text-[9px] text-zinc-500 font-mono block mt-1.5">abhishek@stadiumiq.com</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-white/[0.04] transition-colors text-left">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-white/[0.04] transition-colors text-left">
                      <Shield className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Security & Keys</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-white/[0.04] transition-colors text-left">
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Support Desk</span>
                    </button>
                    <div className="h-[1px] bg-white/5 my-1" />
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 transition-all duration-300"
              onClick={() => setSearchOpen(false)}
            />
            
            <div className="fixed top-[15vh] left-[50%] -translate-x-[50%] w-full max-w-xl z-50 p-4">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="w-full rounded-2xl bg-[#0C0C12] border border-[#8B5CF6]/30 overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)]"
              >
                {/* Search Bar inside Modal */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
                  <Search className="w-5 h-5 text-[#8B5CF6]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    placeholder="Search documents, issues, or command AI..."
                    className="flex-1 bg-transparent border-none text-white text-sm font-medium outline-none placeholder-zinc-500"
                    autoFocus
                    aria-label="Search documents, issues, or command AI"
                  />
                  <div className="text-[10px] font-mono text-zinc-500 bg-white/[0.05] px-2 py-0.5 rounded border border-white/5">
                    ESC
                  </div>
                </div>

                {/* Suggestions list */}
                <div className="p-3">
                  <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider px-2 mb-2">
                    {searchQuery.trim() ? 'Search Results' : 'AI Suggestions & Fast Actions'}
                  </div>

                  <div className="flex flex-col gap-1">
                    {searchLoading && (
                      <div className="flex items-center gap-2 p-3 text-zinc-500 text-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
                        <span>Searching...</span>
                      </div>
                    )}

                    {searchError && !searchLoading && (
                      <div className="flex items-center gap-2 p-3 text-rose-400 text-xs">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{searchError}</span>
                      </div>
                    )}

                    {!searchLoading && !searchError && searchQuery.trim() && results.length > 0 && results.map((result, idx) => (
                      <button
                        key={result.id || idx}
                        onClick={() => { handleCommandClick(result.title); onSearchCommand && onSearchCommand(result.title); }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/20 border border-transparent transition-all text-left text-xs font-semibold text-zinc-300 hover:text-white"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/5 shrink-0">
                            <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
                          </div>
                          <div className="min-w-0">
                            <span className="truncate block">{result.title}</span>
                            {result.snippet && <span className="text-[9px] text-zinc-500 truncate block mt-0.5">{result.snippet}</span>}
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/5 uppercase shrink-0 ml-2">
                          {result.source || 'Document'}
                        </span>
                      </button>
                    ))}

                    {!searchLoading && !searchError && !searchQuery.trim() && suggestedCommands.map((cmd, idx) => {
                      const CmdIcon = cmd.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleCommandClick(cmd.text)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/20 border border-transparent transition-all text-left text-xs font-semibold text-zinc-300 hover:text-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-white/[0.03] flex items-center justify-center border border-white/5">
                              <CmdIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            </div>
                            <span>{cmd.text}</span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500 bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/5 uppercase">
                            Action
                          </span>
                        </button>
                      );
                    })}

                    {!searchLoading && !searchError && searchQuery.trim() && results.length === 0 && (
                      <div className="p-6 text-center text-zinc-500 text-xs">
                        No matches found for <span className="font-mono text-zinc-400">"{searchQuery}"</span>.
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer instructions */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-t border-white/5 text-[10px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-3">
                    <span>↑↓ Navigation</span>
                    <span>⏎ Select</span>
                  </div>
                  <span>DiscoveryOS AI Agent Mode</span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
