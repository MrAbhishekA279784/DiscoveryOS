import React, { createContext, useContext, ReactNode } from 'react';

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DemoUserContextType {
  user: DemoUser;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const DemoUserContext = createContext<DemoUserContextType | undefined>(undefined);

const demoUser: DemoUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@discoveryos.ai",
  role: "Administrator"
};

export function DemoUserProvider({ children }: { children: ReactNode }) {
  localStorage.setItem('auth_token', 'demo-token');
  localStorage.setItem('user', JSON.stringify(demoUser));

  const value: DemoUserContextType = {
    user: demoUser,
    isAuthenticated: true,
    isLoading: false,
  };

  return (
    <DemoUserContext.Provider value={value}>
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  const context = useContext(DemoUserContext);
  if (!context) {
    return { user: demoUser, isAuthenticated: true, isLoading: false };
  }
  return context;
}
