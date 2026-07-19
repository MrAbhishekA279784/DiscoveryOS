import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  project: string;
  timestamp: string;
}

export function useActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.metadata.activity();
      setActivities(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load activity');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { activities, isLoading, error, refetch: fetch };
}
