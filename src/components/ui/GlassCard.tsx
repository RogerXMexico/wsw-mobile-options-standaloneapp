// GlassCard - Card with blur effect and glassmorphism styling
import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, borderRadius, spacing } from '../../theme';

// Inline glass colors as fallback
const GLASS_COLORS = {
  background: colors?.glass?.background || 'rgba(10, 10, 10, 0.7)',
  border: colors?.glass?.border || 'rgba(255, 255, 255, 0.08)',
  borderLight: colors?.glass?.borderLight || 'rgba(255, 255, 255, 0.12)',
};

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  withGlow?: boolean;
  glowColor?: string;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  withGlow = false,
  glowColor = colors?.neon?.green || '#39ff14',
  noPadding = false,
}) => {
  const glowStyle = withGlow
    ? {
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }
    : {};

  // On Android, BlurView doesn't work well, so we use a solid background
  if (Platform.OS === 'android') {
    return (
      <View
        style={[
          styles.container,
          styles.androidFallback,
          !noPadding && styles.padding,
          glowStyle,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, glowStyle, style]}>
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[styles.blur, !noPadding && styles.padding]}
      >
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius?.xl || 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_COLORS.border,
    backgroundColor: GLASS_COLORS.background,
  },
  blur: {
    flex: 1,
    backgroundColor: GLASS_COLORS.background,
  },
  padding: {
    padding: spacing?.md || 16,
  },
  androidFallback: {
    backgroundColor: colors?.background?.secondary || '#0a0a0a',
    borderColor: GLASS_COLORS.borderLight,
  },
});

export default GlassCard;
