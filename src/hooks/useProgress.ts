// Progress hook for Wall Street Wildlife Mobile
// Syncs progress to Supabase when online, falls back to AsyncStorage offline
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts';

const STORAGE_KEY = 'wsw-course-progress';

export interface ProgressData {
  completedModules: string[];
  quizScores: Record<number, { score: number; total: number; passed: boolean }>;
  lastVisited: string | null;
  startedAt: string;
}

const getDefaultProgress = (): ProgressData => ({
  completedModules: [],
  quizScores: {},
  lastVisited: null,
  startedAt: new Date().toISOString(),
});

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>(getDefaultProgress);
  const [syncing, setSyncing] = useState(false);
  const useSupabase = isSupabaseConfigured();

  // Load progress on mount / user change
  useEffect(() => {
    const loadProgress = async () => {
      if (user && useSupabase) {
        setSyncing(true);
        try {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

          const { data: quizData } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('user_id', user.id);

          const completedModules = progressData
            ?.filter((p: { completed: boolean }) => p.completed)
            .map((p: { module_id: string }) => p.module_id) || [];

          const quizScores: Record<number, { score: number; total: number; passed: boolean }> = {};
          quizData?.forEach((q: { quiz_tier: number; score: number; total_questions: number }) => {
            const existing = quizScores[q.quiz_tier];
            if (!existing || q.score > existing.score) {
              quizScores[q.quiz_tier] = {
                score: q.score,
                total: q.total_questions,
                passed: q.score >= q.total_questions * 0.7,
              };
            }
          });

          const loaded: ProgressData = {
            completedModules,
            quizScores,
            lastVisited: null,
            startedAt: new Date().toISOString(),
          };

          setProgress(loaded);
          // Cache to AsyncStorage for offline access
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
        } catch (e) {
          console.error('Failed to load progress from Supabase:', e);
          // Fall back to AsyncStorage
          await loadFromStorage();
        }
        setSyncing(false);
      } else {
        await loadFromStorage();
      }
    };

    loadProgress();
  }, [user, useSupabase]);

  const loadFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load progress from AsyncStorage:', e);
    }
  };

  const saveToStorage = async (data: ProgressData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save progress to AsyncStorage:', e);
    }
  };

  const markCompleted = useCallback(async (moduleId: string) => {
    setProgress(prev => {
      if (prev.completedModules.includes(moduleId)) return prev;
      const newProgress = {
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
      };
      saveToStorage(newProgress);
      return newProgress;
    });

    if (user && useSupabase) {
      try {
        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            module_id: moduleId,
            completed: true,
            completed_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,module_id',
          });
      } catch (e) {
        console.error('Failed to sync completion to Supabase:', e);
      }
    }
  }, [user, useSupabase]);

  const markIncomplete = useCallback(async (moduleId: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        completedModules: prev.completedModules.filter(id => id !== moduleId),
      };
      saveToStorage(newProgress);
      return newProgress;
    });

    if (user && useSupabase) {
      try {
        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            module_id: moduleId,
            completed: false,
            completed_at: null,
          }, {
            onConflict: 'user_id,module_id',
          });
      } catch (e) {
        console.error('Failed to sync to Supabase:', e);
      }
    }
  }, [user, useSupabase]);

  const toggleCompleted = useCallback(async (moduleId: string) => {
    const isCompleted = progress.completedModules.includes(moduleId);
    if (isCompleted) {
      await markIncomplete(moduleId);
    } else {
      await markCompleted(moduleId);
    }
  }, [progress.completedModules, markCompleted, markIncomplete]);

  const recordQuizScore = useCallback(async (
    tier: number,
    score: number,
    total: number,
    questionResults?: Array<{
      question_id: string;
      selected_answer: number;
      correct_answer: number;
      is_correct: boolean;
    }>
  ) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [tier]: { score, total, passed: score >= total * 0.7 },
        },
      };
      saveToStorage(newProgress);
      return newProgress;
    });

    if (user && useSupabase) {
      try {
        await supabase
          .from('quiz_results')
          .insert({
            user_id: user.id,
            quiz_tier: tier,
            score,
            total_questions: total,
            completed_at: new Date().toISOString(),
          });

        if (questionResults && questionResults.length > 0) {
          const questionRecords = questionResults.map(qr => ({
            user_id: user.id,
            quiz_tier: tier,
            question_id: qr.question_id,
            selected_answer: qr.selected_answer,
            correct_answer: qr.correct_answer,
            is_correct: qr.is_correct,
            answered_at: new Date().toISOString(),
          }));

          await supabase
            .from('quiz_question_results')
            .insert(questionRecords);
        }
      } catch (e) {
        console.error('Failed to save quiz to Supabase:', e);
      }
    }
  }, [user, useSupabase]);

  const setLastVisited = useCallback((moduleId: string) => {
    setProgress(prev => {
      const newProgress = { ...prev, lastVisited: moduleId };
      saveToStorage(newProgress);
      return newProgress;
    });
  }, []);

  const resetProgress = useCallback(async () => {
    const newProgress = getDefaultProgress();
    await saveToStorage(newProgress);
    setProgress(newProgress);
  }, []);

  const stats = {
    completedCount: progress.completedModules.length,
    isModuleCompleted: (moduleId: string) => progress.completedModules.includes(moduleId),
    getQuizScore: (tier: number) => progress.quizScores[tier] || null,
  };

  return {
    progress,
    stats,
    syncing,
    markCompleted,
    markIncomplete,
    toggleCompleted,
    recordQuizScore,
    setLastVisited,
    resetProgress,
  };
}
