// LoadingState - Centered loading spinner with optional message
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';

export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = 'large',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        color={colors.neon.green}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  message: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

export default LoadingState;
