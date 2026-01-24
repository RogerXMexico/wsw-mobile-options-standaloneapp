// Jungle Academy Hub Screen
// Main gamification hub with XP, levels, daily missions, and spirit animal

import React from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GlowButton } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts';
import {
  JUNGLE_LEVELS,
  DAILY_MISSIONS,
  getLevelForXP,
  getXPProgress,
  DailyMission,
} from '../../data/jungleBadges';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

// Mock user progress data
const mockProgress = {
  xp: 2750,
  streak: 7,
  badgesEarned: ['first-steps', 'on-fire', 'quiz-master'],
  spiritAnimal: 'owl',
  tribeId: null,
  missionsCompleted: 2,
};

// Mock mission progress for today
const getMissionsWithProgress = (): (DailyMission & { completed: boolean })[] => {
  return DAILY_MISSIONS.map((mission, index) => ({
    ...mission,
    progress: index < 2 ? mission.target : Math.floor(mission.target * 0.5),
    completed: index < 2,
  }));
};

const JungleAcademyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const xp = mockProgress.xp;
  const level = getLevelForXP(xp);
  const progress = getXPProgress(xp);
  const missions = getMissionsWithProgress();
  const completedMissions = missions.filter(m => m.completed).length;
  const totalMissionXP = missions.reduce((sum, m) => sum + (m.completed ? m.xpReward : 0), 0);

  const spiritAnimalEmoji = mockProgress.spiritAnimal === 'owl' ? '' :
    mockProgress.spiritAnimal === 'badger' ? '' :
    mockProgress.spiritAnimal === 'monkey' ? '' :
    mockProgress.spiritAnimal === 'bull' ? '' :
    mockProgress.spiritAnimal === 'bear' ? '' :
    mockProgress.spiritAnimal === 'chameleon' ? '' : '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'} Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jungle Academy</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={['rgba(57, 255, 20, 0.15)', 'rgba(0, 240, 255, 0.1)', 'transparent']}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}></Text>
            <Text style={styles.heroTitle}>Jungle Trading Academy</Text>
            <Text style={styles.heroSubtitle}>
              Master options trading with guidance from animal mentors
            </Text>
          </View>
        </LinearGradient>

        {/* Level & XP Card */}
        <GlassCard style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelIconContainer}>
              <Text style={styles.levelIcon}>{level.icon}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{level.name}</Text>
              <Text style={styles.levelNumber}>Level {level.level}</Text>
            </View>
            <View style={styles.xpContainer}>
              <Text style={styles.xpValue}>{xp.toLocaleString()}</Text>
              <Text style={styles.xpLabel}>Total XP</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress to Level {level.level + 1}</Text>
              <Text style={styles.progressValue}>{progress.current} / {progress.needed} XP</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={[colors.neon.green, colors.neon.cyan]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress.percentage}%` }]}
              />
            </View>
          </View>

          <View style={styles.levelRewards}>
            <Text style={styles.rewardsTitle}>Level Rewards:</Text>
            <View style={styles.rewardsList}>
              {level.rewards.slice(0, 2).map((reward, index) => (
                <View key={index} style={styles.rewardItem}>
                  <Text style={styles.rewardDot}></Text>
                  <Text style={styles.rewardText}>{reward}</Text>
                </View>
              ))}
            </View>
          </View>
        </GlassCard>

        {/* Spirit Animal Section */}
        <GlassCard style={styles.spiritCard}>
          <View style={styles.spiritHeader}>
            <Text style={styles.sectionTitle}>Your Spirit Animal</Text>
            {!mockProgress.spiritAnimal && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
          </View>

          {mockProgress.spiritAnimal ? (
            <View style={styles.spiritContent}>
              <View style={[styles.spiritAvatarContainer, shadows.neonCyan]}>
                <Text style={styles.spiritEmoji}>{spiritAnimalEmoji}</Text>
              </View>
              <View style={styles.spiritInfo}>
                <Text style={styles.spiritName}>The Wise {mockProgress.spiritAnimal.charAt(0).toUpperCase() + mockProgress.spiritAnimal.slice(1)}</Text>
                <Text style={styles.spiritDescription}>
                  Analytical and patient, you study the market before making calculated moves.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => navigation.navigate('SpiritAnimalQuiz')}
              >
                <Text style={styles.retakeText}>Retake Quiz</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.discoverButton}
              onPress={() => navigation.navigate('SpiritAnimalQuiz')}
            >
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)']}
                style={styles.discoverGradient}
              >
                <Text style={styles.discoverEmoji}></Text>
                <Text style={styles.discoverTitle}>Discover Your Trading Spirit Animal</Text>
                <Text style={styles.discoverSubtitle}>
                  Take a quick quiz to find your trading style match
                </Text>
                <View style={styles.startQuizRow}>
                  <Text style={styles.startQuizText}>Start Quiz</Text>
                  <Text style={styles.startQuizArrow}>{'>'}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </GlassCard>

        {/* Daily Missions */}
        <GlassCard style={styles.missionsCard}>
          <View style={styles.missionsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Daily Missions</Text>
              <Text style={styles.missionsSubtitle}>
                {completedMissions}/{missions.length} completed | +{totalMissionXP} XP earned
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('DailyMissions')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.missionsList}>
            {missions.slice(0, 3).map((mission) => (
              <View
                key={mission.id}
                style={[styles.missionItem, mission.completed && styles.missionCompleted]}
              >
                <View style={[styles.missionIcon, mission.completed && styles.missionIconCompleted]}>
                  <Text style={styles.missionEmoji}>
                    {mission.completed ? '' : mission.icon}
                  </Text>
                </View>
                <View style={styles.missionContent}>
                  <Text style={[styles.missionTitle, mission.completed && styles.missionTitleCompleted]}>
                    {mission.title}
                  </Text>
                  <Text style={styles.missionDescription}>{mission.description}</Text>
                </View>
                <View style={styles.missionXP}>
                  <Text style={[styles.missionXPValue, mission.completed && styles.missionXPCompleted]}>
                    +{mission.xpReward}
                  </Text>
                  <Text style={styles.missionXPLabel}>XP</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <LinearGradient
              colors={['rgba(251, 191, 36, 0.2)', 'rgba(251, 191, 36, 0.05)']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionEmoji}></Text>
              <Text style={styles.actionTitle}>Leaderboard</Text>
              <Text style={styles.actionSubtitle}>See top traders</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Badges')}
          >
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.05)']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionEmoji}></Text>
              <Text style={styles.actionTitle}>Badges</Text>
              <Text style={styles.actionSubtitle}>{mockProgress.badgesEarned.length} earned</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('JungleTribes')}
          >
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.05)']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionEmoji}></Text>
              <Text style={styles.actionTitle}>Tribes</Text>
              <Text style={styles.actionSubtitle}>{mockProgress.tribeId ? 'View tribe' : 'Join one!'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('DailyMissions')}
          >
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionEmoji}></Text>
              <Text style={styles.actionTitle}>Missions</Text>
              <Text style={styles.actionSubtitle}>{completedMissions}/5 today</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Streak */}
        <GlassCard style={styles.streakCard}>
          <View style={styles.streakContent}>
            <Text style={styles.streakEmoji}></Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakTitle}>{mockProgress.streak} Day Streak!</Text>
              <Text style={styles.streakSubtitle}>Keep learning to earn bonus XP</Text>
            </View>
            <View style={styles.streakBonusContainer}>
              <Text style={styles.streakBonus}>+{mockProgress.streak * 10}</Text>
              <Text style={styles.streakBonusLabel}>XP/day</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
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
  heroGradient: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  levelCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.overlay.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neon.green,
  },
  levelIcon: {
    fontSize: 28,
  },
  levelInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  levelName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.green,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  levelNumber: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.neon.cyan,
  },
  xpLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  progressValue: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  levelRewards: {
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
    paddingTop: spacing.md,
  },
  rewardsTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  rewardsList: {
    gap: 4,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rewardDot: {
    fontSize: 10,
    color: colors.neon.green,
  },
  rewardText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  spiritCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  spiritHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  newBadge: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  newBadgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: colors.background.primary,
  },
  spiritContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spiritAvatarContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neon.cyan,
  },
  spiritEmoji: {
    fontSize: 32,
  },
  spiritInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  spiritName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.cyan,
  },
  spiritDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  retakeButton: {
    padding: spacing.sm,
  },
  retakeText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  discoverButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  discoverGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: borderRadius.lg,
  },
  discoverEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  discoverTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    textAlign: 'center',
  },
  discoverSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  startQuizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  startQuizText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.success,
  },
  startQuizArrow: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.success,
  },
  missionsCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  missionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  missionsSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: 2,
  },
  viewAllText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.neon.green,
  },
  missionsList: {
    gap: spacing.sm,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
  },
  missionCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  missionIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionIconCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  missionEmoji: {
    fontSize: 20,
  },
  missionContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  missionTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  missionTitleCompleted: {
    color: colors.success,
  },
  missionDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  missionXP: {
    alignItems: 'flex-end',
  },
  missionXPValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.yellow,
  },
  missionXPCompleted: {
    color: colors.success,
  },
  missionXPLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionCard: {
    width: (width - spacing.md * 2 - spacing.sm) / 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: borderRadius.lg,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  actionTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  actionSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  streakCard: {
    marginHorizontal: spacing.md,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 32,
  },
  streakInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.orange,
  },
  streakSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  streakBonusContainer: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  streakBonus: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.orange,
  },
  streakBonusLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default JungleAcademyScreen;
