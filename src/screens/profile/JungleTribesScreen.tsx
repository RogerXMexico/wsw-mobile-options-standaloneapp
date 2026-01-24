// Jungle Tribes Screen
// Community groups for social competition

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GlowButton } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import { JUNGLE_TRIBES, getRankedTribes, JungleTribe } from '../../data/jungleTribes';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

// Mock user's current tribe (null = not joined)
const userTribeId: string | null = null;

const JungleTribesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTribe, setSelectedTribe] = useState<JungleTribe | null>(null);

  const rankedTribes = getRankedTribes();
  const userTribe = userTribeId ? rankedTribes.find(t => t.id === userTribeId) : null;

  const handleJoinTribe = (tribe: JungleTribe) => {
    Alert.alert(
      `Join ${tribe.name}?`,
      `You're about to join ${tribe.name}. Your XP will contribute to this tribe's ranking.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join Tribe',
          onPress: () => {
            Alert.alert('Welcome!', `You've joined ${tribe.name}!`);
            setSelectedTribe(null);
          },
        },
      ]
    );
  };

  const formatXP = (xp: number): string => {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`;
    }
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(0)}K`;
    }
    return xp.toString();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jungle Tribes</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.15)', 'rgba(139, 92, 246, 0.1)', 'transparent']}
          style={styles.heroGradient}
        >
          <Text style={styles.heroEmoji}></Text>
          <Text style={styles.heroTitle}>Join a Tribe</Text>
          <Text style={styles.heroSubtitle}>
            Team up with fellow traders. Your XP contributes to your tribe's ranking!
          </Text>
        </LinearGradient>

        {/* Your Tribe Card */}
        {userTribe ? (
          <GlassCard style={styles.yourTribeCard}>
            <View style={styles.yourTribeHeader}>
              <Text style={styles.yourTribeLabel}>Your Tribe</Text>
              <View style={[styles.rankBadge, { backgroundColor: `${userTribe.color}30` }]}>
                <Text style={[styles.rankText, { color: userTribe.color }]}>
                  #{userTribe.rank}
                </Text>
              </View>
            </View>
            <View style={styles.yourTribeContent}>
              <View style={[styles.tribeAvatarLarge, { borderColor: userTribe.color }]}>
                <Text style={styles.tribeEmojiLarge}>{userTribe.leaderEmoji}</Text>
              </View>
              <View style={styles.yourTribeInfo}>
                <Text style={[styles.yourTribeName, { color: userTribe.color }]}>
                  {userTribe.name}
                </Text>
                <Text style={styles.yourTribeMotto}>"{userTribe.motto}"</Text>
                <View style={styles.yourTribeStats}>
                  <Text style={styles.yourTribeStat}>
                    {userTribe.memberCount.toLocaleString()} members
                  </Text>
                  <Text style={styles.yourTribeStat}>|</Text>
                  <Text style={styles.yourTribeStat}>
                    {formatXP(userTribe.totalXP)} XP
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>
        ) : (
          <GlassCard style={styles.noTribeCard}>
            <Text style={styles.noTribeEmoji}></Text>
            <Text style={styles.noTribeTitle}>You haven't joined a tribe yet</Text>
            <Text style={styles.noTribeSubtitle}>
              Choose a tribe below to start contributing to team rankings
            </Text>
          </GlassCard>
        )}

        {/* Season Info */}
        <GlassCard style={styles.seasonCard}>
          <View style={styles.seasonHeader}>
            <Text style={styles.seasonTitle}>Season 1</Text>
            <View style={styles.seasonTimerBadge}>
              <Text style={styles.seasonTimerText}>23 days left</Text>
            </View>
          </View>
          <Text style={styles.seasonDescription}>
            Contribute XP to help your tribe win! Top tribe at season end earns exclusive rewards.
          </Text>
          <View style={styles.seasonRewards}>
            <Text style={styles.seasonRewardsLabel}>Season Rewards:</Text>
            <View style={styles.rewardsList}>
              <Text style={styles.rewardItem}> Tribe Champion badge</Text>
              <Text style={styles.rewardItem}> +500 bonus XP</Text>
              <Text style={styles.rewardItem}> Exclusive avatar frame</Text>
            </View>
          </View>
        </GlassCard>

        {/* Tribe Leaderboard */}
        <Text style={styles.sectionTitle}>Tribe Rankings</Text>
        <View style={styles.tribesContainer}>
          {rankedTribes.map((tribe) => (
            <TouchableOpacity
              key={tribe.id}
              style={styles.tribeCard}
              onPress={() => setSelectedTribe(tribe)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[`${tribe.color}15`, 'transparent']}
                style={styles.tribeGradient}
              >
                {/* Rank Badge */}
                <View style={[
                  styles.tribeRankBadge,
                  tribe.rank === 1 && styles.tribeRankFirst,
                  tribe.rank === 2 && styles.tribeRankSecond,
                  tribe.rank === 3 && styles.tribeRankThird,
                ]}>
                  <Text style={styles.tribeRankText}>
                    {tribe.rank === 1 ? '' : tribe.rank === 2 ? '' : tribe.rank === 3 ? '' : `#${tribe.rank}`}
                  </Text>
                </View>

                {/* Tribe Content */}
                <View style={styles.tribeContent}>
                  <View style={[styles.tribeAvatar, { borderColor: tribe.color }]}>
                    <Text style={styles.tribeEmoji}>{tribe.leaderEmoji}</Text>
                  </View>
                  <View style={styles.tribeInfo}>
                    <Text style={[styles.tribeName, { color: tribe.color }]}>{tribe.name}</Text>
                    <Text style={styles.tribeMotto} numberOfLines={1}>"{tribe.motto}"</Text>
                    <View style={styles.tribeStats}>
                      <View style={styles.tribeStat}>
                        <Text style={styles.tribeStatValue}>{tribe.memberCount.toLocaleString()}</Text>
                        <Text style={styles.tribeStatLabel}>members</Text>
                      </View>
                      <View style={styles.tribeStatDivider} />
                      <View style={styles.tribeStat}>
                        <Text style={[styles.tribeStatValue, { color: tribe.color }]}>
                          {formatXP(tribe.totalXP)}
                        </Text>
                        <Text style={styles.tribeStatLabel}>XP</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Join indicator */}
                {tribe.id === userTribeId ? (
                  <View style={[styles.joinedBadge, { backgroundColor: `${tribe.color}20` }]}>
                    <Text style={[styles.joinedText, { color: tribe.color }]}>Joined</Text>
                  </View>
                ) : (
                  <View style={styles.joinArrow}>
                    <Text style={[styles.joinArrowText, { color: tribe.color }]}>{'>'}</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Tribe Detail Modal */}
      {selectedTribe && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedTribe(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.modalContent}
          >
            <LinearGradient
              colors={[`${selectedTribe.color}30`, colors.background.secondary]}
              style={styles.modalGradient}
            >
              <View style={[styles.modalAvatar, { borderColor: selectedTribe.color }]}>
                <Text style={styles.modalEmoji}>{selectedTribe.leaderEmoji}</Text>
              </View>
              <Text style={[styles.modalName, { color: selectedTribe.color }]}>
                {selectedTribe.name}
              </Text>
              <Text style={styles.modalMotto}>"{selectedTribe.motto}"</Text>
              <Text style={styles.modalDescription}>{selectedTribe.description}</Text>

              <View style={styles.modalStats}>
                <View style={styles.modalStat}>
                  <Text style={styles.modalStatValue}>#{selectedTribe.rank}</Text>
                  <Text style={styles.modalStatLabel}>Rank</Text>
                </View>
                <View style={styles.modalStat}>
                  <Text style={styles.modalStatValue}>{selectedTribe.memberCount.toLocaleString()}</Text>
                  <Text style={styles.modalStatLabel}>Members</Text>
                </View>
                <View style={styles.modalStat}>
                  <Text style={[styles.modalStatValue, { color: selectedTribe.color }]}>
                    {formatXP(selectedTribe.totalXP)}
                  </Text>
                  <Text style={styles.modalStatLabel}>Total XP</Text>
                </View>
              </View>

              {selectedTribe.id === userTribeId ? (
                <View style={styles.alreadyJoined}>
                  <Text style={styles.alreadyJoinedText}>You're a member!</Text>
                </View>
              ) : (
                <GlowButton
                  title={`Join ${selectedTribe.name}`}
                  onPress={() => handleJoinTribe(selectedTribe)}
                  fullWidth
                  style={styles.joinButton}
                />
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedTribe(null)}
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
    paddingBottom: spacing['2xl'],
  },
  heroGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
  },
  heroSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  yourTribeCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  yourTribeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  yourTribeLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  rankBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  rankText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  yourTribeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tribeAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  tribeEmojiLarge: {
    fontSize: 36,
  },
  yourTribeInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  yourTribeName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  yourTribeMotto: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  yourTribeStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  yourTribeStat: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  noTribeCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noTribeEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
    opacity: 0.5,
  },
  noTribeTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  noTribeSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  seasonCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  seasonTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.neon.yellow,
  },
  seasonTimerBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  seasonTimerText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.neon.yellow,
  },
  seasonDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  seasonRewards: {
    backgroundColor: colors.overlay.light,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  seasonRewardsLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  rewardsList: {
    gap: 4,
  },
  rewardItem: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tribesContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tribeCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  tribeGradient: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tribeRankBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  tribeRankFirst: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
  },
  tribeRankSecond: {
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
  },
  tribeRankThird: {
    backgroundColor: 'rgba(205, 127, 50, 0.2)',
  },
  tribeRankText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  tribeContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tribeAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  tribeEmoji: {
    fontSize: 24,
  },
  tribeInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  tribeName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  tribeMotto: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  tribeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  tribeStat: {
    alignItems: 'center',
  },
  tribeStatValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  tribeStatLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 9,
    color: colors.text.muted,
  },
  tribeStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.glass.border,
    marginHorizontal: spacing.sm,
  },
  joinedBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  joinedText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
  },
  joinArrow: {
    padding: spacing.xs,
  },
  joinArrowText: {
    fontSize: 20,
    fontFamily: typography.fonts.bold,
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
    width: '85%',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalAvatar: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    marginBottom: spacing.md,
  },
  modalEmoji: {
    fontSize: 48,
  },
  modalName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    marginBottom: spacing.xs,
  },
  modalMotto: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.glass.border,
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  modalStatLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  alreadyJoined: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  alreadyJoinedText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.success,
  },
  joinButton: {
    marginBottom: spacing.md,
  },
  closeButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  closeButtonText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.text.muted,
  },
});

export default JungleTribesScreen;
