// Animation Presets & Helpers for Wall Street Wildlife Mobile
// Shared animation configurations and factory functions used across the app.
// Uses only React Native's built-in Animated API (no reanimated dependency).

import { Animated, Easing } from 'react-native';
import {
  hapticButtonPress,
  hapticTabSwitch,
  hapticError,
  hapticBadgeUnlock,
  hapticTradeExecute,
} from './haptics';

// ── Spring Configurations ──────────────────────────────────────────────────

/**
 * Partial spring config — omits `toValue` so it can be spread into
 * `Animated.spring()` calls where `toValue` is set per-use.
 */
export type SpringPreset = Omit<Animated.SpringAnimationConfig, 'toValue'>;

/** Standard spring for general-purpose bounce animations (cards, modals). */
export const SPRING_CONFIG: SpringPreset = {
  tension: 100,
  friction: 8,
  useNativeDriver: true,
};

/** Fast spring for snappy button press/release feedback. */
export const QUICK_SPRING: SpringPreset = {
  tension: 200,
  friction: 10,
  useNativeDriver: true,
};

/** Gentle spring for subtle, smooth entrance animations. */
export const GENTLE_SPRING: SpringPreset = {
  tension: 60,
  friction: 7,
  useNativeDriver: true,
};

// ── Timing Configurations ──────────────────────────────────────────────────

/** Standard easeInOut timing (300ms). Good for fades, slides, transitions. */
export const SMOOTH_TIMING: Animated.TimingAnimationConfig = {
  toValue: 1,
  duration: 300,
  easing: Easing.inOut(Easing.ease),
  useNativeDriver: true,
};

/** Quick timing (150ms) for micro-interactions like flashes and pulses. */
export const QUICK_TIMING: Animated.TimingAnimationConfig = {
  toValue: 1,
  duration: 150,
  easing: Easing.inOut(Easing.ease),
  useNativeDriver: true,
};

/** Slow timing (500ms) for progress fills and long transitions. */
export const SLOW_TIMING: Animated.TimingAnimationConfig = {
  toValue: 1,
  duration: 500,
  easing: Easing.inOut(Easing.ease),
  useNativeDriver: false, // Often used for layout (width/height)
};

// ── Haptic Feedback Types ──────────────────────────────────────────────────

export type HapticType =
  | 'button'
  | 'tab'
  | 'error'
  | 'badge'
  | 'trade'
  | 'none';

/** Map of haptic type to its trigger function. */
const HAPTIC_MAP: Record<Exclude<HapticType, 'none'>, () => Promise<void>> = {
  button: hapticButtonPress,
  tab: hapticTabSwitch,
  error: hapticError,
  badge: hapticBadgeUnlock,
  trade: hapticTradeExecute,
};

// ── Factory Functions ──────────────────────────────────────────────────────

/**
 * Creates a staggered entrance animation for a list of items.
 * Each item fades and slides in with an increasing delay.
 *
 * @param items  Array of Animated.Value refs (one per item, initialized to 0).
 * @param delay  Milliseconds between each item's start. Defaults to 80ms.
 * @returns      A composite animation that can be started/stopped.
 */
export function createStaggerAnimation(
  items: Animated.Value[],
  delay: number = 80,
): Animated.CompositeAnimation {
  const animations = items.map((value) =>
    Animated.timing(value, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
  );

  return Animated.stagger(delay, animations);
}

/**
 * Runs multiple animations simultaneously.
 *
 * @param animations  Array of Animated.CompositeAnimation to run in parallel.
 * @returns           A composite animation that completes when all finish.
 */
export function createParallelAnimation(
  animations: Animated.CompositeAnimation[],
): Animated.CompositeAnimation {
  return Animated.parallel(animations, { stopTogether: false });
}

/**
 * Wraps an animation with a haptic feedback trigger that fires at the start.
 * The haptic call is fire-and-forget (does not delay the animation).
 *
 * @param animation   The animation to wrap.
 * @param hapticType  The type of haptic to trigger. Use 'none' to skip.
 * @returns           A new composite animation that fires haptics then runs.
 */
export function withHaptics(
  animation: Animated.CompositeAnimation,
  hapticType: HapticType,
): Animated.CompositeAnimation {
  if (hapticType === 'none') {
    return animation;
  }

  const hapticFn = HAPTIC_MAP[hapticType];

  // Return an object that conforms to CompositeAnimation interface.
  // We trigger haptics at start, then delegate to the wrapped animation.
  return {
    start: (callback?: Animated.EndCallback) => {
      // Fire haptics (non-blocking)
      hapticFn().catch(() => {
        // Haptics are non-critical; silently ignore failures
      });
      animation.start(callback);
    },
    stop: () => {
      animation.stop();
    },
    reset: () => {
      animation.reset();
    },
  };
}

/**
 * Creates a sequence of animations that run one after another.
 *
 * @param animations  Array of Animated.CompositeAnimation to run in sequence.
 * @returns           A composite animation that runs them serially.
 */
export function createSequenceAnimation(
  animations: Animated.CompositeAnimation[],
): Animated.CompositeAnimation {
  return Animated.sequence(animations);
}

/**
 * Creates a looping animation that repeats indefinitely or a set number of times.
 *
 * @param animation   The animation to loop.
 * @param iterations  Number of loops. -1 for infinite. Defaults to -1.
 * @returns           A composite animation that loops.
 */
export function createLoopAnimation(
  animation: Animated.CompositeAnimation,
  iterations: number = -1,
): Animated.CompositeAnimation {
  return Animated.loop(animation, {
    iterations: iterations === -1 ? -1 : iterations,
  });
}

/**
 * Creates a simple delay animation (useful in sequences).
 *
 * @param ms  Duration of the delay in milliseconds.
 * @returns   A composite animation representing the delay.
 */
export function createDelay(ms: number): Animated.CompositeAnimation {
  return Animated.delay(ms);
}
