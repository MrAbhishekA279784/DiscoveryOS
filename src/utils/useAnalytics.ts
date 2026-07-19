import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';

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

const DEFAULT_ANALYTICS: AnalyticsData = {
  kpis: {
    feedback: 1284,
    painPoints: 32,
    accuracy: 96,
    responseTime: 1.2
  },
  trends: [],
  metadata: {}
};

export function useAnalytics(): AnalyticsState & { fetchInsights: () => Promise<void> } {
  const [state, setState] = useState<AnalyticsState>({
    data: DEFAULT_ANALYTICS,
    isLoading: true,
    error: null
  });

  const fetchInsights = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const insights = await api.analytics.insights();
      setState(prev => ({
        ...prev,
        data: insights || DEFAULT_ANALYTICS,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Failed to load insights (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Failed to load insights';
      
      setState(prev => ({
        ...prev,
        data: DEFAULT_ANALYTICS,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { ...state, fetchInsights };
}
