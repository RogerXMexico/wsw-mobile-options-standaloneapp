// usePaperTrading hook for Wall Street Wildlife Mobile
// Full-featured paper trading with AsyncStorage persistence + Supabase cloud sync
// Ported from desktop hook with mobile-compatible storage and API patterns

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { fetchOptionsChain, OptionData } from '../services/tradierApi';

// ── Interfaces ──────────────────────────────────────────────────────────

export interface Position {
  id: string;
  ticker: string;
  optionType: 'call' | 'put';
  action: 'long' | 'short';
  strike: number;
  expiry: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  entryDate: string;
  optionSymbol: string;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  iv?: number;
}

export interface PaperTrade {
  id: string;
  ticker: string;
  optionType: 'call' | 'put';
  action: 'buy' | 'sell';
  strike: number;
  expiry: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  closedPnL?: number;
}

export interface ExecuteTradeParams {
  ticker: string;
  optionType: 'call' | 'put';
  action: 'buy' | 'sell';
  strike: number;
  expiry: string;
  quantity: number;
  premium: number;
  optionSymbol?: string;
  delta?: number;
  theta?: number;
}

interface PaperTradingState {
  cashBalance: number;
  positions: Position[];
  tradeHistory: PaperTrade[];
}

// ── Constants ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'paper_trading_data';
const DEFAULT_CASH = 10000;

// ── AsyncStorage helpers ────────────────────────────────────────────────

async function loadFromStorage(): Promise<PaperTradingState> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        cashBalance: data.cashBalance ?? DEFAULT_CASH,
        positions: data.positions ?? [],
        tradeHistory: data.tradeHistory ?? [],
      };
    }
  } catch { /* ignore */ }
  return { cashBalance: DEFAULT_CASH, positions: [], tradeHistory: [] };
}

async function saveToStorage(state: PaperTradingState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save paper trading data:', e);
  }
}

// ── Hook ────────────────────────────────────────────────────────────────

export function usePaperTrading(hasApiKey: boolean) {
  const { user } = useAuth();
  const useSupabase = isSupabaseConfigured();

  const [cashBalance, setCashBalance] = useState(DEFAULT_CASH);
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradeHistory, setTradeHistory] = useState<PaperTrade[]>([]);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load from AsyncStorage on mount, then Supabase if authenticated ──

  useEffect(() => {
    const loadData = async () => {
      const local = await loadFromStorage();
      setCashBalance(local.cashBalance);
      setPositions(local.positions);
      setTradeHistory(local.tradeHistory);
      setIsLoaded(true);

      if (!user || !useSupabase) return;

      try {
        const { data, error } = await supabase
          .from('user_paper_trading')
          .select('state')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') return; // PGRST116 = no rows

        if (data?.state && typeof data.state === 'object') {
          const cloud = data.state as PaperTradingState;
          // Cloud wins
          setCashBalance(cloud.cashBalance ?? DEFAULT_CASH);
          setPositions(cloud.positions ?? []);
          setTradeHistory(cloud.tradeHistory ?? []);
          await saveToStorage(cloud);
        } else if (local.positions.length > 0 || local.tradeHistory.length > 0) {
          // First-login merge: push local data to cloud
          await supabase.from('user_paper_trading').upsert({
            user_id: user.id,
            state: local,
          }, { onConflict: 'user_id' });
        }
      } catch { /* offline fallback - AsyncStorage already loaded */ }
    };

    loadData();
  }, [user, useSupabase]);

  // ── Persist to AsyncStorage + debounced Supabase sync ─────────────────

  useEffect(() => {
    if (!isLoaded) return;

    const state: PaperTradingState = { cashBalance, positions, tradeHistory };
    saveToStorage(state);

    if (!user || !useSupabase) return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      setSyncing(true);
      try {
        await supabase.from('user_paper_trading').upsert({
          user_id: user.id,
          state,
        }, { onConflict: 'user_id' });
      } catch { /* silent */ }
      setSyncing(false);
    }, 500);
  }, [cashBalance, positions, tradeHistory, user, useSupabase, isLoaded]);

  // ── Computed values ───────────────────────────────────────────────────

  const calculatePositionPnL = useCallback((pos: Position): number => {
    const multiplier = pos.action === 'long' ? 1 : -1;
    return (pos.currentPrice - pos.entryPrice) * pos.quantity * 100 * multiplier;
  }, []);

  const totalPositionValue = useMemo(() =>
    positions.reduce((sum, pos) => {
      if (pos.action === 'long') {
        return sum + (pos.currentPrice * pos.quantity * 100);
      }
      return sum + (pos.entryPrice * pos.quantity * 100);
    }, 0),
  [positions]);

  const totalUnrealizedPnL = useMemo(() =>
    positions.reduce((sum, pos) => sum + calculatePositionPnL(pos), 0),
  [positions, calculatePositionPnL]);

  const totalRealizedPnL = useMemo(() =>
    tradeHistory
      .filter(t => t.closedPnL !== undefined)
      .reduce((sum, t) => sum + (t.closedPnL || 0), 0),
  [tradeHistory]);

  const portfolioValue = cashBalance + totalPositionValue;

  // ── Execute trade ─────────────────────────────────────────────────────

  const executeTrade = useCallback((params: ExecuteTradeParams): string | null => {
    const { ticker, optionType, action, strike, expiry, quantity, premium, optionSymbol, delta, theta } = params;

    if (!ticker || !expiry || premium <= 0 || strike <= 0) {
      return 'Please select a valid option';
    }

    const tradeTotal = premium * quantity * 100;
    const tradeId = Date.now().toString();

    if (action === 'buy') {
      if (tradeTotal > cashBalance) {
        return 'Insufficient funds!';
      }

      // Check if closing a short position
      const existingShort = positions.find(
        p => p.ticker === ticker && p.optionType === optionType && p.strike === strike && p.expiry === expiry && p.action === 'short'
      );

      if (existingShort && quantity <= existingShort.quantity) {
        const pnl = (existingShort.entryPrice - premium) * quantity * 100;
        setCashBalance(prev => prev + pnl);

        if (quantity === existingShort.quantity) {
          setPositions(prev => prev.filter(p => p.id !== existingShort.id));
        } else {
          setPositions(prev => prev.map(p =>
            p.id === existingShort.id ? { ...p, quantity: p.quantity - quantity } : p
          ));
        }

        setTradeHistory(prev => [{
          id: tradeId, ticker, optionType, action, strike, expiry, quantity, price: premium,
          total: tradeTotal, date: new Date().toLocaleString(), closedPnL: pnl
        }, ...prev]);
      } else {
        // Open long position
        setCashBalance(prev => prev - tradeTotal);

        const existingLong = positions.find(
          p => p.ticker === ticker && p.optionType === optionType && p.strike === strike && p.expiry === expiry && p.action === 'long'
        );

        if (existingLong) {
          const newAvgPrice = ((existingLong.entryPrice * existingLong.quantity) + (premium * quantity)) / (existingLong.quantity + quantity);
          setPositions(prev => prev.map(p =>
            p.id === existingLong.id ? { ...p, quantity: p.quantity + quantity, entryPrice: newAvgPrice } : p
          ));
        } else {
          setPositions(prev => [{
            id: tradeId, ticker, optionType, action: 'long', strike, expiry, quantity,
            entryPrice: premium, currentPrice: premium,
            entryDate: new Date().toLocaleDateString(),
            optionSymbol: optionSymbol || '', delta, theta
          }, ...prev]);
        }

        setTradeHistory(prev => [{
          id: tradeId, ticker, optionType, action, strike, expiry, quantity, price: premium,
          total: tradeTotal, date: new Date().toLocaleString()
        }, ...prev]);
      }
    } else {
      // Sell action
      const existingLong = positions.find(
        p => p.ticker === ticker && p.optionType === optionType && p.strike === strike && p.expiry === expiry && p.action === 'long'
      );

      if (existingLong && quantity <= existingLong.quantity) {
        const pnl = (premium - existingLong.entryPrice) * quantity * 100;
        setCashBalance(prev => prev + tradeTotal);

        if (quantity === existingLong.quantity) {
          setPositions(prev => prev.filter(p => p.id !== existingLong.id));
        } else {
          setPositions(prev => prev.map(p =>
            p.id === existingLong.id ? { ...p, quantity: p.quantity - quantity } : p
          ));
        }

        setTradeHistory(prev => [{
          id: tradeId, ticker, optionType, action, strike, expiry, quantity, price: premium,
          total: tradeTotal, date: new Date().toLocaleString(), closedPnL: pnl
        }, ...prev]);
      } else {
        // Open short position (sell to open)
        setCashBalance(prev => prev + tradeTotal);

        setPositions(prev => [{
          id: tradeId, ticker, optionType, action: 'short', strike, expiry, quantity,
          entryPrice: premium, currentPrice: premium,
          entryDate: new Date().toLocaleDateString(),
          optionSymbol: optionSymbol || '', delta, theta
        }, ...prev]);

        setTradeHistory(prev => [{
          id: tradeId, ticker, optionType, action, strike, expiry, quantity, price: premium,
          total: tradeTotal, date: new Date().toLocaleString()
        }, ...prev]);
      }
    }

    return null; // success
  }, [cashBalance, positions]);

  // ── Close position ────────────────────────────────────────────────────

  const closePosition = useCallback(async (pos: Position) => {
    let currentPrice = pos.currentPrice;

    if (hasApiKey) {
      try {
        const chain = await fetchOptionsChain(pos.ticker, pos.expiry);
        const options = pos.optionType === 'call' ? chain.calls : chain.puts;
        const option = options.find((o: OptionData) => o.strike === pos.strike);
        if (option) {
          currentPrice = (option.bid + option.ask) / 2;
        }
      } catch { /* use cached price */ }
    }

    const pnl = pos.action === 'long'
      ? (currentPrice - pos.entryPrice) * pos.quantity * 100
      : (pos.entryPrice - currentPrice) * pos.quantity * 100;

    const proceeds = pos.action === 'long'
      ? currentPrice * pos.quantity * 100
      : (pos.entryPrice - currentPrice) * pos.quantity * 100 + pos.entryPrice * pos.quantity * 100;

    setCashBalance(prev => prev + proceeds);
    setPositions(prev => prev.filter(p => p.id !== pos.id));

    setTradeHistory(prev => [{
      id: Date.now().toString(),
      ticker: pos.ticker,
      optionType: pos.optionType,
      action: pos.action === 'long' ? 'sell' : 'buy',
      strike: pos.strike,
      expiry: pos.expiry,
      quantity: pos.quantity,
      price: currentPrice,
      total: currentPrice * pos.quantity * 100,
      date: new Date().toLocaleString(),
      closedPnL: pnl
    }, ...prev]);
  }, [hasApiKey]);

  // ── Update position prices ────────────────────────────────────────────

  const updatePositionPrices = useCallback(async () => {
    if (positions.length === 0 || !hasApiKey) return;

    setIsUpdatingPrices(true);

    try {
      const positionGroups = new Map<string, Position[]>();
      positions.forEach(pos => {
        const key = `${pos.ticker}|${pos.expiry}`;
        const group = positionGroups.get(key) || [];
        group.push(pos);
        positionGroups.set(key, group);
      });

      const updatedPositions = [...positions];

      for (const [key, group] of positionGroups) {
        const [ticker, expiry] = key.split('|');
        try {
          const chain = await fetchOptionsChain(ticker, expiry);

          for (const pos of group) {
            const options = pos.optionType === 'call' ? chain.calls : chain.puts;
            const option = options.find((o: OptionData) => o.strike === pos.strike);

            if (option) {
              const idx = updatedPositions.findIndex(p => p.id === pos.id);
              if (idx !== -1) {
                updatedPositions[idx] = {
                  ...updatedPositions[idx],
                  currentPrice: option.last || (option.bid + option.ask) / 2,
                  delta: option.delta,
                  gamma: option.gamma,
                  theta: option.theta,
                  vega: option.vega,
                  iv: option.iv,
                };
              }
            }
          }
        } catch { /* skip group */ }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setPositions(updatedPositions);
    } catch { /* silent */ } finally {
      setIsUpdatingPrices(false);
    }
  }, [positions, hasApiKey]);

  // ── Auto-update prices every 60s ──────────────────────────────────────

  useEffect(() => {
    if (!hasApiKey || positions.length === 0) return;

    const interval = setInterval(updatePositionPrices, 60000);
    return () => clearInterval(interval);
  }, [hasApiKey, positions.length, updatePositionPrices]);

  // ── Reset portfolio ───────────────────────────────────────────────────

  const resetPortfolio = useCallback(async () => {
    setCashBalance(DEFAULT_CASH);
    setPositions([]);
    setTradeHistory([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // State
    cashBalance,
    positions,
    tradeHistory,
    isUpdatingPrices,
    syncing,
    isLoaded,

    // Computed
    portfolioValue,
    totalPositionValue,
    totalUnrealizedPnL,
    totalRealizedPnL,
    calculatePositionPnL,

    // Actions
    executeTrade,
    closePosition,
    updatePositionPrices,
    resetPortfolio,
  };
}
