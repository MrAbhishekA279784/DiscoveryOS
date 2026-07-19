import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  getFirebaseAuth,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  resetPassword,
  verifyEmail,
  signInWithGoogle,
  getFirebaseIdToken,
  onAuthChange,
} from '../lib/firebase';
import { api } from '../utils/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  googleLogin: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncToken = useCallback(async (firebaseUser: User | null) => {
    console.log("[STEP 3] syncToken: Called with firebaseUser", firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : "null");
    
    if (firebaseUser) {
      const idToken = await getFirebaseIdToken(false);
      console.log("[STEP 3.1] syncToken: Got Firebase ID token", { tokenLength: idToken?.length });
      
      if (idToken) {
        localStorage.setItem('discovery_token', idToken);
        console.log("[STEP 3.2] syncToken: Stored Firebase token in localStorage");
        
        localStorage.setItem('discovery_user', JSON.stringify({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar: firebaseUser.photoURL || '',
        }));
        console.log("[STEP 3.3] syncToken: Stored user metadata in localStorage");
        
        setToken(idToken);
        console.log("[STEP 3.4] syncToken: Updated token state with Firebase token");

        // Exchange Firebase token for backend JWT + workspace_id
        try {
          console.log("[STEP 4] syncToken: Calling POST /api/auth/login to exchange for backend JWT");
          const authResult = await api.auth.login(idToken, {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar: firebaseUser.photoURL,
          });
          console.log("[STEP 5] syncToken: Backend login response received", { hasToken: !!authResult?.token, hasWorkspaceId: !!authResult?.workspace_id });
          
          if (authResult?.token) {
            localStorage.setItem('discovery_token', authResult.token);
            setToken(authResult.token);
            console.log("[STEP 6] syncToken: Stored backend JWT in localStorage and state");
          }
          if (authResult?.workspace_id) {
            localStorage.setItem('discovery_workspace_id', authResult.workspace_id);
            console.log("[STEP 6.1] syncToken: Stored workspace_id in localStorage", { workspace_id: authResult.workspace_id });
          }
        } catch (err) {
          console.error("[STEP 5 WARN] syncToken: Backend login failed, continuing with Firebase token", err);
          // Backend unavailable — continue with Firebase token
        }
      }
    } else {
      console.log("[STEP 3 LOGOUT] syncToken: User logged out");
      localStorage.removeItem('discovery_token');
      localStorage.removeItem('discovery_user');
      localStorage.removeItem('discovery_workspace_id');
      setToken(null);
    }
  }, []);

  useEffect(() => {
    console.log("[STEP 0.5] AuthContext: Setting up onAuthChange listener");
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log("[STEP 2] onAuthChange fired, setting user state", firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : "null");
      setUser(firebaseUser);
      console.log("[STEP 2.5] onAuthChange: Calling syncToken");
      await syncToken(firebaseUser);
      console.log("[STEP 6.3] onAuthChange: syncToken completed, setting isLoading=false");
      setIsLoading(false);
    });
    
    return () => {
      unsubscribe();
    };
  }, [syncToken]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const cred = await loginWithEmail(email, password);
      setUser(cred.user);
      await syncToken(cred.user);
    } catch (err: any) {
      const code = err.code || '';
      const msg = code === 'auth/user-not-found' || code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : code === 'auth/invalid-email'
        ? 'Invalid email format.'
        : code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : code === 'auth/network-request-failed'
        ? 'Network error. Check your connection.'
        : code === 'auth/internal-error'
        ? 'Authentication service error. Please try again.'
        : err.message || 'Login failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [syncToken]);

  const register = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const cred = await registerWithEmail(email, password);
      setUser(cred.user);
      await syncToken(cred.user);
    } catch (err: any) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : err.code === 'auth/weak-password'
        ? 'Password must be at least 6 characters.'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email format.'
        : err.message || 'Registration failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [syncToken]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await logoutUser();
      setUser(null);
      setToken(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed.');
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await resetPassword(email);
    } catch (err: any) {
      const msg = err.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : err.message || 'Password reset failed.';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      await verifyEmail(user);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email.');
    }
  }, [user]);

  const googleLogin = useCallback(async () => {
    console.log("[STEP 0] googleLogin: Starting Google login");
    setError(null);
    setIsLoading(true);
    try {
      const cred = await signInWithGoogle();
      console.log("[STEP 1.1] googleLogin: Got credentials from Firebase");
      setUser(cred.user);
      console.log("[STEP 2.1] googleLogin: User state updated");
      await syncToken(cred.user);
      console.log("[STEP 6.2] googleLogin: Token sync completed");
    } catch (err: any) {
      console.error("[googleLogin FAIL] Error during Google login", err?.code, err?.message);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed.');
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  }, [syncToken]);

  const refreshToken = useCallback(async () => {
    if (!user) return;
    const idToken = await getFirebaseIdToken(true);
    if (idToken) {
      localStorage.setItem('discovery_token', idToken);
      setToken(idToken);
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      forgotPassword,
      sendVerificationEmail,
      googleLogin,
      refreshToken,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
