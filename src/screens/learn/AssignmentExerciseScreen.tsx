// Assignment & Exercise Screen
// Understanding how options assignment and exercise work

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

interface Scenario {
  id: string;
  title: string;
  position: string;
  situation: string;
  whatHappens: string;
  yourAction: string;
  tip: string;
}

const CALL_SCENARIOS: Scenario[] = [
  {
    id: 'long-call-itm',
    title: 'Long Call - ITM at Expiration',
    position: 'You BOUGHT a call option',
    situation: 'Stock price > Strike price at expiration',
    whatHappens: 'Your call will be automatically exercised. You buy 100 shares at the strike price.',
    yourAction: 'Make sure you have enough cash to buy the shares, OR sell the call before expiration.',
    tip: 'Most traders sell ITM options before expiration to avoid needing the capital for shares.',
  },
  {
    id: 'long-call-otm',
    title: 'Long Call - OTM at Expiration',
    position: 'You BOUGHT a call option',
    situation: 'Stock price < Strike price at expiration',
    whatHappens: 'Your call expires worthless. You lose 100% of the premium paid.',
    yourAction: 'Nothing to do - option disappears. Accept the loss.',
    tip: 'This is the max loss for a long call. It\'s defined and known upfront.',
  },
  {
    id: 'short-call-covered',
    title: 'Short Covered Call - ITM at Expiration',
    position: 'You SOLD a call against shares you own',
    situation: 'Stock price > Strike price at expiration',
    whatHappens: 'You get assigned. Your shares are sold at the strike price. You keep the premium.',
    yourAction: 'Prepare to say goodbye to your shares. Consider if you want to buy them back.',
    tip: 'This is the ideal outcome if you were willing to sell at that price anyway!',
  },
  {
    id: 'short-call-naked',
    title: 'Short Naked Call - ITM (Dangerous!)',
    position: 'You SOLD a call without owning shares',
    situation: 'Stock price > Strike price',
    whatHappens: 'You must buy shares at market price and sell at strike. Loss = (Market Price - Strike) x 100.',
    yourAction: 'Close the position immediately or buy shares to cover. Losses are theoretically unlimited!',
    tip: 'This is why naked calls are extremely dangerous. Always know your risk.',
  },
];

const PUT_SCENARIOS: Scenario[] = [
  {
    id: 'long-put-itm',
    title: 'Long Put - ITM at Expiration',
    position: 'You BOUGHT a put option',
    situation: 'Stock price < Strike price at expiration',
    whatHappens: 'Your put will be automatically exercised. You sell 100 shares at the strike price.',
    yourAction: 'If you own shares, they get sold. If not, you\'ll be short 100 shares (need margin).',
    tip: 'If you don\'t want to be short shares, sell the put before expiration.',
  },
  {
    id: 'long-put-otm',
    title: 'Long Put - OTM at Expiration',
    position: 'You BOUGHT a put option',
    situation: 'Stock price > Strike price at expiration',
    whatHappens: 'Your put expires worthless. You lose 100% of the premium paid.',
    yourAction: 'Nothing to do - option disappears. The protection wasn\'t needed.',
    tip: 'Like car insurance you didn\'t need - you paid for protection that wasn\'t used.',
  },
  {
    id: 'short-put-csp',
    title: 'Short Cash-Secured Put - ITM at Expiration',
    position: 'You SOLD a put with cash reserved',
    situation: 'Stock price < Strike price at expiration',
    whatHappens: 'You get assigned. You buy 100 shares at the strike price. You keep the premium.',
    yourAction: 'Congratulations, you now own 100 shares at your target price minus premium received.',
    tip: 'This is often the goal! You got paid to buy a stock you wanted at a lower price.',
  },
  {
    id: 'short-put-naked',
    title: 'Short Naked Put - ITM (Risky)',
    position: 'You SOLD a put without cash reserved',
    situation: 'Stock price < Strike price',
    whatHappens: 'You must buy 100 shares at strike price. May need margin if insufficient funds.',
    yourAction: 'Have a plan: either accept the shares or close the position before assignment.',
    tip: 'Always have enough buying power. Don\'t let margin calls surprise you.',
  },
];

const EARLY_ASSIGNMENT_INFO = [
  {
    title: 'When Early Assignment Happens',
    emoji: '',
    points: [
      'Deep ITM options near expiration',
      'Just before ex-dividend date (calls on dividend stocks)',
      'When extrinsic value is very low',
      'American-style options only (most stock options)',
    ],
  },
  {
    title: 'Dividend Risk for Short Calls',
    emoji: '',
    points: [
      'If your short call is ITM before ex-dividend...',
      'The call buyer may exercise early to capture the dividend',
      'You lose your shares the night before ex-dividend',
      'Solution: Close or roll ITM calls before ex-dividend date',
    ],
  },
  {
    title: 'How to Avoid Unwanted Assignment',
    emoji: '',
    points: [
      'Close positions before expiration Friday',
      'Roll options with remaining extrinsic value',
      'Watch ex-dividend dates on short calls',
      'Keep deep ITM short options on your radar',
    ],
  },
];

const AssignmentExerciseScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'calls' | 'puts' | 'early'>('calls');
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  const renderScenario = (scenario: Scenario) => {
    const isExpanded = expandedScenario === scenario.id;

    return (
      <TouchableOpacity
        key={scenario.id}
        style={[styles.scenarioCard, isExpanded && styles.scenarioCardExpanded]}
        onPress={() => setExpandedScenario(isExpanded ? null : scenario.id)}
        activeOpacity={0.7}
      >
        <View style={styles.scenarioHeader}>
          <Text style={styles.scenarioTitle}>{scenario.title}</Text>
          <Text style={styles.expandIcon}>{isExpanded ? '' : ''}</Text>
        </View>

        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>{scenario.position}</Text>
        </View>

        {isExpanded && (
          <View style={styles.scenarioContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Situation:</Text>
              <Text style={styles.infoText}>{scenario.situation}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>What Happens:</Text>
              <Text style={styles.infoText}>{scenario.whatHappens}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Your Action:</Text>
              <Text style={styles.infoText}>{scenario.yourAction}</Text>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipEmoji}></Text>
              <Text style={styles.tipText}>{scenario.tip}</Text>
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
        <Text style={styles.headerTitle}>Assignment & Exercise</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}></Text>
        <Text style={styles.heroTitle}>Know Your Obligations</Text>
        <Text style={styles.heroSubtitle}>
          What happens when options are exercised or assigned
        </Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calls' && styles.tabActive]}
          onPress={() => setActiveTab('calls')}
        >
          <Text style={[styles.tabText, activeTab === 'calls' && styles.tabTextActive]}>
            Calls
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'puts' && styles.tabActive]}
          onPress={() => setActiveTab('puts')}
        >
          <Text style={[styles.tabText, activeTab === 'puts' && styles.tabTextActive]}>
            Puts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'early' && styles.tabActive]}
          onPress={() => setActiveTab('early')}
        >
          <Text style={[styles.tabText, activeTab === 'early' && styles.tabTextActive]}>
            Early Assignment
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Key Concepts */}
        <GlassCard style={styles.conceptsCard}>
          <View style={styles.conceptRow}>
            <View style={styles.concept}>
              <Text style={styles.conceptEmoji}></Text>
              <Text style={styles.conceptTitle}>Exercise</Text>
              <Text style={styles.conceptDesc}>Buyer uses their right</Text>
            </View>
            <View style={styles.conceptDivider} />
            <View style={styles.concept}>
              <Text style={styles.conceptEmoji}></Text>
              <Text style={styles.conceptTitle}>Assignment</Text>
              <Text style={styles.conceptDesc}>Seller fulfills obligation</Text>
            </View>
          </View>
        </GlassCard>

        {/* Content based on active tab */}
        {activeTab === 'calls' && (
          <View style={styles.scenariosContainer}>
            <Text style={styles.sectionTitle}>Call Option Scenarios</Text>
            {CALL_SCENARIOS.map(renderScenario)}
          </View>
        )}

        {activeTab === 'puts' && (
          <View style={styles.scenariosContainer}>
            <Text style={styles.sectionTitle}>Put Option Scenarios</Text>
            {PUT_SCENARIOS.map(renderScenario)}
          </View>
        )}

        {activeTab === 'early' && (
          <View style={styles.scenariosContainer}>
            <Text style={styles.sectionTitle}>Early Assignment</Text>
            <Text style={styles.sectionSubtitle}>
              American options can be exercised at any time before expiration
            </Text>

            {EARLY_ASSIGNMENT_INFO.map((info, index) => (
              <GlassCard key={index} style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <Text style={styles.infoCardEmoji}>{info.emoji}</Text>
                  <Text style={styles.infoCardTitle}>{info.title}</Text>
                </View>
                {info.points.map((point, i) => (
                  <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bulletDot}></Text>
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </GlassCard>
            ))}
          </View>
        )}

        {/* Quick Reference */}
        <GlassCard style={styles.quickRef} withGlow glowColor={colors.neon.cyan}>
          <Text style={styles.quickRefTitle}>Quick Reference</Text>
          <View style={styles.quickRefGrid}>
            <View style={styles.quickRefItem}>
              <Text style={styles.quickRefLabel}>Long Call ITM</Text>
              <Text style={styles.quickRefValue}>Buy shares at strike</Text>
            </View>
            <View style={styles.quickRefItem}>
              <Text style={styles.quickRefLabel}>Short Call ITM</Text>
              <Text style={styles.quickRefValue}>Sell shares at strike</Text>
            </View>
            <View style={styles.quickRefItem}>
              <Text style={styles.quickRefLabel}>Long Put ITM</Text>
              <Text style={styles.quickRefValue}>Sell shares at strike</Text>
            </View>
            <View style={styles.quickRefItem}>
              <Text style={styles.quickRefLabel}>Short Put ITM</Text>
              <Text style={styles.quickRefValue}>Buy shares at strike</Text>
            </View>
          </View>
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
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  heroEmoji: {
    fontSize: 48,
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.neon.green,
  },
  tabText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  conceptsCard: {
    marginBottom: spacing.lg,
  },
  conceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  concept: {
    flex: 1,
    alignItems: 'center',
  },
  conceptEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  conceptTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  conceptDesc: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  conceptDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.glass.border,
    marginHorizontal: spacing.md,
  },
  scenariosContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.cyan,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  scenarioCard: {
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  scenarioCardExpanded: {
    borderColor: colors.neon.cyan,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scenarioTitle: {
    flex: 1,
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  expandIcon: {
    fontSize: 16,
    color: colors.text.muted,
  },
  positionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.overlay.neonCyan,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  positionText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.neon.cyan,
  },
  scenarioContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  infoRow: {
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: 4,
  },
  infoText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  tipEmoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.success,
    lineHeight: 20,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoCardEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  infoCardTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bulletDot: {
    fontSize: 12,
    color: colors.neon.green,
    marginRight: spacing.sm,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  quickRef: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  quickRefTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.cyan,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  quickRefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickRefItem: {
    width: '48%',
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  quickRefLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: 2,
  },
  quickRefValue: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AssignmentExerciseScreen;
