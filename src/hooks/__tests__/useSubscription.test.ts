// Tests for useSubscription hook
// Verifies tier access logic for free and premium users

import { renderHook } from '@testing-library/react-native';
import { useSubscription } from '../useSubscription';

// Mock the contexts and stores that useSubscription depends on
const mockUseAuth = jest.fn();
jest.mock('../../contexts', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUseUserStore = jest.fn();
jest.mock('../../stores', () => ({
  useUserStore: () => mockUseUserStore(),
}));

// Helper to set up mocks for a given subscription state
function setupMocks(options: {
  authTier?: 'free' | 'premium' | 'pro' | null;
  storeTier?: 'free' | 'premium' | 'pro';
}) {
  const { authTier = null, storeTier = 'free' } = options;

  mockUseAuth.mockReturnValue({
    user: authTier ? { subscriptionTier: authTier } : null,
  });

  mockUseUserStore.mockReturnValue({
    profile: { subscriptionTier: storeTier },
  });
}

describe('useSubscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('canAccessTier - free users', () => {
    beforeEach(() => {
      setupMocks({ authTier: null, storeTier: 'free' });
    });

    it('returns true for tier 0 (Foundations)', () => {
      const { result } = renderHook(() => useSubscription());
      expect(result.current.canAccessTier(0)).toBe(true);
    });

    it('returns true for tier 0.5 (Express)', () => {
      const { result } = renderHook(() => useSubscription());
      expect(result.current.canAccessTier(0.5)).toBe(true);
    });

    it('returns false for tier 1 (Market Structure)', () => {
      const { result } = renderHook(() => useSubscription());
      expect(result.current.canAccessTier(1)).toBe(false);
    });

    it('returns false for tier 2 (Risk Management)', () => {
      const { result } = renderHook(() => useSubscription());
      expect(result.current.canAccessTier(2)).toBe(false);
    });

    it('returns false for higher tiers (3-10)', () => {
      const { result } = renderHook(() => useSubscription());
      for (const tier of [3, 4, 5, 6, 7, 8, 9, 10]) {
        expect(result.current.canAccessTier(tier)).toBe(false);
      }
    });
  });

  describe('canAccessTier - premium users', () => {
    beforeEach(() => {
      setupMocks({ authTier: 'premium' });
    });

    it('returns true for all tiers (0 through 10)', () => {
      const { result } = renderHook(() => useSubscription());
      const allTiers = [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      for (const tier of allTiers) {
        expect(result.current.canAccessTier(tier)).toBe(true);
      }
    });

    it('reports isPremium as true', () => {
      const { result } = renderHook(() => useSubscription());
      expect(result.current.isPremium).toBe(true);
    });
  });

  describe('canAccessTier - pro users', () => {
    beforeEach(() => {
      setupMocks({ authTier: 'pro' });
    });

    it('returns true for all tiers', () => {
      const { result } = renderHook(() => useSubscription());
      expect(result.current.canAccessTier(5)).toBe(true);
      expect(result.current.canAccessTier(10)).toBe(true);
    });

    it('reports isPremium as true', () => {
      const { result } = renderHook(() => useSubscription());
      expect(result.current.isPremium).toBe(true);
    });
  });

  describe('subscriptionTier resolution', () => {
    it('uses auth context user tier when available', () => {
      setupMocks({ authTier: 'premium', storeTier: 'free' });
      const { result } = renderHook(() => useSubscription());
      expect(result.current.subscriptionTier).toBe('premium');
    });

    it('falls back to store tier when auth user is null', () => {
      setupMocks({ authTier: null, storeTier: 'pro' });
      const { result } = renderHook(() => useSubscription());
      expect(result.current.subscriptionTier).toBe('pro');
    });

    it('defaults to free when both are unavailable', () => {
      mockUseAuth.mockReturnValue({ user: null });
      mockUseUserStore.mockReturnValue({ profile: { subscriptionTier: '' } });
      const { result } = renderHook(() => useSubscription());
      expect(result.current.subscriptionTier).toBe('free');
    });
  });

  describe('canAccessFeature', () => {
    it('blocks premium features for free users', () => {
      setupMocks({ authTier: null, storeTier: 'free' });
      const { result } = renderHook(() => useSubscription());
      expect(result.current.canAccessFeature('ai-signal-analyzer')).toBe(false);
      expect(result.current.canAccessFeature('options-flow')).toBe(false);
    });

    it('allows premium features for premium users', () => {
      setupMocks({ authTier: 'premium' });
      const { result } = renderHook(() => useSubscription());
      expect(result.current.canAccessFeature('ai-signal-analyzer')).toBe(true);
      expect(result.current.canAccessFeature('options-flow')).toBe(true);
    });

    it('allows non-premium features for free users', () => {
      setupMocks({ authTier: null, storeTier: 'free' });
      const { result } = renderHook(() => useSubscription());
      expect(result.current.canAccessFeature('some-free-feature')).toBe(true);
    });
  });
});
