// ProgressBar - Animated progress bar with optional label and percentage
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface ProgressBarProps {
  /** Progress value from 0 to 1 */
  progress: number;
  /** Bar fill color (defaults to neon green) */
  color?: string;
  /** Label text shown above the bar */
  label?: string;
  /** Whether to show the percentage number */
  showPercentage?: boolean;
  /** Height of the progress bar in pixels */
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.neon.green,
  label,
  showPercentage = false,
  height = 8,
  style,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clampedProgress * 100);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const showHeader = label || showPercentage;

  return (
    <View style={[styles.container, style]}>
      {showHeader && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={[styles.percentage, { color }]}>{percentage}%</Text>
          )}
        </View>
      )}

      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              backgroundColor: color,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              shadowColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  percentage: {
    ...typography.styles.labelSm,
    fontFamily: typography.fonts.monoBold,
  },
  track: {
    backgroundColor: colors.glass.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: borderRadius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 2,
  },
});

export default ProgressBar;
