import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { FileItem } from '../types';
import { demoFiles } from './demoData';

export interface FilesState {
  files: FileItem[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export function useFiles(): FilesState & {
  uploadFile: (file: File, onProgress?: (pct: number) => void) => Promise<FileItem>;
  fetchFiles: () => Promise<void>;
} {
  const [state, setState] = useState<FilesState>({
    files: demoFiles, isLoading: false, error: null, isEmpty: false
  });

  const fetchFiles = useCallback(async () => {
    try {
      const filesData = await api.files.list();
      setState(prev => ({ ...prev, files: filesData || demoFiles, isLoading: false, isEmpty: false }));
    } catch {
      setState(prev => ({ ...prev, isLoading: false, isEmpty: false }));
    }
  }, []);

  const uploadFile = useCallback(async (file: File, onProgress?: (pct: number) => void): Promise<FileItem> => {
    const uploadedFile = await api.files.upload(file, onProgress);
    const fileItem: FileItem = {
      id: uploadedFile.id || Math.random().toString(36).substring(2, 15),
      name: uploadedFile.name || file.name,
      size: uploadedFile.size || `${(file.size / 1024).toFixed(0)} KB`,
      type: uploadedFile.type || file.name.split('.').pop() || 'file',
      timestamp: 'Just now'
    };
    const stored = JSON.parse(localStorage.getItem('demo_uploads') || '[]');
    stored.unshift(fileItem);
    localStorage.setItem('demo_uploads', JSON.stringify(stored.slice(0, 50)));
    setState(prev => ({ ...prev, files: [fileItem, ...prev.files] }));
    return fileItem;
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);
  return { ...state, uploadFile, fetchFiles };
}