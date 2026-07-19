import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';
import { KpiItem, PainPoint, Recommendation } from '../types';

export interface DashboardData {
  kpis: KpiItem[];
  painPoints: PainPoint[];
  recommendations: Recommendation[];
  sentimentData: any[];
  feedbackTrendData: any[] | { daily: any[]; weekly: any[] };
}

export interface DashboardState extends DashboardData {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export function useDashboard(): DashboardState {
  const [state, setState] = useState<DashboardState>({
    kpis: [],
    painPoints: [],
    recommendations: [],
    sentimentData: [],
    feedbackTrendData: [],
    isLoading: true,
    error: null,
    isEmpty: true
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const [kpisData, painPointsData, recommendationsData, sentimentData, feedbackTrendData] = await Promise.all([
        api.dashboard.kpis(),
        api.dashboard.painPoints(),
        api.dashboard.recommendations(),
        api.dashboard.sentiment(),
        api.dashboard.feedbackTrend()
      ]);

      const hasData = kpisData?.length > 0 || painPointsData?.length > 0 || recommendationsData?.length > 0;

      setState(prev => ({
        ...prev,
        kpis: kpisData || [],
        painPoints: painPointsData || [],
        recommendations: recommendationsData || [],
        sentimentData: sentimentData || [],
        feedbackTrendData: feedbackTrendData || [],
        isLoading: false,
        isEmpty: !hasData
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `API Error (${error.status}): ${error.message}`
        : error instanceof Error 
        ? error.message
        : 'Failed to load dashboard data';

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isEmpty: true
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return state;
}
