// useTradeJournal hook for Wall Street Wildlife Mobile
// Full trade journal with AsyncStorage persistence + Supabase cloud sync
// Ported from desktop hook with mobile-compatible storage patterns

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ── Types ───────────────────────────────────────────────────────────────

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';

export interface Trade {
  id: string;
  date: string;
  ticker: string;
  strategy: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  pnl: number | null;
  pnlPercent: number | null;
  status: 'open' | 'closed' | 'expired';
  ivAtEntry: number | null;
  deltaAtEntry: number | null;
  daysHeld: number | null;
  notes: string;
  tags: string[];
  purpose: string | null;
  timeHorizon: string | null;
}

interface SupabaseTrade {
  client_id: string;
  date: string;
  ticker: string;
  strategy: string;
  direction: 'long' | 'short';
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  pnl: number | null;
  pnl_percent: number | null;
  status: 'open' | 'closed' | 'expired';
  iv_at_entry: number | null;
  delta_at_entry: number | null;
  days_held: number | null;
  notes: string;
  tags: string[];
  purpose: string | null;
  time_horizon: string | null;
}

// ── Constants ───────────────────────────────────────────────────────────

const TRADES_KEY = 'wsw_trade_journal';

// ── Supabase row mappers ────────────────────────────────────────────────

function toSupabaseRow(trade: Trade, userId: string): SupabaseTrade & { user_id: string } {
  return {
    user_id: userId,
    client_id: trade.id,
    date: trade.date,
    ticker: trade.ticker,
    strategy: trade.strategy,
    direction: trade.direction,
    entry_price: trade.entryPrice,
    exit_price: trade.exitPrice,
    quantity: trade.quantity,
    pnl: trade.pnl,
    pnl_percent: trade.pnlPercent,
    status: trade.status,
    iv_at_entry: trade.ivAtEntry,
    delta_at_entry: trade.deltaAtEntry,
    days_held: trade.daysHeld,
    notes: trade.notes,
    tags: trade.tags,
    purpose: trade.purpose,
    time_horizon: trade.timeHorizon,
  };
}

function fromSupabaseRow(row: SupabaseTrade): Trade {
  return {
    id: row.client_id,
    date: row.date,
    ticker: row.ticker,
    strategy: row.strategy,
    direction: row.direction,
    entryPrice: Number(row.entry_price),
    exitPrice: row.exit_price != null ? Number(row.exit_price) : null,
    quantity: row.quantity,
    pnl: row.pnl != null ? Number(row.pnl) : null,
    pnlPercent: row.pnl_percent != null ? Number(row.pnl_percent) : null,
    status: row.status,
    ivAtEntry: row.iv_at_entry != null ? Number(row.iv_at_entry) : null,
    deltaAtEntry: row.delta_at_entry != null ? Number(row.delta_at_entry) : null,
    daysHeld: row.days_held,
    notes: row.notes || '',
    tags: row.tags || [],
    purpose: row.purpose || null,
    timeHorizon: row.time_horizon || null,
  };
}

// ── AsyncStorage helpers ────────────────────────────────────────────────

async function saveToStorage(trades: Trade[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  } catch (e) {
    console.error('Failed to save trades to AsyncStorage:', e);
  }
}

async function loadFromStorage(): Promise<Trade[]> {
  try {
    const stored = await AsyncStorage.getItem(TRADES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load trades from AsyncStorage:', e);
  }
  return [];
}

// ── Hook ────────────────────────────────────────────────────────────────

export function useTradeJournal() {
  const { user } = useAuth();
  const useSupabase = isSupabaseConfigured();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialLoadDone = useRef(false);
  const syncSuccessTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSyncError = useCallback(() => {
    setSyncError(null);
    setSyncStatus('idle');
  }, []);

  // Retry helper: try once, on failure retry once more
  const withRetry = useCallback(async <T>(fn: () => Promise<T>, label: string): Promise<T> => {
    try {
      return await fn();
    } catch (firstError) {
      console.warn(`${label} failed, retrying once...`, firstError);
      return await fn();
    }
  }, []);

  const setSyncSuccess = useCallback(() => {
    setSyncStatus('success');
    setSyncError(null);
    if (syncSuccessTimer.current) clearTimeout(syncSuccessTimer.current);
    syncSuccessTimer.current = setTimeout(() => setSyncStatus('idle'), 3000);
  }, []);

  // Load trades - from Supabase if logged in, AsyncStorage otherwise
  useEffect(() => {
    const loadTrades = async () => {
      // Always load AsyncStorage first for instant display
      const localTrades = await loadFromStorage();
      setTrades(localTrades);

      if (user && useSupabase) {
        setSyncStatus('syncing');
        try {
          const { data, error } = await supabase
            .from('trade_journal')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.error('Failed to load trades from Supabase:', error);
            setSyncStatus('error');
            setSyncError('Cloud sync unavailable -- your trades are saved locally');
            setIsLoaded(true);
            // Auto-dismiss after 5 seconds since data is safe in AsyncStorage
            setTimeout(() => { setSyncError(null); setSyncStatus('idle'); }, 5000);
            return;
          }

          const cloudTrades = (data || []).map(fromSupabaseRow);

          if (cloudTrades.length === 0 && localTrades.length > 0) {
            // First login merge: upload local trades to Supabase
            const rows = localTrades.map(t => toSupabaseRow(t, user.id));
            const { error: upsertError } = await supabase
              .from('trade_journal')
              .upsert(rows, { onConflict: 'user_id,client_id' });

            if (upsertError) {
              console.error('Failed to migrate trades to Supabase:', upsertError);
            }
            // Local trades are already in state, keep them
          } else if (cloudTrades.length > 0) {
            // Cloud wins: Supabase data becomes source of truth
            setTrades(cloudTrades);
            await saveToStorage(cloudTrades);
          }
          setSyncStatus('idle');
        } catch (e) {
          console.error('Failed to sync trades with Supabase:', e);
          setSyncStatus('error');
          setSyncError('Cloud sync unavailable -- your trades are saved locally');
          setTimeout(() => { setSyncError(null); setSyncStatus('idle'); }, 5000);
          // Keep AsyncStorage data as fallback
        }
      }

      setIsLoaded(true);
      initialLoadDone.current = true;
    };

    loadTrades();
  }, [user, useSupabase]);

  const addTrade = useCallback((trade: Trade) => {
    setTrades(prev => {
      const updated = [...prev, trade];
      saveToStorage(updated);
      return updated;
    });

    if (user && useSupabase) {
      setSyncStatus('syncing');
      withRetry(
        async () => {
          const { error } = await supabase
            .from('trade_journal')
            .upsert(toSupabaseRow(trade, user.id), { onConflict: 'user_id,client_id' });
          if (error) throw error;
        },
        'addTrade'
      )
        .then(() => setSyncSuccess())
        .catch((err) => {
          console.error('Failed to sync trade add:', err);
          setSyncStatus('error');
          setSyncError('Saved locally -- cloud sync unavailable');
          setTimeout(() => { setSyncError(null); setSyncStatus('idle'); }, 5000);
        });
    }
  }, [user, useSupabase, withRetry, setSyncSuccess]);

  const updateTrade = useCallback((trade: Trade) => {
    setTrades(prev => {
      const updated = prev.map(t => t.id === trade.id ? trade : t);
      saveToStorage(updated);
      return updated;
    });

    if (user && useSupabase) {
      setSyncStatus('syncing');
      withRetry(
        async () => {
          const { error } = await supabase
            .from('trade_journal')
            .upsert(toSupabaseRow(trade, user.id), { onConflict: 'user_id,client_id' });
          if (error) throw error;
        },
        'updateTrade'
      )
        .then(() => setSyncSuccess())
        .catch((err) => {
          console.error('Failed to sync trade update:', err);
          setSyncStatus('error');
          setSyncError('Updated locally -- cloud sync unavailable');
          setTimeout(() => { setSyncError(null); setSyncStatus('idle'); }, 5000);
        });
    }
  }, [user, useSupabase, withRetry, setSyncSuccess]);

  const deleteTrade = useCallback((id: string) => {
    setTrades(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveToStorage(updated);
      return updated;
    });

    if (user && useSupabase) {
      setSyncStatus('syncing');
      withRetry(
        async () => {
          const { error } = await supabase
            .from('trade_journal')
            .delete()
            .eq('user_id', user.id)
            .eq('client_id', id);
          if (error) throw error;
        },
        'deleteTrade'
      )
        .then(() => setSyncSuccess())
        .catch((err) => {
          console.error('Failed to sync trade delete:', err);
          setSyncStatus('error');
          setSyncError('Deleted locally -- cloud sync unavailable');
          setTimeout(() => { setSyncError(null); setSyncStatus('idle'); }, 5000);
        });
    }
  }, [user, useSupabase, withRetry, setSyncSuccess]);

  return {
    trades,
    addTrade,
    updateTrade,
    deleteTrade,
    syncing: syncStatus === 'syncing', // backwards compat
    syncStatus,
    syncError,
    clearSyncError,
    isLoaded,
  };
}
