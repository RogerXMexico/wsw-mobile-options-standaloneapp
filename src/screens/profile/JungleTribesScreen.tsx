// Jungle Tribes Screen
// Community groups for social competition with tribe chat

import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard, GlowButton, PremiumModal } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';
import { getRankedTribes, JungleTribe } from '../../data/jungleTribes';
import { useTribeChat, TribeChatMessage } from '../../hooks';
import { useSubscription } from '../../hooks/useSubscription';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

// Mock user's current tribe (null = not joined)
const userTribeId: string | null = null;

// Format a relative timestamp from an ISO date string
const getRelativeTime = (isoDate: string): string => {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(isoDate).toLocaleDateString();
};

const JungleTribesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState<JungleTribe | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<ScrollView>(null);

  const rankedTribes = getRankedTribes();
  const userTribe = userTribeId ? rankedTribes.find(t => t.id === userTribeId) : null;

  // Chat hook - activated when a tribe is selected
  const { messages, loading: chatLoading, sendMessage, refresh: refreshChat } = useTribeChat(
    selectedTribe?.id || null
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && chatScrollRef.current) {
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

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

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput.trim());
    setChatInput('');
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

  const renderChatMessage = (msg: TribeChatMessage) => (
    <View
      key={msg.id}
      style={[
        styles.chatMessage,
        msg.isOwn && styles.chatMessageOwn,
      ]}
    >
      <View style={styles.chatMessageHeader}>
        <Text
          style={[
            styles.chatDisplayName,
            msg.isOwn && styles.chatDisplayNameOwn,
          ]}
          numberOfLines={1}
        >
          {msg.display_name}
        </Text>
        <Text style={styles.chatTimestamp}>
          {getRelativeTime(msg.created_at)}
        </Text>
      </View>
      <Text style={styles.chatMessageText}>{msg.message_text}</Text>
    </View>
  );

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{'<'} Back</Text>
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
          <Text style={styles.heroEmoji}>{'\u{1F3D5}'}</Text>
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
            <Text style={styles.noTribeEmoji}>{'\u{1F50D}'}</Text>
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
              <Text style={styles.rewardItem}>{'\u{1F3C6}'} Tribe Champion badge</Text>
              <Text style={styles.rewardItem}>{'\u{2B50}'} +500 bonus XP</Text>
              <Text style={styles.rewardItem}>{'\u{1F5BC}'} Exclusive avatar frame</Text>
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
                    {tribe.rank === 1 ? '\u{1F947}' : tribe.rank === 2 ? '\u{1F948}' : tribe.rank === 3 ? '\u{1F949}' : `#${tribe.rank}`}
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

      {/* Tribe Detail Modal with Chat */}
      {selectedTribe && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedTribe(null)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboardView}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={styles.modalContent}
            >
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
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

                  {/* Tribe Chat Section */}
                  <View style={styles.chatSection}>
                    <View style={styles.chatSectionHeader}>
                      <Ionicons name="chatbubbles-outline" size={18} color={colors.neon.cyan} />
                      <Text style={styles.chatSectionTitle}>Tribe Chat</Text>
                      <TouchableOpacity onPress={refreshChat} style={styles.chatRefreshButton}>
                        <Ionicons name="refresh-outline" size={16} color={colors.text.muted} />
                      </TouchableOpacity>
                    </View>

                    {/* Chat Messages */}
                    <View style={styles.chatMessagesContainer}>
                      {chatLoading ? (
                        <View style={styles.chatLoadingContainer}>
                          <ActivityIndicator size="small" color={colors.neon.cyan} />
                          <Text style={styles.chatLoadingText}>Loading messages...</Text>
                        </View>
                      ) : messages.length === 0 ? (
                        <View style={styles.chatEmptyContainer}>
                          <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.text.muted} />
                          <Text style={styles.chatEmptyText}>No messages yet. Start the conversation!</Text>
                        </View>
                      ) : (
                        <ScrollView
                          ref={chatScrollRef}
                          style={styles.chatMessagesList}
                          contentContainerStyle={styles.chatMessagesListContent}
                          showsVerticalScrollIndicator={false}
                          nestedScrollEnabled
                        >
                          {messages.map(renderChatMessage)}
                        </ScrollView>
                      )}
                    </View>

                    {/* Chat Input */}
                    <View style={styles.chatInputContainer}>
                      <TextInput
                        style={styles.chatTextInput}
                        placeholder="Say something to the tribe..."
                        placeholderTextColor={colors.text.muted}
                        value={chatInput}
                        onChangeText={setChatInput}
                        multiline={false}
                        returnKeyType="send"
                        onSubmitEditing={handleSendMessage}
                      />
                      <TouchableOpacity
                        style={[
                          styles.chatSendButton,
                          !chatInput.trim() && styles.chatSendButtonDisabled,
                        ]}
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
                  </View>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedTribe(null)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </ScrollView>
            </TouchableOpacity>
          </KeyboardAvoidingView>
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
  modalKeyboardView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    flexGrow: 1,
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

  // Chat section styles
  chatSection: {
    width: '100%',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glass.border,
    paddingTop: spacing.md,
  },
  chatSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  chatSectionTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
    color: colors.neon.cyan,
    marginLeft: spacing.xs,
    flex: 1,
  },
  chatRefreshButton: {
    padding: spacing.xs,
  },
  chatMessagesContainer: {
    width: '100%',
    minHeight: 120,
    maxHeight: 200,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  chatLoadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  chatLoadingText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },
  chatEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  chatEmptyText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  chatMessagesList: {
    flex: 1,
  },
  chatMessagesListContent: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  chatMessage: {
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.text.muted,
  },
  chatMessageOwn: {
    borderLeftColor: colors.neon.green,
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
  },
  chatMessageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatDisplayName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    flex: 1,
  },
  chatDisplayNameOwn: {
    color: colors.neon.green,
  },
  chatTimestamp: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginLeft: spacing.sm,
  },
  chatMessageText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    lineHeight: 18,
  },

  // Chat input styles
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  chatTextInput: {
    flex: 1,
    height: 40,
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
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neon.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendButtonDisabled: {
    backgroundColor: colors.background.tertiary,
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
