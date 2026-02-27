// Strategies Screen for Wall Street Wildlife Mobile
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LearnStackScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, getOutlookColor } from '../../theme';
import { TIER_INFO } from '../../data/constants';
import { strategies, strategyCounts, getStrategiesByTierLazy, preloadTier } from '../../data/strategies';
import { Strategy } from '../../data/types';
import { useAuth } from '../../contexts';
import { useSubscription } from '../../hooks';
import { GlassCard, GlowButton, GradientText, PremiumModal } from '../../components/ui';

type NavigationProp = LearnStackScreenProps<'Strategies'>['navigation'];

const StrategiesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTier, setExpandedTier] = useState<number | null>(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Lazy-loaded strategies for the currently expanded tier
  const [lazyTierStrategies, setLazyTierStrategies] = useState<Strategy[]>([]);
  const [loadingTier, setLoadingTier] = useState(false);

  // Load tier strategies lazily when a tier is expanded
  useEffect(() => {
    if (expandedTier === null) {
      setLazyTierStrategies([]);
      return;
    }

    let cancelled = false;
    setLoadingTier(true);

    getStrategiesByTierLazy(expandedTier)
      .then((result) => {
        if (!cancelled) {
          setLazyTierStrategies(result);
          setLoadingTier(false);

          // Prefetch the next tier while the user reads the current one
          const tierNumbers = TIER_INFO.map(t => t.tier as number);
          const currentIndex = tierNumbers.indexOf(expandedTier);
          if (currentIndex >= 0 && currentIndex < tierNumbers.length - 1) {
            preloadTier(tierNumbers[currentIndex + 1]);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Fallback: use the synchronous full-array filter
          setLazyTierStrategies(strategies.filter(s => s.tier === expandedTier));
          setLoadingTier(false);
        }
      });

    return () => { cancelled = true; };
  }, [expandedTier]);

  const { subscriptionTier, isPremium, getTierAccessLevel, canAccessStrategy } = useSubscription();

  // Synchronous helper – used for search filtering (needs all strategies)
  const getStrategiesForTier = (tier: number) => {
    return strategies.filter(s => s.tier === tier);
  };

  const getLocalOutlookColor = (outlook: string) => {
    return getOutlookColor(outlook);
  };

  const filteredTiers = TIER_INFO.filter(tier => {
    if (!searchQuery) return true;
    const strategies = getStrategiesForTier(tier.tier);
    return strategies.some(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <GradientText style={styles.headerTitle}>Learn</GradientText>
        <Text style={styles.headerSubtitle}>Master {strategyCounts.total}+ options strategies</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search strategies..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tiers List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tutorials Quick Access */}
        {!searchQuery && (
          <GlassCard style={styles.tutorialsCard} noPadding>
            <View style={styles.tutorialsHeader}>
              <Text style={styles.tutorialsTitle}>Beginner Tutorials</Text>
              <Text style={styles.tutorialsSubtitle}>Start here if you're new</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tutorialsScroll}
            >
              <TouchableOpacity
                style={styles.tutorialItem}
                onPress={() => navigation.navigate('OptionsVocabulary')}
              >
                <Ionicons name="book-outline" size={28} color={colors.neon.green} />
                <Text style={styles.tutorialName}>Vocabulary</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tutorialItem}
                onPress={() => navigation.navigate('FirstTradeTutorial')}
              >
                <Ionicons name="trending-up" size={28} color={colors.neon.green} />
                <Text style={styles.tutorialName}>First Trade</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tutorialItem}
                onPress={() => navigation.navigate('BeginnerMistakes')}
              >
                <Ionicons name="warning-outline" size={28} color={colors.neon.green} />
                <Text style={styles.tutorialName}>Mistakes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tutorialItem}
                onPress={() => navigation.navigate('AssignmentExercise')}
              >
                <Ionicons name="clipboard-outline" size={28} color={colors.neon.green} />
                <Text style={styles.tutorialName}>Assignment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tutorialItem}
                onPress={() => navigation.navigate('RollingAdjusting')}
              >
                <Ionicons name="refresh-outline" size={28} color={colors.neon.green} />
                <Text style={styles.tutorialName}>Rolling</Text>
              </TouchableOpacity>
            </ScrollView>
          </GlassCard>
        )}

        {/* Encyclopedia Quick Access */}
        {!searchQuery && (
          <TouchableOpacity
            style={styles.encyclopediaCard}
            onPress={() => navigation.navigate('OptionsEncyclopedia')}
          >
            <View style={styles.encyclopediaLeft}>
              <Text style={styles.encyclopediaTitle}>Options Encyclopedia</Text>
              <Text style={styles.encyclopediaSubtitle}>
                Search & filter all {strategyCounts.total}+ strategies
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
          </TouchableOpacity>
        )}

        {filteredTiers.map((tier) => {
          const tierStrategies = getStrategiesForTier(tier.tier);
          const accessLevel = getTierAccessLevel(tier.tier);
          const isLocked = accessLevel === 'locked';
          const isExpanded = expandedTier === tier.tier;

          if (searchQuery) {
            // Show filtered strategies directly when searching
            const filtered = tierStrategies.filter(s =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (filtered.length === 0) return null;

            return (
              <GlassCard key={tier.tier} style={styles.tierSection}>
                <View style={styles.tierHeader}>
                  <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
                    <Text style={styles.tierBadgeText}>
                      {tier.tier === 0.5 ? '0.5' : tier.tier}
                    </Text>
                  </View>
                  <View style={styles.tierInfo}>
                    <Text style={styles.tierName}>{tier.name}</Text>
                  </View>
                </View>
                <View style={styles.strategiesList}>
                  {filtered.map((strategy) => {
                    const stratIndex = tierStrategies.findIndex(s => s.id === strategy.id);
                    const stratLocked = !canAccessStrategy(strategy.id, tier.tier, stratIndex);
                    return (
                      <TouchableOpacity
                        key={strategy.id}
                        style={styles.strategyItem}
                        onPress={() => stratLocked
                          ? setShowPremiumModal(true)
                          : navigation.navigate('StrategyDetail', { strategyId: strategy.id })
                        }
                      >
                        <View style={styles.strategyLeft}>
                          <Text style={[styles.strategyName, stratLocked && styles.lockedText]}>
                            {strategy.name}
                          </Text>
                          <View style={[styles.outlookBadge, { backgroundColor: `${getLocalOutlookColor(strategy.outlook)}20` }]}>
                            <Text style={[styles.outlookText, { color: getLocalOutlookColor(strategy.outlook) }]}>
                              {strategy.outlook}
                            </Text>
                          </View>
                        </View>
                        {stratLocked ? (
                          <Ionicons name="lock-closed" size={16} color={colors.text.muted} />
                        ) : (
                          <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </GlassCard>
            );
          }

          // Special handling for Event Horizons tier
          if (tier.isEventHorizons) {
            return (
              <GlassCard key={tier.tier} style={styles.tierSection} noPadding>
                <TouchableOpacity
                  style={styles.tierHeader}
                  onPress={() => {
                    if (!isLocked) {
                      navigation.navigate('EventHorizonsHub');
                    }
                  }}
                  disabled={isLocked}
                >
                  <View
                    style={[
                      styles.tierBadge,
                      { backgroundColor: tier.color },
                      {
                        shadowColor: tier.color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        shadowRadius: 6,
                        elevation: 4,
                      },
                    ]}
                  >
                    <Text style={styles.tierBadgeText}>{tier.tier}</Text>
                  </View>
                  <View style={styles.tierInfo}>
                    <View style={styles.tierTitleRow}>
                      <Text style={styles.tierName}>{tier.name}</Text>
                      <Ionicons name="pulse-outline" size={16} color="#8b5cf6" />
                      {isLocked && <Ionicons name="lock-closed" size={14} color={colors.text.muted} />}
                    </View>
                    <Text style={styles.tierDescription}>
                      Prediction markets + options analysis
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                </TouchableOpacity>
              </GlassCard>
            );
          }

          return (
            <GlassCard key={tier.tier} style={styles.tierSection} noPadding>
              <TouchableOpacity
                style={styles.tierHeader}
                onPress={() => setExpandedTier(isExpanded ? null : tier.tier)}
              >
                <View
                  style={[
                    styles.tierBadge,
                    { backgroundColor: tier.color },
                    {
                      shadowColor: tier.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 6,
                      elevation: 4,
                    },
                  ]}
                >
                  <Text style={styles.tierBadgeText}>
                    {tier.tier === 0.5 ? '0.5' : tier.tier}
                  </Text>
                </View>
                <View style={styles.tierInfo}>
                  <View style={styles.tierTitleRow}>
                    <Text style={styles.tierName}>{tier.name}</Text>
                    {accessLevel === 'first-lesson' && (
                      <View style={styles.firstLessonBadge}>
                        <Text style={styles.firstLessonBadgeText}>1 FREE LESSON</Text>
                      </View>
                    )}
                    {isLocked && <Ionicons name="lock-closed" size={14} color={colors.text.muted} />}
                  </View>
                  <Text style={styles.tierDescription}>
                    {tierStrategies.length} strategies
                  </Text>
                </View>
                <Text style={[styles.chevron, isExpanded && styles.chevronExpanded]}>

                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.strategiesList}>
                  {/* Quiz Button */}
                  {tier.tier <= 5 && (
                    <TouchableOpacity
                      style={styles.quizButton}
                      onPress={() => navigation.navigate('Quiz', { tierId: tier.tier })}
                      disabled={isLocked}
                    >
                      <Ionicons name="create-outline" size={24} color={colors.neon.green} />
                      <View style={styles.quizInfo}>
                        <Text style={[styles.quizTitle, isLocked && styles.lockedText]}>
                          Take Quiz
                        </Text>
                        <Text style={styles.quizSubtitle}>
                          Test your {tier.name} knowledge
                        </Text>
                      </View>
                      <Ionicons name="arrow-forward" size={20} color={colors.background.primary} />
                    </TouchableOpacity>
                  )}

                  {loadingTier ? (
                    <View style={styles.tierLoadingContainer}>
                      <ActivityIndicator size="small" color={colors.neon.cyan} />
                    </View>
                  ) : lazyTierStrategies.map((strategy, index) => {
                    const stratLocked = !canAccessStrategy(strategy.id, tier.tier, index);
                    const isFreeLesson = accessLevel === 'first-lesson' && index === 0;
                    return (
                      <TouchableOpacity
                        key={strategy.id}
                        style={styles.strategyItem}
                        onPress={() => stratLocked
                          ? setShowPremiumModal(true)
                          : navigation.navigate('StrategyDetail', { strategyId: strategy.id })
                        }
                      >
                        <View style={styles.strategyLeft}>
                          <View style={styles.strategyNameRow}>
                            <Text style={[styles.strategyName, stratLocked && styles.lockedText]}>
                              {strategy.name}
                            </Text>
                            {isFreeLesson && (
                              <View style={styles.freeTag}>
                                <Text style={styles.freeTagText}>FREE</Text>
                              </View>
                            )}
                          </View>
                          <View style={[styles.outlookBadge, { backgroundColor: `${getLocalOutlookColor(strategy.outlook)}20` }]}>
                            <Text style={[styles.outlookText, { color: getLocalOutlookColor(strategy.outlook) }]}>
                              {strategy.outlook}
                            </Text>
                          </View>
                        </View>
                        {stratLocked ? (
                          <Ionicons name="lock-closed" size={16} color={colors.text.muted} />
                        ) : (
                          <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </GlassCard>
          );
        })}

        {/* Upgrade Banner */}
        {subscriptionTier === 'free' && (
          <GlassCard style={styles.upgradeBanner} withGlow glowColor={colors.neon.yellow}>
            <Ionicons name="rocket-outline" size={32} color="#fbbf24" />
            <Text style={styles.upgradeBannerTitle}>Get Jungle Pass</Text>
            <Text style={styles.upgradeBannerText}>
              Unlock all {strategyCounts.total}+ strategies, tools, mentors & unlimited trading — $9.99/mo or $99.99/yr
            </Text>
            <GlowButton
              title="Get Jungle Pass"
              onPress={() => setShowPremiumModal(true)}
              variant="secondary"
              size="md"
            />
          </GlassCard>
        )}
      </ScrollView>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName="All Strategies"
      />
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
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.styles.h2,
  },
  headerSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInputWrapper: {
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  searchInput: {
    height: 44,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.base,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  tutorialsCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  tutorialsHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  tutorialsTitle: {
    ...typography.styles.h5,
    color: colors.neon.cyan,
  },
  tutorialsSubtitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: 2,
  },
  tutorialsScroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tutorialItem: {
    alignItems: 'center',
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minWidth: 80,
    marginRight: spacing.sm,
  },
  tutorialName: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tierSection: {
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  tierBadge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBadgeText: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  tierInfo: {
    flex: 1,
  },
  tierTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tierName: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  tierDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  chevron: {
    fontSize: 16,
    color: colors.text.muted,
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  lockIcon: {
    fontSize: 16,
    color: colors.text.muted,
  },
  firstLessonBadge: {
    backgroundColor: colors.neon.cyan + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.neon.cyan + '40',
  },
  firstLessonBadgeText: {
    ...typography.styles.caption,
    color: colors.neon.cyan,
    fontWeight: '700',
    fontSize: 9,
  },
  strategyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  freeTag: {
    backgroundColor: colors.neon.green + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
  },
  freeTagText: {
    ...typography.styles.caption,
    color: colors.neon.green,
    fontWeight: '700',
    fontSize: 9,
  },
  strategiesList: {
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
  },
  tierLoadingContainer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.overlay.neonGreen,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
    gap: spacing.md,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    ...typography.styles.body,
    color: colors.neon.green,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },
  quizSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },


  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.md + 40 + spacing.md, // Indent to align with tier name
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  strategyLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  strategyName: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  lockedText: {
    color: colors.text.muted,
  },
  outlookBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  outlookText: {
    ...typography.styles.caption,
    fontSize: 10,
  },
  encyclopediaCard: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: colors.overlay.neonGreen,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: `${colors.neon.green}30`,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  encyclopediaLeft: {
    flex: 1,
  },
  encyclopediaTitle: {
    ...typography.styles.body,
    color: colors.neon.green,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600' as const,
  },
  encyclopediaSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  upgradeBanner: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  upgradeBannerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  upgradeBannerText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default StrategiesScreen;
