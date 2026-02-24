// Feature Tour Screen - Swipeable overview of app capabilities
// Shows key features users will have access to

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';

const { width, height } = Dimensions.get('window');

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlights: string[];
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: 'learn',
    icon: 'book-outline',
    title: 'Structured Learning',
    description: 'Master options trading through our 11-tier curriculum, from foundations to advanced strategies.',
    highlights: [
      '50+ strategies explained',
      'Interactive lessons',
      'Real-world examples',
      'Progress tracking',
    ],
    color: colors.neon.green,
  },
  {
    id: 'tools',
    icon: 'build-outline',
    title: 'Professional Tools',
    description: 'Access powerful calculators and visualizers used by professional traders.',
    highlights: [
      'Greeks visualizer',
      'Position sizing',
      'IV rank tracker',
      '3D options surface',
    ],
    color: colors.neon.cyan,
  },
  {
    id: 'practice',
    icon: 'create-outline',
    title: 'Risk-Free Practice',
    description: 'Paper trade with real market conditions. Build confidence before risking real money.',
    highlights: [
      'Paper trading mode',
      'Strategy builder',
      'Trade journal',
      'Performance analytics',
    ],
    color: colors.neon.purple,
  },
  {
    id: 'events',
    icon: 'calendar-outline',
    title: 'Event Horizons',
    description: 'Learn to trade around earnings, Fed meetings, and market events like a pro.',
    highlights: [
      'Earnings calendar',
      'Event replay simulator',
      'Historical analysis',
      'Prediction tools',
    ],
    color: colors.neon.yellow,
  },
  {
    id: 'gamification',
    icon: 'trophy-outline',
    title: 'Track & Compete',
    description: 'Earn badges, complete daily missions, and climb the leaderboard as you learn.',
    highlights: [
      'Achievement badges',
      'Daily missions',
      'Jungle tribes',
      'Global leaderboard',
    ],
    color: colors.neon.orange,
  },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const FeatureTourScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderFeature = ({ item, index }: { item: Feature; index: number }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.featureCard,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        {/* Feature Icon */}
        <View style={[styles.iconContainer, { borderColor: item.color }]}>
          <View style={[styles.iconGlow, { backgroundColor: item.color }]} />
          <Ionicons name={item.icon as any} size={48} color={item.color} />
        </View>

        {/* Feature Title */}
        <Text style={[styles.featureTitle, { color: item.color }]}>
          {item.title}
        </Text>

        {/* Feature Description */}
        <Text style={styles.featureDescription}>{item.description}</Text>

        {/* Highlights */}
        <View style={styles.highlightsContainer}>
          {item.highlights.map((highlight, idx) => (
            <View key={idx} style={styles.highlightRow}>
              <View style={[styles.highlightDot, { backgroundColor: item.color }]} />
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const isLastSlide = currentIndex === FEATURES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="arrow-back" size={18} color={colors.text.secondary} />
            <Text style={styles.backText}>Back</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What You'll Get</Text>
        <Text style={styles.subtitle}>Swipe to explore features</Text>
      </View>

      {/* Feature Carousel */}
      <FlatList
        ref={flatListRef}
        data={FEATURES}
        renderItem={renderFeature}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carouselContent}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {FEATURES.map((feature, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: feature.color,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: FEATURES[currentIndex].color },
          ]}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {isLastSlide ? 'Continue' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.background.primary} />
        </TouchableOpacity>

        <Text style={styles.progressText}>
          {currentIndex + 1} of {FEATURES.length}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  skipButton: {
    padding: spacing.sm,
  },
  skipText: {
    ...typography.styles.body,
    color: colors.text.muted,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  carouselContent: {
    alignItems: 'center',
  },
  featureCard: {
    width: width,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  iconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
  },
  featureTitle: {
    ...typography.styles.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  featureDescription: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  highlightsContainer: {
    width: '100%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  highlightText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.dark,
  },
  continueButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  progressText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default FeatureTourScreen;
