import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Check, 
  Loader2, 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  TrendingUp, 
  FileText, 
  Compass, 
  User, 
  MessageSquare 
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiCopilotProps {
  onTriggerRoadmap?: () => void;
  onSearchCommand?: (text: string) => void;
}

export default function AiCopilot({ onTriggerRoadmap, onSearchCommand }: AiCopilotProps) {
  const [inputText, setInputText] = useState('');
  const [isCopilotThinking, setIsCopilotThinking] = useState(true); // Default to thinking to match image on boot
  const [currentThinkingStep, setCurrentThinkingStep] = useState(3); // Shows Generating insights loading
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'What are our top customers asking for?',
      timestamp: '10:30 AM'
    }
  ]);

  const suggestedPrompts = [
    { label: 'What should we build next?', text: 'What should we build next based on pain points?', icon: Search },
    { label: 'Show me user sentiment trend', text: 'Show me user sentiment trend and core feedback', icon: TrendingUp },
    { label: 'Summarize interview insights', text: 'Summarize the latest user interview insights', icon: FileText },
    { label: 'Find top pain points', text: 'Find top pain points ranked by user mentions', icon: Compass }
  ];

  const copilotResponses: Record<string, { text: string; sources: string[]; steps: string[] }> = {
    'what should we build next': {
      text: 'Offline Mode is your highest priority feature to build next. It represents 33.6% (432 mentions) of total user friction. Resolving this will immediately boost user sentiment score and aligns directly with requests in the customer surveys.',
      sources: ['Customer Survey Results.csv', 'Support Tickets - Week 20.csv'],
      steps: ['Scanning feedback records', 'Calculating impact weights', 'Predicting sentiment bounce', 'Formulating priority recommendation']
    },
    'show me user sentiment trend': {
      text: 'Sentiment is highly positive at 39.9% (512 reviews). However, 21.7% is negative, specifically tied to app lag, seat search bugs, and navigation friction. Addressing navigation issues will immediately move neutral reviewers to positive.',
      sources: ['Customer Survey Results.csv', 'App Store Reviews.xlsx'],
      steps: ['Parsing sentiment fields', 'Aggregating timeline averages', 'Isolating negative feedback categories']
    },
    'summarize the latest user interview insights': {
      text: 'In the latest video recording "User Interviews - May 2025.mp4", users strongly vocalized a need for stable local-first storage. There is high willingness to upgrade to Enterprise tier if reliable background syncing is deployed.',
      sources: ['User Interviews - May 2025.mp4'],
      steps: ['Parsing audio transcript', 'Extracting core customer quotes', 'Classifying pain point relevance']
    },
    'find top pain points ranked by user mentions': {
      text: 'The classified pain points ranked by customer mentions are:\n1. Offline Mode (432 mentions) — High Impact\n2. Dark Mode (310 mentions) — High Impact\n3. Navigation Issues (220 mentions) — Medium Impact\n4. Seat Search (158 mentions) — Medium Impact.',
      sources: ['Support Tickets - Week 20.csv', 'App Store Reviews.xlsx'],
      steps: ['Clustering friction keywords', 'Weighting mention counts', 'Filtering out outliers']
    }
  };

  // Autocomplete analyzing on startup after 5 seconds to show rich loaded text
  useEffect(() => {
    if (isCopilotThinking && messages.length === 1) {
      const timer = setTimeout(() => {
        setIsCopilotThinking(false);
        setMessages(prev => [
          ...prev,
          {
            id: 'm2',
            sender: 'ai',
            text: 'Based on our multi-source intelligence ingest, customers are heavily focusing on mobile capability and design enhancements. Offline synchronization remains their paramount requirement.',
            timestamp: '10:31 AM',
            confidenceScore: 96,
            sources: ['User Interviews - May 2025.mp4', 'Customer Survey Results.csv']
          }
        ]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isCopilotThinking, messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCopilotThinking]);

  const triggerCopilotResponse = (userQuery: string) => {
    setIsCopilotThinking(true);
    setCurrentThinkingStep(0);

    const cleanQuery = userQuery.toLowerCase();
    let matchKey = '';
    
    if (cleanQuery.includes('build next')) matchKey = 'what should we build next';
    else if (cleanQuery.includes('sentiment')) matchKey = 'show me user sentiment trend';
    else if (cleanQuery.includes('interview')) matchKey = 'summarize the latest user interview insights';
    else if (cleanQuery.includes('pain point') || cleanQuery.includes('ranked')) matchKey = 'find top pain points ranked by user mentions';

    const matchedResponse = matchKey ? copilotResponses[matchKey] : {
      text: `Based on StadiumIQ product statistics, we classified ${userQuery.length + 120} distinct customer triggers. Let me know if you would like me to compile a comprehensive document layout.`,
      sources: ['Support Tickets - Week 20.csv'],
      steps: ['Querying database', 'Filtering results', 'Formatting reply']
    };

    // Cycle through thinking steps
    let currentStep = 0;
    const stepsCount = matchedResponse.steps ? matchedResponse.steps.length : 3;
    const stepInterval = setInterval(() => {
      currentStep += 1;
      setCurrentThinkingStep(currentStep);
      if (currentStep >= stepsCount) {
        clearInterval(stepInterval);
        setIsCopilotThinking(false);

        // Streaming typewriter text addition
        const newAiMessageId = Math.random().toString();
        const fullText = matchedResponse.text;
        
        setMessages(prev => [
          ...prev,
          {
            id: newAiMessageId,
            sender: 'ai',
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isStreaming: true,
            confidenceScore: 92 + Math.floor(Math.random() * 7),
            sources: matchedResponse.sources
          }
        ]);

        let charIdx = 0;
        const typingInterval = setInterval(() => {
          charIdx += 4;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === newAiMessageId 
                ? { ...msg, text: fullText.substring(0, charIdx), isStreaming: charIdx < fullText.length } 
                : msg
            )
          );

          if (charIdx >= fullText.length) {
            clearInterval(typingInterval);
          }
        }, 30);
      }
    }, 800);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isCopilotThinking) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    triggerCopilotResponse(userMessage.text);
  };

  const handleSuggestionClick = (promptText: string) => {
    if (isCopilotThinking) return;
    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    triggerCopilotResponse(promptText);
  };

  return (
    <aside 
      id="ai-copilot-sidebar" 
      className="w-full xl:w-[420px] shrink-0 flex flex-col gap-4 h-fit xl:sticky xl:top-6 select-none"
    >
      {/* CARD 1: AI COPILOT CHAT BOX */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between min-h-[310px] max-h-[380px]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#A855F7] animate-pulse" />
                <div className="absolute -inset-1 rounded-full bg-[#A855F7]/20 blur-sm -z-10 animate-ping" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">AI Copilot</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 font-semibold">Powered by Discovery AI</span>
          </div>

          {/* Messages Loop / Thinking state */}
          <div className="overflow-y-auto max-h-[220px] pr-1 flex flex-col gap-3 scroll-smooth">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Title Header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-mono text-zinc-500">{msg.timestamp}</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                    {msg.sender === 'user' ? 'User' : 'Copilot'}
                  </span>
                </div>

                {/* Bubble Body */}
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[95%] border ${
                    msg.sender === 'user'
                      ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-white rounded-tr-none font-medium'
                      : 'bg-[#09090E]/60 border-white/5 text-zinc-300 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.isStreaming && <span className="typing-cursor ml-1" />}

                  {/* Sources / Confidence details */}
                  {!msg.isStreaming && msg.sender === 'ai' && msg.sources && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col gap-1.5">
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((src, i) => (
                          <span 
                            key={i} 
                            onClick={() => onSearchCommand && onSearchCommand(src)}
                            className="text-[8px] font-mono font-bold text-zinc-400 bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded cursor-pointer hover:bg-white/[0.08]"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Simulated checklist (Matches the screenshot exactly when isCopilotThinking) */}
            {isCopilotThinking && (
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-mono text-zinc-500">10:30 AM</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Copilot</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#09090F]/50 border border-white/5 text-xs text-zinc-400 rounded-tl-none w-full flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-[#8B5CF6] animate-spin" />
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">AI is analyzing your data...</span>
                  </div>

                  <div className="flex flex-col gap-2 pl-5 border-l border-white/5">
                    {[
                      { label: 'Reading documents', success: currentThinkingStep >= 0 },
                      { label: 'Identifying patterns', success: currentThinkingStep >= 1 },
                      { label: 'Analyzing sentiment', success: currentThinkingStep >= 2 },
                      { label: 'Generating insights', success: currentThinkingStep >= 3 }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[10px]">
                        <span className={step.success ? 'text-zinc-400 font-semibold' : 'text-zinc-600 font-semibold'}>
                          {step.label}
                        </span>
                        {step.success ? (
                          idx === 3 && isCopilotThinking ? (
                            <Loader2 className="w-3 h-3 text-[#8B5CF6] animate-spin shrink-0" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 shrink-0 mr-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="relative mt-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything..."
            disabled={isCopilotThinking}
            className="w-full bg-[#121218] border border-white/5 focus:border-[#8B5CF6]/50 rounded-xl py-2.5 pl-3.5 pr-11 text-xs font-medium text-white placeholder-zinc-500 outline-none transition-all duration-300"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isCopilotThinking}
            className="absolute right-1.5 top-[50%] -translate-y-[50%] w-7 h-7 rounded-lg bg-[#8B5CF6] hover:bg-[#A855F7] active:scale-90 text-white transition-all flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* CARD 2: TOP CUSTOMER REQUESTS */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between min-h-[190px]">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">Top Customer Requests</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { id: 1, title: 'Offline Mode', mentions: 432, impact: 'High impact', color: 'text-[#A855F7] bg-[#8B5CF6]/10 border-[#8B5CF6]/20' },
              { id: 2, title: 'Dark Mode', mentions: 310, impact: 'High impact', color: 'text-[#A855F7] bg-[#8B5CF6]/10 border-[#8B5CF6]/20' },
              { id: 3, title: 'Navigation Issues', mentions: 220, impact: 'Medium impact', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
            ].map((req) => (
              <div 
                key={req.id} 
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors gap-3 min-w-0"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Number Badge */}
                  <div className="w-5.5 h-5.5 rounded-md bg-white/5 flex items-center justify-center text-xs text-zinc-400 font-bold shrink-0">
                    {req.id}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-white truncate leading-tight block w-full">{req.title}</span>
                    <span className="text-[9px] text-zinc-500 font-medium font-mono mt-0.5">{req.mentions} mentions</span>
                  </div>
                </div>

                {/* Impact Badge */}
                <span className={`text-[8px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shrink-0 border ${req.color}`}>
                  {req.impact}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-2.5 text-[9px] text-zinc-500">
          <span>Based on 1,284 feedback items</span>
          <div className="flex items-center gap-2">
            <button className="hover:text-white transition-colors">
              <ThumbsUp className="w-3 h-3 text-zinc-500 hover:text-[#22C55E]" />
            </button>
            <button className="hover:text-white transition-colors">
              <ThumbsDown className="w-3 h-3 text-zinc-500 hover:text-[#EF4444]" />
            </button>
          </div>
        </div>
      </div>

      {/* CARD 3: SUGGESTED INQUIRIES & ROADMAP ACTIONS */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 min-h-[220px]">
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Suggested Inquiries</span>
          
          <div className="flex flex-col gap-1.5">
            {suggestedPrompts.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(item.text)}
                  className="w-full text-left p-2.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 text-[10px] font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-2.5 group"
                >
                  <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#8B5CF6] transition-colors shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Action Button */}
        <button 
          onClick={onTriggerRoadmap}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-115 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] mt-1"
        >
          <span>Generate Product Roadmap</span>
          <Sparkles className="w-3.5 h-3.5 text-[#E9D5FF] animate-pulse" />
        </button>
      </div>
    </aside>
  );
}
