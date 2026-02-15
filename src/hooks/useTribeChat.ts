// useTribeChat hook for Wall Street Wildlife Mobile
// Real-time tribe chat with Supabase Realtime + AsyncStorage fallback
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const TRIBE_CHAT_KEY = 'wsw-tribe-chat';

export interface TribeChatMessage {
  id: string;
  tribe_id: string;
  user_id: string;
  display_name: string;
  message_text: string;
  created_at: string;
  isOwn?: boolean;
}

// Mock messages for when Supabase is not configured
const getMockMessages = (tribeId: string): TribeChatMessage[] => [
  {
    id: 'mock-1',
    tribe_id: tribeId,
    user_id: 'system',
    display_name: 'JungleBot',
    message_text: 'Welcome to the tribe chat! Connect with fellow traders here.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    isOwn: false,
  },
  {
    id: 'mock-2',
    tribe_id: tribeId,
    user_id: 'mock-user-1',
    display_name: 'TraderAlex',
    message_text: 'Great session today! Learned a lot about covered calls.',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    isOwn: false,
  },
  {
    id: 'mock-3',
    tribe_id: tribeId,
    user_id: 'mock-user-2',
    display_name: 'OptionsPro',
    message_text: 'Anyone tried the iron condor strategy yet? The quiz was tough!',
    created_at: new Date(Date.now() - 900000).toISOString(),
    isOwn: false,
  },
];

export function useTribeChat(tribeId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TribeChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const useSupabase = isSupabaseConfigured();

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!tribeId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // If Supabase is not configured, use mock messages
    if (!useSupabase) {
      try {
        const cached = await AsyncStorage.getItem(TRIBE_CHAT_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as Array<{ user: string; text: string; time: string; tribeId?: string }>;
          const filtered = parsed.filter(msg => !msg.tribeId || msg.tribeId === tribeId);
          if (filtered.length > 0) {
            setMessages(filtered.map((msg, i) => ({
              id: `local-${i}`,
              tribe_id: tribeId,
              user_id: msg.user === 'You' ? (user?.id || 'local') : `mock-${i}`,
              display_name: msg.user,
              message_text: msg.text,
              created_at: new Date().toISOString(),
              isOwn: msg.user === 'You',
            })));
          } else {
            setMessages(getMockMessages(tribeId));
          }
        } else {
          setMessages(getMockMessages(tribeId));
        }
      } catch {
        setMessages(getMockMessages(tribeId));
      }
      setLoading(false);
      return;
    }

    // Supabase is configured - load from database
    try {
      const { data, error } = await supabase
        .from('tribe_messages')
        .select('*')
        .eq('tribe_id', tribeId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      setMessages((data || []).map(msg => ({
        ...msg,
        isOwn: msg.user_id === user?.id,
      })));
    } catch (error) {
      console.error('Error loading tribe messages:', error);
      // Fall back to AsyncStorage
      try {
        const cached = await AsyncStorage.getItem(TRIBE_CHAT_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as Array<{ user: string; text: string; time: string }>;
          setMessages(parsed.map((msg, i) => ({
            id: `local-${i}`,
            tribe_id: tribeId,
            user_id: user?.id || '',
            display_name: msg.user === 'You' ? 'You' : msg.user,
            message_text: msg.text,
            created_at: new Date().toISOString(),
            isOwn: msg.user === 'You',
          })));
        } else {
          setMessages(getMockMessages(tribeId));
        }
      } catch {
        setMessages(getMockMessages(tribeId));
      }
    } finally {
      setLoading(false);
    }
  }, [tribeId, user?.id, useSupabase]);

  // Subscribe to Realtime updates
  useEffect(() => {
    if (!tribeId) return;

    loadMessages();

    // Only set up Realtime subscription if Supabase is configured
    if (useSupabase) {
      const channel = supabase
        .channel(`tribe-chat-${tribeId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'tribe_messages',
            filter: `tribe_id=eq.${tribeId}`,
          },
          (payload) => {
            const newMsg = payload.new as TribeChatMessage;
            setMessages(prev => {
              // Avoid duplicates
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, { ...newMsg, isOwn: newMsg.user_id === user?.id }];
            });
          }
        )
        .subscribe();

      subscriptionRef.current = channel;
    }

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [tribeId, loadMessages, user?.id, useSupabase]);

  // Send a message
  const sendMessage = useCallback(async (text: string, displayName?: string) => {
    if (!tribeId || !text.trim()) return;

    const name = displayName || user?.displayName || 'Student';
    const userId = user?.id || `local-${Date.now()}`;

    // Optimistic insert
    const optimisticMsg: TribeChatMessage = {
      id: `temp-${Date.now()}`,
      tribe_id: tribeId,
      user_id: userId,
      display_name: name,
      message_text: text.trim(),
      created_at: new Date().toISOString(),
      isOwn: true,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    // If Supabase is not configured, persist to AsyncStorage
    if (!useSupabase) {
      try {
        const cached = await AsyncStorage.getItem(TRIBE_CHAT_KEY);
        const existing = cached ? JSON.parse(cached) : [];
        existing.push({
          user: 'You',
          text: text.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tribeId,
        });
        await AsyncStorage.setItem(TRIBE_CHAT_KEY, JSON.stringify(existing));
      } catch (e) {
        console.error('Failed to cache chat message:', e);
      }
      return;
    }

    // Supabase is configured - insert into database
    try {
      const { error } = await supabase
        .from('tribe_messages')
        .insert({
          tribe_id: tribeId,
          user_id: userId,
          display_name: name,
          message_text: text.trim(),
        });

      if (error) throw error;

      // The Realtime subscription will add the real message;
      // remove the optimistic one after a short delay
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      }, 2000);
    } catch (error) {
      console.error('Error sending tribe message:', error);
      // Revert optimistic insert
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));

      // Fall back to AsyncStorage
      try {
        const cached = await AsyncStorage.getItem(TRIBE_CHAT_KEY);
        const existing = cached ? JSON.parse(cached) : [];
        existing.push({
          user: 'You',
          text: text.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tribeId,
        });
        await AsyncStorage.setItem(TRIBE_CHAT_KEY, JSON.stringify(existing));
      } catch (e) {
        console.error('Failed to cache chat message:', e);
      }

      // Re-add as local message
      setMessages(prev => [...prev, optimisticMsg]);
    }
  }, [tribeId, user, useSupabase]);

  return {
    messages,
    loading,
    sendMessage,
    refresh: loadMessages,
  };
}
