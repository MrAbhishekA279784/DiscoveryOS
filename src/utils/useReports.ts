import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoReports } from './demoData';

export interface Report {
  id: string;
  title: string;
  format: string;
  createdAt: string;
  date: string;
  fileUrl: string;
}

export interface ReportsState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export function useReports(): ReportsState & { 
  generateReport: (format: 'pdf' | 'pptx' | 'csv', filters?: Record<string, any>) => Promise<Report>;
  downloadReport: (id: string) => Promise<Blob>;
} {
  const [state, setState] = useState<ReportsState>({
    reports: demoReports,
    isLoading: false,
    error: null,
    isEmpty: false
  });

  const fetchReports = useCallback(async () => {
    try {
      const reportsData = await api.reports.list();
      setState(prev => ({ ...prev, reports: reportsData || demoReports, isLoading: false, isEmpty: false }));
    } catch {
      setState(prev => ({ ...prev, reports: demoReports, isLoading: false, isEmpty: false }));
    }
  }, []);

  const generateReport = useCallback(async (format: 'pdf' | 'pptx' | 'csv', filters?: Record<string, any>) => {
    try {
      const report = await api.reports.generate(format, filters);
      setState(prev => ({ ...prev, reports: [report, ...prev.reports] }));
      return report;
    } catch {
      const demoReport = { id: Math.random().toString(36).substring(2, 9), title: `Report ${new Date().toLocaleDateString()}`, format, createdAt: new Date().toISOString(), date: new Date().toLocaleDateString(), fileUrl: '#' };
      setState(prev => ({ ...prev, reports: [demoReport, ...prev.reports] }));
      return demoReport;
    }
  }, []);

  const downloadReport = useCallback(async (id: string) => {
    try {
      const response = await api.reports.download(id);
      return await response.blob();
    } catch {
      return new Blob(['demo report content'], { type: 'application/pdf' });
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { ...state, generateReport, downloadReport };
}