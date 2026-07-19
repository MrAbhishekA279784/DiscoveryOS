import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoWorkspaces } from './demoData';

export interface Workspace {
  id: string; name: string; slug: string; description: string;
}

export interface WorkspacesState {
  workspaces: Workspace[]; currentWorkspace: Workspace | null;
  isLoading: boolean; error: string | null;
}

export function useWorkspaces(): WorkspacesState & {
  selectWorkspace: (id: string) => void;
  createWorkspace: (data: Record<string, any>) => Promise<Workspace>;
} {
  const [state, setState] = useState<WorkspacesState>({
    workspaces: demoWorkspaces, currentWorkspace: demoWorkspaces[0] || null,
    isLoading: false, error: null
  });

  const fetchWorkspaces = useCallback(async () => {
    try {
      const wsData = await api.workspaces.list();
      const workspaces = wsData || demoWorkspaces;
      setState(prev => ({ ...prev, workspaces, currentWorkspace: workspaces[0] || null, isLoading: false }));
    } catch {
      setState(prev => ({ ...prev, workspaces: demoWorkspaces, currentWorkspace: demoWorkspaces[0] || null, isLoading: false }));
    }
  }, []);

  const selectWorkspace = useCallback((id: string) => {
    setState(prev => ({ ...prev, currentWorkspace: prev.workspaces.find(w => w.id === id) || null }));
  }, []);

  const createWorkspace = useCallback(async (data: Record<string, any>) => {
    try {
      const ws = await api.workspaces.create(data);
      setState(prev => ({ ...prev, workspaces: [ws, ...prev.workspaces], currentWorkspace: ws }));
      return ws;
    } catch {
      const demoWs = { id: Math.random().toString(36).substring(2, 9), name: data.name || 'New Workspace', slug: (data.name || 'new-workspace').toLowerCase().replace(/\s+/g, '-'), description: '' };
      setState(prev => ({ ...prev, workspaces: [demoWs, ...prev.workspaces], currentWorkspace: demoWs }));
      return demoWs;
    }
  }, []);

  useEffect(() => { fetchWorkspaces(); }, [fetchWorkspaces]);
  return { ...state, selectWorkspace, createWorkspace };
}