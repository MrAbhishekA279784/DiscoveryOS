import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoNotifications } from './demoData';

export interface Notification {
  id: string; type: string; title: string; description: string;
  timestamp: string; isRead: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await api.metadata.notifications();
      setNotifications(data || demoNotifications);
    } catch {
      setNotifications(demoNotifications);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { notifications, isLoading, error, refetch: fetch };
}