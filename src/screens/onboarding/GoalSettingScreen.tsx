// Goal Setting Screen - What does the user want to achieve?
// Helps personalize the learning experience

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface Goal {
  id: string;
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const GOALS: Goal[] = [
  {
    id: 'income',
    emoji: '💰',
    title: 'Generate Income',
    description: 'Earn consistent returns by selling premium',
    color: colors.neon.green,
  },
  {
    id: 'hedge',
    emoji: '🛡️',
    title: 'Protect My Portfolio',
    description: 'Learn to hedge positions and manage risk',
    color: colors.neon.cyan,
  },
  {
    id: 'speculate',
    emoji: '🚀',
    title: 'Speculative Gains',
    description: 'Capture big moves with directional plays',
    color: colors.neon.purple,
  },
  {
    id: 'understand',
    emoji: '🧠',
    title: 'Understand Options',
    description: 'Build a solid foundation of knowledge',
    color: colors.neon.yellow,
  },
  {
    id: 'advanced',
    emoji: '⚡',
    title: 'Master Advanced Strategies',
    description: 'Level up with complex multi-leg trades',
    color: colors.neon.orange,
  },
  {
    id: 'events',
    emoji: '📅',
    title: 'Trade Market Events',
    description: 'Profit from earnings and economic releases',
    color: colors.neon.pink,
  },
];

interface TimeCommitment {
  id: string;
  label: string;
  description: string;
}

const TIME_COMMITMENTS: TimeCommitment[] = [
  { id: 'casual', label: '5-10 min/day', description: 'Casual learner' },
  { id: 'regular', label: '15-30 min/day', description: 'Regular practice' },
  { id: 'dedicated', label: '1+ hour/day', description: 'Dedicated trader' },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const GoalSettingScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : prev.length < 3
        ? [...prev, goalId]
        : prev
    );
  };

  const handleContinue = async () => {
    // Save user preferences
    await AsyncStorage.setItem('userGoals', JSON.stringify(selectedGoals));
    await AsyncStorage.setItem('userTimeCommitment', selectedTime || 'regular');
    onNext();
  };

  const canContinue = selectedGoals.length > 0 && selectedTime !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Set Your Goals</Text>
            <Text style={styles.subtitle}>
              Select up to 3 goals to personalize your learning path
            </Text>
          </View>

          {/* Goals Grid */}
          <View style={styles.goalsContainer}>
            {GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    isSelected && styles.goalCardSelected,
                    isSelected && { borderColor: goal.color },
                  ]}
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.goalIconContainer,
                      { backgroundColor: `${goal.color}20` },
                    ]}
                  >
                    <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                  </View>
                  <Text style={[styles.goalTitle, isSelected && { color: goal.color }]}>
                    {goal.title}
                  </Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: goal.color }]}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Time Commitment Section */}
          <View style={styles.timeSection}>
            <Text style={styles.sectionTitle}>Daily Commitment</Text>
            <Text style={styles.sectionSubtitle}>
              How much time can you dedicate to learning?
            </Text>

            <View style={styles.timeOptions}>
              {TIME_COMMITMENTS.map((time) => {
                const isSelected = selectedTime === time.id;
                return (
                  <TouchableOpacity
                    key={time.id}
                    style={[
                      styles.timeOption,
                      isSelected && styles.timeOptionSelected,
                    ]}
                    onPress={() => setSelectedTime(time.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.timeLabel,
                        isSelected && styles.timeLabelSelected,
                      ]}
                    >
                      {time.label}
                    </Text>
                    <Text style={styles.timeDescription}>{time.description}</Text>
                    {isSelected && (
                      <View style={styles.timeCheckmark}>
                        <Text style={styles.timeCheckmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        {selectedGoals.length > 0 && (
          <Text style={styles.selectionCount}>
            {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {canContinue ? 'Find Your Spirit Animal' : 'Select Goals & Time'}
          </Text>
          {canContinue && <Text style={styles.continueArrow}>→</Text>}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.muted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  goalCard: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.default,
    position: 'relative',
  },
  goalCardSelected: {
    backgroundColor: colors.background.tertiary,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  goalDescription: {
    ...typography.styles.caption,
    color: colors.text.muted,
    lineHeight: 18,
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: colors.background.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.styles.body,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  timeOptions: {
    gap: spacing.sm,
  },
  timeOption: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.default,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeOptionSelected: {
    borderColor: colors.neon.green,
    backgroundColor: colors.background.tertiary,
  },
  timeLabel: {
    ...typography.styles.label,
    color: colors.text.primary,
    flex: 1,
  },
  timeLabelSelected: {
    color: colors.neon.green,
  },
  timeDescription: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginRight: spacing.md,
  },
  timeCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCheckmarkText: {
    color: colors.background.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  selectionCount: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.neonGreenSubtle,
  },
  continueButtonDisabled: {
    backgroundColor: colors.background.tertiary,
    ...shadows.dark,
  },
  continueButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  continueArrow: {
    fontSize: 20,
    color: colors.background.primary,
    fontWeight: '600',
  },
});

export default GoalSettingScreen;
