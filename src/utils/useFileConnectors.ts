import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoFileConnectors } from './demoData';

export interface FileConnector {
  id: string;
  name: string;
  type: string;
  volume: string;
  count: number;
  status: string;
}

export function useFileConnectors() {
  const [connectors, setConnectors] = useState<FileConnector[]>(demoFileConnectors);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await api.metadata.fileConnectors();
      setConnectors(data || demoFileConnectors);
    } catch {
      setConnectors(demoFileConnectors);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { connectors, isLoading, error, refetch: fetch };
}