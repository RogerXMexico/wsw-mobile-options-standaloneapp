// Leaderboard Screen
// Rankings of top traders by XP — with Supabase integration and performance stats

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts';
import { useJungle } from '../../contexts';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  badgeCount: number;
  spiritAnimal: string;
  winRate?: number;
  totalTrades?: number;
  isCurrentUser?: boolean;
}

// Animal icon mapping using Ionicons
const ANIMAL_ICONS: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  owl: { name: 'eye-outline', color: colors.mascots.owl },
  badger: { name: 'shield-outline', color: colors.mascots.badger },
  monkey: { name: 'happy-outline', color: colors.mascots.monkey },
  bull: { name: 'trending-up', color: colors.mascots.bull },
  bear: { name: 'trending-down', color: colors.mascots.bear },
  chameleon: { name: 'color-palette-outline', color: colors.mascots.chameleon },
  cheetah: { name: 'flash-outline', color: colors.mascots.cheetah },
  sloth: { name: 'leaf-outline', color: colors.mascots.sloth },
  fox: { name: 'flame-outline', color: colors.mascots.fox },
  tiger: { name: 'thunderstorm-outline', color: colors.mascots.tiger },
  eagle: { name: 'compass-outline', color: colors.mascots.eagle },
};

// Mock leaderboard data (used when Supabase is not configured)
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: '1', displayName: 'JungleMaster99', xp: 34500, level: 9, badgeCount: 24, spiritAnimal: 'bull', winRate: 72, totalTrades: 156 },
  { rank: 2, userId: '2', displayName: 'OptionsWizard', xp: 28900, level: 8, badgeCount: 21, spiritAnimal: 'owl', winRate: 68, totalTrades: 203 },
  { rank: 3, userId: '3', displayName: 'ThetaGang', xp: 25100, level: 8, badgeCount: 19, spiritAnimal: 'badger', winRate: 65, totalTrades: 189 },
  { rank: 4, userId: '4', displayName: 'VegaHunter', xp: 21800, level: 7, badgeCount: 17, spiritAnimal: 'cheetah', winRate: 61, totalTrades: 134 },
  { rank: 5, userId: '5', displayName: 'DeltaNeutral', xp: 18200, level: 7, badgeCount: 15, spiritAnimal: 'chameleon', winRate: 58, totalTrades: 98 },
  { rank: 6, userId: '6', displayName: 'IronCondorKing', xp: 15600, level: 6, badgeCount: 14, spiritAnimal: 'eagle', winRate: 63, totalTrades: 112 },
  { rank: 7, userId: '7', displayName: 'StraddleMaster', xp: 12400, level: 6, badgeCount: 12, spiritAnimal: 'owl', winRate: 55, totalTrades: 87 },
  { rank: 8, userId: '8', displayName: 'SpreadTrader', xp: 9800, level: 5, badgeCount: 11, spiritAnimal: 'fox', winRate: 52, totalTrades: 76 },
  { rank: 9, userId: '9', displayName: 'GammaSqueezer', xp: 8200, level: 5, badgeCount: 10, spiritAnimal: 'monkey', winRate: 48, totalTrades: 64 },
  { rank: 10, userId: '10', displayName: 'VolCrusher', xp: 6500, level: 4, badgeCount: 8, spiritAnimal: 'bear', winRate: 51, totalTrades: 43 },
];

type TimeFilter = 'all_time' | 'weekly' | 'monthly';
type SortBy = 'xp' | 'winRate' | 'trades';

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { progress, level } = useJungle();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all_time');
  const [sortBy, setSortBy] = useState<SortBy>('xp');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    if (isSupabaseConfigured() && user) {
      try {
        const { data, error } = await supabase
          .from('jungle_progress')
          .select('user_id, xp, level, earned_badges')
          .order('xp', { ascending: false })
          .limit(50);

        if (data && !error) {
          // Also get display names from profiles
          const userIds = data.map((d: any) => d.user_id);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, spirit_animal')
            .in('id', userIds);

          const profileMap = new Map(
            (profiles || []).map((p: any) => [p.id, p])
          );

          const entries: LeaderboardEntry[] = data.map((d: any, idx: number) => {
            const profile = profileMap.get(d.user_id) || {};
            return {
              rank: idx + 1,
              userId: d.user_id,
              displayName: (profile as any).display_name || `Trader ${idx + 1}`,
              xp: d.xp || 0,
              level: d.level || 1,
              badgeCount: (d.earned_badges || []).length,
              spiritAnimal: (profile as any).spirit_animal || 'monkey',
              isCurrentUser: d.user_id === user.id,
            };
          });

          // If current user not in top 50, add them
          if (!entries.find(e => e.isCurrentUser)) {
            entries.push({
              rank: entries.length + 1,
              userId: user.id,
              displayName: user.displayName || 'You',
              xp: progress.xp,
              level: level,
              badgeCount: progress.earnedBadges.length,
              spiritAnimal: 'owl',
              isCurrentUser: true,
            });
          }

          setLeaderboard(entries);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to load leaderboard:', e);
      }
    }

    // Fallback to mock data + current user
    const mockWithUser = [...MOCK_LEADERBOARD];
    const currentUserEntry: LeaderboardEntry = {
      rank: 0,
      userId: 'current',
      displayName: user?.displayName || 'You',
      xp: progress.xp,
      level: level,
      badgeCount: progress.earnedBadges.length,
      spiritAnimal: 'owl',
      isCurrentUser: true,
    };

    // Insert current user by XP rank
    mockWithUser.push(currentUserEntry);
    mockWithUser.sort((a, b) => b.xp - a.xp);
    mockWithUser.forEach((entry, idx) => { entry.rank = idx + 1; });

    setLeaderboard(mockWithUser);
    setIsLoading(false);
  }, [user, progress.xp, progress.earnedBadges.length, level]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortBy === 'winRate') return (b.winRate || 0) - (a.winRate || 0);
    if (sortBy === 'trades') return (b.totalTrades || 0) - (a.totalTrades || 0);
    return b.xp - a.xp;
  }).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const getAnimalIcon = (animal: string) => {
    const iconInfo = ANIMAL_ICONS[animal] || { name: 'paw-outline' as keyof typeof Ionicons.glyphMap, color: colors.text.muted };
    return iconInfo;
  };

  const getRankDecoration = (rank: number) => {
    switch (rank) {
      case 1: return { icon: 'trophy' as const, color: '#fbbf24', label: '1st' };
      case 2: return { icon: 'medal' as const, color: '#c0c0c0', label: '2nd' };
      case 3: return { icon: 'medal-outline' as const, color: '#cd7f32', label: '3rd' };
      default: return null;
    }
  };

  const currentUserEntry = sortedLeaderboard.find(e => e.isCurrentUser);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.neon.green} />
          <Text style={styles.loadingText}>Loading rankings...</Text>
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
        <View style={styles.headerCenter}>
          <Ionicons name="trophy" size={20} color={colors.neon.yellow} />
          <Text style={styles.headerTitle}>Leaderboard</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.neon.green}
          />
        }
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

        {/* Sort Options */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {([
            { key: 'xp' as SortBy, label: 'XP', icon: 'star' as const },
            { key: 'winRate' as SortBy, label: 'Win Rate', icon: 'trending-up' as const },
            { key: 'trades' as SortBy, label: 'Trades', icon: 'bar-chart' as const },
          ]).map(({ key, label, icon }) => (
            <TouchableOpacity
              key={key}
              style={[styles.sortChip, sortBy === key && styles.sortChipActive]}
              onPress={() => setSortBy(key)}
            >
              <Ionicons name={icon} size={14} color={sortBy === key ? colors.neon.green : colors.text.muted} />
              <Text style={[styles.sortText, sortBy === key && styles.sortTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {/* 2nd Place */}
          {sortedLeaderboard[1] && (
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatar, styles.podiumSecond]}>
                <Ionicons
                  name={getAnimalIcon(sortedLeaderboard[1].spiritAnimal).name}
                  size={28}
                  color={getAnimalIcon(sortedLeaderboard[1].spiritAnimal).color}
                />
              </View>
              <Ionicons name="medal" size={24} color="#c0c0c0" />
              <Text style={styles.podiumName} numberOfLines={1}>{sortedLeaderboard[1].displayName}</Text>
              <Text style={styles.podiumXP}>{sortedLeaderboard[1].xp.toLocaleString()} XP</Text>
              {sortedLeaderboard[1].winRate != null && (
                <Text style={styles.podiumStat}>{sortedLeaderboard[1].winRate}% WR</Text>
              )}
            </View>
          )}

          {/* 1st Place */}
          {sortedLeaderboard[0] && (
            <View style={[styles.podiumItem, styles.podiumFirst]}>
              <View style={styles.crownContainer}>
                <Ionicons name="trophy" size={32} color={colors.neon.yellow} />
              </View>
              <View style={[styles.podiumAvatar, styles.podiumGold]}>
                <Ionicons
                  name={getAnimalIcon(sortedLeaderboard[0].spiritAnimal).name}
                  size={36}
                  color={getAnimalIcon(sortedLeaderboard[0].spiritAnimal).color}
                />
              </View>
              <Ionicons name="medal" size={28} color="#fbbf24" />
              <Text style={styles.podiumName} numberOfLines={1}>{sortedLeaderboard[0].displayName}</Text>
              <Text style={[styles.podiumXP, styles.podiumXPGold]}>{sortedLeaderboard[0].xp.toLocaleString()} XP</Text>
              {sortedLeaderboard[0].winRate != null && (
                <Text style={[styles.podiumStat, { color: colors.neon.yellow }]}>{sortedLeaderboard[0].winRate}% WR</Text>
              )}
            </View>
          )}

          {/* 3rd Place */}
          {sortedLeaderboard[2] && (
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatar, styles.podiumThird]}>
                <Ionicons
                  name={getAnimalIcon(sortedLeaderboard[2].spiritAnimal).name}
                  size={28}
                  color={getAnimalIcon(sortedLeaderboard[2].spiritAnimal).color}
                />
              </View>
              <Ionicons name="medal-outline" size={24} color="#cd7f32" />
              <Text style={styles.podiumName} numberOfLines={1}>{sortedLeaderboard[2].displayName}</Text>
              <Text style={styles.podiumXP}>{sortedLeaderboard[2].xp.toLocaleString()} XP</Text>
              {sortedLeaderboard[2].winRate != null && (
                <Text style={styles.podiumStat}>{sortedLeaderboard[2].winRate}% WR</Text>
              )}
            </View>
          )}
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
                <View style={styles.yourPositionStats}>
                  <View style={styles.statBadge}>
                    <Ionicons name="ribbon" size={14} color={colors.neon.green} />
                    <Text style={styles.statBadgeText}>{currentUserEntry.badgeCount}</Text>
                  </View>
                  <View style={styles.statBadge}>
                    <Ionicons name="layers" size={14} color={colors.neon.green} />
                    <Text style={styles.statBadgeText}>Lv {currentUserEntry.level}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </GlassCard>
        )}

        {/* Full Leaderboard */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Full Rankings</Text>
          {sortedLeaderboard.slice(3).map((entry) => {
            const animalIcon = getAnimalIcon(entry.spiritAnimal);
            return (
              <View
                key={entry.userId}
                style={[styles.listItem, entry.isCurrentUser && styles.listItemCurrent]}
              >
                <Text style={[styles.listRank, entry.isCurrentUser && { color: colors.neon.green }]}>
                  {entry.rank}
                </Text>
                <View style={[styles.listAvatar, { borderColor: animalIcon.color }]}>
                  <Ionicons name={animalIcon.name} size={18} color={animalIcon.color} />
                </View>
                <View style={styles.listInfo}>
                  <Text style={[styles.listName, entry.isCurrentUser && styles.listNameCurrent]}>
                    {entry.displayName}
                  </Text>
                  <View style={styles.listMeta}>
                    <Text style={styles.listLevel}>Level {entry.level}</Text>
                    {entry.winRate != null && (
                      <>
                        <View style={styles.listDot} />
                        <Text style={styles.listLevel}>{entry.winRate}% WR</Text>
                      </>
                    )}
                    {entry.totalTrades != null && (
                      <>
                        <View style={styles.listDot} />
                        <Text style={styles.listLevel}>{entry.totalTrades} trades</Text>
                      </>
                    )}
                  </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: spacing.md,
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  refreshButton: {
    padding: 8,
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
    paddingTop: spacing.md,
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
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  sortLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sortChipActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    borderColor: 'rgba(57, 255, 20, 0.3)',
  },
  sortText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  sortTextActive: {
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
    top: -35,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: spacing.xs,
  },
  podiumGold: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: colors.neon.yellow,
    ...shadows.neonGreenSubtle,
  },
  podiumSecond: {
    borderColor: '#c0c0c0',
  },
  podiumThird: {
    borderColor: '#cd7f32',
  },
  podiumName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    textAlign: 'center',
    width: '100%',
    marginTop: 2,
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
  podiumStat: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
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
  yourPositionStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  statBadgeText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 11,
    color: colors.neon.green,
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
    color: colors.text.secondary,
    width: 40,
    textAlign: 'center',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
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
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  listLevel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  listDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.muted,
    marginHorizontal: 6,
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
