// Event Horizons Paper Trading Screen
// Practice trading YES/NO shares on prediction market events
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { GlowButton } from '../../components/ui';
import { EventHorizonsStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;

interface Position {
  id: string;
  eventTitle: string;
  ticker: string;
  side: 'yes' | 'no';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  eventDate: string;
}

interface Trade {
  id: string;
  eventTitle: string;
  ticker: string;
  side: 'yes' | 'no';
  shares: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  date: string;
}

// Mock data
const MOCK_POSITIONS: Position[] = [
  {
    id: '1',
    eventTitle: 'NVDA Q4 Earnings Beat',
    ticker: 'NVDA',
    side: 'yes',
    shares: 50,
    entryPrice: 0.72,
    currentPrice: 0.78,
    eventDate: '2025-02-26',
  },
  {
    id: '2',
    eventTitle: 'Fed Rate Cut March',
    ticker: 'SPY',
    side: 'no',
    shares: 100,
    entryPrice: 0.65,
    currentPrice: 0.58,
    eventDate: '2025-03-19',
  },
];

const MOCK_TRADES: Trade[] = [
  {
    id: '1',
    eventTitle: 'AAPL Q4 Beat',
    ticker: 'AAPL',
    side: 'yes',
    shares: 75,
    entryPrice: 0.68,
    exitPrice: 1.0,
    pnl: 24.0,
    date: '2025-01-15',
  },
  {
    id: '2',
    eventTitle: 'TSLA Delivery Miss',
    ticker: 'TSLA',
    side: 'no',
    shares: 50,
    entryPrice: 0.55,
    exitPrice: 0.42,
    pnl: -6.5,
    date: '2025-01-10',
  },
];

const EventHorizonsPaperTradingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

  // Calculate portfolio stats
  const balance = 1000; // Starting balance
  const positionsValue = MOCK_POSITIONS.reduce(
    (sum, p) => sum + p.shares * p.currentPrice,
    0
  );
  const unrealizedPnL = MOCK_POSITIONS.reduce(
    (sum, p) => sum + (p.currentPrice - p.entryPrice) * p.shares,
    0
  );
  const realizedPnL = MOCK_TRADES.reduce((sum, t) => sum + t.pnl, 0);
  const totalPnL = unrealizedPnL + realizedPnL;
  const winRate =
    MOCK_TRADES.length > 0
      ? (MOCK_TRADES.filter((t) => t.pnl > 0).length / MOCK_TRADES.length) * 100
      : 0;

  const handleClosePosition = (position: Position) => {
    Alert.alert(
      'Close Position',
      `Close ${position.shares} ${position.side.toUpperCase()} shares of "${position.eventTitle}" at $${position.currentPrice.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Close', onPress: () => console.log('Position closed') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Paper Trading</Text>
          <Text style={styles.headerSubtitle}>Prediction Markets</Text>
        </View>
        <TouchableOpacity
          style={styles.newTradeButton}
          onPress={() => navigation.navigate('PredictionScanner')}
        >
          <Text style={styles.newTradeText}>+ Trade</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Portfolio Summary */}
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.2)', 'rgba(20, 184, 166, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.portfolioCard}
        >
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioLabel}>Portfolio Value</Text>
            <Text style={styles.portfolioValue}>
              ${(balance + positionsValue).toFixed(2)}
            </Text>
          </View>

          <View style={styles.portfolioStats}>
            <View style={styles.portfolioStat}>
              <Text style={styles.statLabel}>Unrealized P&L</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: unrealizedPnL >= 0 ? colors.bullish : colors.bearish },
                ]}
              >
                {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)}
              </Text>
            </View>
            <View style={styles.portfolioStat}>
              <Text style={styles.statLabel}>Realized P&L</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: realizedPnL >= 0 ? colors.bullish : colors.bearish },
                ]}
              >
                {realizedPnL >= 0 ? '+' : ''}${realizedPnL.toFixed(2)}
              </Text>
            </View>
            <View style={styles.portfolioStat}>
              <Text style={styles.statLabel}>Win Rate</Text>
              <Text style={[styles.statValue, { color: '#14b8a6' }]}>
                {winRate.toFixed(0)}%
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'positions' && styles.tabActive]}
            onPress={() => setActiveTab('positions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'positions' && styles.tabTextActive,
              ]}
            >
              Open Positions ({MOCK_POSITIONS.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.tabTextActive,
              ]}
            >
              History ({MOCK_TRADES.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'positions' ? (
          <View style={styles.positionsContainer}>
            {MOCK_POSITIONS.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📈</Text>
                <Text style={styles.emptyTitle}>No Open Positions</Text>
                <Text style={styles.emptyText}>
                  Find events in the Prediction Scanner and start trading!
                </Text>
                <GlowButton
                  title="Open Scanner"
                  onPress={() => navigation.navigate('PredictionScanner')}
                  variant="primary"
                  style={{ marginTop: spacing.lg }}
                />
              </View>
            ) : (
              MOCK_POSITIONS.map((position) => {
                const pnl = (position.currentPrice - position.entryPrice) * position.shares;
                const pnlPercent =
                  ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100;

                return (
                  <View key={position.id} style={styles.positionCard}>
                    <View style={styles.positionHeader}>
                      <View style={styles.positionInfo}>
                        <View style={styles.tickerRow}>
                          <Text style={styles.positionTicker}>{position.ticker}</Text>
                          <View
                            style={[
                              styles.sideBadge,
                              {
                                backgroundColor:
                                  position.side === 'yes'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : 'rgba(239, 68, 68, 0.2)',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.sideText,
                                {
                                  color:
                                    position.side === 'yes' ? colors.bullish : colors.bearish,
                                },
                              ]}
                            >
                              {position.side.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.positionTitle} numberOfLines={1}>
                          {position.eventTitle}
                        </Text>
                      </View>
                      <View style={styles.pnlContainer}>
                        <Text
                          style={[
                            styles.pnlValue,
                            { color: pnl >= 0 ? colors.bullish : colors.bearish },
                          ]}
                        >
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                        </Text>
                        <Text
                          style={[
                            styles.pnlPercent,
                            { color: pnl >= 0 ? colors.bullish : colors.bearish },
                          ]}
                        >
                          {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%
                        </Text>
                      </View>
                    </View>

                    <View style={styles.positionDetails}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Shares</Text>
                        <Text style={styles.detailValue}>{position.shares}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Entry</Text>
                        <Text style={styles.detailValue}>
                          ${position.entryPrice.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Current</Text>
                        <Text style={styles.detailValue}>
                          ${position.currentPrice.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Event</Text>
                        <Text style={styles.detailValue}>{position.eventDate}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => handleClosePosition(position)}
                    >
                      <Text style={styles.closeButtonText}>Close Position</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        ) : (
          <View style={styles.historyContainer}>
            {MOCK_TRADES.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyTitle}>No Trade History</Text>
                <Text style={styles.emptyText}>
                  Your closed trades will appear here.
                </Text>
              </View>
            ) : (
              MOCK_TRADES.map((trade) => (
                <View key={trade.id} style={styles.tradeCard}>
                  <View style={styles.tradeHeader}>
                    <View style={styles.tradeInfo}>
                      <View style={styles.tickerRow}>
                        <Text style={styles.tradeTicker}>{trade.ticker}</Text>
                        <View
                          style={[
                            styles.sideBadge,
                            {
                              backgroundColor:
                                trade.side === 'yes'
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : 'rgba(239, 68, 68, 0.2)',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.sideText,
                              {
                                color:
                                  trade.side === 'yes' ? colors.bullish : colors.bearish,
                              },
                            ]}
                          >
                            {trade.side.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.tradeTitle} numberOfLines={1}>
                        {trade.eventTitle}
                      </Text>
                      <Text style={styles.tradeDate}>{trade.date}</Text>
                    </View>
                    <View style={styles.tradePnl}>
                      <Text
                        style={[
                          styles.tradePnlValue,
                          { color: trade.pnl >= 0 ? colors.bullish : colors.bearish },
                        ]}
                      >
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </Text>
                      <View
                        style={[
                          styles.resultBadge,
                          {
                            backgroundColor:
                              trade.pnl >= 0
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.resultText,
                            { color: trade.pnl >= 0 ? colors.bullish : colors.bearish },
                          ]}
                        >
                          {trade.pnl >= 0 ? 'WIN' : 'LOSS'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.tradeDetails}>
                    <Text style={styles.tradeDetailText}>
                      {trade.shares} shares • Entry: ${trade.entryPrice.toFixed(2)} →
                      Exit: ${trade.exitPrice.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: spacing['3xl'] }} />
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
  },
  newTradeButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  newTradeText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: '#8b5cf6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  portfolioCard: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  portfolioHeader: {
    marginBottom: spacing.md,
  },
  portfolioLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  portfolioValue: {
    fontSize: typography.sizes['3xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portfolioStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.background.card,
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.text.primary,
  },
  positionsContainer: {
    gap: spacing.md,
  },
  positionCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  positionInfo: {
    flex: 1,
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  positionTicker: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  sideBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sideText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
  },
  positionTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  pnlContainer: {
    alignItems: 'flex-end',
  },
  pnlValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
  },
  pnlPercent: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  closeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  closeButtonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.bearish,
  },
  historyContainer: {
    gap: spacing.md,
  },
  tradeCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  tradeInfo: {
    flex: 1,
  },
  tradeTicker: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  tradeTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  tradeDate: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  tradePnl: {
    alignItems: 'flex-end',
  },
  tradePnlValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    marginBottom: 4,
  },
  resultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  resultText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
  },
  tradeDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: spacing.sm,
  },
  tradeDetailText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    textAlign: 'center',
  },
});

export default EventHorizonsPaperTradingScreen;
