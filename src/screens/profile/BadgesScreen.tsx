// Badges Screen
// Collection of earned and available badges

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import {
  JUNGLE_BADGES,
  JungleBadge,
  BadgeCategory,
  BadgeRarity,
  RARITY_COLORS,
  getVisibleBadges,
} from '../../data/jungleBadges';
import { EVENT_HORIZONS_BADGES } from '../../data/eventHorizonsBadges';

const { width } = Dimensions.get('window');
const BADGE_SIZE = (width - spacing.md * 2 - spacing.sm * 2) / 3;

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

// Mock earned badges
const earnedBadgeIds = ['first-steps', 'on-fire', 'risk-profiled', 'sharp-shooter', 'quiz-master', 'two-jungles', 'gap-hunter'];

type ModuleFilter = 'all' | 'jungle' | 'event-horizons';
type CategoryFilter = 'all' | BadgeCategory;

// Combine all badges with source tag
const getAllBadgesWithSource = (): (JungleBadge & { source: 'jungle' | 'event-horizons' })[] => {
  const jungleBadges = getVisibleBadges().map(b => ({ ...b, source: 'jungle' as const }));
  const ehBadges = EVENT_HORIZONS_BADGES.map(b => ({ ...b, source: 'event-horizons' as const }));
  return [...jungleBadges, ...ehBadges];
};

const BadgesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedModule, setSelectedModule] = useState<ModuleFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedBadge, setSelectedBadge] = useState<JungleBadge | null>(null);

  const allBadges = getAllBadgesWithSource();

  // Filter by module first
  const moduleFilteredBadges = selectedModule === 'all'
    ? allBadges
    : allBadges.filter(b => b.source === selectedModule);

  // Then filter by category
  const filteredBadges = selectedCategory === 'all'
    ? moduleFilteredBadges
    : moduleFilteredBadges.filter(b => b.category === selectedCategory);

  const earnedCount = earnedBadgeIds.length;
  const totalCount = allBadges.length;
  const ehEarnedCount = earnedBadgeIds.filter(id =>
    EVENT_HORIZONS_BADGES.some(b => b.id === id)
  ).length;

  const modules: { id: ModuleFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '🏆' },
    { id: 'jungle', label: 'Academy', icon: '🌴' },
    { id: 'event-horizons', label: 'Event Horizons', icon: '🦎' },
  ];

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'achievement', label: 'Achievement' },
    { id: 'mastery', label: 'Mastery' },
    { id: 'streak', label: 'Streak' },
    { id: 'special', label: 'Special' },
  ];

  const getRarityLabel = (rarity: BadgeRarity): string => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Badges</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Summary */}
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryEmoji}></Text>
              <View>
                <Text style={styles.summaryTitle}>Badge Collection</Text>
                <Text style={styles.summarySubtitle}>
                  {earnedCount} of {totalCount} badges earned
                </Text>
              </View>
            </View>
            <View style={styles.progressRing}>
              <Text style={styles.progressPercent}>
                {Math.round((earnedCount / totalCount) * 100)}%
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[colors.neon.purple, colors.neon.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${(earnedCount / totalCount) * 100}%` }]}
            />
          </View>
        </GlassCard>

        {/* Module Filter (Jungle vs Event Horizons) */}
        <View style={styles.moduleFilter}>
          {modules.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              style={[
                styles.moduleChip,
                selectedModule === mod.id && styles.moduleChipActive,
                selectedModule === mod.id && mod.id === 'event-horizons' && styles.moduleChipEH,
              ]}
              onPress={() => setSelectedModule(mod.id)}
            >
              <Text style={styles.moduleIcon}>{mod.icon}</Text>
              <Text style={[
                styles.moduleText,
                selectedModule === mod.id && styles.moduleTextActive,
                selectedModule === mod.id && mod.id === 'event-horizons' && styles.moduleTextEH,
              ]}>
                {mod.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Badges Grid */}
        <View style={styles.badgesGrid}>
          {filteredBadges.map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            const rarityColor = RARITY_COLORS[badge.rarity];

            return (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeCard,
                  !isEarned && styles.badgeCardLocked,
                ]}
                onPress={() => setSelectedBadge(badge)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.badgeIconContainer,
                  { backgroundColor: isEarned ? rarityColor.bg : colors.overlay.light }
                ]}>
                  <Text style={[styles.badgeIcon, !isEarned && styles.badgeIconLocked]}>
                    {badge.icon}
                  </Text>
                  {!isEarned && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockIcon}></Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[styles.badgeName, !isEarned && styles.badgeNameLocked]}
                  numberOfLines={2}
                >
                  {badge.name}
                </Text>
                <View style={[styles.rarityBadge, { backgroundColor: rarityColor.bg }]}>
                  <Text style={[styles.rarityText, { color: rarityColor.text }]}>
                    {getRarityLabel(badge.rarity)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Rarity Legend */}
        <GlassCard style={styles.legendCard}>
          <Text style={styles.legendTitle}>Rarity Guide</Text>
          <View style={styles.legendGrid}>
            {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as BadgeRarity[]).map((rarity) => {
              const color = RARITY_COLORS[rarity];
              return (
                <View key={rarity} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: color.border }]} />
                  <Text style={[styles.legendText, { color: color.text }]}>
                    {getRarityLabel(rarity)}
                  </Text>
                </View>
              );
            })}
          </View>
        </GlassCard>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedBadge(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.modalContent}
          >
            <LinearGradient
              colors={[RARITY_COLORS[selectedBadge.rarity].bg, colors.background.secondary]}
              style={styles.modalGradient}
            >
              <View style={styles.modalBadgeContainer}>
                <Text style={styles.modalBadgeIcon}>{selectedBadge.icon}</Text>
              </View>
              <Text style={styles.modalBadgeName}>{selectedBadge.name}</Text>
              <View style={[styles.modalRarity, { backgroundColor: RARITY_COLORS[selectedBadge.rarity].bg }]}>
                <Text style={[styles.modalRarityText, { color: RARITY_COLORS[selectedBadge.rarity].text }]}>
                  {getRarityLabel(selectedBadge.rarity)}
                </Text>
              </View>
              <Text style={styles.modalDescription}>{selectedBadge.description}</Text>
              <View style={styles.modalXP}>
                <Text style={styles.modalXPLabel}>Reward:</Text>
                <Text style={styles.modalXPValue}>+{selectedBadge.xpReward} XP</Text>
              </View>
              {earnedBadgeIds.includes(selectedBadge.id) ? (
                <View style={styles.earnedBadge}>
                  <Text style={styles.earnedIcon}></Text>
                  <Text style={styles.earnedText}>Earned!</Text>
                </View>
              ) : (
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedIcon}></Text>
                  <Text style={styles.lockedText}>Not yet earned</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedBadge(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.neon.green,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
  summaryCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryEmoji: {
    fontSize: 36,
  },
  summaryTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  summarySubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  progressRing: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay.neonGreen,
    borderWidth: 3,
    borderColor: colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.neon.green,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  moduleFilter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  moduleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  moduleChipActive: {
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    borderColor: colors.neon.green,
  },
  moduleChipEH: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8b5cf6',
  },
  moduleIcon: {
    fontSize: 16,
  },
  moduleText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  moduleTextActive: {
    color: colors.neon.green,
  },
  moduleTextEH: {
    color: '#8b5cf6',
  },
  categoryScroll: {
    marginBottom: spacing.md,
  },
  categoryContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  categoryChipActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: colors.neon.purple,
  },
  categoryText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  categoryTextActive: {
    color: colors.neon.purple,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  badgeCard: {
    width: BADGE_SIZE,
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    position: 'relative',
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeIconLocked: {
    opacity: 0.4,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: borderRadius.lg,
  },
  lockIcon: {
    fontSize: 20,
  },
  badgeName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    height: 32,
  },
  badgeNameLocked: {
    color: colors.text.muted,
  },
  rarityBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  rarityText: {
    fontFamily: typography.fonts.medium,
    fontSize: 9,
  },
  legendCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  legendTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  legendText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
  },
  bottomSpacer: {
    height: 40,
  },
  // Modal styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width - spacing.xl * 2,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalBadgeContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalBadgeIcon: {
    fontSize: 48,
  },
  modalBadgeName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  modalRarity: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  modalRarityText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
  },
  modalDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  modalXPLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  modalXPValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.yellow,
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  earnedIcon: {
    fontSize: 20,
  },
  earnedText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.success,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.overlay.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  lockedIcon: {
    fontSize: 20,
  },
  lockedText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.text.muted,
  },
  closeButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  closeButtonText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
});

export default BadgesScreen;
