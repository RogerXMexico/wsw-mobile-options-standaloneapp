// Standard Normal cumulative distribution function (Abramowitz & Stegun approximation)
function cumulativeDistribution(x: number): number {
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
}

// Black-Scholes Pricing Model
// type: 'call' | 'put'
// S: Stock Price
// K: Strike Price
// T: Time to expiration in years
// r: Risk-free interest rate (decimal, e.g., 0.05)
// v: Volatility (decimal, e.g., 0.30)
export function blackScholes(type: 'call' | 'put' | 'stock', S: number, K: number, T: number, r: number, v: number): number {
  if (type === 'stock') return S;

  // Edge case protection: clamp to positive values
  S = Math.max(0.01, S);
  K = Math.max(0.01, K);
  v = Math.max(0.01, v); // Clamp IV to minimum 0.01 (1%)

  // Intrinsic value logic for expired options or zero time
  if (T <= 0) {
    if (type === 'call') return Math.max(0, S - K);
    else return Math.max(0, K - S);
  }

  const d1 = (Math.log(S / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T));
  const d2 = d1 - v * Math.sqrt(T);

  if (type === 'call') {
    return S * cumulativeDistribution(d1) - K * Math.exp(-r * T) * cumulativeDistribution(d2);
  } else {
    return K * Math.exp(-r * T) * cumulativeDistribution(-d2) - S * cumulativeDistribution(-d1);
  }
}

// Greeks calculation
export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

// Calculate Delta (rate of change of option price with respect to stock price)
export function calculateDelta(type: 'call' | 'put', S: number, K: number, T: number, r: number, v: number): number {
  S = Math.max(0.01, S);
  K = Math.max(0.01, K);
  v = Math.max(0, v);
  if (T <= 0 || v <= 0) return type === 'call' ? (S > K ? 1 : 0) : (S < K ? -1 : 0);

  const d1 = (Math.log(S / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T));

  if (!isFinite(d1)) return 0;

  if (type === 'call') {
    return cumulativeDistribution(d1);
  } else {
    return cumulativeDistribution(d1) - 1;
  }
}

// Calculate Gamma (rate of change of delta with respect to stock price)
export function calculateGamma(S: number, K: number, T: number, r: number, v: number): number {
  S = Math.max(0.01, S);
  K = Math.max(0.01, K);
  v = Math.max(0, v);
  if (T <= 0 || v <= 0) return 0;

  const d1 = (Math.log(S / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T));

  if (!isFinite(d1)) return 0;

  const nPrimeD1 = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-d1 * d1 / 2);
  const gamma = nPrimeD1 / (S * v * Math.sqrt(T));

  return isFinite(gamma) ? gamma : 0;
}

// Calculate Theta (rate of change of option price with respect to time)
// Returns theta per day (divide annual by 365)
export function calculateTheta(type: 'call' | 'put', S: number, K: number, T: number, r: number, v: number): number {
  S = Math.max(0.01, S);
  K = Math.max(0.01, K);
  v = Math.max(0, v);
  if (T <= 0 || v <= 0) return 0;

  const d1 = (Math.log(S / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T));
  const d2 = d1 - v * Math.sqrt(T);

  if (!isFinite(d1) || !isFinite(d2)) return 0;

  const nPrimeD1 = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-d1 * d1 / 2);

  if (type === 'call') {
    const theta = (-S * nPrimeD1 * v / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * cumulativeDistribution(d2)) / 365;
    return isFinite(theta) ? theta : 0;
  } else {
    const theta = (-S * nPrimeD1 * v / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * cumulativeDistribution(-d2)) / 365;
    return isFinite(theta) ? theta : 0;
  }
}

// Calculate Vega (rate of change of option price with respect to volatility)
// Returns vega for 1% change in IV (divide by 100)
export function calculateVega(S: number, K: number, T: number, r: number, v: number): number {
  S = Math.max(0.01, S);
  K = Math.max(0.01, K);
  v = Math.max(0, v);
  if (T <= 0 || v <= 0) return 0;

  const d1 = (Math.log(S / K) + (r + v * v / 2) * T) / (v * Math.sqrt(T));

  if (!isFinite(d1)) return 0;

  const nPrimeD1 = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-d1 * d1 / 2);
  const vega = (S * nPrimeD1 * Math.sqrt(T)) / 100;

  return isFinite(vega) ? vega : 0;
}

// Calculate all Greeks at once
export function calculateGreeks(type: 'call' | 'put', S: number, K: number, T: number, r: number, v: number): Greeks {
  return {
    delta: calculateDelta(type, S, K, T, r, v),
    gamma: calculateGamma(S, K, T, r, v),
    theta: calculateTheta(type, S, K, T, r, v),
    vega: calculateVega(S, K, T, r, v)
  };
}
