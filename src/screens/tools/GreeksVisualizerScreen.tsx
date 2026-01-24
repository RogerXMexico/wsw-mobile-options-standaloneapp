// Greeks Visualizer Screen for Wall Street Wildlife Mobile
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const CHART_HEIGHT = 200;

interface Greek {
  id: string;
  name: string;
  symbol: string;
  description: string;
  color: string;
  emoji: string;
}

const GREEKS: Greek[] = [
  {
    id: 'delta',
    name: 'Delta',
    symbol: 'Δ',
    description: 'How much option price changes per $1 move in stock',
    color: colors.neon.green,
    emoji: '📈',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    symbol: 'Γ',
    description: 'Rate of change of Delta (acceleration)',
    color: colors.neon.cyan,
    emoji: '⚡',
  },
  {
    id: 'theta',
    name: 'Theta',
    symbol: 'Θ',
    description: 'Time decay - how much value lost per day',
    color: colors.neon.purple,
    emoji: '⏰',
  },
  {
    id: 'vega',
    name: 'Vega',
    symbol: 'ν',
    description: 'Sensitivity to changes in implied volatility',
    color: colors.neon.yellow,
    emoji: '🌊',
  },
];

const GreeksVisualizerScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedGreek, setSelectedGreek] = useState<string>('delta');
  const [stockPrice, setStockPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(100);
  const [daysToExpiry, setDaysToExpiry] = useState(30);
  const [volatility, setVolatility] = useState(25);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');

  // Calculate Greeks (simplified Black-Scholes approximations)
  const greekValues = useMemo(() => {
    const S = stockPrice;
    const K = strikePrice;
    const T = daysToExpiry / 365;
    const sigma = volatility / 100;
    const r = 0.05; // Risk-free rate

    // Simplified calculations for visualization
    const moneyness = S / K;
    const sqrtT = Math.sqrt(T);

    // Delta approximation
    let delta = optionType === 'call'
      ? 0.5 + 0.5 * Math.tanh((moneyness - 1) * 3 + sigma * sqrtT)
      : -0.5 + 0.5 * Math.tanh((moneyness - 1) * 3 + sigma * sqrtT);

    // Gamma approximation (peaks ATM, decreases with time)
    const gamma = (1 / (sigma * sqrtT * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((moneyness - 1) / (sigma * sqrtT), 2)) * 0.1;

    // Theta approximation (always negative, accelerates near expiry)
    const theta = -((S * sigma) / (2 * sqrtT * 100)) *
      Math.exp(-0.5 * Math.pow((moneyness - 1) / (sigma * sqrtT), 2));

    // Vega approximation (peaks ATM)
    const vega = (S * sqrtT / 100) *
      Math.exp(-0.5 * Math.pow((moneyness - 1) / (sigma * sqrtT), 2)) * 0.4;

    return {
      delta: Math.max(-1, Math.min(1, delta)),
      gamma: Math.max(0, gamma),
      theta: Math.min(0, theta),
      vega: Math.max(0, vega),
    };
  }, [stockPrice, strikePrice, daysToExpiry, volatility, optionType]);

  // Generate data points for chart
  const chartData = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const greek = selectedGreek;

    for (let i = 0; i <= 20; i++) {
      const priceOffset = (i - 10) * 2;
      const testPrice = stockPrice + priceOffset;
      const moneyness = testPrice / strikePrice;
      const T = daysToExpiry / 365;
      const sigma = volatility / 100;
      const sqrtT = Math.sqrt(T);

      let value = 0;

      switch (greek) {
        case 'delta':
          value = optionType === 'call'
            ? 0.5 + 0.5 * Math.tanh((moneyness - 1) * 3 + sigma * sqrtT)
            : -0.5 + 0.5 * Math.tanh((moneyness - 1) * 3 + sigma * sqrtT);
          break;
        case 'gamma':
          value = (1 / (sigma * sqrtT * Math.sqrt(2 * Math.PI))) *
            Math.exp(-0.5 * Math.pow((moneyness - 1) / (sigma * sqrtT), 2)) * 0.1;
          break;
        case 'theta':
          value = -((testPrice * sigma) / (2 * sqrtT * 100)) *
            Math.exp(-0.5 * Math.pow((moneyness - 1) / (sigma * sqrtT), 2));
          break;
        case 'vega':
          value = (testPrice * sqrtT / 100) *
            Math.exp(-0.5 * Math.pow((moneyness - 1) / (sigma * sqrtT), 2)) * 0.4;
          break;
      }

      points.push({ x: testPrice, y: value });
    }

    return points;
  }, [selectedGreek, stockPrice, strikePrice, daysToExpiry, volatility, optionType]);

  const currentGreek = GREEKS.find(g => g.id === selectedGreek)!;

  // Simple SVG-like chart using Views
  const renderChart = () => {
    const minY = Math.min(...chartData.map(p => p.y));
    const maxY = Math.max(...chartData.map(p => p.y));
    const range = maxY - minY || 1;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {/* Y-axis labels */}
          <View style={styles.yAxisLabels}>
            <Text style={styles.axisLabel}>{maxY.toFixed(3)}</Text>
            <Text style={styles.axisLabel}>{((maxY + minY) / 2).toFixed(3)}</Text>
            <Text style={styles.axisLabel}>{minY.toFixed(3)}</Text>
          </View>

          {/* Chart area */}
          <View style={styles.chartArea}>
            {/* Grid lines */}
            <View style={[styles.gridLine, { top: 0 }]} />
            <View style={[styles.gridLine, { top: '50%' }]} />
            <View style={[styles.gridLine, { top: '100%' }]} />

            {/* Zero line (if applicable) */}
            {minY < 0 && maxY > 0 && (
              <View
                style={[
                  styles.zeroLine,
                  { top: `${((maxY - 0) / range) * 100}%` }
                ]}
              />
            )}

            {/* Data points and line */}
            <View style={styles.dataLine}>
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 100;
                const y = ((maxY - point.y) / range) * 100;
                const isCurrentPrice = Math.abs(point.x - stockPrice) < 1;

                return (
                  <View
                    key={index}
                    style={[
                      styles.dataPoint,
                      {
                        left: `${x}%`,
                        top: `${Math.max(0, Math.min(100, y))}%`,
                        backgroundColor: isCurrentPrice
                          ? colors.text.primary
                          : currentGreek.color,
                        width: isCurrentPrice ? 10 : 6,
                        height: isCurrentPrice ? 10 : 6,
                        marginLeft: isCurrentPrice ? -5 : -3,
                        marginTop: isCurrentPrice ? -5 : -3,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Strike price indicator */}
            <View
              style={[
                styles.strikeIndicator,
                { left: `${((strikePrice - (stockPrice - 20)) / 40) * 100}%` }
              ]}
            >
              <Text style={styles.strikeLabel}>K</Text>
            </View>
          </View>
        </View>

        {/* X-axis labels */}
        <View style={styles.xAxisLabels}>
          <Text style={styles.axisLabel}>${stockPrice - 20}</Text>
          <Text style={styles.axisLabel}>${stockPrice}</Text>
          <Text style={styles.axisLabel}>${stockPrice + 20}</Text>
        </View>
        <Text style={styles.chartTitle}>Stock Price</Text>
      </View>
    );
  };

  const formatGreekValue = (greek: string, value: number) => {
    switch (greek) {
      case 'delta':
        return value.toFixed(3);
      case 'gamma':
        return value.toFixed(4);
      case 'theta':
        return `$${value.toFixed(2)}`;
      case 'vega':
        return `$${value.toFixed(2)}`;
      default:
        return value.toFixed(3);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Greeks Visualizer</Text>
          <Text style={styles.headerSubtitle}>Interactive option sensitivities</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greek Selector */}
        <View style={styles.greekSelector}>
          {GREEKS.map((greek) => (
            <TouchableOpacity
              key={greek.id}
              style={[
                styles.greekTab,
                selectedGreek === greek.id && {
                  backgroundColor: greek.color + '20',
                  borderColor: greek.color,
                },
              ]}
              onPress={() => setSelectedGreek(greek.id)}
            >
              <Text style={styles.greekEmoji}>{greek.emoji}</Text>
              <Text style={[
                styles.greekSymbol,
                selectedGreek === greek.id && { color: greek.color },
              ]}>
                {greek.symbol}
              </Text>
              <Text style={[
                styles.greekName,
                selectedGreek === greek.id && { color: greek.color },
              ]}>
                {greek.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Value Display */}
        <View style={[styles.valueCard, { borderColor: currentGreek.color }]}>
          <View style={styles.valueHeader}>
            <Text style={styles.valueEmoji}>{currentGreek.emoji}</Text>
            <Text style={[styles.valueName, { color: currentGreek.color }]}>
              {currentGreek.name} ({currentGreek.symbol})
            </Text>
          </View>
          <Text style={[styles.valueNumber, { color: currentGreek.color }]}>
            {formatGreekValue(selectedGreek, greekValues[selectedGreek as keyof typeof greekValues])}
          </Text>
          <Text style={styles.valueDescription}>{currentGreek.description}</Text>
        </View>

        {/* Chart */}
        {renderChart()}

        {/* Option Type Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Option Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                optionType === 'call' && styles.toggleButtonActive,
              ]}
              onPress={() => setOptionType('call')}
            >
              <Text style={[
                styles.toggleButtonText,
                optionType === 'call' && styles.toggleButtonTextActive,
              ]}>
                📈 Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                optionType === 'put' && styles.toggleButtonActive,
              ]}
              onPress={() => setOptionType('put')}
            >
              <Text style={[
                styles.toggleButtonText,
                optionType === 'put' && styles.toggleButtonTextActive,
              ]}>
                📉 Put
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Parameters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parameters</Text>

          {/* Stock Price */}
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Stock Price</Text>
            <View style={styles.paramControls}>
              <TouchableOpacity
                style={styles.paramButton}
                onPress={() => setStockPrice(p => Math.max(1, p - 5))}
              >
                <Text style={styles.paramButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.paramValue}>${stockPrice}</Text>
              <TouchableOpacity
                style={styles.paramButton}
                onPress={() => setStockPrice(p => p + 5)}
              >
                <Text style={styles.paramButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Strike Price */}
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Strike Price</Text>
            <View style={styles.paramControls}>
              <TouchableOpacity
                style={styles.paramButton}
                onPress={() => setStrikePrice(p => Math.max(1, p - 5))}
              >
                <Text style={styles.paramButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.paramValue}>${strikePrice}</Text>
              <TouchableOpacity
                style={styles.paramButton}
                onPress={() => setStrikePrice(p => p + 5)}
              >
                <Text style={styles.paramButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Days to Expiry */}
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Days to Expiry</Text>
            <View style={styles.paramControls}>
              <TouchableOpacity
                style={styles.paramButton}
                onPress={() => setDaysToExpiry(d => Math.max(1, d - 5))}
              >
                <Text style={styles.paramButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.paramValue}>{daysToExpiry} days</Text>
              <TouchableOpacity
                style={styles.paramButton}
                onPress={() => setDaysToExpiry(d => d + 5)}
              >
                <Text style={styles.paramButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Volatility */}
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Implied Volatility</Text>
            <View style={styles.paramControls}>
              <TouchableOpacity
                style={styles.paramButton}
                onPress={() => setVolatility(v => Math.max(5, v - 5))}
              >
                <Text style={styles.paramButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.paramValue}>{volatility}%</Text>
              <TouchableOpacity
                style={styles.paramButton}
                onPress={() => setVolatility(v => Math.min(100, v + 5))}
              >
                <Text style={styles.paramButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* All Greeks Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Greeks</Text>
          <View style={styles.greeksSummary}>
            {GREEKS.map((greek) => (
              <View
                key={greek.id}
                style={[styles.greekSummaryItem, { borderColor: greek.color + '40' }]}
              >
                <Text style={styles.greekSummaryEmoji}>{greek.emoji}</Text>
                <Text style={[styles.greekSummarySymbol, { color: greek.color }]}>
                  {greek.symbol}
                </Text>
                <Text style={styles.greekSummaryValue}>
                  {formatGreekValue(greek.id, greekValues[greek.id as keyof typeof greekValues])}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Educational Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
          <Text style={styles.tipText}>
            • <Text style={{ color: colors.neon.green }}>Delta</Text> tells you directional exposure - 0.50 delta = $0.50 move per $1 stock move
          </Text>
          <Text style={styles.tipText}>
            • <Text style={{ color: colors.neon.cyan }}>Gamma</Text> is highest at-the-money and near expiration
          </Text>
          <Text style={styles.tipText}>
            • <Text style={{ color: colors.neon.purple }}>Theta</Text> accelerates as expiration approaches - be careful!
          </Text>
          <Text style={styles.tipText}>
            • <Text style={{ color: colors.neon.yellow }}>Vega</Text> measures IV sensitivity - high vega = bigger swings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
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
  backButtonText: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  greekSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  greekTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  greekEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  greekSymbol: {
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  greekName: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  valueCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  valueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  valueEmoji: {
    fontSize: 24,
  },
  valueName: {
    ...typography.styles.h4,
  },
  valueNumber: {
    fontSize: 48,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  valueDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: spacing.lg,
  },
  chart: {
    flexDirection: 'row',
    height: CHART_HEIGHT,
  },
  yAxisLabels: {
    width: 50,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
  },
  chartArea: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border.default,
  },
  zeroLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.text.muted,
  },
  dataLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dataPoint: {
    position: 'absolute',
    borderRadius: 5,
  },
  strikeIndicator: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    width: 2,
    backgroundColor: colors.neon.pink,
    alignItems: 'center',
  },
  strikeLabel: {
    ...typography.styles.caption,
    color: colors.neon.pink,
    position: 'absolute',
    top: 4,
    fontWeight: typography.weights.bold,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginLeft: 50,
  },
  axisLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  chartTitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  toggleButtonActive: {
    backgroundColor: colors.neon.green + '20',
    borderColor: colors.neon.green,
  },
  toggleButtonText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  toggleButtonTextActive: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  paramLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  paramControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paramButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paramButtonText: {
    fontSize: 20,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  paramValue: {
    ...typography.styles.body,
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
    minWidth: 80,
    textAlign: 'center',
  },
  greeksSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  greekSummaryItem: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  greekSummaryEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  greekSummarySymbol: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  greekSummaryValue: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  tipsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tipsTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tipText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
});

export default GreeksVisualizerScreen;
