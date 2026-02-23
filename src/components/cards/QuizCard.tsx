// QuizCard - Displays a quiz topic card with completion status and score
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface QuizCardProps {
  title: string;
  questionCount: number;
  completed?: boolean;
  score?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  title,
  questionCount,
  completed = false,
  score,
  onPress,
  style,
}) => {
  const scoreColor =
    score !== undefined
      ? score >= 80
        ? colors.neon.green
        : score >= 60
        ? colors.neon.yellow
        : colors.neon.red
      : colors.text.secondary;

  return (
    <TouchableOpacity
      style={[styles.card, completed && styles.cardCompleted, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Left icon */}
      <View
        style={[
          styles.iconContainer,
          completed ? styles.iconCompleted : styles.iconDefault,
        ]}
      >
        <Ionicons
          name={completed ? 'checkmark-circle' : 'help-circle-outline'}
          size={28}
          color={completed ? colors.neon.green : colors.neon.cyan}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="document-text-outline" size={12} color={colors.text.muted} />
          <Text style={styles.metaText}>
            {questionCount} question{questionCount !== 1 ? 's' : ''}
          </Text>
          {completed && (
            <>
              <View style={styles.dot} />
              <Ionicons name="checkmark-done" size={12} color={colors.neon.green} />
              <Text style={[styles.metaText, { color: colors.neon.green }]}>
                Completed
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Score / Action */}
      <View style={styles.rightSection}>
        {score !== undefined ? (
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {score}%
            </Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardCompleted: {
    borderColor: colors.neon.green + '30',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDefault: {
    backgroundColor: colors.neon.cyan + '15',
  },
  iconCompleted: {
    backgroundColor: colors.neon.green + '15',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.text.muted,
    marginHorizontal: 4,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    ...typography.styles.h5,
  },
  scoreLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
});

export default QuizCard;
