import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';

export interface SettingsData {
  workspaceSlug: string;
  aiModelVersion: string;
  syncInterval: string;
  storageUsage: number;
  tokenUsage: number;
  stripeSubscription: {
    tier: string;
    plan: string;
    monthlyPrice: number;
  };
  environmentStatus: Array<{
    label: string;
    value: string;
    color: string;
  }>;
}

export interface SettingsState {
  settings: SettingsData | null;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_SETTINGS: SettingsData = {
  workspaceSlug: 'stadium-iq-enterprise',
  aiModelVersion: 'Discovery-v3.5-Omni-Pro (Staging)',
  syncInterval: 'Real-Time Push Hooks',
  storageUsage: 42,
  tokenUsage: 13,
  stripeSubscription: {
    tier: 'Pro',
    plan: 'StadiumIQ Pro Tier',
    monthlyPrice: 490
  },
  environmentStatus: [
    { label: 'Gemini Keys API', value: 'Active', color: 'emerald' },
    { label: 'Cloud Run Ingress', value: 'Connected', color: 'emerald' },
    { label: 'Linear Sync Integration', value: 'Idle', color: 'amber' },
    { label: 'OAuth Gateway', value: 'Configured', color: 'purple' },
    { label: 'DB Cluster Replica', value: '99.99% Up', color: 'emerald' },
    { label: 'Secure Socket Layers', value: 'Active', color: 'emerald' }
  ]
};

export function useSettings(): SettingsState & { updateSettings: (data: Record<string, any>) => Promise<SettingsData> } {
  const [state, setState] = useState<SettingsState>({
    settings: DEFAULT_SETTINGS,
    isLoading: true,
    error: null
  });

  const fetchSettings = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const settingsData = await api.settings.get();
      if (Array.isArray(settingsData)) {
        const flat: Record<string, any> = {};
        for (const item of settingsData) {
          if (item.key !== undefined) flat[item.key] = item.value;
        }
        setState(prev => ({
          ...prev,
          settings: { ...DEFAULT_SETTINGS, ...flat },
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          settings: settingsData || DEFAULT_SETTINGS,
          isLoading: false
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Failed to load settings (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Failed to load settings';
      
      setState(prev => ({
        ...prev,
        settings: DEFAULT_SETTINGS,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, []);

  const updateSettings = useCallback(async (data: Record<string, any>) => {
    try {
      const updated = await api.settings.update(data);
      setState(prev => ({
        ...prev,
        settings: updated || DEFAULT_SETTINGS
      }));
      return updated || DEFAULT_SETTINGS;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Update failed';
      throw new Error(errorMsg);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { ...state, updateSettings };
}
