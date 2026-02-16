// Options Encyclopedia Screen for Wall Street Wildlife Mobile
// Searchable, filterable list of all strategies - FREE feature
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LearnStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius, shadows, getOutlookColor, getTierColor } from '../../theme';
import { strategies } from '../../data/strategies';
import { Strategy } from '../../data/types';
import { TIER_INFO } from '../../data/constants';
import { GlassCard, GradientText } from '../../components/ui';

type NavigationProp = LearnStackScreenProps<'OptionsEncyclopedia'>['navigation'];

const CATEGORIES = ['All', 'Income', 'Directional', 'Volatility', 'Hedging', 'Basic', 'Educational'] as const;
const SENTIMENTS = ['All', 'Bullish', 'Bearish', 'Neutral', 'Volatile'] as const;
const TIERS = ['All', ...TIER_INFO.map(t => `Tier ${t.tier === 0.5 ? '0.5' : t.tier}`)] as const;

type CategoryFilter = typeof CATEGORIES[number];
type SentimentFilter = typeof SENTIMENTS[number];

const OptionsEncyclopediaScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [activeSentiment, setActiveSentiment] = useState<SentimentFilter>('All');
  const [activeTier, setActiveTier] = useState<string>('All');

  const filteredStrategies = useMemo(() => {
    return strategies.filter(s => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.analogy && s.analogy.toLowerCase().includes(q)) ||
          (s.outlook && s.outlook.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (activeCategory !== 'All') {
        const cat = activeCategory.toLowerCase();
        if (!s.category || s.category !== cat) return false;
      }

      // Sentiment filter
      if (activeSentiment !== 'All') {
        if (!s.outlook || !s.outlook.toLowerCase().includes(activeSentiment.toLowerCase())) {
          return false;
        }
      }

      // Tier filter
      if (activeTier !== 'All') {
        const tierNum = parseFloat(activeTier.replace('Tier ', ''));
        if (s.tier !== tierNum) return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory, activeSentiment, activeTier]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('All');
    setActiveSentiment('All');
    setActiveTier('All');
  }, []);

  const hasActiveFilters = searchQuery || activeCategory !== 'All' || activeSentiment !== 'All' || activeTier !== 'All';

  const renderFilterChips = useCallback((
    items: readonly string[],
    active: string,
    onSelect: (val: any) => void,
  ) => (
    <FlatList
      horizontal
      data={items as unknown as string[]}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipScroll}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.chip, active === item && styles.chipActive]}
          onPress={() => onSelect(item)}
        >
          <Text style={[styles.chipText, active === item && styles.chipTextActive]}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  ), []);

  const getTierLabel = (tier: number) => {
    const info = TIER_INFO.find(t => t.tier === tier);
    return info ? info.name : `Tier ${tier}`;
  };

  const renderStrategyCard = useCallback(({ item }: { item: Strategy }) => {
    const tierColor = getTierColor(item.tier);
    const outlookColor = getOutlookColor(item.outlook);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('StrategyDetail', { strategyId: item.id })}
      >
        <View style={styles.cardContent}>
          {/* Top Row: Name + Tier Badge */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardNameContainer}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              {item.analogy && (
                <Text style={styles.cardMetaphor} numberOfLines={1}>{item.analogy}</Text>
              )}
            </View>
            <View style={[styles.tierBadge, { backgroundColor: `${tierColor}20`, borderColor: `${tierColor}40` }]}>
              <Text style={[styles.tierBadgeText, { color: tierColor }]}>
                T{item.tier === 0.5 ? '0.5' : item.tier}
              </Text>
            </View>
          </View>

          {/* Category */}
          {item.category && (
            <Text style={styles.cardCategory}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              {item.tierName ? ` \u00B7 ${item.tierName}` : ''}
            </Text>
          )}

          {/* Profit/Loss Summary */}
          {(item.maxProfit || item.maxLoss) && (
            <View style={styles.profitLossRow}>
              {item.maxProfit && (
                <View style={styles.profitLossItem}>
                  <Ionicons name="trending-up" size={12} color={colors.bullish} />
                  <Text style={styles.profitText}>{item.maxProfit}</Text>
                </View>
              )}
              {item.maxLoss && (
                <View style={styles.profitLossItem}>
                  <Ionicons name="trending-down" size={12} color={colors.bearish} />
                  <Text style={styles.lossText}>{item.maxLoss}</Text>
                </View>
              )}
            </View>
          )}

          {/* Bottom Row: Sentiment + Chevron */}
          <View style={styles.cardBottomRow}>
            <View style={[styles.sentimentBadge, { backgroundColor: `${outlookColor}15` }]}>
              <View style={[styles.sentimentDot, { backgroundColor: outlookColor }]} />
              <Text style={[styles.sentimentText, { color: outlookColor }]}>
                {item.outlook}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);

  const ListHeader = useMemo(() => (
    <View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color={colors.text.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${strategies.length} strategies...`}
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={colors.text.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Sections */}
      <View style={styles.filterSection}>
        <View style={styles.filterLabelRow}>
          <Ionicons name="compass-outline" size={14} color={colors.text.muted} />
          <Text style={styles.filterLabel}>Category</Text>
        </View>
        {renderFilterChips(CATEGORIES, activeCategory, setActiveCategory)}
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterLabelRow}>
          <Ionicons name="pulse-outline" size={14} color={colors.text.muted} />
          <Text style={styles.filterLabel}>Sentiment</Text>
        </View>
        {renderFilterChips(SENTIMENTS, activeSentiment, setActiveSentiment)}
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterLabelRow}>
          <Ionicons name="layers-outline" size={14} color={colors.text.muted} />
          <Text style={styles.filterLabel}>Tier</Text>
        </View>
        {renderFilterChips(TIERS, activeTier, setActiveTier)}
      </View>

      {/* Results count + clear */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsCount}>
          {filteredStrategies.length} {filteredStrategies.length === 1 ? 'strategy' : 'strategies'}
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersButton}>
            <Text style={styles.clearFiltersText}>Reset Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  ), [searchQuery, activeCategory, activeSentiment, activeTier, filteredStrategies.length, hasActiveFilters, renderFilterChips, clearFilters]);

  const ListEmpty = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={colors.text.muted} />
      <Text style={styles.emptyTitle}>No strategies found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
      <TouchableOpacity onPress={clearFilters} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset All Filters</Text>
      </TouchableOpacity>
    </View>
  ), [clearFilters]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <GradientText style={styles.headerTitle}>Options Encyclopedia</GradientText>
          <Text style={styles.headerSubtitle}>
            {strategies.length} strategies mapped and explained
          </Text>
        </View>
      </View>

      <FlatList
        data={filteredStrategies}
        keyExtractor={(item) => item.id}
        renderItem={renderStrategyCard}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.glass.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...typography.styles.h3,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: spacing['2xl'],
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.text.primary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.base,
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterSection: {
    marginBottom: spacing.sm,
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  filterLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },
  chipScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  chipActive: {
    backgroundColor: `${colors.neon.green}15`,
    borderColor: colors.neon.green,
  },
  chipText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontFamily: typography.fonts.medium,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.neon.green,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  resultsCount: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  clearFiltersButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  clearFiltersText: {
    ...typography.styles.caption,
    color: colors.neon.green,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.md,
    gap: spacing.xs + 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardNameContainer: {
    flex: 1,
  },
  cardName: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },
  cardMetaphor: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  tierBadgeText: {
    fontSize: 10,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardCategory: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 11,
  },
  profitLossRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  profitLossItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  profitText: {
    ...typography.styles.caption,
    color: colors.bullish,
    fontSize: 11,
  },
  lossText: {
    ...typography.styles.caption,
    color: colors.bearish,
    fontSize: 11,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  sentimentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sentimentText: {
    fontSize: 10,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.styles.h5,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neon.green,
  },
  resetButtonText: {
    ...typography.styles.caption,
    color: colors.neon.green,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default OptionsEncyclopediaScreen;
