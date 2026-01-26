// Main App Navigator for Wall Street Wildlife Mobile
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './types';
import { colors, typography, shadows } from '../theme';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

// Import onboarding
import SpiritAnimalScreen from '../screens/onboarding/SpiritAnimalScreen';

// Import hooks
import { useAuth } from '../contexts';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Loading screen component with pure black background and neon glow
const LoadingScreen: React.FC = () => (
  <View style={loadingStyles.container}>
    <Text style={[loadingStyles.title, shadows.neonGreenSubtle]}>
      Wall Street Wildlife
    </Text>
    <Text style={loadingStyles.subtitle}>Options University</Text>
    <ActivityIndicator
      size="large"
      color={colors.neon.green}
      style={loadingStyles.spinner}
    />
    <Text style={loadingStyles.loadingText}>Loading...</Text>
  </View>
);

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fonts.bold,
    color: colors.neon.green,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    fontSize: 18,
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    fontSize: 14,
  },
});

// Wrapper component for onboarding screen
const OnboardingWrapper: React.FC<{ onComplete: (animalId: string, level: string) => void }> = ({ onComplete }) => {
  return <SpiritAnimalScreen onComplete={onComplete} />;
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const status = await AsyncStorage.getItem('onboardingComplete');
        setOnboardingComplete(status === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setOnboardingComplete(false);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    if (isAuthenticated) {
      checkOnboarding();
    } else {
      setCheckingOnboarding(false);
    }
  }, [isAuthenticated]);

  // Handle onboarding completion
  const handleOnboardingComplete = async (animalId: string, experienceLevel: string) => {
    setOnboardingComplete(true);
  };

  // Show loading screen while checking auth or onboarding state
  if (isLoading || (isAuthenticated && checkingOnboarding)) {
    return <LoadingScreen />;
  }

  // Determine which screen to show
  const showOnboarding = isAuthenticated && onboardingComplete === false;

  return (
    <NavigationContainer>
      {showOnboarding ? (
        <OnboardingWrapper onComplete={handleOnboardingComplete} />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background.primary },
            animation: 'fade',
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
