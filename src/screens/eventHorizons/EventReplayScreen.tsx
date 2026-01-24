// Event Replay Screen
// Step through historical events to learn from past market behavior
import React, { useState, useCallback } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { GlowButton } from '../../components/ui';
import { EventHorizonsStackParamList } from '../../navigation/types';
import { EVENT_HORIZONS_CASE_STUDIES } from '../../data/eventHorizonsLessons';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;
type RouteType = RouteProp<EventHorizonsStackParamList, 'EventReplay'>;

interface TimelineDay {
  day: number;
  daysToEvent: number;
  probability: number;
  ivRank: number;
  stockPrice: number;
  sentiment: string;
}

// Mock timeline data for a case study
const generateTimeline = (finalProbability: number, finalIV: number): TimelineDay[] => {
  const days: TimelineDay[] = [];
  const numDays = 14;

  for (let i = 0; i < numDays; i++) {
    const daysToEvent = numDays - i - 1;
    const progress = i / (numDays - 1);

    // Simulate probability trending toward final value with some noise
    const probNoise = (Math.random() - 0.5) * 10;
    const probability = Math.round(
      50 + (finalProbability - 50) * progress + probNoise * (1 - progress)
    );

    // IV typically increases as event approaches
    const ivBase = 30 + (finalIV - 30) * Math.pow(progress, 0.7);
    const ivNoise = (Math.random() - 0.5) * 8;
    const ivRank = Math.round(Math.max(20, Math.min(95, ivBase + ivNoise)));

    // Stock price with some movement
    const stockPrice = 100 + (Math.random() - 0.5) * 10 * progress;

    const sentiments = ['Cautious', 'Neutral', 'Optimistic', 'Mixed', 'Bullish', 'Uncertain'];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    days.push({
      day: i + 1,
      daysToEvent,
      probability: Math.max(10, Math.min(90, probability)),
      ivRank,
      stockPrice: Math.round(stockPrice * 100) / 100,
      sentiment,
    });
  }

  return days;
};

const EventReplayScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const eventId = route.params?.eventId;

  // Find the case study or use a default
  const caseStudy = EVENT_HORIZONS_CASE_STUDIES.find((cs) => cs.id === eventId) ||
    EVENT_HORIZONS_CASE_STUDIES[0];

  const [timeline] = useState(() =>
    generateTimeline(caseStudy.predictionProbability, caseStudy.ivRank)
  );
  const [currentDay, setCurrentDay] = useState(0);
  const [showOutcome, setShowOutcome] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentData = timeline[currentDay];
  const progress = ((currentDay + 1) / timeline.length) * 100;

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let day = currentDay;

    const interval = setInterval(() => {
      day++;
      if (day >= timeline.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setShowOutcome(true);
      } else {
        setCurrentDay(day);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [currentDay, isPlaying, timeline.length]);

  const handleNext = () => {
    if (currentDay < timeline.length - 1) {
      setCurrentDay((prev) => prev + 1);
    } else {
      setShowOutcome(true);
    }
  };

  const handlePrevious = () => {
    setShowOutcome(false);
    setCurrentDay((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCurrentDay(0);
    setShowOutcome(false);
    setIsPlaying(false);
  };

  const getOutcomeColor = () => {
    switch (caseStudy.outcome) {
      case 'beat':
      case 'approved':
      case 'cut':
        return colors.bullish;
      case 'miss':
      case 'rejected':
      case 'hike':
        return colors.bearish;
      default:
        return colors.neutral;
    }
  };

  const getOutcomeLabel = () => {
    switch (caseStudy.outcome) {
      case 'beat':
        return 'EARNINGS BEAT';
      case 'miss':
        return 'EARNINGS MISS';
      case 'inline':
        return 'IN-LINE';
      case 'approved':
        return 'APPROVED';
      case 'rejected':
        return 'REJECTED';
      case 'hike':
        return 'RATE HIKE';
      case 'cut':
        return 'RATE CUT';
      case 'hold':
        return 'RATES HELD';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Event Replay</Text>
          <Text style={styles.headerSubtitle}>{caseStudy.ticker} - {caseStudy.title}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Info Card */}
        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View>
              <Text style={styles.eventTicker}>{caseStudy.ticker}</Text>
              <Text style={styles.eventTitle}>{caseStudy.title}</Text>
            </View>
            <View style={styles.eventTypeBadge}>
              <Text style={styles.eventTypeText}>
                {caseStudy.eventType.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.eventDate}>Event Date: {caseStudy.eventDate}</Text>
        </View>

        {/* Timeline Progress */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineLabel}>
              Day {currentData.day} of {timeline.length}
            </Text>
            <Text style={styles.timelineDays}>
              {currentData.daysToEvent === 0
                ? 'EVENT DAY'
                : `${currentData.daysToEvent} days to event`}
            </Text>
          </View>
          <View style={styles.timelineBar}>
            <LinearGradient
              colors={['#8b5cf6', '#14b8a6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.timelineFill, { width: `${progress}%` }]}
            />
          </View>
        </View>

        {/* Current Data Display */}
        {!showOutcome ? (
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}>Market Snapshot</Text>

            <View style={styles.dataGrid}>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Prediction Probability</Text>
                <Text style={[styles.dataValue, { color: '#14b8a6' }]}>
                  {currentData.probability}%
                </Text>
                <Text style={styles.dataHint}>Polymarket consensus</Text>
              </View>

              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>IV Rank</Text>
                <Text style={[styles.dataValue, { color: '#f59e0b' }]}>
                  {currentData.ivRank}%
                </Text>
                <Text style={styles.dataHint}>Options pricing</Text>
              </View>

              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Stock Price</Text>
                <Text style={[styles.dataValue, { color: colors.text.primary }]}>
                  ${currentData.stockPrice}
                </Text>
                <Text style={styles.dataHint}>Current price</Text>
              </View>

              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Sentiment</Text>
                <Text style={[styles.dataValue, { color: '#8b5cf6' }]}>
                  {currentData.sentiment}
                </Text>
                <Text style={styles.dataHint}>Market mood</Text>
              </View>
            </View>

            {/* Gap Analysis */}
            <View style={styles.gapAnalysis}>
              <Text style={styles.gapLabel}>Gap Analysis:</Text>
              <Text style={styles.gapText}>
                {currentData.probability > 70 && currentData.ivRank > 70
                  ? '🔴 High confidence + expensive options = potential short vol opportunity'
                  : currentData.probability < 60 && currentData.ivRank < 40
                  ? '🟢 Uncertainty + cheap options = potential long vol opportunity'
                  : '🟡 Markets relatively aligned - no clear edge'}
              </Text>
            </View>
          </View>
        ) : (
          /* Outcome Display */
          <View style={styles.outcomeCard}>
            <LinearGradient
              colors={[`${getOutcomeColor()}30`, 'transparent']}
              style={styles.outcomeGradient}
            >
              <Text style={styles.outcomeLabel}>EVENT OUTCOME</Text>
              <Text style={[styles.outcomeResult, { color: getOutcomeColor() }]}>
                {getOutcomeLabel()}
              </Text>

              <View style={styles.outcomeStats}>
                <View style={styles.outcomeStat}>
                  <Text style={styles.outcomeStatLabel}>Stock Move</Text>
                  <Text
                    style={[
                      styles.outcomeStatValue,
                      { color: caseStudy.stockMove >= 0 ? colors.bullish : colors.bearish },
                    ]}
                  >
                    {caseStudy.stockMove >= 0 ? '+' : ''}{caseStudy.stockMove}%
                  </Text>
                </View>
                <View style={styles.outcomeStat}>
                  <Text style={styles.outcomeStatLabel}>Final Probability</Text>
                  <Text style={[styles.outcomeStatValue, { color: '#14b8a6' }]}>
                    {caseStudy.predictionProbability}%
                  </Text>
                </View>
                <View style={styles.outcomeStat}>
                  <Text style={styles.outcomeStatLabel}>Final IV Rank</Text>
                  <Text style={[styles.outcomeStatValue, { color: '#f59e0b' }]}>
                    {caseStudy.ivRank}%
                  </Text>
                </View>
              </View>

              <View style={styles.optimalStrategy}>
                <Text style={styles.optimalLabel}>Optimal Strategy Was:</Text>
                <Text style={styles.optimalValue}>{caseStudy.optimalStrategy}</Text>
              </View>

              <View style={styles.lessonBox}>
                <Text style={styles.lessonTitle}>📚 Key Lesson</Text>
                <Text style={styles.lessonText}>
                  {caseStudy.outcome === 'beat' && caseStudy.stockMove > 10
                    ? 'When prediction markets show high confidence but IV is moderate, the actual move can exceed expectations. Long vol can pay off.'
                    : caseStudy.outcome === 'beat' && caseStudy.stockMove < 5
                    ? 'Even "correct" predictions can lose money if the move is already priced in. Watch for IV crush after events.'
                    : 'Markets aren\'t always right. The gap between probability and volatility can reveal mispricing.'}
                </Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, currentDay === 0 && styles.controlButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentDay === 0}
          >
            <Text style={styles.controlButtonText}>⏮️ Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={handlePlay}
          >
            <LinearGradient
              colors={['#8b5cf6', '#14b8a6']}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              showOutcome && styles.controlButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={showOutcome}
          >
            <Text style={styles.controlButtonText}>Next ⏭️</Text>
          </TouchableOpacity>
        </View>

        {showOutcome && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>🔄 Replay Event</Text>
          </TouchableOpacity>
        )}

        {/* Other Case Studies */}
        <View style={styles.otherStudies}>
          <Text style={styles.otherStudiesTitle}>Other Case Studies</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {EVENT_HORIZONS_CASE_STUDIES.filter((cs) => cs.id !== caseStudy.id)
              .slice(0, 4)
              .map((cs) => (
                <TouchableOpacity
                  key={cs.id}
                  style={styles.studyCard}
                  onPress={() => {
                    handleReset();
                    navigation.setParams({ eventId: cs.id });
                  }}
                >
                  <Text style={styles.studyTicker}>{cs.ticker}</Text>
                  <Text style={styles.studyTitle} numberOfLines={1}>
                    {cs.title}
                  </Text>
                  <Text style={styles.studyType}>{cs.eventType}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
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
  eventCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  eventTicker: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  eventTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  eventTypeBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  eventTypeText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
    color: '#8b5cf6',
  },
  eventDate: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  timelineContainer: {
    marginBottom: spacing.lg,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  timelineLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
  },
  timelineDays: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  timelineBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timelineFill: {
    height: '100%',
    borderRadius: 4,
  },
  dataCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  dataTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  dataItem: {
    width: (width - spacing.lg * 2 - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: spacing.md,
  },
  dataLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
  },
  dataHint: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginTop: 2,
  },
  gapAnalysis: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
  },
  gapLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: '#8b5cf6',
    marginBottom: spacing.xs,
  },
  gapText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  outcomeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  outcomeGradient: {
    padding: spacing.xl,
  },
  outcomeLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.text.muted,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  outcomeResult: {
    fontSize: typography.sizes['3xl'],
    fontFamily: typography.fonts.bold,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  outcomeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  outcomeStat: {
    alignItems: 'center',
  },
  outcomeStatLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: 4,
  },
  outcomeStatValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
  },
  optimalStrategy: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  optimalLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: 4,
  },
  optimalValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  lessonBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: spacing.md,
  },
  lessonTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: '#8b5cf6',
    marginBottom: spacing.xs,
  },
  lessonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
  },
  playButton: {
    flex: 1.5,
    padding: 0,
    overflow: 'hidden',
  },
  playButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 12,
  },
  playButtonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  resetButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resetButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: '#8b5cf6',
  },
  otherStudies: {
    marginTop: spacing.md,
  },
  otherStudiesTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  studyCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.sm,
    width: 120,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  studyTicker: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  studyTitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  studyType: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: '#8b5cf6',
    textTransform: 'uppercase',
  },
});

export default EventReplayScreen;
