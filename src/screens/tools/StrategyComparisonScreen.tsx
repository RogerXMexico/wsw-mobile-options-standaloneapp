// Strategy Comparison Screen for Wall Street Wildlife Mobile
// Side-by-side strategy comparison tool with payoff diagrams
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Polyline, Circle, Text as SvgText, Rect } from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { allStrategies } from '../../data/strategies';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.md * 2 - spacing.md * 2;
const CHART_HEIGHT = 200;
const CHART_PADDING = { top: 20, right: 15, bottom: 30, left: 45 };
const PLOT_W = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
const PLOT_H = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

// ---------------------------------------------------------------------------
// Strategy metrics database
// ---------------------------------------------------------------------------

interface StrategyMetrics {
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
  riskReward: string;
  capitalRequired: string;
  probabilityProfile: string;
  deltaProfile: string;
  thetaProfile: string;
  vegaProfile: string;
  gammaProfile: string;
  bestFor: string;
  complexity: number;
}

const STRATEGY_METRICS: Record<string, StrategyMetrics> = {
  'long-call': {
    maxProfit: 'Unlimited', maxLoss: 'Premium paid', breakeven: 'Strike + Premium',
    riskReward: 'Asymmetric (unlimited upside)', capitalRequired: 'Low (premium only)',
    probabilityProfile: '30-50% ITM typical', deltaProfile: '+0.30 to +0.70',
    thetaProfile: 'Negative (hurts you)', vegaProfile: 'Positive (benefits from IV rise)',
    gammaProfile: 'Positive (accelerates gains)', bestFor: 'Strong directional conviction with limited capital', complexity: 1,
  },
  'long-put': {
    maxProfit: 'Strike - Premium (stock to $0)', maxLoss: 'Premium paid', breakeven: 'Strike - Premium',
    riskReward: 'Asymmetric (large downside capture)', capitalRequired: 'Low (premium only)',
    probabilityProfile: '30-50% ITM typical', deltaProfile: '-0.30 to -0.70',
    thetaProfile: 'Negative (hurts you)', vegaProfile: 'Positive (benefits from IV rise)',
    gammaProfile: 'Positive (accelerates gains)', bestFor: 'Bearish conviction or portfolio protection', complexity: 1,
  },
  'covered-call': {
    maxProfit: 'Premium + (Strike - Stock Price)', maxLoss: 'Stock price - Premium (to $0)', breakeven: 'Stock Price - Premium',
    riskReward: 'Limited profit, full stock risk', capitalRequired: 'High (100 shares + margin)',
    probabilityProfile: '60-70% profit typical', deltaProfile: '+0.30 to +0.70 (reduced)',
    thetaProfile: 'Positive (helps you)', vegaProfile: 'Negative (IV drop helps)',
    gammaProfile: 'Negative (limits gains)', bestFor: 'Income on existing stock positions', complexity: 2,
  },
  'cash-secured-put': {
    maxProfit: 'Premium received', maxLoss: 'Strike - Premium (stock to $0)', breakeven: 'Strike - Premium',
    riskReward: 'Limited profit, significant risk', capitalRequired: 'High (cash to buy 100 shares)',
    probabilityProfile: '60-80% profit typical', deltaProfile: '+0.20 to +0.40',
    thetaProfile: 'Positive (helps you)', vegaProfile: 'Negative (IV drop helps)',
    gammaProfile: 'Negative', bestFor: 'Acquiring stock at discount or income', complexity: 2,
  },
  'protective-put': {
    maxProfit: 'Unlimited (stock upside)', maxLoss: 'Stock Price - Strike + Premium', breakeven: 'Stock Price + Premium',
    riskReward: 'Unlimited upside, capped downside', capitalRequired: 'High (stock + put premium)',
    probabilityProfile: 'Insurance policy', deltaProfile: '+0.50 to +0.80',
    thetaProfile: 'Negative (insurance cost)', vegaProfile: 'Positive (crisis hedge)',
    gammaProfile: 'Positive', bestFor: 'Protecting gains on stock holdings', complexity: 2,
  },
  'collar': {
    maxProfit: 'Call Strike - Stock Price', maxLoss: 'Stock Price - Put Strike', breakeven: 'Stock Price (approx)',
    riskReward: 'Capped both ways', capitalRequired: 'High (stock ownership)',
    probabilityProfile: 'High (range-bound)', deltaProfile: '+0.30 to +0.60',
    thetaProfile: 'Neutral (offsets)', vegaProfile: 'Neutral', gammaProfile: 'Neutral',
    bestFor: 'Lock in gains with zero-cost protection', complexity: 3,
  },
  'bull-call-spread': {
    maxProfit: 'Width - Net Debit', maxLoss: 'Net Debit', breakeven: 'Long Strike + Net Debit',
    riskReward: '1:1 to 1:3 typical', capitalRequired: 'Moderate (net debit)',
    probabilityProfile: '40-55% profit typical', deltaProfile: '+0.20 to +0.50',
    thetaProfile: 'Mixed (near neutral)', vegaProfile: 'Near neutral', gammaProfile: 'Near neutral',
    bestFor: 'Moderate bullish view with defined risk', complexity: 2,
  },
  'bear-put-spread': {
    maxProfit: 'Width - Net Debit', maxLoss: 'Net Debit', breakeven: 'Long Strike - Net Debit',
    riskReward: '1:1 to 1:3 typical', capitalRequired: 'Moderate (net debit)',
    probabilityProfile: '40-55% profit typical', deltaProfile: '-0.20 to -0.50',
    thetaProfile: 'Mixed (near neutral)', vegaProfile: 'Near neutral', gammaProfile: 'Near neutral',
    bestFor: 'Moderate bearish view with defined risk', complexity: 2,
  },
  'bull-put-spread': {
    maxProfit: 'Net Credit', maxLoss: 'Width - Net Credit', breakeven: 'Short Strike - Net Credit',
    riskReward: '1:2 to 1:4 (risk > reward)', capitalRequired: 'Moderate (margin for width)',
    probabilityProfile: '60-75% profit typical', deltaProfile: '+0.10 to +0.30',
    thetaProfile: 'Positive (helps you)', vegaProfile: 'Negative (IV drop helps)', gammaProfile: 'Negative',
    bestFor: 'High probability income with support', complexity: 2,
  },
  'bear-call-spread': {
    maxProfit: 'Net Credit', maxLoss: 'Width - Net Credit', breakeven: 'Short Strike + Net Credit',
    riskReward: '1:2 to 1:4 (risk > reward)', capitalRequired: 'Moderate (margin for width)',
    probabilityProfile: '60-75% profit typical', deltaProfile: '-0.10 to -0.30',
    thetaProfile: 'Positive (helps you)', vegaProfile: 'Negative (IV drop helps)', gammaProfile: 'Negative',
    bestFor: 'High probability income with resistance', complexity: 2,
  },
  'long-straddle': {
    maxProfit: 'Unlimited', maxLoss: 'Total Premium (both legs)', breakeven: 'Strike +/- Total Premium',
    riskReward: 'Asymmetric (needs big move)', capitalRequired: 'Moderate (two premiums)',
    probabilityProfile: '30-40% profit typical', deltaProfile: '~0 (neutral)',
    thetaProfile: 'Very Negative (double decay)', vegaProfile: 'Very Positive (loves IV spike)',
    gammaProfile: 'Very Positive', bestFor: 'Expecting explosive move, direction unknown', complexity: 3,
  },
  'long-strangle': {
    maxProfit: 'Unlimited', maxLoss: 'Total Premium (both legs)', breakeven: 'Strikes +/- Premium',
    riskReward: 'Asymmetric (needs bigger move)', capitalRequired: 'Low-Moderate (OTM premiums)',
    probabilityProfile: '25-35% profit typical', deltaProfile: '~0 (neutral)',
    thetaProfile: 'Negative (double decay)', vegaProfile: 'Positive (loves IV spike)',
    gammaProfile: 'Positive', bestFor: 'Cheap volatility bet before events', complexity: 3,
  },
  'short-straddle': {
    maxProfit: 'Total Premium', maxLoss: 'Unlimited', breakeven: 'Strike +/- Total Premium',
    riskReward: 'Limited profit, unlimited risk', capitalRequired: 'Very High (margin intensive)',
    probabilityProfile: '40-50% profit typical', deltaProfile: '~0 (neutral)',
    thetaProfile: 'Very Positive (double income)', vegaProfile: 'Very Negative (hates IV spike)',
    gammaProfile: 'Very Negative', bestFor: 'Expecting stock to pin at strike', complexity: 4,
  },
  'short-strangle': {
    maxProfit: 'Total Premium', maxLoss: 'Unlimited', breakeven: 'Strikes +/- Premium',
    riskReward: 'Limited profit, unlimited risk', capitalRequired: 'Very High (margin intensive)',
    probabilityProfile: '50-70% profit typical', deltaProfile: '~0 (neutral)',
    thetaProfile: 'Positive (double income)', vegaProfile: 'Negative (hates IV spike)',
    gammaProfile: 'Negative', bestFor: 'Range-bound markets, selling premium', complexity: 4,
  },
  'iron-condor': {
    maxProfit: 'Net Credit', maxLoss: 'Wing Width - Net Credit', breakeven: 'Short Strikes +/- Net Credit',
    riskReward: '1:2 to 1:4 typical', capitalRequired: 'Moderate (defined risk)',
    probabilityProfile: '50-70% profit typical', deltaProfile: '~0 (neutral)',
    thetaProfile: 'Positive', vegaProfile: 'Negative', gammaProfile: 'Negative',
    bestFor: 'Range-bound markets with defined risk', complexity: 3,
  },
  'iron-butterfly': {
    maxProfit: 'Net Credit', maxLoss: 'Wing Width - Net Credit', breakeven: 'ATM Strike +/- Net Credit',
    riskReward: '1:1 to 2:1 typical', capitalRequired: 'Moderate (defined risk)',
    probabilityProfile: '30-40% profit typical', deltaProfile: '~0 (neutral)',
    thetaProfile: 'Very Positive', vegaProfile: 'Very Negative', gammaProfile: 'Very Negative',
    bestFor: 'Expecting stock to pin at specific price', complexity: 3,
  },
  'calendar-spread': {
    maxProfit: 'Limited (back month value)', maxLoss: 'Net Debit', breakeven: 'Complex (time-dependent)',
    riskReward: '1:1 to 2:1 typical', capitalRequired: 'Moderate',
    probabilityProfile: '40-50% profit typical', deltaProfile: '~0 (neutral)',
    thetaProfile: 'Positive (front decays faster)', vegaProfile: 'Positive (back month gains)',
    gammaProfile: 'Mixed', bestFor: 'Stock to stay near strike short-term', complexity: 4,
  },
  'pmcc': {
    maxProfit: 'Limited by short call', maxLoss: 'Net Debit', breakeven: 'LEAPS Strike + Net Debit',
    riskReward: '2:1 to 5:1 typical', capitalRequired: 'Moderate (vs buying stock)',
    probabilityProfile: '50-60% profit typical', deltaProfile: '+0.70 to +0.90',
    thetaProfile: 'Positive (short call income)', vegaProfile: 'Mixed', gammaProfile: 'Near neutral',
    bestFor: 'Stock replacement with income generation', complexity: 4,
  },
  'ratio-spread': {
    maxProfit: 'Width x Ratio + Credit', maxLoss: 'Unlimited (past short strikes)', breakeven: 'Complex',
    riskReward: 'Very asymmetric', capitalRequired: 'High (naked short exposure)',
    probabilityProfile: '55-65% profit typical', deltaProfile: 'Varies with ratio',
    thetaProfile: 'Positive', vegaProfile: 'Negative', gammaProfile: 'Very Negative at extremes',
    bestFor: 'Credit entry with directional bias', complexity: 5,
  },
  'call-backspread': {
    maxProfit: 'Unlimited', maxLoss: 'Limited (at long strike)', breakeven: 'Complex',
    riskReward: 'Unlimited upside', capitalRequired: 'Low-Moderate',
    probabilityProfile: '35-45% profit typical', deltaProfile: 'Positive (accelerates up)',
    thetaProfile: 'Negative', vegaProfile: 'Positive', gammaProfile: 'Very Positive',
    bestFor: 'Explosive upside moves', complexity: 5,
  },
  'put-backspread': {
    maxProfit: 'Strike - Premium (large)', maxLoss: 'Limited (at long strike)', breakeven: 'Complex',
    riskReward: 'Large downside capture', capitalRequired: 'Low-Moderate',
    probabilityProfile: '35-45% profit typical', deltaProfile: 'Negative (accelerates down)',
    thetaProfile: 'Negative', vegaProfile: 'Positive', gammaProfile: 'Very Positive',
    bestFor: 'Crash protection / bearish explosion', complexity: 5,
  },
  'broken-wing-butterfly': {
    maxProfit: 'Width + Credit', maxLoss: 'Skipped width - Credit', breakeven: 'Complex (asymmetric)',
    riskReward: 'Credit entry possible', capitalRequired: 'Moderate',
    probabilityProfile: '50-60% profit typical', deltaProfile: 'Directional bias',
    thetaProfile: 'Positive', vegaProfile: 'Negative', gammaProfile: 'Negative',
    bestFor: 'Directional play with credit entry', complexity: 5,
  },
};

// ---------------------------------------------------------------------------
// Payoff calculation
// ---------------------------------------------------------------------------

function calculatePayoff(id: string, price: number, strike: number, premium: number, width: number): number {
  switch (id) {
    case 'long-call':
      return Math.max(0, price - strike) - premium;
    case 'long-put':
      return Math.max(0, strike - price) - premium;
    case 'covered-call': {
      const stockPnl = price - strike;
      const shortCallPnl = Math.min(premium * 0.4, premium * 0.4 - Math.max(0, price - (strike + 5)));
      return stockPnl + shortCallPnl;
    }
    case 'cash-secured-put':
      return price >= (strike - 5) ? premium * 0.4 : (price - (strike - 5)) + premium * 0.4;
    case 'protective-put':
      return (price - strike) + Math.max(0, (strike - 5) - price) - premium * 0.6;
    case 'collar': {
      const s = price - strike;
      const p = Math.max(0, (strike - width / 2) - price);
      const c = -Math.max(0, price - (strike + width / 2));
      return s + p + c;
    }
    case 'bull-call-spread':
      return Math.max(0, price - strike) - Math.max(0, price - (strike + width)) - premium * 0.6;
    case 'bear-put-spread':
      return Math.max(0, strike - price) - Math.max(0, (strike - width) - price) - premium * 0.6;
    case 'bull-put-spread':
      return -Math.max(0, strike - price) + Math.max(0, (strike - width) - price) + premium * 0.3;
    case 'bear-call-spread':
      return -Math.max(0, price - strike) + Math.max(0, price - (strike + width)) + premium * 0.3;
    case 'long-straddle':
      return Math.max(0, price - strike) + Math.max(0, strike - price) - premium * 2;
    case 'long-strangle':
      return Math.max(0, price - (strike + width / 2)) + Math.max(0, (strike - width / 2) - price) - premium * 1.2;
    case 'short-straddle':
      return -(Math.max(0, price - strike) + Math.max(0, strike - price)) + premium * 2;
    case 'short-strangle':
      return -(Math.max(0, price - (strike + width / 2)) + Math.max(0, (strike - width / 2) - price)) + premium * 1.2;
    case 'iron-condor': {
      const ps = -Math.max(0, (strike - width / 2) - price) + Math.max(0, (strike - width) - price);
      const cs = -Math.max(0, price - (strike + width / 2)) + Math.max(0, price - (strike + width));
      return ps + cs + premium * 0.5;
    }
    case 'iron-butterfly': {
      const ss = -(Math.max(0, price - strike) + Math.max(0, strike - price));
      const ls = Math.max(0, price - (strike + width / 2)) + Math.max(0, (strike - width / 2) - price);
      return ss + ls + premium * 0.8;
    }
    case 'calendar-spread':
      return Math.max(-premium * 0.5, premium * 0.6 - Math.abs(price - strike) * 0.3);
    default:
      return 0;
  }
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

const STRATEGY_COLORS = [colors.neon.green, '#ff6b6b', colors.neon.purple, '#fbbf24'];

function getProfileColor(profile: string): string {
  if (profile.includes('Unlimited') || profile.includes('Very Positive')) return colors.neon.green;
  if (profile.includes('Positive')) return '#66ff88';
  if (profile.includes('Very Negative')) return '#ff6b6b';
  if (profile.includes('Negative')) return '#ff8888';
  if (profile.includes('neutral') || profile.includes('Mixed') || profile.includes('Neutral')) return '#fbbf24';
  return colors.text.secondary;
}

function getOutlookColor(outlook: string): string {
  const l = outlook.toLowerCase();
  if (l.includes('bull')) return colors.neon.green;
  if (l.includes('bear')) return '#ff6b6b';
  if (l.includes('neutral') || l.includes('range')) return '#fbbf24';
  if (l.includes('volat') || l.includes('explos')) return colors.neon.purple;
  return colors.text.secondary;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const StrategyComparisonScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [outlookFilter, setOutlookFilter] = useState('all');
  const [showChart, setShowChart] = useState(true);

  // Only strategies that have metrics defined
  const comparableStrategies = useMemo(
    () => allStrategies.filter(s => STRATEGY_METRICS[s.id]),
    [],
  );

  const filteredStrategies = useMemo(
    () =>
      comparableStrategies.filter(s => {
        if (outlookFilter === 'all') return true;
        return s.outlook.toLowerCase().includes(outlookFilter);
      }),
    [comparableStrategies, outlookFilter],
  );

  const selectedStrategies = useMemo(
    () =>
      selectedIds
        .map(id => {
          const strat = allStrategies.find(s => s.id === id);
          const metrics = STRATEGY_METRICS[id];
          if (!strat || !metrics) return null;
          return { ...strat, metrics };
        })
        .filter(Boolean) as (typeof allStrategies[number] & { metrics: StrategyMetrics })[],
    [selectedIds],
  );

  const toggleStrategy = useCallback(
    (id: string) => {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev,
      );
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Payoff chart data
  // ---------------------------------------------------------------------------

  const payoffData = useMemo(() => {
    const base = 100;
    const prem = 5;
    const width = 10;
    const points: { price: number; values: Record<string, number> }[] = [];
    for (let i = 0; i <= 40; i++) {
      const price = base - 20 + i;
      const values: Record<string, number> = {};
      selectedIds.forEach(id => {
        values[id] = Math.round(calculatePayoff(id, price, base, prem, width) * 100) / 100;
      });
      points.push({ price, values });
    }
    return points;
  }, [selectedIds]);

  // ---------------------------------------------------------------------------
  // Chart renderer
  // ---------------------------------------------------------------------------

  const renderPayoffChart = () => {
    if (selectedIds.length === 0 || !showChart) return null;

    const allValues = payoffData.flatMap(p => Object.values(p.values));
    const minVal = Math.min(...allValues, 0);
    const maxVal = Math.max(...allValues, 0);
    const range = maxVal - minVal || 1;

    const toX = (price: number) =>
      CHART_PADDING.left + ((price - 80) / 40) * PLOT_W;
    const toY = (val: number) =>
      CHART_PADDING.top + ((maxVal - val) / range) * PLOT_H;

    const zeroY = toY(0);

    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="trending-up-outline" size={18} color={colors.neon.cyan} />
            <Text style={styles.chartTitle}>Payoff Comparison</Text>
          </View>
          <TouchableOpacity onPress={() => setShowChart(false)}>
            <Ionicons name="close" size={20} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.chartParamsRow}>
          <Text style={styles.chartParam}>
            Strike: <Text style={{ color: colors.neon.cyan }}>$100</Text>
          </Text>
          <Text style={styles.chartParam}>
            Premium: <Text style={{ color: colors.neon.green }}>$5</Text>
          </Text>
          <Text style={styles.chartParam}>
            Width: <Text style={{ color: colors.neon.purple }}>$10</Text>
          </Text>
        </View>

        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Grid lines */}
          <Line x1={CHART_PADDING.left} y1={CHART_PADDING.top} x2={CHART_PADDING.left} y2={CHART_PADDING.top + PLOT_H} stroke={colors.border.default} strokeWidth={1} />
          <Line x1={CHART_PADDING.left} y1={CHART_PADDING.top + PLOT_H} x2={CHART_PADDING.left + PLOT_W} y2={CHART_PADDING.top + PLOT_H} stroke={colors.border.default} strokeWidth={1} />

          {/* Zero line */}
          {minVal < 0 && maxVal > 0 && (
            <Line x1={CHART_PADDING.left} y1={zeroY} x2={CHART_PADDING.left + PLOT_W} y2={zeroY} stroke={colors.text.muted} strokeWidth={1} strokeDasharray="4,4" />
          )}

          {/* ATM line */}
          <Line x1={toX(100)} y1={CHART_PADDING.top} x2={toX(100)} y2={CHART_PADDING.top + PLOT_H} stroke="#fbbf24" strokeWidth={1} strokeDasharray="4,4" />
          <SvgText x={toX(100)} y={CHART_PADDING.top - 4} fontSize={9} fill="#fbbf24" textAnchor="middle">ATM</SvgText>

          {/* Payoff lines */}
          {selectedIds.map((id, sIdx) => {
            const pts = payoffData.map(p => `${toX(p.price)},${toY(p.values[id] ?? 0)}`).join(' ');
            return (
              <Polyline
                key={id}
                points={pts}
                fill="none"
                stroke={STRATEGY_COLORS[sIdx]}
                strokeWidth={2.5}
              />
            );
          })}

          {/* Y axis labels */}
          <SvgText x={CHART_PADDING.left - 5} y={CHART_PADDING.top + 4} fontSize={9} fill={colors.text.muted} textAnchor="end">${maxVal.toFixed(0)}</SvgText>
          <SvgText x={CHART_PADDING.left - 5} y={CHART_PADDING.top + PLOT_H + 4} fontSize={9} fill={colors.text.muted} textAnchor="end">${minVal.toFixed(0)}</SvgText>
          {minVal < 0 && maxVal > 0 && (
            <SvgText x={CHART_PADDING.left - 5} y={zeroY + 3} fontSize={9} fill={colors.text.muted} textAnchor="end">$0</SvgText>
          )}

          {/* X axis labels */}
          <SvgText x={toX(80)} y={CHART_PADDING.top + PLOT_H + 15} fontSize={9} fill={colors.text.muted} textAnchor="middle">$80</SvgText>
          <SvgText x={toX(100)} y={CHART_PADDING.top + PLOT_H + 15} fontSize={9} fill={colors.text.muted} textAnchor="middle">$100</SvgText>
          <SvgText x={toX(120)} y={CHART_PADDING.top + PLOT_H + 15} fontSize={9} fill={colors.text.muted} textAnchor="middle">$120</SvgText>
        </Svg>

        {/* Chart legend */}
        <View style={styles.chartLegendRow}>
          {selectedStrategies.map((s, idx) => {
            const vals = payoffData.map(p => p.values[s.id] ?? 0);
            const maxP = Math.max(...vals);
            const minP = Math.min(...vals);
            return (
              <View key={s.id} style={styles.chartLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: STRATEGY_COLORS[idx] }]} />
                <View>
                  <Text style={styles.legendName}>{s.name}</Text>
                  <Text style={styles.legendStats}>
                    Max: <Text style={{ color: colors.neon.green }}>${maxP.toFixed(0)}</Text>
                    {'  '}Min: <Text style={{ color: '#ff6b6b' }}>${minP.toFixed(0)}</Text>
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // ---------------------------------------------------------------------------
  // Comparison table
  // ---------------------------------------------------------------------------

  const MetricRow = ({ label, values, colorFn }: { label: string; values: string[]; colorFn?: (v: string) => string }) => (
    <View style={styles.metricRow}>
      <View style={styles.metricLabel}>
        <Text style={styles.metricLabelText}>{label}</Text>
      </View>
      {values.map((v, i) => (
        <View key={i} style={styles.metricValue}>
          <Text style={[styles.metricValueText, colorFn && { color: colorFn(v) }]}>{v}</Text>
        </View>
      ))}
    </View>
  );

  const renderComparisonTable = () => {
    if (selectedStrategies.length === 0) return null;

    const metrics = selectedStrategies.map(s => s.metrics);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableCard}>
        <View>
          {/* Strategy headers */}
          <View style={styles.metricRow}>
            <View style={styles.metricLabel}>
              <Text style={[styles.metricLabelText, { color: colors.text.muted }]}>STRATEGY</Text>
            </View>
            {selectedStrategies.map((s, idx) => (
              <View key={s.id} style={[styles.metricValue, { borderTopWidth: 3, borderTopColor: STRATEGY_COLORS[idx] }]}>
                <Text style={styles.strategyHeaderName}>{s.name}</Text>
                <Text style={[styles.strategyHeaderOutlook, { color: getOutlookColor(s.outlook) }]}>{s.outlook}</Text>
              </View>
            ))}
          </View>

          <MetricRow label="MAX PROFIT" values={metrics.map(m => m.maxProfit)} colorFn={getProfileColor} />
          <MetricRow label="MAX LOSS" values={metrics.map(m => m.maxLoss)} colorFn={v => v.includes('Unlimited') ? '#ff6b6b' : colors.text.secondary} />
          <MetricRow label="BREAKEVEN" values={metrics.map(m => m.breakeven)} />
          <MetricRow label="RISK/REWARD" values={metrics.map(m => m.riskReward)} />
          <MetricRow label="CAPITAL" values={metrics.map(m => m.capitalRequired)} />
          <MetricRow label="WIN PROB" values={metrics.map(m => m.probabilityProfile)} colorFn={() => colors.neon.cyan} />

          {/* Greeks section header */}
          <View style={[styles.metricRow, styles.greeksSectionHeader]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.metricLabelText, { color: colors.neon.purple }]}>GREEKS PROFILE</Text>
            </View>
          </View>
          <MetricRow label="   DELTA" values={metrics.map(m => m.deltaProfile)} colorFn={getProfileColor} />
          <MetricRow label="   THETA" values={metrics.map(m => m.thetaProfile)} colorFn={getProfileColor} />
          <MetricRow label="   VEGA" values={metrics.map(m => m.vegaProfile)} colorFn={getProfileColor} />
          <MetricRow label="   GAMMA" values={metrics.map(m => m.gammaProfile)} colorFn={getProfileColor} />

          {/* Best for */}
          <View style={[styles.metricRow, { backgroundColor: 'rgba(57,255,20,0.04)' }]}>
            <View style={styles.metricLabel}>
              <Text style={[styles.metricLabelText, { color: colors.neon.green }]}>BEST FOR</Text>
            </View>
            {metrics.map((m, i) => (
              <View key={i} style={styles.metricValue}>
                <Text style={[styles.metricValueText, { color: '#66ff88', fontStyle: 'italic' }]}>{m.bestFor}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  // ---------------------------------------------------------------------------
  // Quick insights
  // ---------------------------------------------------------------------------

  const renderInsights = () => {
    if (selectedStrategies.length < 2) return null;

    const highestWin = selectedStrategies.reduce((best, s) => {
      const m = s.metrics.probabilityProfile.match(/(\d+)/);
      const bm = best.metrics.probabilityProfile.match(/(\d+)/);
      return (m ? parseInt(m[1]) : 0) > (bm ? parseInt(bm[1]) : 0) ? s : best;
    });

    const lowestCap =
      selectedStrategies.find(s => s.metrics.capitalRequired.includes('Low')) ||
      selectedStrategies.find(s => s.metrics.capitalRequired.includes('Moderate')) ||
      selectedStrategies[0];

    const thetaPositive =
      selectedStrategies.find(s => s.metrics.thetaProfile.includes('Very Positive')) ||
      selectedStrategies.find(s => s.metrics.thetaProfile.includes('Positive'));

    return (
      <View style={styles.insightsRow}>
        <View style={[styles.insightCard, { borderColor: 'rgba(57,255,20,0.25)' }]}>
          <Text style={[styles.insightLabel, { color: 'rgba(57,255,20,0.7)' }]}>HIGHEST WIN PROB</Text>
          <Text style={[styles.insightValue, { color: colors.neon.green }]}>{highestWin.name}</Text>
        </View>
        <View style={[styles.insightCard, { borderColor: 'rgba(0,240,255,0.25)' }]}>
          <Text style={[styles.insightLabel, { color: 'rgba(0,240,255,0.7)' }]}>LOWEST CAPITAL</Text>
          <Text style={[styles.insightValue, { color: colors.neon.cyan }]}>{lowestCap.name}</Text>
        </View>
        {thetaPositive && (
          <View style={[styles.insightCard, { borderColor: 'rgba(191,0,255,0.25)' }]}>
            <Text style={[styles.insightLabel, { color: 'rgba(191,0,255,0.7)' }]}>THETA INCOME</Text>
            <Text style={[styles.insightValue, { color: colors.neon.purple }]}>{thetaPositive.name}</Text>
          </View>
        )}
      </View>
    );
  };

  // ---------------------------------------------------------------------------
  // Strategy picker modal
  // ---------------------------------------------------------------------------

  const renderPicker = () => (
    <Modal visible={pickerVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Strategies ({selectedIds.length}/3)</Text>
            <TouchableOpacity onPress={() => setPickerVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Outlook filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
            <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 4 }}>
              {['all', 'bull', 'bear', 'neutral', 'volat'].map(f => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setOutlookFilter(f)}
                  style={[styles.filterPill, outlookFilter === f && styles.filterPillActive]}
                >
                  <Text style={[styles.filterPillText, outlookFilter === f && styles.filterPillTextActive]}>
                    {f === 'all' ? 'All' : f === 'bull' ? 'Bullish' : f === 'bear' ? 'Bearish' : f === 'neutral' ? 'Neutral' : 'Volatile'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <FlatList
            data={filteredStrategies}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedIds.includes(item.id);
              const colorIdx = selectedIds.indexOf(item.id);
              const disabled = !isSelected && selectedIds.length >= 3;
              return (
                <TouchableOpacity
                  onPress={() => toggleStrategy(item.id)}
                  disabled={disabled}
                  style={[
                    styles.pickerItem,
                    isSelected && { borderColor: STRATEGY_COLORS[colorIdx], backgroundColor: 'rgba(57,255,20,0.06)' },
                    disabled && { opacity: 0.35 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pickerItemName, isSelected && { color: colors.text.primary }]}>{item.name}</Text>
                    <Text style={[styles.pickerItemOutlook, { color: getOutlookColor(item.outlook) }]}>{item.outlook}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.pickerDot, { backgroundColor: STRATEGY_COLORS[colorIdx] }]} />
                  )}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 400 }}
          />

          <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Strategy Comparison</Text>
          <Text style={styles.headerSubtitle}>Compare up to 3 strategies side-by-side</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Select / Clear row */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.selectBtn}>
            <Ionicons name="add-circle-outline" size={18} color={colors.neon.green} />
            <Text style={styles.selectBtnText}>
              {selectedIds.length === 0 ? 'Select Strategies' : `${selectedIds.length} Selected`}
            </Text>
          </TouchableOpacity>
          {selectedIds.length > 0 && (
            <TouchableOpacity onPress={() => setSelectedIds([])} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
          )}
          {selectedIds.length > 0 && !showChart && (
            <TouchableOpacity onPress={() => setShowChart(true)} style={styles.clearBtn}>
              <Ionicons name="bar-chart-outline" size={14} color={colors.neon.cyan} />
              <Text style={[styles.clearBtnText, { color: colors.neon.cyan }]}>Chart</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Selected strategy tags */}
        {selectedIds.length > 0 && (
          <View style={styles.tagsRow}>
            {selectedStrategies.map((s, idx) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => toggleStrategy(s.id)}
                style={[styles.tag, { borderColor: STRATEGY_COLORS[idx] }]}
              >
                <View style={[styles.tagDot, { backgroundColor: STRATEGY_COLORS[idx] }]} />
                <Text style={styles.tagText}>{s.name}</Text>
                <Ionicons name="close-circle" size={14} color={colors.text.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedIds.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color={colors.text.muted} />
            <Text style={styles.emptyText}>Select 2-3 strategies above to compare</Text>
          </View>
        ) : (
          <>
            {renderPayoffChart()}
            {renderComparisonTable()}
            {renderInsights()}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {renderPicker()}
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const METRIC_LABEL_W = 90;
const METRIC_VALUE_W = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(57,255,20,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.30)',
  },
  selectBtnText: {
    ...typography.styles.buttonSm,
    color: colors.neon.green,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,107,107,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ff6b6b',
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    backgroundColor: colors.background.card,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.text.muted,
  },

  // Chart
  chartCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  chartTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  chartParamsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  chartParam: {
    fontSize: 11,
    color: colors.text.muted,
    fontWeight: '500',
  },
  chartLegendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.default,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  legendStats: {
    fontSize: 10,
    color: colors.text.muted,
  },

  // Table
  tableCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.default,
  },
  metricLabel: {
    width: METRIC_LABEL_W,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  metricLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    width: METRIC_VALUE_W,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  metricValueText: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  greeksSectionHeader: {
    backgroundColor: 'rgba(191,0,255,0.04)',
  },
  strategyHeaderName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  strategyHeaderOutlook: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Insights
  insightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  insightCard: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - spacing.md * 2 - 16) / 2,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  insightLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  insightValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },

  // Filter pills
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  filterPillActive: {
    backgroundColor: 'rgba(57,255,20,0.10)',
    borderColor: 'rgba(57,255,20,0.40)',
  },
  filterPillText: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: colors.neon.green,
  },

  // Picker item
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  pickerItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  pickerItemOutlook: {
    fontSize: 11,
    marginTop: 2,
  },
  pickerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },

  // Done button
  doneBtn: {
    marginTop: spacing.md,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(57,255,20,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.3)',
    alignItems: 'center',
  },
  doneBtnText: {
    ...typography.styles.button,
    color: colors.neon.green,
  },
});

export default StrategyComparisonScreen;
