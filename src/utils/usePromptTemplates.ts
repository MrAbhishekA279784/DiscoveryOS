import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoPromptTemplates } from './demoData';

export interface PromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: string;
  icon: string;
}

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>(demoPromptTemplates);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await api.metadata.promptTemplates();
      setTemplates(data || demoPromptTemplates);
    } catch {
      setTemplates(demoPromptTemplates);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { templates, isLoading, error, refetch: fetch };
}