/**
 * Widget Data Provider for Wall Street Wildlife Mobile
 *
 * Prepares and caches widget-ready data that a future native iOS widget
 * extension can read via shared App Group UserDefaults.
 *
 * For now, all data is persisted to AsyncStorage with a `widget_` prefix.
 * When the native widget extension is added, this service will be updated
 * to write to shared UserDefaults via expo-shared-preferences or a native module.
 *
 * Data types:
 *   - quote:     Today's wisdom quote (text, author, bias)
 *   - streak:    Current streak count, daily mission progress, bonus XP
 *   - watchlist: Top 5 watchlist items with ticker, last price, IV rank
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { WISDOM_QUOTES, WisdomQuote } from '../data/quotes';
import { useWatchlistStore, WatchlistItem } from '../stores/watchlistStore';

// ── Key Prefix ────────────────────────────────────────────────────────────────

const PREFIX = 'widget_';

const KEYS = {
  quote: `${PREFIX}quote`,
  streak: `${PREFIX}streak`,
  watchlist: `${PREFIX}watchlist`,
  lastUpdate: `${PREFIX}last_update`,
} as const;

// ── TypeScript Interfaces ─────────────────────────────────────────────────────

export interface QuoteWidgetData {
  text: string;
  author: string;
  source?: string;
  bias: string;
  category: string;
  updatedAt: string;
}

export interface StreakWidgetData {
  streakDays: number;
  missionsCompleted: number;
  missionsTotal: number;
  bonusXP: number;
  level: number;
  levelName: string;
  updatedAt: string;
}

export interface WatchlistWidgetItem {
  ticker: string;
  name: string;
  lastPrice: number | null;
  change: number | null;
  changePercent: number | null;
  ivRank: number | null;
}

export interface WatchlistWidgetData {
  items: WatchlistWidgetItem[];
  updatedAt: string;
}

export type WidgetType = 'quote' | 'streak' | 'watchlist';

export type WidgetDataMap = {
  quote: QuoteWidgetData;
  streak: StreakWidgetData;
  watchlist: WatchlistWidgetData;
};

// ── Internal Helpers ──────────────────────────────────────────────────────────

/**
 * Pick a deterministic daily quote using the day-of-year as seed.
 * This ensures the quote changes once per day and is consistent across renders.
 */
function getDailyQuote(): WisdomQuote {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % WISDOM_QUOTES.length;
  return WISDOM_QUOTES[index];
}

/**
 * Read mission state from AsyncStorage (matches useMissions storage key).
 */
async function readMissionState(): Promise<{
  dailyMissions: Array<{
    missionId: string;
    currentProgress: number;
    targetProgress: number;
    completedAt: string | null;
    claimedAt: string | null;
  }>;
  missionStreak: number;
} | null> {
  try {
    const raw = await AsyncStorage.getItem('wsw-missions');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Read jungle progress from AsyncStorage (matches JungleContext storage key).
 */
async function readJungleProgress(): Promise<{
  xp: number;
  streakDays: number;
} | null> {
  try {
    const raw = await AsyncStorage.getItem('jungle-progress');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Compute the level from XP using the same thresholds as JungleContext.
 * Inlined here to avoid importing the full context/data dependency tree.
 */
function getLevelFromXP(xp: number): { level: number; name: string } {
  const levels = [
    { level: 1, name: 'Jungle Seedling', xp: 0 },
    { level: 2, name: 'Vine Swinger', xp: 100 },
    { level: 3, name: 'Trail Blazer', xp: 300 },
    { level: 4, name: 'Canopy Scout', xp: 600 },
    { level: 5, name: 'Jungle Navigator', xp: 1000 },
    { level: 6, name: 'Apex Observer', xp: 1500 },
    { level: 7, name: 'Wildlife Tracker', xp: 2200 },
    { level: 8, name: 'Jungle Strategist', xp: 3000 },
    { level: 9, name: 'Alpha Predator', xp: 4000 },
    { level: 10, name: 'Jungle Master', xp: 5500 },
  ];

  let current = levels[0];
  for (const lvl of levels) {
    if (xp >= lvl.xp) {
      current = lvl;
    } else {
      break;
    }
  }
  return { level: current.level, name: current.name };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Update the quote widget data with today's wisdom quote.
 * Picks a deterministic daily quote so the widget shows a fresh quote each day.
 */
export async function updateQuoteWidget(): Promise<void> {
  try {
    const quote = getDailyQuote();

    const data: QuoteWidgetData = {
      text: quote.text,
      author: quote.author,
      source: quote.source,
      bias: quote.bias || 'General Wisdom',
      category: quote.category,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(KEYS.quote, JSON.stringify(data));
  } catch (error) {
    console.error('[WidgetDataProvider] Failed to update quote widget:', error);
  }
}

/**
 * Update the streak widget data with current streak count and daily mission progress.
 * Reads from the same AsyncStorage keys that JungleContext and useMissions write to.
 */
export async function updateStreakWidget(): Promise<void> {
  try {
    const [jungleProgress, missionState] = await Promise.all([
      readJungleProgress(),
      readMissionState(),
    ]);

    const streakDays = jungleProgress?.streakDays ?? 0;
    const xp = jungleProgress?.xp ?? 0;
    const { level, name: levelName } = getLevelFromXP(xp);

    // Count completed daily missions
    let missionsCompleted = 0;
    let missionsTotal = 0;
    let bonusXP = 0;

    if (missionState?.dailyMissions) {
      missionsTotal = missionState.dailyMissions.length;
      for (const mission of missionState.dailyMissions) {
        if (mission.completedAt) {
          missionsCompleted++;
        }
      }
    }

    // Bonus XP for streak milestones
    if (streakDays >= 30) {
      bonusXP = 50;
    } else if (streakDays >= 14) {
      bonusXP = 25;
    } else if (streakDays >= 7) {
      bonusXP = 15;
    } else if (streakDays >= 3) {
      bonusXP = 5;
    }

    const data: StreakWidgetData = {
      streakDays,
      missionsCompleted,
      missionsTotal,
      bonusXP,
      level,
      levelName,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(KEYS.streak, JSON.stringify(data));
  } catch (error) {
    console.error('[WidgetDataProvider] Failed to update streak widget:', error);
  }
}

/**
 * Update the watchlist widget data with the top 5 watchlist items.
 * Reads the watchlist from the Zustand store and attempts to fetch
 * latest prices from the Tradier API cache in AsyncStorage.
 */
export async function updateWatchlistWidget(): Promise<void> {
  try {
    // Read watchlist from Zustand persisted storage
    const watchlistState = useWatchlistStore.getState();
    const items: WatchlistItem[] = watchlistState.items.slice(0, 5);

    // Try to read cached market data for each symbol
    const widgetItems: WatchlistWidgetItem[] = await Promise.all(
      items.map(async (item) => {
        let lastPrice: number | null = null;
        let change: number | null = null;
        let changePercent: number | null = null;
        let ivRank: number | null = null;

        // Attempt to read cached quote data (Tradier API caches to AsyncStorage)
        try {
          const cachedQuote = await AsyncStorage.getItem(`tradier_quote_${item.symbol}`);
          if (cachedQuote) {
            const parsed = JSON.parse(cachedQuote);
            lastPrice = parsed.last ?? parsed.price ?? null;
            change = parsed.change ?? null;
            changePercent = parsed.change_percentage ?? parsed.changePercent ?? null;
          }
        } catch {
          // No cached data available, that's fine
        }

        // Attempt to read cached IV rank data
        try {
          const cachedIV = await AsyncStorage.getItem(`tradier_iv_${item.symbol}`);
          if (cachedIV) {
            const parsed = JSON.parse(cachedIV);
            ivRank = parsed.ivRank ?? parsed.iv_rank ?? null;
          }
        } catch {
          // No cached IV data
        }

        return {
          ticker: item.symbol,
          name: item.name,
          lastPrice,
          change,
          changePercent,
          ivRank,
        };
      })
    );

    const data: WatchlistWidgetData = {
      items: widgetItems,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(KEYS.watchlist, JSON.stringify(data));
  } catch (error) {
    console.error('[WidgetDataProvider] Failed to update watchlist widget:', error);
  }
}

/**
 * Read cached widget data by type.
 * Returns null if no data is cached for the requested type.
 */
export async function getWidgetData<T extends WidgetType>(
  type: T
): Promise<WidgetDataMap[T] | null> {
  try {
    const key = KEYS[type];
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as WidgetDataMap[T];
  } catch (error) {
    console.error(`[WidgetDataProvider] Failed to read ${type} widget data:`, error);
    return null;
  }
}

/**
 * Update all widget data at once.
 * Called by scheduleWidgetUpdates on each refresh cycle.
 */
export async function updateAllWidgets(): Promise<void> {
  await Promise.all([
    updateQuoteWidget(),
    updateStreakWidget(),
    updateWatchlistWidget(),
  ]);

  await AsyncStorage.setItem(KEYS.lastUpdate, new Date().toISOString());
}

/**
 * Get the timestamp of the last widget data update.
 */
export async function getLastUpdateTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.lastUpdate);
  } catch {
    return null;
  }
}

// ── Background Refresh Scheduling ─────────────────────────────────────────────

// Track the AppState listener subscription
let appStateSubscription: { remove: () => void } | null = null;
// Interval handle for periodic refresh while app is foregrounded
let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

// Refresh interval: 15 minutes when app is in foreground
const FOREGROUND_REFRESH_MS = 15 * 60 * 1000;

/**
 * Set up background task to refresh widget data periodically.
 *
 * Strategy:
 *   1. Update all widgets immediately on call.
 *   2. Set up a foreground interval (every 15 min) to keep data fresh.
 *   3. Listen for app state changes:
 *      - When app comes to foreground, refresh immediately and start interval.
 *      - When app goes to background, clear interval (saves battery).
 *
 * Note: True background fetch requires expo-background-fetch and expo-task-manager.
 * Those are not added yet, so for now we rely on foreground intervals and
 * refresh-on-resume. When the native widget extension is built, background
 * fetch can be registered to keep widget data fresh even when the app is closed.
 */
export function scheduleWidgetUpdates(): () => void {
  // Initial update
  updateAllWidgets().catch((err) =>
    console.error('[WidgetDataProvider] Initial update failed:', err)
  );

  // Start foreground refresh interval
  const startInterval = () => {
    if (refreshIntervalId) clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval(() => {
      updateAllWidgets().catch((err) =>
        console.error('[WidgetDataProvider] Periodic update failed:', err)
      );
    }, FOREGROUND_REFRESH_MS);
  };

  const stopInterval = () => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
    }
  };

  startInterval();

  // Listen for app state changes
  const handleAppStateChange = (nextState: AppStateStatus) => {
    if (nextState === 'active') {
      // App came to foreground -- refresh immediately and restart interval
      updateAllWidgets().catch((err) =>
        console.error('[WidgetDataProvider] Resume update failed:', err)
      );
      startInterval();
    } else {
      // App went to background or inactive -- stop interval
      stopInterval();
    }
  };

  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

  // Return cleanup function
  return () => {
    stopInterval();
    if (appStateSubscription) {
      appStateSubscription.remove();
      appStateSubscription = null;
    }
  };
}

/**
 * Clear all cached widget data.
 * Useful for logout or data reset scenarios.
 */
export async function clearWidgetData(): Promise<void> {
  try {
    const allKeys = Object.values(KEYS);
    await AsyncStorage.multiRemove(allKeys);
  } catch (error) {
    console.error('[WidgetDataProvider] Failed to clear widget data:', error);
  }
}
