// SliderInput - Labeled slider with value display and optional color theming
import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  color?: string;
  formatValue?: (v: number) => string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  color = colors.neon.green,
  formatValue,
  style,
  disabled = false,
}) => {
  const trackWidth = useRef(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const displayValue = useMemo(() => {
    if (formatValue) return formatValue(value);
    if (step < 1) {
      const decimals = step.toString().split('.')[1]?.length || 2;
      return value.toFixed(decimals);
    }
    return value.toString();
  }, [value, formatValue, step]);

  const fraction = useMemo(() => {
    if (max === min) return 0;
    return (value - min) / (max - min);
  }, [value, min, max]);

  const snapToStep = useCallback(
    (raw: number): number => {
      if (step <= 0) return raw;
      const stepped = Math.round((raw - min) / step) * step + min;
      return Math.min(max, Math.max(min, Math.round(stepped * 1e8) / 1e8));
    },
    [min, max, step]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (evt) => {
          if (trackWidth.current <= 0) return;
          const locationX = evt.nativeEvent.locationX;
          const frac = Math.max(0, Math.min(1, locationX / trackWidth.current));
          const raw = min + frac * (max - min);
          onChange(snapToStep(raw));
        },
        onPanResponderMove: (evt) => {
          if (trackWidth.current <= 0) return;
          const locationX = evt.nativeEvent.locationX;
          const frac = Math.max(0, Math.min(1, locationX / trackWidth.current));
          const raw = min + frac * (max - min);
          onChange(snapToStep(raw));
        },
      }),
    [disabled, min, max, onChange, snapToStep]
  );

  const handleTrackLayout = useCallback((event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  }, []);

  const fillPercent = `${fraction * 100}%`;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
        <View style={[styles.valueBadge, { borderColor: color + '40' }]}>
          <Text style={[styles.valueText, { color }]}>{displayValue}</Text>
        </View>
      </View>

      <View
        style={[styles.trackContainer, disabled && styles.trackDisabled]}
        onLayout={handleTrackLayout}
        {...panResponder.panHandlers}
      >
        <View style={styles.track}>
          <View
            style={[
              styles.trackFill,
              {
                width: fillPercent as any,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.thumb,
            {
              left: fillPercent as any,
              backgroundColor: color,
              shadowColor: color,
            },
          ]}
        />
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>
          {formatValue ? formatValue(min) : min}
        </Text>
        <Text style={styles.rangeText}>
          {formatValue ? formatValue(max) : max}
        </Text>
      </View>
    </View>
  );
};

const THUMB_SIZE = 22;

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
  labelDisabled: {
    opacity: 0.5,
  },
  valueBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    backgroundColor: colors.background.card,
  },
  valueText: {
    ...typography.styles.monoBold,
    fontSize: 13,
  },
  trackContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  trackDisabled: {
    opacity: 0.5,
  },
  track: {
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    marginLeft: -THUMB_SIZE / 2 + THUMB_SIZE / 2,
    top: (40 - THUMB_SIZE) / 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  rangeText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
});

export default SliderInput;
