import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';

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

const DEFAULT_REPORTS: Report[] = [];

export function useReports(): ReportsState & { 
  generateReport: (format: 'pdf' | 'pptx' | 'csv', filters?: Record<string, any>) => Promise<Report>;
  downloadReport: (id: string) => Promise<Blob>;
} {
  const [state, setState] = useState<ReportsState>({
    reports: DEFAULT_REPORTS,
    isLoading: true,
    error: null,
    isEmpty: true
  });

  const fetchReports = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const reportsData = await api.reports.list();
      setState(prev => ({
        ...prev,
        reports: reportsData || DEFAULT_REPORTS,
        isLoading: false,
        isEmpty: !reportsData || reportsData.length === 0
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Failed to load reports (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Failed to load reports';
      
      setState(prev => ({
        ...prev,
        reports: DEFAULT_REPORTS,
        isLoading: false,
        error: errorMessage,
        isEmpty: true
      }));
    }
  }, []);

  const generateReport = useCallback(async (format: 'pdf' | 'pptx' | 'csv', filters?: Record<string, any>) => {
    try {
      const report = await api.reports.generate(format, filters);
      setState(prev => ({
        ...prev,
        reports: [report, ...prev.reports]
      }));
      return report;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Generate failed';
      throw new Error(errorMsg);
    }
  }, []);

  const downloadReport = useCallback(async (id: string) => {
    try {
      const response = await api.reports.download(id);
      return await response.blob();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Download failed';
      throw new Error(errorMsg);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { ...state, generateReport, downloadReport };
}
