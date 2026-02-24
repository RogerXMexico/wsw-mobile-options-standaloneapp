// useMissions hook for Wall Street Wildlife Mobile
// Manages daily/weekly mission progress with AsyncStorage + Supabase sync
// Ported from desktop hook -- browser Notification API removed (handled by useNotifications)

import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ── Types ───────────────────────────────────────────────────────────────

export type MissionType =
  | 'complete_quiz'
  | 'log_trade'
  | 'study_strategy'
  | 'complete_lesson'
  | 'share_trade'
  | 'like_trade'
  | 'comment_trade'
  | 'follow_trader'
  | 'login'
  | 'streak_maintain'
  | 'earn_xp';

export type MissionDifficulty = 'easy' | 'medium' | 'hard';
export type MissionPeriod = 'daily' | 'weekly';

export interface MissionRequirement {
  type: 'count' | 'specific' | 'streak' | 'any';
  target?: number;
  entityType?: string;
  targetId?: string;
  days?: number;
}

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  xpReward: number;
  period: MissionPeriod;
  difficulty: MissionDifficulty;
  requirement: MissionRequirement;
  icon: string;
}

export interface MissionProgress {
  missionId: string;
  currentProgress: number;
  targetProgress: number;
  completedAt: string | null;
  claimedAt: string | null;
}

export interface DailyMissionsState {
  dailyMissions: MissionProgress[];
  weeklyMissions: MissionProgress[];
  lastDailyReset: string;
  lastWeeklyReset: string;
  missionStreak: number;
  totalMissionsCompleted: number;
}

// ── Constants ───────────────────────────────────────────────────────────

const MISSIONS_KEY = 'wsw-missions';

// ── Mission Definitions ─────────────────────────────────────────────────

export const DAILY_MISSIONS: Mission[] = [
  {
    id: 'daily-login',
    type: 'login',
    title: 'Welcome Back',
    description: 'Log in to the jungle',
    xpReward: 25,
    period: 'daily',
    difficulty: 'easy',
    requirement: { type: 'any' },
    icon: 'sunny-outline',
  },
  {
    id: 'daily-quiz',
    type: 'complete_quiz',
    title: 'Quiz Champion',
    description: 'Complete any quiz',
    xpReward: 75,
    period: 'daily',
    difficulty: 'medium',
    requirement: { type: 'count', target: 1 },
    icon: 'create-outline',
  },
  {
    id: 'daily-study',
    type: 'study_strategy',
    title: 'Strategy Scholar',
    description: 'Study a strategy module',
    xpReward: 50,
    period: 'daily',
    difficulty: 'easy',
    requirement: { type: 'count', target: 1 },
    icon: 'book-outline',
  },
  {
    id: 'daily-trade',
    type: 'log_trade',
    title: 'Trade Logger',
    description: 'Log a trade in your journal',
    xpReward: 75,
    period: 'daily',
    difficulty: 'medium',
    requirement: { type: 'count', target: 1 },
    icon: 'bar-chart-outline',
  },
  {
    id: 'daily-xp',
    type: 'earn_xp',
    title: 'XP Hunter',
    description: 'Earn 100 XP today',
    xpReward: 50,
    period: 'daily',
    difficulty: 'medium',
    requirement: { type: 'count', target: 100 },
    icon: 'flash-outline',
  },
  {
    id: 'daily-like',
    type: 'like_trade',
    title: 'Show Some Love',
    description: 'Like a trade in the feed',
    xpReward: 30,
    period: 'daily',
    difficulty: 'easy',
    requirement: { type: 'count', target: 1 },
    icon: 'heart-outline',
  },
  {
    id: 'daily-comment',
    type: 'comment_trade',
    title: 'Join the Conversation',
    description: 'Comment on a trade',
    xpReward: 50,
    period: 'daily',
    difficulty: 'medium',
    requirement: { type: 'count', target: 1 },
    icon: 'chatbubble-outline',
  },
  {
    id: 'daily-follow',
    type: 'follow_trader',
    title: 'Expand Your Network',
    description: 'Follow a trader',
    xpReward: 30,
    period: 'daily',
    difficulty: 'easy',
    requirement: { type: 'count', target: 1 },
    icon: 'people-outline',
  },
];

export const WEEKLY_MISSIONS: Mission[] = [
  {
    id: 'weekly-quizzes',
    type: 'complete_quiz',
    title: 'Quiz Master',
    description: 'Complete 5 quizzes this week',
    xpReward: 200,
    period: 'weekly',
    difficulty: 'medium',
    requirement: { type: 'count', target: 5 },
    icon: 'locate-outline',
  },
  {
    id: 'weekly-trades',
    type: 'log_trade',
    title: 'Active Trader',
    description: 'Log 3 trades this week',
    xpReward: 150,
    period: 'weekly',
    difficulty: 'medium',
    requirement: { type: 'count', target: 3 },
    icon: 'trending-up',
  },
  {
    id: 'weekly-strategies',
    type: 'study_strategy',
    title: 'Deep Diver',
    description: 'Study 5 different strategies',
    xpReward: 175,
    period: 'weekly',
    difficulty: 'medium',
    requirement: { type: 'count', target: 5 },
    icon: 'flask-outline',
  },
  {
    id: 'weekly-streak',
    type: 'streak_maintain',
    title: 'Consistency King',
    description: 'Log in 5 days this week',
    xpReward: 250,
    period: 'weekly',
    difficulty: 'hard',
    requirement: { type: 'streak', days: 5 },
    icon: 'flame-outline',
  },
  {
    id: 'weekly-share',
    type: 'share_trade',
    title: 'Community Contributor',
    description: 'Share a trade with the community',
    xpReward: 100,
    period: 'weekly',
    difficulty: 'easy',
    requirement: { type: 'count', target: 1 },
    icon: 'megaphone-outline',
  },
  {
    id: 'weekly-xp',
    type: 'earn_xp',
    title: 'XP Legend',
    description: 'Earn 500 XP this week',
    xpReward: 300,
    period: 'weekly',
    difficulty: 'hard',
    requirement: { type: 'count', target: 500 },
    icon: 'trophy-outline',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────

export const getMissionById = (id: string): Mission | undefined => {
  return [...DAILY_MISSIONS, ...WEEKLY_MISSIONS].find(m => m.id === id);
};

export const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getDefaultMissionsState = (): DailyMissionsState => {
  const today = new Date().toISOString().split('T')[0];
  const monday = getMonday(new Date()).toISOString().split('T')[0];

  return {
    dailyMissions: DAILY_MISSIONS.map(m => ({
      missionId: m.id,
      currentProgress: 0,
      targetProgress: m.requirement.target || 1,
      completedAt: null,
      claimedAt: null,
    })),
    weeklyMissions: WEEKLY_MISSIONS.map(m => ({
      missionId: m.id,
      currentProgress: 0,
      targetProgress: m.requirement.target || m.requirement.days || 1,
      completedAt: null,
      claimedAt: null,
    })),
    lastDailyReset: today,
    lastWeeklyReset: monday,
    missionStreak: 0,
    totalMissionsCompleted: 0,
  };
};

// ── Hook ────────────────────────────────────────────────────────────────

export const useMissions = () => {
  const { user } = useAuth();
  const useSupabase = isSupabaseConfigured();

  /**
   * Ensure mission state exists and is not stale (reset daily/weekly as needed).
   * All storage operations are async for AsyncStorage compatibility.
   */
  const ensureMissionState = useCallback(async (): Promise<DailyMissionsState> => {
    let saved: string | null = null;
    try {
      saved = await AsyncStorage.getItem(MISSIONS_KEY);
    } catch { /* ignore */ }

    if (!saved) {
      const defaultState = getDefaultMissionsState();
      await AsyncStorage.setItem(MISSIONS_KEY, JSON.stringify(defaultState));
      return defaultState;
    }

    try {
      const state = JSON.parse(saved) as DailyMissionsState;
      const today = new Date().toISOString().split('T')[0];
      const monday = getMonday(new Date()).toISOString().split('T')[0];
      let needsSave = false;

      // Reset daily missions if it's a new day
      if (state.lastDailyReset !== today) {
        state.dailyMissions = DAILY_MISSIONS.map(m => ({
          missionId: m.id,
          currentProgress: 0,
          targetProgress: m.requirement.target || 1,
          completedAt: null,
          claimedAt: null,
        }));
        state.lastDailyReset = today;
        needsSave = true;
      }

      // Reset weekly missions if it's a new week
      if (state.lastWeeklyReset !== monday) {
        state.weeklyMissions = WEEKLY_MISSIONS.map(m => ({
          missionId: m.id,
          currentProgress: 0,
          targetProgress: m.requirement.target || m.requirement.days || 1,
          completedAt: null,
          claimedAt: null,
        }));
        state.lastWeeklyReset = monday;
        needsSave = true;
      }

      if (needsSave) {
        await AsyncStorage.setItem(MISSIONS_KEY, JSON.stringify(state));
      }

      return state;
    } catch {
      const defaultState = getDefaultMissionsState();
      await AsyncStorage.setItem(MISSIONS_KEY, JSON.stringify(defaultState));
      return defaultState;
    }
  }, []);

  // Check and reset missions on mount; load from Supabase if authenticated
  useEffect(() => {
    const initMissions = async () => {
      await ensureMissionState();

      if (!user || !useSupabase) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('user_missions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', today);

        if (error || !data || data.length === 0) return;

        // Merge cloud mission progress into local state
        const state = await ensureMissionState();
        let updated = false;

        for (const row of data) {
          const isDaily = row.mission_type === 'daily';
          const missionsKey = isDaily ? 'dailyMissions' : 'weeklyMissions';

          state[missionsKey] = state[missionsKey].map((m: MissionProgress) => {
            if (m.missionId === row.mission_id && row.current_progress > m.currentProgress) {
              updated = true;
              return {
                ...m,
                currentProgress: row.current_progress,
                completedAt: row.completed_at || m.completedAt,
                claimedAt: row.claimed_at || m.claimedAt,
              };
            }
            return m;
          });
        }

        if (updated) {
          await AsyncStorage.setItem(MISSIONS_KEY, JSON.stringify(state));
        }
      } catch (e) {
        console.error('Failed to load missions from Supabase:', e);
      }
    };

    initMissions();
  }, [ensureMissionState, user, useSupabase]);

  /**
   * Update progress for a specific mission
   * @param missionId - The ID of the mission to update
   * @param incrementBy - How much to increment progress (default: 1)
   */
  const updateMissionProgress = useCallback(async (missionId: string, incrementBy: number = 1) => {
    const state = await ensureMissionState();

    try {
      const allMissions = DAILY_MISSIONS.concat(WEEKLY_MISSIONS);
      const missionDef = allMissions.find(m => m.id === missionId);

      if (!missionDef) {
        console.warn(`Mission ${missionId} not found`);
        return;
      }

      const isDaily = DAILY_MISSIONS.some(m => m.id === missionId);
      const missionsKey = isDaily ? 'dailyMissions' : 'weeklyMissions';

      state[missionsKey] = state[missionsKey].map((m: MissionProgress) => {
        if (m.missionId === missionId) {
          const newProgress = Math.min(m.currentProgress + incrementBy, m.targetProgress);
          const isNowComplete = newProgress >= m.targetProgress;

          return {
            ...m,
            currentProgress: newProgress,
            completedAt: isNowComplete && !m.completedAt ? new Date().toISOString() : m.completedAt,
          };
        }
        return m;
      });

      await AsyncStorage.setItem(MISSIONS_KEY, JSON.stringify(state));

      // Also update Supabase if logged in
      if (user && useSupabase) {
        const mission = state[missionsKey].find((m: MissionProgress) => m.missionId === missionId);
        if (mission) {
          await supabase
            .from('user_missions')
            .upsert({
              user_id: user.id,
              mission_id: missionId,
              mission_type: isDaily ? 'daily' : 'weekly',
              current_progress: mission.currentProgress,
              target_progress: mission.targetProgress,
              completed_at: mission.completedAt,
              claimed_at: mission.claimedAt,
            }, {
              onConflict: 'user_id,mission_id,created_at',
            });
        }
      }
    } catch (e) {
      console.error('Failed to update mission progress:', e);
    }
  }, [user, useSupabase, ensureMissionState]);

  /**
   * Claim XP reward for a completed mission
   * Returns the XP amount if claimed, or 0 if not eligible
   */
  const claimMissionReward = useCallback(async (missionId: string): Promise<number> => {
    const state = await ensureMissionState();
    const isDaily = DAILY_MISSIONS.some(m => m.id === missionId);
    const missionsKey = isDaily ? 'dailyMissions' : 'weeklyMissions';

    const missionProgress = state[missionsKey].find((m: MissionProgress) => m.missionId === missionId);
    if (!missionProgress || !missionProgress.completedAt || missionProgress.claimedAt) {
      return 0; // Not eligible for claim
    }

    const missionDef = getMissionById(missionId);
    if (!missionDef) return 0;

    // Mark as claimed
    state[missionsKey] = state[missionsKey].map((m: MissionProgress) => {
      if (m.missionId === missionId) {
        return { ...m, claimedAt: new Date().toISOString() };
      }
      return m;
    });
    state.totalMissionsCompleted = (state.totalMissionsCompleted || 0) + 1;

    await AsyncStorage.setItem(MISSIONS_KEY, JSON.stringify(state));

    return missionDef.xpReward;
  }, [ensureMissionState]);

  /**
   * Mark a quiz as completed for mission tracking
   * Updates the daily-quiz and weekly-quizzes missions
   */
  const recordQuizCompleted = useCallback(async () => {
    await updateMissionProgress('daily-quiz', 1);
    await updateMissionProgress('weekly-quizzes', 1);
  }, [updateMissionProgress]);

  /**
   * Mark a strategy as studied for mission tracking
   * Updates the daily-study and weekly-strategies missions
   */
  const recordStrategyStudied = useCallback(async () => {
    await updateMissionProgress('daily-study', 1);
    await updateMissionProgress('weekly-strategies', 1);
  }, [updateMissionProgress]);

  /**
   * Record a trade logged in the journal
   * Updates the daily-trade and weekly-trades missions
   */
  const recordTradeLogged = useCallback(async () => {
    await updateMissionProgress('daily-trade', 1);
    await updateMissionProgress('weekly-trades', 1);
  }, [updateMissionProgress]);

  /**
   * Record a trade shared to the social feed
   * Updates the weekly-share mission
   */
  const recordTradeShared = useCallback(async () => {
    await updateMissionProgress('weekly-share', 1);
  }, [updateMissionProgress]);

  /**
   * Record daily login
   * Updates the daily-login and weekly-streak missions
   */
  const recordDailyLogin = useCallback(async () => {
    await updateMissionProgress('daily-login', 1);
    await updateMissionProgress('weekly-streak', 1);
  }, [updateMissionProgress]);

  /**
   * Record XP earned (for XP-based missions)
   * Updates the daily-xp and weekly-xp missions
   */
  const recordXPEarned = useCallback(async (amount: number) => {
    await updateMissionProgress('daily-xp', amount);
    await updateMissionProgress('weekly-xp', amount);
  }, [updateMissionProgress]);

  /**
   * Record a trade liked in the social feed
   * Updates the daily-like mission
   */
  const recordTradeLiked = useCallback(async () => {
    await updateMissionProgress('daily-like', 1);
  }, [updateMissionProgress]);

  /**
   * Record a comment posted on a trade
   * Updates the daily-comment mission
   */
  const recordTradeCommented = useCallback(async () => {
    await updateMissionProgress('daily-comment', 1);
  }, [updateMissionProgress]);

  /**
   * Record following a trader
   * Updates the daily-follow mission
   */
  const recordTraderFollowed = useCallback(async () => {
    await updateMissionProgress('daily-follow', 1);
  }, [updateMissionProgress]);

  return {
    updateMissionProgress,
    claimMissionReward,
    recordQuizCompleted,
    recordStrategyStudied,
    recordTradeLogged,
    recordTradeShared,
    recordDailyLogin,
    recordXPEarned,
    recordTradeLiked,
    recordTradeCommented,
    recordTraderFollowed,
    ensureMissionState,
  };
};
