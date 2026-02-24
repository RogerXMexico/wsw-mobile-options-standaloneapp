// Privacy Settings Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard, GradientText, GlowButton } from '../../components/ui';

const PrivacySettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  // Privacy settings state
  const [analytics, setAnalytics] = useState(true);
  const [crashReports, setCrashReports] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [shareProgress, setShareProgress] = useState(true);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [tribeVisibility, setTribeVisibility] = useState(true);

  const handleExportData = () => {
    Alert.alert(
      'Export Your Data',
      'We will prepare your data export and send it to your registered email address within 48 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Export',
          onPress: () => {
            Alert.alert('Request Submitted', 'You will receive an email with your data export.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data, progress, and achievements will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Type "DELETE" to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. You may need to re-download some content.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Cache Cleared', 'All cached data has been removed.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>Privacy & Data</GradientText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Data Collection Section */}
        <Text style={styles.sectionTitle}>Data Collection</Text>
        <GlassCard style={styles.settingsCard} noPadding>
          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Ionicons name="bar-chart-outline" size={24} color={colors.neon.cyan} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Analytics</Text>
                <Text style={styles.settingDescription}>
                  Help us improve with anonymous usage data
                </Text>
              </View>
            </View>
            <Switch
              value={analytics}
              onValueChange={setAnalytics}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Ionicons name="bug-outline" size={24} color={colors.neon.yellow} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Crash Reports</Text>
                <Text style={styles.settingDescription}>
                  Send crash data to help fix bugs
                </Text>
              </View>
            </View>
            <Switch
              value={crashReports}
              onValueChange={setCrashReports}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="compass-outline" size={24} color={colors.neon.purple} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Personalized Content</Text>
                <Text style={styles.settingDescription}>
                  Tailor recommendations to your learning style
                </Text>
              </View>
            </View>
            <Switch
              value={personalizedAds}
              onValueChange={setPersonalizedAds}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>
        </GlassCard>

        {/* Profile Visibility Section */}
        <Text style={styles.sectionTitle}>Profile Visibility</Text>
        <GlassCard style={styles.settingsCard} noPadding>
          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Ionicons name="trending-up-outline" size={24} color={colors.neon.green} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Share Progress</Text>
                <Text style={styles.settingDescription}>
                  Let tribe members see your learning progress
                </Text>
              </View>
            </View>
            <Switch
              value={shareProgress}
              onValueChange={setShareProgress}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Ionicons name="trophy-outline" size={24} color={colors.neon.yellow} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Show on Leaderboard</Text>
                <Text style={styles.settingDescription}>
                  Appear in public rankings
                </Text>
              </View>
            </View>
            <Switch
              value={showOnLeaderboard}
              onValueChange={setShowOnLeaderboard}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="people-outline" size={24} color={colors.neon.orange} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Tribe Visibility</Text>
                <Text style={styles.settingDescription}>
                  Let others find you by tribe membership
                </Text>
              </View>
            </View>
            <Switch
              value={tribeVisibility}
              onValueChange={setTribeVisibility}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>
        </GlassCard>

        {/* Data Management Section */}
        <Text style={styles.sectionTitle}>Data Management</Text>
        <GlassCard style={styles.settingsCard} noPadding>
          <TouchableOpacity style={[styles.actionRow, styles.settingRowBorder]} onPress={handleClearCache}>
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={24} color={colors.text.secondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Clear Cache</Text>
                <Text style={styles.settingDescription}>
                  Free up storage space
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, styles.settingRowBorder]} onPress={handleExportData}>
            <View style={styles.settingInfo}>
              <Ionicons name="download-outline" size={24} color={colors.neon.cyan} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Export My Data</Text>
                <Text style={styles.settingDescription}>
                  Download a copy of your data
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleDeleteAccount}>
            <View style={styles.settingInfo}>
              <Ionicons name="warning-outline" size={24} color={colors.error} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, styles.dangerText]}>Delete Account</Text>
                <Text style={styles.settingDescription}>
                  Permanently remove all data
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.error} />
          </TouchableOpacity>
        </GlassCard>

        {/* Legal Links */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <GlassCard style={styles.settingsCard} noPadding>
          <TouchableOpacity style={[styles.actionRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={24} color={colors.text.secondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Ionicons name="clipboard-outline" size={24} color={colors.text.secondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Terms of Service</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.text.secondary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Cookie Policy</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        </GlassCard>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="lock-closed" size={16} color={colors.neon.green} style={{ marginRight: spacing.sm }} />
          <Text style={styles.infoText}>
            Your data is encrypted and stored securely. We never sell your personal information to third parties.
          </Text>
        </View>
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
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  settingsCard: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.styles.body,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  dangerText: {
    color: colors.error,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.overlay.neonGreen,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neon.green,
    marginTop: spacing.lg,
  },
  infoText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
});

export default PrivacySettingsScreen;
