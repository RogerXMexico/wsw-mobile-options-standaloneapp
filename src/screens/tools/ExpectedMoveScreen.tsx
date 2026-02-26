// Expected Move Calculator Screen
// Calculate the implied price range based on options pricing

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard, PremiumModal } from '../../components/ui';
import { useSubscription } from '../../hooks/useSubscription';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TimeframeType = 'daily' | 'weekly' | 'monthly' | 'custom';

interface TimeframeInfo {
  id: TimeframeType;
  name: string;
  days: number;
}

const TIMEFRAMES: TimeframeInfo[] = [
  { id: 'daily', name: '1 Day', days: 1 },
  { id: 'weekly', name: '1 Week', days: 7 },
  { id: 'monthly', name: '1 Month', days: 30 },
  { id: 'custom', name: 'Custom', days: 0 },
];

const ExpectedMoveScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [stockPrice, setStockPrice] = useState(100);
  const [iv, setIV] = useState(30);
  const [timeframe, setTimeframe] = useState<TimeframeType>('weekly');
  const [customDays, setCustomDays] = useState(14);

  const getDays = () => {
    if (timeframe === 'custom') return customDays;
    return TIMEFRAMES.find(t => t.id === timeframe)?.days || 7;
  };

  const calculations = useMemo(() => {
    const S = stockPrice;
    const sigma = iv / 100;
    const days = getDays();
    const T = days / 365;
    const sqrtT = Math.sqrt(T);

    // Expected move (1 standard deviation)
    const oneSD = S * sigma * sqrtT;
    const twoSD = oneSD * 2;

    // Price ranges
    const upper1SD = S + oneSD;
    const lower1SD = S - oneSD;
    const upper2SD = S + twoSD;
    const lower2SD = S - twoSD;

    // Percentage moves
    const percentMove1SD = (oneSD / S) * 100;
    const percentMove2SD = (twoSD / S) * 100;

    // Probabilities
    const prob1SD = 68.2; // 1 standard deviation
    const prob2SD = 95.4; // 2 standard deviations

    // Daily vs annualized
    const dailyMove = S * sigma * Math.sqrt(1 / 365);
    const annualizedMove = S * sigma;

    return {
      oneSD,
      twoSD,
      upper1SD,
      lower1SD,
      upper2SD,
      lower2SD,
      percentMove1SD,
      percentMove2SD,
      prob1SD,
      prob2SD,
      dailyMove,
      annualizedMove,
      days,
    };
  }, [stockPrice, iv, timeframe, customDays]);

  // Visualization data
  const chartWidth = SCREEN_WIDTH - spacing.md * 4;
  const priceRange = calculations.upper2SD - calculations.lower2SD;
  const currentPricePosition = ((stockPrice - calculations.lower2SD) / priceRange) * chartWidth;

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Expected Move</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.lockedContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.neon.green} />
          <Text style={styles.lockedTitle}>Premium Feature</Text>
          <Text style={styles.lockedMessage}>Unlock this tool with a premium subscription</Text>
          <TouchableOpacity style={styles.unlockButton} onPress={() => setShowPremiumModal(true)}>
            <Text style={styles.unlockButtonText}>Unlock Now</Text>
          </TouchableOpacity>
        </View>
        <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} featureName="Expected Move Calculator" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expected Move</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Display */}
        <GlassCard style={styles.mainCard}>
          <Text style={styles.mainLabel}>{calculations.days}-Day Expected Move</Text>
          <Text style={styles.mainValue}>
            ${calculations.lower1SD.toFixed(2)} - ${calculations.upper1SD.toFixed(2)}
          </Text>
          <Text style={styles.mainSubtext}>
            {calculations.prob1SD}% probability within this range
          </Text>

          {/* Visual Range */}
          <View style={styles.rangeVisual}>
            {/* 2SD Range */}
            <View style={styles.rangeBar2SD}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.1)']}
                style={styles.rangeGradient}
              />
            </View>
            {/* 1SD Range */}
            <View style={styles.rangeBar1SD}>
              <LinearGradient
                colors={[colors.neon.green, colors.neon.cyan]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.rangeGradient}
              />
            </View>
            {/* Current Price Marker */}
            <View style={[styles.priceMarker, { left: currentPricePosition - 2 }]} />
          </View>

          {/* Range Labels */}
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>${calculations.lower2SD.toFixed(0)}</Text>
            <Text style={styles.rangeLabel}>${calculations.lower1SD.toFixed(0)}</Text>
            <Text style={[styles.rangeLabel, styles.currentLabel]}>${stockPrice.toFixed(0)}</Text>
            <Text style={styles.rangeLabel}>${calculations.upper1SD.toFixed(0)}</Text>
            <Text style={styles.rangeLabel}>${calculations.upper2SD.toFixed(0)}</Text>
          </View>
        </GlassCard>

        {/* Timeframe Selector */}
        <Text style={styles.sectionTitle}>Timeframe</Text>
        <View style={styles.timeframeRow}>
          {TIMEFRAMES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.timeframePill, timeframe === t.id && styles.timeframePillActive]}
              onPress={() => setTimeframe(t.id)}
            >
              <Text style={[styles.timeframeText, timeframe === t.id && styles.timeframeTextActive]}>
                {t.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Days Slider */}
        {timeframe === 'custom' && (
          <GlassCard style={styles.customCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Custom Days</Text>
              <Text style={styles.inputValue}>{Math.round(customDays)} days</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={90}
              value={customDays}
              onValueChange={setCustomDays}
              minimumTrackTintColor={colors.neon.purple}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.purple}
            />
          </GlassCard>
        )}

        {/* Inputs */}
        <GlassCard style={styles.inputsCard}>
          {/* Stock Price */}
          <View style={styles.inputRow}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Stock Price</Text>
              <Text style={styles.inputValue}>${stockPrice.toFixed(2)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={500}
              value={stockPrice}
              onValueChange={setStockPrice}
              minimumTrackTintColor={colors.neon.green}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.green}
            />
          </View>

          {/* IV */}
          <View style={styles.inputRow}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Implied Volatility</Text>
              <Text style={styles.inputValue}>{Math.round(iv)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={150}
              value={iv}
              onValueChange={setIV}
              minimumTrackTintColor={colors.neon.orange}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.orange}
            />
          </View>
        </GlassCard>

        {/* Results Grid */}
        <Text style={styles.sectionTitle}>Move Analysis</Text>
        <View style={styles.resultsGrid}>
          <GlassCard style={styles.resultCard}>
            <Ionicons name="analytics-outline" size={24} color={colors.neon.green} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.resultLabel}>1 SD Move</Text>
            <Text style={[styles.resultValue, { color: colors.neon.green }]}>
              {calculations.percentMove1SD.toFixed(1)}%
            </Text>
            <Text style={styles.resultSubtext}>${calculations.oneSD.toFixed(2)}</Text>
          </GlassCard>

          <GlassCard style={styles.resultCard}>
            <Ionicons name="swap-horizontal-outline" size={24} color={colors.neon.purple} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.resultLabel}>2 SD Move</Text>
            <Text style={[styles.resultValue, { color: colors.neon.purple }]}>
              {calculations.percentMove2SD.toFixed(1)}%
            </Text>
            <Text style={styles.resultSubtext}>${calculations.twoSD.toFixed(2)}</Text>
          </GlassCard>

          <GlassCard style={styles.resultCard}>
            <Ionicons name="trending-up" size={24} color={colors.neon.cyan} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.resultLabel}>Daily Move</Text>
            <Text style={[styles.resultValue, { color: colors.neon.cyan }]}>
              ${calculations.dailyMove.toFixed(2)}
            </Text>
            <Text style={styles.resultSubtext}>
              {((calculations.dailyMove / stockPrice) * 100).toFixed(2)}%
            </Text>
          </GlassCard>

          <GlassCard style={styles.resultCard}>
            <Ionicons name="calendar-outline" size={24} color={colors.neon.yellow} style={{ marginBottom: spacing.xs }} />
            <Text style={styles.resultLabel}>Annual Move</Text>
            <Text style={[styles.resultValue, { color: colors.neon.yellow }]}>
              ${calculations.annualizedMove.toFixed(2)}
            </Text>
            <Text style={styles.resultSubtext}>{iv}% (IV)</Text>
          </GlassCard>
        </View>

        {/* Probability Breakdown */}
        <GlassCard style={styles.probCard}>
          <Text style={styles.probTitle}>Probability Zones</Text>

          <View style={styles.probRow}>
            <View style={[styles.probDot, { backgroundColor: colors.neon.green }]} />
            <Text style={styles.probLabel}>Within 1 SD</Text>
            <Text style={styles.probPercent}>{calculations.prob1SD}%</Text>
          </View>

          <View style={styles.probRow}>
            <View style={[styles.probDot, { backgroundColor: colors.neon.purple }]} />
            <Text style={styles.probLabel}>Within 2 SD</Text>
            <Text style={styles.probPercent}>{calculations.prob2SD}%</Text>
          </View>

          <View style={styles.probRow}>
            <View style={[styles.probDot, { backgroundColor: colors.error }]} />
            <Text style={styles.probLabel}>Beyond 2 SD</Text>
            <Text style={styles.probPercent}>{(100 - calculations.prob2SD).toFixed(1)}%</Text>
          </View>
        </GlassCard>

        {/* Info Box */}
        <GlassCard style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={32} color={colors.text.secondary} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.infoTitle}>Expected Move Formula</Text>
          <Text style={styles.infoFormula}>
            EM = Stock Price x IV x {'\u221A'}(Days / 365)
          </Text>
          <Text style={styles.infoText}>
            The expected move represents one standard deviation of price movement implied by options prices. About 68% of the time, the stock should stay within this range by expiration.
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
  mainValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.neon.green,
    marginBottom: spacing.xs,
  },
  mainSubtext: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  rangeVisual: {
    width: '100%',
    height: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  rangeBar2SD: {
    position: 'absolute',
    width: '100%',
    height: 16,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  rangeBar1SD: {
    position: 'absolute',
    width: '50%',
    height: 24,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  rangeGradient: {
    flex: 1,
  },
  priceMarker: {
    position: 'absolute',
    width: 4,
    height: 40,
    backgroundColor: colors.text.primary,
    borderRadius: 2,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rangeLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  currentLabel: {
    color: colors.text.primary,
    fontFamily: typography.fonts.bold,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  timeframeRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  timeframePill: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    alignItems: 'center',
  },
  timeframePillActive: {
    backgroundColor: colors.overlay.neonGreen,
    borderColor: colors.neon.green,
  },
  timeframeText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  timeframeTextActive: {
    color: colors.neon.green,
  },
  customCard: {
    marginBottom: spacing.md,
  },
  inputsCard: {
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
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  resultCard: {
    width: (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2 - 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  resultLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: 4,
  },
  resultValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  resultSubtext: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  probCard: {
    marginBottom: spacing.lg,
  },
  probTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  probRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  probDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  probLabel: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  probPercent: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.cyan,
    marginBottom: spacing.sm,
  },
  infoFormula: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.yellow,
    backgroundColor: colors.overlay.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  infoText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  lockedTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  lockedMessage: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  unlockButton: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  unlockButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.background.primary,
  },
});

export default ExpectedMoveScreen;
