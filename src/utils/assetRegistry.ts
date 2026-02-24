// Asset Registry — central mapping from string keys to image assets or Ionicon names
// Replaces all emoji usage throughout the app with proper images or vector icons

import { ImageSourcePropType } from 'react-native';

// ── Animal Images ──────────────────────────────────────────────────────
// All 18 jungle animal mentor illustrations
export const ANIMAL_IMAGES: Record<string, ImageSourcePropType> = {
  turtle: require('../../assets/animals/Turtle WSW.png'),
  owl: require('../../assets/animals/Owl WSW.png'),
  cheetah: require('../../assets/animals/Cheetah WSW.png'),
  fox: require('../../assets/animals/Fox WSW.png'),
  goldenretriever: require('../../assets/animals/Golden Retriever WSW.png'),
  sloth: require('../../assets/animals/Sloth WSW.png'),
  badger: require('../../assets/animals/badger.png'),
  monkey: require('../../assets/animals/monkey.png'),
  bull: require('../../assets/animals/Bull WSW.webp'),
  bear: require('../../assets/animals/Bear WSW.png'),
  dolphin: require('../../assets/animals/Dolphin WSW.png'),
  octopus: require('../../assets/animals/Octopus WSW.png'),
  chameleon: require('../../assets/animals/Lizard WSW.png'),
  lion: require('../../assets/animals/Lion WSW.png'),
  tiger: require('../../assets/animals/Tiger_Jacket.jpeg'),
  wolf: require('../../assets/animals/Wolf WSW.webp'),
  kangaroo: require('../../assets/animals/kangaroo.webp'),
  panda: require('../../assets/animals/Panda.webp'),
};

// ── Icon Images ────────────────────────────────────────────────────────
// Custom illustrations for special UI elements
export const ICON_IMAGES: Record<string, ImageSourcePropType> = {
  fire: require('../../assets/icons/fire.png'),
  mirror: require('../../assets/icons/mirror.png'),
  'golden-banana': require('../../assets/icons/golden-banana.webp'),
  'quiz-lion': require('../../assets/icons/quiz-lion.png'),
  'trading-journal': require('../../assets/icons/trading-journal.png'),
  ritual: require('../../assets/icons/ritual.png'),
};

// ── Emoji → Animal key mapping ─────────────────────────────────────────
export const EMOJI_TO_ANIMAL: Record<string, string> = {
  '🐢': 'turtle',
  '🦉': 'owl',
  '🐆': 'cheetah',
  '🦊': 'fox',
  '🐕': 'goldenretriever',
  '🦥': 'sloth',
  '🦡': 'badger',
  '🐒': 'monkey',
  '🐂': 'bull',
  '🐻': 'bear',
  '🐬': 'dolphin',
  '🐙': 'octopus',
  '🦎': 'chameleon',
  '🦁': 'lion',
  '🐯': 'tiger',
  '🐺': 'wolf',
  '🦘': 'kangaroo',
  '🐼': 'panda',
  '🦅': 'eagle', // no image yet, falls back to Ionicon
};

// ── Emoji → Ionicon mapping ────────────────────────────────────────────
// Generic business/UI emoji mapped to Ionicons vector icons
export const EMOJI_TO_IONICON: Record<string, string> = {
  // Charts & Finance
  '📊': 'bar-chart-outline',
  '📈': 'trending-up',
  '📉': 'trending-down',
  '💰': 'cash-outline',
  '💵': 'cash-outline',
  '💹': 'trending-up',
  '⚖️': 'scale-outline',
  '⚖': 'scale-outline',

  // Navigation & Actions
  '🎯': 'locate-outline',
  '🔍': 'search-outline',
  '🔎': 'search-outline',
  '💡': 'bulb-outline',
  '🔒': 'lock-closed-outline',
  '🚀': 'rocket-outline',
  '🔄': 'refresh-outline',
  '⚡': 'flash-outline',
  '🔔': 'notifications-outline',

  // Education & Content
  '📚': 'book-outline',
  '📖': 'reader-outline',
  '📝': 'create-outline',
  '📋': 'clipboard-outline',
  '📜': 'document-text-outline',
  '🧠': 'brain-outline',
  '🎭': 'happy-outline',

  // Achievement & Social
  '🏆': 'trophy-outline',
  '⭐': 'star-outline',
  '🎉': 'sparkles-outline',
  '✨': 'sparkles-outline',
  '👑': 'medal-outline',
  '🔥': 'flame-outline',
  '❤️': 'heart-outline',
  '💬': 'chatbubble-outline',
  '🤝': 'people-outline',

  // Business & Institutions
  '🏛️': 'business-outline',
  '🏢': 'business-outline',
  '💼': 'briefcase-outline',
  '💊': 'medkit-outline',

  // Calendar & Time
  '📅': 'calendar-outline',
  '🗓': 'calendar-outline',
  '⏱️': 'timer-outline',

  // Tools & Settings
  '🛠️': 'construct-outline',
  '⚙️': 'settings-outline',
  '⚙': 'settings-outline',
  '📐': 'resize-outline',
  '🔬': 'flask-outline',

  // Media & Communication
  '📡': 'radio-outline',
  '📢': 'megaphone-outline',
  '📤': 'share-outline',
  '📥': 'download-outline',
  '🌐': 'globe-outline',
  '📺': 'tv-outline',
  '🐦': 'logo-twitter',

  // Status & Indicators
  '🔴': 'ellipse',
  '🟢': 'ellipse',
  '🟡': 'ellipse',
  '⚪': 'ellipse',
  '✅': 'checkmark-circle',
  '✓': 'checkmark',
  '✗': 'close',
  '✕': 'close',
  '⚠️': 'warning-outline',
  '⚠': 'warning-outline',
  '🛑': 'stop-circle-outline',

  // Nature & Decorative
  '🌴': 'leaf-outline',
  '🌙': 'moon-outline',
  '☀️': 'sunny-outline',
  '🌅': 'sunny-outline',

  // Misc
  '🎬': 'film-outline',
  '🏃': 'walk-outline',
  '🔲': 'square-outline',
  '📱': 'phone-portrait-outline',
  '🍪': 'ellipse-outline',
  '🗑️': 'trash-outline',
  '💚': 'heart',
  '🐛': 'bug-outline',
  '🔮': 'eye-outline',
  '💥': 'flash-outline',
  '⛓': 'link-outline',
  '🎮': 'game-controller-outline',
  '🔧': 'build-outline',
  '📍': 'location-outline',
  '🛡️': 'shield-outline',
  '💍': 'ellipse-outline',
  '🏠': 'home-outline',
  '📎': 'attach-outline',
  '🔀': 'shuffle-outline',
  '🐌': 'time-outline',
  '💀': 'skull-outline',
  '➡️': 'arrow-forward',
};

// ── Status dot color mapping ───────────────────────────────────────────
export const STATUS_DOT_COLORS: Record<string, string> = {
  '🔴': '#ef4444',
  '🟢': '#22c55e',
  '🟡': '#eab308',
  '⚪': '#94a3b8',
};

// ── Helpers ─────────────────────────────────────────────────────────────

/** Get animal image source by key (e.g. 'turtle', 'owl') */
export const getAnimalImage = (key: string): ImageSourcePropType | null => {
  return ANIMAL_IMAGES[key.toLowerCase()] ?? null;
};

/** Get Ionicon name for an emoji character */
export const getIoniconForEmoji = (emoji: string): string | null => {
  return EMOJI_TO_IONICON[emoji] ?? null;
};

/** Check if an emoji maps to an animal image */
export const isAnimalEmoji = (emoji: string): boolean => {
  return emoji in EMOJI_TO_ANIMAL;
};

/** Get animal key from emoji */
export const getAnimalKeyFromEmoji = (emoji: string): string | null => {
  return EMOJI_TO_ANIMAL[emoji] ?? null;
};
