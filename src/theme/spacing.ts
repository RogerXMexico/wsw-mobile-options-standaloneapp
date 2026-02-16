import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const spacing: Record<string, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  '2xl': 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export const layout = {
  screenWidth,
  screenHeight,
  tabBarHeight: Platform.OS === 'web' ? 70 : 88,
  tabBarPaddingBottom: Platform.OS === 'web' ? 8 : 28,
  inputHeight: 52,
  inputBorderRadius: 12,
  inputPadding: 16,
  headerHeight: 56,
  cardPadding: 16,
} as const;
