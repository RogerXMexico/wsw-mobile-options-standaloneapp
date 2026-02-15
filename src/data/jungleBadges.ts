// Jungle Trading Academy - Badges and Levels
// Ported from web app for mobile

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type BadgeCategory = 'mastery' | 'achievement' | 'streak' | 'special' | 'hidden';

export interface JungleLevel {
  level: number;
  name: string;
  xpRequired: number;
  xpToNext: number;
  icon: string;
  rewards: string[];
}

export interface JungleBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: BadgeCategory;
  xpReward: number;
}

// ============ LEVEL DEFINITIONS ============

export const JUNGLE_LEVELS: JungleLevel[] = [
  {
    level: 1,
    name: 'Jungle Newcomer',
    xpRequired: 0,
    xpToNext: 500,
    icon: '',
    rewards: ['Access to Sloth strategies', 'Basic jungle avatar'],
  },
  {
    level: 2,
    name: 'Trail Scout',
    xpRequired: 500,
    xpToNext: 1000,
    icon: '',
    rewards: ['Trail Scout badge frame'],
  },
  {
    level: 3,
    name: 'Vine Swinger',
    xpRequired: 1500,
    xpToNext: 1500,
    icon: '',
    rewards: ['Badger strategies unlocked', 'Vine Swinger title'],
  },
  {
    level: 4,
    name: 'Canopy Explorer',
    xpRequired: 3000,
    xpToNext: 2000,
    icon: '',
    rewards: ['Canopy Explorer badge frame', 'Custom background: Canopy'],
  },
  {
    level: 5,
    name: 'Jungle Navigator',
    xpRequired: 5000,
    xpToNext: 3000,
    icon: '',
    rewards: ['Monkey strategies unlocked', 'Jungle Navigator title'],
  },
  {
    level: 6,
    name: 'Apex Apprentice',
    xpRequired: 8000,
    xpToNext: 4000,
    icon: '',
    rewards: ['Apex Apprentice badge frame', 'Custom background: Apex'],
  },
  {
    level: 7,
    name: 'Trading Predator',
    xpRequired: 12000,
    xpToNext: 6000,
    icon: '',
    rewards: ['Tiger strategies unlocked', 'Trading Predator title'],
  },
  {
    level: 8,
    name: 'Jungle Master',
    xpRequired: 18000,
    xpToNext: 7000,
    icon: '',
    rewards: ['Jungle Master badge frame', 'Custom background: Master'],
  },
  {
    level: 9,
    name: 'Legendary Trader',
    xpRequired: 25000,
    xpToNext: 10000,
    icon: '',
    rewards: ['Legendary badge frame', 'Animated avatar border'],
  },
  {
    level: 10,
    name: 'King of the Jungle',
    xpRequired: 35000,
    xpToNext: 0,
    icon: '',
    rewards: ['Golden jungle theme', 'King of the Jungle crown', 'Secret Lion mentor unlocked'],
  },
];

// ============ BADGE DEFINITIONS ============

export const JUNGLE_BADGES: JungleBadge[] = [
  // ===== MASTERY BADGES =====
  {
    id: 'sloth-whisperer',
    name: 'Sloth Whisperer',
    description: 'Complete all Sloth strategies and master the art of patience',
    icon: '',
    rarity: 'rare',
    category: 'mastery',
    xpReward: 500,
  },
  {
    id: 'badger-burrow-master',
    name: 'Badger Burrow Master',
    description: 'Complete all Badger strategies and become a spread specialist',
    icon: '',
    rarity: 'rare',
    category: 'mastery',
    xpReward: 500,
  },
  {
    id: 'monkey-business-pro',
    name: 'Monkey Business Pro',
    description: 'Complete all Monkey strategies and master the swing',
    icon: '',
    rarity: 'rare',
    category: 'mastery',
    xpReward: 500,
  },
  {
    id: 'jungle-king',
    name: 'Jungle King',
    description: 'Complete ALL animal curricula and rule the jungle',
    icon: '',
    rarity: 'legendary',
    category: 'mastery',
    xpReward: 1000,
  },

  // ===== ACHIEVEMENT BADGES =====
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson in the jungle',
    icon: '',
    rarity: 'common',
    category: 'achievement',
    xpReward: 25,
  },
  {
    id: 'sharp-shooter',
    name: 'Sharp Shooter',
    description: 'Score 100% on any quiz',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 50,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 100% on 5 different quizzes',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 200,
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Pass 10 quizzes',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Complete 10 lessons',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'xp-hunter',
    name: 'XP Hunter',
    description: 'Earn 5,000 XP',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'xp-master',
    name: 'XP Master',
    description: 'Earn 25,000 XP',
    icon: '',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 250,
  },
  {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'level-10',
    name: 'Maximum Level',
    description: 'Reach Level 10',
    icon: '',
    rarity: 'legendary',
    category: 'achievement',
    xpReward: 500,
  },

  // ===== STREAK BADGES =====
  {
    id: 'on-fire',
    name: 'On Fire',
    description: 'Maintain a 5-day login streak',
    icon: '',
    rarity: 'common',
    category: 'streak',
    xpReward: 50,
  },
  {
    id: 'dedicated',
    name: 'Dedicated Learner',
    description: 'Maintain a 14-day login streak',
    icon: '',
    rarity: 'uncommon',
    category: 'streak',
    xpReward: 100,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 30-day login streak',
    icon: '',
    rarity: 'rare',
    category: 'streak',
    xpReward: 300,
  },
  {
    id: 'legendary-streak',
    name: 'Legendary Consistency',
    description: 'Maintain a 100-day login streak',
    icon: '',
    rarity: 'legendary',
    category: 'streak',
    xpReward: 1000,
  },

  // ===== SPECIAL BADGES =====
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a lesson after 10 PM',
    icon: '',
    rarity: 'uncommon',
    category: 'special',
    xpReward: 50,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a lesson before 7 AM',
    icon: '',
    rarity: 'uncommon',
    category: 'special',
    xpReward: 50,
  },
  {
    id: 'risk-profiled',
    name: 'Know Thyself',
    description: 'Complete the risk assessment quiz',
    icon: '',
    rarity: 'common',
    category: 'special',
    xpReward: 50,
  },

  // ===== MISSION BADGES =====
  {
    id: 'mission-starter',
    name: 'Mission Starter',
    description: 'Complete your first daily mission',
    icon: '',
    rarity: 'common',
    category: 'achievement',
    xpReward: 25,
  },
  {
    id: 'mission-master',
    name: 'Mission Master',
    description: 'Complete 50 missions',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 200,
  },
  {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Complete all weekly missions in a single week',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 100,
  },

  // ===== TRIBE BADGES =====
  {
    id: 'tribe-member',
    name: 'Tribe Member',
    description: 'Join one of the jungle tribes',
    icon: '',
    rarity: 'common',
    category: 'achievement',
    xpReward: 25,
  },
  {
    id: 'tribe-contributor',
    name: 'Tribe Contributor',
    description: 'Contribute 1,000 XP to your tribe',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 75,
  },
  {
    id: 'tribe-champion',
    name: 'Tribe Champion',
    description: 'Be part of the winning tribe at season end',
    icon: '',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 300,
  },

  // ===== SOCIAL BADGES =====
  {
    id: 'first-share',
    name: 'Opening Trade',
    description: 'Share your first trade to the community feed',
    icon: '',
    rarity: 'common',
    category: 'achievement',
    xpReward: 25,
  },
  {
    id: 'popular-trader',
    name: 'Popular Trader',
    description: 'Receive 50 likes on your shared trades',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 150,
  },
  {
    id: 'trade-of-week',
    name: 'Trade of the Week',
    description: 'Have your trade featured as Trade of the Week',
    icon: '',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 250,
  },
  {
    id: 'supportive-trader',
    name: 'Supportive Trader',
    description: 'Like 25 trades from other community members',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 50,
  },

  // ===== CHALLENGE PATH BADGES =====
  {
    id: 'challenge-first-blood',
    name: 'First Blood',
    description: 'Complete the First Blood challenge path',
    icon: '',
    rarity: 'uncommon',
    category: 'achievement',
    xpReward: 50,
  },
  {
    id: 'challenge-income-architect',
    name: 'Income Architect',
    description: 'Complete the Income Architect challenge path',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 75,
  },
  {
    id: 'challenge-spread-master',
    name: 'Spread Master',
    description: 'Complete the Spread Master challenge path',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 75,
  },
  {
    id: 'challenge-volatility-hunter',
    name: 'Volatility Hunter',
    description: 'Complete the Volatility Hunter challenge path',
    icon: '',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'challenge-iron-chef',
    name: 'Iron Chef',
    description: 'Complete the Iron Chef challenge path',
    icon: '',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'challenge-time-wizard',
    name: 'Time Wizard',
    description: 'Complete the Time Wizard challenge path',
    icon: '',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'challenge-exotic-explorer',
    name: 'Exotic Explorer',
    description: 'Complete the Exotic Explorer challenge path',
    icon: '',
    rarity: 'legendary',
    category: 'achievement',
    xpReward: 150,
  },
  {
    id: 'challenge-social-butterfly',
    name: 'Social Butterfly',
    description: 'Complete the Social Butterfly challenge path',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 75,
  },
  {
    id: 'challenge-streak-warrior',
    name: 'Streak Warrior',
    description: 'Complete the Streak Warrior challenge path',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 75,
  },
  {
    id: 'challenge-event-horizon-pioneer',
    name: 'Event Horizon Pioneer',
    description: 'Complete the Event Horizon Pioneer challenge path',
    icon: '',
    rarity: 'legendary',
    category: 'achievement',
    xpReward: 150,
  },

  // ===== SEASONAL BADGES =====
  {
    id: 'season-winter-hunt',
    name: 'Winter Hunt Survivor',
    description: 'Participated in the Winter Hunt season',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'season-spring-rally',
    name: 'Spring Rally Champion',
    description: 'Participated in the Spring Rally season',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'season-summer-stampede',
    name: 'Summer Stampede Warrior',
    description: 'Participated in the Summer Stampede season',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'season-fall-harvest',
    name: 'Fall Harvest Collector',
    description: 'Participated in the Fall Harvest season',
    icon: '',
    rarity: 'rare',
    category: 'achievement',
    xpReward: 100,
  },

  // ===== MASTERY BADGES (additional) =====
  {
    id: 'cheetahs-chosen',
    name: 'Cheetah\'s Chosen',
    description: 'Complete all Cheetah strategies and master lightning-fast execution',
    icon: '',
    rarity: 'epic',
    category: 'mastery',
    xpReward: 750,
  },
  {
    id: 'graduate',
    name: 'Graduate',
    description: 'Complete all lessons from all animal curricula',
    icon: '',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 500,
  },

  // ===== STREAK BADGES (additional) =====
  {
    id: 'mission-streak-5',
    name: 'Mission Streak',
    description: 'Maintain a 5-day mission completion streak',
    icon: '',
    rarity: 'uncommon',
    category: 'streak',
    xpReward: 75,
  },

  // ===== TRIBE BADGES (additional) =====
  {
    id: 'tribe-legend',
    name: 'Tribe Legend',
    description: 'Contribute 10,000 XP to your tribe',
    icon: '',
    rarity: 'legendary',
    category: 'achievement',
    xpReward: 500,
  },
  {
    id: 'challenge-victor',
    name: 'Challenge Victor',
    description: 'Your tribe won a weekly challenge',
    icon: '',
    rarity: 'epic',
    category: 'achievement',
    xpReward: 100,
  },
  {
    id: 'challenge-streak-3',
    name: 'Three-Peat',
    description: 'Your tribe won 3 weekly challenges in a row',
    icon: '',
    rarity: 'legendary',
    category: 'achievement',
    xpReward: 250,
  },

  // ===== HIDDEN BADGES =====
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Complete an entire animal curriculum in a single session',
    icon: '',
    rarity: 'epic',
    category: 'hidden',
    xpReward: 300,
  },
  {
    id: 'explorer',
    name: 'Jungle Explorer',
    description: 'Visit every section of the Jungle Academy',
    icon: '',
    rarity: 'uncommon',
    category: 'hidden',
    xpReward: 75,
  },
  {
    id: 'lions-roar',
    name: 'Lion\'s Roar',
    description: '???',
    icon: '',
    rarity: 'legendary',
    category: 'hidden',
    xpReward: 500,
  },
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Pass a quiz after failing it 3 times',
    icon: '',
    rarity: 'rare',
    category: 'hidden',
    xpReward: 150,
  },
  {
    id: 'all-badges',
    name: 'Badge Collector',
    description: 'Earn all other badges (excluding hidden)',
    icon: '',
    rarity: 'legendary',
    category: 'hidden',
    xpReward: 1000,
  },
];

// ============ DAILY MISSIONS ============

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  type: 'lesson' | 'quiz' | 'practice' | 'social' | 'streak';
  target: number;
  progress?: number;
}

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'complete-lesson',
    title: 'Knowledge Seeker',
    description: 'Complete 1 lesson',
    xpReward: 50,
    icon: '',
    type: 'lesson',
    target: 1,
  },
  {
    id: 'pass-quiz',
    title: 'Quiz Champion',
    description: 'Pass a quiz with 80%+',
    xpReward: 75,
    icon: '',
    type: 'quiz',
    target: 1,
  },
  {
    id: 'paper-trade',
    title: 'Practice Makes Perfect',
    description: 'Make 3 paper trades',
    xpReward: 50,
    icon: '',
    type: 'practice',
    target: 3,
  },
  {
    id: 'visit-tools',
    title: 'Tool Explorer',
    description: 'Use 2 different tools',
    xpReward: 40,
    icon: '',
    type: 'practice',
    target: 2,
  },
  {
    id: 'daily-login',
    title: 'Showing Up',
    description: 'Log in to the app',
    xpReward: 25,
    icon: '',
    type: 'streak',
    target: 1,
  },
];

// ============ HELPER FUNCTIONS ============

export const getLevelForXP = (xp: number): JungleLevel => {
  for (let i = JUNGLE_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= JUNGLE_LEVELS[i].xpRequired) {
      return JUNGLE_LEVELS[i];
    }
  }
  return JUNGLE_LEVELS[0];
};

export const getXPProgress = (xp: number): { current: number; needed: number; percentage: number } => {
  const level = getLevelForXP(xp);
  const nextLevelIndex = JUNGLE_LEVELS.findIndex(l => l.level === level.level) + 1;

  if (nextLevelIndex >= JUNGLE_LEVELS.length) {
    return { current: xp, needed: xp, percentage: 100 };
  }

  const nextLevel = JUNGLE_LEVELS[nextLevelIndex];
  const xpIntoLevel = xp - level.xpRequired;
  const xpNeededForNext = nextLevel.xpRequired - level.xpRequired;

  return {
    current: xpIntoLevel,
    needed: xpNeededForNext,
    percentage: Math.round((xpIntoLevel / xpNeededForNext) * 100),
  };
};

export const getBadgeById = (id: string): JungleBadge | undefined => {
  return JUNGLE_BADGES.find(b => b.id === id);
};

export const getBadgesByCategory = (category: BadgeCategory): JungleBadge[] => {
  return JUNGLE_BADGES.filter(b => b.category === category);
};

export const getBadgesByRarity = (rarity: BadgeRarity): JungleBadge[] => {
  return JUNGLE_BADGES.filter(b => b.rarity === rarity);
};

export const getVisibleBadges = (): JungleBadge[] => {
  return JUNGLE_BADGES.filter(b => b.category !== 'hidden');
};

export const RARITY_COLORS = {
  common: { bg: 'rgba(100, 116, 139, 0.2)', border: '#64748b', text: '#94a3b8' },
  uncommon: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#4ade80' },
  rare: { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', text: '#60a5fa' },
  epic: { bg: 'rgba(168, 85, 247, 0.2)', border: '#a855f7', text: '#c084fc' },
  legendary: { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', text: '#fbbf24' },
} as const;
