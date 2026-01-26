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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { TIER_INFO, getLevelFromXP, MASCOTS } from '../../data/constants';
import { useAuth } from '../../contexts';
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

  // Mock data for demonstration
  const progress = user?.progress || {
    xp: 0,
    streak: 0,
    completedStrategies: [],
    currentTier: 0,
  };

  const levelInfo = getLevelFromXP(progress.xp);
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
          <TouchableOpacity style={styles.avatarContainer}>
            {animalImage ? (
              <Image
                source={animalImage}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarEmoji}>
                {mascot?.id === 'monkey' ? '🐵' :
                 mascot?.id === 'owl' ? '🦉' :
                 mascot?.id === 'bull' ? '🐂' :
                 mascot?.id === 'bear' ? '🐻' : '🐵'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <GlassCard style={styles.progressCard} withGlow>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.levelBadge}>Level {levelInfo.level}</Text>
              <Text style={styles.levelTitle}>{levelInfo.title}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>{progress.xp} XP</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${levelInfo.progress * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercent}>
              {Math.round(levelInfo.progress * 100)}%
            </Text>
          </View>

          {/* Streak */}
          <View style={styles.streakContainer}>
            <Text style={styles.streakIcon}></Text>
            <Text style={styles.streakText}>{progress.streak} day streak</Text>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionCard, { borderColor: colors.bullish }]}
            onPress={() => (navigation as any).navigate('LearnTab')}
          >
            <Text style={styles.actionEmoji}></Text>
            <Text style={styles.actionTitle}>Continue Learning</Text>
            <Text style={styles.actionSubtitle}>Tier {progress.currentTier}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { borderColor: colors.neon.cyan }]}
            onPress={() => (navigation as any).navigate('PracticeTab')}
          >
            <Text style={styles.actionEmoji}></Text>
            <Text style={styles.actionTitle}>Paper Trade</Text>
            <Text style={styles.actionSubtitle}>$10,000 virtual</Text>
          </TouchableOpacity>
        </View>

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
            const isCompleted = tier.tier < progress.currentTier;
            const isCurrent = tier.tier === progress.currentTier;

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
                  {isCompleted && <Text style={styles.tierCheck}></Text>}
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
            <Text style={styles.missionEmoji}></Text>
            <View>
              <Text style={styles.missionTitle}>Complete 1 Strategy</Text>
              <Text style={styles.missionProgress}>0 / 1 completed</Text>
            </View>
          </View>
          <View style={styles.missionReward}>
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
  avatarEmoji: {
    fontSize: 24,
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
  streakIcon: {
    fontSize: 16,
  },
  streakText: {
    ...typography.styles.bodySm,
    color: colors.neon.yellow,
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
  actionEmoji: {
    fontSize: 32,
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
  tierCheck: {
    fontSize: 12,
    color: colors.text.primary,
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
  missionEmoji: {
    fontSize: 32,
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
