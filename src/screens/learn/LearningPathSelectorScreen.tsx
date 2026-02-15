// LearningPathSelectorScreen for Wall Street Wildlife Mobile
// Allows users to select their learning path based on experience level
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard } from '../../components/ui';
import { LEARNING_PATHS, LearningPath } from '../../data/learningPaths';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// AsyncStorage keys
const STORAGE_KEY_PATH = 'wsw-learning-path';
const STORAGE_KEY_TIER = 'wsw-start-tier';

// Color mapping for each path ID
const PATH_COLORS: Record<string, string> = {
  'express-lane': '#eab308',
  'beginner': '#22c55e',
  'some-experience': '#f59e0b',
  'intermediate': '#8b5cf6',
  'advanced': '#ef4444',
};

// Display order: Express Lane first, then Beginner through Advanced
const ORDERED_PATH_IDS = [
  'express-lane',
  'beginner',
  'some-experience',
  'intermediate',
  'advanced',
];

interface LearningPathSelectorScreenProps {
  onSelectPath?: (pathId: string, startTier: number) => void;
  onSkip?: () => void;
  navigation?: any;
  route?: any;
}

const LearningPathSelectorScreen: React.FC<LearningPathSelectorScreenProps> = ({
  onSelectPath,
  onSkip,
  navigation,
  route,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Get callbacks from route params if not passed as props
  const handleSelectPath = onSelectPath || route?.params?.onSelectPath;
  const handleSkip = onSkip || route?.params?.onSkip;

  // Order paths according to specification
  const orderedPaths = ORDERED_PATH_IDS.map(id =>
    LEARNING_PATHS.find(p => p.id === id)
  ).filter(Boolean) as LearningPath[];

  const getPathColor = (pathId: string): string => {
    return PATH_COLORS[pathId] || colors.neon.green;
  };

  const getPathIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
    return iconName as keyof typeof Ionicons.glyphMap;
  };

  const selectPath = useCallback(async (path: LearningPath) => {
    if (saving) return;

    setSelectedPathId(path.id);
    setSaving(true);

    try {
      // Save selected path and start tier to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY_PATH, path.id);
      await AsyncStorage.setItem(STORAGE_KEY_TIER, String(path.startTier));

      // Notify parent via callback
      if (handleSelectPath) {
        handleSelectPath(path.id, path.startTier);
      } else if (navigation) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to save learning path:', error);
    } finally {
      setSaving(false);
    }
  }, [saving, handleSelectPath, navigation]);

  const skipSelection = useCallback(() => {
    if (handleSkip) {
      handleSkip();
    } else if (navigation) {
      navigation.goBack();
    }
  }, [handleSkip, navigation]);

  const renderPathCard = (path: LearningPath) => {
    const pathColor = getPathColor(path.id);
    const isSelected = selectedPathId === path.id;

    return (
      <GlassCard
        key={path.id}
        style={[
          styles.pathCard,
          isSelected && {
            borderColor: pathColor,
            borderWidth: 2,
          },
        ]}
        withGlow={isSelected}
        glowColor={pathColor}
      >
        {/* Color accent bar */}
        <View style={[styles.accentBar, { backgroundColor: pathColor }]} />

        <View style={styles.pathCardContent}>
          {/* Header row: icon + title + estimated time */}
          <View style={styles.pathHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${pathColor}20` }]}>
              <Ionicons
                name={getPathIconName(path.icon)}
                size={28}
                color={pathColor}
              />
            </View>
            <View style={styles.pathTitleContainer}>
              <Text style={[styles.pathTitle, { color: pathColor }]}>
                {path.title}
              </Text>
              <Text style={styles.pathSubtitle}>{path.subtitle}</Text>
            </View>
          </View>

          {/* Estimated time badge */}
          <View style={styles.timeBadgeRow}>
            <View style={[styles.timeBadge, { backgroundColor: `${pathColor}15` }]}>
              <Ionicons name="time-outline" size={14} color={pathColor} />
              <Text style={[styles.timeBadgeText, { color: pathColor }]}>
                {path.estimatedTime}
              </Text>
            </View>
            <View style={[styles.tierBadge, { backgroundColor: `${pathColor}15` }]}>
              <Ionicons name="layers-outline" size={14} color={pathColor} />
              <Text style={[styles.tierBadgeText, { color: pathColor }]}>
                {path.tierSequence.length === 1
                  ? `Tier ${path.tierSequence[0]}`
                  : `Tiers ${path.tierSequence[0]}-${path.tierSequence[path.tierSequence.length - 1]}`}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.pathDescription}>{path.description}</Text>

          {/* Start button */}
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: pathColor }]}
            onPress={() => selectPath(path)}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving && isSelected ? (
              <ActivityIndicator color={colors.text.inverse} size="small" />
            ) : (
              <>
                <Ionicons name="play" size={16} color={colors.text.inverse} />
                <Text style={styles.startButtonText}>START HERE</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconRow}>
            <Ionicons name="compass-outline" size={32} color={colors.neon.green} />
          </View>
          <Text style={styles.headerTitle}>Choose Your Path</Text>
          <Text style={styles.headerSubtitle}>
            Select a learning path that matches your experience level. You can always change this later.
          </Text>
        </View>

        {/* Path Cards */}
        <View style={styles.pathsContainer}>
          {orderedPaths.map(renderPathCard)}
        </View>

        {/* Skip option */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipSelection}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  headerIconRow: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.neon.green}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.neon.green}30`,
  },
  headerTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 340,
  },

  // Path cards
  pathsContainer: {
    gap: spacing.md,
  },
  pathCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: borderRadius.xl,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  pathCardContent: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },

  // Path header
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  pathTitleContainer: {
    flex: 1,
  },
  pathTitle: {
    ...typography.styles.h4,
    marginBottom: 2,
  },
  pathSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },

  // Time and tier badges
  timeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  timeBadgeText: {
    ...typography.styles.labelSm,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  tierBadgeText: {
    ...typography.styles.labelSm,
  },

  // Description
  pathDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },

  // Start button
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.dark,
  },
  startButtonText: {
    ...typography.styles.buttonSm,
    color: colors.text.inverse,
    letterSpacing: 1,
  },

  // Skip button
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  skipButtonText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
  },

  // Bottom spacer for safe area
  bottomSpacer: {
    height: spacing.xl,
  },
});

export default LearningPathSelectorScreen;
