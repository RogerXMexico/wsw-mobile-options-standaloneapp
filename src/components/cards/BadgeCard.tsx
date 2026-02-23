// BadgeCard - Displays a badge/achievement with earned status
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface BadgeData {
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  earnedAt?: string;
}

export interface BadgeCardProps {
  badge: BadgeData;
  locked?: boolean;
  style?: StyleProp<ViewStyle>;
}

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  locked = false,
  style,
}) => {
  const { name, description, icon, earnedAt } = badge;
  const isEarned = !locked && !!earnedAt;

  return (
    <View
      style={[
        styles.card,
        isEarned && styles.cardEarned,
        locked && styles.cardLocked,
        style,
      ]}
    >
      {/* Badge icon */}
      <View
        style={[
          styles.iconContainer,
          isEarned ? styles.iconEarned : styles.iconLocked,
        ]}
      >
        <Ionicons
          name={locked ? 'lock-closed' : icon}
          size={28}
          color={isEarned ? colors.neon.green : colors.text.muted}
        />
        {isEarned && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={10} color={colors.text.inverse} />
          </View>
        )}
      </View>

      {/* Name */}
      <Text
        style={[styles.name, locked && styles.textLocked]}
        numberOfLines={2}
      >
        {locked ? '???' : name}
      </Text>

      {/* Description */}
      <Text
        style={[styles.description, locked && styles.textLocked]}
        numberOfLines={2}
      >
        {locked ? 'Keep learning to unlock' : description}
      </Text>

      {/* Earned date */}
      {isEarned && earnedAt && (
        <View style={styles.earnedRow}>
          <Ionicons name="calendar-outline" size={10} color={colors.neon.green} />
          <Text style={styles.earnedDate}>{formatDate(earnedAt)}</Text>
        </View>
      )}

      {/* Locked overlay indicator */}
      {locked && (
        <View style={styles.lockedOverlay}>
          <Ionicons name="lock-closed" size={16} color={colors.text.muted} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    minWidth: 140,
  },
  cardEarned: {
    borderColor: colors.neon.green + '30',
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLocked: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconEarned: {
    backgroundColor: colors.neon.green + '15',
    borderWidth: 1,
    borderColor: colors.neon.green + '30',
  },
  iconLocked: {
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.card,
  },
  name: {
    ...typography.styles.labelSm,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  textLocked: {
    color: colors.text.muted,
  },
  earnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  earnedDate: {
    ...typography.styles.caption,
    color: colors.neon.green,
    fontSize: 10,
  },
  lockedOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});

export default BadgeCard;
