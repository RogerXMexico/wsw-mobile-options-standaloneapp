// Shared probability math functions for options calculations

/**
 * Cumulative Normal Distribution Function (approximation)
 * Used to calculate probabilities based on the standard normal distribution
 */
export function cumulativeNormalDistribution(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Calculate probability that stock price exceeds a target price at expiration
 * Uses lognormal model with risk-neutral drift: d = [ln(S/K) + (r - 0.5σ²)T] / (σ√T)
 */
export function probabilityAbovePrice(
  currentPrice: number,
  targetPrice: number,
  iv: number,
  daysToExpiry: number,
  riskFreeRate: number = 0.05
): number {
  currentPrice = Math.max(0.01, currentPrice);
  targetPrice = Math.max(0.01, targetPrice);
  const timeYears = daysToExpiry / 365;
  const sigma = Math.max(0, iv / 100);

  if (timeYears <= 0 || sigma <= 0) return targetPrice < currentPrice ? 1 : 0;

  const sqrtT = Math.sqrt(timeYears);
  const d = (Math.log(currentPrice / targetPrice) + (riskFreeRate - 0.5 * sigma * sigma) * timeYears) / (sigma * sqrtT);

  return cumulativeNormalDistribution(d);
}

/**
 * Calculate probability that stock price falls below a target price at expiration
 */
export function probabilityBelowPrice(
  currentPrice: number,
  targetPrice: number,
  iv: number,
  daysToExpiry: number,
  riskFreeRate: number = 0.05
): number {
  return 1 - probabilityAbovePrice(currentPrice, targetPrice, iv, daysToExpiry, riskFreeRate);
}

/**
 * Calculate probability of price being between two values at expiration
 */
export function probabilityBetween(
  currentPrice: number,
  lowerPrice: number,
  upperPrice: number,
  iv: number,
  days: number,
  riskFreeRate: number = 0.05
): number {
  currentPrice = Math.max(0.01, currentPrice);
  lowerPrice = Math.max(0.01, lowerPrice);
  upperPrice = Math.max(0.01, upperPrice);
  const timeYears = days / 365;
  const sigma = Math.max(0, iv / 100);

  if (timeYears <= 0 || sigma <= 0) return 0;

  const sqrtT = Math.sqrt(timeYears);
  const drift = (riskFreeRate - 0.5 * sigma * sigma) * timeYears;
  const dLower = (Math.log(currentPrice / lowerPrice) + drift) / (sigma * sqrtT);
  const dUpper = (Math.log(currentPrice / upperPrice) + drift) / (sigma * sqrtT);

  return cumulativeNormalDistribution(dLower) - cumulativeNormalDistribution(dUpper);
}

/**
 * Calculate the expected move (1 standard deviation) for a given stock
 */
export function calculateExpectedMove(
  stockPrice: number,
  iv: number,
  daysToExpiry: number
): number {
  stockPrice = Math.max(0.01, stockPrice);
  const timeYears = Math.max(0, daysToExpiry) / 365;
  const sigma = Math.max(0, iv / 100);
  return stockPrice * sigma * Math.sqrt(timeYears);
}
