// GradientText - Text with gradient fill effect
import React from 'react';
import { Text, StyleSheet, TextStyle, View, Platform } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../../theme';

interface GradientTextProps {
  children: string;
  style?: TextStyle;
  gradientColors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  style,
  gradientColors = colors.gradients.greenText as readonly [string, string, ...string[]],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}) => {
  // MaskedView can be slow on Android, so we use a simple colored text fallback
  if (Platform.OS === 'android') {
    return (
      <Text style={[styles.fallbackText, { color: gradientColors[0] }, style]}>
        {children}
      </Text>
    );
  }

  return (
    <MaskedView
      maskElement={
        <Text style={[styles.maskText, style]}>{children}</Text>
      }
    >
      <LinearGradient
        colors={gradientColors}
        start={start}
        end={end}
      >
        <Text style={[styles.hiddenText, style]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskText: {
    backgroundColor: 'transparent',
  },
  hiddenText: {
    opacity: 0,
  },
  fallbackText: {
    // Default styles for Android fallback
  },
});

export default GradientText;
