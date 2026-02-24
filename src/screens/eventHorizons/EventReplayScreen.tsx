// Event Replay Screen
// Step through historical events with real data to learn from past market behavior
import React, { useState, useCallback, useMemo } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { LearnStackParamList } from '../../navigation/types';
import {
  CURATED_CASE_STUDIES,
  CuratedCaseStudy,
  getCaseStudiesByEventType,
} from '../../data/curatedCaseStudies';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<LearnStackParamList>;
type RouteType = RouteProp<LearnStackParamList, 'EventReplay'>;

// Colors for event types
const EVENT_TYPE_COLORS: Record<string, { primary: string; bg: string }> = {
  earnings: { primary: '#14b8a6', bg: 'rgba(20, 184, 166, 0.15)' },
  fda: { primary: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  macro: { primary: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  corporate: { primary: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
};

// Difficulty badges
const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Beginner', color: '#10b981' },
  2: { label: 'Intermediate', color: '#f59e0b' },
  3: { label: 'Advanced', color: '#ef4444' },
};

const EventReplayScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const eventId = route.params?.eventId;

  // Find the case study or use first one
  const caseStudy = useMemo(() => {
    return (
      CURATED_CASE_STUDIES.find((cs) => cs.id === eventId) ||
      CURATED_CASE_STUDIES[0]
    );
  }, [eventId]);

  const timeline = caseStudy.timeline;
  const [currentStep, setCurrentStep] = useState(0);
  const [showOutcome, setShowOutcome] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentData = timeline[currentStep];
  const progress = ((currentStep + 1) / timeline.length) * 100;
  const eventTypeColor = EVENT_TYPE_COLORS[caseStudy.eventType] || EVENT_TYPE_COLORS.earnings;
  const difficultyInfo = DIFFICULTY_LABELS[caseStudy.difficulty] || DIFFICULTY_LABELS[1];

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let step = currentStep;

    const interval = setInterval(() => {
      step++;
      if (step >= timeline.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setShowOutcome(true);
      } else {
        setCurrentStep(step);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [currentStep, isPlaying, timeline.length]);

  const handleNext = () => {
    if (currentStep < timeline.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowOutcome(true);
    }
  };

  const handlePrevious = () => {
    setShowOutcome(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCurrentStep(0);
    setShowOutcome(false);
    setIsPlaying(false);
  };

  const navigateToCaseStudy = (cs: CuratedCaseStudy) => {
    handleReset();
    navigation.setParams({ eventId: cs.id });
  };

  // Get related case studies (same event type)
  const relatedStudies = useMemo(() => {
    return getCaseStudiesByEventType(caseStudy.eventType)
      .filter((cs) => cs.id !== caseStudy.id)
      .slice(0, 3);
  }, [caseStudy]);

  // Gap analysis based on current data
  const getGapAnalysis = () => {
    const prob = currentData.polymarketProbability * 100;
    const ivRank = currentData.optionsIV;

    if (prob > 70 && ivRank > 70) {
      return {
        signal: 'short-vol',
        dotColor: '#ef4444',
        text: 'High confidence + expensive options = potential short vol opportunity. Consider selling premium.',
      };
    } else if (prob > 70 && ivRank < 50) {
      return {
        signal: 'long-vol',
        dotColor: '#22c55e',
        text: 'High conviction but cheap options = potential long vol opportunity. Options may be underpriced.',
      };
    } else if (prob < 60 && ivRank > 70) {
      return {
        signal: 'short-vol',
        dotColor: '#eab308',
        text: 'Uncertainty + expensive options = options may be overpriced. Consider selling premium.',
      };
    } else if (prob < 60 && ivRank < 50) {
      return {
        signal: 'neutral',
        dotColor: '#94a3b8',
        text: 'Markets relatively aligned - no clear edge. Wait for better setup.',
      };
    }
    return {
      signal: 'neutral',
      dotColor: '#eab308',
      text: 'Markets moderately aligned. Analyze further before taking position.',
    };
  };

  const gapAnalysis = getGapAnalysis();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Event Replay</Text>
          <Text style={styles.headerSubtitle}>
            {caseStudy.ticker || 'MACRO'} - {caseStudy.eventName}
          </Text>
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
            <View style={styles.eventTitleSection}>
              <Text style={styles.eventTicker}>
                {caseStudy.ticker || 'MACRO'}
              </Text>
              <Text style={styles.eventCompany}>{caseStudy.companyName}</Text>
            </View>
            <View style={styles.badgeRow}>
              <View
                style={[styles.eventTypeBadge, { backgroundColor: eventTypeColor.bg }]}
              >
                <Text style={[styles.eventTypeText, { color: eventTypeColor.primary }]}>
                  {caseStudy.eventType.toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: `${difficultyInfo.color}20` },
                ]}
              >
                <Text style={[styles.difficultyText, { color: difficultyInfo.color }]}>
                  {difficultyInfo.label}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.eventName}>{caseStudy.eventName}</Text>
          <Text style={styles.eventDate}><Ionicons name="calendar-outline" size={14} color={colors.text.muted} /> {caseStudy.eventDate}</Text>
          <Text style={styles.eventSummary}>{caseStudy.summary}</Text>
        </View>

        {/* Setup Context */}
        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}><Ionicons name="locate" size={14} color="#a78bfa" /> Setup Context</Text>
          <Text style={styles.contextText}>{caseStudy.setupContext}</Text>
        </View>

        {/* Timeline Progress */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineLabel}>
              Step {currentStep + 1} of {timeline.length}
            </Text>
            <Text style={styles.timelineDays}>
              {currentData.daysToEvent === 0
                ? 'EVENT DAY'
                : currentData.daysToEvent > 0
                ? `T-${currentData.daysToEvent} days`
                : `T+${Math.abs(currentData.daysToEvent)} days`}
            </Text>
          </View>
          <View style={styles.timelineBar}>
            <LinearGradient
              colors={[eventTypeColor.primary, '#39ff14']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.timelineFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.timelineDate}>{currentData.timestamp}</Text>
        </View>

        {/* Current Data Display */}
        {!showOutcome ? (
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}><Ionicons name="trending-up" size={18} color={colors.text.primary} /> Market Snapshot</Text>

            <View style={styles.dataGrid}>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Polymarket Probability</Text>
                <Text style={[styles.dataValue, { color: '#14b8a6' }]}>
                  {Math.round(currentData.polymarketProbability * 100)}%
                </Text>
                <Text style={styles.dataHint}>Prediction market consensus</Text>
              </View>

              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Options IV</Text>
                <Text style={[styles.dataValue, { color: '#f59e0b' }]}>
                  {currentData.optionsIV}%
                </Text>
                <Text style={styles.dataHint}>Implied volatility</Text>
              </View>

              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Expected Move</Text>
                <Text style={[styles.dataValue, { color: '#8b5cf6' }]}>
                  ±{currentData.optionsExpectedMove}%
                </Text>
                <Text style={styles.dataHint}>Priced-in range</Text>
              </View>

              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Stock Price</Text>
                <Text style={[styles.dataValue, { color: colors.text.primary }]}>
                  ${currentData.stockPrice.toLocaleString()}
                </Text>
                <Text style={styles.dataHint}>Current price</Text>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}><Ionicons name="document-text" size={14} color={colors.text.primary} /> Market Notes</Text>
              <Text style={styles.notesText}>{currentData.notes}</Text>
            </View>

            {/* Gap Analysis */}
            <View
              style={[
                styles.gapAnalysis,
                {
                  backgroundColor:
                    gapAnalysis.signal === 'long-vol'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : gapAnalysis.signal === 'short-vol'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(139, 92, 246, 0.15)',
                },
              ]}
            >
              <Text style={styles.gapLabel}>
                <Ionicons name="ellipse" size={10} color={gapAnalysis.dotColor} /> Chameleon's Gap Analysis
              </Text>
              <Text style={styles.gapText}>{gapAnalysis.text}</Text>
            </View>
          </View>
        ) : (
          /* Outcome Display */
          <View style={styles.outcomeCard}>
            <LinearGradient
              colors={[
                caseStudy.outcome.direction === 'up'
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(239, 68, 68, 0.3)',
                'transparent',
              ]}
              style={styles.outcomeGradient}
            >
              <Text style={styles.outcomeLabel}><Ionicons name="videocam" size={14} color={colors.text.muted} /> EVENT OUTCOME</Text>
              <Text
                style={[
                  styles.outcomeResult,
                  {
                    color:
                      caseStudy.outcome.direction === 'up'
                        ? colors.bullish
                        : colors.bearish,
                  },
                ]}
              >
                <Ionicons name={caseStudy.outcome.direction === 'up' ? 'trending-up' : 'trending-down'} size={24} color={caseStudy.outcome.direction === 'up' ? colors.bullish : colors.bearish} />{' '}
                {caseStudy.outcome.actualMove >= 0 ? '+' : ''}
                {caseStudy.outcome.actualMove}% MOVE
              </Text>

              <View style={styles.outcomeStats}>
                <View style={styles.outcomeStat}>
                  <Text style={styles.outcomeStatLabel}>Actual Move</Text>
                  <Text
                    style={[
                      styles.outcomeStatValue,
                      {
                        color:
                          caseStudy.outcome.actualMove >= 0
                            ? colors.bullish
                            : colors.bearish,
                      },
                    ]}
                  >
                    {caseStudy.outcome.actualMove >= 0 ? '+' : ''}
                    {caseStudy.outcome.actualMove}%
                  </Text>
                </View>
                <View style={styles.outcomeStat}>
                  <Text style={styles.outcomeStatLabel}>IV Crush</Text>
                  <Text style={[styles.outcomeStatValue, { color: '#f59e0b' }]}>
                    -{caseStudy.outcome.ivCrushMagnitude}%
                  </Text>
                </View>
                <View style={styles.outcomeStat}>
                  <Text style={styles.outcomeStatLabel}>Prediction</Text>
                  <Text
                    style={[
                      styles.outcomeStatValue,
                      {
                        color: caseStudy.outcome.predictionAccurate
                          ? '#10b981'
                          : '#ef4444',
                      },
                    ]}
                  >
                    {caseStudy.outcome.predictionAccurate ? 'Right' : 'Wrong'}
                  </Text>
                </View>
              </View>

              {/* Key Takeaway */}
              <View style={styles.takeawayBox}>
                <Text style={styles.takeawayTitle}><Ionicons name="bulb" size={14} color="#fbbf24" /> Key Takeaway</Text>
                <Text style={styles.takeawayText}>
                  {caseStudy.outcome.keyTakeaway}
                </Text>
              </View>

              {/* Teaching Points */}
              <View style={styles.teachingPoints}>
                <Text style={styles.teachingTitle}><Ionicons name="book" size={14} color="#a78bfa" /> What We Learned</Text>
                {caseStudy.teachingPoints.map((point, index) => (
                  <View key={index} style={styles.teachingPoint}>
                    <Text style={styles.teachingBullet}>•</Text>
                    <Text style={styles.teachingText}>{point}</Text>
                  </View>
                ))}
              </View>

              {/* Suggested Strategies */}
              {caseStudy.suggestedStrategies.length > 0 && (
                <View style={styles.strategiesBox}>
                  <Text style={styles.strategiesTitle}><Ionicons name="locate" size={14} color="#14b8a6" /> Suggested Strategies</Text>
                  <View style={styles.strategiesList}>
                    {caseStudy.suggestedStrategies.map((strategy, index) => (
                      <View key={index} style={styles.strategyBadge}>
                        <Text style={styles.strategyText}>{strategy}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </LinearGradient>
          </View>
        )}

        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              currentStep === 0 && styles.controlButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <Text style={styles.controlButtonText}><Ionicons name="play-back" size={14} color={colors.text.secondary} /> Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={handlePlay}
          >
            <LinearGradient
              colors={[eventTypeColor.primary, '#39ff14']}
              style={styles.playButtonGradient}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? 'Pause' : 'Play'}
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
            <Text style={styles.controlButtonText}>Next <Ionicons name="play-forward" size={14} color={colors.text.secondary} /></Text>
          </TouchableOpacity>
        </View>

        {showOutcome && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}><Ionicons name="refresh" size={16} color="#39ff14" /> Replay This Event</Text>
          </TouchableOpacity>
        )}

        {/* Related Case Studies */}
        {relatedStudies.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>
              More {caseStudy.eventType.charAt(0).toUpperCase() + caseStudy.eventType.slice(1)} Events
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedStudies.map((cs) => (
                <TouchableOpacity
                  key={cs.id}
                  style={styles.relatedCard}
                  onPress={() => navigateToCaseStudy(cs)}
                >
                  <Text style={styles.relatedTicker}>{cs.ticker || 'MACRO'}</Text>
                  <Text style={styles.relatedName} numberOfLines={2}>
                    {cs.eventName}
                  </Text>
                  <View style={styles.relatedMeta}>
                    <Text
                      style={[
                        styles.relatedMove,
                        {
                          color:
                            cs.outcome.actualMove >= 0
                              ? colors.bullish
                              : colors.bearish,
                        },
                      ]}
                    >
                      {cs.outcome.actualMove >= 0 ? '+' : ''}
                      {cs.outcome.actualMove}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Case Studies Quick Access */}
        <View style={styles.allStudiesSection}>
          <Text style={styles.allStudiesTitle}>Browse All Case Studies</Text>
          <View style={styles.categoryButtons}>
            {['earnings', 'fda', 'macro', 'corporate'].map((type) => {
              const typeColor = EVENT_TYPE_COLORS[type];
              const count = getCaseStudiesByEventType(type as any).length;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.categoryButton, { backgroundColor: typeColor.bg }]}
                  onPress={() => {
                    const studies = getCaseStudiesByEventType(type as any);
                    if (studies.length > 0 && studies[0].id !== caseStudy.id) {
                      navigateToCaseStudy(studies[0]);
                    } else if (studies.length > 1) {
                      navigateToCaseStudy(studies[1]);
                    }
                  }}
                >
                  <Text style={[styles.categoryText, { color: typeColor.primary }]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <Text style={[styles.categoryCount, { color: typeColor.primary }]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  eventTitleSection: {
    flex: 1,
  },
  eventTicker: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  eventCompany: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  eventTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  eventTypeText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
  },
  eventName: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventDate: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  eventSummary: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  contextCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  contextTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: '#a78bfa',
    marginBottom: spacing.xs,
  },
  contextText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
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
    fontFamily: typography.fonts.bold,
    color: '#39ff14',
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
  timelineDate: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginTop: spacing.xs,
    textAlign: 'right',
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
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dataItem: {
    width: (width - spacing.lg * 2 - spacing.lg * 2 - spacing.sm) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  notesBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  notesLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  gapAnalysis: {
    borderRadius: 12,
    padding: spacing.md,
  },
  gapLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
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
  takeawayBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  takeawayTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: '#fbbf24',
    marginBottom: spacing.xs,
  },
  takeawayText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  teachingPoints: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  teachingTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: '#a78bfa',
    marginBottom: spacing.sm,
  },
  teachingPoint: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  teachingBullet: {
    fontSize: typography.sizes.sm,
    color: '#a78bfa',
    marginRight: spacing.xs,
  },
  teachingText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  strategiesBox: {
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderRadius: 12,
    padding: spacing.md,
  },
  strategiesTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: '#14b8a6',
    marginBottom: spacing.sm,
  },
  strategiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  strategyBadge: {
    backgroundColor: 'rgba(20, 184, 166, 0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  strategyText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: '#14b8a6',
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
    fontFamily: typography.fonts.bold,
    color: '#000',
  },
  resetButton: {
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.3)',
  },
  resetButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: '#39ff14',
  },
  relatedSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  relatedTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  relatedCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.sm,
    width: 140,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  relatedTicker: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  relatedName: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    minHeight: 32,
  },
  relatedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedMove: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
  },
  allStudiesSection: {
    marginTop: spacing.md,
  },
  allStudiesTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
  },
  categoryCount: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
    opacity: 0.7,
  },
});

export default EventReplayScreen;
