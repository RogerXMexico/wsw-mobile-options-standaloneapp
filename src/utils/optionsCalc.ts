/**
 * Standard Normal CDF using Abramowitz & Stegun approximation.
 * Used for Black-Scholes d1/d2 probabilities.
 */
export const normalCDF = (x: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * ax);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return 0.5 * (1.0 + sign * y);
};

/** Standard Normal PDF */
export const normalPDF = (x: number): number => {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
};

/** Options contract multiplier (shares per contract) */
export const CONTRACT_MULTIPLIER = 100;

/** Quiz pass threshold */
export const QUIZ_PASS_THRESHOLD = 0.7;

/**
 * Calculate P&L for an options position.
 * @param entryPrice - Entry price per share
 * @param exitPrice - Exit/current price per share
 * @param quantity - Number of contracts
 * @param side - 'long' or 'short'
 * @returns P&L in dollars
 */
export const calcOptionPnL = (
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  side: 'long' | 'short' = 'long',
): number => {
  const multiplier = side === 'long' ? 1 : -1;
  return (exitPrice - entryPrice) * quantity * CONTRACT_MULTIPLIER * multiplier;
};

/**
 * Calculate total cost of an options trade.
 */
export const calcTradeCost = (pricePerShare: number, quantity: number): number => {
  return pricePerShare * quantity * CONTRACT_MULTIPLIER;
};

/**
 * Calculate intrinsic value of an option.
 */
export const calcIntrinsicValue = (
  stockPrice: number,
  strikePrice: number,
  type: 'call' | 'put',
): number => {
  if (type === 'call') return Math.max(stockPrice - strikePrice, 0);
  return Math.max(strikePrice - stockPrice, 0);
};

/**
 * Calculate breakeven price for a single-leg option.
 */
export const calcBreakeven = (
  strikePrice: number,
  premium: number,
  type: 'call' | 'put',
): number => {
  if (type === 'call') return strikePrice + premium;
  return strikePrice - premium;
};

/**
 * Calculate expected move based on IV.
 * expectedMove = stockPrice × IV × √(DTE/365)
 */
export const calcExpectedMove = (
  stockPrice: number,
  iv: number,
  daysToExpiry: number,
): number => {
  return stockPrice * (iv / 100) * Math.sqrt(daysToExpiry / 365);
};

/**
 * Calculate d2 for Black-Scholes probability.
 */
export const calcD2 = (
  stockPrice: number,
  strikePrice: number,
  iv: number,
  daysToExpiry: number,
  riskFreeRate: number = 0.05,
): number => {
  const T = daysToExpiry / 365;
  const sigma = iv / 100;
  const sqrtT = Math.sqrt(T);
  return (Math.log(stockPrice / strikePrice) + (riskFreeRate - 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
};

/**
 * Calculate Probability of Profit for a long option.
 */
export const calcPOP = (
  stockPrice: number,
  strikePrice: number,
  premium: number,
  iv: number,
  daysToExpiry: number,
  type: 'call' | 'put',
): number => {
  const breakeven = calcBreakeven(strikePrice, premium, type);
  const T = daysToExpiry / 365;
  const sigma = iv / 100;
  const sqrtT = Math.sqrt(T);
  const d2 = (Math.log(stockPrice / breakeven) + (-0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  if (type === 'call') return normalCDF(d2);
  return normalCDF(-d2);
};

/**
 * Calculate historical volatility from an array of prices.
 * Uses log returns method.
 */
export const calcHistoricalVolatility = (prices: number[], annualize: boolean = true): number => {
  if (prices.length < 2) return 0;
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] > 0) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }
  }
  if (returns.length === 0) return 0;
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const dailyVol = Math.sqrt(variance);
  return annualize ? dailyVol * Math.sqrt(252) : dailyVol;
};
