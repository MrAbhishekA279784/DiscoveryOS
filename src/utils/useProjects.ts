import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  deadline: string;
  risk: string;
  progress: number;
  members: number;
  docs: number;
  desc: string;
}

export interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

const DEFAULT_PROJECTS: Project[] = [];

export function useProjects(): ProjectsState & { 
  createProject: (data: Record<string, any>) => Promise<Project>;
  updateProject: (id: string, data: Record<string, any>) => Promise<Project>;
} {
  const [state, setState] = useState<ProjectsState>({
    projects: DEFAULT_PROJECTS,
    isLoading: true,
    error: null,
    isEmpty: true
  });

  const fetchProjects = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const projectsData = await api.projects.list();
      setState(prev => ({
        ...prev,
        projects: projectsData || DEFAULT_PROJECTS,
        isLoading: false,
        isEmpty: !projectsData || projectsData.length === 0
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Failed to load projects (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Failed to load projects';
      
      setState(prev => ({
        ...prev,
        projects: DEFAULT_PROJECTS,
        isLoading: false,
        error: errorMessage,
        isEmpty: true
      }));
    }
  }, []);

  const createProject = useCallback(async (data: Record<string, any>) => {
    try {
      const project = await api.projects.create(data);
      setState(prev => ({
        ...prev,
        projects: [project, ...prev.projects]
      }));
      return project;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Create failed';
      throw new Error(errorMsg);
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Record<string, any>) => {
    try {
      const updated = await api.projects.update(id, data);
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === id ? updated : p)
      }));
      return updated;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Update failed';
      throw new Error(errorMsg);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { ...state, createProject, updateProject };
}
