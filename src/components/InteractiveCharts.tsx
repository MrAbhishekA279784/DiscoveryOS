import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  TrendingUp, 
  PieChart, 
  Sparkles, 
  ChevronDown, 
  ArrowRight,
  Info,
  Smartphone,
  Moon,
  Compass,
  Search,
  DollarSign,
  Globe,
  Zap,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { PainPoint, Recommendation } from '../types';
import { useDashboard } from '../utils/useDashboard';
import { useAnalytics } from '../utils/useAnalytics';

// ==========================================
// 1. TOP PAIN POINTS CARD
// ==========================================
interface PainPointsProps {
  onPainPointClick?: (point: PainPoint) => void;
}

const painPointIcons: Record<string, React.ComponentType<any>> = {
  'offline': Smartphone,
  'dark': Moon,
  'navigation': Compass,
  'seat': Search,
  'price': DollarSign,
  'language': Globe,
};

function getPainPointIcon(name: string | undefined): React.ComponentType<any> {
  const key = Object.keys(painPointIcons).find(k => (name ?? '').toLowerCase().includes(k));
  return key ? painPointIcons[key] : Flame;
}

export function TopPainPointsCard({ onPainPointClick }: PainPointsProps) {
  const { painPoints, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div id="pain-points-container" className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full min-h-[380px] overflow-hidden min-w-0 w-full">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="pain-points-container" className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full min-h-[380px] overflow-hidden min-w-0 w-full">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div id="pain-points-container" className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full min-h-[380px] overflow-hidden min-w-0 w-full">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#EF4444]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">Top Pain Points</span>
          </div>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] text-[10px] font-semibold text-zinc-400 transition-colors">
            <span>All Sources</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          {painPoints.map((point) => {
            const Icon = getPainPointIcon(point.name);
            return (
              <div 
                key={point.id} 
                onClick={() => onPainPointClick && onPainPointClick({ id: point.id, name: point.name, count: point.count, percentage: point.percentage })}
                className="group cursor-pointer flex items-center justify-between gap-4"
              >
                {/* Icon & Label */}
                <div className="flex items-center gap-2.5 w-[38%] min-w-0 shrink-0 text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                  <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#8B5CF6] transition-colors shrink-0" />
                  <span className="truncate">{point.name}</span>
                </div>
                
                {/* Progress Track */}
                <div className="flex-1 h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.01] relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${point.percentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full"
                    style={{
                      boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
                    }}
                  />
                </div>

                {/* Count & Percentage */}
                <div className="w-[85px] text-right font-mono text-zinc-400 font-bold shrink-0 text-[10px]">
                  {point.count} <span className="text-[9px] text-zinc-600 font-normal">({point.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="w-full mt-5 py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/[0.02] border border-white/5 rounded-xl transition-all">
        <span>View all pain points</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
      </button>
    </div>
  );
}

// ==========================================
// 2. FEEDBACK TREND CARD (Smooth Interactive Line Chart)
// ==========================================
export function FeedbackTrendCard() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { feedbackTrendData, isLoading, error } = useDashboard();

  const hasDaily = !Array.isArray(feedbackTrendData) && feedbackTrendData?.daily;
  const dailyData = (
    hasDaily
      ? feedbackTrendData.daily
      : Array.isArray(feedbackTrendData) && feedbackTrendData.length > 0
        ? feedbackTrendData
        : [
            { label: 'May 12', count: 120 },
            { label: 'May 13', count: 185 },
            { label: 'May 14', count: 150 },
            { label: 'May 15', count: 260 },
            { label: 'May 16', count: 420 },
            { label: 'May 17', count: 310 },
            { label: 'May 18', count: 340 },
            { label: 'May 19', count: 280 }
          ]
  ).map((d: any) => ({ label: d.label || d.date || '', count: d.count || d.value || 0 }));

  const hasWeekly = !Array.isArray(feedbackTrendData) && feedbackTrendData?.weekly;
  const weeklyData = (
    hasWeekly
      ? feedbackTrendData.weekly
      : [
          { label: 'Week 17', count: 850 },
          { label: 'Week 18', count: 980 },
          { label: 'Week 19', count: 1100 },
          { label: 'Week 20', count: 1284 }
        ]
  ).map((d: any) => ({ label: d.label || d.date || '', count: d.count || d.value || 0 }));

  const chartData = activeTab === 'daily' ? dailyData : weeklyData;
  const counts = chartData.map(d => d.count);
  const maxVal = Math.max(...counts) * 1.15; // padding for top

  // Chart dimensions
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  // Coordinate mapper
  const getCoordinates = () => {
    return chartData.map((d, idx) => {
      const x = paddingX + (idx / (chartData.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (d.count / maxVal) * (height - paddingY * 2);
      return { x, y, label: d.label, count: d.count };
    });
  };

  const coords = getCoordinates();

  // Create Bezier Curve path string
  const getBezierPath = () => {
    if (coords.length === 0) return '';
    let path = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + 2 * (next.x - curr.x) / 3;
      const cpY2 = next.y;
      path += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${next.x},${next.y}`;
    }
    return path;
  };

  const linePath = getBezierPath();
  const areaPath = coords.length > 0 
    ? `${linePath} L ${coords[coords.length - 1].x},${height - paddingY} L ${coords[0].x},${height - paddingY} Z`
    : '';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const scaleX = width / (svgRect.width || 1);
    const clientX = (e.clientX - svgRect.left) * scaleX;
    
    // Find closest index
    let closestIdx = 0;
    let minDiff = Infinity;
    coords.forEach((coord, idx) => {
      const diff = Math.abs(coord.x - clientX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div 
      ref={containerRef}
      id="feedback-trend-container" 
      className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full min-h-[380px] overflow-hidden min-w-0 w-full"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">Feedback Trend</span>
          </div>
          <div className="flex p-0.5 rounded-lg bg-white/[0.03] border border-white/5">
            <button
              onClick={() => { setActiveTab('daily'); setHoverIndex(null); }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                activeTab === 'daily' 
                  ? 'bg-[#8B5CF6] text-white' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => { setActiveTab('weekly'); setHoverIndex(null); }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                activeTab === 'weekly' 
                  ? 'bg-[#8B5CF6] text-white' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Custom SVG Chart Area */}
        <div className="relative w-full mt-3">
          <svg 
            width="100%" 
            height={height} 
            viewBox={`0 0 ${width} ${height}`} 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="overflow-visible cursor-crosshair select-none"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 1, 2, 3].map((g, i) => {
              const yVal = paddingY + (i / 3) * (height - paddingY * 2);
              return (
                <line
                  key={g}
                  x1={paddingX}
                  y1={yVal}
                  x2={width - paddingX}
                  y2={yVal}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area gradient underlay */}
            {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

            {/* Stroke Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.5))'
                }}
              />
            )}

            {/* Interactive elements */}
            {coords.map((coord, idx) => {
              const isHovered = hoverIndex === idx;
              return (
                <g key={idx}>
                  {/* Subtle vertical guideline for hovered item */}
                  {isHovered && (
                    <line
                      x1={coord.x}
                      y1={paddingY}
                      x2={coord.x}
                      y2={height - paddingY}
                      stroke="rgba(139, 92, 246, 0.25)"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Node point marker */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isHovered ? 5.5 : 3.5}
                    fill={isHovered ? '#FFFFFF' : '#8B5CF6'}
                    stroke={isHovered ? '#8B5CF6' : 'rgba(7, 7, 10, 0.8)'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="transition-all duration-200"
                    style={{
                      filter: isHovered ? 'drop-shadow(0 0 10px rgba(139,92,246,0.8))' : 'none'
                    }}
                  />
                </g>
              );
            })}

            {/* Bottom labels */}
            {coords.map((coord, idx) => (
              <text
                key={idx}
                x={coord.x}
                y={height - 2}
                fill="rgba(161, 161, 170, 0.45)"
                fontSize="9"
                fontFamily="Geist, sans-serif"
                fontWeight="500"
                textAnchor="middle"
              >
                {coord.label}
              </text>
            ))}
          </svg>

          {/* Floating Premium Tooltip inside the card */}
          {hoverIndex !== null && (
            <div 
              className="absolute z-10 p-3 rounded-xl border border-[#8B5CF6]/30 shadow-[0_10px_30px_rgba(139,92,246,0.15)] bg-[#0C0C12]/90 backdrop-blur-md pointer-events-none"
              style={{
                left: `${(coords[hoverIndex].x / width) * 100}%`,
                top: `${(coords[hoverIndex].y / height) * 100}%`,
                transform: 'translate(-50%, -115%)',
                transition: 'left 0.1s ease-out, top 0.1s ease-out'
              }}
            >
              <div className="flex flex-col gap-1 text-left min-w-[95px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
                  <span className="text-[9px] font-bold text-zinc-400 font-mono tracking-wider uppercase">{coords[hoverIndex].label}</span>
                </div>
                <span className="text-xs font-extrabold text-white font-sans">{coords[hoverIndex].count} pieces</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 text-[10px] text-zinc-500 font-mono">
        <Info className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <span>Peak frequency detected on May 16 with 420 items triggered via System Sync.</span>
      </div>
    </div>
  );
}

// ==========================================
// 3. SENTIMENT OVERVIEW CARD (Donut Chart - Redesigned Side-by-Side)
// ==========================================
const sentimentColorMap: Record<string, string> = {
  positive: '#22C55E', neutral: '#F59E0B', negative: '#EF4444', mixed: '#A855F7'
};

export function SentimentOverviewCard() {
  const { sentimentData, isLoading, error } = useDashboard();

  const data = (Array.isArray(sentimentData) && sentimentData.length > 0
    ? sentimentData
    : [
        { name: 'Positive', value: 512, percentage: 39.9, color: '#22C55E' },
        { name: 'Neutral', value: 423, percentage: 32.9, color: '#F59E0B' },
        { name: 'Negative', value: 278, percentage: 21.7, color: '#EF4444' },
        { name: 'Mixed', value: 71, percentage: 5.5, color: '#A855F7' }
      ]
  ).map((d: any) => ({
    name: d.name || d.label || '',
    value: d.value || d.count || 0,
    percentage: d.percentage || d.percent || 0,
    color: d.color || sentimentColorMap[(d.name || d.label || '').toLowerCase()] || '#8B5CF6'
  }));

  // SVG parameters
  const size = 110;
  const radius = 42;
  const center = size / 2;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  return (
    <div id="sentiment-overview-container" className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full min-h-[380px] overflow-hidden min-w-0 w-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#22C55E]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">Sentiment Overview</span>
          </div>
        </div>

        {/* Flex Column Layout */}
        <div className="flex flex-col items-center justify-center min-w-0 w-full">
          
          {/* Centered Donut Chart Container */}
          <div className="flex justify-center items-center w-full mt-2">
            <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 transition-all duration-300">
              <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
                {(() => {
                  let accumulatedPercent = 0;
                  return data.map((slice) => {
                    const dashOffset = circumference - (accumulatedPercent / 100) * circumference;
                    accumulatedPercent += slice.percentage;

                    return (
                      <circle
                        key={slice.name}
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-500 hover:opacity-90"
                        style={{
                          strokeDashoffset: dashOffset,
                          strokeDasharray: `${(slice.percentage / 100) * circumference} ${circumference}`,
                          transform: 'rotate(-90deg)',
                          transformOrigin: '50% 50%',
                        }}
                      />
                    );
                  });
                })()}
              </svg>

              {/* Center Summary Labels */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-xl font-extrabold text-white leading-none">1,284</span>
                <span className="text-[10px] font-semibold text-zinc-500 mt-1">Total</span>
              </div>
            </div>
          </div>

          {/* Legends Vertical List - 24px spacing (mt-6 = 24px) */}
          <div className="w-full flex flex-col gap-2.5 mt-6 min-w-0 border-t border-white/5 pt-4">
            {data.map((slice) => (
              <div key={slice.name} className="flex items-center justify-between gap-3 py-0.5 min-w-0 w-full">
                {/* Left side: Colored indicator & Label */}
                <div className="flex items-center gap-2 min-w-0">
                  {/* Colored circle */}
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.1)]" style={{ backgroundColor: slice.color }} />
                  <span className="text-xs font-semibold text-zinc-300 truncate">{slice.name}</span>
                </div>
                
                {/* Right side: Percentage & Count */}
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white shrink-0">
                  <span>{slice.percentage}%</span>
                  <span className="text-[10px] text-zinc-500 font-normal">({slice.value})</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. AI RECOMMENDATIONS CARD (Redesigned without bottom button)
// ==========================================
const recColorPalette = ['#A855F7', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
const recIconOptions = [Sparkles, Zap, Moon, Flame, TrendingUp];

function getRecIconAndColor(title: string | undefined, index: number) {
  const lower = (title ?? '').toLowerCase();
  let icon = recIconOptions[index % recIconOptions.length];
  if (lower.includes('offline') || lower.includes('sync') || lower.includes('mode')) icon = Sparkles;
  else if (lower.includes('navigation') || lower.includes('flow') || lower.includes('nav')) icon = Zap;
  else if (lower.includes('dark') || lower.includes('theme') || lower.includes('mode')) icon = Moon;
  return {
    icon,
    color: recColorPalette[index % recColorPalette.length],
    bg: `rgba(${index === 0 ? '168, 85, 247' : index === 1 ? '59, 130, 246' : index === 2 ? '16, 185, 129' : '245, 158, 11'}, 0.08)`
  };
}

export function AiRecommendationsCard() {
  const { recommendations, isLoading, error } = useDashboard();

  const items = recommendations.length > 0
    ? recommendations.map((r, i) => {
        const style = getRecIconAndColor(r.title, i);
        return {
          id: r.id,
          title: r.title,
          freqImpact: r.freqImpact || 'Auto-detected',
          confidence: typeof r.confidence === 'number' ? r.confidence : 85,
          icon: style.icon,
          color: style.color,
          bg: style.bg
        };
      })
    : [
        {
          id: 'r1',
          title: 'Prioritize Offline Mode',
          freqImpact: 'High frequency + High impact',
          confidence: 94,
          icon: Sparkles,
          color: '#A855F7',
          bg: 'rgba(168, 85, 247, 0.08)'
        },
        {
          id: 'r2',
          title: 'Improve Navigation Flow',
          freqImpact: 'Medium frequency + High impact',
          confidence: 78,
          icon: Zap,
          color: '#3B82F6',
          bg: 'rgba(59, 130, 246, 0.08)'
        },
        {
          id: 'r3',
          title: 'Add Dark Mode',
          freqImpact: 'High frequency + Medium impact',
          confidence: 71,
          icon: Moon,
          color: '#10B981',
          bg: 'rgba(16, 185, 129, 0.08)'
        }
      ];

  return (
    <div id="ai-recs-container" className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full min-h-[290px] overflow-hidden min-w-0 w-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A855F7]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-sans">AI Recommendations</span>
          </div>
          <button className="text-[10px] text-[#8B5CF6] font-semibold hover:underline">View all</button>
        </div>

        <div className="flex flex-col gap-2.5">
          {items.map((rec) => {
            const Icon = rec.icon;
            return (
              <div 
                key={rec.id} 
                className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/5 transition-all duration-300 min-w-0"
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div 
                      className="w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: rec.bg, borderColor: `${rec.color}25` }}
                    >
                      <Icon className="w-3 h-3" style={{ color: rec.color }} />
                    </div>
                    <span className="text-xs font-bold text-white leading-tight truncate block w-full">{rec.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded-md shrink-0">
                    {rec.confidence}%
                  </span>
                </div>
                
                {/* Confidence bar & subtitle inline */}
                <div className="mt-2.5 flex items-center justify-between gap-4 min-w-0">
                  <p className="text-[9px] text-zinc-500 font-medium truncate flex-1 min-w-0">{rec.freqImpact}</p>
                  
                  {/* Slider */}
                  <div className="w-[80px] h-1 bg-white/[0.04] rounded-full overflow-hidden shrink-0">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
