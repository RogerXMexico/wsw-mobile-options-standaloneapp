// Profit Calculator Engine — pure computation, zero React
// Supports 4 anchor strategies: Long Call, Long Put, Covered Call, Cash-Secured Put

import { blackScholes } from './math';
import { probabilityAbovePrice, probabilityBelowPrice } from './probabilityMath';

// ── Types ──────────────────────────────────────────────────────────────────

export type AnchorStrategyId = 'long-call' | 'long-put' | 'covered-call' | 'cash-secured-put';

export type ViewMetric = 'pnl-dollar' | 'pnl-percent' | 'contract-value' | 'pct-max-risk';

export interface PositionConfig {
  strategyId: AnchorStrategyId;
  stockPrice: number;
  strike: number;
  premium: number;
  iv: number;           // percentage, e.g. 30 for 30%
  daysToExpiry: number;
  riskFreeRate?: number; // decimal, defaults to 0.05
}

export interface PositionMetrics {
  netDebitCredit: number;    // per-share cost (positive = debit, negative = credit)
  maxLoss: number;           // per-contract (×100) — always positive
  maxProfit: number;         // per-contract (×100) — Infinity for unlimited
  breakeven: number;
  chanceOfProfit: number;    // 0-100
  ivPercent: number;
}

export interface GraphCurve {
  label: string;
  daysRemaining: number;
  points: { price: number; pnl: number }[];
}

export interface PnLGridPoint {
  price: number;
  date: string;
  daysRemaining: number;
  pnl: number;
  pnlPercent: number;
  contractValue: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getRiskFreeRate(config: PositionConfig): number {
  return config.riskFreeRate ?? 0.05;
}

function ivDecimal(config: PositionConfig): number {
  return Math.max(0.01, config.iv) / 100;
}

function timeInYears(days: number): number {
  return Math.max(days, 0) / 365;
}

// ── Core P&L at a single (price, DTE) point ───────────────────────────────

export function computePositionPnL(
  config: PositionConfig,
  atPrice: number,
  atDTE: number
): number {
  const r = getRiskFreeRate(config);
  const sigma = ivDecimal(config);
  const T = timeInYears(atDTE);
  const { premium, strategyId } = config;
  const strike = Math.max(0.01, config.strike);
  atPrice = Math.max(0.01, atPrice);

  switch (strategyId) {
    case 'long-call': {
      // Value = BS(call) at (atPrice, strike, T) — premium paid
      const optValue = blackScholes('call', atPrice, strike, T, r, sigma);
      return (optValue - premium) * 100;
    }
    case 'long-put': {
      const optValue = blackScholes('put', atPrice, strike, T, r, sigma);
      return (optValue - premium) * 100;
    }
    case 'covered-call': {
      // Own stock + sold call
      // P&L = (atPrice - stockPrice) + premium - BS(call)
      const callValue = blackScholes('call', atPrice, strike, T, r, sigma);
      return ((atPrice - config.stockPrice) + premium - callValue) * 100;
    }
    case 'cash-secured-put': {
      // Sold put, collected premium
      // P&L = premium - BS(put)
      const putValue = blackScholes('put', atPrice, strike, T, r, sigma);
      return (premium - putValue) * 100;
    }
  }
}

// ── Position Metrics ───────────────────────────────────────────────────────

export function computeMetrics(config: PositionConfig): PositionMetrics {
  const { strategyId, premium } = config;
  const stockPrice = Math.max(0.01, config.stockPrice);
  const strike = Math.max(0.01, config.strike);
  const iv = Math.max(0.01, config.iv);
  const daysToExpiry = Math.max(0, config.daysToExpiry);

  let netDebitCredit: number;
  let maxLoss: number;
  let maxProfit: number;
  let breakeven: number;

  switch (strategyId) {
    case 'long-call':
      netDebitCredit = premium;
      maxLoss = premium * 100;
      maxProfit = Infinity;
      breakeven = strike + premium;
      break;
    case 'long-put':
      netDebitCredit = premium;
      maxLoss = premium * 100;
      maxProfit = (strike - premium) * 100;
      breakeven = strike - premium;
      break;
    case 'covered-call':
      netDebitCredit = stockPrice - premium;
      maxLoss = (stockPrice - premium) * 100;
      maxProfit = (strike - stockPrice + premium) * 100;
      breakeven = stockPrice - premium;
      break;
    case 'cash-secured-put':
      netDebitCredit = -premium; // credit
      maxLoss = (strike - premium) * 100;
      maxProfit = premium * 100;
      breakeven = strike - premium;
      break;
    default:
      netDebitCredit = premium;
      maxLoss = premium * 100;
      maxProfit = Infinity;
      breakeven = strike + premium;
  }

  // Chance of profit
  let chanceOfProfit: number;
  switch (strategyId) {
    case 'long-call':
      chanceOfProfit = probabilityAbovePrice(stockPrice, breakeven, iv, daysToExpiry) * 100;
      break;
    case 'long-put':
      chanceOfProfit = probabilityBelowPrice(stockPrice, breakeven, iv, daysToExpiry) * 100;
      break;
    case 'covered-call':
      // Profitable as long as stock stays above breakeven (stockPrice - premium)
      chanceOfProfit = probabilityAbovePrice(stockPrice, breakeven, iv, daysToExpiry) * 100;
      break;
    case 'cash-secured-put':
      // Profitable as long as stock stays above breakeven (strike - premium)
      chanceOfProfit = probabilityAbovePrice(stockPrice, breakeven, iv, daysToExpiry) * 100;
      break;
    default:
      chanceOfProfit = 0;
  }

  return {
    netDebitCredit,
    maxLoss,
    maxProfit,
    breakeven,
    chanceOfProfit: Math.min(100, Math.max(0, chanceOfProfit)),
    ivPercent: iv,
  };
}

// ── Price / Date Range Helpers ─────────────────────────────────────────────

export function computePriceRange(
  stockPrice: number,
  iv: number,
  dte: number
): { min: number; max: number } {
  stockPrice = Math.max(0.01, stockPrice);
  iv = Math.max(0.01, iv);
  const sigma = iv / 100;
  const T = timeInYears(dte);
  const stdDev = stockPrice * sigma * Math.sqrt(T);
  const spread = Math.max(stdDev * 1.5, stockPrice * 0.1); // at least ±10%
  return {
    min: Math.max(0.01, stockPrice - spread),
    max: stockPrice + spread,
  };
}

export function computeDateRange(
  daysToExpiry: number,
  count: number = 10
): number[] {
  const dates: number[] = [];
  const step = Math.max(1, daysToExpiry / (count - 1));
  for (let i = 0; i < count; i++) {
    const dte = Math.max(0, daysToExpiry - i * step);
    dates.push(Math.round(dte));
  }
  // Ensure 0 (expiration) is included
  if (dates[dates.length - 1] !== 0) {
    dates[dates.length - 1] = 0;
  }
  return dates;
}

// ── Graph Curves (3 lines: now, mid-DTE, expiration) ──────────────────────

export function generateGraphCurves(
  config: PositionConfig,
  pointCount: number = 150
): GraphCurve[] {
  const { stockPrice, iv, daysToExpiry } = config;
  const range = computePriceRange(stockPrice, iv, daysToExpiry);
  const step = (range.max - range.min) / (pointCount - 1);

  const midDTE = Math.round(daysToExpiry / 2);
  const dteValues = [
    { label: `Now (${daysToExpiry} DTE)`, days: daysToExpiry },
    { label: `Mid (${midDTE} DTE)`, days: midDTE },
    { label: 'Expiration (0 DTE)', days: 0 },
  ];

  return dteValues.map(({ label, days }) => {
    const points: { price: number; pnl: number }[] = [];
    for (let i = 0; i < pointCount; i++) {
      const price = range.min + i * step;
      points.push({
        price: Math.round(price * 100) / 100,
        pnl: Math.round(computePositionPnL(config, price, days) * 100) / 100,
      });
    }
    return { label, daysRemaining: days, points };
  });
}

// ── P&L Grid for Heatmap ──────────────────────────────────────────────────

export function generatePnLGrid(
  config: PositionConfig,
  dateCount: number = 10,
  priceCount: number = 25
): PnLGridPoint[][] {
  const { stockPrice, iv, daysToExpiry } = config;
  const range = computePriceRange(stockPrice, iv, daysToExpiry);
  const dates = computeDateRange(daysToExpiry, dateCount);
  const priceStep = (range.max - range.min) / (priceCount - 1);

  const metrics = computeMetrics(config);
  const netDebit = Math.abs(metrics.netDebitCredit);

  const grid: PnLGridPoint[][] = [];

  for (let p = 0; p < priceCount; p++) {
    const price = Math.round((range.max - p * priceStep) * 100) / 100; // high to low
    const row: PnLGridPoint[] = [];

    for (let d = 0; d < dateCount; d++) {
      const dte = dates[d];
      const pnl = computePositionPnL(config, price, dte);
      const pnlPercent = netDebit > 0 ? (pnl / (netDebit * 100)) * 100 : 0;
      const contractValue = pnl + netDebit * 100;

      // Build date string for display
      const today = new Date();
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + (daysToExpiry - dte));
      const dateStr = `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;

      row.push({
        price,
        date: dateStr,
        daysRemaining: dte,
        pnl: Math.round(pnl * 100) / 100,
        pnlPercent: Math.round(pnlPercent * 100) / 100,
        contractValue: Math.round(contractValue * 100) / 100,
      });
    }
    grid.push(row);
  }

  return grid;
}

// ── Value Transformation for View Metrics ─────────────────────────────────

export function transformPnLValue(
  rawPnl: number,
  metric: ViewMetric,
  netDebit: number,
  maxLoss: number
): number {
  switch (metric) {
    case 'pnl-dollar':
      return rawPnl;
    case 'pnl-percent':
      return netDebit !== 0 ? (rawPnl / (Math.abs(netDebit) * 100)) * 100 : 0;
    case 'contract-value':
      return rawPnl + Math.abs(netDebit) * 100;
    case 'pct-max-risk':
      return maxLoss !== 0 ? (rawPnl / maxLoss) * 100 : 0;
  }
}

// ── Cell Formatting ───────────────────────────────────────────────────────

export function formatCellValue(value: number, metric: ViewMetric): string {
  switch (metric) {
    case 'pnl-dollar': {
      const rounded = Math.round(value);
      if (rounded >= 0) return `+$${rounded.toLocaleString()}`;
      return `-$${Math.abs(rounded).toLocaleString()}`;
    }
    case 'pnl-percent':
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    case 'contract-value':
      return `$${Math.round(value).toLocaleString()}`;
    case 'pct-max-risk':
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }
}

// ── Cell Color (for heatmap) ──────────────────────────────────────────────

export function getCellColor(
  value: number,
  maxLoss: number,
  maxProfit: number
): string {
  if (value === 0) return 'transparent';

  // Normalize to [-1, +1] range
  const maxMag = Math.max(Math.abs(maxLoss), isFinite(maxProfit) ? maxProfit : Math.abs(maxLoss));
  const normalized = maxMag > 0 ? Math.max(-1, Math.min(1, value / maxMag)) : 0;
  const intensity = Math.min(0.6, Math.abs(normalized) * 0.6);

  if (normalized > 0) {
    // Emerald — profit
    return `rgba(16, 185, 129, ${intensity})`;
  } else {
    // Rose — loss
    return `rgba(244, 63, 94, ${intensity})`;
  }
}

// ── Strategy display names ────────────────────────────────────────────────

export const STRATEGY_DISPLAY_NAMES: Record<AnchorStrategyId, string> = {
  'long-call': 'Long Call',
  'long-put': 'Long Put',
  'covered-call': 'Covered Call',
  'cash-secured-put': 'Cash-Secured Put',
};

export const STRATEGY_OPTIONS: { id: AnchorStrategyId; label: string; chainSide: 'call' | 'put' }[] = [
  { id: 'long-call', label: 'Long Call', chainSide: 'call' },
  { id: 'long-put', label: 'Long Put', chainSide: 'put' },
  { id: 'covered-call', label: 'Covered Call', chainSide: 'call' },
  { id: 'cash-secured-put', label: 'Cash-Secured Put', chainSide: 'put' },
];
