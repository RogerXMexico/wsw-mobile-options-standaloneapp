// Performance Leaderboard Screen
// Tracks paper trading performance metrics: XP Rank, Win Rate, Total P&L, Streak, Best Trade
// Modeled after desktop PerformanceLeaderboard with full mobile-native implementation

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ListRenderItemInfo,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimalAvatar } from '../../components/mascots/AnimalAvatar';
import { colors, typography, spacing, borderRadius } from '../../theme';

// ============ TYPES ============

type LeaderboardTab = 'xpRank' | 'winRate' | 'totalPnL' | 'streak' | 'bestTrade';
type TimePeriod = 'allTime' | 'thisMonth' | 'thisWeek';
type Category = 'overall' | 'options' | 'stocks' | 'polymarket';

interface PerformanceStats {
  xp: number;
  level: number;
  winRate: number;
  totalPnL: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  streak: number;
  bestTrade: number;
  worstTrade: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  totalReturnPct: number;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  animal: string;
  stats: PerformanceStats;
  isCurrentUser: boolean;
}

// ============ CONSTANTS ============

const LEADERBOARD_TABS: { key: LeaderboardTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'xpRank', label: 'XP Rank', icon: 'star' },
  { key: 'winRate', label: 'Win Rate', icon: 'checkmark-circle' },
  { key: 'totalPnL', label: 'Total P&L', icon: 'trending-up' },
  { key: 'streak', label: 'Streak', icon: 'flame' },
  { key: 'bestTrade', label: 'Best Trade', icon: 'trophy' },
];

const TIME_PERIODS: { key: TimePeriod; label: string }[] = [
  { key: 'allTime', label: 'All Time' },
  { key: 'thisMonth', label: 'This Month' },
  { key: 'thisWeek', label: 'This Week' },
];

const CATEGORIES: { key: Category; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'overall', label: 'Overall', icon: 'grid' },
  { key: 'options', label: 'Options', icon: 'layers' },
  { key: 'stocks', label: 'Stocks', icon: 'bar-chart' },
  { key: 'polymarket', label: 'Polymarket', icon: 'globe' },
];

const RANK_COLORS = {
  gold: '#fbbf24',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
};

const ANIMALS = [
  'owl', 'badger', 'monkey', 'bull', 'bear', 'chameleon',
  'cheetah', 'sloth', 'fox', 'tiger', 'eagle',
];

// ============ MOCK DATA GENERATION ============

const TRADER_NAMES = [
  'IronCondorKing', 'ThetaGang_OG', 'SpreadMaster42', 'DeltaForce',
  'VolCrusher', 'PremiumHunter', 'GammaScalper', 'StraddleSam',
  'CalendarQueen', 'ButterflyKid', 'RollMaster', 'GreekFreak99',
  'PutWriter77', 'VegaHunter', 'CondorCommander', 'SigmaTrader',
  'AlphaDecay', 'ThetaBurner', 'IVSurfer', 'SpreadEagle',
];

const generateMockStats = (seed: number): PerformanceStats => {
  // Pseudo-random using seed for consistency
  const rand = (min: number, max: number) => {
    const x = Math.sin(seed * 9301 + 49297) % 1;
    return min + Math.abs(x) * (max - min);
  };

  const totalTrades = Math.floor(rand(15, 200));
  const winRate = rand(30, 82);
  const winningTrades = Math.round(totalTrades * (winRate / 100));
  const losingTrades = totalTrades - winningTrades;
  const avgWin = rand(80, 650);
  const avgLoss = rand(40, 350);
  const totalPnL = (winningTrades * avgWin) - (losingTrades * avgLoss);
  const bestTrade = rand(200, 3500);
  const worstTrade = -rand(100, 1800);
  const streak = Math.floor(rand(0, 15));
  const xp = Math.floor(rand(1200, 45000));
  const level = Math.floor(xp / 5000) + 1;

  return {
    xp,
    level,
    winRate,
    totalPnL,
    totalTrades,
    winningTrades,
    losingTrades,
    streak,
    bestTrade,
    worstTrade,
    avgWin,
    avgLoss,
    profitFactor: losingTrades > 0 && avgLoss > 0
      ? (winningTrades * avgWin) / (losingTrades * avgLoss)
      : winningTrades > 0 ? 99.9 : 0,
    totalReturnPct: (totalPnL / 10000) * 100,
  };
};

const CURRENT_USER_STATS: PerformanceStats = {
  xp: 8750,
  level: 3,
  winRate: 58.3,
  totalPnL: 1247.50,
  totalTrades: 24,
  winningTrades: 14,
  losingTrades: 10,
  streak: 3,
  bestTrade: 892.00,
  worstTrade: -445.20,
  avgWin: 187.50,
  avgLoss: 112.80,
  profitFactor: 1.66,
  totalReturnPct: 12.48,
};

const generateLeaderboard = (): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = TRADER_NAMES.map((name, idx) => ({
    id: `trader-${idx}`,
    rank: 0,
    username: name,
    animal: ANIMALS[idx % ANIMALS.length],
    stats: generateMockStats(idx + 1),
    isCurrentUser: false,
  }));

  // Add current user
  entries.push({
    id: 'current-user',
    rank: 0,
    username: 'You',
    animal: 'owl',
    stats: CURRENT_USER_STATS,
    isCurrentUser: true,
  });

  return entries;
};

// ============ HELPERS ============

const formatPnL = (val: number): string => {
  const formatted = Math.abs(val).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return val >= 0 ? `+$${formatted}` : `-$${formatted}`;
};

const formatPct = (val: number): string => {
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
};

const getMetricValue = (entry: LeaderboardEntry, tab: LeaderboardTab): string => {
  switch (tab) {
    case 'xpRank':
      return `${entry.stats.xp.toLocaleString()} XP`;
    case 'winRate':
      return `${entry.stats.winRate.toFixed(1)}%`;
    case 'totalPnL':
      return formatPnL(entry.stats.totalPnL);
    case 'streak':
      return `${entry.stats.streak} wins`;
    case 'bestTrade':
      return formatPnL(entry.stats.bestTrade);
  }
};

const getMetricNumeric = (entry: LeaderboardEntry, tab: LeaderboardTab): number => {
  switch (tab) {
    case 'xpRank':
      return entry.stats.xp;
    case 'winRate':
      return entry.stats.winRate;
    case 'totalPnL':
      return entry.stats.totalPnL;
    case 'streak':
      return entry.stats.streak;
    case 'bestTrade':
      return entry.stats.bestTrade;
  }
};

const isPositiveMetric = (entry: LeaderboardEntry, tab: LeaderboardTab): boolean => {
  switch (tab) {
    case 'xpRank':
      return true;
    case 'winRate':
      return entry.stats.winRate >= 50;
    case 'totalPnL':
      return entry.stats.totalPnL >= 0;
    case 'streak':
      return entry.stats.streak > 0;
    case 'bestTrade':
      return entry.stats.bestTrade >= 0;
  }
};

// ============ COMPONENT ============

const PerformanceLeaderboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('xpRank');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('allTime');
  const [category, setCategory] = useState<Category>('overall');
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Generate and sort leaderboard based on active tab
  const sortedLeaderboard = useMemo(() => {
    const entries = generateLeaderboard();
    return entries
      .sort((a, b) => getMetricNumeric(b, activeTab) - getMetricNumeric(a, activeTab))
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [activeTab, timePeriod, category]);

  const currentUser = useMemo(
    () => sortedLeaderboard.find((e) => e.isCurrentUser),
    [sortedLeaderboard],
  );

  // Compute user rank in each tab for the personal stats card
  const userRanks = useMemo(() => {
    const entries = generateLeaderboard();
    const tabs: LeaderboardTab[] = ['xpRank', 'winRate', 'totalPnL', 'streak', 'bestTrade'];
    const ranks: Record<LeaderboardTab, number> = {} as any;

    for (const tab of tabs) {
      const sorted = [...entries]
        .sort((a, b) => getMetricNumeric(b, tab) - getMetricNumeric(a, tab));
      const idx = sorted.findIndex((e) => e.isCurrentUser);
      ranks[tab] = idx + 1;
    }

    return ranks;
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const scrollToCurrentUser = useCallback(() => {
    if (!currentUser || !flatListRef.current) return;
    const idx = sortedLeaderboard.findIndex((e) => e.isCurrentUser);
    if (idx >= 0) {
      flatListRef.current.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 });
    }
  }, [currentUser, sortedLeaderboard]);

  // ============ RENDER HELPERS ============

  const renderRankBadge = (rank: number, isCurrentUser: boolean) => {
    if (rank === 1) {
      return (
        <View style={[styles.rankBadge, { backgroundColor: RANK_COLORS.gold + '20' }]}>
          <Ionicons name="trophy" size={18} color={RANK_COLORS.gold} />
        </View>
      );
    }
    if (rank === 2) {
      return (
        <View style={[styles.rankBadge, { backgroundColor: RANK_COLORS.silver + '20' }]}>
          <Ionicons name="medal" size={18} color={RANK_COLORS.silver} />
        </View>
      );
    }
    if (rank === 3) {
      return (
        <View style={[styles.rankBadge, { backgroundColor: RANK_COLORS.bronze + '20' }]}>
          <Ionicons name="medal-outline" size={18} color={RANK_COLORS.bronze} />
        </View>
      );
    }
    return (
      <View style={styles.rankBadge}>
        <Text style={[styles.rankNumber, isCurrentUser && { color: colors.neon.green }]}>
          {rank}
        </Text>
      </View>
    );
  };

  const renderLeaderboardRow = ({ item }: ListRenderItemInfo<LeaderboardEntry>) => {
    const isTop3 = item.rank <= 3;
    const rowBorderColor = item.rank === 1
      ? RANK_COLORS.gold
      : item.rank === 2
        ? RANK_COLORS.silver
        : item.rank === 3
          ? RANK_COLORS.bronze
          : 'transparent';

    return (
      <View
        style={[
          styles.leaderboardRow,
          isTop3 && { borderLeftWidth: 3, borderLeftColor: rowBorderColor },
          item.isCurrentUser && styles.leaderboardRowCurrent,
        ]}
      >
        {/* Rank */}
        {renderRankBadge(item.rank, item.isCurrentUser)}

        {/* Avatar */}
        <AnimalAvatar animal={item.animal} size={40} showBorder />

        {/* Name + meta */}
        <View style={styles.rowInfo}>
          <View style={styles.rowNameContainer}>
            <Text
              style={[
                styles.rowName,
                isTop3 && styles.rowNameTop3,
                item.isCurrentUser && styles.rowNameCurrent,
              ]}
              numberOfLines={1}
            >
              {item.username}
            </Text>
            {item.isCurrentUser && (
              <View style={styles.youBadge}>
                <Text style={styles.youBadgeText}>YOU</Text>
              </View>
            )}
          </View>
          <View style={styles.rowMeta}>
            <Text style={styles.rowMetaText}>Lv {item.stats.level}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.rowMetaText}>{item.stats.totalTrades} trades</Text>
            <View style={styles.metaDot} />
            <Text style={styles.rowMetaText}>
              {item.stats.winningTrades}W/{item.stats.losingTrades}L
            </Text>
          </View>
        </View>

        {/* Metric value */}
        <View style={styles.rowMetric}>
          <Text
            style={[
              styles.rowMetricValue,
              isPositiveMetric(item, activeTab)
                ? styles.metricPositive
                : styles.metricNegative,
            ]}
          >
            {getMetricValue(item, activeTab)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Leaderboard Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={LEADERBOARD_TABS}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.tabsContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tabButton, activeTab === item.key && styles.tabButtonActive]}
              onPress={() => setActiveTab(item.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={14}
                color={activeTab === item.key ? colors.neon.green : colors.text.muted}
              />
              <Text
                style={[styles.tabLabel, activeTab === item.key && styles.tabLabelActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Time Period Filter */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.filterChip,
                timePeriod === period.key && styles.filterChipActive,
              ]}
              onPress={() => setTimePeriod(period.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  timePeriod === period.key && styles.filterChipTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categorySection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.categoryContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                category === item.key && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(item.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={13}
                color={category === item.key ? colors.neon.green : colors.text.muted}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  category === item.key && styles.categoryChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Personal Stats Card */}
      {currentUser && (
        <View style={styles.personalCard}>
          <LinearGradient
            colors={['rgba(57, 255, 20, 0.12)', 'rgba(57, 255, 20, 0.03)', 'transparent']}
            style={styles.personalCardGradient}
          >
            <View style={styles.personalCardHeader}>
              <View style={styles.personalCardLeft}>
                <AnimalAvatar animal="owl" size={48} showBorder />
                <View style={styles.personalCardInfo}>
                  <Text style={styles.personalCardName}>Your Rankings</Text>
                  <Text style={styles.personalCardSubtitle}>
                    {currentUser.stats.totalTrades} trades completed
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={scrollToCurrentUser} style={styles.findMeButton}>
                <Ionicons name="locate" size={16} color={colors.neon.green} />
                <Text style={styles.findMeText}>Find Me</Text>
              </TouchableOpacity>
            </View>

            {/* Rank in each category */}
            <View style={styles.personalRanksRow}>
              {LEADERBOARD_TABS.map((tab) => (
                <View key={tab.key} style={styles.personalRankItem}>
                  <View style={styles.personalRankIconRow}>
                    <Ionicons name={tab.icon} size={12} color={colors.text.muted} />
                  </View>
                  <Text style={styles.personalRankValue}>#{userRanks[tab.key]}</Text>
                  <Text style={styles.personalRankLabel}>{tab.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Your Best Section */}
      {currentUser && (
        <View style={styles.yourBestSection}>
          <Text style={styles.sectionTitle}>Your Best</Text>
          <View style={styles.yourBestGrid}>
            {[
              {
                label: 'Best Trade',
                value: formatPnL(currentUser.stats.bestTrade),
                icon: 'arrow-up-circle' as keyof typeof Ionicons.glyphMap,
                positive: currentUser.stats.bestTrade >= 0,
              },
              {
                label: 'Win Rate',
                value: `${currentUser.stats.winRate.toFixed(1)}%`,
                icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
                positive: currentUser.stats.winRate >= 50,
              },
              {
                label: 'Win Streak',
                value: `${currentUser.stats.streak}`,
                icon: 'flame' as keyof typeof Ionicons.glyphMap,
                positive: currentUser.stats.streak > 0,
              },
              {
                label: 'Total P&L',
                value: formatPnL(currentUser.stats.totalPnL),
                icon: 'wallet' as keyof typeof Ionicons.glyphMap,
                positive: currentUser.stats.totalPnL >= 0,
              },
              {
                label: 'Profit Factor',
                value: currentUser.stats.profitFactor >= 99
                  ? 'Inf'
                  : currentUser.stats.profitFactor.toFixed(2),
                icon: 'analytics' as keyof typeof Ionicons.glyphMap,
                positive: currentUser.stats.profitFactor >= 1,
              },
              {
                label: 'Return %',
                value: formatPct(currentUser.stats.totalReturnPct),
                icon: 'trending-up' as keyof typeof Ionicons.glyphMap,
                positive: currentUser.stats.totalReturnPct >= 0,
              },
            ].map((stat, index) => (
              <View key={index} style={styles.yourBestCard}>
                <Ionicons
                  name={stat.icon}
                  size={16}
                  color={stat.positive ? colors.neon.green : colors.neon.red}
                />
                <Text
                  style={[
                    styles.yourBestValue,
                    { color: stat.positive ? colors.neon.green : colors.neon.red },
                  ]}
                >
                  {stat.value}
                </Text>
                <Text style={styles.yourBestLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Top 3 Podium */}
      {sortedLeaderboard.length >= 3 && (
        <View style={styles.podiumSection}>
          <Text style={styles.sectionTitle}>Top 3</Text>
          <View style={styles.podiumContainer}>
            {/* 2nd Place */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatarWrap, { borderColor: RANK_COLORS.silver }]}>
                <AnimalAvatar
                  animal={sortedLeaderboard[1].animal}
                  size={56}
                  showBorder={false}
                />
              </View>
              <Ionicons name="medal" size={22} color={RANK_COLORS.silver} />
              <Text style={styles.podiumName} numberOfLines={1}>
                {sortedLeaderboard[1].username}
              </Text>
              <Text style={styles.podiumMetric}>
                {getMetricValue(sortedLeaderboard[1], activeTab)}
              </Text>
              <Text style={styles.podiumSubMetric}>
                {sortedLeaderboard[1].stats.winRate.toFixed(0)}% WR
              </Text>
            </View>

            {/* 1st Place */}
            <View style={[styles.podiumItem, styles.podiumItemFirst]}>
              <Ionicons
                name="trophy"
                size={28}
                color={RANK_COLORS.gold}
                style={styles.podiumCrown}
              />
              <View style={[styles.podiumAvatarWrap, styles.podiumAvatarFirst, { borderColor: RANK_COLORS.gold }]}>
                <AnimalAvatar
                  animal={sortedLeaderboard[0].animal}
                  size={68}
                  showBorder={false}
                />
              </View>
              <Ionicons name="medal" size={26} color={RANK_COLORS.gold} />
              <Text style={[styles.podiumName, { color: RANK_COLORS.gold }]} numberOfLines={1}>
                {sortedLeaderboard[0].username}
              </Text>
              <Text style={[styles.podiumMetric, { color: RANK_COLORS.gold }]}>
                {getMetricValue(sortedLeaderboard[0], activeTab)}
              </Text>
              <Text style={[styles.podiumSubMetric, { color: RANK_COLORS.gold + 'aa' }]}>
                {sortedLeaderboard[0].stats.winRate.toFixed(0)}% WR
              </Text>
            </View>

            {/* 3rd Place */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatarWrap, { borderColor: RANK_COLORS.bronze }]}>
                <AnimalAvatar
                  animal={sortedLeaderboard[2].animal}
                  size={56}
                  showBorder={false}
                />
              </View>
              <Ionicons name="medal-outline" size={22} color={RANK_COLORS.bronze} />
              <Text style={styles.podiumName} numberOfLines={1}>
                {sortedLeaderboard[2].username}
              </Text>
              <Text style={styles.podiumMetric}>
                {getMetricValue(sortedLeaderboard[2], activeTab)}
              </Text>
              <Text style={styles.podiumSubMetric}>
                {sortedLeaderboard[2].stats.winRate.toFixed(0)}% WR
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Column Header */}
      <View style={styles.columnHeader}>
        <Text style={[styles.columnHeaderText, { width: 44 }]}>#</Text>
        <Text style={[styles.columnHeaderText, { flex: 1, marginLeft: 48 }]}>Trader</Text>
        <Text style={[styles.columnHeaderText, { width: 100, textAlign: 'right' }]}>
          {LEADERBOARD_TABS.find((t) => t.key === activeTab)?.label || 'Value'}
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Rankings refresh periodically. Trade more to climb the board.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.neon.green} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="podium" size={20} color={colors.neon.green} />
          <Text style={styles.headerTitle}>Performance Leaderboard</Text>
        </View>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Main List */}
      <FlatList
        ref={flatListRef}
        data={sortedLeaderboard}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaderboardRow}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.neon.green}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: 72,
          offset: 72 * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />
    </SafeAreaView>
  );
};

// ============ STYLES ============

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header Bar
  headerBar: {
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

  // List
  listContent: {
    paddingBottom: spacing['2xl'] + 40,
  },

  // Tabs
  tabsContainer: {
    paddingTop: spacing.md,
  },
  tabsContent: {
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.12)',
    borderColor: colors.neon.green,
  },
  tabLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  tabLabelActive: {
    color: colors.neon.green,
  },

  // Time Period Filters
  filterSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
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
    backgroundColor: 'rgba(57, 255, 20, 0.12)',
    borderColor: colors.neon.green,
  },
  filterChipText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  filterChipTextActive: {
    color: colors.neon.green,
  },

  // Category Filters
  categorySection: {
    paddingTop: spacing.sm,
  },
  categoryContent: {
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.08)',
    borderColor: 'rgba(57, 255, 20, 0.25)',
  },
  categoryChipText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  categoryChipTextActive: {
    color: colors.neon.green,
  },

  // Personal Stats Card
  personalCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.25)',
  },
  personalCardGradient: {
    padding: spacing.md,
  },
  personalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  personalCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personalCardInfo: {
    gap: 2,
  },
  personalCardName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
  },
  personalCardSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  findMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.25)',
  },
  findMeText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 11,
    color: colors.neon.green,
  },
  personalRanksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  personalRankItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borderRadius.sm,
    marginHorizontal: 2,
  },
  personalRankIconRow: {
    marginBottom: 4,
  },
  personalRankValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.base,
    color: colors.neon.green,
  },
  personalRankLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 9,
    color: colors.text.muted,
    marginTop: 2,
  },

  // Your Best Section
  yourBestSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  yourBestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  yourBestCard: {
    width: (SCREEN_WIDTH - spacing.md * 2 - spacing.sm * 2) / 3,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  yourBestValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    marginTop: 4,
  },
  yourBestLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },

  // Podium
  podiumSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  podiumItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - spacing.md * 2) / 3,
  },
  podiumItemFirst: {
    marginBottom: spacing.lg,
  },
  podiumCrown: {
    marginBottom: 4,
  },
  podiumAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary,
    marginBottom: 4,
    overflow: 'hidden',
  },
  podiumAvatarFirst: {
    width: 76,
    height: 76,
    borderRadius: 38,
    shadowColor: RANK_COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  podiumName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    textAlign: 'center',
    width: '90%',
    marginTop: 2,
  },
  podiumMetric: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  podiumSubMetric: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 1,
  },

  // Column Header
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  columnHeaderText: {
    fontFamily: typography.fonts.mono,
    fontSize: 10,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Leaderboard Row
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    height: 72,
  },
  leaderboardRowCurrent: {
    backgroundColor: 'rgba(57, 255, 20, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: colors.neon.green,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rankNumber: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },

  // Row Info
  rowInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  rowNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  rowNameTop3: {
    color: colors.text.primary,
  },
  rowNameCurrent: {
    color: colors.neon.green,
  },
  youBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.3)',
  },
  youBadgeText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 9,
    color: colors.neon.green,
    letterSpacing: 0.5,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  rowMetaText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.muted,
    marginHorizontal: 6,
  },

  // Row Metric
  rowMetric: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  rowMetricValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  metricPositive: {
    color: colors.neon.green,
  },
  metricNegative: {
    color: colors.neon.red,
  },

  // Footer
  footer: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    textAlign: 'center',
  },
});

export default PerformanceLeaderboardScreen;
