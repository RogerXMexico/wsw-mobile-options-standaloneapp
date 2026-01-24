// First Trade Tutorial Screen
// Step-by-step guide to placing your first options trade

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GlowButton } from '../../components/ui';

const { width } = Dimensions.get('window');

interface TutorialStep {
  id: number;
  title: string;
  emoji: string;
  description: string;
  tips: string[];
  warning?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Choose Your Underlying',
    emoji: '',
    description: 'Pick a stock or ETF you want to trade options on. Start with liquid names like SPY, AAPL, or QQQ for tighter bid-ask spreads.',
    tips: [
      'Stick to stocks you understand',
      'Check if options are available (not all stocks have them)',
      'Higher volume = better fills',
    ],
    warning: 'Avoid penny stocks and low-volume names for your first trade.',
  },
  {
    id: 2,
    title: 'Decide Your Direction',
    emoji: '',
    description: 'Are you bullish (expecting up), bearish (expecting down), or neutral? Your outlook determines which strategy to use.',
    tips: [
      'Bullish? Consider buying calls or selling puts',
      'Bearish? Consider buying puts or selling calls',
      'Neutral? Consider spreads or iron condors',
    ],
  },
  {
    id: 3,
    title: 'Select Expiration Date',
    emoji: '',
    description: 'Choose when your option expires. Longer expirations cost more but give you more time to be right.',
    tips: [
      'Beginners: Start with 30-45 days to expiration (DTE)',
      'Shorter DTE = higher theta decay',
      'Avoid holding through earnings unless intentional',
    ],
    warning: 'Weekly options (0-7 DTE) are risky for beginners due to rapid time decay.',
  },
  {
    id: 4,
    title: 'Pick Your Strike Price',
    emoji: '',
    description: 'The strike determines your breakeven and probability of profit. ATM options are most responsive to price changes.',
    tips: [
      'ITM: Higher probability, higher cost',
      'ATM: Balanced risk/reward',
      'OTM: Lower cost, lower probability',
    ],
  },
  {
    id: 5,
    title: 'Review the Option Chain',
    emoji: '',
    description: 'The option chain shows all available contracts. Look at bid/ask, volume, open interest, and the Greeks.',
    tips: [
      'Bid = what you can sell for',
      'Ask = what you pay to buy',
      'Tight spread = liquid option',
      'Check Delta for probability estimate',
    ],
  },
  {
    id: 6,
    title: 'Size Your Position',
    emoji: '',
    description: 'Never risk more than 1-2% of your account on a single trade. Options can go to zero.',
    tips: [
      'Calculate max loss before entering',
      'Start with 1 contract to learn',
      'Use defined-risk strategies',
    ],
    warning: 'Position sizing is the most important risk management tool.',
  },
  {
    id: 7,
    title: 'Enter Your Order',
    emoji: '',
    description: 'Choose your order type. Limit orders let you control the price. Never use market orders on options.',
    tips: [
      'Use LIMIT orders, not MARKET',
      'Start between bid and ask (mid price)',
      'Be patient - don\'t chase',
    ],
  },
  {
    id: 8,
    title: 'Set Your Exit Plan',
    emoji: '',
    description: 'Know when you\'ll take profit and when you\'ll cut losses BEFORE you enter. Stick to your plan.',
    tips: [
      'Set a profit target (e.g., 50% gain)',
      'Set a stop loss (e.g., 25-50% loss)',
      'Consider using alerts',
    ],
    warning: 'The biggest mistake is not having an exit plan.',
  },
  {
    id: 9,
    title: 'Monitor & Manage',
    emoji: '',
    description: 'Check your position daily but don\'t overtrade. Adjust if your thesis changes or you hit your targets.',
    tips: [
      'Review Greeks daily',
      'Watch for earnings and dividends',
      'Consider rolling if needed',
      'Journal your trades',
    ],
  },
  {
    id: 10,
    title: 'Close Your Position',
    emoji: '',
    description: 'Exit when you hit your target, stop loss, or thesis changes. Don\'t let winners turn into losers.',
    tips: [
      'Take profits - they\'re not guaranteed',
      'Don\'t let losers run',
      'Close before expiration to avoid assignment',
    ],
  },
];

const FirstTradeTutorialScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const step = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepPress = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your First Trade</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={[colors.neon.green, colors.neon.cyan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>
      </View>

      {/* Step Indicators */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepsRow}
      >
        {TUTORIAL_STEPS.map((s, index) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.stepDot,
              currentStep === index && styles.stepDotActive,
              completedSteps.includes(index) && styles.stepDotCompleted,
            ]}
            onPress={() => handleStepPress(index)}
          >
            <Text style={[
              styles.stepDotText,
              (currentStep === index || completedSteps.includes(index)) && styles.stepDotTextActive,
            ]}>
              {completedSteps.includes(index) ? '' : index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Card */}
        <GlassCard style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepEmoji}>{step.emoji}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
          </View>

          <Text style={styles.stepDescription}>{step.description}</Text>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Key Points</Text>
            {step.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}></Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Warning */}
          {step.warning && (
            <View style={styles.warningBox}>
              <Text style={styles.warningEmoji}></Text>
              <Text style={styles.warningText}>{step.warning}</Text>
            </View>
          )}
        </GlassCard>

        {/* Quick Reference */}
        {currentStep === TUTORIAL_STEPS.length - 1 && completedSteps.length >= TUTORIAL_STEPS.length - 1 && (
          <GlassCard style={styles.completionCard} withGlow glowColor={colors.neon.green}>
            <Text style={styles.completionEmoji}></Text>
            <Text style={styles.completionTitle}>You're Ready!</Text>
            <Text style={styles.completionText}>
              You've learned the basics of placing your first options trade. Remember to start small and paper trade first!
            </Text>
            <GlowButton
              title="Practice in Paper Trading"
              onPress={() => navigation.goBack()}
              fullWidth
              style={styles.practiceButton}
            />
          </GlassCard>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
            {'<'} Previous
          </Text>
        </TouchableOpacity>

        <GlowButton
          title={currentStep === TUTORIAL_STEPS.length - 1 ? 'Complete' : 'Next'}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
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
  progressContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  progressPercent: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.neon.green,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  stepsRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepDotActive: {
    backgroundColor: colors.neon.green,
    ...shadows.neonGreenSubtle,
  },
  stepDotCompleted: {
    backgroundColor: colors.success,
  },
  stepDotText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  stepDotTextActive: {
    color: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  stepCard: {
    marginBottom: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepEmoji: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  stepTitle: {
    flex: 1,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  stepDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  tipsSection: {
    marginBottom: spacing.md,
  },
  tipsTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.neon.cyan,
    marginBottom: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  tipBullet: {
    fontSize: 12,
    color: colors.neon.green,
    marginRight: spacing.sm,
    marginTop: 4,
  },
  tipText: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  warningEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  warningText: {
    flex: 1,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.neon.yellow,
    lineHeight: 20,
  },
  completionCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  completionEmoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  completionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.neon.green,
    marginBottom: spacing.sm,
  },
  completionText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  practiceButton: {
    marginTop: spacing.sm,
  },
  bottomSpacer: {
    height: 20,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  navButton: {
    padding: spacing.md,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  navButtonTextDisabled: {
    color: colors.text.muted,
  },
  nextButton: {
    minWidth: 120,
  },
});

export default FirstTradeTutorialScreen;
