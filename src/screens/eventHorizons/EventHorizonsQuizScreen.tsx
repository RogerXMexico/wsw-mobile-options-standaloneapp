// Event Horizons Quiz Screen
// Interactive quiz component using the new Event Horizons quiz data
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { LearnStackParamList } from '../../navigation/types';
import {
  getQuizByLessonId,
  calculateQuizScore,
  QuizQuestion,
  LessonQuiz,
} from '../../data/eventHorizonsQuizzes';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<LearnStackParamList>;
type RouteType = RouteProp<LearnStackParamList, 'EventHorizonsQuiz'>;

// Mentor gradients and colors
const MENTOR_STYLES = {
  chameleon: {
    gradient: ['#8b5cf6', '#14b8a6'] as [string, string],
    color: '#8b5cf6',
    emoji: '🦎',
  },
  cheetah: {
    gradient: ['#f59e0b', '#ef4444'] as [string, string],
    color: '#f59e0b',
    emoji: '🐆',
  },
  owl: {
    gradient: ['#3b82f6', '#8b5cf6'] as [string, string],
    color: '#3b82f6',
    emoji: '🦉',
  },
};

const EventHorizonsQuizScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { lessonId } = route.params;

  // Get quiz data
  const quiz = useMemo(() => getQuizByLessonId(lessonId), [lessonId]);

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  if (!quiz) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>📚</Text>
          <Text style={styles.errorText}>No quiz available for this lesson</Text>
          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonLargeText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const mentorStyle = MENTOR_STYLES[currentQuestion.mentor] || MENTOR_STYLES.chameleon;

  // Handle answer selection
  const handleSelectAnswer = (optionId: string) => {
    if (selectedAnswers[currentQuestion.id]) return; // Already answered

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));

    // Show explanation after brief delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 300);
  };

  // Animate transition
  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(callback, 150);
  };

  // Handle next question
  const handleNext = () => {
    if (isLastQuestion) {
      setQuizComplete(true);
    } else {
      animateTransition(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setShowExplanation(false);
      });
    }
  };

  // Calculate results
  const results = useMemo(() => {
    if (!quizComplete) return null;
    return calculateQuizScore(selectedAnswers, quiz);
  }, [quizComplete, selectedAnswers, quiz]);

  // Get option styling based on selection state
  const getOptionStyle = (option: { id: string; isCorrect: boolean }) => {
    const selected = selectedAnswers[currentQuestion.id];
    if (!selected) return styles.option;

    if (option.isCorrect) {
      return [styles.option, styles.optionCorrect];
    }
    if (selected === option.id && !option.isCorrect) {
      return [styles.option, styles.optionIncorrect];
    }
    return [styles.option, styles.optionDisabled];
  };

  // Results screen
  if (quizComplete && results) {
    const passed = results.passed;
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.resultsContent}
        >
          {/* Results Header */}
          <LinearGradient
            colors={passed ? ['rgba(16, 185, 129, 0.3)', 'transparent'] : ['rgba(239, 68, 68, 0.3)', 'transparent']}
            style={styles.resultsHeader}
          >
            <Text style={styles.resultsEmoji}>{passed ? '🎉' : '📚'}</Text>
            <Text style={styles.resultsTitle}>
              {passed ? 'Quiz Passed!' : 'Keep Learning'}
            </Text>
            <Text style={styles.resultsSubtitle}>{quiz.title}</Text>
          </LinearGradient>

          {/* Score Card */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scorePercentage, { color: passed ? '#10b981' : '#ef4444' }]}>
                {results.percentage}%
              </Text>
              <Text style={styles.scoreLabel}>
                {results.score}/{results.total} Correct
              </Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreDetails}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreDetailLabel}>Passing Score:</Text>
                <Text style={styles.scoreDetailValue}>{quiz.passingScore}%</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreDetailLabel}>Your Score:</Text>
                <Text style={[styles.scoreDetailValue, { color: passed ? '#10b981' : '#ef4444' }]}>
                  {results.percentage}%
                </Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreDetailLabel}>Status:</Text>
                <Text style={[styles.scoreDetailValue, { color: passed ? '#10b981' : '#ef4444' }]}>
                  {passed ? '✓ Passed' : '✗ Not Passed'}
                </Text>
              </View>
            </View>
          </View>

          {/* XP Earned */}
          {passed && (
            <View style={styles.xpCard}>
              <Text style={styles.xpEmoji}>⚡</Text>
              <View>
                <Text style={styles.xpTitle}>+150 XP Earned!</Text>
                <Text style={styles.xpSubtitle}>Quiz completion bonus</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.resultActions}>
            {!passed && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers({});
                  setShowExplanation(false);
                  setQuizComplete(false);
                }}
              >
                <Text style={styles.retryButtonText}>🔄 Try Again</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate('EventHorizonsLessons')}
            >
              <LinearGradient
                colors={['#39ff14', '#14b8a6']}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {passed ? 'Continue Learning' : 'Back to Lessons'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Question Review */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Question Review</Text>
            {questions.map((q, index) => {
              const selected = selectedAnswers[q.id];
              const correctOption = q.options.find((o) => o.isCorrect);
              const isCorrect = selected === correctOption?.id;
              return (
                <View key={q.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewStatus, { color: isCorrect ? '#10b981' : '#ef4444' }]}>
                      {isCorrect ? '✓' : '✗'}
                    </Text>
                    <Text style={styles.reviewQuestion} numberOfLines={2}>
                      Q{index + 1}: {q.question}
                    </Text>
                  </View>
                  {!isCorrect && (
                    <Text style={styles.reviewCorrect}>
                      Correct: {correctOption?.text}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Quiz screen
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{quiz.title}</Text>
          <Text style={styles.headerSubtitle}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Text>
        </View>
        <View style={[styles.mentorBadge, { backgroundColor: `${mentorStyle.color}30` }]}>
          <Text style={styles.mentorEmoji}>{mentorStyle.emoji}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={mentorStyle.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Difficulty Badge */}
          <View style={styles.difficultyRow}>
            <View style={[
              styles.difficultyBadge,
              currentQuestion.difficulty === 'beginner' && styles.difficultyBeginner,
              currentQuestion.difficulty === 'intermediate' && styles.difficultyIntermediate,
              currentQuestion.difficulty === 'advanced' && styles.difficultyAdvanced,
            ]}>
              <Text style={styles.difficultyText}>
                {currentQuestion.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Question */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const selected = selectedAnswers[currentQuestion.id];
              const isSelected = selected === option.id;
              const showResult = !!selected;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={getOptionStyle(option)}
                  onPress={() => handleSelectAnswer(option.id)}
                  disabled={!!selected}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.optionLetter,
                    isSelected && option.isCorrect && styles.optionLetterCorrect,
                    isSelected && !option.isCorrect && styles.optionLetterIncorrect,
                  ]}>
                    <Text style={styles.optionLetterText}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.optionText,
                    showResult && option.isCorrect && styles.optionTextCorrect,
                    isSelected && !option.isCorrect && styles.optionTextIncorrect,
                  ]}>
                    {option.text}
                  </Text>
                  {showResult && option.isCorrect && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                  {isSelected && !option.isCorrect && (
                    <Text style={styles.crossmark}>✗</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <View style={styles.explanationCard}>
              <LinearGradient
                colors={[`${mentorStyle.color}20`, 'transparent']}
                style={styles.explanationGradient}
              >
                <View style={styles.explanationHeader}>
                  <Text style={styles.explanationEmoji}>{mentorStyle.emoji}</Text>
                  <Text style={[styles.explanationTitle, { color: mentorStyle.color }]}>
                    {selectedAnswers[currentQuestion.id] ===
                    currentQuestion.options.find((o) => o.isCorrect)?.id
                      ? 'Excellent!'
                      : 'Not quite...'}
                  </Text>
                </View>
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
              </LinearGradient>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Next Button */}
      {showExplanation && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={mentorStyle.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? 'See Results' : 'Next Question →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  mentorBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorEmoji: {
    fontSize: 20,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  difficultyRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyBeginner: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  difficultyIntermediate: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  difficultyAdvanced: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    color: colors.text.secondary,
    letterSpacing: 1,
  },
  questionCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  questionText: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  optionIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionLetterCorrect: {
    backgroundColor: '#10b981',
  },
  optionLetterIncorrect: {
    backgroundColor: '#ef4444',
  },
  optionLetterText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  optionText: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
    lineHeight: 22,
  },
  optionTextCorrect: {
    color: '#10b981',
  },
  optionTextIncorrect: {
    color: '#ef4444',
  },
  checkmark: {
    fontSize: 20,
    color: '#10b981',
    marginLeft: spacing.sm,
  },
  crossmark: {
    fontSize: 20,
    color: '#ef4444',
    marginLeft: spacing.sm,
  },
  explanationCard: {
    marginTop: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  explanationGradient: {
    padding: spacing.lg,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  explanationEmoji: {
    fontSize: 24,
  },
  explanationTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
  },
  explanationText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.bold,
    color: '#000',
  },
  // Results styles
  resultsContent: {
    padding: spacing.lg,
  },
  resultsHeader: {
    alignItems: 'center',
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  resultsEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  resultsTitle: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  resultsSubtitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  scoreCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scorePercentage: {
    fontSize: 48,
    fontFamily: typography.fonts.bold,
  },
  scoreLabel: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  scoreDivider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.md,
  },
  scoreDetails: {
    gap: spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreDetailLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  scoreDetailValue: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.3)',
  },
  xpEmoji: {
    fontSize: 32,
  },
  xpTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: '#39ff14',
  },
  xpSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  resultActions: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.bold,
    color: '#000',
  },
  reviewSection: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  reviewTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  reviewItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  reviewStatus: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
  },
  reviewQuestion: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  reviewCorrect: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: '#10b981',
    marginLeft: spacing.xl,
    marginTop: spacing.xs,
  },
  // Error screen
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.medium,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backButtonLarge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  backButtonLargeText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
  },
});

export default EventHorizonsQuizScreen;
