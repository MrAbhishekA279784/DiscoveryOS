import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoActivity } from './demoData';

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  project: string;
  timestamp: string;
}

export function useActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>(demoActivity);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await api.metadata.activity();
      setActivities(data || demoActivity);
    } catch {
      setActivities(demoActivity);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { activities, isLoading, error, refetch: fetch };
}