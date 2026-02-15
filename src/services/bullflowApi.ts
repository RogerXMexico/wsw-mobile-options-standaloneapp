/**
 * Bullflow Streaming API Service (Mobile)
 *
 * Real-time options flow alerts via SSE.
 * Get an API key at https://bullflow.io
 *
 * Mobile calls the Bullflow API directly (no CORS proxy needed).
 */

import * as SecureStore from 'expo-secure-store';

const BULLFLOW_BASE_URL = 'https://api.bullflow.io';
const BULLFLOW_KEY_STORAGE = 'bullflow_api_key';

export const getBullflowApiKey = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(BULLFLOW_KEY_STORAGE);
};

export const setBullflowApiKey = async (key: string): Promise<void> => {
  if (key) {
    await SecureStore.setItemAsync(BULLFLOW_KEY_STORAGE, key);
  } else {
    await SecureStore.deleteItemAsync(BULLFLOW_KEY_STORAGE);
  }
};

export const getStreamUrl = (key: string): string => {
  return `${BULLFLOW_BASE_URL}/v1/streaming/alerts?key=${encodeURIComponent(key)}`;
};

export interface ParsedOption {
  ticker: string;
  expiry: string;       // "YYYY-MM-DD"
  type: 'call' | 'put';
  strike: number;
}

export interface BullflowAlert {
  alertType: 'algo' | 'custom';
  symbol: string;
  alertName: string;
  alertPremium: number;
  timestamp: number;
  parsed: ParsedOption;
}

export type StreamStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Parse OCC symbol format
 * Input: "O:AMD251205P00205000" -> { ticker: "AMD", expiry: "2025-12-05", type: "put", strike: 205.00 }
 */
export function parseOCCSymbol(symbol: string): ParsedOption {
  let raw = symbol.startsWith('O:') ? symbol.slice(2) : symbol;

  // Format: TICKER + YYMMDD + C/P + 8-digit strike
  // Last 15 chars = 6 date + 1 type + 8 strike
  const tail = raw.slice(-15);
  const ticker = raw.slice(0, -15);

  const yy = tail.slice(0, 2);
  const mm = tail.slice(2, 4);
  const dd = tail.slice(4, 6);
  const typeChar = tail.slice(6, 7);
  const strikeRaw = tail.slice(7, 15);

  const year = `20${yy}`;
  const expiry = `${year}-${mm}-${dd}`;
  const type: 'call' | 'put' = typeChar === 'C' ? 'call' : 'put';
  const strike = parseInt(strikeRaw, 10) / 1000;

  return {
    ticker: ticker || 'UNKNOWN',
    expiry,
    type,
    strike,
  };
}
