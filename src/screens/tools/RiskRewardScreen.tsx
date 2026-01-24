// Risk/Reward Calculator for Wall Street Wildlife Mobile
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RiskRewardScreen: React.FC = () => {
  const navigation = useNavigation();

  // Inputs
  const [entryPrice, setEntryPrice] = useState('3.00');
  const [targetPrice, setTargetPrice] = useState('6.00');
  const [stopLossPrice, setStopLossPrice] = useState('1.50');
  const [contracts, setContracts] = useState('1');
  const [winRate, setWinRate] = useState('50');

  // Calculations
  const calculations = useMemo(() => {
    const entry = parseFloat(entryPrice) || 0;
    const target = parseFloat(targetPrice) || 0;
    const stop = parseFloat(stopLossPrice) || 0;
    const qty = parseInt(contracts) || 1;
    const winPct = parseFloat(winRate) || 50;

    // Profit and loss per contract (×100 for options)
    const maxProfit = (target - entry) * 100 * qty;
    const maxLoss = (entry - stop) * 100 * qty;

    // Risk/Reward ratio
    const riskRewardRatio = maxLoss > 0 ? maxProfit / maxLoss : 0;

    // Breakeven win rate needed
    const breakevenWinRate = riskRewardRatio > 0
      ? (1 / (1 + riskRewardRatio)) * 100
      : 0;

    // Expected value per trade
    const expectedValue = (winPct / 100 * maxProfit) - ((100 - winPct) / 100 * maxLoss);

    // Profit factor (if expected value is positive)
    const profitFactor = (winPct / 100 * maxProfit) / ((100 - winPct) / 100 * maxLoss) || 0;

    return {
      maxProfit,
      maxLoss,
      riskRewardRatio,
      breakevenWinRate,
      expectedValue,
      profitFactor,
    };
  }, [entryPrice, targetPrice, stopLossPrice, contracts, winRate]);

  const formatCurrency = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    return prefix + value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Visual bar for risk/reward
  const renderRiskRewardBar = () => {
    const total = calculations.maxProfit + calculations.maxLoss;
    const profitWidth = total > 0 ? (calculations.maxProfit / total) * 100 : 50;
    const lossWidth = 100 - profitWidth;

    return (
      <View style={styles.rrBarContainer}>
        <View style={styles.rrBar}>
          <View style={[styles.rrBarLoss, { width: `${lossWidth}%` }]} />
          <View style={[styles.rrBarProfit, { width: `${profitWidth}%` }]} />
        </View>
        <View style={styles.rrBarLabels}>
          <Text style={styles.rrBarLabelLoss}>
            -${Math.abs(calculations.maxLoss).toFixed(0)}
          </Text>
          <View style={styles.rrBarCenter}>
            <Text style={styles.rrBarRatio}>
              {calculations.riskRewardRatio.toFixed(2)}:1
            </Text>
          </View>
          <Text style={styles.rrBarLabelProfit}>
            +${calculations.maxProfit.toFixed(0)}
          </Text>
        </View>
      </View>
    );
  };

  const isPositiveEV = calculations.expectedValue > 0;

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
          <Text style={styles.headerTitle}>Risk/Reward</Text>
          <Text style={styles.headerSubtitle}>Analyze trade risk profile</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Result Card */}
        <View style={[
          styles.resultCard,
          { borderColor: isPositiveEV ? colors.bullish + '50' : colors.bearish + '50' }
        ]}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultEmoji}>
              {isPositiveEV ? '✅' : '⚠️'}
            </Text>
            <Text style={[
              styles.resultStatus,
              { color: isPositiveEV ? colors.bullish : colors.bearish }
            ]}>
              {isPositiveEV ? 'Positive Expected Value' : 'Negative Expected Value'}
            </Text>
          </View>

          <View style={styles.resultMain}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Risk/Reward</Text>
              <Text style={[
                styles.resultValue,
                { color: calculations.riskRewardRatio >= 2 ? colors.bullish : colors.neon.yellow }
              ]}>
                {calculations.riskRewardRatio.toFixed(2)}:1
              </Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Expected Value</Text>
              <Text style={[
                styles.resultValue,
                { color: isPositiveEV ? colors.bullish : colors.bearish }
              ]}>
                ${formatCurrency(calculations.expectedValue)}
              </Text>
            </View>
          </View>

          {renderRiskRewardBar()}
        </View>

        {/* Price Inputs */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Trade Setup</Text>

          <View style={styles.priceInputs}>
            {/* Target Price */}
            <View style={styles.priceInputGroup}>
              <Text style={[styles.priceLabel, { color: colors.bullish }]}>
                🎯 Target
              </Text>
              <View style={[styles.priceInputWrapper, { borderColor: colors.bullish + '40' }]}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={targetPrice}
                  onChangeText={setTargetPrice}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.text.muted}
                />
              </View>
              <Text style={[styles.priceChange, { color: colors.bullish }]}>
                +{((parseFloat(targetPrice) / parseFloat(entryPrice) - 1) * 100).toFixed(0)}%
              </Text>
            </View>

            {/* Entry Price */}
            <View style={styles.priceInputGroup}>
              <Text style={[styles.priceLabel, { color: colors.text.secondary }]}>
                📍 Entry
              </Text>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={entryPrice}
                  onChangeText={setEntryPrice}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.text.muted}
                />
              </View>
              <Text style={styles.priceChange}>Current</Text>
            </View>

            {/* Stop Loss */}
            <View style={styles.priceInputGroup}>
              <Text style={[styles.priceLabel, { color: colors.bearish }]}>
                🛑 Stop Loss
              </Text>
              <View style={[styles.priceInputWrapper, { borderColor: colors.bearish + '40' }]}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={stopLossPrice}
                  onChangeText={setStopLossPrice}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.text.muted}
                />
              </View>
              <Text style={[styles.priceChange, { color: colors.bearish }]}>
                {((parseFloat(stopLossPrice) / parseFloat(entryPrice) - 1) * 100).toFixed(0)}%
              </Text>
            </View>
          </View>

          {/* Contracts */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Contracts</Text>
            <View style={styles.contractInput}>
              <TouchableOpacity
                style={styles.contractButton}
                onPress={() => setContracts(String(Math.max(1, parseInt(contracts) - 1)))}
              >
                <Text style={styles.contractButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.contractValue}>{contracts}</Text>
              <TouchableOpacity
                style={styles.contractButton}
                onPress={() => setContracts(String(parseInt(contracts) + 1))}
              >
                <Text style={styles.contractButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Win Rate Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Win Rate Analysis</Text>

          <View style={styles.winRateContainer}>
            <Text style={styles.winRateLabel}>Your Win Rate: {winRate}%</Text>
            <View style={styles.winRateButtons}>
              {[30, 40, 50, 60, 70].map((rate) => (
                <TouchableOpacity
                  key={rate}
                  style={[
                    styles.winRateButton,
                    winRate === String(rate) && styles.winRateButtonActive,
                  ]}
                  onPress={() => setWinRate(String(rate))}
                >
                  <Text style={[
                    styles.winRateButtonText,
                    winRate === String(rate) && styles.winRateButtonTextActive,
                  ]}>
                    {rate}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.breakevenNote}>
              <Text style={styles.breakevenText}>
                Breakeven win rate needed: {' '}
                <Text style={{ color: colors.neon.yellow, fontWeight: typography.weights.bold }}>
                  {calculations.breakevenWinRate.toFixed(1)}%
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statLabel}>Max Profit</Text>
            <Text style={[styles.statValue, { color: colors.bullish }]}>
              +${calculations.maxProfit.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📉</Text>
            <Text style={styles.statLabel}>Max Loss</Text>
            <Text style={[styles.statValue, { color: colors.bearish }]}>
              -${calculations.maxLoss.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⚖️</Text>
            <Text style={styles.statLabel}>Breakeven Win%</Text>
            <Text style={styles.statValue}>
              {calculations.breakevenWinRate.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statLabel}>Profit Factor</Text>
            <Text style={[
              styles.statValue,
              { color: calculations.profitFactor > 1 ? colors.bullish : colors.bearish }
            ]}>
              {calculations.profitFactor.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Risk/Reward Guidelines</Text>
          <Text style={styles.tipText}>
            • <Text style={{ color: colors.bullish }}>2:1 or better</Text> is ideal for most traders
          </Text>
          <Text style={styles.tipText}>
            • Profit Factor above 1.5 indicates a strong edge
          </Text>
          <Text style={styles.tipText}>
            • Always ensure your win rate exceeds the breakeven %
          </Text>
          <Text style={styles.tipText}>
            • Better R:R allows for lower win rates to be profitable
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
  resultCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  resultEmoji: {
    fontSize: 20,
  },
  resultStatus: {
    ...typography.styles.label,
    fontWeight: typography.weights.bold,
  },
  resultMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultItem: {
    flex: 1,
    alignItems: 'center',
  },
  resultLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  resultValue: {
    ...typography.styles.h4,
    fontWeight: typography.weights.bold,
  },
  resultDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.default,
  },
  rrBarContainer: {
    marginTop: spacing.sm,
  },
  rrBar: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  rrBarLoss: {
    backgroundColor: colors.bearish,
  },
  rrBarProfit: {
    backgroundColor: colors.bullish,
  },
  rrBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  rrBarLabelLoss: {
    ...typography.styles.caption,
    color: colors.bearish,
    fontWeight: typography.weights.semibold,
  },
  rrBarLabelProfit: {
    ...typography.styles.caption,
    color: colors.bullish,
    fontWeight: typography.weights.semibold,
  },
  rrBarCenter: {
    alignItems: 'center',
  },
  rrBarRatio: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  priceInputs: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  priceInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  priceLabel: {
    ...typography.styles.body,
    width: 100,
  },
  priceInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  inputPrefix: {
    ...typography.styles.body,
    color: colors.text.muted,
    paddingLeft: spacing.md,
  },
  priceInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
  },
  priceChange: {
    ...typography.styles.caption,
    color: colors.text.muted,
    width: 50,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  contractInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contractButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  contractButtonText: {
    fontSize: 20,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  contractValue: {
    ...typography.styles.h4,
    color: colors.text.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  winRateContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  winRateLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  winRateButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  winRateButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
  },
  winRateButtonActive: {
    backgroundColor: colors.neon.green + '20',
    borderWidth: 1,
    borderColor: colors.neon.green,
  },
  winRateButtonText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  winRateButtonTextActive: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },
  breakevenNote: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  breakevenText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
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

export default RiskRewardScreen;
