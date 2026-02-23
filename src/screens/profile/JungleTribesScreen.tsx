// Jungle Tribes Screen — Expanded
// Community groups with tribe challenges, leaderboards, threaded chat,
// stats dashboard, badges, and challenge progress tracking
//
// Ported from desktop JungleTribes.tsx + tribeChallenges.ts

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard, GlowButton, PremiumModal, AchievementToast } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import { getRankedTribes, JungleTribe, JUNGLE_TRIBES, getTribeById } from '../../data/jungleTribes';
import { useTribeChat, TribeChatMessage } from '../../hooks';
import { useSubscription } from '../../hooks/useSubscription';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Challenge Types (ported from desktop tribeChallenges.ts) ─────────

type ChallengeMetric =
  | 'trades_shared'
  | 'xp_earned'
  | 'quizzes_passed'
  | 'strategies_studied'
  | 'streaks_maintained';

interface TribeChallenge {
  id: string;
  name: string;
  description: string;
  metric: ChallengeMetric;
  iconName: keyof typeof Ionicons.glyphMap;
  target: number;
  xpMultiplier: number;
  xpReward: number;
  durationDays: 7 | 14;
}

interface ActiveChallenge extends TribeChallenge {
  startDate: string;
  endDate: string;
  weekId: string;
  tribeProgress: Record<string, number>;
}

// ── Challenge Pool ───────────────────────────────────────────────────

const CHALLENGE_POOL: TribeChallenge[] = [
  {
    id: 'trade-blitz',
    name: 'Trade Blitz',
    description: 'Which tribe can share the most trades this week?',
    metric: 'trades_shared',
    iconName: 'flash',
    target: 50,
    xpMultiplier: 1.5,
    xpReward: 200,
    durationDays: 7,
  },
  {
    id: 'xp-stampede',
    name: 'XP Stampede',
    description: 'Race to earn the most collective XP!',
    metric: 'xp_earned',
    iconName: 'rocket',
    target: 10000,
    xpMultiplier: 1.25,
    xpReward: 150,
    durationDays: 7,
  },
  {
    id: 'brain-battle',
    name: 'Brain Battle',
    description: 'Tribe with the most quiz passes wins!',
    metric: 'quizzes_passed',
    iconName: 'bulb',
    target: 30,
    xpMultiplier: 1.5,
    xpReward: 250,
    durationDays: 7,
  },
  {
    id: 'strategy-safari',
    name: 'Strategy Safari',
    description: 'Study the most strategies to claim victory!',
    metric: 'strategies_studied',
    iconName: 'book',
    target: 100,
    xpMultiplier: 1.25,
    xpReward: 175,
    durationDays: 7,
  },
  {
    id: 'streak-siege',
    name: 'Streak Siege',
    description: 'Keep the longest combined streak days across your tribe!',
    metric: 'streaks_maintained',
    iconName: 'flame',
    target: 50,
    xpMultiplier: 1.5,
    xpReward: 200,
    durationDays: 7,
  },
  {
    id: 'ultimate-showdown',
    name: 'Ultimate Showdown',
    description: 'Two-week mega challenge: most XP earned wins big!',
    metric: 'xp_earned',
    iconName: 'trophy',
    target: 25000,
    xpMultiplier: 2.0,
    xpReward: 500,
    durationDays: 14,
  },
];

// ── Tribe Badges ─────────────────────────────────────────────────────

interface TribeBadge {
  id: string;
  name: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  requirement: string;
}

const TRIBE_BADGES: TribeBadge[] = [
  {
    id: 'tribe-recruit',
    name: 'Tribe Recruit',
    description: 'Joined a tribe',
    iconName: 'people',
    color: '#3b82f6',
    requirement: 'Join any tribe',
  },
  {
    id: 'challenge-victor',
    name: 'Challenge Victor',
    description: 'Won a weekly tribe challenge',
    iconName: 'trophy',
    color: '#f59e0b',
    requirement: 'Be on winning tribe for a challenge',
  },
  {
    id: 'chat-starter',
    name: 'Chat Starter',
    description: 'Sent 10 tribe chat messages',
    iconName: 'chatbubbles',
    color: '#00f0ff',
    requirement: 'Send 10 messages in tribe chat',
  },
  {
    id: 'tribe-loyal',
    name: 'Tribe Loyalist',
    description: 'Been in the same tribe for 30 days',
    iconName: 'shield-checkmark',
    color: '#39ff14',
    requirement: 'Stay in one tribe for 30 days',
  },
  {
    id: 'xp-contributor',
    name: 'XP Contributor',
    description: 'Contributed 5,000 XP to your tribe',
    iconName: 'flash',
    color: '#ffff00',
    requirement: 'Earn 5,000 XP while in a tribe',
  },
  {
    id: 'challenge-streak-3',
    name: 'Three-Peat',
    description: 'Won 3 challenges in a row',
    iconName: 'medal',
    color: '#ff6600',
    requirement: 'Win 3 consecutive weekly challenges',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

const TRIBE_STORAGE_KEY = 'wsw-tribe';
const CLAIMED_CHALLENGES_KEY = 'wsw-claimed-challenges';
const TRIBE_BADGES_KEY = 'wsw-tribe-badges';

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getCurrentChallenge(): ActiveChallenge {
  const now = new Date();
  const weekNum = getWeekNumber(now);
  const year = now.getFullYear();
  const weekId = `${year}-W${weekNum.toString().padStart(2, '0')}`;

  const challengeIndex = weekNum % CHALLENGE_POOL.length;
  const template = CHALLENGE_POOL[challengeIndex];

  const start = getWeekStart(now);
  const end = new Date(start);
  end.setDate(end.getDate() + template.durationDays);

  const tribeProgress: Record<string, number> = {};
  for (const tribe of JUNGLE_TRIBES) {
    // Simulate some progress based on tribe XP
    tribeProgress[tribe.id] = Math.floor(Math.random() * (template.target * 0.8));
  }

  return {
    ...template,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    weekId,
    tribeProgress,
  };
}

function getChallengeTimeRemaining(challenge: ActiveChallenge): { days: number; hours: number } {
  const now = Date.now();
  const end = new Date(challenge.endDate).getTime();
  const remaining = Math.max(0, end - now);
  return {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  };
}

function getLeadingTribe(challenge: ActiveChallenge): string | null {
  let maxProgress = 0;
  let leader: string | null = null;
  for (const [tribeId, progress] of Object.entries(challenge.tribeProgress)) {
    if (progress > maxProgress) {
      maxProgress = progress;
      leader = tribeId;
    }
  }
  return leader;
}

function getSeasonInfo() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const quarter = Math.floor(month / 3);
  const seasonNames = ['Winter Hunt', 'Spring Rally', 'Summer Stampede', 'Fall Harvest'];
  const seasonStart = new Date(year, quarter * 3, 1);
  const seasonEnd = new Date(year, (quarter + 1) * 3, 0, 23, 59, 59);

  const totalMs = seasonEnd.getTime() - seasonStart.getTime();
  const elapsedMs = now.getTime() - seasonStart.getTime();
  const progress = Math.round((elapsedMs / totalMs) * 100);
  const daysLeft = Math.ceil((seasonEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    name: seasonNames[quarter],
    progress,
    daysLeft: Math.max(0, daysLeft),
  };
}

const getRelativeTime = (isoDate: string): string => {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(isoDate).toLocaleDateString();
};

const formatXP = (xp: number): string => {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(0)}K`;
  return xp.toString();
};

// ── Mock Activity Feed ───────────────────────────────────────────────

interface ActivityItem {
  id: string;
  text: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  minutesAgo: number;
}

const getMockActivity = (): ActivityItem[] => [
  { id: 'a1', text: 'TraderAlex earned 150 XP from a quiz', iconName: 'flash', iconColor: colors.neon.yellow, minutesAgo: 3 },
  { id: 'a2', text: 'OptionsPro shared a winning AAPL trade', iconName: 'trending-up', iconColor: colors.neon.green, minutesAgo: 12 },
  { id: 'a3', text: 'JungleTrader completed Strategy Safari', iconName: 'book', iconColor: colors.neon.cyan, minutesAgo: 25 },
  { id: 'a4', text: 'BullRunner logged a SPY iron condor', iconName: 'stats-chart', iconColor: colors.neon.purple, minutesAgo: 42 },
  { id: 'a5', text: 'SwingKing studied 3 volatility strategies', iconName: 'school', iconColor: colors.neon.orange, minutesAgo: 67 },
  { id: 'a6', text: 'DeltaHunter reached Level 15', iconName: 'arrow-up-circle', iconColor: colors.neon.green, minutesAgo: 95 },
  { id: 'a7', text: 'GammaTrader earned the Quiz Master badge', iconName: 'ribbon', iconColor: colors.neon.pink, minutesAgo: 130 },
];

// ── Threaded Reply Type ──────────────────────────────────────────────

interface ChatReply {
  id: string;
  parentId: string;
  displayName: string;
  text: string;
  createdAt: string;
  isOwn: boolean;
}

// ══════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════

const JungleTribesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Tribe state
  const [userTribeId, setUserTribeId] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState<JungleTribe | null>(null);

  // Tabs: leaderboard | challenges | activity | chat | badges
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'activity' | 'chat' | 'badges'>('leaderboard');

  // Challenge state
  const [challenge, setChallenge] = useState<ActiveChallenge>(getCurrentChallenge());
  const [claimedChallenges, setClaimedChallenges] = useState<string[]>([]);

  // Badge state
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastDescription, setToastDescription] = useState('');

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<TribeChatMessage | null>(null);
  const [replies, setReplies] = useState<Record<string, ChatReply[]>>({});
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const chatScrollRef = useRef<ScrollView>(null);

  // Activity
  const [activity] = useState<ActivityItem[]>(getMockActivity());

  // Data
  const rankedTribes = useMemo(() => getRankedTribes(), []);
  const season = useMemo(() => getSeasonInfo(), []);
  const userTribe = userTribeId ? rankedTribes.find(t => t.id === userTribeId) || null : null;

  // Chat hook
  const { messages, loading: chatLoading, sendMessage, refresh: refreshChat } = useTribeChat(
    userTribeId
  );

  // ── Load persisted tribe from AsyncStorage ──
  useEffect(() => {
    const loadTribeState = async () => {
      try {
        const saved = await AsyncStorage.getItem(TRIBE_STORAGE_KEY);
        if (saved) {
          const { tribeId } = JSON.parse(saved);
          setUserTribeId(tribeId);
        }
      } catch (e) {
        console.error('Failed to load tribe state:', e);
      }

      try {
        const claimed = await AsyncStorage.getItem(CLAIMED_CHALLENGES_KEY);
        if (claimed) setClaimedChallenges(JSON.parse(claimed));
      } catch { /* ignore */ }

      try {
        const badges = await AsyncStorage.getItem(TRIBE_BADGES_KEY);
        if (badges) setEarnedBadges(JSON.parse(badges));
      } catch { /* ignore */ }
    };
    loadTribeState();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (messages.length > 0 && chatScrollRef.current && activeTab === 'chat') {
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, activeTab]);

  // ── Join Tribe ──
  const handleJoinTribe = useCallback((tribe: JungleTribe) => {
    Alert.alert(
      `Join ${tribe.name}?`,
      `Your XP will contribute to ${tribe.name}'s ranking. You can change tribes anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join Tribe',
          onPress: async () => {
            setJoining(true);
            try {
              const tribeData = {
                tribeId: tribe.id,
                joinedAt: new Date().toISOString(),
                contributedXP: 0,
              };
              await AsyncStorage.setItem(TRIBE_STORAGE_KEY, JSON.stringify(tribeData));
              setUserTribeId(tribe.id);
              setSelectedTribe(null);

              // Award recruit badge
              if (!earnedBadges.includes('tribe-recruit')) {
                const updated = [...earnedBadges, 'tribe-recruit'];
                setEarnedBadges(updated);
                await AsyncStorage.setItem(TRIBE_BADGES_KEY, JSON.stringify(updated));
                showToast('Badge Unlocked!', 'Tribe Recruit - You joined a tribe');
              }
            } catch (e) {
              console.error('Failed to join tribe:', e);
            } finally {
              setJoining(false);
            }
          },
        },
      ]
    );
  }, [earnedBadges]);

  // ── Leave Tribe ──
  const handleLeaveTribe = useCallback(() => {
    Alert.alert(
      'Leave Tribe?',
      'Your contributed XP will remain but you will no longer participate in challenges.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(TRIBE_STORAGE_KEY);
            setUserTribeId(null);
            setActiveTab('leaderboard');
          },
        },
      ]
    );
  }, []);

  // ── Claim Challenge Reward ──
  const handleClaimReward = useCallback(async () => {
    if (!userTribeId || claimedChallenges.includes(challenge.weekId)) return;

    const leader = getLeadingTribe(challenge);
    if (leader !== userTribeId) return;

    const totalXP = Math.round(challenge.xpReward * challenge.xpMultiplier);

    const updated = [...claimedChallenges, challenge.weekId];
    setClaimedChallenges(updated);
    await AsyncStorage.setItem(CLAIMED_CHALLENGES_KEY, JSON.stringify(updated));

    // Award challenge-victor badge
    if (!earnedBadges.includes('challenge-victor')) {
      const badgeUpdate = [...earnedBadges, 'challenge-victor'];
      setEarnedBadges(badgeUpdate);
      await AsyncStorage.setItem(TRIBE_BADGES_KEY, JSON.stringify(badgeUpdate));
    }

    showToast('Challenge Reward Claimed!', `+${totalXP} XP earned for your tribe's victory`);

    // Check for 3-peat
    if (updated.length >= 3 && !earnedBadges.includes('challenge-streak-3')) {
      const badgeUpdate = [...earnedBadges, 'challenge-streak-3'];
      setEarnedBadges(badgeUpdate);
      await AsyncStorage.setItem(TRIBE_BADGES_KEY, JSON.stringify(badgeUpdate));
    }
  }, [userTribeId, challenge, claimedChallenges, earnedBadges]);

  // ── Chat Handlers ──
  const handleSendMessage = useCallback(() => {
    if (!chatInput.trim()) return;

    if (replyingTo) {
      // Add as threaded reply
      const reply: ChatReply = {
        id: `reply-${Date.now()}`,
        parentId: replyingTo.id,
        displayName: 'You',
        text: chatInput.trim(),
        createdAt: new Date().toISOString(),
        isOwn: true,
      };

      setReplies(prev => ({
        ...prev,
        [replyingTo.id]: [...(prev[replyingTo.id] || []), reply],
      }));
      setReplyingTo(null);
    } else {
      sendMessage(chatInput.trim());
    }

    setChatInput('');
  }, [chatInput, replyingTo, sendMessage]);

  const showToast = (title: string, description: string) => {
    setToastTitle(title);
    setToastDescription(description);
    setToastVisible(true);
  };

  // ── Tab Config ──
  type TabId = 'leaderboard' | 'challenges' | 'activity' | 'chat' | 'badges';
  const tabs: { id: TabId; label: string; iconName: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'leaderboard', label: 'Ranks', iconName: 'podium' },
    { id: 'challenges', label: 'Challenges', iconName: 'flame' },
    { id: 'activity', label: 'Activity', iconName: 'pulse' },
    { id: 'chat', label: 'Chat', iconName: 'chatbubbles' },
    { id: 'badges', label: 'Badges', iconName: 'ribbon' },
  ];

  // ══════════════════════════════════════════════════════════════════════
  // PREMIUM GATE
  // ══════════════════════════════════════════════════════════════════════

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.neon.green} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jungle Tribes</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.lockedContainer}>
          <View style={styles.lockedIconCircle}>
            <Ionicons name="lock-closed" size={48} color={colors.neon.green} />
          </View>
          <Text style={styles.lockedTitle}>Premium Feature</Text>
          <Text style={styles.lockedDescription}>
            Join a tribe and compete with fellow traders. Your XP contributes to tribe rankings, access tribe chat, and earn exclusive seasonal rewards.
          </Text>
          <TouchableOpacity
            style={styles.lockedButton}
            onPress={() => setShowPremiumModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="diamond-outline" size={18} color="#000000" />
            <Text style={styles.lockedButtonText}>Unlock Jungle Tribes</Text>
          </TouchableOpacity>
        </View>
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          featureName="Jungle Tribes"
        />
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // TRIBE SELECTION (no tribe joined yet)
  // ══════════════════════════════════════════════════════════════════════

  if (!userTribeId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.neon.green} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Tribe</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.selectionHero}>
            <Ionicons name="people-circle" size={64} color={colors.neon.purple} />
            <Text style={styles.selectionTitle}>Join a Jungle Tribe</Text>
            <Text style={styles.selectionSubtitle}>
              Team up with fellow traders. Your XP contributes to your tribe's seasonal ranking!
            </Text>
          </View>

          {/* Season Banner */}
          <GlassCard style={styles.seasonBanner}>
            <View style={styles.seasonRow}>
              <View style={styles.seasonLeft}>
                <Ionicons name="trophy" size={20} color={colors.neon.yellow} />
                <View style={styles.seasonTextContainer}>
                  <Text style={styles.seasonName}>{season.name} Season</Text>
                  <Text style={styles.seasonDaysLeft}>{season.daysLeft} days remaining</Text>
                </View>
              </View>
              <View style={styles.seasonProgressContainer}>
                <View style={styles.seasonProgressBg}>
                  <View style={[styles.seasonProgressFill, { width: `${season.progress}%` }]} />
                </View>
                <Text style={styles.seasonProgressText}>{season.progress}%</Text>
              </View>
            </View>
          </GlassCard>

          {/* Tribe Cards */}
          {rankedTribes.map((tribe) => (
            <TouchableOpacity
              key={tribe.id}
              style={[
                styles.selectionCard,
                { borderColor: selectedTribe?.id === tribe.id ? tribe.color : colors.border.default },
              ]}
              onPress={() => setSelectedTribe(tribe)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[`${tribe.color}15`, 'transparent']}
                style={styles.selectionCardGradient}
              >
                <View style={styles.selectionCardHeader}>
                  <View style={[styles.selectionAvatar, { borderColor: tribe.color }]}>
                    <Text style={styles.selectionAvatarEmoji}>{tribe.leaderEmoji}</Text>
                  </View>
                  <View style={styles.selectionCardInfo}>
                    <Text style={[styles.selectionTribeName, { color: tribe.color }]}>{tribe.name}</Text>
                    <Text style={styles.selectionMotto}>"{tribe.motto}"</Text>
                  </View>
                  <View style={[styles.selectionRankBadge, { backgroundColor: `${tribe.color}20` }]}>
                    <Text style={[styles.selectionRankText, { color: tribe.color }]}>#{tribe.rank}</Text>
                  </View>
                </View>

                <Text style={styles.selectionDescription} numberOfLines={2}>
                  {tribe.description}
                </Text>

                <View style={styles.selectionStatsRow}>
                  <View style={styles.selectionStatItem}>
                    <Ionicons name="people" size={14} color={tribe.color} />
                    <Text style={styles.selectionStatValue}>{tribe.memberCount.toLocaleString()}</Text>
                    <Text style={styles.selectionStatLabel}>members</Text>
                  </View>
                  <View style={styles.selectionStatItem}>
                    <Ionicons name="flash" size={14} color={colors.neon.yellow} />
                    <Text style={styles.selectionStatValue}>{formatXP(tribe.totalXP)}</Text>
                    <Text style={styles.selectionStatLabel}>XP</Text>
                  </View>
                </View>

                {selectedTribe?.id === tribe.id && (
                  <TouchableOpacity
                    style={[styles.joinButton, { backgroundColor: tribe.color }]}
                    onPress={() => handleJoinTribe(tribe)}
                    disabled={joining}
                    activeOpacity={0.8}
                  >
                    {joining ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      <>
                        <Ionicons name="log-in" size={18} color="#000" />
                        <Text style={styles.joinButtonText}>Join {tribe.name}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // MEMBER VIEW (tribe joined)
  // ══════════════════════════════════════════════════════════════════════

  const myTribe = userTribe;
  const myTribeStats = rankedTribes.find(t => t.id === userTribeId);

  if (!myTribe) return null;

  const challengeTimeLeft = getChallengeTimeRemaining(challenge);
  const challengeLeader = getLeadingTribe(challenge);
  const isMyTribeLeading = challengeLeader === userTribeId;
  const myTribeChallengeProgress = challenge.tribeProgress[userTribeId] || 0;
  const myTribeChallengePercent = Math.min(100, (myTribeChallengeProgress / challenge.target) * 100);
  const sortedChallengeTribes = [...rankedTribes].sort(
    (a, b) => (challenge.tribeProgress[b.id] || 0) - (challenge.tribeProgress[a.id] || 0)
  );
  const maxChallengeProgress = Math.max(...Object.values(challenge.tribeProgress), 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.neon.green} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{myTribe.name}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Season Banner */}
        <GlassCard style={styles.seasonBanner}>
          <View style={styles.seasonRow}>
            <View style={styles.seasonLeft}>
              <Ionicons name="trophy" size={18} color={colors.neon.yellow} />
              <View style={styles.seasonTextContainer}>
                <Text style={styles.seasonName}>{season.name} Season</Text>
                <Text style={styles.seasonDaysLeft}>{season.daysLeft} days left</Text>
              </View>
            </View>
            <View style={styles.seasonProgressContainer}>
              <View style={styles.seasonProgressBg}>
                <View style={[styles.seasonProgressFill, { width: `${season.progress}%` }]} />
              </View>
              <Text style={styles.seasonProgressText}>{season.progress}%</Text>
            </View>
          </View>
        </GlassCard>

        {/* Tribe Header Card */}
        <View style={[styles.tribeHeaderCard, { borderColor: `${myTribe.color}40` }]}>
          <LinearGradient
            colors={[`${myTribe.color}20`, colors.background.secondary]}
            style={styles.tribeHeaderGradient}
          >
            <View style={styles.tribeHeaderRow}>
              <View style={[styles.tribeHeaderAvatar, { borderColor: myTribe.color }]}>
                <Text style={styles.tribeHeaderEmoji}>{myTribe.leaderEmoji}</Text>
              </View>
              <View style={styles.tribeHeaderInfo}>
                <Text style={[styles.tribeHeaderName, { color: myTribe.color }]}>{myTribe.name}</Text>
                <Text style={styles.tribeHeaderMotto}>"{myTribe.motto}"</Text>
                <Text style={styles.tribeHeaderDesc} numberOfLines={2}>{myTribe.description}</Text>
              </View>
              <View style={styles.tribeRankContainer}>
                <Text style={styles.tribeRankValue}>#{myTribeStats?.rank || '-'}</Text>
                <Text style={styles.tribeRankLabel}>Season Rank</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Dashboard */}
        <View style={styles.statsGrid}>
          {[
            { iconName: 'people' as keyof typeof Ionicons.glyphMap, iconColor: myTribe.color, value: myTribeStats?.memberCount.toLocaleString() || '0', label: 'Members' },
            { iconName: 'flash' as keyof typeof Ionicons.glyphMap, iconColor: colors.neon.yellow, value: formatXP(myTribeStats?.totalXP || 0), label: 'Season XP' },
            { iconName: 'trending-up' as keyof typeof Ionicons.glyphMap, iconColor: colors.neon.green, value: formatXP(Math.floor((myTribeStats?.totalXP || 0) * 0.15)), label: 'This Week' },
            { iconName: 'star' as keyof typeof Ionicons.glyphMap, iconColor: colors.neon.purple, value: myTribeStats ? formatXP(Math.floor(myTribeStats.totalXP / myTribeStats.memberCount)) : '0', label: 'Avg/Member' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={stat.iconName} size={24} color={stat.iconColor} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabItem,
                  activeTab === tab.id && styles.tabItemActive,
                ]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tab.iconName}
                  size={16}
                  color={activeTab === tab.id ? colors.text.primary : colors.text.muted}
                />
                <Text style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.tabLabelActive,
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Tab: Leaderboard ── */}
        {activeTab === 'leaderboard' && (
          <View style={styles.tabContent}>
            {rankedTribes.map((tribe) => {
              const isMyTribe = tribe.id === userTribeId;
              return (
                <View
                  key={tribe.id}
                  style={[
                    styles.leaderboardRow,
                    isMyTribe && styles.leaderboardRowHighlight,
                  ]}
                >
                  <View style={styles.leaderboardRank}>
                    {tribe.rank === 1 ? (
                      <Ionicons name="trophy" size={20} color={colors.neon.yellow} />
                    ) : tribe.rank === 2 ? (
                      <Text style={styles.leaderboardRankTextSilver}>2</Text>
                    ) : tribe.rank === 3 ? (
                      <Text style={styles.leaderboardRankTextBronze}>3</Text>
                    ) : (
                      <Text style={styles.leaderboardRankText}>{tribe.rank}</Text>
                    )}
                  </View>

                  <View style={[styles.leaderboardAvatar, { borderColor: tribe.color }]}>
                    <Text style={styles.leaderboardEmoji}>{tribe.leaderEmoji}</Text>
                  </View>

                  <View style={styles.leaderboardInfo}>
                    <View style={styles.leaderboardNameRow}>
                      <Text style={styles.leaderboardName}>{tribe.name}</Text>
                      {isMyTribe && (
                        <View style={styles.yourTribeBadge}>
                          <Text style={styles.yourTribeBadgeText}>You</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.leaderboardMembers}>{tribe.memberCount.toLocaleString()} members</Text>
                  </View>

                  <View style={styles.leaderboardXP}>
                    <Text style={styles.leaderboardXPValue}>{formatXP(tribe.totalXP)}</Text>
                    <Text style={styles.leaderboardXPLabel}>Season XP</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Tab: Challenges ── */}
        {activeTab === 'challenges' && (
          <View style={styles.tabContent}>
            {/* Active Challenge Banner */}
            <GlassCard style={styles.challengeBanner}>
              <View style={styles.challengeHeader}>
                <View style={styles.challengeHeaderLeft}>
                  <View style={styles.challengeIconContainer}>
                    <Ionicons name={challenge.iconName} size={28} color={colors.neon.yellow} />
                  </View>
                  <View style={styles.challengeHeaderInfo}>
                    <View style={styles.challengeNameRow}>
                      <Text style={styles.challengeName}>{challenge.name}</Text>
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Active</Text>
                      </View>
                    </View>
                    <Text style={styles.challengeDescription}>{challenge.description}</Text>
                  </View>
                </View>
                <View style={styles.challengeTimer}>
                  <Ionicons name="time-outline" size={14} color={colors.neon.yellow} />
                  <Text style={styles.challengeTimerText}>
                    {challengeTimeLeft.days}d {challengeTimeLeft.hours}h
                  </Text>
                </View>
              </View>

              {/* Reward Info */}
              <View style={styles.rewardInfoRow}>
                <View style={[styles.rewardInfoItem, { backgroundColor: 'rgba(255, 255, 0, 0.1)' }]}>
                  <Ionicons name="flash" size={14} color={colors.neon.yellow} />
                  <Text style={[styles.rewardInfoText, { color: colors.neon.yellow }]}>
                    {challenge.xpMultiplier}x XP
                  </Text>
                </View>
                <View style={[styles.rewardInfoItem, { backgroundColor: 'rgba(57, 255, 20, 0.1)' }]}>
                  <Ionicons name="trophy" size={14} color={colors.neon.green} />
                  <Text style={[styles.rewardInfoText, { color: colors.neon.green }]}>
                    +{challenge.xpReward} XP
                  </Text>
                </View>
                <View style={[styles.rewardInfoItem, { backgroundColor: 'rgba(191, 0, 255, 0.1)' }]}>
                  <Ionicons name="ribbon" size={14} color={colors.neon.purple} />
                  <Text style={[styles.rewardInfoText, { color: colors.neon.purple }]}>
                    Victor Badge
                  </Text>
                </View>
              </View>

              {/* Target */}
              <Text style={styles.challengeTarget}>
                Target: {challenge.target.toLocaleString()} {challenge.metric.replace(/_/g, ' ')}
              </Text>
            </GlassCard>

            {/* Tribe Rankings for Challenge */}
            {sortedChallengeTribes.map((tribe, idx) => {
              const progress = challenge.tribeProgress[tribe.id] || 0;
              const pct = Math.min(100, (progress / challenge.target) * 100);
              const barPct = maxChallengeProgress > 0 ? (progress / maxChallengeProgress) * 100 : 0;
              const isThisTribe = tribe.id === userTribeId;
              const isLeader = tribe.id === challengeLeader;

              return (
                <View
                  key={tribe.id}
                  style={[
                    styles.challengeRow,
                    isThisTribe && styles.challengeRowHighlight,
                  ]}
                >
                  <View style={styles.challengeRankCol}>
                    {idx === 0 && progress > 0 ? (
                      <Ionicons name="trophy" size={16} color={colors.neon.yellow} />
                    ) : (
                      <Text style={styles.challengeRankText}>#{idx + 1}</Text>
                    )}
                  </View>

                  <View style={[styles.challengeTribeAvatar, { borderColor: tribe.color }]}>
                    <Text style={styles.challengeTribeEmoji}>{tribe.leaderEmoji}</Text>
                  </View>

                  <View style={styles.challengeBarSection}>
                    <View style={styles.challengeBarNameRow}>
                      <Text style={styles.challengeBarName} numberOfLines={1}>{tribe.name}</Text>
                      {isThisTribe && (
                        <View style={styles.yourTribeBadge}>
                          <Text style={styles.yourTribeBadgeText}>You</Text>
                        </View>
                      )}
                      {isLeader && progress > 0 && (
                        <View style={[styles.leadingBadge]}>
                          <Text style={styles.leadingBadgeText}>Leading</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.challengeBarContainer}>
                      <View style={styles.challengeBarBg}>
                        <LinearGradient
                          colors={[tribe.color, `${tribe.color}80`]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.challengeBarFill, { width: `${barPct}%` }]}
                        />
                      </View>
                      <Text style={styles.challengeBarPercent}>{Math.round(pct)}%</Text>
                    </View>
                  </View>

                  <View style={styles.challengeProgressCol}>
                    <Text style={styles.challengeProgressValue}>{progress.toLocaleString()}</Text>
                    <Text style={styles.challengeProgressTarget}>/ {challenge.target.toLocaleString()}</Text>
                  </View>
                </View>
              );
            })}

            {/* My Tribe Challenge Status */}
            <View style={[
              styles.myTribeChallengeCard,
              { borderColor: isMyTribeLeading ? myTribe.color : `${myTribe.color}40` },
            ]}>
              <LinearGradient
                colors={[`${myTribe.color}15`, 'transparent']}
                style={styles.myTribeChallengeGradient}
              >
                <View style={styles.myTribeChallengeRow}>
                  <View style={styles.myTribeChallengeInfo}>
                    <Text style={[styles.myTribeChallengeStatus, { color: myTribe.color }]}>
                      {isMyTribeLeading
                        ? 'Your tribe is leading!'
                        : `Your tribe is #${sortedChallengeTribes.findIndex(t => t.id === userTribeId) + 1}`
                      }
                    </Text>
                    <Text style={styles.myTribeChallengeProgress}>
                      {myTribeChallengeProgress.toLocaleString()} / {challenge.target.toLocaleString()} ({Math.round(myTribeChallengePercent)}%)
                    </Text>
                  </View>

                  {isMyTribeLeading && !claimedChallenges.includes(challenge.weekId) && (
                    <TouchableOpacity
                      style={styles.claimRewardButton}
                      onPress={handleClaimReward}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.claimRewardText}>
                        Claim +{Math.round(challenge.xpReward * challenge.xpMultiplier)} XP
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isMyTribeLeading && claimedChallenges.includes(challenge.weekId) && (
                    <View style={styles.claimedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.neon.green} />
                      <Text style={styles.claimedBadgeText}>Claimed</Text>
                    </View>
                  )}

                  {!isMyTribeLeading && (
                    <Text style={styles.winToClaimText}>Win to claim rewards</Text>
                  )}
                </View>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* ── Tab: Activity ── */}
        {activeTab === 'activity' && (
          <View style={styles.tabContent}>
            {activity.map((item) => (
              <View key={item.id} style={styles.activityRow}>
                <View style={[styles.activityIcon, { backgroundColor: `${item.iconColor}15` }]}>
                  <Ionicons name={item.iconName} size={18} color={item.iconColor} />
                </View>
                <Text style={styles.activityText} numberOfLines={2}>{item.text}</Text>
                <View style={styles.activityTimeContainer}>
                  <Ionicons name="time-outline" size={12} color={colors.text.muted} />
                  <Text style={styles.activityTime}>
                    {item.minutesAgo < 60 ? `${item.minutesAgo}m` : `${Math.floor(item.minutesAgo / 60)}h`}
                  </Text>
                </View>
              </View>
            ))}

            {activity.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="pulse" size={36} color={colors.text.muted} />
                <Text style={styles.emptyStateText}>No activity yet. Be the first to earn XP for your tribe!</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Tab: Chat ── */}
        {activeTab === 'chat' && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatContainer}
          >
            {/* Welcome Message */}
            <View style={styles.chatWelcome}>
              <Ionicons name="chatbubbles" size={16} color={colors.text.muted} />
              <Text style={styles.chatWelcomeText}>Welcome to {myTribe.name} tribe chat</Text>
            </View>

            {/* Messages */}
            <ScrollView
              ref={chatScrollRef}
              style={styles.chatMessagesList}
              contentContainerStyle={styles.chatMessagesListContent}
              showsVerticalScrollIndicator={false}
            >
              {chatLoading ? (
                <View style={styles.chatLoadingContainer}>
                  <ActivityIndicator size="small" color={colors.neon.cyan} />
                  <Text style={styles.chatLoadingText}>Loading messages...</Text>
                </View>
              ) : messages.length === 0 ? (
                <View style={styles.chatEmptyContainer}>
                  <Ionicons name="chatbubble-ellipses-outline" size={32} color={colors.text.muted} />
                  <Text style={styles.chatEmptyText}>No messages yet. Start the conversation!</Text>
                </View>
              ) : (
                messages.map((msg) => (
                  <View key={msg.id}>
                    {/* Main Message */}
                    <View style={[styles.chatMessage, msg.isOwn && styles.chatMessageOwn]}>
                      {!msg.isOwn && (
                        <View style={[styles.chatAvatar, { backgroundColor: `${myTribe.color}30` }]}>
                          <Text style={[styles.chatAvatarText, { color: myTribe.color }]}>
                            {msg.display_name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={[styles.chatBubble, msg.isOwn && { backgroundColor: `${myTribe.color}20` }]}>
                        <View style={styles.chatBubbleHeader}>
                          <Text style={[styles.chatDisplayName, msg.isOwn && { color: myTribe.color }]}>
                            {msg.isOwn ? 'You' : msg.display_name}
                          </Text>
                          <Text style={styles.chatTimestamp}>{getRelativeTime(msg.created_at)}</Text>
                        </View>
                        <Text style={styles.chatMessageText}>{msg.message_text}</Text>
                        <View style={styles.chatActions}>
                          <TouchableOpacity
                            style={styles.chatReplyButton}
                            onPress={() => setReplyingTo(msg)}
                          >
                            <Ionicons name="arrow-undo-outline" size={14} color={colors.text.muted} />
                            <Text style={styles.chatReplyButtonText}>Reply</Text>
                          </TouchableOpacity>
                          {(replies[msg.id]?.length || 0) > 0 && (
                            <TouchableOpacity
                              style={styles.chatThreadButton}
                              onPress={() => setExpandedThread(expandedThread === msg.id ? null : msg.id)}
                            >
                              <Ionicons name="chatbubble-outline" size={14} color={colors.neon.cyan} />
                              <Text style={styles.chatThreadText}>
                                {replies[msg.id].length} {replies[msg.id].length === 1 ? 'reply' : 'replies'}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Threaded Replies */}
                    {expandedThread === msg.id && replies[msg.id]?.map((reply) => (
                      <View key={reply.id} style={styles.threadedReply}>
                        <View style={styles.threadLine} />
                        <View style={[styles.chatBubble, reply.isOwn && { backgroundColor: `${myTribe.color}15` }]}>
                          <View style={styles.chatBubbleHeader}>
                            <Text style={[styles.chatDisplayName, reply.isOwn && { color: myTribe.color }]}>
                              {reply.displayName}
                            </Text>
                            <Text style={styles.chatTimestamp}>{getRelativeTime(reply.createdAt)}</Text>
                          </View>
                          <Text style={styles.chatMessageText}>{reply.text}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))
              )}
            </ScrollView>

            {/* Reply Indicator */}
            {replyingTo && (
              <View style={styles.replyIndicator}>
                <View style={styles.replyIndicatorLeft}>
                  <Ionicons name="arrow-undo" size={14} color={colors.neon.cyan} />
                  <Text style={styles.replyIndicatorText} numberOfLines={1}>
                    Replying to {replyingTo.display_name}: {replyingTo.message_text}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Ionicons name="close" size={18} color={colors.text.muted} />
                </TouchableOpacity>
              </View>
            )}

            {/* Chat Input */}
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatTextInput}
                placeholder={replyingTo ? 'Write a reply...' : `Message ${myTribe.name}...`}
                placeholderTextColor={colors.text.muted}
                value={chatInput}
                onChangeText={setChatInput}
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                style={[styles.chatSendButton, !chatInput.trim() && styles.chatSendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                <Ionicons
                  name="send"
                  size={18}
                  color={chatInput.trim() ? colors.background.primary : colors.text.muted}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* ── Tab: Badges ── */}
        {activeTab === 'badges' && (
          <View style={styles.tabContent}>
            <Text style={styles.badgesSectionTitle}>Tribe Badges & Achievements</Text>
            <Text style={styles.badgesSectionSubtitle}>
              Earn badges by participating in tribe activities
            </Text>

            <View style={styles.badgesGrid}>
              {TRIBE_BADGES.map((badge) => {
                const isEarned = earnedBadges.includes(badge.id);
                return (
                  <View
                    key={badge.id}
                    style={[
                      styles.badgeCard,
                      isEarned && { borderColor: `${badge.color}40` },
                      !isEarned && styles.badgeCardLocked,
                    ]}
                  >
                    <View style={[
                      styles.badgeIconCircle,
                      { backgroundColor: isEarned ? `${badge.color}20` : colors.overlay.light },
                    ]}>
                      <Ionicons
                        name={isEarned ? badge.iconName : 'lock-closed'}
                        size={24}
                        color={isEarned ? badge.color : colors.text.muted}
                      />
                    </View>
                    <Text style={[
                      styles.badgeName,
                      !isEarned && styles.badgeNameLocked,
                    ]}>
                      {badge.name}
                    </Text>
                    <Text style={styles.badgeDescription} numberOfLines={2}>
                      {badge.description}
                    </Text>
                    <Text style={[
                      styles.badgeRequirement,
                      isEarned && { color: badge.color },
                    ]}>
                      {isEarned ? 'Earned' : badge.requirement}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Badge Stats */}
            <View style={styles.badgeStatsCard}>
              <View style={styles.badgeStatsRow}>
                <View style={styles.badgeStatItem}>
                  <Text style={styles.badgeStatValue}>{earnedBadges.length}</Text>
                  <Text style={styles.badgeStatLabel}>Earned</Text>
                </View>
                <View style={styles.badgeStatDivider} />
                <View style={styles.badgeStatItem}>
                  <Text style={styles.badgeStatValue}>{TRIBE_BADGES.length - earnedBadges.length}</Text>
                  <Text style={styles.badgeStatLabel}>Remaining</Text>
                </View>
                <View style={styles.badgeStatDivider} />
                <View style={styles.badgeStatItem}>
                  <Text style={[styles.badgeStatValue, { color: colors.neon.green }]}>
                    {Math.round((earnedBadges.length / TRIBE_BADGES.length) * 100)}%
                  </Text>
                  <Text style={styles.badgeStatLabel}>Complete</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Leave Tribe */}
        <TouchableOpacity style={styles.leaveTribeButton} onPress={handleLeaveTribe}>
          <Text style={styles.leaveTribeText}>Leave Tribe</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Achievement Toast */}
      <AchievementToast
        visible={toastVisible}
        title={toastTitle}
        description={toastDescription}
        icon="trophy"
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

// ══════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════

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
    width: 40,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing['2xl'],
  },

  // ── Selection View ──
  selectionHero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  selectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  selectionSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Season Banner
  seasonBanner: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  seasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seasonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  seasonTextContainer: {},
  seasonName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.neon.yellow,
  },
  seasonDaysLeft: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  seasonProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  seasonProgressBg: {
    width: 80,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  seasonProgressFill: {
    height: '100%',
    backgroundColor: colors.neon.yellow,
    borderRadius: borderRadius.full,
  },
  seasonProgressText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Selection Cards
  selectionCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  selectionCardGradient: {
    padding: spacing.md,
  },
  selectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  selectionAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  selectionAvatarEmoji: {
    fontSize: 24,
  },
  selectionCardInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  selectionTribeName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },
  selectionMotto: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  selectionRankBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  selectionRankText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  selectionDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  selectionStatsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  selectionStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectionStatValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  selectionStatLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  joinButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: '#000000',
  },

  // ── Member View ──
  tribeHeaderCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    overflow: 'hidden',
  },
  tribeHeaderGradient: {
    padding: spacing.lg,
  },
  tribeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tribeHeaderAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  tribeHeaderEmoji: {
    fontSize: 32,
  },
  tribeHeaderInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  tribeHeaderName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
  },
  tribeHeaderMotto: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  tribeHeaderDesc: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  tribeRankContainer: {
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  tribeRankValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
  },
  tribeRankLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Stats Dashboard
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    width: (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2 - 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Tab Bar
  tabBar: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },
  tabBarContent: {
    flexDirection: 'row',
    padding: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tabItemActive: {
    backgroundColor: colors.background.tertiary,
  },
  tabLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  tabLabelActive: {
    color: colors.text.primary,
  },
  tabContent: {
    paddingHorizontal: spacing.md,
  },

  // Leaderboard
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  leaderboardRowHighlight: {
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  leaderboardRank: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardRankTextSilver: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: '#C0C0C0',
  },
  leaderboardRankTextBronze: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: '#CD7F32',
  },
  leaderboardRankText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.muted,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginLeft: spacing.sm,
  },
  leaderboardEmoji: {
    fontSize: 20,
  },
  leaderboardInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  leaderboardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  leaderboardName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  yourTribeBadge: {
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.3)',
  },
  yourTribeBadgeText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 9,
    color: colors.neon.green,
  },
  leaderboardMembers: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  leaderboardXP: {
    alignItems: 'flex-end',
  },
  leaderboardXPValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  leaderboardXPLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Challenges
  challengeBanner: {
    marginBottom: spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  challengeHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: spacing.sm,
  },
  challengeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeHeaderInfo: {
    flex: 1,
  },
  challengeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  challengeName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  activeBadge: {
    backgroundColor: 'rgba(57, 255, 20, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  activeBadgeText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 9,
    color: colors.neon.green,
    textTransform: 'uppercase',
  },
  challengeDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  challengeTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  challengeTimerText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.neon.yellow,
  },
  rewardInfoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rewardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  rewardInfoText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
  },
  challengeTarget: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Challenge Rows
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  challengeRowHighlight: {
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  challengeRankCol: {
    width: 28,
    alignItems: 'center',
  },
  challengeRankText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  challengeTribeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginLeft: spacing.xs,
  },
  challengeTribeEmoji: {
    fontSize: 16,
  },
  challengeBarSection: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  challengeBarNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  challengeBarName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    flexShrink: 1,
  },
  leadingBadge: {
    backgroundColor: 'rgba(255, 255, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  leadingBadgeText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 9,
    color: colors.neon.yellow,
  },
  challengeBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  challengeBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  challengeBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  challengeBarPercent: {
    fontFamily: typography.fonts.medium,
    fontSize: 10,
    color: colors.text.muted,
    minWidth: 28,
    textAlign: 'right',
  },
  challengeProgressCol: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  challengeProgressValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  challengeProgressTarget: {
    fontFamily: typography.fonts.regular,
    fontSize: 9,
    color: colors.text.muted,
  },

  // My Tribe Challenge Card
  myTribeChallengeCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  myTribeChallengeGradient: {
    padding: spacing.md,
  },
  myTribeChallengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myTribeChallengeInfo: {
    flex: 1,
  },
  myTribeChallengeStatus: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  myTribeChallengeProgress: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  claimRewardButton: {
    backgroundColor: colors.neon.yellow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  claimRewardText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: '#000',
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  claimedBadgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xs,
    color: colors.neon.green,
  },
  winToClaimText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },

  // Activity
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  activityText: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  activityTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: spacing.sm,
  },
  activityTime: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Chat
  chatContainer: {
    paddingHorizontal: spacing.md,
  },
  chatWelcome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  chatWelcomeText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  chatMessagesList: {
    maxHeight: 360,
  },
  chatMessagesListContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  chatLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  chatLoadingText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },
  chatEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  chatEmptyText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  chatMessage: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chatMessageOwn: {
    justifyContent: 'flex-end',
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
  },
  chatBubble: {
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    maxWidth: '75%',
  },
  chatBubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatDisplayName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  chatTimestamp: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.text.muted,
    marginLeft: spacing.sm,
  },
  chatMessageText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    lineHeight: 18,
  },
  chatActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  chatReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chatReplyButtonText: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.text.muted,
  },
  chatThreadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chatThreadText: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.neon.cyan,
  },
  threadedReply: {
    flexDirection: 'row',
    marginLeft: 40,
    marginTop: 4,
  },
  threadLine: {
    width: 2,
    backgroundColor: colors.border.default,
    borderRadius: 1,
    marginRight: spacing.sm,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.neon.cyan,
  },
  replyIndicatorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  replyIndicatorText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    flex: 1,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  chatTextInput: {
    flex: 1,
    height: 42,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  chatSendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.neon.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendButtonDisabled: {
    backgroundColor: colors.background.tertiary,
  },

  // Badges
  badgesSectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  badgesSectionSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginBottom: spacing.lg,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badgeCard: {
    width: (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2 - 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeName: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
  },
  badgeNameLocked: {
    color: colors.text.muted,
  },
  badgeDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  badgeRequirement: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 10,
    color: colors.text.muted,
    textAlign: 'center',
  },
  badgeStatsCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  badgeStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  badgeStatItem: {
    alignItems: 'center',
  },
  badgeStatValue: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
  badgeStatLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  badgeStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border.default,
  },

  // Leave Tribe
  leaveTribeButton: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  leaveTribeText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },

  bottomSpacer: {
    height: 40,
  },

  // ── Premium Locked ──
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
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  lockedDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
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
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: '#000000',
  },
});

export default JungleTribesScreen;
