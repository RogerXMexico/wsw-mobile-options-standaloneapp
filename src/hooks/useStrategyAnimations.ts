// Strategy Animation Hook for Wall Street Wildlife Mobile
// Provides touch-native animation values and gesture handlers for strategy screens.
// Replaces the desktop hover/click effects (useStrategyInteractiveEffects.ts)
// with mobile-optimized touch gestures and spring physics.
//
// Uses only React Native's built-in Animated API (no react-native-reanimated).

import { useRef, useCallback, useEffect, useMemo } from 'react';
import { Animated, Easing, ViewStyle, LayoutAnimation, Platform, UIManager } from 'react-native';
import {
  SPRING_CONFIG,
  QUICK_SPRING,
  GENTLE_SPRING,
} from '../utils/animations';
import { hapticButtonPress, hapticTabSwitch, hapticError } from '../utils/haptics';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface StrategyAnimations {
  // Card interactions
  cardPressStyle: Animated.WithAnimatedObject<ViewStyle>;
  onCardPressIn: () => void;
  onCardPressOut: () => void;

  // Entrance animations
  slideInStyle: (index?: number) => Animated.WithAnimatedObject<ViewStyle>;
  fadeInStyle: Animated.WithAnimatedObject<ViewStyle>;
  staggerDelay: (index: number, baseDelay?: number) => number;
  triggerEntrance: () => void;

  // Value change animations
  pulseStyle: Animated.WithAnimatedObject<ViewStyle>;
  triggerPulse: () => void;
  flashStyle: (type: 'profit' | 'loss') => Animated.WithAnimatedObject<ViewStyle>;
  triggerFlash: (type: 'profit' | 'loss') => void;

  // Section animations
  expandStyle: (expanded: boolean) => Animated.WithAnimatedObject<ViewStyle>;
  toggleExpand: (currentlyExpanded: boolean) => void;

  // Tab transitions
  tabTransitionStyle: Animated.WithAnimatedObject<ViewStyle>;
  animateTabChange: (direction?: 'left' | 'right') => void;

  // Feedback
  shakeStyle: Animated.WithAnimatedObject<ViewStyle>;
  triggerShake: () => void;
  successStyle: Animated.WithAnimatedObject<ViewStyle>;
  triggerSuccess: () => void;

  // Progress
  progressWidth: Animated.Value;
  animateProgress: (toValue: number, duration?: number) => void;
}

// ── Constants ────────────────────────────────────────────────────────────────

const CARD_PRESS_SCALE = 0.96;
const SLIDE_IN_DISTANCE = 40;
const STAGGER_DEFAULT_DELAY = 80;
const SHAKE_DISTANCE = 10;
const SHAKE_DURATION = 60;
const MAX_STAGGER_ITEMS = 20;

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useStrategyAnimations(): StrategyAnimations {
  // ── Animated Values ────────────────────────────────────────────────────

  // Card press
  const cardScale = useRef(new Animated.Value(1)).current;

  // Entrance: single fade value + per-item slide values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideValues = useRef<Animated.Value[]>(
    Array.from({ length: MAX_STAGGER_ITEMS }, () => new Animated.Value(0)),
  ).current;

  // Pulse (for Greeks value changes)
  const pulseScale = useRef(new Animated.Value(1)).current;

  // P&L flash
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const flashColorInterp = useRef(new Animated.Value(0)).current; // 0 = profit, 1 = loss

  // Expand/collapse
  const expandProgress = useRef(new Animated.Value(0)).current;

  // Tab transition
  const tabOpacity = useRef(new Animated.Value(1)).current;
  const tabTranslateX = useRef(new Animated.Value(0)).current;

  // Shake
  const shakeTranslateX = useRef(new Animated.Value(0)).current;

  // Success checkmark
  const successScale = useRef(new Animated.Value(0)).current;
  const successRotation = useRef(new Animated.Value(0)).current;

  // Progress bar
  const progressWidth = useRef(new Animated.Value(0)).current;

  // Track mounted state for cleanup
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ── Card Press ─────────────────────────────────────────────────────────

  const onCardPressIn = useCallback(() => {
    hapticButtonPress().catch(() => {});
    Animated.spring(cardScale, {
      ...QUICK_SPRING,
      toValue: CARD_PRESS_SCALE,
    }).start();
  }, [cardScale]);

  const onCardPressOut = useCallback(() => {
    Animated.spring(cardScale, {
      ...SPRING_CONFIG,
      toValue: 1,
    }).start();
  }, [cardScale]);

  const cardPressStyle = useMemo(
    () => ({
      transform: [{ scale: cardScale }],
    }),
    [cardScale],
  );

  // ── Entrance Animations ────────────────────────────────────────────────

  const triggerEntrance = useCallback(() => {
    // Reset values
    fadeIn.setValue(0);
    slideValues.forEach((v) => v.setValue(0));

    // Fade in the container
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Stagger slide-in for individual items
    const staggerAnims = slideValues.map((value) =>
      Animated.spring(value, {
        ...GENTLE_SPRING,
        toValue: 1,
      }),
    );
    Animated.stagger(STAGGER_DEFAULT_DELAY, staggerAnims).start();
  }, [fadeIn, slideValues]);

  const slideInStyle = useCallback(
    (index: number = 0): Animated.WithAnimatedObject<ViewStyle> => {
      const clampedIndex = Math.min(index, MAX_STAGGER_ITEMS - 1);
      const value = slideValues[clampedIndex];
      return {
        opacity: value,
        transform: [
          {
            translateY: value.interpolate({
              inputRange: [0, 1],
              outputRange: [SLIDE_IN_DISTANCE, 0],
            }),
          },
        ],
      };
    },
    [slideValues],
  );

  const fadeInStyle = useMemo(
    () => ({
      opacity: fadeIn,
    }),
    [fadeIn],
  );

  const staggerDelay = useCallback(
    (index: number, baseDelay: number = STAGGER_DEFAULT_DELAY): number => {
      return index * baseDelay;
    },
    [],
  );

  // ── Pulse Animation (Greeks) ───────────────────────────────────────────

  const triggerPulse = useCallback(() => {
    pulseScale.setValue(1);
    Animated.sequence([
      Animated.timing(pulseScale, {
        toValue: 1.15,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(pulseScale, {
        ...SPRING_CONFIG,
        toValue: 1,
      }),
    ]).start();
  }, [pulseScale]);

  const pulseStyle = useMemo(
    () => ({
      transform: [{ scale: pulseScale }],
    }),
    [pulseScale],
  );

  // ── P&L Flash ──────────────────────────────────────────────────────────

  const triggerFlash = useCallback(
    (type: 'profit' | 'loss') => {
      flashColorInterp.setValue(type === 'profit' ? 0 : 1);
      flashOpacity.setValue(0);

      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.6,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    },
    [flashOpacity, flashColorInterp],
  );

  const flashStyle = useCallback(
    (type: 'profit' | 'loss'): Animated.WithAnimatedObject<ViewStyle> => ({
      opacity: flashOpacity,
      backgroundColor: type === 'profit' ? '#39ff14' : '#ff4444',
    }),
    [flashOpacity],
  );

  // ── Expand/Collapse ────────────────────────────────────────────────────

  const toggleExpand = useCallback(
    (currentlyExpanded: boolean) => {
      // Use LayoutAnimation for smooth height transitions since useNativeDriver
      // cannot animate height/layout properties.
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          300,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity,
        ),
      );

      Animated.timing(expandProgress, {
        toValue: currentlyExpanded ? 0 : 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    },
    [expandProgress],
  );

  const expandStyle = useCallback(
    (_expanded: boolean): Animated.WithAnimatedObject<ViewStyle> => ({
      opacity: expandProgress,
      transform: [
        {
          scaleY: expandProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
    }),
    [expandProgress],
  );

  // ── Tab Transitions ────────────────────────────────────────────────────

  const animateTabChange = useCallback(
    (direction: 'left' | 'right' = 'right') => {
      hapticTabSwitch().catch(() => {});

      const slideDistance = direction === 'right' ? 20 : -20;

      // Fade out + slide out current content
      Animated.parallel([
        Animated.timing(tabOpacity, {
          toValue: 0,
          duration: 120,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tabTranslateX, {
          toValue: -slideDistance,
          duration: 120,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (!mountedRef.current) return;

        // Snap to entry position
        tabTranslateX.setValue(slideDistance);

        // Fade in + slide in new content
        Animated.parallel([
          Animated.timing(tabOpacity, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(tabTranslateX, {
            ...QUICK_SPRING,
            toValue: 0,
          }),
        ]).start();
      });
    },
    [tabOpacity, tabTranslateX],
  );

  const tabTransitionStyle = useMemo(
    () => ({
      opacity: tabOpacity,
      transform: [{ translateX: tabTranslateX }],
    }),
    [tabOpacity, tabTranslateX],
  );

  // ── Shake Animation ────────────────────────────────────────────────────

  const triggerShake = useCallback(() => {
    hapticError().catch(() => {});
    shakeTranslateX.setValue(0);

    Animated.sequence([
      Animated.timing(shakeTranslateX, {
        toValue: SHAKE_DISTANCE,
        duration: SHAKE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeTranslateX, {
        toValue: -SHAKE_DISTANCE,
        duration: SHAKE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeTranslateX, {
        toValue: SHAKE_DISTANCE * 0.6,
        duration: SHAKE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeTranslateX, {
        toValue: -SHAKE_DISTANCE * 0.6,
        duration: SHAKE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeTranslateX, {
        toValue: SHAKE_DISTANCE * 0.2,
        duration: SHAKE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.spring(shakeTranslateX, {
        ...QUICK_SPRING,
        toValue: 0,
      }),
    ]).start();
  }, [shakeTranslateX]);

  const shakeStyle = useMemo(
    () => ({
      transform: [{ translateX: shakeTranslateX }],
    }),
    [shakeTranslateX],
  );

  // ── Success Checkmark ──────────────────────────────────────────────────

  const triggerSuccess = useCallback(() => {
    successScale.setValue(0);
    successRotation.setValue(0);

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        tension: 120,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(successRotation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [successScale, successRotation]);

  const successStyle = useMemo(
    () => ({
      transform: [
        { scale: successScale },
        {
          rotate: successRotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['-45deg', '0deg'],
          }),
        },
      ],
      opacity: successScale,
    }),
    [successScale, successRotation],
  );

  // ── Progress Bar ───────────────────────────────────────────────────────

  const animateProgress = useCallback(
    (toValue: number, duration: number = 800) => {
      // Clamp to 0-1
      const clamped = Math.max(0, Math.min(1, toValue));

      Animated.timing(progressWidth, {
        toValue: clamped,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // Width cannot use native driver
      }).start();
    },
    [progressWidth],
  );

  // ── Return ─────────────────────────────────────────────────────────────

  return {
    // Card interactions
    cardPressStyle,
    onCardPressIn,
    onCardPressOut,

    // Entrance animations
    slideInStyle,
    fadeInStyle,
    staggerDelay,
    triggerEntrance,

    // Value change animations
    pulseStyle,
    triggerPulse,
    flashStyle,
    triggerFlash,

    // Section animations
    expandStyle,
    toggleExpand,

    // Tab transitions
    tabTransitionStyle,
    animateTabChange,

    // Feedback
    shakeStyle,
    triggerShake,
    successStyle,
    triggerSuccess,

    // Progress
    progressWidth,
    animateProgress,
  };
}
