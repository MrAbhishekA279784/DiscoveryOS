export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string; // 'Video' | 'CSV' | 'XLSX' | etc.
  timestamp: string;
  rawSize?: number;
}

export interface PainPoint {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  confidenceScore?: number;
  sources?: string[];
  reasoningSteps?: {
    id: string;
    label: string;
    status: 'idle' | 'loading' | 'success' | 'error';
  }[];
}

export interface KpiItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  type: 'feedback' | 'painpoints' | 'accuracy' | 'responsetime';
  iconName: string;
  sparklineData: number[];
}

export interface Recommendation {
  id: string;
  title: string;
  freqImpact: string;
  confidence: number;
  iconName: string;
}
