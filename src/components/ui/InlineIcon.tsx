// InlineIcon — drop-in replacement for emoji in JSX
// Renders animal images, custom icon images, or Ionicons vector icons
import React from 'react';
import { Image, ImageStyle, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ANIMAL_IMAGES,
  ICON_IMAGES,
  EMOJI_TO_IONICON,
  EMOJI_TO_ANIMAL,
  STATUS_DOT_COLORS,
} from '../../utils/assetRegistry';

export interface InlineIconProps {
  /** Named key: animal key (e.g. 'turtle'), icon image key (e.g. 'fire'), or Ionicon name (e.g. 'bar-chart-outline') */
  name?: string;
  /** Emoji character to auto-map to Ionicon or animal image */
  emoji?: string;
  /** Icon size in points (default 20) */
  size?: number;
  /** Icon color — applies to Ionicons only, images use their original colors */
  color?: string;
  /** Additional style */
  style?: StyleProp<ImageStyle | ViewStyle>;
}

export const InlineIcon: React.FC<InlineIconProps> = ({
  name,
  emoji,
  size = 20,
  color = '#94a3b8',
  style,
}) => {
  // Priority 1: Resolve emoji to a named key or Ionicon
  if (emoji) {
    // Check if it maps to an animal image
    const animalKey = EMOJI_TO_ANIMAL[emoji];
    if (animalKey && ANIMAL_IMAGES[animalKey]) {
      return (
        <Image
          source={ANIMAL_IMAGES[animalKey]}
          style={[{ width: size, height: size, borderRadius: size / 2 }, style as ImageStyle]}
          resizeMode="cover"
        />
      );
    }

    // Check if it maps to a status dot (colored circle)
    const dotColor = STATUS_DOT_COLORS[emoji];
    if (dotColor) {
      return (
        <Ionicons
          name="ellipse"
          size={size * 0.6}
          color={dotColor}
          style={style}
        />
      );
    }

    // Check if it maps to an Ionicon
    const ioniconName = EMOJI_TO_IONICON[emoji];
    if (ioniconName) {
      return (
        <Ionicons
          name={ioniconName as keyof typeof Ionicons.glyphMap}
          size={size}
          color={color}
          style={style}
        />
      );
    }

    // Fallback: render nothing (emoji stripped)
    return null;
  }

  // Priority 2: Named key
  if (name) {
    // Check animal images
    if (ANIMAL_IMAGES[name.toLowerCase()]) {
      return (
        <Image
          source={ANIMAL_IMAGES[name.toLowerCase()]}
          style={[{ width: size, height: size, borderRadius: size / 2 }, style as ImageStyle]}
          resizeMode="cover"
        />
      );
    }

    // Check icon images
    if (ICON_IMAGES[name]) {
      return (
        <Image
          source={ICON_IMAGES[name]}
          style={[{ width: size, height: size }, style as ImageStyle]}
          resizeMode="contain"
        />
      );
    }

    // Assume it's an Ionicon name
    return (
      <Ionicons
        name={name as keyof typeof Ionicons.glyphMap}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  return null;
};

export default InlineIcon;
