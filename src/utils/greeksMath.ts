// Black-Scholes helpers extracted from GreeksVisualizer

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

export const normalPDF = (x: number): number => {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
};

export const calculateGreeks = (
  S: number, // Stock price
  K: number, // Strike
  T: number, // Time to expiration in years
  r: number, // Risk-free rate
  sigma: number, // IV as decimal
  isCall: boolean
): { delta: number; gamma: number; theta: number; vega: number } => {
  if (S <= 0 || K <= 0) {
    return { delta: 0, gamma: 0, theta: 0, vega: 0 };
  }
  sigma = Math.max(0, sigma);
  if (T <= 0 || sigma <= 0) {
    // At expiration or zero IV: return intrinsic delta, zero for others
    const delta = isCall ? (S > K ? 1 : 0) : (S < K ? -1 : 0);
    return { delta, gamma: 0, theta: 0, vega: 0 };
  }

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  // Delta
  const delta = isCall ? normalCDF(d1) : normalCDF(d1) - 1;

  // Gamma (same for calls and puts)
  const gamma = normalPDF(d1) / (S * sigma * sqrtT);

  // Theta (per day)
  const thetaCall = (-(S * normalPDF(d1) * sigma) / (2 * sqrtT) - r * K * Math.exp(-r * T) * normalCDF(d2)) / 365;
  const thetaPut = (-(S * normalPDF(d1) * sigma) / (2 * sqrtT) + r * K * Math.exp(-r * T) * normalCDF(-d2)) / 365;
  const theta = isCall ? thetaCall : thetaPut;

  // Vega (per 1% change in IV)
  const vega = (S * sqrtT * normalPDF(d1)) / 100;

  return { delta, gamma, theta, vega };
};

// Calculate option price using Black-Scholes
export const calculateOptionPrice = (
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  isCall: boolean
): number => {
  if (S <= 0 || K <= 0) return 0;
  sigma = Math.max(0, sigma);
  if (T <= 0) {
    // At expiration, return intrinsic value
    return isCall ? Math.max(0, S - K) : Math.max(0, K - S);
  }
  if (sigma <= 0) {
    // Zero IV: return discounted intrinsic value
    return isCall ? Math.max(0, S - K * Math.exp(-r * T)) : Math.max(0, K * Math.exp(-r * T) - S);
  }

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  if (isCall) {
    return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  } else {
    return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  }
};
