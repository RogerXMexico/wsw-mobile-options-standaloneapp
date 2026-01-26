// Onboarding Navigator - Manages the onboarding flow
// Flow: Welcome -> Feature Tour -> Goals -> Spirit Animal -> Complete

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme';

import {
  WelcomeScreen,
  FeatureTourScreen,
  GoalSettingScreen,
  OnboardingCompleteScreen,
} from '../screens/onboarding';
import SpiritAnimalScreen from '../screens/onboarding/SpiritAnimalScreen';

type OnboardingStep = 'welcome' | 'features' | 'goals' | 'spirit' | 'complete';

interface Props {
  onComplete: () => void;
}

const OnboardingNavigator: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');

  // Navigation handlers
  const goToFeatures = () => setCurrentStep('features');
  const goToGoals = () => setCurrentStep('goals');
  const goToSpirit = () => setCurrentStep('spirit');
  const goToComplete = () => setCurrentStep('complete');
  const goToWelcome = () => setCurrentStep('welcome');

  // Handle spirit animal selection - this is called from SpiritAnimalScreen
  const handleSpiritAnimalComplete = async (animalId: string, experienceLevel: string) => {
    // Save the spirit animal data (SpiritAnimalScreen already saves to AsyncStorage)
    goToComplete();
  };

  // Handle final completion
  const handleFinalComplete = async () => {
    // Mark onboarding as complete
    await AsyncStorage.setItem('onboardingComplete', 'true');
    onComplete();
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onNext={goToFeatures} />;

      case 'features':
        return (
          <FeatureTourScreen
            onNext={goToGoals}
            onBack={goToWelcome}
          />
        );

      case 'goals':
        return (
          <GoalSettingScreen
            onNext={goToSpirit}
            onBack={goToFeatures}
          />
        );

      case 'spirit':
        return (
          <SpiritAnimalScreenWrapper
            onComplete={handleSpiritAnimalComplete}
            onBack={() => setCurrentStep('goals')}
          />
        );

      case 'complete':
        return <OnboardingCompleteScreen onComplete={handleFinalComplete} />;

      default:
        return <WelcomeScreen onNext={goToFeatures} />;
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
};

// Wrapper to add back button to SpiritAnimalScreen
interface SpiritWrapperProps {
  onComplete: (animalId: string, experienceLevel: string) => void;
  onBack: () => void;
}

const SpiritAnimalScreenWrapper: React.FC<SpiritWrapperProps> = ({ onComplete, onBack }) => {
  // We need to modify how SpiritAnimalScreen handles completion
  // Instead of setting onboardingComplete directly, it now just calls onComplete
  const handleComplete = async (animalId: string, experienceLevel: string) => {
    // Don't set onboardingComplete here - let OnboardingNavigator handle it
    // The SpiritAnimalScreen already saves userSpiritAnimal and userExperienceLevel
    onComplete(animalId, experienceLevel);
  };

  return (
    <View style={styles.container}>
      <SpiritAnimalScreen onComplete={handleComplete} onBack={onBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});

export default OnboardingNavigator;
