// Subscription Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GradientText, GlowButton } from '../../components/ui';
import { useAuth } from '../../contexts';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  color: string;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with options basics',
    color: colors.text.secondary,
    features: [
      { text: 'Basic strategy lessons', included: true },
      { text: '5 practice trades/day', included: true },
      { text: 'Limited quizzes', included: true },
      { text: 'Community access', included: true },
      { text: 'Real-time data', included: false },
      { text: 'Advanced calculators', included: false },
      { text: 'AI Signal Analyzer', included: false },
      { text: 'Paper trading', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    description: 'Unlock the full jungle experience',
    color: colors.neon.green,
    popular: true,
    features: [
      { text: 'All strategy lessons', included: true },
      { text: 'Unlimited practice trades', included: true },
      { text: 'All quizzes & badges', included: true },
      { text: 'Priority community access', included: true },
      { text: 'Real-time market data', included: true },
      { text: 'All calculators & tools', included: true },
      { text: 'AI Signal Analyzer', included: true },
      { text: 'Full paper trading', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: '/month',
    description: 'For serious traders',
    color: colors.neon.yellow,
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Options flow data', included: true },
      { text: 'Exclusive strategies', included: true },
      { text: 'Direct mentor access', included: true },
      { text: '1-on-1 coaching calls', included: true },
      { text: 'Early feature access', included: true },
      { text: 'Custom alerts', included: true },
    ],
  },
];

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>(user?.subscriptionTier || 'free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlan = user?.subscriptionTier || 'free';
  const isCurrentPlan = (planId: string) => currentPlan === planId;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (selectedPlan === currentPlan) {
      Alert.alert('Current Plan', 'You are already on this plan.');
      return;
    }

    Alert.alert(
      'Upgrade Plan',
      `Upgrade to ${PLANS.find(p => p.id === selectedPlan)?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: () => {
            // Handle subscription - would integrate with App Store/Play Store
            Alert.alert('Success', 'Subscription updated! (Demo)');
          },
        },
      ]
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert('Restore Purchases', 'Checking for previous purchases...', [
      { text: 'OK' },
    ]);
  };

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'This will open your device settings to manage your subscription.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              // Opens iOS subscription settings
              Linking.openURL('itms-apps://apps.apple.com/account/subscriptions');
            } else {
              // Opens Google Play subscription settings
              Linking.openURL('https://play.google.com/store/account/subscriptions');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>Subscription</GradientText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Plan Banner */}
        <GlassCard style={styles.currentPlanCard} withGlow glowColor={colors.neon.green}>
          <Text style={styles.currentPlanLabel}>Current Plan</Text>
          <Text style={styles.currentPlanName}>
            {PLANS.find(p => p.id === currentPlan)?.name || 'Free'}
          </Text>
          {currentPlan !== 'free' && (
            <Text style={styles.renewalDate}>Renews on March 1, 2025</Text>
          )}
        </GlassCard>

        {/* Billing Cycle Toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'monthly' && styles.billingOptionActive,
            ]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text
              style={[
                styles.billingOptionText,
                billingCycle === 'monthly' && styles.billingOptionTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'yearly' && styles.billingOptionActive,
            ]}
            onPress={() => setBillingCycle('yearly')}
          >
            <Text
              style={[
                styles.billingOptionText,
                billingCycle === 'yearly' && styles.billingOptionTextActive,
              ]}
            >
              Yearly
            </Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>Save 20%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plans */}
        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.8}
            onPress={() => handleSelectPlan(plan.id)}
          >
            <GlassCard
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                selectedPlan === plan.id && { borderColor: plan.color },
              ]}
            >
              {plan.popular && (
                <LinearGradient
                  colors={[colors.neon.green, colors.neon.cyan]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.popularBadge}
                >
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </LinearGradient>
              )}

              <View style={styles.planHeader}>
                <View>
                  <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </View>

              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text
                      style={[
                        styles.featureIcon,
                        { color: feature.included ? colors.success : colors.text.muted },
                      ]}
                    >
                      {feature.included ? '✓' : '✗'}
                    </Text>
                    <Text
                      style={[
                        styles.featureText,
                        !feature.included && styles.featureTextDisabled,
                      ]}
                    >
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>

              {isCurrentPlan(plan.id) && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current Plan</Text>
                </View>
              )}

              {selectedPlan === plan.id && !isCurrentPlan(plan.id) && (
                <View style={[styles.selectedIndicator, { backgroundColor: plan.color }]} />
              )}
            </GlassCard>
          </TouchableOpacity>
        ))}

        {/* Subscribe Button */}
        {selectedPlan !== currentPlan && (
          <GlowButton
            title={`Upgrade to ${PLANS.find(p => p.id === selectedPlan)?.name}`}
            onPress={handleSubscribe}
            variant="primary"
            fullWidth
            style={styles.subscribeButton}
          />
        )}

        {/* Action Links */}
        <View style={styles.actionLinks}>
          <TouchableOpacity style={styles.actionLink} onPress={handleRestorePurchases}>
            <Text style={styles.actionLinkText}>Restore Purchases</Text>
          </TouchableOpacity>
          {currentPlan !== 'free' && (
            <TouchableOpacity style={styles.actionLink} onPress={handleManageSubscription}>
              <Text style={styles.actionLinkText}>Manage Subscription</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Legal */}
        <Text style={styles.legalText}>
          Subscriptions auto-renew unless cancelled 24 hours before the end of the current period.
          Payment will be charged to your App Store account. You can manage and cancel subscriptions
          in your device's account settings.
        </Text>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    ...typography.styles.h4,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  currentPlanCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  currentPlanLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  currentPlanName: {
    ...typography.styles.h3,
    color: colors.neon.green,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  renewalDate: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  billingOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  billingOptionActive: {
    backgroundColor: colors.background.primary,
    ...shadows.dark,
  },
  billingOptionText: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  billingOptionTextActive: {
    color: colors.text.primary,
  },
  saveBadge: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  saveBadgeText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  planCard: {
    marginBottom: spacing.md,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: borderRadius.md,
  },
  popularBadgeText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: '700',
    fontSize: 10,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  planName: {
    ...typography.styles.h4,
    marginBottom: spacing.xs,
  },
  planDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  planPeriod: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
    width: 20,
  },
  featureText: {
    ...typography.styles.bodySm,
    color: colors.text.primary,
  },
  featureTextDisabled: {
    color: colors.text.muted,
  },
  currentBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: colors.overlay.neonGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.neon.green,
  },
  currentBadgeText: {
    ...typography.styles.caption,
    color: colors.neon.green,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
  },
  subscribeButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  actionLinks: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionLink: {
    padding: spacing.sm,
  },
  actionLinkText: {
    ...typography.styles.body,
    color: colors.neon.cyan,
  },
  legalText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SubscriptionScreen;
