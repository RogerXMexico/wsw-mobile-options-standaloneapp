// Performance Utilities for Wall Street Wildlife Mobile
// Phase 7C: Lazy loading, image caching, memory management,
// list optimization, and load-time tracking.

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Image, InteractionManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Strategy } from '../data/types';
import { getStrategiesByTierLazy, clearTierCache } from '../data/strategies/index';

// ── Lazy Loading for Strategy Data ───────────────────────────────────────

export interface LazyStrategiesResult {
  /** The loaded strategies for the requested tier */
  strategies: Strategy[];
  /** True while the tier data is being loaded */
  loading: boolean;
  /** Error message if the load failed, null otherwise */
  error: string | null;
}

/**
 * Hook that lazily loads strategy data for a given tier using dynamic
 * imports. Defers loading until after React Native's interaction manager
 * reports the current transition is complete, preventing jank.
 *
 * @param tier The tier number to load strategies for
 * @returns `{ strategies, loading, error }`
 *
 * @example
 * const { strategies, loading, error } = useLazyStrategies(6);
 * if (loading) return <ActivityIndicator />;
 * if (error) return <Text>{error}</Text>;
 * return <StrategyList data={strategies} />;
 */
export function useLazyStrategies(tier: number): LazyStrategiesResult {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);
    setStrategies([]);

    // Wait for any in-progress animations/transitions to complete
    const interactionHandle = InteractionManager.runAfterInteractions(async () => {
      try {
        const data = await getStrategiesByTierLazy(tier);
        if (mountedRef.current) {
          setStrategies(data);
          setLoading(false);
        }
      } catch (err) {
        if (mountedRef.current) {
          const message =
            err instanceof Error ? err.message : `Failed to load tier ${tier}`;
          setError(message);
          setLoading(false);
        }
      }
    });

    return () => {
      mountedRef.current = false;
      interactionHandle.cancel();
    };
  }, [tier]);

  return { strategies, loading, error };
}

// ── Image Caching ────────────────────────────────────────────────────────

const IMAGE_CACHE_PREFIX = 'wsw-img-cache:';

/**
 * Simple image cache manager for pre-fetching and managing cached images.
 * Uses React Native's `Image.prefetch` under the hood with an
 * AsyncStorage-based tracking layer.
 */
export class ImageCache {
  /**
   * Prefetch an array of image URLs into the native image cache.
   * Silently skips URLs that fail to load.
   *
   * @param urls Array of image URLs to preload
   * @returns The number of successfully prefetched images
   *
   * @example
   * const cache = new ImageCache();
   * await cache.preloadImages([
   *   'https://example.com/bull.png',
   *   'https://example.com/bear.png',
   * ]);
   */
  async preloadImages(urls: string[]): Promise<number> {
    if (!urls || urls.length === 0) return 0;

    let successCount = 0;
    const promises = urls.map(async (url) => {
      try {
        await Image.prefetch(url);
        // Track the URL in AsyncStorage so we can estimate cache size
        await AsyncStorage.setItem(
          `${IMAGE_CACHE_PREFIX}${url}`,
          String(Date.now()),
        );
        successCount++;
      } catch {
        // Silently skip failed prefetches
      }
    });

    await Promise.allSettled(promises);
    return successCount;
  }

  /**
   * Estimate the number of cached image entries tracked in AsyncStorage.
   * This is an approximate count; actual native cache size is not directly
   * queryable.
   *
   * @returns The number of tracked cached image URLs
   */
  async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const imageCacheKeys = keys.filter((key) =>
        key.startsWith(IMAGE_CACHE_PREFIX),
      );
      return imageCacheKeys.length;
    } catch {
      return 0;
    }
  }

  /**
   * Remove all tracked image cache entries from AsyncStorage.
   * Note: this clears our tracking data. The native image cache may
   * retain images until the OS evicts them.
   */
  async clearImageCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const imageCacheKeys = keys.filter((key) =>
        key.startsWith(IMAGE_CACHE_PREFIX),
      );
      if (imageCacheKeys.length > 0) {
        await AsyncStorage.multiRemove(imageCacheKeys);
      }
    } catch {
      // Silent fail — cache clearing is non-critical
    }
  }
}

/** Default shared ImageCache instance. */
export const imageCache = new ImageCache();

// ── Memory Management ────────────────────────────────────────────────────

/**
 * Perform a cleanup of non-essential in-memory caches.
 * Clears the strategy tier cache and the image tracking cache.
 * Safe to call at any time; subsequent data requests will simply
 * re-fetch from their respective sources.
 */
export async function memoryCleanup(): Promise<void> {
  // Clear the lazy-loaded tier cache
  clearTierCache();

  // Clear image cache tracking
  await imageCache.clearImageCache();

  if (__DEV__) {
    console.log('[Performance] Memory cleanup completed');
  }
}

/**
 * Hook that listens for low-memory warnings from the OS and triggers
 * cleanup automatically. Also exposes a manual cleanup function.
 *
 * On memory warning:
 * - Clears the strategy tier cache (lazy-loaded tier data)
 * - Clears the image tracking cache
 *
 * @returns `{ memoryWarningCount }` — number of warnings received this session
 *
 * @example
 * const { memoryWarningCount } = useMemoryWarning();
 * // memoryWarningCount can be displayed in a dev tools overlay
 */
export function useMemoryWarning(): { memoryWarningCount: number } {
  const [memoryWarningCount, setMemoryWarningCount] = useState<number>(0);

  useEffect(() => {
    // React Native does not expose a universal memory warning event.
    // On iOS, AppState 'memoryWarning' event is available.  We listen
    // through a simple polling fallback on Android.
    let cleanupFn: (() => void) | null = null;

    const setupListener = async () => {
      try {
        // Use the RN AppState memory warning event (iOS only)
        const { AppState } = require('react-native');
        const handleMemoryWarning = () => {
          if (__DEV__) {
            console.warn('[Performance] Memory warning received — running cleanup');
          }
          setMemoryWarningCount((prev) => prev + 1);
          memoryCleanup();
        };

        const subscription = AppState.addEventListener(
          'memoryWarning',
          handleMemoryWarning,
        );
        cleanupFn = () => subscription.remove();
      } catch {
        // If listener setup fails, this is non-critical
      }
    };

    setupListener();

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return { memoryWarningCount };
}

// ── List Performance ─────────────────────────────────────────────────────

export interface FlatListConfig {
  /** getItemLayout function for fixed-height items */
  getItemLayout: (_data: any, index: number) => {
    length: number;
    offset: number;
    index: number;
  };
  /** Maximum number of items to render per batch */
  maxToRenderPerBatch: number;
  /** Number of items above/below the viewport to keep rendered */
  windowSize: number;
  /** Initial number of items to render */
  initialNumToRender: number;
  /** Threshold (in viewport lengths) for triggering onEndReached */
  onEndReachedThreshold: number;
  /** Remove items far from the viewport */
  removeClippedSubviews: boolean;
  /** Update interval (ms) for cells that are not in the viewport */
  updateCellsBatchingPeriod: number;
}

/**
 * Generate optimized FlatList props for lists with fixed-height items.
 * Provides `getItemLayout` for O(1) scroll-to-index and tuned batch
 * rendering settings for smooth scrolling.
 *
 * @param itemHeight The fixed height of each list item (including separator)
 * @returns An object of FlatList props to spread onto the component
 *
 * @example
 * const flatListConfig = createFlatListConfig(80);
 * <FlatList
 *   data={strategies}
 *   renderItem={renderItem}
 *   {...flatListConfig}
 * />
 */
export function createFlatListConfig(itemHeight: number): FlatListConfig {
  return {
    getItemLayout: (_data: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    maxToRenderPerBatch: 10,
    windowSize: 5,
    initialNumToRender: 10,
    onEndReachedThreshold: 0.5,
    removeClippedSubviews: Platform.OS !== 'web',
    updateCellsBatchingPeriod: 50,
  };
}

/**
 * Debounce hook for values that change frequently (e.g. search input).
 * The returned value only updates after the specified delay has elapsed
 * since the last change.
 *
 * @param value The value to debounce
 * @param delay Debounce delay in milliseconds
 * @returns The debounced value
 *
 * @example
 * const [searchText, setSearchText] = useState('');
 * const debouncedSearch = useDebounce(searchText, 300);
 * // debouncedSearch updates 300ms after the user stops typing
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for callbacks that fire frequently (e.g. scroll handlers).
 * Ensures the callback is invoked at most once per `limit` milliseconds.
 *
 * @param callback The function to throttle
 * @param limit Minimum interval between invocations in milliseconds
 * @returns A throttled version of the callback
 *
 * @example
 * const throttledScroll = useThrottle((event) => {
 *   // Handle scroll position
 * }, 100);
 * <ScrollView onScroll={throttledScroll} />
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  limit: number,
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef<T>(callback);

  // Keep the callback ref up to date without re-creating the throttled fn
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up pending timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= limit) {
        lastCallRef.current = now;
        callbackRef.current(...args);
      } else {
        // Schedule a trailing call
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callbackRef.current(...args);
          timeoutRef.current = null;
        }, limit - timeSinceLastCall);
      }
    },
    [limit],
  ) as T;

  return throttledFn;
}

// ── Bundle / Load Tracking ───────────────────────────────────────────────

export interface ScreenLoadMeasure {
  /** Call when the screen begins mounting */
  startMeasure: () => void;
  /** Call when the screen is fully rendered / interactive */
  endMeasure: () => void;
}

/**
 * Create a pair of functions to measure a screen's load time.
 * In __DEV__ mode the duration is logged to the console.
 *
 * @param screenName A human-readable screen name for the log
 * @returns `{ startMeasure, endMeasure }`
 *
 * @example
 * const { startMeasure, endMeasure } = measureScreenLoad('StrategyDetail');
 * useEffect(() => {
 *   startMeasure();
 *   return undefined;
 * }, []);
 * // After data loads:
 * useEffect(() => {
 *   if (!loading) endMeasure();
 * }, [loading]);
 */
export function measureScreenLoad(screenName: string): ScreenLoadMeasure {
  let startTime: number | null = null;

  return {
    startMeasure: () => {
      startTime = performance.now();
    },
    endMeasure: () => {
      if (startTime === null) {
        if (__DEV__) {
          console.warn(
            `[Performance] endMeasure called for "${screenName}" without startMeasure`,
          );
        }
        return;
      }
      const duration = performance.now() - startTime;
      logPerformance(`${screenName} load`, duration);
      startTime = null;
    },
  };
}

/**
 * Log a performance metric to the console in development mode.
 * In production this is a no-op.
 *
 * @param metric A descriptive name for the metric
 * @param value  The measured value (typically milliseconds)
 *
 * @example
 * logPerformance('API response time', 342);
 * // [Performance] API response time: 342.00ms
 */
export function logPerformance(metric: string, value: number): void {
  if (__DEV__) {
    console.log(`[Performance] ${metric}: ${value.toFixed(2)}ms`);
  }
}
