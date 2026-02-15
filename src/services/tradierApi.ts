/**
 * Tradier API Service (Mobile)
 *
 * To get an API key:
 * 1. Sign up at https://developer.tradier.com/
 * 2. Create a sandbox application
 * 3. Copy your Access Token
 *
 * Sandbox provides 15-min delayed data for free
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const SANDBOX_BASE_URL = 'https://sandbox.tradier.com/v1';
const PROD_BASE_URL = 'https://api.tradier.com/v1';

// SecureStore keys for sensitive data
const API_KEY_STORAGE = 'tradier_api_key';
// AsyncStorage keys for preferences
const USE_SANDBOX_STORAGE = 'tradier_use_sandbox';

export const getApiKey = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(API_KEY_STORAGE);
};

export const setApiKey = async (key: string): Promise<void> => {
  await SecureStore.setItemAsync(API_KEY_STORAGE, key);
};

export const getUseSandbox = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(USE_SANDBOX_STORAGE);
  return value !== 'false';
};

export const setUseSandbox = async (useSandbox: boolean): Promise<void> => {
  await AsyncStorage.setItem(USE_SANDBOX_STORAGE, useSandbox.toString());
};

const getBaseUrl = async (): Promise<string> => {
  return (await getUseSandbox()) ? SANDBOX_BASE_URL : PROD_BASE_URL;
};

interface TradierQuote {
  symbol: string;
  description: string;
  last: number;
  change: number;
  change_percentage: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
  bid: number;
  ask: number;
}

interface TradierOption {
  symbol: string;
  description: string;
  strike: number;
  option_type: 'call' | 'put';
  expiration_date: string;
  last: number;
  bid: number;
  ask: number;
  open_interest: number;
  volume: number;
  greeks?: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
    mid_iv: number;
    smv_vol: number;
  };
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  volume: number;
}

export interface OptionData {
  symbol: string;
  strike: number;
  type: 'call' | 'put';
  expiration: string;
  bid: number;
  ask: number;
  last: number;
  iv: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  openInterest: number;
  volume: number;
  greeks?: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho?: number;
    mid_iv: number;
    smv_vol?: number;
  };
}

export interface OptionsChain {
  expirations: string[];
  calls: OptionData[];
  puts: OptionData[];
}

/**
 * Returns true if a user-provided API key is available
 */
export async function hasApiAccess(): Promise<boolean> {
  const key = await getApiKey();
  return !!key;
}

async function tradierFetch<T>(endpoint: string): Promise<T> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('Tradier API key not configured. Please add your API key in settings.');
  }

  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your Tradier API key.');
    }
    throw new Error(`Tradier API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch stock quote
 */
export async function fetchQuote(symbol: string): Promise<StockQuote> {
  const data = await tradierFetch<{ quotes: { quote: TradierQuote | TradierQuote[] } }>(
    `/markets/quotes?symbols=${symbol.toUpperCase()}`
  );

  const quote = Array.isArray(data.quotes.quote)
    ? data.quotes.quote[0]
    : data.quotes.quote;

  if (!quote || !quote.last) {
    throw new Error(`No data found for symbol: ${symbol}`);
  }

  return {
    symbol: quote.symbol,
    price: quote.last,
    change: quote.change || 0,
    changePercent: quote.change_percentage || 0,
    bid: quote.bid || quote.last,
    ask: quote.ask || quote.last,
    volume: quote.volume || 0,
  };
}

/**
 * Fetch available option expirations
 */
export async function fetchExpirations(symbol: string): Promise<string[]> {
  const data = await tradierFetch<{ expirations: { date: string[] | string } }>(
    `/markets/options/expirations?symbol=${symbol.toUpperCase()}`
  );

  if (!data.expirations?.date) {
    return [];
  }

  return Array.isArray(data.expirations.date)
    ? data.expirations.date
    : [data.expirations.date];
}

/**
 * Fetch options chain for a specific expiration
 */
export async function fetchOptionsChain(
  symbol: string,
  expiration: string
): Promise<{ calls: OptionData[]; puts: OptionData[] }> {
  const data = await tradierFetch<{ options: { option: TradierOption[] } }>(
    `/markets/options/chains?symbol=${symbol.toUpperCase()}&expiration=${expiration}&greeks=true`
  );

  if (!data.options?.option) {
    return { calls: [], puts: [] };
  }

  const options = Array.isArray(data.options.option)
    ? data.options.option
    : [data.options.option];

  const calls: OptionData[] = [];
  const puts: OptionData[] = [];

  for (const opt of options) {
    const optionData: OptionData = {
      symbol: opt.symbol,
      strike: opt.strike,
      type: opt.option_type,
      expiration: opt.expiration_date,
      bid: opt.bid || 0,
      ask: opt.ask || 0,
      last: opt.last || 0,
      iv: (opt.greeks?.mid_iv || opt.greeks?.smv_vol || 0) * 100,
      delta: opt.greeks?.delta || 0,
      gamma: opt.greeks?.gamma || 0,
      theta: opt.greeks?.theta || 0,
      vega: opt.greeks?.vega || 0,
      openInterest: opt.open_interest || 0,
      volume: opt.volume || 0,
    };

    if (opt.option_type === 'call') {
      calls.push(optionData);
    } else {
      puts.push(optionData);
    }
  }

  calls.sort((a, b) => a.strike - b.strike);
  puts.sort((a, b) => a.strike - b.strike);

  return { calls, puts };
}

/**
 * Calculate days to expiration
 */
export function calculateDTE(expirationDate: string): number {
  const expiry = new Date(expirationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Find the nearest strike to the current price
 */
export function findNearestStrike(
  options: OptionData[],
  currentPrice: number
): OptionData | null {
  if (options.length === 0) return null;

  return options.reduce((nearest, opt) => {
    const nearestDiff = Math.abs(nearest.strike - currentPrice);
    const optDiff = Math.abs(opt.strike - currentPrice);
    return optDiff < nearestDiff ? opt : nearest;
  });
}

/**
 * Find the nearest expiration (at least minDays out)
 */
export function findNearestExpiration(
  expirations: string[],
  minDays: number = 7
): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const exp of expirations) {
    const expDate = new Date(exp);
    expDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= minDays) {
      return exp;
    }
  }

  return expirations[0] || null;
}

interface TradierHistoryDay {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalData {
  date: string;
  close: number;
  high: number;
  low: number;
}

/**
 * Fetch historical price data
 */
export async function fetchHistoricalData(
  symbol: string,
  days: number = 252
): Promise<HistoricalData[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  const data = await tradierFetch<{ history: { day: TradierHistoryDay | TradierHistoryDay[] } }>(
    `/markets/history?symbol=${symbol.toUpperCase()}&interval=daily&start=${start}&end=${end}`
  );

  if (!data.history?.day) {
    return [];
  }

  const days_data = Array.isArray(data.history.day)
    ? data.history.day
    : [data.history.day];

  return days_data.map(d => ({
    date: d.date,
    close: d.close,
    high: d.high,
    low: d.low
  }));
}

/**
 * Calculate Historical Volatility from price data
 * Uses log returns and annualized standard deviation
 */
export function calculateHistoricalVolatility(prices: number[], period: number = 20): number {
  if (prices.length < period + 1) return 0;

  const returns: number[] = [];
  for (let i = 1; i <= period; i++) {
    const logReturn = Math.log(prices[prices.length - i] / prices[prices.length - i - 1]);
    returns.push(logReturn);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  return stdDev * Math.sqrt(252) * 100;
}

/**
 * IV History Storage
 * Stores daily IV readings per symbol using AsyncStorage
 */
const IV_HISTORY_STORAGE = 'iv_history_data';
const IV_HISTORY_DAYS = 365;

export interface IVHistoryEntry {
  date: string;
  iv: number;
  ivRank?: number;
  ivPercentile?: number;
  hv20?: number;
  price?: number;
}

export interface IVHistoryData {
  [symbol: string]: IVHistoryEntry[];
}

/**
 * Get all stored IV history
 */
export async function getIVHistory(): Promise<IVHistoryData> {
  const stored = await AsyncStorage.getItem(IV_HISTORY_STORAGE);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Get IV history for a specific symbol
 */
export async function getSymbolIVHistory(symbol: string): Promise<IVHistoryEntry[]> {
  const history = await getIVHistory();
  return history[symbol.toUpperCase()] || [];
}

/**
 * Record today's IV reading for a symbol
 */
export async function recordIVReading(
  symbol: string,
  iv: number,
  extras?: { ivRank?: number; ivPercentile?: number; hv20?: number; price?: number }
): Promise<void> {
  const history = await getIVHistory();
  const upperSymbol = symbol.toUpperCase();
  const today = new Date().toISOString().split('T')[0];

  if (!history[upperSymbol]) {
    history[upperSymbol] = [];
  }

  const entry: IVHistoryEntry = { date: today, iv, ...extras };

  const existingIndex = history[upperSymbol].findIndex(e => e.date === today);
  if (existingIndex >= 0) {
    history[upperSymbol][existingIndex] = entry;
  } else {
    history[upperSymbol].push(entry);
  }

  history[upperSymbol].sort((a, b) => a.date.localeCompare(b.date));

  if (history[upperSymbol].length > IV_HISTORY_DAYS) {
    history[upperSymbol] = history[upperSymbol].slice(-IV_HISTORY_DAYS);
  }

  await AsyncStorage.setItem(IV_HISTORY_STORAGE, JSON.stringify(history));
}

/**
 * Calculate IV Rank from historical IV data
 * IV Rank = (Current IV - 52w Low) / (52w High - 52w Low) * 100
 */
export function calculateIVRank(currentIV: number, historicalIVs: number[]): number {
  if (historicalIVs.length < 5) return -1;

  const min = Math.min(...historicalIVs);
  const max = Math.max(...historicalIVs);

  if (max === min) return 50;

  const rank = ((currentIV - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, rank));
}

/**
 * Calculate IV Percentile from historical IV data
 * IV Percentile = % of days where IV was lower than current
 */
export function calculateIVPercentile(currentIV: number, historicalIVs: number[]): number {
  if (historicalIVs.length < 5) return -1;

  const belowCount = historicalIVs.filter(iv => iv < currentIV).length;
  return (belowCount / historicalIVs.length) * 100;
}

/**
 * Get the number of days of IV history for a symbol
 */
export async function getIVHistoryDaysCount(symbol: string): Promise<number> {
  const history = await getSymbolIVHistory(symbol);
  return history.length;
}

/**
 * Clear IV history for a symbol (or all if no symbol provided)
 */
export async function clearIVHistory(symbol?: string): Promise<void> {
  if (symbol) {
    const history = await getIVHistory();
    delete history[symbol.toUpperCase()];
    await AsyncStorage.setItem(IV_HISTORY_STORAGE, JSON.stringify(history));
  } else {
    await AsyncStorage.removeItem(IV_HISTORY_STORAGE);
  }
}
