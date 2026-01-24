// Auth hook for Wall Street Wildlife Mobile
// Uses Supabase for production, mock auth for development
import { useState, useEffect, useCallback } from 'react';
import { User } from '../data/types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useUserStore } from '../stores';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

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

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const userStore = useUserStore();
  const useSupabase = isSupabaseConfigured();

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    if (useSupabase) {
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            setState({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            userStore.setProfile({
              id: profile.id,
              email: profile.email,
              displayName: profile.displayName,
              avatarAnimal: profile.avatarAnimal || 'monkey',
              subscriptionTier: profile.subscriptionTier || 'free',
            });
            userStore.setAuthenticated(true);
          } else {
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            userStore.setAuthenticated(false);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [useSupabase]);

  const fetchProfile = async (userId: string): Promise<User> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      // Return default profile if fetch fails
      return {
        id: userId,
        email: '',
        displayName: null,
        avatarAnimal: 'monkey',
        createdAt: new Date().toISOString(),
        subscriptionTier: 'free',
        progress: defaultProgress,
      };
    }

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      avatarAnimal: data.avatar_animal || 'monkey',
      createdAt: data.created_at,
      subscriptionTier: data.subscription_tier || 'free',
      progress: defaultProgress,
    };
  };

  const checkSession = async () => {
    try {
      if (useSupabase) {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          userStore.setAuthenticated(true);
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: false,
          }));
        }
      } else {
        // Mock mode - check persisted store
        if (userStore.isAuthenticated && userStore.profile.id) {
          setState({
            user: {
              id: userStore.profile.id,
              email: userStore.profile.email || '',
              displayName: userStore.profile.displayName,
              avatarAnimal: userStore.profile.avatarAnimal,
              createdAt: userStore.profile.createdAt || new Date().toISOString(),
              subscriptionTier: userStore.profile.subscriptionTier,
              progress: {
                ...defaultProgress,
                xp: userStore.progress.xp,
                level: userStore.progress.level,
                streak: userStore.progress.streak,
                badges: userStore.progress.earnedBadges,
                completedStrategies: userStore.progress.completedStrategies,
                completedQuizzes: userStore.progress.completedQuizzes,
              },
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: false,
          }));
        }
        userStore.setLoading(false);
      }
    } catch (error: any) {
      console.error('Session check error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check session',
      }));
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (useSupabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const profile = await fetchProfile(data.user.id);
          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      } else {
        // Mock mode for development
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          displayName: email.split('@')[0],
          avatarAnimal: 'monkey',
          createdAt: new Date().toISOString(),
          subscriptionTier: 'free',
          progress: defaultProgress,
        };

        // Persist to store
        userStore.setProfile({
          id: mockUser.id,
          email: mockUser.email,
          displayName: mockUser.displayName,
          avatarAnimal: mockUser.avatarAnimal,
          subscriptionTier: mockUser.subscriptionTier,
          createdAt: mockUser.createdAt,
        });
        userStore.setAuthenticated(true);

        setState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Sign in failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, [useSupabase, userStore]);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (useSupabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Create profile in database
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email,
            display_name: displayName || email.split('@')[0],
            avatar_animal: 'owl',
            subscription_tier: 'free',
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          const profile = await fetchProfile(data.user.id);
          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      } else {
        // Mock mode
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          displayName: displayName || email.split('@')[0],
          avatarAnimal: 'owl',
          createdAt: new Date().toISOString(),
          subscriptionTier: 'free',
          progress: defaultProgress,
        };

        userStore.setProfile({
          id: mockUser.id,
          email: mockUser.email,
          displayName: mockUser.displayName,
          avatarAnimal: mockUser.avatarAnimal,
          subscriptionTier: mockUser.subscriptionTier,
          createdAt: mockUser.createdAt,
        });
        userStore.setAuthenticated(true);

        setState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Sign up failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, [useSupabase, userStore]);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (useSupabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      // Clear store
      userStore.clearProfile();

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Sign out failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, [useSupabase, userStore]);

  const resetPassword = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (useSupabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'wsw://reset-password',
        });
        if (error) throw error;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Password reset failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, [useSupabase]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (useSupabase) {
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: updates.displayName,
            avatar_animal: updates.avatarAnimal,
            subscription_tier: updates.subscriptionTier,
          })
          .eq('id', state.user.id);

        if (error) throw error;
      }

      // Update store
      userStore.setProfile({
        displayName: updates.displayName || userStore.profile.displayName,
        avatarAnimal: updates.avatarAnimal || userStore.profile.avatarAnimal,
        subscriptionTier: updates.subscriptionTier || userStore.profile.subscriptionTier,
      });

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Profile update failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  }, [state.user, useSupabase, userStore]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
  };
};

export default useAuth;
