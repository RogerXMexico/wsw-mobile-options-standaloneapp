// Onboarding Complete Screen - Celebration and transition to main app
// Shows user's spirit animal and personalized welcome

import React, { useEffect, useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

const { width, height } = Dimensions.get('window');

// Animal data for display
const ANIMAL_DATA: Record<string, {
  name: string;
  emoji: string;
  color: string;
  welcomeMessage: string;
  image: any;
}> = {
  turtle: {
    name: 'The Turtle',
    emoji: '🐢',
    color: '#10B981',
    welcomeMessage: 'Your journey begins with strong foundations. Take it slow, learn deep.',
    image: require('../../../assets/animals/Turtle WSW.png'),
  },
  sloth: {
    name: 'The Sloth',
    emoji: '🦥',
    color: '#8B5CF6',
    welcomeMessage: 'Patience is your superpower. Time decay is your friend.',
    image: require('../../../assets/animals/Sloth WSW.png'),
  },
  owl: {
    name: 'The Owl',
    emoji: '🦉',
    color: '#6366F1',
    welcomeMessage: 'Wisdom guides your trades. Knowledge is your edge.',
    image: require('../../../assets/animals/Owl WSW.png'),
  },
  fox: {
    name: 'The Fox',
    emoji: '🦊',
    color: '#F59E0B',
    welcomeMessage: 'Adaptability is key. Every market condition is an opportunity.',
    image: require('../../../assets/animals/Fox WSW.png'),
  },
  cheetah: {
    name: 'The Cheetah',
    emoji: '🐆',
    color: '#EF4444',
    welcomeMessage: 'Speed meets precision. Strike when the moment is right.',
    image: require('../../../assets/animals/Cheetah WSW.png'),
  },
};

// Confetti particle component
const ConfettiParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: translateX._value + (Math.random() - 0.5) * 200,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: Math.random() * 10,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 10],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { rotate: spin },
          ],
          opacity,
        },
      ]}
    />
  );
};

interface Props {
  onComplete: () => void;
}

const OnboardingCompleteScreen: React.FC<Props> = ({ onComplete }) => {
  const [userAnimal, setUserAnimal] = useState<string>('owl');
  const [userName, setUserName] = useState<string>('Trader');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(100)).current;

  // Confetti colors
  const confettiColors = [
    colors.neon.green,
    colors.neon.cyan,
    colors.neon.purple,
    colors.neon.yellow,
    colors.neon.pink,
  ];

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      const animal = await AsyncStorage.getItem('userSpiritAnimal');
      if (animal && ANIMAL_DATA[animal]) {
        setUserAnimal(animal);
      }
    };
    loadUserData();

    // Entrance animations
    Animated.sequence([
      // Animal avatar appears with pulse
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Ring animation
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(ringScale, {
          toValue: 1.3,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Fade ring and show content
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Button slides up
      Animated.spring(buttonSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animalData = ANIMAL_DATA[userAnimal] || ANIMAL_DATA.owl;

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti */}
      <View style={styles.confettiContainer}>
        {Array.from({ length: 30 }).map((_, index) => (
          <ConfettiParticle
            key={index}
            delay={index * 100}
            color={confettiColors[index % confettiColors.length]}
          />
        ))}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Success header */}
        <Animated.View style={[styles.headerSection, { opacity: contentFade }]}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.congratsText}>You're All Set!</Text>
        </Animated.View>

        {/* Animal Avatar with animation */}
        <View style={styles.avatarSection}>
          <Animated.View
            style={[
              styles.avatarRing,
              {
                borderColor: animalData.color,
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                borderColor: animalData.color,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={animalData.image}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </Animated.View>
        </View>

        {/* Animal Info */}
        <Animated.View style={[styles.infoSection, { opacity: contentFade }]}>
          <Text style={[styles.animalName, { color: animalData.color }]}>
            {animalData.emoji} {animalData.name}
          </Text>
          <Text style={styles.welcomeMessage}>"{animalData.welcomeMessage}"</Text>
        </Animated.View>

        {/* Ready message */}
        <Animated.View style={[styles.readySection, { opacity: contentFade }]}>
          <View style={styles.readyCard}>
            <Text style={styles.readyTitle}>Your jungle awaits</Text>
            <View style={styles.readyFeatures}>
              <View style={styles.readyFeature}>
                <Text style={styles.readyIcon}>📚</Text>
                <Text style={styles.readyText}>Start with your personalized tier</Text>
              </View>
              <View style={styles.readyFeature}>
                <Text style={styles.readyIcon}>🎯</Text>
                <Text style={styles.readyText}>Complete daily missions for rewards</Text>
              </View>
              <View style={styles.readyFeature}>
                <Text style={styles.readyIcon}>📈</Text>
                <Text style={styles.readyText}>Track your progress as you grow</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom CTA */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            transform: [{ translateY: buttonSlide }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.enterButton, { backgroundColor: animalData.color }]}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.enterButtonText}>Enter the Jungle</Text>
          <Text style={styles.enterArrow}>🌴</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Your spirit animal will guide your journey
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
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  congratsText: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  avatarRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
  },
  avatarContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
    ...shadows.dark,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  animalName: {
    ...typography.styles.h2,
    marginBottom: spacing.sm,
  },
  welcomeMessage: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 24,
  },
  readySection: {
    width: '100%',
  },
  readyCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  readyTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  readyFeatures: {
    gap: spacing.sm,
  },
  readyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  readyIcon: {
    fontSize: 20,
  },
  readyText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.dark,
  },
  enterButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  enterArrow: {
    fontSize: 20,
  },
  footerText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default OnboardingCompleteScreen;
