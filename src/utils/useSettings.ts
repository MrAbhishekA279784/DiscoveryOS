import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoSettings } from './demoData';

export interface SettingsData {
  workspaceSlug: string; aiModelVersion: string; syncInterval: string;
  storageUsage: number; tokenUsage: number;
  stripeSubscription: { tier: string; plan: string; monthlyPrice: number; };
  environmentStatus: Array<{ label: string; value: string; color: string; }>;
}

export interface SettingsState {
  settings: SettingsData | null; isLoading: boolean; error: string | null;
}

export function useSettings(): SettingsState & { updateSettings: (data: Record<string, any>) => Promise<SettingsData> } {
  const [state, setState] = useState<SettingsState>({
    settings: demoSettings, isLoading: false, error: null
  });

  const fetchSettings = useCallback(async () => {
    try {
      const settingsData = await api.settings.get();
      if (Array.isArray(settingsData)) {
        const flat: Record<string, any> = {};
        for (const item of settingsData) { if (item.key !== undefined) flat[item.key] = item.value; }
        setState(prev => ({ ...prev, settings: { ...demoSettings, ...flat }, isLoading: false }));
      } else {
        setState(prev => ({ ...prev, settings: settingsData || demoSettings, isLoading: false }));
      }
    } catch {
      setState(prev => ({ ...prev, settings: demoSettings, isLoading: false }));
    }
  }, []);

  const updateSettings = useCallback(async (data: Record<string, any>) => {
    try {
      const updated = await api.settings.update(data);
      setState(prev => ({ ...prev, settings: updated || demoSettings }));
      return updated || demoSettings;
    } catch {
      return demoSettings;
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);
  return { ...state, updateSettings };
}