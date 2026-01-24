// Constants for Wall Street Wildlife Mobile App
import { TierInfo, GlossaryTerm, MascotInfo, AnimalMascot } from './types';

// Tier Information
export const TIER_INFO: TierInfo[] = [
  { tier: 0, name: 'Foundations', color: '#64748b', description: 'Options basics, contracts, the Greeks' },
  { tier: 0.5, name: 'Express Lane', color: '#fbbf24', description: 'Fast-track essentials' },
  { tier: 1, name: 'Market Structure', color: '#3b82f6', description: 'Support/resistance, AVWAP, cycles' },
  { tier: 2, name: 'Risk', color: '#f59e0b', description: 'Position sizing, defined risk' },
  { tier: 3, name: 'The Anchors', color: '#10b981', description: 'Covered calls, cash-secured puts' },
  { tier: 4, name: 'Verticals', color: '#06b6d4', description: 'Bull/bear spreads' },
  { tier: 5, name: 'Volatility', color: '#8b5cf6', description: 'Straddles, strangles, IV plays' },
  { tier: 6, name: 'Time/Skew', color: '#ec4899', description: 'Calendar spreads, diagonals' },
  { tier: 7, name: 'Ratios', color: '#f97316', description: 'Ratio spreads, backspreads' },
  { tier: 8, name: 'Event Horizons', color: '#8b5cf6', description: 'Prediction markets + options analysis', isEventHorizons: true },
  { tier: 9, name: 'Strategy Tools', color: '#f43f5e', description: 'Advanced portfolio strategies' },
  { tier: 10, name: "Let's Play", color: '#10b981', description: 'Practice and real scenarios' },
];

// Glossary of options terms
export const GLOSSARY: GlossaryTerm[] = [
  { term: 'Delta', definition: 'The amount an option price changes for a $1 move in the stock. Also a proxy for probability (0.50 Delta = ~50% chance ITM).', category: 'Greeks' },
  { term: 'Gamma', definition: 'The rate of change of Delta. High Gamma means your P&L swings wildly. Highest for ATM options near expiration.', category: 'Greeks' },
  { term: 'Theta', definition: 'Time decay. The amount of value the option loses every day as it approaches expiration.', category: 'Greeks' },
  { term: 'Vega', definition: 'Sensitivity to Implied Volatility. Long Vega means you profit if IV rises (fear increases).', category: 'Greeks' },
  { term: 'Rho', definition: 'Sensitivity to interest rates. Usually minor unless trading LEAPS.', category: 'Greeks' },
  { term: 'IV', definition: 'Implied Volatility. The market\'s forecast of a likely movement range. High IV = Expensive options.', category: 'Volatility' },
  { term: 'Strike', definition: 'The specific price at which the option holder can buy (Call) or sell (Put) the stock.', category: 'Basics' },
  { term: 'Premium', definition: 'The market price of the option contract.', category: 'Basics' },
  { term: 'Assignment', definition: 'When the option seller is forced to fulfill their obligation (sell/buy stock) because the buyer exercised.', category: 'Mechanics' },
  { term: 'ITM', definition: 'In-The-Money. An option that has intrinsic value.', category: 'Moneyness' },
  { term: 'OTM', definition: 'Out-Of-The-Money. An option with no intrinsic value, consisting only of time value.', category: 'Moneyness' },
  { term: 'ATM', definition: 'At-The-Money. Strike price is equal to current stock price.', category: 'Moneyness' },
  { term: 'LEAP', definition: 'Long-Term Equity Anticipation Security. Options expiring in >1 year.', category: 'Types' },
  { term: 'Debit', definition: 'You pay money to enter the trade.', category: 'Trading' },
  { term: 'Credit', definition: 'You receive money to enter the trade.', category: 'Trading' },
  { term: 'Spread', definition: 'An options strategy involving two or more options with different strikes or expirations.', category: 'Strategies' },
  { term: 'Covered Call', definition: 'Selling a call option against stock you already own to generate income.', category: 'Strategies' },
  { term: 'Naked Option', definition: 'Selling an option without owning the underlying stock. Very risky.', category: 'Strategies' },
  { term: 'Iron Condor', definition: 'A four-leg neutral strategy that profits from low volatility.', category: 'Strategies' },
  { term: 'Straddle', definition: 'Buying both a call and put at the same strike. Profits from big moves in either direction.', category: 'Strategies' },
];

// Animal mascot information
export const MASCOTS: MascotInfo[] = [
  {
    id: 'owl',
    name: 'Professor Owl',
    description: 'The wise mentor who teaches the foundations of options trading.',
    specialty: 'Fundamentals & Education',
    riskLevel: 'low',
    color: '#8b5cf6',
  },
  {
    id: 'bull',
    name: 'Bullseye Bill',
    description: 'Your guide for bullish strategies and riding the market up.',
    specialty: 'Bullish Strategies',
    riskLevel: 'moderate',
    color: '#10b981',
  },
  {
    id: 'bear',
    name: 'Grizzly',
    description: 'Expert in bearish strategies and protecting against downturns.',
    specialty: 'Bearish Strategies',
    riskLevel: 'moderate',
    color: '#ef4444',
  },
  {
    id: 'fox',
    name: 'Foxy',
    description: 'Cunning tactician for advanced and sophisticated strategies.',
    specialty: 'Advanced Tactics',
    riskLevel: 'high',
    color: '#f97316',
  },
  {
    id: 'eagle',
    name: 'Eagle Eye',
    description: 'Sees the big picture from above. Portfolio-level thinking.',
    specialty: 'Portfolio Overview',
    riskLevel: 'moderate',
    color: '#3b82f6',
  },
  {
    id: 'badger',
    name: 'Steady Badger',
    description: 'Consistent, moderate risk approach. The steady income generator.',
    specialty: 'Moderate Risk Income',
    riskLevel: 'moderate',
    color: '#64748b',
  },
  {
    id: 'monkey',
    name: 'Swing Monkey',
    description: 'Agile and quick. Specializes in swing trading opportunities.',
    specialty: 'Swing Trading',
    riskLevel: 'high',
    color: '#fbbf24',
  },
  {
    id: 'sloth',
    name: 'Steady Sloth',
    description: 'Slow and steady wins the race. Conservative, long-term strategies.',
    specialty: 'Conservative Strategies',
    riskLevel: 'low',
    color: '#22c55e',
  },
  {
    id: 'tiger',
    name: 'Tiger',
    description: 'Aggressive hunter. High-risk, high-reward plays.',
    specialty: 'Aggressive Strategies',
    riskLevel: 'high',
    color: '#f43f5e',
  },
  {
    id: 'chameleon',
    name: 'Chameleon',
    description: 'Master of adaptation. Reads both prediction markets and options to find hidden opportunities.',
    specialty: 'Event Horizons',
    riskLevel: 'moderate',
    color: '#8b5cf6',
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    description: 'Fast and decisive. Capitalizes on IV crush and event-driven opportunities.',
    specialty: 'Speed & Timing',
    riskLevel: 'high',
    color: '#f59e0b',
  },
];

// XP levels configuration
export const XP_LEVELS = [
  { level: 1, xpRequired: 0, title: 'Jungle Novice' },
  { level: 2, xpRequired: 100, title: 'Option Apprentice' },
  { level: 3, xpRequired: 250, title: 'Strategy Scout' },
  { level: 4, xpRequired: 500, title: 'Greeks Explorer' },
  { level: 5, xpRequired: 1000, title: 'Spread Specialist' },
  { level: 6, xpRequired: 1750, title: 'Volatility Tracker' },
  { level: 7, xpRequired: 2750, title: 'Premium Collector' },
  { level: 8, xpRequired: 4000, title: 'Risk Manager' },
  { level: 9, xpRequired: 5500, title: 'Portfolio Architect' },
  { level: 10, xpRequired: 7500, title: 'Jungle Master' },
];

// Helper function to get level from XP
export const getLevelFromXP = (xp: number): { level: number; title: string; progress: number } => {
  let currentLevel = XP_LEVELS[0];
  let nextLevel = XP_LEVELS[1];

  for (let i = 0; i < XP_LEVELS.length - 1; i++) {
    if (xp >= XP_LEVELS[i].xpRequired && xp < XP_LEVELS[i + 1].xpRequired) {
      currentLevel = XP_LEVELS[i];
      nextLevel = XP_LEVELS[i + 1];
      break;
    }
    if (i === XP_LEVELS.length - 2 && xp >= XP_LEVELS[i + 1].xpRequired) {
      currentLevel = XP_LEVELS[i + 1];
      nextLevel = XP_LEVELS[i + 1];
    }
  }

  const xpIntoLevel = xp - currentLevel.xpRequired;
  const xpForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = xpForNextLevel > 0 ? xpIntoLevel / xpForNextLevel : 1;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    progress: Math.min(progress, 1),
  };
};

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Tier 1 & 2 strategies',
      'Options Vocabulary',
      'Basic calculators',
      'Limited paper trading (5 trades/day)',
      '1 daily mission',
    ],
    accessibleTiers: [0, 0.5, 1, 2],
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 14.99,
    yearlyPrice: 99.99,
    features: [
      'All 44+ strategies',
      'All tutorials',
      'All calculators',
      'Unlimited paper trading',
      'Real-time market data',
      'Options screener',
      'Watchlist with alerts',
      'Full quiz access',
      'Unlimited daily missions',
      'Leaderboard access',
      'Badge collection',
    ],
    accessibleTiers: [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 29.99,
    yearlyPrice: 199.99,
    features: [
      'Everything in Premium',
      'AI-powered recommendations',
      'Advanced 3D visualizations',
      'Trade journal with analytics',
      'Priority support',
      'Early access to new features',
      'Jungle Tribes (social)',
      'Social Trading Feed',
    ],
    accessibleTiers: [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
};

// App configuration
export const APP_CONFIG = {
  paperTradingStartingBalance: 10000,
  maxDailyMissionsFree: 1,
  maxDailyMissionsPremium: 5,
  quizPassingScore: 70, // percentage
  streakBonusXP: 50,
  quizXPBase: 100,
  strategyCompletionXP: 25,
};
