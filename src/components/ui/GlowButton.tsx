// GlowButton - Primary button with neon glow effect
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme';

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const buttonHeight = {
    sm: 36,
    md: 48,
    lg: 56,
  }[size];

  const fontSize = {
    sm: typography.sizes.sm,
    md: typography.sizes.base,
    lg: typography.sizes.lg,
  }[size];

  const getGlowShadow = () => {
    if (disabled) return {};
    switch (variant) {
      case 'primary':
        return shadows.neonGreen;
      case 'secondary':
        return shadows.neonCyan;
      case 'outline':
        return isPressed ? shadows.neonGreenSubtle : {};
      default:
        return shadows.neonGreen;
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'primary':
        return colors.gradients.greenButton as [string, string];
      case 'secondary':
        return ['#00f0ff', '#0099cc'] as [string, string];
      default:
        return colors.gradients.greenButton as [string, string];
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'outline' ? colors.neon.green : colors.text.inverse}
          size="small"
        />
      );
    }
    return (
      <Text
        style={[
          styles.text,
          {
            fontSize,
            color: variant === 'outline' ? colors.neon.green : colors.text.inverse,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    );
  };

  if (variant === 'outline') {
    return (
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          styles.outlineButton,
          {
            height: buttonHeight,
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale: isPressed ? 0.98 : 1 }],
          },
          getGlowShadow(),
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: isPressed ? 0.98 : 1 }],
        },
        getGlowShadow(),
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          styles.gradientButton,
          { height: buttonHeight },
        ]}
      >
        {renderContent()}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  gradientButton: {
    borderRadius: borderRadius.xl,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.neon.green,
  },
  text: {
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
});

export default GlowButton;
