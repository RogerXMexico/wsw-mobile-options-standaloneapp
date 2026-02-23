// QuoteCard - Displays a wisdom quote with author and optional bias tag
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

export interface QuoteData {
  text: string;
  author: string;
  bias?: string;
}

export interface QuoteCardProps {
  quote: QuoteData;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BIAS_CONFIG: Record<string, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  bullish: { color: colors.neon.green, icon: 'trending-up' },
  bearish: { color: colors.neon.red, icon: 'trending-down' },
  neutral: { color: colors.neon.cyan, icon: 'swap-horizontal' },
  wisdom: { color: colors.neon.purple, icon: 'bulb-outline' },
  risk: { color: colors.neon.yellow, icon: 'warning-outline' },
  discipline: { color: colors.neon.orange, icon: 'fitness-outline' },
};

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  compact = false,
  style,
}) => {
  const { text, author, bias } = quote;
  const biasConfig = bias
    ? BIAS_CONFIG[bias.toLowerCase()] || { color: colors.text.secondary, icon: 'chatbox-ellipses-outline' as keyof typeof Ionicons.glyphMap }
    : null;

  return (
    <View style={[styles.card, compact && styles.cardCompact, style]}>
      {/* Opening quote mark */}
      {!compact && (
        <View style={styles.quoteIconRow}>
          <Ionicons name="chatbox-ellipses-outline" size={20} color={colors.neon.green + '60'} />
        </View>
      )}

      {/* Quote text */}
      <Text
        style={[styles.quoteText, compact && styles.quoteTextCompact]}
        numberOfLines={compact ? 3 : undefined}
      >
        {`\u201C${text}\u201D`}
      </Text>

      {/* Author + Bias row */}
      <View style={styles.footer}>
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>

        {biasConfig && (
          <View style={[styles.biasBadge, { backgroundColor: biasConfig.color + '15' }]}>
            <Ionicons name={biasConfig.icon} size={10} color={biasConfig.color} />
            <Text style={[styles.biasText, { color: biasConfig.color }]}>
              {bias}
            </Text>
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
    borderColor: colors.border.default,
    borderLeftWidth: 3,
    borderLeftColor: colors.neon.green + '40',
  },
  cardCompact: {
    padding: spacing.md,
    borderLeftWidth: 2,
  },
  quoteIconRow: {
    marginBottom: spacing.sm,
  },
  quoteText: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: 26,
    marginBottom: spacing.md,
  },
  quoteTextCompact: {
    ...typography.styles.bodySm,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  author: {
    ...typography.styles.labelSm,
    color: colors.text.secondary,
    flex: 1,
  },
  biasBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  biasText: {
    ...typography.styles.caption,
    fontSize: 10,
    textTransform: 'capitalize',
  },
});

export default QuoteCard;
