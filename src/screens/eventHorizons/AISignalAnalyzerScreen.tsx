// AI Signal Analyzer Screen
// AI-powered analysis of prediction market and options data
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../../theme';
import { GlowButton } from '../../components/ui';
import { EventHorizonsStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;

interface AISignal {
  id: string;
  ticker: string;
  eventType: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  suggestedStrategy: string;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  gapScore: number;
  timestamp: string;
}

// Mock AI-generated signals
const MOCK_SIGNALS: AISignal[] = [
  {
    id: '1',
    ticker: 'NVDA',
    eventType: 'Earnings',
    direction: 'bullish',
    confidence: 78,
    suggestedStrategy: 'Long Straddle',
    reasoning: 'Prediction markets show 78% beat probability but IV Rank at 65% suggests options are fairly priced. Historical analysis shows NVDA tends to move more than expected on earnings. Consider long volatility.',
    riskLevel: 'medium',
    timeframe: '2-3 weeks',
    gapScore: 13,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    ticker: 'TSLA',
    eventType: 'Delivery Report',
    direction: 'bearish',
    confidence: 65,
    suggestedStrategy: 'Bear Put Spread',
    reasoning: 'Polymarket shows only 42% confidence in delivery beat, but IV Rank is elevated at 82%. This suggests options are overpriced relative to uncertainty. Consider short volatility or directional bearish plays.',
    riskLevel: 'high',
    timeframe: '1 month',
    gapScore: -40,
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    ticker: 'MRNA',
    eventType: 'FDA Decision',
    direction: 'bullish',
    confidence: 72,
    suggestedStrategy: 'Long Call',
    reasoning: 'FDA approval probability at 68% with IV Rank only 45%. Options appear cheap relative to the binary outcome potential. Strong long volatility opportunity with bullish bias.',
    riskLevel: 'high',
    timeframe: '6 weeks',
    gapScore: 23,
    timestamp: '1 day ago',
  },
];

const getDirectionColor = (direction: AISignal['direction']) => {
  switch (direction) {
    case 'bullish':
      return colors.bullish;
    case 'bearish':
      return colors.bearish;
    case 'neutral':
      return colors.neutral;
  }
};

const getRiskColor = (risk: AISignal['riskLevel']) => {
  switch (risk) {
    case 'low':
      return colors.bullish;
    case 'medium':
      return '#f59e0b';
    case 'high':
      return colors.bearish;
  }
};

const AISignalAnalyzerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [ticker, setTicker] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [signals, setSignals] = useState<AISignal[]>(MOCK_SIGNALS);
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!ticker.trim()) return;

    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const newSignal: AISignal = {
        id: Date.now().toString(),
        ticker: ticker.toUpperCase(),
        eventType: 'Custom Analysis',
        direction: Math.random() > 0.5 ? 'bullish' : 'bearish',
        confidence: Math.floor(Math.random() * 30) + 60,
        suggestedStrategy: Math.random() > 0.5 ? 'Long Straddle' : 'Iron Condor',
        reasoning: `Analysis for ${ticker.toUpperCase()}: Based on current market conditions, prediction market sentiment, and options pricing, the AI has identified a potential opportunity. IV appears ${Math.random() > 0.5 ? 'elevated' : 'suppressed'} relative to historical norms.`,
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as AISignal['riskLevel'],
        timeframe: '2-4 weeks',
        gapScore: Math.floor(Math.random() * 60) - 30,
        timestamp: 'Just now',
      };
      setSignals([newSignal, ...signals]);
      setIsAnalyzing(false);
      setTicker('');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI Signal Analyzer</Text>
          <Text style={styles.headerSubtitle}>Powered by Gemini</Text>
        </View>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>🧠 AI</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.2)', 'rgba(20, 184, 166, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.infoBanner}
        >
          <Text style={styles.infoIcon}>🦎</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Chameleon AI Assistant</Text>
            <Text style={styles.infoText}>
              Enter a ticker to get AI-powered analysis combining prediction market data
              with options volatility insights.
            </Text>
          </View>
        </LinearGradient>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter ticker (e.g., AAPL)"
              placeholderTextColor={colors.text.muted}
              value={ticker}
              onChangeText={setTicker}
              autoCapitalize="characters"
              maxLength={5}
            />
            <TouchableOpacity
              style={[styles.analyzeButton, !ticker.trim() && styles.analyzeButtonDisabled]}
              onPress={handleAnalyze}
              disabled={!ticker.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color={colors.text.primary} />
              ) : (
                <Text style={styles.analyzeButtonText}>Analyze</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Analyzing State */}
        {isAnalyzing && (
          <View style={styles.analyzingCard}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text style={styles.analyzingText}>Analyzing {ticker.toUpperCase()}...</Text>
            <Text style={styles.analyzingSubtext}>
              Gathering prediction market data and options chain...
            </Text>
          </View>
        )}

        {/* Signals List */}
        <View style={styles.signalsSection}>
          <Text style={styles.sectionTitle}>Recent Signals ({signals.length})</Text>

          {signals.map((signal) => {
            const isExpanded = expandedSignal === signal.id;

            return (
              <TouchableOpacity
                key={signal.id}
                style={styles.signalCard}
                onPress={() => setExpandedSignal(isExpanded ? null : signal.id)}
                activeOpacity={0.8}
              >
                {/* Signal Header */}
                <View style={styles.signalHeader}>
                  <View style={styles.signalLeft}>
                    <View style={styles.tickerRow}>
                      <Text style={styles.signalTicker}>{signal.ticker}</Text>
                      <View
                        style={[
                          styles.directionBadge,
                          { backgroundColor: `${getDirectionColor(signal.direction)}20` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.directionText,
                            { color: getDirectionColor(signal.direction) },
                          ]}
                        >
                          {signal.direction === 'bullish' ? '↑' : signal.direction === 'bearish' ? '↓' : '→'}
                          {' '}{signal.direction.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.signalEventType}>{signal.eventType}</Text>
                  </View>
                  <View style={styles.signalRight}>
                    <Text style={styles.confidenceValue}>{signal.confidence}%</Text>
                    <Text style={styles.confidenceLabel}>confidence</Text>
                  </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                  <View style={styles.quickStat}>
                    <Text style={styles.quickStatLabel}>Strategy</Text>
                    <Text style={styles.quickStatValue}>{signal.suggestedStrategy}</Text>
                  </View>
                  <View style={styles.quickStat}>
                    <Text style={styles.quickStatLabel}>Gap Score</Text>
                    <Text
                      style={[
                        styles.quickStatValue,
                        { color: signal.gapScore > 0 ? colors.bullish : colors.bearish },
                      ]}
                    >
                      {signal.gapScore > 0 ? '+' : ''}{signal.gapScore}
                    </Text>
                  </View>
                  <View style={styles.quickStat}>
                    <Text style={styles.quickStatLabel}>Risk</Text>
                    <Text style={[styles.quickStatValue, { color: getRiskColor(signal.riskLevel) }]}>
                      {signal.riskLevel.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Expanded Content */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.reasoningBox}>
                      <Text style={styles.reasoningLabel}>AI Reasoning:</Text>
                      <Text style={styles.reasoningText}>{signal.reasoning}</Text>
                    </View>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Timeframe</Text>
                        <Text style={styles.metaValue}>{signal.timeframe}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Generated</Text>
                        <Text style={styles.metaValue}>{signal.timestamp}</Text>
                      </View>
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('PredictionScanner')}
                      >
                        <Text style={styles.actionButtonText}>📡 View Scanner</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonPrimary]}
                        onPress={() => navigation.navigate('EventHorizonsPaperTrading')}
                      >
                        <Text style={styles.actionButtonPrimaryText}>💼 Paper Trade</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Expand Indicator */}
                <View style={styles.expandIndicator}>
                  <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ AI-generated signals are for educational purposes only. Always do your own
            research before trading. Past performance does not guarantee future results.
          </Text>
        </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
  },
  aiBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: '#8b5cf6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  infoIcon: {
    fontSize: 40,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  searchContainer: {
    marginBottom: spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  analyzeButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  analyzingCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  analyzingText: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  analyzingSubtext: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  signalsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  signalCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  signalLeft: {
    flex: 1,
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  signalTicker: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  directionBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  directionText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
  },
  signalEventType: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  signalRight: {
    alignItems: 'flex-end',
  },
  confidenceValue: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: '#8b5cf6',
  },
  confidenceLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: spacing.md,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
    marginBottom: 2,
  },
  quickStatValue: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  expandedContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  reasoningBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reasoningLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.semiBold,
    color: '#8b5cf6',
    marginBottom: spacing.xs,
  },
  reasoningText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.muted,
  },
  metaValue: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  actionButtonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
  },
  actionButtonPrimaryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: '#8b5cf6',
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  expandIcon: {
    fontSize: 12,
    color: colors.text.muted,
  },
  disclaimer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  disclaimerText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});

export default AISignalAnalyzerScreen;
