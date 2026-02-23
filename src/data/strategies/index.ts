// Strategy exports - combines all tier strategy files
// This file aggregates all strategies from the Wall Street Wildlife course

import { Strategy } from '../types';

// Import strategies from each tier file
// Tier numbering matches desktop: 0, 0.5, 1 (Mirror), 2 (Structure), 3 (Risk), etc.
import { tier0Strategies } from './tier0-foundations';
import { tier05Strategies } from './tier05-express';
import { tier1Strategies as tier1MirrorStrategies } from './tier1-mirror';
import { tier1Strategies as tier2StructureStrategies } from './tier1-structure';
import { tier2Strategies as tier3RiskStrategies } from './tier2-risk';
import { tier3Strategies as tier4AnchorStrategies } from './tier3-anchors';
import { tier4Strategies as tier5VerticalStrategies } from './tier4-verticals';
import { tier5Strategies as tier6VolatilityStrategies } from './tier5-volatility';
import { tier6Strategies as tier7TimeskewStrategies } from './tier6-timeskew';
import { tier7Strategies as tier8AdvancedStrategies } from './tier7-ratios';
import { tier8Strategies as tier9EventStrategies } from './tier8-eventhorizons';
import { tier9Strategies as tier10FlowStrategies } from './tier9-tools';
import { tier10Strategies as tier10PlayStrategies } from './tier10-play';

// Combined strategies array
export const allStrategies: Strategy[] = [
  ...tier0Strategies,
  ...tier05Strategies,
  ...tier1MirrorStrategies,
  ...tier2StructureStrategies,
  ...tier3RiskStrategies,
  ...tier4AnchorStrategies,
  ...tier5VerticalStrategies,
  ...tier6VolatilityStrategies,
  ...tier7TimeskewStrategies,
  ...tier8AdvancedStrategies,
  ...tier9EventStrategies,
  ...tier10FlowStrategies,
  ...tier10PlayStrategies,
];

// Re-export tier arrays for direct access
export {
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
  tier1: tier1MirrorStrategies.length,
  tier2: tier2StructureStrategies.length,
  tier3: tier3RiskStrategies.length,
  tier4: tier4AnchorStrategies.length,
  tier5: tier5VerticalStrategies.length,
  tier6: tier6VolatilityStrategies.length,
  tier7: tier7TimeskewStrategies.length,
  tier8: tier8AdvancedStrategies.length,
  tier9: tier9EventStrategies.length,
  tier10: tier10FlowStrategies.length + tier10PlayStrategies.length,
  total: allStrategies.length,
};

// ---------------------------------------------------------------------------
// Lazy loading utilities
// ---------------------------------------------------------------------------
// These allow tier data to be loaded on demand via dynamic import, reducing
// the upfront cost for screens that only need a single tier at a time.

/** In-memory cache of lazily-loaded tier data */
const tierCache = new Map<number, Strategy[]>();

/**
 * Mapping from tier number to a function that dynamically imports the
 * corresponding tier module.  Each module exports a named array
 * (e.g. `tier0Strategies`), so we extract the first array value we find.
 */
const tierModules: Record<number, () => Promise<Record<string, unknown>>> = {
  0:    () => import('./tier0-foundations'),
  0.5:  () => import('./tier05-express'),
  1:    () => import('./tier1-mirror'),
  2:    () => import('./tier1-structure'),
  3:    () => import('./tier2-risk'),
  4:    () => import('./tier3-anchors'),
  5:    () => import('./tier4-verticals'),
  6:    () => import('./tier5-volatility'),
  7:    () => import('./tier6-timeskew'),
  8:    () => import('./tier7-ratios'),
  9:    () => import('./tier8-eventhorizons'),
  10:   () => import('./tier9-tools'),
};

/**
 * Lazily load strategies for a given tier.  On first call the tier module is
 * dynamically imported; subsequent calls return the cached result.
 *
 * This is the async counterpart of the synchronous `getStrategiesByTier`.
 */
export const getStrategiesByTierLazy = async (tier: number): Promise<Strategy[]> => {
  if (tierCache.has(tier)) return tierCache.get(tier)!;

  const loader = tierModules[tier];
  if (!loader) return [];

  const mod = await loader();
  // Each tier module exports a single named array – find it.
  const strategies = Object.values(mod).find(
    (v): v is Strategy[] => Array.isArray(v),
  ) as Strategy[] | undefined;

  const result = strategies ?? [];
  tierCache.set(tier, result);
  return result;
};

/**
 * Pre-load a tier into the cache without awaiting the result inline.
 * Useful for prefetching the next tier while the user reads the current one.
 */
export const preloadTier = (tier: number): void => {
  if (tierCache.has(tier)) return;
  // Fire-and-forget – errors are silently swallowed so the UI is unaffected.
  getStrategiesByTierLazy(tier).catch(() => {});
};

/**
 * Clear the lazy-loading tier cache (e.g. on logout or to free memory).
 */
export const clearTierCache = (): void => {
  tierCache.clear();
};
