// Trading Store - Paper trading and journal with persistence
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PaperPosition {
  id: string;
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  quantity: number;
  entryPrice: number;
  entryDate: string;
  currentPrice?: number;
  status: 'open' | 'closed';
  closedAt?: string;
  closePrice?: number;
  pnl?: number;
  notes?: string;
}

export interface TradeJournalEntry {
  id: string;
  date: string;
  symbol: string;
  strategy: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  pnlPercent?: number;
  status: 'open' | 'win' | 'loss' | 'breakeven';
  notes: string;
  lessons: string;
  emotions: string[];
  tags: string[];
  screenshots?: string[];
}

interface TradingState {
  // Paper Trading
  paperBalance: number;
  positions: PaperPosition[];
  tradeHistory: PaperPosition[];

  // Journal
  journalEntries: TradeJournalEntry[];

  // Paper Trading Actions
  setBalance: (amount: number) => void;
  addPosition: (position: Omit<PaperPosition, 'id' | 'status'>) => void;
  closePosition: (positionId: string, closePrice: number) => void;
  updatePositionPrice: (positionId: string, currentPrice: number) => void;
  resetPaperTrading: () => void;

  // Journal Actions
  addJournalEntry: (entry: Omit<TradeJournalEntry, 'id'>) => void;
  updateJournalEntry: (entryId: string, updates: Partial<TradeJournalEntry>) => void;
  deleteJournalEntry: (entryId: string) => void;
  closeJournalTrade: (entryId: string, exitPrice: number, status: 'win' | 'loss' | 'breakeven') => void;

  // Stats
  getWinRate: () => number;
  getTotalPnL: () => number;
  getAveragePnL: () => number;
}

const INITIAL_BALANCE = 100000; // $100k paper trading balance

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      paperBalance: INITIAL_BALANCE,
      positions: [],
      tradeHistory: [],
      journalEntries: [],

      // Paper Trading Actions
      setBalance: (amount) => set({ paperBalance: amount }),

      addPosition: (position) =>
        set((state) => {
          const cost = position.entryPrice * position.quantity * 100; // Options are per 100 shares
          if (cost > state.paperBalance) {
            return state; // Insufficient funds
          }

          const newPosition: PaperPosition = {
            ...position,
            id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'open',
          };

          return {
            positions: [...state.positions, newPosition],
            paperBalance: state.paperBalance - cost,
          };
        }),

      closePosition: (positionId, closePrice) =>
        set((state) => {
          const position = state.positions.find((p) => p.id === positionId);
          if (!position || position.status === 'closed') {
            return state;
          }

          const pnl = (closePrice - position.entryPrice) * position.quantity * 100;
          const closedPosition: PaperPosition = {
            ...position,
            status: 'closed',
            closedAt: new Date().toISOString(),
            closePrice,
            pnl,
          };

          return {
            positions: state.positions.filter((p) => p.id !== positionId),
            tradeHistory: [...state.tradeHistory, closedPosition],
            paperBalance: state.paperBalance + (closePrice * position.quantity * 100),
          };
        }),

      updatePositionPrice: (positionId, currentPrice) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === positionId ? { ...p, currentPrice } : p
          ),
        })),

      resetPaperTrading: () =>
        set({
          paperBalance: INITIAL_BALANCE,
          positions: [],
          tradeHistory: [],
        }),

      // Journal Actions
      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [
            {
              ...entry,
              id: `journal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            },
            ...state.journalEntries,
          ],
        })),

      updateJournalEntry: (entryId, updates) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((e) =>
            e.id === entryId ? { ...e, ...updates } : e
          ),
        })),

      deleteJournalEntry: (entryId) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== entryId),
        })),

      closeJournalTrade: (entryId, exitPrice, status) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((e) => {
            if (e.id !== entryId) return e;

            const pnl = (exitPrice - e.entryPrice) * e.quantity * 100;
            const pnlPercent = ((exitPrice - e.entryPrice) / e.entryPrice) * 100;

            return {
              ...e,
              exitPrice,
              pnl,
              pnlPercent,
              status,
            };
          }),
        })),

      // Stats
      getWinRate: () => {
        const entries = get().journalEntries.filter((e) => e.status !== 'open');
        if (entries.length === 0) return 0;
        const wins = entries.filter((e) => e.status === 'win').length;
        return (wins / entries.length) * 100;
      },

      getTotalPnL: () => {
        return get().journalEntries.reduce((sum, e) => sum + (e.pnl || 0), 0);
      },

      getAveragePnL: () => {
        const entries = get().journalEntries.filter((e) => e.pnl !== undefined);
        if (entries.length === 0) return 0;
        const total = entries.reduce((sum, e) => sum + (e.pnl || 0), 0);
        return total / entries.length;
      },
    }),
    {
      name: 'wsw-trading-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
