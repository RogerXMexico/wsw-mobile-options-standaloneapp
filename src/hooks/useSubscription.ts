// Subscription hook for Wall Street Wildlife Mobile
// Reads subscription status from auth context / Zustand store
// Payments are handled on the website — mobile only reads status
import { useAuth } from '../contexts';
import { useUserStore } from '../stores';

type SubscriptionTier = 'free' | 'premium' | 'pro';

interface UseSubscriptionReturn {
  subscriptionTier: SubscriptionTier;
  isPremium: boolean;
  canAccessTier: (tier: number) => boolean;
  canAccessFeature: (feature: string) => boolean;
}

// Free users can only access Tier 0 and Tier 0.5
const FREE_TIERS = [0, 0.5];

// Premium features that require a subscription
const PREMIUM_FEATURES = [
  'options-flow',
  'ai-signal-analyzer',
  'advanced-screener',
  'earnings-calendar',
  'iv-rank-tool',
  'options-surface-3d',
  'tribe-chat',
  'challenge-paths',
  'video-lessons',
];

export const useSubscription = (): UseSubscriptionReturn => {
  const { user } = useAuth();
  const userStore = useUserStore();

  // Get tier from auth context first, fall back to Zustand store
  const subscriptionTier: SubscriptionTier =
    user?.subscriptionTier || userStore.profile.subscriptionTier || 'free';

  const isPremium = subscriptionTier !== 'free';

  const canAccessTier = (tier: number): boolean => {
    if (isPremium) return true;
    return FREE_TIERS.includes(tier);
  };

  const canAccessFeature = (feature: string): boolean => {
    if (isPremium) return true;
    return !PREMIUM_FEATURES.includes(feature);
  };

  return {
    subscriptionTier,
    isPremium,
    canAccessTier,
    canAccessFeature,
  };
};

export default useSubscription;
