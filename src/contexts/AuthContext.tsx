// AuthContext for Wall Street Wildlife Mobile
// Provides shared authentication state across the app
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../data/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user progress
const defaultProgress = {
  completedStrategies: [],
  completedQuizzes: [],
  currentTier: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastActivityDate: new Date().toISOString(),
  badges: [],
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // TODO: Replace with Supabase session check
      // const { data: { session } } = await supabase.auth.getSession();

      // For now, simulate no session
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check session',
      }));
    }
  };

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with Supabase auth
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      // Simulate successful login for development
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        displayName: email.split('@')[0],
        avatarAnimal: 'monkey',
        createdAt: new Date().toISOString(),
        subscriptionTier: 'free',
        progress: defaultProgress,
      };

      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Sign in failed',
      }));
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with Supabase auth
      // const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { displayName } } });

      // Simulate successful signup for development
      const mockUser: User = {
        id: 'mock-user-id-' + Date.now(),
        email,
        displayName: displayName || email.split('@')[0],
        avatarAnimal: 'owl', // Default mascot for new users
        createdAt: new Date().toISOString(),
        subscriptionTier: 'free',
        progress: defaultProgress,
      };

      setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Sign up failed',
      }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // TODO: Replace with Supabase auth
      // await supabase.auth.signOut();

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Sign out failed',
      }));
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with Supabase auth
      // await supabase.auth.resetPasswordForEmail(email);

      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Password reset failed',
      }));
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with Supabase update
      // await supabase.from('users').update(updates).eq('id', state.user.id);

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Profile update failed',
      }));
      throw error;
    }
  }, [state.user]);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
