// Daily Missions Screen — Expanded
// Tabbed layout: Daily | Weekly | Streak | History
// Uses useMissions hook for state, MissionCard for rendering,
// AchievementToast for celebrations, streak bonuses, and mission history.
//
// Ported from desktop DailyMissionsHub.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard, AchievementToast } from '../../components/ui';
import { MissionCard, Mission as MissionCardType } from '../../components/cards/MissionCard';
import { ProfileStackParamList } from '../../navigation/types';
import {
  useMissions,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  getMissionById,
  getMonday,
  getDefaultMissionsState,
} from '../../hooks/useMissions';
import type { Mission, MissionProgress, DailyMissionsState } from '../../hooks/useMissions';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MISSIONS_KEY = 'wsw-missions';
const MISSION_HISTORY_KEY = 'wsw-mission-history';

// ── Streak Milestones ────────────────────────────────────────────────

interface StreakMilestone {
  days: number;
  label: string;
  bonusXP: number;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
}

const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, label: '3-Day Starter', bonusXP: 25, iconName: 'flame', color: colors.neon.orange },
  { days: 7, label: 'Week Warrior', bonusXP: 75, iconName: 'flame', color: '#f59e0b' },
  { days: 14, label: 'Two-Week Titan', bonusXP: 150, iconName: 'flash', color: colors.neon.yellow },
  { days: 30, label: 'Monthly Master', bonusXP: 300, iconName: 'trophy', color: colors.neon.green },
  { days: 60, label: 'Unstoppable', bonusXP: 500, iconName: 'star', color: colors.neon.cyan },
  { days: 100, label: 'Centurion', bonusXP: 1000, iconName: 'diamond', color: colors.neon.purple },
];

// ── History Entry ────────────────────────────────────────────────────

interface HistoryEntry {
  missionId: string;
  title: string;
  xpEarned: number;
  claimedAt: string;
  period: 'daily' | 'weekly';
}

// ── Helpers ──────────────────────────────────────────────────────────

const getTimeUntilDailyReset = (): string => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
};

const getTimeUntilWeeklyReset = (): string => {
  const now = new Date();
  const nextMonday = getMonday(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
  nextMonday.setHours(0, 0, 0, 0);
  const diff = nextMonday.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days}d ${hours}h`;
};

const getStreakBonusXP = (streak: number): number => {
  return Math.min(streak * 10, 300);
};

const mapToIonicon = (missionId: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'daily-login': 'log-in',
    'daily-quiz': 'create',
    'daily-study': 'book',
    'daily-trade': 'stats-chart',
    'daily-xp': 'flash',
    'daily-like': 'heart',
    'daily-comment': 'chatbubble',
    'daily-follow': 'people',
    'weekly-quizzes': 'ribbon',
    'weekly-trades': 'trending-up',
    'weekly-strategies': 'search',
    'weekly-streak': 'flame',
    'weekly-share': 'megaphone',
    'weekly-xp': 'trophy',
  };
  return iconMap[missionId] || 'checkbox';
};

// ══════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════

const DailyMissionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const missions = useMissions();

  // Tab state: daily | weekly | streak | history
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'streak' | 'history'>('daily');

  // Mission state
  const [missionsState, setMissionsState] = useState<DailyMissionsState>(getDefaultMissionsState());
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Celebration toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastDescription, setToastDescription] = useState('');

  // Celebration animation
  const celebrationScale = useMemo(() => new Animated.Value(0), []);

  // ── Load State ──
  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    setLoading(true);
    try {
      const state = await missions.ensureMissionState();
      setMissionsState(state);
    } catch {
      // Fall back to defaults
    }

    try {
      const saved = await AsyncStorage.getItem(MISSION_HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch { /* ignore */ }

    setLoading(false);
  };

  // ── Refresh state periodically ──
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(async () => {
      try {
        const state = await missions.ensureMissionState();
        setMissionsState(state);
      } catch { /* ignore */ }
    }, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [loading, missions]);

  // ── Claim Reward ──
  const handleClaimReward = useCallback(async (missionId: string) => {
    setClaimingId(missionId);

    try {
      const xpEarned = await missions.claimMissionReward(missionId);
      if (xpEarned > 0) {
        // Refresh state
        const updatedState = await missions.ensureMissionState();
        setMissionsState(updatedState);

        // Find mission definition
        const missionDef = getMissionById(missionId);
        const isDaily = DAILY_MISSIONS.some(m => m.id === missionId);

        // Add to history
        const entry: HistoryEntry = {
          missionId,
          title: missionDef?.title || 'Mission',
          xpEarned,
          claimedAt: new Date().toISOString(),
          period: isDaily ? 'daily' : 'weekly',
        };
        const updatedHistory = [entry, ...history].slice(0, 100);
        setHistory(updatedHistory);
        await AsyncStorage.setItem(MISSION_HISTORY_KEY, JSON.stringify(updatedHistory));

        // Show celebration
        const streakBonus = getStreakBonusXP(updatedState.missionStreak);
        const totalXP = xpEarned + (updatedState.missionStreak > 0 ? streakBonus : 0);

        setToastTitle('Mission Complete!');
        setToastDescription(
          updatedState.missionStreak > 0
            ? `+${xpEarned} XP + ${streakBonus} streak bonus`
            : `+${xpEarned} XP earned`
        );
        setToastVisible(true);

        // Animate celebration
        celebrationScale.setValue(0);
        Animated.spring(celebrationScale, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }).start();
      }
    } catch (e) {
      console.error('Failed to claim mission reward:', e);
    } finally {
      setClaimingId(null);
    }
  }, [missions, history, celebrationScale]);

  // ── Computed Values ──
  const dailyCompleted = missionsState.dailyMissions.filter(m => m.claimedAt).length;
  const dailyTotal = missionsState.dailyMissions.length;
  const weeklyCompleted = missionsState.weeklyMissions.filter(m => m.claimedAt).length;
  const weeklyTotal = missionsState.weeklyMissions.length;

  const dailyPendingClaims = missionsState.dailyMissions.filter(
    m => m.completedAt && !m.claimedAt
  ).length;
  const weeklyPendingClaims = missionsState.weeklyMissions.filter(
    m => m.completedAt && !m.claimedAt
  ).length;

  const dailyXPEarned = missionsState.dailyMissions.reduce((sum, m) => {
    if (!m.claimedAt) return sum;
    const def = getMissionById(m.missionId);
    return sum + (def?.xpReward || 0);
  }, 0);

  const weeklyXPEarned = missionsState.weeklyMissions.reduce((sum, m) => {
    if (!m.claimedAt) return sum;
    const def = getMissionById(m.missionId);
    return sum + (def?.xpReward || 0);
  }, 0);

  const totalPotentialDailyXP = DAILY_MISSIONS.reduce((sum, m) => sum + m.xpReward, 0);
  const totalPotentialWeeklyXP = WEEKLY_MISSIONS.reduce((sum, m) => sum + m.xpReward, 0);

  const streak = missionsState.missionStreak;
  const streakBonus = getStreakBonusXP(streak);
  const nextMilestone = STREAK_MILESTONES.find(m => m.days > streak);
  const lastMilestoneReached = [...STREAK_MILESTONES].reverse().find(m => m.days <= streak);

  // ── Tab Config ──
  type TabId = 'daily' | 'weekly' | 'streak' | 'history';
  const tabConfig: { id: TabId; label: string; iconName: keyof typeof Ionicons.glyphMap; badge?: number }[] = [
    { id: 'daily', label: 'Daily', iconName: 'today', badge: dailyPendingClaims },
    { id: 'weekly', label: 'Weekly', iconName: 'calendar', badge: weeklyPendingClaims },
    { id: 'streak', label: 'Streak', iconName: 'flame' },
    { id: 'history', label: 'History', iconName: 'time' },
  ];

  // ── Render Mission with MissionCard ──
  const renderMission = (progress: MissionProgress, _period: 'daily' | 'weekly') => {
    const def = getMissionById(progress.missionId);
    if (!def) return null;

    const isComplete = progress.completedAt !== null;
    const isClaimed = progress.claimedAt !== null;
    const isClaiming = claimingId === progress.missionId;

    const mission: MissionCardType = {
      title: def.title,
      description: def.description,
      icon: mapToIonicon(def.id),
      progress: progress.currentProgress,
      target: progress.targetProgress,
      reward: def.xpReward,
      claimed: !!isClaimed,
    };

    return (
      <View key={def.id} style={styles.missionCardWrapper}>
        {isClaiming ? (
          <View style={styles.claimingOverlay}>
            <ActivityIndicator size="small" color={colors.neon.green} />
          </View>
        ) : null}
        <MissionCard
          mission={mission}
          onClaim={isComplete && !isClaimed ? () => handleClaimReward(def.id) : undefined}
        />
      </View>
    );
  };

  // ── Loading ──
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.neon.green} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Missions</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.neon.green} />
          <Text style={styles.loadingText}>Loading missions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.neon.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Missions</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Stats */}
        <View style={styles.statsRow}>
          {/* Streak */}
          <View style={[styles.statCard, styles.statCardStreak]}>
            <Ionicons name="flame" size={24} color={colors.neon.orange} />
            <Text style={styles.statCardValue}>{streak}</Text>
            <Text style={styles.statCardLabel}>Day Streak</Text>
          </View>

          {/* Daily Progress */}
          <View style={styles.statCard}>
            <Ionicons name="today" size={24} color={colors.neon.cyan} />
            <Text style={styles.statCardValue}>{dailyCompleted}/{dailyTotal}</Text>
            <Text style={styles.statCardLabel}>Daily Done</Text>
          </View>

          {/* Weekly Progress */}
          <View style={[styles.statCard, styles.statCardWeekly]}>
            <Ionicons name="calendar" size={24} color={colors.neon.purple} />
            <Text style={styles.statCardValue}>{weeklyCompleted}/{weeklyTotal}</Text>
            <Text style={styles.statCardLabel}>Weekly Done</Text>
          </View>

          {/* All Time */}
          <View style={[styles.statCard, styles.statCardAllTime]}>
            <Ionicons name="trophy" size={24} color={colors.neon.green} />
            <Text style={styles.statCardValue}>{missionsState.totalMissionsCompleted}</Text>
            <Text style={styles.statCardLabel}>All Time</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          {tabConfig.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                activeTab === tab.id && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.tabItemContent}>
                <Ionicons
                  name={tab.iconName}
                  size={16}
                  color={activeTab === tab.id ? colors.text.primary : colors.text.muted}
                />
                <Text style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.tabLabelActive,
                ]}>
                  {tab.label}
                </Text>
                {(tab.badge || 0) > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reset Timer */}
        <View style={styles.resetTimerContainer}>
          <Ionicons name="time-outline" size={14} color={colors.text.muted} />
          <Text style={styles.resetTimerText}>
            {activeTab === 'daily'
              ? `Daily reset in ${getTimeUntilDailyReset()}`
              : activeTab === 'weekly'
              ? `Weekly reset in ${getTimeUntilWeeklyReset()}`
              : activeTab === 'streak'
              ? `Complete a mission today to maintain your streak`
              : `Showing last ${history.length} completed missions`
            }
          </Text>
        </View>

        {/* ── Tab: Daily ── */}
        {activeTab === 'daily' && (
          <View style={styles.missionList}>
            {/* XP Progress Header */}
            <View style={styles.xpProgressHeader}>
              <Text style={styles.xpProgressLabel}>Daily XP</Text>
              <Text style={styles.xpProgressValue}>
                <Text style={styles.xpProgressCurrent}>{dailyXPEarned}</Text>
                /{totalPotentialDailyXP} XP
              </Text>
            </View>
            <View style={styles.xpProgressBarBg}>
              <View
                style={[
                  styles.xpProgressBarFill,
                  { width: `${totalPotentialDailyXP > 0 ? (dailyXPEarned / totalPotentialDailyXP) * 100 : 0}%` },
                ]}
              />
            </View>

            {missionsState.dailyMissions.map((progress) =>
              renderMission(progress, 'daily')
            )}

            {/* Streak Bonus Alert */}
            {streak > 0 && (
              <GlassCard style={styles.streakBonusCard}>
                <LinearGradient
                  colors={['rgba(255, 102, 0, 0.1)', 'transparent']}
                  style={styles.streakBonusGradient}
                >
                  <View style={styles.streakBonusRow}>
                    <Ionicons name="flame" size={24} color={colors.neon.orange} />
                    <View style={styles.streakBonusInfo}>
                      <Text style={styles.streakBonusTitle}>{streak} Day Streak!</Text>
                      <Text style={styles.streakBonusText}>
                        Bonus: +{streakBonus} XP per mission claimed
                      </Text>
                    </View>
                    <View style={styles.streakBonusXP}>
                      <Text style={styles.streakBonusXPValue}>+{streakBonus}</Text>
                      <Text style={styles.streakBonusXPLabel}>bonus</Text>
                    </View>
                  </View>
                </LinearGradient>
              </GlassCard>
            )}
          </View>
        )}

        {/* ── Tab: Weekly ── */}
        {activeTab === 'weekly' && (
          <View style={styles.missionList}>
            {/* XP Progress Header */}
            <View style={styles.xpProgressHeader}>
              <Text style={styles.xpProgressLabel}>Weekly XP</Text>
              <Text style={styles.xpProgressValue}>
                <Text style={[styles.xpProgressCurrent, { color: colors.neon.purple }]}>{weeklyXPEarned}</Text>
                /{totalPotentialWeeklyXP} XP
              </Text>
            </View>
            <View style={styles.xpProgressBarBg}>
              <View
                style={[
                  styles.xpProgressBarFill,
                  {
                    width: `${totalPotentialWeeklyXP > 0 ? (weeklyXPEarned / totalPotentialWeeklyXP) * 100 : 0}%`,
                    backgroundColor: colors.neon.purple,
                  },
                ]}
              />
            </View>

            {missionsState.weeklyMissions.map((progress) =>
              renderMission(progress, 'weekly')
            )}

            {/* Weekly Completion Bonus */}
            {weeklyCompleted >= weeklyTotal && weeklyTotal > 0 && (
              <GlassCard style={styles.completionBonusCard}>
                <View style={styles.completionBonusContent}>
                  <Ionicons name="checkmark-done-circle" size={32} color={colors.neon.green} />
                  <Text style={styles.completionBonusTitle}>All Weekly Missions Complete!</Text>
                  <Text style={styles.completionBonusText}>
                    Amazing effort this week. Come back Monday for new challenges!
                  </Text>
                </View>
              </GlassCard>
            )}
          </View>
        )}

        {/* ── Tab: Streak ── */}
        {activeTab === 'streak' && (
          <View style={styles.streakContent}>
            {/* Current Streak Display */}
            <View style={styles.streakHero}>
              <View style={styles.streakHeroCircle}>
                <Ionicons
                  name={streak > 0 ? 'flame' : 'snow'}
                  size={48}
                  color={streak > 0 ? colors.neon.orange : colors.text.muted}
                />
              </View>
              <Text style={styles.streakHeroValue}>{streak}</Text>
              <Text style={styles.streakHeroLabel}>Day Streak</Text>
              {streak > 0 && (
                <Text style={styles.streakHeroBonus}>
                  +{streakBonus} XP daily bonus
                </Text>
              )}
            </View>

            {/* Streak Calendar (last 7 days) */}
            <View style={styles.streakCalendar}>
              <Text style={styles.streakCalendarTitle}>This Week</Text>
              <View style={styles.streakDaysRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  const today = new Date().getDay();
                  const mondayBasedToday = today === 0 ? 6 : today - 1;
                  const isToday = idx === mondayBasedToday;
                  const isPast = idx < mondayBasedToday;
                  const isActive = isPast || (isToday && dailyCompleted > 0);

                  return (
                    <View key={idx} style={styles.streakDayCol}>
                      <Text style={styles.streakDayLabel}>{day}</Text>
                      <View style={[
                        styles.streakDayCircle,
                        isActive && styles.streakDayCircleActive,
                        isToday && styles.streakDayCircleToday,
                      ]}>
                        {isActive ? (
                          <Ionicons name="checkmark" size={14} color={colors.neon.orange} />
                        ) : isToday ? (
                          <View style={styles.streakDayDot} />
                        ) : (
                          <Text style={styles.streakDayNumber}>{idx + 1}</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Milestones */}
            <Text style={styles.milestonesTitle}>Streak Milestones</Text>
            {STREAK_MILESTONES.map((milestone) => {
              const isReached = streak >= milestone.days;
              const progressToMilestone = Math.min(100, (streak / milestone.days) * 100);

              return (
                <View
                  key={milestone.days}
                  style={[
                    styles.milestoneCard,
                    isReached && { borderColor: `${milestone.color}40` },
                  ]}
                >
                  <View style={[
                    styles.milestoneIcon,
                    { backgroundColor: isReached ? `${milestone.color}20` : colors.overlay.light },
                  ]}>
                    <Ionicons
                      name={isReached ? milestone.iconName : 'lock-closed'}
                      size={22}
                      color={isReached ? milestone.color : colors.text.muted}
                    />
                  </View>

                  <View style={styles.milestoneInfo}>
                    <View style={styles.milestoneNameRow}>
                      <Text style={[
                        styles.milestoneName,
                        isReached && { color: milestone.color },
                      ]}>
                        {milestone.label}
                      </Text>
                      <Text style={styles.milestoneDays}>{milestone.days} days</Text>
                    </View>
                    {!isReached && (
                      <View style={styles.milestoneProgressContainer}>
                        <View style={styles.milestoneProgressBg}>
                          <View
                            style={[
                              styles.milestoneProgressFill,
                              { width: `${progressToMilestone}%`, backgroundColor: milestone.color },
                            ]}
                          />
                        </View>
                        <Text style={styles.milestoneProgressText}>
                          {streak}/{milestone.days}
                        </Text>
                      </View>
                    )}
                    {isReached && (
                      <Text style={[styles.milestoneReached, { color: milestone.color }]}>
                        Reached! +{milestone.bonusXP} XP earned
                      </Text>
                    )}
                  </View>

                  <View style={[
                    styles.milestoneReward,
                    { backgroundColor: isReached ? `${milestone.color}15` : colors.overlay.light },
                  ]}>
                    <Text style={[
                      styles.milestoneRewardText,
                      { color: isReached ? milestone.color : colors.text.muted },
                    ]}>
                      +{milestone.bonusXP}
                    </Text>
                    <Text style={styles.milestoneRewardLabel}>XP</Text>
                  </View>
                </View>
              );
            })}

            {/* Next Milestone Info */}
            {nextMilestone && (
              <GlassCard style={styles.nextMilestoneCard}>
                <View style={styles.nextMilestoneContent}>
                  <Ionicons name="arrow-forward-circle" size={24} color={nextMilestone.color} />
                  <View style={styles.nextMilestoneInfo}>
                    <Text style={styles.nextMilestoneTitle}>
                      Next: {nextMilestone.label}
                    </Text>
                    <Text style={styles.nextMilestoneText}>
                      {nextMilestone.days - streak} more days to earn +{nextMilestone.bonusXP} XP
                    </Text>
                  </View>
                </View>
              </GlassCard>
            )}
          </View>
        )}

        {/* ── Tab: History ── */}
        {activeTab === 'history' && (
          <View style={styles.historyContent}>
            {history.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="time" size={48} color={colors.text.muted} />
                <Text style={styles.emptyStateTitle}>No Mission History</Text>
                <Text style={styles.emptyStateText}>
                  Complete and claim missions to see your history here.
                </Text>
              </View>
            ) : (
              <>
                {/* History Stats */}
                <View style={styles.historyStatsRow}>
                  <View style={styles.historyStatItem}>
                    <Text style={styles.historyStatValue}>{history.length}</Text>
                    <Text style={styles.historyStatLabel}>Total Claimed</Text>
                  </View>
                  <View style={styles.historyStatDivider} />
                  <View style={styles.historyStatItem}>
                    <Text style={[styles.historyStatValue, { color: colors.neon.yellow }]}>
                      {history.reduce((sum, h) => sum + h.xpEarned, 0).toLocaleString()}
                    </Text>
                    <Text style={styles.historyStatLabel}>Total XP Earned</Text>
                  </View>
                </View>

                {/* History List */}
                {history.map((entry, idx) => {
                  const iconName = mapToIonicon(entry.missionId);
                  const date = new Date(entry.claimedAt);
                  const dateStr = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                  const timeStr = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <View key={`${entry.missionId}-${idx}`} style={styles.historyRow}>
                      <View style={[
                        styles.historyIcon,
                        {
                          backgroundColor: entry.period === 'daily'
                            ? 'rgba(0, 240, 255, 0.1)'
                            : 'rgba(191, 0, 255, 0.1)',
                        },
                      ]}>
                        <Ionicons
                          name={iconName}
                          size={18}
                          color={entry.period === 'daily' ? colors.neon.cyan : colors.neon.purple}
                        />
                      </View>

                      <View style={styles.historyInfo}>
                        <Text style={styles.historyTitle}>{entry.title}</Text>
                        <View style={styles.historyMeta}>
                          <View style={[
                            styles.historyPeriodBadge,
                            {
                              backgroundColor: entry.period === 'daily'
                                ? 'rgba(0, 240, 255, 0.1)'
                                : 'rgba(191, 0, 255, 0.1)',
                            },
                          ]}>
                            <Text style={[
                              styles.historyPeriodText,
                              {
                                color: entry.period === 'daily'
                                  ? colors.neon.cyan
                                  : colors.neon.purple,
                              },
                            ]}>
                              {entry.period}
                            </Text>
                          </View>
                          <Text style={styles.historyDate}>{dateStr} at {timeStr}</Text>
                        </View>
                      </View>

                      <View style={styles.historyXP}>
                        <Text style={styles.historyXPValue}>+{entry.xpEarned}</Text>
                        <Text style={styles.historyXPLabel}>XP</Text>
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Achievement Toast */}
      <AchievementToast
        visible={toastVisible}
        title={toastTitle}
        description={toastDescription}
        icon="gift"
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

// ══════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════

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
    width: 40,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing['2xl'],
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.muted,
    marginTop: spacing.md,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    width: (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2 - 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statCardStreak: {
    borderColor: 'rgba(255, 102, 0, 0.2)',
  },
  statCardWeekly: {
    borderColor: 'rgba(191, 0, 255, 0.2)',
  },
  statCardAllTime: {
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  statCardValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statCardLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tabItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tabItemActive: {
    backgroundColor: colors.background.tertiary,
  },
  tabItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  tabLabelActive: {
    color: colors.text.primary,
  },
  tabBadge: {
    backgroundColor: colors.neon.green,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: 9,
    color: '#000',
  },

  // Reset Timer
  resetTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  resetTimerText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Mission List
  missionList: {
    paddingHorizontal: spacing.md,
  },
  missionCardWrapper: {
    marginBottom: spacing.sm,
    position: 'relative',
  },
  claimingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.lg,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // XP Progress
  xpProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  xpProgressLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  xpProgressValue: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  xpProgressCurrent: {
    fontFamily: typography.fonts.bold,
    color: colors.neon.green,
  },
  xpProgressBarBg: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  xpProgressBarFill: {
    height: '100%',
    backgroundColor: colors.neon.green,
    borderRadius: borderRadius.full,
  },

  // Streak Bonus Card
  streakBonusCard: {
    marginTop: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  streakBonusGradient: {
    padding: spacing.md,
  },
  streakBonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  streakBonusInfo: {
    flex: 1,
  },
  streakBonusTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.orange,
  },
  streakBonusText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  streakBonusXP: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 102, 0, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  streakBonusXPValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.orange,
  },
  streakBonusXPLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Completion Bonus
  completionBonusCard: {
    marginTop: spacing.md,
  },
  completionBonusContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  completionBonusTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.green,
    marginTop: spacing.sm,
  },
  completionBonusText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // ── Streak Tab ──
  streakContent: {
    paddingHorizontal: spacing.md,
  },
  streakHero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  streakHeroCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 102, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 102, 0, 0.3)',
    marginBottom: spacing.md,
  },
  streakHeroValue: {
    fontFamily: typography.fonts.bold,
    fontSize: 48,
    color: colors.text.primary,
  },
  streakHeroLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  streakHeroBonus: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.neon.orange,
    marginTop: spacing.xs,
  },

  // Streak Calendar
  streakCalendar: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  streakCalendarTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  streakDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakDayCol: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  streakDayLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  streakDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  streakDayCircleActive: {
    backgroundColor: 'rgba(255, 102, 0, 0.15)',
    borderColor: colors.neon.orange,
  },
  streakDayCircleToday: {
    borderColor: colors.neon.cyan,
    borderWidth: 2,
  },
  streakDayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neon.cyan,
  },
  streakDayNumber: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Milestones
  milestonesTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: spacing.md,
  },
  milestoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  milestoneName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  milestoneDays: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  milestoneProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  milestoneProgressBg: {
    flex: 1,
    height: 4,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  milestoneProgressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  milestoneProgressText: {
    fontFamily: typography.fonts.medium,
    fontSize: 10,
    color: colors.text.muted,
    minWidth: 32,
  },
  milestoneReached: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
  },
  milestoneReward: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  milestoneRewardText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  milestoneRewardLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 9,
    color: colors.text.muted,
  },

  // Next Milestone
  nextMilestoneCard: {
    marginTop: spacing.md,
  },
  nextMilestoneContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  nextMilestoneInfo: {
    flex: 1,
  },
  nextMilestoneTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  nextMilestoneText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: 2,
  },

  // ── History Tab ──
  historyContent: {
    paddingHorizontal: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyStateTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyStateText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  historyStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.md,
  },
  historyStatItem: {
    alignItems: 'center',
  },
  historyStatValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  historyStatLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  historyStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border.default,
  },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: spacing.sm,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  historyPeriodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  historyPeriodText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 9,
    textTransform: 'uppercase',
  },
  historyDate: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  historyXP: {
    alignItems: 'flex-end',
  },
  historyXPValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.yellow,
  },
  historyXPLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 9,
    color: colors.text.muted,
  },

  bottomSpacer: {
    height: 40,
  },
});

export default DailyMissionsScreen;
