// Position Sizing Calculator for Wall Street Wildlife Mobile
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
import { colors, typography, spacing, borderRadius } from '../../theme';

const PositionSizingScreen: React.FC = () => {
  const navigation = useNavigation();

  // Inputs
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercent, setRiskPercent] = useState('2');
  const [optionPrice, setOptionPrice] = useState('3.50');
  const [stopLossPercent, setStopLossPercent] = useState('50');

  // Calculations
  const calculations = useMemo(() => {
    const account = parseFloat(accountSize) || 0;
    const risk = parseFloat(riskPercent) || 0;
    const price = parseFloat(optionPrice) || 0;
    const stopLoss = parseFloat(stopLossPercent) || 0;

    // Max risk in dollars
    const maxRiskDollars = account * (risk / 100);

    // Risk per contract (assuming stop loss percentage)
    const riskPerContract = price * 100 * (stopLoss / 100);

    // Number of contracts
    const contracts = riskPerContract > 0
      ? Math.floor(maxRiskDollars / riskPerContract)
      : 0;

    // Total position cost
    const totalCost = contracts * price * 100;

    // Percent of account
    const percentOfAccount = account > 0 ? (totalCost / account) * 100 : 0;

    return {
      maxRiskDollars,
      riskPerContract,
      contracts,
      totalCost,
      percentOfAccount,
    };
  }, [accountSize, riskPercent, optionPrice, stopLossPercent]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
          <Text style={styles.headerTitle}>Position Sizing</Text>
          <Text style={styles.headerSubtitle}>Calculate optimal position size</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Result Card */}
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Recommended Contracts</Text>
          <Text style={styles.resultValue}>{calculations.contracts}</Text>
          <View style={styles.resultDetails}>
            <View style={styles.resultDetailItem}>
              <Text style={styles.resultDetailLabel}>Total Cost</Text>
              <Text style={styles.resultDetailValue}>
                ${formatCurrency(calculations.totalCost)}
              </Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultDetailItem}>
              <Text style={styles.resultDetailLabel}>% of Account</Text>
              <Text style={styles.resultDetailValue}>
                {calculations.percentOfAccount.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          {/* Account Size */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Account Size ($)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={accountSize}
                onChangeText={setAccountSize}
                keyboardType="numeric"
                placeholder="10000"
                placeholderTextColor={colors.text.muted}
              />
            </View>
          </View>

          {/* Risk Percentage */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Risk Per Trade (%)</Text>
              <Text style={styles.inputHint}>
                = ${formatCurrency(calculations.maxRiskDollars)}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <View style={styles.percentButtons}>
                {[1, 2, 3, 5].map((percent) => (
                  <TouchableOpacity
                    key={percent}
                    style={[
                      styles.percentButton,
                      riskPercent === String(percent) && styles.percentButtonActive,
                    ]}
                    onPress={() => setRiskPercent(String(percent))}
                  >
                    <Text style={[
                      styles.percentButtonText,
                      riskPercent === String(percent) && styles.percentButtonTextActive,
                    ]}>
                      {percent}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Trade Settings */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Trade Settings</Text>

          {/* Option Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Option Price (per share)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefix}>$</Text>
              <TextInput
                style={styles.input}
                value={optionPrice}
                onChangeText={setOptionPrice}
                keyboardType="decimal-pad"
                placeholder="3.50"
                placeholderTextColor={colors.text.muted}
              />
            </View>
            <Text style={styles.inputHelp}>
              Cost per contract: ${formatCurrency(parseFloat(optionPrice || '0') * 100)}
            </Text>
          </View>

          {/* Stop Loss */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Stop Loss (%)</Text>
              <Text style={styles.inputHint}>
                = ${formatCurrency(calculations.riskPerContract)} per contract
              </Text>
            </View>
            <View style={styles.percentButtons}>
              {[25, 50, 75, 100].map((percent) => (
                <TouchableOpacity
                  key={percent}
                  style={[
                    styles.percentButton,
                    stopLossPercent === String(percent) && styles.percentButtonActive,
                  ]}
                  onPress={() => setStopLossPercent(String(percent))}
                >
                  <Text style={[
                    styles.percentButtonText,
                    stopLossPercent === String(percent) && styles.percentButtonTextActive,
                  ]}>
                    {percent}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Risk Warning */}
        <View style={styles.warningCard}>
          <Text style={styles.warningEmoji}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Risk Management Tips</Text>
            <Text style={styles.warningText}>
              • Most pros risk only 1-2% per trade{'\n'}
              • Never risk more than 5% on a single position{'\n'}
              • Options can lose 100% - size accordingly{'\n'}
              • Consider spreads for defined risk
            </Text>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Calculation Breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Account Size</Text>
            <Text style={styles.breakdownValue}>${formatCurrency(parseFloat(accountSize) || 0)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>× Risk Percent</Text>
            <Text style={styles.breakdownValue}>{riskPercent}%</Text>
          </View>
          <View style={[styles.breakdownRow, styles.breakdownRowHighlight]}>
            <Text style={styles.breakdownLabel}>= Max Risk ($)</Text>
            <Text style={[styles.breakdownValue, { color: colors.neon.yellow }]}>
              ${formatCurrency(calculations.maxRiskDollars)}
            </Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Option Cost</Text>
            <Text style={styles.breakdownValue}>
              ${formatCurrency(parseFloat(optionPrice || '0') * 100)}/contract
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>× Stop Loss</Text>
            <Text style={styles.breakdownValue}>{stopLossPercent}%</Text>
          </View>
          <View style={[styles.breakdownRow, styles.breakdownRowHighlight]}>
            <Text style={styles.breakdownLabel}>= Risk/Contract</Text>
            <Text style={[styles.breakdownValue, { color: colors.neon.yellow }]}>
              ${formatCurrency(calculations.riskPerContract)}
            </Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={[styles.breakdownRow, styles.breakdownRowFinal]}>
            <Text style={[styles.breakdownLabel, { color: colors.neon.green }]}>
              Max Contracts
            </Text>
            <Text style={[styles.breakdownValue, { color: colors.neon.green, fontSize: 24 }]}>
              {calculations.contracts}
            </Text>
          </View>
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
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.neon.green + '40',
  },
  resultLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  resultValue: {
    fontSize: 64,
    fontWeight: typography.weights.bold,
    color: colors.neon.green,
    marginBottom: spacing.md,
  },
  resultDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  resultDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  resultDetailLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  resultDetailValue: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  resultDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border.default,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
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
  inputHelp: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  sliderContainer: {
    marginTop: spacing.sm,
  },
  percentButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  percentButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  percentButtonActive: {
    backgroundColor: colors.neon.green + '20',
    borderColor: colors.neon.green,
  },
  percentButtonText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  percentButtonTextActive: {
    color: colors.neon.green,
    fontWeight: typography.weights.semibold,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.neon.yellow + '10',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.neon.yellow + '30',
    gap: spacing.md,
  },
  warningEmoji: {
    fontSize: 24,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    ...typography.styles.label,
    color: colors.neon.yellow,
    marginBottom: spacing.sm,
  },
  warningText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  breakdownCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  breakdownTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  breakdownRowHighlight: {
    backgroundColor: colors.background.tertiary,
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  breakdownRowFinal: {
    paddingVertical: spacing.md,
  },
  breakdownLabel: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  breakdownValue: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.sm,
  },
});

export default PositionSizingScreen;
