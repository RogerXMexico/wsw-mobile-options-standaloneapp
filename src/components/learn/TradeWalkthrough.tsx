// TradeWalkthrough - Interactive 4-path discovery mode for trade scenarios
// Shows day-by-day progression of different trade outcomes

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { TradePath, TradeDay } from '../../data/types';
import { colors, typography, spacing, borderRadius, createNeonGlow } from '../../theme';

const { width } = Dimensions.get('window');
const DAY_CARD_WIDTH = 140;
const DAY_CARD_MARGIN = spacing.sm;

interface TradeWalkthroughProps {
  tradePaths: TradePath[];
  ticker?: string;
  stockPrice?: number;
}

// Get color based on outcome
const getOutcomeColor = (outcome: 'win' | 'loss' | 'breakeven'): string => {
  switch (outcome) {
    case 'win':
      return colors.bullish;
    case 'loss':
      return colors.bearish;
    case 'breakeven':
      return colors.warning;
    default:
      return colors.text.secondary;
  }
};

// Get icon for path based on name/description
const getPathIcon = (pathId: string): string => {
  const iconMap: Record<string, string> = {
    'rocket': '🚀',
    'win': '🚀',
    'rally': '📈',
    'slow-grind': '🐌',
    'grind': '🐌',
    'dead-money': '💀',
    'sideways': '➡️',
    'crash': '💥',
    'drop': '📉',
    'loss': '📉',
    'breakeven': '⚖️',
  };

  // Try to match path ID
  for (const [key, icon] of Object.entries(iconMap)) {
    if (pathId.toLowerCase().includes(key)) {
      return icon;
    }
  }
  return '📊';
};

// Format P&L with color
const PnLBadge: React.FC<{ pnlPercent: number; pnlDollar: number }> = ({ pnlPercent, pnlDollar }) => {
  const isPositive = pnlPercent > 0;
  const isNeutral = pnlPercent === 0;
  const color = isNeutral ? colors.text.muted : isPositive ? colors.bullish : colors.bearish;
  const prefix = isPositive ? '+' : '';

  return (
    <View style={[styles.pnlBadge, { backgroundColor: `${color}15` }]}>
      <Text style={[styles.pnlPercent, { color }]}>
        {prefix}{pnlPercent.toFixed(1)}%
      </Text>
      <Text style={[styles.pnlDollar, { color }]}>
        {prefix}${Math.abs(pnlDollar).toFixed(0)}
      </Text>
    </View>
  );
};

// Day card component
const DayCard: React.FC<{ day: TradeDay; isLast: boolean }> = ({ day, isLast }) => {
  return (
    <View style={[styles.dayCard, isLast && styles.dayCardLast]}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayNumber}>Day {day.day}</Text>
        <PnLBadge pnlPercent={day.pnlPercent} pnlDollar={day.pnlDollar} />
      </View>

      <View style={styles.dayPrices}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Stock</Text>
          <Text style={styles.priceValue}>${day.stockPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Option</Text>
          <Text style={styles.priceValue}>${day.optionValue.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.dayNarrative} numberOfLines={3}>
        {day.narrative}
      </Text>

      {!isLast && <View style={styles.connector} />}
    </View>
  );
};

export const TradeWalkthrough: React.FC<TradeWalkthroughProps> = ({
  tradePaths,
  ticker = 'STOCK',
  stockPrice = 100,
}) => {
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const selectedPath = tradePaths[selectedPathIndex];

  if (!tradePaths || tradePaths.length === 0) {
    return null;
  }

  const handlePathSelect = (index: number) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPathIndex(index);
      // Scroll to start
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trade Walkthrough</Text>
        <Text style={styles.headerSubtitle}>
          See how {ticker} at ${stockPrice} plays out
        </Text>
      </View>

      {/* Path Selector */}
      <View style={styles.pathSelector}>
        {tradePaths.map((path, index) => {
          const isSelected = index === selectedPathIndex;
          const outcomeColor = getOutcomeColor(path.outcome);

          return (
            <TouchableOpacity
              key={path.id}
              style={[
                styles.pathButton,
                isSelected && styles.pathButtonSelected,
                isSelected && { borderColor: outcomeColor },
              ]}
              onPress={() => handlePathSelect(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.pathIcon}>{getPathIcon(path.id)}</Text>
              <Text
                style={[
                  styles.pathName,
                  isSelected && { color: outcomeColor },
                ]}
                numberOfLines={1}
              >
                {path.name}
              </Text>
              <View
                style={[
                  styles.outcomeIndicator,
                  { backgroundColor: outcomeColor },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Path Info */}
      <View style={styles.pathInfo}>
        <View style={styles.pathInfoHeader}>
          <Text style={styles.pathInfoIcon}>{getPathIcon(selectedPath.id)}</Text>
          <View style={styles.pathInfoText}>
            <Text style={styles.pathInfoName}>{selectedPath.name}</Text>
            <Text style={styles.pathInfoDescription}>{selectedPath.description}</Text>
          </View>
          <View
            style={[
              styles.outcomeBadge,
              { backgroundColor: `${getOutcomeColor(selectedPath.outcome)}20` },
            ]}
          >
            <Text
              style={[
                styles.outcomeBadgeText,
                { color: getOutcomeColor(selectedPath.outcome) },
              ]}
            >
              {selectedPath.outcome.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Day Timeline */}
      <Animated.View style={[styles.timelineContainer, { opacity: fadeAnim }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineContent}
          snapToInterval={DAY_CARD_WIDTH + DAY_CARD_MARGIN * 2}
          decelerationRate="fast"
        >
          {selectedPath.days.map((day, index) => (
            <DayCard
              key={`${selectedPath.id}-day-${day.day}`}
              day={day}
              isLast={index === selectedPath.days.length - 1}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Key Lesson */}
      <View style={styles.lessonContainer}>
        <View style={styles.lessonIcon}>
          <Text style={styles.lessonIconText}>💡</Text>
        </View>
        <View style={styles.lessonContent}>
          <Text style={styles.lessonLabel}>Key Lesson</Text>
          <Text style={styles.lessonText}>{selectedPath.keyLesson}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  pathSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pathButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  pathButtonSelected: {
    backgroundColor: colors.background.card,
  },
  pathIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  pathName: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  outcomeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },
  pathInfo: {
    marginBottom: spacing.md,
  },
  pathInfoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  pathInfoIcon: {
    fontSize: 28,
  },
  pathInfoText: {
    flex: 1,
  },
  pathInfoName: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  pathInfoDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  outcomeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  outcomeBadgeText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
  },
  timelineContainer: {
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.lg,
  },
  timelineContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  dayCard: {
    width: DAY_CARD_WIDTH,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: DAY_CARD_MARGIN * 2,
    position: 'relative',
  },
  dayCardLast: {
    marginRight: spacing.lg,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayNumber: {
    ...typography.styles.labelSm,
    color: colors.text.muted,
  },
  pnlBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignItems: 'flex-end',
  },
  pnlPercent: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
  },
  pnlDollar: {
    ...typography.styles.caption,
    fontSize: 10,
  },
  dayPrices: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  priceValue: {
    ...typography.styles.mono,
    color: colors.text.primary,
    fontSize: 12,
  },
  dayNarrative: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  connector: {
    position: 'absolute',
    right: -DAY_CARD_MARGIN * 2 - 2,
    top: '50%',
    width: DAY_CARD_MARGIN * 2 + 4,
    height: 2,
    backgroundColor: colors.border.default,
  },
  lessonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  lessonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIconText: {
    fontSize: 16,
  },
  lessonContent: {
    flex: 1,
  },
  lessonLabel: {
    ...typography.styles.caption,
    color: colors.accent,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  lessonText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default TradeWalkthrough;
