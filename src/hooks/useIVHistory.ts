// Dual-source IV history hook -- AsyncStorage + Supabase
// Cloud is authoritative when available.
// Ported from desktop: localStorage -> AsyncStorage (all async),
// useAuth import -> AuthContext, sync tradierApi IV fns -> async

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  getSymbolIVHistory,
  recordIVReading,
  IVHistoryEntry,
} from '../services/tradierApi';

export interface IVHistoryPoint {
  date: string;
  iv: number;
  ivRank?: number;
  ivPercentile?: number;
  hv20?: number;
  price?: number;
}

export interface IVHistoryResult {
  history: IVHistoryPoint[];
  loading: boolean;
  trend: 'rising' | 'falling' | 'flat';
  trendSlope: number;
  record: (symbol: string, data: { iv: number; ivRank?: number; ivPercentile?: number; hv20?: number; price?: number }) => Promise<void>;
}

/**
 * Dual-source IV history hook -- AsyncStorage + Supabase.
 * Cloud is authoritative when available.
 */
export function useIVHistory(symbol: string): IVHistoryResult {
  const { user } = useAuth();
  const [history, setHistory] = useState<IVHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);

    // Always start with AsyncStorage (was localStorage on desktop)
    let localPoints: IVHistoryPoint[] = [];
    try {
      const localData = await getSymbolIVHistory(symbol.toUpperCase());
      localPoints = localData.map((e: IVHistoryEntry) => ({
        date: e.date,
        iv: e.iv,
        ivRank: e.ivRank,
        ivPercentile: e.ivPercentile,
        hv20: e.hv20,
        price: e.price,
      }));
    } catch {
      localPoints = [];
    }

    if (!user) {
      setHistory(localPoints);
      setLoading(false);
      return;
    }

    // Try cloud
    try {
      const { data, error } = await supabase
        .from('iv_history')
        .select('recorded_date, iv, iv_rank, iv_percentile, hv20, price')
        .eq('user_id', user.id)
        .eq('symbol', symbol.toUpperCase())
        .order('recorded_date', { ascending: true });

      if (!error && data && data.length > 0) {
        const cloudPoints: IVHistoryPoint[] = data.map((row: any) => ({
          date: row.recorded_date,
          iv: Number(row.iv),
          ivRank: row.iv_rank != null ? Number(row.iv_rank) : undefined,
          ivPercentile: row.iv_percentile != null ? Number(row.iv_percentile) : undefined,
          hv20: row.hv20 != null ? Number(row.hv20) : undefined,
          price: row.price != null ? Number(row.price) : undefined,
        }));
        setHistory(cloudPoints);
      } else {
        // Fallback to local, and push local to cloud if we have data
        setHistory(localPoints);
        if (localPoints.length > 0) {
          const rows = localPoints.map(p => ({
            user_id: user.id,
            symbol: symbol.toUpperCase(),
            iv: p.iv,
            iv_rank: p.ivRank ?? null,
            iv_percentile: p.ivPercentile ?? null,
            hv20: p.hv20 ?? null,
            price: p.price ?? null,
            recorded_date: p.date,
          }));
          supabase.from('iv_history').upsert(rows, { onConflict: 'user_id,symbol,recorded_date' }).then(() => {});
        }
      }
    } catch {
      setHistory(localPoints);
    }

    setLoading(false);
  }, [symbol, user]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Record a new IV data point -- writes to both AsyncStorage and Supabase.
   */
  const record = useCallback(async (sym: string, data: { iv: number; ivRank?: number; ivPercentile?: number; hv20?: number; price?: number }) => {
    const upperSym = sym.toUpperCase();

    // 1. Write to AsyncStorage (was localStorage on desktop)
    await recordIVReading(upperSym, data.iv, {
      ivRank: data.ivRank,
      ivPercentile: data.ivPercentile,
      hv20: data.hv20,
      price: data.price,
    });

    // 2. Write to Supabase if authenticated
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      try {
        await supabase.from('iv_history').upsert({
          user_id: user.id,
          symbol: upperSym,
          iv: data.iv,
          iv_rank: data.ivRank ?? null,
          iv_percentile: data.ivPercentile ?? null,
          hv20: data.hv20 ?? null,
          price: data.price ?? null,
          recorded_date: today,
        }, { onConflict: 'user_id,symbol,recorded_date' });
      } catch {
        // Supabase write failed -- AsyncStorage still has the data
      }
    }

    // 3. Reload history to reflect the new point
    await load();
  }, [user, load]);

  // Calculate trend from last 5 data points
  const trend = calculateTrend(history);

  return { history, loading, ...trend, record };
}

function calculateTrend(history: IVHistoryPoint[]): { trend: 'rising' | 'falling' | 'flat'; trendSlope: number } {
  if (history.length < 2) return { trend: 'flat', trendSlope: 0 };

  const recent = history.slice(-5);
  if (recent.length < 2) return { trend: 'flat', trendSlope: 0 };

  // Simple linear regression slope
  const n = recent.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += recent[i].iv;
    sumXY += i * recent[i].iv;
    sumXX += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

  // Threshold for flat: less than 0.5% per day
  if (Math.abs(slope) < 0.5) return { trend: 'flat', trendSlope: slope };
  return { trend: slope > 0 ? 'rising' : 'falling', trendSlope: slope };
}

export default useIVHistory;
