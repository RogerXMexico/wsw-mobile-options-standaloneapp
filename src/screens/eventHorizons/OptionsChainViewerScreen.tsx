// Event Horizons - Options Chain Viewer Screen
// View options chain with expected move visualization

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearnStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<LearnStackParamList, 'OptionsChainViewer'>;

interface OptionData {
  strike: number;
  callBid: number;
  callAsk: number;
  callVolume: number;
  callOI: number;
  callIV: number;
  putBid: number;
  putAsk: number;
  putVolume: number;
  putOI: number;
  putIV: number;
}

const generateMockOptionsChain = (stockPrice: number): OptionData[] => {
  const strikes: OptionData[] = [];
  const baseStrike = Math.round(stockPrice / 5) * 5;

  for (let i = -5; i <= 5; i++) {
    const strike = baseStrike + i * 5;
    const moneyness = (strike - stockPrice) / stockPrice;

    // Calculate realistic-ish option prices
    const baseCallPrice = Math.max(0, stockPrice - strike) + Math.random() * 5 + 2;
    const basePutPrice = Math.max(0, strike - stockPrice) + Math.random() * 5 + 2;

    strikes.push({
      strike,
      callBid: Math.max(0.01, baseCallPrice - 0.1).toFixed(2) as unknown as number,
      callAsk: (baseCallPrice + 0.1).toFixed(2) as unknown as number,
      callVolume: Math.floor(Math.random() * 5000 + 100),
      callOI: Math.floor(Math.random() * 20000 + 500),
      callIV: (35 + Math.abs(moneyness) * 50 + Math.random() * 10).toFixed(1) as unknown as number,
      putBid: Math.max(0.01, basePutPrice - 0.1).toFixed(2) as unknown as number,
      putAsk: (basePutPrice + 0.1).toFixed(2) as unknown as number,
      putVolume: Math.floor(Math.random() * 5000 + 100),
      putOI: Math.floor(Math.random() * 20000 + 500),
      putIV: (35 + Math.abs(moneyness) * 50 + Math.random() * 10).toFixed(1) as unknown as number,
    });
  }

  return strikes;
};

const stockData: Record<string, { price: number; expectedMove: number; daysToExpiry: number }> = {
  AAPL: { price: 185.50, expectedMove: 4.2, daysToExpiry: 5 },
  MSFT: { price: 378.25, expectedMove: 3.8, daysToExpiry: 5 },
  TSLA: { price: 215.80, expectedMove: 8.5, daysToExpiry: 5 },
  META: { price: 385.40, expectedMove: 6.2, daysToExpiry: 5 },
  AMZN: { price: 155.20, expectedMove: 5.1, daysToExpiry: 5 },
  GOOGL: { price: 141.75, expectedMove: 4.5, daysToExpiry: 5 },
  NVDA: { price: 545.60, expectedMove: 9.2, daysToExpiry: 5 },
};

const OptionsChainViewerScreen: React.FC<Props> = ({ navigation, route }) => {
  const ticker = route.params?.ticker || 'AAPL';
  const stock = stockData[ticker] || stockData.AAPL;

  const [viewMode, setViewMode] = useState<'chain' | 'straddle'>('chain');
  const [selectedExpiry, setSelectedExpiry] = useState('Jan 26');

  const optionsChain = generateMockOptionsChain(stock.price);
  const atmStrike = Math.round(stock.price / 5) * 5;

  const expectedMoveUp = stock.price * (1 + stock.expectedMove / 100);
  const expectedMoveDown = stock.price * (1 - stock.expectedMove / 100);

  const getStrikeColor = (strike: number) => {
    if (strike >= expectedMoveDown && strike <= expectedMoveUp) {
      return 'rgba(139, 92, 246, 0.2)'; // Within expected move
    }
    return 'transparent';
  };

  const isATM = (strike: number) => Math.abs(strike - stock.price) < 2.5;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{ticker} Options</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Stock Info */}
      <LinearGradient
        colors={['rgba(139, 92, 246, 0.15)', 'rgba(20, 184, 166, 0.15)']}
        style={styles.stockInfo}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.stockRow}>
          <View>
            <Text style={styles.stockTicker}>{ticker}</Text>
            <Text style={styles.stockPrice}>${stock.price.toFixed(2)}</Text>
          </View>
          <View style={styles.expectedMoveContainer}>
            <Text style={styles.expectedMoveLabel}>Expected Move</Text>
            <Text style={styles.expectedMoveValue}>±{stock.expectedMove}%</Text>
            <Text style={styles.expectedMoveRange}>
              ${expectedMoveDown.toFixed(2)} - ${expectedMoveUp.toFixed(2)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Expiry Selection */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.expiryRow}>
        {['Jan 19', 'Jan 26', 'Feb 2', 'Feb 9', 'Feb 16', 'Mar 15'].map((expiry) => (
          <TouchableOpacity
            key={expiry}
            style={[styles.expiryChip, selectedExpiry === expiry && styles.expiryChipActive]}
            onPress={() => setSelectedExpiry(expiry)}
          >
            <Text style={[styles.expiryText, selectedExpiry === expiry && styles.expiryTextActive]}>
              {expiry}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* View Mode Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'chain' && styles.toggleButtonActive]}
          onPress={() => setViewMode('chain')}
        >
          <Text style={[styles.toggleText, viewMode === 'chain' && styles.toggleTextActive]}>
            Chain
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'straddle' && styles.toggleButtonActive]}
          onPress={() => setViewMode('straddle')}
        >
          <Text style={[styles.toggleText, viewMode === 'straddle' && styles.toggleTextActive]}>
            Straddle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Options Chain */}
      <ScrollView style={styles.chainContainer}>
        {viewMode === 'chain' ? (
          <>
            {/* Column Headers */}
            <View style={styles.chainHeader}>
              <View style={styles.callColumn}>
                <Text style={styles.columnHeader}>Bid</Text>
                <Text style={styles.columnHeader}>Ask</Text>
                <Text style={styles.columnHeader}>IV</Text>
              </View>
              <View style={styles.strikeColumn}>
                <Text style={styles.columnHeaderStrike}>Strike</Text>
              </View>
              <View style={styles.putColumn}>
                <Text style={styles.columnHeader}>Bid</Text>
                <Text style={styles.columnHeader}>Ask</Text>
                <Text style={styles.columnHeader}>IV</Text>
              </View>
            </View>

            {/* Options Rows */}
            {optionsChain.map((option) => (
              <View
                key={option.strike}
                style={[
                  styles.optionRow,
                  { backgroundColor: getStrikeColor(option.strike) },
                  isATM(option.strike) && styles.atmRow,
                ]}
              >
                <View style={styles.callColumn}>
                  <Text style={styles.bidText}>{option.callBid}</Text>
                  <Text style={styles.askText}>{option.callAsk}</Text>
                  <Text style={styles.ivText}>{option.callIV}%</Text>
                </View>
                <View style={[styles.strikeColumn, isATM(option.strike) && styles.atmStrikeColumn]}>
                  <Text style={[styles.strikeText, isATM(option.strike) && styles.atmStrikeText]}>
                    {option.strike}
                  </Text>
                  {isATM(option.strike) && <Text style={styles.atmLabel}>ATM</Text>}
                </View>
                <View style={styles.putColumn}>
                  <Text style={styles.bidText}>{option.putBid}</Text>
                  <Text style={styles.askText}>{option.putAsk}</Text>
                  <Text style={styles.ivText}>{option.putIV}%</Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            {/* Straddle View */}
            <View style={styles.straddleInfo}>
              <Text style={styles.straddleTitle}>Straddle Analysis</Text>
              <Text style={styles.straddleSubtitle}>
                Buy ATM call + put to profit from large move in either direction
              </Text>
            </View>

            {optionsChain.map((option) => {
              const straddleCost = Number(option.callAsk) + Number(option.putAsk);
              const breakEvenUp = option.strike + straddleCost;
              const breakEvenDown = option.strike - straddleCost;
              const impliedMove = (straddleCost / stock.price) * 100;

              return (
                <TouchableOpacity
                  key={option.strike}
                  style={[
                    styles.straddleRow,
                    { backgroundColor: getStrikeColor(option.strike) },
                    isATM(option.strike) && styles.atmRow,
                  ]}
                >
                  <View style={styles.straddleStrike}>
                    <Text style={[styles.strikeText, isATM(option.strike) && styles.atmStrikeText]}>
                      ${option.strike}
                    </Text>
                    {isATM(option.strike) && <Text style={styles.atmLabel}>ATM</Text>}
                  </View>
                  <View style={styles.straddleDetails}>
                    <View style={styles.straddleMetric}>
                      <Text style={styles.straddleLabel}>Cost</Text>
                      <Text style={styles.straddleValue}>${straddleCost.toFixed(2)}</Text>
                    </View>
                    <View style={styles.straddleMetric}>
                      <Text style={styles.straddleLabel}>Implied Move</Text>
                      <Text style={[
                        styles.straddleValue,
                        { color: impliedMove > stock.expectedMove ? colors.neon.orange : colors.neon.green }
                      ]}>
                        ±{impliedMove.toFixed(1)}%
                      </Text>
                    </View>
                    <View style={styles.straddleMetric}>
                      <Text style={styles.straddleLabel}>Break-evens</Text>
                      <Text style={styles.straddleBreakeven}>
                        ${breakEvenDown.toFixed(0)} / ${breakEvenUp.toFixed(0)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]} />
            <Text style={styles.legendText}>Within expected move range</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { borderWidth: 1, borderColor: colors.eventHorizons.secondary }]} />
            <Text style={styles.legendText}>At-the-money (ATM)</Text>
          </View>
        </View>

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
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.eventHorizons.primary,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },
  stockInfo: {
    margin: spacing.md,
    marginBottom: 0,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockTicker: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  stockPrice: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.lg,
    color: colors.neon.green,
    marginTop: 4,
  },
  expectedMoveContainer: {
    alignItems: 'flex-end',
  },
  expectedMoveLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  expectedMoveValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.eventHorizons.primary,
  },
  expectedMoveRange: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  expiryRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  expiryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  expiryChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: colors.eventHorizons.primary,
  },
  expiryText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  expiryTextActive: {
    color: colors.eventHorizons.primary,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.overlay.light,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: colors.eventHorizons.primary,
  },
  toggleText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  toggleTextActive: {
    color: colors.text.primary,
  },
  chainContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  chainHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
    marginBottom: 4,
  },
  callColumn: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  strikeColumn: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  putColumn: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  columnHeader: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    flex: 1,
    textAlign: 'center',
  },
  columnHeaderStrike: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  optionRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  atmRow: {
    borderWidth: 1,
    borderColor: colors.eventHorizons.secondary,
    borderRadius: 4,
    marginVertical: 2,
  },
  atmStrikeColumn: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
  },
  bidText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.neon.green,
    flex: 1,
    textAlign: 'center',
  },
  askText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.error,
    flex: 1,
    textAlign: 'center',
  },
  ivText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    flex: 1,
    textAlign: 'center',
  },
  strikeText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  atmStrikeText: {
    color: colors.eventHorizons.secondary,
  },
  atmLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: colors.eventHorizons.secondary,
    marginTop: 2,
  },
  straddleInfo: {
    padding: spacing.md,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  straddleTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  straddleSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: 4,
  },
  straddleRow: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  straddleStrike: {
    width: 80,
    justifyContent: 'center',
  },
  straddleDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  straddleMetric: {
    alignItems: 'center',
  },
  straddleLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: 4,
  },
  straddleValue: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  straddleBreakeven: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  legend: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  legendBox: {
    width: 20,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default OptionsChainViewerScreen;
