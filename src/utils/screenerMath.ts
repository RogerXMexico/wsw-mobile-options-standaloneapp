// Pure math helpers extracted from OptionsScreener

import { calculateDTE, OptionData } from '../services/tradierApi';

// Calculate IV Rank from historical IV data
export function calculateIVRank(currentIV: number, historicalIVs: number[]): number {
  if (historicalIVs.length === 0 || currentIV === 0) return 50;

  const minIV = Math.min(...historicalIVs);
  const maxIV = Math.max(...historicalIVs);

  if (maxIV === minIV) return 50;

  const ivRank = ((currentIV - minIV) / (maxIV - minIV)) * 100;
  return Math.min(100, Math.max(0, ivRank));
}

// Estimate POP based on delta
export function estimatePOP(delta: number, optionType: 'call' | 'put'): number {
  const absDelta = Math.abs(delta);
  // For selling options, POP ≈ 1 - |delta| for OTM options
  if (optionType === 'put') {
    return Math.round((1 - absDelta) * 100);
  } else {
    return Math.round((1 - absDelta) * 100);
  }
}

// Suggest strategy based on filters and option characteristics
export function suggestStrategy(option: OptionData, ivRank: number): string {
  const dte = calculateDTE(option.expiration);
  const absDelta = Math.abs(option.delta);

  if (dte > 300 && absDelta > 0.6 && option.type === 'call') {
    return 'PMCC LEAPS';
  }
  if (ivRank > 60 && option.type === 'put' && absDelta < 0.30) {
    return 'Cash-Secured Put';
  }
  if (ivRank > 50 && option.type === 'call' && absDelta < 0.35) {
    return 'Covered Call';
  }
  if (option.type === 'put' && absDelta < 0.30) {
    return 'Bull Put Spread';
  }
  if (option.type === 'call' && absDelta < 0.35) {
    return 'Bear Call Spread';
  }
  return 'Single Option';
}
