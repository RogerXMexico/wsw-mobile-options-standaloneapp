// Event Horizons Hub Screen - Tier 8
// Main hub for prediction market + options integration tools
import React from 'react';
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
import { colors, typography, spacing } from '../../theme';
import { GlassCard } from '../../components/ui';
import { EventHorizonsStackParamList } from '../../navigation/types';

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
      <Text style={styles.toolIcon}>{icon}</Text>
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
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const EventHorizonsHubScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

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
              <Text style={styles.chameleonEmoji}>🦎</Text>
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
          <StatCard icon="📡" label="Tools" value="7" subtitle="Analysis tools" />
          <StatCard icon="📚" label="Lessons" value="10" subtitle="Educational content" />
          <StatCard icon="🎯" label="Events" value="4" subtitle="Event types" />
          <StatCard
            icon="🏆"
            label="Progress"
            value="13"
            subtitle="Badges available"
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
              description="Master prediction market analysis with 10 comprehensive lessons."
              icon="📖"
              color="#8b5cf6"
              onPress={() => navigation.navigate('EventHorizonsLessons')}
            />

            {/* Prediction Scanner */}
            <ToolCard
              title="Scanner"
              subtitle="Track live events"
              description="Browse prediction market events alongside options data."
              icon="📡"
              color="#a855f7"
              onPress={() => navigation.navigate('PredictionScanner')}
            />

            {/* Gap Analyzer */}
            <ToolCard
              title="Gap Analyzer"
              subtitle="Find opportunities"
              description="Visualize probability vs IV gaps to find trading edges."
              icon="📊"
              color="#14b8a6"
              onPress={() => navigation.navigate('GapAnalyzer')}
            />

            {/* Event Replay */}
            <ToolCard
              title="Event Replay"
              subtitle="Learn from history"
              description="Step through historical events and see how they played out."
              icon="⏮️"
              color="#f59e0b"
              onPress={() => navigation.navigate('EventReplay', {})}
            />

            {/* Paper Trading */}
            <ToolCard
              title="Paper Trading"
              subtitle="Practice predictions"
              description="Trade YES/NO shares on curated case studies risk-free."
              icon="💼"
              color="#10b981"
              onPress={() => navigation.navigate('EventHorizonsPaperTrading')}
            />

            {/* Earnings Calendar */}
            <ToolCard
              title="Earnings Calendar"
              subtitle="Track upcoming events"
              description="Monitor earnings with real-time IV data and watchlist."
              icon="📅"
              color="#f59e0b"
              onPress={() => navigation.navigate('EarningsCalendar')}
            />

            {/* Options Chain */}
            <ToolCard
              title="Options Chain"
              subtitle="Real-time data"
              description="View live options chain with Greeks, bid/ask, and volume."
              icon="⛓️"
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
                  <Text style={styles.aiIcon}>🧠</Text>
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
              <Text style={styles.comingSoonIcon}>✨</Text>
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
});

export default EventHorizonsHubScreen;
