// Spirit Animal Quiz Screen
// Risk assessment quiz to determine user's trading spirit animal

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlowButton } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import {
  RISK_ASSESSMENT_QUESTIONS,
  SPIRIT_ANIMALS,
  calculateRiskProfile,
  SpiritAnimalProfile,
} from '../../data/riskAssessmentQuiz';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

type QuizState = 'intro' | 'quiz' | 'results';

const SpiritAnimalQuizScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<{
    primary: SpiritAnimalProfile;
    secondary: SpiritAnimalProfile;
    confidence: number;
  } | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const totalQuestions = RISK_ASSESSMENT_QUESTIONS.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleStartQuiz = () => {
    animateTransition(() => {
      setQuizState('quiz');
      setCurrentQuestion(0);
      setAnswers([]);
      setSelectedAnswer(null);
    });
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      animateTransition(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      });
    } else {
      // Calculate results
      const result = calculateRiskProfile(newAnswers);
      animateTransition(() => {
        setResults({
          primary: result.primary,
          secondary: result.secondary,
          confidence: result.confidence,
        });
        setQuizState('results');
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      animateTransition(() => {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedAnswer(answers[currentQuestion - 1] ?? null);
        setAnswers(answers.slice(0, -1));
      });
    }
  };

  const handleRetake = () => {
    animateTransition(() => {
      setQuizState('intro');
      setCurrentQuestion(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setResults(null);
    });
  };

  const handleDone = () => {
    navigation.goBack();
  };

  const renderIntro = () => (
    <Animated.View style={[styles.introContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['rgba(57, 255, 20, 0.15)', 'rgba(0, 240, 255, 0.1)', 'transparent']}
        style={styles.introGradient}
      >
        <View style={styles.introContent}>
          <Ionicons name="paw-outline" size={48} color={colors.neon.green} />
          <Text style={styles.introTitle}>Discover Your{'\n'}Spirit Animal</Text>
          <Text style={styles.introSubtitle}>
            Answer 15 questions about your trading style to find your perfect animal mentor
          </Text>
        </View>
      </LinearGradient>

      <GlassCard style={styles.introCard}>
        <Text style={styles.introCardTitle}>What You'll Learn</Text>
        <View style={styles.introList}>
          <View style={styles.introListItem}>
            <Ionicons name="shield-outline" size={20} color={colors.neon.green} />
            <Text style={styles.introListText}>Your natural risk tolerance</Text>
          </View>
          <View style={styles.introListItem}>
            <Ionicons name="analytics-outline" size={20} color={colors.neon.green} />
            <Text style={styles.introListText}>Ideal trading strategies for you</Text>
          </View>
          <View style={styles.introListItem}>
            <Ionicons name="flash-outline" size={20} color={colors.neon.green} />
            <Text style={styles.introListText}>Your trading strengths</Text>
          </View>
          <View style={styles.introListItem}>
            <Ionicons name="map-outline" size={20} color={colors.neon.green} />
            <Text style={styles.introListText}>Personalized learning path</Text>
          </View>
        </View>
      </GlassCard>

      <View style={styles.animalPreview}>
        <Text style={styles.previewTitle}>16 Possible Spirit Animals</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.animalScroll}
        >
          {SPIRIT_ANIMALS.map((animal) => (
            <View key={animal.id} style={styles.animalPreviewItem}>
              <Text style={styles.animalPreviewEmoji}>{animal.emoji}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <GlowButton
        title="Start Quiz"
        onPress={handleStartQuiz}
        fullWidth
        style={styles.startButton}
      />
    </Animated.View>
  );

  const renderQuiz = () => {
    const question = RISK_ASSESSMENT_QUESTIONS[currentQuestion];

    return (
      <Animated.View
        style={[
          styles.quizContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Question {currentQuestion + 1} of {totalQuestions}
            </Text>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={[colors.neon.green, colors.neon.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
        </View>

        {/* Question */}
        <GlassCard style={styles.questionCard}>
          <Text style={styles.questionText}>{question.question}</Text>
        </GlassCard>

        {/* Options */}
        <ScrollView
          style={styles.optionsScroll}
          contentContainerStyle={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.optionSelected,
              ]}
              onPress={() => handleSelectAnswer(index)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.optionIndicator,
                selectedAnswer === index && styles.optionIndicatorSelected,
              ]}>
                <Text style={[
                  styles.optionLetter,
                  selectedAnswer === index && styles.optionLetterSelected,
                ]}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.optionTextSelected,
              ]}>
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navContainer}>
          {currentQuestion > 0 ? (
            <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
              <Text style={styles.backButtonText}>{'<'} Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backButtonPlaceholder} />
          )}

          <GlowButton
            title={currentQuestion === totalQuestions - 1 ? 'See Results' : 'Next'}
            onPress={handleNext}
            disabled={selectedAnswer === null}
            style={styles.nextButton}
          />
        </View>
      </Animated.View>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    const { primary, secondary, confidence } = results;
    const confidencePercent = Math.round(confidence * 100);

    return (
      <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.resultsScroll}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <LinearGradient
            colors={[`${primary.color}30`, `${primary.color}10`, 'transparent']}
            style={styles.resultsHero}
          >
            <Text style={styles.resultsLabel}>Your Spirit Animal Is</Text>
            <View style={[styles.resultAvatarContainer, { borderColor: primary.color }]}>
              <Text style={styles.resultAvatarEmoji}>{primary.emoji}</Text>
            </View>
            <Text style={[styles.resultAnimalName, { color: primary.color }]}>
              The {primary.name}
            </Text>
            <Text style={styles.resultTitle}>{primary.title}</Text>
          </LinearGradient>

          {/* Confidence */}
          <GlassCard style={styles.confidenceCard}>
            <View style={styles.confidenceRow}>
              <Text style={styles.confidenceLabel}>Match Confidence</Text>
              <Text style={[styles.confidenceValue, { color: primary.color }]}>
                {confidencePercent}%
              </Text>
            </View>
            <View style={styles.confidenceBarBg}>
              <View
                style={[
                  styles.confidenceBarFill,
                  { width: `${confidencePercent}%`, backgroundColor: primary.color },
                ]}
              />
            </View>
          </GlassCard>

          {/* Description */}
          <GlassCard style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{primary.description}</Text>
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Risk Level:</Text>
              <View style={styles.riskStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text
                    key={star}
                    style={[
                      styles.riskStar,
                      star <= primary.riskLevel && { color: colors.neon.yellow },
                    ]}
                  >
                    {star <= primary.riskLevel ? '' : ''}
                  </Text>
                ))}
              </View>
            </View>
          </GlassCard>

          {/* Trading Style */}
          <GlassCard style={styles.styleCard}>
            <Text style={styles.sectionTitle}>Your Trading Style</Text>
            <Text style={styles.styleText}>{primary.tradingStyle}</Text>
          </GlassCard>

          {/* Strengths */}
          <GlassCard style={styles.strengthsCard}>
            <Text style={styles.sectionTitle}>Your Strengths</Text>
            <View style={styles.strengthsList}>
              {primary.strengths.map((strength, index) => (
                <View key={index} style={styles.strengthItem}>
                  <Text style={styles.strengthDot}></Text>
                  <Text style={styles.strengthText}>{strength}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Recommended Strategies */}
          <GlassCard style={styles.strategiesCard}>
            <Text style={styles.sectionTitle}>Recommended Strategies</Text>
            <View style={styles.strategiesList}>
              {primary.recommendedStrategies.map((strategy, index) => (
                <View key={index} style={[styles.strategyTag, { borderColor: primary.color }]}>
                  <Text style={[styles.strategyText, { color: primary.color }]}>
                    {strategy}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Secondary Animal */}
          <GlassCard style={styles.secondaryCard}>
            <View style={styles.secondaryHeader}>
              <Text style={styles.secondaryLabel}>Secondary Match</Text>
              <View style={[styles.secondaryAvatar, { borderColor: secondary.color }]}>
                <Text style={styles.secondaryEmoji}>{secondary.emoji}</Text>
              </View>
              <View style={styles.secondaryInfo}>
                <Text style={[styles.secondaryName, { color: secondary.color }]}>
                  {secondary.name}
                </Text>
                <Text style={styles.secondaryTitle}>{secondary.title}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <GlowButton
              title="Continue to Academy"
              onPress={handleDone}
              fullWidth
              style={styles.doneButton}
            />
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
              <Text style={styles.retakeText}>Retake Quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Text style={styles.headerBackText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spirit Animal Quiz</Text>
        <View style={styles.headerSpacer} />
      </View>

      {quizState === 'intro' && renderIntro()}
      {quizState === 'quiz' && renderQuiz()}
      {quizState === 'results' && renderResults()}
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
  },
  headerBack: {
    padding: 8,
  },
  headerBackText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.neon.green,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },

  // Intro styles
  introContainer: {
    flex: 1,
  },
  introGradient: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  introContent: {
    alignItems: 'center',
  },
  introTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['3xl'],
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 42,
  },
  introSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 280,
  },
  introCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  introCardTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  introList: {
    gap: spacing.sm,
  },
  introListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  introListText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  animalPreview: {
    marginBottom: spacing.lg,
  },
  previewTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  animalScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  animalPreviewItem: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalPreviewEmoji: {
    fontSize: 24,
  },
  startButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },

  // Quiz styles
  quizContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  progressPercent: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.neon.green,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  questionCard: {
    marginBottom: spacing.lg,
  },
  questionText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    lineHeight: 28,
  },
  optionsScroll: {
    flex: 1,
  },
  optionsContainer: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  optionSelected: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    borderColor: colors.neon.green,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionIndicatorSelected: {
    backgroundColor: colors.neon.green,
  },
  optionLetter: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.muted,
  },
  optionLetterSelected: {
    color: colors.background.primary,
  },
  optionText: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  optionTextSelected: {
    color: colors.text.primary,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.md,
  },
  backButtonText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.text.muted,
  },
  backButtonPlaceholder: {
    width: 80,
  },
  nextButton: {
    flex: 1,
    maxWidth: 200,
  },

  // Results styles
  resultsContainer: {
    flex: 1,
  },
  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: spacing['2xl'],
  },
  resultsHero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  resultsLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultAvatarContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: spacing.md,
    ...shadows.neonGreen,
  },
  resultAvatarEmoji: {
    fontSize: 64,
  },
  resultAnimalName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['3xl'],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  resultTitle: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  confidenceCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  confidenceLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  confidenceValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
  },
  confidenceBarBg: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  descriptionCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  descriptionText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  riskLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  riskStars: {
    flexDirection: 'row',
    gap: 2,
  },
  riskStar: {
    fontSize: 16,
    color: colors.text.muted,
  },
  styleCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  styleText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  strengthsCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  strengthsList: {
    gap: spacing.xs,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  strengthDot: {
    fontSize: 12,
    color: colors.neon.green,
  },
  strengthText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  strategiesCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  strategiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  strategyTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  strategyText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
  },
  secondaryCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  secondaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    position: 'absolute',
    top: -8,
    left: 0,
  },
  secondaryAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  secondaryEmoji: {
    fontSize: 24,
  },
  secondaryInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  secondaryName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  secondaryTitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  actionsContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  doneButton: {},
  retakeButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  retakeText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.text.muted,
  },
});

export default SpiritAnimalQuizScreen;
