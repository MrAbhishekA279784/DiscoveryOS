import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  CheckCircle, 
  Pin, 
  Paperclip, 
  Cpu, 
  Search, 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  MessageSquare,
  Bookmark,
  ChevronRight,
  Database,
  Terminal,
  Grid
} from 'lucide-react';

export default function AiCopilotView() {
  const [messages, setMessages] = useState([
    { 
      id: 1,
      sender: 'user', 
      text: "Show me the technical recommendations for fixing the offline sync conflicts as a clean table.", 
      time: "11:02 AM" 
    },
    { 
      id: 2,
      sender: 'ai', 
      text: "Based on 47 indexed support tickets and server trace logs, here are the core mitigation plans:",
      table: [
        { layer: "Local Database", component: "SQLite Client Replica", recommendation: "Transition to logical conflict-free replicated data types (CRDTs)", severity: "Critical" },
        { layer: "Synchronization Controller", component: "Delta Reconciliation Manager", recommendation: "Enforce vector clock sequencing over absolute server timestamps", severity: "High" },
        { layer: "Ingress Router", component: "Socket Connection Listener", recommendation: "Stagger connection backoffs via Jittered Exponential Backoff", severity: "Medium" }
      ],
      code: `// Vector Clock Sequence Merge Validator
interface VectorClock {
  client_id: string;
  sequence_number: number;
}

export function resolveSyncDelta(local: VectorClock, remote: VectorClock) {
  if (local.sequence_number > remote.sequence_number) {
    return "client-authoritative-merge";
  }
  return "server-overwrite-block";
}`,
      sources: ['interview_user_382.txt', 'db_sync_error_stack.log'],
      confidence: '96.4%',
      time: "11:03 AM",
      pinned: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [activePromptTab, setActivePromptTab] = useState('sync');
  const [isTyping, setIsTyping] = useState(false);

  const promptTemplates = [
    { id: 'sync', title: 'Offline database sync failures', query: 'Recommend technical solutions for offline delta schema merging.' },
    { id: 'contrast', title: 'Contrast ratios & accessibility', query: 'List user complaints regarding dark mode UI readability.' },
    { id: 'drawer', title: 'Drawer navigation lag shift', query: 'Explain the root cause of layout shift and thread lock on drawer close.' }
  ];

  const contextMemories = [
    { key: 'Target Client', val: 'Enterprise Pro users' },
    { key: 'Main Friction', val: 'Offline DB delta overlaps' },
    { key: 'Workspace', val: 'StadiumIQ Enterprise' },
    { key: 'AI Context Depth', val: '47 connected source docs' }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const requestedQuery = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        text: `I have analyzed your request regarding "${requestedQuery}". Cross-referencing against our vector schemas, I recommend checking local sequence counters on connected nodes and scheduling thread buffers. Let me know if you would like a code snippet!`,
        sources: ['interview_user_382.txt'],
        confidence: '91.8%',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pinned: false
      }]);
    }, 1500);
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
      
      {/* Left Panel: Memory Context & Templates (col-span-4) */}
      <div className="xl:col-span-4 flex flex-col gap-5 min-w-0">
        
        {/* Context Memory Card */}
        <div className="flex flex-col gap-3 min-w-0">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">AI Context Memory</span>
          
          <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Cpu className="w-4.5 h-4.5 text-[#8B5CF6]" />
              <span>Active Agent Schema Memory</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5 mt-1.5">
              {contextMemories.map((mem, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.01] border border-white/5 text-[10.5px]">
                  <span className="font-mono text-zinc-400 font-bold uppercase text-[9px] tracking-wide">{mem.key}</span>
                  <span className="font-semibold text-white truncate max-w-[140px]">{mem.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt Templates */}
        <div className="flex flex-col gap-3 min-w-0">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">Prompt Templates</span>
          
          <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              {promptTemplates.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setInputText(pt.query)}
                  className="w-full text-left p-3 rounded-xl border border-white/5 hover:border-[#8B5CF6]/30 bg-white/[0.01] hover:bg-[#8B5CF6]/5 transition-all flex flex-col gap-1.5 group min-w-0"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10.5px] font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{pt.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                  <p className="text-[9.5px] text-zinc-400 truncate leading-none">{pt.query}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence / Model metrics */}
        <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-500 uppercase">
            <span>Model Telemetry</span>
            <span className="text-emerald-400">Connected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-zinc-300">Gemini 3.5 Omni (Enterprise Gateway)</span>
          </div>
        </div>

      </div>

      {/* Right Panel: Interactive Conversation Timeline (col-span-8) */}
      <div className="xl:col-span-8 flex flex-col gap-4 min-w-0 h-[620px] justify-between">
        
        {/* Chat Stream Panel */}
        <div className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4.5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col gap-2 max-w-[90%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-500 uppercase">
                {msg.sender === 'user' ? 'Researcher' : 'AI Assistant'} • {msg.time}
                {msg.pinned && <Pin className="w-3 h-3 text-[#8B5CF6] shrink-0" />}
              </div>

              <div 
                className={`p-4 rounded-2xl text-[11.5px] leading-relaxed border flex flex-col gap-3.5 ${
                  msg.sender === 'user'
                    ? 'bg-white/[0.02] border-white/8 text-zinc-100 rounded-tr-none'
                    : 'bg-[#12121E]/60 border-[#8B5CF6]/15 text-zinc-200 rounded-tl-none'
                }`}
              >
                {/* Main text response */}
                <span>{msg.text}</span>

                {/* Optional Table */}
                {msg.table && (
                  <div className="overflow-x-auto rounded-xl border border-white/5 mt-1">
                    <table className="w-full text-left border-collapse min-w-[380px] text-[10.5px]">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                          <th className="py-2.5 px-3 font-mono font-bold uppercase text-[9px] text-zinc-400">Layer</th>
                          <th className="py-2.5 px-3 font-mono font-bold uppercase text-[9px] text-zinc-400">Component</th>
                          <th className="py-2.5 px-3 font-mono font-bold uppercase text-[9px] text-zinc-400">Recommendation</th>
                          <th className="py-2.5 px-3 font-mono font-bold uppercase text-[9px] text-zinc-400">Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {msg.table.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                            <td className="py-2 px-3 text-zinc-400 font-mono text-[9.5px]">{row.layer}</td>
                            <td className="py-2 px-3 font-semibold text-white">{row.component}</td>
                            <td className="py-2 px-3 text-zinc-300 leading-normal">{row.recommendation}</td>
                            <td className="py-2 px-3">
                              <span className={`px-1 rounded text-[8px] font-mono uppercase font-bold ${
                                row.severity === 'Critical' ? 'bg-[#EF4444]/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>{row.severity}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Optional Code Block */}
                {msg.code && (
                  <div className="relative rounded-xl border border-white/5 overflow-hidden mt-1 font-mono text-[10px] bg-[#0E0E14] p-3 text-emerald-400">
                    <div className="absolute right-3 top-3 text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest font-mono">TypeScript</div>
                    <pre className="overflow-x-auto pr-16">{msg.code}</pre>
                  </div>
                )}

                {/* Optional metadata (Sources & Confidence) */}
                {(msg.sources || msg.confidence) && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 flex-wrap gap-2 text-[9px] font-mono text-zinc-500 font-semibold">
                    {msg.sources && (
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>Sources: {msg.sources.join(', ')}</span>
                      </div>
                    )}
                    {msg.confidence && (
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Confidence score: <strong className="text-white">{msg.confidence}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing animation indicator */}
          {isTyping && (
            <div className="flex flex-col gap-2 max-w-[80%] self-start items-start">
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">AI Assistant • typing...</span>
              <div className="p-3.5 rounded-2xl bg-[#12121E]/60 border border-[#8B5CF6]/15 rounded-tl-none flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
                <span>Generating vector sequence map...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form Box */}
        <form onSubmit={handleSendMessage} className="glass-panel p-3 rounded-2xl border-white/5 flex items-center gap-2.5 bg-[#0A0A10]/95">
          <button type="button" className="p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 text-zinc-400 hover:text-white transition-all shrink-0">
            <Paperclip className="w-4 h-4" />
          </button>

          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Copilot to code, summarize or query details..."
            className="flex-1 bg-transparent text-xs font-semibold text-white focus:outline-none min-w-0"
          />

          <button 
            type="submit" 
            className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
