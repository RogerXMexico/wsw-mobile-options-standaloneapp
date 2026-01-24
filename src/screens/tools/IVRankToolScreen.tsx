// IV Rank Tool Screen
// Compare current IV to historical ranges

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock popular stocks with typical IV ranges
const POPULAR_STOCKS = [
  { symbol: 'SPY', name: 'S&P 500 ETF', low52: 12, high52: 35, current: 18 },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', low52: 15, high52: 40, current: 22 },
  { symbol: 'AAPL', name: 'Apple Inc', low52: 18, high52: 45, current: 25 },
  { symbol: 'TSLA', name: 'Tesla Inc', low52: 35, high52: 90, current: 55 },
  { symbol: 'NVDA', name: 'Nvidia Corp', low52: 30, high52: 75, current: 48 },
  { symbol: 'AMD', name: 'AMD', low52: 35, high52: 80, current: 52 },
  { symbol: 'META', name: 'Meta Platforms', low52: 25, high52: 60, current: 35 },
  { symbol: 'AMZN', name: 'Amazon', low52: 22, high52: 50, current: 30 },
];

interface IVAnalysis {
  ivRank: number;
  ivPercentile: number;
  interpretation: string;
  strategy: string;
  emoji: string;
}

const IVRankToolScreen: React.FC = () => {
  const navigation = useNavigation();
  const [mode, setMode] = useState<'manual' | 'presets'>('presets');
  const [selectedStock, setSelectedStock] = useState(POPULAR_STOCKS[0]);
  const [currentIV, setCurrentIV] = useState(25);
  const [low52Week, setLow52Week] = useState(15);
  const [high52Week, setHigh52Week] = useState(50);

  // Use either preset or manual values
  const ivValues = mode === 'presets'
    ? { current: selectedStock.current, low: selectedStock.low52, high: selectedStock.high52 }
    : { current: currentIV, low: low52Week, high: high52Week };

  const analysis = useMemo((): IVAnalysis => {
    const { current, low, high } = ivValues;
    const range = high - low;

    // IV Rank: Where current IV sits in the 52-week range (0-100%)
    const ivRank = range > 0 ? ((current - low) / range) * 100 : 50;

    // IV Percentile (simplified - using rank as proxy)
    const ivPercentile = ivRank;

    let interpretation = '';
    let strategy = '';
    let emoji = '';

    if (ivRank < 20) {
      interpretation = 'IV is very low relative to its 52-week range. Options are cheap.';
      strategy = 'Consider buying options (long calls, long puts, straddles). Premium is discounted.';
      emoji = '';
    } else if (ivRank < 40) {
      interpretation = 'IV is below average. Options are relatively inexpensive.';
      strategy = 'Lean towards buying strategies. Good time for debit spreads.';
      emoji = '';
    } else if (ivRank < 60) {
      interpretation = 'IV is around its average. Options are fairly priced.';
      strategy = 'Either buying or selling can work. Focus on directional thesis.';
      emoji = '';
    } else if (ivRank < 80) {
      interpretation = 'IV is elevated. Options are expensive.';
      strategy = 'Lean towards selling premium. Credit spreads and iron condors favored.';
      emoji = '';
    } else {
      interpretation = 'IV is very high. Options are expensive. Fear is elevated.';
      strategy = 'Strong edge in selling premium. Be aware of potential large moves.';
      emoji = '';
    }

    return {
      ivRank: Math.max(0, Math.min(100, ivRank)),
      ivPercentile: Math.max(0, Math.min(100, ivPercentile)),
      interpretation,
      strategy,
      emoji,
    };
  }, [ivValues]);

  const getIVRankColor = (rank: number) => {
    if (rank < 30) return colors.neon.green;
    if (rank < 70) return colors.neon.yellow;
    return colors.error;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IV Rank Tool</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Display */}
        <GlassCard style={styles.mainCard}>
          <Text style={styles.mainLabel}>
            {mode === 'presets' ? selectedStock.symbol : 'Custom'} IV Rank
          </Text>
          <Text style={styles.mainEmoji}>{analysis.emoji}</Text>
          <Text style={[styles.mainValue, { color: getIVRankColor(analysis.ivRank) }]}>
            {analysis.ivRank.toFixed(0)}%
          </Text>

          {/* IV Gauge */}
          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeTrack}>
              <LinearGradient
                colors={[colors.neon.green, colors.neon.yellow, colors.error]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gaugeGradient}
              />
              <View
                style={[
                  styles.gaugeIndicator,
                  { left: `${analysis.ivRank}%` },
                ]}
              />
            </View>
            <View style={styles.gaugeLabels}>
              <Text style={styles.gaugeLabelLow}>0% (Low)</Text>
              <Text style={styles.gaugeLabelMid}>50%</Text>
              <Text style={styles.gaugeLabelHigh}>100% (High)</Text>
            </View>
          </View>

          {/* IV Range Display */}
          <View style={styles.ivRangeRow}>
            <View style={styles.ivRangeItem}>
              <Text style={styles.ivRangeLabel}>52W Low</Text>
              <Text style={[styles.ivRangeValue, { color: colors.neon.green }]}>
                {ivValues.low}%
              </Text>
            </View>
            <View style={styles.ivRangeItem}>
              <Text style={styles.ivRangeLabel}>Current</Text>
              <Text style={[styles.ivRangeValue, { color: colors.text.primary }]}>
                {ivValues.current}%
              </Text>
            </View>
            <View style={styles.ivRangeItem}>
              <Text style={styles.ivRangeLabel}>52W High</Text>
              <Text style={[styles.ivRangeValue, { color: colors.error }]}>
                {ivValues.high}%
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'presets' && styles.modeButtonActive]}
            onPress={() => setMode('presets')}
          >
            <Text style={[styles.modeText, mode === 'presets' && styles.modeTextActive]}>
              Popular Stocks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'manual' && styles.modeButtonActive]}
            onPress={() => setMode('manual')}
          >
            <Text style={[styles.modeText, mode === 'manual' && styles.modeTextActive]}>
              Manual Entry
            </Text>
          </TouchableOpacity>
        </View>

        {/* Preset Stocks */}
        {mode === 'presets' && (
          <View style={styles.stocksGrid}>
            {POPULAR_STOCKS.map((stock) => {
              const isSelected = selectedStock.symbol === stock.symbol;
              const stockRank = ((stock.current - stock.low52) / (stock.high52 - stock.low52)) * 100;

              return (
                <TouchableOpacity
                  key={stock.symbol}
                  style={[styles.stockCard, isSelected && styles.stockCardSelected]}
                  onPress={() => setSelectedStock(stock)}
                >
                  <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                  <Text style={styles.stockName}>{stock.name}</Text>
                  <View style={styles.stockIVRow}>
                    <Text style={styles.stockIVLabel}>IV:</Text>
                    <Text style={[styles.stockIVValue, { color: getIVRankColor(stockRank) }]}>
                      {stock.current}%
                    </Text>
                  </View>
                  <View style={styles.stockRankBar}>
                    <View
                      style={[
                        styles.stockRankFill,
                        {
                          width: `${stockRank}%`,
                          backgroundColor: getIVRankColor(stockRank),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.stockRankText}>Rank: {stockRank.toFixed(0)}%</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Manual Entry */}
        {mode === 'manual' && (
          <GlassCard style={styles.manualCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>Current IV</Text>
                <Text style={styles.inputValue}>{Math.round(currentIV)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={150}
                value={currentIV}
                onValueChange={setCurrentIV}
                minimumTrackTintColor={colors.neon.cyan}
                maximumTrackTintColor={colors.background.tertiary}
                thumbTintColor={colors.neon.cyan}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>52-Week Low IV</Text>
                <Text style={styles.inputValue}>{Math.round(low52Week)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={100}
                value={low52Week}
                onValueChange={setLow52Week}
                minimumTrackTintColor={colors.neon.green}
                maximumTrackTintColor={colors.background.tertiary}
                thumbTintColor={colors.neon.green}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputHeader}>
                <Text style={styles.inputLabel}>52-Week High IV</Text>
                <Text style={styles.inputValue}>{Math.round(high52Week)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={20}
                maximumValue={200}
                value={high52Week}
                onValueChange={setHigh52Week}
                minimumTrackTintColor={colors.error}
                maximumTrackTintColor={colors.background.tertiary}
                thumbTintColor={colors.error}
              />
            </View>
          </GlassCard>
        )}

        {/* Analysis */}
        <Text style={styles.sectionTitle}>Analysis</Text>
        <GlassCard style={styles.analysisCard}>
          <Text style={styles.analysisInterpretation}>{analysis.interpretation}</Text>
          <View style={styles.strategyBox}>
            <Text style={styles.strategyLabel}> Suggested Strategy</Text>
            <Text style={styles.strategyText}>{analysis.strategy}</Text>
          </View>
        </GlassCard>

        {/* Quick Guide */}
        <Text style={styles.sectionTitle}>IV Rank Guide</Text>
        <GlassCard style={styles.guideCard}>
          <View style={styles.guideRow}>
            <View style={[styles.guideDot, { backgroundColor: colors.neon.green }]} />
            <View style={styles.guideContent}>
              <Text style={styles.guideRange}>0-30%</Text>
              <Text style={styles.guideText}>Low IV - Options are cheap. Consider buying.</Text>
            </View>
          </View>
          <View style={styles.guideRow}>
            <View style={[styles.guideDot, { backgroundColor: colors.neon.yellow }]} />
            <View style={styles.guideContent}>
              <Text style={styles.guideRange}>30-70%</Text>
              <Text style={styles.guideText}>Average IV - Options fairly priced. Either direction.</Text>
            </View>
          </View>
          <View style={styles.guideRow}>
            <View style={[styles.guideDot, { backgroundColor: colors.error }]} />
            <View style={styles.guideContent}>
              <Text style={styles.guideRange}>70-100%</Text>
              <Text style={styles.guideText}>High IV - Options expensive. Consider selling.</Text>
            </View>
          </View>
        </GlassCard>

        {/* Info Box */}
        <GlassCard style={styles.infoBox}>
          <Text style={styles.infoEmoji}></Text>
          <Text style={styles.infoTitle}>IV Rank vs IV Percentile</Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>IV Rank</Text> shows where current IV sits in the 52-week high/low range.{'\n\n'}
            <Text style={styles.infoBold}>IV Percentile</Text> shows what percentage of days had lower IV.{'\n\n'}
            Both help identify cheap or expensive options, but IV Rank is more commonly used.
          </Text>
        </GlassCard>

        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.neon.green,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  mainCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mainLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  mainEmoji: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  mainValue: {
    fontFamily: typography.fonts.bold,
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  gaugeContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  gaugeTrack: {
    height: 16,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  gaugeGradient: {
    flex: 1,
  },
  gaugeIndicator: {
    position: 'absolute',
    top: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.text.primary,
    borderWidth: 4,
    borderColor: colors.background.primary,
    marginLeft: -14,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  gaugeLabelLow: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.neon.green,
  },
  gaugeLabelMid: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  gaugeLabelHigh: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.error,
  },
  ivRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  ivRangeItem: {
    alignItems: 'center',
  },
  ivRangeLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: 2,
  },
  ivRangeValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  modeToggle: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  modeButtonActive: {
    backgroundColor: colors.neon.green,
  },
  modeText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  modeTextActive: {
    color: colors.background.primary,
  },
  stocksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  stockCard: {
    width: (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2 - 1,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: spacing.md,
  },
  stockCardSelected: {
    borderColor: colors.neon.green,
    backgroundColor: colors.overlay.neonGreen,
  },
  stockSymbol: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  stockName: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  stockIVRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  stockIVLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  stockIVValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  stockRankBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  stockRankFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  stockRankText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  manualCard: {
    marginBottom: spacing.lg,
  },
  inputRow: {
    marginBottom: spacing.md,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  inputLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  inputValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  analysisCard: {
    marginBottom: spacing.lg,
  },
  analysisInterpretation: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  strategyBox: {
    backgroundColor: colors.overlay.neonGreen,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  strategyLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.neon.green,
    marginBottom: spacing.xs,
  },
  strategyText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  guideCard: {
    marginBottom: spacing.lg,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  guideDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  guideContent: {
    flex: 1,
  },
  guideRange: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    marginBottom: 2,
  },
  guideText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.cyan,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBold: {
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default IVRankToolScreen;
