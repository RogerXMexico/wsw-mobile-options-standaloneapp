// Main theme export for Wall Street Wildlife Mobile
export { colors, shadows } from './colors';
export { typography, fonts } from './typography';
export { spacing, borderRadius, iconSizes, layout } from './spacing';

import { colors, shadows } from './colors';
import { typography, fonts } from './typography';
import { spacing, borderRadius, iconSizes, layout } from './spacing';

export const theme = {
  colors,
  shadows,
  typography,
  fonts,
  spacing,
  borderRadius,
  iconSizes,
  layout,
} as const;

export type Theme = typeof theme;

// Helper functions for creating shadows with neon glow
export const createNeonGlow = (color: string, intensity: number = 0.3) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: intensity,
  shadowRadius: 12,
  elevation: 8,
});

export const createShadow = (
  level: 'sm' | 'md' | 'lg' | 'xl' = 'md'
) => {
  const shadowPresets = {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 12,
    },
  };
  return shadowPresets[level];
};

// Utility function to get tier color
export const getTierColor = (tier: number): string => {
  const tierKey = tier as keyof typeof colors.tiers;
  return colors.tiers[tierKey] || colors.tiers[0];
};

// Utility function to get outlook color
export const getOutlookColor = (outlook: string): string => {
  const outlookLower = outlook.toLowerCase();
  if (outlookLower.includes('bullish')) return colors.bullish;
  if (outlookLower.includes('bearish')) return colors.bearish;
  if (outlookLower.includes('neutral')) return colors.neutral;
  if (outlookLower.includes('volatility')) return colors.volatility;
  return colors.text.secondary;
};
