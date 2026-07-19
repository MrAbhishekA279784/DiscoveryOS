import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';
import { FileItem } from '../types';

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
    files: [],
    isLoading: true,
    error: null,
    isEmpty: true
  });

  const fetchFiles = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const filesData = await api.files.list();
      setState(prev => ({
        ...prev,
        files: filesData || [],
        isLoading: false,
        isEmpty: !filesData || filesData.length === 0
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Failed to load files (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Failed to load files';
      
      setState(prev => ({
        ...prev,
        files: [],
        isLoading: false,
        error: errorMessage,
        isEmpty: true
      }));
    }
  }, []);

  const uploadFile = useCallback(async (file: File, onProgress?: (pct: number) => void): Promise<FileItem> => {
    try {
      const uploadedFile = await api.files.upload(file, onProgress);
      setState(prev => ({
        ...prev,
        files: [uploadedFile, ...prev.files]
      }));
      return uploadedFile;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      throw new Error(errorMsg);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { ...state, uploadFile, fetchFiles };
}
