// Push notification service for Wall Street Wildlife Mobile
// Handles registration, permissions, and scheduled notifications
// for streaks, missions, level-ups, and earnings alerts

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lazy imports to avoid crashes if expo-notifications isn't linked
let Notifications: typeof import('expo-notifications') | null = null;
let Device: typeof import('expo-device') | null = null;

const loadModules = async () => {
  if (!Notifications) {
    try {
      Notifications = await import('expo-notifications');
      Device = await import('expo-device');
    } catch {
      console.warn('[Notifications] expo-notifications not available');
    }
  }
};

const PUSH_TOKEN_KEY = 'wsw-push-token';
const NOTIFICATION_PREFS_KEY = 'wsw-notification-prefs';

export interface NotificationPreferences {
  streakReminders: boolean;
  missionAlerts: boolean;
  levelUpAlerts: boolean;
  earningsAlerts: boolean;
  socialAlerts: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  streakReminders: true,
  missionAlerts: true,
  levelUpAlerts: true,
  earningsAlerts: true,
  socialAlerts: true,
};

// Register for push notifications and return the token
export async function registerForPushNotifications(): Promise<string | null> {
  await loadModules();
  if (!Notifications || !Device) return null;

  // Must be a physical device
  if (!Device.isDevice) {
    console.warn('[Notifications] Push notifications require a physical device');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[Notifications] Permission not granted');
    return null;
  }

  // Get the Expo push token
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'wsw-options-mobile',
    });
    const token = tokenData.data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.error('[Notifications] Failed to get push token:', error);
    return null;
  }
}

// Configure notification channels (Android)
export async function configureNotificationChannels(): Promise<void> {
  await loadModules();
  if (!Notifications) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('streaks', {
      name: 'Streak Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#39ff14',
    });

    await Notifications.setNotificationChannelAsync('missions', {
      name: 'Daily Missions',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync('levelups', {
      name: 'Level Ups & Badges',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#fbbf24',
    });

    await Notifications.setNotificationChannelAsync('earnings', {
      name: 'Earnings Alerts',
      importance: Notifications.AndroidImportance.HIGH,
    });

    await Notifications.setNotificationChannelAsync('social', {
      name: 'Social Activity',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

// Schedule a streak reminder notification
export async function scheduleStreakReminder(): Promise<void> {
  await loadModules();
  if (!Notifications) return;

  const prefs = await getNotificationPreferences();
  if (!prefs.streakReminders) return;

  // Cancel existing streak reminders first
  await cancelStreakReminder();

  // Schedule daily at 8 PM local time
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Keep Your Streak Alive! 🔥',
      body: "Don't break your learning streak — complete today's lesson before midnight!",
      data: { type: 'streak_reminder' },
      ...(Platform.OS === 'android' && { channelId: 'streaks' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

// Cancel streak reminders
export async function cancelStreakReminder(): Promise<void> {
  await loadModules();
  if (!Notifications) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.data?.type === 'streak_reminder') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

// Send an immediate local notification (for level-ups, badge earned, etc.)
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
  channelId?: string,
): Promise<void> {
  await loadModules();
  if (!Notifications) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      ...(Platform.OS === 'android' && channelId && { channelId }),
    },
    trigger: null, // Immediate
  });
}

// Convenience methods for common notifications
export async function notifyLevelUp(level: number, levelName: string): Promise<void> {
  const prefs = await getNotificationPreferences();
  if (!prefs.levelUpAlerts) return;

  await sendLocalNotification(
    `Level ${level} Reached!`,
    `You're now a ${levelName}. Keep climbing the jungle ranks!`,
    { type: 'level_up', level },
    'levelups',
  );
}

export async function notifyBadgeEarned(badgeName: string): Promise<void> {
  const prefs = await getNotificationPreferences();
  if (!prefs.levelUpAlerts) return;

  await sendLocalNotification(
    'New Badge Earned!',
    `You've earned the "${badgeName}" badge. Check your profile to see it!`,
    { type: 'badge_earned', badge: badgeName },
    'levelups',
  );
}

export async function notifyEarningsAlert(ticker: string, date: string): Promise<void> {
  const prefs = await getNotificationPreferences();
  if (!prefs.earningsAlerts) return;

  await sendLocalNotification(
    `Earnings Alert: ${ticker}`,
    `${ticker} reports earnings on ${date}. Review your positions!`,
    { type: 'earnings_alert', ticker, date },
    'earnings',
  );
}

// Notification preferences
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return DEFAULT_PREFS;
}

export async function setNotificationPreferences(
  prefs: Partial<NotificationPreferences>,
): Promise<void> {
  const current = await getNotificationPreferences();
  const updated = { ...current, ...prefs };
  await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(updated));

  // Update streak reminder based on preference
  if (prefs.streakReminders === false) {
    await cancelStreakReminder();
  } else if (prefs.streakReminders === true) {
    await scheduleStreakReminder();
  }
}

// Add notification response listener (for handling taps on notifications)
export function addNotificationResponseListener(
  handler: (response: { notification: { request: { content: { data: Record<string, unknown> } } } }) => void,
): { remove: () => void } | null {
  if (!Notifications) return null;

  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      handler({
        notification: {
          request: {
            content: {
              data: response.notification.request.content.data as Record<string, unknown>,
            },
          },
        },
      });
    },
  );

  return subscription;
}
