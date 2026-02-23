// Strategy data for Wall Street Wildlife Mobile
// Imports from tier-organized strategy files

import { Strategy } from './types';

// Import all strategies from tier files
import {
  allStrategies,
  getStrategyById as getById,
  getStrategiesByTier as getByTier,
  getFreeStrategies as getFree,
  getPremiumStrategies as getPremium,
  strategyCounts,
  tier0Strategies,
  tier05Strategies,
  tier1MirrorStrategies,
  tier2StructureStrategies,
  tier3RiskStrategies,
  tier4AnchorStrategies,
  tier5VerticalStrategies,
  tier6VolatilityStrategies,
  tier7TimeskewStrategies,
  tier8AdvancedStrategies,
  tier9EventStrategies,
  tier10FlowStrategies,
  tier10PlayStrategies,
  // Lazy loading utilities
  getStrategiesByTierLazy,
  preloadTier,
  clearTierCache,
} from './strategies/index';

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
  'long-put-butterfly': {
    id: 'long-put-butterfly',
    legs: [
      { type: 'put', strike: 105, position: 'long', premium: 6 },
      { type: 'put', strike: 100, position: 'short', premium: 3, quantity: 2 },
      { type: 'put', strike: 95, position: 'long', premium: 1 },
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
  'calendar-spread': {
    id: 'calendar-spread',
    legs: [
      { type: 'call', strike: 100, position: 'short', premium: 2 },
      { type: 'call', strike: 100, position: 'long', premium: 4 },
    ],
    defaultStockPrice: 100,
  },
  'diagonal-spread': {
    id: 'diagonal-spread',
    legs: [
      { type: 'call', strike: 95, position: 'long', premium: 6 },
      { type: 'call', strike: 105, position: 'short', premium: 2 },
    ],
    defaultStockPrice: 100,
  },
  'pmcc': {
    id: 'pmcc',
    legs: [
      { type: 'call', strike: 80, position: 'long', premium: 22 },
      { type: 'call', strike: 110, position: 'short', premium: 2 },
    ],
    defaultStockPrice: 100,
  },
  'ratio-spread': {
    id: 'ratio-spread',
    legs: [
      { type: 'call', strike: 100, position: 'long', premium: 3 },
      { type: 'call', strike: 110, position: 'short', premium: 1.5, quantity: 2 },
    ],
    defaultStockPrice: 100,
  },
  'call-backspread': {
    id: 'call-backspread',
    legs: [
      { type: 'call', strike: 100, position: 'short', premium: 3 },
      { type: 'call', strike: 110, position: 'long', premium: 1.5, quantity: 2 },
    ],
    defaultStockPrice: 100,
  },
  'put-backspread': {
    id: 'put-backspread',
    legs: [
      { type: 'put', strike: 100, position: 'short', premium: 3 },
      { type: 'put', strike: 90, position: 'long', premium: 1.5, quantity: 2 },
    ],
    defaultStockPrice: 100,
  },
  'zebra': {
    id: 'zebra',
    legs: [
      { type: 'call', strike: 90, position: 'long', premium: 12, quantity: 2 },
      { type: 'call', strike: 100, position: 'short', premium: 3 },
    ],
    defaultStockPrice: 100,
  },
  'broken-wing-butterfly': {
    id: 'broken-wing-butterfly',
    legs: [
      { type: 'call', strike: 95, position: 'long', premium: 6 },
      { type: 'call', strike: 100, position: 'short', premium: 3, quantity: 2 },
      { type: 'call', strike: 110, position: 'long', premium: 0.5 },
    ],
    defaultStockPrice: 100,
  },
};

// Export the combined strategies array
export const strategies: Strategy[] = allStrategies;

// Re-export helper functions
export const getStrategyById = getById;
export const getStrategiesByTier = getByTier;
export const getFreeStrategies = getFree;
export const getPremiumStrategies = getPremium;

// Get strategy config by ID
export const getStrategyConfig = (id: string): StrategyConfig | undefined => {
  return strategyConfigs[id];
};

// Export strategy counts and tier arrays for direct access
export {
  strategyCounts,
  tier0Strategies,
  tier05Strategies,
  tier1MirrorStrategies,
  tier2StructureStrategies,
  tier3RiskStrategies,
  tier4AnchorStrategies,
  tier5VerticalStrategies,
  tier6VolatilityStrategies,
  tier7TimeskewStrategies,
  tier8AdvancedStrategies,
  tier9EventStrategies,
  tier10FlowStrategies,
  tier10PlayStrategies,
};

// Re-export lazy loading utilities
export { getStrategiesByTierLazy, preloadTier, clearTierCache };
