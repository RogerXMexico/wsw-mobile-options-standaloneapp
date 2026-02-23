// Notification Scheduler for Wall Street Wildlife Mobile
// Intelligent notification scheduling with animal mascot personalities,
// streak reminders, earnings alerts, and IV rank threshold alerts.
// Uses expo-notifications for all scheduling.

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lazy import to avoid crashes if expo-notifications isn't linked
let Notifications: typeof import('expo-notifications') | null = null;

const loadNotifications = async () => {
  if (!Notifications) {
    try {
      Notifications = await import('expo-notifications');
    } catch {
      console.warn('[NotificationScheduler] expo-notifications not available');
    }
  }
};

// ── Storage Keys ─────────────────────────────────────────────────────────

const LAST_ACTIVITY_KEY = 'wsw-last-activity-date';
const SCHEDULED_EARNINGS_KEY = 'wsw-scheduled-earnings';

// ── Animal Mascot Messages ───────────────────────────────────────────────

type NotificationType = 'streak' | 'earnings' | 'iv';

interface AnimalMessages {
  streak: string[];
  earnings: string[];
  iv: string[];
}

const ANIMAL_MESSAGES: Record<string, AnimalMessages> = {
  turtle: {
    streak: [
      'Slow and steady, remember? Your {streak}-day streak took patience to build. Don\'t let it slip!',
      'Terry here. One lesson a day keeps the losses away. Your streak is counting on you!',
      'A {streak}-day streak is a shell worth protecting. Come back and keep building.',
      'The market rewards consistency, not speed. Don\'t break your {streak}-day run!',
    ],
    earnings: [
      'Heads up — {ticker} reports earnings on {date}. Time to check your protective puts.',
      'Terry says: {ticker} earnings are coming ({date}). Conservative traders prepare early.',
      '{ticker} earnings on {date}. Make sure your downside is protected before the announcement.',
    ],
    iv: [
      '{ticker} IV Rank hit {ivRank}%. {direction} — even turtles notice when premiums get interesting.',
      'Terry spotted something: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} volatility is moving ({ivRank}% IV Rank). {direction}',
    ],
  },
  owl: {
    streak: [
      'Knowledge compounds daily. Your {streak}-day streak is building real analytical edge. Don\'t stop now!',
      'Oliver here. A {streak}-day streak means {streak} days of compounding wisdom. Keep studying!',
      'The data is clear: consistent learners outperform. Protect your {streak}-day streak!',
      'Your {streak}-day streak represents serious intellectual capital. Don\'t let it depreciate.',
    ],
    earnings: [
      'Oliver\'s analysis: {ticker} reports on {date}. Review the implied move vs. historical volatility.',
      '{ticker} earnings on {date}. Study the expected move and position your Greeks accordingly.',
      'Data point: {ticker} earnings {date}. Compare IV percentile to previous cycles before trading.',
    ],
    iv: [
      'Oliver\'s volatility scan: {ticker} IV Rank at {ivRank}%. {direction}',
      'Analytical insight: {ticker} reached {ivRank}% IV Rank. {direction}',
      '{ticker} volatility data point — {ivRank}% IV Rank. {direction}',
    ],
  },
  cheetah: {
    streak: [
      'Speed kills, but so does quitting. Your {streak}-day streak proves you\'re committed. Keep it alive!',
      'Chase here. {streak} days running — don\'t slow down now! Get your lesson in!',
      'A {streak}-day streak is momentum. Momentum is everything. Don\'t lose it!',
      'Quick — your {streak}-day streak expires at midnight. You\'re faster than that!',
    ],
    earnings: [
      'Heads up! {ticker} earnings on {date}. This could be a fast-moving opportunity — be ready!',
      'Chase spotted: {ticker} reports {date}. Pre-earnings momentum plays are in play.',
      '{ticker} earnings dropping {date}. Prepare your 0DTE game plan for the move.',
    ],
    iv: [
      'Move fast! {ticker} IV Rank hit {ivRank}%. {direction}',
      'Chase alert: {ticker} at {ivRank}% IV Rank. {direction} Strike while the iron is hot!',
      '{ticker} volatility spike — {ivRank}% IV Rank. {direction}',
    ],
  },
  fox: {
    streak: [
      'There\'s always an angle — and right now the angle is protecting your {streak}-day streak!',
      'Fiona here. Clever traders are consistent traders. Your {streak}-day streak proves you\'re clever.',
      'A {streak}-day streak is strategic capital. Every day you skip, your edge erodes.',
      'The cunning play? Maintain your {streak}-day streak. Small daily gains compound into mastery.',
    ],
    earnings: [
      'Fiona\'s intel: {ticker} earnings on {date}. What\'s your angle? Straddle? Iron condor?',
      '{ticker} reports {date}. Smart money positions before the crowd. What\'s your play?',
      'Earnings alert: {ticker} on {date}. Fiona sees opportunity in the implied volatility skew.',
    ],
    iv: [
      'Fiona spotted an angle: {ticker} IV Rank at {ivRank}%. {direction}',
      'Strategic alert: {ticker} hit {ivRank}% IV Rank. {direction} There\'s always an angle.',
      '{ticker} IV Rank at {ivRank}%. {direction} Fiona sees opportunity here.',
    ],
  },
  sloth: {
    streak: [
      'Hey... no rush, but your {streak}-day streak would hate to end. Just one quick lesson?',
      'Stanley here. Theta decays, and so do streaks. Your {streak}-day run needs some love.',
      'Why rush? But also... why stop? Your {streak}-day streak is working while you nap.',
      'One lesson. Five minutes. Your {streak}-day streak survives. Then back to relaxing.',
    ],
    earnings: [
      'Stanley yawns: {ticker} earnings on {date}. Might want to check your positions... eventually.',
      '{ticker} reports {date}. Sell some premium around it and go back to sleep.',
      'Earnings: {ticker} on {date}. Let theta do the work, but maybe adjust your strikes first.',
    ],
    iv: [
      'Stanley noticed {ticker} IV Rank at {ivRank}%. {direction} Even sloths pay attention to this.',
      '{ticker} at {ivRank}% IV Rank. {direction} Worth a lazy look.',
      'Zzzz... huh? {ticker} IV Rank hit {ivRank}%. {direction}',
    ],
  },
  retriever: {
    streak: [
      'Your {streak}-day streak is amazing! Don\'t stop now — every lesson makes you a better trader!',
      'Goldie here! {streak} days in a row! You\'re doing SO well! Come back for more!',
      'Woof! Your {streak}-day streak is at risk! But it\'s okay — mistakes are lessons too! Just come back!',
      '{streak} days of learning! You\'re the best trader in the park! Keep fetching knowledge!',
    ],
    earnings: [
      'Goldie found something! {ticker} earnings on {date}! Time to review your playbook!',
      '{ticker} reports {date}! Every earnings season is a chance to learn! Let\'s prepare!',
      'Woof! {ticker} earnings coming {date}! Don\'t worry, we\'ll figure it out together!',
    ],
    iv: [
      'Goldie spotted it! {ticker} IV Rank at {ivRank}%! {direction}',
      '{ticker} at {ivRank}% IV Rank! {direction} Let\'s learn from this!',
      'Look! {ticker} IV Rank hit {ivRank}%! {direction}',
    ],
  },
  badger: {
    streak: [
      'Luke here. Your {streak}-day streak shows real digging power. Don\'t stop excavating knowledge.',
      'A {streak}-day streak means you\'ve dug deep. Keep tunneling — the best insights are underground.',
      'Your {streak}-day streak is a tunnel to mastery. Don\'t collapse it by skipping today.',
      '{streak} days of digging into options. That\'s how badgers build fortified portfolios.',
    ],
    earnings: [
      'Luke dug this up: {ticker} earnings on {date}. Time to dig into the options chain.',
      '{ticker} reports {date}. Let\'s dig into the expected move and position sizing.',
      'Earnings intel: {ticker} on {date}. Dig into historical IV crush data before trading.',
    ],
    iv: [
      'Luke uncovered: {ticker} IV Rank at {ivRank}%. {direction}',
      'Digging deeper: {ticker} hit {ivRank}% IV Rank. {direction}',
      '{ticker} IV at {ivRank}%. {direction} Luke says dig into the details.',
    ],
  },
  monkey: {
    streak: [
      'Ooh ooh! Your {streak}-day streak is swinging strong! Don\'t drop the vine now!',
      'Krzysztof here! {streak} days! Swing by for a quick lesson before the streak snaps!',
      'Your {streak}-day streak is like a perfect vine — don\'t let go! Swing back in!',
      '{streak} days of learning! Keep swinging from opportunity to opportunity!',
    ],
    earnings: [
      'Ooh ooh! {ticker} earnings on {date}! Opportunity to swing into!',
      '{ticker} reports {date}! Quick — let\'s find the best branch to swing from!',
      'Earnings alert: {ticker} on {date}! The jungle buzzes before big moves!',
    ],
    iv: [
      'Ooh! {ticker} IV Rank at {ivRank}%! {direction} Swing time!',
      '{ticker} hit {ivRank}% IV Rank! {direction} Let\'s swing for it!',
      'Krzysztof spotted: {ticker} at {ivRank}% IV Rank! {direction}',
    ],
  },
  bull: {
    streak: [
      'Bruno here. Your {streak}-day streak shows bullish commitment. Don\'t let the bears win!',
      '{streak} days charging forward! That\'s the bull way! Keep the momentum going!',
      'Your {streak}-day streak is pure bullish energy. One more lesson keeps you charging!',
      'Bulls don\'t quit! Your {streak}-day streak proves you\'re one of us. Keep charging!',
    ],
    earnings: [
      'Bruno is bullish: {ticker} earnings on {date}. Time to position for the upside!',
      '{ticker} reports {date}. Bulls prepare early — what\'s your call spread look like?',
      'Earnings opportunity: {ticker} on {date}. The bull case is calling!',
    ],
    iv: [
      'Bruno sees opportunity: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} Bulls charge when others hesitate!',
      'Bullish signal: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
  bear: {
    streak: [
      'Bertha here. Your {streak}-day streak is a hedge against ignorance. Don\'t let it expire worthless.',
      '{streak} days of preparation. That\'s how bears survive any market. Keep it going.',
      'Your {streak}-day streak is protective armor. Don\'t leave yourself exposed today.',
      'Pessimism says you\'ll skip. Realism says you\'ll protect your {streak}-day streak.',
    ],
    earnings: [
      'Bertha warns: {ticker} earnings on {date}. Check your hedges and worst-case scenarios.',
      '{ticker} reports {date}. Have you stress-tested your portfolio for a miss? Do it now.',
      'Earnings risk: {ticker} on {date}. Bears prepare for the worst and profit from caution.',
    ],
    iv: [
      'Bertha\'s risk alert: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} Risk management first.',
      'Caution: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
  dolphin: {
    streak: [
      'Grace under pressure — that\'s what your {streak}-day streak represents. Keep the balance.',
      'Diana here. {streak} days of balanced growth. Graceful traders maintain their routines.',
      'Your {streak}-day streak is flowing beautifully. Don\'t create turbulence by breaking it.',
      '{streak} days of learning with grace. One more lesson keeps the current smooth.',
    ],
    earnings: [
      'Diana sees: {ticker} earnings on {date}. Balance your risk/reward before the announcement.',
      '{ticker} reports {date}. Graceful positioning means preparing early. What\'s your plan?',
      'Earnings flow: {ticker} on {date}. Balanced traders thrive in earnings season.',
    ],
    iv: [
      'Diana noticed: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} Grace under pressure.',
      'Flow alert: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
  octopus: {
    streak: [
      'Oscar here. Your {streak}-day streak is one of many arms reaching for mastery. Don\'t retract it.',
      '{streak} days — that\'s multi-dimensional growth. Keep all eight arms learning!',
      'Your {streak}-day streak is connected to fifty other growth variables. Don\'t lose the thread.',
      'Complex portfolios need consistent attention. Your {streak}-day streak is essential maintenance.',
    ],
    earnings: [
      'Oscar\'s multi-arm scan: {ticker} earnings on {date}. Adjust your web of positions.',
      '{ticker} reports {date}. With 50+ positions, make sure your {ticker} exposure is calibrated.',
      'Earnings: {ticker} on {date}. Oscar recommends checking all correlated positions too.',
    ],
    iv: [
      'Oscar\'s eight-arm scan: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} Multi-dimensional opportunity.',
      'Tentacle alert: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
  chameleon: {
    streak: [
      'Cameron here. Adapt your schedule, but don\'t skip your {streak}-day streak. Adaptability includes discipline.',
      'Your {streak}-day streak shows you can blend consistency with flexibility. Keep adapting.',
      '{streak} days of learning — you\'ve adapted to make it a habit. Don\'t change that!',
      'The jungle whispers: protect your {streak}-day streak before it\'s too late to adapt.',
    ],
    earnings: [
      'Cameron sees what others miss: {ticker} earnings on {date}. Adapt your positioning.',
      '{ticker} reports {date}. The market will change color — adapt before it shifts.',
      'Earnings chameleon play: {ticker} on {date}. Be ready to shift with the market.',
    ],
    iv: [
      'Cameron blending in: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} Time to adapt.',
      'Shift alert: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
  lion: {
    streak: [
      'Leo here. A {streak}-day streak shows the heart of a lion. Rule your portfolio with conviction!',
      '{streak} days of commanding growth! Lions don\'t back down. Keep leading!',
      'Your {streak}-day streak is your kingdom. Defend it! One lesson before midnight!',
      'Fortune favors the bold — and the consistent. Your {streak}-day streak is both.',
    ],
    earnings: [
      'Leo commands attention: {ticker} earnings on {date}. Position with conviction!',
      '{ticker} reports {date}. The lion positions early and watches others scramble.',
      'Earnings: {ticker} on {date}. Leo says lead your portfolio, don\'t follow the herd.',
    ],
    iv: [
      'Leo\'s roar: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} The lion pounces on opportunity.',
      'Royal alert: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
  tiger: {
    streak: [
      'Tanya here. Your {streak}-day streak reflects discipline — know thyself, know thy edge.',
      '{streak} days of introspective learning. True power comes from self-knowledge. Keep going.',
      'Your {streak}-day streak is your training ground. Tigers sharpen their skills daily.',
      'Discipline is power. Your {streak}-day streak is proof of your inner strength.',
    ],
    earnings: [
      'Tanya\'s focus: {ticker} earnings on {date}. Know your position\'s strengths and weaknesses.',
      '{ticker} reports {date}. Disciplined preparation separates tigers from prey.',
      'Earnings: {ticker} on {date}. Tanya says study the setup before the strike.',
    ],
    iv: [
      'Tanya\'s discipline: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} Know thy edge.',
      'Focused alert: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
  wolf: {
    streak: [
      'Wolfgang watches. Your {streak}-day streak is patience in action. The pack respects patience.',
      '{streak} days of watching, waiting, learning. The pack strikes when ready. Keep watching.',
      'Your {streak}-day streak is wolf discipline. Don\'t break formation now.',
      'The pack waits. The pack watches. The pack maintains its {streak}-day streak.',
    ],
    earnings: [
      'Wolfgang watches: {ticker} earnings on {date}. The pack positions in the shadows.',
      '{ticker} reports {date}. Study the prey from the shadows before striking.',
      'Earnings hunt: {ticker} on {date}. Wolfgang says patience before precision.',
    ],
    iv: [
      'Wolfgang\'s hunt: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} The pack watches.',
      'Shadow alert: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
  kangaroo: {
    streak: [
      'Joey here! Your {streak}-day streak is bouncing strong! Don\'t let it crash-land!',
      '{streak} days of big jumps in knowledge! When the market jumps, you\'ll jump higher!',
      'Your {streak}-day streak has serious bounce energy. Keep the momentum leaping!',
      'Boing! {streak} days! That\'s higher than a kangaroo on a trampoline! Keep jumping!',
    ],
    earnings: [
      'Joey spots a jump: {ticker} earnings on {date}! Big moves incoming!',
      '{ticker} reports {date}! Earnings = volatility = opportunity to jump!',
      'Boing! {ticker} earnings {date}! Position for the big bounce!',
    ],
    iv: [
      'Joey bouncing: {ticker} IV Rank at {ivRank}%! {direction}',
      '{ticker} at {ivRank}% IV Rank! {direction} Jump on it!',
      'Bounce alert: {ticker} hit {ivRank}% IV Rank! {direction}',
    ],
  },
  panda: {
    streak: [
      'Puffy here. Inner peace... and a {streak}-day streak. Don\'t disturb the zen.',
      '{streak} days of calm, consistent growth. That\'s the panda way. Keep collecting.',
      'Your {streak}-day streak is as steady as premium income. Don\'t let it expire.',
      'Peace comes from preparation. Your {streak}-day streak is preparing you for everything.',
    ],
    earnings: [
      'Puffy calmly notes: {ticker} earnings on {date}. Sell premium and find your inner peace.',
      '{ticker} reports {date}. The calm panda collects premium while others panic.',
      'Earnings zen: {ticker} on {date}. Puffy says harvest the IV crush serenely.',
    ],
    iv: [
      'Puffy\'s zen scan: {ticker} IV Rank at {ivRank}%. {direction}',
      '{ticker} at {ivRank}% IV Rank. {direction} Inner peace... and consistent premium.',
      'Calm alert: {ticker} hit {ivRank}% IV Rank. {direction}',
    ],
  },
};

// Default messages for unknown animals
const DEFAULT_MESSAGES: AnimalMessages = {
  streak: [
    'Your {streak}-day streak is at risk! Don\'t let it slip away!',
    '{streak} days of learning — don\'t break the chain now!',
    'Come back and keep your {streak}-day streak alive!',
  ],
  earnings: [
    '{ticker} reports earnings on {date}. Review your positions!',
    'Earnings alert: {ticker} on {date}. Prepare your strategy!',
  ],
  iv: [
    '{ticker} IV Rank at {ivRank}%. {direction}',
    'Volatility alert: {ticker} hit {ivRank}% IV Rank. {direction}',
  ],
};

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Returns a themed notification message based on the user's mentor animal personality.
 * Messages are randomly selected from a pool for variety.
 */
export function getAnimalMessage(
  animal: string,
  type: NotificationType,
  params?: { streak?: number; ticker?: string; date?: string; ivRank?: number; direction?: 'high' | 'low' },
): string {
  const messages = ANIMAL_MESSAGES[animal]?.[type] ?? DEFAULT_MESSAGES[type];
  const template = messages[Math.floor(Math.random() * messages.length)];

  const directionText = params?.direction === 'high'
    ? 'Premium selling opportunity!'
    : params?.direction === 'low'
    ? 'Cheap options, buying opportunity!'
    : '';

  return template
    .replace(/{streak}/g, String(params?.streak ?? 0))
    .replace(/{ticker}/g, params?.ticker ?? '')
    .replace(/{date}/g, params?.date ?? '')
    .replace(/{ivRank}/g, String(params?.ivRank?.toFixed(0) ?? 0))
    .replace(/{direction}/g, directionText);
}

/**
 * Schedules a daily streak reminder at 8 PM local time.
 * The notification includes a personalized message from the user's mentor animal.
 * Only schedules if the user has not already been active today.
 */
export async function scheduleStreakReminder(
  currentStreak: number,
  animalName: string,
): Promise<void> {
  await loadNotifications();
  if (!Notifications) return;

  // Cancel any existing streak reminders first
  await cancelScheduledByType('streak_reminder');

  const message = getAnimalMessage(animalName, 'streak', { streak: currentStreak });

  const streakLabel = currentStreak > 0
    ? `Your ${currentStreak}-day streak is at risk!`
    : 'Start a new streak today!';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: streakLabel,
      body: message,
      data: { type: 'streak_reminder', streak: currentStreak, animal: animalName },
      ...(Platform.OS === 'android' && { channelId: 'streaks' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

/**
 * Schedules a notification 1 day before a stock's earnings date.
 * Includes a themed message from the user's mentor animal.
 */
export async function scheduleEarningsAlert(
  ticker: string,
  date: string,
  animalName: string = 'owl',
): Promise<void> {
  await loadNotifications();
  if (!Notifications) return;

  const earningsDate = new Date(date);
  const alertDate = new Date(earningsDate);
  alertDate.setDate(alertDate.getDate() - 1);

  // Set alert time to 9 AM the day before earnings
  alertDate.setHours(9, 0, 0, 0);

  // Don't schedule if the alert date is in the past
  if (alertDate.getTime() <= Date.now()) {
    return;
  }

  const message = getAnimalMessage(animalName, 'earnings', { ticker, date });

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Earnings Tomorrow: ${ticker}`,
      body: message,
      data: {
        type: 'earnings_alert',
        ticker,
        earningsDate: date,
        animal: animalName,
      },
      ...(Platform.OS === 'android' && { channelId: 'earnings' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: alertDate,
    },
  });

  // Track the scheduled earnings notification for management
  await trackScheduledEarnings(ticker, date, identifier);
}

/**
 * Sends an immediate notification when an IV rank threshold is crossed.
 * Includes a themed message from the user's mentor animal.
 */
export async function scheduleIVAlert(
  ticker: string,
  ivRank: number,
  threshold: number,
  animalName: string = 'owl',
): Promise<void> {
  await loadNotifications();
  if (!Notifications) return;

  const direction: 'high' | 'low' = ivRank >= threshold ? 'high' : 'low';
  const message = getAnimalMessage(animalName, 'iv', { ticker, ivRank, direction });

  const title = direction === 'high'
    ? `High IV Alert: ${ticker} (${ivRank.toFixed(0)}%)`
    : `Low IV Alert: ${ticker} (${ivRank.toFixed(0)}%)`;

  // IV alerts are sent immediately since they are time-sensitive
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: message,
      data: {
        type: 'iv_alert',
        ticker,
        ivRank,
        threshold,
        direction,
        animal: animalName,
      },
      ...(Platform.OS === 'android' && { channelId: 'iv-alerts' }),
    },
    trigger: null, // Immediate
  });
}

/**
 * Cancels all pending scheduled notifications.
 */
export async function cancelAllScheduled(): Promise<void> {
  await loadNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  // Clear tracked earnings
  try {
    await AsyncStorage.removeItem(SCHEDULED_EARNINGS_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Cancels all scheduled notifications of a specific type.
 */
export async function cancelScheduledByType(type: string): Promise<void> {
  await loadNotifications();
  if (!Notifications) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.data?.type === type) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

/**
 * Cancels a specific earnings alert by ticker.
 */
export async function cancelEarningsAlert(ticker: string): Promise<void> {
  await loadNotifications();
  if (!Notifications) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (
      notif.content.data?.type === 'earnings_alert' &&
      notif.content.data?.ticker === ticker
    ) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  // Remove from tracked earnings
  await untrackScheduledEarnings(ticker);
}

/**
 * Records the current timestamp as last activity.
 * Call this when the user opens the app or completes any action.
 * Used to determine if streak reminders should fire.
 */
export async function recordActivity(): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, new Date().toISOString());
  } catch {
    // Ignore storage errors
  }
}

/**
 * Returns the date of last recorded activity, or null if none.
 */
export async function getLastActivity(): Promise<Date | null> {
  try {
    const stored = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
    if (stored) return new Date(stored);
  } catch {
    // Ignore
  }
  return null;
}

/**
 * Checks if the user has been active today.
 */
export async function wasActiveToday(): Promise<boolean> {
  const lastActivity = await getLastActivity();
  if (!lastActivity) return false;

  const today = new Date();
  return (
    lastActivity.getFullYear() === today.getFullYear() &&
    lastActivity.getMonth() === today.getMonth() &&
    lastActivity.getDate() === today.getDate()
  );
}

/**
 * Returns a count of all currently scheduled notifications, optionally filtered by type.
 */
export async function getScheduledCount(type?: string): Promise<number> {
  await loadNotifications();
  if (!Notifications) return 0;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  if (!type) return scheduled.length;

  return scheduled.filter((n) => n.content.data?.type === type).length;
}

// ── Internal Helpers ─────────────────────────────────────────────────────

async function trackScheduledEarnings(
  ticker: string,
  date: string,
  notificationId: string,
): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(SCHEDULED_EARNINGS_KEY);
    const earnings: Record<string, { date: string; notificationId: string }> = stored
      ? JSON.parse(stored)
      : {};
    earnings[ticker] = { date, notificationId };
    await AsyncStorage.setItem(SCHEDULED_EARNINGS_KEY, JSON.stringify(earnings));
  } catch {
    // Ignore storage errors
  }
}

async function untrackScheduledEarnings(ticker: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(SCHEDULED_EARNINGS_KEY);
    if (!stored) return;
    const earnings: Record<string, { date: string; notificationId: string }> = JSON.parse(stored);
    delete earnings[ticker];
    await AsyncStorage.setItem(SCHEDULED_EARNINGS_KEY, JSON.stringify(earnings));
  } catch {
    // Ignore storage errors
  }
}
