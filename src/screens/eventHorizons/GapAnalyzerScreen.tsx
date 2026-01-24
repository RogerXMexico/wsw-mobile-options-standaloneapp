// Gap Analyzer Screen
// Visualize probability vs IV gaps to find trading opportunities
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { EventHorizonsStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - spacing.lg * 2 - 32;
const CHART_PADDING = 40;

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;

interface EventPoint {
  id: string;
  ticker: string;
  title: string;
  probability: number; // 0-100
  ivRank: number; // 0-100
  gapScore: number;
  zone: 'long-vol' | 'short-vol' | 'fair-value';
}

// Mock data - events plotted on the gap chart
const MOCK_EVENTS: EventPoint[] = [
  { id: '1', ticker: 'NVDA', title: 'Q4 Earnings', probability: 78, ivRank: 65, gapScore: 13, zone: 'fair-value' },
  { id: '2', ticker: 'TSLA', title: 'Q1 Delivery', probability: 45, ivRank: 82, gapScore: -37, zone: 'short-vol' },
  { id: '3', ticker: 'MRNA', title: 'FDA Approval', probability: 55, ivRank: 32, gapScore: 23, zone: 'long-vol' },
  { id: '4', ticker: 'SPY', title: 'Fed Decision', probability: 35, ivRank: 28, gapScore: 7, zone: 'fair-value' },
  { id: '5', ticker: 'AAPL', title: 'Q1 Earnings', probability: 72, ivRank: 55, gapScore: 17, zone: 'fair-value' },
  { id: '6', ticker: 'META', title: 'Q4 Revenue', probability: 85, ivRank: 92, gapScore: -7, zone: 'short-vol' },
  { id: '7', ticker: 'AMZN', title: 'AWS Growth', probability: 48, ivRank: 25, gapScore: 23, zone: 'long-vol' },
  { id: '8', ticker: 'GOOGL', title: 'Ad Revenue', probability: 62, ivRank: 78, gapScore: -16, zone: 'short-vol' },
];

const getZoneColor = (zone: EventPoint['zone']) => {
  switch (zone) {
    case 'long-vol':
      return colors.bullish;
    case 'short-vol':
      return colors.bearish;
    case 'fair-value':
      return colors.neutral;
  }
};

const GapAnalyzerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedEvent, setSelectedEvent] = useState<EventPoint | null>(null);
  const [filterZone, setFilterZone] = useState<'all' | EventPoint['zone']>('all');

  const filteredEvents = useMemo(() => {
    if (filterZone === 'all') return MOCK_EVENTS;
    return MOCK_EVENTS.filter((e) => e.zone === filterZone);
  }, [filterZone]);

  // Calculate uncertainty from probability (highest at 50%)
  const getUncertainty = (probability: number) => {
    return 100 - Math.abs(probability - 50) * 2;
  };

  // Convert probability/IV to chart coordinates
  const getChartPosition = (event: EventPoint) => {
    const uncertainty = getUncertainty(event.probability);
    const x = (event.ivRank / 100) * (CHART_SIZE - CHART_PADDING * 2) + CHART_PADDING;
    const y = ((100 - uncertainty) / 100) * (CHART_SIZE - CHART_PADDING * 2) + CHART_PADDING;
    return { x, y };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Gap Analyzer</Text>
          <Text style={styles.headerSubtitle}>Probability vs IV Analysis</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Read the Chart</Text>
          <Text style={styles.infoText}>
            Events are plotted by IV Rank (x-axis) and Uncertainty (y-axis).
            Points above the diagonal suggest options are cheap relative to uncertainty.
          </Text>
        </View>

        {/* Zone Legend */}
        <View style={styles.legendContainer}>
          <TouchableOpacity
            style={[styles.legendItem, filterZone === 'all' && styles.legendItemActive]}
            onPress={() => setFilterZone('all')}
          >
            <View style={[styles.legendDot, { backgroundColor: colors.text.secondary }]} />
            <Text style={styles.legendText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.legendItem, filterZone === 'long-vol' && styles.legendItemActive]}
            onPress={() => setFilterZone('long-vol')}
          >
            <View style={[styles.legendDot, { backgroundColor: colors.bullish }]} />
            <Text style={styles.legendText}>Long Vol</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.legendItem, filterZone === 'short-vol' && styles.legendItemActive]}
            onPress={() => setFilterZone('short-vol')}
          >
            <View style={[styles.legendDot, { backgroundColor: colors.bearish }]} />
            <Text style={styles.legendText}>Short Vol</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.legendItem, filterZone === 'fair-value' && styles.legendItemActive]}
            onPress={() => setFilterZone('fair-value')}
          >
            <View style={[styles.legendDot, { backgroundColor: colors.neutral }]} />
            <Text style={styles.legendText}>Fair Value</Text>
          </TouchableOpacity>
        </View>

        {/* Gap Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            {/* Y-axis label */}
            <View style={styles.yAxisLabel}>
              <Text style={styles.axisLabelText}>← Lower Uncertainty</Text>
            </View>

            {/* Chart Area */}
            <View style={styles.chartArea}>
              {/* Background zones */}
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.15)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.longVolZone}
              />
              <LinearGradient
                colors={['transparent', 'rgba(239, 68, 68, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shortVolZone}
              />

              {/* Diagonal fair value line */}
              <View style={styles.diagonalLine} />

              {/* Grid lines */}
              {[25, 50, 75].map((val) => (
                <View
                  key={`h-${val}`}
                  style={[
                    styles.gridLineH,
                    { top: `${val}%` },
                  ]}
                />
              ))}
              {[25, 50, 75].map((val) => (
                <View
                  key={`v-${val}`}
                  style={[
                    styles.gridLineV,
                    { left: `${val}%` },
                  ]}
                />
              ))}

              {/* Event Points */}
              {filteredEvents.map((event) => {
                const pos = getChartPosition(event);
                const isSelected = selectedEvent?.id === event.id;
                return (
                  <TouchableOpacity
                    key={event.id}
                    style={[
                      styles.eventPoint,
                      {
                        left: pos.x - 16,
                        top: pos.y - 16,
                        backgroundColor: getZoneColor(event.zone),
                        borderWidth: isSelected ? 3 : 0,
                        borderColor: colors.text.primary,
                        transform: [{ scale: isSelected ? 1.2 : 1 }],
                      },
                    ]}
                    onPress={() => setSelectedEvent(isSelected ? null : event)}
                  >
                    <Text style={styles.eventPointText}>{event.ticker}</Text>
                  </TouchableOpacity>
                );
              })}

              {/* Zone Labels */}
              <View style={styles.zoneLabelLong}>
                <Text style={styles.zoneLabelText}>LONG VOL</Text>
              </View>
              <View style={styles.zoneLabelShort}>
                <Text style={styles.zoneLabelText}>SHORT VOL</Text>
              </View>
            </View>

            {/* X-axis label */}
            <View style={styles.xAxisLabel}>
              <Text style={styles.axisLabelText}>IV Rank →</Text>
            </View>
          </View>
        </View>

        {/* Selected Event Details */}
        {selectedEvent && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.detailTicker}>{selectedEvent.ticker}</Text>
                <Text style={styles.detailTitle}>{selectedEvent.title}</Text>
              </View>
              <View
                style={[
                  styles.zoneBadge,
                  { backgroundColor: `${getZoneColor(selectedEvent.zone)}20` },
                ]}
              >
                <Text style={[styles.zoneBadgeText, { color: getZoneColor(selectedEvent.zone) }]}>
                  {selectedEvent.zone.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.detailStats}>
              <View style={styles.detailStat}>
                <Text style={styles.detailStatLabel}>Probability</Text>
                <Text style={[styles.detailStatValue, { color: '#14b8a6' }]}>
                  {selectedEvent.probability}%
                </Text>
              </View>
              <View style={styles.detailStat}>
                <Text style={styles.detailStatLabel}>IV Rank</Text>
                <Text style={[styles.detailStatValue, { color: '#f59e0b' }]}>
                  {selectedEvent.ivRank}%
                </Text>
              </View>
              <View style={styles.detailStat}>
                <Text style={styles.detailStatLabel}>Gap Score</Text>
                <Text
                  style={[
                    styles.detailStatValue,
                    { color: selectedEvent.gapScore > 0 ? colors.bullish : colors.bearish },
                  ]}
                >
                  {selectedEvent.gapScore > 0 ? '+' : ''}{selectedEvent.gapScore}
                </Text>
              </View>
            </View>

            <View style={styles.strategyHint}>
              <Text style={styles.strategyHintLabel}>Suggested Approach:</Text>
              <Text style={styles.strategyHintText}>
                {selectedEvent.zone === 'long-vol'
                  ? 'Consider buying volatility: straddles, strangles, or long options.'
                  : selectedEvent.zone === 'short-vol'
                  ? 'Consider selling volatility: iron condors, butterflies, or credit spreads.'
                  : 'Markets roughly agree. Look for other edges or wait for better opportunities.'}
              </Text>
            </View>
          </View>
        )}

        {/* Events List */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsSectionTitle}>All Events ({filteredEvents.length})</Text>
          {filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventRow,
                selectedEvent?.id === event.id && styles.eventRowSelected,
              ]}
              onPress={() => setSelectedEvent(event)}
            >
              <View style={[styles.eventDot, { backgroundColor: getZoneColor(event.zone) }]} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTicker}>{event.ticker}</Text>
                <Text style={styles.eventTitle}>{event.title}</Text>
              </View>
              <View style={styles.eventStats}>
                <Text style={styles.eventStatValue}>
                  {event.gapScore > 0 ? '+' : ''}{event.gapScore}
                </Text>
                <Text style={styles.eventStatLabel}>gap</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  infoCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
    marginBottom: spacing.lg,
  },
  infoTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: '#8b5cf6',
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
  },
  chartContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  chart: {
    height: CHART_SIZE,
  },
  yAxisLabel: {
    position: 'absolute',
    left: -30,
    top: '50%',
    transform: [{ rotate: '-90deg' }, { translateX: -50 }],
  },
  axisLabelText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  chartArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  longVolZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '50%',
  },
  shortVolZone: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: '50%',
  },
  diagonalLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '141%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '45deg' }, { translateX: 0 }, { translateY: CHART_SIZE / 2 }],
    transformOrigin: 'left',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  eventPoint: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventPointText: {
    fontSize: 8,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  zoneLabelLong: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  zoneLabelShort: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  zoneLabelText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 1,
  },
  xAxisLabel: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  detailCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  detailTicker: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  detailTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  zoneBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  zoneBadgeText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detailStat: {
    alignItems: 'center',
  },
  detailStatLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: 2,
  },
  detailStatValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
  },
  strategyHint: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: spacing.md,
  },
  strategyHintLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.semiBold,
    color: '#8b5cf6',
    marginBottom: spacing.xs,
  },
  strategyHintText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  eventsSection: {
    marginTop: spacing.sm,
  },
  eventsSectionTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  eventRowSelected: {
    borderColor: '#8b5cf6',
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTicker: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  eventTitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  eventStats: {
    alignItems: 'flex-end',
  },
  eventStatValue: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  eventStatLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
});

export default GapAnalyzerScreen;
