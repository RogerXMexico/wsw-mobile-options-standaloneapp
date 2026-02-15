// Tests for strategy data integrity
// Verifies that strategy collections and helper functions work correctly

import {
  strategies,
  getStrategyById,
  getStrategiesByTier,
  getFreeStrategies,
} from '../strategies';

describe('Strategy Data', () => {
  describe('allStrategies collection', () => {
    it('is not empty', () => {
      expect(strategies.length).toBeGreaterThan(0);
    });

    it('contains strategies from multiple tiers', () => {
      const tiers = new Set(strategies.map((s) => s.tier));
      expect(tiers.size).toBeGreaterThanOrEqual(5);
    });
  });

  describe('getStrategyById', () => {
    it('returns the correct strategy for a known id', () => {
      // "long-call" is a fundamental tier-0 strategy that should always exist
      const strategy = getStrategyById('long-call');
      expect(strategy).toBeDefined();
      expect(strategy!.id).toBe('long-call');
      expect(strategy!.name).toBeDefined();
    });

    it('returns undefined for an unknown id', () => {
      const strategy = getStrategyById('nonexistent-strategy-xyz');
      expect(strategy).toBeUndefined();
    });
  });

  describe('getStrategiesByTier', () => {
    it('returns strategies for tier 0 (Foundations)', () => {
      const tier0 = getStrategiesByTier(0);
      expect(tier0.length).toBeGreaterThan(0);
      tier0.forEach((s) => expect(s.tier).toBe(0));
    });

    it('returns strategies for tier 1 (Market Structure)', () => {
      const tier1 = getStrategiesByTier(1);
      expect(tier1.length).toBeGreaterThan(0);
      tier1.forEach((s) => expect(s.tier).toBe(1));
    });

    it('returns strategies for tier 5 (Volatility)', () => {
      const tier5 = getStrategiesByTier(5);
      expect(tier5.length).toBeGreaterThan(0);
      tier5.forEach((s) => expect(s.tier).toBe(5));
    });

    it('returns an empty array for a non-existent tier', () => {
      const tier99 = getStrategiesByTier(99);
      expect(tier99).toEqual([]);
    });
  });

  describe('getFreeStrategies', () => {
    it('returns only non-premium strategies', () => {
      const free = getFreeStrategies();
      expect(free.length).toBeGreaterThan(0);
      free.forEach((s) => {
        expect(s.isPremium).toBe(false);
      });
    });

    it('only includes tier 0 and 0.5 strategies', () => {
      const free = getFreeStrategies();
      const tiers = new Set(free.map((s) => s.tier));
      tiers.forEach((tier) => {
        expect([0, 0.5]).toContain(tier);
      });
    });
  });

  describe('required fields on every strategy', () => {
    it.each(strategies.map((s) => [s.id, s]))(
      'strategy "%s" has all required fields',
      (_id, strategy) => {
        expect(strategy.id).toBeDefined();
        expect(typeof strategy.id).toBe('string');
        expect(strategy.id.length).toBeGreaterThan(0);

        expect(strategy.name).toBeDefined();
        expect(typeof strategy.name).toBe('string');
        expect(strategy.name.length).toBeGreaterThan(0);

        expect(strategy.tier).toBeDefined();
        expect(typeof strategy.tier).toBe('number');

        expect(strategy.description).toBeDefined();
        expect(typeof strategy.description).toBe('string');
        expect(strategy.description.length).toBeGreaterThan(0);

        expect(typeof strategy.isPremium).toBe('boolean');
      }
    );
  });
});
