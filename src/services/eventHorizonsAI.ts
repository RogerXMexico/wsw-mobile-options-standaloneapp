/**
 * Event Horizons AI Service (Mobile)
 *
 * Gemini-powered signal synthesis for the Event Horizons module.
 * Analyzes prediction market vs options volatility gaps to surface
 * actionable educational insights.
 *
 * Uses the same callGemini() pattern as geminiService.ts:
 *   - Routes through EXPO_PUBLIC_AI_PROXY_URL when configured, OR
 *   - Calls the Gemini REST API directly with a user-provided key from SecureStore.
 *
 * Caching: in-memory Map with 15-minute TTL (same as desktop).
 * Persistent caching via AsyncStorage for offline fallback.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import {
  EventType,
  GeminiEventAnalysisRequest,
} from '../types/polymarket';
import { CuratedCaseStudy } from '../data/curatedCaseStudies';

// ============ Constants ============

const GEMINI_API_KEY_STORAGE = 'gemini_api_key';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const AI_PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL || '';

const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ASYNC_STORAGE_CACHE_KEY = 'event_horizons_ai_cache';

// ============ Gemini Caller (shared pattern with geminiService.ts) ============

async function callGemini(prompt: string): Promise<string | null> {
  // If a proxy URL is configured, use it
  if (AI_PROXY_URL) {
    const response = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`AI proxy returned ${response.status}`);
    }

    const data = await response.json();
    return data.text ?? null;
  }

  // Direct Gemini API call with user's API key
  const apiKey = await SecureStore.getItemAsync(GEMINI_API_KEY_STORAGE);
  if (!apiKey) {
    throw new Error(
      'Gemini API key not configured. Add your key in Settings or configure a proxy URL.'
    );
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

// ============ Types ============

export interface EventSignalAnalysis {
  // Main assessment
  volatilityVerdict: 'overpriced' | 'underpriced' | 'fairly-priced';
  confidenceScore: number; // 0-100
  recommendedAction: 'long-vol' | 'short-vol' | 'avoid' | 'wait';

  // Detailed analysis
  gapExplanation: string;
  sentimentSummary: string;
  keyFactors: string[];
  riskWarnings: string[];

  // Trade suggestions
  suggestedStrategies: {
    name: string;
    rationale: string;
  }[];

  // Mentor wisdom
  chameleonInsight: string;

  // Metadata
  generatedAt: string;
  isFromCache: boolean;
}

export interface CaseStudyInsight {
  whatWorked: string;
  whatFailed: string;
  keyLesson: string;
  howToSpot: string;
  avoidInFuture: string;
}

export interface QuickSignal {
  emoji: string;
  label: string;
  color: 'emerald' | 'amber' | 'rose' | 'slate';
  oneLiner: string;
}

// ============ In-Memory Cache ============

const analysisCache = new Map<
  string,
  { data: EventSignalAnalysis; expiresAt: number }
>();

const getCacheKey = (request: GeminiEventAnalysisRequest): string => {
  return `${request.eventName}-${request.polymarketProbability.toFixed(2)}-${request.optionsIV.toFixed(0)}`;
};

// ============ Persistent Cache (AsyncStorage) ============

interface PersistedCacheEntry {
  data: EventSignalAnalysis;
  expiresAt: number;
  cacheKey: string;
}

/**
 * Persist the in-memory cache to AsyncStorage for offline access.
 * Only stores the most recent 20 entries to limit storage use.
 */
async function persistCache(): Promise<void> {
  try {
    const entries: PersistedCacheEntry[] = [];
    analysisCache.forEach((value, key) => {
      entries.push({ cacheKey: key, ...value });
    });
    // Keep only the 20 most recent
    const sorted = entries.sort((a, b) => b.expiresAt - a.expiresAt).slice(0, 20);
    await AsyncStorage.setItem(ASYNC_STORAGE_CACHE_KEY, JSON.stringify(sorted));
  } catch (error) {
    console.warn('Event Horizons AI: failed to persist cache', error);
  }
}

/**
 * Restore persisted cache entries into the in-memory map (only if still valid).
 */
async function restoreCache(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(ASYNC_STORAGE_CACHE_KEY);
    if (!raw) return;

    const entries: PersistedCacheEntry[] = JSON.parse(raw);
    const now = Date.now();
    for (const entry of entries) {
      if (entry.expiresAt > now) {
        analysisCache.set(entry.cacheKey, {
          data: entry.data,
          expiresAt: entry.expiresAt,
        });
      }
    }
  } catch (error) {
    console.warn('Event Horizons AI: failed to restore cache', error);
  }
}

// Restore cache on module load
restoreCache().catch(console.error);

// ============ Event Analysis ============

export const analyzeEventSignal = async (
  request: GeminiEventAnalysisRequest
): Promise<EventSignalAnalysis> => {
  // Check in-memory cache first
  const cacheKey = getCacheKey(request);
  const cached = analysisCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.data, isFromCache: true };
  }

  try {
    const eventTypeContext = getEventTypeContext(request.eventType);
    const gapDirection = calculateGapDirection(
      request.polymarketProbability,
      request.optionsIV,
      request.optionsIVRank
    );

    const prompt = `
You are Cameron the Chameleon, an expert options trader who specializes in reading TWO markets simultaneously: prediction markets and options volatility. You help students spot opportunities where these markets disagree.

ANALYZE THIS EVENT:
- Event: ${request.eventName}
- Event Type: ${request.eventType.toUpperCase()}
- Ticker: ${request.ticker || 'N/A (macro event)'}
- Event Date: ${request.eventDate}

MARKET DATA:
- Prediction Market Probability: ${(request.polymarketProbability * 100).toFixed(1)}%
- Options Implied Volatility: ${request.optionsIV.toFixed(1)}%
- IV Rank (percentile): ${request.optionsIVRank}
- Options Expected Move: +/-${request.optionsExpectedMove.toFixed(1)}%
${request.historicalIVCrushAverage ? `- Historical IV Crush Average: ${request.historicalIVCrushAverage.toFixed(1)}%` : ''}

EVENT TYPE CONTEXT:
${eventTypeContext}

PRELIMINARY GAP ANALYSIS:
Gap Direction: ${gapDirection.direction}
Gap Magnitude: ${gapDirection.magnitude}/10

Provide your analysis in the following JSON format ONLY (no markdown, no explanation outside JSON):
{
  "volatilityVerdict": "overpriced" | "underpriced" | "fairly-priced",
  "confidenceScore": <number 0-100>,
  "recommendedAction": "long-vol" | "short-vol" | "avoid" | "wait",
  "gapExplanation": "<2-3 sentence explanation of the gap between prediction probability and options IV>",
  "sentimentSummary": "<1-2 sentence summary of what the market is saying>",
  "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"],
  "riskWarnings": ["<warning 1>", "<warning 2>"],
  "suggestedStrategies": [
    {"name": "<strategy name>", "rationale": "<1 sentence why>"},
    {"name": "<strategy name>", "rationale": "<1 sentence why>"}
  ],
  "chameleonInsight": "<A memorable 1-2 sentence teaching moment in Cameron's voice, using jungle/chameleon metaphors about adapting to both markets>"
}

IMPORTANT GUIDELINES:
- If prediction probability is HIGH but IV is LOW = volatility may be UNDERPRICED (long vol opportunity)
- If prediction probability is MODERATE but IV is VERY HIGH = volatility may be OVERPRICED (short vol opportunity)
- Consider the event type: ${request.eventType} events have specific volatility patterns
- IV Rank above 80 suggests options are expensive relative to history
- IV Rank below 30 suggests options are cheap relative to history
- Always include at least 2 risk warnings - nothing is guaranteed
`;

    const text = await callGemini(prompt);
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const analysis: EventSignalAnalysis = {
      volatilityVerdict: parsed.volatilityVerdict || 'fairly-priced',
      confidenceScore: Math.min(100, Math.max(0, parsed.confidenceScore || 50)),
      recommendedAction: parsed.recommendedAction || 'wait',
      gapExplanation: parsed.gapExplanation || 'Unable to determine gap.',
      sentimentSummary: parsed.sentimentSummary || 'Market sentiment unclear.',
      keyFactors: parsed.keyFactors || [],
      riskWarnings: parsed.riskWarnings || [
        'Always manage position size',
        'Past patterns may not repeat',
      ],
      suggestedStrategies: parsed.suggestedStrategies || [],
      chameleonInsight:
        parsed.chameleonInsight ||
        'Even the chameleon pauses before changing colors. Take your time to understand both markets.',
      generatedAt: new Date().toISOString(),
      isFromCache: false,
    };

    // Cache the result in memory
    analysisCache.set(cacheKey, {
      data: analysis,
      expiresAt: Date.now() + CACHE_DURATION_MS,
    });

    // Persist to AsyncStorage for offline access
    persistCache().catch(console.error);

    return analysis;
  } catch (error) {
    console.error('Event signal analysis failed:', error);
    return getFallbackAnalysis(request);
  }
};

// ============ Case Study Analysis ============

export const analyzeCaseStudy = async (
  caseStudy: CuratedCaseStudy
): Promise<CaseStudyInsight> => {
  try {
    const prompt = `
You are Cameron the Chameleon, teaching students about a historical event that shows how prediction markets and options volatility interacted.

CASE STUDY:
- Event: ${caseStudy.eventName}
- Company: ${caseStudy.companyName}
- Event Type: ${caseStudy.eventType}
- Event Date: ${caseStudy.eventDate}

SETUP:
${caseStudy.setupContext}

OUTCOME:
- Actual Move: ${caseStudy.outcome.actualMove > 0 ? '+' : ''}${caseStudy.outcome.actualMove.toFixed(1)}% (${caseStudy.outcome.direction})
- IV Crush: ${caseStudy.outcome.ivCrushMagnitude.toFixed(1)}%
- Prediction Market Accurate: ${caseStudy.outcome.predictionAccurate ? 'Yes' : 'No'}
- Key Takeaway: ${caseStudy.outcome.keyTakeaway}

TIMELINE DATA (first and last points):
- Before Event: Probability ${(caseStudy.timeline[0].polymarketProbability * 100).toFixed(0)}%, IV ${caseStudy.timeline[0].optionsIV.toFixed(0)}%
- At Event: Probability ${(caseStudy.timeline[caseStudy.timeline.length - 1].polymarketProbability * 100).toFixed(0)}%, IV ${caseStudy.timeline[caseStudy.timeline.length - 1].optionsIV.toFixed(0)}%

Provide a teaching insight in JSON format ONLY:
{
  "whatWorked": "<1-2 sentences on what strategy would have profited>",
  "whatFailed": "<1-2 sentences on what strategy would have lost>",
  "keyLesson": "<The most important lesson from this case in Cameron's voice>",
  "howToSpot": "<How to identify similar setups in the future>",
  "avoidInFuture": "<What to avoid doing in similar situations>"
}
`;

    const text = await callGemini(prompt);
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]) as CaseStudyInsight;
  } catch (error) {
    console.error('Case study analysis failed:', error);
    return {
      whatWorked: 'Strategies aligned with the actual outcome direction.',
      whatFailed: 'Strategies betting against the consensus with poor timing.',
      keyLesson:
        'Both markets told a story - the key was listening to both.',
      howToSpot:
        'Look for gaps between prediction probability and options IV rank.',
      avoidInFuture:
        'Avoid ignoring one market in favor of the other.',
    };
  }
};

// ============ Quick Signal Summary ============

export const getQuickSignal = async (
  probability: number,
  iv: number,
  ivRank: number,
  _eventType: EventType
): Promise<QuickSignal> => {
  // Fast heuristic-based signal (no API call needed)
  const gapDirection = calculateGapDirection(probability, iv, ivRank);

  if (gapDirection.magnitude < 3) {
    return {
      emoji: 'balance-scale',
      label: 'Fair Value',
      color: 'slate',
      oneLiner: 'Markets are aligned - no clear edge.',
    };
  }

  if (gapDirection.direction === 'long-vol') {
    if (gapDirection.magnitude >= 7) {
      return {
        emoji: 'flame',
        label: 'Strong Long Vol',
        color: 'emerald',
        oneLiner: 'High conviction event, options look cheap!',
      };
    }
    return {
      emoji: 'trending-up',
      label: 'Lean Long Vol',
      color: 'emerald',
      oneLiner:
        'Prediction market suggests more upside than options pricing.',
    };
  }

  if (gapDirection.direction === 'short-vol') {
    if (gapDirection.magnitude >= 7) {
      return {
        emoji: 'snow',
        label: 'Strong Short Vol',
        color: 'rose',
        oneLiner: 'IV looks stretched - consider selling premium.',
      };
    }
    return {
      emoji: 'trending-down',
      label: 'Lean Short Vol',
      color: 'amber',
      oneLiner:
        'Options may be pricing in more risk than warranted.',
    };
  }

  return {
    emoji: 'help-circle',
    label: 'Mixed Signals',
    color: 'amber',
    oneLiner: 'Conflicting data - dig deeper before trading.',
  };
};

// ============ Helper Functions ============

function getEventTypeContext(eventType: EventType): string {
  switch (eventType) {
    case 'earnings':
      return `Earnings events typically see:
- IV builds up 1-2 weeks before announcement
- IV crushes 50-80% immediately after results
- Prediction markets often price binary beat/miss outcomes
- Options price the magnitude of move, not direction`;

    case 'fda':
      return `FDA/regulatory events typically see:
- Extreme IV levels (100%+) for binary outcomes
- Massive IV crush regardless of outcome
- Prediction markets closely track approval odds
- All-or-nothing outcome makes sizing critical`;

    case 'macro':
      return `Macro events (Fed, CPI, Jobs) typically see:
- Market-wide impact, not single-stock
- Moderate IV elevation before event
- Quick IV normalization after
- Prediction markets price specific outcomes (rate changes, CPI levels)`;

    case 'corporate':
      return `Corporate events (M&A, leadership, product) typically see:
- Variable IV impact depending on significance
- Longer resolution timelines possible
- Prediction markets may have incomplete information
- Gap opportunities often persist longer`;

    default:
      return 'Unknown event type - exercise caution.';
  }
}

function calculateGapDirection(
  probability: number,
  _iv: number,
  ivRank: number
): { direction: 'long-vol' | 'short-vol' | 'neutral'; magnitude: number } {
  // Probability > 70% with low IV rank = potential long vol
  // Probability < 50% with high IV rank = potential short vol

  const probSignal = probability > 0.7 ? 1 : probability < 0.4 ? -1 : 0;
  const ivRankSignal = ivRank > 70 ? -1 : ivRank < 30 ? 1 : 0;

  // Calculate magnitude based on how extreme the gap is
  const probExtreme = Math.abs(probability - 0.5) * 2; // 0-1
  const ivRankExtreme = Math.abs(ivRank - 50) / 50; // 0-1
  const magnitude = Math.round((probExtreme + ivRankExtreme) * 5); // 0-10

  // If signals agree on underpriced vol
  if (probSignal > 0 && ivRankSignal > 0) {
    return { direction: 'long-vol', magnitude };
  }

  // If signals agree on overpriced vol
  if (probSignal < 0 && ivRankSignal < 0) {
    return { direction: 'short-vol', magnitude };
  }

  // Mixed or neutral signals
  if (magnitude < 3) {
    return { direction: 'neutral', magnitude };
  }

  // One signal is strong, use that
  if (ivRank > 80) {
    return { direction: 'short-vol', magnitude };
  }
  if (ivRank < 20 && probability > 0.6) {
    return { direction: 'long-vol', magnitude };
  }

  return { direction: 'neutral', magnitude };
}

function getFallbackAnalysis(
  request: GeminiEventAnalysisRequest
): EventSignalAnalysis {
  const gap = calculateGapDirection(
    request.polymarketProbability,
    request.optionsIV,
    request.optionsIVRank
  );

  return {
    volatilityVerdict:
      gap.direction === 'long-vol'
        ? 'underpriced'
        : gap.direction === 'short-vol'
          ? 'overpriced'
          : 'fairly-priced',
    confidenceScore: 50,
    recommendedAction:
      gap.magnitude < 3
        ? 'wait'
        : gap.direction === 'neutral'
          ? 'avoid'
          : gap.direction,
    gapExplanation:
      'AI analysis unavailable. Based on heuristics: ' +
      (gap.direction === 'neutral'
        ? 'Markets appear aligned.'
        : `There may be a ${gap.direction} opportunity with magnitude ${gap.magnitude}/10.`),
    sentimentSummary: 'Unable to generate sentiment summary without AI.',
    keyFactors: [
      `Prediction probability: ${(request.polymarketProbability * 100).toFixed(0)}%`,
      `IV Rank: ${request.optionsIVRank}`,
      `Event type: ${request.eventType}`,
    ],
    riskWarnings: [
      'AI analysis unavailable - use extra caution',
      'Always verify with your own research',
      'Never risk more than you can afford to lose',
    ],
    suggestedStrategies: [],
    chameleonInsight:
      'Even when the AI rests, the chameleon keeps watching both markets. Trust your training.',
    generatedAt: new Date().toISOString(),
    isFromCache: false,
  };
}

// ============ Clear Cache ============

export const clearAnalysisCache = (): void => {
  analysisCache.clear();
  AsyncStorage.removeItem(ASYNC_STORAGE_CACHE_KEY).catch(console.error);
};
