// Tests for AuthContext
// Verifies authentication state management: initial state, sign in, sign out

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';

// The supabase mock is already set up in jest.setup.ts (isSupabaseConfigured returns false,
// so AuthProvider runs in mock/development mode).

// Mock the Zustand user store to prevent AsyncStorage issues in tests
const mockSetProfile = jest.fn();
const mockSetAuthenticated = jest.fn();
const mockClearProfile = jest.fn();
const mockSetLoading = jest.fn();

jest.mock('../../stores', () => ({
  useUserStore: () => ({
    isAuthenticated: false,
    profile: {
      id: null,
      email: null,
      displayName: null,
      avatarAnimal: 'monkey',
      subscriptionTier: 'free' as const,
      tribeId: null,
      createdAt: null,
    },
    progress: {
      xp: 0,
      level: 1,
      streak: 0,
      earnedBadges: [],
      completedStrategies: [],
      completedQuizzes: [],
    },
    setProfile: mockSetProfile,
    setAuthenticated: mockSetAuthenticated,
    clearProfile: mockClearProfile,
    setLoading: mockSetLoading,
  }),
}));

// Wrapper component that provides the AuthProvider
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with user as null', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // After initialization settles, user should be null (no session)
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('is not authenticated initially', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('has no error initially', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('signIn (mock mode)', () => {
    it('sets user and isAuthenticated after sign in', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Wait for initial loading to finish
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Perform sign in
      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).not.toBeNull();
      expect(result.current.user!.email).toBe('test@example.com');
      expect(result.current.user!.subscriptionTier).toBe('free');
      expect(result.current.isLoading).toBe(false);
    });

    it('updates the Zustand store on sign in', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signIn('trader@wsw.com', 'secret');
      });

      expect(mockSetProfile).toHaveBeenCalled();
      expect(mockSetAuthenticated).toHaveBeenCalledWith(true);
    });
  });

  describe('signOut', () => {
    it('clears user state after sign out', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Sign in first
      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Now sign out
      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(mockClearProfile).toHaveBeenCalled();
    });
  });
});
