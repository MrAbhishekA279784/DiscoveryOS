import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export interface ContextMemory {
  id: string;
  key: string;
  value: string;
}

export function useContextMemories() {
  const [memories, setMemories] = useState<ContextMemory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.metadata.contextMemories();
      setMemories(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load context memories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { memories, isLoading, error, refetch: fetch };
}
