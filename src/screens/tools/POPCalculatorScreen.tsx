// POP Calculator Screen - Probability of Profit
// Calculate the probability of profit for different options strategies

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

type StrategyType = 'long-call' | 'long-put' | 'short-call' | 'short-put' | 'credit-spread' | 'debit-spread';

interface StrategyInfo {
  id: StrategyType;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const STRATEGIES: StrategyInfo[] = [
  { id: 'long-call', name: 'Long Call', icon: 'trending-up', description: 'Buy call option' },
  { id: 'long-put', name: 'Long Put', icon: 'trending-down', description: 'Buy put option' },
  { id: 'short-call', name: 'Short Call', icon: 'arrow-down-outline', description: 'Sell call option' },
  { id: 'short-put', name: 'Short Put', icon: 'arrow-up-outline', description: 'Sell put option' },
  { id: 'credit-spread', name: 'Credit Spread', icon: 'cash-outline', description: 'Sell spread for credit' },
  { id: 'debit-spread', name: 'Debit Spread', icon: 'card-outline', description: 'Buy spread for debit' },
];

// Simplified normal CDF approximation
const normalCDF = (x: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
};

const POPCalculatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [strategy, setStrategy] = useState<StrategyType>('short-put');
  const [stockPrice, setStockPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(95);
  const [premium, setPremium] = useState(2);
  const [daysToExpiry, setDaysToExpiry] = useState(30);
  const [iv, setIV] = useState(30);

  // Calculate POP based on strategy
  const calculations = useMemo(() => {
    const S = stockPrice;
    const K = strikePrice;
    const T = daysToExpiry / 365;
    const sigma = iv / 100;
    const sqrtT = Math.sqrt(T);

    // Standard deviation of price movement
    const stdDev = S * sigma * sqrtT;

    // Calculate d2 (distance to strike in standard deviations)
    const d2 = (Math.log(S / K) + (-0.5 * sigma * sigma) * T) / (sigma * sqrtT);

    let pop = 0;
    let breakeven = 0;
    let maxProfit = 0;
    let maxLoss = 0;
    let explanation = '';

    switch (strategy) {
      case 'long-call':
        breakeven = K + premium;
        pop = 1 - normalCDF((Math.log(S / breakeven) + (-0.5 * sigma * sigma) * T) / (sigma * sqrtT));
        pop = Math.max(0, Math.min(1, 1 - pop));
        maxProfit = Infinity;
        maxLoss = premium * 100;
        explanation = `Stock must rise above $${breakeven.toFixed(2)} to profit`;
        break;

      case 'long-put':
        breakeven = K - premium;
        pop = normalCDF((Math.log(S / breakeven) + (-0.5 * sigma * sigma) * T) / (sigma * sqrtT));
        pop = Math.max(0, Math.min(1, 1 - pop));
        maxProfit = (K - premium) * 100;
        maxLoss = premium * 100;
        explanation = `Stock must fall below $${breakeven.toFixed(2)} to profit`;
        break;

      case 'short-call':
        breakeven = K + premium;
        pop = normalCDF((Math.log(S / breakeven) + (-0.5 * sigma * sigma) * T) / (sigma * sqrtT));
        pop = Math.max(0, Math.min(1, pop));
        maxProfit = premium * 100;
        maxLoss = Infinity;
        explanation = `Profit if stock stays below $${breakeven.toFixed(2)}`;
        break;

      case 'short-put':
        breakeven = K - premium;
        pop = 1 - normalCDF((Math.log(S / breakeven) + (-0.5 * sigma * sigma) * T) / (sigma * sqrtT));
        pop = Math.max(0, Math.min(1, pop));
        maxProfit = premium * 100;
        maxLoss = (K - premium) * 100;
        explanation = `Profit if stock stays above $${breakeven.toFixed(2)}`;
        break;

      case 'credit-spread':
        breakeven = K - premium;
        pop = 1 - normalCDF((Math.log(S / breakeven) + (-0.5 * sigma * sigma) * T) / (sigma * sqrtT));
        pop = Math.max(0, Math.min(1, pop));
        maxProfit = premium * 100;
        maxLoss = (5 - premium) * 100; // Assuming $5 wide spread
        explanation = `Profit if stock stays above $${breakeven.toFixed(2)}`;
        break;

      case 'debit-spread':
        breakeven = K + premium;
        pop = 1 - normalCDF((Math.log(S / breakeven) + (-0.5 * sigma * sigma) * T) / (sigma * sqrtT));
        pop = Math.max(0, Math.min(1, 1 - pop));
        maxProfit = (5 - premium) * 100; // Assuming $5 wide spread
        maxLoss = premium * 100;
        explanation = `Stock must rise above $${breakeven.toFixed(2)} to profit`;
        break;
    }

    // Expected move
    const expectedMove = S * sigma * sqrtT;
    const upTarget = S + expectedMove;
    const downTarget = S - expectedMove;

    return {
      pop: pop * 100,
      breakeven,
      maxProfit,
      maxLoss,
      explanation,
      expectedMove,
      upTarget,
      downTarget,
      stdDev,
    };
  }, [strategy, stockPrice, strikePrice, premium, daysToExpiry, iv]);

  const getPOPColor = (pop: number) => {
    if (pop >= 70) return colors.success;
    if (pop >= 50) return colors.neon.yellow;
    return colors.error;
  };

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>POP Calculator</Text>
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
        <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} featureName="POP Calculator" />
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
        <Text style={styles.headerTitle}>POP Calculator</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* POP Display */}
        <GlassCard style={styles.popCard}>
          <Text style={styles.popLabel}>Probability of Profit</Text>
          <Text style={[styles.popValue, { color: getPOPColor(calculations.pop) }]}>
            {calculations.pop.toFixed(1)}%
          </Text>
          <View style={styles.popBar}>
            <LinearGradient
              colors={[colors.error, colors.neon.yellow, colors.success]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.popBarGradient}
            />
            <View
              style={[
                styles.popIndicator,
                { left: `${Math.min(100, Math.max(0, calculations.pop))}%` },
              ]}
            />
          </View>
          <Text style={styles.popExplanation}>{calculations.explanation}</Text>
        </GlassCard>

        {/* Strategy Selector */}
        <Text style={styles.sectionTitle}>Strategy</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.strategiesRow}
        >
          {STRATEGIES.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.strategyPill, strategy === s.id && styles.strategyPillActive]}
              onPress={() => setStrategy(s.id)}
            >
              <Ionicons name={s.icon} size={16} color={strategy === s.id ? colors.neon.green : colors.text.secondary} />
              <Text style={[styles.strategyName, strategy === s.id && styles.strategyNameActive]}>
                {s.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
              minimumValue={50}
              maximumValue={200}
              value={stockPrice}
              onValueChange={setStockPrice}
              minimumTrackTintColor={colors.neon.green}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.green}
            />
          </View>

          {/* Strike Price */}
          <View style={styles.inputRow}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Strike Price</Text>
              <Text style={styles.inputValue}>${strikePrice.toFixed(2)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={200}
              value={strikePrice}
              onValueChange={setStrikePrice}
              minimumTrackTintColor={colors.neon.cyan}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.cyan}
            />
          </View>

          {/* Premium */}
          <View style={styles.inputRow}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Premium</Text>
              <Text style={styles.inputValue}>${premium.toFixed(2)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={20}
              value={premium}
              onValueChange={setPremium}
              minimumTrackTintColor={colors.neon.yellow}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.yellow}
            />
          </View>

          {/* Days to Expiry */}
          <View style={styles.inputRow}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Days to Expiry</Text>
              <Text style={styles.inputValue}>{Math.round(daysToExpiry)} DTE</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={90}
              value={daysToExpiry}
              onValueChange={setDaysToExpiry}
              minimumTrackTintColor={colors.neon.purple}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.purple}
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
              minimumValue={10}
              maximumValue={100}
              value={iv}
              onValueChange={setIV}
              minimumTrackTintColor={colors.neon.orange}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.orange}
            />
          </View>
        </GlassCard>

        {/* Results */}
        <Text style={styles.sectionTitle}>Trade Analysis</Text>
        <View style={styles.resultsGrid}>
          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>Breakeven</Text>
            <Text style={styles.resultValue}>${calculations.breakeven.toFixed(2)}</Text>
          </GlassCard>
          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>Max Profit</Text>
            <Text style={[styles.resultValue, { color: colors.success }]}>
              {calculations.maxProfit === Infinity ? '' : `$${calculations.maxProfit.toFixed(0)}`}
            </Text>
          </GlassCard>
          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>Max Loss</Text>
            <Text style={[styles.resultValue, { color: colors.error }]}>
              {calculations.maxLoss === Infinity ? '' : `$${calculations.maxLoss.toFixed(0)}`}
            </Text>
          </GlassCard>
          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>Expected Move</Text>
            <Text style={styles.resultValue}>
              ${calculations.downTarget.toFixed(0)} - ${calculations.upTarget.toFixed(0)}
            </Text>
          </GlassCard>
        </View>

        {/* Info Box */}
        <GlassCard style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={32} color={colors.text.secondary} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.infoTitle}>What is POP?</Text>
          <Text style={styles.infoText}>
            Probability of Profit (POP) estimates the likelihood that your trade will be profitable at expiration. Higher POP trades typically have lower max profit potential, while lower POP trades offer higher potential returns but with more risk.
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
  popCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  popLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  popValue: {
    fontFamily: typography.fonts.bold,
    fontSize: 56,
    marginBottom: spacing.md,
  },
  popBar: {
    width: '100%',
    height: 12,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.md,
  },
  popBarGradient: {
    flex: 1,
  },
  popIndicator: {
    position: 'absolute',
    top: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.text.primary,
    borderWidth: 3,
    borderColor: colors.background.primary,
    marginLeft: -10,
  },
  popExplanation: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  strategiesRow: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  strategyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  strategyPillActive: {
    backgroundColor: colors.overlay.neonGreen,
    borderColor: colors.neon.green,
  },
  strategyName: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  strategyNameActive: {
    color: colors.neon.green,
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
    fontSize: typography.sizes.lg,
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

export default POPCalculatorScreen;
