// ErrorState - Error display with icon, message, optional details, and retry button
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  details?: string;
  style?: StyleProp<ViewStyle>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  details,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={48} color={colors.neon.red} />
      </View>

      <Text style={styles.message}>{message}</Text>

      {details && (
        <Text style={styles.details} numberOfLines={3}>
          {details}
        </Text>
      )}

      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={16} color={colors.text.primary} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neon.red + '10',
    borderWidth: 1,
    borderColor: colors.neon.red + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  message: {
    ...typography.styles.h5,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  details: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: spacing.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.glass.background,
    borderWidth: 1,
    borderColor: colors.glass.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: {
    ...typography.styles.buttonSm,
    color: colors.text.primary,
  },
});

export default ErrorState;
