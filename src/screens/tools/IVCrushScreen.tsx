// IV Crush Calculator Screen
// Calculate the impact of volatility crush on options positions

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
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PositionType = 'long-call' | 'long-put' | 'long-straddle' | 'short-straddle' | 'iron-condor';

interface PositionInfo {
  id: PositionType;
  name: string;
  emoji: string;
  vegaSign: 'positive' | 'negative';
}

const POSITIONS: PositionInfo[] = [
  { id: 'long-call', name: 'Long Call', emoji: '', vegaSign: 'positive' },
  { id: 'long-put', name: 'Long Put', emoji: '', vegaSign: 'positive' },
  { id: 'long-straddle', name: 'Long Straddle', emoji: '', vegaSign: 'positive' },
  { id: 'short-straddle', name: 'Short Straddle', emoji: '', vegaSign: 'negative' },
  { id: 'iron-condor', name: 'Iron Condor', emoji: '', vegaSign: 'negative' },
];

const IVCrushScreen: React.FC = () => {
  const navigation = useNavigation();
  const [position, setPosition] = useState<PositionType>('long-call');
  const [stockPrice, setStockPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(100);
  const [optionPrice, setOptionPrice] = useState(5);
  const [currentIV, setCurrentIV] = useState(50);
  const [expectedIV, setExpectedIV] = useState(25);
  const [daysToExpiry, setDaysToExpiry] = useState(30);

  const positionInfo = POSITIONS.find(p => p.id === position)!;

  const calculations = useMemo(() => {
    const S = stockPrice;
    const K = strikePrice;
    const T = daysToExpiry / 365;
    const sqrtT = Math.sqrt(T);

    // IV change
    const ivChange = expectedIV - currentIV;
    const ivChangePercent = (ivChange / currentIV) * 100;

    // Estimate Vega (simplified)
    const moneyness = S / K;
    const sigma = currentIV / 100;
    const vega = (S * sqrtT / 100) *
      Math.exp(-0.5 * Math.pow((Math.log(moneyness)) / (sigma * sqrtT), 2)) * 0.4;

    // Position Vega multiplier
    let vegaMultiplier = 1;
    switch (position) {
      case 'long-call':
      case 'long-put':
        vegaMultiplier = 1;
        break;
      case 'long-straddle':
        vegaMultiplier = 2;
        break;
      case 'short-straddle':
        vegaMultiplier = -2;
        break;
      case 'iron-condor':
        vegaMultiplier = -0.5;
        break;
    }

    // Vega impact (per 1% IV change)
    const vegaPerPoint = vega * vegaMultiplier;
    const totalVegaImpact = vegaPerPoint * ivChange;

    // New option price estimate
    const newOptionPrice = Math.max(0, optionPrice + totalVegaImpact);

    // P/L calculations
    const pnlDollars = (newOptionPrice - optionPrice) * 100;
    const pnlPercent = ((newOptionPrice - optionPrice) / optionPrice) * 100;

    // Breakeven IV
    const breakevenIV = currentIV;

    // Risk assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (Math.abs(ivChangePercent) > 40) riskLevel = 'high';
    else if (Math.abs(ivChangePercent) > 20) riskLevel = 'medium';

    return {
      ivChange,
      ivChangePercent,
      vega,
      vegaPerPoint,
      totalVegaImpact,
      newOptionPrice,
      pnlDollars,
      pnlPercent,
      breakevenIV,
      riskLevel,
      vegaMultiplier,
    };
  }, [position, stockPrice, strikePrice, optionPrice, currentIV, expectedIV, daysToExpiry]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return colors.error;
      case 'medium': return colors.neon.yellow;
      default: return colors.success;
    }
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return colors.success;
    if (pnl < 0) return colors.error;
    return colors.text.primary;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IV Crush Calculator</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Impact Display */}
        <GlassCard style={styles.mainCard}>
          <Text style={styles.mainLabel}>Estimated P/L from IV Change</Text>
          <Text style={[styles.mainValue, { color: getPnLColor(calculations.pnlDollars) }]}>
            {calculations.pnlDollars >= 0 ? '+' : ''}${calculations.pnlDollars.toFixed(0)}
          </Text>
          <Text style={[styles.mainPercent, { color: getPnLColor(calculations.pnlPercent) }]}>
            ({calculations.pnlPercent >= 0 ? '+' : ''}{calculations.pnlPercent.toFixed(1)}%)
          </Text>

          {/* IV Change Visual */}
          <View style={styles.ivChangeVisual}>
            <View style={styles.ivBox}>
              <Text style={styles.ivBoxLabel}>Current IV</Text>
              <Text style={styles.ivBoxValue}>{currentIV}%</Text>
            </View>
            <View style={styles.ivArrow}>
              <Text style={[
                styles.ivArrowText,
                { color: calculations.ivChange < 0 ? colors.error : colors.success }
              ]}>
                {calculations.ivChange < 0 ? '' : ''}
                {calculations.ivChange < 0 ? '' : '+'}
                {Math.abs(calculations.ivChange)}%
              </Text>
            </View>
            <View style={styles.ivBox}>
              <Text style={styles.ivBoxLabel}>Expected IV</Text>
              <Text style={styles.ivBoxValue}>{expectedIV}%</Text>
            </View>
          </View>
        </GlassCard>

        {/* Position Selector */}
        <Text style={styles.sectionTitle}>Position Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.positionsRow}
        >
          {POSITIONS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.positionPill, position === p.id && styles.positionPillActive]}
              onPress={() => setPosition(p.id)}
            >
              <Text style={styles.positionEmoji}>{p.emoji}</Text>
              <Text style={[styles.positionName, position === p.id && styles.positionNameActive]}>
                {p.name}
              </Text>
              <View style={[
                styles.vegaBadge,
                { backgroundColor: p.vegaSign === 'positive' ? colors.success + '30' : colors.error + '30' }
              ]}>
                <Text style={[
                  styles.vegaBadgeText,
                  { color: p.vegaSign === 'positive' ? colors.success : colors.error }
                ]}>
                  {p.vegaSign === 'positive' ? '+' : '-'}Vega
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Inputs */}
        <GlassCard style={styles.inputsCard}>
          {/* Current IV */}
          <View style={styles.inputRow}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Current IV (Pre-Earnings)</Text>
              <Text style={styles.inputValue}>{Math.round(currentIV)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={150}
              value={currentIV}
              onValueChange={setCurrentIV}
              minimumTrackTintColor={colors.neon.orange}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.orange}
            />
          </View>

          {/* Expected IV */}
          <View style={styles.inputRow}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Expected IV (Post-Earnings)</Text>
              <Text style={styles.inputValue}>{Math.round(expectedIV)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={100}
              value={expectedIV}
              onValueChange={setExpectedIV}
              minimumTrackTintColor={colors.neon.cyan}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.cyan}
            />
          </View>

          {/* Option Price */}
          <View style={styles.inputRow}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Current Option Price</Text>
              <Text style={styles.inputValue}>${optionPrice.toFixed(2)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={30}
              value={optionPrice}
              onValueChange={setOptionPrice}
              minimumTrackTintColor={colors.neon.green}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.green}
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
              maximumValue={60}
              value={daysToExpiry}
              onValueChange={setDaysToExpiry}
              minimumTrackTintColor={colors.neon.purple}
              maximumTrackTintColor={colors.background.tertiary}
              thumbTintColor={colors.neon.purple}
            />
          </View>
        </GlassCard>

        {/* Results Grid */}
        <Text style={styles.sectionTitle}>Crush Analysis</Text>
        <View style={styles.resultsGrid}>
          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>IV Change</Text>
            <Text style={[styles.resultValue, { color: calculations.ivChange < 0 ? colors.error : colors.success }]}>
              {calculations.ivChange >= 0 ? '+' : ''}{calculations.ivChange.toFixed(0)}%
            </Text>
            <Text style={styles.resultSubtext}>
              {Math.abs(calculations.ivChangePercent).toFixed(0)}% drop
            </Text>
          </GlassCard>

          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>Vega Impact</Text>
            <Text style={[styles.resultValue, { color: getPnLColor(calculations.totalVegaImpact) }]}>
              ${calculations.totalVegaImpact.toFixed(2)}
            </Text>
            <Text style={styles.resultSubtext}>per contract</Text>
          </GlassCard>

          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>New Price Est.</Text>
            <Text style={styles.resultValue}>${calculations.newOptionPrice.toFixed(2)}</Text>
            <Text style={styles.resultSubtext}>from ${optionPrice.toFixed(2)}</Text>
          </GlassCard>

          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>Crush Risk</Text>
            <Text style={[styles.resultValue, { color: getRiskColor(calculations.riskLevel) }]}>
              {calculations.riskLevel.charAt(0).toUpperCase() + calculations.riskLevel.slice(1)}
            </Text>
            <Text style={styles.resultSubtext}>
              {positionInfo.vegaSign === 'positive' ? 'Long Vega' : 'Short Vega'}
            </Text>
          </GlassCard>
        </View>

        {/* Position Impact */}
        <GlassCard style={styles.impactCard}>
          <Text style={styles.impactTitle}>
            {positionInfo.emoji} {positionInfo.name} Impact
          </Text>
          <Text style={styles.impactText}>
            {positionInfo.vegaSign === 'positive'
              ? `As a long vega position, you LOSE money when IV drops. The ${Math.abs(calculations.ivChange)}% IV crush would cost approximately $${Math.abs(calculations.pnlDollars).toFixed(0)} per contract.`
              : `As a short vega position, you PROFIT when IV drops. The ${Math.abs(calculations.ivChange)}% IV crush would earn approximately $${Math.abs(calculations.pnlDollars).toFixed(0)} per contract.`
            }
          </Text>
          <View style={[
            styles.impactAlert,
            { backgroundColor: positionInfo.vegaSign === 'positive' && calculations.ivChange < 0 ? colors.error + '20' : colors.success + '20' }
          ]}>
            <Text style={[
              styles.impactAlertText,
              { color: positionInfo.vegaSign === 'positive' && calculations.ivChange < 0 ? colors.error : colors.success }
            ]}>
              {positionInfo.vegaSign === 'positive' && calculations.ivChange < 0
                ? ' Caution: IV crush works against your position'
                : ' Favorable: IV crush benefits your position'
              }
            </Text>
          </View>
        </GlassCard>

        {/* Info Box */}
        <GlassCard style={styles.infoBox}>
          <Text style={styles.infoEmoji}></Text>
          <Text style={styles.infoTitle}>What is IV Crush?</Text>
          <Text style={styles.infoText}>
            IV Crush occurs when implied volatility drops sharply after an anticipated event (like earnings). Options lose value even if the stock moves in your favor. This is why selling options before earnings can be profitable, while buying options is risky.
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
    fontSize: 48,
  },
  mainPercent: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xl,
    marginBottom: spacing.lg,
  },
  ivChangeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: spacing.md,
  },
  ivBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  ivBoxLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: 4,
  },
  ivBoxValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  ivArrow: {
    alignItems: 'center',
  },
  ivArrowText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  positionsRow: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  positionPill: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginRight: spacing.sm,
    minWidth: 100,
  },
  positionPillActive: {
    backgroundColor: colors.overlay.neonGreen,
    borderColor: colors.neon.green,
  },
  positionEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  positionName: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  positionNameActive: {
    color: colors.neon.green,
  },
  vegaBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  vegaBadgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
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
  resultSubtext: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  impactCard: {
    marginBottom: spacing.lg,
  },
  impactTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  impactText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  impactAlert: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  impactAlertText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
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
  bottomSpacer: {
    height: 40,
  },
});

export default IVCrushScreen;
