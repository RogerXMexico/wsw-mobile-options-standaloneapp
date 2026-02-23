// CalculatorInput - Numeric input with label, unit suffix, and increment/decrement buttons
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface CalculatorInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const CalculatorInput: React.FC<CalculatorInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  placeholder = '0',
  style,
  disabled = false,
}) => {
  const clamp = useCallback(
    (v: number): number => {
      let clamped = v;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      return clamped;
    },
    [min, max]
  );

  const handleIncrement = useCallback(() => {
    if (disabled) return;
    const newValue = clamp(
      Math.round((value + step) * 1e8) / 1e8
    );
    onChange(newValue);
  }, [value, step, clamp, onChange, disabled]);

  const handleDecrement = useCallback(() => {
    if (disabled) return;
    const newValue = clamp(
      Math.round((value - step) * 1e8) / 1e8
    );
    onChange(newValue);
  }, [value, step, clamp, onChange, disabled]);

  const handleTextChange = useCallback(
    (text: string) => {
      if (disabled) return;
      const cleaned = text.replace(/[^0-9.\-]/g, '');
      if (cleaned === '' || cleaned === '-') {
        onChange(0);
        return;
      }
      const parsed = parseFloat(cleaned);
      if (!isNaN(parsed)) {
        onChange(clamp(parsed));
      }
    },
    [clamp, onChange, disabled]
  );

  const isAtMin = min !== undefined && value <= min;
  const isAtMax = max !== undefined && value >= max;

  const formatDisplayValue = (): string => {
    if (step < 1) {
      const decimals = step.toString().split('.')[1]?.length || 2;
      return value.toFixed(decimals);
    }
    return value.toString();
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
      <View style={[styles.inputRow, disabled && styles.inputRowDisabled]}>
        <TouchableOpacity
          onPress={handleDecrement}
          style={[styles.stepButton, (isAtMin || disabled) && styles.stepButtonDisabled]}
          disabled={isAtMin || disabled}
          activeOpacity={0.7}
        >
          <Ionicons
            name="remove"
            size={20}
            color={isAtMin || disabled ? colors.text.muted : colors.neon.green}
          />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          {unit && (
            <Text style={styles.unitPrefix}>
              {unit === '$' || unit === '-$' ? unit : ''}
            </Text>
          )}
          <TextInput
            style={styles.input}
            value={formatDisplayValue()}
            onChangeText={handleTextChange}
            keyboardType="numeric"
            placeholder={placeholder}
            placeholderTextColor={colors.text.muted}
            editable={!disabled}
            selectTextOnFocus
          />
          {unit && unit !== '$' && unit !== '-$' && (
            <Text style={styles.unitSuffix}>{unit}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          style={[styles.stepButton, (isAtMax || disabled) && styles.stepButtonDisabled]}
          disabled={isAtMax || disabled}
          activeOpacity={0.7}
        >
          <Ionicons
            name="add"
            size={20}
            color={isAtMax || disabled ? colors.text.muted : colors.neon.green}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  labelDisabled: {
    opacity: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    height: 48,
  },
  inputRowDisabled: {
    opacity: 0.5,
  },
  stepButton: {
    width: 44,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    ...typography.styles.mono,
    color: colors.text.primary,
    textAlign: 'center',
    flex: 1,
    height: 46,
    paddingVertical: 0,
  },
  unitPrefix: {
    ...typography.styles.mono,
    color: colors.text.secondary,
    marginRight: 2,
  },
  unitSuffix: {
    ...typography.styles.mono,
    color: colors.text.secondary,
    marginLeft: 2,
  },
});

export default CalculatorInput;
