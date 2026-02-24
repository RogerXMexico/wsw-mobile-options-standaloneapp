// Quiz Screen for Wall Street Wildlife Mobile
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { LearnStackParamList } from '../../navigation/types';
import { getQuizByTier, QuizQuestion } from '../../data/quizData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type QuizRouteProp = RouteProp<LearnStackParamList, 'Quiz'>;
type QuizNavProp = NativeStackNavigationProp<LearnStackParamList, 'Quiz'>;

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<QuizNavProp>();
  const route = useRoute<QuizRouteProp>();
  const { tierId } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Get quiz data
  const quizTier = useMemo(() => getQuizByTier(tierId), [tierId]);
  const questions = quizTier?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Animate question transition
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

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => [...prev, isCorrect]);

    // Show explanation after short delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Navigate to results
      navigation.replace('QuizResults', {
        score,
        total: questions.length,
        tierId,
      });
    } else {
      animateTransition(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      });
    }
  };

  const getAnswerStyle = (index: number) => {
    if (selectedAnswer === null) {
      return styles.answerOption;
    }

    if (index === currentQuestion.correctAnswer) {
      return [styles.answerOption, styles.answerCorrect];
    }

    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return [styles.answerOption, styles.answerIncorrect];
    }

    return [styles.answerOption, styles.answerDisabled];
  };

  const getAnswerTextStyle = (index: number) => {
    if (selectedAnswer === null) {
      return styles.answerText;
    }

    if (index === currentQuestion.correctAnswer) {
      return [styles.answerText, { color: colors.success }];
    }

    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return [styles.answerText, { color: colors.error }];
    }

    return [styles.answerText, { color: colors.text.muted }];
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No questions available for this tier.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={18} color={colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.tierName}>{quizTier?.tierName || 'Quiz'}</Text>
          <Text style={styles.questionCount}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Question Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Question */}
        <View style={styles.questionContainer}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {currentQuestion.difficulty.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Answers */}
        <View style={styles.answersContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getAnswerStyle(index)}
              onPress={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              activeOpacity={0.7}
            >
              <View style={styles.answerLetter}>
                <Text style={styles.answerLetterText}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={getAnswerTextStyle(index)}>{option}</Text>
              {selectedAnswer !== null && index === currentQuestion.correctAnswer && (
                <Ionicons name="checkmark-circle" size={20} color={colors.success} style={{ marginLeft: spacing.sm }} />
              )}
              {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                <Ionicons name="close-circle" size={20} color={colors.error} style={{ marginLeft: spacing.sm }} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {showExplanation && (
          <View style={styles.explanationContainer}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={selectedAnswer === currentQuestion.correctAnswer ? 'sparkles' : 'bulb-outline'}
                size={24}
                color={selectedAnswer === currentQuestion.correctAnswer ? colors.neon.yellow : colors.neon.cyan}
                style={{ marginRight: spacing.sm }}
              />
              <Text style={styles.explanationTitle}>
                {selectedAnswer === currentQuestion.correctAnswer
                  ? 'Correct!'
                  : 'Not quite!'}
              </Text>
            </View>
            <Text style={styles.explanationText}>
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Next Button */}
      {showExplanation && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.background.primary} />
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  tierName: {
    ...typography.styles.label,
    color: colors.neon.green,
  },
  questionCount: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: colors.neon.green + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  scoreText: {
    ...typography.styles.h4,
    color: colors.neon.green,
  },
  scoreLabel: {
    ...typography.styles.caption,
    color: colors.neon.green,
    fontSize: 10,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.neon.green,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  questionContainer: {
    marginBottom: spacing.xl,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  difficultyText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  questionText: {
    ...typography.styles.h4,
    color: colors.text.primary,
    lineHeight: 28,
  },
  answersContainer: {
    gap: spacing.md,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  answerCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  answerIncorrect: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  answerDisabled: {
    opacity: 0.5,
  },
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  answerLetterText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontWeight: typography.weights.bold,
  },
  answerText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  explanationContainer: {
    marginTop: spacing.xl,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  explanationTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  explanationText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  nextButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    ...typography.styles.button,
    color: colors.text.primary,
  },
});

export default QuizScreen;
