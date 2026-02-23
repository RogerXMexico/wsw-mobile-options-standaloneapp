// MissionCard - Displays a mission with progress bar, reward, and claim action
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

export interface Mission {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  progress: number;
  target: number;
  reward: number;
  claimed: boolean;
}

export interface MissionCardProps {
  mission: Mission;
  onClaim?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onClaim,
  style,
}) => {
  const { title, description, icon, progress, target, reward, claimed } = mission;
  const isComplete = progress >= target;
  const progressPercent = Math.min(1, progress / target);

  const cardBorderColor = claimed
    ? colors.border.default
    : isComplete
    ? colors.neon.green + '40'
    : colors.border.default;

  return (
    <View
      style={[
        styles.card,
        { borderColor: cardBorderColor },
        claimed && styles.cardClaimed,
        style,
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          claimed
            ? styles.iconClaimed
            : isComplete
            ? styles.iconComplete
            : styles.iconDefault,
        ]}
      >
        <Ionicons
          name={claimed ? 'checkmark-circle' : icon}
          size={24}
          color={
            claimed
              ? colors.text.muted
              : isComplete
              ? colors.neon.green
              : colors.neon.cyan
          }
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, claimed && styles.textClaimed]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[styles.description, claimed && styles.textClaimed]}
          numberOfLines={1}
        >
          {description}
        </Text>

        {/* Progress bar */}
        {!claimed && (
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {progress}/{target}
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round(progressPercent * 100)}%
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercent * 100}%`,
                    backgroundColor: isComplete
                      ? colors.neon.green
                      : colors.neon.cyan,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Reward / Claim */}
      <View style={styles.rightSection}>
        {claimed ? (
          <View style={styles.claimedBadge}>
            <Ionicons name="checkmark" size={14} color={colors.text.muted} />
            <Text style={styles.claimedText}>Claimed</Text>
          </View>
        ) : isComplete ? (
          <TouchableOpacity
            style={styles.claimButton}
            onPress={onClaim}
            activeOpacity={0.7}
          >
            <Ionicons name="gift-outline" size={14} color={colors.text.inverse} />
            <Text style={styles.claimButtonText}>+{reward} XP</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.rewardContainer}>
            <Ionicons name="flash" size={14} color={colors.neon.yellow} />
            <Text style={styles.rewardText}>{reward} XP</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  cardClaimed: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDefault: {
    backgroundColor: colors.neon.cyan + '15',
  },
  iconComplete: {
    backgroundColor: colors.neon.green + '15',
    borderWidth: 1,
    borderColor: colors.neon.green + '30',
  },
  iconClaimed: {
    backgroundColor: colors.glass.background,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: 2,
  },
  description: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  textClaimed: {
    color: colors.text.muted,
  },
  progressSection: {
    marginTop: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  progressPercent: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  claimButtonText: {
    ...typography.styles.labelSm,
    color: colors.text.inverse,
    fontWeight: '700',
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  claimedText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    ...typography.styles.labelSm,
    color: colors.neon.yellow,
    fontWeight: '700',
  },
});

export default MissionCard;
