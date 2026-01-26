// Welcome Screen - First screen of onboarding
// Animated intro with Wall Street Wildlife branding

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

const { width, height } = Dimensions.get('window');

// Animal silhouettes for background animation
const JUNGLE_ANIMALS = ['🦁', '🐯', '🦊', '🦉', '🐢', '🦥', '🐆', '🐻', '🐵'];

interface Props {
  onNext: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onNext }) => {
  // Animation values
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(50)).current;
  const glowPulse = useRef(new Animated.Value(0.3)).current;

  // Background animal animations
  const animalPositions = useRef(
    JUNGLE_ANIMALS.map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
    }))
  ).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      // Logo appears first
      Animated.parallel([
        Animated.timing(logoFade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Title slides in
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle fades in
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Button slides up
      Animated.parallel([
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonSlide, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animate background animals
    animalPositions.forEach((animal, index) => {
      // Fade in with delay
      Animated.timing(animal.opacity, {
        toValue: 0.15,
        duration: 1000,
        delay: index * 200,
        useNativeDriver: true,
      }).start();

      // Gentle floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(animal.y, {
            toValue: (animal.y as any)._value - 20,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animal.y, {
            toValue: (animal.y as any)._value + 20,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background floating animals */}
      <View style={styles.backgroundAnimals}>
        {JUNGLE_ANIMALS.map((emoji, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.backgroundEmoji,
              {
                opacity: animalPositions[index].opacity,
                transform: [
                  { translateX: animalPositions[index].x },
                  { translateY: animalPositions[index].y },
                  { scale: animalPositions[index].scale },
                ],
              },
            ]}
          >
            {emoji}
          </Animated.Text>
        ))}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoFade,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.logoGlow,
              { opacity: glowPulse },
            ]}
          />
          <View style={styles.logoInner}>
            <Text style={styles.logoEmoji}>🦁</Text>
          </View>
        </Animated.View>

        {/* Title Section */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleFade,
              transform: [{ translateY: titleSlide }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={[styles.brandName, shadows.neonGreenSubtle]}>
            Wall Street Wildlife
          </Text>
          <Text style={styles.tagline}>Options University</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
          Master options trading through the wisdom of the jungle.
          Learn at your own pace, track your progress, and evolve into a confident trader.
        </Animated.Text>

        {/* Features preview */}
        <Animated.View style={[styles.featuresRow, { opacity: subtitleFade }]}>
          <View style={styles.featureChip}>
            <Text style={styles.featureEmoji}>📚</Text>
            <Text style={styles.featureText}>11 Tiers</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureEmoji}>🛠️</Text>
            <Text style={styles.featureText}>Pro Tools</Text>
          </View>
          <View style={styles.featureChip}>
            <Text style={styles.featureEmoji}>📝</Text>
            <Text style={styles.featureText}>Practice</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom CTA */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            opacity: buttonFade,
            transform: [{ translateY: buttonSlide }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.startButton}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Begin Your Journey</Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Join thousands of traders learning the Wall Street way
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backgroundAnimals: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  backgroundEmoji: {
    position: 'absolute',
    fontSize: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.neon.green,
  },
  logoInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.secondary,
    borderWidth: 3,
    borderColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.neonGreen,
  },
  logoEmoji: {
    fontSize: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  welcomeText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  brandName: {
    fontFamily: typography.fonts.bold,
    fontSize: 32,
    color: colors.neon.green,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  tagline: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  featureEmoji: {
    fontSize: 16,
  },
  featureText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.neonGreenSubtle,
  },
  startButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  startButtonArrow: {
    fontSize: 20,
    color: colors.background.primary,
    fontWeight: '600',
  },
  footerText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default WelcomeScreen;
