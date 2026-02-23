// StrategyCard - Displays a strategy preview with tier badge, difficulty, and premium lock
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
import { Strategy } from '../../data/types';

export interface StrategyCardProps {
  strategy: Strategy;
  onPress?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TIER_LABELS: Record<number, string> = {
  0: 'Foundations',
  0.5: 'Basics',
  1: 'Structure',
  2: 'Risk',
  3: 'Anchors',
  4: 'Verticals',
  5: 'Volatility',
  6: 'Time & Skew',
  7: 'Ratios',
  8: 'Event Horizons',
  9: 'Tools',
};

const RISK_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  defined: { icon: 'shield-checkmark-outline', color: colors.neon.green },
  reduced: { icon: 'shield-half-outline', color: colors.neon.cyan },
  undefined: { icon: 'warning-outline', color: colors.neon.orange },
  significant: { icon: 'alert-circle-outline', color: colors.neon.pink },
  unlimited: { icon: 'skull-outline', color: colors.neon.red },
};

const getTierColor = (tier: number): string => {
  return (colors.tiers as Record<number, string>)[tier] || colors.tiers[0];
};

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onPress,
  compact = false,
  style,
}) => {
  const tierColor = getTierColor(strategy.tier);
  const tierLabel = strategy.tierName || TIER_LABELS[strategy.tier] || `Tier ${strategy.tier}`;
  const riskInfo = RISK_ICONS[strategy.riskLevel || ''] || null;

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Top row: Tier badge + Premium lock */}
      <View style={styles.topRow}>
        <View style={[styles.tierBadge, { backgroundColor: tierColor + '20', borderColor: tierColor + '40' }]}>
          <Text style={[styles.tierText, { color: tierColor }]}>
            T{strategy.tier}
          </Text>
        </View>
        <Text style={[styles.tierLabel, { color: tierColor }]} numberOfLines={1}>
          {tierLabel}
        </Text>
        {strategy.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="lock-closed" size={12} color={colors.neon.yellow} />
          </View>
        )}
      </View>

      {/* Strategy name */}
      <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={compact ? 1 : 2}>
        {strategy.name}
      </Text>

      {/* Description */}
      {!compact && strategy.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {strategy.description}
        </Text>
      ) : null}

      {/* Bottom row: Outlook + Risk */}
      <View style={styles.bottomRow}>
        {strategy.outlook ? (
          <View style={styles.outlookBadge}>
            <Ionicons
              name={
                strategy.outlook.toLowerCase().includes('bullish')
                  ? 'trending-up'
                  : strategy.outlook.toLowerCase().includes('bearish')
                  ? 'trending-down'
                  : 'swap-horizontal'
              }
              size={12}
              color={colors.text.secondary}
            />
            <Text style={styles.outlookText}>{strategy.outlook}</Text>
          </View>
        ) : null}

        {riskInfo && (
          <View style={styles.riskBadge}>
            <Ionicons name={riskInfo.icon} size={12} color={riskInfo.color} />
            <Text style={[styles.riskText, { color: riskInfo.color }]}>
              {strategy.riskLevel}
            </Text>
          </View>
        )}
      </View>

      {/* Chevron */}
      {onPress && (
        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
        </View>
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
  },
  cardCompact: {
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  tierText: {
    ...typography.styles.overline,
    fontSize: 10,
  },
  tierLabel: {
    ...typography.styles.caption,
    flex: 1,
  },
  premiumBadge: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neon.yellow + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  nameCompact: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  outlookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.glass.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  outlookText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.glass.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  riskText: {
    ...typography.styles.caption,
    textTransform: 'capitalize',
  },
  chevron: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
  },
});

export default StrategyCard;
