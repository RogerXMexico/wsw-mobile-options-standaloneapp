// Welcome Screen - First screen of onboarding
// Animated intro with Wall Street Wildlife branding

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

interface Props {
  onNext: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onNext }) => {
  // Simple fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo Section */}
        <View style={styles.lionContainer}>
          <Image
            source={require('../../../assets/lion.png')}
            style={styles.lionImage}
            resizeMode="cover"
          />
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={[styles.brandName, shadows.neonGreenSubtle]}>
            Wall Street Wildlife
          </Text>
          <Text style={styles.tagline}>Options University</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Master options trading through the wisdom of the jungle.
          Learn at your own pace, track your progress, and evolve into a confident trader.
        </Text>

        {/* Features preview */}
        <View style={styles.featuresRow}>
          <View style={styles.featureChip}>
            <Ionicons name="book-outline" size={16} color={colors.neon.green} style={{ marginRight: spacing.xs }} />
            <Text style={styles.featureText}>11 Tiers</Text>
          </View>
          <View style={styles.featureChip}>
            <Ionicons name="build-outline" size={16} color={colors.neon.cyan} style={{ marginRight: spacing.xs }} />
            <Text style={styles.featureText}>Pro Tools</Text>
          </View>
          <View style={styles.featureChip}>
            <Ionicons name="create-outline" size={16} color={colors.neon.purple} style={{ marginRight: spacing.xs }} />
            <Text style={styles.featureText}>Practice</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Begin Your Journey</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.background.primary} />
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Join thousands of traders learning the Wall Street way
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
  lionContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: colors.neon.green,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    shadowColor: colors.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 20,
  },
  lionImage: {
    width: '100%',
    height: '100%',
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
    justifyContent: 'center',
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.xs,
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
  footerText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default WelcomeScreen;
