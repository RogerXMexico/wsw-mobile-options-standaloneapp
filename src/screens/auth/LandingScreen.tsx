// Landing Screen for Wall Street Wildlife Mobile
// Redesigned to match web app aesthetics
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AuthStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

const { width, height } = Dimensions.get('window');

type NavigationProp = AuthStackScreenProps<'Landing'>['navigation'];

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Subtle star-like dots scattered across background */}
      <View style={styles.starsContainer}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
              },
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo Section with Lion */}
          <View style={styles.logoSection}>
            {/* Glowing ring behind lion */}
            <View style={styles.lionGlowRing}>
              <View style={styles.lionContainer}>
                <Image
                  source={require('../../../assets/lion.png')}
                  style={styles.lionImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.titleTop}>OPTIONS</Text>
            <Text style={styles.titleBottom}>UNIVERSITY</Text>

            <Text style={styles.tagline}>
              The jungle feeds the <Text style={styles.taglineHighlight}>prepared</Text>
              {' '}and eats the <Text style={styles.taglineWarning}>impulsive</Text>.
            </Text>
          </View>

          {/* CTA Button */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#39ff14', '#32e612', '#2bcc10']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>ENTER THE JUNGLE</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>I already have an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['2xl'],
  },
  logoSection: {
    alignItems: 'center',
  },
  lionGlowRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 20,
  },
  lionContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
  },
  lionImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  titleTop: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 4,
    textAlign: 'center',
  },
  titleBottom: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.neon.green,
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: -8,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  tagline: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  taglineHighlight: {
    color: '#ffffff',
    fontWeight: '600',
  },
  taglineWarning: {
    color: '#ef4444',
    fontWeight: '600',
  },
  ctaSection: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonGradient: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 2,
  },
  buttonArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  secondaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
});

export default LandingScreen;
