import { useState, useEffect, useCallback } from 'react';
import { api, APIException } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth(): AuthState & { 
  logout: () => void;
  setUser: (user: User) => void;
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const token = localStorage.getItem('discovery_token');
    const userData = localStorage.getItem('discovery_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Invalid user data'
        });
      }
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('discovery_token');
    localStorage.removeItem('discovery_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }, []);

  const setUser = useCallback((user: User) => {
    localStorage.setItem('discovery_user', JSON.stringify(user));
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: true
    }));
  }, []);

  return { ...state, logout, setUser };
}
