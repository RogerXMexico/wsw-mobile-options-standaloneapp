// Event Horizons - Earnings Calendar Screen
// View upcoming earnings events with expected moves

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearnStackParamList } from '../../navigation/types';
import { colors, typography, spacing, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<LearnStackParamList, 'EarningsCalendar'>;

interface EarningsEvent {
  id: string;
  ticker: string;
  company: string;
  date: string;
  time: 'BMO' | 'AMC'; // Before Market Open / After Market Close
  expectedMove: number;
  impliedVol: number;
  historicalAvgMove: number;
  beatRate: number;
  marketCap: string;
}

const mockEarningsEvents: EarningsEvent[] = [
  {
    id: '1',
    ticker: 'AAPL',
    company: 'Apple Inc.',
    date: '2024-01-25',
    time: 'AMC',
    expectedMove: 4.2,
    impliedVol: 42,
    historicalAvgMove: 3.8,
    beatRate: 78,
    marketCap: '$2.9T',
  },
  {
    id: '2',
    ticker: 'MSFT',
    company: 'Microsoft Corp.',
    date: '2024-01-25',
    time: 'AMC',
    expectedMove: 3.8,
    impliedVol: 38,
    historicalAvgMove: 3.2,
    beatRate: 82,
    marketCap: '$2.8T',
  },
  {
    id: '3',
    ticker: 'TSLA',
    company: 'Tesla Inc.',
    date: '2024-01-26',
    time: 'AMC',
    expectedMove: 8.5,
    impliedVol: 72,
    historicalAvgMove: 9.2,
    beatRate: 65,
    marketCap: '$780B',
  },
  {
    id: '4',
    ticker: 'META',
    company: 'Meta Platforms',
    date: '2024-01-26',
    time: 'AMC',
    expectedMove: 6.2,
    impliedVol: 55,
    historicalAvgMove: 7.1,
    beatRate: 72,
    marketCap: '$1.2T',
  },
  {
    id: '5',
    ticker: 'AMZN',
    company: 'Amazon.com',
    date: '2024-01-30',
    time: 'AMC',
    expectedMove: 5.1,
    impliedVol: 48,
    historicalAvgMove: 5.8,
    beatRate: 75,
    marketCap: '$1.5T',
  },
  {
    id: '6',
    ticker: 'GOOGL',
    company: 'Alphabet Inc.',
    date: '2024-01-30',
    time: 'AMC',
    expectedMove: 4.5,
    impliedVol: 40,
    historicalAvgMove: 4.2,
    beatRate: 80,
    marketCap: '$1.7T',
  },
  {
    id: '7',
    ticker: 'NVDA',
    company: 'NVIDIA Corp.',
    date: '2024-02-01',
    time: 'AMC',
    expectedMove: 9.2,
    impliedVol: 85,
    historicalAvgMove: 8.5,
    beatRate: 88,
    marketCap: '$1.4T',
  },
];

type TimeFilter = 'all' | 'today' | 'this_week' | 'next_week';

const EarningsCalendarScreen: React.FC<Props> = ({ navigation }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this_week');
  const [sortBy, setSortBy] = useState<'date' | 'expectedMove' | 'impliedVol'>('date');

  const sortedEvents = [...mockEarningsEvents].sort((a, b) => {
    if (sortBy === 'date') return a.date.localeCompare(b.date);
    if (sortBy === 'expectedMove') return b.expectedMove - a.expectedMove;
    return b.impliedVol - a.impliedVol;
  });

  const getMoveComparison = (expected: number, historical: number) => {
    const diff = expected - historical;
    if (diff > 0.5) return { label: 'Above Avg', color: colors.neon.orange };
    if (diff < -0.5) return { label: 'Below Avg', color: colors.neon.green };
    return { label: 'Near Avg', color: colors.text.muted };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings Calendar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Time Filters */}
        <View style={styles.filterRow}>
          {(['today', 'this_week', 'next_week', 'all'] as TimeFilter[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, timeFilter === filter && styles.filterChipActive]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text style={[styles.filterText, timeFilter === filter && styles.filterTextActive]}>
                {filter === 'this_week' ? 'This Week' :
                 filter === 'next_week' ? 'Next Week' :
                 filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sort Options */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {(['date', 'expectedMove', 'impliedVol'] as const).map((sort) => (
            <TouchableOpacity
              key={sort}
              style={[styles.sortChip, sortBy === sort && styles.sortChipActive]}
              onPress={() => setSortBy(sort)}
            >
              <Text style={[styles.sortText, sortBy === sort && styles.sortTextActive]}>
                {sort === 'expectedMove' ? 'Move' : sort === 'impliedVol' ? 'IV' : 'Date'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Summary */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.15)', 'rgba(20, 184, 166, 0.15)']}
          style={styles.summaryCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{mockEarningsEvents.length}</Text>
              <Text style={styles.summaryLabel}>Events</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {(mockEarningsEvents.reduce((sum, e) => sum + e.expectedMove, 0) / mockEarningsEvents.length).toFixed(1)}%
              </Text>
              <Text style={styles.summaryLabel}>Avg Move</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {mockEarningsEvents.filter(e => e.expectedMove > e.historicalAvgMove).length}
              </Text>
              <Text style={styles.summaryLabel}>Above Avg</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Earnings List */}
        <View style={styles.listContainer}>
          {sortedEvents.map((event) => {
            const comparison = getMoveComparison(event.expectedMove, event.historicalAvgMove);

            return (
              <TouchableOpacity
                key={event.id}
                style={styles.earningsCard}
                onPress={() => navigation.navigate('OptionsChainViewer', { ticker: event.ticker })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.tickerContainer}>
                    <Text style={styles.ticker}>{event.ticker}</Text>
                    <View style={[styles.timeBadge, event.time === 'BMO' ? styles.bmoBadge : styles.amcBadge]}>
                      <Text style={styles.timeText}>{event.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.date}>{formatDate(event.date)}</Text>
                </View>

                <Text style={styles.companyName}>{event.company}</Text>
                <Text style={styles.marketCap}>{event.marketCap}</Text>

                <View style={styles.metricsRow}>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Expected Move</Text>
                    <Text style={styles.metricValue}>±{event.expectedMove}%</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Implied Vol</Text>
                    <Text style={styles.metricValue}>{event.impliedVol}%</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Hist. Avg</Text>
                    <Text style={styles.metricValue}>±{event.historicalAvgMove}%</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={[styles.comparisonBadge, { borderColor: comparison.color }]}>
                    <Text style={[styles.comparisonText, { color: comparison.color }]}>
                      {comparison.label}
                    </Text>
                  </View>
                  <View style={styles.beatRateContainer}>
                    <Text style={styles.beatRateLabel}>Beat Rate:</Text>
                    <Text style={[
                      styles.beatRateValue,
                      { color: event.beatRate >= 75 ? colors.neon.green : colors.text.primary }
                    ]}>
                      {event.beatRate}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Reading the Calendar</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.neon.orange }]} />
            <Text style={styles.legendText}>Above Avg: Market expects larger move than usual</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.neon.green }]} />
            <Text style={styles.legendText}>Below Avg: Potential IV crush opportunity</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.text.muted }]} />
            <Text style={styles.legendText}>Near Avg: Typical expected volatility</Text>
          </View>
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
    color: colors.eventHorizons.primary,
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  filterChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: colors.eventHorizons.primary,
  },
  filterText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  filterTextActive: {
    color: colors.eventHorizons.primary,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: 8,
  },
  sortLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginRight: 4,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  sortChipActive: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    borderColor: colors.eventHorizons.secondary,
  },
  sortText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  sortTextActive: {
    color: colors.eventHorizons.secondary,
  },
  summaryCard: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  summaryLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    gap: 12,
  },
  earningsCard: {
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticker: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  timeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bmoBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
  },
  amcBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  timeText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  date: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  companyName: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  marketCap: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  comparisonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  comparisonText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
  },
  beatRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  beatRateLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  beatRateValue: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
  },
  legend: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  legendTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    flex: 1,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default EarningsCalendarScreen;
