// Neon Jungle Color Palette for Wall Street Wildlife
// Dark theme with vibrant neon accents - aligned with web app

export const colors = {
  // Base colors - Pure black backgrounds
  background: {
    primary: '#000000',      // Pure black (was #0f1419)
    secondary: '#0a0a0a',    // Surface dark
    tertiary: '#151515',     // Surface light
    card: '#1e1e1e',         // Card background
    modal: '#0a0a0a',        // Modal background
  },

  // Neon accent colors
  neon: {
    green: '#39ff14',      // Primary neon green
    cyan: '#00f0ff',       // Cyan blue
    purple: '#bf00ff',     // Neon purple
    pink: '#ff1493',       // Hot pink
    yellow: '#fbbf24',     // Amber/Gold
    orange: '#ff6b35',     // Vibrant orange
  },

  // Semantic colors
  primary: '#39ff14',      // Neon green - main action color
  secondary: '#00f0ff',    // Cyan - secondary actions
  accent: '#fbbf24',       // Gold/amber - highlights

  // Strategy outlook colors (matching web app)
  bullish: '#10b981',      // Emerald green
  bearish: '#ef4444',      // Red
  neutral: '#8b5cf6',      // Purple
  volatility: '#f59e0b',   // Amber

  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    tertiary: '#64748b',
    muted: '#475569',
    inverse: '#000000',
  },

  // Border colors
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.05)',
    focus: '#39ff14',
    neon: 'rgba(57, 255, 20, 0.3)',
  },

  // Glass effect colors
  glass: {
    background: 'rgba(10, 10, 10, 0.7)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.12)',
  },

  // Tier colors (matching 11 tiers from web app)
  tiers: {
    0: '#64748b',    // Foundations - slate
    0.5: '#fbbf24',  // Express Lane - amber
    1: '#3b82f6',    // Market Structure - blue
    2: '#f59e0b',    // Risk - amber
    3: '#10b981',    // The Anchors - emerald
    4: '#06b6d4',    // Verticals - cyan
    5: '#8b5cf6',    // Volatility - purple
    6: '#ec4899',    // Time/Skew - pink
    7: '#f97316',    // Ratios - orange
    8: '#8b5cf6',    // Event Horizons - purple (chameleon)
    9: '#f43f5e',    // Strategy Tools - rose
    10: '#10b981',   // Let's Play - emerald
  },

  // Event Horizons specific colors
  eventHorizons: {
    primary: '#8b5cf6',     // Purple - main accent
    secondary: '#14b8a6',   // Teal - secondary accent
    gradient: ['#8b5cf6', '#14b8a6'],
    chameleon: '#8b5cf6',
    cheetah: '#f59e0b',
    owl: '#3b82f6',
  },

  // Gradients (for LinearGradient component)
  gradients: {
    primary: ['#39ff14', '#00f0ff'],
    jungle: ['#000000', '#0a1f0a', '#000000'],
    card: ['#0a0a0a', '#151515'],
    neonGlow: ['rgba(57, 255, 20, 0.2)', 'transparent'],
    bullish: ['#10b981', '#059669'],
    bearish: ['#ef4444', '#dc2626'],
    greenButton: ['#34d399', '#10b981'],
    greenText: ['#34d399', '#10b981', '#059669'],
  },

  // Overlay/transparency
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.5)',
    neonGreen: 'rgba(57, 255, 20, 0.1)',
    neonCyan: 'rgba(0, 240, 255, 0.1)',
  },

  // Animal mascot colors
  mascots: {
    owl: '#8b5cf6',      // Purple - wisdom
    bull: '#10b981',     // Green - bullish
    bear: '#ef4444',     // Red - bearish
    fox: '#f97316',      // Orange - advanced
    eagle: '#3b82f6',    // Blue - overview
    badger: '#64748b',   // Slate - moderate
    monkey: '#fbbf24',   // Amber - swing
    sloth: '#22c55e',    // Green - conservative
    tiger: '#f43f5e',    // Rose - aggressive
    chameleon: '#8b5cf6', // Purple - Event Horizons, adaptation
    cheetah: '#f59e0b',  // Amber - speed, timing
  },
} as const;

export type Colors = typeof colors;

// Glow shadow presets
export const shadows = {
  neonGreen: {
    shadowColor: '#39ff14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  neonGreenSubtle: {
    shadowColor: '#39ff14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  neonCyan: {
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export type Shadows = typeof shadows;
