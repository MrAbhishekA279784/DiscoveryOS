import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface WorkspacesState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_WORKSPACES: Workspace[] = [];

export function useWorkspaces(): WorkspacesState & { 
  selectWorkspace: (id: string) => void;
  createWorkspace: (data: Record<string, any>) => Promise<Workspace>;
} {
  const [state, setState] = useState<WorkspacesState>({
    workspaces: DEFAULT_WORKSPACES,
    currentWorkspace: null,
    isLoading: true,
    error: null
  });

  const fetchWorkspaces = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const wsData = await api.workspaces.list();
      const workspaces = wsData || DEFAULT_WORKSPACES;
      setState(prev => ({
        ...prev,
        workspaces,
        currentWorkspace: workspaces[0] || null,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Failed to load workspaces (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Failed to load workspaces';
      
      setState(prev => ({
        ...prev,
        workspaces: DEFAULT_WORKSPACES,
        currentWorkspace: null,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, []);

  const selectWorkspace = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      currentWorkspace: prev.workspaces.find(w => w.id === id) || null
    }));
  }, []);

  const createWorkspace = useCallback(async (data: Record<string, any>) => {
    try {
      const ws = await api.workspaces.create(data);
      setState(prev => ({
        ...prev,
        workspaces: [ws, ...prev.workspaces],
        currentWorkspace: ws
      }));
      return ws;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Create failed';
      throw new Error(errorMsg);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return { ...state, selectWorkspace, createWorkspace };
}
