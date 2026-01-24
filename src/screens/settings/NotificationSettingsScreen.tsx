// Notification Settings Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { GlassCard, GradientText } from '../../components/ui';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  emoji: string;
  settings: NotificationSetting[];
}

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'learning',
      title: 'Learning & Progress',
      emoji: '📚',
      settings: [
        { id: 'daily-reminder', title: 'Daily Learning Reminder', description: 'Get reminded to practice each day', enabled: true },
        { id: 'streak-alert', title: 'Streak Alert', description: 'Warning when streak is about to break', enabled: true },
        { id: 'level-up', title: 'Level Up Notifications', description: 'Celebrate when you reach new levels', enabled: true },
        { id: 'badge-earned', title: 'Badge Earned', description: 'Notification when you earn badges', enabled: true },
      ],
    },
    {
      id: 'market',
      title: 'Market & Trading',
      emoji: '📈',
      settings: [
        { id: 'market-open', title: 'Market Open/Close', description: 'Alerts for market hours', enabled: false },
        { id: 'earnings', title: 'Earnings Alerts', description: 'Upcoming earnings for watchlist', enabled: true },
        { id: 'iv-spike', title: 'IV Spike Alerts', description: 'When volatility increases significantly', enabled: false },
        { id: 'price-target', title: 'Price Target Alerts', description: 'When stocks hit your targets', enabled: true },
      ],
    },
    {
      id: 'social',
      title: 'Social & Community',
      emoji: '🦁',
      settings: [
        { id: 'tribe-activity', title: 'Tribe Activity', description: 'Updates from your jungle tribe', enabled: true },
        { id: 'leaderboard', title: 'Leaderboard Changes', description: 'When your rank changes', enabled: false },
        { id: 'missions', title: 'Daily Missions', description: 'New missions available', enabled: true },
      ],
    },
    {
      id: 'account',
      title: 'Account & Updates',
      emoji: '⚙️',
      settings: [
        { id: 'app-updates', title: 'App Updates', description: 'New features and improvements', enabled: true },
        { id: 'subscription', title: 'Subscription', description: 'Billing and renewal reminders', enabled: true },
        { id: 'tips', title: 'Trading Tips', description: 'Weekly tips and insights', enabled: false },
      ],
    },
  ]);

  const [masterPush, setMasterPush] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  const toggleSetting = (categoryId: string, settingId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              settings: cat.settings.map(setting =>
                setting.id === settingId
                  ? { ...setting, enabled: !setting.enabled }
                  : setting
              ),
            }
          : cat
      )
    );
  };

  const enableAll = () => {
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        settings: cat.settings.map(setting => ({ ...setting, enabled: true })),
      }))
    );
  };

  const disableAll = () => {
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        settings: cat.settings.map(setting => ({ ...setting, enabled: false })),
      }))
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <GradientText style={styles.headerTitle}>Notifications</GradientText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Toggle */}
        <GlassCard style={styles.masterCard}>
          <View style={styles.masterRow}>
            <View style={styles.masterInfo}>
              <Text style={styles.masterTitle}>Push Notifications</Text>
              <Text style={styles.masterDescription}>
                {masterPush ? 'All notifications enabled' : 'All notifications disabled'}
              </Text>
            </View>
            <Switch
              value={masterPush}
              onValueChange={setMasterPush}
              trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
              thumbColor={colors.text.primary}
              ios_backgroundColor={colors.background.tertiary}
            />
          </View>
        </GlassCard>

        {masterPush && (
          <>
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickButton} onPress={enableAll}>
                <Text style={styles.quickButtonText}>Enable All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickButton} onPress={disableAll}>
                <Text style={styles.quickButtonText}>Disable All</Text>
              </TouchableOpacity>
            </View>

            {/* Quiet Hours */}
            <GlassCard style={styles.quietHoursCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingEmoji}>🌙</Text>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Quiet Hours</Text>
                    <Text style={styles.settingDescription}>No notifications 10pm - 8am</Text>
                  </View>
                </View>
                <Switch
                  value={quietHours}
                  onValueChange={setQuietHours}
                  trackColor={{ false: colors.background.tertiary, true: colors.neon.cyan }}
                  thumbColor={colors.text.primary}
                  ios_backgroundColor={colors.background.tertiary}
                />
              </View>
            </GlassCard>

            {/* Categories */}
            {categories.map((category) => (
              <View key={category.id} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                </View>

                <GlassCard style={styles.categoryCard} noPadding>
                  {category.settings.map((setting, index) => (
                    <View
                      key={setting.id}
                      style={[
                        styles.settingRow,
                        styles.settingRowPadded,
                        index !== category.settings.length - 1 && styles.settingRowBorder,
                      ]}
                    >
                      <View style={styles.settingInfo}>
                        <View style={styles.settingText}>
                          <Text style={styles.settingTitle}>{setting.title}</Text>
                          <Text style={styles.settingDescription}>{setting.description}</Text>
                        </View>
                      </View>
                      <Switch
                        value={setting.enabled}
                        onValueChange={() => toggleSetting(category.id, setting.id)}
                        trackColor={{ false: colors.background.tertiary, true: colors.neon.green }}
                        thumbColor={colors.text.primary}
                        ios_backgroundColor={colors.background.tertiary}
                      />
                    </View>
                  ))}
                </GlassCard>
              </View>
            ))}

            {/* Info Note */}
            <View style={styles.infoNote}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoText}>
                You can also manage notifications in your device settings.
              </Text>
            </View>
          </>
        )}
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
  masterCard: {
    marginBottom: spacing.md,
  },
  masterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  masterInfo: {
    flex: 1,
  },
  masterTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  masterDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  quickButtonText: {
    ...typography.styles.label,
    color: colors.neon.green,
  },
  quietHoursCard: {
    marginBottom: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  categoryTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  categoryCard: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingRowPadded: {
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
  settingEmoji: {
    fontSize: 24,
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
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.overlay.neonCyan,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neon.cyan,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  infoText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    flex: 1,
  },
});

export default NotificationSettingsScreen;
