// Subscription hook for Wall Street Wildlife Mobile
// Central brain for all access control — Jungle Pass model
import { useAuth } from '../contexts';
import { useUserStore } from '../stores';
import { FREE_ACCESS } from '../data/constants';
import { getStrategiesByTier } from '../data/strategies';

type SubscriptionTier = 'free' | 'premium' | 'pro';
export type AccessLevel = 'full' | 'first-lesson' | 'locked';

interface UseSubscriptionReturn {
  subscriptionTier: SubscriptionTier;
  isPremium: boolean;
  canAccessTier: (tier: number) => boolean;
  canAccessFeature: (feature: string) => boolean;
  getTierAccessLevel: (tier: number) => AccessLevel;
  canAccessStrategy: (strategyId: string, tier: number, indexInTier: number) => boolean;
  getStrategyIndexInTier: (strategyId: string, tier: number) => number;
  canAccessTool: (toolId: string) => boolean;
  canAccessMentor: (mentorId: string) => boolean;
  canPlaceTrade: () => boolean;
  dailyTradesRemaining: number;
}

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
  const purchasedTiers = userStore.profile.purchasedTiers || [];
  const purchasedPacks = userStore.profile.purchasedPacks || [];

  const getTierAccessLevel = (tier: number): AccessLevel => {
    if (isPremium) return 'full';
    if (purchasedTiers.includes(tier)) return 'full';
    if (FREE_ACCESS.fullAccessTiers.includes(tier)) return 'full';
    if (FREE_ACCESS.firstLessonFreeTiers.includes(tier)) return 'first-lesson';
    return 'locked';
  };

  const canAccessTier = (tier: number): boolean => {
    return getTierAccessLevel(tier) !== 'locked';
  };

  const getStrategyIndexInTier = (strategyId: string, tier: number): number => {
    const tierStrategies = getStrategiesByTier(tier);
    return tierStrategies.findIndex(s => s.id === strategyId);
  };

  const canAccessStrategy = (strategyId: string, tier: number, indexInTier: number): boolean => {
    if (isPremium) return true;
    if (purchasedTiers.includes(tier)) return true;

    const level = getTierAccessLevel(tier);
    if (level === 'full') return true;
    if (level === 'first-lesson' && indexInTier === 0) return true;
    return false;
  };

  const canAccessTool = (toolId: string): boolean => {
    if (isPremium) return true;
    if (purchasedPacks.includes('tool-pack')) return true;
    return FREE_ACCESS.freeTools.includes(toolId);
  };

  const canAccessMentor = (mentorId: string): boolean => {
    if (isPremium) return true;
    if (purchasedPacks.includes('mentor-pack')) return true;
    return mentorId === FREE_ACCESS.freeMentorId;
  };

  const canPlaceTrade = (): boolean => {
    if (isPremium) return true;
    const remaining = userStore.getDailyTradesRemaining(FREE_ACCESS.maxDailyTradesFree);
    return remaining > 0;
  };

  const dailyTradesRemaining = isPremium
    ? Infinity
    : userStore.getDailyTradesRemaining(FREE_ACCESS.maxDailyTradesFree);

  const canAccessFeature = (feature: string): boolean => {
    if (isPremium) return true;
    return !PREMIUM_FEATURES.includes(feature);
  };

  return {
    subscriptionTier,
    isPremium,
    canAccessTier,
    canAccessFeature,
    getTierAccessLevel,
    canAccessStrategy,
    getStrategyIndexInTier,
    canAccessTool,
    canAccessMentor,
    canPlaceTrade,
    dailyTradesRemaining,
  };
};

export default useSubscription;
