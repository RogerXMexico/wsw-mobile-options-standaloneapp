// Dashboard Screen for Wall Street Wildlife Mobile
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { TIER_INFO, getLevelFromXP, MASCOTS } from '../../data/constants';
import { useAuth } from '../../contexts';
import { useJungle } from '../../contexts';
import { GlassCard, GlowButton, GradientText } from '../../components/ui';

// Spirit animal images
const SPIRIT_ANIMAL_IMAGES: Record<string, any> = {
  turtle: require('../../../assets/animals/Turtle WSW.png'),
  sloth: require('../../../assets/animals/Sloth WSW.png'),
  owl: require('../../../assets/animals/Owl WSW.png'),
  fox: require('../../../assets/animals/Fox WSW.png'),
  cheetah: require('../../../assets/animals/Cheetah WSW.png'),
};

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { progress, level, levelName, xpProgress, streakDays } = useJungle();
  const [spiritAnimal, setSpiritAnimal] = useState<string | null>(null);

  // Load spirit animal from AsyncStorage
  useEffect(() => {
    const loadSpiritAnimal = async () => {
      try {
        const animal = await AsyncStorage.getItem('userSpiritAnimal');
        if (animal) {
          setSpiritAnimal(animal);
        }
      } catch (error) {
        console.error('Error loading spirit animal:', error);
      }
    };
    loadSpiritAnimal();
  }, []);

  const mascot = MASCOTS.find(m => m.id === (user?.avatarAnimal || 'monkey'));
  const animalImage = spiritAnimal ? SPIRIT_ANIMAL_IMAGES[spiritAnimal] : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <GradientText style={styles.userName}>
              {user?.displayName || 'Trader'}
            </GradientText>
          </View>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => (navigation as any).navigate('ProfileTab')}
          >
            {animalImage ? (
              <Image
                source={animalImage}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={24} color={colors.neon.yellow} />
            )}
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <GlassCard style={styles.progressCard} withGlow>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.levelBadge}>Level {level}</Text>
              <Text style={styles.levelTitle}>{levelName}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Ionicons name="star" size={14} color={colors.neon.green} />
              <Text style={styles.xpText}>{progress.xp} XP</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${xpProgress.percentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercent}>
              {Math.round(xpProgress.percentage)}%
            </Text>
          </View>

          {/* Streak */}
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={18} color={colors.neon.yellow} />
            <Text style={styles.streakText}>{streakDays} day streak</Text>
            <View style={styles.streakSpacer} />
            <Ionicons name="ribbon" size={14} color={colors.text.muted} />
            <Text style={styles.badgeCountText}>{progress.earnedBadges.length} badges</Text>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: colors.bullish }]}
            onPress={() => (navigation as any).navigate('LearnTab')}
          >
            <Ionicons name="book" size={32} color={colors.bullish} />
            <Text style={styles.actionTitle}>Continue Learning</Text>
            <Text style={styles.actionSubtitle}>
              {progress.completedLessons.length} lessons done
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { borderColor: colors.neon.cyan }]}
            onPress={() => (navigation as any).navigate('PracticeTab')}
          >
            <Ionicons name="trending-up" size={32} color={colors.neon.cyan} />
            <Text style={styles.actionTitle}>Paper Trade</Text>
            <Text style={styles.actionSubtitle}>$10,000 virtual</Text>
          </TouchableOpacity>
        </View>

        {/* Explore Features */}
        <Text style={styles.sectionTitle}>Explore</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featureScroll}
          contentContainerStyle={styles.featureScrollContent}
        >
          <TouchableOpacity
            style={[styles.featureCard, { borderColor: 'rgba(57, 255, 20, 0.3)' }]}
            onPress={() => (navigation as any).navigate('SocialFeed')}
          >
            <View style={[styles.featureIconBg, { backgroundColor: 'rgba(57, 255, 20, 0.1)' }]}>
              <Ionicons name="people" size={22} color={colors.neon.green} />
            </View>
            <Text style={styles.featureTitle}>Social Feed</Text>
            <Text style={styles.featureSubtitle}>See what others trade</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { borderColor: 'rgba(251, 191, 36, 0.3)' }]}
            onPress={() => (navigation as any).navigate('LearnTab', { screen: 'ChallengePaths' })}
          >
            <View style={[styles.featureIconBg, { backgroundColor: 'rgba(251, 191, 36, 0.1)' }]}>
              <Ionicons name="trophy" size={22} color={colors.neon.yellow} />
            </View>
            <Text style={styles.featureTitle}>Challenges</Text>
            <Text style={styles.featureSubtitle}>Earn badges & XP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { borderColor: 'rgba(0, 240, 255, 0.3)' }]}
            onPress={() => (navigation as any).navigate('ToolsTab', { screen: 'OptionsFlow' })}
          >
            <View style={[styles.featureIconBg, { backgroundColor: 'rgba(0, 240, 255, 0.1)' }]}>
              <Ionicons name="radio" size={22} color={colors.neon.cyan} />
            </View>
            <Text style={styles.featureTitle}>Live Flow</Text>
            <Text style={styles.featureSubtitle}>Options flow alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { borderColor: 'rgba(245, 158, 11, 0.3)' }]}
            onPress={() => (navigation as any).navigate('LearnTab', { screen: 'VideoLessons' })}
          >
            <View style={[styles.featureIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Ionicons name="videocam" size={22} color={colors.volatility} />
            </View>
            <Text style={styles.featureTitle}>Video Lessons</Text>
            <Text style={styles.featureSubtitle}>Coming soon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { borderColor: 'rgba(139, 92, 246, 0.3)' }]}
            onPress={() => (navigation as any).navigate('LearnTab', { screen: 'LearningPathSelector' })}
          >
            <View style={[styles.featureIconBg, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <Ionicons name="compass" size={22} color={colors.neon.purple} />
            </View>
            <Text style={styles.featureTitle}>Learning Paths</Text>
            <Text style={styles.featureSubtitle}>Choose your journey</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Featured Strategy */}
        <Text style={styles.sectionTitle}>Featured Strategy</Text>
        <GlassCard style={styles.featuredCard}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>TIER 3</Text>
          </View>
          <Text style={styles.featuredTitle}>Covered Call</Text>
          <Text style={styles.featuredDescription}>
            Generate income on stocks you own by selling call options above the current price.
          </Text>
          <View style={styles.featuredTags}>
            <View style={[styles.tag, { backgroundColor: colors.overlay.neonGreen }]}>
              <Text style={[styles.tagText, { color: colors.bullish }]}>Bullish</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.overlay.medium }]}>
              <Text style={styles.tagText}>Income</Text>
            </View>
          </View>
        </GlassCard>

        {/* Tier Progress */}
        <Text style={styles.sectionTitle}>Your Journey</Text>
        <GlassCard style={styles.tiersContainer}>
          {TIER_INFO.slice(0, 5).map((tier, index) => {
            const completedCount = progress.completedStrategies.length;
            const isCompleted = tier.tier < (completedCount > 10 ? 3 : completedCount > 5 ? 2 : completedCount > 0 ? 1 : 0);
            const isCurrent = !isCompleted && (index === 0 || TIER_INFO[index - 1]?.tier < (completedCount > 10 ? 3 : completedCount > 5 ? 2 : completedCount > 0 ? 1 : 0));

            return (
              <View key={tier.tier} style={styles.tierItem}>
                <View
                  style={[
                    styles.tierDot,
                    {
                      backgroundColor: isCompleted || isCurrent ? tier.color : colors.background.tertiary,
                      borderColor: isCurrent ? tier.color : 'transparent',
                      borderWidth: isCurrent ? 2 : 0,
                    },
                    (isCompleted || isCurrent) && {
                      shadowColor: tier.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 6,
                      elevation: 4,
                    },
                  ]}
                >
                  {isCompleted && <Ionicons name="checkmark" size={14} color={colors.text.primary} />}
                </View>
                <Text
                  style={[
                    styles.tierName,
                    { color: isCompleted || isCurrent ? colors.text.primary : colors.text.muted },
                  ]}
                >
                  {tier.name}
                </Text>
                {index < 4 && <View style={styles.tierLine} />}
              </View>
            );
          })}
        </GlassCard>

        {/* Daily Mission */}
        <Text style={styles.sectionTitle}>Daily Mission</Text>
        <GlassCard style={styles.missionCard}>
          <View style={styles.missionLeft}>
            <View style={styles.missionIconBg}>
              <Ionicons name="flag" size={22} color={colors.neon.yellow} />
            </View>
            <View>
              <Text style={styles.missionTitle}>Complete 1 Strategy</Text>
              <Text style={styles.missionProgress}>
                {progress.completedStrategies.length > 0 ? '1' : '0'} / 1 completed
              </Text>
            </View>
          </View>
          <View style={styles.missionReward}>
            <Ionicons name="star" size={12} color={colors.neon.green} />
            <Text style={styles.missionRewardText}>+50 XP</Text>
          </View>
        </GlassCard>

        {/* CTA Button */}
        <GlowButton
          title="Start Learning"
          onPress={() => (navigation as any).navigate('LearnTab')}
          fullWidth
          style={styles.ctaButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  headerLeft: {},
  greeting: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  userName: {
    ...typography.styles.h3,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.glass.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neon.yellow,
    overflow: 'hidden',
    ...shadows.neonGreenSubtle,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  progressCard: {
    marginBottom: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  levelBadge: {
    ...typography.styles.overline,
    color: colors.neon.green,
  },
  levelTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.overlay.neonGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  xpText: {
    ...typography.styles.labelSm,
    color: colors.neon.green,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.neon.green,
    borderRadius: borderRadius.full,
    ...shadows.neonGreenSubtle,
  },
  progressPercent: {
    ...typography.styles.labelSm,
    color: colors.text.secondary,
    width: 40,
    textAlign: 'right',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  streakText: {
    ...typography.styles.bodySm,
    color: colors.neon.yellow,
  },
  streakSpacer: {
    flex: 1,
  },
  badgeCountText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
  },
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    textAlign: 'center',
  },
  actionSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  // Explore features horizontal scroll
  featureScroll: {
    marginHorizontal: -spacing.lg,
  },
  featureScrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  featureCard: {
    width: 130,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  featureSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.text.muted,
  },
  featuredCard: {
    padding: spacing.lg,
  },
  featuredBadge: {
    backgroundColor: colors.tiers[3],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  featuredBadgeText: {
    ...typography.styles.overline,
    color: colors.text.primary,
    fontSize: 10,
  },
  featuredTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  featuredDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  featuredTags: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  tiersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.xs,
  },
  tierItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  tierDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  tierName: {
    ...typography.styles.caption,
    textAlign: 'center',
  },
  tierLine: {
    position: 'absolute',
    top: 12,
    right: -10,
    width: 20,
    height: 2,
    backgroundColor: colors.background.tertiary,
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  missionIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  missionProgress: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  missionReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.overlay.neonGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  missionRewardText: {
    ...typography.styles.labelSm,
    color: colors.neon.green,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  ctaButton: {
    marginTop: spacing.xl,
  },
});

export default DashboardScreen;
