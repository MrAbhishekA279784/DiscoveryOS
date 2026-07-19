import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { demoProjects } from './demoData';

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

export function useProjects(): ProjectsState & { 
  createProject: (data: Record<string, any>) => Promise<Project>;
  updateProject: (id: string, data: Record<string, any>) => Promise<Project>;
} {
  const [state, setState] = useState<ProjectsState>({
    projects: demoProjects,
    isLoading: false,
    error: null,
    isEmpty: false
  });

  const fetchProjects = useCallback(async () => {
    try {
      const projectsData = await api.projects.list();
      setState(prev => ({ ...prev, projects: projectsData || demoProjects, isLoading: false, isEmpty: false }));
    } catch {
      setState(prev => ({ ...prev, projects: demoProjects, isLoading: false, isEmpty: false }));
    }
  }, []);

  const createProject = useCallback(async (data: Record<string, any>) => {
    try {
      const project = await api.projects.create(data);
      setState(prev => ({ ...prev, projects: [project, ...prev.projects] }));
      return project;
    } catch {
      const demoProject = { id: Math.random().toString(36).substring(2, 9), name: data.name || 'New Project', description: '', status: 'planning', createdAt: new Date().toISOString(), deadline: '', risk: 'low', progress: 0, members: 1, docs: 0, desc: '' };
      setState(prev => ({ ...prev, projects: [demoProject, ...prev.projects] }));
      return demoProject;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Record<string, any>) => {
    try {
      const updated = await api.projects.update(id, data);
      setState(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? updated : p) }));
      return updated;
    } catch {
      return { id, ...data };
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { ...state, createProject, updateProject };
}