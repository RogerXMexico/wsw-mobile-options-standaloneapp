/**
 * Format a number as USD currency string.
 * formatCurrency(1234.56) → "$1,234.56"
 * formatCurrency(-500) → "-$500.00"
 */
export const formatCurrency = (value: number): string => {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
};

/**
 * Format absolute currency (no sign).
 * formatCurrencyAbs(1234.56) → "$1,234.56"
 */
export const formatCurrencyAbs = (value: number): string => {
  return `$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format a probability (0-1) as percentage string.
 * formatProbability(0.8542) → "85.4%"
 */
export const formatProbability = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format a percentage value.
 * formatPercent(12.345) → "+12.35%"
 * formatPercent(-5.2) → "-5.20%"
 */
export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * Format large numbers compactly.
 * formatCompact(1500000) → "$1.5M"
 * formatCompact(45000) → "$45.0K"
 */
export const formatCompact = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return formatCurrency(value);
};
