import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoDataSources } from './demoData';

export interface DataSource {
  id: string;
  serviceType: string;
  name: string;
  status: string;
  lastSyncAt: string;
  health: number;
  volume: string;
}

export interface DataSourcesState {
  dataSources: DataSource[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export function useDataSources(): DataSourcesState & { 
  syncDataSource: (id: string) => Promise<DataSource>;
  connectDataSource: (serviceType: string, config: Record<string, any>) => Promise<DataSource>;
} {
  const [state, setState] = useState<DataSourcesState>({
    dataSources: demoDataSources,
    isLoading: false,
    error: null,
    isEmpty: false
  });

  const fetchDataSources = useCallback(async () => {
    try {
      const dsData = await api.datasources.list();
      setState(prev => ({ ...prev, dataSources: dsData || demoDataSources, isLoading: false, isEmpty: false }));
    } catch {
      setState(prev => ({ ...prev, dataSources: demoDataSources, isLoading: false, isEmpty: false }));
    }
  }, []);

  const syncDataSource = useCallback(async (id: string) => {
    try {
      const synced = await api.datasources.sync(id);
      setState(prev => ({ ...prev, dataSources: prev.dataSources.map(ds => ds.id === id ? synced : ds) }));
      return synced;
    } catch {
      return { id, status: 'synced', lastSyncAt: 'Just now' };
    }
  }, []);

  const connectDataSource = useCallback(async (serviceType: string, config: Record<string, any>) => {
    try {
      const ds = await api.datasources.connect(serviceType, config);
      setState(prev => ({ ...prev, dataSources: [ds, ...prev.dataSources] }));
      return ds;
    } catch {
      const demoDs = { id: Math.random().toString(36).substring(2, 9), serviceType, name: serviceType, status: 'connected', lastSyncAt: 'Just now', health: 100, volume: '0 B' };
      setState(prev => ({ ...prev, dataSources: [demoDs, ...prev.dataSources] }));
      return demoDs;
    }
  }, []);

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  return { ...state, syncDataSource, connectDataSource };
}