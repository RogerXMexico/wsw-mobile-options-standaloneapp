// Watchlist Store - Zustand with AsyncStorage persistence
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: string;
  alerts: WatchlistAlert[];
}

export interface WatchlistAlert {
  id: string;
  type: 'price_above' | 'price_below' | 'iv_above' | 'iv_below' | 'earnings';
  value?: number;
  enabled: boolean;
  triggered: boolean;
}

interface WatchlistState {
  items: WatchlistItem[];

  // Actions
  addSymbol: (symbol: string, name: string) => void;
  removeSymbol: (symbol: string) => void;
  addAlert: (symbol: string, alert: Omit<WatchlistAlert, 'id' | 'triggered'>) => void;
  removeAlert: (symbol: string, alertId: string) => void;
  toggleAlert: (symbol: string, alertId: string) => void;
  clearWatchlist: () => void;
  hasSymbol: (symbol: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addSymbol: (symbol, name) =>
        set((state) => {
          if (state.items.some((item) => item.symbol === symbol.toUpperCase())) {
            return state;
          }
          return {
            items: [
              ...state.items,
              {
                symbol: symbol.toUpperCase(),
                name,
                addedAt: new Date().toISOString(),
                alerts: [],
              },
            ],
          };
        }),

      removeSymbol: (symbol) =>
        set((state) => ({
          items: state.items.filter((item) => item.symbol !== symbol.toUpperCase()),
        })),

      addAlert: (symbol, alert) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.symbol === symbol.toUpperCase()
              ? {
                  ...item,
                  alerts: [
                    ...item.alerts,
                    {
                      ...alert,
                      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      triggered: false,
                    },
                  ],
                }
              : item
          ),
        })),

      removeAlert: (symbol, alertId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.symbol === symbol.toUpperCase()
              ? {
                  ...item,
                  alerts: item.alerts.filter((a) => a.id !== alertId),
                }
              : item
          ),
        })),

      toggleAlert: (symbol, alertId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.symbol === symbol.toUpperCase()
              ? {
                  ...item,
                  alerts: item.alerts.map((a) =>
                    a.id === alertId ? { ...a, enabled: !a.enabled } : a
                  ),
                }
              : item
          ),
        })),

      clearWatchlist: () => set({ items: [] }),

      hasSymbol: (symbol) =>
        get().items.some((item) => item.symbol === symbol.toUpperCase()),
    }),
    {
      name: 'wsw-watchlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
