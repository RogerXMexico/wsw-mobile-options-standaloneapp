// React Hook for Tradier Options Data
// Provides real IV, IV Rank, and expected move calculations for Event Horizons
// Ported from desktop: sync getApiKey -> async, localStorage IV -> AsyncStorage IV

import { useState, useEffect, useCallback } from 'react';
import {
  getApiKey,
  fetchQuote,
  fetchExpirations,
  fetchOptionsChain,
  fetchHistoricalData,
  calculateHistoricalVolatility,
  findNearestExpiration,
  findNearestStrike,
  recordIVReading,
  getSymbolIVHistory,
  calculateIVRank,
  calculateIVPercentile,
  calculateDTE,
} from '../services/tradierApi';

export interface OptionsVolatilityData {
  ticker: string;
  stockPrice: number;
  atmIV: number; // At-the-money implied volatility
  ivRank: number; // IV Rank (0-100, or -1 if insufficient history)
  ivPercentile: number; // IV Percentile (0-100, or -1 if insufficient history)
  historicalVolatility: number; // 20-day HV
  expectedMove: number; // Expected move in percentage
  expectedMoveAbsolute: number; // Expected move in dollars
  daysToExpiration: number;
  nearestExpiration: string;
  dataQuality: 'real' | 'estimated' | 'unavailable';
  lastUpdated: Date;
  error?: string;
}

interface UseTradierOptionsDataOptions {
  minDaysToExpiration?: number; // Default: 7
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds, default: 5 minutes
}

interface CacheEntry {
  data: OptionsVolatilityData;
  expiresAt: number;
}

// Cache for options data (5 minute TTL)
const optionsCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to fetch options volatility data for a single ticker
 */
export const useTradierOptionsData = (
  ticker: string | null,
  options: UseTradierOptionsDataOptions = {}
) => {
  const { minDaysToExpiration = 7, autoRefresh = false, refreshInterval = 300000 } = options;

  const [data, setData] = useState<OptionsVolatilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check API key availability on mount
  useEffect(() => {
    getApiKey().then((key) => setIsConfigured(!!key));
  }, []);

  const fetchData = useCallback(async () => {
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
        atmIV: 0,
        ivRank: -1,
        ivPercentile: -1,
        historicalVolatility: 0,
        expectedMove: 0,
        expectedMoveAbsolute: 0,
        daysToExpiration: 0,
        nearestExpiration: '',
        dataQuality: 'unavailable',
        lastUpdated: new Date(),
        error: 'API key not configured',
      });
      return;
    }

    setIsConfigured(true);

    // Check cache first
    const cacheKey = `${ticker}-${minDaysToExpiration}`;
    const cached = optionsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      setData(cached.data);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch stock quote
      const quote = await fetchQuote(ticker);

      // Fetch expirations
      const expirations = await fetchExpirations(ticker);
      if (expirations.length === 0) {
        throw new Error(`No options available for ${ticker}`);
      }

      // Find nearest expiration at least minDays out
      const nearestExp = findNearestExpiration(expirations, minDaysToExpiration);
      if (!nearestExp) {
        throw new Error(`No suitable expiration found for ${ticker}`);
      }

      const dte = calculateDTE(nearestExp);

      // Fetch options chain
      const { calls, puts } = await fetchOptionsChain(ticker, nearestExp);
      if (calls.length === 0 && puts.length === 0) {
        throw new Error(`No options data for ${ticker} at ${nearestExp}`);
      }

      // Find ATM options
      const atmCall = findNearestStrike(calls, quote.price);
      const atmPut = findNearestStrike(puts, quote.price);

      // Calculate ATM IV (average of call and put ATM IV)
      let atmIV = 0;
      if (atmCall && atmPut) {
        atmIV = (atmCall.iv + atmPut.iv) / 2;
      } else if (atmCall) {
        atmIV = atmCall.iv;
      } else if (atmPut) {
        atmIV = atmPut.iv;
      }

      // Record this IV reading for historical tracking (async on mobile)
      if (atmIV > 0) {
        await recordIVReading(ticker, atmIV);
      }

      // Get historical IV data for IV Rank calculation (async on mobile)
      const ivHistory = await getSymbolIVHistory(ticker);
      const historicalIVs = ivHistory.map((h) => h.iv);

      const ivRank = calculateIVRank(atmIV, historicalIVs);
      const ivPercentile = calculateIVPercentile(atmIV, historicalIVs);

      // Fetch historical prices for HV calculation
      const historicalPrices = await fetchHistoricalData(ticker, 60);
      const priceCloses = historicalPrices.map((h) => h.close);
      const hv20 = calculateHistoricalVolatility(priceCloses, 20);

      // Calculate expected move
      // Expected Move = Stock Price * IV * sqrt(DTE/365)
      const expectedMovePercent = atmIV * Math.sqrt(dte / 365);
      const expectedMoveAbsolute = quote.price * (expectedMovePercent / 100);

      const result: OptionsVolatilityData = {
        ticker,
        stockPrice: quote.price,
        atmIV,
        ivRank,
        ivPercentile,
        historicalVolatility: hv20,
        expectedMove: expectedMovePercent,
        expectedMoveAbsolute,
        daysToExpiration: dte,
        nearestExpiration: nearestExp,
        dataQuality: 'real',
        lastUpdated: new Date(),
      };

      // Cache the result
      optionsCache.set(cacheKey, {
        data: result,
        expiresAt: Date.now() + CACHE_TTL,
      });

      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch options data';
      setError(errorMessage);
      setData({
        ticker,
        stockPrice: 0,
        atmIV: 0,
        ivRank: -1,
        ivPercentile: -1,
        historicalVolatility: 0,
        expectedMove: 0,
        expectedMoveAbsolute: 0,
        daysToExpiration: 0,
        nearestExpiration: '',
        dataQuality: 'unavailable',
        lastUpdated: new Date(),
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [ticker, minDaysToExpiration]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !ticker) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData, ticker]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    isConfigured,
  };
};

/**
 * Hook to fetch options data for multiple tickers
 */
export const useTradierBatchOptionsData = (
  tickers: string[],
  options: UseTradierOptionsDataOptions = {}
) => {
  const [dataMap, setDataMap] = useState<Record<string, OptionsVolatilityData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [isConfigured, setIsConfigured] = useState(false);

  const { minDaysToExpiration = 7 } = options;

  // Check API key availability on mount
  useEffect(() => {
    getApiKey().then((key) => setIsConfigured(!!key));
  }, []);

  const fetchAllData = useCallback(async () => {
    const apiKey = await getApiKey();
    if (!apiKey) {
      setError('Tradier API key not configured');
      setIsConfigured(false);
      return;
    }

    setIsConfigured(true);

    if (tickers.length === 0) {
      setDataMap({});
      return;
    }

    setLoading(true);
    setError(null);
    setProgress({ completed: 0, total: tickers.length });

    const results: Record<string, OptionsVolatilityData> = {};

    // Process tickers sequentially to avoid rate limits
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      // Check cache first
      const cacheKey = `${ticker}-${minDaysToExpiration}`;
      const cached = optionsCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        results[ticker] = cached.data;
        setProgress({ completed: i + 1, total: tickers.length });
        continue;
      }

      try {
        // Fetch quote
        const quote = await fetchQuote(ticker);

        // Fetch expirations
        const expirations = await fetchExpirations(ticker);
        if (expirations.length === 0) {
          results[ticker] = createUnavailableData(ticker, 'No options available');
          continue;
        }

        // Find nearest expiration
        const nearestExp = findNearestExpiration(expirations, minDaysToExpiration);
        if (!nearestExp) {
          results[ticker] = createUnavailableData(ticker, 'No suitable expiration');
          continue;
        }

        const dte = calculateDTE(nearestExp);

        // Fetch options chain
        const { calls, puts } = await fetchOptionsChain(ticker, nearestExp);

        // Find ATM options
        const atmCall = findNearestStrike(calls, quote.price);
        const atmPut = findNearestStrike(puts, quote.price);

        // Calculate ATM IV
        let atmIV = 0;
        if (atmCall && atmPut) {
          atmIV = (atmCall.iv + atmPut.iv) / 2;
        } else if (atmCall) {
          atmIV = atmCall.iv;
        } else if (atmPut) {
          atmIV = atmPut.iv;
        }

        // Record IV reading (async on mobile)
        if (atmIV > 0) {
          await recordIVReading(ticker, atmIV);
        }

        // Get IV history (async on mobile)
        const ivHistory = await getSymbolIVHistory(ticker);
        const historicalIVs = ivHistory.map((h) => h.iv);

        const ivRank = calculateIVRank(atmIV, historicalIVs);
        const ivPercentile = calculateIVPercentile(atmIV, historicalIVs);

        // Calculate expected move
        const expectedMovePercent = atmIV * Math.sqrt(dte / 365);
        const expectedMoveAbsolute = quote.price * (expectedMovePercent / 100);

        const data: OptionsVolatilityData = {
          ticker,
          stockPrice: quote.price,
          atmIV,
          ivRank,
          ivPercentile,
          historicalVolatility: 0, // Skip HV for batch to save API calls
          expectedMove: expectedMovePercent,
          expectedMoveAbsolute,
          daysToExpiration: dte,
          nearestExpiration: nearestExp,
          dataQuality: 'real',
          lastUpdated: new Date(),
        };

        // Cache
        optionsCache.set(cacheKey, {
          data,
          expiresAt: Date.now() + CACHE_TTL,
        });

        results[ticker] = data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch';
        results[ticker] = createUnavailableData(ticker, errorMessage);
      }

      setProgress({ completed: i + 1, total: tickers.length });

      // Small delay between requests to avoid rate limits
      if (i < tickers.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    setDataMap(results);
    setLoading(false);
  }, [tickers, minDaysToExpiration]);

  // Fetch when tickers change
  useEffect(() => {
    if (tickers.length > 0) {
      fetchAllData();
    }
  }, [fetchAllData]);

  return {
    dataMap,
    loading,
    error,
    progress,
    refresh: fetchAllData,
    isConfigured,
  };
};

// Helper to create unavailable data object
function createUnavailableData(ticker: string, error: string): OptionsVolatilityData {
  return {
    ticker,
    stockPrice: 0,
    atmIV: 0,
    ivRank: -1,
    ivPercentile: -1,
    historicalVolatility: 0,
    expectedMove: 0,
    expectedMoveAbsolute: 0,
    daysToExpiration: 0,
    nearestExpiration: '',
    dataQuality: 'unavailable',
    lastUpdated: new Date(),
    error,
  };
}

/**
 * Check if Tradier API is configured (async on mobile)
 */
export const isTradierConfigured = async (): Promise<boolean> => {
  const key = await getApiKey();
  return !!key;
};

/**
 * Clear options cache
 */
export const clearOptionsCache = (): void => {
  optionsCache.clear();
};

export default useTradierOptionsData;
