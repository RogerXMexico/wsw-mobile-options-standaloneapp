// SocialFeedScreen - Social Trading Feed for Wall Street Wildlife Mobile
// Users share, browse, like, and comment on options trades
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuth } from '../../contexts';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReputationTier = 'newcomer' | 'active' | 'veteran' | 'elite' | 'legend';
type TradeStatus = 'open' | 'closed' | 'pending';
type TradeDirection = 'long' | 'short';
type FeedFilter = 'all' | 'following' | 'trending';
type SortMode = 'recent' | 'trending' | 'top';

interface SharedTrade {
  id: string;
  user_id: string;
  display_name: string;
  avatar_color: string;
  reputation_tier: ReputationTier;
  ticker: string;
  strategy_name: string;
  direction: TradeDirection;
  entry_price: number | null;
  exit_price: number | null;
  pnl: number | null;
  status: TradeStatus;
  caption: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_liked: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const REPUTATION_BADGES: Record<ReputationTier, { label: string; color: string; icon: string }> = {
  newcomer: { label: 'Newcomer', color: colors.text.tertiary, icon: 'leaf-outline' },
  active: { label: 'Active', color: colors.info, icon: 'flame-outline' },
  veteran: { label: 'Veteran', color: colors.neon.purple, icon: 'shield-checkmark-outline' },
  elite: { label: 'Elite', color: colors.neon.yellow, icon: 'star-outline' },
  legend: { label: 'Legend', color: colors.neon.green, icon: 'diamond-outline' },
};

const STATUS_STYLES: Record<TradeStatus, { label: string; bg: string; text: string }> = {
  open: {
    label: 'Open',
    bg: 'rgba(16, 185, 129, 0.15)',
    text: colors.success,
  },
  closed: {
    label: 'Closed',
    bg: 'rgba(251, 191, 36, 0.15)',
    text: colors.accent,
  },
  pending: {
    label: 'Pending',
    bg: 'rgba(100, 116, 139, 0.15)',
    text: colors.text.tertiary,
  },
};

const STRATEGY_FILTERS = [
  'All Strategies',
  'Iron Condor',
  'Covered Call',
  'Bull Call Spread',
  'Straddle',
  'Cash-Secured Put',
  'Vertical Spread',
  'Butterfly',
];

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_TRADES: SharedTrade[] = [
  {
    id: '1',
    user_id: 'u1',
    display_name: 'IronCondorKing',
    avatar_color: colors.neon.cyan,
    reputation_tier: 'veteran',
    ticker: 'SPY',
    strategy_name: 'Iron Condor',
    direction: 'short',
    entry_price: 4.50,
    exit_price: 2.05,
    pnl: 245,
    status: 'closed',
    caption: 'Collected premium on both sides. Stayed patient and let theta do the work. Closed at 55% max profit.',
    tags: ['theta-gang', 'high-probability', 'SPY'],
    likes_count: 3,
    comments_count: 2,
    views_count: 87,
    is_liked: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    user_id: 'u2',
    display_name: 'ThetaGang_OG',
    avatar_color: colors.neon.green,
    reputation_tier: 'elite',
    ticker: 'AAPL',
    strategy_name: 'Covered Call',
    direction: 'long',
    entry_price: 3.20,
    exit_price: null,
    pnl: null,
    status: 'open',
    caption: 'Selling the 195 call against my AAPL shares. 30 DTE, sitting at about 0.25 delta. Letting it ride.',
    tags: ['covered-call', 'income', 'AAPL'],
    likes_count: 5,
    comments_count: 4,
    views_count: 142,
    is_liked: true,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    user_id: 'u3',
    display_name: 'SpreadMaster42',
    avatar_color: colors.neon.orange,
    reputation_tier: 'active',
    ticker: 'TSLA',
    strategy_name: 'Bull Call Spread',
    direction: 'long',
    entry_price: 5.80,
    exit_price: 4.60,
    pnl: -120,
    status: 'closed',
    caption: 'Tried to catch the bounce but TSLA had other plans. Stop loss saved me from a bigger hit. On to the next one.',
    tags: ['debit-spread', 'TSLA', 'lesson-learned'],
    likes_count: 1,
    comments_count: 3,
    views_count: 63,
    is_liked: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    user_id: 'u4',
    display_name: 'DeltaForce',
    avatar_color: colors.neon.purple,
    reputation_tier: 'legend',
    ticker: 'NVDA',
    strategy_name: 'Straddle',
    direction: 'long',
    entry_price: 12.40,
    exit_price: null,
    pnl: null,
    status: 'pending',
    caption: 'Earnings play. IV is elevated but I think the move will exceed the expected. Positioned for a big swing either way.',
    tags: ['earnings', 'volatility', 'NVDA', 'straddle'],
    likes_count: 2,
    comments_count: 1,
    views_count: 210,
    is_liked: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    user_id: 'u5',
    display_name: 'VolCrusher',
    avatar_color: colors.neon.pink,
    reputation_tier: 'veteran',
    ticker: 'MSFT',
    strategy_name: 'Cash-Secured Put',
    direction: 'short',
    entry_price: 2.75,
    exit_price: 0.30,
    pnl: 180,
    status: 'closed',
    caption: 'Sold the put at a price I wanted to own MSFT at anyway. Premium expired nearly worthless. Easy money this round.',
    tags: ['cash-secured-put', 'wheel', 'MSFT', 'income'],
    likes_count: 4,
    comments_count: 2,
    views_count: 118,
    is_liked: true,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 _]/g, '').split(/[ _]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return `${diffWeek}w ago`;
}

function formatPnl(pnl: number): string {
  const prefix = pnl >= 0 ? '+' : '';
  return `${prefix}$${Math.abs(pnl).toLocaleString()}`;
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Filter chip row for All / Following / Trending */
const FeedFilterChips: React.FC<{
  active: FeedFilter;
  onChange: (f: FeedFilter) => void;
}> = React.memo(({ active, onChange }) => {
  const chips: { key: FeedFilter; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'globe-outline' },
    { key: 'following', label: 'Following', icon: 'people-outline' },
    { key: 'trending', label: 'Trending', icon: 'trending-up-outline' },
  ];

  return (
    <View style={styles.chipRow}>
      {chips.map((chip) => {
        const isActive = active === chip.key;
        return (
          <TouchableOpacity
            key={chip.key}
            activeOpacity={0.7}
            onPress={() => onChange(chip.key)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Ionicons
              name={chip.icon as any}
              size={14}
              color={isActive ? colors.background.primary : colors.neon.green}
              style={styles.chipIcon}
            />
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

/** Sort dropdown / pills */
const SortBar: React.FC<{
  sortMode: SortMode;
  onSortChange: (s: SortMode) => void;
  strategyFilter: string;
  onStrategyChange: (s: string) => void;
}> = React.memo(({ sortMode, onSortChange, strategyFilter, onStrategyChange }) => {
  const [showStrategyPicker, setShowStrategyPicker] = useState(false);

  const sortOptions: { key: SortMode; label: string; icon: string }[] = [
    { key: 'recent', label: 'Recent', icon: 'time-outline' },
    { key: 'trending', label: 'Trending', icon: 'flame-outline' },
    { key: 'top', label: 'Top', icon: 'arrow-up-outline' },
  ];

  return (
    <View style={styles.sortBarContainer}>
      <View style={styles.sortRow}>
        {sortOptions.map((opt) => {
          const isActive = sortMode === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.7}
              onPress={() => onSortChange(opt.key)}
              style={[styles.sortPill, isActive && styles.sortPillActive]}
            >
              <Ionicons
                name={opt.icon as any}
                size={12}
                color={isActive ? colors.neon.green : colors.text.tertiary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.sortPillText, isActive && styles.sortPillTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowStrategyPicker(!showStrategyPicker)}
          style={[
            styles.strategyFilterBtn,
            strategyFilter !== 'All Strategies' && styles.strategyFilterBtnActive,
          ]}
        >
          <Ionicons
            name="funnel-outline"
            size={12}
            color={strategyFilter !== 'All Strategies' ? colors.neon.green : colors.text.tertiary}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.sortPillText,
              strategyFilter !== 'All Strategies' && styles.sortPillTextActive,
            ]}
            numberOfLines={1}
          >
            {strategyFilter === 'All Strategies' ? 'Strategy' : strategyFilter}
          </Text>
          <Ionicons
            name={showStrategyPicker ? 'chevron-up' : 'chevron-down'}
            size={12}
            color={colors.text.tertiary}
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>
      </View>

      {showStrategyPicker && (
        <View style={styles.strategyDropdown}>
          {STRATEGY_FILTERS.map((strat) => {
            const isActive = strategyFilter === strat;
            return (
              <TouchableOpacity
                key={strat}
                activeOpacity={0.7}
                onPress={() => {
                  onStrategyChange(strat);
                  setShowStrategyPicker(false);
                }}
                style={[styles.strategyOption, isActive && styles.strategyOptionActive]}
              >
                <Text
                  style={[
                    styles.strategyOptionText,
                    isActive && styles.strategyOptionTextActive,
                  ]}
                >
                  {strat}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={16} color={colors.neon.green} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
});

/** Individual trade card */
const TradeCard: React.FC<{
  trade: SharedTrade;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}> = React.memo(({ trade, onLike, onComment }) => {
  const badge = REPUTATION_BADGES[trade.reputation_tier];
  const statusStyle = STATUS_STYLES[trade.status];

  return (
    <GlassCard style={styles.tradeCard}>
      {/* Header row: avatar + name + badge + timestamp */}
      <View style={styles.tradeHeader}>
        <View style={[styles.avatar, { backgroundColor: trade.avatar_color }]}>
          <Text style={styles.avatarText}>{getInitials(trade.display_name)}</Text>
        </View>
        <View style={styles.tradeHeaderInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName} numberOfLines={1}>
              {trade.display_name}
            </Text>
            <View style={[styles.reputationBadge, { backgroundColor: `${badge.color}20` }]}>
              <Ionicons name={badge.icon as any} size={10} color={badge.color} />
              <Text style={[styles.reputationText, { color: badge.color }]}>
                {badge.label}
              </Text>
            </View>
          </View>
          <Text style={styles.timestamp}>{formatRelativeTime(trade.created_at)}</Text>
        </View>
      </View>

      {/* Trade details row */}
      <View style={styles.tradeDetailsRow}>
        <View style={styles.tickerContainer}>
          <Text style={styles.ticker}>{trade.ticker}</Text>
          <View
            style={[
              styles.directionBadge,
              {
                backgroundColor:
                  trade.direction === 'long'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
              },
            ]}
          >
            <Ionicons
              name={trade.direction === 'long' ? 'arrow-up' : 'arrow-down'}
              size={10}
              color={trade.direction === 'long' ? colors.bullish : colors.bearish}
            />
            <Text
              style={[
                styles.directionText,
                { color: trade.direction === 'long' ? colors.bullish : colors.bearish },
              ]}
            >
              {trade.direction.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.strategyName}>{trade.strategy_name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>

      {/* Price / P&L row */}
      {(trade.entry_price !== null || trade.pnl !== null) && (
        <View style={styles.priceRow}>
          {trade.entry_price !== null && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Entry</Text>
              <Text style={styles.priceValue}>{formatPrice(trade.entry_price)}</Text>
            </View>
          )}
          {trade.exit_price !== null && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Exit</Text>
              <Text style={styles.priceValue}>{formatPrice(trade.exit_price)}</Text>
            </View>
          )}
          {trade.pnl !== null && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>P&L</Text>
              <Text
                style={[
                  styles.pnlValue,
                  { color: trade.pnl >= 0 ? colors.success : colors.error },
                ]}
              >
                {formatPnl(trade.pnl)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Caption */}
      {trade.caption.length > 0 && (
        <Text style={styles.caption} numberOfLines={3}>
          {trade.caption}
        </Text>
      )}

      {/* Tags */}
      {trade.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {trade.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Interaction bar */}
      <View style={styles.interactionBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onLike(trade.id)}
          style={styles.interactionBtn}
        >
          <Ionicons
            name={trade.is_liked ? 'heart' : 'heart-outline'}
            size={18}
            color={trade.is_liked ? colors.neon.pink : colors.text.tertiary}
          />
          <Text
            style={[
              styles.interactionCount,
              trade.is_liked && { color: colors.neon.pink },
            ]}
          >
            {trade.likes_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onComment(trade.id)}
          style={styles.interactionBtn}
        >
          <Ionicons name="chatbubble-outline" size={16} color={colors.text.tertiary} />
          <Text style={styles.interactionCount}>{trade.comments_count}</Text>
        </TouchableOpacity>

        <View style={styles.interactionBtn}>
          <Ionicons name="eye-outline" size={16} color={colors.text.tertiary} />
          <Text style={styles.interactionCount}>{trade.views_count}</Text>
        </View>
      </View>
    </GlassCard>
  );
});

/** Empty state illustration */
const EmptyState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconCircle}>
      <Ionicons name="newspaper-outline" size={48} color={colors.text.muted} />
    </View>
    <Text style={styles.emptyTitle}>No trades shared yet</Text>
    <Text style={styles.emptySubtitle}>
      Be the first to share a trade idea with the community.
    </Text>
    <View style={styles.emptyHintRow}>
      <Ionicons name="arrow-down" size={14} color={colors.neon.green} />
      <Text style={styles.emptyHint}>Tap the button below to get started</Text>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const SocialFeedScreen: React.FC = () => {
  const { user } = useAuth();

  // State
  const [trades, setTrades] = useState<SharedTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [strategyFilter, setStrategyFilter] = useState('All Strategies');

  // --------------------------------------------------
  // Supabase integration
  // --------------------------------------------------

  const loadTrades = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Use mock data when Supabase is not configured
      setTrades(MOCK_TRADES);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('shared_trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (strategyFilter !== 'All Strategies') {
        query = query.eq('strategy_name', strategyFilter);
      }

      if (feedFilter === 'trending') {
        query = query.order('likes_count', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error loading trades:', error);
        setTrades(MOCK_TRADES);
      } else {
        setTrades((data as SharedTrade[]) || []);
      }
    } catch (err) {
      console.error('Failed to load trades:', err);
      setTrades(MOCK_TRADES);
    } finally {
      setLoading(false);
    }
  }, [feedFilter, strategyFilter]);

  const likeTrade = useCallback(
    async (tradeId: string) => {
      // Optimistic update
      setTrades((prev) =>
        prev.map((t) => {
          if (t.id !== tradeId) return t;
          const nowLiked = !t.is_liked;
          return {
            ...t,
            is_liked: nowLiked,
            likes_count: nowLiked ? t.likes_count + 1 : t.likes_count - 1,
          };
        }),
      );

      if (!isSupabaseConfigured()) return;

      try {
        const trade = trades.find((t) => t.id === tradeId);
        if (!trade || !user) return;

        if (trade.is_liked) {
          // Was liked, now unlike
          await supabase
            .from('trade_likes')
            .delete()
            .eq('trade_id', tradeId)
            .eq('user_id', user.id);

          await supabase
            .from('shared_trades')
            .update({ likes_count: trade.likes_count - 1 })
            .eq('id', tradeId);
        } else {
          // Like
          await supabase
            .from('trade_likes')
            .insert({ trade_id: tradeId, user_id: user.id });

          await supabase
            .from('shared_trades')
            .update({ likes_count: trade.likes_count + 1 })
            .eq('id', tradeId);
        }
      } catch (err) {
        console.error('Failed to toggle like:', err);
        // Revert optimistic update on failure
        setTrades((prev) =>
          prev.map((t) => {
            if (t.id !== tradeId) return t;
            const reverted = !t.is_liked;
            return {
              ...t,
              is_liked: reverted,
              likes_count: reverted ? t.likes_count + 1 : t.likes_count - 1,
            };
          }),
        );
      }
    },
    [trades, user],
  );

  const loadComments = useCallback(async (tradeId: string) => {
    if (!isSupabaseConfigured()) {
      // In mock mode, we could navigate to a comments screen or show a placeholder
      console.log('Open comments for trade:', tradeId);
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('trade_comments')
        .select('*')
        .eq('trade_id', tradeId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading comments:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Failed to load comments:', err);
      return [];
    }
  }, []);

  // --------------------------------------------------
  // Sorting and filtering logic
  // --------------------------------------------------

  const filteredTrades = useMemo(() => {
    let result = [...trades];

    // Apply strategy filter
    if (strategyFilter !== 'All Strategies') {
      result = result.filter((t) => t.strategy_name === strategyFilter);
    }

    // Apply sort
    switch (sortMode) {
      case 'recent':
        result.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case 'trending':
        result.sort((a, b) => {
          // Trending = weighted score of likes + comments + views recency
          const scoreA = a.likes_count * 3 + a.comments_count * 2 + a.views_count * 0.1;
          const scoreB = b.likes_count * 3 + b.comments_count * 2 + b.views_count * 0.1;
          return scoreB - scoreA;
        });
        break;
      case 'top':
        result.sort((a, b) => b.likes_count - a.likes_count);
        break;
    }

    return result;
  }, [trades, sortMode, strategyFilter]);

  // --------------------------------------------------
  // Effects
  // --------------------------------------------------

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrades();
    setRefreshing(false);
  }, [loadTrades]);

  const handleComment = useCallback(
    (tradeId: string) => {
      loadComments(tradeId);
      // TODO: Navigate to comments screen or open bottom sheet
    },
    [loadComments],
  );

  const handleShareTrade = useCallback(() => {
    // TODO: Navigate to share trade screen or open bottom sheet
    console.log('Open share trade modal');
  }, []);

  // --------------------------------------------------
  // Render helpers
  // --------------------------------------------------

  const renderTradeCard = useCallback(
    ({ item }: { item: SharedTrade }) => (
      <TradeCard trade={item} onLike={likeTrade} onComment={handleComment} />
    ),
    [likeTrade, handleComment],
  );

  const keyExtractor = useCallback((item: SharedTrade) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <FeedFilterChips active={feedFilter} onChange={setFeedFilter} />
        <SortBar
          sortMode={sortMode}
          onSortChange={setSortMode}
          strategyFilter={strategyFilter}
          onStrategyChange={setStrategyFilter}
        />
      </View>
    ),
    [feedFilter, sortMode, strategyFilter],
  );

  // --------------------------------------------------
  // Main render
  // --------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons
              name="pulse-outline"
              size={24}
              color={colors.neon.green}
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Social Trading Feed</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.headerAction}>
            <Ionicons name="notifications-outline" size={22} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.neon.green} />
            <Text style={styles.loadingText}>Loading trades...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTrades}
            renderItem={renderTradeCard}
            keyExtractor={keyExtractor}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={EmptyState}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.neon.green}
                colors={[colors.neon.green]}
              />
            }
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={7}
            removeClippedSubviews
          />
        )}

        {/* Share Trade FAB */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleShareTrade}
          style={styles.fab}
        >
          <Ionicons name="add" size={28} color={colors.background.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Layout
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  headerAction: {
    padding: spacing.xs,
  },

  // List
  listContent: {
    paddingBottom: 100, // Room for FAB + tab bar
  },
  listHeader: {
    paddingTop: spacing.sm,
  },

  // Filter chips
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.neon,
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.neon.green,
    borderColor: colors.neon.green,
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    ...typography.styles.labelSm,
    color: colors.neon.green,
  },
  chipTextActive: {
    color: colors.background.primary,
  },

  // Sort bar
  sortBarContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
  },
  sortPillActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
  },
  sortPillText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  sortPillTextActive: {
    color: colors.neon.green,
  },
  strategyFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    marginLeft: 'auto',
    maxWidth: 140,
  },
  strategyFilterBtnActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
  },
  strategyDropdown: {
    marginTop: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },
  strategyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  strategyOptionActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.08)',
  },
  strategyOptionText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  strategyOptionTextActive: {
    color: colors.neon.green,
  },

  // Trade card
  tradeCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  tradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.styles.labelSm,
    color: colors.background.primary,
    fontWeight: '700',
  },
  tradeHeaderInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  displayName: {
    ...typography.styles.label,
    color: colors.text.primary,
    flexShrink: 1,
  },
  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 3,
  },
  reputationText: {
    fontSize: 9,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timestamp: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: 2,
  },

  // Trade details
  tradeDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticker: {
    ...typography.styles.h5,
    color: colors.neon.cyan,
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  directionText: {
    fontSize: 9,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  strategyName: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Price row
  priceRow: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    ...typography.styles.monoBold,
    color: colors.text.primary,
    fontSize: 13,
  },
  pnlValue: {
    ...typography.styles.monoBold,
    fontSize: 13,
  },

  // Caption
  caption: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(57, 255, 20, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.15)',
  },
  tagText: {
    ...typography.styles.caption,
    color: colors.neon.green,
    fontSize: 11,
  },

  // Interaction bar
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.light,
    gap: spacing.lg,
  },
  interactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  interactionCount: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  emptyTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.md,
    maxWidth: 280,
  },
  emptyHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyHint: {
    ...typography.styles.bodySm,
    color: colors.neon.green,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.neonGreenSubtle,
  },
});

export default SocialFeedScreen;
