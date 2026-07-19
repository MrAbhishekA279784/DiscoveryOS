import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { KpiItem, PainPoint, Recommendation } from '../types';
import { demoKpis, demoPainPoints, demoRecommendations, demoSentiment, demoFeedbackTrend } from './demoData';

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
    kpis: demoKpis,
    painPoints: demoPainPoints,
    recommendations: demoRecommendations,
    sentimentData: demoSentiment,
    feedbackTrendData: demoFeedbackTrend,
    isLoading: false,
    error: null,
    isEmpty: false
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const [kpisData, painPointsData, recommendationsData, sentimentData, feedbackTrendData] = await Promise.all([
        api.dashboard.kpis(),
        api.dashboard.painPoints(),
        api.dashboard.recommendations(),
        api.dashboard.sentiment(),
        api.dashboard.feedbackTrend()
      ]);

      setState(prev => ({
        ...prev,
        kpis: kpisData || demoKpis,
        painPoints: painPointsData || demoPainPoints,
        recommendations: recommendationsData || demoRecommendations,
        sentimentData: sentimentData || demoSentiment,
        feedbackTrendData: feedbackTrendData || demoFeedbackTrend,
        isLoading: false,
        isEmpty: false
      }));
    } catch {
      setState(prev => ({ ...prev, isLoading: false, isEmpty: false }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return state;
}