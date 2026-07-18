import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Cpu, BarChart3, Rocket, ArrowRight, Calendar, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

interface HeroSectionProps {
  activeStep: number;
  onStepClick: (stepIndex: number) => void;
}

export default function HeroSection({ activeStep, onStepClick }: HeroSectionProps) {
  const [pulseIndex, setPulseIndex] = useState(0);
  const [activeDateRange, setActiveDateRange] = useState('May 12 - May 19, 2025');
  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  const dateRanges = [
    'May 12 - May 19, 2025',
    'Last 7 Days',
    'Last 30 Days',
    'This Quarter',
    'All Time'
  ];

  // Self-running light pulse across steps
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      index: 1,
      title: 'UPLOAD',
      subtitle: 'Bring your data',
      icon: Upload,
      description: 'Drag and drop support tickets, video interviews, or customer surveys.',
      glowColor: 'rgba(139, 92, 246, 0.6)',
    },
    {
      index: 2,
      title: 'ANALYZE',
      subtitle: 'AI finds insights',
      icon: Cpu,
      description: 'Large Language Models scan documents and cluster user opinions automatically.',
      glowColor: 'rgba(168, 85, 247, 0.6)',
    },
    {
      index: 3,
      title: 'PRIORITIZE',
      subtitle: 'Focus on impact',
      icon: BarChart3,
      description: 'Weighted formula categorizes core requests by confidence and user frequency.',
      glowColor: 'rgba(59, 130, 246, 0.6)',
    },
    {
      index: 4,
      title: 'SHIP',
      subtitle: 'Build what matters',
      icon: Rocket,
      description: 'Directly bridge insights into actionable developer specifications.',
      glowColor: 'rgba(16, 185, 129, 0.6)',
    },
  ];

  return (
    <section id="discoveryos-hero" className="relative py-2 flex flex-col gap-6 select-none w-full">
      
      {/* Decorative gradient light pillar */}
      <div className="absolute top-0 left-[20%] w-[400px] h-40 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Header Row: Left titles, Right Date & Filters controls */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/[0.02] pb-4">
        
        {/* Left Side: Brand & Hero Typography */}
        <div className="flex flex-col gap-1 text-left">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-5xl font-normal tracking-tight text-white leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-400"
          >
            DiscoveryOS
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-[10px] md:text-[11px] font-bold tracking-widest text-[#8B5CF6] uppercase"
          >
            The AI Product Intelligence Platform
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs text-zinc-400 font-medium max-w-md mt-0.5"
          >
            Understand. Prioritize. Ship Better Products.
          </motion.p>
        </div>

        {/* Right Side: Filters Aligning perfectly on the right */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
          
          {/* Date Picker */}
          <div className="relative">
            <button
              onClick={() => setDateRangeOpen(!dateRangeOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#121218]/80 border border-white/5 hover:bg-white/[0.04] text-[11px] font-bold text-zinc-300 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>{activeDateRange}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>
            
            <AnimatePresence>
              {dateRangeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDateRangeOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0F0F16] border border-white/10 p-1 shadow-2xl z-20"
                  >
                    {dateRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setActiveDateRange(range);
                          setDateRangeOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/[0.04] rounded-lg transition-colors"
                      >
                        <span>{range}</span>
                        {activeDateRange === range && <Check className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Filters Toggle */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#121218]/80 border border-white/5 hover:bg-white/[0.04] text-[11px] font-bold text-zinc-300 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Filters</span>
          </button>
        </div>

      </div>

      {/* 4-Step Interactive Pipeline with Planet crescent background */}
      <div className="w-full relative mt-3 px-2">
        
        {/* Orbital Crescent Background (simulates planet horizon) */}
        <div className="absolute top-[32px] left-[5%] right-[5%] h-[200px] rounded-[100%] border-t border-purple-500/12 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent blur-[1.5px] pointer-events-none -z-10" />
        
        {/* Orbital nodes / stars */}
        <div className="absolute top-[28px] left-[32%] w-1 h-1 rounded-full bg-purple-400/40 blur-[0.5px] -z-10" />
        <div className="absolute top-[30px] right-[24%] w-1.5 h-1.5 rounded-full bg-indigo-400/30 blur-[0.5px] -z-10" />
        <div className="absolute top-[36px] left-[58%] w-1 h-1 rounded-full bg-fuchsia-400/40 blur-[0.5px] -z-10" />

        {/* Horizontal connector pipeline */}
        <div className="absolute top-[22px] left-[12%] right-[12%] h-[1.5px] bg-white/[0.03] z-0 hidden md:block">
          {/* Flowing particle animation */}
          <motion.div 
            className="h-full w-40 bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent"
            animate={{ left: ['0%', '100%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{ position: 'absolute' }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isHighlighted = activeStep === step.index;
            const hasPulse = pulseIndex === idx;

            return (
              <div 
                key={step.index}
                onClick={() => onStepClick(step.index)}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Visual Step Circle badge */}
                <div className="relative flex items-center justify-center mb-2">
                  <div 
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 border ${
                      isHighlighted
                        ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                        : hasPulse
                        ? 'bg-[#A855F7]/10 border-[#A855F7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'bg-[#09090F] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <span className={`text-[13px] font-mono font-bold ${isHighlighted ? 'text-white' : 'text-zinc-500'}`}>
                      {step.index}
                    </span>
                  </div>
                </div>

                {/* Step labels */}
                <span className={`text-[9px] font-bold tracking-widest font-mono mt-1 ${
                  isHighlighted ? 'text-[#8B5CF6]' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}>
                  {step.title}
                </span>
                
                <span className="text-xs font-bold text-white mt-0.5">
                  {step.subtitle}
                </span>

                <p className="text-[9px] text-zinc-500 mt-1.5 max-w-[170px] hidden md:block group-hover:text-zinc-400 transition-colors leading-relaxed text-center">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
