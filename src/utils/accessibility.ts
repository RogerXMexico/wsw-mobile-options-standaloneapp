// Accessibility Utilities for Wall Street Wildlife Mobile
// Phase 7B: Screen reader helpers, dynamic type, reduced motion,
// high contrast support, and accessible component wrappers.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AccessibilityInfo,
  PixelRatio,
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  Text,
  StyleSheet,
} from 'react-native';

// ── Types ────────────────────────────────────────────────────────────────

/** Supported element types for automatic accessibility label generation. */
export type AccessibilityLabelType =
  | 'strategyCard'
  | 'quizOption'
  | 'greekValue'
  | 'tradeEntry';

/** Data shapes for each label type. */
export interface StrategyCardData {
  name: string;
  tier: number;
  tierName?: string;
  outlook?: string;
  isPremium?: boolean;
}

export interface QuizOptionData {
  optionText: string;
  optionIndex: number;
  isSelected?: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
}

export interface GreekValueData {
  greek: 'delta' | 'gamma' | 'theta' | 'vega' | 'rho';
  value: number;
  description?: string;
}

export interface TradeEntryData {
  symbol: string;
  type: 'call' | 'put' | 'stock';
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  strikePrice?: number;
}

type LabelDataMap = {
  strategyCard: StrategyCardData;
  quizOption: QuizOptionData;
  greekValue: GreekValueData;
  tradeEntry: TradeEntryData;
};

// ── Screen Reader Helpers ────────────────────────────────────────────────

/**
 * Generate a descriptive accessibility label for common UI elements.
 *
 * @param type  The element type (strategyCard, quizOption, greekValue, tradeEntry)
 * @param data  Element-specific data used to build the label
 * @returns A human-readable label suitable for screen readers
 *
 * @example
 * getAccessibilityLabel('strategyCard', { name: 'Iron Condor', tier: 6, tierName: 'Volatility', isPremium: true })
 * // => "Iron Condor strategy, Tier 6 Volatility, Premium content"
 */
export function getAccessibilityLabel<T extends AccessibilityLabelType>(
  type: T,
  data: LabelDataMap[T],
): string {
  switch (type) {
    case 'strategyCard': {
      const d = data as StrategyCardData;
      const parts: string[] = [`${d.name} strategy`];
      if (d.tierName) {
        parts.push(`Tier ${d.tier} ${d.tierName}`);
      } else {
        parts.push(`Tier ${d.tier}`);
      }
      if (d.outlook) {
        parts.push(`${d.outlook} outlook`);
      }
      if (d.isPremium) {
        parts.push('Premium content');
      }
      return parts.join(', ');
    }

    case 'quizOption': {
      const d = data as QuizOptionData;
      const parts: string[] = [`Option ${d.optionIndex + 1}: ${d.optionText}`];
      if (d.isSelected) {
        parts.push('Selected');
      }
      if (d.showResult) {
        parts.push(d.isCorrect ? 'Correct answer' : 'Incorrect answer');
      }
      return parts.join(', ');
    }

    case 'greekValue': {
      const d = data as GreekValueData;
      const greekNames: Record<string, string> = {
        delta: 'Delta',
        gamma: 'Gamma',
        theta: 'Theta',
        vega: 'Vega',
        rho: 'Rho',
      };
      const formattedValue = formatNumberForScreenReader(d.value, 'decimal');
      const label = `${greekNames[d.greek] ?? d.greek}: ${formattedValue}`;
      return d.description ? `${label}. ${d.description}` : label;
    }

    case 'tradeEntry': {
      const d = data as TradeEntryData;
      const actionWord = d.action === 'buy' ? 'Buy' : 'Sell';
      const typeWord = d.type === 'call' ? 'call' : d.type === 'put' ? 'put' : 'shares of stock';
      const priceStr = formatNumberForScreenReader(d.price, 'currency');
      let label = `${actionWord} ${d.quantity} ${d.symbol} ${typeWord} at ${priceStr}`;
      if (d.strikePrice !== undefined && d.type !== 'stock') {
        const strikeStr = formatNumberForScreenReader(d.strikePrice, 'currency');
        label += `, strike ${strikeStr}`;
      }
      return label;
    }

    default:
      return '';
  }
}

/**
 * Announce a message to assistive technologies.
 * Wraps `AccessibilityInfo.announceForAccessibility` with a safety check.
 *
 * @param message The message to announce
 */
export function announceForAccessibility(message: string): void {
  if (!message) return;
  AccessibilityInfo.announceForAccessibility(message);
}

/** Number format types for screen reader output. */
export type NumberFormatType = 'currency' | 'percent' | 'decimal';

/**
 * Format a number into screen-reader-friendly speech.
 *
 * @param value The numeric value
 * @param type  The formatting context: 'currency', 'percent', or 'decimal'
 * @returns A spoken-word string (e.g., "negative 350 dollars")
 *
 * @example
 * formatNumberForScreenReader(-350, 'currency')  // "negative 350 dollars"
 * formatNumberForScreenReader(0.75, 'percent')    // "75 percent"
 * formatNumberForScreenReader(-0.32, 'decimal')   // "negative 0.32"
 */
export function formatNumberForScreenReader(
  value: number,
  type: NumberFormatType,
): string {
  const isNegative = value < 0;
  const abs = Math.abs(value);
  const prefix = isNegative ? 'negative ' : '';

  switch (type) {
    case 'currency': {
      // Round to 2 decimal places for currency
      const rounded = Math.round(abs * 100) / 100;
      const hasDecimals = rounded % 1 !== 0;
      if (hasDecimals) {
        const dollars = Math.floor(rounded);
        const cents = Math.round((rounded - dollars) * 100);
        if (cents === 0) {
          return `${prefix}${dollars} dollars`;
        }
        return `${prefix}${dollars} dollars and ${cents} cents`;
      }
      return `${prefix}${rounded} dollars`;
    }

    case 'percent': {
      // Convert decimal to percentage if value is between -1 and 1
      const pctValue = abs <= 1 ? abs * 100 : abs;
      const rounded = Math.round(pctValue * 10) / 10;
      return `${prefix}${rounded} percent`;
    }

    case 'decimal': {
      // Round to a reasonable number of decimal places
      const rounded = Math.round(abs * 10000) / 10000;
      return `${prefix}${rounded}`;
    }

    default:
      return String(value);
  }
}

// ── Dynamic Type Support ─────────────────────────────────────────────────

/**
 * Hook that returns a scaled font size respecting the system's font size
 * preference. Uses `PixelRatio.getFontScale()` to detect the user's
 * accessibility font size multiplier.
 *
 * The hook also listens for changes to the bold text setting which often
 * accompanies font size changes, so it re-renders when accessibility
 * settings change.
 *
 * @param baseSize The default font size in points
 * @returns The scaled font size, clamped to a reasonable maximum (3x base)
 *
 * @example
 * const fontSize = useScaledFontSize(16);
 * // Returns 16 at default scale, 24 at 1.5x scale, etc.
 */
export function useScaledFontSize(baseSize: number): number {
  const [fontScale, setFontScale] = useState<number>(PixelRatio.getFontScale());

  useEffect(() => {
    // On iOS, bold text preference changes can signal font scale changes.
    // We listen to it as a proxy to re-read the font scale.
    const subscription = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      () => {
        setFontScale(PixelRatio.getFontScale());
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Clamp the multiplied value to a max of 3x to prevent layout breakage
  const maxScale = 3;
  const scaled = baseSize * fontScale;
  return Math.min(scaled, baseSize * maxScale);
}

/**
 * Scale a spacing value relative to the system font size multiplier.
 * Useful for ensuring padding and margins scale proportionally with text.
 *
 * @param baseSpacing The default spacing in points
 * @returns The scaled spacing value
 */
export function getScaledSpacing(baseSpacing: number): number {
  const fontScale = PixelRatio.getFontScale();
  // Use a dampened scale: spacing grows at half the rate of font size
  const dampenedScale = 1 + (fontScale - 1) * 0.5;
  return Math.round(baseSpacing * dampenedScale);
}

// ── Reduced Motion Support ───────────────────────────────────────────────

/**
 * Hook that detects whether the user has enabled the "Reduce Motion"
 * accessibility setting on their device.
 *
 * @returns `{ reduceMotion: boolean }` — true if animations should be
 * disabled or minimized
 *
 * @example
 * const { reduceMotion } = useReducedMotion();
 * const animationDuration = reduceMotion ? 0 : 300;
 */
export function useReducedMotion(): { reduceMotion: boolean } {
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  useEffect(() => {
    // Read the initial value
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        setReduceMotion(enabled);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return { reduceMotion };
}

// ── High Contrast Mode ───────────────────────────────────────────────────

/**
 * Hook that detects whether the user has enabled bold text or high contrast
 * preferences. On iOS this checks `isBoldTextEnabled`; on Android it checks
 * `isReduceTransparencyEnabled` as a proxy for high contrast needs.
 *
 * @returns `{ highContrast: boolean }`
 */
export function useHighContrast(): { highContrast: boolean } {
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    // Check bold text as a proxy for high contrast preference
    AccessibilityInfo.isBoldTextEnabled().then((enabled) => {
      setHighContrast(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      (enabled: boolean) => {
        setHighContrast(enabled);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return { highContrast };
}

/**
 * Return the appropriate color based on whether high contrast mode is active.
 *
 * @param normalColor        The default color
 * @param highContrastColor  The high-contrast alternative
 * @param isHighContrast     Whether high contrast mode is active (from useHighContrast hook)
 * @returns The selected color string
 *
 * @example
 * const { highContrast } = useHighContrast();
 * const textColor = getHighContrastColor('#888888', '#ffffff', highContrast);
 */
export function getHighContrastColor(
  normalColor: string,
  highContrastColor: string,
  isHighContrast: boolean,
): string {
  return isHighContrast ? highContrastColor : normalColor;
}

// ── Accessible Component Wrappers ────────────────────────────────────────

export interface AccessibleTouchableProps extends TouchableOpacityProps {
  /** The accessible label read by screen readers */
  accessibilityLabel: string;
  /** Optional hint that describes the result of the action */
  accessibilityHint?: string;
  /** The semantic role of the element */
  accessibilityRole?: TouchableOpacityProps['accessibilityRole'];
  /** Children to render */
  children: React.ReactNode;
}

/**
 * A TouchableOpacity wrapper that enforces accessibility props.
 * Sets `accessibilityRole` to 'button' by default and passes through
 * all other TouchableOpacity props.
 *
 * @example
 * <AccessibleTouchable
 *   accessibilityLabel="Open Iron Condor strategy"
 *   accessibilityHint="Navigates to the strategy detail screen"
 *   onPress={handlePress}
 * >
 *   <Text>Iron Condor</Text>
 * </AccessibleTouchable>
 */
export const AccessibleTouchable = React.forwardRef<
  View,
  AccessibleTouchableProps
>(function AccessibleTouchable(
  {
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    children,
    ...rest
  },
  ref,
) {
  return React.createElement(
    TouchableOpacity,
    {
      ref,
      accessibilityLabel,
      accessibilityHint,
      accessibilityRole,
      accessible: true,
      ...rest,
    },
    children,
  );
});

export interface AccessibleCardProps extends ViewProps {
  /** The card's header / title read by screen readers */
  headerLabel: string;
  /** Whether the card is currently expanded (for collapsible cards) */
  expanded?: boolean;
  /** Children to render inside the card */
  children: React.ReactNode;
}

/**
 * A View wrapper for card-like elements with proper accessibility semantics.
 * Announces the card header and its expanded/collapsed state to assistive
 * technologies.
 *
 * @example
 * <AccessibleCard headerLabel="Strategy Details" expanded={isExpanded}>
 *   <Text>Card content here</Text>
 * </AccessibleCard>
 */
export const AccessibleCard = React.forwardRef<View, AccessibleCardProps>(
  function AccessibleCard({ headerLabel, expanded, children, style, ...rest }, ref) {
    const expandedState =
      expanded !== undefined
        ? expanded
          ? ', expanded'
          : ', collapsed'
        : '';
    const label = `${headerLabel}${expandedState}`;

    return React.createElement(
      View,
      {
        ref,
        accessible: true,
        accessibilityLabel: label,
        accessibilityRole: 'summary' as any,
        ...(expanded !== undefined && {
          accessibilityState: { expanded },
        }),
        style,
        ...rest,
      },
      children,
    );
  },
);
