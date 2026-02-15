// Polymarket API Service (Mobile)
// Fetches from Gamma API directly (no CORS issues on mobile)

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PolymarketEvent,
  PolymarketMarket,
  EventTickerMapping,
  EventMappingsFile,
  EventAnalysis,
  GapScore,
  PolymarketCache,
  EventType,
} from '../types/polymarket';

export type { PolymarketEvent, PolymarketMarket, EventTickerMapping, EventType };

// ============ Constants ============

const GAMMA_API_BASE = 'https://gamma-api.polymarket.com';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SEARCH_CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const MAPPINGS_CACHE_KEY = 'polymarket_mappings';

// ============ Error Classification ============

export type PolymarketApiErrorType = 'network' | 'server' | 'rate_limit' | 'not_found' | 'unknown';

export class PolymarketApiError extends Error {
  type: PolymarketApiErrorType;
  status?: number;

  constructor(message: string, type: PolymarketApiErrorType, status?: number) {
    super(message);
    this.name = 'PolymarketApiError';
    this.type = type;
    this.status = status;
  }
}

function classifyError(error: unknown): PolymarketApiError {
  if (error instanceof PolymarketApiError) return error;

  if (error instanceof TypeError) {
    return new PolymarketApiError(
      'Network error — check your connection',
      'network'
    );
  }

  if (error instanceof Error) {
    return new PolymarketApiError(error.message, 'unknown');
  }

  return new PolymarketApiError(String(error), 'unknown');
}

function classifyStatus(status: number, url: string): PolymarketApiError {
  if (status === 404) {
    return new PolymarketApiError(`Not found: ${url}`, 'not_found', 404);
  }
  if (status === 429) {
    return new PolymarketApiError('Rate limited by Polymarket API', 'rate_limit', 429);
  }
  if (status >= 500) {
    return new PolymarketApiError(`Polymarket server error (${status})`, 'server', status);
  }
  return new PolymarketApiError(`Polymarket API error (${status})`, 'unknown', status);
}

// ============ Fetch with Retry ============

async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: PolymarketApiError | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) return response;

      const apiError = classifyStatus(response.status, url);

      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw apiError;
      }

      lastError = apiError;

      if (attempt < maxRetries) {
        const base = response.status === 429 ? 2000 : 1000;
        await new Promise(r => setTimeout(r, base * Math.pow(2, attempt)));
      }
    } catch (error) {
      if (error instanceof PolymarketApiError) {
        if (error.type === 'not_found' || (error.type === 'unknown' && error.status && error.status >= 400 && error.status < 500)) {
          throw error;
        }
        lastError = error;
      } else {
        lastError = classifyError(error);
      }

      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new PolymarketApiError('Request failed after retries', 'unknown');
}

// ============ Request Deduplication ============

const inFlightRequests = new Map<string, Promise<unknown>>();

async function deduplicatedJsonFetch<T>(url: string): Promise<T> {
  const existing = inFlightRequests.get(url);
  if (existing) return existing as Promise<T>;

  const promise = fetchWithRetry(url)
    .then(response => response.json() as Promise<T>)
    .finally(() => {
      inFlightRequests.delete(url);
    });

  inFlightRequests.set(url, promise);
  return promise;
}

// ============ Cache Management ============

let cache: PolymarketCache = {
  events: {},
  lastFullRefresh: '',
};

const searchCache = new Map<string, { data: PolymarketEvent[]; expiresAt: number }>();

const isCacheValid = (expiresAt: string): boolean => {
  return new Date(expiresAt) > new Date();
};

export const clearCache = (): void => {
  cache = {
    events: {},
    lastFullRefresh: '',
  };
  searchCache.clear();
};

export const clearEventCache = (eventId: string): void => {
  delete cache.events[eventId];
};

// ============ Connectivity Check ============

export const checkConnectivity = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${GAMMA_API_BASE}/events?limit=1`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
};

// ============ API Fetching ============

export const fetchActiveEvents = async (limit = 200): Promise<PolymarketEvent[]> => {
  const cacheKey = `active_events_${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const params = new URLSearchParams({
      closed: 'false',
      limit: limit.toString(),
    });
    const url = `${GAMMA_API_BASE}/events?${params}`;
    const data = await deduplicatedJsonFetch<PolymarketEvent[]>(url);

    searchCache.set(cacheKey, { data, expiresAt: Date.now() + SEARCH_CACHE_DURATION_MS });
    return data;
  } catch (error) {
    console.error('Error fetching active Polymarket events:', error);
    throw error instanceof PolymarketApiError ? error : classifyError(error);
  }
};

export const fetchEventBySlug = async (slug: string): Promise<PolymarketEvent | null> => {
  const cached = cache.events[slug];
  if (cached && isCacheValid(cached.expiresAt)) {
    return cached.data;
  }

  try {
    const url = `${GAMMA_API_BASE}/events/${slug}`;
    const data = await deduplicatedJsonFetch<PolymarketEvent>(url);

    const now = new Date();
    cache.events[slug] = {
      data,
      fetchedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + CACHE_DURATION_MS).toISOString(),
    };

    return data;
  } catch (error) {
    if (error instanceof PolymarketApiError && error.type === 'not_found') {
      return null;
    }
    console.error(`Error fetching Polymarket event ${slug}:`, error);
    throw error instanceof PolymarketApiError ? error : classifyError(error);
  }
};

export const searchEvents = async (query: string, limit = 20): Promise<PolymarketEvent[]> => {
  const params = new URLSearchParams({
    q: query,
    limit: limit.toString(),
    active: 'true',
  });
  const url = `${GAMMA_API_BASE}/events?${params}`;

  const cached = searchCache.get(url);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const data = await deduplicatedJsonFetch<PolymarketEvent[]>(url);

    searchCache.set(url, { data, expiresAt: Date.now() + SEARCH_CACHE_DURATION_MS });
    return data;
  } catch (error) {
    console.error('Error searching Polymarket events:', error);
    throw error instanceof PolymarketApiError ? error : classifyError(error);
  }
};

export const fetchEventsByTag = async (tag: string, limit = 50): Promise<PolymarketEvent[]> => {
  const params = new URLSearchParams({
    tag,
    limit: limit.toString(),
    active: 'true',
  });
  const url = `${GAMMA_API_BASE}/events?${params}`;

  const cached = searchCache.get(url);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const data = await deduplicatedJsonFetch<PolymarketEvent[]>(url);

    searchCache.set(url, { data, expiresAt: Date.now() + SEARCH_CACHE_DURATION_MS });
    return data;
  } catch (error) {
    console.error(`Error fetching Polymarket events by tag ${tag}:`, error);
    throw error instanceof PolymarketApiError ? error : classifyError(error);
  }
};

export const fetchEventsBySlugs = async (slugs: string[]): Promise<PolymarketEvent[]> => {
  const results = await Promise.all(
    slugs.map(slug => fetchEventBySlug(slug).catch(() => null))
  );
  return results.filter((event): event is PolymarketEvent => event !== null);
};

// ============ Data Processing ============

export const getPrimaryProbability = (market: PolymarketMarket): number => {
  if (market.outcomePrices.length >= 1) {
    return parseFloat(market.outcomePrices[0]);
  }
  return 0.5;
};

export const getMainMarket = (event: PolymarketEvent): PolymarketMarket | null => {
  if (event.markets && event.markets.length > 0) {
    return event.markets[0];
  }
  return null;
};

export const isEventActive = (event: PolymarketEvent): boolean => {
  const market = getMainMarket(event);
  return (
    !event.closed &&
    !event.archived &&
    market !== null &&
    market.active &&
    market.acceptingOrders
  );
};

export const getDaysUntilEvent = (event: PolymarketEvent): number => {
  const endDate = new Date(event.endDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============ Gap Analysis ============

export const calculateGapScore = (
  polymarketProbability: number,
  _optionsIV: number,
  _optionsExpectedMove: number,
  optionsIVRank: number,
  _eventType: EventType
): GapScore => {
  const prob = polymarketProbability;
  const ivRankNormalized = optionsIVRank / 100;

  let longVolScore = 0;
  let shortVolScore = 0;

  const uncertainty = 1 - Math.abs(prob - 0.5) * 2;
  if (uncertainty > 0.6 && ivRankNormalized < 0.4) {
    longVolScore = uncertainty * (1 - ivRankNormalized);
  }

  const confidence = Math.abs(prob - 0.5) * 2;
  if (confidence > 0.6 && ivRankNormalized > 0.7) {
    shortVolScore = confidence * ivRankNormalized;
  }

  let direction: 'long-vol' | 'short-vol' | 'neutral' = 'neutral';
  let score = 0;

  if (longVolScore > shortVolScore && longVolScore > 0.3) {
    direction = 'long-vol';
    score = Math.min(longVolScore, 1);
  } else if (shortVolScore > longVolScore && shortVolScore > 0.3) {
    direction = 'short-vol';
    score = Math.min(shortVolScore, 1);
  } else {
    score = Math.max(longVolScore, shortVolScore, 0.1);
  }

  let confidenceLevel: 'low' | 'medium' | 'high' = 'medium';
  if (score > 0.7) {
    confidenceLevel = 'high';
  } else if (score < 0.3) {
    confidenceLevel = 'low';
  }

  let reasoning = '';
  if (direction === 'long-vol') {
    reasoning = `Polymarket shows ${Math.round(uncertainty * 100)}% uncertainty, but IV rank is only ${optionsIVRank}%. Options may be underpricing the potential move.`;
  } else if (direction === 'short-vol') {
    reasoning = `Polymarket shows ${Math.round(confidence * 100)}% confidence, but IV rank is ${optionsIVRank}%. Options may be overpricing the expected move.`;
  } else {
    reasoning = `Markets appear aligned. Polymarket probability (${Math.round(prob * 100)}%) and IV rank (${optionsIVRank}%) don't show significant disagreement.`;
  }

  return {
    score,
    direction,
    confidence: confidenceLevel,
    reasoning,
  };
};

// ============ Event-Ticker Mapping ============

let mappings: EventTickerMapping[] = [];

/**
 * Load mappings from AsyncStorage or bundled data
 */
export const loadMappings = async (): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(MAPPINGS_CACHE_KEY);
    if (stored) {
      const data: EventMappingsFile = JSON.parse(stored);
      mappings = data.mappings.filter(m => m.active);
    }
  } catch (error) {
    console.warn('Could not load Polymarket mappings:', error);
    mappings = [];
  }
};

export const saveMappings = async (): Promise<void> => {
  const data: EventMappingsFile = {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    mappings,
  };
  await AsyncStorage.setItem(MAPPINGS_CACHE_KEY, JSON.stringify(data));
};

export const setMappings = (newMappings: EventTickerMapping[]): void => {
  mappings = newMappings;
};

export const getMappings = (): EventTickerMapping[] => {
  return mappings.filter(m => m.active);
};

export const getMappingsForTicker = (ticker: string): EventTickerMapping[] => {
  return mappings.filter(m => m.ticker === ticker && m.active);
};

export const getMappingsForEventType = (eventType: EventType): EventTickerMapping[] => {
  return mappings.filter(m => m.eventType === eventType && m.active);
};

export const addMapping = (mapping: Omit<EventTickerMapping, 'addedAt' | 'active'>): EventTickerMapping => {
  const newMapping: EventTickerMapping = {
    ...mapping,
    addedAt: new Date().toISOString(),
    active: true,
  };
  mappings.push(newMapping);
  return newMapping;
};

export const removeMapping = (polymarketSlug: string): void => {
  const index = mappings.findIndex(m => m.polymarketSlug === polymarketSlug);
  if (index !== -1) {
    mappings[index].active = false;
  }
};

// ============ Combined Analysis ============

export const createEventAnalysis = (
  event: PolymarketEvent,
  mapping: EventTickerMapping,
  optionsData: {
    iv: number;
    ivRank: number;
    expectedMove: number;
  }
): EventAnalysis => {
  const market = getMainMarket(event);
  const probability = market ? getPrimaryProbability(market) : 0.5;
  const volume = market ? market.volumeNum : 0;

  const gapScore = calculateGapScore(
    probability,
    optionsData.iv,
    optionsData.expectedMove,
    optionsData.ivRank,
    mapping.eventType
  );

  const now = new Date();

  return {
    eventId: event.id,
    ticker: mapping.ticker,
    eventType: mapping.eventType,
    eventName: event.title,
    eventDate: event.endDate,
    polymarketProbability: probability,
    polymarketVolume: volume,
    optionsIV: optionsData.iv,
    optionsIVRank: optionsData.ivRank,
    optionsExpectedMove: optionsData.expectedMove,
    gapScore,
    fetchedAt: now.toISOString(),
    cacheExpiresAt: new Date(now.getTime() + CACHE_DURATION_MS).toISOString(),
  };
};

// ============ Utility Functions ============

export const formatProbability = (probability: number): string => {
  return `${Math.round(probability * 100)}%`;
};

export const getGapScoreColor = (score: number): string => {
  if (score >= 0.7) return '#f87171'; // red-400
  if (score >= 0.4) return '#facc15'; // yellow-400
  return '#94a3b8'; // slate-400
};

export const getEventTypeIcon = (eventType: EventType): string => {
  switch (eventType) {
    case 'earnings':
      return 'chart-bar';
    case 'fda':
      return 'medical-bag';
    case 'macro':
      return 'bank';
    case 'corporate':
      return 'office-building';
    default:
      return 'calendar';
  }
};

export const getEventTypeDisplayName = (eventType: EventType): string => {
  switch (eventType) {
    case 'earnings':
      return 'Earnings';
    case 'fda':
      return 'FDA/Regulatory';
    case 'macro':
      return 'Macro/Fed';
    case 'corporate':
      return 'Corporate Action';
    default:
      return 'Event';
  }
};

// Initialize mappings on import
loadMappings().catch(console.error);
