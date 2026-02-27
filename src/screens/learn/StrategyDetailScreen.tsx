// Strategy Detail Screen for Wall Street Wildlife Mobile
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LearnStackParamList, LearnStackScreenProps } from '../../navigation/types';
import { colors, typography, spacing, borderRadius, createNeonGlow, getTierColor, getOutlookColor } from '../../theme';
import { TIER_INFO } from '../../data/constants';
import { getStrategyById, getStrategyConfig } from '../../data/strategies';
import { PayoffChart } from '../../components/charts/PayoffChart';
import { TradeWalkthrough } from '../../components/learn/TradeWalkthrough';
import { getMentorForStrategy } from '../../data/jungleAnimals';
import { getQuotesForStrategy, getRandomQuote, getCourseQuotes } from '../../data/quotes';
import { useSubscription } from '../../hooks';
import { useTradierOptionsData } from '../../hooks/useTradierOptionsData';
import { PremiumModal } from '../../components/ui';
import { InlineIcon } from '../../components/ui/InlineIcon';
import { getStrategyContent } from '../../data/strategyContentMobile';
import { getJungleStrategiesForCoreStrategy } from '../../data/jungleStrategies';

// Animal avatar images
const ANIMAL_IMAGES: Record<string, any> = {
  turtle: require('../../../assets/animals/Turtle WSW.png'),
  owl: require('../../../assets/animals/Owl WSW.png'),
  cheetah: require('../../../assets/animals/Cheetah WSW.png'),
  fox: require('../../../assets/animals/Fox WSW.png'),
  retriever: require('../../../assets/animals/Golden Retriever WSW.png'),
  sloth: require('../../../assets/animals/Sloth WSW.png'),
  badger: require('../../../assets/animals/badger.png'),
  monkey: require('../../../assets/animals/monkey.png'),
  bear: require('../../../assets/animals/Bear WSW.png'),
  dolphin: require('../../../assets/animals/Dolphin WSW.png'),
  lion: require('../../../assets/animals/Lion WSW.png'),
  octopus: require('../../../assets/animals/Octopus WSW.png'),
  // Fallback to lion for animals without images yet
  bull: require('../../../assets/animals/Lion WSW.png'),
  chameleon: require('../../../assets/animals/Owl WSW.png'),
  tiger: require('../../../assets/animals/Tiger_Jacket.jpeg'),
};

// Tiger avatar for Rules of the Jungle
const TIGER_AVATAR = require('../../../assets/animals/Tiger_Jacket.jpeg');

const { width } = Dimensions.get('window');

type NavigationProp = LearnStackScreenProps<'StrategyDetail'>['navigation'];
type RouteProps = RouteProp<LearnStackParamList, 'StrategyDetail'>;

const StrategyDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { strategyId } = route.params;

  const [activeTab, setActiveTab] = useState<'overview' | 'lesson' | 'walkthrough' | 'setup' | 'greeks'>('overview');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { isPremium, canAccessStrategy, getStrategyIndexInTier, canAccessMentor } = useSubscription();

  // Load strategy data
  const strategy = useMemo(() => getStrategyById(strategyId), [strategyId]);
  const strategyConfig = useMemo(() => getStrategyConfig(strategyId), [strategyId]);
  const richContent = useMemo(() => getStrategyContent(strategyId), [strategyId]);
  const jungleVariants = useMemo(() => getJungleStrategiesForCoreStrategy(strategyId), [strategyId]);
  const jungleStrategy = jungleVariants.length > 0 ? jungleVariants[0] : null;
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  // Derive ticker from strategy education data (for live quote panel)
  const strategyTicker = strategy?.education?.realWorldExample?.ticker || null;

  // Live quote data from Tradier API
  const {
    data: liveQuoteData,
    loading: liveQuoteLoading,
    isConfigured: isTradierConfigured,
    refresh: refreshQuote,
  } = useTradierOptionsData(strategyTicker);

  // Navigate to a tool screen in the Tools tab
  const navigateToTool = (screen: string) => {
    (navigation as any).navigate('ToolsTab', { screen });
  };

  // Fallback for missing strategy
  if (!strategy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Strategy not found</Text>
          <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonLargeText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const tierInfo = TIER_INFO[strategy.tier] || TIER_INFO[0];
  const tierColor = getTierColor(strategy.tier);
  const outlookColor = getOutlookColor(strategy.outlook);

  // Check if strategy is locked behind premium
  const strategyIndex = getStrategyIndexInTier(strategyId, strategy.tier);
  const isLocked = !canAccessStrategy(strategyId, strategy.tier, strategyIndex);

  // Get mentor for this strategy
  const mentor = useMemo(() => getMentorForStrategy(strategyId), [strategyId]);
  const mentorImage = ANIMAL_IMAGES[mentor.id] || ANIMAL_IMAGES['owl'];

  // Get relevant quotes
  const strategyQuotes = useMemo(() => getQuotesForStrategy(strategyId), [strategyId]);
  const courseQuotes = useMemo(() => getCourseQuotes(), []);
  const displayQuote = strategyQuotes.length > 0
    ? strategyQuotes[0]
    : (strategyId === 'course-goals' ? courseQuotes[0] : null);

  // Breathing animation for Know Thyself Greek text
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (strategyId === 'know-thyself') {
      // Scale breathing animation
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.08,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      // Opacity glow animation
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      breathe.start();
      glow.start();
      return () => {
        breathe.stop();
        glow.stop();
      };
    }
  }, [strategyId, breatheAnim, glowAnim]);

  // Check if this is a Tier 0 educational module
  const isTier0 = strategy.tier === 0 || strategy.tier === 0.5;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}> Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.badges}>
            <View style={[styles.tierBadge, { backgroundColor: tierColor }]}>
              <Text style={styles.tierBadgeText}>Tier {strategy.tier}</Text>
            </View>
            <View style={[styles.outlookBadge, { backgroundColor: `${outlookColor}20` }]}>
              <Text style={[styles.outlookBadgeText, { color: outlookColor }]}>
                {strategy.outlook}
              </Text>
            </View>
            <View style={[styles.categoryBadge]}>
              <Text style={styles.categoryBadgeText}>{strategy.category}</Text>
            </View>
          </View>
          <Text style={styles.strategyName}>{strategy.name}</Text>
          <Text style={styles.strategyTierName}>{tierInfo.name}</Text>
        </View>

        {/* Special Content: Know Thyself Greek Quote */}
        {!isLocked && strategyId === 'know-thyself' && (
          <View style={styles.greekQuoteContainer}>
            <Animated.Text
              style={[
                styles.greekText,
                {
                  transform: [{ scale: breatheAnim }],
                  opacity: glowAnim,
                }
              ]}
            >
              "γνῶθι σεαυτόν"
            </Animated.Text>
            <Text style={styles.greekSource}>— Inscribed at the Temple of Apollo at Delphi</Text>
          </View>
        )}

        {/* Special Content: Rules of the Jungle Tiger Avatar */}
        {!isLocked && strategyId === 'rules-of-the-jungle' && (
          <View style={styles.tigerContainer}>
            <Text style={styles.jungleSubtitle}>
              Hunt with patience. <Text style={styles.jungleHighlight}>Strike</Text> with precision.
            </Text>
            <View style={styles.tigerAvatarWrapper}>
              <Image
                source={TIGER_AVATAR}
                style={styles.tigerAvatar}
                resizeMode="cover"
              />
            </View>
          </View>
        )}

        {/* Mentor Card - gated by access */}
        {!isLocked && canAccessMentor(mentor.id) && (
          <View style={[styles.mentorCard, { borderColor: mentor.colors.primary }]}>
            <Image
              source={mentorImage}
              style={styles.mentorAvatar}
              resizeMode="contain"
            />
            <View style={styles.mentorContent}>
              <View style={styles.mentorHeader}>
                <InlineIcon emoji={mentor.emoji} size={20} color={mentor.colors.primary} />
                <Text style={[styles.mentorName, { color: mentor.colors.primary }]}>
                  {mentor.characterName}
                </Text>
                <Text style={styles.mentorTitle}>{mentor.name}</Text>
              </View>
              <Text style={styles.mentorGreeting}>{mentor.dialogues.greeting}</Text>
              <Text style={styles.mentorCatchphrase}>"{mentor.catchphrase}"</Text>
            </View>
          </View>
        )}
        {!isLocked && !canAccessMentor(mentor.id) && (
          <TouchableOpacity
            style={[styles.mentorCard, { borderColor: colors.text.muted, opacity: 0.6 }]}
            onPress={() => setShowPremiumModal(true)}
          >
            <View style={[styles.mentorAvatar, { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.tertiary }]}>
              <Ionicons name="lock-closed" size={28} color={colors.text.muted} />
            </View>
            <View style={styles.mentorContent}>
              <View style={styles.mentorHeader}>
                <InlineIcon emoji={mentor.emoji} size={20} color={colors.text.muted} />
                <Text style={[styles.mentorName, { color: colors.text.muted }]}>
                  {mentor.characterName}
                </Text>
              </View>
              <Text style={[styles.mentorGreeting, { color: colors.text.muted }]}>
                Unlock with Jungle Pass to learn from this mentor
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Wisdom Quote (if available) */}
        {!isLocked && displayQuote && (
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>"{displayQuote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {displayQuote.author}{displayQuote.source ? `, ${displayQuote.source}` : ''}</Text>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Risk</Text>
            <Text style={styles.statValue}>{strategy.riskLevel || strategy.risk || 'N/A'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Category</Text>
            <Text style={styles.statValue}>{strategy.category || 'General'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Access</Text>
            <Text style={[styles.statValue, strategy.isPremium && { color: colors.accent }]}>
              {strategy.isPremium ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        {/* Premium Gate Overlay */}
        {isLocked && (
          <View style={styles.premiumGate}>
            <View style={styles.premiumGateIconContainer}>
              <Ionicons name="lock-closed" size={40} color={colors.neon.green} />
            </View>
            <Text style={styles.premiumGateTitle}>Premium Strategy</Text>
            <Text style={styles.premiumGateText}>
              Subscribe to unlock {strategy.name} and all 70+ strategies, detailed walkthroughs, and advanced content.
            </Text>
            <TouchableOpacity
              style={styles.premiumGateButton}
              onPress={() => setShowPremiumModal(true)}
            >
              <Ionicons name="star" size={18} color={colors.background.primary} />
              <Text style={styles.premiumGateButtonText}>Unlock Premium</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tabs - hidden when locked */}
        {!isLocked && (<View style={styles.tabs}>
          {(['overview', 'lesson', 'walkthrough', 'setup', 'greeks'] as const).map((tab) => {
            // Hide lesson tab if no rich content available
            if (tab === 'lesson' && !richContent?.analysis) {
              return null;
            }
            // Hide walkthrough tab if no trade paths available
            if (tab === 'walkthrough' && !strategy.education?.tradePaths?.length) {
              return null;
            }
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab === 'lesson' ? 'Deep Dive' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>)}

        {/* Tab Content - hidden when locked */}
        {!isLocked && activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* What It Does Card - from education content */}
            {strategy.education?.whatItDoes ? (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="book-outline" size={20} color={colors.neon.cyan} />
                  <Text style={styles.cardTitle}>What It Does</Text>
                </View>
                <Text style={styles.cardText}>{strategy.education.whatItDoes}</Text>
              </View>
            ) : (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="book-outline" size={20} color={colors.neon.cyan} />
                  <Text style={styles.cardTitle}>Overview</Text>
                </View>
                <Text style={styles.cardText}>{strategy.description}</Text>
              </View>
            )}

            {/* Real World Example */}
            {strategy.education?.realWorldExample && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="trending-up" size={20} color={colors.bullish} />
                  <Text style={styles.cardTitle}>Real Example</Text>
                </View>
                <View style={styles.exampleGrid}>
                  <View style={styles.exampleItem}>
                    <Text style={styles.exampleLabel}>Ticker</Text>
                    <Text style={styles.exampleValue}>{strategy.education.realWorldExample.ticker}</Text>
                  </View>
                  <View style={styles.exampleItem}>
                    <Text style={styles.exampleLabel}>Stock Price</Text>
                    <Text style={styles.exampleValue}>${strategy.education.realWorldExample.stockPrice}</Text>
                  </View>
                  <View style={styles.exampleItem}>
                    <Text style={styles.exampleLabel}>Strike</Text>
                    <Text style={styles.exampleValue}>${strategy.education.realWorldExample.strikePrice}</Text>
                  </View>
                  <View style={styles.exampleItem}>
                    <Text style={styles.exampleLabel}>Premium</Text>
                    <Text style={styles.exampleValue}>${strategy.education.realWorldExample.premium}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* When to Use Card */}
            {strategy.whenToUse && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="disc-outline" size={20} color={colors.neon.green} />
                  <Text style={styles.cardTitle}>When to Use</Text>
                </View>
                <Text style={styles.cardText}>{strategy.whenToUse}</Text>
              </View>
            )}

            {/* Interactive Payoff Diagram */}
            {strategyConfig && !strategy.hidePayoffChart && (
              <PayoffChart
                legs={strategyConfig.legs}
                currentPrice={
                  liveQuoteData?.dataQuality === 'real' && liveQuoteData.stockPrice > 0
                    ? liveQuoteData.stockPrice
                    : strategyConfig.defaultStockPrice
                }
                title="Interactive Payoff Diagram"
                interactive={true}
                showTimeSlider={true}
                touchToInspect={true}
                showProbabilityZones={true}
                showBreakeven={true}
                showMaxProfit={true}
                showMaxLoss={true}
                daysToExpiry={
                  liveQuoteData?.dataQuality === 'real' && liveQuoteData.daysToExpiration > 0
                    ? liveQuoteData.daysToExpiration
                    : 30
                }
                impliedVolatility={
                  liveQuoteData?.dataQuality === 'real' && liveQuoteData.atmIV > 0
                    ? liveQuoteData.atmIV / 100
                    : 0.30
                }
              />
            )}

            {/* Live Quote Data Panel */}
            <View style={styles.liveDataPanel}>
              <View style={styles.liveDataHeader}>
                <Ionicons name="pulse-outline" size={18} color={colors.neon.cyan} />
                <Text style={styles.liveDataTitle}>Live Market Data</Text>
                {liveQuoteLoading && (
                  <ActivityIndicator size="small" color={colors.neon.cyan} style={{ marginLeft: spacing.xs }} />
                )}
              </View>

              {isTradierConfigured && liveQuoteData?.dataQuality === 'real' ? (
                <View style={styles.liveDataGrid}>
                  <View style={styles.liveDataItem}>
                    <Text style={styles.liveDataLabel}>Stock Price</Text>
                    <Text style={styles.liveDataValue}>
                      ${liveQuoteData.stockPrice.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.liveDataItem}>
                    <Text style={styles.liveDataLabel}>ATM IV</Text>
                    <Text style={styles.liveDataValue}>
                      {liveQuoteData.atmIV.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.liveDataItem}>
                    <Text style={styles.liveDataLabel}>IV Rank</Text>
                    <Text style={[
                      styles.liveDataValue,
                      {
                        color: liveQuoteData.ivRank > 50
                          ? colors.bearish
                          : liveQuoteData.ivRank >= 0
                            ? colors.bullish
                            : colors.text.muted,
                      },
                    ]}>
                      {liveQuoteData.ivRank >= 0 ? `${liveQuoteData.ivRank.toFixed(0)}` : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.liveDataItem}>
                    <Text style={styles.liveDataLabel}>Expected Move</Text>
                    <Text style={styles.liveDataValue}>
                      {liveQuoteData.expectedMove > 0
                        ? `\u00B1${liveQuoteData.expectedMoveAbsolute.toFixed(2)}`
                        : 'N/A'}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.refreshButton} onPress={refreshQuote}>
                    <Ionicons name="refresh-outline" size={14} color={colors.neon.cyan} />
                    <Text style={styles.refreshText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.liveDataPlaceholder}>
                  <Text style={styles.liveDataPlaceholderText}>
                    {strategyTicker
                      ? `Connect your Tradier API key to see live data for ${strategyTicker}`
                      : 'Live data available when API is connected'}
                  </Text>
                  <TouchableOpacity
                    style={styles.connectApiButton}
                    onPress={() => (navigation as any).navigate('ProfileTab', { screen: 'ProfileMain' })}
                  >
                    <Ionicons name="key-outline" size={14} color={colors.background.primary} />
                    <Text style={styles.connectApiText}>Connect Tradier API</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Quick-Launch Tool Buttons */}
            {strategyConfig && (
              <View style={styles.toolButtonsContainer}>
                <Text style={styles.toolButtonsTitle}>Strategy Tools</Text>
                <View style={styles.toolButtonsRow}>
                  <TouchableOpacity
                    style={styles.toolButton}
                    onPress={() => navigateToTool('GreeksVisualizer')}
                  >
                    <View style={[styles.toolButtonIcon, { backgroundColor: 'rgba(0, 240, 255, 0.12)' }]}>
                      <Ionicons name="analytics-outline" size={20} color={colors.neon.cyan} />
                    </View>
                    <Text style={styles.toolButtonLabel}>Greeks</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.toolButton}
                    onPress={() => navigateToTool('ProfitCalculator')}
                  >
                    <View style={[styles.toolButtonIcon, { backgroundColor: 'rgba(57, 255, 20, 0.12)' }]}>
                      <Ionicons name="calculator-outline" size={20} color={colors.neon.green} />
                    </View>
                    <Text style={styles.toolButtonLabel}>P&L Calc</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.toolButton}
                    onPress={() => navigateToTool('RiskReward')}
                  >
                    <View style={[styles.toolButtonIcon, { backgroundColor: 'rgba(255, 7, 58, 0.12)' }]}>
                      <Ionicons name="shield-checkmark-outline" size={20} color={colors.neon.red} />
                    </View>
                    <Text style={styles.toolButtonLabel}>Risk/Reward</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.toolButton}
                    onPress={() => navigateToTool('ToolsDashboard')}
                  >
                    <View style={[styles.toolButtonIcon, { backgroundColor: 'rgba(191, 0, 255, 0.12)' }]}>
                      <Ionicons name="git-compare-outline" size={20} color={colors.neon.purple} />
                    </View>
                    <Text style={styles.toolButtonLabel}>Compare</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Key Lessons */}
            {strategy.education?.keyLessons && strategy.education.keyLessons.length > 0 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="bulb-outline" size={20} color={colors.neon.yellow} />
                  <Text style={styles.cardTitle}>Key Lessons</Text>
                </View>
                <View style={styles.lessonsList}>
                  {strategy.education.keyLessons.map((lesson, i) => (
                    <View key={i} style={styles.lessonItem}>
                      <Text style={styles.lessonBullet}>•</Text>
                      <Text style={styles.lessonText}>{lesson}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Analogy */}
            {strategy.analogy && (
              <View style={[styles.card, styles.analogyCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="color-palette-outline" size={20} color={colors.neon.purple} />
                  <Text style={styles.cardTitle}>Think of it like...</Text>
                </View>
                <Text style={styles.analogyText}>{strategy.analogy}</Text>
              </View>
            )}

            {/* The Nuance - Key Insight */}
            {strategy.nuance && (
              <View style={[styles.card, styles.nuanceCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="flash-outline" size={20} color={colors.neon.cyan} />
                  <Text style={styles.cardTitle}>The Nuance</Text>
                </View>
                <Text style={styles.nuanceText}>{strategy.nuance}</Text>
              </View>
            )}

            {/* Advantages & Disadvantages */}
            {strategy.advantages && strategy.advantages.length > 0 && (
              <View style={styles.prosConsContainer}>
                <View style={[styles.prosConsCard, styles.prosCard]}>
                  <Text style={styles.prosConsTitle}>Advantages</Text>
                  {strategy.advantages.map((adv, i) => (
                    <View key={i} style={styles.prosConsItem}>
                      <Text style={styles.prosIcon}>+</Text>
                      <Text style={styles.prosConsText}>{adv}</Text>
                    </View>
                  ))}
                </View>

                {strategy.disadvantages && strategy.disadvantages.length > 0 && (
                  <View style={[styles.prosConsCard, styles.consCard]}>
                    <Text style={styles.prosConsTitle}>Disadvantages</Text>
                    {strategy.disadvantages.map((dis, i) => (
                      <View key={i} style={styles.prosConsItem}>
                        <Text style={styles.consIcon}>-</Text>
                        <Text style={styles.prosConsText}>{dis}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Jungle Strategy Extras - Tips & Common Mistakes */}
            {jungleStrategy && (
              <>
                {jungleStrategy.tips.length > 0 && (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <InlineIcon emoji={mentor.emoji} size={20} color={mentor.colors.primary} />
                      <Text style={styles.cardTitle}>Pro Tips</Text>
                    </View>
                    <View style={styles.lessonsList}>
                      {jungleStrategy.tips.map((tip, i) => (
                        <View key={i} style={styles.lessonItem}>
                          <Text style={styles.lessonBullet}>•</Text>
                          <Text style={styles.lessonText}>{tip}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {jungleStrategy.commonMistakes.length > 0 && (
                  <View style={[styles.card, { borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
                    <View style={styles.cardHeader}>
                      <Ionicons name="warning-outline" size={20} color={colors.bearish} />
                      <Text style={styles.cardTitle}>Common Mistakes</Text>
                    </View>
                    <View style={styles.lessonsList}>
                      {jungleStrategy.commonMistakes.map((mistake, i) => (
                        <View key={i} style={styles.lessonItem}>
                          <Ionicons name="close" size={16} color={colors.bearish} />
                          <Text style={styles.lessonText}>{mistake}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Lesson / Deep Dive Tab - Rich analysis content from desktop */}
        {!isLocked && activeTab === 'lesson' && richContent?.analysis && (
          <View style={styles.tabContent}>
            {/* Full Analysis */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="library-outline" size={20} color={colors.neon.cyan} />
                <Text style={styles.cardTitle}>Full Lesson</Text>
              </View>
              <Text style={styles.cardText}>
                {showFullAnalysis
                  ? richContent.analysis
                  : richContent.analysis.substring(0, 800) + (richContent.analysis.length > 800 ? '...' : '')}
              </Text>
              {richContent.analysis.length > 800 && (
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setShowFullAnalysis(!showFullAnalysis)}
                >
                  <Text style={styles.expandButtonText}>
                    {showFullAnalysis ? 'Show Less' : 'Read Full Lesson'}
                  </Text>
                  <Ionicons
                    name={showFullAnalysis ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.neon.green}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Rich Analogy (from desktop content, may differ from inline analogy) */}
            {richContent.analogy ? (
              <View style={[styles.card, styles.analogyCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="color-palette-outline" size={20} color={colors.neon.purple} />
                  <Text style={styles.cardTitle}>Think of it like...</Text>
                </View>
                <Text style={styles.analogyText}>{richContent.analogy}</Text>
              </View>
            ) : null}

            {/* Rich Nuance */}
            {richContent.nuance ? (
              <View style={[styles.card, styles.nuanceCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="flash-outline" size={20} color={colors.neon.cyan} />
                  <Text style={styles.cardTitle}>The Nuance</Text>
                </View>
                <Text style={styles.nuanceText}>{richContent.nuance}</Text>
              </View>
            ) : null}

            {/* Worked Example */}
            {richContent.example ? (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="calculator-outline" size={20} color={colors.neon.green} />
                  <Text style={styles.cardTitle}>Worked Example</Text>
                </View>
                <Text style={styles.cardText}>{richContent.example}</Text>
              </View>
            ) : null}

            {/* Animal Metaphor */}
            {richContent.animalMetaphor ? (
              <View style={[styles.card, { borderColor: `${colors.neon.purple}40` }]}>
                <View style={styles.cardHeader}>
                  <InlineIcon name="lion" size={20} />
                  <Text style={styles.cardTitle}>Animal Metaphor</Text>
                </View>
                <Text style={styles.cardText}>{richContent.animalMetaphor}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Walkthrough Tab - Trade scenario paths */}
        {!isLocked && activeTab === 'walkthrough' && strategy.education?.tradePaths && (
          <View style={styles.tabContent}>
            <TradeWalkthrough
              tradePaths={strategy.education.tradePaths}
              ticker={strategy.education.realWorldExample?.ticker || 'STOCK'}
              stockPrice={strategy.education.realWorldExample?.stockPrice || 100}
            />

            {/* Payoff Chart for context */}
            {strategyConfig && !strategy.hidePayoffChart && (
              <PayoffChart
                legs={strategyConfig.legs}
                currentPrice={strategyConfig.defaultStockPrice}
                title="Payoff Reference"
                compact={true}
                interactive={false}
                showTimeSlider={false}
                touchToInspect={true}
              />
            )}
          </View>
        )}

        {!isLocked && activeTab === 'setup' && (
          <View style={styles.tabContent}>
            {/* Legs */}
            {strategyConfig && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Strategy Legs</Text>
                <View style={styles.legsContainer}>
                  {strategyConfig.legs.map((leg, index) => (
                    <View key={index} style={styles.legItem}>
                      <View style={[
                        styles.legAction,
                        { backgroundColor: leg.position === 'long' ? colors.overlay.neonGreen : 'rgba(239, 68, 68, 0.1)' }
                      ]}>
                        <Text style={[
                          styles.legActionText,
                          { color: leg.position === 'long' ? colors.bullish : colors.bearish }
                        ]}>
                          {leg.position === 'long' ? 'BUY' : 'SELL'}
                        </Text>
                      </View>
                      <View style={styles.legDetails}>
                        <Text style={styles.legQuantity}>{leg.quantity || 1}x</Text>
                        <Text style={[styles.legType, { color: leg.type === 'call' ? colors.bullish : colors.bearish }]}>
                          {leg.type.toUpperCase()}
                        </Text>
                        <Text style={styles.legStrike}>@ ${leg.strike}</Text>
                        <Text style={styles.legPremium}>(${leg.premium} premium)</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Risk/Reward */}
            {(strategy.maxProfit || strategy.maxLoss || strategy.breakeven) && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Risk/Reward Profile</Text>
                <View style={styles.riskRewardGrid}>
                  {strategy.maxProfit && (
                    <View style={styles.riskRewardItem}>
                      <Text style={styles.riskRewardLabel}>Max Profit</Text>
                      <Text style={[styles.riskRewardValue, { color: colors.bullish }]}>
                        {strategy.maxProfit}
                      </Text>
                    </View>
                  )}
                  {strategy.maxLoss && (
                    <View style={styles.riskRewardItem}>
                      <Text style={styles.riskRewardLabel}>Max Loss</Text>
                      <Text style={[styles.riskRewardValue, { color: colors.bearish }]}>
                        {strategy.maxLoss}
                      </Text>
                    </View>
                  )}
                  {strategy.breakeven && (
                    <View style={styles.riskRewardItem}>
                      <Text style={styles.riskRewardLabel}>Breakeven</Text>
                      <Text style={styles.riskRewardValue}>{strategy.breakeven}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Payoff Diagram */}
            {strategyConfig && !strategy.hidePayoffChart && (
              <PayoffChart
                legs={strategyConfig.legs}
                currentPrice={strategyConfig.defaultStockPrice}
                title="Payoff at Expiration"
                interactive={true}
                showTimeSlider={true}
                touchToInspect={true}
                showProbabilityZones={true}
              />
            )}

            {/* Nuance */}
            {strategy.nuance && (
              <View style={[styles.card, styles.nuanceCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="flash-outline" size={20} color={colors.neon.cyan} />
                  <Text style={styles.cardTitle}>Key Insight</Text>
                </View>
                <Text style={styles.nuanceText}>{strategy.nuance}</Text>
              </View>
            )}

            {/* Try It Button */}
            {!strategy.hideSimulator && (
              <TouchableOpacity style={styles.tryItButton}>
                <Text style={styles.tryItButtonText}>Try in Paper Trading</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {!isLocked && activeTab === 'greeks' && (
          <View style={styles.tabContent}>
            {/* Greeks Overview */}
            {strategy.greeks && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="analytics-outline" size={20} color={colors.neon.cyan} />
                  <Text style={styles.cardTitle}>The Greeks</Text>
                </View>
                <View style={styles.greeksGrid}>
                  <View style={styles.greekItem}>
                    <Text style={styles.greekLabel}>Delta (Δ)</Text>
                    <Text style={styles.greekValue}>{strategy.greeks.delta}</Text>
                  </View>
                  <View style={styles.greekItem}>
                    <Text style={styles.greekLabel}>Gamma (Γ)</Text>
                    <Text style={styles.greekValue}>{strategy.greeks.gamma}</Text>
                  </View>
                  <View style={styles.greekItem}>
                    <Text style={styles.greekLabel}>Theta (Θ)</Text>
                    <Text style={styles.greekValue}>{strategy.greeks.theta}</Text>
                  </View>
                  <View style={styles.greekItem}>
                    <Text style={styles.greekLabel}>Vega (ν)</Text>
                    <Text style={styles.greekValue}>{strategy.greeks.vega}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Greek Insights - from education */}
            {strategy.education?.greekInsights && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="bulb-outline" size={20} color={colors.neon.purple} />
                  <Text style={styles.cardTitle}>Greek Insights</Text>
                </View>
                <View style={styles.insightsContainer}>
                  <View style={styles.insightItem}>
                    <View style={[styles.insightIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                      <Text style={[styles.insightIconText, { color: colors.bullish }]}>Δ</Text>
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Delta</Text>
                      <Text style={styles.insightText}>{strategy.education.greekInsights.delta}</Text>
                    </View>
                  </View>

                  <View style={styles.insightItem}>
                    <View style={[styles.insightIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                      <Text style={[styles.insightIconText, { color: colors.neutral }]}>Γ</Text>
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Gamma</Text>
                      <Text style={styles.insightText}>{strategy.education.greekInsights.gamma}</Text>
                    </View>
                  </View>

                  <View style={styles.insightItem}>
                    <View style={[styles.insightIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                      <Text style={[styles.insightIconText, { color: colors.bearish }]}>Θ</Text>
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Theta</Text>
                      <Text style={styles.insightText}>{strategy.education.greekInsights.theta}</Text>
                    </View>
                  </View>

                  <View style={styles.insightItem}>
                    <View style={[styles.insightIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                      <Text style={[styles.insightIconText, { color: colors.warning }]}>ν</Text>
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightLabel}>Vega</Text>
                      <Text style={styles.insightText}>{strategy.education.greekInsights.vega}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* No Greeks Available Message */}
            {!strategy.greeks && !strategy.education?.greekInsights && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="library-outline" size={20} color={colors.text.secondary} />
                  <Text style={styles.cardTitle}>Greeks</Text>
                </View>
                <Text style={styles.cardText}>
                  Greek analysis is not applicable to this educational module.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Quiz CTA */}
        {!isLocked && <View style={styles.quizCta}>
          <View style={styles.quizCtaContent}>
            <Ionicons name="help-circle-outline" size={32} color={colors.neon.purple} />
            <View>
              <Text style={styles.quizCtaTitle}>Test Your Knowledge</Text>
              <Text style={styles.quizCtaText}>Take the quiz to earn XP</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.quizCtaButton}>
            <Text style={styles.quizCtaButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>}
      </ScrollView>

      {/* Mark Complete Button - hidden when locked */}
      {!isLocked && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
            <Text style={styles.completeButtonXp}>+25 XP</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName={strategy.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.styles.h3,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  backButtonLarge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonLargeText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
  },
  bookmarkButton: {
    padding: spacing.xs,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tierBadgeText: {
    ...typography.styles.caption,
    color: colors.text.primary,
    fontWeight: typography.weights.bold,
  },
  outlookBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  outlookBadgeText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.overlay.medium,
  },
  categoryBadgeText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  strategyName: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  strategyTierName: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.default,
  },
  premiumGate: {
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neon.green + '30',
  },
  premiumGateIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.neon.green + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  premiumGateTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  premiumGateText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  premiumGateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...createNeonGlow(colors.neon.green, 0.3),
  },
  premiumGateButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.background.tertiary,
  },
  tabText: {
    ...typography.styles.label,
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.text.primary,
  },
  tabContent: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardEmoji: {
    fontSize: 20,
  },
  cardTitle: {
    ...typography.styles.h5,
    color: colors.text.primary,
  },
  cardText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  prosConsContainer: {
    gap: spacing.md,
  },
  prosConsCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
  },
  prosCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  consCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  prosConsTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  prosConsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  prosIcon: {
    color: colors.bullish,
    fontWeight: typography.weights.bold,
    fontSize: 16,
  },
  consIcon: {
    color: colors.bearish,
    fontWeight: typography.weights.bold,
    fontSize: 16,
  },
  prosConsText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
  },
  legsContainer: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  legItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  legAction: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  legActionText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.bold,
  },
  legDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  legQuantity: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  legType: {
    ...typography.styles.label,
  },
  legStrike: {
    ...typography.styles.mono,
    color: colors.text.secondary,
  },
  legPremium: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  riskRewardGrid: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  riskRewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskRewardLabel: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
  },
  riskRewardValue: {
    ...typography.styles.mono,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  greeksGrid: {
    gap: spacing.sm,
  },
  greekItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  greekLabel: {
    ...typography.styles.label,
    color: colors.neon.cyan,
  },
  greekValue: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
    textAlign: 'right',
  },
  exampleBox: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  exampleTitle: {
    ...typography.styles.label,
    color: colors.neon.cyan,
    marginBottom: spacing.sm,
  },
  exampleText: {
    ...typography.styles.mono,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  tryItButton: {
    backgroundColor: colors.neon.cyan,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  tryItButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  quizCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neon.purple,
  },
  quizCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quizCtaEmoji: {
    fontSize: 32,
  },
  quizCtaTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  quizCtaText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  quizCtaButton: {
    backgroundColor: colors.neon.purple,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  quizCtaButtonText: {
    ...typography.styles.buttonSm,
    color: colors.text.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neon.green,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...createNeonGlow(colors.neon.green, 0.2),
  },
  completeButtonText: {
    ...typography.styles.button,
    color: colors.background.primary,
  },
  completeButtonXp: {
    ...typography.styles.labelSm,
    color: colors.background.primary,
    opacity: 0.8,
  },
  // New styles for education content
  exampleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  exampleItem: {
    width: '45%',
    backgroundColor: colors.background.tertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  exampleLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    marginBottom: 2,
  },
  exampleValue: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  lessonsList: {
    gap: spacing.sm,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  lessonBullet: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: typography.weights.bold,
  },
  lessonText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  analogyCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  analogyText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  nuanceCard: {
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderColor: 'rgba(0, 240, 255, 0.2)',
  },
  nuanceText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: `${colors.neon.green}20`,
  },
  expandButtonText: {
    ...typography.styles.label,
    color: colors.neon.green,
    fontWeight: '600',
  },
  insightsContainer: {
    gap: spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightIconText: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    ...typography.styles.labelSm,
    color: colors.text.muted,
    marginBottom: 2,
  },
  insightText: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  // Mentor Card Styles
  mentorCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  mentorAvatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
  },
  mentorContent: {
    flex: 1,
    justifyContent: 'center',
  },
  mentorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  mentorEmoji: {
    fontSize: 20,
  },
  mentorName: {
    ...typography.styles.h5,
    fontWeight: typography.weights.bold,
  },
  mentorTitle: {
    ...typography.styles.caption,
    color: colors.text.muted,
  },
  mentorGreeting: {
    ...typography.styles.bodySm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  mentorCatchphrase: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  // Quote Card Styles
  quoteCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.neon.purple,
  },
  quoteText: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  quoteAuthor: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'right',
  },
  // Know Thyself Greek Quote Styles
  greekQuoteContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  greekText: {
    fontSize: 28,
    fontStyle: 'italic',
    color: '#39ff14', // Neon green
    textShadowColor: 'rgba(57, 255, 20, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: spacing.sm,
  },
  greekSource: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  // Rules of the Jungle Tiger Styles
  tigerContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  jungleSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  jungleHighlight: {
    color: colors.bullish,
    fontWeight: typography.weights.bold,
  },
  tigerAvatarWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#f97316', // Orange
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  tigerAvatar: {
    width: '100%',
    height: '100%',
  },
  // -----------------------------------------------------------------------
  // Live Quote Data Panel
  // -----------------------------------------------------------------------
  liveDataPanel: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  liveDataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  liveDataTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
  },
  liveDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  liveDataItem: {
    width: '46%',
    backgroundColor: colors.background.tertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  liveDataLabel: {
    ...typography.styles.caption,
    color: colors.text.muted,
    fontSize: 10,
    marginBottom: 2,
  },
  liveDataValue: {
    ...typography.styles.mono,
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
  },
  refreshText: {
    ...typography.styles.caption,
    color: colors.neon.cyan,
    fontSize: 10,
  },
  liveDataPlaceholder: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  liveDataPlaceholderText: {
    ...typography.styles.caption,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
  connectApiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.neon.cyan,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
  },
  connectApiText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: '600' as const,
  },
  // -----------------------------------------------------------------------
  // Quick-Launch Tool Buttons
  // -----------------------------------------------------------------------
  toolButtonsContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  toolButtonsTitle: {
    ...typography.styles.label,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  toolButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toolButton: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  toolButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolButtonLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontSize: 10,
    textAlign: 'center',
  },
});

export default StrategyDetailScreen;
