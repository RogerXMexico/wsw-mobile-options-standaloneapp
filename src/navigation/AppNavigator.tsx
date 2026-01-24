// Main App Navigator for Wall Street Wildlife Mobile
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { colors, typography, shadows } from '../theme';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

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

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

export default AppNavigator;
