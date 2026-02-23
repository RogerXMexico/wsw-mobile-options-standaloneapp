// AnimalAvatar - Circular avatar showing an animal's icon with theme color
// Maps animal names to Ionicons icons and colors from the mascots palette
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius } from '../../theme';

export interface AnimalAvatarProps {
  animal: string;
  size?: number;
  showBorder?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface AnimalConfig {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  initial: string;
}

const ANIMAL_MAP: Record<string, AnimalConfig> = {
  owl: { icon: 'eye-outline', color: colors.mascots.owl, initial: 'O' },
  badger: { icon: 'shield-outline', color: colors.mascots.badger, initial: 'B' },
  monkey: { icon: 'hand-left-outline', color: colors.mascots.monkey, initial: 'M' },
  bull: { icon: 'trending-up', color: colors.mascots.bull, initial: 'B' },
  bear: { icon: 'trending-down', color: colors.mascots.bear, initial: 'B' },
  chameleon: { icon: 'color-palette-outline', color: colors.mascots.chameleon, initial: 'C' },
  cheetah: { icon: 'flash-outline', color: colors.mascots.cheetah, initial: 'C' },
  sloth: { icon: 'time-outline', color: colors.mascots.sloth, initial: 'S' },
  fox: { icon: 'analytics-outline', color: colors.mascots.fox, initial: 'F' },
  tiger: { icon: 'flame-outline', color: colors.mascots.tiger, initial: 'T' },
  eagle: { icon: 'telescope-outline', color: colors.mascots.eagle, initial: 'E' },
};

const getAnimalConfig = (animal: string): AnimalConfig => {
  const key = animal.toLowerCase().trim();
  if (ANIMAL_MAP[key]) return ANIMAL_MAP[key];

  // Fallback: use first letter and a default color
  return {
    icon: 'paw-outline',
    color: colors.neon.cyan,
    initial: animal.charAt(0).toUpperCase(),
  };
};

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({
  animal,
  size = 48,
  showBorder = true,
  style,
}) => {
  const config = useMemo(() => getAnimalConfig(animal), [animal]);
  const iconSize = Math.round(size * 0.45);
  const borderWidth = showBorder ? 2 : 0;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: config.color + '60',
          backgroundColor: config.color + '12',
        },
        showBorder && {
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 3,
        },
        style,
      ]}
    >
      <Ionicons name={config.icon} size={iconSize} color={config.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimalAvatar;
