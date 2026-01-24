// Progress slice for Wall Street Wildlife Mobile
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProgress } from '../../data/types';

interface ProgressState extends UserProgress {
  dailyMissionsCompleted: number;
  todayQuizzesTaken: number;
}

const initialState: ProgressState = {
  completedStrategies: [],
  completedQuizzes: [],
  currentTier: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastActivityDate: new Date().toISOString(),
  badges: [],
  dailyMissionsCompleted: 0,
  todayQuizzesTaken: 0,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    completeStrategy: (state, action: PayloadAction<string>) => {
      if (!state.completedStrategies.includes(action.payload)) {
        state.completedStrategies.push(action.payload);
        state.xp += 25; // Strategy completion XP
      }
    },
    completeQuiz: (state, action: PayloadAction<{ quizId: string; passed: boolean; xpEarned: number }>) => {
      const { quizId, passed, xpEarned } = action.payload;
      if (passed && !state.completedQuizzes.includes(quizId)) {
        state.completedQuizzes.push(quizId);
      }
      state.xp += xpEarned;
      state.todayQuizzesTaken += 1;
    },
    addXP: (state, action: PayloadAction<number>) => {
      state.xp += action.payload;
    },
    updateStreak: (state, action: PayloadAction<number>) => {
      state.streak = action.payload;
    },
    incrementStreak: (state) => {
      state.streak += 1;
    },
    resetStreak: (state) => {
      state.streak = 0;
    },
    unlockBadge: (state, action: PayloadAction<string>) => {
      if (!state.badges.includes(action.payload)) {
        state.badges.push(action.payload);
      }
    },
    updateTier: (state, action: PayloadAction<number>) => {
      state.currentTier = action.payload;
    },
    updateLastActivity: (state) => {
      state.lastActivityDate = new Date().toISOString();
    },
    resetDailyProgress: (state) => {
      state.dailyMissionsCompleted = 0;
      state.todayQuizzesTaken = 0;
    },
    incrementDailyMission: (state) => {
      state.dailyMissionsCompleted += 1;
    },
    setProgress: (state, action: PayloadAction<Partial<ProgressState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  completeStrategy,
  completeQuiz,
  addXP,
  updateStreak,
  incrementStreak,
  resetStreak,
  unlockBadge,
  updateTier,
  updateLastActivity,
  resetDailyProgress,
  incrementDailyMission,
  setProgress,
} = progressSlice.actions;

export default progressSlice.reducer;
