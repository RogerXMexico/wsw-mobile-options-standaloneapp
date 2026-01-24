// Main App component for Wall Street Wildlife Mobile
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

// Navigation imports
import { AppNavigator } from './src/navigation';
import { colors } from './src/theme';
import { AuthProvider } from './src/contexts';

// Font mapping for use in the app
export const fontMap = {
  'Inter-Regular': Inter_400Regular,
  'Inter-Medium': Inter_500Medium,
  'Inter-SemiBold': Inter_600SemiBold,
  'Inter-Bold': Inter_700Bold,
  'JetBrainsMono-Regular': JetBrainsMono_400Regular,
  'JetBrainsMono-Bold': JetBrainsMono_700Bold,
};

// Loading screen component with pure black background
const LoadingScreen: React.FC = () => (
  <View style={loadingStyles.container}>
    <Text style={loadingStyles.title}>Wall Street Wildlife</Text>
    <Text style={loadingStyles.subtitle}>Options University</Text>
    <ActivityIndicator
      size="large"
      color="#39ff14"
      style={loadingStyles.spinner}
    />
    <Text style={loadingStyles.loadingText}>Loading fonts...</Text>
  </View>
);

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#39ff14',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 18,
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#475569',
    fontSize: 14,
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'JetBrainsMono-Regular': JetBrainsMono_400Regular,
    'JetBrainsMono-Bold': JetBrainsMono_700Bold,
  });

  // Skip font loading on web if it takes too long
  const [skipFonts, setSkipFonts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fontsLoaded) {
        setSkipFonts(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded && !skipFonts) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor="#000000" />
          <AppNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
