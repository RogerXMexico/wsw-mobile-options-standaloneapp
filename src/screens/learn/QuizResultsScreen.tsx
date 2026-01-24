// Quiz Results Screen for Wall Street Wildlife Mobile
import React, { useEffect, useRef } from 'react';
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
import { colors, typography, spacing, borderRadius } from '../../theme';
import { LearnStackParamList } from '../../navigation/types';
import { getQuizByTier } from '../../data/quizData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ResultsRouteProp = RouteProp<LearnStackParamList, 'QuizResults'>;
type ResultsNavProp = NativeStackNavigationProp<LearnStackParamList, 'QuizResults'>;

const QuizResultsScreen: React.FC = () => {
  const navigation = useNavigation<ResultsNavProp>();
  const route = useRoute<ResultsRouteProp>();
  const { score, total, tierId } = route.params;

  const quizTier = getQuizByTier(tierId);
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= (quizTier?.passingScore || 70);

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate entrance
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: percentage,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, []);

  const getMascotMessage = () => {
    if (percentage === 100) {
      return { emoji: '🦁', message: 'Perfect score! You are the king of the jungle!' };
    } else if (percentage >= 90) {
      return { emoji: '🦅', message: 'Soaring high! Nearly flawless performance!' };
    } else if (percentage >= 80) {
      return { emoji: '🦊', message: 'Clever work! You\'ve got sharp instincts!' };
    } else if (percentage >= 70) {
      return { emoji: '🐕', message: 'Good boy/girl! You passed the test!' };
    } else if (percentage >= 50) {
      return { emoji: '🐢', message: 'Slow and steady... Keep learning!' };
    } else {
      return { emoji: '🦥', message: 'Take your time... Review and try again!' };
    }
  };

  const mascot = getMascotMessage();

  const getScoreColor = () => {
    if (percentage >= 80) return colors.success;
    if (percentage >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Mascot & Result */}
        <Animated.View
          style={[
            styles.resultCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.mascotEmoji}>{mascot.emoji}</Text>

          <View style={styles.scoreCircle}>
            <Text style={[styles.percentageText, { color: getScoreColor() }]}>
              {percentage}%
            </Text>
            <Text style={styles.scoreDetail}>
              {score} / {total}
            </Text>
          </View>

          <View style={[
            styles.resultBadge,
            { backgroundColor: passed ? colors.success + '20' : colors.error + '20' }
          ]}>
            <Text style={[
              styles.resultBadgeText,
              { color: passed ? colors.success : colors.error }
            ]}>
              {passed ? '✓ PASSED' : '✗ NOT YET'}
            </Text>
          </View>

          <Text style={styles.mascotMessage}>{mascot.message}</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{total - score}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{quizTier?.passingScore || 70}%</Text>
            <Text style={styles.statLabel}>To Pass</Text>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <Animated.View style={[styles.progressSection, { opacity: fadeAnim }]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Your Score</Text>
            <Text style={[styles.progressValue, { color: getScoreColor() }]}>
              {percentage}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: getScoreColor(),
                },
              ]}
            />
            {/* Passing threshold marker */}
            <View
              style={[
                styles.thresholdMarker,
                { left: `${quizTier?.passingScore || 70}%` }
              ]}
            />
          </View>
          <View style={styles.progressLegend}>
            <Text style={styles.legendText}>0%</Text>
            <Text style={[styles.legendText, { color: colors.warning }]}>
              {quizTier?.passingScore || 70}% pass
            </Text>
            <Text style={styles.legendText}>100%</Text>
          </View>
        </Animated.View>

        {/* XP Earned */}
        <Animated.View style={[styles.xpCard, { opacity: fadeAnim }]}>
          <Text style={styles.xpEmoji}>⚡</Text>
          <View>
            <Text style={styles.xpAmount}>+{score * 10} XP</Text>
            <Text style={styles.xpLabel}>Experience earned</Text>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {!passed && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.replace('Quiz', { tierId })}
          >
            <Text style={styles.retryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Strategies')}
        >
          <Text style={styles.continueButtonText}>
            {passed ? '🎉 Continue Learning' : 'Review Strategies'}
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  mascotEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  percentageText: {
    fontSize: 56,
    fontWeight: typography.weights.bold,
  },
  scoreDetail: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  resultBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  resultBadgeText: {
    ...typography.styles.label,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  mascotMessage: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.default,
  },
  progressSection: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  progressValue: {
    ...typography.styles.label,
    fontWeight: typography.weights.bold,
  },
  progressTrack: {
    height: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  thresholdMarker: {
    position: 'absolute',
    top: -2,
    width: 2,
    height: 16,
    backgroundColor: colors.warning,
    marginLeft: -1,
  },
  progressLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  legendText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neon.yellow + '15',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.neon.yellow + '30',
    gap: spacing.md,
  },
  xpEmoji: {
    fontSize: 32,
  },
  xpAmount: {
    ...typography.styles.h4,
    color: colors.neon.yellow,
  },
  xpLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  retryButtonText: {
    ...typography.styles.button,
    color: colors.text.primary,
  },
  continueButton: {
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  continueButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
});

export default QuizResultsScreen;
