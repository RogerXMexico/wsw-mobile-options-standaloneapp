// Daily Missions Screen
// Track and complete daily missions for XP

import React from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import { DAILY_MISSIONS, DailyMission } from '../../data/jungleBadges';
import { EVENT_HORIZONS_MISSIONS, EventHorizonsMission } from '../../data/eventHorizonsBadges';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

// Mock mission progress
const getMockMissionProgress = (): (DailyMission & { progress: number; completed: boolean })[] => {
  const progressMap: Record<string, number> = {
    'complete-lesson': 1,
    'pass-quiz': 1,
    'paper-trade': 2,
    'visit-tools': 1,
    'daily-login': 1,
  };

  return DAILY_MISSIONS.map((mission) => ({
    ...mission,
    progress: progressMap[mission.id] || 0,
    completed: (progressMap[mission.id] || 0) >= mission.target,
  }));
};

// Mock Event Horizons mission progress
const getEHMissionProgress = (): (EventHorizonsMission & { progress: number; completed: boolean })[] => {
  const progressMap: Record<string, number> = {
    'daily-lesson': 1,
    'scanner-check': 1,
    'case-study-view': 0,
    'gap-analysis': 1,
    'paper-trade': 0,
    'replay-complete': 0,
  };

  // Get 3 missions for today (1 easy, 1 medium, 1 hard)
  const todaysMissions = EVENT_HORIZONS_MISSIONS.filter((_, index) => index < 3);

  return todaysMissions.map((mission) => ({
    ...mission,
    progress: progressMap[mission.id] || 0,
    completed: (progressMap[mission.id] || 0) >= mission.requirement.count,
  }));
};

// Weekly missions
const WEEKLY_MISSIONS = [
  {
    id: 'weekly-lessons',
    title: 'Knowledge Seeker',
    description: 'Complete 5 lessons this week',
    xpReward: 200,
    icon: '',
    target: 5,
    progress: 3,
  },
  {
    id: 'weekly-quizzes',
    title: 'Quiz Champion',
    description: 'Pass 3 quizzes this week',
    xpReward: 150,
    icon: '',
    target: 3,
    progress: 2,
  },
  {
    id: 'weekly-streak',
    title: 'Consistency King',
    description: 'Maintain a 7-day streak',
    xpReward: 250,
    icon: '',
    target: 7,
    progress: 5,
  },
];

const DailyMissionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const dailyMissions = getMockMissionProgress();
  const completedDaily = dailyMissions.filter(m => m.completed).length;
  const totalDailyXP = dailyMissions.reduce((sum, m) => sum + (m.completed ? m.xpReward : 0), 0);
  const potentialDailyXP = dailyMissions.reduce((sum, m) => sum + m.xpReward, 0);

  const completedWeekly = WEEKLY_MISSIONS.filter(m => m.progress >= m.target).length;
  const totalWeeklyXP = WEEKLY_MISSIONS.reduce((sum, m) => sum + (m.progress >= m.target ? m.xpReward : 0), 0);

  // Event Horizons missions
  const ehMissions = getEHMissionProgress();
  const completedEH = ehMissions.filter(m => m.completed).length;
  const totalEHXP = ehMissions.reduce((sum, m) => sum + (m.completed ? m.xpReward : 0), 0);
  const potentialEHXP = ehMissions.reduce((sum, m) => sum + m.xpReward, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Missions</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <GlassCard style={styles.summaryCard}>
          <LinearGradient
            colors={['rgba(57, 255, 20, 0.1)', 'transparent']}
            style={styles.summaryGradient}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}></Text>
                <Text style={styles.summaryValue}>{completedDaily}/{dailyMissions.length}</Text>
                <Text style={styles.summaryLabel}>Daily</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}></Text>
                <Text style={styles.summaryValue}>{completedWeekly}/{WEEKLY_MISSIONS.length}</Text>
                <Text style={styles.summaryLabel}>Weekly</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}></Text>
                <Text style={[styles.summaryValue, { color: colors.neon.yellow }]}>
                  +{totalDailyXP + totalWeeklyXP}
                </Text>
                <Text style={styles.summaryLabel}>XP Earned</Text>
              </View>
            </View>
          </LinearGradient>
        </GlassCard>

        {/* Daily Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Daily Missions</Text>
              <Text style={styles.sectionSubtitle}>Resets in 8h 23m</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>{totalDailyXP}/{potentialDailyXP} XP</Text>
            </View>
          </View>

          {dailyMissions.map((mission) => (
            <View
              key={mission.id}
              style={[styles.missionCard, mission.completed && styles.missionCardCompleted]}
            >
              <View style={[styles.missionIconContainer, mission.completed && styles.missionIconCompleted]}>
                <Text style={styles.missionIcon}>
                  {mission.completed ? '' : mission.icon}
                </Text>
              </View>
              <View style={styles.missionContent}>
                <Text style={[styles.missionTitle, mission.completed && styles.missionTitleCompleted]}>
                  {mission.title}
                </Text>
                <Text style={styles.missionDescription}>{mission.description}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(100, (mission.progress / mission.target) * 100)}%`,
                          backgroundColor: mission.completed ? colors.success : colors.neon.cyan,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {mission.progress}/{mission.target}
                  </Text>
                </View>
              </View>
              <View style={styles.missionReward}>
                <Text style={[styles.missionXP, mission.completed && styles.missionXPCompleted]}>
                  +{mission.xpReward}
                </Text>
                <Text style={styles.missionXPLabel}>XP</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Weekly Missions</Text>
              <Text style={styles.sectionSubtitle}>Resets in 3 days</Text>
            </View>
            <View style={[styles.xpBadge, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
              <Text style={[styles.xpBadgeText, { color: colors.neon.purple }]}>
                {totalWeeklyXP}/600 XP
              </Text>
            </View>
          </View>

          {WEEKLY_MISSIONS.map((mission) => {
            const isCompleted = mission.progress >= mission.target;
            return (
              <View
                key={mission.id}
                style={[styles.missionCard, isCompleted && styles.missionCardCompleted]}
              >
                <View style={[styles.missionIconContainer, isCompleted && styles.missionIconCompleted]}>
                  <Text style={styles.missionIcon}>
                    {isCompleted ? '' : mission.icon}
                  </Text>
                </View>
                <View style={styles.missionContent}>
                  <Text style={[styles.missionTitle, isCompleted && styles.missionTitleCompleted]}>
                    {mission.title}
                  </Text>
                  <Text style={styles.missionDescription}>{mission.description}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.min(100, (mission.progress / mission.target) * 100)}%`,
                            backgroundColor: isCompleted ? colors.success : colors.neon.purple,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {mission.progress}/{mission.target}
                    </Text>
                  </View>
                </View>
                <View style={styles.missionReward}>
                  <Text style={[styles.missionXP, isCompleted && styles.missionXPCompleted]}>
                    +{mission.xpReward}
                  </Text>
                  <Text style={styles.missionXPLabel}>XP</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Event Horizons Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.ehEmoji}>🦎</Text>
              <View>
                <Text style={[styles.sectionTitle, styles.ehTitle]}>Event Horizons</Text>
                <Text style={styles.sectionSubtitle}>Prediction market challenges</Text>
              </View>
            </View>
            <View style={[styles.xpBadge, styles.ehXpBadge]}>
              <Text style={[styles.xpBadgeText, styles.ehXpBadgeText]}>
                {totalEHXP}/{potentialEHXP} XP
              </Text>
            </View>
          </View>

          {ehMissions.map((mission) => (
            <View
              key={mission.id}
              style={[styles.missionCard, styles.ehMissionCard, mission.completed && styles.missionCardCompleted]}
            >
              <View style={[
                styles.missionIconContainer,
                styles.ehIconContainer,
                mission.completed && styles.missionIconCompleted
              ]}>
                <Text style={styles.missionIcon}>
                  {mission.completed ? '✓' : mission.icon}
                </Text>
              </View>
              <View style={styles.missionContent}>
                <Text style={[styles.missionTitle, mission.completed && styles.missionTitleCompleted]}>
                  {mission.title}
                </Text>
                <Text style={styles.missionDescription}>{mission.description}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(100, (mission.progress / mission.requirement.count) * 100)}%`,
                          backgroundColor: mission.completed ? colors.success : '#8b5cf6',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {mission.progress}/{mission.requirement.count}
                  </Text>
                </View>
              </View>
              <View style={styles.missionReward}>
                <Text style={[styles.missionXP, mission.completed && styles.missionXPCompleted]}>
                  +{mission.xpReward}
                </Text>
                <Text style={styles.missionXPLabel}>XP</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mission Streak Bonus */}
        <GlassCard style={styles.streakCard}>
          <View style={styles.streakContent}>
            <Text style={styles.streakEmoji}></Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakTitle}>Mission Streak Bonus</Text>
              <Text style={styles.streakDescription}>
                Complete all daily missions for 5 consecutive days
              </Text>
              <View style={styles.streakProgress}>
                {[1, 2, 3, 4, 5].map((day) => (
                  <View
                    key={day}
                    style={[
                      styles.streakDay,
                      day <= 3 && styles.streakDayComplete,
                    ]}
                  >
                    <Text style={[styles.streakDayText, day <= 3 && styles.streakDayTextComplete]}>
                      {day <= 3 ? '' : day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.streakReward}>
              <Text style={styles.streakRewardValue}>+100</Text>
              <Text style={styles.streakRewardLabel}>XP</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
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
    paddingTop: spacing.md,
  },
  summaryCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  summaryLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.glass.border,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  ehEmoji: {
    fontSize: 28,
  },
  ehTitle: {
    color: '#8b5cf6',
  },
  ehXpBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  ehXpBadgeText: {
    color: '#8b5cf6',
  },
  ehMissionCard: {
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  ehIconContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  sectionSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  xpBadgeText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.neon.green,
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  missionCardCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  missionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionIconCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  missionIcon: {
    fontSize: 24,
  },
  missionContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  missionTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  missionTitleCompleted: {
    color: colors.success,
  },
  missionDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    minWidth: 30,
  },
  missionReward: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  missionXP: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
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
  streakCard: {
    marginHorizontal: spacing.md,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 36,
  },
  streakInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.orange,
  },
  streakDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  streakProgress: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  streakDay: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  streakDayComplete: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: colors.neon.orange,
  },
  streakDayText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  streakDayTextComplete: {
    color: colors.neon.orange,
  },
  streakReward: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  streakRewardValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.orange,
  },
  streakRewardLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default DailyMissionsScreen;
