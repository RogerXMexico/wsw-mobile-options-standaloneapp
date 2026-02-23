// PayoffChart component for Wall Street Wildlife Mobile
// Interactive options strategy payoff diagram using react-native-svg
// Features: stock price slider, time-to-expiry slider, breakeven markers,
//   probability zones, max profit/loss annotations, touch-to-inspect,
//   multi-strategy overlay, current stock price indicator
import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import Svg, {
  Line,
  Path,
  Circle,
  Text as SvgText,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StrategyLeg {
  type: 'call' | 'put';
  strike: number;
  position: 'long' | 'short';
  premium: number;
  quantity?: number;
}

export interface PayoffPoint {
  price: number;
  profit: number;
}

export interface OverlayStrategy {
  label: string;
  legs: StrategyLeg[];
  color: string;
}

export interface PayoffChartProps {
  /** The primary strategy legs */
  legs: StrategyLeg[];
  /** Current underlying stock price */
  currentPrice?: number;
  /** Chart width in pixels (defaults to screen width minus padding) */
  width?: number;
  /** Chart height in pixels */
  height?: number;
  /** Show breakeven markers */
  showBreakeven?: boolean;
  /** Show max profit annotation */
  showMaxProfit?: boolean;
  /** Show max loss annotation */
  showMaxLoss?: boolean;
  /** Show probability-of-profit shading */
  showProbabilityZones?: boolean;
  /** Chart title */
  title?: string;
  /** Enable interactive stock price slider */
  interactive?: boolean;
  /** Enable time-to-expiration slider */
  showTimeSlider?: boolean;
  /** Enable touch-to-inspect mode */
  touchToInspect?: boolean;
  /** Additional strategies to overlay on chart */
  overlayStrategies?: OverlayStrategy[];
  /** Days to expiration (for time slider default) */
  daysToExpiry?: number;
  /** Implied volatility (annualized, e.g. 0.30 = 30%) */
  impliedVolatility?: number;
  /** Compact mode for embedded use */
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Black-Scholes helpers for time-varying payoff
// ---------------------------------------------------------------------------

/** Cumulative normal distribution (Abramowitz & Stegun approximation) */
const cdf = (x: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);
  return 0.5 * (1.0 + sign * y);
};

/** Standard normal pdf */
const pdf = (x: number): number => {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
};

/** Black-Scholes option price for a single leg */
const bsPrice = (
  S: number,
  K: number,
  T: number,
  sigma: number,
  type: 'call' | 'put',
  r: number = 0.05,
): number => {
  if (T <= 0.0001) {
    // At or past expiration - intrinsic value
    return type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
  }
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  if (type === 'call') {
    return S * cdf(d1) - K * Math.exp(-r * T) * cdf(d2);
  }
  return K * Math.exp(-r * T) * cdf(-d2) - S * cdf(-d1);
};

// ---------------------------------------------------------------------------
// Calculation utilities
// ---------------------------------------------------------------------------

/** Calculate payoff for a single option leg at expiration */
const calculateLegPayoff = (leg: StrategyLeg, price: number): number => {
  const qty = leg.quantity || 1;
  let intrinsicValue = 0;
  if (leg.type === 'call') {
    intrinsicValue = Math.max(0, price - leg.strike);
  } else {
    intrinsicValue = Math.max(0, leg.strike - price);
  }
  const payoff =
    leg.position === 'long'
      ? (intrinsicValue - leg.premium) * qty * 100
      : (leg.premium - intrinsicValue) * qty * 100;
  return payoff;
};

/** Calculate payoff for a single leg at a given time before expiry using BS */
const calculateLegPayoffAtTime = (
  leg: StrategyLeg,
  price: number,
  T: number,
  sigma: number,
): number => {
  const qty = leg.quantity || 1;
  const currentValue = bsPrice(price, leg.strike, T, sigma, leg.type);
  const costBasis = leg.premium;
  const pnl =
    leg.position === 'long'
      ? (currentValue - costBasis) * qty * 100
      : (costBasis - currentValue) * qty * 100;
  return pnl;
};

/** Calculate total strategy payoff at a given price (at expiration) */
const calculateStrategyPayoff = (legs: StrategyLeg[], price: number): number => {
  return legs.reduce((total, leg) => total + calculateLegPayoff(leg, price), 0);
};

/** Calculate total strategy payoff at a given price and time before expiry */
const calculateStrategyPayoffAtTime = (
  legs: StrategyLeg[],
  price: number,
  T: number,
  sigma: number,
): number => {
  return legs.reduce(
    (total, leg) => total + calculateLegPayoffAtTime(leg, price, T, sigma),
    0,
  );
};

/** Generate payoff data points for a strategy */
const generatePayoffData = (
  legs: StrategyLeg[],
  currentPrice: number,
  T?: number,
  sigma?: number,
): PayoffPoint[] => {
  const strikes = legs.map((leg) => leg.strike);
  const minStrike = Math.min(...strikes);
  const maxStrike = Math.max(...strikes);

  const range = maxStrike - minStrike || currentPrice * 0.2;
  const minPrice = Math.max(0, minStrike - range * 0.6);
  const maxPrice = maxStrike + range * 0.6;

  const points: PayoffPoint[] = [];
  const steps = 120;
  const stepSize = (maxPrice - minPrice) / steps;

  for (let i = 0; i <= steps; i++) {
    const price = minPrice + i * stepSize;
    const profit =
      T !== undefined && sigma !== undefined
        ? calculateStrategyPayoffAtTime(legs, price, T, sigma)
        : calculateStrategyPayoff(legs, price);
    points.push({ price, profit });
  }
  return points;
};

/** Find breakeven points (zero crossings) */
const findBreakevenPoints = (data: PayoffPoint[]): number[] => {
  const breakevens: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    if (
      (prev.profit <= 0 && curr.profit > 0) ||
      (prev.profit >= 0 && curr.profit < 0)
    ) {
      const ratio =
        Math.abs(prev.profit) / (Math.abs(prev.profit) + Math.abs(curr.profit));
      const breakeven = prev.price + ratio * (curr.price - prev.price);
      breakevens.push(breakeven);
    }
  }
  return breakevens;
};

/** Estimate probability of profit using log-normal model */
const estimateProbOfProfit = (
  currentPrice: number,
  breakevens: number[],
  daysToExpiry: number,
  sigma: number,
): number => {
  if (breakevens.length === 0 || daysToExpiry <= 0) return 0.5;
  const T = daysToExpiry / 365;
  const sqrtT = Math.sqrt(T);

  // For a single breakeven, probability of finishing above or below
  if (breakevens.length === 1) {
    const be = breakevens[0];
    const d = (Math.log(currentPrice / be) + (0 - 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
    // If payoff is profitable above breakeven, P(S > BE)
    return cdf(d);
  }

  // For two breakevens (typical spread), probability between them
  if (breakevens.length === 2) {
    const [be1, be2] = breakevens.sort((a, b) => a - b);
    const d1 = (Math.log(currentPrice / be1) + (0 - 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
    const d2 = (Math.log(currentPrice / be2) + (0 - 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
    return Math.abs(cdf(d1) - cdf(d2));
  }

  return 0.5;
};

/** Format currency for display */
const fmtCurrency = (v: number): string => {
  const abs = Math.abs(v);
  if (abs >= 10000) return `$${(v / 1000).toFixed(1)}K`;
  if (abs >= 1000) return `$${v.toFixed(0)}`;
  return `$${v.toFixed(0)}`;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PayoffChart: React.FC<PayoffChartProps> = ({
  legs,
  currentPrice = 100,
  width = screenWidth - spacing.lg * 2,
  height = 300,
  showBreakeven = true,
  showMaxProfit = true,
  showMaxLoss = true,
  showProbabilityZones = true,
  title,
  interactive = true,
  showTimeSlider = true,
  touchToInspect = true,
  overlayStrategies,
  daysToExpiry = 30,
  impliedVolatility = 0.30,
  compact = false,
}) => {
  // -- State --
  const [inspectX, setInspectX] = useState<number | null>(null);
  const [inspectPrice, setInspectPrice] = useState<number | null>(null);
  const [inspectPnL, setInspectPnL] = useState<number | null>(null);
  const [sliderDays, setSliderDays] = useState(daysToExpiry);
  const [stockPriceOverride, setStockPriceOverride] = useState<number | null>(null);
  const [activeSlider, setActiveSlider] = useState<'none' | 'stock' | 'time'>('none');

  const effectivePrice = stockPriceOverride ?? currentPrice;
  const chartRef = useRef<View>(null);

  // Adjust chart dimensions for compact mode
  const effectiveHeight = compact ? Math.min(height, 240) : height;
  const padding = compact
    ? { top: 24, right: 16, bottom: 36, left: 52 }
    : { top: 30, right: 24, bottom: 44, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = effectiveHeight - padding.top - padding.bottom;

  // -- Data computations --
  const {
    data,
    expirationData,
    breakevens,
    maxProfit,
    maxLoss,
    maxProfitPrice,
    maxLossPrice,
    priceRange,
    profitRange,
    probOfProfit,
  } = useMemo(() => {
    // Expiration payoff (always shown as the main curve)
    const expData = generatePayoffData(legs, effectivePrice);
    // Time-varying payoff if slider is active and not at 0
    const T = sliderDays / 365;
    const timeData =
      showTimeSlider && sliderDays > 0
        ? generatePayoffData(legs, effectivePrice, T, impliedVolatility)
        : null;

    const breakevenPoints = findBreakevenPoints(expData);

    const expProfits = expData.map((d) => d.profit);
    const maxP = Math.max(...expProfits);
    const minP = Math.min(...expProfits);
    const maxPIdx = expProfits.indexOf(maxP);
    const minPIdx = expProfits.indexOf(minP);
    const maxPPrice = expData[maxPIdx]?.price ?? effectivePrice;
    const minPPrice = expData[minPIdx]?.price ?? effectivePrice;

    // Include time curve in the profit range if it exists
    let allProfits = [...expProfits];
    if (timeData) {
      allProfits = allProfits.concat(timeData.map((d) => d.profit));
    }
    // Include overlay strategies
    if (overlayStrategies) {
      overlayStrategies.forEach((os) => {
        const oData = generatePayoffData(os.legs, effectivePrice);
        allProfits = allProfits.concat(oData.map((d) => d.profit));
      });
    }

    const overallMax = Math.max(...allProfits);
    const overallMin = Math.min(...allProfits);

    const prices = expData.map((d) => d.price);
    const minPr = Math.min(...prices);
    const maxPr = Math.max(...prices);

    const pop = estimateProbOfProfit(
      effectivePrice,
      breakevenPoints,
      daysToExpiry,
      impliedVolatility,
    );

    return {
      data: timeData || expData,
      expirationData: expData,
      breakevens: breakevenPoints,
      maxProfit: maxP,
      maxLoss: minP,
      maxProfitPrice: maxPPrice,
      maxLossPrice: minPPrice,
      priceRange: { min: minPr, max: maxPr },
      profitRange: {
        min: Math.min(overallMin, -100) * 1.1,
        max: Math.max(overallMax, 100) * 1.1,
      },
      probOfProfit: pop,
    };
  }, [legs, effectivePrice, sliderDays, impliedVolatility, daysToExpiry, showTimeSlider, overlayStrategies]);

  // -- Scale functions --
  const scaleX = useCallback(
    (price: number) =>
      padding.left +
      ((price - priceRange.min) / (priceRange.max - priceRange.min)) * chartWidth,
    [priceRange, chartWidth, padding.left],
  );

  const scaleY = useCallback(
    (profit: number) =>
      padding.top +
      chartHeight -
      ((profit - profitRange.min) / (profitRange.max - profitRange.min)) * chartHeight,
    [profitRange, chartHeight, padding.top],
  );

  const unscaleX = useCallback(
    (px: number) =>
      priceRange.min +
      ((px - padding.left) / chartWidth) * (priceRange.max - priceRange.min),
    [priceRange, chartWidth, padding.left],
  );

  // -- Path generation --
  const buildPath = useCallback(
    (pts: PayoffPoint[]): string => {
      if (pts.length === 0) return '';
      let path = `M ${scaleX(pts[0].price)} ${scaleY(pts[0].profit)}`;
      for (let i = 1; i < pts.length; i++) {
        path += ` L ${scaleX(pts[i].price)} ${scaleY(pts[i].profit)}`;
      }
      return path;
    },
    [scaleX, scaleY],
  );

  const expirationPath = useMemo(() => buildPath(expirationData), [expirationData, buildPath]);
  const currentPath = useMemo(() => {
    if (sliderDays > 0 && showTimeSlider) return buildPath(data);
    return null;
  }, [data, buildPath, sliderDays, showTimeSlider]);

  // Overlay strategy paths
  const overlayPaths = useMemo(() => {
    if (!overlayStrategies) return [];
    return overlayStrategies.map((os) => {
      const oData = generatePayoffData(os.legs, effectivePrice);
      return { label: os.label, color: os.color, path: buildPath(oData) };
    });
  }, [overlayStrategies, effectivePrice, buildPath]);

  // Profit/loss shading areas
  const { profitAreaPath, lossAreaPath } = useMemo(() => {
    if (!showProbabilityZones) return { profitAreaPath: '', lossAreaPath: '' };
    const zeroY = scaleY(0);
    // Build clipped profit area (above zero line)
    let profitPath = '';
    let lossPath = '';
    const sourceData = expirationData;
    if (sourceData.length === 0) return { profitAreaPath: '', lossAreaPath: '' };

    // Profit area: only portions above zero
    let inProfit = false;
    for (let i = 0; i < sourceData.length; i++) {
      const x = scaleX(sourceData[i].price);
      const y = scaleY(sourceData[i].profit);
      if (sourceData[i].profit >= 0) {
        if (!inProfit) {
          profitPath += `M ${x} ${zeroY} L ${x} ${y}`;
          inProfit = true;
        } else {
          profitPath += ` L ${x} ${y}`;
        }
      } else {
        if (inProfit) {
          profitPath += ` L ${x} ${zeroY} `;
          inProfit = false;
        }
      }
    }
    if (inProfit) {
      profitPath += ` L ${scaleX(sourceData[sourceData.length - 1].price)} ${zeroY} Z`;
    }

    // Loss area: only portions below zero
    let inLoss = false;
    for (let i = 0; i < sourceData.length; i++) {
      const x = scaleX(sourceData[i].price);
      const y = scaleY(sourceData[i].profit);
      if (sourceData[i].profit < 0) {
        if (!inLoss) {
          lossPath += `M ${x} ${zeroY} L ${x} ${y}`;
          inLoss = true;
        } else {
          lossPath += ` L ${x} ${y}`;
        }
      } else {
        if (inLoss) {
          lossPath += ` L ${x} ${zeroY} Z `;
          inLoss = false;
        }
      }
    }
    if (inLoss) {
      lossPath += ` L ${scaleX(sourceData[sourceData.length - 1].price)} ${zeroY} Z`;
    }

    return { profitAreaPath: profitPath, lossAreaPath: lossPath };
  }, [expirationData, scaleX, scaleY, showProbabilityZones]);

  // -- Axis labels --
  const xLabels = useMemo(() => {
    const count = compact ? 3 : 5;
    const labels: number[] = [];
    const step = (priceRange.max - priceRange.min) / (count - 1);
    for (let i = 0; i < count; i++) {
      labels.push(priceRange.min + i * step);
    }
    return labels;
  }, [priceRange, compact]);

  const yLabels = useMemo(() => {
    const count = compact ? 3 : 5;
    const labels: number[] = [];
    const step = (profitRange.max - profitRange.min) / (count - 1);
    for (let i = 0; i < count; i++) {
      labels.push(profitRange.min + i * step);
    }
    return labels;
  }, [profitRange, compact]);

  const zeroLineY = scaleY(0);

  // -- Touch handling (PanResponder for touch-to-inspect) --
  const handleTouch = useCallback(
    (pageX: number) => {
      if (!touchToInspect) return;
      // Map touch position to chart coordinates
      // We need the x relative to the SVG
      const x = pageX;
      const price = unscaleX(x);
      if (price < priceRange.min || price > priceRange.max) {
        setInspectX(null);
        setInspectPrice(null);
        setInspectPnL(null);
        return;
      }
      const pnl =
        sliderDays > 0 && showTimeSlider
          ? calculateStrategyPayoffAtTime(legs, price, sliderDays / 365, impliedVolatility)
          : calculateStrategyPayoff(legs, price);
      setInspectX(scaleX(price));
      setInspectPrice(price);
      setInspectPnL(pnl);
    },
    [touchToInspect, unscaleX, priceRange, scaleX, legs, sliderDays, showTimeSlider, impliedVolatility],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => touchToInspect,
        onMoveShouldSetPanResponder: () => touchToInspect,
        onPanResponderGrant: (evt) => {
          handleTouch(evt.nativeEvent.locationX);
        },
        onPanResponderMove: (evt) => {
          handleTouch(evt.nativeEvent.locationX);
        },
        onPanResponderRelease: () => {
          // Keep inspection visible for a moment, then clear
          setTimeout(() => {
            setInspectX(null);
            setInspectPrice(null);
            setInspectPnL(null);
          }, 2000);
        },
      }),
    [touchToInspect, handleTouch],
  );

  // -- Slider handlers --
  const stockSliderPan = useMemo(() => {
    const sliderWidth = width - 32;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => interactive,
      onMoveShouldSetPanResponder: () => interactive,
      onPanResponderGrant: () => setActiveSlider('stock'),
      onPanResponderMove: (_, gs) => {
        const fraction = Math.max(0, Math.min(1, (gs.moveX - 16) / sliderWidth));
        const price = priceRange.min + fraction * (priceRange.max - priceRange.min);
        setStockPriceOverride(Math.round(price * 100) / 100);
      },
      onPanResponderRelease: () => setActiveSlider('none'),
    });
  }, [interactive, width, priceRange]);

  const timeSliderPan = useMemo(() => {
    const sliderWidth = width - 32;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => showTimeSlider,
      onMoveShouldSetPanResponder: () => showTimeSlider,
      onPanResponderGrant: () => setActiveSlider('time'),
      onPanResponderMove: (_, gs) => {
        const fraction = Math.max(0, Math.min(1, (gs.moveX - 16) / sliderWidth));
        setSliderDays(Math.round(fraction * daysToExpiry));
      },
      onPanResponderRelease: () => setActiveSlider('none'),
    });
  }, [showTimeSlider, width, daysToExpiry]);

  // Stock slider position
  const stockSliderFraction = useMemo(() => {
    return (effectivePrice - priceRange.min) / (priceRange.max - priceRange.min);
  }, [effectivePrice, priceRange]);

  const timeSliderFraction = useMemo(() => {
    return daysToExpiry > 0 ? sliderDays / daysToExpiry : 0;
  }, [sliderDays, daysToExpiry]);

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {title && <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>}

      {/* Probability of Profit badge */}
      {showProbabilityZones && breakevens.length > 0 && (
        <View style={styles.popBadgeRow}>
          <View style={styles.popBadge}>
            <Text style={styles.popLabel}>Prob. of Profit</Text>
            <Text
              style={[
                styles.popValue,
                { color: probOfProfit > 0.5 ? colors.bullish : colors.bearish },
              ]}
            >
              {(probOfProfit * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
      )}

      {/* SVG Chart */}
      <View {...panResponder.panHandlers}>
        <Svg width={width} height={effectiveHeight}>
          <Defs>
            <LinearGradient id="profitFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.bullish} stopOpacity={0.25} />
              <Stop offset="100%" stopColor={colors.bullish} stopOpacity={0.02} />
            </LinearGradient>
            <LinearGradient id="lossFill" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor={colors.bearish} stopOpacity={0.25} />
              <Stop offset="100%" stopColor={colors.bearish} stopOpacity={0.02} />
            </LinearGradient>
            <ClipPath id="chartClip">
              <Rect
                x={padding.left}
                y={padding.top}
                width={chartWidth}
                height={chartHeight}
              />
            </ClipPath>
          </Defs>

          {/* Background */}
          <Rect
            x={padding.left}
            y={padding.top}
            width={chartWidth}
            height={chartHeight}
            fill={colors.background.secondary}
            rx={6}
          />

          {/* Grid lines */}
          {yLabels.map((label, i) => (
            <Line
              key={`grid-${i}`}
              x1={padding.left}
              y1={scaleY(label)}
              x2={padding.left + chartWidth}
              y2={scaleY(label)}
              stroke={colors.border.light}
              strokeWidth={0.5}
              strokeOpacity={0.4}
            />
          ))}

          {/* Zero line */}
          <Line
            x1={padding.left}
            y1={zeroLineY}
            x2={padding.left + chartWidth}
            y2={zeroLineY}
            stroke={colors.text.muted}
            strokeWidth={1.5}
            strokeDasharray="6,4"
          />

          {/* Probability zones (shaded areas) */}
          {showProbabilityZones && profitAreaPath ? (
            <G clipPath="url(#chartClip)">
              <Path d={profitAreaPath} fill="url(#profitFill)" />
              <Path d={lossAreaPath} fill="url(#lossFill)" />
            </G>
          ) : null}

          {/* Overlay strategy paths */}
          {overlayPaths.map((op, i) => (
            <Path
              key={`overlay-${i}`}
              d={op.path}
              stroke={op.color}
              strokeWidth={2}
              fill="none"
              strokeDasharray="8,4"
              opacity={0.7}
              clipPath="url(#chartClip)"
            />
          ))}

          {/* Time-varying payoff line (if different from expiration) */}
          {currentPath && (
            <Path
              d={currentPath}
              stroke={colors.neon.cyan}
              strokeWidth={2}
              fill="none"
              strokeDasharray="4,3"
              opacity={0.8}
              clipPath="url(#chartClip)"
            />
          )}

          {/* Main expiration payoff line */}
          <Path
            d={expirationPath}
            stroke={colors.neon.green}
            strokeWidth={2.5}
            fill="none"
            clipPath="url(#chartClip)"
          />

          {/* Strike price markers */}
          {legs.map((leg, i) => {
            const sx = scaleX(leg.strike);
            if (sx < padding.left || sx > padding.left + chartWidth) return null;
            return (
              <G key={`strike-${i}`}>
                <Line
                  x1={sx}
                  y1={padding.top}
                  x2={sx}
                  y2={padding.top + chartHeight}
                  stroke={leg.type === 'call' ? colors.bullish : colors.bearish}
                  strokeWidth={1}
                  strokeDasharray="3,3"
                  strokeOpacity={0.5}
                />
                <Circle
                  cx={sx}
                  cy={scaleY(calculateStrategyPayoff(legs, leg.strike))}
                  r={4}
                  fill={leg.type === 'call' ? colors.bullish : colors.bearish}
                />
                <SvgText
                  x={sx}
                  y={padding.top + chartHeight + 12}
                  fill={leg.type === 'call' ? colors.bullish : colors.bearish}
                  fontSize={8}
                  textAnchor="middle"
                  fontWeight="bold"
                  opacity={0.7}
                >
                  {leg.position === 'long' ? 'B' : 'S'} ${leg.strike}
                </SvgText>
              </G>
            );
          })}

          {/* Breakeven markers */}
          {showBreakeven &&
            breakevens.map((be, i) => {
              const bx = scaleX(be);
              if (bx < padding.left || bx > padding.left + chartWidth) return null;
              return (
                <G key={`be-${i}`}>
                  <Line
                    x1={bx}
                    y1={zeroLineY - 6}
                    x2={bx}
                    y2={zeroLineY + 6}
                    stroke={colors.warning}
                    strokeWidth={2}
                  />
                  <Circle cx={bx} cy={zeroLineY} r={5} fill={colors.warning} />
                  <Rect
                    x={bx - 28}
                    y={zeroLineY - 26}
                    width={56}
                    height={16}
                    rx={4}
                    fill={colors.background.elevated}
                    stroke={colors.warning}
                    strokeWidth={0.5}
                  />
                  <SvgText
                    x={bx}
                    y={zeroLineY - 14}
                    fill={colors.warning}
                    fontSize={9}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    BE ${be.toFixed(1)}
                  </SvgText>
                </G>
              );
            })}

          {/* Max Profit annotation */}
          {showMaxProfit && maxProfit > 0 && (
            <G>
              <Circle
                cx={scaleX(maxProfitPrice)}
                cy={scaleY(maxProfit)}
                r={4}
                fill={colors.bullish}
                strokeWidth={2}
                stroke={colors.background.primary}
              />
              {scaleY(maxProfit) > padding.top + 20 && (
                <>
                  <Rect
                    x={Math.min(
                      Math.max(scaleX(maxProfitPrice) - 32, padding.left),
                      padding.left + chartWidth - 64,
                    )}
                    y={scaleY(maxProfit) - 22}
                    width={64}
                    height={16}
                    rx={4}
                    fill="rgba(57, 255, 20, 0.15)"
                  />
                  <SvgText
                    x={Math.min(
                      Math.max(scaleX(maxProfitPrice), padding.left + 32),
                      padding.left + chartWidth - 32,
                    )}
                    y={scaleY(maxProfit) - 10}
                    fill={colors.bullish}
                    fontSize={9}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    Max +{fmtCurrency(maxProfit)}
                  </SvgText>
                </>
              )}
            </G>
          )}

          {/* Max Loss annotation */}
          {showMaxLoss && maxLoss < 0 && (
            <G>
              <Circle
                cx={scaleX(maxLossPrice)}
                cy={scaleY(maxLoss)}
                r={4}
                fill={colors.bearish}
                strokeWidth={2}
                stroke={colors.background.primary}
              />
              {scaleY(maxLoss) < padding.top + chartHeight - 20 && (
                <>
                  <Rect
                    x={Math.min(
                      Math.max(scaleX(maxLossPrice) - 32, padding.left),
                      padding.left + chartWidth - 64,
                    )}
                    y={scaleY(maxLoss) + 8}
                    width={64}
                    height={16}
                    rx={4}
                    fill="rgba(255, 7, 58, 0.15)"
                  />
                  <SvgText
                    x={Math.min(
                      Math.max(scaleX(maxLossPrice), padding.left + 32),
                      padding.left + chartWidth - 32,
                    )}
                    y={scaleY(maxLoss) + 20}
                    fill={colors.bearish}
                    fontSize={9}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    Max -{fmtCurrency(Math.abs(maxLoss))}
                  </SvgText>
                </>
              )}
            </G>
          )}

          {/* Current stock price indicator */}
          {(() => {
            const cpx = scaleX(effectivePrice);
            if (cpx < padding.left || cpx > padding.left + chartWidth) return null;
            return (
              <G>
                <Line
                  x1={cpx}
                  y1={padding.top}
                  x2={cpx}
                  y2={padding.top + chartHeight}
                  stroke={colors.neon.cyan}
                  strokeWidth={1.5}
                  strokeDasharray="2,3"
                />
                <Rect
                  x={cpx - 22}
                  y={padding.top - 2}
                  width={44}
                  height={14}
                  rx={3}
                  fill={colors.neon.cyan}
                />
                <SvgText
                  x={cpx}
                  y={padding.top + 9}
                  fill={colors.background.primary}
                  fontSize={9}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  ${effectivePrice.toFixed(0)}
                </SvgText>
              </G>
            );
          })()}

          {/* Touch-to-inspect crosshair */}
          {inspectX !== null && inspectPrice !== null && inspectPnL !== null && (
            <G>
              {/* Vertical line */}
              <Line
                x1={inspectX}
                y1={padding.top}
                x2={inspectX}
                y2={padding.top + chartHeight}
                stroke={colors.text.primary}
                strokeWidth={1}
                strokeDasharray="2,2"
                opacity={0.6}
              />
              {/* Horizontal line at PnL */}
              <Line
                x1={padding.left}
                y1={scaleY(inspectPnL)}
                x2={padding.left + chartWidth}
                y2={scaleY(inspectPnL)}
                stroke={colors.text.primary}
                strokeWidth={0.5}
                strokeDasharray="2,2"
                opacity={0.3}
              />
              {/* Dot at intersection */}
              <Circle
                cx={inspectX}
                cy={scaleY(inspectPnL)}
                r={6}
                fill={inspectPnL >= 0 ? colors.bullish : colors.bearish}
                stroke={colors.text.primary}
                strokeWidth={2}
              />
              {/* Tooltip background */}
              <Rect
                x={Math.min(Math.max(inspectX - 50, padding.left), padding.left + chartWidth - 100)}
                y={Math.max(scaleY(inspectPnL) - 40, padding.top)}
                width={100}
                height={28}
                rx={6}
                fill={colors.background.elevated}
                stroke={inspectPnL >= 0 ? colors.bullish : colors.bearish}
                strokeWidth={1}
                opacity={0.95}
              />
              {/* Tooltip text */}
              <SvgText
                x={Math.min(Math.max(inspectX, padding.left + 50), padding.left + chartWidth - 50)}
                y={Math.max(scaleY(inspectPnL) - 22, padding.top + 18)}
                fill={colors.text.primary}
                fontSize={10}
                textAnchor="middle"
                fontWeight="bold"
              >
                ${inspectPrice.toFixed(1)} | {inspectPnL >= 0 ? '+' : ''}
                {fmtCurrency(inspectPnL)}
              </SvgText>
            </G>
          )}

          {/* X-axis labels */}
          {xLabels.map((label, i) => (
            <SvgText
              key={`x-${i}`}
              x={scaleX(label)}
              y={effectiveHeight - (compact ? 4 : 8)}
              fill={colors.text.secondary}
              fontSize={compact ? 8 : 9}
              textAnchor="middle"
            >
              ${label.toFixed(0)}
            </SvgText>
          ))}

          {/* Y-axis labels */}
          {yLabels.map((label, i) => (
            <SvgText
              key={`y-${i}`}
              x={padding.left - 6}
              y={scaleY(label) + 3}
              fill={colors.text.secondary}
              fontSize={compact ? 8 : 9}
              textAnchor="end"
            >
              {fmtCurrency(label)}
            </SvgText>
          ))}

          {/* Axis labels */}
          {!compact && (
            <>
              <SvgText
                x={width / 2}
                y={effectiveHeight - 1}
                fill={colors.text.muted}
                fontSize={10}
                textAnchor="middle"
              >
                Stock Price at Expiration
              </SvgText>
              <SvgText
                x={10}
                y={effectiveHeight / 2}
                fill={colors.text.muted}
                fontSize={10}
                textAnchor="middle"
                rotation={-90}
                originX={10}
                originY={effectiveHeight / 2}
              >
                P/L ($)
              </SvgText>
            </>
          )}
        </Svg>
      </View>

      {/* Interactive controls */}
      {interactive && !compact && (
        <View style={styles.controlsContainer}>
          {/* Stock Price Slider */}
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Stock Price</Text>
            <View style={styles.sliderTrack} {...stockSliderPan.panHandlers}>
              <View style={styles.sliderTrackBg} />
              <View
                style={[
                  styles.sliderFill,
                  {
                    width: `${Math.max(0, Math.min(100, stockSliderFraction * 100))}%`,
                    backgroundColor: colors.neon.cyan,
                  },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  {
                    left: `${Math.max(0, Math.min(100, stockSliderFraction * 100))}%`,
                    backgroundColor:
                      activeSlider === 'stock' ? colors.neon.cyan : colors.text.primary,
                  },
                ]}
              />
            </View>
            <Text style={styles.sliderValue}>${effectivePrice.toFixed(0)}</Text>
          </View>

          {/* Time to Expiration Slider */}
          {showTimeSlider && (
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Days to Exp</Text>
              <View style={styles.sliderTrack} {...timeSliderPan.panHandlers}>
                <View style={styles.sliderTrackBg} />
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${Math.max(0, Math.min(100, timeSliderFraction * 100))}%`,
                      backgroundColor: colors.neon.purple,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    {
                      left: `${Math.max(0, Math.min(100, timeSliderFraction * 100))}%`,
                      backgroundColor:
                        activeSlider === 'time' ? colors.neon.purple : colors.text.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.sliderValue}>{sliderDays}d</Text>
            </View>
          )}
        </View>
      )}

      {/* Legend */}
      <View style={[styles.legend, compact && styles.legendCompact]}>
        {/* Time curve legend */}
        {showTimeSlider && sliderDays > 0 && !compact && (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: colors.neon.cyan }]} />
            <Text style={styles.legendText}>{sliderDays}d to expiry</Text>
          </View>
        )}
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: colors.neon.green }]} />
          <Text style={styles.legendText}>At expiration</Text>
        </View>

        {/* Overlay legends */}
        {overlayPaths.map((op, i) => (
          <View key={`leg-${i}`} style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: op.color }]} />
            <Text style={styles.legendText}>{op.label}</Text>
          </View>
        ))}

        {showMaxProfit && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.bullish }]} />
            <Text style={styles.legendText}>
              Max +{fmtCurrency(maxProfit)}
            </Text>
          </View>
        )}
        {showMaxLoss && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.bearish }]} />
            <Text style={styles.legendText}>
              Max -{fmtCurrency(Math.abs(maxLoss))}
            </Text>
          </View>
        )}
        {showBreakeven && breakevens.length > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>
              BE: {breakevens.map((b) => `$${b.toFixed(0)}`).join(', ')}
            </Text>
          </View>
        )}
      </View>

      {/* Touch hint */}
      {touchToInspect && !compact && (
        <Text style={styles.touchHint}>Tap or drag on chart to inspect P/L</Text>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  containerCompact: {
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  title: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  popBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  popBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  popLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  popValue: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  // Slider controls
  controlsContainer: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sliderLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    width: 72,
    fontSize: 10,
  },
  sliderTrack: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
  },
  sliderTrackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: 2,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  sliderValue: {
    ...typography.styles.mono,
    color: colors.text.primary,
    width: 52,
    textAlign: 'right',
    fontSize: 12,
  },
  // Legend
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  legendCompact: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLine: {
    width: 16,
    height: 3,
    borderRadius: 1.5,
  },
  legendText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },
  touchHint: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontSize: 10,
    opacity: 0.6,
  },
});

export default PayoffChart;
