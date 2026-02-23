// MentorBubble - Speech bubble from an animal mentor
// Shows their avatar, name, and message with type-specific border colors
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { AnimalAvatar } from './AnimalAvatar';

export interface MentorBubbleProps {
  animal: string;
  message: string;
  type?: 'tip' | 'warning' | 'encouragement';
  style?: StyleProp<ViewStyle>;
}

const TYPE_CONFIG: Record<
  string,
  {
    borderColor: string;
    backgroundColor: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    label: string;
  }
> = {
  tip: {
    borderColor: colors.neon.cyan,
    backgroundColor: 'rgba(0, 240, 255, 0.06)',
    icon: 'bulb-outline',
    iconColor: colors.neon.cyan,
    label: 'Tip',
  },
  warning: {
    borderColor: colors.neon.orange,
    backgroundColor: 'rgba(255, 102, 0, 0.06)',
    icon: 'warning-outline',
    iconColor: colors.neon.orange,
    label: 'Warning',
  },
  encouragement: {
    borderColor: colors.neon.green,
    backgroundColor: 'rgba(57, 255, 20, 0.06)',
    icon: 'sparkles-outline',
    iconColor: colors.neon.green,
    label: 'Keep Going',
  },
};

const formatAnimalName = (animal: string): string => {
  return animal.charAt(0).toUpperCase() + animal.slice(1).toLowerCase();
};

export const MentorBubble: React.FC<MentorBubbleProps> = ({
  animal,
  message,
  type = 'tip',
  style,
}) => {
  const config = useMemo(() => TYPE_CONFIG[type] || TYPE_CONFIG.tip, [type]);

  return (
    <View style={[styles.container, style]}>
      {/* Avatar column */}
      <View style={styles.avatarColumn}>
        <AnimalAvatar animal={animal} size={40} showBorder />
      </View>

      {/* Bubble */}
      <View
        style={[
          styles.bubble,
          {
            borderColor: config.borderColor + '40',
            backgroundColor: config.backgroundColor,
          },
        ]}
      >
        {/* Bubble pointer / triangle */}
        <View
          style={[
            styles.pointer,
            { borderRightColor: config.borderColor + '40' },
          ]}
        />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mentorName}>{formatAnimalName(animal)}</Text>
          <View style={styles.typeBadge}>
            <Ionicons name={config.icon} size={12} color={config.iconColor} />
            <Text style={[styles.typeLabel, { color: config.iconColor }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatarColumn: {
    marginRight: spacing.sm,
    paddingTop: spacing.xs,
  },
  bubble: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    position: 'relative',
  },
  pointer: {
    position: 'absolute',
    left: -6,
    top: 14,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mentorName: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontFamily: typography.fonts.semiBold,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  typeLabel: {
    ...typography.styles.overline,
    fontSize: 9,
  },
  message: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default MentorBubble;
