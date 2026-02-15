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

import { AuthProvider, JungleProvider, BookmarksProvider } from './src/contexts';
import {
  registerForPushNotifications,
  configureNotificationChannels,
  scheduleStreakReminder,
} from './src/services/notifications';

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

// Error boundary to catch rendering crashes
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={loadingStyles.container}>
          <Text style={{ color: '#ef4444', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            App Crashed
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 14, textAlign: 'center', paddingHorizontal: 24 }}>
            {this.state.error}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

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

  // Initialize push notifications
  useEffect(() => {
    const initNotifications = async () => {
      await configureNotificationChannels();
      await registerForPushNotifications();
      await scheduleStreakReminder();
    };
    initNotifications().catch(console.warn);
  }, []);

  if (!fontsLoaded && !skipFonts) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <AuthProvider>
          <JungleProvider>
            <BookmarksProvider>
              <SafeAreaProvider>
                <StatusBar style="light" backgroundColor="#000000" />
                <AppNavigator />
              </SafeAreaProvider>
            </BookmarksProvider>
          </JungleProvider>
        </AuthProvider>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
