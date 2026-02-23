// SocialFeedScreen - Full-featured Social Trading Feed for Wall Street Wildlife Mobile
// Mirrors desktop SocialTradingFeed.tsx with: comment threading, reaction types,
// trade detail modal, follow/unfollow, feed filtering, user mini-profiles,
// share trade integration, and infinite scroll.
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  Share,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuth } from '../../contexts';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useFollows } from '../../hooks/useFollows';
import { ShareTradeModal, TradeData as ShareTradeData } from '../../components/ui/ShareTradeModal';
import { AnimalAvatar } from '../../components/mascots/AnimalAvatar';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReputationTier = 'newcomer' | 'active' | 'veteran' | 'elite' | 'legend';
type TradeStatus = 'open' | 'closed' | 'pending';
type TradeDirection = 'long' | 'short';
type FeedFilter = 'all' | 'following' | 'top' | 'mine';
type SortMode = 'recent' | 'popular' | 'profit' | 'discussed';
type ReactionType = 'like' | 'fire' | 'hundred' | 'chart_up';

interface SharedTrade {
  id: string;
  user_id: string;
  user_display_name: string | null;
  avatar_color: string;
  avatar_animal: string | null;
  reputation_tier: ReputationTier;
  tribe: string | null;
  ticker: string;
  strategy: string;
  direction: TradeDirection | null;
  entry_price: number | null;
  exit_price: number | null;
  pnl: number | null;
  pnl_percent: number | null;
  status: TradeStatus | null;
  show_pnl: boolean;
  show_prices: boolean;
  caption: string | null;
  tags: string[] | null;
  trade_date: string | null;
  shared_at: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  user_liked: boolean;
  user_reaction: ReactionType | null;
}

interface TradeComment {
  id: string;
  trade_id: string;
  user_id: string;
  user_display_name: string | null;
  comment_text: string;
  parent_comment_id: string | null;
  like_count: number;
  created_at: string;
  updated_at?: string;
  user_liked: boolean;
}

interface TraderReputation {
  userId: string;
  displayName: string;
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  followers: number;
  tier: ReputationTier;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_SIZE = 20;

const REPUTATION_BADGES: Record<
  ReputationTier,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  newcomer: { label: 'Newcomer', color: colors.text.tertiary, icon: 'leaf-outline' },
  active: { label: 'Active', color: colors.info, icon: 'flame-outline' },
  veteran: { label: 'Veteran', color: colors.neon.purple, icon: 'shield-checkmark-outline' },
  elite: { label: 'Elite', color: colors.neon.yellow, icon: 'star-outline' },
  legend: { label: 'Legend', color: colors.neon.green, icon: 'diamond-outline' },
};

const STATUS_STYLES: Record<TradeStatus, { label: string; bg: string; text: string }> = {
  open: { label: 'OPEN', bg: 'rgba(16, 185, 129, 0.15)', text: colors.success },
  closed: { label: 'CLOSED', bg: 'rgba(100, 116, 139, 0.15)', text: colors.text.tertiary },
  pending: { label: 'PENDING', bg: 'rgba(251, 191, 36, 0.15)', text: colors.neon.yellow },
};

const REACTION_CONFIG: Record<
  ReactionType,
  { icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap; color: string; label: string }
> = {
  like: { icon: 'heart-outline', activeIcon: 'heart', color: colors.neon.pink, label: 'Like' },
  fire: { icon: 'flame-outline', activeIcon: 'flame', color: colors.neon.orange, label: 'Fire' },
  hundred: { icon: 'trophy-outline', activeIcon: 'trophy', color: colors.neon.yellow, label: '100' },
  chart_up: { icon: 'trending-up-outline', activeIcon: 'trending-up', color: colors.neon.green, label: 'Bullish' },
};

const STRATEGY_FILTERS = [
  'All Strategies',
  'Iron Condor',
  'Vertical Spread',
  'Credit Spread',
  'Debit Spread',
  'Calendar Spread',
  'Butterfly',
  'Covered Call',
  'Cash-Secured Put',
  'Straddle',
  'Strangle',
  'Long Call',
  'Long Put',
  'Bull Call Spread',
  'Other',
];

const FEED_TABS: { key: FeedFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'all', label: 'All', icon: 'globe-outline' },
  { key: 'following', label: 'Following', icon: 'people-outline' },
  { key: 'top', label: 'Top Trades', icon: 'trophy-outline' },
  { key: 'mine', label: 'My Trades', icon: 'person-outline' },
];

const SORT_OPTIONS: { key: SortMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'recent', label: 'Most Recent', icon: 'time-outline' },
  { key: 'popular', label: 'Most Liked', icon: 'heart-outline' },
  { key: 'profit', label: 'Top P&L', icon: 'trending-up-outline' },
  { key: 'discussed', label: 'Most Discussed', icon: 'chatbubbles-outline' },
];

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_TRADES: SharedTrade[] = [
  {
    id: '1',
    user_id: 'u1',
    user_display_name: 'IronCondorKing',
    avatar_color: colors.neon.cyan,
    avatar_animal: 'owl',
    reputation_tier: 'veteran',
    tribe: 'theta-gang',
    ticker: 'SPY',
    strategy: 'Iron Condor',
    direction: 'short',
    entry_price: 4.5,
    exit_price: 2.05,
    pnl: 245,
    pnl_percent: 54.4,
    status: 'closed',
    show_pnl: true,
    show_prices: true,
    caption:
      'Collected premium on both sides. Stayed patient and let theta do the work. Closed at 55% max profit.',
    tags: ['theta-gang', 'high-probability', 'SPY'],
    like_count: 12,
    comment_count: 5,
    view_count: 87,
    user_liked: false,
    user_reaction: null,
    shared_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    trade_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    user_id: 'u2',
    user_display_name: 'ThetaGang_OG',
    avatar_color: colors.neon.green,
    avatar_animal: 'fox',
    reputation_tier: 'elite',
    tribe: 'income',
    ticker: 'AAPL',
    strategy: 'Covered Call',
    direction: 'long',
    entry_price: 3.2,
    exit_price: null,
    pnl: null,
    pnl_percent: null,
    status: 'open',
    show_pnl: true,
    show_prices: true,
    caption:
      'Selling the 195 call against my AAPL shares. 30 DTE, sitting at about 0.25 delta. Letting it ride.',
    tags: ['covered-call', 'income', 'AAPL'],
    like_count: 8,
    comment_count: 4,
    view_count: 142,
    user_liked: true,
    user_reaction: 'like',
    shared_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    trade_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    user_id: 'u3',
    user_display_name: 'SpreadMaster42',
    avatar_color: colors.neon.orange,
    avatar_animal: 'cheetah',
    reputation_tier: 'active',
    tribe: null,
    ticker: 'TSLA',
    strategy: 'Bull Call Spread',
    direction: 'long',
    entry_price: 5.8,
    exit_price: 4.6,
    pnl: -120,
    pnl_percent: -20.7,
    status: 'closed',
    show_pnl: true,
    show_prices: true,
    caption:
      'Tried to catch the bounce but TSLA had other plans. Stop loss saved me from a bigger hit. On to the next one.',
    tags: ['debit-spread', 'TSLA', 'lesson-learned'],
    like_count: 3,
    comment_count: 7,
    view_count: 63,
    user_liked: false,
    user_reaction: null,
    shared_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    trade_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    user_id: 'u4',
    user_display_name: 'DeltaForce',
    avatar_color: colors.neon.purple,
    avatar_animal: 'eagle',
    reputation_tier: 'legend',
    tribe: 'volatility',
    ticker: 'NVDA',
    strategy: 'Straddle',
    direction: 'long',
    entry_price: 12.4,
    exit_price: null,
    pnl: null,
    pnl_percent: null,
    status: 'pending',
    show_pnl: true,
    show_prices: true,
    caption:
      'Earnings play. IV is elevated but I think the move will exceed the expected. Positioned for a big swing either way.',
    tags: ['earnings', 'volatility', 'NVDA', 'straddle'],
    like_count: 15,
    comment_count: 9,
    view_count: 210,
    user_liked: false,
    user_reaction: null,
    shared_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    trade_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    user_id: 'u5',
    user_display_name: 'VolCrusher',
    avatar_color: colors.neon.pink,
    avatar_animal: 'tiger',
    reputation_tier: 'veteran',
    tribe: 'wheel',
    ticker: 'MSFT',
    strategy: 'Cash-Secured Put',
    direction: 'short',
    entry_price: 2.75,
    exit_price: 0.3,
    pnl: 180,
    pnl_percent: 89.1,
    status: 'closed',
    show_pnl: true,
    show_prices: true,
    caption:
      'Sold the put at a price I wanted to own MSFT at anyway. Premium expired nearly worthless.',
    tags: ['cash-secured-put', 'wheel', 'MSFT', 'income'],
    like_count: 6,
    comment_count: 2,
    view_count: 118,
    user_liked: true,
    user_reaction: 'fire',
    shared_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    trade_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_COMMENTS: TradeComment[] = [
  {
    id: 'c1',
    trade_id: '1',
    user_id: 'u2',
    user_display_name: 'ThetaGang_OG',
    comment_text: 'Great execution! What delta did you use on the short strikes?',
    parent_comment_id: null,
    like_count: 3,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    user_liked: false,
  },
  {
    id: 'c2',
    trade_id: '1',
    user_id: 'u1',
    user_display_name: 'IronCondorKing',
    comment_text: '16 delta on both sides. Kept it wide to manage risk.',
    parent_comment_id: 'c1',
    like_count: 1,
    created_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    user_liked: false,
  },
  {
    id: 'c3',
    trade_id: '1',
    user_id: 'u3',
    user_display_name: 'SpreadMaster42',
    comment_text: 'Theta gang for life. What DTE did you open at?',
    parent_comment_id: null,
    like_count: 0,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user_liked: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string | null): string {
  if (!name) return '??';
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
  return `${prefix}$${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function getReputationTier(totalTrades: number, winRate: number): ReputationTier {
  if (totalTrades >= 100 && winRate >= 0.65) return 'legend';
  if (totalTrades >= 50 && winRate >= 0.6) return 'elite';
  if (totalTrades >= 25 && winRate >= 0.5) return 'veteran';
  if (totalTrades >= 5) return 'active';
  return 'newcomer';
}

function pickTradeOfTheWeek(trades: SharedTrade[]): SharedTrade | null {
  if (trades.length === 0) return null;
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentTrades = trades.filter(
    (t) => new Date(t.shared_at).getTime() > oneWeekAgo,
  );
  const pool = recentTrades.length > 0 ? recentTrades : trades.slice(0, 20);

  let best: SharedTrade | null = null;
  let bestScore = -Infinity;
  for (const trade of pool) {
    let score =
      trade.like_count * 3 + trade.comment_count * 5 + trade.view_count * 0.5;
    if (trade.show_pnl && trade.pnl_percent !== null && trade.pnl_percent > 0) {
      score += Math.min(trade.pnl_percent, 200) * 0.5;
    }
    if (score > bestScore) {
      bestScore = score;
      best = trade;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Reputation badge inline */
const ReputationBadge: React.FC<{ tier: ReputationTier; compact?: boolean }> = React.memo(
  ({ tier, compact }) => {
    const badge = REPUTATION_BADGES[tier];
    return (
      <View style={[styles.reputationBadge, { backgroundColor: `${badge.color}20` }]}>
        <Ionicons name={badge.icon} size={compact ? 8 : 10} color={badge.color} />
        {!compact && (
          <Text style={[styles.reputationText, { color: badge.color }]}>
            {badge.label}
          </Text>
        )}
      </View>
    );
  },
);

/** Follow / Unfollow button */
const FollowButton: React.FC<{
  isFollowing: boolean;
  onToggle: () => void;
  compact?: boolean;
}> = React.memo(({ isFollowing, onToggle, compact }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onToggle}
    style={[
      styles.followBtn,
      isFollowing ? styles.followBtnActive : styles.followBtnInactive,
      compact && { paddingHorizontal: 8, paddingVertical: 4 },
    ]}
  >
    <Ionicons
      name={isFollowing ? 'person-remove-outline' : 'person-add-outline'}
      size={compact ? 12 : 14}
      color={isFollowing ? colors.success : colors.text.tertiary}
    />
    {!compact && (
      <Text
        style={[
          styles.followBtnText,
          { color: isFollowing ? colors.success : colors.text.tertiary },
        ]}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Text>
    )}
  </TouchableOpacity>
));

/** Feed filter tab row */
const FeedFilterTabs: React.FC<{
  active: FeedFilter;
  onChange: (f: FeedFilter) => void;
  followingCount: number;
}> = React.memo(({ active, onChange, followingCount }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.chipRow}
  >
    {FEED_TABS.map((tab) => {
      const isActive = active === tab.key;
      const label =
        tab.key === 'following' ? `Following (${followingCount})` : tab.label;
      return (
        <TouchableOpacity
          key={tab.key}
          activeOpacity={0.7}
          onPress={() => onChange(tab.key)}
          style={[styles.chip, isActive && styles.chipActive]}
        >
          <Ionicons
            name={tab.icon}
            size={14}
            color={isActive ? colors.background.primary : colors.neon.green}
            style={styles.chipIcon}
          />
          <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
));

/** Sort + Strategy filter bar */
const SortBar: React.FC<{
  sortMode: SortMode;
  onSortChange: (s: SortMode) => void;
  strategyFilter: string;
  onStrategyChange: (s: string) => void;
}> = React.memo(({ sortMode, onSortChange, strategyFilter, onStrategyChange }) => {
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [showStrategyPicker, setShowStrategyPicker] = useState(false);

  const currentSort = SORT_OPTIONS.find((o) => o.key === sortMode);

  return (
    <View style={styles.sortBarContainer}>
      <View style={styles.sortRow}>
        {/* Sort dropdown */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setShowSortPicker(!showSortPicker);
            setShowStrategyPicker(false);
          }}
          style={[styles.sortPill, showSortPicker && styles.sortPillActive]}
        >
          <Ionicons
            name="swap-vertical-outline"
            size={12}
            color={colors.text.tertiary}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[styles.sortPillText, showSortPicker && styles.sortPillTextActive]}
            numberOfLines={1}
          >
            {currentSort?.label || 'Sort'}
          </Text>
          <Ionicons
            name={showSortPicker ? 'chevron-up' : 'chevron-down'}
            size={12}
            color={colors.text.tertiary}
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>

        {/* Strategy dropdown */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setShowStrategyPicker(!showStrategyPicker);
            setShowSortPicker(false);
          }}
          style={[
            styles.strategyFilterBtn,
            strategyFilter !== 'All Strategies' && styles.strategyFilterBtnActive,
          ]}
        >
          <Ionicons
            name="funnel-outline"
            size={12}
            color={
              strategyFilter !== 'All Strategies'
                ? colors.neon.green
                : colors.text.tertiary
            }
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

      {/* Sort dropdown list */}
      {showSortPicker && (
        <View style={styles.strategyDropdown}>
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortMode === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                activeOpacity={0.7}
                onPress={() => {
                  onSortChange(opt.key);
                  setShowSortPicker(false);
                }}
                style={[styles.strategyOption, isActive && styles.strategyOptionActive]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons
                    name={opt.icon}
                    size={14}
                    color={isActive ? colors.neon.green : colors.text.secondary}
                  />
                  <Text
                    style={[
                      styles.strategyOptionText,
                      isActive && styles.strategyOptionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </View>
                {isActive && (
                  <Ionicons name="checkmark" size={16} color={colors.neon.green} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Strategy dropdown list */}
      {showStrategyPicker && (
        <View style={[styles.strategyDropdown, { maxHeight: 280 }]}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
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
                  style={[
                    styles.strategyOption,
                    isActive && styles.strategyOptionActive,
                  ]}
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
          </ScrollView>
        </View>
      )}
    </View>
  );
});

/** Reaction button row (like, fire, 100, chart_up) */
const ReactionBar: React.FC<{
  trade: SharedTrade;
  onReact: (tradeId: string, reaction: ReactionType) => void;
  onComment: () => void;
  onShare: () => void;
  disabled: boolean;
}> = React.memo(({ trade, onReact, onComment, onShare, disabled }) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <View style={styles.interactionBar}>
      {/* Primary like + expanded reactions */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onReact(trade.id, 'like')}
          onLongPress={() => setShowReactions(!showReactions)}
          style={styles.interactionBtn}
          disabled={disabled}
        >
          <Ionicons
            name={trade.user_liked ? 'heart' : 'heart-outline'}
            size={18}
            color={trade.user_liked ? colors.neon.pink : colors.text.tertiary}
          />
          <Text
            style={[
              styles.interactionCount,
              trade.user_liked && { color: colors.neon.pink },
            ]}
          >
            {trade.like_count}
          </Text>
        </TouchableOpacity>

        {/* Expanded reaction picker */}
        {showReactions && (
          <View style={styles.reactionPicker}>
            {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((reaction) => {
              const config = REACTION_CONFIG[reaction];
              const isActive = trade.user_reaction === reaction;
              return (
                <TouchableOpacity
                  key={reaction}
                  activeOpacity={0.6}
                  onPress={() => {
                    onReact(trade.id, reaction);
                    setShowReactions(false);
                  }}
                  style={[
                    styles.reactionPickerItem,
                    isActive && { backgroundColor: config.color + '25' },
                  ]}
                >
                  <Ionicons
                    name={isActive ? config.activeIcon : config.icon}
                    size={16}
                    color={config.color}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Comment */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onComment}
        style={styles.interactionBtn}
      >
        <Ionicons name="chatbubble-outline" size={16} color={colors.text.tertiary} />
        <Text style={styles.interactionCount}>{trade.comment_count}</Text>
      </TouchableOpacity>

      {/* Views */}
      <View style={styles.interactionBtn}>
        <Ionicons name="eye-outline" size={16} color={colors.text.tertiary} />
        <Text style={styles.interactionCount}>{trade.view_count}</Text>
      </View>

      {/* Share */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onShare}
        style={[styles.interactionBtn, { marginLeft: 'auto' }]}
      >
        <Ionicons name="share-outline" size={16} color={colors.text.tertiary} />
      </TouchableOpacity>
    </View>
  );
});

/** Trade of the Week highlight card */
const TradeOfTheWeekCard: React.FC<{
  trade: SharedTrade;
  onPress: () => void;
}> = React.memo(({ trade, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <GlassCard
      style={styles.totwCard}
      withGlow
      glowColor={colors.neon.yellow}
    >
      <View style={styles.totwHeader}>
        <Ionicons name="trophy" size={16} color={colors.neon.yellow} />
        <Text style={styles.totwLabel}>TRADE OF THE WEEK</Text>
      </View>

      <View style={styles.totwBody}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={styles.totwTicker}>{trade.ticker}</Text>
            <View style={styles.totwStrategyBadge}>
              <Text style={styles.totwStrategyText}>{trade.strategy}</Text>
            </View>
          </View>
          <Text style={styles.totwUser} numberOfLines={1}>
            {trade.user_display_name || 'Student'}
          </Text>
          {trade.caption ? (
            <Text style={styles.totwCaption} numberOfLines={2}>
              {trade.caption}
            </Text>
          ) : null}
        </View>

        {trade.show_pnl && trade.pnl !== null && (
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={[
                styles.totwPnl,
                { color: trade.pnl >= 0 ? colors.success : colors.error },
              ]}
            >
              {formatPnl(trade.pnl)}
            </Text>
            {trade.pnl_percent !== null && (
              <Text
                style={[
                  styles.totwPercent,
                  {
                    color:
                      trade.pnl_percent >= 0
                        ? colors.success + 'AA'
                        : colors.error + 'AA',
                  },
                ]}
              >
                {trade.pnl_percent >= 0 ? '+' : ''}
                {trade.pnl_percent.toFixed(1)}%
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.totwFooter}>
        <View style={styles.totwStat}>
          <Ionicons name="heart" size={12} color={colors.neon.pink} />
          <Text style={styles.totwStatText}>{trade.like_count}</Text>
        </View>
        <View style={styles.totwStat}>
          <Ionicons name="chatbubble-outline" size={12} color={colors.text.muted} />
          <Text style={styles.totwStatText}>{trade.comment_count}</Text>
        </View>
        <View style={styles.totwStat}>
          <Ionicons name="eye-outline" size={12} color={colors.text.muted} />
          <Text style={styles.totwStatText}>{trade.view_count}</Text>
        </View>
        <Text style={styles.totwTapHint}>Tap to view</Text>
      </View>
    </GlassCard>
  </TouchableOpacity>
));

/** Empty state illustration */
const EmptyState: React.FC<{ filter: FeedFilter }> = ({ filter }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconCircle}>
      <Ionicons name="newspaper-outline" size={48} color={colors.text.muted} />
    </View>
    <Text style={styles.emptyTitle}>
      {filter === 'following'
        ? 'No trades from people you follow'
        : filter === 'mine'
        ? 'You have not shared any trades yet'
        : 'No trades shared yet'}
    </Text>
    <Text style={styles.emptySubtitle}>
      {filter === 'following'
        ? 'Follow traders to see their activity here.'
        : 'Be the first to share a trade idea with the community.'}
    </Text>
  </View>
);

/** Single comment row */
const CommentRow: React.FC<{
  comment: TradeComment;
  tradeUserId: string;
  currentUserId: string | undefined;
  isReply: boolean;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  onDelete: (commentId: string) => void;
}> = React.memo(
  ({ comment, tradeUserId, currentUserId, isReply, onLike, onReply, onDelete }) => {
    const isOP = comment.user_id === tradeUserId;
    const isOwn = comment.user_id === currentUserId;
    const displayName = comment.user_display_name || 'Student';

    return (
      <View style={[styles.commentRow, isReply && styles.commentReplyIndent]}>
        <View style={styles.commentContent}>
          {/* Avatar */}
          <View
            style={[
              styles.commentAvatar,
              {
                backgroundColor: isOP
                  ? colors.neon.yellow + '20'
                  : colors.neon.green + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.commentAvatarText,
                { color: isOP ? colors.neon.yellow : colors.neon.green },
              ]}
            >
              {(displayName).charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            {/* Name + OP badge + time */}
            <View style={styles.commentNameRow}>
              <Text style={styles.commentDisplayName}>{displayName}</Text>
              {isOP && (
                <View style={styles.opBadge}>
                  <Text style={styles.opBadgeText}>OP</Text>
                </View>
              )}
              <Text style={styles.commentTime}>
                {formatRelativeTime(comment.created_at)}
              </Text>
              {comment.updated_at &&
                comment.updated_at !== comment.created_at && (
                  <Text style={styles.commentEdited}>(edited)</Text>
                )}
            </View>

            {/* Comment text */}
            <Text style={styles.commentText}>{comment.comment_text}</Text>

            {/* Comment actions */}
            <View style={styles.commentActions}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onLike(comment.id)}
                style={styles.commentActionBtn}
              >
                <Ionicons
                  name={comment.user_liked ? 'thumbs-up' : 'thumbs-up-outline'}
                  size={12}
                  color={
                    comment.user_liked ? colors.neon.green : colors.text.muted
                  }
                />
                {comment.like_count > 0 && (
                  <Text
                    style={[
                      styles.commentActionText,
                      comment.user_liked && { color: colors.neon.green },
                    ]}
                  >
                    {comment.like_count}
                  </Text>
                )}
              </TouchableOpacity>

              {!isReply && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onReply(comment.id)}
                  style={styles.commentActionBtn}
                >
                  <Ionicons
                    name="return-down-forward-outline"
                    size={12}
                    color={colors.text.muted}
                  />
                  <Text style={styles.commentActionText}>Reply</Text>
                </TouchableOpacity>
              )}

              {isOwn && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onDelete(comment.id)}
                  style={styles.commentActionBtn}
                >
                  <Ionicons
                    name="trash-outline"
                    size={12}
                    color={colors.text.muted}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  },
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const SocialFeedScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    following,
    toggleFollow,
    isFollowing,
    getFollowerCount,
    loadFollowerCounts,
    followingCount,
  } = useFollows();

  // Feed state
  const [trades, setTrades] = useState<SharedTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [strategyFilter, setStrategyFilter] = useState('All Strategies');
  const [showTradeOfWeek, setShowTradeOfWeek] = useState(true);

  // Detail modal state
  const [selectedTrade, setSelectedTrade] = useState<SharedTrade | null>(null);
  const [comments, setComments] = useState<TradeComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  // Share modal state
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareModalTrade, setShareModalTrade] = useState<ShareTradeData>({
    ticker: '',
    pnl: 0,
    strategy: '',
    date: '',
  });

  // --------------------------------------------------
  // Data loading
  // --------------------------------------------------

  const loadTrades = useCallback(
    async (append = false) => {
      if (!isSupabaseConfigured()) {
        setTrades(MOCK_TRADES);
        setLoading(false);
        setHasMore(false);
        return;
      }

      try {
        if (!append) setLoading(true);

        let query = supabase
          .from('shared_trades')
          .select('*')
          .order('shared_at', { ascending: false })
          .limit(PAGE_SIZE);

        if (append && trades.length > 0) {
          const lastDate = trades[trades.length - 1].shared_at;
          query = query.lt('shared_at', lastDate);
        }

        if (feedFilter === 'mine' && user) {
          query = query.eq('user_id', user.id);
        }

        if (strategyFilter !== 'All Strategies') {
          query = query.eq('strategy', strategyFilter);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Enrich with user_liked status
        const enriched: SharedTrade[] = await Promise.all(
          (data || []).map(async (trade: any) => {
            let userLiked = false;
            let userReaction: ReactionType | null = null;
            if (user) {
              const { data: likeData } = await supabase
                .from('trade_likes')
                .select('id, reaction_type')
                .eq('trade_id', trade.id)
                .eq('user_id', user.id)
                .maybeSingle();
              userLiked = !!likeData;
              userReaction = likeData?.reaction_type || null;
            }
            return {
              ...trade,
              user_liked: userLiked,
              user_reaction: userReaction,
              avatar_color: colors.neon.cyan,
              avatar_animal: null,
              reputation_tier: 'active' as ReputationTier,
              tribe: null,
              show_pnl: trade.show_pnl ?? true,
              show_prices: trade.show_prices ?? true,
              tags: trade.tags || [],
            } as SharedTrade;
          }),
        );

        if (append) {
          setTrades((prev) => [...prev, ...enriched]);
        } else {
          setTrades(enriched);
        }
        setHasMore((data || []).length >= PAGE_SIZE);

        // Load follower counts for unique user IDs
        const uniqueUserIds = [
          ...new Set((enriched || []).map((t) => t.user_id)),
        ];
        if (uniqueUserIds.length > 0) {
          loadFollowerCounts(uniqueUserIds);
        }
      } catch (error) {
        console.error('Error loading trades:', error);
        if (!append) setTrades(MOCK_TRADES);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [feedFilter, strategyFilter, user, trades.length, loadFollowerCounts],
  );

  const loadComments = useCallback(
    async (tradeId: string) => {
      if (!isSupabaseConfigured()) {
        // Return mock comments for the selected trade
        setComments(MOCK_COMMENTS.filter((c) => c.trade_id === tradeId));
        return;
      }

      setCommentsLoading(true);
      try {
        const { data, error } = await supabase
          .from('trade_comments')
          .select('*')
          .eq('trade_id', tradeId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        let enriched = (data || []) as TradeComment[];

        // Check which comments the current user liked
        if (user && enriched.length > 0) {
          const commentIds = enriched.map((c) => c.id);
          const { data: likedData } = await supabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', user.id)
            .in('comment_id', commentIds);

          const likedSet = new Set(
            (likedData || []).map((l: any) => l.comment_id),
          );
          enriched = enriched.map((c) => ({
            ...c,
            user_liked: likedSet.has(c.id),
          }));
        }

        setComments(enriched);
        setCommentError(null);
      } catch (error) {
        console.error('Error loading comments:', error);
        setCommentError('Failed to load comments.');
      } finally {
        setCommentsLoading(false);
      }
    },
    [user],
  );

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------

  const handleReaction = useCallback(
    async (tradeId: string, reaction: ReactionType) => {
      if (!user) return;

      // Optimistic update
      setTrades((prev) =>
        prev.map((t) => {
          if (t.id !== tradeId) return t;
          const wasLiked = t.user_liked;
          const sameReaction = t.user_reaction === reaction;
          const nowLiked = sameReaction ? !wasLiked : true;
          return {
            ...t,
            user_liked: nowLiked,
            user_reaction: nowLiked ? reaction : null,
            like_count: nowLiked
              ? wasLiked
                ? t.like_count
                : t.like_count + 1
              : t.like_count - 1,
          };
        }),
      );

      if (!isSupabaseConfigured()) return;

      try {
        const trade = trades.find((t) => t.id === tradeId);
        if (!trade) return;

        if (trade.user_liked && trade.user_reaction === reaction) {
          // Unlike
          await supabase
            .from('trade_likes')
            .delete()
            .eq('trade_id', tradeId)
            .eq('user_id', user.id);
        } else {
          // Upsert like with reaction type
          await supabase.from('trade_likes').upsert(
            {
              trade_id: tradeId,
              user_id: user.id,
              reaction_type: reaction,
            },
            { onConflict: 'trade_id,user_id' },
          );
        }
      } catch (error) {
        console.error('Error toggling reaction:', error);
        // Revert on failure
        loadTrades();
      }
    },
    [trades, user, loadTrades],
  );

  const handlePostComment = useCallback(
    async (tradeId: string, parentId?: string) => {
      const text = parentId ? replyText : newComment;
      if (!user || !text.trim()) return;

      try {
        if (isSupabaseConfigured()) {
          const insertData: Record<string, unknown> = {
            trade_id: tradeId,
            user_id: user.id,
            user_display_name: user.displayName || user.email?.split('@')[0] || 'Student',
            comment_text: text.trim(),
          };
          if (parentId) {
            insertData.parent_comment_id = parentId;
          }

          await supabase.from('trade_comments').insert(insertData);
        } else {
          // Mock mode: add comment locally
          const mockComment: TradeComment = {
            id: `mock-${Date.now()}`,
            trade_id: tradeId,
            user_id: user.id,
            user_display_name: user.displayName || 'You',
            comment_text: text.trim(),
            parent_comment_id: parentId || null,
            like_count: 0,
            created_at: new Date().toISOString(),
            user_liked: false,
          };
          setComments((prev) => [...prev, mockComment]);
          // Update comment count in trade list
          setTrades((prev) =>
            prev.map((t) =>
              t.id === tradeId
                ? { ...t, comment_count: t.comment_count + 1 }
                : t,
            ),
          );
        }

        if (parentId) {
          setReplyText('');
          setReplyingTo(null);
        } else {
          setNewComment('');
        }

        if (isSupabaseConfigured()) {
          loadComments(tradeId);
          loadTrades();
        }
      } catch (error) {
        console.error('Error posting comment:', error);
        setCommentError('Failed to post comment. Please try again.');
      }
    },
    [newComment, replyText, user, loadComments, loadTrades],
  );

  const handleLikeComment = useCallback(
    async (commentId: string) => {
      if (!user) return;

      // Optimistic update
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          const nowLiked = !c.user_liked;
          return {
            ...c,
            user_liked: nowLiked,
            like_count: nowLiked ? c.like_count + 1 : c.like_count - 1,
          };
        }),
      );

      if (!isSupabaseConfigured()) return;

      try {
        const comment = comments.find((c) => c.id === commentId);
        if (!comment) return;

        if (comment.user_liked) {
          await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('comment_likes')
            .insert({ comment_id: commentId, user_id: user.id });
        }
      } catch (error) {
        console.error('Error toggling comment like:', error);
      }
    },
    [user, comments],
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      if (!user || !selectedTrade) return;

      // Optimistic remove
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setTrades((prev) =>
        prev.map((t) =>
          t.id === selectedTrade.id
            ? { ...t, comment_count: Math.max(0, t.comment_count - 1) }
            : t,
        ),
      );

      if (!isSupabaseConfigured()) return;

      try {
        await supabase
          .from('trade_comments')
          .delete()
          .eq('id', commentId)
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    },
    [user, selectedTrade],
  );

  const openTradeDetails = useCallback(
    (trade: SharedTrade) => {
      setSelectedTrade(trade);
      setReplyingTo(null);
      setReplyText('');
      setNewComment('');
      setCommentError(null);
      loadComments(trade.id);

      // Increment view count (fire-and-forget)
      if (isSupabaseConfigured()) {
        supabase
          .rpc('increment_view_count', { trade_id_input: trade.id })
          .then(({ error }) => {
            if (error) {
              supabase
                .from('shared_trades')
                .update({ view_count: (trade.view_count || 0) + 1 })
                .eq('id', trade.id)
                .then();
            }
          });
      }
      // Optimistic update
      setTrades((prev) =>
        prev.map((t) =>
          t.id === trade.id
            ? { ...t, view_count: (t.view_count || 0) + 1 }
            : t,
        ),
      );
    },
    [loadComments],
  );

  const handleShareTrade = useCallback((trade: SharedTrade) => {
    const pnlStr =
      trade.show_pnl && trade.pnl !== null ? formatPnl(trade.pnl) : '';
    const message = [
      `${trade.ticker} | ${trade.strategy}`,
      trade.direction ? `Direction: ${trade.direction.toUpperCase()}` : '',
      pnlStr ? `P&L: ${pnlStr}` : '',
      trade.caption || '',
      '',
      'Shared from Wall Street Wildlife',
    ]
      .filter(Boolean)
      .join('\n');

    Share.share({
      message,
      title: `${trade.ticker} Trade${pnlStr ? ` - ${pnlStr}` : ''}`,
    }).catch(() => {});
  }, []);

  const handleToggleFollow = useCallback(
    (userId: string) => {
      toggleFollow(userId);
    },
    [toggleFollow],
  );

  // --------------------------------------------------
  // Sorting and filtering
  // --------------------------------------------------

  const filteredTrades = useMemo(() => {
    let result = [...trades];

    // Feed filter
    if (feedFilter === 'following') {
      result = result.filter((t) => following.includes(t.user_id));
    } else if (feedFilter === 'mine' && user) {
      result = result.filter((t) => t.user_id === user.id);
    }

    // Strategy filter (backup client-side)
    if (strategyFilter !== 'All Strategies') {
      result = result.filter((t) => t.strategy === strategyFilter);
    }

    // Sort
    switch (sortMode) {
      case 'recent':
        result.sort(
          (a, b) =>
            new Date(b.shared_at).getTime() - new Date(a.shared_at).getTime(),
        );
        break;
      case 'popular':
        result.sort((a, b) => b.like_count - a.like_count);
        break;
      case 'profit':
        result.sort(
          (a, b) =>
            (b.pnl_percent ?? -Infinity) - (a.pnl_percent ?? -Infinity),
        );
        break;
      case 'discussed':
        result.sort((a, b) => b.comment_count - a.comment_count);
        break;
    }

    return result;
  }, [trades, feedFilter, following, user, strategyFilter, sortMode]);

  const tradeOfTheWeek = useMemo(() => pickTradeOfTheWeek(trades), [trades]);

  // --------------------------------------------------
  // Effects
  // --------------------------------------------------

  useEffect(() => {
    loadTrades();
  }, [feedFilter, strategyFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrades();
    setRefreshing(false);
  }, [loadTrades]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      loadTrades(true);
    }
  }, [loadingMore, hasMore, loading, loadTrades]);

  // --------------------------------------------------
  // Render helpers
  // --------------------------------------------------

  const renderTradeCard = useCallback(
    ({ item }: { item: SharedTrade }) => {
      const tradeFollowed = isFollowing(item.user_id);
      const isOwnTrade = user?.id === item.user_id;
      const badge = REPUTATION_BADGES[item.reputation_tier];
      const statusStyle = item.status ? STATUS_STYLES[item.status] : null;

      return (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => openTradeDetails(item)}
        >
          <GlassCard style={styles.tradeCard}>
            {/* Header row: avatar + name + badge + follow + timestamp */}
            <View style={styles.tradeHeader}>
              {item.avatar_animal ? (
                <AnimalAvatar
                  animal={item.avatar_animal}
                  size={40}
                  showBorder={false}
                  style={{ marginRight: spacing.sm }}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: item.avatar_color || colors.neon.cyan },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {getInitials(item.user_display_name)}
                  </Text>
                </View>
              )}

              <View style={styles.tradeHeaderInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.displayName} numberOfLines={1}>
                    {item.user_display_name || 'Student'}
                  </Text>
                  <ReputationBadge tier={item.reputation_tier} />
                  {item.tribe && (
                    <View style={styles.tribeBadge}>
                      <Ionicons
                        name="people-outline"
                        size={8}
                        color={colors.text.muted}
                      />
                      <Text style={styles.tribeBadgeText}>{item.tribe}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.timestamp}>
                  {formatRelativeTime(item.shared_at)}
                </Text>
              </View>

              {/* Follow button + status */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {!isOwnTrade && user && (
                  <FollowButton
                    isFollowing={tradeFollowed}
                    onToggle={() => handleToggleFollow(item.user_id)}
                    compact
                  />
                )}
                {statusStyle && (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.bg },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Trade details row */}
            <View style={styles.tradeDetailsRow}>
              <View style={styles.tickerContainer}>
                <Text style={styles.ticker}>{item.ticker}</Text>
                {item.direction && (
                  <View
                    style={[
                      styles.directionBadge,
                      {
                        backgroundColor:
                          item.direction === 'long'
                            ? 'rgba(57, 255, 20, 0.15)'
                            : 'rgba(255, 7, 58, 0.15)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        item.direction === 'long' ? 'arrow-up' : 'arrow-down'
                      }
                      size={10}
                      color={
                        item.direction === 'long'
                          ? colors.bullish
                          : colors.bearish
                      }
                    />
                    <Text
                      style={[
                        styles.directionText,
                        {
                          color:
                            item.direction === 'long'
                              ? colors.bullish
                              : colors.bearish,
                        },
                      ]}
                    >
                      {item.direction.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.strategyName}>{item.strategy}</Text>
            </View>

            {/* Price / P&L row */}
            {item.show_pnl &&
              (item.entry_price !== null || item.pnl !== null) && (
                <View style={styles.priceRow}>
                  {item.show_prices && item.entry_price !== null && (
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>Entry</Text>
                      <Text style={styles.priceValue}>
                        {formatPrice(item.entry_price)}
                      </Text>
                    </View>
                  )}
                  {item.show_prices && item.exit_price !== null && (
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>Exit</Text>
                      <Text style={styles.priceValue}>
                        {formatPrice(item.exit_price)}
                      </Text>
                    </View>
                  )}
                  {item.pnl !== null && (
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>P&L</Text>
                      <Text
                        style={[
                          styles.pnlValue,
                          {
                            color:
                              item.pnl >= 0 ? colors.success : colors.error,
                          },
                        ]}
                      >
                        {formatPnl(item.pnl)}
                      </Text>
                    </View>
                  )}
                  {item.pnl_percent !== null && (
                    <View style={styles.priceItem}>
                      <Text style={styles.priceLabel}>Return</Text>
                      <Text
                        style={[
                          styles.pnlValue,
                          {
                            color:
                              item.pnl_percent >= 0
                                ? colors.success
                                : colors.error,
                          },
                        ]}
                      >
                        {item.pnl_percent >= 0 ? '+' : ''}
                        {item.pnl_percent.toFixed(1)}%
                      </Text>
                    </View>
                  )}
                </View>
              )}

            {/* Caption */}
            {item.caption && item.caption.length > 0 && (
              <Text style={styles.caption} numberOfLines={3}>
                {item.caption}
              </Text>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Reaction / interaction bar */}
            <ReactionBar
              trade={item}
              onReact={handleReaction}
              onComment={() => openTradeDetails(item)}
              onShare={() => handleShareTrade(item)}
              disabled={!user}
            />
          </GlassCard>
        </TouchableOpacity>
      );
    },
    [
      user,
      isFollowing,
      handleToggleFollow,
      handleReaction,
      openTradeDetails,
      handleShareTrade,
    ],
  );

  const keyExtractor = useCallback((item: SharedTrade) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <FeedFilterTabs
          active={feedFilter}
          onChange={setFeedFilter}
          followingCount={followingCount}
        />
        <SortBar
          sortMode={sortMode}
          onSortChange={setSortMode}
          strategyFilter={strategyFilter}
          onStrategyChange={setStrategyFilter}
        />
        {/* Trade of the Week */}
        {tradeOfTheWeek &&
          showTradeOfWeek &&
          feedFilter === 'all' &&
          strategyFilter === 'All Strategies' && (
            <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.sm }}>
              <TradeOfTheWeekCard
                trade={tradeOfTheWeek}
                onPress={() => openTradeDetails(tradeOfTheWeek)}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowTradeOfWeek(false)}
                style={styles.hideTotwBtn}
              >
                <Text style={styles.hideTotwText}>Hide</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    ),
    [
      feedFilter,
      followingCount,
      sortMode,
      strategyFilter,
      tradeOfTheWeek,
      showTradeOfWeek,
      openTradeDetails,
    ],
  );

  const ListFooter = useMemo(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.neon.green} />
          <Text style={styles.footerLoaderText}>Loading more trades...</Text>
        </View>
      );
    }
    if (!hasMore && filteredTrades.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text style={styles.footerLoaderText}>You have seen all trades</Text>
        </View>
      );
    }
    return null;
  }, [loadingMore, hasMore, filteredTrades.length]);

  // --------------------------------------------------
  // Trade Detail Modal - comment threading
  // --------------------------------------------------

  const renderTradeDetailModal = () => {
    if (!selectedTrade) return null;

    const rootComments = comments.filter((c) => !c.parent_comment_id);
    const replyMap = new Map<string, TradeComment[]>();
    for (const c of comments) {
      if (c.parent_comment_id) {
        const existing = replyMap.get(c.parent_comment_id) || [];
        existing.push(c);
        replyMap.set(c.parent_comment_id, existing);
      }
    }

    const statusStyle = selectedTrade.status
      ? STATUS_STYLES[selectedTrade.status]
      : null;

    return (
      <Modal
        visible={!!selectedTrade}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setSelectedTrade(null)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalKeyboard}
          >
            <View style={styles.modalContent}>
              {/* Modal header */}
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Text style={styles.modalTitle}>
                      {selectedTrade.ticker} - {selectedTrade.strategy}
                    </Text>
                    <ReputationBadge tier={selectedTrade.reputation_tier} compact />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <Text style={styles.modalSubtitle}>
                      {selectedTrade.user_display_name || 'Student'}
                    </Text>
                    {user && user.id !== selectedTrade.user_id && (
                      <FollowButton
                        isFollowing={isFollowing(selectedTrade.user_id)}
                        onToggle={() =>
                          handleToggleFollow(selectedTrade.user_id)
                        }
                        compact
                      />
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedTrade(null)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: spacing.md }}
                showsVerticalScrollIndicator={false}
              >
                {/* P&L / Stats card */}
                {selectedTrade.show_pnl && selectedTrade.pnl !== null && (
                  <View style={styles.modalStatsCard}>
                    <View style={styles.modalStatItem}>
                      <Text style={styles.modalStatLabel}>P&L</Text>
                      <Text
                        style={[
                          styles.modalStatValue,
                          {
                            color:
                              selectedTrade.pnl >= 0
                                ? colors.success
                                : colors.error,
                          },
                        ]}
                      >
                        {formatPnl(selectedTrade.pnl)}
                      </Text>
                    </View>
                    {selectedTrade.pnl_percent !== null && (
                      <View style={styles.modalStatItem}>
                        <Text style={styles.modalStatLabel}>Return</Text>
                        <Text
                          style={[
                            styles.modalStatValue,
                            {
                              color:
                                selectedTrade.pnl_percent >= 0
                                  ? colors.success
                                  : colors.error,
                            },
                          ]}
                        >
                          {selectedTrade.pnl_percent >= 0 ? '+' : ''}
                          {selectedTrade.pnl_percent.toFixed(1)}%
                        </Text>
                      </View>
                    )}
                    {statusStyle && (
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: statusStyle.bg,
                            alignSelf: 'center',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: statusStyle.text },
                          ]}
                        >
                          {statusStyle.label}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Trade details */}
                <View style={styles.modalDetailSection}>
                  {selectedTrade.direction && (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Direction</Text>
                      <Text
                        style={[
                          styles.modalDetailValue,
                          {
                            color:
                              selectedTrade.direction === 'long'
                                ? colors.bullish
                                : colors.bearish,
                          },
                        ]}
                      >
                        {selectedTrade.direction.toUpperCase()}
                      </Text>
                    </View>
                  )}
                  {selectedTrade.show_prices &&
                    selectedTrade.entry_price !== null && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Entry Price</Text>
                        <Text style={styles.modalDetailValue}>
                          {formatPrice(selectedTrade.entry_price)}
                        </Text>
                      </View>
                    )}
                  {selectedTrade.show_prices &&
                    selectedTrade.exit_price !== null && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Exit Price</Text>
                        <Text style={styles.modalDetailValue}>
                          {formatPrice(selectedTrade.exit_price)}
                        </Text>
                      </View>
                    )}
                  {selectedTrade.trade_date && (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Trade Date</Text>
                      <Text style={styles.modalDetailValue}>
                        {new Date(
                          selectedTrade.trade_date,
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Caption */}
                {selectedTrade.caption && (
                  <Text style={styles.modalCaption}>
                    {selectedTrade.caption}
                  </Text>
                )}

                {/* Tags */}
                {selectedTrade.tags && selectedTrade.tags.length > 0 && (
                  <View style={styles.modalTagsRow}>
                    {selectedTrade.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Engagement stats row */}
                <View style={styles.modalEngagement}>
                  <View style={styles.modalEngagementItem}>
                    <Ionicons
                      name="heart"
                      size={14}
                      color={colors.neon.pink}
                    />
                    <Text style={styles.modalEngagementText}>
                      {selectedTrade.like_count} likes
                    </Text>
                  </View>
                  <View style={styles.modalEngagementItem}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={14}
                      color={colors.text.muted}
                    />
                    <Text style={styles.modalEngagementText}>
                      {selectedTrade.comment_count} comments
                    </Text>
                  </View>
                  <View style={styles.modalEngagementItem}>
                    <Ionicons
                      name="eye-outline"
                      size={14}
                      color={colors.text.muted}
                    />
                    <Text style={styles.modalEngagementText}>
                      {selectedTrade.view_count} views
                    </Text>
                  </View>
                </View>

                {/* Comments section */}
                <View style={styles.commentsSection}>
                  <Text style={styles.commentsSectionTitle}>
                    Comments{' '}
                    {comments.length > 0 ? `(${comments.length})` : ''}
                  </Text>

                  {commentsLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.neon.green}
                      style={{ marginVertical: spacing.md }}
                    />
                  ) : comments.length === 0 ? (
                    <Text style={styles.noCommentsText}>
                      No comments yet - be the first to share your thoughts
                    </Text>
                  ) : (
                    rootComments.map((comment) => (
                      <View key={comment.id}>
                        <CommentRow
                          comment={comment}
                          tradeUserId={selectedTrade.user_id}
                          currentUserId={user?.id}
                          isReply={false}
                          onLike={handleLikeComment}
                          onReply={(id) => {
                            setReplyingTo(
                              replyingTo === id ? null : id,
                            );
                            setReplyText('');
                          }}
                          onDelete={handleDeleteComment}
                        />

                        {/* Inline reply input */}
                        {replyingTo === comment.id && (
                          <View style={styles.replyInputRow}>
                            <TextInput
                              value={replyText}
                              onChangeText={setReplyText}
                              placeholder={`Reply to ${comment.user_display_name || 'Student'}...`}
                              placeholderTextColor={colors.text.muted}
                              style={styles.replyInput}
                              autoFocus
                              returnKeyType="send"
                              onSubmitEditing={() =>
                                handlePostComment(
                                  selectedTrade.id,
                                  comment.id,
                                )
                              }
                            />
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() =>
                                handlePostComment(
                                  selectedTrade.id,
                                  comment.id,
                                )
                              }
                              style={styles.replySubmitBtn}
                            >
                              <Ionicons
                                name="send"
                                size={16}
                                color={colors.background.primary}
                              />
                            </TouchableOpacity>
                          </View>
                        )}

                        {/* Nested replies */}
                        {replyMap.get(comment.id)?.map((reply) => (
                          <CommentRow
                            key={reply.id}
                            comment={reply}
                            tradeUserId={selectedTrade.user_id}
                            currentUserId={user?.id}
                            isReply
                            onLike={handleLikeComment}
                            onReply={() => {}}
                            onDelete={handleDeleteComment}
                          />
                        ))}
                      </View>
                    ))
                  )}
                </View>

                {/* Comment error */}
                {commentError && (
                  <Text style={styles.commentErrorText}>{commentError}</Text>
                )}
              </ScrollView>

              {/* New comment input (bottom of modal) */}
              {user && (
                <View style={styles.commentInputRow}>
                  <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Add a comment..."
                    placeholderTextColor={colors.text.muted}
                    style={styles.commentInput}
                    returnKeyType="send"
                    onSubmitEditing={() =>
                      handlePostComment(selectedTrade.id)
                    }
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handlePostComment(selectedTrade.id)}
                    style={[
                      styles.commentSubmitBtn,
                      !newComment.trim() && { opacity: 0.4 },
                    ]}
                    disabled={!newComment.trim()}
                  >
                    <Text style={styles.commentSubmitText}>Post</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };

  // --------------------------------------------------
  // Share modal for native share
  // --------------------------------------------------

  const renderShareModal = () => (
    <ShareTradeModal
      visible={shareModalVisible}
      trade={shareModalTrade}
      onDismiss={() => setShareModalVisible(false)}
    />
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
            <Text style={styles.headerTitle}>Social Feed</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerAction}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text.secondary}
            />
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
            ListEmptyComponent={<EmptyState filter={feedFilter} />}
            ListFooterComponent={ListFooter}
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
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={7}
            removeClippedSubviews
          />
        )}

        {/* Share Trade FAB */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setShareModalTrade({
              ticker: '',
              pnl: 0,
              strategy: '',
              date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            });
            setShareModalVisible(true);
          }}
          style={styles.fab}
        >
          <Ionicons name="add" size={28} color={colors.background.primary} />
        </TouchableOpacity>

        {/* Trade Detail Modal */}
        {renderTradeDetailModal()}

        {/* Share Trade Modal */}
        {renderShareModal()}
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
    paddingBottom: 100,
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
    zIndex: 10,
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
    maxWidth: 160,
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
  tribeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.background.tertiary,
  },
  tribeBadgeText: {
    fontSize: 9,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  timestamp: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: 2,
  },

  // Follow button
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  followBtnActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.12)',
  },
  followBtnInactive: {
    backgroundColor: colors.background.tertiary,
  },
  followBtnText: {
    fontSize: 11,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },

  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
    letterSpacing: 0.5,
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

  // Reaction picker (expanded)
  reactionPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 8,
    gap: 2,
  },
  reactionPickerItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Trade of the Week
  totwCard: {
    borderColor: colors.neon.yellow + '30',
  },
  totwHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  totwLabel: {
    ...typography.styles.overline,
    color: colors.neon.yellow,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  totwBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  totwTicker: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  totwStrategyBadge: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  totwStrategyText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  totwUser: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: 4,
  },
  totwCaption: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    maxWidth: SCREEN_WIDTH * 0.5,
  },
  totwPnl: {
    ...typography.styles.h3,
    fontFamily: typography.fonts.bold,
  },
  totwPercent: {
    ...typography.styles.caption,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },
  totwFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.neon.yellow + '20',
  },
  totwStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totwStatText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  totwTapHint: {
    ...typography.styles.caption,
    color: colors.neon.yellow + '60',
    marginLeft: 'auto',
  },
  hideTotwBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  hideTotwText: {
    ...typography.styles.caption,
    color: colors.text.muted,
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
    paddingVertical: spacing.xxl,
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
    maxWidth: 280,
  },

  // Footer loader
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  footerLoaderText: {
    ...typography.styles.caption,
    color: colors.text.muted,
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

  // -----------------------------------------------
  // Trade Detail Modal
  // -----------------------------------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalKeyboard: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: colors.border.default,
    borderBottomWidth: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.default,
  },
  modalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  modalSubtitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  modalCloseBtn: {
    padding: spacing.xs,
  },

  // Modal stats card
  modalStatsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  modalStatValue: {
    ...typography.styles.h4,
    fontFamily: typography.fonts.bold,
  },

  // Modal detail section
  modalDetailSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  modalDetailLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalDetailValue: {
    ...typography.styles.monoBold,
    color: colors.text.primary,
    fontSize: 13,
  },

  // Modal caption
  modalCaption: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    lineHeight: 22,
  },

  // Modal tags row
  modalTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },

  // Modal engagement
  modalEngagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.light,
  },
  modalEngagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalEngagementText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },

  // -----------------------------------------------
  // Comments
  // -----------------------------------------------
  commentsSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  commentsSectionTitle: {
    ...typography.styles.label,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  noCommentsText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },

  // Individual comment
  commentRow: {
    marginBottom: spacing.sm,
  },
  commentReplyIndent: {
    marginLeft: spacing.xl,
    borderLeftWidth: 2,
    borderLeftColor: colors.border.default,
    paddingLeft: spacing.sm,
  },
  commentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    fontWeight: '700',
  },
  commentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  commentDisplayName: {
    ...typography.styles.labelSm,
    color: colors.text.primary,
  },
  opBadge: {
    backgroundColor: colors.neon.yellow + '20',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
  },
  opBadgeText: {
    fontSize: 8,
    fontFamily: typography.fonts.bold,
    fontWeight: '700',
    color: colors.neon.yellow,
    letterSpacing: 0.5,
  },
  commentTime: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  commentEdited: {
    fontSize: 9,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  commentText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: 4,
  },
  commentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  commentActionText: {
    fontSize: 10,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },

  // Reply input
  replyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.xl + spacing.sm,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  replyInput: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    color: colors.text.primary,
    ...typography.styles.bodySm,
  },
  replySubmitBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Comment input row (bottom of modal)
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.secondary,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    ...typography.styles.bodySm,
  },
  commentSubmitBtn: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  commentSubmitText: {
    ...typography.styles.buttonSm,
    color: colors.background.primary,
  },
  commentErrorText: {
    ...typography.styles.caption,
    color: colors.error,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
});

export default SocialFeedScreen;
