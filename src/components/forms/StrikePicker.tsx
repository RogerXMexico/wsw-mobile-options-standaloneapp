// StrikePicker - Horizontal scrollable strike price selector with ATM highlight
import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface StrikePickerProps {
  strikes: number[];
  selected: number;
  onChange: (strike: number) => void;
  atmStrike?: number;
  stockPrice?: number;
  style?: StyleProp<ViewStyle>;
}

export const StrikePicker: React.FC<StrikePickerProps> = ({
  strikes,
  selected,
  onChange,
  atmStrike,
  stockPrice,
  style,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const ITEM_WIDTH = 76;
  const ITEM_MARGIN = spacing.xs;

  // Scroll to selected strike on mount
  useEffect(() => {
    const index = strikes.indexOf(selected);
    if (index >= 0 && scrollRef.current) {
      const offset = Math.max(0, index * (ITEM_WIDTH + ITEM_MARGIN * 2) - 100);
      scrollRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [selected, strikes]);

  const isATM = useCallback(
    (strike: number): boolean => {
      if (atmStrike !== undefined) return strike === atmStrike;
      if (stockPrice !== undefined) {
        // Find the strike closest to current stock price
        const closest = strikes.reduce((prev, curr) =>
          Math.abs(curr - stockPrice) < Math.abs(prev - stockPrice) ? curr : prev
        );
        return strike === closest;
      }
      return false;
    },
    [atmStrike, stockPrice, strikes]
  );

  const getStrikeLabel = useCallback(
    (strike: number): string | null => {
      if (isATM(strike)) return 'ATM';
      if (stockPrice !== undefined) {
        if (strike < stockPrice) return 'ITM';
        if (strike > stockPrice) return 'OTM';
      }
      return null;
    },
    [isATM, stockPrice]
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>Strike Price</Text>
        {stockPrice !== undefined && (
          <Text style={styles.stockPrice}>
            Spot: ${stockPrice.toFixed(2)}
          </Text>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {strikes.map((strike) => {
          const isSelected = strike === selected;
          const atm = isATM(strike);
          const label = getStrikeLabel(strike);

          return (
            <TouchableOpacity
              key={strike}
              onPress={() => onChange(strike)}
              style={[
                styles.strikeItem,
                isSelected && styles.strikeItemSelected,
                atm && !isSelected && styles.strikeItemATM,
              ]}
              activeOpacity={0.7}
            >
              {label && (
                <Text
                  style={[
                    styles.strikeLabel,
                    atm && styles.strikeLabelATM,
                    isSelected && styles.strikeLabelSelected,
                  ]}
                >
                  {label}
                </Text>
              )}
              <Text
                style={[
                  styles.strikeValue,
                  isSelected && styles.strikeValueSelected,
                  atm && !isSelected && styles.strikeValueATM,
                ]}
              >
                ${strike.toFixed(strike % 1 === 0 ? 0 : 2)}
              </Text>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={colors.neon.green}
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  stockPrice: {
    ...typography.styles.monoSm,
    color: colors.neon.cyan,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  strikeItem: {
    width: 76,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  strikeItemSelected: {
    borderColor: colors.neon.green,
    backgroundColor: 'rgba(57, 255, 20, 0.08)',
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  strikeItemATM: {
    borderColor: colors.neon.cyan + '60',
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
  },
  strikeLabel: {
    ...typography.styles.overline,
    color: colors.text.muted,
    fontSize: 8,
    marginBottom: 2,
  },
  strikeLabelATM: {
    color: colors.neon.cyan,
  },
  strikeLabelSelected: {
    color: colors.neon.green,
  },
  strikeValue: {
    ...typography.styles.monoBold,
    color: colors.text.primary,
    fontSize: 13,
  },
  strikeValueSelected: {
    color: colors.neon.green,
  },
  strikeValueATM: {
    color: colors.neon.cyan,
  },
  checkIcon: {
    marginTop: 2,
  },
});

export default StrikePicker;
