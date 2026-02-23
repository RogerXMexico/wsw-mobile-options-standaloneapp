// Greeks Visualizer Screen - Professional Options Greeks Analysis Tool
// Ported and adapted from desktop version with full Black-Scholes calculations
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Svg, {
  Path,
  Line,
  Circle,
  Rect,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { calculateGreeks, calculateOptionPrice } from '../../utils/greeksMath';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_PADDING = spacing.lg * 2;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING;
const CHART_HEIGHT = 200;
const SVG_CHART_W = 300;
const SVG_CHART_H = 180;
const SVG_PAD = { top: 10, right: 10, bottom: 25, left: 45 };
const PLOT_W = SVG_CHART_W - SVG_PAD.left - SVG_PAD.right;
const PLOT_H = SVG_CHART_H - SVG_PAD.top - SVG_PAD.bottom;

// Heatmap dimensions
const HEATMAP_ROWS = 9; // price steps
const HEATMAP_COLS = 7; // time steps

// ─── Types ───────────────────────────────────────────────────────────────────

interface GreekPoint {
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

interface Inputs {
  stockPrice: number;
  strikePrice: number;
  daysToExpiry: number;
  iv: number;
  riskFreeRate: number;
  isCall: boolean;
}

type ActiveGreek = 'delta' | 'gamma' | 'theta' | 'vega' | 'rho';
type SensitivityMode = 'price' | 'iv' | 'time';
type MainTab = 'visualizer' | 'decay' | 'sensitivity' | 'heatmap' | 'learn';

// ─── Constants ───────────────────────────────────────────────────────────────

const GREEK_COLORS: Record<ActiveGreek, { main: string; glow: string }> = {
  delta: { main: '#39ff14', glow: 'rgba(57, 255, 20, 0.6)' },
  gamma: { main: '#00f0ff', glow: 'rgba(0, 240, 255, 0.6)' },
  theta: { main: '#ff0099', glow: 'rgba(255, 0, 153, 0.6)' },
  vega: { main: '#ffff00', glow: 'rgba(255, 240, 31, 0.6)' },
  rho: { main: '#ff6600', glow: 'rgba(255, 102, 0, 0.6)' },
};

const GREEK_ICONS: Record<ActiveGreek, keyof typeof Ionicons.glyphMap> = {
  delta: 'trending-up',
  gamma: 'pulse',
  theta: 'time-outline',
  vega: 'flash',
  rho: 'wallet-outline',
};

const GREEK_LABELS: Record<ActiveGreek, { symbol: string; name: string; short: string }> = {
  delta: { symbol: '\u0394', name: 'Delta', short: 'Price Sensitivity' },
  gamma: { symbol: '\u0393', name: 'Gamma', short: 'Delta Acceleration' },
  theta: { symbol: '\u0398', name: 'Theta', short: 'Time Decay' },
  vega: { symbol: '\u03BD', name: 'Vega', short: 'IV Sensitivity' },
  rho: { symbol: '\u03C1', name: 'Rho', short: 'Rate Sensitivity' },
};

const GREEK_EDUCATION: Record<ActiveGreek, { title: string; bullets: string[]; insight: string }> = {
  delta: {
    title: 'Delta = Speed',
    bullets: [
      'Option $ change per $1 stock move',
      'Approximates probability of expiring ITM',
      'Hedge ratio for delta-neutral positions',
      'Calls: 0 to 1, Puts: -1 to 0',
    ],
    insight:
      'Delta Neutral: A position where total delta = 0, meaning no directional exposure. To hedge 1 call with 0.50 delta, sell 50 shares.',
  },
  gamma: {
    title: 'Gamma = Acceleration',
    bullets: [
      'Rate of change of Delta per $1 stock move',
      'Highest when ATM and near expiration',
      'High Gamma = explosive P&L swings',
      'Same value for calls and puts at same strike',
    ],
    insight:
      'High Gamma usually means high Theta burn. It is the price you pay for explosive potential near expiration.',
  },
  theta: {
    title: 'Theta = Time Decay',
    bullets: [
      'Value lost per day (always negative for longs)',
      'Highest for ATM options',
      'Accelerates as expiration approaches',
      'Sellers collect theta; buyers pay it',
    ],
    insight:
      'The last 30 days see the steepest theta curve. Many traders sell options in this zone to harvest decay.',
  },
  vega: {
    title: 'Vega = Volatility',
    bullets: [
      'Price change per 1% change in IV',
      'High Vega = sensitive to fear/greed',
      'Long options are long Vega',
      'Longer-dated options have higher Vega',
    ],
    insight:
      'An IV crush after earnings can destroy option value even if the stock moves in your favor. Always check Vega before events.',
  },
  rho: {
    title: 'Rho = Interest Rates',
    bullets: [
      'Price change per 1% change in risk-free rate',
      'Usually small impact for short-term options',
      'More significant for LEAPS',
      'Calls have positive Rho; puts have negative',
    ],
    insight:
      'Rho matters most for long-dated options (6+ months). In a rising rate environment, calls gain a small edge.',
  },
};

const DEFAULT_INPUTS: Inputs = {
  stockPrice: 100,
  strikePrice: 100,
  daysToExpiry: 30,
  iv: 30,
  riskFreeRate: 5,
  isCall: true,
};

const STARTING_DTE = 45;

const TAB_CONFIG: { key: MainTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'visualizer', label: 'Greeks', icon: 'pulse' },
  { key: 'decay', label: 'Decay', icon: 'time-outline' },
  { key: 'sensitivity', label: 'What-If', icon: 'flask' },
  { key: 'heatmap', label: 'Heatmap', icon: 'grid' },
  { key: 'learn', label: 'Learn', icon: 'school' },
];

// ─── Rho calculation (not in greeksMath.ts) ─────────────────────────────────

function calculateRho(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  isCall: boolean,
): number {
  if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) return 0;
  const sqrtT = Math.sqrt(T);
  const d2 = (Math.log(S / K) + (r - 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const Nd2 = normalCDF(d2);
  if (isCall) {
    return (K * T * Math.exp(-r * T) * Nd2) / 100;
  } else {
    return (-K * T * Math.exp(-r * T) * (1 - Nd2)) / 100;
  }
}

function normalCDF(x: number): number {
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

// ─── Helper: format Greek values ─────────────────────────────────────────────

function formatGreek(greek: ActiveGreek, value: number): string {
  switch (greek) {
    case 'delta':
      return value.toFixed(3);
    case 'gamma':
      return value.toFixed(4);
    case 'theta':
      return value.toFixed(4);
    case 'vega':
      return `$${value.toFixed(2)}`;
    case 'rho':
      return `$${value.toFixed(3)}`;
    default:
      return value.toFixed(4);
  }
}

// ─── Helper: calculate all 5 Greeks ─────────────────────────────────────────

function calcAllGreeks(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  isCall: boolean,
): { delta: number; gamma: number; theta: number; vega: number; rho: number } {
  const g = calculateGreeks(S, K, T, r, sigma, isCall);
  const rho = calculateRho(S, K, T, r, sigma, isCall);
  return { ...g, rho };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const GreeksVisualizerScreen: React.FC = () => {
  const navigation = useNavigation();

  // ─── State ──────────────────────────────────────────────────────────────────
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [activeGreek, setActiveGreek] = useState<ActiveGreek>('delta');
  const [mainTab, setMainTab] = useState<MainTab>('visualizer');
  const [sensitivityMode, setSensitivityMode] = useState<SensitivityMode>('price');
  const [expandedGreek, setExpandedGreek] = useState<ActiveGreek | null>(null);

  // Theta decay animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDay, setAnimationDay] = useState(0);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Derived data ───────────────────────────────────────────────────────────

  const { stockPrice, strikePrice, daysToExpiry, iv, riskFreeRate, isCall } = inputs;
  const T = daysToExpiry / 365;
  const sigma = iv / 100;
  const r = riskFreeRate / 100;

  // Greek data points across price range (60 points)
  const greekData = useMemo((): GreekPoint[] => {
    const points: GreekPoint[] = [];
    const minP = strikePrice * 0.7;
    const maxP = strikePrice * 1.3;
    const step = (maxP - minP) / 60;
    for (let price = minP; price <= maxP; price += step) {
      const g = calcAllGreeks(price, strikePrice, T, r, sigma, isCall);
      points.push({
        price: Math.round(price * 100) / 100,
        ...g,
      });
    }
    return points;
  }, [strikePrice, T, r, sigma, isCall]);

  // Current Greeks at selected stock price
  const currentGreeks = useMemo(
    () => calcAllGreeks(stockPrice, strikePrice, T, r, sigma, isCall),
    [stockPrice, strikePrice, T, r, sigma, isCall],
  );

  // Current option price
  const currentOptionPrice = useMemo(
    () => calculateOptionPrice(stockPrice, strikePrice, T, r, sigma, isCall),
    [stockPrice, strikePrice, T, r, sigma, isCall],
  );

  // ─── Time decay animation data ─────────────────────────────────────────────

  const animationData = useMemo(() => {
    const days: {
      day: number;
      dte: number;
      optionPrice: number;
      theta: number;
      dailyDecay: number;
      totalDecay: number;
    }[] = [];
    let previousPrice = calculateOptionPrice(stockPrice, strikePrice, STARTING_DTE / 365, r, sigma, isCall);
    const initialPrice = previousPrice;

    for (let day = 0; day <= STARTING_DTE; day++) {
      const dte = STARTING_DTE - day;
      const tVal = dte / 365;
      let optionPrice: number;
      if (tVal <= 0) {
        optionPrice = isCall
          ? Math.max(0, stockPrice - strikePrice)
          : Math.max(0, strikePrice - stockPrice);
      } else {
        optionPrice = calculateOptionPrice(stockPrice, strikePrice, tVal, r, sigma, isCall);
      }
      const greeks = calculateGreeks(stockPrice, strikePrice, tVal, r, sigma, isCall);
      const dailyDecay = previousPrice - optionPrice;
      const totalDecay = initialPrice - optionPrice;
      days.push({ day, dte, optionPrice, theta: greeks.theta, dailyDecay, totalDecay });
      previousPrice = optionPrice;
    }
    return { days, initialPrice };
  }, [stockPrice, strikePrice, r, sigma, isCall]);

  const currentAnimData = animationData.days[animationDay] || animationData.days[0];

  // Animation timer
  useEffect(() => {
    if (isAnimating && animationDay < STARTING_DTE) {
      animationRef.current = setTimeout(() => {
        setAnimationDay((prev) => prev + 1);
      }, 120);
    } else if (animationDay >= STARTING_DTE) {
      setIsAnimating(false);
    }
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [isAnimating, animationDay]);

  const handlePlayPause = useCallback(() => {
    if (animationDay >= STARTING_DTE) {
      setAnimationDay(0);
      setIsAnimating(true);
    } else {
      setIsAnimating((prev) => !prev);
    }
  }, [animationDay]);

  const handleReset = useCallback(() => {
    setIsAnimating(false);
    setAnimationDay(0);
  }, []);

  // ─── Sensitivity analysis data ─────────────────────────────────────────────

  const sensitivityData = useMemo(() => {
    const currentPrice = calculateOptionPrice(stockPrice, strikePrice, T, r, sigma, isCall);
    const currentG = calcAllGreeks(stockPrice, strikePrice, T, r, sigma, isCall);

    const priceScenarios = [-10, -5, 0, 5, 10].map((pct) => {
      const newS = stockPrice * (1 + pct / 100);
      const optP = calculateOptionPrice(newS, strikePrice, T, r, sigma, isCall);
      const g = calcAllGreeks(newS, strikePrice, T, r, sigma, isCall);
      return {
        label: pct === 0 ? 'Current' : `${pct > 0 ? '+' : ''}${pct}%`,
        value: pct,
        detail: `$${newS.toFixed(0)}`,
        optionPrice: optP,
        pnl: optP - currentPrice,
        pnlPct: currentPrice > 0 ? ((optP - currentPrice) / currentPrice) * 100 : 0,
        ...g,
      };
    });

    const ivScenarios = [-10, -5, 0, 5, 10].map((ivDelta) => {
      const newIV = Math.max(5, iv + ivDelta) / 100;
      const optP = calculateOptionPrice(stockPrice, strikePrice, T, r, newIV, isCall);
      const g = calcAllGreeks(stockPrice, strikePrice, T, r, newIV, isCall);
      return {
        label: ivDelta === 0 ? 'Current' : `${ivDelta > 0 ? '+' : ''}${ivDelta}`,
        value: ivDelta,
        detail: `${Math.max(5, iv + ivDelta)}%`,
        optionPrice: optP,
        pnl: optP - currentPrice,
        pnlPct: currentPrice > 0 ? ((optP - currentPrice) / currentPrice) * 100 : 0,
        ...g,
      };
    });

    const timeScenarios = [0, 7, 14, 21, 28].map((daysLater) => {
      const newDTE = Math.max(1, daysToExpiry - daysLater);
      const newT = newDTE / 365;
      const optP = calculateOptionPrice(stockPrice, strikePrice, newT, r, sigma, isCall);
      const g = calcAllGreeks(stockPrice, strikePrice, newT, r, sigma, isCall);
      return {
        label: daysLater === 0 ? 'Today' : `+${daysLater}d`,
        value: daysLater,
        detail: `${newDTE} DTE`,
        optionPrice: optP,
        pnl: optP - currentPrice,
        pnlPct: currentPrice > 0 ? ((optP - currentPrice) / currentPrice) * 100 : 0,
        ...g,
      };
    });

    return { current: { price: currentPrice, ...currentG }, priceScenarios, ivScenarios, timeScenarios };
  }, [stockPrice, strikePrice, T, r, sigma, isCall, iv, daysToExpiry]);

  // ─── P&L Heatmap data ─────────────────────────────────────────────────────

  const heatmapData = useMemo(() => {
    const minP = strikePrice * 0.8;
    const maxP = strikePrice * 1.2;
    const priceStep = (maxP - minP) / (HEATMAP_ROWS - 1);
    const timeStep = Math.max(1, Math.floor(daysToExpiry / (HEATMAP_COLS - 1)));

    const prices: number[] = [];
    for (let i = 0; i < HEATMAP_ROWS; i++) {
      prices.push(Math.round((maxP - i * priceStep) * 100) / 100);
    }

    const times: number[] = [];
    for (let j = 0; j < HEATMAP_COLS; j++) {
      times.push(Math.max(1, daysToExpiry - j * timeStep));
    }

    const grid: number[][] = [];
    let minPnl = Infinity;
    let maxPnl = -Infinity;

    for (let i = 0; i < HEATMAP_ROWS; i++) {
      const row: number[] = [];
      for (let j = 0; j < HEATMAP_COLS; j++) {
        const tVal = times[j] / 365;
        const optP = calculateOptionPrice(prices[i], strikePrice, tVal, r, sigma, isCall);
        const pnl = optP - currentOptionPrice;
        row.push(pnl);
        if (pnl < minPnl) minPnl = pnl;
        if (pnl > maxPnl) maxPnl = pnl;
      }
      grid.push(row);
    }

    return { prices, times, grid, minPnl, maxPnl };
  }, [strikePrice, daysToExpiry, r, sigma, isCall, currentOptionPrice]);

  // ─── Input change handler with debounce ────────────────────────────────────

  const handleInputChange = useCallback((field: keyof Inputs, value: number | boolean) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ─── Chart helpers ──────────────────────────────────────────────────────────

  const getGreekRange = useCallback(
    (greek: ActiveGreek) => {
      const values = greekData.map((p) => p[greek]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const pad = (max - min) * 0.1 || 0.1;
      return { min: min - pad, max: max + pad };
    },
    [greekData],
  );

  // ─── Heatmap color ────────────────────────────────────────────────────────

  const getHeatmapColor = useCallback(
    (pnl: number): string => {
      const { minPnl, maxPnl } = heatmapData;
      if (pnl >= 0) {
        const intensity = maxPnl > 0 ? pnl / maxPnl : 0;
        const g = Math.round(80 + intensity * 175);
        return `rgba(0, ${g}, 20, 0.8)`;
      } else {
        const intensity = minPnl < 0 ? pnl / minPnl : 0;
        const rVal = Math.round(80 + intensity * 175);
        return `rgba(${rVal}, 0, 20, 0.8)`;
      }
    },
    [heatmapData],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── SVG Greek curve chart ─────────────────────────────────────────────────

  const renderGreekChart = useCallback(() => {
    const range = getGreekRange(activeGreek);
    const color = GREEK_COLORS[activeGreek];

    const scaleX = (price: number) => {
      const pMin = greekData[0]?.price || 0;
      const pMax = greekData[greekData.length - 1]?.price || 100;
      return SVG_PAD.left + ((price - pMin) / (pMax - pMin)) * PLOT_W;
    };
    const scaleY = (val: number) => {
      return SVG_PAD.top + PLOT_H - ((val - range.min) / (range.max - range.min)) * PLOT_H;
    };

    const pathD = greekData
      .map((pt, i) => `${i === 0 ? 'M' : 'L'}${scaleX(pt.price).toFixed(1)},${scaleY(pt[activeGreek]).toFixed(1)}`)
      .join(' ');

    // Current stock price marker
    const cx = scaleX(stockPrice);
    const cy = scaleY(currentGreeks[activeGreek]);

    // Strike line
    const strikeX = scaleX(strikePrice);

    // Y-axis labels
    const yLabels = [range.max, (range.max + range.min) / 2, range.min];

    // X-axis labels
    const pMin = greekData[0]?.price || 0;
    const pMax = greekData[greekData.length - 1]?.price || 100;

    return (
      <View style={styles.chartContainer}>
        <Svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          viewBox={`0 0 ${SVG_CHART_W} ${SVG_CHART_H}`}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = SVG_PAD.top + frac * PLOT_H;
            return (
              <Line
                key={`hg-${frac}`}
                x1={SVG_PAD.left}
                y1={y}
                x2={SVG_PAD.left + PLOT_W}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={0.5}
              />
            );
          })}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const x = SVG_PAD.left + frac * PLOT_W;
            return (
              <Line
                key={`vg-${frac}`}
                x1={x}
                y1={SVG_PAD.top}
                x2={x}
                y2={SVG_PAD.top + PLOT_H}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={0.5}
              />
            );
          })}

          {/* Zero line for theta */}
          {range.min < 0 && range.max > 0 && (
            <Line
              x1={SVG_PAD.left}
              y1={scaleY(0)}
              x2={SVG_PAD.left + PLOT_W}
              y2={scaleY(0)}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={0.5}
            />
          )}

          {/* Strike price line */}
          <Line
            x1={strikeX}
            y1={SVG_PAD.top}
            x2={strikeX}
            y2={SVG_PAD.top + PLOT_H}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={0.5}
            strokeDasharray="4,3"
          />

          {/* Curve */}
          <Path d={pathD} fill="none" stroke={color.main} strokeWidth={2} />

          {/* Current price marker */}
          <Circle cx={cx} cy={cy} r={5} fill={color.main} opacity={0.9} />
          <Circle cx={cx} cy={cy} r={8} fill="none" stroke={color.main} strokeWidth={1} opacity={0.4} />

          {/* Y-axis labels */}
          {yLabels.map((val, i) => (
            <SvgText
              key={`yl-${i}`}
              x={SVG_PAD.left - 5}
              y={SVG_PAD.top + (i / (yLabels.length - 1)) * PLOT_H + 3}
              textAnchor="end"
              fill="rgba(255,255,255,0.4)"
              fontSize={8}
              fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
            >
              {val.toFixed(activeGreek === 'gamma' ? 4 : 3)}
            </SvgText>
          ))}

          {/* X-axis labels */}
          <SvgText
            x={SVG_PAD.left}
            y={SVG_CHART_H - 3}
            textAnchor="start"
            fill="rgba(255,255,255,0.4)"
            fontSize={8}
            fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
          >
            ${pMin.toFixed(0)}
          </SvgText>
          <SvgText
            x={SVG_PAD.left + PLOT_W / 2}
            y={SVG_CHART_H - 3}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize={8}
            fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
          >
            K=${strikePrice}
          </SvgText>
          <SvgText
            x={SVG_PAD.left + PLOT_W}
            y={SVG_CHART_H - 3}
            textAnchor="end"
            fill="rgba(255,255,255,0.4)"
            fontSize={8}
            fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
          >
            ${pMax.toFixed(0)}
          </SvgText>
        </Svg>
        <Text style={styles.chartAxisTitle}>Stock Price</Text>
      </View>
    );
  }, [greekData, activeGreek, stockPrice, strikePrice, currentGreeks, getGreekRange]);

  // ─── Multi-Greek overlay chart ─────────────────────────────────────────────

  const renderMultiGreekChart = useCallback(() => {
    const greeks: ActiveGreek[] = ['delta', 'gamma', 'theta', 'vega'];
    const pMin = greekData[0]?.price || 0;
    const pMax = greekData[greekData.length - 1]?.price || 100;

    const scaleX = (price: number) => SVG_PAD.left + ((price - pMin) / (pMax - pMin)) * PLOT_W;

    // Normalize each Greek to 0..1 for overlay
    const normalizers: Record<string, (v: number) => number> = {};
    greeks.forEach((gk) => {
      const vals = greekData.map((p) => p[gk]);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const rng = max - min || 1;
      normalizers[gk] = (v: number) => SVG_PAD.top + PLOT_H - ((v - min) / rng) * PLOT_H;
    });

    const paths = greeks.map((gk) =>
      greekData
        .map(
          (pt, i) =>
            `${i === 0 ? 'M' : 'L'}${scaleX(pt.price).toFixed(1)},${normalizers[gk](pt[gk]).toFixed(1)}`,
        )
        .join(' '),
    );

    const strikeX = scaleX(strikePrice);

    return (
      <View style={styles.chartContainer}>
        <Svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          viewBox={`0 0 ${SVG_CHART_W} ${SVG_CHART_H}`}
        >
          {/* Grid */}
          {[0, 0.5, 1].map((frac) => {
            const y = SVG_PAD.top + frac * PLOT_H;
            return (
              <Line key={`mg-${frac}`} x1={SVG_PAD.left} y1={y} x2={SVG_PAD.left + PLOT_W} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
            );
          })}

          {/* Strike */}
          <Line x1={strikeX} y1={SVG_PAD.top} x2={strikeX} y2={SVG_PAD.top + PLOT_H} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} strokeDasharray="3,3" />

          {/* Curves */}
          {greeks.map((gk, idx) => (
            <Path key={gk} d={paths[idx]} fill="none" stroke={GREEK_COLORS[gk].main} strokeWidth={1.5} opacity={0.85} />
          ))}

          {/* Stock price vertical marker */}
          {(() => {
            const cx = scaleX(stockPrice);
            return (
              <Line x1={cx} y1={SVG_PAD.top} x2={cx} y2={SVG_PAD.top + PLOT_H} stroke="rgba(255,255,255,0.5)" strokeWidth={0.5} />
            );
          })()}

          {/* X-axis */}
          <SvgText x={SVG_PAD.left} y={SVG_CHART_H - 3} textAnchor="start" fill="rgba(255,255,255,0.4)" fontSize={8}>
            ${pMin.toFixed(0)}
          </SvgText>
          <SvgText x={SVG_PAD.left + PLOT_W} y={SVG_CHART_H - 3} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize={8}>
            ${pMax.toFixed(0)}
          </SvgText>
        </Svg>

        {/* Legend */}
        <View style={styles.legendRow}>
          {greeks.map((gk) => (
            <View key={gk} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: GREEK_COLORS[gk].main }]} />
              <Text style={[styles.legendText, { color: GREEK_COLORS[gk].main }]}>
                {GREEK_LABELS[gk].name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }, [greekData, stockPrice, strikePrice]);

  // ─── Time decay chart ──────────────────────────────────────────────────────

  const renderDecayChart = useCallback(() => {
    const days = animationData.days;
    const maxPrice = animationData.initialPrice;
    const scaleX = (day: number) => SVG_PAD.left + (day / STARTING_DTE) * PLOT_W;
    const scaleY = (price: number) =>
      SVG_PAD.top + PLOT_H - (price / (maxPrice * 1.1)) * PLOT_H;

    const pathD = days
      .filter((_, i) => i % 1 === 0)
      .map(
        (d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(d.day).toFixed(1)},${scaleY(d.optionPrice).toFixed(1)}`,
      )
      .join(' ');

    // Current animation marker
    const cx = scaleX(animationDay);
    const cy = scaleY(currentAnimData.optionPrice);

    return (
      <View style={styles.chartContainer}>
        <Svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          viewBox={`0 0 ${SVG_CHART_W} ${SVG_CHART_H}`}
        >
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = SVG_PAD.top + frac * PLOT_H;
            return (
              <Line key={`dg-${frac}`} x1={SVG_PAD.left} y1={y} x2={SVG_PAD.left + PLOT_W} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
            );
          })}

          {/* Curve */}
          <Path d={pathD} fill="none" stroke="#ff0099" strokeWidth={2} />

          {/* Marker */}
          <Circle cx={cx} cy={cy} r={5} fill="#ff0099" />
          <Circle cx={cx} cy={cy} r={8} fill="none" stroke="#ff0099" strokeWidth={1} opacity={0.4} />

          {/* Y-axis */}
          <SvgText x={SVG_PAD.left - 5} y={SVG_PAD.top + 4} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize={8}>
            ${(maxPrice * 1.1).toFixed(1)}
          </SvgText>
          <SvgText x={SVG_PAD.left - 5} y={SVG_PAD.top + PLOT_H + 4} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize={8}>
            $0
          </SvgText>

          {/* X-axis */}
          <SvgText x={SVG_PAD.left} y={SVG_CHART_H - 3} textAnchor="start" fill="rgba(255,255,255,0.4)" fontSize={8}>
            Day 0
          </SvgText>
          <SvgText x={SVG_PAD.left + PLOT_W / 2} y={SVG_CHART_H - 3} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={8}>
            Day {Math.round(STARTING_DTE / 2)}
          </SvgText>
          <SvgText x={SVG_PAD.left + PLOT_W} y={SVG_CHART_H - 3} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize={8}>
            Expiry
          </SvgText>
        </Svg>
      </View>
    );
  }, [animationData, animationDay, currentAnimData]);

  // ─── P&L Heatmap ──────────────────────────────────────────────────────────

  const renderHeatmap = useCallback(() => {
    const { prices, times, grid } = heatmapData;
    const cellW = (CHART_WIDTH - 40) / HEATMAP_COLS;
    const cellH = 28;
    const totalH = HEATMAP_ROWS * cellH + 30;
    const totalW = HEATMAP_COLS * cellW + 40;
    const offsetX = 40;
    const offsetY = 0;

    return (
      <View style={styles.chartContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Svg width={totalW} height={totalH}>
            {/* Column headers (DTE) */}
            {times.map((t, j) => (
              <SvgText
                key={`ch-${j}`}
                x={offsetX + j * cellW + cellW / 2}
                y={totalH - 5}
                textAnchor="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize={8}
                fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
              >
                {t}d
              </SvgText>
            ))}

            {/* Row headers (price) + cells */}
            {prices.map((price, i) => (
              <G key={`r-${i}`}>
                <SvgText
                  x={offsetX - 5}
                  y={offsetY + i * cellH + cellH / 2 + 3}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.5)"
                  fontSize={8}
                  fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
                >
                  ${price.toFixed(0)}
                </SvgText>
                {grid[i].map((pnl, j) => (
                  <G key={`c-${i}-${j}`}>
                    <Rect
                      x={offsetX + j * cellW}
                      y={offsetY + i * cellH}
                      width={cellW - 1}
                      height={cellH - 1}
                      fill={getHeatmapColor(pnl)}
                      rx={3}
                    />
                    <SvgText
                      x={offsetX + j * cellW + cellW / 2}
                      y={offsetY + i * cellH + cellH / 2 + 3}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.8)"
                      fontSize={7}
                      fontFamily={Platform.OS === 'ios' ? 'Menlo' : 'monospace'}
                    >
                      {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                    </SvgText>
                  </G>
                ))}
              </G>
            ))}
          </Svg>
        </ScrollView>
        <View style={styles.heatmapLegend}>
          <View style={styles.heatmapLegendItem}>
            <View style={[styles.heatmapLegendDot, { backgroundColor: 'rgba(255, 80, 20, 0.8)' }]} />
            <Text style={styles.heatmapLegendText}>Loss</Text>
          </View>
          <View style={styles.heatmapLegendItem}>
            <View style={[styles.heatmapLegendDot, { backgroundColor: 'rgba(0, 200, 20, 0.8)' }]} />
            <Text style={styles.heatmapLegendText}>Profit</Text>
          </View>
        </View>
        <Text style={styles.chartAxisTitle}>Days to Expiry</Text>
      </View>
    );
  }, [heatmapData, getHeatmapColor]);

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION RENDERERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Tab: Visualizer ───────────────────────────────────────────────────────

  const renderVisualizerTab = () => (
    <>
      {/* Greek Selector Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.greekTabsScroll}>
        <View style={styles.greekTabs}>
          {(['delta', 'gamma', 'theta', 'vega', 'rho'] as ActiveGreek[]).map((gk) => {
            const isActive = activeGreek === gk;
            const col = GREEK_COLORS[gk];
            return (
              <TouchableOpacity
                key={gk}
                style={[
                  styles.greekTab,
                  isActive && { backgroundColor: col.main + '18', borderColor: col.main },
                ]}
                onPress={() => setActiveGreek(gk)}
              >
                <Ionicons name={GREEK_ICONS[gk]} size={16} color={isActive ? col.main : colors.text.muted} />
                <Text style={[styles.greekTabLabel, isActive && { color: col.main }]}>
                  {GREEK_LABELS[gk].symbol} {GREEK_LABELS[gk].name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Current value card */}
      <View style={[styles.valueCard, { borderColor: GREEK_COLORS[activeGreek].main }]}>
        <View style={styles.valueCardHeader}>
          <Ionicons name={GREEK_ICONS[activeGreek]} size={22} color={GREEK_COLORS[activeGreek].main} />
          <Text style={[styles.valueCardTitle, { color: GREEK_COLORS[activeGreek].main }]}>
            {GREEK_LABELS[activeGreek].name} ({GREEK_LABELS[activeGreek].symbol})
          </Text>
        </View>
        <Text style={[styles.valueCardNumber, { color: GREEK_COLORS[activeGreek].main }]}>
          {formatGreek(activeGreek, currentGreeks[activeGreek])}
        </Text>
        <Text style={styles.valueCardDesc}>{GREEK_LABELS[activeGreek].short}</Text>
      </View>

      {/* Main chart */}
      <View style={styles.sectionCard}>
        <Text style={[styles.cardTitle, { color: GREEK_COLORS[activeGreek].main }]}>
          {GREEK_LABELS[activeGreek].name} vs Stock Price
        </Text>
        {renderGreekChart()}
      </View>

      {/* Option type toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Option Type</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, isCall && styles.toggleBtnActiveCall]}
            onPress={() => handleInputChange('isCall', true)}
          >
            <Ionicons name="trending-up" size={16} color={isCall ? colors.neon.green : colors.text.muted} />
            <Text style={[styles.toggleBtnText, isCall && styles.toggleBtnTextActiveCall]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isCall && styles.toggleBtnActivePut]}
            onPress={() => handleInputChange('isCall', false)}
          >
            <Ionicons name="trending-down" size={16} color={!isCall ? colors.neon.pink : colors.text.muted} />
            <Text style={[styles.toggleBtnText, !isCall && styles.toggleBtnTextActivePut]}>Put</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sliders */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardTitle}>Parameters</Text>

        {/* Stock Price */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Stock Price</Text>
            <Text style={[styles.sliderValue, { color: colors.neon.green }]}>${stockPrice.toFixed(2)}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={Math.max(1, strikePrice * 0.7)}
            maximumValue={strikePrice * 1.3}
            step={0.5}
            value={stockPrice}
            onValueChange={(v) => handleInputChange('stockPrice', v)}
            minimumTrackTintColor={colors.neon.green}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.neon.green}
          />
          <View style={styles.sliderRange}>
            <Text style={styles.sliderRangeText}>${(strikePrice * 0.7).toFixed(0)}</Text>
            <Text style={styles.sliderRangeText}>${(strikePrice * 1.3).toFixed(0)}</Text>
          </View>
        </View>

        {/* Strike Price */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Strike Price</Text>
            <Text style={[styles.sliderValue, { color: colors.neon.cyan }]}>${strikePrice}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={500}
            step={5}
            value={strikePrice}
            onValueChange={(v) => handleInputChange('strikePrice', v)}
            minimumTrackTintColor={colors.neon.cyan}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.neon.cyan}
          />
          <View style={styles.sliderRange}>
            <Text style={styles.sliderRangeText}>$10</Text>
            <Text style={styles.sliderRangeText}>$500</Text>
          </View>
        </View>

        {/* Implied Volatility */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Implied Volatility</Text>
            <Text style={[styles.sliderValue, { color: colors.neon.purple }]}>{iv}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={150}
            step={1}
            value={iv}
            onValueChange={(v) => handleInputChange('iv', v)}
            minimumTrackTintColor={colors.neon.purple}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.neon.purple}
          />
          <View style={styles.sliderRange}>
            <Text style={styles.sliderRangeText}>5%</Text>
            <Text style={styles.sliderRangeText}>150%</Text>
          </View>
        </View>

        {/* Days to Expiry */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Days to Expiry</Text>
            <Text style={[styles.sliderValue, { color: colors.neon.orange }]}>{daysToExpiry}D</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={365}
            step={1}
            value={daysToExpiry}
            onValueChange={(v) => handleInputChange('daysToExpiry', v)}
            minimumTrackTintColor={colors.neon.orange}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.neon.orange}
          />
          <View style={styles.sliderRange}>
            <Text style={styles.sliderRangeText}>1</Text>
            <Text style={styles.sliderRangeText}>365</Text>
          </View>
        </View>

        {/* Risk-Free Rate */}
        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Risk-Free Rate</Text>
            <Text style={[styles.sliderValue, { color: colors.text.secondary }]}>{riskFreeRate}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={0.25}
            value={riskFreeRate}
            onValueChange={(v) => handleInputChange('riskFreeRate', v)}
            minimumTrackTintColor={colors.text.muted}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.text.secondary}
          />
          <View style={styles.sliderRange}>
            <Text style={styles.sliderRangeText}>0%</Text>
            <Text style={styles.sliderRangeText}>10%</Text>
          </View>
        </View>

        {/* Reset button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setInputs(DEFAULT_INPUTS)}
        >
          <Ionicons name="refresh" size={14} color={colors.text.muted} />
          <Text style={styles.resetButtonText}>Reset Defaults</Text>
        </TouchableOpacity>
      </View>

      {/* All Greeks Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>All Greeks Summary</Text>
        <View style={styles.greeksSummaryGrid}>
          {(['delta', 'gamma', 'theta', 'vega', 'rho'] as ActiveGreek[]).map((gk) => (
            <TouchableOpacity
              key={gk}
              style={[styles.greekSummaryCard, { borderColor: GREEK_COLORS[gk].main + '30' }]}
              onPress={() => setActiveGreek(gk)}
            >
              <Ionicons name={GREEK_ICONS[gk]} size={18} color={GREEK_COLORS[gk].main} />
              <Text style={[styles.greekSummarySymbol, { color: GREEK_COLORS[gk].main }]}>
                {GREEK_LABELS[gk].symbol}
              </Text>
              <Text style={styles.greekSummaryValue}>
                {formatGreek(gk, currentGreeks[gk])}
              </Text>
              <Text style={styles.greekSummaryName}>{GREEK_LABELS[gk].name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Option Price */}
      <View style={[styles.sectionCard, { borderColor: colors.neon.green + '30' }]}>
        <View style={styles.optionPriceRow}>
          <View>
            <Text style={styles.optionPriceLabel}>Option Price (B-S)</Text>
            <Text style={styles.optionPriceValue}>${currentOptionPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.optionPriceMeta}>
            <Text style={styles.optionPriceMetaText}>
              {isCall ? 'Call' : 'Put'} | ${stockPrice.toFixed(0)} | K=${strikePrice} | {daysToExpiry}d
            </Text>
            <Text style={[styles.optionPriceMetaText, { color: colors.text.muted }]}>
              IV: {iv}% | Rate: {riskFreeRate}%
            </Text>
          </View>
        </View>
      </View>

      {/* Multi-Greek overlay */}
      <View style={styles.sectionCard}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="analytics" size={18} color={colors.neon.purple} />
          <Text style={[styles.cardTitle, { color: colors.neon.purple }]}>Greeks Overlay</Text>
        </View>
        <Text style={styles.cardSubtitle}>All Greeks normalized across price range</Text>
        {renderMultiGreekChart()}
      </View>

      {/* Key Insight */}
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Ionicons name="flash" size={14} color={colors.neon.pink} />
          <Text style={styles.insightTitle}>Key Insight</Text>
        </View>
        <Text style={styles.insightText}>
          High Gamma usually means high Theta burn. It is the price you pay for the explosive
          potential. The Greeks are interconnected — mastering them means understanding their
          relationships.
        </Text>
      </View>
    </>
  );

  // ─── Tab: Time Decay ───────────────────────────────────────────────────────

  const renderDecayTab = () => (
    <>
      {/* Theta Decay Playback */}
      <View style={[styles.sectionCard, { borderColor: '#ff990030' }]}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="timer-outline" size={18} color="#ff9900" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: '#ff9900' }]}>Theta Decay Playback</Text>
            <Text style={styles.cardSubtitle}>Watch option value erode day by day</Text>
          </View>
        </View>

        {/* Playback controls */}
        <View style={styles.playbackRow}>
          <TouchableOpacity style={styles.playbackBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.playbackBtn, { backgroundColor: '#ff990020', borderColor: '#ff990050' }]}
            onPress={handlePlayPause}
          >
            <Ionicons
              name={isAnimating ? 'pause' : 'play'}
              size={18}
              color="#ff9900"
            />
          </TouchableOpacity>
          <Text style={styles.playbackDayText}>
            Day {animationDay} / {STARTING_DTE}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(animationDay / STARTING_DTE) * 100}%` },
            ]}
          />
        </View>

        {/* Decay chart */}
        {renderDecayChart()}

        {/* Stats row */}
        <View style={styles.decayStatsRow}>
          <View style={styles.decayStat}>
            <Text style={styles.decayStatLabel}>Starting</Text>
            <Text style={styles.decayStatValue}>${animationData.initialPrice.toFixed(2)}</Text>
          </View>
          <View style={[styles.decayStat, { borderColor: '#ff990030' }]}>
            <Text style={[styles.decayStatLabel, { color: '#ff9900' }]}>Current</Text>
            <Text style={[styles.decayStatValueLg, { color: '#ff9900' }]}>
              ${currentAnimData.optionPrice.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.decayStat, { borderColor: colors.neon.red + '30' }]}>
            <Text style={[styles.decayStatLabel, { color: colors.neon.red }]}>Decay</Text>
            <Text style={[styles.decayStatValue, { color: colors.neon.red }]}>
              -${currentAnimData.totalDecay.toFixed(2)}
            </Text>
            <Text style={[styles.decayStatPct, { color: colors.neon.red }]}>
              ({animationData.initialPrice > 0
                ? ((currentAnimData.totalDecay / animationData.initialPrice) * 100).toFixed(1)
                : 0}%)
            </Text>
          </View>
        </View>

        {/* Visual value bar */}
        <View style={styles.valueBarContainer}>
          <View
            style={[
              styles.valueBarFill,
              {
                width: `${Math.max(
                  0,
                  animationData.initialPrice > 0
                    ? (currentAnimData.optionPrice / animationData.initialPrice) * 100
                    : 0,
                )}%`,
              },
            ]}
          />
          {currentAnimData.dte === 0 && currentAnimData.optionPrice === 0 && (
            <View style={styles.valueBarExpired}>
              <Text style={styles.valueBarExpiredText}>EXPIRED WORTHLESS</Text>
            </View>
          )}
        </View>

        {/* Daily stats */}
        <View style={styles.dailyStatsRow}>
          <View>
            <Text style={styles.dailyStatsLabel}>Today's Decay</Text>
            <Text style={[styles.dailyStatsValue, { color: colors.neon.red }]}>
              -${currentAnimData.dailyDecay.toFixed(4)}
            </Text>
          </View>
          <View>
            <Text style={styles.dailyStatsLabel}>Theta ($/day)</Text>
            <Text style={[styles.dailyStatsValue, { color: colors.neon.pink }]}>
              {currentAnimData.theta.toFixed(4)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.dailyStatsLabel}>DTE</Text>
            <Text
              style={[
                styles.dailyStatsDTE,
                currentAnimData.dte <= 7
                  ? { color: colors.neon.red }
                  : currentAnimData.dte <= 21
                  ? { color: '#ff9900' }
                  : { color: colors.text.primary },
              ]}
            >
              {currentAnimData.dte}
            </Text>
          </View>
        </View>

        {/* Warning zones */}
        {currentAnimData.dte <= 7 && currentAnimData.dte > 0 && (
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={16} color={colors.neon.red} />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningTitle}>Gamma Risk Zone</Text>
              <Text style={styles.warningText}>
                Theta decay is accelerating rapidly. P&L can swing wildly.
              </Text>
            </View>
          </View>
        )}

        {currentAnimData.dte === 0 && (
          <View style={[styles.warningBox, { borderColor: currentAnimData.optionPrice > 0 ? colors.neon.green + '30' : colors.neon.red + '30' }]}>
            <Ionicons
              name={currentAnimData.optionPrice > 0 ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={currentAnimData.optionPrice > 0 ? colors.neon.green : colors.neon.red}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.warningTitle, { color: currentAnimData.optionPrice > 0 ? colors.neon.green : colors.neon.red }]}>
                EXPIRATION DAY
              </Text>
              <Text style={styles.warningText}>
                {currentAnimData.optionPrice === 0
                  ? 'Option expired worthless. 100% of premium lost to theta decay.'
                  : `Option expired ITM with $${currentAnimData.optionPrice.toFixed(2)} intrinsic value.`}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Time decay slider for manual exploration */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardTitle}>Time Decay Slider</Text>
        <Text style={styles.cardSubtitle}>Manually scrub through time to see Greeks change</Text>

        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Days to Expiry</Text>
            <Text style={[styles.sliderValue, { color: colors.neon.orange }]}>{daysToExpiry}D</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={180}
            step={1}
            value={daysToExpiry}
            onValueChange={(v) => handleInputChange('daysToExpiry', v)}
            minimumTrackTintColor={colors.neon.orange}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.neon.orange}
          />
        </View>

        {/* Show all Greeks at current DTE */}
        <View style={styles.greeksSummaryGrid}>
          {(['delta', 'gamma', 'theta', 'vega'] as ActiveGreek[]).map((gk) => (
            <View key={gk} style={[styles.greekSummaryCard, { borderColor: GREEK_COLORS[gk].main + '30' }]}>
              <Ionicons name={GREEK_ICONS[gk]} size={16} color={GREEK_COLORS[gk].main} />
              <Text style={[styles.greekSummarySymbol, { color: GREEK_COLORS[gk].main }]}>
                {GREEK_LABELS[gk].name}
              </Text>
              <Text style={styles.greekSummaryValue}>{formatGreek(gk, currentGreeks[gk])}</Text>
            </View>
          ))}
        </View>

        <View style={styles.optionPriceRow}>
          <View>
            <Text style={styles.optionPriceLabel}>Option Price</Text>
            <Text style={styles.optionPriceValue}>${currentOptionPrice.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </>
  );

  // ─── Tab: Sensitivity / What-If ────────────────────────────────────────────

  const renderSensitivityTab = () => {
    const scenarios =
      sensitivityMode === 'price'
        ? sensitivityData.priceScenarios
        : sensitivityMode === 'iv'
        ? sensitivityData.ivScenarios
        : sensitivityData.timeScenarios;

    return (
      <>
        {/* Current position */}
        <View style={styles.sectionCard}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="flask" size={18} color={colors.neon.cyan} />
            <Text style={[styles.cardTitle, { color: colors.neon.cyan }]}>What-If Scenarios</Text>
          </View>
          <Text style={styles.cardSubtitle}>See how Greeks and P&L change under different conditions</Text>

          <View style={styles.currentPositionRow}>
            <View>
              <Text style={styles.currentPosLabel}>Option Value</Text>
              <Text style={styles.currentPosValue}>${sensitivityData.current.price.toFixed(2)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.currentPosLabel}>Position</Text>
              <Text style={styles.currentPosDetail}>
                ${stockPrice.toFixed(0)} | {iv}% IV | {daysToExpiry}d
              </Text>
            </View>
          </View>
        </View>

        {/* Mode selector */}
        <View style={styles.sensitivityModeRow}>
          {(['price', 'iv', 'time'] as SensitivityMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.sensitivityModeBtn,
                sensitivityMode === mode && styles.sensitivityModeBtnActive,
              ]}
              onPress={() => setSensitivityMode(mode)}
            >
              <Text
                style={[
                  styles.sensitivityModeBtnText,
                  sensitivityMode === mode && styles.sensitivityModeBtnTextActive,
                ]}
              >
                {mode === 'price' ? 'Stock Price' : mode === 'iv' ? 'Volatility' : 'Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Scenario table */}
        <View style={styles.sectionCard}>
          {/* Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Scenario</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Price</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>P&L</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>{'\u0394'}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>{'\u0393'}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>{'\u0398'}</Text>
          </View>

          {/* Rows */}
          {scenarios.map((s, idx) => {
            const isCurrent = s.value === 0;
            const isPositive = s.pnl > 0;
            const isNegative = s.pnl < 0;
            return (
              <View
                key={idx}
                style={[styles.tableRow, isCurrent && styles.tableRowCurrent]}
              >
                <View style={[styles.tableCell, { flex: 1.2 }]}>
                  <Text
                    style={[
                      styles.tableCellText,
                      isCurrent && { color: colors.neon.cyan, fontWeight: '700' as any },
                    ]}
                  >
                    {s.label}
                  </Text>
                  <Text style={styles.tableCellSub}>{s.detail}</Text>
                </View>
                <Text style={[styles.tableCell, styles.tableCellText, { flex: 1 }]}>
                  ${s.optionPrice.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.tableCellText,
                    { flex: 1 },
                    isCurrent
                      ? { color: colors.text.muted }
                      : isPositive
                      ? { color: colors.neon.green }
                      : isNegative
                      ? { color: colors.neon.red }
                      : { color: colors.text.muted },
                  ]}
                >
                  {isCurrent ? '-' : `${isPositive ? '+' : ''}$${s.pnl.toFixed(2)}`}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellTextMono, { flex: 0.8, color: GREEK_COLORS.delta.main }]}>
                  {s.delta.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellTextMono, { flex: 0.8, color: GREEK_COLORS.gamma.main }]}>
                  {s.gamma.toFixed(3)}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellTextMono, { flex: 0.8, color: GREEK_COLORS.theta.main }]}>
                  {s.theta.toFixed(3)}
                </Text>
              </View>
            );
          })}

          {/* Insight */}
          <View style={[styles.insightCard, { marginTop: spacing.md }]}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb" size={14} color={colors.neon.cyan} />
              <Text style={[styles.insightTitle, { color: colors.neon.cyan }]}>Analysis</Text>
            </View>
            <Text style={styles.insightText}>
              {sensitivityMode === 'price'
                ? `A ${isCall ? 'call' : 'put'} option ${isCall ? 'gains' : 'loses'} value as stock ${isCall ? 'rises' : 'falls'}. Notice how Delta ${isCall ? 'increases' : 'becomes more negative'} as the option moves ITM, while Gamma peaks near ATM.`
                : sensitivityMode === 'iv'
                ? `Long options are long Vega — they benefit when IV rises. An IV crush hurts option value even if the stock moves favorably. Current Vega: $${sensitivityData.current.vega.toFixed(2)} per 1% IV change.`
                : `Time decay (Theta) accelerates as expiration approaches. Notice how options lose value faster in later weeks. Current daily decay: $${Math.abs(sensitivityData.current.theta).toFixed(4)}.`}
            </Text>
          </View>
        </View>

        {/* What-if adjusters */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Adjust Parameters</Text>
          <Text style={styles.cardSubtitle}>Change any input and all scenarios update in real-time</Text>

          <View style={styles.sliderGroup}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderLabel}>Stock Price</Text>
              <Text style={[styles.sliderValue, { color: colors.neon.green }]}>${stockPrice.toFixed(0)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={Math.max(1, strikePrice * 0.5)}
              maximumValue={strikePrice * 1.5}
              step={1}
              value={stockPrice}
              onValueChange={(v) => handleInputChange('stockPrice', v)}
              minimumTrackTintColor={colors.neon.green}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.green}
            />
          </View>

          <View style={styles.sliderGroup}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderLabel}>IV</Text>
              <Text style={[styles.sliderValue, { color: colors.neon.purple }]}>{iv}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={150}
              step={1}
              value={iv}
              onValueChange={(v) => handleInputChange('iv', v)}
              minimumTrackTintColor={colors.neon.purple}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.purple}
            />
          </View>

          <View style={styles.sliderGroup}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderLabel}>Days to Expiry</Text>
              <Text style={[styles.sliderValue, { color: colors.neon.orange }]}>{daysToExpiry}D</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={365}
              step={1}
              value={daysToExpiry}
              onValueChange={(v) => handleInputChange('daysToExpiry', v)}
              minimumTrackTintColor={colors.neon.orange}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.orange}
            />
          </View>
        </View>
      </>
    );
  };

  // ─── Tab: Heatmap ──────────────────────────────────────────────────────────

  const renderHeatmapTab = () => (
    <>
      <View style={styles.sectionCard}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="grid" size={18} color={colors.neon.yellow} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: colors.neon.yellow }]}>P&L Heatmap</Text>
            <Text style={styles.cardSubtitle}>
              Color-coded grid: Stock Price (rows) x DTE (columns)
            </Text>
          </View>
        </View>

        <View style={styles.heatmapInfo}>
          <Text style={styles.heatmapInfoText}>
            Base: ${currentOptionPrice.toFixed(2)} ({isCall ? 'Call' : 'Put'} at K=${strikePrice})
          </Text>
        </View>

        {renderHeatmap()}
      </View>

      {/* Heatmap controls */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardTitle}>Adjust Heatmap</Text>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, isCall && styles.toggleBtnActiveCall]}
            onPress={() => handleInputChange('isCall', true)}
          >
            <Text style={[styles.toggleBtnText, isCall && styles.toggleBtnTextActiveCall]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isCall && styles.toggleBtnActivePut]}
            onPress={() => handleInputChange('isCall', false)}
          >
            <Text style={[styles.toggleBtnText, !isCall && styles.toggleBtnTextActivePut]}>Put</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Strike Price</Text>
            <Text style={[styles.sliderValue, { color: colors.neon.cyan }]}>${strikePrice}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={500}
            step={5}
            value={strikePrice}
            onValueChange={(v) => handleInputChange('strikePrice', v)}
            minimumTrackTintColor={colors.neon.cyan}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.neon.cyan}
          />
        </View>

        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>IV</Text>
            <Text style={[styles.sliderValue, { color: colors.neon.purple }]}>{iv}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={150}
            step={1}
            value={iv}
            onValueChange={(v) => handleInputChange('iv', v)}
            minimumTrackTintColor={colors.neon.purple}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.neon.purple}
          />
        </View>

        <View style={styles.sliderGroup}>
          <View style={styles.sliderLabelRow}>
            <Text style={styles.sliderLabel}>Days to Expiry</Text>
            <Text style={[styles.sliderValue, { color: colors.neon.orange }]}>{daysToExpiry}D</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={7}
            maximumValue={180}
            step={1}
            value={daysToExpiry}
            onValueChange={(v) => handleInputChange('daysToExpiry', v)}
            minimumTrackTintColor={colors.neon.orange}
            maximumTrackTintColor={colors.background.tertiary}
            thumbTintColor={colors.neon.orange}
          />
        </View>
      </View>

      {/* Greeks sensitivity at different prices */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardTitle}>Greeks at Different Prices</Text>
        <Text style={styles.cardSubtitle}>How each Greek changes across the price range</Text>

        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Price</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>{'\u0394'}</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>{'\u0393'}</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>{'\u0398'}</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>{'\u03BD'}</Text>
        </View>

        {[-15, -10, -5, 0, 5, 10, 15].map((pctDiff) => {
          const testPrice = strikePrice * (1 + pctDiff / 100);
          const g = calcAllGreeks(testPrice, strikePrice, T, r, sigma, isCall);
          const isCurrent = pctDiff === 0;
          return (
            <View key={pctDiff} style={[styles.tableRow, isCurrent && styles.tableRowCurrent]}>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text style={[styles.tableCellText, isCurrent && { color: colors.neon.cyan }]}>
                  ${testPrice.toFixed(0)}
                </Text>
                <Text style={styles.tableCellSub}>
                  {pctDiff === 0 ? 'ATM' : pctDiff > 0 ? `+${pctDiff}%` : `${pctDiff}%`}
                </Text>
              </View>
              <Text style={[styles.tableCell, styles.tableCellTextMono, { flex: 0.8, color: GREEK_COLORS.delta.main }]}>
                {g.delta.toFixed(3)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellTextMono, { flex: 0.8, color: GREEK_COLORS.gamma.main }]}>
                {g.gamma.toFixed(4)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellTextMono, { flex: 0.8, color: GREEK_COLORS.theta.main }]}>
                {g.theta.toFixed(4)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellTextMono, { flex: 0.8, color: GREEK_COLORS.vega.main }]}>
                {g.vega.toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );

  // ─── Tab: Learn ────────────────────────────────────────────────────────────

  const renderLearnTab = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Greeks Education Cards</Text>
        <Text style={[styles.cardSubtitle, { marginBottom: spacing.md }]}>
          Tap to expand each Greek for detailed explanations
        </Text>

        {(['delta', 'gamma', 'theta', 'vega', 'rho'] as ActiveGreek[]).map((gk) => {
          const edu = GREEK_EDUCATION[gk];
          const isExpanded = expandedGreek === gk;
          const col = GREEK_COLORS[gk];

          return (
            <TouchableOpacity
              key={gk}
              style={[styles.educationCard, { borderColor: col.main + '25' }]}
              onPress={() => setExpandedGreek(isExpanded ? null : gk)}
              activeOpacity={0.8}
            >
              {/* Header */}
              <View style={styles.educationCardHeader}>
                <View style={[styles.educationIconBox, { backgroundColor: col.main + '15', borderColor: col.main + '30' }]}>
                  <Ionicons name={GREEK_ICONS[gk]} size={20} color={col.main} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.educationTitle, { color: col.main }]}>{edu.title}</Text>
                  <Text style={styles.educationSubtitle}>
                    {GREEK_LABELS[gk].symbol} = {GREEK_LABELS[gk].short}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.text.muted}
                />
              </View>

              {/* Current value pill */}
              <View style={[styles.educationValuePill, { backgroundColor: col.main + '12' }]}>
                <Text style={[styles.educationValueText, { color: col.main }]}>
                  Current: {formatGreek(gk, currentGreeks[gk])}
                </Text>
              </View>

              {/* Expandable content */}
              {isExpanded && (
                <View style={styles.educationContent}>
                  {edu.bullets.map((bullet, i) => (
                    <View key={i} style={styles.educationBulletRow}>
                      <Text style={[styles.educationBulletDot, { color: col.main }]}>
                        {'\u2022'}
                      </Text>
                      <Text style={styles.educationBulletText}>{bullet}</Text>
                    </View>
                  ))}

                  <View style={[styles.educationInsightBox, { borderColor: col.main + '20' }]}>
                    <Ionicons name="bulb" size={14} color={col.main} />
                    <Text style={styles.educationInsightText}>{edu.insight}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Tips */}
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Ionicons name="information-circle" size={16} color={colors.neon.green} />
          <Text style={[styles.insightTitle, { color: colors.neon.green }]}>Pro Tips</Text>
        </View>
        <Text style={styles.tipLine}>
          <Text style={{ color: colors.neon.green }}>Delta</Text>: 0.50 delta = $0.50 move per $1 stock move. Also approximates ITM probability.
        </Text>
        <Text style={styles.tipLine}>
          <Text style={{ color: colors.neon.cyan }}>Gamma</Text>: Highest at-the-money and near expiration. High gamma = your delta changes fast.
        </Text>
        <Text style={styles.tipLine}>
          <Text style={{ color: colors.neon.pink }}>Theta</Text>: Accelerates as expiration nears. The last 30 days are the steepest decay zone.
        </Text>
        <Text style={styles.tipLine}>
          <Text style={{ color: colors.neon.yellow }}>Vega</Text>: Long options = long vega. IV crush after earnings can devastate option values.
        </Text>
        <Text style={styles.tipLine}>
          <Text style={{ color: colors.neon.orange }}>Rho</Text>: Usually minor, but matters for LEAPS in a changing interest rate environment.
        </Text>
      </View>

      {/* Greek Relationships */}
      <View style={[styles.sectionCard, { borderColor: colors.neon.purple + '25' }]}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="git-network-outline" size={18} color={colors.neon.purple} />
          <Text style={[styles.cardTitle, { color: colors.neon.purple }]}>Greek Relationships</Text>
        </View>

        <View style={styles.relationshipItem}>
          <Text style={styles.relationshipTitle}>Gamma-Theta Trade-off</Text>
          <Text style={styles.relationshipDesc}>
            High gamma positions (ATM near expiry) also have the highest theta. You pay time decay for the potential of explosive delta moves.
          </Text>
        </View>

        <View style={styles.relationshipItem}>
          <Text style={styles.relationshipTitle}>Vega-Time Relationship</Text>
          <Text style={styles.relationshipDesc}>
            Longer-dated options have higher vega. As expiration nears, vega decreases and theta dominates the option's behavior.
          </Text>
        </View>

        <View style={styles.relationshipItem}>
          <Text style={styles.relationshipTitle}>Delta-Gamma Connection</Text>
          <Text style={styles.relationshipDesc}>
            Gamma tells you how fast delta changes. A 0.50 delta with high gamma can quickly become 0.70 delta after a small stock move.
          </Text>
        </View>
      </View>
    </>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Greeks Visualizer</Text>
          <Text style={styles.headerSubtitle}>Interactive option sensitivities</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
          {TAB_CONFIG.map((tab) => {
            const isActive = mainTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setMainTab(tab.key)}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={isActive ? colors.neon.green : colors.text.muted}
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mainTab === 'visualizer' && renderVisualizerTab()}
        {mainTab === 'decay' && renderDecayTab()}
        {mainTab === 'sensitivity' && renderSensitivityTab()}
        {mainTab === 'heatmap' && renderHeatmapTab()}
        {mainTab === 'learn' && renderLearnTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // ─── Header ──────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },

  // ─── Tab bar ─────────────────────────────────────────────────────
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  tabBarContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.neon.green,
  },
  tabLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontWeight: typography.weights.medium,
  },
  tabLabelActive: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },

  // ─── Scroll ──────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'] + 20,
    paddingTop: spacing.md,
  },

  // ─── Greek Tabs ──────────────────────────────────────────────────
  greekTabsScroll: {
    marginBottom: spacing.md,
  },
  greekTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  greekTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: 6,
  },
  greekTabLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontWeight: typography.weights.semibold,
  },

  // ─── Value Card ──────────────────────────────────────────────────
  valueCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  valueCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  valueCardTitle: {
    ...typography.styles.h5,
  },
  valueCardNumber: {
    fontSize: 44,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fonts.monoBold,
    marginBottom: spacing.xs,
  },
  valueCardDesc: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // ─── Sections ────────────────────────────────────────────────────
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cardTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
    fontSize: 15,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },

  // ─── Charts ──────────────────────────────────────────────────────
  chartContainer: {
    marginVertical: spacing.sm,
    alignItems: 'center',
  },
  chartAxisTitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // ─── Legend ──────────────────────────────────────────────────────
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },

  // ─── Toggle ──────────────────────────────────────────────────────
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: 6,
  },
  toggleBtnActiveCall: {
    backgroundColor: colors.neon.green + '15',
    borderColor: colors.neon.green,
  },
  toggleBtnActivePut: {
    backgroundColor: colors.neon.pink + '15',
    borderColor: colors.neon.pink,
  },
  toggleBtnText: {
    ...typography.styles.body,
    color: colors.text.muted,
  },
  toggleBtnTextActiveCall: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },
  toggleBtnTextActivePut: {
    color: colors.neon.pink,
    fontWeight: typography.weights.semibold,
  },

  // ─── Sliders ─────────────────────────────────────────────────────
  sliderGroup: {
    marginTop: spacing.md,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  sliderLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  sliderValue: {
    fontFamily: typography.fonts.monoBold,
    fontSize: 16,
    fontWeight: typography.weights.bold,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  sliderRangeText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 9,
  },

  // ─── Reset button ────────────────────────────────────────────────
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: 6,
  },
  resetButtonText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontWeight: typography.weights.medium,
  },

  // ─── Greeks Summary Grid ─────────────────────────────────────────
  greeksSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  greekSummaryCard: {
    width: (SCREEN_WIDTH - CHART_PADDING - spacing.sm * 3) / 3,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1,
    gap: 2,
  },
  greekSummarySymbol: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
  },
  greekSummaryValue: {
    ...typography.styles.mono,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
    fontSize: 13,
  },
  greekSummaryName: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 9,
  },

  // ─── Option Price ────────────────────────────────────────────────
  optionPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  optionPriceLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  optionPriceValue: {
    fontSize: 24,
    fontFamily: typography.fonts.monoBold,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  optionPriceMeta: {
    alignItems: 'flex-end',
  },
  optionPriceMetaText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },

  // ─── Insight Card ────────────────────────────────────────────────
  insightCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neon.pink + '20',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  insightTitle: {
    ...typography.styles.caption,
    color: colors.neon.pink,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 10,
  },
  insightText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  tipLine: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginTop: spacing.xs,
  },

  // ─── Playback Controls ───────────────────────────────────────────
  playbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  playbackBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playbackDayText: {
    ...typography.styles.mono,
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: spacing.sm,
  },

  // ─── Progress Bar ────────────────────────────────────────────────
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#ff9900',
  },

  // ─── Decay Stats ────────────────────────────────────────────────
  decayStatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  decayStat: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  decayStatLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 9,
    marginBottom: 2,
  },
  decayStatValue: {
    fontFamily: typography.fonts.monoBold,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  decayStatValueLg: {
    fontFamily: typography.fonts.monoBold,
    fontSize: 18,
    fontWeight: typography.weights.bold,
  },
  decayStatPct: {
    ...typography.styles.caption,
    fontSize: 9,
  },

  // ─── Value Bar ──────────────────────────────────────────────────
  valueBarContainer: {
    height: 40,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.md,
    position: 'relative',
  },
  valueBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: borderRadius.md,
    backgroundColor: '#ff9900',
    opacity: 0.7,
  },
  valueBarExpired: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
  },
  valueBarExpiredText: {
    fontFamily: typography.fonts.monoBold,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.neon.red,
    letterSpacing: 2,
  },

  // ─── Daily Stats ────────────────────────────────────────────────
  dailyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  dailyStatsLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textTransform: 'uppercase',
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dailyStatsValue: {
    fontFamily: typography.fonts.mono,
    fontSize: 14,
    fontWeight: typography.weights.semibold,
  },
  dailyStatsDTE: {
    fontFamily: typography.fonts.monoBold,
    fontSize: 28,
    fontWeight: typography.weights.bold,
  },

  // ─── Warning Box ────────────────────────────────────────────────
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.md,
    backgroundColor: 'rgba(255, 0, 0, 0.06)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neon.red + '25',
  },
  warningTitle: {
    fontFamily: typography.fonts.monoBold,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: colors.neon.red,
    marginBottom: 2,
  },
  warningText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    lineHeight: 16,
  },

  // ─── Sensitivity Mode ───────────────────────────────────────────
  sensitivityModeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sensitivityModeBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  sensitivityModeBtnActive: {
    backgroundColor: colors.neon.cyan + '15',
    borderColor: colors.neon.cyan,
  },
  sensitivityModeBtnText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  sensitivityModeBtnTextActive: {
    color: colors.neon.cyan,
  },

  // ─── Current Position ───────────────────────────────────────────
  currentPositionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginTop: spacing.sm,
  },
  currentPosLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 9,
    marginBottom: 2,
  },
  currentPosValue: {
    fontFamily: typography.fonts.monoBold,
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  currentPosDetail: {
    ...typography.styles.mono,
    color: colors.text.secondary,
    fontSize: 11,
  },

  // ─── Table ──────────────────────────────────────────────────────
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  tableHeaderCell: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 9,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default + '60',
  },
  tableRowCurrent: {
    backgroundColor: colors.neon.cyan + '08',
  },
  tableCell: {
    paddingHorizontal: 2,
  },
  tableCellText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'right',
    fontSize: 11,
  },
  tableCellTextMono: {
    fontFamily: typography.fonts.mono,
    fontSize: 10,
    textAlign: 'right',
  },
  tableCellSub: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 9,
    textAlign: 'right',
  },

  // ─── Heatmap ────────────────────────────────────────────────────
  heatmapInfo: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  heatmapInfoText: {
    ...typography.styles.mono,
    color: colors.text.secondary,
    fontSize: 11,
    textAlign: 'center',
  },
  heatmapLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  heatmapLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heatmapLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  heatmapLegendText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },

  // ─── Education Cards ────────────────────────────────────────────
  educationCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  educationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  educationIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  educationTitle: {
    fontWeight: typography.weights.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  educationSubtitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  educationValuePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  educationValueText: {
    fontFamily: typography.fonts.mono,
    fontSize: 11,
    fontWeight: typography.weights.semibold,
  },
  educationContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  educationBulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  educationBulletDot: {
    fontSize: 14,
    lineHeight: 18,
  },
  educationBulletText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
  educationInsightBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    padding: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  educationInsightText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },

  // ─── Relationships ──────────────────────────────────────────────
  relationshipItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  relationshipTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  relationshipDesc: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default GreeksVisualizerScreen;
