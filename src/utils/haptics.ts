// Haptic Feedback Utilities for Wall Street Wildlife Mobile
// Provides themed haptic feedback for trading actions, quizzes,
// gamification events, and general UI interactions.
// Uses expo-haptics with a user preference toggle via AsyncStorage.

import AsyncStorage from '@react-native-async-storage/async-storage';

// Lazy import to avoid crashes if expo-haptics isn't linked
let Haptics: typeof import('expo-haptics') | null = null;

const loadHaptics = async (): Promise<boolean> => {
  if (!Haptics) {
    try {
      Haptics = await import('expo-haptics');
    } catch {
      console.warn('[Haptics] expo-haptics not available');
      return false;
    }
  }
  return true;
};

// ── Storage ──────────────────────────────────────────────────────────────

const HAPTICS_ENABLED_KEY = 'wsw-haptics-enabled';

// In-memory cache to avoid repeated AsyncStorage reads on every haptic call
let cachedEnabled: boolean | null = null;

/**
 * Check if haptic feedback is enabled by user preference.
 * Defaults to true if no preference is stored.
 */
export async function isHapticsEnabled(): Promise<boolean> {
  if (cachedEnabled !== null) return cachedEnabled;

  try {
    const stored = await AsyncStorage.getItem(HAPTICS_ENABLED_KEY);
    if (stored !== null) {
      cachedEnabled = stored === 'true';
    } else {
      cachedEnabled = true; // Enabled by default
    }
  } catch {
    cachedEnabled = true; // Default to enabled on error
  }

  return cachedEnabled;
}

/**
 * Save the user's haptic feedback preference.
 */
export async function setHapticsEnabled(enabled: boolean): Promise<void> {
  cachedEnabled = enabled;
  try {
    await AsyncStorage.setItem(HAPTICS_ENABLED_KEY, String(enabled));
  } catch {
    // Ignore storage errors — in-memory cache is already updated
  }
}

// ── Internal Helper ──────────────────────────────────────────────────────

/**
 * Safely execute a haptic action only if haptics is available and enabled.
 */
async function runHaptic(action: (haptics: NonNullable<typeof Haptics>) => Promise<void>): Promise<void> {
  const enabled = await isHapticsEnabled();
  if (!enabled) return;

  const loaded = await loadHaptics();
  if (!loaded || !Haptics) return;

  try {
    await action(Haptics);
  } catch {
    // Silent fail — haptics is non-critical
  }
}

// ── Small delay helper for sequences ─────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Trade & Portfolio Haptics ────────────────────────────────────────────

/**
 * Heavy impact feedback for trade execution confirmations.
 * Provides a strong, satisfying thud when a trade is placed.
 */
export async function hapticTradeExecute(): Promise<void> {
  await runHaptic(async (h) => {
    await h.impactAsync(h.ImpactFeedbackStyle.Heavy);
  });
}

// ── Quiz & Learning Haptics ──────────────────────────────────────────────

/**
 * Success notification feedback for correct quiz answers.
 * A satisfying "ding" feel that rewards correct knowledge.
 */
export async function hapticQuizCorrect(): Promise<void> {
  await runHaptic(async (h) => {
    await h.notificationAsync(h.NotificationFeedbackType.Success);
  });
}

/**
 * Error notification feedback for incorrect quiz answers.
 * A gentle "buzz" that signals a wrong answer without being punishing.
 */
export async function hapticQuizWrong(): Promise<void> {
  await runHaptic(async (h) => {
    await h.notificationAsync(h.NotificationFeedbackType.Error);
  });
}

// ── Gamification Haptics ─────────────────────────────────────────────────

/**
 * Celebration sequence for leveling up.
 * Heavy impact followed by a success notification for a dramatic feel.
 */
export async function hapticLevelUp(): Promise<void> {
  await runHaptic(async (h) => {
    await h.impactAsync(h.ImpactFeedbackStyle.Heavy);
    await delay(150);
    await h.notificationAsync(h.NotificationFeedbackType.Success);
  });
}

/**
 * Medium impact feedback for badge unlock moments.
 * Noticeable but less dramatic than a level-up.
 */
export async function hapticBadgeUnlock(): Promise<void> {
  await runHaptic(async (h) => {
    await h.impactAsync(h.ImpactFeedbackStyle.Medium);
  });
}

// ── UI Interaction Haptics ───────────────────────────────────────────────

/**
 * Light impact for general button presses.
 * Subtle tactile confirmation for taps.
 */
export async function hapticButtonPress(): Promise<void> {
  await runHaptic(async (h) => {
    await h.impactAsync(h.ImpactFeedbackStyle.Light);
  });
}

/**
 * Selection change feedback for tab switches.
 * Uses the native selection feedback type for a crisp "click".
 */
export async function hapticTabSwitch(): Promise<void> {
  await runHaptic(async (h) => {
    await h.selectionAsync();
  });
}

/**
 * Light impact for slider tick marks or value changes.
 * Provides a subtle sense of discrete steps.
 */
export async function hapticSliderTick(): Promise<void> {
  await runHaptic(async (h) => {
    await h.impactAsync(h.ImpactFeedbackStyle.Light);
  });
}

/**
 * Error notification for failures and error states.
 * Stronger than a quiz wrong answer — signals something went wrong.
 */
export async function hapticError(): Promise<void> {
  await runHaptic(async (h) => {
    await h.notificationAsync(h.NotificationFeedbackType.Error);
  });
}

/**
 * Medium impact for swipe gesture confirmations.
 * Provides feedback when a swipe action is recognized and executed.
 */
export async function hapticSwipe(): Promise<void> {
  await runHaptic(async (h) => {
    await h.impactAsync(h.ImpactFeedbackStyle.Medium);
  });
}

// ── Convenience: Warning Haptic ──────────────────────────────────────────

/**
 * Warning notification for cautionary states (e.g., high risk trade warning).
 */
export async function hapticWarning(): Promise<void> {
  await runHaptic(async (h) => {
    await h.notificationAsync(h.NotificationFeedbackType.Warning);
  });
}
