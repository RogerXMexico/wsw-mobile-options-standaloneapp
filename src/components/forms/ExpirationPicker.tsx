// ExpirationPicker - Expiration date selector showing DTE (Days to Expiration)
import React, { useMemo, useRef, useEffect } from 'react';
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

export interface ExpirationPickerProps {
  expirations: string[];
  selected: string;
  onChange: (expiration: string) => void;
  showDTE?: boolean;
  style?: StyleProp<ViewStyle>;
}

const calculateDTE = (expirationDate: string): number => {
  const expiry = new Date(expirationDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const diffMs = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();
  if (year === currentYear) {
    return `${month} ${day}`;
  }
  return `${month} ${day}, ${year.toString().slice(-2)}`;
};

const getDTEColor = (dte: number): string => {
  if (dte <= 7) return colors.neon.red;
  if (dte <= 30) return colors.neon.orange;
  if (dte <= 60) return colors.neon.yellow;
  return colors.neon.green;
};

export const ExpirationPicker: React.FC<ExpirationPickerProps> = ({
  expirations,
  selected,
  onChange,
  showDTE = true,
  style,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const ITEM_WIDTH = 100;

  useEffect(() => {
    const index = expirations.indexOf(selected);
    if (index >= 0 && scrollRef.current) {
      const offset = Math.max(0, index * (ITEM_WIDTH + spacing.xs * 2) - 80);
      scrollRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [selected, expirations]);

  const expirationsWithDTE = useMemo(
    () =>
      expirations.map((exp) => ({
        date: exp,
        dte: calculateDTE(exp),
        formatted: formatDate(exp),
      })),
    [expirations]
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
        <Text style={styles.label}>Expiration</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {expirationsWithDTE.map((item) => {
          const isSelected = item.date === selected;
          const dteColor = getDTEColor(item.dte);

          return (
            <TouchableOpacity
              key={item.date}
              onPress={() => onChange(item.date)}
              style={[
                styles.expirationItem,
                isSelected && styles.expirationItemSelected,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dateText,
                  isSelected && styles.dateTextSelected,
                ]}
              >
                {item.formatted}
              </Text>
              {showDTE && (
                <View style={styles.dteRow}>
                  <Text
                    style={[
                      styles.dteText,
                      { color: isSelected ? colors.neon.green : dteColor },
                    ]}
                  >
                    {item.dte}d
                  </Text>
                  <Text style={styles.dteLabel}>DTE</Text>
                </View>
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
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  label: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  expirationItem: {
    width: 100,
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
  expirationItemSelected: {
    borderColor: colors.neon.green,
    backgroundColor: 'rgba(57, 255, 20, 0.08)',
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  dateText: {
    ...typography.styles.labelSm,
    color: colors.text.primary,
    textAlign: 'center',
  },
  dateTextSelected: {
    color: colors.neon.green,
    fontFamily: typography.fonts.semiBold,
  },
  dteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  dteText: {
    ...typography.styles.monoSm,
    fontSize: 11,
  },
  dteLabel: {
    ...typography.styles.overline,
    color: colors.text.muted,
    fontSize: 8,
  },
});

export default ExpirationPicker;
