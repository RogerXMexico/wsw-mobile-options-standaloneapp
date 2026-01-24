// 3D Options Surface Screen for Wall Street Wildlife Mobile
// Visualizes IV surface across strikes and expirations
import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard, GradientText } from '../../components/ui';

const { width } = Dimensions.get('window');

type ViewMode = 'surface' | 'skew' | 'term';
type SymbolOption = 'SPY' | 'AAPL' | 'TSLA' | 'NVDA' | 'QQQ';

interface SurfaceDataPoint {
  strike: number;
  dte: number;
  iv: number;
}

// Mock IV surface data
const generateSurfaceData = (symbol: string): SurfaceDataPoint[] => {
  const baseIV = symbol === 'TSLA' ? 55 : symbol === 'NVDA' ? 45 : symbol === 'SPY' ? 15 : 30;
  const data: SurfaceDataPoint[] = [];
  const strikes = [-20, -15, -10, -5, 0, 5, 10, 15, 20]; // % from ATM
  const dtes = [7, 14, 30, 45, 60, 90];

  strikes.forEach(strike => {
    dtes.forEach(dte => {
      // IV smile effect - higher IV for OTM options
      const smileEffect = Math.abs(strike) * 0.3;
      // Term structure - slight increase with time
      const termEffect = Math.sqrt(dte / 30) * 2;
      // Add some randomness
      const noise = (Math.random() - 0.5) * 3;

      data.push({
        strike,
        dte,
        iv: baseIV + smileEffect + termEffect + noise,
      });
    });
  });

  return data;
};

const OptionsSurface3DScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolOption>('SPY');
  const [viewMode, setViewMode] = useState<ViewMode>('surface');
  const [surfaceData] = useState(() => generateSurfaceData(selectedSymbol));

  const symbols: SymbolOption[] = ['SPY', 'AAPL', 'TSLA', 'NVDA', 'QQQ'];
  const strikes = [-20, -15, -10, -5, 0, 5, 10, 15, 20];
  const dtes = [7, 14, 30, 45, 60, 90];

  const getIVColor = (iv: number): string => {
    const minIV = 10;
    const maxIV = 70;
    const normalized = Math.min(1, Math.max(0, (iv - minIV) / (maxIV - minIV)));

    if (normalized < 0.25) return colors.neon.cyan;
    if (normalized < 0.5) return colors.neon.green;
    if (normalized < 0.75) return colors.neon.yellow;
    return colors.neon.orange;
  };

  const getIVForCell = (strike: number, dte: number): number => {
    const point = surfaceData.find(p => p.strike === strike && p.dte === dte);
    return point?.iv || 0;
  };

  // Calculate skew data (IV at different strikes for fixed DTE)
  const getSkewData = (targetDte: number) => {
    return strikes.map(strike => ({
      strike,
      iv: getIVForCell(strike, targetDte),
    }));
  };

  // Calculate term structure (IV at different DTEs for ATM)
  const getTermData = () => {
    return dtes.map(dte => ({
      dte,
      iv: getIVForCell(0, dte),
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>IV Surface</GradientText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Symbol Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.symbolScroll}
          contentContainerStyle={styles.symbolContent}
        >
          {symbols.map((symbol) => (
            <TouchableOpacity
              key={symbol}
              style={[styles.symbolChip, selectedSymbol === symbol && styles.symbolChipActive]}
              onPress={() => setSelectedSymbol(symbol)}
            >
              <Text style={[styles.symbolText, selectedSymbol === symbol && styles.symbolTextActive]}>
                {symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* View Mode Toggle */}
        <View style={styles.viewToggle}>
          {([
            { id: 'surface', label: '3D Surface', icon: '📊' },
            { id: 'skew', label: 'Vol Skew', icon: '📈' },
            { id: 'term', label: 'Term Structure', icon: '📉' },
          ] as { id: ViewMode; label: string; icon: string }[]).map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.viewButton, viewMode === mode.id && styles.viewButtonActive]}
              onPress={() => setViewMode(mode.id)}
            >
              <Text style={styles.viewIcon}>{mode.icon}</Text>
              <Text style={[styles.viewLabel, viewMode === mode.id && styles.viewLabelActive]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Surface View - Heatmap Grid */}
        {viewMode === 'surface' && (
          <GlassCard style={styles.surfaceCard}>
            <Text style={styles.surfaceTitle}>IV Surface Heatmap</Text>
            <Text style={styles.surfaceSubtitle}>Strike (% from ATM) vs Days to Expiration</Text>

            {/* Y-axis label */}
            <View style={styles.gridContainer}>
              <View style={styles.yAxisLabels}>
                <Text style={styles.axisTitle}>DTE</Text>
                {dtes.map((dte) => (
                  <View key={dte} style={styles.yAxisLabel}>
                    <Text style={styles.axisLabelText}>{dte}</Text>
                  </View>
                ))}
              </View>

              {/* Grid */}
              <View style={styles.grid}>
                {/* X-axis labels */}
                <View style={styles.xAxisRow}>
                  {strikes.map((strike) => (
                    <View key={strike} style={styles.xAxisLabel}>
                      <Text style={styles.axisLabelText}>
                        {strike > 0 ? `+${strike}` : strike}%
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Data cells */}
                {dtes.map((dte) => (
                  <View key={dte} style={styles.gridRow}>
                    {strikes.map((strike) => {
                      const iv = getIVForCell(strike, dte);
                      return (
                        <View
                          key={`${strike}-${dte}`}
                          style={[styles.gridCell, { backgroundColor: getIVColor(iv) }]}
                        >
                          <Text style={styles.cellText}>{iv.toFixed(0)}</Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <Text style={styles.legendLabel}>Low IV</Text>
              <LinearGradient
                colors={[colors.neon.cyan, colors.neon.green, colors.neon.yellow, colors.neon.orange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.legendGradient}
              />
              <Text style={styles.legendLabel}>High IV</Text>
            </View>
          </GlassCard>
        )}

        {/* Skew View - Bar Chart */}
        {viewMode === 'skew' && (
          <GlassCard style={styles.chartCard}>
            <Text style={styles.chartTitle}>Volatility Skew (30 DTE)</Text>
            <Text style={styles.chartSubtitle}>IV across different strikes</Text>

            <View style={styles.barChart}>
              {getSkewData(30).map((point, index) => {
                const maxIV = Math.max(...getSkewData(30).map(p => p.iv));
                const barHeight = (point.iv / maxIV) * 150;

                return (
                  <View key={point.strike} style={styles.barContainer}>
                    <Text style={styles.barValue}>{point.iv.toFixed(1)}</Text>
                    <View style={styles.barWrapper}>
                      <LinearGradient
                        colors={[getIVColor(point.iv), colors.background.tertiary]}
                        style={[styles.bar, { height: barHeight }]}
                      />
                    </View>
                    <Text style={styles.barLabel}>
                      {point.strike > 0 ? `+${point.strike}` : point.strike}%
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.skewInfo}>
              <View style={styles.skewStat}>
                <Text style={styles.skewStatLabel}>Put Skew</Text>
                <Text style={[styles.skewStatValue, { color: colors.bearish }]}>
                  {(getIVForCell(-20, 30) - getIVForCell(0, 30)).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.skewStat}>
                <Text style={styles.skewStatLabel}>ATM IV</Text>
                <Text style={[styles.skewStatValue, { color: colors.neon.green }]}>
                  {getIVForCell(0, 30).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.skewStat}>
                <Text style={styles.skewStatLabel}>Call Skew</Text>
                <Text style={[styles.skewStatValue, { color: colors.bullish }]}>
                  {(getIVForCell(20, 30) - getIVForCell(0, 30)).toFixed(1)}%
                </Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Term Structure View */}
        {viewMode === 'term' && (
          <GlassCard style={styles.chartCard}>
            <Text style={styles.chartTitle}>Term Structure (ATM)</Text>
            <Text style={styles.chartSubtitle}>IV across different expirations</Text>

            <View style={styles.termChart}>
              {getTermData().map((point, index, arr) => {
                const maxIV = Math.max(...arr.map(p => p.iv));
                const minIV = Math.min(...arr.map(p => p.iv));
                const normalizedY = ((point.iv - minIV) / (maxIV - minIV)) * 120 + 20;

                return (
                  <View key={point.dte} style={styles.termPoint}>
                    <View style={[styles.termDot, { bottom: normalizedY }]}>
                      <View style={[styles.termDotInner, { backgroundColor: getIVColor(point.iv) }]} />
                      <Text style={styles.termValue}>{point.iv.toFixed(1)}%</Text>
                    </View>
                    <Text style={styles.termLabel}>{point.dte}d</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.termInfo}>
              <View style={styles.termStat}>
                <Text style={styles.termStatLabel}>7D IV</Text>
                <Text style={styles.termStatValue}>{getIVForCell(0, 7).toFixed(1)}%</Text>
              </View>
              <View style={styles.termStat}>
                <Text style={styles.termStatLabel}>30D IV</Text>
                <Text style={styles.termStatValue}>{getIVForCell(0, 30).toFixed(1)}%</Text>
              </View>
              <View style={styles.termStat}>
                <Text style={styles.termStatLabel}>90D IV</Text>
                <Text style={styles.termStatValue}>{getIVForCell(0, 90).toFixed(1)}%</Text>
              </View>
              <View style={styles.termStat}>
                <Text style={styles.termStatLabel}>Contango</Text>
                <Text style={[
                  styles.termStatValue,
                  { color: getIVForCell(0, 90) > getIVForCell(0, 7) ? colors.bullish : colors.bearish }
                ]}>
                  {getIVForCell(0, 90) > getIVForCell(0, 7) ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Educational Info */}
        <GlassCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>Understanding IV Surface</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>📊</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Volatility Smile</Text>
              <Text style={styles.infoText}>
                OTM options typically have higher IV than ATM options, creating a "smile" pattern.
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>📈</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Put Skew</Text>
              <Text style={styles.infoText}>
                Downside protection is usually more expensive, creating steeper put-side IV.
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoEmoji}>📉</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Term Structure</Text>
              <Text style={styles.infoText}>
                Contango (upward slope) is normal; backwardation often signals near-term events.
              </Text>
            </View>
          </View>
        </GlassCard>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    ...typography.styles.h4,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  symbolScroll: {
    marginBottom: spacing.md,
  },
  symbolContent: {
    gap: spacing.sm,
  },
  symbolChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  symbolChipActive: {
    backgroundColor: colors.overlay.neonGreen,
    borderColor: colors.neon.green,
  },
  symbolText: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  symbolTextActive: {
    color: colors.neon.green,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  viewButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  viewButtonActive: {
    backgroundColor: colors.overlay.neonGreen,
    borderColor: colors.neon.green,
  },
  viewIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  viewLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  viewLabelActive: {
    color: colors.neon.green,
  },
  surfaceCard: {
    marginBottom: spacing.lg,
  },
  surfaceTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  surfaceSubtitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
  },
  yAxisLabels: {
    width: 30,
    marginRight: spacing.xs,
  },
  axisTitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontSize: 10,
  },
  yAxisLabel: {
    height: 28,
    justifyContent: 'center',
  },
  axisLabelText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 9,
    textAlign: 'center',
  },
  grid: {
    flex: 1,
  },
  xAxisRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  xAxisLabel: {
    flex: 1,
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  gridCell: {
    flex: 1,
    height: 26,
    marginHorizontal: 1,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontSize: 9,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  legendLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  legendGradient: {
    width: 100,
    height: 12,
    borderRadius: 6,
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chartTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  chartSubtitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.lg,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: spacing.lg,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barValue: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontSize: 9,
    marginBottom: spacing.xs,
  },
  barWrapper: {
    width: '70%',
    height: 150,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 9,
    marginTop: spacing.xs,
  },
  skewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
    marginTop: spacing.lg,
  },
  skewStat: {
    alignItems: 'center',
  },
  skewStatLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  skewStatValue: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  termChart: {
    flexDirection: 'row',
    height: 180,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  termPoint: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  termDot: {
    position: 'absolute',
    alignItems: 'center',
  },
  termDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  termValue: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },
  termLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
    position: 'absolute',
    bottom: 0,
  },
  termInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  termStat: {
    alignItems: 'center',
  },
  termStatLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  termStatValue: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  infoTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.styles.label,
    color: colors.neon.green,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default OptionsSurface3DScreen;
