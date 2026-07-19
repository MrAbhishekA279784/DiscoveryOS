import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoContextMemories } from './demoData';

export interface ContextMemory {
  id: string;
  key: string;
  value: string;
}

export function useContextMemories() {
  const [memories, setMemories] = useState<ContextMemory[]>(demoContextMemories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await api.metadata.contextMemories();
      setMemories(data || demoContextMemories);
    } catch {
      setMemories(demoContextMemories);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { memories, isLoading, error, refetch: fetch };
}