// AchievementToast - Slide-in toast notification for badge/achievement unlock
// Auto-dismisses after 3 seconds with slide-in/slide-out animation
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface AchievementToastProps {
  visible: boolean;
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onDismiss: () => void;
  autoHideDuration?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOAST_WIDTH = SCREEN_WIDTH - spacing.md * 2;

export const AchievementToast: React.FC<AchievementToastProps> = ({
  visible,
  title,
  description,
  icon = 'ribbon',
  onDismiss,
  autoHideDuration = 3000,
}) => {
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      // Slide in from top
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 60,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Shimmer effect on the icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto-dismiss
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, autoHideDuration);
    } else {
      slideAnim.setValue(-120);
      opacityAnim.setValue(0);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible]);

  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const iconScale = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toast}
        onPress={handleDismiss}
        activeOpacity={0.9}
      >
        {/* Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: iconScale }] },
          ]}
        >
          <Ionicons name={icon} size={24} color={colors.neon.green} />
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Ionicons
              name="star"
              size={12}
              color={colors.neon.yellow}
            />
            <Text style={styles.achievementLabel}>Achievement Unlocked</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>

        {/* Dismiss hint */}
        <View style={styles.dismissHint}>
          <Ionicons name="close" size={16} color={colors.text.muted} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neon.green + '30',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  achievementLabel: {
    ...typography.styles.overline,
    color: colors.neon.yellow,
    fontSize: 9,
  },
  title: {
    ...typography.styles.label,
    color: colors.text.primary,
    fontFamily: typography.fonts.semiBold,
  },
  description: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  dismissHint: {
    padding: spacing.xs,
  },
});

export default AchievementToast;
