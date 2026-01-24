// Practice Dashboard Screen for Wall Street Wildlife Mobile
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, createNeonGlow } from '../../theme';
import { APP_CONFIG } from '../../data/constants';
import { PracticeStackParamList } from '../../navigation/types';

type PracticeNavProp = NativeStackNavigationProp<PracticeStackParamList>;

const PracticeDashboardScreen: React.FC = () => {
  const navigation = useNavigation<PracticeNavProp>();

  // Mock paper trading data
  const accountData = {
    balance: 10450.75,
    startingBalance: APP_CONFIG.paperTradingStartingBalance,
    totalPnl: 450.75,
    todayPnl: 125.50,
    openPositions: 3,
    winRate: 65,
  };

  const pnlColor = accountData.totalPnl >= 0 ? colors.bullish : colors.bearish;
  const todayPnlColor = accountData.todayPnl >= 0 ? colors.bullish : colors.bearish;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice</Text>
        <Text style={styles.headerSubtitle}>Paper trading & strategy builder</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Summary Card */}
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <Text style={styles.accountLabel}>Virtual Account</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <Text style={styles.balanceAmount}>
            ${accountData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>

          <View style={styles.pnlRow}>
            <View style={styles.pnlItem}>
              <Text style={styles.pnlLabel}>Total P&L</Text>
              <Text style={[styles.pnlValue, { color: pnlColor }]}>
                {accountData.totalPnl >= 0 ? '+' : ''}${accountData.totalPnl.toFixed(2)}
              </Text>
            </View>
            <View style={styles.pnlDivider} />
            <View style={styles.pnlItem}>
              <Text style={styles.pnlLabel}>Today</Text>
              <Text style={[styles.pnlValue, { color: todayPnlColor }]}>
                {accountData.todayPnl >= 0 ? '+' : ''}${accountData.todayPnl.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{accountData.openPositions}</Text>
            <Text style={styles.statLabel}>Open Positions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.bullish }]}>
              {accountData.winRate}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionCards}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PaperTrading')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.overlay.neonGreen }]}>
              <Text style={styles.actionEmoji}></Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Paper Trading</Text>
              <Text style={styles.actionDescription}>
                Practice with $10K virtual money
              </Text>
            </View>
            <Text style={styles.actionChevron}></Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('StrategyBuilder')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.overlay.neonCyan }]}>
              <Text style={styles.actionEmoji}></Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Strategy Builder</Text>
              <Text style={styles.actionDescription}>
                Build and visualize custom strategies
              </Text>
            </View>
            <Text style={styles.actionChevron}></Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('TradeJournal')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <Text style={styles.actionEmoji}></Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Trade Journal</Text>
              <Text style={styles.actionDescription}>
                Track and analyze your trades
              </Text>
            </View>
            <Text style={styles.actionChevron}></Text>
          </TouchableOpacity>
        </View>

        {/* Recent Trades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trades</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}></Text>
            <Text style={styles.emptyTitle}>No trades yet</Text>
            <Text style={styles.emptyText}>
              Start paper trading to see your history here
            </Text>
          </View>
        </View>

        {/* Reset Account */}
        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset Virtual Account</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  accountCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.neon,
    ...createNeonGlow(colors.neon.green, 0.1),
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  accountLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.overlay.neonGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.bullish,
  },
  liveText: {
    ...typography.styles.caption,
    color: colors.bullish,
    fontWeight: typography.weights.bold,
    fontSize: 10,
  },
  balanceAmount: {
    ...typography.styles.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pnlItem: {
    flex: 1,
  },
  pnlLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: 2,
  },
  pnlValue: {
    ...typography.styles.h5,
  },
  pnlDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border.default,
    marginHorizontal: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  actionCards: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  actionDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  actionChevron: {
    fontSize: 16,
    color: colors.text.muted,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyState: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  resetButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  resetButtonText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
  },
});

export default PracticeDashboardScreen;
