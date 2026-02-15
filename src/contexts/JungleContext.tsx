// JungleContext for Wall Street Wildlife Mobile
// Manages XP, levels, badges, jungle progress, streak state
// Syncs to Supabase when online, falls back to AsyncStorage
import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { JUNGLE_LEVELS, JUNGLE_BADGES, JungleBadge } from '../data/jungleBadges';
import { JUNGLE_ANIMALS } from '../data/jungleAnimals';

// XP values for different actions
const XP_VALUES = {
  lesson_complete: 25,
  strategy_complete: 50,
  quiz_pass_first: 100,
  quiz_pass_retry: 25,
  quiz_perfect: 50,
  daily_login: 10,
  streak_bonus: 5,
};

// Progress state
interface JungleProgress {
  xp: number;
  completedLessons: string[];
  completedStrategies: string[];
  quizScores: Record<string, { score: number; total: number; passed: boolean; attempts: number; bestScore: number }>;
  earnedBadges: string[];
  streakDays: number;
  lastLoginDate: string;
  totalLoginDays: number;
  riskProfile: string | null;
  secondaryProfile: string | null;
  assessmentCompleted: boolean;
}

interface JungleContextType {
  // Progress
  progress: JungleProgress;
  level: number;
  levelName: string;
  levelIcon: string;
  xpProgress: { current: number; needed: number; percentage: number };

  // Actions
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeStrategy: (strategyId: string) => void;
  recordQuizScore: (quizId: string, score: number, total: number) => void;

  // Risk Profile
  riskProfile: string | null;
  setRiskProfile: (primary: string, secondary: string) => void;
  assessmentCompleted: boolean;

  // Badges
  earnedBadges: string[];
  pendingBadge: JungleBadge | null;
  awardBadge: (badgeId: string) => void;
  dismissBadge: () => void;

  // Streak
  streakDays: number;
  checkStreak: () => void;

  // Utility
  isLoading: boolean;
  error: string | null;
  resetProgress: () => void;
}

const STORAGE_KEY = 'jungle-progress';

const getDefaultProgress = (): JungleProgress => ({
  xp: 0,
  completedLessons: [],
  completedStrategies: [],
  quizScores: {},
  earnedBadges: [],
  streakDays: 0,
  lastLoginDate: '',
  totalLoginDays: 0,
  riskProfile: null,
  secondaryProfile: null,
  assessmentCompleted: false,
});

// Get level info from XP
function getLevelForXP(xp: number) {
  let current = JUNGLE_LEVELS[0];
  for (const lvl of JUNGLE_LEVELS) {
    if (xp >= lvl.xpRequired) {
      current = lvl;
    } else {
      break;
    }
  }
  return current;
}

function getXPProgress(xp: number) {
  const currentLevel = getLevelForXP(xp);
  const currentLevelXP = xp - currentLevel.xpRequired;
  const needed = currentLevel.xpToNext;
  return {
    current: currentLevelXP,
    needed,
    percentage: needed > 0 ? Math.min((currentLevelXP / needed) * 100, 100) : 100,
  };
}

const JungleContext = createContext<JungleContextType | undefined>(undefined);

interface JungleProviderProps {
  children: ReactNode;
}

export const JungleProvider: React.FC<JungleProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<JungleProgress>(getDefaultProgress());
  const [pendingBadge, setPendingBadge] = useState<JungleBadge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const useSupabase = isSupabaseConfigured();

  const levelData = getLevelForXP(progress.xp);
  const xpProgress = getXPProgress(progress.xp);

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      // Try AsyncStorage first
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProgress({ ...getDefaultProgress(), ...JSON.parse(stored) });
        }
      } catch (e) {
        console.error('Failed to load jungle progress from AsyncStorage:', e);
      }

      // If authenticated + Supabase configured, load from cloud
      if (user && useSupabase) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('jungle_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (data && !error) {
            const cloudProgress: JungleProgress = {
              xp: data.xp || 0,
              completedLessons: data.completed_lessons || [],
              completedStrategies: data.completed_strategies || [],
              quizScores: data.quiz_scores || {},
              earnedBadges: data.earned_badges || [],
              streakDays: data.streak_days || 0,
              lastLoginDate: data.last_login_date || '',
              totalLoginDays: data.total_login_days || 0,
              riskProfile: data.risk_profile,
              secondaryProfile: data.secondary_profile,
              assessmentCompleted: data.assessment_completed || false,
            };
            setProgress(cloudProgress);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProgress));
          }
        } catch (e) {
          console.error('Failed to load cloud jungle progress:', e);
          setSyncError('Could not load cloud progress. Using local data.');
          setTimeout(() => setSyncError(null), 8000);
        }
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user, useSupabase]);

  // Save progress
  const saveProgress = useCallback(async (newProgress: JungleProgress) => {
    setProgress(newProgress);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));

    if (user && useSupabase) {
      try {
        await supabase.from('jungle_progress').upsert({
          user_id: user.id,
          xp: newProgress.xp,
          level: getLevelForXP(newProgress.xp).level,
          completed_lessons: newProgress.completedLessons,
          completed_strategies: newProgress.completedStrategies,
          quiz_scores: newProgress.quizScores,
          earned_badges: newProgress.earnedBadges,
          streak_days: newProgress.streakDays,
          last_login_date: newProgress.lastLoginDate,
          total_login_days: newProgress.totalLoginDays,
          risk_profile: newProgress.riskProfile,
          secondary_profile: newProgress.secondaryProfile,
          assessment_completed: newProgress.assessmentCompleted,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error('Failed to sync jungle progress:', e);
      }
    }
  }, [user, useSupabase]);

  // XP Actions
  const addXP = useCallback((amount: number) => {
    setProgress(prev => {
      const updated = { ...prev, xp: prev.xp + amount };
      saveProgress(updated);
      return updated;
    });
  }, [saveProgress]);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updated = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        xp: prev.xp + XP_VALUES.lesson_complete,
      };
      saveProgress(updated);
      return updated;
    });
  }, [saveProgress]);

  const completeStrategy = useCallback((strategyId: string) => {
    setProgress(prev => {
      if (prev.completedStrategies.includes(strategyId)) return prev;
      const updated = {
        ...prev,
        completedStrategies: [...prev.completedStrategies, strategyId],
        xp: prev.xp + XP_VALUES.strategy_complete,
      };
      saveProgress(updated);
      return updated;
    });
  }, [saveProgress]);

  const recordQuizScore = useCallback((quizId: string, score: number, total: number) => {
    setProgress(prev => {
      const existing = prev.quizScores[quizId];
      const passed = score >= total * 0.7;
      const isPerfect = score === total;
      const isFirstPass = passed && (!existing || !existing.passed);

      let xpGained = 0;
      if (isFirstPass) xpGained += XP_VALUES.quiz_pass_first;
      else if (passed) xpGained += XP_VALUES.quiz_pass_retry;
      if (isPerfect) xpGained += XP_VALUES.quiz_perfect;

      const updated = {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [quizId]: {
            score,
            total,
            passed,
            attempts: (existing?.attempts || 0) + 1,
            bestScore: Math.max(score, existing?.bestScore || 0),
          },
        },
        xp: prev.xp + xpGained,
      };
      saveProgress(updated);
      return updated;
    });
  }, [saveProgress]);

  // Risk Profile
  const setRiskProfile = useCallback((primary: string, secondary: string) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        riskProfile: primary,
        secondaryProfile: secondary,
        assessmentCompleted: true,
        xp: prev.xp + (prev.assessmentCompleted ? 0 : XP_VALUES.lesson_complete),
      };
      saveProgress(updated);
      return updated;
    });
  }, [saveProgress]);

  // Badges
  const awardBadge = useCallback((badgeId: string) => {
    const badge = JUNGLE_BADGES.find((b: JungleBadge) => b.id === badgeId);
    if (!badge) return;

    setProgress(prev => {
      if (prev.earnedBadges.includes(badgeId)) return prev;
      const updated = {
        ...prev,
        earnedBadges: [...prev.earnedBadges, badgeId],
        xp: prev.xp + badge.xpReward,
      };
      saveProgress(updated);
      return updated;
    });

    setPendingBadge(badge);
  }, [saveProgress]);

  const dismissBadge = useCallback(() => {
    setPendingBadge(null);
  }, []);

  // Streak
  const checkStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = progress.lastLoginDate;

    if (lastLogin === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const newStreak = lastLogin === yesterdayStr
      ? progress.streakDays + 1
      : 1;

    const xpGained = XP_VALUES.daily_login + (XP_VALUES.streak_bonus * Math.min(newStreak, 30));

    setProgress(prev => {
      const updated = {
        ...prev,
        streakDays: newStreak,
        lastLoginDate: today,
        totalLoginDays: prev.totalLoginDays + 1,
        xp: prev.xp + xpGained,
      };
      saveProgress(updated);
      return updated;
    });
  }, [progress.lastLoginDate, progress.streakDays, saveProgress]);

  // Check streak on mount
  useEffect(() => {
    checkStreak();
  }, []);

  // Reset
  const resetProgress = useCallback(async () => {
    const defaultProg = getDefaultProgress();
    setProgress(defaultProg);
    await AsyncStorage.removeItem(STORAGE_KEY);
    if (user && useSupabase) {
      supabase.from('jungle_progress').delete().eq('user_id', user.id);
    }
  }, [user, useSupabase]);

  const value: JungleContextType = {
    progress,
    level: levelData.level,
    levelName: levelData.name,
    levelIcon: levelData.icon,
    xpProgress,
    addXP,
    completeLesson,
    completeStrategy,
    recordQuizScore,
    riskProfile: progress.riskProfile,
    setRiskProfile,
    assessmentCompleted: progress.assessmentCompleted,
    earnedBadges: progress.earnedBadges,
    pendingBadge,
    awardBadge,
    dismissBadge,
    streakDays: progress.streakDays,
    checkStreak,
    isLoading,
    error: syncError,
    resetProgress,
  };

  return (
    <JungleContext.Provider value={value}>
      {children}
    </JungleContext.Provider>
  );
};

export const useJungle = (): JungleContextType => {
  const context = useContext(JungleContext);
  if (context === undefined) {
    throw new Error('useJungle must be used within a JungleProvider');
  }
  return context;
};

export default JungleContext;
