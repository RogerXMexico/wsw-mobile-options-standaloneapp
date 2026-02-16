// Profit Calculator for Wall Street Wildlife Mobile
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

type OptionType = 'call' | 'put';
type PositionType = 'buy' | 'sell';

const ProfitCalculatorScreen: React.FC = () => {
  const navigation = useNavigation();

  // Inputs
  const [optionType, setOptionType] = useState<OptionType>('call');
  const [positionType, setPositionType] = useState<PositionType>('buy');
  const [strikePrice, setStrikePrice] = useState('100');
  const [premium, setPremium] = useState('3.50');
  const [quantity, setQuantity] = useState('1');
  const [underlyingPrice, setUnderlyingPrice] = useState('105');

  // Calculations
  const calculations = useMemo(() => {
    const strike = parseFloat(strikePrice) || 0;
    const prem = parseFloat(premium) || 0;
    const qty = parseInt(quantity) || 1;
    const underlying = parseFloat(underlyingPrice) || 0;
    const multiplier = 100; // standard options multiplier

    let intrinsicValue = 0;
    let breakeven = 0;
    let maxProfit = 0;
    let maxLoss = 0;
    let pnl = 0;

    if (optionType === 'call') {
      intrinsicValue = Math.max(underlying - strike, 0);

      if (positionType === 'buy') {
        // Long Call
        breakeven = strike + prem;
        pnl = (intrinsicValue - prem) * multiplier * qty;
        maxProfit = Infinity;
        maxLoss = prem * multiplier * qty;
      } else {
        // Short Call
        breakeven = strike + prem;
        pnl = (prem - intrinsicValue) * multiplier * qty;
        maxProfit = prem * multiplier * qty;
        maxLoss = Infinity;
      }
    } else {
      intrinsicValue = Math.max(strike - underlying, 0);

      if (positionType === 'buy') {
        // Long Put
        breakeven = strike - prem;
        pnl = (intrinsicValue - prem) * multiplier * qty;
        maxProfit = (strike - prem) * multiplier * qty;
        maxLoss = prem * multiplier * qty;
      } else {
        // Short Put
        breakeven = strike - prem;
        pnl = (prem - intrinsicValue) * multiplier * qty;
        maxProfit = prem * multiplier * qty;
        maxLoss = (strike - prem) * multiplier * qty;
      }
    }

    return {
      intrinsicValue,
      breakeven,
      maxProfit,
      maxLoss,
      pnl,
    };
  }, [optionType, positionType, strikePrice, premium, quantity, underlyingPrice]);

  const formatCurrency = (value: number) => {
    if (!isFinite(value)) return 'Unlimited';
    const prefix = value >= 0 ? '+' : '';
    return prefix + '$' + Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCurrencyAbs = (value: number) => {
    if (!isFinite(value)) return 'Unlimited';
    return '$' + value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const isProfitable = calculations.pnl > 0;
  const isBreakeven = calculations.pnl === 0;

  // Visual P&L bar
  const renderPnLBar = () => {
    const maxVal = Math.max(Math.abs(calculations.pnl), 1);
    const barWidth = Math.min(Math.abs(calculations.pnl) / maxVal * 100, 100);

    return (
      <View style={styles.pnlBarContainer}>
        <View style={styles.pnlBar}>
          {calculations.pnl < 0 ? (
            <View style={[styles.pnlBarFill, { width: `${barWidth}%`, backgroundColor: colors.bearish }]} />
          ) : (
            <View style={[styles.pnlBarFill, { width: `${barWidth}%`, backgroundColor: colors.bullish }]} />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Profit Calculator</Text>
          <Text style={styles.headerSubtitle}>Calculate options P&L</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* P&L Result Card */}
        <View style={[
          styles.resultCard,
          { borderColor: isProfitable ? colors.bullish + '50' : isBreakeven ? colors.neon.yellow + '50' : colors.bearish + '50' },
        ]}>
          <View style={styles.resultHeader}>
            <Ionicons
              name={isProfitable ? 'trending-up' : isBreakeven ? 'remove' : 'trending-down'}
              size={22}
              color={isProfitable ? colors.bullish : isBreakeven ? colors.neon.yellow : colors.bearish}
            />
            <Text style={[
              styles.resultStatus,
              { color: isProfitable ? colors.bullish : isBreakeven ? colors.neon.yellow : colors.bearish },
            ]}>
              {isProfitable ? 'In Profit' : isBreakeven ? 'At Breakeven' : 'At Loss'}
            </Text>
          </View>

          <Text style={[
            styles.pnlValue,
            { color: isProfitable ? colors.bullish : isBreakeven ? colors.neon.yellow : colors.bearish },
          ]}>
            {formatCurrency(calculations.pnl)}
          </Text>

          {renderPnLBar()}

          <View style={styles.resultMain}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Breakeven</Text>
              <Text style={styles.resultItemValue}>
                ${calculations.breakeven.toFixed(2)}
              </Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Intrinsic</Text>
              <Text style={styles.resultItemValue}>
                ${calculations.intrinsicValue.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Option Type Toggle */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Option Type</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                optionType === 'call' && styles.toggleButtonActiveCall,
              ]}
              onPress={() => setOptionType('call')}
            >
              <Ionicons
                name="trending-up"
                size={18}
                color={optionType === 'call' ? colors.bullish : colors.text.muted}
              />
              <Text style={[
                styles.toggleButtonText,
                optionType === 'call' && { color: colors.bullish, fontWeight: typography.weights.semibold },
              ]}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                optionType === 'put' && styles.toggleButtonActivePut,
              ]}
              onPress={() => setOptionType('put')}
            >
              <Ionicons
                name="trending-down"
                size={18}
                color={optionType === 'put' ? colors.bearish : colors.text.muted}
              />
              <Text style={[
                styles.toggleButtonText,
                optionType === 'put' && { color: colors.bearish, fontWeight: typography.weights.semibold },
              ]}>
                Put
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Position Type Toggle */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Position</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                positionType === 'buy' && styles.toggleButtonActiveBuy,
              ]}
              onPress={() => setPositionType('buy')}
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color={positionType === 'buy' ? colors.neon.cyan : colors.text.muted}
              />
              <Text style={[
                styles.toggleButtonText,
                positionType === 'buy' && { color: colors.neon.cyan, fontWeight: typography.weights.semibold },
              ]}>
                Buy (Long)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                positionType === 'sell' && styles.toggleButtonActiveSell,
              ]}
              onPress={() => setPositionType('sell')}
            >
              <Ionicons
                name="remove-circle-outline"
                size={18}
                color={positionType === 'sell' ? colors.neon.orange : colors.text.muted}
              />
              <Text style={[
                styles.toggleButtonText,
                positionType === 'sell' && { color: colors.neon.orange, fontWeight: typography.weights.semibold },
              ]}>
                Sell (Short)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Inputs */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Trade Details</Text>

          {/* Strike Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Strike Price</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={strikePrice}
                onChangeText={setStrikePrice}
                keyboardType="decimal-pad"
                placeholder="100.00"
                placeholderTextColor={colors.text.muted}
              />
            </View>
          </View>

          {/* Premium */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Premium (per share)</Text>
              <Text style={styles.inputHint}>
                Cost: {formatCurrencyAbs(parseFloat(premium || '0') * 100 * (parseInt(quantity) || 1))}
              </Text>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={premium}
                onChangeText={setPremium}
                keyboardType="decimal-pad"
                placeholder="3.50"
                placeholderTextColor={colors.text.muted}
              />
            </View>
          </View>

          {/* Current Underlying Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Underlying Price</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={underlyingPrice}
                onChangeText={setUnderlyingPrice}
                keyboardType="decimal-pad"
                placeholder="105.00"
                placeholderTextColor={colors.text.muted}
              />
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Contracts</Text>
            <View style={styles.contractInput}>
              <TouchableOpacity
                style={styles.contractButton}
                onPress={() => setQuantity(String(Math.max(1, (parseInt(quantity) || 1) - 1)))}
              >
                <Text style={styles.contractButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.contractValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.contractButton}
                onPress={() => setQuantity(String((parseInt(quantity) || 1) + 1))}
              >
                <Text style={styles.contractButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="arrow-up-circle" size={22} color={colors.bullish} />
            <Text style={styles.statLabel}>Max Profit</Text>
            <Text style={[styles.statValue, { color: colors.bullish }]}>
              {formatCurrencyAbs(calculations.maxProfit)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="arrow-down-circle" size={22} color={colors.bearish} />
            <Text style={styles.statLabel}>Max Loss</Text>
            <Text style={[styles.statValue, { color: colors.bearish }]}>
              {formatCurrencyAbs(calculations.maxLoss)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="swap-horizontal" size={22} color={colors.neon.yellow} />
            <Text style={styles.statLabel}>Breakeven</Text>
            <Text style={styles.statValue}>
              ${calculations.breakeven.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="diamond" size={22} color={colors.neon.cyan} />
            <Text style={styles.statLabel}>Intrinsic Value</Text>
            <Text style={styles.statValue}>
              ${calculations.intrinsicValue.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Strategy Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Position Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Strategy</Text>
            <Text style={styles.summaryValue}>
              {positionType === 'buy' ? 'Long' : 'Short'} {optionType === 'call' ? 'Call' : 'Put'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Strike</Text>
            <Text style={styles.summaryValue}>${parseFloat(strikePrice || '0').toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Premium Paid/Received</Text>
            <Text style={styles.summaryValue}>${parseFloat(premium || '0').toFixed(2)} per share</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Contracts</Text>
            <Text style={styles.summaryValue}>{quantity}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost/Credit</Text>
            <Text style={[styles.summaryValue, { color: colors.neon.yellow }]}>
              {formatCurrencyAbs(parseFloat(premium || '0') * 100 * (parseInt(quantity) || 1))}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowFinal]}>
            <Text style={[styles.summaryLabel, { color: isProfitable ? colors.bullish : colors.bearish }]}>
              Current P&L
            </Text>
            <Text style={[styles.summaryValue, { color: isProfitable ? colors.bullish : colors.bearish, fontSize: 20 }]}>
              {formatCurrency(calculations.pnl)}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={20} color={colors.neon.yellow} />
            <Text style={styles.tipsTitle}>Quick Reference</Text>
          </View>
          <Text style={styles.tipText}>
            {'\u2022'} <Text style={{ color: colors.bullish }}>Long Call</Text>: Profit when stock rises above breakeven
          </Text>
          <Text style={styles.tipText}>
            {'\u2022'} <Text style={{ color: colors.bearish }}>Long Put</Text>: Profit when stock falls below breakeven
          </Text>
          <Text style={styles.tipText}>
            {'\u2022'} <Text style={{ color: colors.neon.orange }}>Short Call</Text>: Profit limited to premium collected
          </Text>
          <Text style={styles.tipText}>
            {'\u2022'} <Text style={{ color: colors.neon.cyan }}>Short Put</Text>: Profit limited to premium collected
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
  // Result Card
  resultCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 2,
    alignItems: 'center',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  resultStatus: {
    ...typography.styles.label,
    fontWeight: typography.weights.bold,
  },
  pnlValue: {
    fontSize: 40,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  pnlBarContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  pnlBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary,
    overflow: 'hidden',
  },
  pnlBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  resultMain: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
  resultItemValue: {
    ...typography.styles.h5,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  resultDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border.default,
  },
  // Toggle Buttons
  inputSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  toggleButtonActiveCall: {
    backgroundColor: colors.bullish + '15',
    borderColor: colors.bullish,
  },
  toggleButtonActivePut: {
    backgroundColor: colors.bearish + '15',
    borderColor: colors.bearish,
  },
  toggleButtonActiveBuy: {
    backgroundColor: colors.neon.cyan + '15',
    borderColor: colors.neon.cyan,
  },
  toggleButtonActiveSell: {
    backgroundColor: colors.neon.orange + '15',
    borderColor: colors.neon.orange,
  },
  toggleButtonText: {
    ...typography.styles.body,
    color: colors.text.muted,
  },
  // Inputs
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  inputLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputHint: {
    ...typography.styles.caption,
    color: colors.neon.yellow,
  },
  inputWrapper: {
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
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  // Stats Grid
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
    gap: spacing.xs,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  statValue: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  // Summary Card
  summaryCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.xl,
  },
  summaryTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryRowFinal: {
    paddingVertical: spacing.md,
  },
  summaryLabel: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  summaryValue: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.sm,
  },
  // Tips Card
  tipsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tipsTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  tipText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
});

export default ProfitCalculatorScreen;
