// Strategy exports - combines all tier strategy files
// This file aggregates all strategies from the Wall Street Wildlife course

import { Strategy } from '../types';

// Import strategies from each tier file
import { tier0Strategies } from './tier0-foundations';
import { tier05Strategies } from './tier05-express';
import { tier1Strategies } from './tier1-structure';
import { tier2Strategies } from './tier2-risk';
import { tier3Strategies } from './tier3-anchors';
import { tier4Strategies } from './tier4-verticals';
import { tier5Strategies } from './tier5-volatility';
import { tier6Strategies } from './tier6-timeskew';
import { tier7Strategies } from './tier7-ratios';
import { tier8Strategies } from './tier8-eventhorizons';
import { tier9Strategies } from './tier9-tools';
import { tier10Strategies } from './tier10-play';

// Combined strategies array
export const allStrategies: Strategy[] = [
  ...tier0Strategies,
  ...tier05Strategies,
  ...tier1Strategies,
  ...tier2Strategies,
  ...tier3Strategies,
  ...tier4Strategies,
  ...tier5Strategies,
  ...tier6Strategies,
  ...tier7Strategies,
  ...tier8Strategies,
  ...tier9Strategies,
  ...tier10Strategies,
];

// Re-export tier arrays for direct access
export {
  tier0Strategies,
  tier05Strategies,
  tier1Strategies,
  tier2Strategies,
  tier3Strategies,
  tier4Strategies,
  tier5Strategies,
  tier6Strategies,
  tier7Strategies,
  tier8Strategies,
  tier9Strategies,
  tier10Strategies,
};

// Helper functions
export const getStrategyById = (id: string): Strategy | undefined => {
  return allStrategies.find(s => s.id === id);
};

export const getStrategiesByTier = (tier: number): Strategy[] => {
  return allStrategies.filter(s => s.tier === tier);
};

export const getFreeStrategies = (): Strategy[] => {
  return allStrategies.filter(s => !s.isPremium);
};

export const getPremiumStrategies = (): Strategy[] => {
  return allStrategies.filter(s => s.isPremium);
};

// Strategy counts by tier
export const strategyCounts = {
  tier0: tier0Strategies.length,
  tier05: tier05Strategies.length,
  tier1: tier1Strategies.length,
  tier2: tier2Strategies.length,
  tier3: tier3Strategies.length,
  tier4: tier4Strategies.length,
  tier5: tier5Strategies.length,
  tier6: tier6Strategies.length,
  tier7: tier7Strategies.length,
  tier8: tier8Strategies.length,
  tier9: tier9Strategies.length,
  tier10: tier10Strategies.length,
  total: allStrategies.length,
};
