// Event Horizons Module - Badges and Achievements
// Tier 8 Gamification

import { JungleBadge, BadgeRarity } from './jungleBadges';

// ============ EVENT HORIZONS BADGE DEFINITIONS ============

export const EVENT_HORIZONS_BADGES: JungleBadge[] = [
  // ===== CHAMELEON MASTERY BADGE =====
  {
    id: 'chameleon-master',
    name: 'Chameleon Master',
    description: 'Complete all Event Horizons lessons and master dual-market analysis',
    icon: 'chameleon',
    rarity: 'legendary',
    category: 'mastery',
    xpReward: 1000,
  },

  // ===== EVENT TYPE BADGES =====
  {
    id: 'earnings-oracle',
    name: 'Earnings Oracle',
    description: 'Successfully analyze 5 earnings events using prediction-options gap analysis',
    icon: 'bar-chart-outline',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 400,
  },
  {
    id: 'fda-forecaster',
    name: 'FDA Forecaster',
    description: 'Master binary catalyst analysis with 5 FDA/regulatory event studies',
    icon: 'medkit-outline',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 400,
  },
  {
    id: 'macro-maven',
    name: 'Macro Maven',
    description: 'Understand market-wide events by completing 5 macro/Fed case studies',
    icon: 'business-outline',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 400,
  },
  {
    id: 'corporate-catalyst',
    name: 'Corporate Catalyst',
    description: 'Analyze 5 corporate events including M&A, leadership, and product launches',
    icon: 'business-outline',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 400,
  },

  // ===== PAPER TRADING BADGES =====
  {
    id: 'first-prediction',
    name: 'First Prediction',
    description: 'Make your first paper trade in the Polymarket simulator',
    icon: 'locate-outline',
    rarity: 'common',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'prediction-streak-3',
    name: 'Lucky Streak',
    description: 'Win 3 prediction trades in a row',
    icon: 'flame-outline',
    rarity: 'uncommon',
    category: 'streak',
    xpReward: 200,
  },
  {
    id: 'profitable-prophet',
    name: 'Profitable Prophet',
    description: 'Achieve 20% total return in your Polymarket paper trading portfolio',
    icon: 'cash-outline',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 500,
  },

  // ===== GAP ANALYSIS BADGES =====
  {
    id: 'gap-hunter',
    name: 'Gap Hunter',
    description: 'Identify your first probability-IV gap using the Gap Analyzer tool',
    icon: 'search-outline',
    rarity: 'common',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'long-vol-specialist',
    name: 'Long Vol Specialist',
    description: 'Correctly identify 5 underpriced volatility opportunities',
    icon: 'trending-up',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 350,
  },
  {
    id: 'short-vol-specialist',
    name: 'Short Vol Specialist',
    description: 'Correctly identify 5 overpriced volatility opportunities',
    icon: 'trending-down',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 350,
  },

  // ===== LESSON COMPLETION BADGES =====
  {
    id: 'two-jungles',
    name: 'Two Jungles Explorer',
    description: 'Complete Lesson 1: Two Jungles, One Hunter',
    icon: 'leaf-outline',
    rarity: 'common',
    category: 'achievement',
    xpReward: 75,
  },
  {
    id: 'capstone-champion',
    name: 'Capstone Champion',
    description: 'Complete the Event Horizons capstone assessment with 80%+ score',
    icon: 'trophy-outline',
    rarity: 'epic',
    category: 'mastery',
    xpReward: 750,
  },
];

// ============ EVENT HORIZONS DAILY MISSIONS ============

export interface EventHorizonsMission {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  type: 'lesson' | 'tool' | 'trading' | 'analysis';
  requirement: {
    action: string;
    count: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

export const EVENT_HORIZONS_MISSIONS: EventHorizonsMission[] = [
  // Easy Missions
  {
    id: 'daily-lesson',
    title: 'Daily Learner',
    description: 'Complete any Event Horizons lesson',
    icon: 'book-outline',
    xpReward: 50,
    type: 'lesson',
    requirement: { action: 'complete_lesson', count: 1 },
    difficulty: 'easy',
  },
  {
    id: 'scanner-check',
    title: 'Market Scout',
    description: "Check the Prediction Scanner for today's events",
    icon: 'radio-outline',
    xpReward: 25,
    type: 'tool',
    requirement: { action: 'view_scanner', count: 1 },
    difficulty: 'easy',
  },
  {
    id: 'case-study-view',
    title: 'History Student',
    description: 'Review any historical case study',
    icon: 'document-text-outline',
    xpReward: 35,
    type: 'analysis',
    requirement: { action: 'view_case_study', count: 1 },
    difficulty: 'easy',
  },

  // Medium Missions
  {
    id: 'gap-analysis',
    title: 'Gap Detective',
    description: 'Analyze 3 events using the Gap Analyzer',
    icon: 'search-outline',
    xpReward: 75,
    type: 'analysis',
    requirement: { action: 'gap_analysis', count: 3 },
    difficulty: 'medium',
  },
  {
    id: 'paper-trade',
    title: 'Paper Predictor',
    description: 'Make a paper trade in the Polymarket simulator',
    icon: 'create-outline',
    xpReward: 60,
    type: 'trading',
    requirement: { action: 'paper_trade', count: 1 },
    difficulty: 'medium',
  },
  {
    id: 'replay-complete',
    title: 'Time Traveler',
    description: 'Complete an event replay from start to finish',
    icon: 'timer-outline',
    xpReward: 80,
    type: 'tool',
    requirement: { action: 'complete_replay', count: 1 },
    difficulty: 'medium',
  },

  // Hard Missions
  {
    id: 'all-event-types',
    title: 'Event Master',
    description: 'Study one case study from each event type today',
    icon: 'locate-outline',
    xpReward: 150,
    type: 'analysis',
    requirement: { action: 'study_all_types', count: 4 },
    difficulty: 'hard',
  },
  {
    id: 'profitable-day',
    title: 'Green Day',
    description: 'End the day with positive P&L in paper trading',
    icon: 'heart',
    xpReward: 100,
    type: 'trading',
    requirement: { action: 'positive_pnl', count: 1 },
    difficulty: 'hard',
  },
  {
    id: 'lesson-marathon',
    title: 'Knowledge Marathon',
    description: 'Complete 3 Event Horizons lessons in one session',
    icon: 'walk-outline',
    xpReward: 200,
    type: 'lesson',
    requirement: { action: 'complete_lessons', count: 3 },
    difficulty: 'hard',
  },
];

// ============ XP REWARDS CONFIGURATION ============

export const EVENT_HORIZONS_XP_REWARDS = {
  // Lesson completion
  lessonComplete: 100,
  lessonWithQuiz: 150,

  // Tool usage
  scannerView: 10,
  gapAnalysis: 25,
  replayComplete: 50,

  // Paper trading
  firstTrade: 50,
  profitableTrade: 30,
  tradingStreak: 75,

  // Achievements
  eventTypeComplete: 200,
  tierComplete: 500,

  // Daily login
  dailyLogin: 20,
  streakBonus: 10, // per day
};

// ============ RARITY COLORS (for mobile styling) ============

export const BADGE_RARITY_COLORS: Record<
  BadgeRarity,
  { bg: string; text: string; border: string; glow: string }
> = {
  common: {
    bg: 'rgba(148, 163, 184, 0.2)',
    text: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.5)',
    glow: '0 0 10px rgba(148, 163, 184, 0.3)',
  },
  uncommon: {
    bg: 'rgba(52, 211, 153, 0.2)',
    text: '#34d399',
    border: 'rgba(52, 211, 153, 0.5)',
    glow: '0 0 10px rgba(52, 211, 153, 0.3)',
  },
  rare: {
    bg: 'rgba(59, 130, 246, 0.2)',
    text: '#3b82f6',
    border: 'rgba(59, 130, 246, 0.5)',
    glow: '0 0 10px rgba(59, 130, 246, 0.3)',
  },
  epic: {
    bg: 'rgba(168, 85, 247, 0.2)',
    text: '#a855f7',
    border: 'rgba(168, 85, 247, 0.5)',
    glow: '0 0 15px rgba(168, 85, 247, 0.4)',
  },
  legendary: {
    bg: 'rgba(245, 158, 11, 0.2)',
    text: '#f59e0b',
    border: 'rgba(245, 158, 11, 0.5)',
    glow: '0 0 20px rgba(245, 158, 11, 0.5)',
  },
};

// ============ HELPER FUNCTIONS ============

export const getEventHorizonsBadgeById = (
  id: string
): JungleBadge | undefined => {
  return EVENT_HORIZONS_BADGES.find((badge) => badge.id === id);
};

export const getEventHorizonsBadgesByCategory = (
  category: JungleBadge['category']
): JungleBadge[] => {
  return EVENT_HORIZONS_BADGES.filter((badge) => badge.category === category);
};

export const getEventHorizonsBadgesByRarity = (
  rarity: BadgeRarity
): JungleBadge[] => {
  return EVENT_HORIZONS_BADGES.filter((badge) => badge.rarity === rarity);
};

export const getTodaysMissions = (
  completed: string[] = [],
  difficulty?: 'easy' | 'medium' | 'hard'
): EventHorizonsMission[] => {
  // Get missions based on day of week for variety
  const dayOfWeek = new Date().getDay();
  const shuffledMissions = [...EVENT_HORIZONS_MISSIONS].sort(
    (a, b) =>
      ((a.id.charCodeAt(0) + dayOfWeek) % 7) -
      ((b.id.charCodeAt(0) + dayOfWeek) % 7)
  );

  let missions = shuffledMissions.filter((m) => !completed.includes(m.id));

  if (difficulty) {
    missions = missions.filter((m) => m.difficulty === difficulty);
  }

  // Return 3 missions per day (1 easy, 1 medium, 1 hard if available)
  const easy = missions.find((m) => m.difficulty === 'easy');
  const medium = missions.find((m) => m.difficulty === 'medium');
  const hard = missions.find((m) => m.difficulty === 'hard');

  return [easy, medium, hard].filter(Boolean) as EventHorizonsMission[];
};

export const calculateMissionProgress = (
  mission: EventHorizonsMission,
  currentCount: number
): { progress: number; complete: boolean } => {
  const progress = Math.min(currentCount / mission.requirement.count, 1);
  return {
    progress,
    complete: currentCount >= mission.requirement.count,
  };
};

export const getTotalXPFromBadges = (earnedBadgeIds: string[]): number => {
  return earnedBadgeIds.reduce((total, badgeId) => {
    const badge = getEventHorizonsBadgeById(badgeId);
    return total + (badge?.xpReward || 0);
  }, 0);
};
