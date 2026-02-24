// AnimalAvatar - Circular avatar showing an animal's image with theme color
// Uses real animal images from asset registry with Ionicon fallback
import React, { useMemo } from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { ANIMAL_IMAGES } from '../../utils/assetRegistry';

export interface AnimalAvatarProps {
  animal: string;
  size?: number;
  showBorder?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface AnimalConfig {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const ANIMAL_MAP: Record<string, AnimalConfig> = {
  owl: { icon: 'eye-outline', color: colors.mascots.owl },
  badger: { icon: 'shield-outline', color: colors.mascots.badger },
  monkey: { icon: 'hand-left-outline', color: colors.mascots.monkey },
  bull: { icon: 'trending-up', color: colors.mascots.bull },
  bear: { icon: 'trending-down', color: colors.mascots.bear },
  chameleon: { icon: 'color-palette-outline', color: colors.mascots.chameleon },
  cheetah: { icon: 'flash-outline', color: colors.mascots.cheetah },
  sloth: { icon: 'time-outline', color: colors.mascots.sloth },
  fox: { icon: 'analytics-outline', color: colors.mascots.fox },
  tiger: { icon: 'flame-outline', color: colors.mascots.tiger },
  eagle: { icon: 'telescope-outline', color: colors.mascots.eagle },
  turtle: { icon: 'leaf-outline', color: '#22c55e' },
  goldenretriever: { icon: 'paw-outline', color: '#f59e0b' },
  dolphin: { icon: 'water-outline', color: '#06b6d4' },
  octopus: { icon: 'git-branch-outline', color: '#a855f7' },
  lion: { icon: 'sunny-outline', color: '#f59e0b' },
  wolf: { icon: 'moon-outline', color: '#64748b' },
  kangaroo: { icon: 'arrow-up-outline', color: '#f97316' },
  panda: { icon: 'ellipse-outline', color: '#e2e8f0' },
};

const getAnimalConfig = (animal: string): AnimalConfig => {
  const key = animal.toLowerCase().trim();
  if (ANIMAL_MAP[key]) return ANIMAL_MAP[key];

  return {
    icon: 'paw-outline',
    color: colors.neon.cyan,
  };
};

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({
  animal,
  size = 48,
  showBorder = true,
  style,
}) => {
  const config = useMemo(() => getAnimalConfig(animal), [animal]);
  const key = animal.toLowerCase().trim();
  const imageSource = ANIMAL_IMAGES[key];
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
          backgroundColor: imageSource ? 'transparent' : config.color + '12',
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
      {imageSource ? (
        <Image
          source={imageSource}
          style={{
            width: size - borderWidth * 2,
            height: size - borderWidth * 2,
            borderRadius: (size - borderWidth * 2) / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <Ionicons name={config.icon} size={iconSize} color={config.color} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default AnimalAvatar;
