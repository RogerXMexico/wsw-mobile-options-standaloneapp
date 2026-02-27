// Subscription Screen for Wall Street Wildlife Mobile — Jungle Pass
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GradientText, GlowButton } from '../../components/ui';
import { useAuth } from '../../contexts';
import { JUNGLE_PASS_PRICING, ALA_CARTE_PRICING } from '../../data/constants';

const WEBSITE_PRICING_URL = 'https://WallStreetWildlifeOptions.com/pricing';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingOption {
  id: 'monthly' | 'annual';
  name: string;
  price: string;
  pricePerMonth: string;
  period: string;
  savings?: string;
  bestValue?: boolean;
}

const PRICING_OPTIONS: PricingOption[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: `$${JUNGLE_PASS_PRICING.monthly.price}`,
    pricePerMonth: `$${JUNGLE_PASS_PRICING.monthly.price}`,
    period: '/month',
  },
  {
    id: 'annual',
    name: 'Annual',
    price: `$${JUNGLE_PASS_PRICING.annual.price}`,
    pricePerMonth: `$${(JUNGLE_PASS_PRICING.annual.price / 12).toFixed(2)}`,
    period: '/year',
    savings: `Save $${JUNGLE_PASS_PRICING.annual.savings}`,
    bestValue: true,
  },
];

const FREE_FEATURES: PlanFeature[] = [
  { text: 'Tier 0 & 0.5 full access', included: true },
  { text: 'First lesson free in Tiers 1 & 2', included: true },
  { text: '2 paper trades per day', included: true },
  { text: 'Greeks calculator & Position sizer', included: true },
  { text: '1 animal mentor (Turtle)', included: true },
  { text: 'Community read access', included: true },
  { text: 'Tiers 3–10 strategies', included: false },
  { text: 'All premium tools & calculators', included: false },
  { text: 'Unlimited paper trading', included: false },
  { text: '16 animal mentors', included: false },
];

const PREMIUM_FEATURES: PlanFeature[] = [
  { text: 'All 90+ strategy lessons (Tiers 0-10)', included: true },
  { text: 'Unlimited paper trading', included: true },
  { text: 'All quizzes, badges & challenges', included: true },
  { text: 'All calculators & premium tools', included: true },
  { text: '16 animal mentor guides', included: true },
  { text: 'Real-time market data', included: true },
  { text: 'Options Flow & AI tools', included: true },
  { text: 'Earnings Calendar', included: true },
  { text: 'Tribe chat & social trading', included: true },
  { text: 'Challenge Paths', included: true },
  { text: 'Full community access', included: true },
];

const ALA_CARTE_ITEMS = [
  { name: 'Individual Tier', price: `$${ALA_CARTE_PRICING.individualTier.min}–$${ALA_CARTE_PRICING.individualTier.max}`, icon: 'book-outline' as const },
  { name: 'Tool Pack', price: `$${ALA_CARTE_PRICING.toolPack}`, icon: 'construct-outline' as const },
  { name: 'Mentor Pack', price: `$${ALA_CARTE_PRICING.mentorPack}`, icon: 'paw-outline' as const },
  { name: 'Community Pack', price: `$${ALA_CARTE_PRICING.communityPack}`, icon: 'people-outline' as const },
];

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('annual');

  const currentPlan = user?.subscriptionTier || 'free';
  const isPremium = currentPlan !== 'free';

  const handleSubscribeOnWeb = () => {
    Linking.openURL(WEBSITE_PRICING_URL);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>Jungle Pass</GradientText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Plan Banner */}
        <GlassCard style={styles.currentPlanCard} withGlow glowColor={isPremium ? colors.neon.green : colors.text.muted}>
          <Text style={styles.currentPlanLabel}>Current Plan</Text>
          <Text style={[styles.currentPlanName, !isPremium && { color: colors.text.secondary }]}>
            {isPremium ? 'Jungle Pass' : 'Free'}
          </Text>
          {isPremium && (
            <Text style={styles.renewalNote}>
              Subscription managed on WallStreetWildlifeOptions.com
            </Text>
          )}
        </GlassCard>

        {!isPremium && (
          <>
            {/* Unlock Premium Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Unlock the Full Jungle</Text>
              <Text style={styles.sectionSubtitle}>
                All 90+ strategies, tools, mentors & unlimited trading
              </Text>
            </View>

            {/* Billing Toggle */}
            <View style={styles.billingToggle}>
              {PRICING_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.billingOption,
                    selectedBilling === option.id && styles.billingOptionActive,
                  ]}
                  onPress={() => setSelectedBilling(option.id)}
                >
                  <Text
                    style={[
                      styles.billingOptionText,
                      selectedBilling === option.id && styles.billingOptionTextActive,
                    ]}
                  >
                    {option.name}
                  </Text>
                  {option.bestValue && (
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>BEST VALUE</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Pricing Display */}
            <GlassCard style={styles.pricingCard} withGlow glowColor={colors.neon.green}>
              <LinearGradient
                colors={[colors.neon.green + '15', 'transparent']}
                style={styles.pricingGradient}
              >
                <View style={styles.priceRow}>
                  <Text style={styles.priceAmount}>
                    {PRICING_OPTIONS.find(o => o.id === selectedBilling)?.price}
                  </Text>
                  <Text style={styles.pricePeriod}>
                    {PRICING_OPTIONS.find(o => o.id === selectedBilling)?.period}
                  </Text>
                </View>
                {selectedBilling === 'annual' && (
                  <>
                    <Text style={styles.pricePerMonth}>
                      Just {PRICING_OPTIONS[1].pricePerMonth}/month
                    </Text>
                    <View style={styles.savingsBadge}>
                      <Ionicons name="star" size={14} color={colors.background.primary} />
                      <Text style={styles.savingsText}>
                        {PRICING_OPTIONS[1].savings} vs monthly
                      </Text>
                    </View>
                  </>
                )}
              </LinearGradient>

              {/* Premium Features */}
              <View style={styles.featuresList}>
                {PREMIUM_FEATURES.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.neon.green}
                      style={styles.featureIcon}
                    />
                    <Text style={styles.featureText}>{feature.text}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>

            {/* Subscribe on Web Button */}
            <GlowButton
              title="Get Jungle Pass"
              onPress={handleSubscribeOnWeb}
              variant="primary"
              fullWidth
              style={styles.subscribeButton}
            />

            <Text style={styles.webOnlyNote}>
              Subscriptions are managed through our website to offer you the best price.
              Your Jungle Pass syncs automatically to this app.
            </Text>

            {/* Restore Purchase */}
            <TouchableOpacity style={styles.restoreLink}>
              <Text style={styles.restoreLinkText}>Restore Purchase</Text>
            </TouchableOpacity>

            {/* A La Carte Section */}
            <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
              <Text style={styles.sectionTitle}>A La Carte</Text>
              <Text style={styles.sectionSubtitle}>
                Buy individual tiers or packs
              </Text>
            </View>
            <GlassCard style={styles.alaCarteCard}>
              {ALA_CARTE_ITEMS.map((item, index) => (
                <View key={index} style={[styles.alaCarteRow, index < ALA_CARTE_ITEMS.length - 1 && styles.alaCarteBorder]}>
                  <View style={styles.alaCarteLeft}>
                    <Ionicons name={item.icon} size={20} color={colors.neon.cyan} />
                    <Text style={styles.alaCarteName}>{item.name}</Text>
                  </View>
                  <Text style={styles.alaCartePrice}>{item.price}</Text>
                </View>
              ))}
            </GlassCard>
          </>
        )}

        {isPremium && (
          <>
            {/* Premium Features List */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Jungle Pass Features</Text>
            </View>

            <GlassCard style={styles.featuresCard}>
              {PREMIUM_FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={colors.neon.green}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </GlassCard>

            <TouchableOpacity
              style={styles.manageLink}
              onPress={handleSubscribeOnWeb}
            >
              <Text style={styles.manageLinkText}>
                Manage subscription on WallStreetWildlifeOptions.com
              </Text>
              <Ionicons name="open-outline" size={16} color={colors.neon.cyan} />
            </TouchableOpacity>
          </>
        )}

        {/* Free Plan Comparison (when not premium) */}
        {!isPremium && (
          <>
            <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
              <Text style={styles.sectionTitle}>Free Plan</Text>
            </View>
            <GlassCard style={styles.featuresCard}>
              {FREE_FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons
                    name={feature.included ? 'checkmark-circle' : 'close-circle'}
                    size={18}
                    color={feature.included ? colors.success : colors.text.muted}
                    style={styles.featureIcon}
                  />
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
            </GlassCard>
          </>
        )}
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
  renewalNote: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
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
  bestValueBadge: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  bestValueText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: '700',
    fontSize: 9,
  },
  pricingCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  pricingGradient: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    ...typography.styles.h1,
    color: colors.neon.green,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  pricePeriod: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  pricePerMonth: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  savingsText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: '700',
  },
  featuresList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: spacing.sm,
    width: 22,
  },
  featureText: {
    ...typography.styles.bodySm,
    color: colors.text.primary,
    flex: 1,
  },
  featureTextDisabled: {
    color: colors.text.muted,
  },
  subscribeButton: {
    marginBottom: spacing.md,
  },
  webOnlyNote: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  restoreLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  restoreLinkText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textDecorationLine: 'underline',
  },
  alaCarteCard: {
    marginBottom: spacing.lg,
  },
  alaCarteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  alaCarteBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  alaCarteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  alaCarteName: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  alaCartePrice: {
    ...typography.styles.label,
    color: colors.neon.cyan,
  },
  featuresCard: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  manageLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  manageLinkText: {
    ...typography.styles.body,
    color: colors.neon.cyan,
  },
});

export default SubscriptionScreen;
