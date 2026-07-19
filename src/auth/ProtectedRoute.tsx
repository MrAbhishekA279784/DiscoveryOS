import React, { type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("[STEP 7] ProtectedRoute: Checking auth", { isAuthenticated, isLoading });
  
  if (isLoading) {
    console.log("[STEP 7.1] ProtectedRoute: Still loading, showing LoadingScreen");
    return <LoadingScreen />;
  }
  if (!isAuthenticated) {
    console.log("[STEP 7.2 FAIL] ProtectedRoute: Not authenticated, returning null (redirect to login)");
    return null;
  }

  console.log("[STEP 7.3 SUCCESS] ProtectedRoute: Authenticated, rendering children");
  return <>{children}</>;
}
