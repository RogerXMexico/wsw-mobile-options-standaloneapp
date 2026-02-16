// Color palette for Wall Street Wildlife Mobile
// Dark theme with neon accents

export const colors = {
  // Backgrounds
  background: {
    primary: '#000000',
    secondary: '#0a0a0a',
    tertiary: '#1a1a1a',
    card: '#111111',
    elevated: '#1c1c1c',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
    tertiary: '#888888',
    muted: '#666666',
    inverse: '#000000',
  },

  // Neon accent colors
  neon: {
    green: '#39ff14',
    cyan: '#00f0ff',
    purple: '#bf00ff',
    yellow: '#ffff00',
    orange: '#ff6600',
    pink: '#ff1493',
    red: '#ff073a',
  },

  // Semantic colors
  success: '#39ff14',
  error: '#ff073a',
  warning: '#ffff00',
  info: '#00f0ff',

  // Market colors
  bullish: '#39ff14',
  bearish: '#ff073a',
  neutral: '#00f0ff',
  volatility: '#bf00ff',

  // Border colors
  border: {
    default: '#2a2a2a',
    light: '#333333',
    accent: '#39ff14',
    neon: '#39ff1440',
  },

  // Glass card styles
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.10)',
  },

  // Overlay colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.10)',
    neonGreen: 'rgba(57, 255, 20, 0.10)',
    neonCyan: 'rgba(0, 240, 255, 0.10)',
  },

  // Tier colors (0-10)
  tiers: {
    0: '#39ff14',
    0.5: '#66ff44',
    1: '#00f0ff',
    2: '#00ccff',
    3: '#0099ff',
    4: '#bf00ff',
    5: '#9900cc',
    6: '#ff6600',
    7: '#ff3300',
    8: '#ff1493',
    9: '#ffff00',
    10: '#ffd700',
  } as Record<number, string>,

  // Spirit animal mascot colors
  mascots: {
    owl: '#bf00ff',
    badger: '#a0a0a0',
    monkey: '#ffff00',
    bull: '#39ff14',
    bear: '#ff073a',
    chameleon: '#00f0ff',
    cheetah: '#ff6600',
    sloth: '#66ff44',
    fox: '#ff6600',
    tiger: '#ff1493',
    eagle: '#ffd700',
  },

  // Gradients
  gradients: {
    greenButton: ['#39ff14', '#00cc00'],
    cyanButton: ['#00f0ff', '#0099cc'],
    purpleButton: ['#bf00ff', '#8800aa'],
    card: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)'],
    darkCard: ['rgba(26,26,26,0.8)', 'rgba(10,10,10,0.9)'],
  },
} as const;

export const shadows = {
  neonGreen: {
    shadowColor: '#39ff14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  neonGreenSubtle: {
    shadowColor: '#39ff14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  neonCyan: {
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
} as const;
