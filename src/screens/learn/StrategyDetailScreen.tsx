// Strategy Detail Screen for Wall Street Wildlife Mobile
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LearnStackParamList, LearnStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius, createNeonGlow, getTierColor, getOutlookColor } from '../../theme';
import { TIER_INFO } from '../../data/constants';
import { getStrategyById, getStrategyConfig } from '../../data/strategies';
import { PayoffChart } from '../../components/charts/PayoffChart';

const { width } = Dimensions.get('window');

type NavigationProp = LearnStackScreenProps<'StrategyDetail'>['navigation'];
type RouteProps = RouteProp<LearnStackParamList, 'StrategyDetail'>;

const StrategyDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { strategyId } = route.params;

  const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'example'>('overview');

  // Load strategy data
  const strategy = useMemo(() => getStrategyById(strategyId), [strategyId]);
  const strategyConfig = useMemo(() => getStrategyConfig(strategyId), [strategyId]);

  // Fallback for missing strategy
  if (!strategy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Strategy not found</Text>
          <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonLargeText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const tierInfo = TIER_INFO[strategy.tier] || TIER_INFO[0];
  const tierColor = getTierColor(strategy.tier);
  const outlookColor = getOutlookColor(strategy.outlook);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}> Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Text style={styles.bookmarkIcon}></Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.badges}>
            <View style={[styles.tierBadge, { backgroundColor: tierColor }]}>
              <Text style={styles.tierBadgeText}>Tier {strategy.tier}</Text>
            </View>
            <View style={[styles.outlookBadge, { backgroundColor: `${outlookColor}20` }]}>
              <Text style={[styles.outlookBadgeText, { color: outlookColor }]}>
                {strategy.outlook}
              </Text>
            </View>
            <View style={[styles.categoryBadge]}>
              <Text style={styles.categoryBadgeText}>{strategy.category}</Text>
            </View>
          </View>
          <Text style={styles.strategyName}>{strategy.name}</Text>
          <Text style={styles.strategyTierName}>{tierInfo.name}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Risk</Text>
            <Text style={styles.statValue}>{strategy.riskLevel}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Category</Text>
            <Text style={styles.statValue}>{strategy.category}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Access</Text>
            <Text style={[styles.statValue, strategy.isPremium && { color: colors.accent }]}>
              {strategy.isPremium ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['overview', 'setup', 'example'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Description Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}></Text>
                <Text style={styles.cardTitle}>Overview</Text>
              </View>
              <Text style={styles.cardText}>{strategy.description}</Text>
            </View>

            {/* When to Use Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}></Text>
                <Text style={styles.cardTitle}>When to Use</Text>
              </View>
              <Text style={styles.cardText}>{strategy.whenToUse}</Text>
            </View>

            {/* Payoff Diagram */}
            {strategyConfig && (
              <PayoffChart
                legs={strategyConfig.legs}
                currentPrice={strategyConfig.defaultStockPrice}
                title="Payoff at Expiration"
              />
            )}

            {/* Advantages & Disadvantages */}
            <View style={styles.prosConsContainer}>
              <View style={[styles.prosConsCard, styles.prosCard]}>
                <Text style={styles.prosConsTitle}>Advantages</Text>
                {strategy.advantages.map((adv, i) => (
                  <View key={i} style={styles.prosConsItem}>
                    <Text style={styles.prosIcon}>+</Text>
                    <Text style={styles.prosConsText}>{adv}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.prosConsCard, styles.consCard]}>
                <Text style={styles.prosConsTitle}>Disadvantages</Text>
                {strategy.disadvantages.map((dis, i) => (
                  <View key={i} style={styles.prosConsItem}>
                    <Text style={styles.consIcon}>-</Text>
                    <Text style={styles.prosConsText}>{dis}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'setup' && (
          <View style={styles.tabContent}>
            {/* Legs */}
            {strategyConfig && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Strategy Legs</Text>
                <View style={styles.legsContainer}>
                  {strategyConfig.legs.map((leg, index) => (
                    <View key={index} style={styles.legItem}>
                      <View style={[
                        styles.legAction,
                        { backgroundColor: leg.position === 'long' ? colors.overlay.neonGreen : 'rgba(239, 68, 68, 0.1)' }
                      ]}>
                        <Text style={[
                          styles.legActionText,
                          { color: leg.position === 'long' ? colors.bullish : colors.bearish }
                        ]}>
                          {leg.position === 'long' ? 'BUY' : 'SELL'}
                        </Text>
                      </View>
                      <View style={styles.legDetails}>
                        <Text style={styles.legQuantity}>{leg.quantity || 1}x</Text>
                        <Text style={[styles.legType, { color: leg.type === 'call' ? colors.bullish : colors.bearish }]}>
                          {leg.type.toUpperCase()}
                        </Text>
                        <Text style={styles.legStrike}>@ ${leg.strike}</Text>
                        <Text style={styles.legPremium}>(${leg.premium} premium)</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Risk/Reward */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Risk/Reward Profile</Text>
              <View style={styles.riskRewardGrid}>
                <View style={styles.riskRewardItem}>
                  <Text style={styles.riskRewardLabel}>Max Profit</Text>
                  <Text style={[styles.riskRewardValue, { color: colors.bullish }]}>
                    {strategy.maxProfit}
                  </Text>
                </View>
                <View style={styles.riskRewardItem}>
                  <Text style={styles.riskRewardLabel}>Max Loss</Text>
                  <Text style={[styles.riskRewardValue, { color: colors.bearish }]}>
                    {strategy.maxLoss}
                  </Text>
                </View>
                <View style={styles.riskRewardItem}>
                  <Text style={styles.riskRewardLabel}>Breakeven</Text>
                  <Text style={styles.riskRewardValue}>{strategy.breakeven}</Text>
                </View>
              </View>
            </View>

            {/* Greeks */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}></Text>
                <Text style={styles.cardTitle}>The Greeks</Text>
              </View>
              <View style={styles.greeksGrid}>
                <View style={styles.greekItem}>
                  <Text style={styles.greekLabel}>Delta</Text>
                  <Text style={styles.greekValue}>{strategy.greeks.delta}</Text>
                </View>
                <View style={styles.greekItem}>
                  <Text style={styles.greekLabel}>Gamma</Text>
                  <Text style={styles.greekValue}>{strategy.greeks.gamma}</Text>
                </View>
                <View style={styles.greekItem}>
                  <Text style={styles.greekLabel}>Theta</Text>
                  <Text style={styles.greekValue}>{strategy.greeks.theta}</Text>
                </View>
                <View style={styles.greekItem}>
                  <Text style={styles.greekLabel}>Vega</Text>
                  <Text style={styles.greekValue}>{strategy.greeks.vega}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'example' && (
          <View style={styles.tabContent}>
            {/* Example Scenario */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}></Text>
                <Text style={styles.cardTitle}>Example Trade</Text>
              </View>
              <View style={styles.exampleBox}>
                <Text style={styles.exampleTitle}>Scenario: AAPL at $150</Text>
                <Text style={styles.exampleText}>
                  {strategy.id === 'long-call' &&
                    'You buy 1 AAPL $150 Call for $3.00 ($300 total).\n\nIf AAPL rises to $160:\n• Call value = $10 intrinsic\n• Profit = ($10 - $3) × 100 = $700\n\nIf AAPL stays at $150:\n• Call expires worthless\n• Loss = $300 (premium paid)'}
                  {strategy.id === 'long-put' &&
                    'You buy 1 AAPL $150 Put for $3.00 ($300 total).\n\nIf AAPL drops to $140:\n• Put value = $10 intrinsic\n• Profit = ($10 - $3) × 100 = $700\n\nIf AAPL stays at $150:\n• Put expires worthless\n• Loss = $300 (premium paid)'}
                  {strategy.id === 'covered-call' &&
                    'You own 100 AAPL shares at $150. You sell 1 $155 Call for $2.00.\n\nIf AAPL stays below $155:\n• Keep $200 premium\n• Keep your shares\n\nIf AAPL rises to $160:\n• Sell shares at $155\n• Total gain = $500 + $200 = $700'}
                  {strategy.id === 'cash-secured-put' &&
                    'You want to buy AAPL at $145. You sell 1 $145 Put for $2.00, holding $14,500 cash.\n\nIf AAPL stays above $145:\n• Keep $200 premium\n• No shares assigned\n\nIf AAPL drops to $140:\n• Buy 100 shares at $145\n• Effective cost = $143/share'}
                  {strategy.id === 'bull-call-spread' &&
                    'You buy 1 AAPL $150 Call for $4.00 and sell 1 $160 Call for $1.50. Net debit = $2.50.\n\nIf AAPL rises to $165:\n• Max profit = ($10 - $2.50) × 100 = $750\n\nIf AAPL stays at $150:\n• Max loss = $250 (net debit)'}
                  {strategy.id === 'iron-condor' &&
                    'AAPL at $150. Sell $145/$140 put spread and $155/$160 call spread for $2.00 credit.\n\nIf AAPL stays between $145-$155:\n• Max profit = $200\n\nIf AAPL moves outside $140-$160:\n• Max loss = $300'}
                  {!['long-call', 'long-put', 'covered-call', 'cash-secured-put', 'bull-call-spread', 'iron-condor'].includes(strategy.id) &&
                    'Example trade scenario for this strategy will show how to set up and manage the position with real stock prices and expected outcomes.'}
                </Text>
              </View>
            </View>

            {/* Payoff Chart for Example */}
            {strategyConfig && (
              <PayoffChart
                legs={strategyConfig.legs}
                currentPrice={strategyConfig.defaultStockPrice}
                title="Example Payoff Diagram"
              />
            )}

            {/* Try It Button */}
            <TouchableOpacity style={styles.tryItButton}>
              <Text style={styles.tryItButtonText}>Try in Paper Trading</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quiz CTA */}
        <View style={styles.quizCta}>
          <View style={styles.quizCtaContent}>
            <Text style={styles.quizCtaEmoji}></Text>
            <View>
              <Text style={styles.quizCtaTitle}>Test Your Knowledge</Text>
              <Text style={styles.quizCtaText}>Take the quiz to earn XP</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.quizCtaButton}>
            <Text style={styles.quizCtaButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Mark Complete Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
          <Text style={styles.completeButtonXp}>+25 XP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.styles.h3,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  backButtonLarge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonLargeText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
  },
  bookmarkButton: {
    padding: spacing.xs,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tierBadgeText: {
    ...typography.styles.caption,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  outlookBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  outlookBadgeText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.overlay.medium,
  },
  categoryBadgeText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  strategyName: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  strategyTierName: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.default,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.background.tertiary,
  },
  tabText: {
    ...typography.styles.label,
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.text.primary,
  },
  tabContent: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardEmoji: {
    fontSize: 20,
  },
  cardTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  cardText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  prosConsContainer: {
    gap: spacing.md,
  },
  prosConsCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
  },
  prosCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  consCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  prosConsTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  prosConsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  prosIcon: {
    color: colors.bullish,
    fontWeight: typography.weights.bold,
    fontSize: 16,
  },
  consIcon: {
    color: colors.bearish,
    fontWeight: typography.weights.bold,
    fontSize: 16,
  },
  prosConsText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
  },
  legsContainer: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  legItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  legAction: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  legActionText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
  },
  legDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  legQuantity: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  legType: {
    ...typography.styles.label,
  },
  legStrike: {
    ...typography.styles.mono,
    color: colors.text.secondary,
  },
  legPremium: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  riskRewardGrid: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  riskRewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskRewardLabel: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  riskRewardValue: {
    ...typography.styles.mono,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  greeksGrid: {
    gap: spacing.sm,
  },
  greekItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  greekLabel: {
    ...typography.styles.label,
    color: colors.neon.cyan,
  },
  greekValue: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
    textAlign: 'right',
  },
  exampleBox: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  exampleTitle: {
    ...typography.styles.label,
    color: colors.neon.cyan,
    marginBottom: spacing.sm,
  },
  exampleText: {
    ...typography.styles.mono,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  tryItButton: {
    backgroundColor: colors.neon.cyan,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  tryItButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  quizCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neon.purple,
  },
  quizCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quizCtaEmoji: {
    fontSize: 32,
  },
  quizCtaTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  quizCtaText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  quizCtaButton: {
    backgroundColor: colors.neon.purple,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  quizCtaButtonText: {
    ...typography.styles.buttonSm,
    color: colors.text.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...createNeonGlow(colors.neon.green, 0.2),
  },
  completeButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  completeButtonXp: {
    ...typography.styles.labelSm,
    color: colors.background.primary,
    opacity: 0.8,
  },
});

export default StrategyDetailScreen;
