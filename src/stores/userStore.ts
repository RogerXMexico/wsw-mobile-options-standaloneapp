// User Store - Zustand with AsyncStorage persistence
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  completedLessons: string[];
  completedQuizzes: string[];
  earnedBadges: string[];
  completedStrategies: string[];
}

export interface DailyLimits {
  tradeCount: number;
  tradeDate: string | null;
  postCount: number;
  postDate: string | null;
}

export interface UserProfile {
  id: string | null;
  email: string | null;
  displayName: string | null;
  avatarAnimal: string;
  subscriptionTier: 'free' | 'premium' | 'pro';
  purchasedTiers: number[];
  purchasedPacks: string[];
  tribeId: string | null;
  createdAt: string | null;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  accentColor: 'green' | 'cyan' | 'purple' | 'yellow' | 'pink';
  notifications: {
    dailyReminder: boolean;
    streakAlert: boolean;
    levelUp: boolean;
    badgeEarned: boolean;
    marketOpen: boolean;
    earnings: boolean;
    ivSpike: boolean;
    priceTarget: boolean;
    tribeActivity: boolean;
    leaderboard: boolean;
    missions: boolean;
    appUpdates: boolean;
    subscription: boolean;
    tips: boolean;
  };
  quietHours: boolean;
  reducedMotion: boolean;
  glowEffects: boolean;
  animations: boolean;
  highContrast: boolean;
  compactMode: boolean;
}

interface UserState {
  // Profile
  profile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Progress
  progress: UserProgress;

  // Preferences
  preferences: UserPreferences;

  // Daily Limits
  dailyLimits: DailyLimits;

  // Actions - Profile
  setProfile: (profile: Partial<UserProfile>) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  clearProfile: () => void;

  // Actions - Progress
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeQuiz: (quizId: string) => void;
  earnBadge: (badgeId: string) => void;
  completeStrategy: (strategyId: string) => void;
  updateStreak: () => void;
  resetProgress: () => void;

  // Actions - Daily Limits
  incrementTradeCount: () => boolean;
  getDailyTradesRemaining: (max: number) => number;

  // Actions - Preferences
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  setNotificationPreference: (key: keyof UserPreferences['notifications'], value: boolean) => void;
  resetPreferences: () => void;
}

const initialProfile: UserProfile = {
  id: null,
  email: null,
  displayName: null,
  avatarAnimal: 'monkey',
  subscriptionTier: 'free',
  purchasedTiers: [],
  purchasedPacks: [],
  tribeId: null,
  createdAt: null,
};

const initialDailyLimits: DailyLimits = {
  tradeCount: 0,
  tradeDate: null,
  postCount: 0,
  postDate: null,
};

const initialProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  completedLessons: [],
  completedQuizzes: [],
  earnedBadges: [],
  completedStrategies: [],
};

const initialPreferences: UserPreferences = {
  theme: 'dark',
  accentColor: 'green',
  notifications: {
    dailyReminder: true,
    streakAlert: true,
    levelUp: true,
    badgeEarned: true,
    marketOpen: false,
    earnings: true,
    ivSpike: false,
    priceTarget: true,
    tribeActivity: true,
    leaderboard: false,
    missions: true,
    appUpdates: true,
    subscription: true,
    tips: false,
  },
  quietHours: false,
  reducedMotion: false,
  glowEffects: true,
  animations: true,
  highContrast: false,
  compactMode: false,
};

// XP thresholds for levels
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];

const calculateLevel = (xp: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: initialProfile,
      isAuthenticated: false,
      isLoading: true,
      progress: initialProgress,
      preferences: initialPreferences,
      dailyLimits: initialDailyLimits,

      // Profile actions
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      setLoading: (value) => set({ isLoading: value }),

      clearProfile: () =>
        set({
          profile: initialProfile,
          isAuthenticated: false,
          progress: initialProgress,
        }),

      // Progress actions
      addXP: (amount) =>
        set((state) => {
          const newXP = state.progress.xp + amount;
          const newLevel = calculateLevel(newXP);
          return {
            progress: {
              ...state.progress,
              xp: newXP,
              level: newLevel,
            },
          };
        }),

      completeLesson: (lessonId) =>
        set((state) => {
          if (state.progress.completedLessons.includes(lessonId)) {
            return state;
          }
          return {
            progress: {
              ...state.progress,
              completedLessons: [...state.progress.completedLessons, lessonId],
            },
          };
        }),

      completeQuiz: (quizId) =>
        set((state) => {
          if (state.progress.completedQuizzes.includes(quizId)) {
            return state;
          }
          return {
            progress: {
              ...state.progress,
              completedQuizzes: [...state.progress.completedQuizzes, quizId],
            },
          };
        }),

      earnBadge: (badgeId) =>
        set((state) => {
          if (state.progress.earnedBadges.includes(badgeId)) {
            return state;
          }
          return {
            progress: {
              ...state.progress,
              earnedBadges: [...state.progress.earnedBadges, badgeId],
            },
          };
        }),

      completeStrategy: (strategyId) =>
        set((state) => {
          if (state.progress.completedStrategies.includes(strategyId)) {
            return state;
          }
          return {
            progress: {
              ...state.progress,
              completedStrategies: [...state.progress.completedStrategies, strategyId],
            },
          };
        }),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastActive = state.progress.lastActiveDate;

          if (lastActive === today) {
            return state; // Already updated today
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          const newStreak = lastActive === yesterdayStr
            ? state.progress.streak + 1
            : 1; // Reset streak if missed a day

          return {
            progress: {
              ...state.progress,
              streak: newStreak,
              lastActiveDate: today,
            },
          };
        }),

      resetProgress: () => set({ progress: initialProgress }),

      // Daily Limits actions
      incrementTradeCount: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const limits = state.dailyLimits;

        // Reset if new day
        if (limits.tradeDate !== today) {
          set({
            dailyLimits: { ...limits, tradeCount: 1, tradeDate: today },
          });
          return true;
        }

        // Increment (caller checks against max before calling)
        set({
          dailyLimits: { ...limits, tradeCount: limits.tradeCount + 1 },
        });
        return true;
      },

      getDailyTradesRemaining: (max: number) => {
        const today = new Date().toISOString().split('T')[0];
        const limits = get().dailyLimits;
        if (limits.tradeDate !== today) return max;
        return Math.max(0, max - limits.tradeCount);
      },

      // Preferences actions
      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),

      setNotificationPreference: (key, value) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            notifications: {
              ...state.preferences.notifications,
              [key]: value,
            },
          },
        })),

      resetPreferences: () => set({ preferences: initialPreferences }),
    }),
    {
      name: 'wsw-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        progress: state.progress,
        preferences: state.preferences,
        dailyLimits: state.dailyLimits,
      }),
    }
  )
);
