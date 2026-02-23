// Hook for fetching full options chain data from Tradier
// Provides real-time chain data with Greeks for Event Horizons tools
// Ported from desktop: localStorage -> AsyncStorage, sync getApiKey -> async

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getApiKey,
  fetchQuote,
  fetchExpirations,
  fetchOptionsChain,
  calculateDTE,
  OptionData,
} from '../services/tradierApi';

export interface OptionsChainData {
  ticker: string;
  stockPrice: number;
  stockChange: number;
  stockChangePercent: number;
  expirations: string[];
  selectedExpiration: string;
  daysToExpiration: number;
  calls: OptionData[];
  puts: OptionData[];
  lastUpdated: Date;
  dataQuality: 'real' | 'unavailable';
  error?: string;
}

interface UseOptionsChainOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds, default: 30 seconds for chain data
}

interface ChainCacheEntry {
  data: OptionsChainData;
  expiresAt: number;
}

// Cache for chain data (30 second TTL for real-time feel)
const chainCache = new Map<string, ChainCacheEntry>();
const CHAIN_CACHE_TTL = 30 * 1000; // 30 seconds

/**
 * Hook to fetch complete options chain data for a ticker
 */
export const useOptionsChain = (
  ticker: string | null,
  options: UseOptionsChainOptions = {}
) => {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [data, setData] = useState<OptionsChainData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpiration, setSelectedExpiration] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check API key availability on mount
  useEffect(() => {
    getApiKey().then((key) => setIsConfigured(!!key));
  }, []);

  // Fetch full chain data
  const fetchChainData = useCallback(async (expiration?: string) => {
    if (!ticker) {
      setData(null);
      return;
    }

    const apiKey = await getApiKey();
    if (!apiKey) {
      setError('Tradier API key not configured');
      setIsConfigured(false);
      setData({
        ticker,
        stockPrice: 0,
        stockChange: 0,
        stockChangePercent: 0,
        expirations: [],
        selectedExpiration: '',
        daysToExpiration: 0,
        calls: [],
        puts: [],
        lastUpdated: new Date(),
        dataQuality: 'unavailable',
        error: 'API key not configured',
      });
      return;
    }

    setIsConfigured(true);

    // Use provided expiration or selected one
    const targetExpiration = expiration || selectedExpiration;

    // Check cache
    const cacheKey = `${ticker}-${targetExpiration || 'default'}`;
    const cached = chainCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      setData(cached.data);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch quote
      const quote = await fetchQuote(ticker);

      // Fetch expirations
      const expirations = await fetchExpirations(ticker);
      if (expirations.length === 0) {
        throw new Error(`No options available for ${ticker}`);
      }

      // Use first expiration if none selected
      const expToUse = targetExpiration || expirations[0];

      // Update selected expiration state if not set
      if (!selectedExpiration && !targetExpiration) {
        setSelectedExpiration(expToUse);
      }

      const dte = calculateDTE(expToUse);

      // Fetch options chain
      const { calls, puts } = await fetchOptionsChain(ticker, expToUse);

      const result: OptionsChainData = {
        ticker,
        stockPrice: quote.price,
        stockChange: quote.change,
        stockChangePercent: quote.changePercent,
        expirations,
        selectedExpiration: expToUse,
        daysToExpiration: dte,
        calls,
        puts,
        lastUpdated: new Date(),
        dataQuality: 'real',
      };

      // Cache the result
      chainCache.set(cacheKey, {
        data: result,
        expiresAt: Date.now() + CHAIN_CACHE_TTL,
      });

      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch options chain';
      setError(errorMessage);
      setData({
        ticker,
        stockPrice: 0,
        stockChange: 0,
        stockChangePercent: 0,
        expirations: [],
        selectedExpiration: '',
        daysToExpiration: 0,
        calls: [],
        puts: [],
        lastUpdated: new Date(),
        dataQuality: 'unavailable',
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [ticker, selectedExpiration]);

  // Handle expiration change
  const changeExpiration = useCallback((expiration: string) => {
    setSelectedExpiration(expiration);
    // Clear cache for new expiration fetch
    const cacheKey = `${ticker}-${expiration}`;
    chainCache.delete(cacheKey);
    fetchChainData(expiration);
  }, [ticker, fetchChainData]);

  // Initial fetch
  useEffect(() => {
    if (ticker) {
      fetchChainData();
    }
  }, [ticker]); // Only re-fetch when ticker changes

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !ticker) return;

    const interval = setInterval(() => fetchChainData(), refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, ticker, fetchChainData]);

  // Computed values for UI convenience
  const atmStrike = useMemo(() => {
    if (!data?.stockPrice || data.calls.length === 0) return null;
    const price = data.stockPrice;
    return data.calls.reduce((nearest, opt) => {
      const nearestDiff = Math.abs(nearest.strike - price);
      const optDiff = Math.abs(opt.strike - price);
      return optDiff < nearestDiff ? opt : nearest;
    }).strike;
  }, [data]);

  const strikesWithData = useMemo(() => {
    if (!data) return [];

    // Get unique strikes from both calls and puts
    const strikes = new Set<number>();
    data.calls.forEach(c => strikes.add(c.strike));
    data.puts.forEach(p => strikes.add(p.strike));

    return Array.from(strikes).sort((a, b) => a - b);
  }, [data]);

  // Get call and put for a specific strike
  const getOptionsAtStrike = useCallback((strike: number) => {
    if (!data) return { call: null, put: null };
    return {
      call: data.calls.find(c => c.strike === strike) || null,
      put: data.puts.find(p => p.strike === strike) || null,
    };
  }, [data]);

  return {
    data,
    loading,
    error,
    refresh: fetchChainData,
    changeExpiration,
    selectedExpiration,
    atmStrike,
    strikesWithData,
    getOptionsAtStrike,
    isConfigured,
  };
};

/**
 * Clear options chain cache
 */
export const clearChainCache = (): void => {
  chainCache.clear();
};

export default useOptionsChain;
