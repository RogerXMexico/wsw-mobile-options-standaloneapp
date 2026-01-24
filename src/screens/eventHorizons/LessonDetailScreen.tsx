// Lesson Detail Screen
// Display individual Event Horizons lesson content
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { GlowButton } from '../../components/ui';
import { EventHorizonsStackParamList } from '../../navigation/types';
import { EVENT_HORIZONS_LESSONS, EVENT_HORIZONS_QUIZ_QUESTIONS } from '../../data/eventHorizonsLessons';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;
type RouteType = RouteProp<EventHorizonsStackParamList, 'LessonDetail'>;

const getMentorInfo = (mentor: string) => {
  switch (mentor) {
    case 'chameleon':
      return { emoji: '🦎', name: 'Chameleon', color: '#8b5cf6', gradient: ['#8b5cf6', '#14b8a6'] };
    case 'cheetah':
      return { emoji: '🐆', name: 'Cheetah', color: '#f59e0b', gradient: ['#f59e0b', '#ef4444'] };
    case 'owl':
      return { emoji: '🦉', name: 'Owl', color: '#3b82f6', gradient: ['#3b82f6', '#8b5cf6'] };
    default:
      return { emoji: '🦎', name: 'Chameleon', color: '#8b5cf6', gradient: ['#8b5cf6', '#14b8a6'] };
  }
};

// Lesson content sections (simplified from HTML)
const LESSON_CONTENT: Record<string, { sections: { title: string; content: string; icon?: string }[] }> = {
  'eh-lesson-1': {
    sections: [
      {
        title: 'The Two Markets',
        icon: '🌐',
        content: 'Most options traders only watch one market. The Chameleon watches two—and sees opportunities others miss entirely.',
      },
      {
        title: 'The Options Jungle',
        icon: '📊',
        content: 'Options prices tell you how much the market expects a stock to move. High IV means traders expect big moves. Low IV means calm seas ahead.\n\nOptions tell you: "We expect NVDA to move ±12% around earnings."',
      },
      {
        title: 'The Prediction Jungle',
        icon: '🔮',
        content: 'Prediction markets tell you the probability of specific outcomes. Not how much something will move—but which direction and how likely.\n\nPolymarket tells you: "There\'s a 78% chance NVDA beats earnings expectations."',
      },
      {
        title: 'The Chameleon\'s Insight',
        icon: '💡',
        content: 'Options tell you volatility expectations.\nPrediction markets tell you probability estimates.\n\nWhen these two markets disagree, that\'s where opportunity lives.',
      },
      {
        title: 'What is Polymarket?',
        icon: '🏛️',
        content: 'Polymarket is a prediction market where people bet real money on the outcomes of future events. The crowd\'s collective bets create a probability estimate.\n\n• Earnings: "Will TSLA beat Q4 estimates?"\n• FDA Decisions: "Will Drug X get approved?"\n• Fed Decisions: "Will the Fed cut rates?"',
      },
      {
        title: 'Finding the Gap',
        icon: '🎯',
        content: 'The magic happens when these two markets tell different stories.\n\n↑ Long Vol Opportunity:\nPolymarket: 55% beat probability (high uncertainty)\nOptions: IV Rank 35% (low volatility pricing)\nTranslation: The crowd is uncertain, but options are cheap. Consider buying volatility.\n\n↓ Short Vol Opportunity:\nPolymarket: 85% beat probability (high confidence)\nOptions: IV Rank 92% (very expensive)\nTranslation: Everyone expects a beat, but options are pricing a huge move. Consider selling volatility.',
      },
    ],
  },
  'eh-lesson-2': {
    sections: [
      {
        title: 'Understanding the Gap',
        icon: '📏',
        content: 'The "gap" is the difference between what prediction markets expect and what options are pricing. A large gap suggests one market may be wrong.',
      },
      {
        title: 'Calculating Gap Score',
        icon: '🧮',
        content: 'Gap Score = Prediction Uncertainty - IV Rank\n\nPositive gap: Options may be underpriced\nNegative gap: Options may be overpriced\n\nUncertainty is highest when probability is near 50%, lowest when near 0% or 100%.',
      },
      {
        title: 'The Gap Zones',
        icon: '🗺️',
        content: 'Long Vol Zone (Upper Left):\n• High uncertainty, low IV\n• Buy straddles, strangles\n\nShort Vol Zone (Lower Right):\n• Low uncertainty, high IV\n• Sell iron condors, butterflies\n\nFair Value Zone (Diagonal):\n• Markets agree\n• No clear edge',
      },
      {
        title: 'Using the Gap Analyzer',
        icon: '📊',
        content: 'The Gap Analyzer tool plots events on a probability vs IV chart. Events far from the diagonal line represent the biggest disagreements between markets.',
      },
    ],
  },
};

const LessonDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { lessonId } = route.params;

  const lesson = useMemo(
    () => EVENT_HORIZONS_LESSONS.find((l) => l.id === lessonId),
    [lessonId]
  );

  const quizQuestions = useMemo(
    () => EVENT_HORIZONS_QUIZ_QUESTIONS.filter((q) => q.lessonId === lessonId),
    [lessonId]
  );

  const content = LESSON_CONTENT[lessonId] || { sections: [] };
  const [currentSection, setCurrentSection] = useState(0);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
          <GlowButton title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const mentor = getMentorInfo(lesson.mentor);
  const totalSections = content.sections.length;
  const isLastSection = currentSection === totalSections - 1;
  const hasQuiz = quizQuestions.length > 0;

  const handleNext = () => {
    if (isLastSection) {
      if (hasQuiz) {
        // Navigate to quiz
        navigation.navigate('EventHorizonsLessons');
      } else {
        navigation.goBack();
      }
    } else {
      setCurrentSection((prev) => Math.min(prev + 1, totalSections - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Lesson {lesson.number}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {lesson.title}
          </Text>
        </View>
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {currentSection + 1}/{totalSections}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={mentor.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              { width: `${((currentSection + 1) / totalSections) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mentor Card */}
        <LinearGradient
          colors={[`${mentor.color}30`, 'transparent']}
          style={styles.mentorCard}
        >
          <View style={styles.mentorRow}>
            <LinearGradient colors={mentor.gradient as [string, string]} style={styles.mentorAvatar}>
              <Text style={styles.mentorEmoji}>{mentor.emoji}</Text>
            </LinearGradient>
            <View style={styles.mentorInfo}>
              <Text style={styles.mentorName}>{mentor.name} says:</Text>
              <Text style={styles.mentorQuote}>
                {lesson.number === 1
                  ? '"Welcome to Event Horizons. Let me show you how to see what others miss."'
                  : `"Let's dive into ${lesson.title.toLowerCase()}."`}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content Section */}
        {content.sections.length > 0 ? (
          <View style={styles.contentCard}>
            <View style={styles.sectionHeader}>
              {content.sections[currentSection].icon && (
                <Text style={styles.sectionIcon}>
                  {content.sections[currentSection].icon}
                </Text>
              )}
              <Text style={styles.sectionTitle}>
                {content.sections[currentSection].title}
              </Text>
            </View>
            <Text style={styles.sectionContent}>
              {content.sections[currentSection].content}
            </Text>
          </View>
        ) : (
          <View style={styles.contentCard}>
            <Text style={styles.sectionTitle}>{lesson.title}</Text>
            <Text style={styles.sectionContent}>{lesson.subtitle}</Text>
            <View style={styles.objectivesList}>
              <Text style={styles.objectivesTitle}>Learning Objectives:</Text>
              {lesson.objectives.map((objective, index) => (
                <View key={index} style={styles.objectiveItem}>
                  <Text style={styles.objectiveBullet}>•</Text>
                  <Text style={styles.objectiveText}>{objective}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Section Dots */}
        {totalSections > 1 && (
          <View style={styles.dotsContainer}>
            {content.sections.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  index === currentSection && styles.dotActive,
                  index === currentSection && { backgroundColor: mentor.color },
                ]}
                onPress={() => setCurrentSection(index)}
              />
            ))}
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresRow}>
          {lesson.hasQuiz && (
            <View style={[styles.featureBadge, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={[styles.featureText, { color: '#8b5cf6' }]}>Quiz Available</Text>
            </View>
          )}
          {lesson.hasSimulation && (
            <View style={[styles.featureBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <Text style={styles.featureIcon}>🎮</Text>
              <Text style={[styles.featureText, { color: '#f59e0b' }]}>Simulation</Text>
            </View>
          )}
          {lesson.hasTool && (
            <View style={[styles.featureBadge, { backgroundColor: 'rgba(20, 184, 166, 0.2)' }]}>
              <Text style={styles.featureIcon}>🔧</Text>
              <Text style={[styles.featureText, { color: '#14b8a6' }]}>Tool Access</Text>
            </View>
          )}
        </View>

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentSection === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentSection === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentSection === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonPrimary]}
          onPress={handleNext}
        >
          <LinearGradient
            colors={mentor.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.navButtonGradient}
          >
            <Text style={styles.navButtonPrimaryText}>
              {isLastSection ? (hasQuiz ? 'Take Quiz' : 'Complete') : 'Next →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  progressIndicator: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: '#8b5cf6',
  },
  progressBarContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  mentorCard: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mentorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorEmoji: {
    fontSize: 28,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  mentorQuote: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  contentCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  sectionContent: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  objectivesList: {
    marginTop: spacing.lg,
  },
  objectivesTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  objectiveBullet: {
    fontSize: typography.sizes.md,
    color: '#8b5cf6',
    marginRight: spacing.sm,
  },
  objectiveText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 24,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  featureIcon: {
    fontSize: 14,
  },
  featureText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
  },
  navigationBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonPrimary: {
    backgroundColor: 'transparent',
    padding: 0,
    overflow: 'hidden',
  },
  navButtonGradient: {
    width: '100%',
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  navButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
  },
  navButtonTextDisabled: {
    color: colors.text.muted,
  },
  navButtonPrimaryText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.medium,
    color: colors.text.muted,
    marginBottom: spacing.lg,
  },
});

export default LessonDetailScreen;
