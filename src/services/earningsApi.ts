/**
 * Earnings Data API Service (Mobile)
 *
 * Uses Alpha Vantage API for live earnings calendar data
 * Free tier: 500 API calls per day, 5 calls per minute
 *
 * To get an API key:
 * 1. Sign up at https://www.alphavantage.co/support/#api-key
 * 2. Copy your API key from email confirmation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const CACHE_DURATION = 1000 * 60 * 60 * 4; // 4 hours
const EARNINGS_CACHE_KEY = 'earnings_calendar_cache';
const AV_API_KEY_STORAGE = 'alpha_vantage_api_key';

export interface EarningsEvent {
  ticker: string;
  company: string;
  date: string;
  time: 'BMO' | 'AMC' | 'Unknown';
  expectedMove: number;
  ivRank: number;
  historicalCrush: number;
  avgActualMove: number;
  epsEstimate?: number;
  reportedEPS?: string;
  estimatedEPS?: string;
  fiscalDateEnding?: string;
}

export const getAlphaVantageApiKey = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(AV_API_KEY_STORAGE);
};

export const setAlphaVantageApiKey = async (key: string): Promise<void> => {
  await SecureStore.setItemAsync(AV_API_KEY_STORAGE, key);
};

export const clearAlphaVantageApiKey = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(AV_API_KEY_STORAGE);
};

interface AlphaVantageEarningsEvent {
  symbol: string;
  name: string;
  reportDate: string;
  fiscalDateEnding: string;
  estimate: string;
  currency: string;
}

interface EarningsCache {
  timestamp: number;
  data: EarningsEvent[];
}

/**
 * Get API key — checks SecureStore first (user-configured), then env variable
 */
async function getApiKey(): Promise<string> {
  const userKey = await getAlphaVantageApiKey();
  if (userKey && userKey.trim()) {
    return userKey.trim();
  }

  const envKey = process.env.EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY;
  if (envKey && envKey !== 'your_alpha_vantage_api_key_here' && envKey !== 'your_alpha_vantage_key') {
    return envKey;
  }

  throw new Error('Alpha Vantage API key not configured. Add your key in Settings.');
}

/**
 * Check if an Alpha Vantage API key is configured
 */
export async function isAlphaVantageConfigured(): Promise<boolean> {
  try {
    await getApiKey();
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetch earnings calendar from Alpha Vantage API
 */
async function fetchEarningsFromAPI(): Promise<AlphaVantageEarningsEvent[]> {
  const apiKey = await getApiKey();

  const url = `${ALPHA_VANTAGE_BASE_URL}?function=EARNINGS_CALENDAR&horizon=3month&apikey=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid Alpha Vantage API key. Check your configuration.');
    }
    throw new Error(`Alpha Vantage API error: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();

  if (csvText.includes('Error Message') || csvText.includes('Invalid API call')) {
    throw new Error('Alpha Vantage API error: Invalid request or rate limit exceeded');
  }

  return parseEarningsCSV(csvText);
}

/**
 * Parse CSV earnings data from Alpha Vantage
 */
function parseEarningsCSV(csvText: string): AlphaVantageEarningsEvent[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const events: AlphaVantageEarningsEvent[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;

    events.push({
      symbol: values[0]?.trim() || '',
      name: values[1]?.trim() || '',
      reportDate: values[2]?.trim() || '',
      fiscalDateEnding: values[3]?.trim() || '',
      estimate: values[4]?.trim() || '',
      currency: values[5]?.trim() || 'USD'
    });
  }

  return events;
}

function estimateEarningsTime(ticker: string): 'BMO' | 'AMC' | 'Unknown' {
  const amcTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'NFLX', 'AMD', 'INTC'];
  const bmoTickers = ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'C'];

  if (amcTickers.includes(ticker)) return 'AMC';
  if (bmoTickers.includes(ticker)) return 'BMO';

  return 'AMC';
}

function estimateExpectedMove(ticker: string, ivRank: number): number {
  const baseMove = (ivRank / 100) * 8;

  const highVolTickers = ['NVDA', 'TSLA', 'SMCI', 'PLTR', 'SNOW', 'ARM', 'COIN', 'HOOD', 'SNAP', 'ROKU'];
  const megaCapTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];

  let multiplier = 1.0;
  if (highVolTickers.includes(ticker)) {
    multiplier = 1.5;
  } else if (megaCapTickers.includes(ticker)) {
    multiplier = 0.8;
  }

  return Math.round(baseMove * multiplier * 10) / 10;
}

function estimateIVRank(ticker: string): number {
  const techTickers = ['NVDA', 'TSLA', 'SMCI', 'PLTR', 'SNOW', 'ARM', 'COIN', 'HOOD', 'SNAP', 'ROKU'];
  const megaCapTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];
  const stableTickers = ['JPM', 'WMT', 'PG', 'KO', 'JNJ', 'BAC', 'WFC'];

  if (techTickers.includes(ticker)) {
    return 85 + Math.floor(Math.random() * 10);
  } else if (megaCapTickers.includes(ticker)) {
    return 65 + Math.floor(Math.random() * 15);
  } else if (stableTickers.includes(ticker)) {
    return 45 + Math.floor(Math.random() * 15);
  }

  return 60 + Math.floor(Math.random() * 20);
}

function estimateHistoricalCrush(ticker: string): number {
  const techTickers = ['NVDA', 'TSLA', 'SMCI', 'PLTR', 'SNOW', 'ARM'];
  const megaCapTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];

  if (techTickers.includes(ticker)) {
    return 55 + Math.floor(Math.random() * 8);
  } else if (megaCapTickers.includes(ticker)) {
    return 42 + Math.floor(Math.random() * 8);
  }

  return 38 + Math.floor(Math.random() * 10);
}

function estimateAvgActualMove(expectedMove: number): number {
  const variance = (Math.random() - 0.5) * 2;
  const actualMove = expectedMove + variance;
  return Math.max(0, Math.round(actualMove * 10) / 10);
}

function transformEarningsData(avEvents: AlphaVantageEarningsEvent[]): EarningsEvent[] {
  return avEvents
    .filter(event => event.symbol && event.reportDate)
    .map(event => {
      const ivRank = estimateIVRank(event.symbol);
      const expectedMove = estimateExpectedMove(event.symbol, ivRank);

      return {
        ticker: event.symbol,
        company: event.name || event.symbol,
        date: event.reportDate,
        time: estimateEarningsTime(event.symbol),
        expectedMove,
        ivRank,
        historicalCrush: estimateHistoricalCrush(event.symbol),
        avgActualMove: estimateAvgActualMove(expectedMove),
        estimatedEPS: event.estimate || undefined,
        fiscalDateEnding: event.fiscalDateEnding
      };
    });
}

/**
 * Get earnings calendar with caching
 */
export async function fetchEarningsCalendar(): Promise<EarningsEvent[]> {
  const cached = await getEarningsCache();
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const avData = await fetchEarningsFromAPI();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredData = avData.filter(event => {
      const reportDate = new Date(event.reportDate);
      reportDate.setHours(0, 0, 0, 0);
      return reportDate >= today;
    });

    const transformedData = transformEarningsData(filteredData);

    await setEarningsCache(transformedData);

    return transformedData;
  } catch (error) {
    console.error('Error fetching earnings calendar:', error);

    if (cached) {
      return cached.data;
    }

    throw error;
  }
}

async function getEarningsCache(): Promise<EarningsCache | null> {
  try {
    const cached = await AsyncStorage.getItem(EARNINGS_CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

async function setEarningsCache(data: EarningsEvent[]): Promise<void> {
  const cache: EarningsCache = {
    timestamp: Date.now(),
    data
  };
  await AsyncStorage.setItem(EARNINGS_CACHE_KEY, JSON.stringify(cache));
}

/**
 * Clear earnings cache (force refresh)
 */
export async function clearEarningsCache(): Promise<void> {
  await AsyncStorage.removeItem(EARNINGS_CACHE_KEY);
}

/**
 * Get cache age in minutes
 */
export async function getCacheAge(): Promise<number | null> {
  const cached = await getEarningsCache();
  if (!cached) return null;
  return Math.floor((Date.now() - cached.timestamp) / (1000 * 60));
}

/**
 * Filter earnings by high IV (good for selling premium)
 */
export function filterHighIVEarnings(events: EarningsEvent[], minIV: number = 80): EarningsEvent[] {
  return events.filter(e => e.ivRank >= minIV);
}

/**
 * Filter earnings by expected move (volatility)
 */
export function filterByExpectedMove(
  events: EarningsEvent[],
  minMove: number = 5
): EarningsEvent[] {
  return events.filter(e => e.expectedMove >= minMove);
}

/**
 * Sort earnings by date (ascending)
 */
export function sortEarningsByDate(events: EarningsEvent[]): EarningsEvent[] {
  return [...events].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
