// About Screen for Wall Street Wildlife Mobile
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { GlassCard, GradientText } from '../../components/ui';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '100';

interface TeamMember {
  name: string;
  role: string;
  emoji: string;
}

const TEAM: TeamMember[] = [
  { name: 'Wall Street Wildlife', role: 'Education Team', emoji: '🦁' },
  { name: 'Jungle Developers', role: 'Engineering', emoji: '🐒' },
  { name: 'Options Experts', role: 'Content Creators', emoji: '🦉' },
  { name: 'Design Tribe', role: 'UI/UX Design', emoji: '🦎' },
];

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Wall Street Wildlife',
      'Enjoying the app? Leave us a review!',
      [
        { text: 'Not Now', style: 'cancel' },
        {
          text: 'Rate App',
          onPress: () => {
            // Would open App Store/Play Store
            Alert.alert('Thank You!', 'Thanks for your support!');
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      const result = await Share.share({
        message: Platform.OS === 'android'
          ? 'Check out Wall Street Wildlife - the best app to learn options trading! Download it here: https://wallstreetwildlife.com/app'
          : 'Check out Wall Street Wildlife - the best app to learn options trading!',
        url: 'https://wallstreetwildlife.com/app',
        title: 'Wall Street Wildlife',
      });

      if (result.action === Share.sharedAction) {
        // Shared successfully
      }
    } catch (error: any) {
      Alert.alert('Error', 'Could not share the app');
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@wallstreetwildlife.com?subject=App Support');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>About</GradientText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo & Info */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={[colors.neon.green, colors.neon.cyan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <Text style={styles.logoEmoji}>🦁</Text>
          </LinearGradient>
          <GradientText style={styles.appName}>Wall Street Wildlife</GradientText>
          <Text style={styles.appTagline}>Master Options Trading in the Jungle</Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version {APP_VERSION}</Text>
            <Text style={styles.buildText}>Build {BUILD_NUMBER}</Text>
          </View>
        </View>

        {/* Mission Statement */}
        <GlassCard style={styles.missionCard}>
          <Text style={styles.missionIcon}>🎯</Text>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            To make options trading education accessible, engaging, and fun for everyone.
            We believe that with the right tools and knowledge, anyone can navigate the
            financial jungle with confidence.
          </Text>
        </GlassCard>

        {/* Stats */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>50+</Text>
            <Text style={styles.statLabel}>Strategies</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>200+</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statValue}>100K+</Text>
            <Text style={styles.statLabel}>Users</Text>
          </GlassCard>
        </View>

        {/* Team */}
        <Text style={styles.sectionTitle}>The Jungle Team</Text>
        <GlassCard style={styles.teamCard} noPadding>
          {TEAM.map((member, index) => (
            <View
              key={member.name}
              style={[
                styles.teamMember,
                index !== TEAM.length - 1 && styles.teamMemberBorder,
              ]}
            >
              <Text style={styles.teamEmoji}>{member.emoji}</Text>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Actions */}
        <Text style={styles.sectionTitle}>Support Us</Text>
        <GlassCard style={styles.actionsCard} noPadding>
          <TouchableOpacity style={[styles.actionRow, styles.actionRowBorder]} onPress={handleRateApp}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionEmoji}>⭐</Text>
              <Text style={styles.actionTitle}>Rate the App</Text>
            </View>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, styles.actionRowBorder]} onPress={handleShareApp}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionEmoji}>📤</Text>
              <Text style={styles.actionTitle}>Share with Friends</Text>
            </View>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleContactSupport}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionEmoji}>💬</Text>
              <Text style={styles.actionTitle}>Contact Support</Text>
            </View>
            <Text style={styles.actionChevron}>→</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Links */}
        <Text style={styles.sectionTitle}>Connect</Text>
        <GlassCard style={styles.linksCard} noPadding>
          <TouchableOpacity
            style={[styles.linkRow, styles.linkRowBorder]}
            onPress={() => handleLink('https://wallstreetwildlife.com')}
          >
            <View style={styles.linkInfo}>
              <Text style={styles.linkEmoji}>🌐</Text>
              <Text style={styles.linkTitle}>Website</Text>
            </View>
            <Text style={styles.linkChevron}>↗</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkRow, styles.linkRowBorder]}
            onPress={() => handleLink('https://twitter.com/wswildlife')}
          >
            <View style={styles.linkInfo}>
              <Text style={styles.linkEmoji}>🐦</Text>
              <Text style={styles.linkTitle}>Twitter / X</Text>
            </View>
            <Text style={styles.linkChevron}>↗</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkRow, styles.linkRowBorder]}
            onPress={() => handleLink('https://discord.gg/wswildlife')}
          >
            <View style={styles.linkInfo}>
              <Text style={styles.linkEmoji}>💬</Text>
              <Text style={styles.linkTitle}>Discord Community</Text>
            </View>
            <Text style={styles.linkChevron}>↗</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleLink('https://youtube.com/@wswildlife')}
          >
            <View style={styles.linkInfo}>
              <Text style={styles.linkEmoji}>📺</Text>
              <Text style={styles.linkTitle}>YouTube</Text>
            </View>
            <Text style={styles.linkChevron}>↗</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Legal */}
        <View style={styles.legalSection}>
          <TouchableOpacity onPress={() => handleLink('https://wallstreetwildlife.com/privacy')}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.legalDivider}>•</Text>
          <TouchableOpacity onPress={() => handleLink('https://wallstreetwildlife.com/terms')}>
            <Text style={styles.legalLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Wall Street Wildlife is for educational purposes only. Options trading involves
            significant risk and is not suitable for all investors. Past performance does not
            guarantee future results. Please consult a financial advisor before making
            investment decisions.
          </Text>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>
          © 2025 Wall Street Wildlife. All rights reserved.
        </Text>
        <Text style={styles.madeWith}>
          Made with 💚 for the trading community
        </Text>
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },
  headerTitle: {
    ...typography.styles.h4,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.neonGreen,
  },
  logoEmoji: {
    fontSize: 56,
  },
  appName: {
    ...typography.styles.h2,
    marginBottom: spacing.xs,
  },
  appTagline: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  versionText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  buildText: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  missionCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  missionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  missionTitle: {
    ...typography.styles.h5,
    color: colors.neon.green,
    marginBottom: spacing.sm,
  },
  missionText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: {
    ...typography.styles.h3,
    color: colors.neon.cyan,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  teamCard: {
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  teamMemberBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  teamEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: 2,
  },
  teamRole: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  actionsCard: {
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  actionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionTitle: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  actionChevron: {
    fontSize: 18,
    color: colors.text.muted,
  },
  linksCard: {
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  linkRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  linkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  linkTitle: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  linkChevron: {
    fontSize: 18,
    color: colors.neon.cyan,
  },
  legalSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  legalLink: {
    ...typography.styles.bodySm,
    color: colors.neon.cyan,
  },
  legalDivider: {
    color: colors.text.muted,
    marginHorizontal: spacing.md,
  },
  disclaimer: {
    padding: spacing.md,
    backgroundColor: colors.overlay.light,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  disclaimerTitle: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  disclaimerText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    lineHeight: 18,
  },
  copyright: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  madeWith: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
});

export default AboutScreen;
