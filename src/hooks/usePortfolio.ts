// Portfolio State Management Hook for Event Horizons
// Handles position tracking, P&L calculations, and dual-storage persistence
// (AsyncStorage for instant/offline + Supabase for cloud sync)
// Ported from desktop: localStorage -> AsyncStorage (all async)

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PortfolioState,
  StockPosition,
  OptionsPosition,
  PolymarketPosition,
  PortfolioTrade,
  PortfolioSnapshot,
  PortfolioSummary,
  PortfolioGreeksExposure,
  SectorAllocation,
  WinLossStats,
  AddTradeForm,
  DEFAULT_PORTFOLIO_STATE,
} from '../types/portfolio';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'portfolio_tracking';

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate days to expiration
const calculateDTE = (expiration: string): number => {
  const expDate = new Date(expiration);
  const today = new Date();
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const usePortfolio = () => {
  const { user } = useAuth();
  const [state, setState] = useState<PortfolioState>(DEFAULT_PORTFOLIO_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [_syncing, setSyncing] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from AsyncStorage immediately, then sync with Supabase if authenticated
  useEffect(() => {
    const load = async () => {
      // Always load AsyncStorage first for instant display
      let localState: PortfolioState | null = null;
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          localState = { ...DEFAULT_PORTFOLIO_STATE, ...JSON.parse(stored) };
          setState(localState);
        }
      } catch (err) {
        console.error('Failed to load portfolio from AsyncStorage:', err);
      }

      if (user) {
        setSyncing(true);
        try {
          const { data, error } = await supabase
            .from('user_portfolio')
            .select('state')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows found (first time)
            console.error('Failed to load portfolio from Supabase:', error);
          } else if (data?.state && Object.keys(data.state).length > 0) {
            // Cloud wins: Supabase data becomes source of truth
            const cloudState = { ...DEFAULT_PORTFOLIO_STATE, ...data.state };
            setState(cloudState);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudState));
          } else if (localState && (
            localState.stockPositions.length > 0 ||
            localState.optionsPositions.length > 0 ||
            localState.polymarketPositions.length > 0 ||
            localState.trades.length > 0
          )) {
            // First login merge: upload local portfolio to Supabase
            await supabase
              .from('user_portfolio')
              .upsert({ user_id: user.id, state: localState }, { onConflict: 'user_id' });
          }
        } catch (e) {
          console.error('Failed to sync portfolio with Supabase:', e);
        }
        setSyncing(false);
      }

      setIsLoaded(true);
    };

    load();
  }, [user]);

  // Save to AsyncStorage when state changes, and debounce Supabase sync
  useEffect(() => {
    if (!isLoaded) return;

    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error('Failed to save portfolio to AsyncStorage:', err);
      }
    })();

    // Debounced Supabase sync (500ms) to avoid excessive writes
    if (user) {
      if (syncTimer.current) clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => {
        supabase
          .from('user_portfolio')
          .upsert({ user_id: user.id, state }, { onConflict: 'user_id' })
          .then(({ error }) => {
            if (error) console.error('Failed to sync portfolio to Supabase:', error);
          });
      }, 500);
    }
  }, [state, isLoaded, user]);

  // Add a new trade
  const addTrade = useCallback((form: AddTradeForm) => {
    setState((prev) => {
      const tradeId = generateId();
      const now = new Date().toISOString();

      if (form.assetType === 'stock') {
        // Stock trade
        const total = form.shares * form.price + (form.fees || 0);

        // Find existing open position for this ticker
        const existingIdx = prev.stockPositions.findIndex(
          (p) => p.ticker === form.ticker && p.status === 'open'
        );

        let newStockPositions = [...prev.stockPositions];
        let positionId: string;
        let cashChange: number;

        if (form.tradeType === 'buy') {
          cashChange = -total;

          if (existingIdx >= 0) {
            // Add to existing position
            positionId = newStockPositions[existingIdx].id;
            const existing = newStockPositions[existingIdx];
            const newShares = existing.shares + form.shares;
            const newAvgCost =
              (existing.shares * existing.avgCost + form.shares * form.price) / newShares;

            newStockPositions[existingIdx] = {
              ...existing,
              shares: newShares,
              avgCost: newAvgCost,
              marketValue: newShares * existing.currentPrice,
              unrealizedPnL: newShares * (existing.currentPrice - newAvgCost),
              unrealizedPnLPercent: ((existing.currentPrice - newAvgCost) / newAvgCost) * 100,
            };
          } else {
            // Create new position
            positionId = generateId();
            const newPosition: StockPosition = {
              id: positionId,
              ticker: form.ticker,
              shares: form.shares,
              avgCost: form.price,
              currentPrice: form.price, // Initial price = entry price
              marketValue: form.shares * form.price,
              unrealizedPnL: 0,
              unrealizedPnLPercent: 0,
              openedAt: now,
              status: 'open',
            };
            newStockPositions.push(newPosition);
          }
        } else {
          // Sell
          cashChange = form.shares * form.price - (form.fees || 0);

          if (existingIdx >= 0) {
            positionId = newStockPositions[existingIdx].id;
            const existing = newStockPositions[existingIdx];
            const remainingShares = existing.shares - form.shares;

            if (remainingShares <= 0) {
              // Close position
              newStockPositions[existingIdx] = {
                ...existing,
                shares: 0,
                marketValue: 0,
                unrealizedPnL: 0,
                unrealizedPnLPercent: 0,
                status: 'closed',
                closedAt: now,
              };
            } else {
              // Reduce position
              newStockPositions[existingIdx] = {
                ...existing,
                shares: remainingShares,
                marketValue: remainingShares * existing.currentPrice,
                unrealizedPnL: remainingShares * (existing.currentPrice - existing.avgCost),
                unrealizedPnLPercent:
                  ((existing.currentPrice - existing.avgCost) / existing.avgCost) * 100,
              };
            }
          } else {
            // Short sale - create new short position (negative shares)
            positionId = generateId();
            const newPosition: StockPosition = {
              id: positionId,
              ticker: form.ticker,
              shares: -form.shares,
              avgCost: form.price,
              currentPrice: form.price,
              marketValue: -form.shares * form.price,
              unrealizedPnL: 0,
              unrealizedPnLPercent: 0,
              openedAt: now,
              status: 'open',
            };
            newStockPositions.push(newPosition);
          }
        }

        // Create trade record
        const trade: PortfolioTrade = {
          id: tradeId,
          positionId,
          type: form.tradeType,
          assetType: 'stock',
          ticker: form.ticker,
          quantity: form.shares,
          price: form.price,
          total,
          fees: form.fees,
          timestamp: now,
          notes: form.notes,
        };

        return {
          ...prev,
          cashBalance: prev.cashBalance + cashChange,
          stockPositions: newStockPositions,
          trades: [...prev.trades, trade],
        };
      } else if (form.assetType === 'option') {
        // Options trade
        const total = form.contracts * form.price * 100 + (form.fees || 0);

        // Find existing open position
        const existingIdx = prev.optionsPositions.findIndex(
          (p) =>
            p.ticker === form.ticker &&
            p.optionType === form.optionType &&
            p.strike === form.strike &&
            p.expiration === form.expiration &&
            p.status === 'open'
        );

        let newOptionsPositions = [...prev.optionsPositions];
        let positionId: string;
        let cashChange: number;

        if (form.tradeType === 'buy') {
          cashChange = -total;

          if (existingIdx >= 0) {
            positionId = newOptionsPositions[existingIdx].id;
            const existing = newOptionsPositions[existingIdx];
            const newQuantity = existing.quantity + form.contracts;
            const newAvgCost =
              (existing.quantity * existing.avgCost + form.contracts * form.price) / newQuantity;

            newOptionsPositions[existingIdx] = {
              ...existing,
              quantity: newQuantity,
              avgCost: newAvgCost,
              marketValue: newQuantity * existing.currentPrice * 100,
              unrealizedPnL: newQuantity * (existing.currentPrice - newAvgCost) * 100,
              unrealizedPnLPercent: ((existing.currentPrice - newAvgCost) / newAvgCost) * 100,
            };
          } else {
            positionId = generateId();
            const newPosition: OptionsPosition = {
              id: positionId,
              ticker: form.ticker,
              optionType: form.optionType,
              strike: form.strike,
              expiration: form.expiration,
              quantity: form.contracts,
              avgCost: form.price,
              currentPrice: form.price,
              marketValue: form.contracts * form.price * 100,
              unrealizedPnL: 0,
              unrealizedPnLPercent: 0,
              daysToExpiration: calculateDTE(form.expiration),
              openedAt: now,
              status: 'open',
              underlyingCostBasis: form.underlyingCostBasis,
            };
            newOptionsPositions.push(newPosition);
          }
        } else {
          // Sell
          cashChange = form.contracts * form.price * 100 - (form.fees || 0);

          if (existingIdx >= 0) {
            positionId = newOptionsPositions[existingIdx].id;
            const existing = newOptionsPositions[existingIdx];
            const remainingQty = existing.quantity - form.contracts;

            if (remainingQty <= 0) {
              // Close position
              newOptionsPositions[existingIdx] = {
                ...existing,
                quantity: 0,
                marketValue: 0,
                unrealizedPnL: 0,
                unrealizedPnLPercent: 0,
                status: 'closed',
                closedAt: now,
              };
            } else {
              newOptionsPositions[existingIdx] = {
                ...existing,
                quantity: remainingQty,
                marketValue: remainingQty * existing.currentPrice * 100,
                unrealizedPnL: remainingQty * (existing.currentPrice - existing.avgCost) * 100,
                unrealizedPnLPercent:
                  ((existing.currentPrice - existing.avgCost) / existing.avgCost) * 100,
              };
            }
          } else {
            // Short position (writing options)
            positionId = generateId();
            const newPosition: OptionsPosition = {
              id: positionId,
              ticker: form.ticker,
              optionType: form.optionType,
              strike: form.strike,
              expiration: form.expiration,
              quantity: -form.contracts,
              avgCost: form.price,
              currentPrice: form.price,
              marketValue: -form.contracts * form.price * 100,
              unrealizedPnL: 0,
              unrealizedPnLPercent: 0,
              daysToExpiration: calculateDTE(form.expiration),
              openedAt: now,
              status: 'open',
              underlyingCostBasis: form.underlyingCostBasis,
            };
            newOptionsPositions.push(newPosition);
          }
        }

        // Create trade record
        const trade: PortfolioTrade = {
          id: tradeId,
          positionId,
          type: form.tradeType,
          assetType: 'option',
          ticker: form.ticker,
          quantity: form.contracts,
          price: form.price,
          total,
          fees: form.fees,
          timestamp: now,
          notes: form.notes,
          optionType: form.optionType,
          strike: form.strike,
          expiration: form.expiration,
          underlyingCostBasis: form.underlyingCostBasis,
        };

        return {
          ...prev,
          cashBalance: prev.cashBalance + cashChange,
          optionsPositions: newOptionsPositions,
          trades: [...prev.trades, trade],
        };
      } else if (form.assetType === 'polymarket') {
        // Polymarket prediction trade
        const total = form.shares * form.price;

        // Find existing open position
        const existingIdx = prev.polymarketPositions.findIndex(
          (p) => p.eventId === form.eventId && p.outcome === form.outcome && p.status === 'open'
        );

        let newPolymarketPositions = [...prev.polymarketPositions];
        let positionId: string;
        let cashChange: number;

        if (form.tradeType === 'buy') {
          cashChange = -total;

          if (existingIdx >= 0) {
            positionId = newPolymarketPositions[existingIdx].id;
            const existing = newPolymarketPositions[existingIdx];
            const newShares = existing.shares + form.shares;
            const newCostBasis = existing.costBasis + total;
            const newAvgCost = newCostBasis / newShares;

            newPolymarketPositions[existingIdx] = {
              ...existing,
              shares: newShares,
              avgCost: newAvgCost,
              costBasis: newCostBasis,
              marketValue: newShares * existing.currentPrice,
              unrealizedPnL: newShares * existing.currentPrice - newCostBasis,
              unrealizedPnLPercent: ((newShares * existing.currentPrice - newCostBasis) / newCostBasis) * 100,
            };
          } else {
            positionId = generateId();
            const newPosition: PolymarketPosition = {
              id: positionId,
              eventId: form.eventId,
              eventName: form.eventName,
              ticker: form.ticker,
              outcome: form.outcome,
              shares: form.shares,
              avgCost: form.price,
              currentPrice: form.price,
              costBasis: total,
              marketValue: total,
              unrealizedPnL: 0,
              unrealizedPnLPercent: 0,
              eventDate: form.eventDate,
              status: 'open',
              openedAt: now,
            };
            newPolymarketPositions.push(newPosition);
          }
        } else {
          // Sell
          cashChange = total;

          if (existingIdx >= 0) {
            positionId = newPolymarketPositions[existingIdx].id;
            const existing = newPolymarketPositions[existingIdx];
            const remainingShares = existing.shares - form.shares;

            if (remainingShares <= 0) {
              // Close position
              const realizedPnL = total - existing.costBasis;
              newPolymarketPositions[existingIdx] = {
                ...existing,
                shares: 0,
                marketValue: 0,
                unrealizedPnL: 0,
                unrealizedPnLPercent: 0,
                status: 'closed',
                closedAt: now,
                exitPrice: form.price,
                realizedPnL,
              };
            } else {
              // Reduce position
              const soldCostBasis = (existing.costBasis / existing.shares) * form.shares;
              const newCostBasis = existing.costBasis - soldCostBasis;
              newPolymarketPositions[existingIdx] = {
                ...existing,
                shares: remainingShares,
                costBasis: newCostBasis,
                marketValue: remainingShares * existing.currentPrice,
                unrealizedPnL: remainingShares * existing.currentPrice - newCostBasis,
                unrealizedPnLPercent: ((remainingShares * existing.currentPrice - newCostBasis) / newCostBasis) * 100,
              };
            }
          } else {
            // Can't sell what you don't have for Polymarket
            return prev;
          }
        }

        // Create trade record
        const trade: PortfolioTrade = {
          id: tradeId,
          positionId,
          type: form.tradeType,
          assetType: 'polymarket',
          ticker: form.ticker || form.eventName,
          quantity: form.shares,
          price: form.price,
          total,
          timestamp: now,
          notes: form.notes,
          outcome: form.outcome,
          eventId: form.eventId,
          eventName: form.eventName,
        };

        return {
          ...prev,
          cashBalance: prev.cashBalance + cashChange,
          polymarketPositions: newPolymarketPositions,
          trades: [...prev.trades, trade],
        };
      }

      return prev;
    });
  }, []);

  // Update stock prices
  const updateStockPrices = useCallback(
    (priceUpdates: Record<string, number>) => {
      setState((prev) => {
        const newStockPositions = prev.stockPositions.map((pos) => {
          if (pos.status === 'closed') return pos;
          const newPrice = priceUpdates[pos.ticker];
          if (newPrice === undefined) return pos;

          return {
            ...pos,
            currentPrice: newPrice,
            marketValue: pos.shares * newPrice,
            unrealizedPnL: pos.shares * (newPrice - pos.avgCost),
            unrealizedPnLPercent: ((newPrice - pos.avgCost) / pos.avgCost) * 100,
          };
        });

        return { ...prev, stockPositions: newStockPositions };
      });
    },
    []
  );

  // Update options prices and Greeks
  const updateOptionPrices = useCallback(
    (
      updates: Record<
        string,
        {
          price: number;
          delta?: number;
          gamma?: number;
          theta?: number;
          vega?: number;
          iv?: number;
        }
      >
    ) => {
      setState((prev) => {
        const newOptionsPositions = prev.optionsPositions.map((pos) => {
          if (pos.status === 'closed') return pos;

          const key = `${pos.ticker}-${pos.optionType}-${pos.strike}-${pos.expiration}`;
          const update = updates[key];
          if (!update) return pos;

          return {
            ...pos,
            currentPrice: update.price,
            delta: update.delta,
            gamma: update.gamma,
            theta: update.theta,
            vega: update.vega,
            iv: update.iv,
            marketValue: pos.quantity * update.price * 100,
            unrealizedPnL: pos.quantity * (update.price - pos.avgCost) * 100,
            unrealizedPnLPercent: ((update.price - pos.avgCost) / pos.avgCost) * 100,
            daysToExpiration: calculateDTE(pos.expiration),
          };
        });

        return { ...prev, optionsPositions: newOptionsPositions };
      });
    },
    []
  );

  // Close a stock position
  const closeStockPosition = useCallback((positionId: string, exitPrice: number, fees?: number) => {
    setState((prev) => {
      const posIdx = prev.stockPositions.findIndex((p) => p.id === positionId);
      if (posIdx < 0) return prev;

      const position = prev.stockPositions[posIdx];
      const now = new Date().toISOString();
      const total = Math.abs(position.shares) * exitPrice - (fees || 0);
      const cashChange = position.shares > 0 ? total : -total;

      const trade: PortfolioTrade = {
        id: generateId(),
        positionId,
        type: position.shares > 0 ? 'sell' : 'buy',
        assetType: 'stock',
        ticker: position.ticker,
        quantity: Math.abs(position.shares),
        price: exitPrice,
        total,
        fees,
        timestamp: now,
      };

      const newStockPositions = [...prev.stockPositions];
      newStockPositions[posIdx] = {
        ...position,
        shares: 0,
        currentPrice: exitPrice,
        marketValue: 0,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        status: 'closed',
        closedAt: now,
      };

      return {
        ...prev,
        cashBalance: prev.cashBalance + cashChange,
        stockPositions: newStockPositions,
        trades: [...prev.trades, trade],
      };
    });
  }, []);

  // Close an options position
  const closeOptionsPosition = useCallback(
    (positionId: string, exitPrice: number, fees?: number) => {
      setState((prev) => {
        const posIdx = prev.optionsPositions.findIndex((p) => p.id === positionId);
        if (posIdx < 0) return prev;

        const position = prev.optionsPositions[posIdx];
        const now = new Date().toISOString();
        const total = Math.abs(position.quantity) * exitPrice * 100 - (fees || 0);
        const cashChange = position.quantity > 0 ? total : -total;

        const trade: PortfolioTrade = {
          id: generateId(),
          positionId,
          type: position.quantity > 0 ? 'sell' : 'buy',
          assetType: 'option',
          ticker: position.ticker,
          quantity: Math.abs(position.quantity),
          price: exitPrice,
          total,
          fees,
          timestamp: now,
          optionType: position.optionType,
          strike: position.strike,
          expiration: position.expiration,
        };

        const newOptionsPositions = [...prev.optionsPositions];
        newOptionsPositions[posIdx] = {
          ...position,
          quantity: 0,
          currentPrice: exitPrice,
          marketValue: 0,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          status: 'closed',
          closedAt: now,
        };

        return {
          ...prev,
          cashBalance: prev.cashBalance + cashChange,
          optionsPositions: newOptionsPositions,
          trades: [...prev.trades, trade],
        };
      });
    },
    []
  );

  // Close a Polymarket position
  const closePolymarketPosition = useCallback(
    (positionId: string, exitPrice: number) => {
      setState((prev) => {
        const posIdx = prev.polymarketPositions.findIndex((p) => p.id === positionId);
        if (posIdx < 0) return prev;

        const position = prev.polymarketPositions[posIdx];
        const now = new Date().toISOString();
        const total = position.shares * exitPrice;
        const realizedPnL = total - position.costBasis;

        const trade: PortfolioTrade = {
          id: generateId(),
          positionId,
          type: 'sell',
          assetType: 'polymarket',
          ticker: position.ticker || position.eventName,
          quantity: position.shares,
          price: exitPrice,
          total,
          timestamp: now,
          outcome: position.outcome,
          eventId: position.eventId,
          eventName: position.eventName,
        };

        const newPolymarketPositions = [...prev.polymarketPositions];
        newPolymarketPositions[posIdx] = {
          ...position,
          shares: 0,
          currentPrice: exitPrice,
          marketValue: 0,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          status: 'closed',
          closedAt: now,
          exitPrice,
          realizedPnL,
        };

        return {
          ...prev,
          cashBalance: prev.cashBalance + total,
          polymarketPositions: newPolymarketPositions,
          trades: [...prev.trades, trade],
        };
      });
    },
    []
  );

  // Update Polymarket prices
  const updatePolymarketPrices = useCallback(
    (priceUpdates: Record<string, { yes: number; no: number }>) => {
      setState((prev) => {
        const newPolymarketPositions = prev.polymarketPositions.map((pos) => {
          if (pos.status === 'closed' || pos.status === 'resolved') return pos;
          const prices = priceUpdates[pos.eventId];
          if (!prices) return pos;

          const newPrice = pos.outcome === 'yes' ? prices.yes : prices.no;
          const newMarketValue = pos.shares * newPrice;
          const unrealizedPnL = newMarketValue - pos.costBasis;

          return {
            ...pos,
            currentPrice: newPrice,
            marketValue: newMarketValue,
            unrealizedPnL,
            unrealizedPnLPercent: (unrealizedPnL / pos.costBasis) * 100,
          };
        });

        return { ...prev, polymarketPositions: newPolymarketPositions };
      });
    },
    []
  );

  // Resolve a Polymarket position (event concluded)
  const resolvePolymarketPosition = useCallback(
    (positionId: string, winningOutcome: 'yes' | 'no') => {
      setState((prev) => {
        const posIdx = prev.polymarketPositions.findIndex((p) => p.id === positionId);
        if (posIdx < 0) return prev;

        const position = prev.polymarketPositions[posIdx];
        const now = new Date().toISOString();

        // If the position's outcome matches the winning outcome, it pays $1 per share
        // Otherwise, it pays $0
        const exitPrice = position.outcome === winningOutcome ? 1 : 0;
        const total = position.shares * exitPrice;
        const realizedPnL = total - position.costBasis;

        const trade: PortfolioTrade = {
          id: generateId(),
          positionId,
          type: 'sell',
          assetType: 'polymarket',
          ticker: position.ticker || position.eventName,
          quantity: position.shares,
          price: exitPrice,
          total,
          timestamp: now,
          notes: `Event resolved: ${winningOutcome.toUpperCase()} won`,
          outcome: position.outcome,
          eventId: position.eventId,
          eventName: position.eventName,
        };

        const newPolymarketPositions = [...prev.polymarketPositions];
        newPolymarketPositions[posIdx] = {
          ...position,
          shares: 0,
          currentPrice: exitPrice,
          marketValue: 0,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          status: 'resolved',
          resolvedAt: now,
          exitPrice,
          realizedPnL,
        };

        return {
          ...prev,
          cashBalance: prev.cashBalance + total,
          polymarketPositions: newPolymarketPositions,
          trades: [...prev.trades, trade],
        };
      });
    },
    []
  );

  // Take a daily snapshot
  const takeSnapshot = useCallback(() => {
    setState((prev) => {
      const today = new Date().toISOString().split('T')[0];

      // Check if we already have a snapshot for today
      const existingIdx = prev.snapshots.findIndex((s) => s.date === today);

      const stocksValue = prev.stockPositions
        .filter((p) => p.status === 'open')
        .reduce((sum, p) => sum + p.marketValue, 0);

      const optionsValue = prev.optionsPositions
        .filter((p) => p.status === 'open')
        .reduce((sum, p) => sum + p.marketValue, 0);

      const polymarketValue = prev.polymarketPositions
        .filter((p) => p.status === 'open')
        .reduce((sum, p) => sum + p.marketValue, 0);

      const totalValue = prev.cashBalance + stocksValue + optionsValue + polymarketValue;

      // Calculate daily P&L
      const lastSnapshot = prev.snapshots[prev.snapshots.length - 1];
      const dailyPnL = lastSnapshot ? totalValue - lastSnapshot.totalValue : 0;

      const newSnapshot: PortfolioSnapshot = {
        date: today,
        totalValue,
        cashBalance: prev.cashBalance,
        stocksValue,
        optionsValue,
        polymarketValue,
        dailyPnL,
      };

      if (existingIdx >= 0) {
        // Update existing snapshot
        const newSnapshots = [...prev.snapshots];
        newSnapshots[existingIdx] = newSnapshot;
        return { ...prev, snapshots: newSnapshots };
      } else {
        return { ...prev, snapshots: [...prev.snapshots, newSnapshot] };
      }
    });
  }, []);

  // Update cash balance
  const updateCashBalance = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      cashBalance: amount,
    }));
  }, []);

  // Update settings
  const updateSettings = useCallback(
    (newSettings: Partial<typeof DEFAULT_PORTFOLIO_STATE.settings>) => {
      setState((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings },
      }));
    },
    []
  );

  // Delete a trade
  const deleteTrade = useCallback((tradeId: string) => {
    setState((prev) => ({
      ...prev,
      trades: prev.trades.filter((t) => t.id !== tradeId),
    }));
  }, []);

  // Reset portfolio
  const resetPortfolio = useCallback(() => {
    setState(DEFAULT_PORTFOLIO_STATE);
  }, []);

  // Computed values

  // Portfolio summary
  const summary: PortfolioSummary = useMemo(() => {
    const openStocks = state.stockPositions.filter((p) => p.status === 'open');
    const openOptions = state.optionsPositions.filter((p) => p.status === 'open');
    const openPolymarket = state.polymarketPositions.filter((p) => p.status === 'open');

    const stocksValue = openStocks.reduce((sum, p) => sum + p.marketValue, 0);
    const optionsValue = openOptions.reduce((sum, p) => sum + p.marketValue, 0);
    const polymarketValue = openPolymarket.reduce((sum, p) => sum + p.marketValue, 0);
    const totalValue = state.cashBalance + stocksValue + optionsValue + polymarketValue;

    const stocksPnL = openStocks.reduce((sum, p) => sum + p.unrealizedPnL, 0);
    const optionsPnL = openOptions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
    const polymarketPnL = openPolymarket.reduce((sum, p) => sum + p.unrealizedPnL, 0);
    const unrealizedPnL = stocksPnL + optionsPnL + polymarketPnL;

    const totalCostBasis = openStocks.reduce((sum, p) => sum + p.shares * p.avgCost, 0) +
      openOptions.reduce((sum, p) => sum + Math.abs(p.quantity) * p.avgCost * 100, 0) +
      openPolymarket.reduce((sum, p) => sum + p.costBasis, 0);
    const unrealizedPnLPercent = totalCostBasis > 0 ? (unrealizedPnL / totalCostBasis) * 100 : 0;

    // Calculate day P&L from last snapshot
    const lastSnapshot = state.snapshots[state.snapshots.length - 1];
    const dayPnL = lastSnapshot ? totalValue - lastSnapshot.totalValue : 0;
    const dayPnLPercent = lastSnapshot && lastSnapshot.totalValue > 0
      ? (dayPnL / lastSnapshot.totalValue) * 100
      : 0;

    // Greeks exposure
    const greeksExposure: PortfolioGreeksExposure = {
      totalDelta: openOptions.reduce(
        (sum, p) => sum + (p.delta || 0) * p.quantity * 100,
        0
      ),
      totalGamma: openOptions.reduce(
        (sum, p) => sum + (p.gamma || 0) * p.quantity * 100,
        0
      ),
      totalTheta: openOptions.reduce(
        (sum, p) => sum + (p.theta || 0) * p.quantity * 100,
        0
      ),
      totalVega: openOptions.reduce(
        (sum, p) => sum + (p.vega || 0) * p.quantity * 100,
        0
      ),
    };

    return {
      totalValue,
      cashBalance: state.cashBalance,
      stocksValue,
      optionsValue,
      polymarketValue,
      unrealizedPnL,
      unrealizedPnLPercent,
      dayPnL,
      dayPnLPercent,
      greeksExposure,
    };
  }, [state.stockPositions, state.optionsPositions, state.polymarketPositions, state.cashBalance, state.snapshots]);

  // Sector allocation
  const sectorAllocation: SectorAllocation[] = useMemo(() => {
    const openStocks = state.stockPositions.filter((p) => p.status === 'open');
    const sectorMap = new Map<string, { value: number; positions: number }>();

    openStocks.forEach((pos) => {
      const sector = pos.sector || 'Other';
      const existing = sectorMap.get(sector) || { value: 0, positions: 0 };
      sectorMap.set(sector, {
        value: existing.value + pos.marketValue,
        positions: existing.positions + 1,
      });
    });

    const totalValue = openStocks.reduce((sum, p) => sum + p.marketValue, 0);

    return Array.from(sectorMap.entries())
      .map(([sector, data]) => ({
        sector,
        value: data.value,
        percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
        positions: data.positions,
      }))
      .sort((a, b) => b.value - a.value);
  }, [state.stockPositions]);

  // Win/loss statistics from closed positions and trades
  const winLossStats: WinLossStats = useMemo(() => {
    // Calculate realized P&L from closed positions
    const closedStockTrades: { pnl: number }[] = [];
    const closedOptionTrades: { pnl: number }[] = [];

    // Group trades by position and calculate P&L
    const positionTrades = new Map<string, PortfolioTrade[]>();
    state.trades.forEach((trade) => {
      const existing = positionTrades.get(trade.positionId) || [];
      existing.push(trade);
      positionTrades.set(trade.positionId, existing);
    });

    // Check closed stock positions
    state.stockPositions
      .filter((p) => p.status === 'closed')
      .forEach((pos) => {
        const trades = positionTrades.get(pos.id) || [];
        let costBasis = 0;
        let proceeds = 0;

        trades.forEach((t) => {
          if (t.type === 'buy') {
            costBasis += t.total;
          } else {
            proceeds += t.total;
          }
        });

        closedStockTrades.push({ pnl: proceeds - costBasis });
      });

    // Check closed options positions
    state.optionsPositions
      .filter((p) => p.status === 'closed')
      .forEach((pos) => {
        const trades = positionTrades.get(pos.id) || [];
        let costBasis = 0;
        let proceeds = 0;

        trades.forEach((t) => {
          if (t.type === 'buy') {
            costBasis += t.total;
          } else {
            proceeds += t.total;
          }
        });

        closedOptionTrades.push({ pnl: proceeds - costBasis });
      });

    const allTrades = [...closedStockTrades, ...closedOptionTrades];
    const winningTrades = allTrades.filter((t) => t.pnl > 0);
    const losingTrades = allTrades.filter((t) => t.pnl < 0);

    const avgWin =
      winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length
        : 0;

    const avgLoss =
      losingTrades.length > 0
        ? losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length
        : 0;

    const totalWins = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

    return {
      totalTrades: allTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: allTrades.length > 0 ? (winningTrades.length / allTrades.length) * 100 : 0,
      avgWin,
      avgLoss,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0,
      totalRealizedPnL: totalWins - totalLosses,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map((t) => t.pnl)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map((t) => t.pnl)) : 0,
    };
  }, [state.trades, state.stockPositions, state.optionsPositions]);

  // Top gainers and losers
  const topGainers = useMemo(() => {
    const openPositions = [
      ...state.stockPositions.filter((p) => p.status === 'open').map((p) => ({
        ticker: p.ticker,
        pnl: p.unrealizedPnL,
        pnlPercent: p.unrealizedPnLPercent,
        type: 'stock' as const,
      })),
      ...state.optionsPositions.filter((p) => p.status === 'open').map((p) => ({
        ticker: `${p.ticker} ${p.strike}${p.optionType === 'call' ? 'C' : 'P'}`,
        pnl: p.unrealizedPnL,
        pnlPercent: p.unrealizedPnLPercent,
        type: 'option' as const,
      })),
      ...state.polymarketPositions.filter((p) => p.status === 'open').map((p) => ({
        ticker: `${p.eventName.substring(0, 20)}... (${p.outcome.toUpperCase()})`,
        pnl: p.unrealizedPnL,
        pnlPercent: p.unrealizedPnLPercent,
        type: 'polymarket' as const,
      })),
    ];

    return openPositions
      .filter((p) => p.pnl > 0)
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 5);
  }, [state.stockPositions, state.optionsPositions, state.polymarketPositions]);

  const topLosers = useMemo(() => {
    const openPositions = [
      ...state.stockPositions.filter((p) => p.status === 'open').map((p) => ({
        ticker: p.ticker,
        pnl: p.unrealizedPnL,
        pnlPercent: p.unrealizedPnLPercent,
        type: 'stock' as const,
      })),
      ...state.optionsPositions.filter((p) => p.status === 'open').map((p) => ({
        ticker: `${p.ticker} ${p.strike}${p.optionType === 'call' ? 'C' : 'P'}`,
        pnl: p.unrealizedPnL,
        pnlPercent: p.unrealizedPnLPercent,
        type: 'option' as const,
      })),
      ...state.polymarketPositions.filter((p) => p.status === 'open').map((p) => ({
        ticker: `${p.eventName.substring(0, 20)}... (${p.outcome.toUpperCase()})`,
        pnl: p.unrealizedPnL,
        pnlPercent: p.unrealizedPnLPercent,
        type: 'polymarket' as const,
      })),
    ];

    return openPositions
      .filter((p) => p.pnl < 0)
      .sort((a, b) => a.pnl - b.pnl)
      .slice(0, 5);
  }, [state.stockPositions, state.optionsPositions, state.polymarketPositions]);

  // Open positions only
  const openStockPositions = useMemo(
    () => state.stockPositions.filter((p) => p.status === 'open'),
    [state.stockPositions]
  );

  const openOptionsPositions = useMemo(
    () => state.optionsPositions.filter((p) => p.status === 'open'),
    [state.optionsPositions]
  );

  const openPolymarketPositions = useMemo(
    () => state.polymarketPositions.filter((p) => p.status === 'open'),
    [state.polymarketPositions]
  );

  return {
    // State
    ...state,
    isLoaded,
    openStockPositions,
    openOptionsPositions,
    openPolymarketPositions,

    // Computed
    summary,
    sectorAllocation,
    winLossStats,
    topGainers,
    topLosers,

    // Actions
    addTrade,
    updateStockPrices,
    updateOptionPrices,
    updatePolymarketPrices,
    closeStockPosition,
    closeOptionsPosition,
    closePolymarketPosition,
    resolvePolymarketPosition,
    takeSnapshot,
    updateCashBalance,
    updateSettings,
    deleteTrade,
    resetPortfolio,
  };
};

export default usePortfolio;
