// Beginner Mistakes Screen
// Common options trading mistakes and how to avoid them

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui';

interface Mistake {
  id: number;
  title: string;
  emoji: string;
  severity: 'critical' | 'major' | 'moderate';
  description: string;
  example: string;
  solution: string;
}

const COMMON_MISTAKES: Mistake[] = [
  {
    id: 1,
    title: 'Not Having an Exit Plan',
    emoji: '',
    severity: 'critical',
    description: 'Entering trades without knowing when you\'ll take profit or cut losses. This leads to emotional decisions.',
    example: 'You buy calls, stock goes up 30%, you don\'t sell. It reverses and you end up with a loss.',
    solution: 'Before entering ANY trade, write down: (1) Profit target, (2) Stop loss level, (3) Time-based exit. Stick to it.',
  },
  {
    id: 2,
    title: 'Position Sizing Too Large',
    emoji: '',
    severity: 'critical',
    description: 'Risking too much capital on a single trade. Options can lose 100% of their value.',
    example: 'You put 20% of your account in one trade. It goes to zero. You just lost 20%.',
    solution: 'Never risk more than 1-2% of your account per trade. This means your MAX LOSS should be 1-2%.',
  },
  {
    id: 3,
    title: 'Ignoring Time Decay (Theta)',
    emoji: '',
    severity: 'critical',
    description: 'Not understanding that long options lose value every day, even if the stock doesn\'t move.',
    example: 'Stock stays flat for 2 weeks. Your calls lost 40% value just from time passing.',
    solution: 'Know your daily theta cost. If you\'re long options, you need the stock to move faster than decay.',
  },
  {
    id: 4,
    title: 'Buying OTM Lottery Tickets',
    emoji: '',
    severity: 'major',
    description: 'Buying cheap far OTM options because they\'re "cheap." They\'re cheap because they rarely pay off.',
    example: '$0.10 options seem like a bargain but they have a 5% chance of profit. You need 20x winners to break even.',
    solution: 'Focus on probability, not price. ATM or slightly OTM options with 30-45 DTE have better odds.',
  },
  {
    id: 5,
    title: 'Trading Illiquid Options',
    emoji: '',
    severity: 'major',
    description: 'Trading options with wide bid-ask spreads. You lose money just entering and exiting.',
    example: 'Bid: $1.00, Ask: $1.50. You buy at $1.50, sell at $1.00. That\'s a 33% loss on spread alone.',
    solution: 'Stick to options with tight spreads (5% or less of the option price) and high open interest.',
  },
  {
    id: 6,
    title: 'Holding Through Earnings Unintentionally',
    emoji: '',
    severity: 'major',
    description: 'Not realizing you have positions through a binary event. IV crush destroys your premium.',
    example: 'You hold calls into earnings. Stock moves 2%. Your calls drop 30% from IV crush.',
    solution: 'Always check the earnings calendar. Either close before or make it an intentional earnings play.',
  },
  {
    id: 7,
    title: 'Averaging Down on Losers',
    emoji: '',
    severity: 'major',
    description: 'Buying more of a losing position hoping it will recover. Options aren\'t stocks.',
    example: 'Your calls are down 50%. You buy more. Stock keeps dropping. Now you\'ve lost even more.',
    solution: 'If your thesis was wrong, cut the loss. If adding, only do so with a clear plan and new analysis.',
  },
  {
    id: 8,
    title: 'Using Market Orders',
    emoji: '',
    severity: 'moderate',
    description: 'Using market orders on options. You can get terrible fills due to wide spreads.',
    example: 'You market order a spread. Fill comes back $0.30 worse than expected. That\'s $30 lost per contract.',
    solution: 'ALWAYS use limit orders. Start at mid-price and adjust if needed. Be patient.',
  },
  {
    id: 9,
    title: 'Not Understanding Assignment',
    emoji: '',
    severity: 'moderate',
    description: 'Being surprised by early assignment when selling options, especially on dividend stocks.',
    example: 'You sold covered calls. Stock goes ex-dividend. You wake up to find your shares gone.',
    solution: 'Understand when assignment is likely: deep ITM, near ex-dividend, close to expiration. Plan for it.',
  },
  {
    id: 10,
    title: 'Overtrading',
    emoji: '',
    severity: 'moderate',
    description: 'Trading too frequently, racking up commissions and making emotional decisions.',
    example: 'You make 50 trades per month. Even at $0.65/contract, that\'s $65+ in fees eating your profits.',
    solution: 'Quality over quantity. Wait for high-probability setups. Journal and review your trades.',
  },
  {
    id: 11,
    title: 'Ignoring the Greeks',
    emoji: '',
    severity: 'moderate',
    description: 'Not paying attention to Delta, Theta, Vega, and Gamma. Flying blind.',
    example: 'High Vega position before earnings. IV crushes, you lose money even though direction was right.',
    solution: 'Check Greeks before entering. Understand how your P&L changes with price, time, and volatility.',
  },
  {
    id: 12,
    title: 'FOMO Trading',
    emoji: '',
    severity: 'moderate',
    description: 'Chasing trades because everyone else is. Entering at the worst possible time.',
    example: 'Stock already up 20%. You buy calls at the top. It reverses the next day.',
    solution: 'If you missed the move, wait for the next opportunity. There\'s always another trade.',
  },
];

const getSeverityColor = (severity: Mistake['severity']) => {
  switch (severity) {
    case 'critical':
      return colors.error;
    case 'major':
      return colors.neon.orange;
    case 'moderate':
      return colors.neon.yellow;
  }
};

const getSeverityLabel = (severity: Mistake['severity']) => {
  switch (severity) {
    case 'critical':
      return 'Account Killer';
    case 'major':
      return 'Serious';
    case 'moderate':
      return 'Common';
  }
};

const BeginnerMistakesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [expandedMistake, setExpandedMistake] = useState<number | null>(null);

  const criticalMistakes = COMMON_MISTAKES.filter(m => m.severity === 'critical');
  const majorMistakes = COMMON_MISTAKES.filter(m => m.severity === 'major');
  const moderateMistakes = COMMON_MISTAKES.filter(m => m.severity === 'moderate');

  const renderMistake = (mistake: Mistake) => {
    const isExpanded = expandedMistake === mistake.id;
    const severityColor = getSeverityColor(mistake.severity);

    return (
      <TouchableOpacity
        key={mistake.id}
        style={[styles.mistakeCard, isExpanded && { borderColor: severityColor }]}
        onPress={() => setExpandedMistake(isExpanded ? null : mistake.id)}
        activeOpacity={0.7}
      >
        <View style={styles.mistakeHeader}>
          <Text style={styles.mistakeEmoji}>{mistake.emoji}</Text>
          <View style={styles.mistakeInfo}>
            <Text style={styles.mistakeTitle}>{mistake.title}</Text>
            <View style={[styles.severityBadge, { backgroundColor: `${severityColor}20` }]}>
              <Text style={[styles.severityText, { color: severityColor }]}>
                {getSeverityLabel(mistake.severity)}
              </Text>
            </View>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '' : ''}</Text>
        </View>

        {isExpanded && (
          <View style={styles.mistakeContent}>
            <Text style={styles.mistakeDescription}>{mistake.description}</Text>

            <View style={styles.exampleBox}>
              <Text style={styles.exampleLabel}>Example:</Text>
              <Text style={styles.exampleText}>{mistake.example}</Text>
            </View>

            <View style={styles.solutionBox}>
              <Text style={styles.solutionLabel}> How to Avoid:</Text>
              <Text style={styles.solutionText}>{mistake.solution}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beginner Mistakes</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}></Text>
          <Text style={styles.heroTitle}>Learn From Others</Text>
          <Text style={styles.heroSubtitle}>
            {COMMON_MISTAKES.length} common mistakes that destroy trading accounts
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: colors.error }]}>
            <Text style={[styles.statNumber, { color: colors.error }]}>{criticalMistakes.length}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.neon.orange }]}>
            <Text style={[styles.statNumber, { color: colors.neon.orange }]}>{majorMistakes.length}</Text>
            <Text style={styles.statLabel}>Major</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.neon.yellow }]}>
            <Text style={[styles.statNumber, { color: colors.neon.yellow }]}>{moderateMistakes.length}</Text>
            <Text style={styles.statLabel}>Common</Text>
          </View>
        </View>

        {/* Critical Mistakes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}></Text>
            <Text style={[styles.sectionTitle, { color: colors.error }]}>Account Killers</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            These mistakes can wipe out your account. Avoid at all costs.
          </Text>
          {criticalMistakes.map(renderMistake)}
        </View>

        {/* Major Mistakes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}></Text>
            <Text style={[styles.sectionTitle, { color: colors.neon.orange }]}>Serious Mistakes</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            These can cause significant losses if repeated.
          </Text>
          {majorMistakes.map(renderMistake)}
        </View>

        {/* Moderate Mistakes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}></Text>
            <Text style={[styles.sectionTitle, { color: colors.neon.yellow }]}>Common Mistakes</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Every trader makes these. Learn to minimize them.
          </Text>
          {moderateMistakes.map(renderMistake)}
        </View>

        {/* Bottom Tip */}
        <GlassCard style={styles.tipCard} withGlow glowColor={colors.neon.green}>
          <Text style={styles.tipEmoji}></Text>
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            The best traders aren't the ones who never make mistakes - they're the ones who make small mistakes and learn quickly. Start with paper trading to make your mistakes with fake money.
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
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
  },
  heroSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  statNumber: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
  },
  statLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  sectionSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  mistakeCard: {
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  mistakeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  mistakeEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  mistakeInfo: {
    flex: 1,
  },
  mistakeTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: 4,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
  },
  expandIcon: {
    fontSize: 16,
    color: colors.text.muted,
  },
  mistakeContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
    paddingTop: spacing.md,
  },
  mistakeDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  exampleBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  exampleLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  exampleText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  solutionBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  solutionLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  solutionText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  tipCard: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  tipEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  tipTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.green,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default BeginnerMistakesScreen;
