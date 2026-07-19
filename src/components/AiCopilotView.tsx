import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Paperclip, 
  Cpu, 
  RefreshCw, 
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useCopilot } from '../utils/useCopilot';
import { useContextMemories } from '../utils/useContextMemories';
import { usePromptTemplates } from '../utils/usePromptTemplates';

export default function AiCopilotView() {
  const { messages, isLoading, error: copilotError, sendMessage, streamMessage } = useCopilot();
  const [inputText, setInputText] = useState('');
  const [activePromptTab, setActivePromptTab] = useState('sync');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const { memories: contextMemories, isLoading: memLoading, error: memError, refetch: refetchMem } = useContextMemories();
  const { templates: promptTemplates, isLoading: ptLoading, error: ptError, refetch: refetchPt } = usePromptTemplates();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const query = inputText;
    setInputText('');
    streamMessage(query, () => {});
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch" role="region" aria-label="AI Copilot View">
      
      {/* Left Panel: Memory Context & Templates (col-span-4) */}
      <div className="xl:col-span-4 flex flex-col gap-5 min-w-0">
        
        {/* Context Memory Card */}
        <div className="flex flex-col gap-3 min-w-0" role="region" aria-label="AI Context Memory">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">AI Context Memory</span>
          
          <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Cpu className="w-4.5 h-4.5 text-[#8B5CF6]" />
              <span>Active Agent Schema Memory</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5 mt-1.5">
              {memLoading ? (
                <div className="flex items-center justify-center gap-2 p-4 text-zinc-400 text-[10.5px]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
                  <span>Loading memories...</span>
                </div>
              ) : memError ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10.5px]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{memError}</span>
                  </div>
                  <button
                    onClick={() => refetchMem()}
                    className="flex items-center gap-1 text-[9px] font-mono font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              ) : contextMemories.length === 0 ? (
                <div className="flex items-center justify-center p-4 text-zinc-500 text-[10.5px]">
                  No context memories stored yet
                </div>
              ) : (
                contextMemories.map((mem, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.01] border border-white/5 text-[10.5px]">
                    <span className="font-mono text-zinc-400 font-bold uppercase text-[9px] tracking-wide">{mem.key}</span>
                    <span className="font-semibold text-white truncate max-w-[140px]">{mem.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Prompt Templates */}
        <div className="flex flex-col gap-3 min-w-0" role="region" aria-label="Prompt Templates">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold px-1">Prompt Templates</span>
          
          <div className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              {ptLoading ? (
                <div className="flex items-center justify-center gap-2 p-4 text-zinc-400 text-[10.5px]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
                  <span>Loading templates...</span>
                </div>
              ) : ptError ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10.5px]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{ptError}</span>
                  </div>
                  <button
                    onClick={() => refetchPt()}
                    className="flex items-center gap-1 text-[9px] font-mono font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              ) : promptTemplates.length === 0 ? (
                <div className="flex items-center justify-center p-4 text-zinc-500 text-[10.5px]">
                  No prompt templates available
                </div>
              ) : (
                promptTemplates.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setInputText(pt.prompt)}
                    className="w-full text-left p-3 rounded-xl border border-white/5 hover:border-[#8B5CF6]/30 bg-white/[0.01] hover:bg-[#8B5CF6]/5 transition-all flex flex-col gap-1.5 group min-w-0"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10.5px] font-bold text-white group-hover:text-[#8B5CF6] transition-colors">{pt.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                    <p className="text-[9.5px] text-zinc-400 truncate leading-none">{pt.prompt}</p>
                  </button>
                ))
              )}
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
        <div className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4.5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" aria-live="polite" aria-label="Chat messages">
          {copilotError && !isLoading && messages.length === 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{copilotError}</span>
            </div>
          )}

          {messages.length === 0 && !isLoading && !copilotError && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
              <Sparkles className="w-6 h-6 text-[#8B5CF6]" />
              <span className="text-xs font-medium">Ask the AI Copilot anything about your data</span>
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col gap-2 max-w-[90%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-500 uppercase">
                {msg.sender === 'user' ? 'Researcher' : 'AI Assistant'} • {msg.timestamp}
              </div>

              <div 
                className={`p-4 rounded-2xl text-[11.5px] leading-relaxed border flex flex-col gap-3.5 ${
                  msg.sender === 'user'
                    ? 'bg-white/[0.02] border-white/8 text-zinc-100 rounded-tr-none'
                    : 'bg-[#12121E]/60 border-[#8B5CF6]/15 text-zinc-200 rounded-tl-none'
                }`}
              >
                <span>{msg.text}{msg.isStreaming && <span className="typing-cursor ml-1" />}</span>

                {/* Optional metadata (Sources & Confidence) */}
                {msg.sender === 'ai' && (msg.sources || msg.confidenceScore) && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 flex-wrap gap-2 text-[9px] font-mono text-zinc-500 font-semibold">
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>Sources: {msg.sources.join(', ')}</span>
                      </div>
                    )}
                    {msg.confidenceScore && (
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Confidence score: <strong className="text-white">{msg.confidenceScore}%</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex flex-col gap-2 max-w-[80%] self-start items-start">
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">AI Assistant • thinking...</span>
              <div className="p-3.5 rounded-2xl bg-[#12121E]/60 border border-[#8B5CF6]/15 rounded-tl-none flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
                <span>Generating response...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form Box */}
        <form onSubmit={handleSendMessage} className="glass-panel p-3 rounded-2xl border-white/5 flex items-center gap-2.5 bg-[#0A0A10]/95">
          <button type="button" className="p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 text-zinc-400 hover:text-white transition-all shrink-0" aria-label="Attach file">
            <Paperclip className="w-4 h-4" />
          </button>

          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Copilot to code, summarize or query details..."
            className="flex-1 bg-transparent text-xs font-semibold text-white focus:outline-none min-w-0"
            aria-label="Ask AI Copilot to code, summarize or query details"
          />

          <button 
            type="submit" 
            className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
