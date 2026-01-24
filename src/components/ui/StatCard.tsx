// StatCard - Reusable stat display with glass background
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, typography, spacing, shadows } from '../../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  valueColor?: string;
  withGlow?: boolean;
  glowColor?: string;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  valueColor = colors.text.primary,
  withGlow = false,
  glowColor,
  style,
  compact = false,
}) => {
  const valueGlowStyle = withGlow
    ? {
        textShadowColor: glowColor || valueColor,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      }
    : {};

  return (
    <GlassCard style={[compact ? styles.compactCard : styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          compact ? styles.valueCompact : styles.value,
          { color: valueColor },
          valueGlowStyle,
        ]}
      >
        {value}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  compactCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  label: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  value: {
    ...typography.styles.h3,
    color: colors.text.primary,
    textAlign: 'center',
  },
  valueCompact: {
    ...typography.styles.h5,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default StatCard;
