// Watchlist Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GradientText, GlowButton } from '../../components/ui';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  iv: number;
  ivRank: number;
  nextEarnings?: string;
  alerts: number;
}

// Mock watchlist data
const MOCK_WATCHLIST: WatchlistItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 182.52, change: 2.34, changePercent: 1.30, iv: 24.5, ivRank: 35, nextEarnings: '2025-02-06', alerts: 2 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.75, change: -5.20, changePercent: -2.05, iv: 58.2, ivRank: 72, nextEarnings: '2025-01-29', alerts: 1 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: 12.45, changePercent: 2.58, iv: 45.8, ivRank: 58, nextEarnings: '2025-02-19', alerts: 0 },
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 478.32, change: 1.85, changePercent: 0.39, iv: 14.2, ivRank: 22, alerts: 0 },
  { symbol: 'META', name: 'Meta Platforms', price: 395.80, change: 8.42, changePercent: 2.17, iv: 32.6, ivRank: 45, nextEarnings: '2025-02-05', alerts: 1 },
  { symbol: 'AMD', name: 'Advanced Micro', price: 138.45, change: -2.10, changePercent: -1.49, iv: 52.3, ivRank: 65, nextEarnings: '2025-01-30', alerts: 0 },
];

type SortKey = 'symbol' | 'price' | 'change' | 'iv' | 'ivRank';
type ViewMode = 'list' | 'grid';

const WatchlistScreen: React.FC = () => {
  const navigation = useNavigation();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(MOCK_WATCHLIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('symbol');
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  const filteredWatchlist = watchlist
    .filter(item =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'symbol': comparison = a.symbol.localeCompare(b.symbol); break;
        case 'price': comparison = a.price - b.price; break;
        case 'change': comparison = a.changePercent - b.changePercent; break;
        case 'iv': comparison = a.iv - b.iv; break;
        case 'ivRank': comparison = a.ivRank - b.ivRank; break;
      }
      return sortAsc ? comparison : -comparison;
    });

  const handleAddSymbol = () => {
    if (!newSymbol.trim()) return;

    // Check if already in watchlist
    if (watchlist.some(item => item.symbol.toUpperCase() === newSymbol.toUpperCase())) {
      Alert.alert('Already Added', `${newSymbol.toUpperCase()} is already in your watchlist.`);
      return;
    }

    // Add mock data for the new symbol
    const newItem: WatchlistItem = {
      symbol: newSymbol.toUpperCase(),
      name: `${newSymbol.toUpperCase()} Stock`,
      price: Math.random() * 500 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      iv: Math.random() * 60 + 10,
      ivRank: Math.round(Math.random() * 100),
      alerts: 0,
    };

    setWatchlist([...watchlist, newItem]);
    setNewSymbol('');
    setShowAddModal(false);
    Alert.alert('Added', `${newSymbol.toUpperCase()} added to your watchlist.`);
  };

  const handleRemoveSymbol = (symbol: string) => {
    Alert.alert(
      'Remove from Watchlist',
      `Remove ${symbol} from your watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setWatchlist(watchlist.filter(item => item.symbol !== symbol));
          },
        },
      ]
    );
  };

  const getIVRankColor = (rank: number): string => {
    if (rank >= 70) return colors.neon.yellow;
    if (rank >= 40) return colors.neon.cyan;
    return colors.text.secondary;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>Watchlist</GradientText>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search & View Toggle */}
        <View style={styles.controlsRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <Text style={styles.viewIcon}>≡</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
              onPress={() => setViewMode('grid')}
            >
              <Text style={styles.viewIcon}>⊞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sort Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sortScroll}
          contentContainerStyle={styles.sortContent}
        >
          {([
            { key: 'symbol', label: 'Symbol' },
            { key: 'price', label: 'Price' },
            { key: 'change', label: 'Change' },
            { key: 'iv', label: 'IV' },
            { key: 'ivRank', label: 'IV Rank' },
          ] as { key: SortKey; label: string }[]).map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.sortPill, sortKey === opt.key && styles.sortPillActive]}
              onPress={() => {
                if (sortKey === opt.key) {
                  setSortAsc(!sortAsc);
                } else {
                  setSortKey(opt.key);
                  setSortAsc(true);
                }
              }}
            >
              <Text style={[styles.sortPillText, sortKey === opt.key && styles.sortPillTextActive]}>
                {opt.label} {sortKey === opt.key && (sortAsc ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Summary */}
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>{watchlist.length}</Text>
              <Text style={styles.summaryLabel}>Symbols</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>
                {watchlist.filter(w => w.nextEarnings).length}
              </Text>
              <Text style={styles.summaryLabel}>Upcoming Earnings</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>
                {watchlist.reduce((sum, w) => sum + w.alerts, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Active Alerts</Text>
            </View>
          </View>
        </GlassCard>

        {/* Watchlist Items */}
        {viewMode === 'list' ? (
          <View style={styles.listContainer}>
            {filteredWatchlist.map((item) => (
              <TouchableOpacity
                key={item.symbol}
                style={styles.listItem}
                onLongPress={() => handleRemoveSymbol(item.symbol)}
                activeOpacity={0.8}
              >
                <GlassCard style={styles.listCard} noPadding>
                  <View style={styles.listContent}>
                    <View style={styles.listLeft}>
                      <Text style={styles.listSymbol}>{item.symbol}</Text>
                      <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
                    </View>
                    <View style={styles.listCenter}>
                      <View style={styles.ivContainer}>
                        <Text style={styles.ivLabel}>IV</Text>
                        <Text style={styles.ivValue}>{item.iv.toFixed(1)}%</Text>
                      </View>
                      <View style={styles.ivRankContainer}>
                        <Text style={styles.ivRankLabel}>Rank</Text>
                        <Text style={[styles.ivRankValue, { color: getIVRankColor(item.ivRank) }]}>
                          {item.ivRank}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.listRight}>
                      <Text style={styles.listPrice}>${item.price.toFixed(2)}</Text>
                      <View style={[styles.changeBadge, item.change >= 0 ? styles.changePositive : styles.changeNegative]}>
                        <Text style={styles.changeText}>
                          {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </Text>
                      </View>
                    </View>
                    {item.nextEarnings && (
                      <View style={styles.earningsBadge}>
                        <Text style={styles.earningsIcon}>📅</Text>
                      </View>
                    )}
                    {item.alerts > 0 && (
                      <View style={styles.alertBadge}>
                        <Text style={styles.alertCount}>{item.alerts}</Text>
                      </View>
                    )}
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredWatchlist.map((item) => (
              <TouchableOpacity
                key={item.symbol}
                style={styles.gridItem}
                onLongPress={() => handleRemoveSymbol(item.symbol)}
                activeOpacity={0.8}
              >
                <GlassCard style={styles.gridCard}>
                  <Text style={styles.gridSymbol}>{item.symbol}</Text>
                  <Text style={styles.gridPrice}>${item.price.toFixed(2)}</Text>
                  <View style={[styles.gridChange, item.change >= 0 ? styles.changePositive : styles.changeNegative]}>
                    <Text style={styles.gridChangeText}>
                      {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </Text>
                  </View>
                  <View style={styles.gridStats}>
                    <Text style={styles.gridStatText}>IV: {item.iv.toFixed(1)}%</Text>
                    <Text style={[styles.gridStatText, { color: getIVRankColor(item.ivRank) }]}>
                      Rank: {item.ivRank}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {filteredWatchlist.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No matches found' : 'Watchlist is empty'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search' : 'Tap + to add symbols'}
            </Text>
          </View>
        )}

        {/* Tip */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>Long-press any symbol to remove it from your watchlist.</Text>
        </View>
      </ScrollView>

      {/* Add Symbol Modal */}
      {showAddModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <GlassCard style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add to Watchlist</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter symbol (e.g., AAPL)"
                placeholderTextColor={colors.text.muted}
                value={newSymbol}
                onChangeText={setNewSymbol}
                autoCapitalize="characters"
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <GlowButton
                  title="Add"
                  onPress={handleAddSymbol}
                  variant="primary"
                  size="sm"
                />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    ...typography.styles.h4,
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neon.green,
    borderRadius: borderRadius.full,
  },
  addIcon: {
    fontSize: 24,
    color: colors.background.primary,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    ...typography.styles.body,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  viewButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  viewButtonActive: {
    backgroundColor: colors.neon.green,
  },
  viewIcon: {
    fontSize: 18,
    color: colors.text.primary,
  },
  sortScroll: {
    marginBottom: spacing.md,
  },
  sortContent: {
    gap: spacing.sm,
  },
  sortPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  sortPillActive: {
    backgroundColor: colors.overlay.neonGreen,
    borderColor: colors.neon.green,
  },
  sortPillText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  sortPillTextActive: {
    color: colors.neon.green,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.styles.h4,
    color: colors.neon.green,
  },
  summaryLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.glass.border,
  },
  listContainer: {
    gap: spacing.sm,
  },
  listItem: {},
  listCard: {
    position: 'relative',
  },
  listContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  listLeft: {
    flex: 1,
  },
  listSymbol: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  listName: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  listCenter: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.md,
  },
  ivContainer: {
    alignItems: 'center',
  },
  ivLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  ivValue: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  ivRankContainer: {
    alignItems: 'center',
  },
  ivRankLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  ivRankValue: {
    ...typography.styles.label,
  },
  listRight: {
    alignItems: 'flex-end',
  },
  listPrice: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  changeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  changePositive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  changeNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  changeText: {
    ...typography.styles.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  earningsBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
  },
  earningsIcon: {
    fontSize: 12,
  },
  alertBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.neon.yellow,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCount: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
  },
  gridCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  gridSymbol: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  gridPrice: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  gridChange: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  gridChangeText: {
    ...typography.styles.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  gridStats: {
    alignItems: 'center',
    gap: 2,
  },
  gridStatText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.styles.h5,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.overlay.neonCyan,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  tipText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    width: '100%',
  },
  modalCard: {
    padding: spacing.xl,
  },
  modalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalInput: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    ...typography.styles.body,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontSize: typography.sizes.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  modalCancelButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  modalCancelText: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
});

export default WatchlistScreen;
