// Profile Main Screen for Wall Street Wildlife Mobile
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { useAuth } from '../../contexts';
import { getLevelFromXP, MASCOTS } from '../../data/constants';
import { GlassCard, GlowButton, GradientText, StatCard } from '../../components/ui';
import { ProfileStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const ProfileMainScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();

  const progress = user?.progress || {
    xp: 450,
    streak: 5,
    level: 3,
    badges: [],
    completedStrategies: [],
    completedQuizzes: [],
  };

  const levelInfo = getLevelFromXP(progress.xp);
  const mascot = MASCOTS.find(m => m.id === (user?.avatarAnimal || 'monkey'));

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              // Handle error
            }
          },
        },
      ],
    );
  };

  const handleMenuPress = (id: string) => {
    switch (id) {
      case 'academy':
        navigation.navigate('JungleAcademy');
        break;
      case 'leaderboard':
        navigation.navigate('Leaderboard');
        break;
      case 'badges':
        navigation.navigate('Badges');
        break;
      case 'tribes':
        navigation.navigate('JungleTribes');
        break;
      case 'missions':
        navigation.navigate('DailyMissions');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available soon.');
    }
  };

  const handleSettingsPress = (id: string) => {
    switch (id) {
      case 'subscription':
        navigation.navigate('Subscription');
        break;
      case 'notifications':
        navigation.navigate('NotificationSettings');
        break;
      case 'appearance':
        navigation.navigate('AppearanceSettings');
        break;
      case 'privacy':
        navigation.navigate('PrivacySettings');
        break;
      case 'about':
        navigation.navigate('About');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available soon.');
    }
  };

  const menuItems = [
    { id: 'academy', title: 'Jungle Academy', emoji: '', subtitle: 'XP, badges & missions' },
    { id: 'leaderboard', title: 'Leaderboard', emoji: '', subtitle: 'See top traders' },
    { id: 'badges', title: 'Badge Collection', emoji: '', subtitle: `${progress.badges.length} badges earned` },
    { id: 'tribes', title: 'Jungle Tribes', emoji: '', subtitle: 'Join a community' },
  ];

  const settingsItems = [
    { id: 'subscription', title: 'Subscription', emoji: '', subtitle: user?.subscriptionTier || 'Free' },
    { id: 'notifications', title: 'Notifications', emoji: '', subtitle: 'Manage alerts' },
    { id: 'appearance', title: 'Appearance', emoji: '', subtitle: 'Dark mode' },
    { id: 'privacy', title: 'Privacy & Data', emoji: '', subtitle: 'Manage your data' },
    { id: 'about', title: 'About', emoji: '', subtitle: 'Version 1.0.0' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <GlassCard style={styles.profileCard}>
          <View style={[styles.avatarContainer, shadows.neonGreenSubtle]}>
            <Text style={styles.avatarEmoji}>
              {mascot?.id === 'monkey' ? '' :
               mascot?.id === 'owl' ? '' :
               mascot?.id === 'bull' ? '' :
               mascot?.id === 'bear' ? '' : ''}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <GradientText style={styles.displayName}>
              {user?.displayName || 'Trader'}
            </GradientText>
            <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            label="Level"
            value={levelInfo.level}
            valueColor={colors.neon.green}
            withGlow
            compact
            style={styles.statCard}
          />
          <StatCard
            label="XP"
            value={progress.xp}
            valueColor={colors.neon.cyan}
            withGlow
            compact
            style={styles.statCard}
          />
          <StatCard
            label="Streak"
            value={`${progress.streak}`}
            valueColor={colors.neon.yellow}
            withGlow
            compact
            style={styles.statCard}
          />
        </View>

        {/* Level Progress */}
        <GlassCard style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>{levelInfo.title}</Text>
            <Text style={styles.levelProgress}>
              {Math.round(levelInfo.progress * 100)}% to Level {levelInfo.level + 1}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${levelInfo.progress * 100}%` },
              ]}
            />
          </View>
        </GlassCard>

        {/* Academy Menu */}
        <Text style={styles.sectionTitle}>Jungle Academy</Text>
        <GlassCard style={styles.menuSection} noPadding>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => handleMenuPress(item.id)}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuChevron}></Text>
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* Settings Menu */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <GlassCard style={styles.menuSection} noPadding>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === settingsItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => handleSettingsPress(item.id)}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuChevron}></Text>
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* Sign Out */}
        <GlowButton
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          fullWidth
          style={styles.signOutButton}
        />

        {/* Version */}
        <Text style={styles.version}>Wall Street Wildlife v1.0.0</Text>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.md,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neon.yellow,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  displayName: {
    ...typography.styles.h5,
  },
  email: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  editButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  editButtonText: {
    ...typography.styles.label,
    color: colors.neon.green,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  levelCard: {
    marginBottom: spacing.lg,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelTitle: {
    ...typography.styles.label,
    color: colors.neon.green,
    textShadowColor: colors.neon.green,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  levelProgress: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.neon.green,
    borderRadius: borderRadius.full,
    ...shadows.neonGreenSubtle,
  },
  sectionTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  menuSection: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuEmoji: {
    fontSize: 24,
    width: 36,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  menuSubtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  menuChevron: {
    fontSize: 16,
    color: colors.text.muted,
  },
  signOutButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderColor: colors.error,
  },
  version: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
});

export default ProfileMainScreen;
