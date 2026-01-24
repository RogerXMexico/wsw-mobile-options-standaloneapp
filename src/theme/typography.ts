// Typography system for Wall Street Wildlife Mobile
// Updated with custom fonts: Inter and JetBrains Mono
import { Platform, TextStyle } from 'react-native';

// Custom font families (loaded via expo-font)
export const fonts = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  mono: 'JetBrainsMono-Regular',
  monoBold: 'JetBrainsMono-Bold',
} as const;

// Fallback fonts for when custom fonts aren't loaded
const fallbackFontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

const monoFallbackFontFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const typography = {
  // Font families
  fonts: {
    regular: fonts.regular,
    medium: fonts.medium,
    semiBold: fonts.semiBold,
    bold: fonts.bold,
    mono: fonts.mono,
    monoBold: fonts.monoBold,
    // Fallbacks
    fallback: fallbackFontFamily,
    monoFallback: monoFallbackFontFamily,
  },

  // Font sizes
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Line heights
  lineHeights: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Font weights
  weights: {
    normal: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    black: '900' as TextStyle['fontWeight'],
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },

  // Pre-defined text styles
  styles: {
    // Headings
    h1: {
      fontFamily: fonts.bold,
      fontSize: 36,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: fonts.bold,
      fontSize: 30,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 36,
      letterSpacing: -0.3,
    },
    h3: {
      fontFamily: fonts.bold,
      fontSize: 24,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 30,
    },
    h4: {
      fontFamily: fonts.semiBold,
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 26,
    },
    h5: {
      fontFamily: fonts.semiBold,
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
    },

    // Body text
    bodyLg: {
      fontFamily: fonts.regular,
      fontSize: 18,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 28,
    },
    body: {
      fontFamily: fonts.regular,
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 24,
    },
    bodySm: {
      fontFamily: fonts.regular,
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
    bodyXs: {
      fontFamily: fonts.regular,
      fontSize: 12,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 16,
    },

    // Labels
    label: {
      fontFamily: fonts.medium,
      fontSize: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
    labelSm: {
      fontFamily: fonts.medium,
      fontSize: 12,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 16,
    },

    // Special styles
    caption: {
      fontFamily: fonts.regular,
      fontSize: 12,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    overline: {
      fontFamily: fonts.semiBold,
      fontSize: 10,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 14,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as TextStyle['textTransform'],
    },
    mono: {
      fontFamily: fonts.mono,
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
    monoSm: {
      fontFamily: fonts.mono,
      fontSize: 12,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 16,
    },
    monoBold: {
      fontFamily: fonts.monoBold,
      fontSize: 14,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 20,
    },

    // Button text
    buttonLg: {
      fontFamily: fonts.semiBold,
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
    },
    button: {
      fontFamily: fonts.semiBold,
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 22,
    },
    buttonSm: {
      fontFamily: fonts.semiBold,
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
  },
} as const;

export type Typography = typeof typography;
export type Fonts = typeof fonts;
