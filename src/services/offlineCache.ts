/**
 * Offline Content Caching Service for Wall Street Wildlife Mobile
 *
 * Ensures the app works without internet by caching all educational content
 * (strategies, quizzes, vocabulary) to AsyncStorage with version tracking,
 * staleness detection, and automatic sync-on-reconnect.
 *
 * Key prefix: `cache_`
 * Each cached item stores: { data, timestamp, version }
 *
 * Default max cache ages:
 *   - strategies:  7 days
 *   - quizzes:     3 days
 *   - vocabulary: 30 days
 *   - lessons:     7 days
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';

// ── Key Prefix & Constants ────────────────────────────────────────────────────

const PREFIX = 'cache_';

/** Current cache schema version. Bump this on app updates that change data shapes. */
const CACHE_VERSION = 1;

/** Maximum cache ages in milliseconds, by data type. */
export const MAX_CACHE_AGE: Record<string, number> = {
  strategies: 7 * 24 * 60 * 60 * 1000,   // 7 days
  quizzes: 3 * 24 * 60 * 60 * 1000,       // 3 days
  vocabulary: 30 * 24 * 60 * 60 * 1000,   // 30 days
  lessons: 7 * 24 * 60 * 60 * 1000,       // 7 days
  glossary: 30 * 24 * 60 * 60 * 1000,     // 30 days
};

/** Default max age for uncategorized cache entries. */
const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── TypeScript Interfaces ─────────────────────────────────────────────────────

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  version: number;
}

export interface CacheStatus {
  strategies: CacheItemStatus;
  quizzes: CacheItemStatus;
  vocabulary: CacheItemStatus;
  totalSizeEstimate: number;
  lastSyncAt: string | null;
}

export interface CacheItemStatus {
  cached: boolean;
  stale: boolean;
  cachedAt: string | null;
  itemCount: number;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

// ── Internal Helpers ──────────────────────────────────────────────────────────

function cacheKey(key: string): string {
  return `${PREFIX}${key}`;
}

/**
 * Estimate the byte size of a string. Used for getCacheSize().
 * In UTF-8, most ASCII chars are 1 byte; we use string length as a rough proxy.
 */
function estimateByteSize(value: string): number {
  // Rough estimate: each character averages ~2 bytes for JSON with some unicode
  return value.length * 2;
}

/**
 * Check connectivity by attempting a lightweight fetch with a short timeout.
 * This avoids requiring @react-native-community/netinfo as a dependency.
 */
async function checkConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://clients3.google.com/generate_204', {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok || response.status === 204;
  } catch {
    return false;
  }
}

// ── Core Cache Operations ─────────────────────────────────────────────────────

/**
 * Write data to the cache with timestamp and version metadata.
 */
async function writeCache<T>(key: string, data: T): Promise<void> {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    version: CACHE_VERSION,
  };
  await AsyncStorage.setItem(cacheKey(key), JSON.stringify(entry));
}

/**
 * Read data from the cache. Returns null if not found or if the entry
 * was written with an older cache version (schema change invalidation).
 */
async function readCache<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(key));
    if (!raw) return null;

    const entry = JSON.parse(raw) as CacheEntry<T>;

    // Invalidate if version mismatch
    if (entry.version !== CACHE_VERSION) {
      await AsyncStorage.removeItem(cacheKey(key));
      return null;
    }

    return entry;
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Cache all strategy data for offline access.
 * Dynamically imports the strategies module to avoid circular dependencies.
 */
export async function cacheStrategies(): Promise<void> {
  try {
    const { allStrategies } = await import('../data/strategies/index');
    await writeCache('strategies', allStrategies);
  } catch (error) {
    console.error('[OfflineCache] Failed to cache strategies:', error);
    throw error;
  }
}

/**
 * Cache quiz data for offline quizzing.
 */
export async function cacheQuizzes(): Promise<void> {
  try {
    const { QUIZ_DATA } = await import('../data/quizData');
    await writeCache('quizzes', QUIZ_DATA);
  } catch (error) {
    console.error('[OfflineCache] Failed to cache quizzes:', error);
    throw error;
  }
}

/**
 * Cache vocabulary data for offline browsing.
 */
export async function cacheVocabulary(): Promise<void> {
  try {
    const { VOCABULARY_TERMS } = await import('../data/vocabularyData');
    await writeCache('vocabulary', VOCABULARY_TERMS);
  } catch (error) {
    console.error('[OfflineCache] Failed to cache vocabulary:', error);
    throw error;
  }
}

/**
 * Cache a specific lesson/strategy's content by its strategy ID.
 * This caches the individual strategy's full data including education content.
 */
export async function cacheLessonContent(strategyId: string): Promise<void> {
  try {
    const { getStrategyById } = await import('../data/strategies/index');
    const strategy = getStrategyById(strategyId);

    if (!strategy) {
      console.warn(`[OfflineCache] Strategy "${strategyId}" not found, skipping cache`);
      return;
    }

    await writeCache(`lessons_${strategyId}`, strategy);
  } catch (error) {
    console.error(`[OfflineCache] Failed to cache lesson "${strategyId}":`, error);
    throw error;
  }
}

/**
 * Retrieve cached data by key.
 * Returns the raw data (unwrapped from the CacheEntry envelope) or null.
 */
export async function getCachedData<T = unknown>(key: string): Promise<T | null> {
  const entry = await readCache<T>(key);
  return entry ? entry.data : null;
}

/**
 * Check if a cache entry is stale (older than the specified max age).
 * If no maxAgeMs is provided, uses the default for the data type.
 *
 * Returns true if the cache is stale or doesn't exist.
 */
export async function isCacheStale(key: string, maxAgeMs?: number): Promise<boolean> {
  const entry = await readCache(key);
  if (!entry) return true;

  const maxAge = maxAgeMs ?? MAX_CACHE_AGE[key] ?? DEFAULT_MAX_AGE;
  const age = Date.now() - entry.timestamp;
  return age > maxAge;
}

/**
 * Sync any offline changes when connectivity returns.
 *
 * This checks each cache type for staleness and refreshes stale entries.
 * For data that originates from the app's static bundles (strategies, quizzes,
 * vocabulary), syncing means re-caching from the latest in-memory data.
 *
 * For user-generated data that might have been created offline (progress, trades),
 * those are handled by their respective stores (JungleContext, useMissions, etc.)
 * which already sync to Supabase independently.
 */
export async function syncOnReconnect(): Promise<void> {
  const online = await checkConnectivity();
  if (!online) {
    console.warn('[OfflineCache] Still offline, sync skipped');
    return;
  }

  try {
    const refreshTasks: Promise<void>[] = [];

    if (await isCacheStale('strategies')) {
      refreshTasks.push(cacheStrategies());
    }
    if (await isCacheStale('quizzes')) {
      refreshTasks.push(cacheQuizzes());
    }
    if (await isCacheStale('vocabulary')) {
      refreshTasks.push(cacheVocabulary());
    }

    await Promise.all(refreshTasks);

    // Record sync timestamp
    await AsyncStorage.setItem(cacheKey('last_sync'), new Date().toISOString());
  } catch (error) {
    console.error('[OfflineCache] Sync on reconnect failed:', error);
    throw error;
  }
}

/**
 * Get an estimate of total cache size in bytes.
 * Scans all AsyncStorage keys with the cache prefix and sums their sizes.
 */
export async function getCacheSize(): Promise<number> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = allKeys.filter((key) => key.startsWith(PREFIX));

    if (cacheKeys.length === 0) return 0;

    const entries = await AsyncStorage.multiGet(cacheKeys);
    let totalSize = 0;

    for (const [key, value] of entries) {
      if (value) {
        // Include key size + value size
        totalSize += estimateByteSize(key) + estimateByteSize(value);
      }
    }

    return totalSize;
  } catch (error) {
    console.error('[OfflineCache] Failed to calculate cache size:', error);
    return 0;
  }
}

/**
 * Clear cached data. If a type is specified, only clear that cache type.
 * If no type is specified, clear all cached data.
 *
 * @param type - Optional: 'strategies' | 'quizzes' | 'vocabulary' | 'lessons' | undefined (all)
 */
export async function clearCache(type?: string): Promise<void> {
  try {
    if (type) {
      // Clear a specific type
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToRemove = allKeys.filter((key) => {
        if (type === 'lessons') {
          // Lessons are stored as cache_lessons_{strategyId}
          return key.startsWith(`${PREFIX}lessons_`);
        }
        return key === cacheKey(type);
      });

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } else {
      // Clear all cache entries
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter((key) => key.startsWith(PREFIX));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    }
  } catch (error) {
    console.error('[OfflineCache] Failed to clear cache:', error);
    throw error;
  }
}

/**
 * Check current connectivity status.
 * Uses a lightweight HTTP request with a 5-second timeout.
 */
export async function isOffline(): Promise<boolean> {
  const connected = await checkConnectivity();
  return !connected;
}

/**
 * Cache all content types at once. Useful for initial app load or
 * when the user explicitly requests offline preparation.
 */
export async function cacheAllContent(): Promise<void> {
  await Promise.all([
    cacheStrategies(),
    cacheQuizzes(),
    cacheVocabulary(),
  ]);
  await AsyncStorage.setItem(cacheKey('last_sync'), new Date().toISOString());
}

/**
 * Get detailed cache status for all content types.
 */
export async function getCacheStatus(): Promise<CacheStatus> {
  const [strategiesEntry, quizzesEntry, vocabularyEntry, totalSize, lastSync] =
    await Promise.all([
      readCache('strategies'),
      readCache('quizzes'),
      readCache('vocabulary'),
      getCacheSize(),
      AsyncStorage.getItem(cacheKey('last_sync')).catch(() => null),
    ]);

  const makeItemStatus = (
    entry: CacheEntry | null,
    maxAge: number
  ): CacheItemStatus => {
    if (!entry) {
      return { cached: false, stale: true, cachedAt: null, itemCount: 0 };
    }

    const stale = Date.now() - entry.timestamp > maxAge;
    const itemCount = Array.isArray(entry.data) ? entry.data.length : 1;

    return {
      cached: true,
      stale,
      cachedAt: new Date(entry.timestamp).toISOString(),
      itemCount,
    };
  };

  return {
    strategies: makeItemStatus(strategiesEntry, MAX_CACHE_AGE.strategies),
    quizzes: makeItemStatus(quizzesEntry, MAX_CACHE_AGE.quizzes),
    vocabulary: makeItemStatus(vocabularyEntry, MAX_CACHE_AGE.vocabulary),
    totalSizeEstimate: totalSize,
    lastSyncAt: lastSync,
  };
}

// ── React Hook ────────────────────────────────────────────────────────────────

/**
 * useOfflineCache hook
 *
 * Provides reactive connectivity status, cache status, and sync status
 * for use in React components. Automatically monitors connectivity
 * and triggers sync when the app comes online.
 *
 * Usage:
 *   const { isOffline, cacheStatus, syncStatus } = useOfflineCache();
 */
export function useOfflineCache() {
  const [offline, setOffline] = useState<boolean>(false);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const wasOfflineRef = useRef<boolean>(false);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check connectivity and update state
  const checkConnection = useCallback(async () => {
    const isCurrentlyOffline = await isOffline();
    setOffline(isCurrentlyOffline);

    // If we were offline and are now online, trigger sync
    if (wasOfflineRef.current && !isCurrentlyOffline) {
      setSyncStatus('syncing');
      try {
        await syncOnReconnect();
        setSyncStatus('synced');

        // Reset to idle after a short delay
        setTimeout(() => setSyncStatus('idle'), 3000);
      } catch {
        setSyncStatus('error');
      }
    }

    wasOfflineRef.current = isCurrentlyOffline;
  }, []);

  // Refresh cache status info
  const refreshCacheStatus = useCallback(async () => {
    try {
      const status = await getCacheStatus();
      setCacheStatus(status);
    } catch {
      // Silently fail
    }
  }, []);

  // Set up connectivity monitoring
  useEffect(() => {
    // Initial checks
    checkConnection();
    refreshCacheStatus();

    // Periodic connectivity check (every 30 seconds)
    checkIntervalRef.current = setInterval(checkConnection, 30000);

    // Monitor app state for foreground/background transitions
    const appStateHandler = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        checkConnection();
        refreshCacheStatus();
      }
    };

    const subscription = AppState.addEventListener('change', appStateHandler);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      subscription.remove();
    };
  }, [checkConnection, refreshCacheStatus]);

  return {
    /** Whether the device is currently offline. */
    isOffline: offline,
    /** Detailed cache status for each content type, or null while loading. */
    cacheStatus,
    /** Current sync operation status: 'idle' | 'syncing' | 'synced' | 'error'. */
    syncStatus,
    /** Manually trigger a cache status refresh. */
    refreshCacheStatus,
    /** Manually trigger a connectivity check. */
    checkConnection,
  };
}
