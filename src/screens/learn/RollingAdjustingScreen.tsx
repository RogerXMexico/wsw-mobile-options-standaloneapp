// Rolling & Adjusting Screen
// Learn how to roll and adjust options positions

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
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui';

interface RollType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  when: string;
  how: string;
  example: string;
  pros: string[];
  cons: string[];
}

const ROLL_TYPES: RollType[] = [
  {
    id: 'roll-out',
    name: 'Roll Out (In Time)',
    emoji: '',
    description: 'Move to a later expiration date at the same strike price.',
    when: 'Your position is working but needs more time, or you want to avoid assignment.',
    how: 'Buy to close current option, sell to open same strike at later expiration.',
    example: 'Short $50 call expiring Friday. Roll to same $50 call expiring next month.',
    pros: ['Collect additional premium', 'Give trade more time to work', 'Avoid assignment'],
    cons: ['Extends your time in the trade', 'Ties up capital longer', 'May collect less premium than original'],
  },
  {
    id: 'roll-up',
    name: 'Roll Up (Calls)',
    emoji: '',
    description: 'Move to a higher strike price (same or later expiration).',
    when: 'Stock has moved up and your short call is threatened or ITM.',
    how: 'Buy to close current call, sell to open higher strike call.',
    example: 'Short $50 call, stock at $52. Roll to $55 call to give more room.',
    pros: ['Capture more upside', 'Reduce assignment risk', 'Adjust to new price level'],
    cons: ['Usually costs money (debit roll)', 'Locks in a partial loss', 'May need to extend time'],
  },
  {
    id: 'roll-down',
    name: 'Roll Down (Puts)',
    emoji: '',
    description: 'Move to a lower strike price (same or later expiration).',
    when: 'Stock has dropped and your short put is threatened or ITM.',
    how: 'Buy to close current put, sell to open lower strike put.',
    example: 'Short $50 put, stock at $48. Roll to $45 put to reduce risk.',
    pros: ['Lower your cost basis if assigned', 'Reduce potential loss', 'Adjust to new price level'],
    cons: ['Usually costs money (debit roll)', 'Accepts a loss on original trade', 'May need to extend time'],
  },
  {
    id: 'roll-out-up',
    name: 'Roll Out & Up (Combo)',
    emoji: '',
    description: 'Move to later expiration AND higher strike simultaneously.',
    when: 'Stock has rallied through your call strike. Need more time and room.',
    how: 'Buy current call, sell later expiration higher strike call.',
    example: 'Short $50 call expiring tomorrow, stock at $54. Roll to $55 call in 2 weeks.',
    pros: ['Time premium helps offset strike adjustment', 'May achieve credit roll', 'Extends trade life'],
    cons: ['Significantly extends time commitment', 'Stock may keep running', 'Complex to manage'],
  },
  {
    id: 'roll-out-down',
    name: 'Roll Out & Down (Combo)',
    emoji: '',
    description: 'Move to later expiration AND lower strike simultaneously.',
    when: 'Stock has dropped through your put strike. Need more time and lower entry.',
    how: 'Buy current put, sell later expiration lower strike put.',
    example: 'Short $50 put expiring tomorrow, stock at $46. Roll to $45 put in 2 weeks.',
    pros: ['Time premium helps offset strike adjustment', 'May achieve credit roll', 'Better entry price if assigned'],
    cons: ['Extends time commitment', 'Stock may keep falling', 'Averaging into a loser'],
  },
];

const ADJUSTMENT_STRATEGIES = [
  {
    title: 'Add a Hedge',
    emoji: '',
    description: 'Buy protection to limit losses if the trade goes against you.',
    examples: [
      'Long stock + Buy put = Protected position',
      'Short put + Buy further OTM put = Convert to spread',
      'Long call + Buy put = Create collar',
    ],
  },
  {
    title: 'Convert to Spread',
    emoji: '',
    description: 'Add another leg to define your risk on an undefined position.',
    examples: [
      'Short naked put + Buy lower put = Bull put spread',
      'Short naked call + Buy higher call = Bear call spread',
      'Limits max loss at cost of reducing max profit',
    ],
  },
  {
    title: 'Leg Into',
    emoji: '',
    description: 'Add a leg at a favorable price to create a multi-leg position.',
    examples: [
      'Long call, stock rallies -> Sell higher call = Call debit spread',
      'Long put, stock drops -> Sell lower put = Put debit spread',
      'Locks in some profit, reduces risk',
    ],
  },
  {
    title: 'Scale Out',
    emoji: '',
    description: 'Close part of your position to lock in profits or reduce risk.',
    examples: [
      'Have 10 contracts, close 5 at profit',
      'Let remaining 5 ride for bigger move',
      'Balances risk and reward',
    ],
  },
];

const ROLL_RULES = [
  { rule: 'Only roll for a credit (or small debit)', emoji: '' },
  { rule: 'Don\'t roll a loser into a bigger loser', emoji: '' },
  { rule: 'Have a max number of rolls (e.g., 2-3)', emoji: '' },
  { rule: 'If thesis is broken, close don\'t roll', emoji: '' },
  { rule: 'Consider the opportunity cost of tied-up capital', emoji: '' },
  { rule: 'Document why you\'re rolling (journal it)', emoji: '' },
];

const RollingAdjustingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [expandedRoll, setExpandedRoll] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rolling & Adjusting</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Ionicons name="refresh-outline" size={48} color={colors.neon.green} style={{ marginBottom: spacing.sm }} />
          <Text style={styles.heroTitle}>Manage Your Trades</Text>
          <Text style={styles.heroSubtitle}>
            Learn to adjust positions instead of taking losses
          </Text>
        </View>

        {/* What is Rolling */}
        <GlassCard style={styles.introCard}>
          <Text style={styles.introTitle}>What is Rolling?</Text>
          <Text style={styles.introText}>
            Rolling is closing your current option position and simultaneously opening a new one with different terms (strike, expiration, or both). It's a way to manage trades that haven't gone as planned.
          </Text>
          <View style={styles.keyPoint}>
            <Ionicons name="key-outline" size={24} color="#f59e0b" style={{ marginRight: spacing.sm }} />
            <Text style={styles.keyPointText}>
              Rolling is NOT a magic fix - it's a tool for managing risk and giving trades more time to work.
            </Text>
          </View>
        </GlassCard>

        {/* Roll Types */}
        <Text style={styles.sectionTitle}>Types of Rolls</Text>
        {ROLL_TYPES.map((roll) => {
          const isExpanded = expandedRoll === roll.id;

          return (
            <TouchableOpacity
              key={roll.id}
              style={[styles.rollCard, isExpanded && styles.rollCardExpanded]}
              onPress={() => setExpandedRoll(isExpanded ? null : roll.id)}
              activeOpacity={0.7}
            >
              <View style={styles.rollHeader}>
                <Text style={styles.rollEmoji}>{roll.emoji}</Text>
                <View style={styles.rollInfo}>
                  <Text style={styles.rollName}>{roll.name}</Text>
                  <Text style={styles.rollDesc}>{roll.description}</Text>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? '' : ''}</Text>
              </View>

              {isExpanded && (
                <View style={styles.rollContent}>
                  <View style={styles.rollSection}>
                    <Text style={styles.rollLabel}>When to Use:</Text>
                    <Text style={styles.rollText}>{roll.when}</Text>
                  </View>

                  <View style={styles.rollSection}>
                    <Text style={styles.rollLabel}>How to Execute:</Text>
                    <Text style={styles.rollText}>{roll.how}</Text>
                  </View>

                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleLabel}>Example:</Text>
                    <Text style={styles.exampleText}>{roll.example}</Text>
                  </View>

                  <View style={styles.prosConsRow}>
                    <View style={styles.prosCol}>
                      <Text style={styles.prosTitle}> Pros</Text>
                      {roll.pros.map((pro, i) => (
                        <Text key={i} style={styles.prosText}>+ {pro}</Text>
                      ))}
                    </View>
                    <View style={styles.consCol}>
                      <Text style={styles.consTitle}> Cons</Text>
                      {roll.cons.map((con, i) => (
                        <Text key={i} style={styles.consText}>- {con}</Text>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Adjustment Strategies */}
        <Text style={styles.sectionTitle}>Other Adjustments</Text>
        <Text style={styles.sectionSubtitle}>
          Beyond rolling, there are other ways to manage positions
        </Text>

        {ADJUSTMENT_STRATEGIES.map((strategy, index) => (
          <GlassCard key={index} style={styles.strategyCard}>
            <View style={styles.strategyHeader}>
              <Text style={styles.strategyEmoji}>{strategy.emoji}</Text>
              <Text style={styles.strategyTitle}>{strategy.title}</Text>
            </View>
            <Text style={styles.strategyDesc}>{strategy.description}</Text>
            <View style={styles.examplesBox}>
              {strategy.examples.map((example, i) => (
                <Text key={i} style={styles.exampleItem}>{example}</Text>
              ))}
            </View>
          </GlassCard>
        ))}

        {/* Rolling Rules */}
        <GlassCard style={styles.rulesCard} withGlow glowColor={colors.neon.yellow}>
          <Text style={styles.rulesTitle}> Rolling Rules to Live By</Text>
          {ROLL_RULES.map((item, index) => (
            <View key={index} style={styles.ruleRow}>
              <Text style={styles.ruleEmoji}>{item.emoji}</Text>
              <Text style={styles.ruleText}>{item.rule}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Bottom Warning */}
        <View style={styles.warningBox}>
          <Ionicons name="warning-outline" size={24} color="#f59e0b" style={{ marginBottom: spacing.sm }} />
          <Text style={styles.warningTitle}>Don't Roll Forever</Text>
          <Text style={styles.warningText}>
            Rolling a losing trade indefinitely is a common trap. Set a maximum number of rolls and a point where you accept the loss. Sometimes the best adjustment is to close the position.
          </Text>
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
  },
  introCard: {
    marginBottom: spacing.lg,
  },
  introTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.cyan,
    marginBottom: spacing.sm,
  },
  introText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  keyPointText: {
    flex: 1,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.neon.yellow,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  rollCard: {
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  rollCardExpanded: {
    borderColor: colors.neon.green,
  },
  rollHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rollEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  rollInfo: {
    flex: 1,
  },
  rollName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: 2,
  },
  rollDesc: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  expandIcon: {
    fontSize: 16,
    color: colors.text.muted,
  },
  rollContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  rollSection: {
    marginBottom: spacing.md,
  },
  rollLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.neon.cyan,
    marginBottom: 4,
  },
  rollText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  exampleBox: {
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  exampleLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: 4,
  },
  exampleText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  prosConsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  prosCol: {
    flex: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  consCol: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  prosTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  consTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  prosText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.success,
    marginBottom: 2,
  },
  consText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginBottom: 2,
  },
  strategyCard: {
    marginBottom: spacing.sm,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  strategyEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  strategyTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  strategyDesc: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  examplesBox: {
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  exampleItem: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: 4,
  },
  rulesCard: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  rulesTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.yellow,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  ruleEmoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  ruleText: {
    flex: 1,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  warningTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  warningText: {
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

export default RollingAdjustingScreen;
