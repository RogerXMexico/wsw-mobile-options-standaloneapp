// Prediction Scanner Screen
// Browse and filter prediction market events with options data
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { EventHorizonsStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;

type EventType = 'all' | 'earnings' | 'fda' | 'fed' | 'corporate';
type SortOption = 'gap' | 'date' | 'probability' | 'iv';

interface PredictionEvent {
  id: string;
  ticker: string;
  title: string;
  eventType: EventType;
  eventDate: string;
  daysUntil: number;
  probability: number;
  ivRank: number;
  gapScore: number;
  direction: 'bullish' | 'bearish' | 'neutral';
}

// Mock data - in production this would come from Polymarket API
const MOCK_EVENTS: PredictionEvent[] = [
  {
    id: '1',
    ticker: 'NVDA',
    title: 'NVIDIA Q4 Earnings Beat',
    eventType: 'earnings',
    eventDate: '2025-02-26',
    daysUntil: 34,
    probability: 78,
    ivRank: 65,
    gapScore: 13,
    direction: 'bullish',
  },
  {
    id: '2',
    ticker: 'TSLA',
    title: 'Tesla Delivery Beat Q1',
    eventType: 'earnings',
    eventDate: '2025-04-02',
    daysUntil: 69,
    probability: 42,
    ivRank: 82,
    gapScore: -40,
    direction: 'bearish',
  },
  {
    id: '3',
    ticker: 'MRNA',
    title: 'Moderna RSV Vaccine Approval',
    eventType: 'fda',
    eventDate: '2025-03-15',
    daysUntil: 51,
    probability: 68,
    ivRank: 45,
    gapScore: 23,
    direction: 'bullish',
  },
  {
    id: '4',
    ticker: 'SPY',
    title: 'Fed Rate Cut March',
    eventType: 'fed',
    eventDate: '2025-03-19',
    daysUntil: 55,
    probability: 35,
    ivRank: 28,
    gapScore: 7,
    direction: 'neutral',
  },
  {
    id: '5',
    ticker: 'AAPL',
    title: 'Apple Q1 Earnings Beat',
    eventType: 'earnings',
    eventDate: '2025-01-30',
    daysUntil: 7,
    probability: 72,
    ivRank: 55,
    gapScore: 17,
    direction: 'bullish',
  },
  {
    id: '6',
    ticker: 'META',
    title: 'Meta Q4 Revenue Beat',
    eventType: 'earnings',
    eventDate: '2025-02-05',
    daysUntil: 13,
    probability: 85,
    ivRank: 72,
    gapScore: 13,
    direction: 'bullish',
  },
];

const EVENT_TYPE_FILTERS: { key: EventType; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: '🌐' },
  { key: 'earnings', label: 'Earnings', icon: '📈' },
  { key: 'fda', label: 'FDA', icon: '💊' },
  { key: 'fed', label: 'Fed', icon: '🏛️' },
  { key: 'corporate', label: 'Corporate', icon: '🏢' },
];

interface EventCardProps {
  event: PredictionEvent;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const gapColor = event.gapScore > 0 ? colors.bullish : event.gapScore < 0 ? colors.bearish : colors.neutral;
  const directionColor = event.direction === 'bullish' ? colors.bullish : event.direction === 'bearish' ? colors.bearish : colors.neutral;

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.eventHeader}>
        <View style={styles.tickerContainer}>
          <Text style={styles.ticker}>{event.ticker}</Text>
          <View style={[styles.directionBadge, { backgroundColor: `${directionColor}20` }]}>
            <Text style={[styles.directionText, { color: directionColor }]}>
              {event.direction === 'bullish' ? '↑' : event.direction === 'bearish' ? '↓' : '→'}
            </Text>
          </View>
        </View>
        <View style={styles.daysContainer}>
          <Text style={styles.daysValue}>{event.daysUntil}</Text>
          <Text style={styles.daysLabel}>days</Text>
        </View>
      </View>

      <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>

      <View style={styles.eventStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Probability</Text>
          <Text style={[styles.statValue, { color: '#14b8a6' }]}>{event.probability}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>IV Rank</Text>
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>{event.ivRank}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Gap Score</Text>
          <Text style={[styles.statValue, { color: gapColor }]}>
            {event.gapScore > 0 ? '+' : ''}{event.gapScore}
          </Text>
        </View>
      </View>

      {/* Gap Visualization Bar */}
      <View style={styles.gapBarContainer}>
        <View style={styles.gapBarBackground}>
          <View
            style={[
              styles.gapBarFill,
              {
                width: `${Math.min(Math.abs(event.gapScore), 50) * 2}%`,
                backgroundColor: gapColor,
                alignSelf: event.gapScore >= 0 ? 'flex-start' : 'flex-end',
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PredictionScannerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('gap');

  const filteredEvents = useMemo(() => {
    let events = [...MOCK_EVENTS];

    // Filter by type
    if (selectedType !== 'all') {
      events = events.filter((e) => e.eventType === selectedType);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.ticker.toLowerCase().includes(query) ||
          e.title.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'gap':
        events.sort((a, b) => Math.abs(b.gapScore) - Math.abs(a.gapScore));
        break;
      case 'date':
        events.sort((a, b) => a.daysUntil - b.daysUntil);
        break;
      case 'probability':
        events.sort((a, b) => b.probability - a.probability);
        break;
      case 'iv':
        events.sort((a, b) => b.ivRank - a.ivRank);
        break;
    }

    return events;
  }, [searchQuery, selectedType, sortBy]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Prediction Scanner</Text>
          <Text style={styles.headerSubtitle}>Track live events</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ticker or event..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Event Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {EVENT_TYPE_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedType === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedType(filter.key)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                selectedType === filter.key && styles.filterLabelActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {(['gap', 'date', 'probability', 'iv'] as SortOption[]).map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.sortChip, sortBy === option && styles.sortChipActive]}
            onPress={() => setSortBy(option)}
          >
            <Text style={[styles.sortChipText, sortBy === option && styles.sortChipTextActive]}>
              {option === 'gap' ? 'Gap' : option === 'date' ? 'Date' : option === 'probability' ? 'Prob' : 'IV'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No events match your filters</Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate('EventReplay', { eventId: event.id })}
            />
          ))
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
  },
  filtersContainer: {
    maxHeight: 50,
    marginTop: spacing.md,
  },
  filtersContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  filterLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
  },
  filterLabelActive: {
    color: '#8b5cf6',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  sortLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
  },
  sortChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  sortChipActive: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
  },
  sortChipText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.muted,
  },
  sortChipTextActive: {
    color: '#14b8a6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  eventCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ticker: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  directionBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  daysContainer: {
    alignItems: 'center',
  },
  daysValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  daysLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  eventTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
  },
  gapBarContainer: {
    marginTop: spacing.xs,
  },
  gapBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  gapBarFill: {
    height: '100%',
    borderRadius: 2,
    minWidth: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
});

export default PredictionScannerScreen;
