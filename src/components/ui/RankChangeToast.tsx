// RankChangeToast - Toast for rank changes (up or down)
// Shows old rank -> new rank with arrow, color-coded (green up, red down)
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface RankChangeToastProps {
  visible: boolean;
  oldRank: string;
  newRank: string;
  onDismiss: () => void;
  autoHideDuration?: number;
}

export const RankChangeToast: React.FC<RankChangeToastProps> = ({
  visible,
  oldRank,
  newRank,
  onDismiss,
  autoHideDuration = 4000,
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const arrowBounce = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine direction: ranks are typically numeric or ordinal.
  // We compare string lengths and alphabetically as a heuristic,
  // but the visual direction is based on the caller's intent (old vs new).
  // For simplicity, we consider a rank "up" if newRank suggests improvement.
  // The component allows the parent to control this by ordering old/new.
  const isRankUp = true; // By convention: if you pass newRank as a better rank, it's "up"
  // A smarter heuristic: if both are numbers, compare them
  const oldNum = parseInt(oldRank, 10);
  const newNum = parseInt(newRank, 10);
  const isNumeric = !isNaN(oldNum) && !isNaN(newNum);
  const directionUp = isNumeric ? newNum > oldNum : true;

  const accentColor = directionUp ? colors.neon.green : colors.neon.red;
  const arrowIcon: keyof typeof Ionicons.glyphMap = directionUp
    ? 'arrow-up-circle'
    : 'arrow-down-circle';
  const directionLabel = directionUp ? 'Rank Up!' : 'Rank Changed';

  useEffect(() => {
    if (visible) {
      // Slide in from bottom
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
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

      // Bouncing arrow
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowBounce, {
            toValue: directionUp ? -6 : 6,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(arrowBounce, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto-dismiss
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, autoHideDuration);
    } else {
      slideAnim.setValue(100);
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
        toValue: 100,
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
        style={[styles.toast, { borderColor: accentColor + '30' }]}
        onPress={handleDismiss}
        activeOpacity={0.9}
      >
        {/* Direction icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: accentColor + '15',
              borderColor: accentColor + '30',
              transform: [{ translateY: arrowBounce }],
            },
          ]}
        >
          <Ionicons name={arrowIcon} size={24} color={accentColor} />
        </Animated.View>

        {/* Rank transition */}
        <View style={styles.content}>
          <Text style={[styles.directionLabel, { color: accentColor }]}>
            {directionLabel}
          </Text>
          <View style={styles.rankRow}>
            <Text style={styles.oldRank}>{oldRank}</Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={colors.text.muted}
              style={styles.arrow}
            />
            <Text style={[styles.newRank, { color: accentColor }]}>
              {newRank}
            </Text>
          </View>
        </View>

        {/* Close */}
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Ionicons name="close" size={16} color={colors.text.muted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  directionLabel: {
    ...typography.styles.overline,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 4,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldRank: {
    ...typography.styles.label,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  arrow: {
    marginHorizontal: spacing.sm,
  },
  newRank: {
    ...typography.styles.h5,
    fontFamily: typography.fonts.bold,
  },
  closeButton: {
    padding: spacing.xs,
  },
});

export default RankChangeToast;
