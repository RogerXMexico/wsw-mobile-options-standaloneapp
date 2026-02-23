// Volatility surface hook for 3D IV visualization
// Fetches multiple expirations and builds a strike x expiration IV matrix
// Ported from desktop: sync getApiKey -> async

import { useState, useCallback } from 'react';
import {
  fetchQuote,
  fetchExpirations,
  fetchOptionsChain,
  getApiKey,
} from '../services/tradierApi';

export interface IVMatrixPoint {
  strike: number;
  expiration: string;
  dte: number;
  callIV: number;
  putIV: number;
  avgIV: number;
}

export interface VolSurfaceData {
  symbol: string;
  stockPrice: number;
  strikes: number[];
  expirations: string[];
  dtes: number[];
  matrix: IVMatrixPoint[][]; // [expIdx][strikeIdx]
  atmIVByExp: { expiration: string; dte: number; iv: number }[];
  loading: boolean;
  error: string | null;
}

const CACHE_TTL = 60_000; // 60 seconds
let cache: { key: string; data: VolSurfaceData; ts: number } | null = null;

export function useVolatilitySurface() {
  const [data, setData] = useState<VolSurfaceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSurface = useCallback(async (symbol: string) => {
    if (!symbol.trim()) return;
    const upperSymbol = symbol.toUpperCase().trim();

    // Check cache
    const cacheKey = upperSymbol;
    if (cache && cache.key === cacheKey && Date.now() - cache.ts < CACHE_TTL) {
      setData(cache.data);
      return;
    }

    // Async API key check on mobile
    const apiKey = await getApiKey();
    if (!apiKey) {
      setError('Tradier API key required. Configure in Settings.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch quote + expirations
      const [quote, allExps] = await Promise.all([
        fetchQuote(upperSymbol),
        fetchExpirations(upperSymbol),
      ]);

      if (allExps.length === 0) throw new Error('No expirations found');

      // Pick up to 6 expirations spread across the term structure
      const selectedExps = selectExpirations(allExps, 6);

      // Fetch chains in parallel
      const chains = await Promise.all(
        selectedExps.map(exp => fetchOptionsChain(upperSymbol, exp))
      );

      // Filter strikes to +/- 20% of stock price
      const minStrike = quote.price * 0.8;
      const maxStrike = quote.price * 1.2;

      // Collect all unique strikes across chains within range
      const allStrikesSet = new Set<number>();
      chains.forEach(chain => {
        chain.calls.forEach(c => {
          if (c.strike >= minStrike && c.strike <= maxStrike) allStrikesSet.add(c.strike);
        });
      });
      const strikes = [...allStrikesSet].sort((a, b) => a - b);

      // Build IV matrix
      const dtes = selectedExps.map(exp => {
        const d = new Date(exp + 'T00:00:00');
        const now = new Date();
        return Math.max(1, Math.round((d.getTime() - now.getTime()) / 86400000));
      });

      const matrix: IVMatrixPoint[][] = [];
      const atmIVByExp: { expiration: string; dte: number; iv: number }[] = [];

      selectedExps.forEach((exp, expIdx) => {
        const chain = chains[expIdx];
        const dte = dtes[expIdx];
        const row: IVMatrixPoint[] = [];

        // Find ATM strike for this expiration
        const atmStrike = strikes.reduce((prev, curr) =>
          Math.abs(curr - quote.price) < Math.abs(prev - quote.price) ? curr : prev
        );

        strikes.forEach(strike => {
          const call = chain.calls.find(c => c.strike === strike);
          const put = chain.puts.find(p => p.strike === strike);
          const callIV = call?.iv || 0;
          const putIV = put?.iv || 0;
          const avgIV = callIV > 0 && putIV > 0 ? (callIV + putIV) / 2
            : callIV > 0 ? callIV
            : putIV;

          row.push({ strike, expiration: exp, dte, callIV, putIV, avgIV });
        });

        matrix.push(row);

        // ATM IV for term structure
        const atmCall = chain.calls.find(c => c.strike === atmStrike);
        const atmPut = chain.puts.find(p => p.strike === atmStrike);
        const aCallIV = atmCall?.iv || 0;
        const aPutIV = atmPut?.iv || 0;
        const atmIV = aCallIV > 0 && aPutIV > 0 ? (aCallIV + aPutIV) / 2
          : aCallIV > 0 ? aCallIV : aPutIV;
        atmIVByExp.push({ expiration: exp, dte, iv: atmIV });
      });

      const result: VolSurfaceData = {
        symbol: upperSymbol,
        stockPrice: quote.price,
        strikes,
        expirations: selectedExps,
        dtes,
        matrix,
        atmIVByExp,
        loading: false,
        error: null,
      };

      cache = { key: cacheKey, data: result, ts: Date.now() };
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch volatility surface');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchSurface };
}

/** Pick up to N expirations spread across the term structure */
function selectExpirations(allExps: string[], n: number): string[] {
  if (allExps.length <= n) return allExps;

  // Always include the first (nearest) expiration
  const result: string[] = [allExps[0]];

  // Pick evenly spaced from the rest
  const step = (allExps.length - 1) / (n - 1);
  for (let i = 1; i < n; i++) {
    const idx = Math.min(Math.round(i * step), allExps.length - 1);
    if (!result.includes(allExps[idx])) {
      result.push(allExps[idx]);
    }
  }

  return result;
}

export default useVolatilitySurface;
