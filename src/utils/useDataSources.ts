import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';

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

const DEFAULT_DATA_SOURCES: DataSource[] = [];

export function useDataSources(): DataSourcesState & { 
  syncDataSource: (id: string) => Promise<DataSource>;
  connectDataSource: (serviceType: string, config: Record<string, any>) => Promise<DataSource>;
} {
  const [state, setState] = useState<DataSourcesState>({
    dataSources: DEFAULT_DATA_SOURCES,
    isLoading: true,
    error: null,
    isEmpty: true
  });

  const fetchDataSources = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const dsData = await api.datasources.list();
      setState(prev => ({
        ...prev,
        dataSources: dsData || DEFAULT_DATA_SOURCES,
        isLoading: false,
        isEmpty: !dsData || dsData.length === 0
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Failed to load data sources (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Failed to load data sources';
      
      setState(prev => ({
        ...prev,
        dataSources: DEFAULT_DATA_SOURCES,
        isLoading: false,
        error: errorMessage,
        isEmpty: true
      }));
    }
  }, []);

  const syncDataSource = useCallback(async (id: string) => {
    try {
      const synced = await api.datasources.sync(id);
      setState(prev => ({
        ...prev,
        dataSources: prev.dataSources.map(ds => ds.id === id ? synced : ds)
      }));
      return synced;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Sync failed';
      throw new Error(errorMsg);
    }
  }, []);

  const connectDataSource = useCallback(async (serviceType: string, config: Record<string, any>) => {
    try {
      const ds = await api.datasources.connect(serviceType, config);
      setState(prev => ({
        ...prev,
        dataSources: [ds, ...prev.dataSources]
      }));
      return ds;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Connect failed';
      throw new Error(errorMsg);
    }
  }, []);

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  return { ...state, syncDataSource, connectDataSource };
}
