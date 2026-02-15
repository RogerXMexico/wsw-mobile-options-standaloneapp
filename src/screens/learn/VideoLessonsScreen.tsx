// Video Lessons Screen - Coming Soon screen for upcoming video content
// Dark theme with amber (#f59e0b) accents

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AMBER = '#f59e0b';
const AMBER_DIM = 'rgba(245, 158, 11, 0.12)';
const AMBER_BORDER = 'rgba(245, 158, 11, 0.3)';
const AMBER_LIGHT = '#fbbf24';

// -- Lesson Data --

interface VideoLesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  tier: number;
  tierLabel: string;
}

const LESSONS: VideoLesson[] = [
  {
    id: 1,
    title: 'Introduction to Options Trading',
    description:
      'A complete beginner-friendly overview of what options are, how they work, and why traders use them. Covers calls, puts, and basic terminology.',
    duration: '~25 min',
    tier: 0,
    tierLabel: 'Tier 0 - Foundations',
  },
  {
    id: 2,
    title: 'Reading an Options Chain Like a Pro',
    description:
      'Learn how to read and interpret an options chain, including bid/ask, volume, open interest, and implied volatility columns.',
    duration: '~20 min',
    tier: 0,
    tierLabel: 'Tier 0 - Foundations',
  },
  {
    id: 3,
    title: 'Your First Covered Call \u2014 Live Walkthrough',
    description:
      'Step-by-step walkthrough of placing your first covered call trade, from selecting the stock to choosing the strike and managing the position.',
    duration: '~30 min',
    tier: 1,
    tierLabel: 'Tier 1 - Market Structure',
  },
  {
    id: 4,
    title: 'Risk/Reward Calculator Masterclass',
    description:
      'Master the risk/reward calculator tool to evaluate trade setups before you enter. Learn position sizing and probability analysis.',
    duration: '~20 min',
    tier: 2,
    tierLabel: 'Tier 2 - Risk Management',
  },
  {
    id: 5,
    title: 'The Greeks \u2014 What They Mean and Why They Matter',
    description:
      'Deep dive into Delta, Gamma, Theta, and Vega. Understand how they affect your positions and how to use them in decision making.',
    duration: '~35 min',
    tier: 3,
    tierLabel: 'Tier 3 - The Anchors',
  },
  {
    id: 6,
    title: 'Vertical Spreads \u2014 Bull Call & Bear Put',
    description:
      'Learn to build vertical spreads to define your risk. Covers bull call spreads, bear put spreads, breakeven analysis, and trade management.',
    duration: '~25 min',
    tier: 4,
    tierLabel: 'Tier 4 - Verticals',
  },
  {
    id: 7,
    title: 'Iron Condor \u2014 From Setup to Close',
    description:
      'Build and manage an iron condor from start to finish. Covers strike selection, probability of profit, adjustment techniques, and exit strategies.',
    duration: '~30 min',
    tier: 5,
    tierLabel: 'Tier 5 - Volatility',
  },
  {
    id: 8,
    title: 'Trading Around Earnings Events',
    description:
      'Strategies for trading options before, during, and after earnings announcements. Covers IV crush, straddles, strangles, and event-driven setups.',
    duration: '~25 min',
    tier: 6,
    tierLabel: 'Tier 6 - Time & Skew',
  },
];

// -- Tier color helper --

const getTierColor = (tier: number): string => {
  const tierColors: Record<number, string> = {
    0: colors.tiers[0],
    1: colors.tiers[1],
    2: colors.tiers[2],
    3: colors.tiers[3],
    4: colors.tiers[4],
    5: colors.tiers[5],
    6: colors.tiers[6],
  };
  return tierColors[tier] || colors.text.tertiary;
};

// -- Component --

const VideoLessonsScreen: React.FC = () => {
  const navigation = useNavigation();

  const renderLessonCard = (lesson: VideoLesson) => {
    const tierColor = getTierColor(lesson.tier);

    return (
      <View key={lesson.id} style={styles.lessonCard}>
        {/* Thumbnail placeholder with play + lock icons */}
        <View style={styles.thumbnailContainer}>
          <View style={styles.thumbnail}>
            <View style={styles.playIconCircle}>
              <Ionicons name="play" size={24} color={AMBER} />
            </View>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={12} color={colors.text.secondary} />
            </View>
          </View>
        </View>

        {/* Lesson info */}
        <View style={styles.lessonInfo}>
          {/* Tier + Duration row */}
          <View style={styles.lessonMeta}>
            <View
              style={[
                styles.tierBadge,
                { backgroundColor: `${tierColor}20`, borderColor: `${tierColor}40` },
              ]}
            >
              <Text style={[styles.tierBadgeText, { color: tierColor }]}>
                {lesson.tierLabel}
              </Text>
            </View>
            <View style={styles.durationBadge}>
              <Ionicons
                name="time-outline"
                size={12}
                color={colors.text.tertiary}
              />
              <Text style={styles.durationText}>{lesson.duration}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.lessonTitle} numberOfLines={2}>
            {lesson.title}
          </Text>

          {/* Description */}
          <Text style={styles.lessonDescription} numberOfLines={2}>
            {lesson.description}
          </Text>

          {/* Coming Soon badge */}
          <View style={styles.comingSoonBadge}>
            <Ionicons name="hourglass-outline" size={12} color={AMBER} />
            <Text style={styles.comingSoonBadgeText}>Coming Soon</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons
            name="film-outline"
            size={22}
            color={AMBER}
            style={styles.headerIcon}
          />
          <View>
            <Text style={styles.headerTitle}>Video Lessons</Text>
            <Text style={styles.headerSubtitle}>Learn by watching</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Coming Soon Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIconRow}>
            <View style={styles.bannerIconCircle}>
              <Ionicons name="videocam" size={28} color={AMBER} />
            </View>
          </View>
          <Text style={styles.bannerTitle}>Video Lessons in Production</Text>
          <Text style={styles.bannerDescription}>
            We are actively recording and producing high-quality video lessons to
            complement the written curriculum. Each lesson will include
            real-world examples, live chart walkthroughs, and actionable
            strategies you can apply immediately.
          </Text>
          <View style={styles.bannerStatsRow}>
            <View style={styles.bannerStat}>
              <Text style={styles.bannerStatValue}>8</Text>
              <Text style={styles.bannerStatLabel}>Lessons Planned</Text>
            </View>
            <View style={styles.bannerStatDivider} />
            <View style={styles.bannerStat}>
              <Text style={styles.bannerStatValue}>3.5+</Text>
              <Text style={styles.bannerStatLabel}>Hours of Content</Text>
            </View>
            <View style={styles.bannerStatDivider} />
            <View style={styles.bannerStat}>
              <Text style={styles.bannerStatValue}>7</Text>
              <Text style={styles.bannerStatLabel}>Tiers Covered</Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Lessons</Text>
          <Text style={styles.sectionSubtitle}>
            {LESSONS.length} lessons planned across all tiers
          </Text>
        </View>

        {/* Lesson Cards */}
        {LESSONS.map(renderLessonCard)}

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.text.muted}
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>
            More video lessons will be added as they are recorded. Stay tuned
            for notifications when new content becomes available.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// -- Styles --

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AMBER_BORDER,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: 1,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 2,
  },

  // Coming Soon Banner
  banner: {
    backgroundColor: AMBER_DIM,
    borderWidth: 1,
    borderColor: AMBER_BORDER,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  bannerIconRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bannerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: AMBER_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    ...typography.styles.h4,
    color: AMBER_LIGHT,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  bannerDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  bannerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: AMBER_BORDER,
  },
  bannerStat: {
    flex: 1,
    alignItems: 'center',
  },
  bannerStatValue: {
    ...typography.styles.h4,
    color: AMBER,
    fontFamily: typography.fonts.monoBold,
  },
  bannerStatLabel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  bannerStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: AMBER_BORDER,
  },

  // Section Header
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.tertiary,
  },

  // Lesson Card
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  // Thumbnail
  thumbnailContainer: {
    marginRight: spacing.md,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: AMBER_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Lesson Info
  lessonInfo: {
    flex: 1,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: 2,
  },
  tierBadgeText: {
    ...typography.styles.overline,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  durationText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginLeft: 4,
  },
  lessonTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  lessonDescription: {
    ...typography.styles.bodyXs,
    color: colors.text.tertiary,
    lineHeight: 17,
    marginBottom: spacing.sm,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: AMBER_DIM,
    borderWidth: 1,
    borderColor: AMBER_BORDER,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  comingSoonBadgeText: {
    ...typography.styles.overline,
    fontSize: 9,
    color: AMBER,
    marginLeft: 4,
    letterSpacing: 0.8,
  },

  // Footer Note
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  footerIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  footerText: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    flex: 1,
    lineHeight: 20,
  },
});

export default VideoLessonsScreen;
