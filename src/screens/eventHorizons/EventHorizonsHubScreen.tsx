// Event Horizons Hub Screen - Tier 8
// Main hub for prediction market + options integration tools
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { GlassCard, PremiumModal } from '../../components/ui';
import { InlineIcon } from '../../components/ui/InlineIcon';
import { EventHorizonsStackParamList } from '../../navigation/types';
import { EVENT_HORIZONS_LESSONS } from '../../data/eventHorizonsLessons';
import { EVENT_HORIZONS_BADGES } from '../../data/eventHorizonsBadges';
import { useProgress } from '../../hooks/useProgress';
import { useSubscription } from '../../hooks/useSubscription';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;

interface ToolCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
  isWide?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  color,
  onPress,
  isWide = false,
}) => (
  <TouchableOpacity
    style={[styles.toolCard, isWide && styles.toolCardWide]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.toolIconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={color} />
    </View>
    <View style={styles.toolContent}>
      <Text style={[styles.toolTitle, { color }]}>{title}</Text>
      <Text style={styles.toolSubtitle}>{subtitle}</Text>
      <Text style={styles.toolDescription} numberOfLines={2}>
        {description}
      </Text>
    </View>
    <View style={styles.toolArrow}>
      <Text style={[styles.toolArrowText, { color }]}>{'>'}</Text>
    </View>
  </TouchableOpacity>
);

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtitle, onPress }) => (
  <TouchableOpacity
    style={styles.statCard}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.statHeader}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={14} color={colors.text.secondary} />
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const EventHorizonsHubScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { progress } = useProgress();
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Compute stats from data
  const totalLessons = EVENT_HORIZONS_LESSONS.length;
  const totalBadges = EVENT_HORIZONS_BADGES.length;
  const ehLessonIds = EVENT_HORIZONS_LESSONS.map((l) => l.id);
  const completedLessons = progress.completedModules.filter((id) =>
    ehLessonIds.includes(id)
  ).length;

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.lockedContainer}>
          <View style={styles.lockedIconCircle}>
            <Ionicons name="lock-closed" size={48} color={colors.neon.green} />
          </View>
          <Text style={styles.lockedTitle}>Event Horizons</Text>
          <Text style={styles.lockedSubtitle}>Tier 8 - Premium Feature</Text>
          <Text style={styles.lockedDescription}>
            Analyze prediction markets and options volatility. Access 7 analysis tools, AI signal synthesis, event replay, paper trading, and more.
          </Text>
          <TouchableOpacity
            style={styles.lockedButton}
            onPress={() => setShowPremiumModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="diamond-outline" size={18} color="#000000" />
            <Text style={styles.lockedButtonText}>Unlock Event Horizons</Text>
          </TouchableOpacity>
        </View>
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          featureName="Event Horizons"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.3)', 'rgba(20, 184, 166, 0.2)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroContainer}
        >
          <View style={styles.heroContent}>
            {/* Chameleon Avatar */}
            <LinearGradient
              colors={['#8b5cf6', '#14b8a6']}
              style={styles.chameleonAvatar}
            >
              <InlineIcon name="chameleon" size={32} />
            </LinearGradient>

            <View style={styles.heroText}>
              <View style={styles.tierBadge}>
                <Text style={styles.tierBadgeText}>Tier 8</Text>
              </View>
              <Text style={styles.heroTitle}>The Prediction Jungle</Text>
              <Text style={styles.heroSubtitle}>
                Analyze prediction markets and options volatility. Find opportunities where markets disagree.
              </Text>

              {/* Quote */}
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>
                  "The best way to predict the future is to create it."
                </Text>
                <Text style={styles.quoteAuthor}>— Peter Drucker</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard icon="radio-outline" label="Tools" value="7" subtitle="Analysis tools" />
          <StatCard
            icon="library-outline"
            label="Lessons"
            value={`${completedLessons}/${totalLessons}`}
            subtitle="Completed"
          />
          <StatCard icon="disc-outline" label="Events" value="4" subtitle="Event types" />
          <StatCard
            icon="trophy-outline"
            label="Badges"
            value={String(totalBadges)}
            subtitle="Available"
            onPress={() => navigation.navigate('EventHorizonsProgress')}
          />
        </View>

        {/* Tools Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Horizons Tools</Text>

          <View style={styles.toolsGrid}>
            {/* Lessons */}
            <ToolCard
              title="Lessons"
              subtitle="Learn the concepts"
              description={`Master prediction market analysis with ${totalLessons} comprehensive lessons.`}
              icon="book-outline"
              color="#8b5cf6"
              onPress={() => navigation.navigate('EventHorizonsLessons')}
            />

            {/* Prediction Scanner */}
            <ToolCard
              title="Scanner"
              subtitle="Track live events"
              description="Browse prediction market events alongside options data."
              icon="radio-outline"
              color="#a855f7"
              onPress={() => navigation.navigate('PredictionScanner')}
            />

            {/* Gap Analyzer */}
            <ToolCard
              title="Gap Analyzer"
              subtitle="Find opportunities"
              description="Visualize probability vs IV gaps to find trading edges."
              icon="bar-chart-outline"
              color="#14b8a6"
              onPress={() => navigation.navigate('GapAnalyzer')}
            />

            {/* Event Replay */}
            <ToolCard
              title="Event Replay"
              subtitle="Learn from history"
              description="Step through historical events and see how they played out."
              icon="play-back-outline"
              color="#f59e0b"
              onPress={() => navigation.navigate('EventReplay', {})}
            />

            {/* Paper Trading */}
            <ToolCard
              title="Paper Trading"
              subtitle="Practice predictions"
              description="Trade YES/NO shares on curated case studies risk-free."
              icon="briefcase-outline"
              color="#10b981"
              onPress={() => navigation.navigate('EventHorizonsPaperTrading')}
            />

            {/* Earnings Calendar */}
            <ToolCard
              title="Earnings Calendar"
              subtitle="Track upcoming events"
              description="Monitor earnings with real-time IV data and watchlist."
              icon="calendar-outline"
              color="#f59e0b"
              onPress={() => navigation.navigate('EarningsCalendar')}
            />

            {/* Options Chain */}
            <ToolCard
              title="Options Chain"
              subtitle="Real-time data"
              description="View live options chain with Greeks, bid/ask, and volume."
              icon="link-outline"
              color="#06b6d4"
              onPress={() => navigation.navigate('OptionsChainViewer', {})}
            />
          </View>

          {/* AI Signal Analyzer - Wide Card */}
          <TouchableOpacity
            style={styles.aiCard}
            onPress={() => navigation.navigate('AISignalAnalyzer')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.3)', 'rgba(20, 184, 166, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiCardGradient}
            >
              <View style={styles.aiCardContent}>
                <LinearGradient
                  colors={['#8b5cf6', '#14b8a6']}
                  style={styles.aiIconContainer}
                >
                  <Ionicons name="sparkles-outline" size={28} color="#fff" />
                </LinearGradient>
                <View style={styles.aiTextContent}>
                  <View style={styles.aiTitleRow}>
                    <Text style={styles.aiTitle}>AI Signal Synthesizer</Text>
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>Gemini</Text>
                    </View>
                  </View>
                  <Text style={styles.aiDescription}>
                    Let AI analyze the gap between prediction market probability and options
                    volatility to generate actionable insights.
                  </Text>
                </View>
                <Text style={styles.aiArrow}>{'>'}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Coming Soon */}
        <View style={styles.comingSoonContainer}>
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.1)', 'rgba(20, 184, 166, 0.1)']}
            style={styles.comingSoonGradient}
          >
            <View style={styles.comingSoonHeader}>
              <Ionicons name="sparkles" size={16} color={colors.neon.purple} />
              <Text style={styles.comingSoonTitle}>Coming Soon</Text>
            </View>
            <View style={styles.comingSoonList}>
              <View style={styles.comingSoonItem}>
                <View style={[styles.comingSoonDot, { backgroundColor: '#a855f7' }]} />
                <Text style={styles.comingSoonText}>
                  Volatility surface visualization and skew analysis
                </Text>
              </View>
              <View style={styles.comingSoonItem}>
                <View style={[styles.comingSoonDot, { backgroundColor: '#ec4899' }]} />
                <Text style={styles.comingSoonText}>
                  Multi-leg options strategy builder with P/L simulation
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: spacing['3xl'] }} />
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
    paddingTop: spacing.md,
  },
  heroContainer: {
    borderRadius: 24,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  chameleonAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chameleonEmoji: {
    fontSize: 32,
  },
  heroText: {
    flex: 1,
  },
  tierBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  tierBadgeText: {
    color: '#c4b5fd',
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
  },
  heroTitle: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  quoteContainer: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.md,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
  },
  quoteText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: '#c4b5fd',
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: (width - spacing.lg * 2 - spacing.sm * 3) / 2,
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  statIcon: {
    fontSize: 14,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
  },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  statSubtitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  toolCard: {
    width: (width - spacing.lg * 2 - spacing.sm) / 2,
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  toolCardWide: {
    width: '100%',
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    marginBottom: 2,
  },
  toolSubtitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  toolDescription: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
    lineHeight: 16,
  },
  toolArrow: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  toolArrowText: {
    fontSize: 16,
    fontFamily: typography.fonts.medium,
  },
  aiCard: {
    marginTop: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  aiCardGradient: {
    padding: spacing.lg,
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiIcon: {
    fontSize: 28,
  },
  aiTextContent: {
    flex: 1,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  aiTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  aiBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: '#c4b5fd',
  },
  aiDescription: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  aiArrow: {
    fontSize: 18,
    color: '#a855f7',
    fontFamily: typography.fonts.medium,
  },
  comingSoonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  comingSoonGradient: {
    padding: spacing.lg,
  },
  comingSoonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  comingSoonIcon: {
    fontSize: 16,
  },
  comingSoonTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  comingSoonList: {
    gap: spacing.sm,
  },
  comingSoonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  comingSoonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  comingSoonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
    flex: 1,
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
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  lockedSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: '#c4b5fd',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  lockedDescription: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
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
    borderRadius: 16,
    gap: spacing.sm,
  },
  lockedButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: '#000000',
  },
});

export default EventHorizonsHubScreen;
