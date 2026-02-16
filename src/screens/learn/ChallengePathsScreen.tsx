// ChallengePathsScreen for Wall Street Wildlife Mobile
// 10 challenge paths with expandable steps, progress tracking, and XP rewards
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, PremiumModal } from '../../components/ui';
import { useJungle } from '../../contexts';
import { useAuth } from '../../contexts';
import { useSubscription } from '../../hooks/useSubscription';

// ----- Types -----

type StepType = 'lesson' | 'quiz' | 'paper-trade' | 'journal' | 'social' | 'streak';

interface ChallengeStep {
  id: string;
  label: string;
  type: StepType;
  autoVerify?: boolean;
}

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface ChallengePath {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  tierLabel: string;
  xpReward: number;
  badgeRarity: BadgeRarity;
  steps: ChallengeStep[];
}

interface ChallengeProgress {
  completedSteps: Record<string, string[]>; // pathId -> stepId[]
  claimedPaths: string[];
}

// ----- Constants -----

const STORAGE_KEY = 'wsw-challenge-progress';

const STEP_ICONS: Record<StepType, keyof typeof Ionicons.glyphMap> = {
  'lesson': 'book-outline',
  'quiz': 'checkbox-outline',
  'paper-trade': 'flash-outline',
  'journal': 'document-text-outline',
  'social': 'share-social-outline',
  'streak': 'flame-outline',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  'Beginner': '#22c55e',
  'Intermediate': '#f59e0b',
  'Advanced': '#8b5cf6',
  'Expert': '#f43f5e',
};

const RARITY_LABELS: Record<BadgeRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#94a3b8',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
};

// ----- Challenge Paths Data -----

const CHALLENGE_PATHS: ChallengePath[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Complete your first trade from start to finish. Learn the fundamentals, pass the quiz, and execute a paper trade.',
    difficulty: 'Beginner',
    tierLabel: 'Tier 0',
    xpReward: 250,
    badgeRarity: 'common',
    steps: [
      { id: 'fb-1', label: 'Complete "What Are Options?" lesson', type: 'lesson' },
      { id: 'fb-2', label: 'Pass the Tier 0 Foundations quiz', type: 'quiz', autoVerify: true },
      { id: 'fb-3', label: 'Execute your first paper trade', type: 'paper-trade' },
      { id: 'fb-4', label: 'Write a journal entry about the trade', type: 'journal' },
    ],
  },
  {
    id: 'income-architect',
    name: 'Income Architect',
    description: 'Master income-generating strategies. Learn covered calls, cash-secured puts, and build a consistent income approach.',
    difficulty: 'Beginner',
    tierLabel: 'Tier 3',
    xpReward: 500,
    badgeRarity: 'uncommon',
    steps: [
      { id: 'ia-1', label: 'Complete Covered Call lesson', type: 'lesson' },
      { id: 'ia-2', label: 'Complete Cash-Secured Put lesson', type: 'lesson' },
      { id: 'ia-3', label: 'Pass the Income Strategies quiz', type: 'quiz', autoVerify: true },
      { id: 'ia-4', label: 'Paper trade a Covered Call', type: 'paper-trade' },
      { id: 'ia-5', label: 'Paper trade a Cash-Secured Put', type: 'paper-trade' },
      { id: 'ia-6', label: 'Journal your income strategy plan', type: 'journal' },
    ],
  },
  {
    id: 'spread-master',
    name: 'Spread Master',
    description: 'Conquer vertical spreads. Learn bull call spreads, bear put spreads, and how to select strike prices for optimal risk/reward.',
    difficulty: 'Intermediate',
    tierLabel: 'Tier 4',
    xpReward: 750,
    badgeRarity: 'rare',
    steps: [
      { id: 'sm-1', label: 'Complete Bull Call Spread lesson', type: 'lesson' },
      { id: 'sm-2', label: 'Complete Bear Put Spread lesson', type: 'lesson' },
      { id: 'sm-3', label: 'Pass the Vertical Spreads quiz', type: 'quiz', autoVerify: true },
      { id: 'sm-4', label: 'Paper trade 3 different vertical spreads', type: 'paper-trade' },
      { id: 'sm-5', label: 'Analyze risk/reward in your journal', type: 'journal' },
      { id: 'sm-6', label: 'Share your best trade setup', type: 'social' },
    ],
  },
  {
    id: 'volatility-hunter',
    name: 'Volatility Hunter',
    description: 'Master volatility-based trading. Learn IV rank, expected move, straddles and strangles, and how to profit from vol expansion/contraction.',
    difficulty: 'Advanced',
    tierLabel: 'Tier 5',
    xpReward: 1000,
    badgeRarity: 'epic',
    steps: [
      { id: 'vh-1', label: 'Complete IV Rank & Percentile lesson', type: 'lesson' },
      { id: 'vh-2', label: 'Complete Straddles & Strangles lesson', type: 'lesson' },
      { id: 'vh-3', label: 'Pass the Volatility Strategies quiz', type: 'quiz', autoVerify: true },
      { id: 'vh-4', label: 'Paper trade a long straddle before earnings', type: 'paper-trade' },
      { id: 'vh-5', label: 'Paper trade a short strangle in high IV', type: 'paper-trade' },
      { id: 'vh-6', label: 'Use the IV Rank tool on 5 tickers', type: 'lesson' },
      { id: 'vh-7', label: 'Journal your volatility analysis', type: 'journal' },
    ],
  },
  {
    id: 'iron-chef',
    name: 'Iron Chef',
    description: 'Master iron condors and butterflies. Learn to construct, manage, and adjust these premium collection strategies like a pro.',
    difficulty: 'Advanced',
    tierLabel: 'Tiers 5-7',
    xpReward: 1000,
    badgeRarity: 'epic',
    steps: [
      { id: 'ic-1', label: 'Complete Iron Condor lesson', type: 'lesson' },
      { id: 'ic-2', label: 'Complete Iron Butterfly lesson', type: 'lesson' },
      { id: 'ic-3', label: 'Pass the Multi-Leg Strategies quiz', type: 'quiz', autoVerify: true },
      { id: 'ic-4', label: 'Paper trade 3 iron condors', type: 'paper-trade' },
      { id: 'ic-5', label: 'Paper trade 2 iron butterflies', type: 'paper-trade' },
      { id: 'ic-6', label: 'Practice adjusting a tested side', type: 'paper-trade' },
      { id: 'ic-7', label: 'Document adjustment rules in journal', type: 'journal' },
    ],
  },
  {
    id: 'time-wizard',
    name: 'Time Wizard',
    description: 'Master theta decay and calendar strategies. Understand time skew, diagonal spreads, and how to harvest time premium effectively.',
    difficulty: 'Advanced',
    tierLabel: 'Tier 6',
    xpReward: 1000,
    badgeRarity: 'epic',
    steps: [
      { id: 'tw-1', label: 'Complete Calendar Spreads lesson', type: 'lesson' },
      { id: 'tw-2', label: 'Complete Diagonal Spreads lesson', type: 'lesson' },
      { id: 'tw-3', label: 'Pass the Time & Skew quiz', type: 'quiz', autoVerify: true },
      { id: 'tw-4', label: 'Paper trade a calendar spread', type: 'paper-trade' },
      { id: 'tw-5', label: 'Paper trade a diagonal spread', type: 'paper-trade' },
      { id: 'tw-6', label: 'Track theta decay over 5 days in journal', type: 'journal' },
    ],
  },
  {
    id: 'exotic-explorer',
    name: 'Exotic Explorer',
    description: 'Venture into advanced ratio spreads, back-spreads, and exotic structures. Push your knowledge to the edge of options mastery.',
    difficulty: 'Expert',
    tierLabel: 'Tier 7',
    xpReward: 1500,
    badgeRarity: 'legendary',
    steps: [
      { id: 'ee-1', label: 'Complete Ratio Spreads lesson', type: 'lesson' },
      { id: 'ee-2', label: 'Complete Back-Spreads lesson', type: 'lesson' },
      { id: 'ee-3', label: 'Pass the Ratio & Exotic quiz', type: 'quiz', autoVerify: true },
      { id: 'ee-4', label: 'Paper trade a ratio call spread', type: 'paper-trade' },
      { id: 'ee-5', label: 'Paper trade a put back-spread', type: 'paper-trade' },
      { id: 'ee-6', label: 'Analyze risk graph in journal', type: 'journal' },
      { id: 'ee-7', label: 'Share your exotic trade analysis', type: 'social' },
    ],
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Engage with the Wall Street Wildlife community. Share trades, help others, and build your reputation as a knowledgeable trader.',
    difficulty: 'Beginner',
    tierLabel: 'Social',
    xpReward: 500,
    badgeRarity: 'uncommon',
    steps: [
      { id: 'sb-1', label: 'Share your first trade idea', type: 'social' },
      { id: 'sb-2', label: 'Comment on 3 community posts', type: 'social' },
      { id: 'sb-3', label: 'Share a strategy breakdown', type: 'social' },
      { id: 'sb-4', label: 'Help answer a beginner question', type: 'social' },
      { id: 'sb-5', label: 'Post a weekly trade review', type: 'journal' },
    ],
  },
  {
    id: 'streak-warrior',
    name: 'Streak Warrior',
    description: 'Build an unstoppable learning habit. Login daily, complete lessons consistently, and maintain your streak to prove your dedication.',
    difficulty: 'Intermediate',
    tierLabel: 'Daily',
    xpReward: 750,
    badgeRarity: 'rare',
    steps: [
      { id: 'sw-1', label: 'Maintain a 3-day login streak', type: 'streak', autoVerify: true },
      { id: 'sw-2', label: 'Complete 5 lessons in one week', type: 'lesson' },
      { id: 'sw-3', label: 'Maintain a 7-day login streak', type: 'streak', autoVerify: true },
      { id: 'sw-4', label: 'Pass 3 quizzes in one week', type: 'quiz', autoVerify: true },
      { id: 'sw-5', label: 'Maintain a 14-day login streak', type: 'streak', autoVerify: true },
      { id: 'sw-6', label: 'Journal for 5 consecutive days', type: 'journal' },
    ],
  },
  {
    id: 'event-horizon-pioneer',
    name: 'Event Horizon Pioneer',
    description: 'Master event-driven trading. Navigate earnings, FDA decisions, economic data releases, and other catalysts with precision and confidence.',
    difficulty: 'Expert',
    tierLabel: 'Tier 8',
    xpReward: 1500,
    badgeRarity: 'legendary',
    steps: [
      { id: 'eh-1', label: 'Complete Earnings Trading lesson', type: 'lesson' },
      { id: 'eh-2', label: 'Complete Event-Driven Strategies lesson', type: 'lesson' },
      { id: 'eh-3', label: 'Pass the Event Horizons quiz', type: 'quiz', autoVerify: true },
      { id: 'eh-4', label: 'Paper trade an earnings straddle', type: 'paper-trade' },
      { id: 'eh-5', label: 'Paper trade a pre-event iron condor', type: 'paper-trade' },
      { id: 'eh-6', label: 'Use the Prediction Scanner tool', type: 'lesson' },
      { id: 'eh-7', label: 'Analyze post-event results in journal', type: 'journal' },
      { id: 'eh-8', label: 'Share your event analysis with community', type: 'social' },
    ],
  },
];

// ----- Helper functions -----

const getDefaultProgress = (): ChallengeProgress => ({
  completedSteps: {},
  claimedPaths: [],
});

// ----- Component -----

const ChallengePathsScreen: React.FC = () => {
  const { addXP, awardBadge, progress: jungleProgress, streakDays } = useJungle();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress>(getDefaultProgress());
  const [expandedPathId, setExpandedPathId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setChallengeProgress({ ...getDefaultProgress(), ...JSON.parse(stored) });
        }
      } catch (error) {
        console.error('Failed to load challenge progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []);

  // Save progress to AsyncStorage
  const saveProgress = useCallback(async (newProgress: ChallengeProgress) => {
    setChallengeProgress(newProgress);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (error) {
      console.error('Failed to save challenge progress:', error);
    }
  }, []);

  // Check if a step is auto-verified via jungle context
  const isStepAutoVerified = useCallback((step: ChallengeStep): boolean => {
    if (!step.autoVerify) return false;

    switch (step.type) {
      case 'quiz':
        // Check if any quiz has been passed
        return Object.values(jungleProgress.quizScores).some(q => q.passed);
      case 'streak':
        // Check streak thresholds
        if (step.id.includes('3-day') || step.label.includes('3-day')) {
          return streakDays >= 3;
        }
        if (step.id.includes('7-day') || step.label.includes('7-day')) {
          return streakDays >= 7;
        }
        if (step.id.includes('14-day') || step.label.includes('14-day')) {
          return streakDays >= 14;
        }
        return streakDays >= 3;
      default:
        return false;
    }
  }, [jungleProgress.quizScores, streakDays]);

  // Check if a step is completed (either manually or auto-verified)
  const isStepCompleted = useCallback((pathId: string, step: ChallengeStep): boolean => {
    const manuallyCompleted = challengeProgress.completedSteps[pathId]?.includes(step.id) ?? false;
    return manuallyCompleted || isStepAutoVerified(step);
  }, [challengeProgress.completedSteps, isStepAutoVerified]);

  // Toggle step completion (for manual steps)
  const toggleStep = useCallback((pathId: string, stepId: string) => {
    setChallengeProgress(prev => {
      const pathSteps = prev.completedSteps[pathId] || [];
      const isCompleted = pathSteps.includes(stepId);

      const newCompletedSteps = {
        ...prev.completedSteps,
        [pathId]: isCompleted
          ? pathSteps.filter(s => s !== stepId)
          : [...pathSteps, stepId],
      };

      const newProgress = { ...prev, completedSteps: newCompletedSteps };
      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress]);

  // Get completed count for a path
  const getCompletedCount = useCallback((path: ChallengePath): number => {
    return path.steps.filter(step => isStepCompleted(path.id, step)).length;
  }, [isStepCompleted]);

  // Check if all steps are complete
  const isPathComplete = useCallback((path: ChallengePath): boolean => {
    return getCompletedCount(path) === path.steps.length;
  }, [getCompletedCount]);

  // Check if reward has been claimed
  const isPathClaimed = useCallback((pathId: string): boolean => {
    return challengeProgress.claimedPaths.includes(pathId);
  }, [challengeProgress.claimedPaths]);

  // Claim reward
  const claimReward = useCallback((path: ChallengePath) => {
    if (!isPathComplete(path) || isPathClaimed(path.id)) return;

    // Award XP
    addXP(path.xpReward);

    // Award badge
    awardBadge(`challenge-${path.id}`);

    // Mark as claimed
    setChallengeProgress(prev => {
      const newProgress = {
        ...prev,
        claimedPaths: [...prev.claimedPaths, path.id],
      };
      saveProgress(newProgress);
      return newProgress;
    });

    Alert.alert(
      'Challenge Complete!',
      `You earned ${path.xpReward} XP and the "${path.name}" badge!`,
      [{ text: 'Awesome!', style: 'default' }]
    );
  }, [isPathComplete, isPathClaimed, addXP, awardBadge, saveProgress]);

  // Toggle expand/collapse
  const toggleExpand = useCallback((pathId: string) => {
    setExpandedPathId(prev => prev === pathId ? null : pathId);
  }, []);

  // Compute overall stats
  const stats = useMemo(() => {
    const pathsComplete = CHALLENGE_PATHS.filter(p => isPathClaimed(p.id)).length;
    const totalSteps = CHALLENGE_PATHS.reduce((sum, p) => sum + p.steps.length, 0);
    const stepsCompleted = CHALLENGE_PATHS.reduce((sum, p) => sum + getCompletedCount(p), 0);
    const xpClaimed = CHALLENGE_PATHS
      .filter(p => isPathClaimed(p.id))
      .reduce((sum, p) => sum + p.xpReward, 0);

    return { pathsComplete, totalSteps, stepsCompleted, xpClaimed };
  }, [isPathClaimed, getCompletedCount]);

  // ----- Render helpers -----

  const renderStatsHeader = () => (
    <View style={styles.statsRow}>
      <GlassCard style={styles.statCard}>
        <Ionicons name="trophy-outline" size={20} color={colors.neon.yellow} />
        <Text style={styles.statValue}>{stats.pathsComplete}</Text>
        <Text style={styles.statLabel}>Paths Done</Text>
      </GlassCard>
      <GlassCard style={styles.statCard}>
        <Ionicons name="checkmark-circle-outline" size={20} color={colors.neon.green} />
        <Text style={styles.statValue}>{stats.stepsCompleted}</Text>
        <Text style={styles.statLabel}>Steps Done</Text>
      </GlassCard>
      <GlassCard style={styles.statCard}>
        <Ionicons name="star-outline" size={20} color={colors.neon.cyan} />
        <Text style={styles.statValue}>{stats.xpClaimed}</Text>
        <Text style={styles.statLabel}>XP Claimed</Text>
      </GlassCard>
    </View>
  );

  const renderProgressBar = (completed: number, total: number, color: string) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={[styles.progressBarText, { color }]}>
          {completed}/{total}
        </Text>
      </View>
    );
  };

  const renderStep = (step: ChallengeStep, pathId: string, index: number) => {
    const completed = isStepCompleted(pathId, step);
    const isAuto = step.autoVerify;
    const iconName = STEP_ICONS[step.type];

    return (
      <TouchableOpacity
        key={step.id}
        style={[styles.stepRow, completed && styles.stepRowCompleted]}
        onPress={() => {
          if (!isAuto) {
            toggleStep(pathId, step.id);
          }
        }}
        activeOpacity={isAuto ? 1 : 0.7}
        disabled={isAuto && completed}
      >
        {/* Checkbox / auto indicator */}
        <View style={[
          styles.stepCheckbox,
          completed && styles.stepCheckboxCompleted,
          isAuto && styles.stepCheckboxAuto,
        ]}>
          {completed ? (
            <Ionicons
              name="checkmark"
              size={14}
              color={isAuto ? colors.neon.cyan : colors.text.inverse}
            />
          ) : (
            <Text style={styles.stepNumber}>{index + 1}</Text>
          )}
        </View>

        {/* Step type icon */}
        <Ionicons
          name={iconName}
          size={16}
          color={completed ? colors.text.secondary : colors.text.tertiary}
          style={styles.stepIcon}
        />

        {/* Step label */}
        <Text
          style={[
            styles.stepLabel,
            completed && styles.stepLabelCompleted,
          ]}
          numberOfLines={2}
        >
          {step.label}
        </Text>

        {/* Auto badge */}
        {isAuto && (
          <View style={styles.autoBadge}>
            <Text style={styles.autoBadgeText}>AUTO</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderChallengeCard = (path: ChallengePath) => {
    const isExpanded = expandedPathId === path.id;
    const completedCount = getCompletedCount(path);
    const allComplete = isPathComplete(path);
    const claimed = isPathClaimed(path.id);
    const diffColor = DIFFICULTY_COLORS[path.difficulty];
    const rarityColor = RARITY_COLORS[path.badgeRarity];

    return (
      <GlassCard
        key={path.id}
        style={[
          styles.challengeCard,
          claimed && styles.challengeCardClaimed,
        ]}
        withGlow={allComplete && !claimed}
        glowColor={diffColor}
      >
        {/* Card Header - tappable to expand */}
        <TouchableOpacity
          style={styles.challengeHeader}
          onPress={() => toggleExpand(path.id)}
          activeOpacity={0.7}
        >
          <View style={styles.challengeHeaderLeft}>
            {/* Difficulty dot */}
            <View style={[styles.difficultyDot, { backgroundColor: diffColor }]} />
            <View style={styles.challengeTitleBlock}>
              <Text style={styles.challengeName}>{path.name}</Text>
              <View style={styles.challengeBadgesRow}>
                {/* Difficulty badge */}
                <View style={[styles.diffBadge, { backgroundColor: `${diffColor}20` }]}>
                  <Text style={[styles.diffBadgeText, { color: diffColor }]}>
                    {path.difficulty}
                  </Text>
                </View>
                {/* Tier label */}
                <View style={styles.tierLabelBadge}>
                  <Text style={styles.tierLabelText}>{path.tierLabel}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.challengeHeaderRight}>
            {/* XP badge */}
            <View style={styles.xpBadge}>
              <Ionicons name="star" size={12} color={colors.neon.yellow} />
              <Text style={styles.xpBadgeText}>{path.xpReward} XP</Text>
            </View>
            {/* Expand chevron */}
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.text.tertiary}
            />
          </View>
        </TouchableOpacity>

        {/* Progress bar (always visible) */}
        {renderProgressBar(completedCount, path.steps.length, diffColor)}

        {/* Expanded content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Description */}
            <Text style={styles.challengeDescription}>{path.description}</Text>

            {/* Badge rarity */}
            <View style={styles.rarityRow}>
              <Ionicons name="ribbon-outline" size={14} color={rarityColor} />
              <Text style={[styles.rarityText, { color: rarityColor }]}>
                {RARITY_LABELS[path.badgeRarity]} Badge
              </Text>
            </View>

            {/* Steps list */}
            <View style={styles.stepsList}>
              {path.steps.map((step, index) => renderStep(step, path.id, index))}
            </View>

            {/* Claim reward button */}
            {allComplete && !claimed && (
              <TouchableOpacity
                style={[styles.claimButton, { backgroundColor: diffColor }]}
                onPress={() => claimReward(path)}
                activeOpacity={0.8}
              >
                <Ionicons name="gift-outline" size={18} color={colors.text.inverse} />
                <Text style={styles.claimButtonText}>
                  Claim Reward - {path.xpReward} XP
                </Text>
              </TouchableOpacity>
            )}

            {/* Claimed badge */}
            {claimed && (
              <View style={styles.claimedBanner}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.claimedBannerText}>Reward Claimed</Text>
              </View>
            )}
          </View>
        )}
      </GlassCard>
    );
  };

  // ----- Main render -----

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.neon.green} />
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerIconRow}>
            <Ionicons name="flag-outline" size={28} color={colors.neon.green} />
          </View>
          <Text style={styles.headerTitle}>Challenge Paths</Text>
        </View>
        <View style={styles.lockedContainer}>
          <View style={styles.lockedIconCircle}>
            <Ionicons name="lock-closed" size={48} color={colors.neon.green} />
          </View>
          <Text style={styles.lockedTitle}>Premium Feature</Text>
          <Text style={styles.lockedDescription}>
            Complete structured challenges to earn XP, unlock badges, and prove your trading skills. Subscribe to access all 10 challenge paths.
          </Text>
          <TouchableOpacity
            style={styles.lockedButton}
            onPress={() => setShowPremiumModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="diamond-outline" size={18} color="#000000" />
            <Text style={styles.lockedButtonText}>Unlock Challenge Paths</Text>
          </TouchableOpacity>
        </View>
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          featureName="Challenge Paths"
        />
      </SafeAreaView>
    );
  }

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
            <Ionicons name="flag-outline" size={28} color={colors.neon.green} />
          </View>
          <Text style={styles.headerTitle}>Challenge Paths</Text>
          <Text style={styles.headerSubtitle}>
            Complete structured challenges to earn XP, unlock badges, and prove your skills.
          </Text>
        </View>

        {/* Stats header */}
        {renderStatsHeader()}

        {/* Challenge cards */}
        <View style={styles.challengesContainer}>
          {CHALLENGE_PATHS.map(renderChallengeCard)}
        </View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ----- Styles -----

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  headerIconRow: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.neon.green}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: `${colors.neon.green}30`,
  },
  headerTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 320,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  statValue: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.styles.bodyXs,
    color: colors.text.tertiary,
    marginTop: 2,
    textAlign: 'center',
  },

  // Challenge cards
  challengesContainer: {
    gap: spacing.sm,
  },
  challengeCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  challengeCardClaimed: {
    opacity: 0.75,
  },

  // Challenge header
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  challengeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  difficultyDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  challengeTitleBlock: {
    flex: 1,
  },
  challengeName: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: 4,
  },
  challengeBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  diffBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  diffBadgeText: {
    ...typography.styles.bodyXs,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
  },
  tierLabelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tierLabelText: {
    ...typography.styles.bodyXs,
    color: colors.text.secondary,
  },

  challengeHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251,191,36,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  xpBadgeText: {
    ...typography.styles.labelSm,
    color: colors.neon.yellow,
  },

  // Progress bar
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  progressBarText: {
    ...typography.styles.labelSm,
    minWidth: 28,
    textAlign: 'right',
  },

  // Expanded content
  expandedContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
  },
  challengeDescription: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  rarityText: {
    ...typography.styles.labelSm,
  },

  // Steps list
  stepsList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  stepRowCompleted: {
    backgroundColor: 'rgba(57,255,20,0.05)',
  },
  stepCheckbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.text.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepCheckboxCompleted: {
    borderColor: colors.neon.green,
    backgroundColor: colors.neon.green,
  },
  stepCheckboxAuto: {
    borderColor: colors.neon.cyan,
    backgroundColor: 'rgba(0,240,255,0.15)',
  },
  stepNumber: {
    ...typography.styles.bodyXs,
    color: colors.text.muted,
    fontFamily: typography.fonts.semiBold,
  },
  stepIcon: {
    marginRight: spacing.sm,
  },
  stepLabel: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
  },
  stepLabelCompleted: {
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  autoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0,240,255,0.12)',
    marginLeft: spacing.xs,
  },
  autoBadgeText: {
    ...typography.styles.bodyXs,
    color: colors.neon.cyan,
    fontFamily: typography.fonts.semiBold,
    fontWeight: '600',
    fontSize: 9,
    letterSpacing: 0.5,
  },

  // Claim button
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.dark,
  },
  claimButtonText: {
    ...typography.styles.buttonSm,
    color: colors.text.inverse,
    letterSpacing: 0.5,
  },

  // Claimed banner
  claimedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(16,185,129,0.1)',
  },
  claimedBannerText: {
    ...typography.styles.label,
    color: colors.success,
  },

  // Bottom spacer
  bottomSpacer: {
    height: spacing.xl,
  },

  // Premium locked state
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  lockedIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.25)',
  },
  lockedTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  lockedDescription: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  lockedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neon.green,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  lockedButtonText: {
    ...typography.styles.button,
    color: '#000000',
  },
});

export default ChallengePathsScreen;
