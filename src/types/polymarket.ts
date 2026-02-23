// Polymarket API Types for Event Horizons Module

export interface PolymarketEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  closed: boolean;
  archived: boolean;
  markets: PolymarketMarket[];
  tags: string[];
  image?: string;
}

export interface PolymarketMarket {
  id: string;
  slug: string;
  question: string;
  conditionId: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  volumeNum: number;
  liquidity: string;
  liquidityNum: number;
  active: boolean;
  closed: boolean;
  acceptingOrders: boolean;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  resolutionSource?: string;
}

export type EventType = 'earnings' | 'fda' | 'macro' | 'corporate';

export interface EventTickerMapping {
  polymarketSlug: string;
  ticker: string | null;
  eventType: EventType;
  displayName?: string;
  notes?: string;
  addedAt: string;
  active: boolean;
}

export interface EventMappingsFile {
  version: string;
  lastUpdated: string;
  mappings: EventTickerMapping[];
}

export interface GapScore {
  score: number;
  direction: 'long-vol' | 'short-vol' | 'neutral';
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;
}

export interface EventAnalysis {
  eventId: string;
  ticker: string | null;
  eventType: EventType;
  eventName: string;
  eventDate: string;
  polymarketProbability: number;
  polymarketVolume: number;
  optionsIV: number;
  optionsIVRank: number;
  optionsExpectedMove: number;
  gapScore: GapScore;
  fetchedAt: string;
  cacheExpiresAt: string;
}

export interface PolymarketCache {
  events: Record<string, {
    data: PolymarketEvent;
    fetchedAt: string;
    expiresAt: string;
  }>;
  lastFullRefresh: string;
}

// ============ Gemini AI Analysis Types ============

export interface GeminiEventAnalysisRequest {
  eventName: string;
  eventType: EventType;
  ticker: string | null;
  eventDate: string;
  polymarketProbability: number;
  optionsIV: number;
  optionsIVRank: number;
  optionsExpectedMove: number;
  historicalIVCrushAverage?: number;
}
