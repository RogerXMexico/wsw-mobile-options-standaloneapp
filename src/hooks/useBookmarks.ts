// useBookmarks hook for Wall Street Wildlife Mobile
// Manages strategy bookmarks with AsyncStorage + optional Supabase sync
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const BOOKMARKS_KEY = 'wsw-bookmarks';

export interface BookmarksState {
  bookmarks: string[];
  toggleBookmark: (strategyId: string) => void;
  isBookmarked: (strategyId: string) => boolean;
  syncing: boolean;
}

export function useBookmarksHook(): BookmarksState {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);
  const useSupabase = isSupabaseConfigured();

  // Load bookmarks - from Supabase if logged in + configured, AsyncStorage otherwise
  useEffect(() => {
    const loadBookmarks = async () => {
      if (user && useSupabase) {
        // Load from Supabase
        setSyncing(true);
        try {
          const { data } = await supabase
            .from('user_bookmarks')
            .select('strategy_id')
            .eq('user_id', user.id);

          const bookmarkedIds = data?.map((b: { strategy_id: string }) => b.strategy_id) || [];
          setBookmarks(bookmarkedIds);
          // Also sync to AsyncStorage for offline access
          await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedIds));
        } catch (e) {
          console.error('Failed to load bookmarks from Supabase:', e);
          // Fall back to AsyncStorage
          try {
            const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
            if (stored) {
              setBookmarks(JSON.parse(stored));
            }
          } catch (parseError) {
            console.error('Failed to parse AsyncStorage bookmarks:', parseError);
          }
        }
        setSyncing(false);
      } else {
        // Load from AsyncStorage (mock / offline mode)
        try {
          const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
          if (stored) {
            setBookmarks(JSON.parse(stored));
          }
        } catch (e) {
          console.error('Failed to load bookmarks:', e);
        }
      }
    };

    loadBookmarks();
  }, [user, useSupabase]);

  // Toggle bookmark status for a strategy
  const toggleBookmark = useCallback(async (strategyId: string) => {
    setBookmarks(prev => {
      const isCurrentlyBookmarked = prev.includes(strategyId);
      const newBookmarks = isCurrentlyBookmarked
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId];

      // Update AsyncStorage (fire and forget)
      AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks)).catch(e =>
        console.error('Failed to save bookmarks to AsyncStorage:', e)
      );

      // Sync to Supabase if logged in + configured (async, don't block)
      if (user && useSupabase) {
        if (isCurrentlyBookmarked) {
          supabase
            .from('user_bookmarks')
            .delete()
            .eq('user_id', user.id)
            .eq('strategy_id', strategyId)
            .then(({ error }) => {
              if (error) console.error('Failed to sync bookmark removal:', error);
            });
        } else {
          supabase
            .from('user_bookmarks')
            .insert({
              user_id: user.id,
              strategy_id: strategyId,
              created_at: new Date().toISOString(),
            })
            .then(({ error }) => {
              if (error) console.error('Failed to sync bookmark add:', error);
            });
        }
      }

      return newBookmarks;
    });
  }, [user, useSupabase]);

  // Check if a strategy is bookmarked
  const isBookmarked = useCallback((strategyId: string) => {
    return bookmarks.includes(strategyId);
  }, [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked, syncing };
}
