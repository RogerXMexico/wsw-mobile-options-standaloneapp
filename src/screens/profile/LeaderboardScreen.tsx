// Leaderboard Screen
// Rankings of top traders by XP

import React, { useState } from 'react';
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
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import { getLevelForXP } from '../../data/jungleBadges';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  badgeCount: number;
  spiritAnimal: string;
  isCurrentUser?: boolean;
}

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: '1', displayName: 'JungleMaster99', xp: 34500, level: 9, badgeCount: 24, spiritAnimal: 'bull' },
  { rank: 2, userId: '2', displayName: 'OptionsWizard', xp: 28900, level: 8, badgeCount: 21, spiritAnimal: 'owl' },
  { rank: 3, userId: '3', displayName: 'ThetaGang', xp: 25100, level: 8, badgeCount: 19, spiritAnimal: 'badger' },
  { rank: 4, userId: '4', displayName: 'VegaHunter', xp: 21800, level: 7, badgeCount: 17, spiritAnimal: 'cheetah' },
  { rank: 5, userId: '5', displayName: 'DeltaNeutral', xp: 18200, level: 7, badgeCount: 15, spiritAnimal: 'chameleon' },
  { rank: 6, userId: '6', displayName: 'IronCondorKing', xp: 15600, level: 6, badgeCount: 14, spiritAnimal: 'monkey' },
  { rank: 7, userId: '7', displayName: 'StraddleMaster', xp: 12400, level: 6, badgeCount: 12, spiritAnimal: 'owl' },
  { rank: 8, userId: 'current', displayName: 'You', xp: 2750, level: 3, badgeCount: 3, spiritAnimal: 'owl', isCurrentUser: true },
  { rank: 9, userId: '9', displayName: 'SpreadTrader', xp: 9800, level: 5, badgeCount: 11, spiritAnimal: 'badger' },
  { rank: 10, userId: '10', displayName: 'GammaSqueezer', xp: 8200, level: 5, badgeCount: 10, spiritAnimal: 'monkey' },
];

// Sort properly with current user at their real rank
const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => b.xp - a.xp).map((entry, index) => ({
  ...entry,
  rank: index + 1,
}));

type TimeFilter = 'all_time' | 'weekly' | 'monthly';

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all_time');

  const getAnimalEmoji = (animal: string): string => {
    switch (animal) {
      case 'owl': return '';
      case 'badger': return '';
      case 'monkey': return '';
      case 'bull': return '';
      case 'bear': return '';
      case 'chameleon': return '';
      case 'cheetah': return '';
      case 'sloth': return '';
      default: return '';
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return { color: colors.neon.yellow, emoji: '' };
      case 2: return { color: '#c0c0c0', emoji: '' };
      case 3: return { color: '#cd7f32', emoji: '' };
      default: return { color: colors.text.secondary, emoji: '' };
    }
  };

  const currentUserEntry = sortedLeaderboard.find(e => e.isCurrentUser);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Filter */}
        <View style={styles.filterRow}>
          {(['all_time', 'monthly', 'weekly'] as TimeFilter[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, timeFilter === filter && styles.filterChipActive]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text style={[styles.filterText, timeFilter === filter && styles.filterTextActive]}>
                {filter === 'all_time' ? 'All Time' : filter === 'monthly' ? 'Monthly' : 'Weekly'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {/* 2nd Place */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumAvatar, styles.podiumSecond]}>
              <Text style={styles.podiumEmoji}>{getAnimalEmoji(sortedLeaderboard[1]?.spiritAnimal || '')}</Text>
            </View>
            <Text style={styles.podiumRank}></Text>
            <Text style={styles.podiumName} numberOfLines={1}>{sortedLeaderboard[1]?.displayName}</Text>
            <Text style={styles.podiumXP}>{sortedLeaderboard[1]?.xp.toLocaleString()} XP</Text>
          </View>

          {/* 1st Place */}
          <View style={[styles.podiumItem, styles.podiumFirst]}>
            <View style={styles.crownContainer}>
              <Text style={styles.crownEmoji}></Text>
            </View>
            <View style={[styles.podiumAvatar, styles.podiumGold]}>
              <Text style={styles.podiumEmoji}>{getAnimalEmoji(sortedLeaderboard[0]?.spiritAnimal || '')}</Text>
            </View>
            <Text style={[styles.podiumRank, styles.podiumRankGold]}></Text>
            <Text style={styles.podiumName} numberOfLines={1}>{sortedLeaderboard[0]?.displayName}</Text>
            <Text style={[styles.podiumXP, styles.podiumXPGold]}>{sortedLeaderboard[0]?.xp.toLocaleString()} XP</Text>
          </View>

          {/* 3rd Place */}
          <View style={styles.podiumItem}>
            <View style={[styles.podiumAvatar, styles.podiumThird]}>
              <Text style={styles.podiumEmoji}>{getAnimalEmoji(sortedLeaderboard[2]?.spiritAnimal || '')}</Text>
            </View>
            <Text style={styles.podiumRank}></Text>
            <Text style={styles.podiumName} numberOfLines={1}>{sortedLeaderboard[2]?.displayName}</Text>
            <Text style={styles.podiumXP}>{sortedLeaderboard[2]?.xp.toLocaleString()} XP</Text>
          </View>
        </View>

        {/* Your Position */}
        {currentUserEntry && (
          <GlassCard style={styles.yourPositionCard}>
            <LinearGradient
              colors={['rgba(57, 255, 20, 0.15)', 'rgba(57, 255, 20, 0.05)']}
              style={styles.yourPositionGradient}
            >
              <Text style={styles.yourPositionLabel}>Your Position</Text>
              <View style={styles.yourPositionContent}>
                <Text style={styles.yourPositionRank}>#{currentUserEntry.rank}</Text>
                <View style={styles.yourPositionInfo}>
                  <Text style={styles.yourPositionName}>{currentUserEntry.displayName}</Text>
                  <Text style={styles.yourPositionXP}>{currentUserEntry.xp.toLocaleString()} XP</Text>
                </View>
                <View style={styles.yourPositionAvatar}>
                  <Text style={styles.yourPositionEmoji}>{getAnimalEmoji(currentUserEntry.spiritAnimal)}</Text>
                </View>
              </View>
            </LinearGradient>
          </GlassCard>
        )}

        {/* Full Leaderboard */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Full Rankings</Text>
          {sortedLeaderboard.slice(3).map((entry) => {
            const rankStyle = getRankStyle(entry.rank);
            return (
              <View
                key={entry.userId}
                style={[styles.listItem, entry.isCurrentUser && styles.listItemCurrent]}
              >
                <Text style={[styles.listRank, { color: rankStyle.color }]}>
                  {entry.rank}
                </Text>
                <View style={styles.listAvatar}>
                  <Text style={styles.listEmoji}>{getAnimalEmoji(entry.spiritAnimal)}</Text>
                </View>
                <View style={styles.listInfo}>
                  <Text style={[styles.listName, entry.isCurrentUser && styles.listNameCurrent]}>
                    {entry.displayName}
                  </Text>
                  <Text style={styles.listLevel}>Level {entry.level}</Text>
                </View>
                <View style={styles.listStats}>
                  <Text style={[styles.listXP, entry.isCurrentUser && styles.listXPCurrent]}>
                    {entry.xp.toLocaleString()}
                  </Text>
                  <Text style={styles.listXPLabel}>XP</Text>
                </View>
              </View>
            );
          })}
        </View>

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
    paddingBottom: spacing['2xl'],
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  filterChipActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    borderColor: colors.neon.green,
  },
  filterText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  filterTextActive: {
    color: colors.neon.green,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  podiumItem: {
    alignItems: 'center',
    width: 100,
  },
  podiumFirst: {
    marginBottom: spacing.lg,
  },
  crownContainer: {
    position: 'absolute',
    top: -30,
  },
  crownEmoji: {
    fontSize: 28,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: spacing.xs,
  },
  podiumGold: {
    width: 80,
    height: 80,
    borderColor: colors.neon.yellow,
    ...shadows.neonGreenSubtle,
  },
  podiumSecond: {
    borderColor: '#c0c0c0',
  },
  podiumThird: {
    borderColor: '#cd7f32',
  },
  podiumEmoji: {
    fontSize: 32,
  },
  podiumRank: {
    fontSize: 20,
    marginBottom: 2,
  },
  podiumRankGold: {
    fontSize: 24,
  },
  podiumName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    textAlign: 'center',
    width: '100%',
  },
  podiumXP: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  podiumXPGold: {
    color: colors.neon.yellow,
    fontFamily: typography.fonts.semiBold,
  },
  yourPositionCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  yourPositionGradient: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  yourPositionLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.neon.green,
    marginBottom: spacing.xs,
  },
  yourPositionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yourPositionRank: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.neon.green,
    width: 60,
  },
  yourPositionInfo: {
    flex: 1,
  },
  yourPositionName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  yourPositionXP: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  yourPositionAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neon.green,
  },
  yourPositionEmoji: {
    fontSize: 24,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
  },
  listTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  listItemCurrent: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    borderColor: colors.neon.green,
  },
  listRank: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    width: 40,
    textAlign: 'center',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  listEmoji: {
    fontSize: 20,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  listNameCurrent: {
    color: colors.neon.green,
  },
  listLevel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  listStats: {
    alignItems: 'flex-end',
  },
  listXP: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  listXPCurrent: {
    color: colors.neon.green,
  },
  listXPLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default LeaderboardScreen;
