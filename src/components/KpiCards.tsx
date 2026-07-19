import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertTriangle, Target, Clock, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { KpiItem } from '../types';
import { useDashboard } from '../utils/useDashboard';

interface KpiCardsProps {
  onCardClick?: (type: string) => void;
  selectedMetric?: string;
}

export default function KpiCards({ onCardClick, selectedMetric }: KpiCardsProps) {
  const { kpis, isLoading, error } = useDashboard();

  const getMetricStyles = (type: string) => {
    switch (type) {
      case 'feedback':
        return { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', stroke: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.25)', icon: MessageSquare };
      case 'painpoints':
        return { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)', stroke: '#3B82F6', glow: 'rgba(59, 130, 246, 0.25)', icon: AlertTriangle };
      case 'accuracy':
        return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', stroke: '#10B981', glow: 'rgba(16, 185, 129, 0.25)', icon: Target };
      case 'responsetime':
        return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', stroke: '#F59E0B', glow: 'rgba(245, 158, 11, 0.25)', icon: Clock };
      default:
        return { color: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.08)', stroke: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.15)', icon: MessageSquare };
    }
  };

  // Generate SVG path for a sparkline
  const generateSparklinePath = (data: number[], width = 120, height = 30) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min === 0 ? 1 : max - min;
    
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      // Invert Y coordinate since SVG (0,0) is top-left
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const linePath = `M ${points.join(' L ')}`;
    // Closed path for the under-gradient
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return { linePath, areaPath };
  };

  if (isLoading) {
    return (
      <div id="kpi-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map((i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4 min-h-[180px] animate-pulse">
            <div className="h-4 bg-white/5 rounded w-24" />
            <div className="h-8 bg-white/5 rounded w-16 mt-2" />
            <div className="h-3 bg-white/5 rounded w-20 mt-1" />
            <div className="h-8 bg-white/5 rounded w-full mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div id="kpi-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="col-span-full glass-panel p-5 rounded-2xl border-rose-500/20 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span className="text-xs text-zinc-400">Failed to load KPIs: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div id="kpi-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => {
        const styles = getMetricStyles(kpi.type);
        const Icon = styles.icon;
        const isSelected = selectedMetric === kpi.type;
        const { linePath, areaPath } = generateSparklinePath(kpi.sparklineData);

        return (
          <div
            key={kpi.type}
            onClick={() => onCardClick && onCardClick(kpi.type)}
            className={`relative p-5 rounded-2xl cursor-pointer select-none transition-all duration-300 border overflow-hidden min-w-0 w-full h-full flex flex-col justify-between ${
              isSelected 
                ? 'bg-[#12121D] border-[#8B5CF6]/50 shadow-[0_0_25px_rgba(139,92,246,0.18)]' 
                : 'glass-panel hover:bg-white/[0.04] border-white/5 hover:border-white/10'
            }`}
          >
            {/* Ambient hover glowing node */}
            <div 
              className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" 
              style={{ 
                backgroundColor: styles.color,
                boxShadow: `0 0 10px ${styles.color}` 
              }} 
            />

            <div>
              {/* Title & Icon Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-zinc-400 tracking-wide font-sans">{kpi.title}</span>
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0"
                  style={{ 
                    backgroundColor: styles.bg,
                    borderColor: `${styles.color}25`
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: styles.color }} />
                </div>
              </div>

              {/* Value & Indicator */}
              <div className="relative z-10 flex flex-col min-w-0">
                <span className="text-3xl font-bold tracking-tight text-white font-sans leading-none">
                  {kpi.value}
                </span>
                
                <div className="flex items-center gap-1.5 mt-2">
                  <span 
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono shrink-0"
                    style={{ 
                      backgroundColor: kpi.type === 'responsetime' ? 'rgba(34, 197, 94, 0.1)' : `${styles.color}15`,
                      color: kpi.type === 'responsetime' ? '#22C55E' : styles.color
                    }}
                  >
                    {kpi.type === 'responsetime' ? '↓' : '↑'} {kpi.change}
                  </span>
                  <span className="text-[9px] font-medium text-zinc-500 font-mono">vs last 7d</span>
                </div>
              </div>
            </div>

            {/* Sparkline Graphic widget in bottom section */}
            <div className="mt-4 w-full h-[34px] relative z-0">
              <svg width="100%" height="100%" viewBox="0 0 120 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`grad-${kpi.type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={styles.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={styles.color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Under Gradient Fill */}
                <path d={areaPath} fill={`url(#grad-${kpi.type})`} />
                
                {/* Glowing Stroke line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={styles.color}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: `drop-shadow(0 0 3px ${styles.color}80)`
                  }}
                />
              </svg>
            </div>

          </div>
        );
      })}
    </div>
  );
}
