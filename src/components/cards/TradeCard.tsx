// TradeCard - Displays a trade summary with P&L, direction, and grade
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

export interface TradeData {
  ticker: string;
  direction: 'long' | 'short';
  strategy: string;
  pnl: number;
  date: string;
  grade?: string;
  status: 'open' | 'closed' | 'expired';
}

export interface TradeCardProps {
  trade: TradeData;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  open: { label: 'Open', color: colors.neon.cyan, icon: 'radio-button-on' },
  closed: { label: 'Closed', color: colors.text.secondary, icon: 'checkmark-circle-outline' },
  expired: { label: 'Expired', color: colors.text.muted, icon: 'time-outline' },
};

const GRADE_COLORS: Record<string, string> = {
  A: colors.neon.green,
  B: colors.neon.cyan,
  C: colors.neon.yellow,
  D: colors.neon.orange,
  F: colors.neon.red,
};

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatPnl = (pnl: number): string => {
  const prefix = pnl >= 0 ? '+' : '';
  return `${prefix}$${Math.abs(pnl).toFixed(2)}`;
};

export const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  onPress,
  style,
}) => {
  const { ticker, direction, strategy, pnl, date, grade, status } = trade;
  const pnlColor = pnl >= 0 ? colors.neon.green : colors.neon.red;
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const gradeColor = grade ? GRADE_COLORS[grade.charAt(0).toUpperCase()] || colors.text.secondary : undefined;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Left: Direction indicator + Ticker */}
      <View style={styles.leftSection}>
        <View
          style={[
            styles.directionIndicator,
            {
              backgroundColor:
                direction === 'long'
                  ? colors.neon.green + '20'
                  : colors.neon.red + '20',
            },
          ]}
        >
          <Ionicons
            name={direction === 'long' ? 'arrow-up' : 'arrow-down'}
            size={16}
            color={direction === 'long' ? colors.neon.green : colors.neon.red}
          />
        </View>
        <View>
          <Text style={styles.ticker}>{ticker}</Text>
          <Text style={styles.strategy} numberOfLines={1}>
            {strategy}
          </Text>
        </View>
      </View>

      {/* Center: Status + Date */}
      <View style={styles.centerSection}>
        <View style={styles.statusRow}>
          <Ionicons name={statusConfig.icon} size={10} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>

      {/* Right: P&L + Grade */}
      <View style={styles.rightSection}>
        <Text style={[styles.pnl, { color: pnlColor }]}>
          {formatPnl(pnl)}
        </Text>
        {grade && (
          <View style={[styles.gradeBadge, { backgroundColor: (gradeColor || colors.text.secondary) + '20' }]}>
            <Text style={[styles.gradeText, { color: gradeColor || colors.text.secondary }]}>
              {grade}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  directionIndicator: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticker: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoBold,
  },
  strategy: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    maxWidth: 100,
  },
  centerSection: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statusText: {
    ...typography.styles.caption,
    fontSize: 10,
  },
  date: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pnl: {
    ...typography.styles.monoBold,
    fontSize: 15,
  },
  gradeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
  },
  gradeText: {
    ...typography.styles.overline,
    fontSize: 10,
  },
});

export default TradeCard;
