import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoAnalytics } from './demoData';

export interface AnalyticsData {
  kpis: Record<string, number>;
  trends: any[];
  metadata: Record<string, any>;
}

export interface AnalyticsState {
  data: AnalyticsData;
  isLoading: boolean;
  error: string | null;
}

export function useAnalytics(): AnalyticsState & { fetchInsights: () => Promise<void> } {
  const [state, setState] = useState<AnalyticsState>({
    data: demoAnalytics,
    isLoading: false,
    error: null
  });

  const fetchInsights = useCallback(async () => {
    try {
      const insights = await api.analytics.insights();
      setState(prev => ({ ...prev, data: insights || demoAnalytics, isLoading: false }));
    } catch {
      setState(prev => ({ ...prev, data: demoAnalytics, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { ...state, fetchInsights };
}