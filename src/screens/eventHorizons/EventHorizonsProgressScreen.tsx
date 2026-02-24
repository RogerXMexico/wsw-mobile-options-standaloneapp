// Event Horizons Progress Screen
// Track badges, missions, and overall progress in Event Horizons
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
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { InlineIcon } from '../../components/ui/InlineIcon';

const { width } = Dimensions.get('window');

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedDate?: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
}

const BADGES: Badge[] = [
  {
    id: 'first-scan',
    name: 'First Scan',
    description: 'Use the Prediction Scanner for the first time',
    icon: 'radio-outline',
    rarity: 'common',
    earned: true,
    earnedDate: '2025-01-15',
  },
  {
    id: 'gap-hunter',
    name: 'Gap Hunter',
    description: 'Identify 5 events with gap scores > 20',
    icon: 'locate-outline',
    rarity: 'rare',
    earned: true,
    earnedDate: '2025-01-18',
  },
  {
    id: 'paper-profit',
    name: 'Paper Profit',
    description: 'Make your first profitable paper trade',
    icon: 'cash-outline',
    rarity: 'common',
    earned: true,
    earnedDate: '2025-01-16',
  },
  {
    id: 'lesson-master',
    name: 'Lesson Master',
    description: 'Complete all 10 Event Horizons lessons',
    icon: 'book-outline',
    rarity: 'epic',
    earned: false,
  },
  {
    id: 'chameleon-student',
    name: "Chameleon's Student",
    description: 'Score 100% on any lesson quiz',
    icon: 'chameleon',
    rarity: 'rare',
    earned: false,
  },
  {
    id: 'event-oracle',
    name: 'Event Oracle',
    description: 'Correctly predict 10 event outcomes',
    icon: 'eye-outline',
    rarity: 'epic',
    earned: false,
  },
  {
    id: 'iv-crusher',
    name: 'IV Crusher',
    description: 'Profit from 5 IV crush trades',
    icon: 'flash-outline',
    rarity: 'rare',
    earned: false,
  },
  {
    id: 'prediction-king',
    name: 'Prediction King',
    description: 'Achieve 80%+ win rate with 20+ trades',
    icon: 'ribbon-outline',
    rarity: 'legendary',
    earned: false,
  },
];

const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Complete Lesson 2',
    description: 'Learn about reading the gap',
    progress: 0,
    target: 1,
    xpReward: 100,
    completed: false,
  },
  {
    id: 'm2',
    title: 'Scan 5 Events',
    description: 'Use the Prediction Scanner',
    progress: 3,
    target: 5,
    xpReward: 50,
    completed: false,
  },
  {
    id: 'm3',
    title: 'Make a Paper Trade',
    description: 'Practice with prediction markets',
    progress: 1,
    target: 1,
    xpReward: 75,
    completed: true,
  },
];

const getRarityColor = (rarity: Badge['rarity']) => {
  switch (rarity) {
    case 'common':
      return '#94a3b8';
    case 'rare':
      return '#3b82f6';
    case 'epic':
      return '#8b5cf6';
    case 'legendary':
      return '#f59e0b';
  }
};

const EventHorizonsProgressScreen: React.FC = () => {
  const navigation = useNavigation();

  const earnedBadges = BADGES.filter((b) => b.earned);
  const totalBadges = BADGES.length;
  const completedMissions = MISSIONS.filter((m) => m.completed).length;
  const totalMissions = MISSIONS.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Progress</Text>
          <Text style={styles.headerSubtitle}>Event Horizons</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.2)', 'rgba(245, 158, 11, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Ionicons name="trophy-outline" size={28} color="#f59e0b" style={{ marginBottom: spacing.xs }} />
              <Text style={styles.summaryValue}>
                {earnedBadges.length}/{totalBadges}
              </Text>
              <Text style={styles.summaryLabel}>Badges</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Ionicons name="locate-outline" size={28} color="#8b5cf6" style={{ marginBottom: spacing.xs }} />
              <Text style={styles.summaryValue}>
                {completedMissions}/{totalMissions}
              </Text>
              <Text style={styles.summaryLabel}>Missions</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Ionicons name="book-outline" size={28} color="#14b8a6" style={{ marginBottom: spacing.xs }} />
              <Text style={styles.summaryValue}>3/10</Text>
              <Text style={styles.summaryLabel}>Lessons</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Active Missions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Missions</Text>
          <View style={styles.missionsContainer}>
            {MISSIONS.filter((m) => !m.completed).map((mission) => (
              <View key={mission.id} style={styles.missionCard}>
                <View style={styles.missionHeader}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <View style={styles.xpBadge}>
                    <Text style={styles.xpText}>+{mission.xpReward} XP</Text>
                  </View>
                </View>
                <Text style={styles.missionDescription}>{mission.description}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(mission.progress / mission.target) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {mission.progress}/{mission.target}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgesGrid}>
            {BADGES.map((badge) => (
              <View
                key={badge.id}
                style={[
                  styles.badgeCard,
                  !badge.earned && styles.badgeCardLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeIconContainer,
                    {
                      backgroundColor: badge.earned
                        ? `${getRarityColor(badge.rarity)}20`
                        : 'rgba(255, 255, 255, 0.05)',
                    },
                  ]}
                >
                  <InlineIcon
                    name={badge.icon}
                    size={20}
                    color={badge.earned ? getRarityColor(badge.rarity) : '#64748b'}
                  />
                </View>
                <Text
                  style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}
                  numberOfLines={1}
                >
                  {badge.name}
                </Text>
                <View
                  style={[
                    styles.rarityBadge,
                    { backgroundColor: `${getRarityColor(badge.rarity)}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.rarityText,
                      { color: getRarityColor(badge.rarity) },
                    ]}
                  >
                    {badge.rarity.toUpperCase()}
                  </Text>
                </View>
                {badge.earned && (
                  <View style={styles.earnedCheck}>
                    <Ionicons name="checkmark" size={10} color={colors.text.primary} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Completed Missions */}
        {MISSIONS.filter((m) => m.completed).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Missions</Text>
            <View style={styles.missionsContainer}>
              {MISSIONS.filter((m) => m.completed).map((mission) => (
                <View key={mission.id} style={[styles.missionCard, styles.missionCardCompleted]}>
                  <View style={styles.missionHeader}>
                    <View style={styles.completedRow}>
                      <Ionicons name="checkmark" size={14} color={colors.bullish} />
                      <Text style={[styles.missionTitle, styles.missionTitleCompleted]}>
                        {mission.title}
                      </Text>
                    </View>
                    <View style={[styles.xpBadge, styles.xpBadgeCompleted]}>
                      <Text style={styles.xpTextCompleted}>+{mission.xpReward} XP</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: spacing['3xl'] }} />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  summaryCard: {
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  summaryLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  missionsContainer: {
    gap: spacing.sm,
  },
  missionCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  missionCardCompleted: {
    opacity: 0.7,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  missionTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  missionTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.text.muted,
  },
  xpBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpBadgeCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  xpText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
    color: '#f59e0b',
  },
  xpTextCompleted: {
    color: colors.bullish,
  },
  missionDescription: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.muted,
    minWidth: 30,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  completedCheck: {
    fontSize: 14,
    color: colors.bullish,
    fontWeight: 'bold',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badgeCard: {
    width: (width - spacing.lg * 2 - spacing.sm * 3) / 4,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
    position: 'relative',
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeIcon: {
    fontSize: 20,
  },
  badgeIconLocked: {
    opacity: 0.5,
  },
  badgeName: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeNameLocked: {
    color: colors.text.muted,
  },
  rarityBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 8,
    fontFamily: typography.fonts.bold,
  },
  earnedCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.bullish,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedCheckText: {
    fontSize: 10,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
});

export default EventHorizonsProgressScreen;
