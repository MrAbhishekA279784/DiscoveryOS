import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: string;
  icon: string;
}

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.metadata.promptTemplates();
      setTemplates(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { templates, isLoading, error, refetch: fetch };
}
