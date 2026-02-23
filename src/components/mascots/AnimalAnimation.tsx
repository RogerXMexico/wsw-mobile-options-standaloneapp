// AnimalAnimation - Animated animal avatar component
// Supports bounce, pulse, and shake animations using React Native Animated API
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { AnimalAvatar } from './AnimalAvatar';

export interface AnimalAnimationProps {
  animal: string;
  animation?: 'bounce' | 'pulse' | 'shake';
  size?: number;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
}

export const AnimalAnimation: React.FC<AnimalAnimationProps> = ({
  animal,
  animation = 'bounce',
  size = 64,
  style,
  active = true,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      animValue.setValue(0);
      return;
    }

    let anim: Animated.CompositeAnimation;

    switch (animation) {
      case 'bounce':
        anim = Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'pulse':
        anim = Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'shake':
        anim = Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: -1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
            // Pause between shake bursts
            Animated.delay(1500),
          ])
        );
        break;
    }

    anim.start();

    return () => {
      anim.stop();
    };
  }, [animation, active]);

  const getTransform = (): Animated.WithAnimatedObject<ViewStyle>['transform'] => {
    switch (animation) {
      case 'bounce': {
        const translateY = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -12],
        });
        return [{ translateY }];
      }

      case 'pulse': {
        const scale = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.12],
        });
        const opacity = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85],
        });
        return [{ scale }];
      }

      case 'shake': {
        const translateX = animValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-4, 0, 4],
        });
        return [{ translateX }];
      }

      default:
        return [];
    }
  };

  // For pulse, we also animate opacity
  const getOpacity = (): Animated.AnimatedInterpolation<number> | number => {
    if (animation === 'pulse') {
      return animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.85],
      });
    }
    return 1;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: getTransform(),
          opacity: getOpacity() as any,
        },
        style,
      ]}
    >
      <AnimalAvatar animal={animal} size={size} showBorder />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});

export default AnimalAnimation;
