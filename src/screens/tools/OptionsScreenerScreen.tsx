// Options Screener Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GradientText, GlowButton, PremiumModal } from '../../components/ui';
import { useSubscription } from '../../hooks/useSubscription';

type ScreenerType = 'calls' | 'puts' | 'both';
type SortOption = 'iv' | 'volume' | 'oi' | 'premium' | 'delta';

interface FilterState {
  minIV: number;
  maxIV: number;
  minDTE: number;
  maxDTE: number;
  minVolume: number;
  minOI: number;
  moneyness: 'itm' | 'atm' | 'otm' | 'all';
}

interface ScreenerResult {
  symbol: string;
  strike: number;
  expiration: string;
  type: 'call' | 'put';
  iv: number;
  volume: number;
  oi: number;
  premium: number;
  delta: number;
  bid: number;
  ask: number;
}

// Mock screener results
const MOCK_RESULTS: ScreenerResult[] = [
  { symbol: 'AAPL', strike: 180, expiration: '2025-02-21', type: 'call', iv: 32.5, volume: 15420, oi: 45230, premium: 4.85, delta: 0.62, bid: 4.80, ask: 4.90 },
  { symbol: 'TSLA', strike: 250, expiration: '2025-02-28', type: 'call', iv: 58.2, volume: 28340, oi: 82100, premium: 12.40, delta: 0.55, bid: 12.30, ask: 12.50 },
  { symbol: 'NVDA', strike: 500, expiration: '2025-02-21', type: 'call', iv: 45.8, volume: 22150, oi: 67800, premium: 28.75, delta: 0.48, bid: 28.60, ask: 28.90 },
  { symbol: 'SPY', strike: 480, expiration: '2025-02-14', type: 'put', iv: 18.4, volume: 95200, oi: 284500, premium: 3.20, delta: -0.35, bid: 3.18, ask: 3.22 },
  { symbol: 'META', strike: 400, expiration: '2025-03-21', type: 'call', iv: 38.6, volume: 8920, oi: 32100, premium: 22.50, delta: 0.58, bid: 22.40, ask: 22.60 },
  { symbol: 'AMD', strike: 140, expiration: '2025-02-21', type: 'call', iv: 52.3, volume: 18750, oi: 56200, premium: 8.65, delta: 0.52, bid: 8.60, ask: 8.70 },
  { symbol: 'AMZN', strike: 190, expiration: '2025-02-28', type: 'put', iv: 28.9, volume: 12340, oi: 41200, premium: 5.40, delta: -0.38, bid: 5.35, ask: 5.45 },
  { symbol: 'GOOGL', strike: 150, expiration: '2025-02-21', type: 'call', iv: 26.4, volume: 9870, oi: 28500, premium: 6.25, delta: 0.65, bid: 6.20, ask: 6.30 },
];

const OptionsScreenerScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [screenerType, setScreenerType] = useState<ScreenerType>('both');
  const [sortBy, setSortBy] = useState<SortOption>('volume');
  const [sortAsc, setSortAsc] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchSymbol, setSearchSymbol] = useState('');

  const [filters, setFilters] = useState<FilterState>({
    minIV: 0,
    maxIV: 100,
    minDTE: 0,
    maxDTE: 90,
    minVolume: 0,
    minOI: 0,
    moneyness: 'all',
  });

  const filteredResults = MOCK_RESULTS
    .filter(r => {
      if (screenerType !== 'both' && r.type !== (screenerType === 'calls' ? 'call' : 'put')) return false;
      if (searchSymbol && !r.symbol.toLowerCase().includes(searchSymbol.toLowerCase())) return false;
      if (r.iv < filters.minIV || r.iv > filters.maxIV) return false;
      if (r.volume < filters.minVolume) return false;
      if (r.oi < filters.minOI) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'iv': comparison = a.iv - b.iv; break;
        case 'volume': comparison = a.volume - b.volume; break;
        case 'oi': comparison = a.oi - b.oi; break;
        case 'premium': comparison = a.premium - b.premium; break;
        case 'delta': comparison = Math.abs(a.delta) - Math.abs(b.delta); break;
      }
      return sortAsc ? comparison : -comparison;
    });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <GradientText style={styles.headerTitle}>Options Screener</GradientText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.lockedContainer}>
          <Ionicons name="lock-closed" size={64} color={colors.neon.green} />
          <Text style={styles.lockedTitle}>Premium Feature</Text>
          <Text style={styles.lockedMessage}>Unlock this tool with a premium subscription</Text>
          <TouchableOpacity style={styles.unlockButton} onPress={() => setShowPremiumModal(true)}>
            <Text style={styles.unlockButtonText}>Unlock Now</Text>
          </TouchableOpacity>
        </View>
        <PremiumModal visible={showPremiumModal} onClose={() => setShowPremiumModal(false)} featureName="Options Screener" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>Options Screener</GradientText>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search symbol..."
            placeholderTextColor={colors.text.muted}
            value={searchSymbol}
            onChangeText={setSearchSymbol}
            autoCapitalize="characters"
          />
        </View>

        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          {(['calls', 'puts', 'both'] as ScreenerType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, screenerType === type && styles.typeButtonActive]}
              onPress={() => setScreenerType(type)}
            >
              <Text style={[styles.typeButtonText, screenerType === type && styles.typeButtonTextActive]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters Panel */}
        {showFilters && (
          <GlassCard style={styles.filtersCard}>
            <Text style={styles.filtersTitle}>Filters</Text>

            {/* IV Range */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>IV Range: {filters.minIV}% - {filters.maxIV}%</Text>
              <View style={styles.sliderRow}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={filters.minIV}
                  onValueChange={(v) => setFilters(f => ({ ...f, minIV: Math.round(v) }))}
                  minimumTrackTintColor={colors.neon.green}
                  maximumTrackTintColor={colors.background.tertiary}
                  thumbTintColor={colors.neon.green}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={filters.maxIV}
                  onValueChange={(v) => setFilters(f => ({ ...f, maxIV: Math.round(v) }))}
                  minimumTrackTintColor={colors.neon.cyan}
                  maximumTrackTintColor={colors.background.tertiary}
                  thumbTintColor={colors.neon.cyan}
                />
              </View>
            </View>

            {/* Min Volume */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Min Volume: {formatNumber(filters.minVolume)}</Text>
              <Slider
                style={styles.sliderFull}
                minimumValue={0}
                maximumValue={100000}
                step={1000}
                value={filters.minVolume}
                onValueChange={(v) => setFilters(f => ({ ...f, minVolume: v }))}
                minimumTrackTintColor={colors.neon.green}
                maximumTrackTintColor={colors.background.tertiary}
                thumbTintColor={colors.neon.green}
              />
            </View>

            {/* Min OI */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Min Open Interest: {formatNumber(filters.minOI)}</Text>
              <Slider
                style={styles.sliderFull}
                minimumValue={0}
                maximumValue={500000}
                step={5000}
                value={filters.minOI}
                onValueChange={(v) => setFilters(f => ({ ...f, minOI: v }))}
                minimumTrackTintColor={colors.neon.green}
                maximumTrackTintColor={colors.background.tertiary}
                thumbTintColor={colors.neon.green}
              />
            </View>

            {/* Moneyness */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Moneyness</Text>
              <View style={styles.moneynessToggle}>
                {(['all', 'itm', 'atm', 'otm'] as const).map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.moneynessButton, filters.moneyness === m && styles.moneynessButtonActive]}
                    onPress={() => setFilters(f => ({ ...f, moneyness: m }))}
                  >
                    <Text style={[styles.moneynessText, filters.moneyness === m && styles.moneynessTextActive]}>
                      {m.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reset Filters */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => setFilters({ minIV: 0, maxIV: 100, minDTE: 0, maxDTE: 90, minVolume: 0, minOI: 0, moneyness: 'all' })}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortOptions}>
            {([
              { id: 'volume', label: 'Volume' },
              { id: 'oi', label: 'OI' },
              { id: 'iv', label: 'IV' },
              { id: 'premium', label: 'Premium' },
              { id: 'delta', label: 'Delta' },
            ] as { id: SortOption; label: string }[]).map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.sortButton, sortBy === opt.id && styles.sortButtonActive]}
                onPress={() => {
                  if (sortBy === opt.id) {
                    setSortAsc(!sortAsc);
                  } else {
                    setSortBy(opt.id);
                    setSortAsc(false);
                  }
                }}
              >
                <Text style={[styles.sortButtonText, sortBy === opt.id && styles.sortButtonTextActive]}>
                  {opt.label} {sortBy === opt.id && (sortAsc ? '↑' : '↓')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        <Text style={styles.resultsCount}>{filteredResults.length} results</Text>

        {filteredResults.map((result, index) => (
          <GlassCard key={index} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultSymbol}>
                <Text style={styles.resultSymbolText}>{result.symbol}</Text>
                <View style={[styles.typeBadge, result.type === 'call' ? styles.callBadge : styles.putBadge]}>
                  <Text style={styles.typeBadgeText}>{result.type.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.resultStrike}>
                <Text style={styles.resultStrikeText}>${result.strike}</Text>
                <Text style={styles.resultExpText}>{result.expiration}</Text>
              </View>
            </View>

            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>IV</Text>
                <Text style={[styles.resultStatValue, result.iv > 50 && styles.highIV]}>
                  {result.iv.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Volume</Text>
                <Text style={styles.resultStatValue}>{formatNumber(result.volume)}</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>OI</Text>
                <Text style={styles.resultStatValue}>{formatNumber(result.oi)}</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatLabel}>Delta</Text>
                <Text style={styles.resultStatValue}>{result.delta.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.resultPricing}>
              <View style={styles.bidAsk}>
                <Text style={styles.bidAskLabel}>Bid</Text>
                <Text style={styles.bidAskValue}>${result.bid.toFixed(2)}</Text>
              </View>
              <View style={styles.premium}>
                <Text style={styles.premiumValue}>${result.premium.toFixed(2)}</Text>
                <Text style={styles.premiumLabel}>Mid</Text>
              </View>
              <View style={styles.bidAsk}>
                <Text style={styles.bidAskLabel}>Ask</Text>
                <Text style={styles.bidAskValue}>${result.ask.toFixed(2)}</Text>
              </View>
            </View>
          </GlassCard>
        ))}

        {filteredResults.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.text.muted} style={{ marginBottom: spacing.md }} />
            <Text style={styles.emptyTitle}>No Results</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          </View>
        )}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.styles.h4,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    ...typography.styles.body,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  typeButtonActive: {
    backgroundColor: colors.neon.green,
  },
  typeButtonText: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  typeButtonTextActive: {
    color: colors.background.primary,
  },
  filtersCard: {
    marginBottom: spacing.md,
  },
  filtersTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  filterRow: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  sliderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderFull: {
    width: '100%',
    height: 40,
  },
  moneynessToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  moneynessButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  moneynessButtonActive: {
    backgroundColor: colors.overlay.neonGreen,
    borderColor: colors.neon.green,
  },
  moneynessText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  moneynessTextActive: {
    color: colors.neon.green,
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resetButtonText: {
    ...typography.styles.label,
    color: colors.neon.cyan,
  },
  sortContainer: {
    marginBottom: spacing.md,
  },
  sortLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  sortOptions: {
    gap: spacing.sm,
  },
  sortButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  sortButtonActive: {
    backgroundColor: colors.overlay.neonGreen,
    borderColor: colors.neon.green,
  },
  sortButtonText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  sortButtonTextActive: {
    color: colors.neon.green,
  },
  resultsCount: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  resultCard: {
    marginBottom: spacing.sm,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  resultSymbol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultSymbolText: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  callBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  putBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  typeBadgeText: {
    ...typography.styles.caption,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 10,
  },
  resultStrike: {
    alignItems: 'flex-end',
  },
  resultStrikeText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  resultExpText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.sm,
  },
  resultStat: {
    alignItems: 'center',
  },
  resultStatLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  resultStatValue: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  highIV: {
    color: colors.neon.yellow,
  },
  resultPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bidAsk: {
    alignItems: 'center',
  },
  bidAskLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  bidAskValue: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  premium: {
    alignItems: 'center',
    backgroundColor: colors.overlay.neonGreen,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  premiumValue: {
    ...typography.styles.h5,
    color: colors.neon.green,
  },
  premiumLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
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
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  lockedTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  lockedMessage: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  unlockButton: {
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  unlockButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.background.primary,
  },
});

export default OptionsScreenerScreen;
