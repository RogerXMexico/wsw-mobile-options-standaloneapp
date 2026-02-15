/**
 * Gemini AI Service (Mobile)
 *
 * Calls the Gemini API directly with a user-provided API key (SecureStore),
 * or routes through a configurable proxy URL (EXPO_PUBLIC_AI_PROXY_URL).
 */

import * as SecureStore from 'expo-secure-store';

const GEMINI_API_KEY_STORAGE = 'gemini_api_key';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Optional proxy URL for teams that want to centralize API keys server-side
const AI_PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL || '';

export const getGeminiApiKey = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(GEMINI_API_KEY_STORAGE);
};

export const setGeminiApiKey = async (key: string): Promise<void> => {
  await SecureStore.setItemAsync(GEMINI_API_KEY_STORAGE, key);
};

export const clearGeminiApiKey = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(GEMINI_API_KEY_STORAGE);
};

/**
 * Call Gemini — either direct or through proxy
 */
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
  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Add your key in Settings or configure a proxy URL.');
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

interface LiveMarketData {
  iv: number;
  change: number;
  isLive: boolean;
  strike?: number;
  expiration?: string;
  dte?: number;
}

interface StrategyInfo {
  name: string;
  outlook?: string;
  objective?: string;
}

export const generateMarketAnalysis = async (
  strategy: StrategyInfo,
  ticker: string,
  currentPrice: number,
  volatility: string,
  liveData?: LiveMarketData
) => {
  try {
    const dataSourceNote = liveData?.isLive
      ? 'LIVE DATA from market feed'
      : 'Using simulated data (add Tradier API key for live feeds)';

    const liveDataContext = liveData?.isLive
      ? `
      - Implied Volatility: ${liveData.iv.toFixed(1)}%
      - Today's Change: ${liveData.change >= 0 ? '+' : ''}${liveData.change.toFixed(2)}%${liveData.strike ? `
      - Selected Strike: $${liveData.strike}` : ''}${liveData.expiration ? `
      - Expiration: ${liveData.expiration} (${liveData.dte} DTE)` : ''}`
      : '';

    const prompt = `
      You are an expert options trading mentor in a "Neon Jungle" themed app.
      The user is looking at the "${strategy.name}" strategy for ticker "${ticker}".

      ${dataSourceNote}

      Market Context:
      - Current Price: $${currentPrice.toFixed(2)}
      - Volatility Level: ${volatility}${liveDataContext}
      - Strategy Goal: ${strategy.outlook}
      - Strategy Type: ${strategy.objective}

      Based on this ${liveData?.isLive ? 'LIVE' : 'simulated'} market data, provide a concise 3-bullet analysis:

      1. **Jungle Vibe Check**: Is this environment favorable for a ${strategy.name}? Consider the current IV level${liveData?.dte ? `, the ${liveData.dte} days to expiration,` : ''} and price action. Use jungle/ecosystem metaphors.

      2. **Key Risk**: What's the biggest danger for this specific ${strategy.name}${liveData?.strike ? ` at the $${liveData.strike} strike` : ''} right now?${liveData?.dte && liveData.dte < 14 ? ' Note: This is a short-dated option with accelerated theta decay.' : ''}

      3. **Pro Tip**: One actionable trade management tip for this specific setup.${liveData?.strike && liveData?.isLive ? ` Given the $${liveData.strike} strike vs $${currentPrice.toFixed(2)} stock price, is this ITM/ATM/OTM appropriate?` : ''} Include exit target or adjustment trigger.

      Keep it short, punchy, and educational. Each bullet should be 1-2 sentences max.
    `;

    return await callGemini(prompt);
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return "The jungle feeds are currently down. Proceed with caution based on standard strategy rules.";
  }
};

export const suggestStrategy = async (outlook: string, volatility: string, experience: string) => {
  try {
    const prompt = `
      Recommend one options strategy for a user with these parameters:
      - Market Outlook: ${outlook}
      - Volatility Expectation: ${volatility}
      - Experience Level: ${experience}

      Return ONLY the name of the strategy from standard options theory (e.g., "Iron Condor", "Long Call", "Credit Spread").
      Then add a pipe character "|" followed by a one sentence "Spirit Animal" reason why.
      Example: "Iron Condor|The Crab moves sideways, just like you expect the market to do."
    `;

    return await callGemini(prompt);
  } catch (error) {
    console.error("Gemini suggestion failed", error);
    return "Long Call|The Bull charges ahead when data is scarce.";
  }
};
