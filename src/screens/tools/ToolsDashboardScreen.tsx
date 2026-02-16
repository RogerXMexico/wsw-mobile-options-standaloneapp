// Tools Dashboard Screen for Wall Street Wildlife Mobile
import React, { useState } from 'react';
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
import { ToolsStackParamList } from '../../navigation/types';
import { GlassCard, GlowButton, GradientText, PremiumModal } from '../../components/ui';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  isPremium: boolean;
}

const TOOLS: ToolItem[] = [
  { id: 'greeks', name: 'Greeks Visualizer', description: 'Interactive Delta, Gamma, Theta, Vega', emoji: '📊', isPremium: false },
  { id: 'position-sizing', name: 'Position Sizing', description: 'Calculate optimal position size', emoji: '📐', isPremium: false },
  { id: 'pop', name: 'POP Calculator', description: 'Probability of profit analysis', emoji: '🎯', isPremium: true },
  { id: 'expected-move', name: 'Expected Move', description: 'Calculate implied range', emoji: '📈', isPremium: true },
  { id: 'iv-crush', name: 'IV Crush Calculator', description: 'Earnings volatility impact', emoji: '💥', isPremium: true },
  { id: 'risk-reward', name: 'Risk/Reward Module', description: 'Analyze trade risk profiles', emoji: '⚖️', isPremium: false },
  { id: 'iv-rank', name: 'IV Rank Tool', description: 'Compare volatility levels', emoji: '📉', isPremium: true },
  { id: 'screener', name: 'Options Screener', description: 'Find trading opportunities', emoji: '🔍', isPremium: true },
  { id: 'watchlist', name: 'Watchlist', description: 'Track your favorites', emoji: '⭐', isPremium: false },
  { id: '3d-surface', name: 'IV Surface', description: 'Visualize volatility in 3D', emoji: '🌐', isPremium: true },
  { id: 'profit-calculator', name: 'Profit Calculator', description: 'Calculate options P&L', emoji: '💵', isPremium: false },
];

type ToolsNavProp = NativeStackNavigationProp<ToolsStackParamList>;

const ToolsDashboardScreen: React.FC = () => {
  const navigation = useNavigation<ToolsNavProp>();
  const { user } = useAuth();
  const isPremium = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro';

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedToolName, setSelectedToolName] = useState<string>('');

  const handleToolPress = (tool: ToolItem) => {
    if (tool.isPremium && !isPremium) {
      setSelectedToolName(tool.name);
      setShowPremiumModal(true);
      return;
    }

    // Navigate to tool based on id
    switch (tool.id) {
      case 'greeks':
        navigation.navigate('GreeksVisualizer');
        break;
      case 'position-sizing':
        navigation.navigate('PositionSizing');
        break;
      case 'pop':
        navigation.navigate('POPCalculator');
        break;
      case 'expected-move':
        navigation.navigate('ExpectedMove');
        break;
      case 'iv-crush':
        navigation.navigate('IVCrush');
        break;
      case 'risk-reward':
        navigation.navigate('RiskReward');
        break;
      case 'iv-rank':
        navigation.navigate('IVRankTool');
        break;
      case 'screener':
        navigation.navigate('OptionsScreener');
        break;
      case 'watchlist':
        navigation.navigate('Watchlist');
        break;
      case '3d-surface':
        navigation.navigate('OptionsSurface3D');
        break;
      case 'profit-calculator':
        navigation.navigate('ProfitCalculator');
        break;
      default:
        break;
    }
  };

  const handleGoPremium = () => {
    setShowPremiumModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <GradientText style={styles.headerTitle}>Tools</GradientText>
        <Text style={styles.headerSubtitle}>Calculators & analyzers</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tools Grid */}
        <View style={styles.toolsGrid}>
          {TOOLS.map((tool) => {
            const isLocked = tool.isPremium && !isPremium;

            return (
              <TouchableOpacity
                key={tool.id}
                style={styles.toolCardWrapper}
                onPress={() => handleToolPress(tool)}
                activeOpacity={0.8}
              >
                <GlassCard
                  style={[styles.toolCard, isLocked ? styles.toolCardLocked : undefined]}
                  noPadding
                >
                  <View style={styles.toolContent}>
                    <View style={styles.toolHeader}>
                      <Text style={styles.toolEmoji}>{tool.emoji}</Text>
                      {tool.isPremium && (
                        <View style={[styles.premiumBadge, shadows.neonGreenSubtle]}>
                          <Text style={styles.premiumBadgeText}>PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.toolName, isLocked && styles.lockedText]}>
                      {tool.name}
                    </Text>
                    <Text style={[styles.toolDescription, isLocked && styles.lockedText]}>
                      {tool.description}
                    </Text>
                    {isLocked && (
                      <View style={styles.lockOverlay}>
                        <Text style={styles.lockIcon}>🔒</Text>
                      </View>
                    )}
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upgrade Banner */}
        {!isPremium && (
          <GlassCard style={styles.upgradeBanner} withGlow glowColor={colors.neon.cyan}>
            <Text style={styles.upgradeBannerEmoji}>🚀</Text>
            <Text style={styles.upgradeBannerTitle}>Unlock All Tools</Text>
            <Text style={styles.upgradeBannerText}>
              Get access to real-time data and premium calculators
            </Text>
            <GlowButton
              title="Go Premium"
              onPress={handleGoPremium}
              variant="secondary"
              size="md"
            />
          </GlassCard>
        )}
      </ScrollView>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName={selectedToolName}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.styles.h2,
  },
  headerSubtitle: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  toolCardWrapper: {
    width: '47%',
  },
  toolCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  toolCardLocked: {
    opacity: 0.7,
  },
  toolContent: {
    padding: spacing.md,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  toolEmoji: {
    fontSize: 32,
  },
  premiumBadge: {
    backgroundColor: colors.neon.yellow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  premiumBadgeText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontFamily: typography.fonts.bold,
    fontWeight: '700',
    fontSize: 9,
  },
  toolName: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  toolDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  lockedText: {
    color: colors.text.muted,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borderRadius.xl,
  },
  lockIcon: {
    fontSize: 24,
  },
  upgradeBanner: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  upgradeBannerEmoji: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  upgradeBannerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  upgradeBannerText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default ToolsDashboardScreen;
