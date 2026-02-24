// Spirit Animal Selection - Onboarding Screen
// User selects their trading experience level and gets matched with a spirit animal

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { InlineIcon } from '../../components/ui/InlineIcon';

const { width, height } = Dimensions.get('window');

// Experience levels with matching animals
const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    level: 'Complete Beginner',
    description: 'New to options, learning the basics',
    animal: 'turtle',
    animalName: 'The Turtle',
    color: '#10B981', // Emerald
    philosophy: 'Slow and steady wins the race. Protection first.',
    startTier: 0,
  },
  {
    id: 'basic',
    level: 'Basic Trader',
    description: 'Understand calls & puts, some experience',
    animal: 'sloth',
    animalName: 'The Sloth',
    color: '#8B5CF6', // Purple
    philosophy: 'Patience is profitable. Let time work for you.',
    startTier: 1,
  },
  {
    id: 'intermediate',
    level: 'Intermediate',
    description: 'Trade spreads, understand Greeks',
    animal: 'owl',
    animalName: 'The Owl',
    color: '#6366F1', // Indigo
    philosophy: 'Wisdom comes from watching. Knowledge is edge.',
    startTier: 3,
  },
  {
    id: 'advanced',
    level: 'Advanced',
    description: 'Multi-leg strategies, volatility plays',
    animal: 'fox',
    animalName: 'The Fox',
    color: '#F59E0B', // Amber
    philosophy: 'Adapt and thrive. Every situation has opportunity.',
    startTier: 5,
  },
  {
    id: 'expert',
    level: 'Expert',
    description: 'Master of complex strategies & risk',
    animal: 'cheetah',
    animalName: 'The Cheetah',
    color: '#EF4444', // Red
    philosophy: 'Strike with precision. Speed meets preparation.',
    startTier: 7,
  },
];

// Animal images mapping
const ANIMAL_IMAGES: Record<string, any> = {
  turtle: require('../../../assets/animals/Turtle WSW.png'),
  sloth: require('../../../assets/animals/Sloth WSW.png'),
  owl: require('../../../assets/animals/Owl WSW.png'),
  fox: require('../../../assets/animals/Fox WSW.png'),
  cheetah: require('../../../assets/animals/Cheetah WSW.png'),
};

interface Props {
  onComplete: (animalId: string, experienceLevel: string) => void;
  onBack?: () => void;
}

const SpiritAnimalScreen: React.FC<Props> = ({ onComplete, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const resultScaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
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

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevel(levelId);
  };

  const handleConfirm = () => {
    if (!selectedLevel) return;

    // Show result animation
    setShowResult(true);
    Animated.parallel([
      Animated.timing(resultFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(resultScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = async () => {
    if (!selectedLevel) return;

    const level = EXPERIENCE_LEVELS.find(l => l.id === selectedLevel);
    if (level) {
      // Save spirit animal and experience level to AsyncStorage
      await AsyncStorage.setItem('userSpiritAnimal', level.animal);
      await AsyncStorage.setItem('userExperienceLevel', level.id);
      await AsyncStorage.setItem('userStartTier', level.startTier.toString());

      // Let the parent (OnboardingNavigator) handle marking onboarding complete
      onComplete(level.animal, level.id);
    }
  };

  const selectedData = EXPERIENCE_LEVELS.find(l => l.id === selectedLevel);

  if (showResult && selectedData) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.resultContainer,
            {
              opacity: resultFadeAnim,
              transform: [{ scale: resultScaleAnim }],
            }
          ]}
        >
          <Text style={styles.resultTitle}>Your Spirit Animal</Text>

          <View style={[styles.resultAnimalContainer, { borderColor: selectedData.color }]}>
            <Image
              source={ANIMAL_IMAGES[selectedData.animal]}
              style={styles.resultAnimalImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.resultAnimalNameRow}>
            <InlineIcon name={selectedData.animal} size={28} />
            <Text style={[styles.resultAnimalName, { color: selectedData.color }]}>
              {selectedData.animalName}
            </Text>
          </View>

          <Text style={styles.resultPhilosophy}>
            "{selectedData.philosophy}"
          </Text>

          <View style={styles.resultLevelBadge}>
            <Text style={styles.resultLevelText}>{selectedData.level}</Text>
          </View>

          <Text style={styles.resultDescription}>
            Your journey begins at Tier {selectedData.startTier}.
            {selectedData.startTier === 0
              ? " We'll guide you through the fundamentals step by step."
              : " You can review earlier tiers anytime to fill in gaps."}
          </Text>

          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: selectedData.color }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Enter the Jungle</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      {onBack && (
        <View style={styles.navHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover Your</Text>
          <Text style={styles.titleHighlight}>Trading Spirit Animal</Text>
          <Text style={styles.subtitle}>
            Select your current options trading experience
          </Text>
        </View>

        {/* Experience Level Options */}
        <View style={styles.optionsContainer}>
          {EXPERIENCE_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.optionCard,
                selectedLevel === level.id && styles.optionCardSelected,
                selectedLevel === level.id && { borderColor: level.color },
              ]}
              onPress={() => handleSelectLevel(level.id)}
              activeOpacity={0.8}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.animalCircle, { backgroundColor: `${level.color}20` }]}>
                  <Image
                    source={ANIMAL_IMAGES[level.animal]}
                    style={styles.animalThumb}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View style={styles.optionCenter}>
                <Text style={styles.optionLevel}>{level.level}</Text>
                <Text style={styles.optionDescription}>{level.description}</Text>
              </View>
              <View style={styles.optionRight}>
                <InlineIcon name={level.animal} size={24} />
                {selectedLevel === level.id && (
                  <View style={[styles.checkmark, { backgroundColor: level.color }]}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedLevel && styles.confirmButtonDisabled,
            selectedLevel && selectedData && { backgroundColor: selectedData.color },
          ]}
          onPress={handleConfirm}
          disabled={!selectedLevel}
        >
          <Text style={styles.confirmButtonText}>
            {selectedLevel ? `Meet ${selectedData?.animalName}` : 'Select Your Level'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.honestNote}>
          Be honest — this helps us personalize your learning path
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
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.secondary,
  },
  titleHighlight: {
    ...typography.styles.h1,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.muted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  optionCardSelected: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
  },
  optionLeft: {
    marginRight: spacing.md,
  },
  animalCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  animalThumb: {
    width: 40,
    height: 40,
  },
  optionCenter: {
    flex: 1,
  },
  optionLevel: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: 2,
  },
  optionDescription: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  optionRight: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  optionEmoji: {
    fontSize: 24,
  },
  checkmark: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.background.tertiary,
  },
  confirmButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  honestNote: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  // Result screen styles
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  resultTitle: {
    ...typography.styles.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  resultAnimalContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  resultAnimalImage: {
    width: '100%',
    height: '100%',
  },
  resultAnimalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  resultAnimalName: {
    ...typography.styles.h2,
  },
  resultPhilosophy: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  resultLevelBadge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
  },
  resultLevelText: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  resultDescription: {
    ...typography.styles.bodySm,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  continueButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['2xl'],
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
  },
  continueButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
});

export default SpiritAnimalScreen;
