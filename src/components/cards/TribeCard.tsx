// TribeCard - Displays a tribe with animal icon, stats, and rank
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

export interface TribeData {
  name: string;
  animal: string;
  memberCount: number;
  totalXP: number;
  rank: number;
}

export interface TribeCardProps {
  tribe: TribeData;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ANIMAL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  owl: 'eye-outline',
  bull: 'trending-up',
  bear: 'trending-down',
  fox: 'flash-outline',
  eagle: 'compass-outline',
  badger: 'shield-outline',
  monkey: 'game-controller-outline',
  sloth: 'leaf-outline',
  tiger: 'flame-outline',
  chameleon: 'color-palette-outline',
  cheetah: 'speedometer-outline',
};

const ANIMAL_COLORS: Record<string, string> = {
  owl: colors.neon.purple,
  bull: colors.neon.green,
  bear: colors.neon.red,
  fox: colors.neon.orange,
  eagle: '#ffd700',
  badger: colors.text.secondary,
  monkey: colors.neon.yellow,
  sloth: '#66ff44',
  tiger: colors.neon.pink,
  chameleon: colors.neon.cyan,
  cheetah: colors.neon.orange,
};

const RANK_BADGES: Record<number, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  1: { icon: 'trophy', color: '#ffd700' },
  2: { icon: 'trophy-outline', color: '#c0c0c0' },
  3: { icon: 'trophy-outline', color: '#cd7f32' },
};

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

export const TribeCard: React.FC<TribeCardProps> = ({
  tribe,
  onPress,
  style,
}) => {
  const { name, animal, memberCount, totalXP, rank } = tribe;
  const animalIcon = ANIMAL_ICONS[animal.toLowerCase()] || 'paw-outline';
  const animalColor = ANIMAL_COLORS[animal.toLowerCase()] || colors.neon.cyan;
  const rankBadge = RANK_BADGES[rank];

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Rank badge */}
      {rankBadge && (
        <View style={[styles.rankBadge, { backgroundColor: rankBadge.color + '20' }]}>
          <Ionicons name={rankBadge.icon} size={14} color={rankBadge.color} />
        </View>
      )}

      {/* Animal icon */}
      <View
        style={[
          styles.animalContainer,
          { backgroundColor: animalColor + '15', borderColor: animalColor + '30' },
        ]}
      >
        <Ionicons name={animalIcon} size={32} color={animalColor} />
      </View>

      {/* Tribe name */}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {/* Rank */}
      <Text style={[styles.rank, rankBadge && { color: rankBadge.color }]}>
        #{rank}
      </Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="people-outline" size={12} color={colors.text.muted} />
          <Text style={styles.statText}>{formatNumber(memberCount)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Ionicons name="flash-outline" size={12} color={colors.neon.yellow} />
          <Text style={[styles.statText, { color: colors.neon.yellow }]}>
            {formatNumber(totalXP)} XP
          </Text>
        </View>
      </View>

      {/* Arrow */}
      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.text.muted}
          style={styles.chevron}
        />
      )}
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
    alignItems: 'center',
    minWidth: 160,
  },
  rankBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.styles.label,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  rank: {
    ...typography.styles.h5,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border.default,
  },
  chevron: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});

export default TribeCard;
