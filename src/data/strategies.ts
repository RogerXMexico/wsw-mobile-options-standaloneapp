// Strategy data for Wall Street Wildlife Mobile
// Ported from web app with payoff chart configurations

import { Strategy } from './types';

// Strategy leg configurations for payoff charts
export interface StrategyConfig {
  id: string;
  legs: StrategyLeg[];
  defaultStockPrice: number;
}

// Leg type for chart calculations
export interface StrategyLeg {
  type: 'call' | 'put';
  strike: number;
  position: 'long' | 'short';
  premium: number;
  quantity?: number;
}

// Strategy configurations with example legs for payoff diagrams
export const strategyConfigs: Record<string, StrategyConfig> = {
  'long-call': {
    id: 'long-call',
    legs: [{ type: 'call', strike: 100, position: 'long', premium: 3 }],
    defaultStockPrice: 100,
  },
  'long-put': {
    id: 'long-put',
    legs: [{ type: 'put', strike: 100, position: 'long', premium: 3 }],
    defaultStockPrice: 100,
  },
  'short-call': {
    id: 'short-call',
    legs: [{ type: 'call', strike: 100, position: 'short', premium: 3 }],
    defaultStockPrice: 100,
  },
  'short-put': {
    id: 'short-put',
    legs: [{ type: 'put', strike: 100, position: 'short', premium: 3 }],
    defaultStockPrice: 100,
  },
  'covered-call': {
    id: 'covered-call',
    legs: [{ type: 'call', strike: 105, position: 'short', premium: 2 }],
    defaultStockPrice: 100,
  },
  'cash-secured-put': {
    id: 'cash-secured-put',
    legs: [{ type: 'put', strike: 95, position: 'short', premium: 2 }],
    defaultStockPrice: 100,
  },
  'bull-call-spread': {
    id: 'bull-call-spread',
    legs: [
      { type: 'call', strike: 100, position: 'long', premium: 4 },
      { type: 'call', strike: 110, position: 'short', premium: 1.5 },
    ],
    defaultStockPrice: 100,
  },
  'bear-put-spread': {
    id: 'bear-put-spread',
    legs: [
      { type: 'put', strike: 100, position: 'long', premium: 4 },
      { type: 'put', strike: 90, position: 'short', premium: 1.5 },
    ],
    defaultStockPrice: 100,
  },
  'bull-put-spread': {
    id: 'bull-put-spread',
    legs: [
      { type: 'put', strike: 95, position: 'short', premium: 3 },
      { type: 'put', strike: 90, position: 'long', premium: 1 },
    ],
    defaultStockPrice: 100,
  },
  'bear-call-spread': {
    id: 'bear-call-spread',
    legs: [
      { type: 'call', strike: 105, position: 'short', premium: 3 },
      { type: 'call', strike: 110, position: 'long', premium: 1 },
    ],
    defaultStockPrice: 100,
  },
  'long-straddle': {
    id: 'long-straddle',
    legs: [
      { type: 'call', strike: 100, position: 'long', premium: 3 },
      { type: 'put', strike: 100, position: 'long', premium: 3 },
    ],
    defaultStockPrice: 100,
  },
  'short-straddle': {
    id: 'short-straddle',
    legs: [
      { type: 'call', strike: 100, position: 'short', premium: 3 },
      { type: 'put', strike: 100, position: 'short', premium: 3 },
    ],
    defaultStockPrice: 100,
  },
  'long-strangle': {
    id: 'long-strangle',
    legs: [
      { type: 'call', strike: 105, position: 'long', premium: 2 },
      { type: 'put', strike: 95, position: 'long', premium: 2 },
    ],
    defaultStockPrice: 100,
  },
  'short-strangle': {
    id: 'short-strangle',
    legs: [
      { type: 'call', strike: 105, position: 'short', premium: 2 },
      { type: 'put', strike: 95, position: 'short', premium: 2 },
    ],
    defaultStockPrice: 100,
  },
  'iron-condor': {
    id: 'iron-condor',
    legs: [
      { type: 'put', strike: 90, position: 'long', premium: 0.5 },
      { type: 'put', strike: 95, position: 'short', premium: 1.5 },
      { type: 'call', strike: 105, position: 'short', premium: 1.5 },
      { type: 'call', strike: 110, position: 'long', premium: 0.5 },
    ],
    defaultStockPrice: 100,
  },
  'iron-butterfly': {
    id: 'iron-butterfly',
    legs: [
      { type: 'put', strike: 95, position: 'long', premium: 1 },
      { type: 'put', strike: 100, position: 'short', premium: 3 },
      { type: 'call', strike: 100, position: 'short', premium: 3 },
      { type: 'call', strike: 105, position: 'long', premium: 1 },
    ],
    defaultStockPrice: 100,
  },
  'long-call-butterfly': {
    id: 'long-call-butterfly',
    legs: [
      { type: 'call', strike: 95, position: 'long', premium: 6 },
      { type: 'call', strike: 100, position: 'short', premium: 3, quantity: 2 },
      { type: 'call', strike: 105, position: 'long', premium: 1 },
    ],
    defaultStockPrice: 100,
  },
  'protective-put': {
    id: 'protective-put',
    legs: [{ type: 'put', strike: 95, position: 'long', premium: 2 }],
    defaultStockPrice: 100,
  },
  'collar': {
    id: 'collar',
    legs: [
      { type: 'put', strike: 95, position: 'long', premium: 2 },
      { type: 'call', strike: 105, position: 'short', premium: 2 },
    ],
    defaultStockPrice: 100,
  },
  'jade-lizard': {
    id: 'jade-lizard',
    legs: [
      { type: 'put', strike: 95, position: 'short', premium: 2 },
      { type: 'call', strike: 105, position: 'short', premium: 1.5 },
      { type: 'call', strike: 110, position: 'long', premium: 0.5 },
    ],
    defaultStockPrice: 100,
  },
};

// Full strategy data
export const strategies: Strategy[] = [
  // Tier 0 - Foundations
  {
    id: 'long-call',
    name: 'Long Call',
    tier: 0,
    category: 'basic',
    outlook: 'bullish',
    riskLevel: 'defined',
    maxProfit: 'Unlimited',
    maxLoss: 'Premium paid',
    breakeven: 'Strike + Premium',
    description: 'Buying a call option gives you the right to purchase shares at the strike price. This is a bullish strategy with unlimited profit potential and limited risk.',
    whenToUse: 'Use when you are bullish on a stock and expect significant upward movement before expiration.',
    advantages: ['Limited risk to premium paid', 'Unlimited profit potential', 'Leverage - control shares with less capital'],
    disadvantages: ['Time decay works against you', 'Requires significant move to profit', 'Can lose entire premium if wrong'],
    greeks: {
      delta: 'Positive (0 to 1)',
      gamma: 'Positive',
      theta: 'Negative',
      vega: 'Positive',
    },
    isPremium: false,
  },
  {
    id: 'long-put',
    name: 'Long Put',
    tier: 0,
    category: 'basic',
    outlook: 'bearish',
    riskLevel: 'defined',
    maxProfit: 'Strike - Premium (if stock goes to $0)',
    maxLoss: 'Premium paid',
    breakeven: 'Strike - Premium',
    description: 'Buying a put option gives you the right to sell shares at the strike price. This is a bearish strategy with substantial profit potential and limited risk.',
    whenToUse: 'Use when you are bearish on a stock and expect significant downward movement before expiration.',
    advantages: ['Limited risk to premium paid', 'Profit from downside without shorting stock', 'No margin requirement'],
    disadvantages: ['Time decay works against you', 'Requires significant move to profit', 'Can lose entire premium'],
    greeks: {
      delta: 'Negative (-1 to 0)',
      gamma: 'Positive',
      theta: 'Negative',
      vega: 'Positive',
    },
    isPremium: false,
  },
  {
    id: 'covered-call',
    name: 'Covered Call',
    tier: 0,
    category: 'income',
    outlook: 'neutral-bullish',
    riskLevel: 'reduced',
    maxProfit: 'Premium + (Strike - Stock Price)',
    maxLoss: 'Stock Price - Premium (if stock goes to $0)',
    breakeven: 'Stock Price - Premium',
    description: 'Selling a call against shares you own. Generates income but caps upside potential. One of the most popular income strategies.',
    whenToUse: 'Use when you own shares and have a neutral to slightly bullish outlook. Great for generating income on existing positions.',
    advantages: ['Generates income on existing shares', 'Reduces cost basis', 'Works well in sideways markets'],
    disadvantages: ['Caps upside potential', 'Still exposed to downside risk', 'May have shares called away'],
    greeks: {
      delta: 'Reduced positive (stock delta minus call delta)',
      gamma: 'Negative',
      theta: 'Positive',
      vega: 'Negative',
    },
    isPremium: false,
  },
  {
    id: 'cash-secured-put',
    name: 'Cash-Secured Put',
    tier: 0,
    category: 'income',
    outlook: 'neutral-bullish',
    riskLevel: 'reduced',
    maxProfit: 'Premium received',
    maxLoss: 'Strike - Premium (if stock goes to $0)',
    breakeven: 'Strike - Premium',
    description: 'Selling a put while holding enough cash to buy shares if assigned. A way to get paid to wait for a stock to drop to your target price.',
    whenToUse: 'Use when you want to buy a stock at a lower price and are willing to wait. You get paid while waiting.',
    advantages: ['Generates income while waiting to buy', 'Lower effective purchase price', 'Time decay works for you'],
    disadvantages: ['Obligated to buy if assigned', 'Ties up capital', 'Miss out if stock rallies'],
    greeks: {
      delta: 'Positive',
      gamma: 'Negative',
      theta: 'Positive',
      vega: 'Negative',
    },
    isPremium: false,
  },
  // Tier 1 - Spreads
  {
    id: 'bull-call-spread',
    name: 'Bull Call Spread',
    tier: 1,
    category: 'directional',
    outlook: 'bullish',
    riskLevel: 'defined',
    maxProfit: 'Width of strikes - Net debit',
    maxLoss: 'Net debit paid',
    breakeven: 'Long strike + Net debit',
    description: 'A debit spread that profits from upward movement. Buy a call at a lower strike and sell a call at a higher strike.',
    whenToUse: 'Use when moderately bullish and want to reduce cost compared to buying a call outright.',
    advantages: ['Lower cost than long call', 'Defined risk', 'Reduced impact of time decay'],
    disadvantages: ['Capped profit potential', 'Requires directional accuracy', 'Multiple legs to manage'],
    greeks: {
      delta: 'Net positive',
      gamma: 'Net positive (peaks near long strike)',
      theta: 'Usually negative',
      vega: 'Net positive',
    },
    isPremium: false,
  },
  {
    id: 'bear-put-spread',
    name: 'Bear Put Spread',
    tier: 1,
    category: 'directional',
    outlook: 'bearish',
    riskLevel: 'defined',
    maxProfit: 'Width of strikes - Net debit',
    maxLoss: 'Net debit paid',
    breakeven: 'Long strike - Net debit',
    description: 'A debit spread that profits from downward movement. Buy a put at a higher strike and sell a put at a lower strike.',
    whenToUse: 'Use when moderately bearish and want to reduce cost compared to buying a put outright.',
    advantages: ['Lower cost than long put', 'Defined risk', 'Reduced impact of time decay'],
    disadvantages: ['Capped profit potential', 'Requires directional accuracy', 'Multiple legs to manage'],
    greeks: {
      delta: 'Net negative',
      gamma: 'Net positive (peaks near long strike)',
      theta: 'Usually negative',
      vega: 'Net positive',
    },
    isPremium: true,
  },
  {
    id: 'bull-put-spread',
    name: 'Bull Put Spread',
    tier: 1,
    category: 'income',
    outlook: 'neutral-bullish',
    riskLevel: 'defined',
    maxProfit: 'Net credit received',
    maxLoss: 'Width of strikes - Net credit',
    breakeven: 'Short strike - Net credit',
    description: 'A credit spread that profits from the stock staying above the short strike. Sell a put at a higher strike and buy a put at a lower strike.',
    whenToUse: 'Use when bullish or neutral and want to collect premium with defined risk.',
    advantages: ['Collect premium upfront', 'Time decay works for you', 'Defined risk'],
    disadvantages: ['Risk larger than reward', 'Requires stock to stay above strikes', 'Assignment risk'],
    greeks: {
      delta: 'Net positive',
      gamma: 'Net negative',
      theta: 'Net positive',
      vega: 'Net negative',
    },
    isPremium: true,
  },
  {
    id: 'iron-condor',
    name: 'Iron Condor',
    tier: 2,
    category: 'income',
    outlook: 'neutral',
    riskLevel: 'defined',
    maxProfit: 'Net credit received',
    maxLoss: 'Width of widest spread - Net credit',
    breakeven: 'Two breakevens at short strikes +/- credit',
    description: 'A neutral strategy combining a bull put spread and bear call spread. Profits when the stock stays within a range.',
    whenToUse: 'Use in low volatility environments when expecting the stock to stay range-bound.',
    advantages: ['Defined risk on both sides', 'Profits from time decay', 'Wide profit zone'],
    disadvantages: ['Limited profit potential', 'Requires stock to stay in range', 'Multiple legs to manage'],
    greeks: {
      delta: 'Near zero',
      gamma: 'Net negative',
      theta: 'Net positive',
      vega: 'Net negative',
    },
    isPremium: true,
  },
  {
    id: 'long-straddle',
    name: 'Long Straddle',
    tier: 2,
    category: 'volatility',
    outlook: 'volatility',
    riskLevel: 'defined',
    maxProfit: 'Unlimited',
    maxLoss: 'Total premium paid',
    breakeven: 'Strike +/- Total premium',
    description: 'Buy both a call and put at the same strike. Profits from large moves in either direction.',
    whenToUse: 'Use before events that could cause large moves (earnings, FDA decisions, etc.) when IV is relatively low.',
    advantages: ['Profits from big moves either direction', 'Defined risk', 'Great for high-volatility events'],
    disadvantages: ['Expensive strategy', 'Time decay hurts both legs', 'Needs significant move to profit'],
    greeks: {
      delta: 'Near zero initially',
      gamma: 'Very positive',
      theta: 'Very negative',
      vega: 'Very positive',
    },
    isPremium: true,
  },
  {
    id: 'iron-butterfly',
    name: 'Iron Butterfly',
    tier: 3,
    category: 'income',
    outlook: 'neutral',
    riskLevel: 'defined',
    maxProfit: 'Net credit received',
    maxLoss: 'Width of wing - Net credit',
    breakeven: 'Short strike +/- Net credit',
    description: 'A more aggressive neutral strategy than iron condor. Sell ATM straddle and buy OTM strangle for protection.',
    whenToUse: 'Use when expecting very little movement and high IV to maximize premium collected.',
    advantages: ['Higher credit than iron condor', 'Defined risk', 'Maximum profit at exact strike'],
    disadvantages: ['Narrow profit zone', 'Higher risk than iron condor', 'Requires precise prediction'],
    greeks: {
      delta: 'Near zero',
      gamma: 'Very negative',
      theta: 'Very positive',
      vega: 'Very negative',
    },
    isPremium: true,
  },
  {
    id: 'protective-put',
    name: 'Protective Put',
    tier: 1,
    category: 'hedging',
    outlook: 'bullish',
    riskLevel: 'defined',
    maxProfit: 'Unlimited',
    maxLoss: 'Stock price - Strike + Premium',
    breakeven: 'Stock price + Premium',
    description: 'Buying a put to protect existing stock position. Acts as insurance against downside.',
    whenToUse: 'Use when you want to protect gains or limit losses on a stock position you want to keep.',
    advantages: ['Protects against downside', 'Unlimited upside potential', 'Peace of mind'],
    disadvantages: ['Costs premium (like insurance)', 'Reduces overall returns', 'Time decay'],
    greeks: {
      delta: 'Net positive (stock + put)',
      gamma: 'Positive from put',
      theta: 'Negative from put',
      vega: 'Positive from put',
    },
    isPremium: true,
  },
  {
    id: 'collar',
    name: 'Collar',
    tier: 2,
    category: 'hedging',
    outlook: 'neutral',
    riskLevel: 'defined',
    maxProfit: 'Call strike - Stock price + Net credit/debit',
    maxLoss: 'Stock price - Put strike + Net credit/debit',
    breakeven: 'Stock price +/- Net premium',
    description: 'Protective put funded by selling a covered call. Low-cost or zero-cost downside protection.',
    whenToUse: 'Use to protect a stock position with minimal cost by giving up some upside.',
    advantages: ['Low or no cost protection', 'Defined risk on both sides', 'Good for concentrated positions'],
    disadvantages: ['Caps upside potential', 'Complex to manage', 'May still have small net cost'],
    greeks: {
      delta: 'Reduced positive',
      gamma: 'Near zero',
      theta: 'Near zero',
      vega: 'Near zero',
    },
    isPremium: true,
  },
];

// Get strategy by ID
export const getStrategyById = (id: string): Strategy | undefined => {
  return strategies.find(s => s.id === id);
};

// Get strategies by tier
export const getStrategiesByTier = (tier: number): Strategy[] => {
  return strategies.filter(s => s.tier === tier);
};

// Get strategy config by ID
export const getStrategyConfig = (id: string): StrategyConfig | undefined => {
  return strategyConfigs[id];
};

// Get free strategies (for non-premium users)
export const getFreeStrategies = (): Strategy[] => {
  return strategies.filter(s => !s.isPremium);
};

// Get premium strategies
export const getPremiumStrategies = (): Strategy[] => {
  return strategies.filter(s => s.isPremium);
};
