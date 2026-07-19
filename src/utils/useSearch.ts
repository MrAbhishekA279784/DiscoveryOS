import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';

export interface SearchResult {
  id: string;
  title: string;
  source: string;
  matchScore: number;
  status: string;
  snippet: string;
  createdAt: string;
}

export interface SearchState {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  total: number;
}

export function useSearch(): SearchState & { search: (query: string, filters?: Record<string, any>) => Promise<void> } {
  const [state, setState] = useState<SearchState>({
    results: [],
    isLoading: false,
    error: null,
    isEmpty: true,
    total: 0
  });

  const search = useCallback(async (query: string, filters?: Record<string, any>) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, results: [], isEmpty: true, total: 0 }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const resultsData = await api.search.query(query, filters);
      const results = Array.isArray(resultsData) ? resultsData : (resultsData?.results || []);
      setState(prev => ({
        ...prev,
        results,
        total: results.length,
        isLoading: false,
        isEmpty: results.length === 0
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Search failed (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Search failed';
      
      setState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        error: errorMessage,
        isEmpty: true,
        total: 0
      }));
    }
  }, []);

  return { ...state, search };
}
