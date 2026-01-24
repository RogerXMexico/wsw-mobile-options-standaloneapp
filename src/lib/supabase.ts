// Supabase Client Configuration
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Environment variables - Replace with your Supabase project credentials
// In production, use expo-constants or react-native-config
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return (
    SUPABASE_URL !== 'https://your-project.supabase.co' &&
    SUPABASE_ANON_KEY !== 'your-anon-key'
  );
};

// Database types (extend as needed)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_animal: string;
          subscription_tier: 'free' | 'premium' | 'pro';
          tribe_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_animal?: string;
          subscription_tier?: 'free' | 'premium' | 'pro';
          tribe_id?: string | null;
        };
        Update: {
          display_name?: string | null;
          avatar_animal?: string;
          subscription_tier?: 'free' | 'premium' | 'pro';
          tribe_id?: string | null;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          xp: number;
          level: number;
          streak: number;
          last_active_date: string | null;
          completed_lessons: string[];
          completed_quizzes: string[];
          earned_badges: string[];
          completed_strategies: string[];
          updated_at: string;
        };
        Insert: {
          user_id: string;
          xp?: number;
          level?: number;
          streak?: number;
        };
        Update: {
          xp?: number;
          level?: number;
          streak?: number;
          last_active_date?: string | null;
          completed_lessons?: string[];
          completed_quizzes?: string[];
          earned_badges?: string[];
          completed_strategies?: string[];
        };
      };
    };
  };
}
