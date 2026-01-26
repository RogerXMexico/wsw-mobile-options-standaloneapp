// Onboarding Complete Screen - Celebration and transition to main app
// Shows user's spirit animal and personalized welcome

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

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

interface Props {
  onComplete: () => void;
}

const OnboardingCompleteScreen: React.FC<Props> = ({ onComplete }) => {
  const [userAnimal, setUserAnimal] = useState<string>('owl');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      const animal = await AsyncStorage.getItem('userSpiritAnimal');
      if (animal && ANIMAL_DATA[animal]) {
        setUserAnimal(animal);
      }
    };
    loadUserData();

    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animalData = ANIMAL_DATA[userAnimal] || ANIMAL_DATA.owl;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Success header */}
        <View style={styles.headerSection}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.congratsText}>You're All Set!</Text>
        </View>

        {/* Animal Avatar */}
        <View
          style={[
            styles.avatarContainer,
            { borderColor: animalData.color },
          ]}
        >
          <Image
            source={animalData.image}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>

        {/* Animal Info */}
        <Text style={[styles.animalName, { color: animalData.color }]}>
          {animalData.emoji} {animalData.name}
        </Text>
        <Text style={styles.welcomeMessage}>"{animalData.welcomeMessage}"</Text>

        {/* Ready message */}
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

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
  avatarContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.lg,
    ...shadows.dark,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
    marginBottom: spacing.xl,
  },
  readyCard: {
    width: '100%',
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
