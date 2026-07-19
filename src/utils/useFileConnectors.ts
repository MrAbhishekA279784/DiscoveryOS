import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export interface FileConnector {
  id: string;
  name: string;
  type: string;
  volume: string;
  count: number;
  status: string;
}

export function useFileConnectors() {
  const [connectors, setConnectors] = useState<FileConnector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.metadata.fileConnectors();
      setConnectors(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load file connectors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { connectors, isLoading, error, refetch: fetch };
}
