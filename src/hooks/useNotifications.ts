// useNotifications hook for Wall Street Wildlife Mobile
// Manages in-app notifications from Supabase + expo-notifications for push
// Ported from desktop hook -- browser Notification API replaced with expo-notifications

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  registerForPushNotifications,
  sendLocalNotification,
  configureNotificationChannels,
} from '../services/notifications';

// ── Types ───────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'new_trade';
  actor_display_name: string | null;
  actor_id: string;
  trade_id: string | null;
  trade_ticker: string | null;
  trade_strategy: string | null;
  is_read: boolean;
  created_at: string;
}

// ── Constants ───────────────────────────────────────────────────────────

const POLL_INTERVAL = 30_000; // 30 seconds
const PUSH_TOKEN_SYNCED_KEY = 'wsw-push-token-synced';

// ── Push notification helpers ───────────────────────────────────────────

function formatPushMessage(n: AppNotification): string {
  const actor = n.actor_display_name || 'Someone';
  switch (n.type) {
    case 'like':
      return `${actor} liked your ${n.trade_ticker || ''} trade`.trim();
    case 'comment':
      return `${actor} commented on your ${n.trade_ticker || ''} trade`.trim();
    case 'follow':
      return `${actor} started following you`;
    case 'new_trade':
      return `${actor} shared a new ${n.trade_ticker || ''} ${n.trade_strategy || 'trade'}`.trim();
    default:
      return `${actor} interacted with you`;
  }
}

function getNotificationTitle(type: AppNotification['type']): string {
  switch (type) {
    case 'like': return 'New Like';
    case 'comment': return 'New Comment';
    case 'follow': return 'New Follower';
    case 'new_trade': return 'New Trade Shared';
    default: return 'WSW Options';
  }
}

async function showLocalPushNotification(items: AppNotification[]): Promise<void> {
  // Only show push notifications when app is in background
  const appState = AppState.currentState;
  if (appState === 'active') return;

  for (const n of items.slice(0, 3)) {
    try {
      await sendLocalNotification(
        getNotificationTitle(n.type),
        formatPushMessage(n),
        { type: n.type, notificationId: n.id, tradeId: n.trade_id },
        'social',
      );
    } catch {
      // Silent fail -- expo-notifications may not be available
    }
  }
}

// ── Hook ────────────────────────────────────────────────────────────────

export function useNotifications() {
  const { user } = useAuth();
  const useSupabase = isSupabaseConfigured();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());

  // Register for push notifications and configure channels on mount
  useEffect(() => {
    const setupPush = async () => {
      await configureNotificationChannels();
      const token = await registerForPushNotifications();

      // Sync push token to Supabase if we have a user and haven't synced yet
      if (token && user && useSupabase) {
        try {
          const synced = await AsyncStorage.getItem(PUSH_TOKEN_SYNCED_KEY);
          if (synced !== token) {
            await supabase.from('user_push_tokens').upsert({
              user_id: user.id,
              push_token: token,
              platform: Platform.OS,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
            await AsyncStorage.setItem(PUSH_TOKEN_SYNCED_KEY, token);
          }
        } catch {
          // Silent -- push token sync is best-effort
        }
      }
    };

    setupPush();
  }, [user, useSupabase]);

  const loadNotifications = useCallback(async () => {
    if (!user || !useSupabase) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const items: AppNotification[] = (data || []).map(row => ({
        id: row.id,
        type: row.type,
        actor_display_name: row.actor_display_name,
        actor_id: row.actor_id,
        trade_id: row.trade_id,
        trade_ticker: row.trade_ticker,
        trade_strategy: row.trade_strategy,
        is_read: row.is_read,
        created_at: row.created_at,
      }));

      // Detect brand-new unread notifications for push
      const newUnread = items.filter(n => !n.is_read && !knownIdsRef.current.has(n.id));
      if (knownIdsRef.current.size > 0 && newUnread.length > 0) {
        showLocalPushNotification(newUnread);
      }

      // Update known IDs
      knownIdsRef.current = new Set(items.map(n => n.id));

      setNotifications(items);
      setUnreadCount(items.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user, useSupabase]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user || !useSupabase) return;

    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      loadNotifications(); // Revert on failure
    }
  }, [user, useSupabase, loadNotifications]);

  const markAllAsRead = useCallback(async () => {
    if (!user || !useSupabase) return;

    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking all as read:', error);
      loadNotifications(); // Revert on failure
    }
  }, [user, useSupabase, loadNotifications]);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Polling -- only when app is active
  useEffect(() => {
    if (!user || !useSupabase) return;

    const startPolling = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(loadNotifications, POLL_INTERVAL);
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Listen for app state changes to pause/resume polling
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        loadNotifications(); // Refresh immediately on foreground
        startPolling();
      } else {
        stopPolling();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Start polling if app is active
    if (AppState.currentState === 'active') {
      startPolling();
    }

    return () => {
      stopPolling();
      subscription.remove();
    };
  }, [user, useSupabase, loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications,
  };
}
