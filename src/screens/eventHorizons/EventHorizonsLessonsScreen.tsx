// Event Horizons Lessons Screen
// Educational content for prediction market + options integration
import React from 'react';
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
import { EVENT_HORIZONS_LESSONS, EventHorizonsLesson } from '../../data/eventHorizonsLessons';
import { useProgress } from '../../hooks/useProgress';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;

const getMentorInfo = (mentor: string) => {
  switch (mentor) {
    case 'chameleon':
      return { emoji: '🦎', name: 'Chameleon', color: '#8b5cf6' };
    case 'cheetah':
      return { emoji: '🐆', name: 'Cheetah', color: '#f59e0b' };
    case 'owl':
      return { emoji: '🦉', name: 'Owl', color: '#3b82f6' };
    default:
      return { emoji: '🦎', name: 'Chameleon', color: '#8b5cf6' };
  }
};

interface LessonCardProps {
  lesson: EventHorizonsLesson;
  isCompleted: boolean;
  onPress: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isCompleted, onPress }) => {
  const mentor = getMentorInfo(lesson.mentor);

  return (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.lessonHeader}>
        <View style={styles.lessonNumberContainer}>
          <Text style={styles.lessonNumber}>{lesson.number}</Text>
        </View>
        <View style={styles.lessonMeta}>
          <View style={[styles.mentorBadge, { backgroundColor: `${mentor.color}20` }]}>
            <Text style={styles.mentorEmoji}>{mentor.emoji}</Text>
            <Text style={[styles.mentorName, { color: mentor.color }]}>{mentor.name}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeIcon}>⏱️</Text>
            <Text style={styles.timeText}>{lesson.estimatedMinutes} min</Text>
          </View>
        </View>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedIcon}>✓</Text>
          </View>
        )}
      </View>

      <Text style={styles.lessonTitle}>{lesson.title}</Text>
      <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>

      <View style={styles.objectivesContainer}>
        <Text style={styles.objectivesLabel}>You'll learn:</Text>
        {lesson.objectives.slice(0, 2).map((objective, index) => (
          <View key={index} style={styles.objectiveItem}>
            <Text style={styles.objectiveBullet}>•</Text>
            <Text style={styles.objectiveText} numberOfLines={1}>
              {objective}
            </Text>
          </View>
        ))}
        {lesson.objectives.length > 2 && (
          <Text style={styles.moreObjectives}>
            +{lesson.objectives.length - 2} more objectives
          </Text>
        )}
      </View>

      <View style={styles.lessonFooter}>
        <View style={styles.featureBadges}>
          {lesson.hasQuiz && (
            <View style={styles.featureBadge}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={styles.featureText}>Quiz</Text>
            </View>
          )}
          {lesson.hasSimulation && (
            <View style={styles.featureBadge}>
              <Text style={styles.featureIcon}>🎮</Text>
              <Text style={styles.featureText}>Sim</Text>
            </View>
          )}
          {lesson.hasTool && (
            <View style={styles.featureBadge}>
              <Text style={styles.featureIcon}>🔧</Text>
              <Text style={styles.featureText}>Tool</Text>
            </View>
          )}
        </View>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {isCompleted ? 'Review' : 'Start'}
          </Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EventHorizonsLessonsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { progress } = useProgress();

  // Filter completed modules to only Event Horizons lesson IDs
  const ehLessonIds = EVENT_HORIZONS_LESSONS.map((l) => l.id);
  const completedLessons = progress.completedModules.filter((id) =>
    ehLessonIds.includes(id)
  );

  const totalLessons = EVENT_HORIZONS_LESSONS.length;
  const completedCount = completedLessons.length;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

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
          <Text style={styles.headerTitle}>Event Horizons</Text>
          <Text style={styles.headerSubtitle}>Lessons</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.2)', 'rgba(20, 184, 166, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.chameleonLarge}>🦎</Text>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressSubtitle}>
                {completedCount} of {totalLessons} lessons completed
              </Text>
            </View>
            <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <LinearGradient
                colors={['#8b5cf6', '#14b8a6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Lessons List */}
        <View style={styles.lessonsContainer}>
          {EVENT_HORIZONS_LESSONS.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={completedLessons.includes(lesson.id)}
              onPress={() =>
                navigation.navigate('LessonDetail', { lessonId: lesson.id })
              }
            />
          ))}
        </View>

        {/* Bottom Spacing */}
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
  progressCard: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chameleonLarge: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  progressSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  progressPercent: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: '#8b5cf6',
  },
  progressBarContainer: {
    marginTop: spacing.sm,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  lessonsContainer: {
    gap: spacing.md,
  },
  lessonCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  lessonNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  lessonNumber: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.bold,
    color: '#8b5cf6',
  },
  lessonMeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mentorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  mentorEmoji: {
    fontSize: 12,
  },
  mentorName: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeIcon: {
    fontSize: 10,
  },
  timeText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  lessonTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  lessonSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  objectivesContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  objectivesLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  objectiveBullet: {
    fontSize: typography.sizes.sm,
    color: '#8b5cf6',
    marginRight: spacing.xs,
  },
  objectiveText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  moreObjectives: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  lessonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureIcon: {
    fontSize: 10,
  },
  featureText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  startButtonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: '#8b5cf6',
  },
  startButtonArrow: {
    fontSize: typography.sizes.sm,
    color: '#8b5cf6',
  },
});

export default EventHorizonsLessonsScreen;
