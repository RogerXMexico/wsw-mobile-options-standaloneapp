// Spacing system for Wall Street Wildlife Mobile
// Based on 4px base unit

export const spacing = {
  // Base spacing scale (in pixels)
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,

  // Semantic spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// Icon sizes
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

// Layout constants
export const layout = {
  // Screen padding
  screenPaddingHorizontal: 16,
  screenPaddingVertical: 16,

  // Card dimensions
  cardPadding: 16,
  cardBorderRadius: 16,

  // Header
  headerHeight: 56,
  headerPaddingHorizontal: 16,

  // Tab bar
  tabBarHeight: 80,
  tabBarPaddingBottom: 20, // For home indicator

  // Bottom sheet
  bottomSheetBorderRadius: 24,

  // Modal
  modalBorderRadius: 24,
  modalPadding: 24,

  // Button
  buttonHeight: 48,
  buttonHeightSm: 36,
  buttonHeightLg: 56,
  buttonBorderRadius: 12,

  // Input
  inputHeight: 48,
  inputBorderRadius: 12,
  inputPadding: 16,

  // List item
  listItemHeight: 56,
  listItemPadding: 16,

  // Avatar
  avatarSizeSm: 32,
  avatarSizeMd: 48,
  avatarSizeLg: 64,
  avatarSizeXl: 96,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type IconSizes = typeof iconSizes;
export type Layout = typeof layout;
