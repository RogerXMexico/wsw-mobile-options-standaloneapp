// Lesson Detail Screen
// Display individual Event Horizons lesson content
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { GlowButton } from '../../components/ui';
import { InlineIcon } from '../../components/ui/InlineIcon';
import { EventHorizonsStackParamList } from '../../navigation/types';
import { EVENT_HORIZONS_LESSONS, EVENT_HORIZONS_QUIZ_QUESTIONS } from '../../data/eventHorizonsLessons';
import { getQuizByLessonId } from '../../data/eventHorizonsQuizzes';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<EventHorizonsStackParamList>;
type RouteType = RouteProp<EventHorizonsStackParamList, 'LessonDetail'>;

const getMentorInfo = (mentor: string) => {
  switch (mentor) {
    case 'chameleon':
      return { animal: 'chameleon', name: 'Chameleon', color: '#8b5cf6', gradient: ['#8b5cf6', '#14b8a6'] };
    case 'cheetah':
      return { animal: 'cheetah', name: 'Cheetah', color: '#f59e0b', gradient: ['#f59e0b', '#ef4444'] };
    case 'owl':
      return { animal: 'owl', name: 'Owl', color: '#3b82f6', gradient: ['#3b82f6', '#8b5cf6'] };
    default:
      return { animal: 'chameleon', name: 'Chameleon', color: '#8b5cf6', gradient: ['#8b5cf6', '#14b8a6'] };
  }
};

// Lesson content sections (ported from desktop HTML to mobile format)
const LESSON_CONTENT: Record<string, { sections: { title: string; content: string; icon?: string }[] }> = {
  'eh-lesson-1': {
    sections: [
      {
        title: 'Two Markets, One Hunter',
        icon: 'globe-outline',
        content: 'Most options traders only watch one market. The Chameleon watches two—and sees opportunities others miss entirely.\n\n"The jungle whispers before it roars. Prediction markets are those whispers. Options prices are the roar everyone hears. The Chameleon listens to both."',
      },
      {
        title: 'The Options Jungle',
        icon: 'bar-chart-outline',
        content: 'Options prices tell you how much the market expects a stock to move. High IV means traders expect big moves. Low IV means calm seas ahead.\n\nOptions tell you: "We expect NVDA to move ±12% around earnings."\n\nThis is what you already know as an options trader.',
      },
      {
        title: 'The Prediction Jungle',
        icon: 'eye-outline',
        content: 'Prediction markets tell you the probability of specific outcomes. Not how much something will move—but which direction and how likely.\n\nPolymarket tells you: "There\'s a 78% chance NVDA beats earnings expectations."\n\nThis is what most traders ignore.',
      },
      {
        title: 'The Chameleon\'s Insight',
        icon: 'bulb-outline',
        content: 'Options tell you VOLATILITY expectations.\nPrediction markets tell you PROBABILITY estimates.\n\nWhen these two markets DISAGREE, that\'s where opportunity lives.',
      },
      {
        title: 'What is Polymarket?',
        icon: 'business-outline',
        content: 'Polymarket is a prediction market where people bet real money on the outcomes of future events. The crowd\'s collective bets create a probability estimate.\n\nEarnings: "Will TSLA beat Q4 estimates?"\nFDA Decisions: "Will Drug X get approved?"\nFed Decisions: "Will the Fed cut rates?"',
      },
      {
        title: 'Finding the Gap',
        icon: 'locate-outline',
        content: 'The magic happens when these two markets tell different stories:\n\n↑ LONG VOL OPPORTUNITY:\n• Polymarket: 55% beat (high uncertainty)\n• Options: IV Rank 35% (cheap)\n• Translation: Buy volatility\n\n↓ SHORT VOL OPPORTUNITY:\n• Polymarket: 85% beat (high confidence)\n• Options: IV Rank 92% (expensive)\n• Translation: Sell volatility',
      },
      {
        title: 'Key Takeaways',
        icon: 'checkmark-circle-outline',
        content: '1. Options measure expected volatility (how much will it move?)\n\n2. Prediction markets measure outcome probability (what will happen?)\n\n3. When they disagree, opportunity exists\n\n4. The Chameleon reads both markets to find edge',
      },
    ],
  },
  'eh-lesson-2': {
    sections: [
      {
        title: 'The Earnings Arena',
        icon: 'bar-chart-outline',
        content: 'Earnings season is the jungle\'s most exciting hunt. Every quarter, companies reveal their numbers—and fortunes are made or lost in minutes.\n\n"Speed kills—hesitation kills faster. But the fastest cheetah still scouts the prey before the sprint." — Chase the Cheetah',
      },
      {
        title: 'Earnings on Polymarket',
        icon: 'locate-outline',
        content: 'Polymarket creates markets for major earnings:\n\n"Will NVIDIA beat Q4 2024 earnings expectations?"\n\nYES (Beat): 78%\nNO (Miss): 22%\n\nIMPORTANT: "Beat expectations" means EPS exceeds Wall Street consensus. It does NOT predict stock direction.',
      },
      {
        title: 'The Three Scenarios',
        icon: 'list-outline',
        content: 'HIGH CONFIDENCE BEAT:\nPolymarket 75%+ YES, Company beats\nStock moves in expected direction, magnitude depends on beat size.\n\nCONFIDENT BUT WRONG:\nPolymarket 75%+ YES, Company misses\nMaximum surprise = Maximum move. Put buyers feast.\n\nTHE TOSS-UP:\nPolymarket 45-55%\nTrue uncertainty. Long volatility shines here.',
      },
      {
        title: 'The Gap Framework',
        icon: 'resize-outline',
        content: 'Near 50% + Low IV (<40%) = Long Vol\n→ Straddles, Strangles\n\nHigh confidence (75%+) + Very High IV (>80%) = Short Vol\n→ Iron Condor, Put Spread\n\nModerate + Moderate = Neutral\n→ No clear edge\n\nHigh confidence + Low IV = Directional\n→ Debit spread in direction',
      },
      {
        title: 'Beat ≠ Stock Goes Up',
        icon: 'warning-outline',
        content: 'CRITICAL WARNING:\n\nPolymarket predicts the reported number vs estimates. It does NOT predict stock direction.\n\n• Beat and DROP: Bad guidance, "priced in" (META Q2 2024: beat but -5%)\n\n• Miss and RISE: Low expectations, good guidance',
      },
      {
        title: 'IV Crush: The Certainty',
        icon: 'flash-outline',
        content: 'One thing is ALWAYS certain: IV crushes after the event. Once news is out, uncertainty disappears—option prices collapse.\n\nExample:\n92% IV Day Before → 45% IV Day After\n\nFactor this into every earnings play.',
      },
      {
        title: 'Key Takeaways',
        icon: 'checkmark-circle-outline',
        content: '1. Polymarket shows beat/miss probability, not stock direction\n\n2. High uncertainty + Low IV = Long volatility opportunity\n\n3. High confidence + High IV = Short volatility opportunity\n\n4. IV crush is GUARANTEED—factor it into every play',
      },
    ],
  },
  'eh-lesson-3': {
    sections: [
      {
        title: 'Binary Catalysts',
        icon: 'medkit-outline',
        content: 'FDA decisions are the jungle\'s most dangerous game. One word—"approved" or "rejected"—can move a stock 50% or more. There is no middle ground.',
      },
      {
        title: 'The Binary Difference',
        icon: 'scale-outline',
        content: 'Earnings have shades of gray. FDA decisions are PURELY BINARY:\n\nAPPROVED\nStock gaps up 30-100%\nThe drug can be sold\n\nREJECTED\nStock crashes 40-80%\nYears of R&D wasted',
      },
      {
        title: 'Extreme IV Territory',
        icon: 'flame-outline',
        content: 'Biotech FDA events have the HIGHEST IV in the market:\n\n250%+ IV Before Event\n±45% Expected Move\n70%+ IV Crush After\n\nThe IV is high for a reason.',
      },
      {
        title: 'Polymarket\'s Role',
        icon: 'bar-chart-outline',
        content: 'Polymarket shows approval probability based on:\n\nPhase 3 Data: Did the trial hit endpoints?\nAdvisory Committee: How did AdCom vote?\nComplete Response Letters: Prior FDA feedback?\n\nKey: 72% approval still means 28% chance of total loss.',
      },
      {
        title: 'The Asymmetry Problem',
        icon: 'trending-down-outline',
        content: 'FDA events are ASYMMETRIC—downside is often worse than upside is good:\n\nIf Approved: +40%\nIf Rejected: -65%\n\nWhy? Approval is partially priced in. Rejection erases years of expected revenue.',
      },
      {
        title: 'Strategy Rules',
        icon: 'ban-outline',
        content: 'NEVER Sell Naked Premium on FDA Events\nA 28% probability of -65% move can wipe out years of premium.\n\nUse Defined-Risk Structures:\n• Bull Call Spread\n• Bear Put Spread\n• Collar\n• Long Straddle',
      },
      {
        title: 'Key Takeaways',
        icon: 'checkmark-circle-outline',
        content: '1. FDA events are purely binary—approved or rejected\n\n2. IV is extreme (200%+) and IV crush is massive (70%+)\n\n3. NEVER sell naked premium on binary biotech events\n\n4. Use defined-risk spreads and watch AdCom meetings live',
      },
    ],
  },
  'eh-lesson-4': {
    sections: [
      {
        title: 'Macro Currents',
        icon: 'business-outline',
        content: 'The Fed speaks, and markets listen. Economic data drops, and billions move. Macro events are the ocean currents that lift or sink all boats.\n\n"Knowledge is the ultimate edge. The data speaks clearly—but the market\'s interpretation is what matters." — Oliver the Owl',
      },
      {
        title: 'Macro vs Single Stock',
        icon: 'bar-chart-outline',
        content: 'SINGLE STOCK EVENTS:\n• Affect one company\n• High IV (50-150%)\n• Large expected moves (5-15%)\n\nMACRO EVENTS:\n• Affect ALL markets\n• Lower IV (15-30%)\n• Smaller expected moves (1-3%)\n• Use index options (SPY, QQQ)',
      },
      {
        title: 'Key Macro Events',
        icon: 'calendar-outline',
        content: 'FOMC Decisions\n"Will the Fed cut rates by 25bp or 50bp?"\n\nCPI/Inflation Data\n"Will CPI come in under 3%?"\n\nJobs Reports\n"Will jobs come in above 180k?"\n\nHousing Data\n"Will housing starts exceed estimates?"',
      },
      {
        title: 'Good News Is Bad News',
        icon: 'swap-horizontal-outline',
        content: 'THE PARADOX:\n\nStrong jobs = Stocks DOWN?\nStrong economy → Fed keeps rates high → Higher rates hurt stocks\n\nWeak jobs = Stocks UP?\nWeak economy → Fed cuts rates → Lower rates help stocks\n\nKey: What matters is what it means for FED POLICY.',
      },
      {
        title: 'Index Options for Macro',
        icon: 'trending-up-outline',
        content: 'Since macro events affect all stocks, use index options:\n\nSPY - S&P 500 ETF (broad market)\nQQQ - Nasdaq 100 ETF (tech-heavy)\nIWM - Russell 2000 ETF (small cap)\n\nWatch for last-minute probability shifts—Fed Sept 2024 shifted from 85% to 65% for 25bp in final 24 hours.',
      },
      {
        title: 'Key Takeaways',
        icon: 'checkmark-circle-outline',
        content: '1. Macro events affect ALL markets—use index options\n\n2. IV is lower but still crushes after events\n\n3. "Good news" can be bad for stocks if it means tighter Fed policy\n\n4. Watch last-minute probability shifts for early signals',
      },
    ],
  },
  'eh-lesson-5': {
    sections: [
      {
        title: 'Corporate Tectonic Shifts',
        icon: 'briefcase-outline',
        content: 'Not all events are scheduled. Acquisitions, leadership changes, and product launches reshape companies—and create unique trading opportunities.',
      },
      {
        title: 'Types of Corporate Events',
        icon: 'list-outline',
        content: 'M&A EVENTS\nMergers, acquisitions, divestitures\nPolymarket: "Will the deal close?"\n\nLEADERSHIP CHANGES\nCEO/CFO departures, appointments\nOften no prediction market (surprise events)\n\nPRODUCT LAUNCHES\nNew products, services, features\nSometimes indirect markets',
      },
      {
        title: 'M&A Dynamics',
        icon: 'git-merge-outline',
        content: 'TARGET COMPANY (Being Acquired):\n• Stock trades near deal price\n• "Merger arb" spread = risk premium\n• Options have capped upside\n\nACQUIRER (Doing the Buying):\n• Often DROPS on deal announcement\n• "Sell the news" on deal close\n• Dilution concerns hurt stock',
      },
      {
        title: 'No Prediction Market?',
        icon: 'help-circle-outline',
        content: 'When there\'s no Polymarket data (surprise announcements, CEO departures):\n\nIV SPIKE (Not Crush)\nSurprise news causes IV to INCREASE\n\nEXTENDED UNCERTAINTY\nUnlike earnings, uncertainty persists for days/weeks\n\nIV-only analysis still works.',
      },
      {
        title: 'Product Launch Pattern',
        icon: 'phone-portrait-outline',
        content: 'Scheduled product events follow a pattern:\n\nPRE-EVENT: IV builds on anticipation\n↓\nEVENT DAY: Peak IV, high attention\n↓\nPOST-EVENT: IV crush if "as expected"',
      },
      {
        title: 'Key Takeaways',
        icon: 'checkmark-circle-outline',
        content: '1. M&A prediction markets focus on deal completion, not stock direction\n\n2. Acquirer stocks often DROP on deal close\n\n3. Surprise events cause IV spikes, not crush\n\n4. When no prediction market exists, IV-only analysis still works',
      },
    ],
  },
  'eh-lesson-6': {
    sections: [
      {
        title: 'The Gap Hunter\'s Toolkit',
        icon: 'locate-outline',
        content: 'You\'ve learned the theory. Now it\'s time to master the tools. The Gap Analyzer shows you exactly where prediction markets and options disagree.\n\n"Knowledge is the ultimate edge." — Oliver the Owl',
      },
      {
        title: 'Understanding Gap Score',
        icon: 'bar-chart-outline',
        content: 'Gap Score (0-1) measures disagreement:\n\n0.7+ HIGH GAP\nStrong disagreement = potential opportunity\n\n0.4-0.7 MODERATE GAP\nWorth monitoring, needs more analysis\n\n<0.4 LOW GAP\nMarkets aligned = limited edge',
      },
      {
        title: 'Long Volatility Zone',
        icon: 'arrow-up-outline',
        content: 'CONDITION:\nHigh uncertainty (Polymarket near 50%) + Low IV\n\nSIGNAL:\nOptions may be underpricing the potential move\n\nSTRATEGIES:\nStraddles, Strangles, Long Calls/Puts\n\n"The crowd doesn\'t know what will happen, but options are cheap. Buy volatility."',
      },
      {
        title: 'Short Volatility Zone',
        icon: 'arrow-down-outline',
        content: 'CONDITION:\nHigh confidence (near 0% or 100%) + High IV\n\nSIGNAL:\nOptions may be overpricing the expected move\n\nSTRATEGIES:\nIron Condors, Credit Spreads, Butterflies\n\n"The crowd is confident, but options are expensive. Sell volatility."',
      },
      {
        title: 'Reading the Chart',
        icon: 'trending-up-outline',
        content: 'X-AXIS: Polymarket Probability\n0% = confident miss\n50% = uncertain\n100% = confident beat\n\nY-AXIS: IV Rank\n0% = cheap options\n100% = expensive options\n\nClick any point for full case study.',
      },
      {
        title: 'The No Edge Zone',
        icon: 'remove-outline',
        content: 'When Gap Score < 0.4, markets are aligned:\n\n• Options are fairly priced\n• Neither long nor short vol has clear edge\n• Sometimes the best trade is NO TRADE\n\nExample: GOOGL Q4 2024 — 65% beat, IV rank 52%. Markets agreed. Actual move was within expected range.',
      },
      {
        title: 'Key Takeaways',
        icon: 'checkmark-circle-outline',
        content: '1. Gap Score 0.7+ = significant opportunity\n\n2. Uncertainty + Low IV = Long vol zone\n\n3. Confidence + High IV = Short vol zone\n\n4. Low Gap Score = no clear edge, consider sitting out',
      },
    ],
  },
  'eh-lesson-7': {
    sections: [
      {
        title: 'Resolution & The Crush',
        icon: 'timer-outline',
        content: 'You\'ve found the gap. You know your strategy. Now the critical question: when exactly do you enter, and when do you exit?\n\n"The cheetah doesn\'t chase all day. It waits, stalks, and strikes at exactly the right moment." — Chase the Cheetah',
      },
      {
        title: 'The Event Timeline',
        icon: 'calendar-outline',
        content: '1. T-7 to T-3: BUILD PHASE\nIV starts building. Polymarket stable. Good time for long vol entries.\n\n2. T-2 to T-1: PEAK IV\nIV reaches maximum. Last chance for short vol. Watch for probability shifts.\n\n3. EVENT DAY: RESOLUTION\nNews breaks. Stock gaps. IV crushes. Polymarket resolves.\n\n4. T+1: POST-EVENT\nIV continues falling. Time to close and assess.',
      },
      {
        title: 'Entry Timing',
        icon: 'locate-outline',
        content: 'LONG VOLATILITY (Straddles, Strangles):\n• Enter: T-7 to T-5 (before IV peak)\n• Why: Buy before IV spikes to max\n• Exit: Within first hour after event\n\nSHORT VOLATILITY (Iron Condors, Spreads):\n• Enter: T-2 to T-1 (at peak IV)\n• Why: Maximize premium collected\n• Exit: Let IV crush work, close T+1',
      },
      {
        title: 'IV Crush Magnitude',
        icon: 'flash-outline',
        content: 'Higher pre-event IV = larger crush:\n\nLow IV (30-50%): -15 to -25%\nMedium IV (60-90%): -35 to -50%\nHigh IV (100%+): -50 to -75%\n\nIV crush is immediate and significant.',
      },
      {
        title: 'Common Mistakes',
        icon: 'close-circle-outline',
        content: 'Buying straddles at peak IV\nYou pay max premium. IV crush hurts even if direction is right.\n\nHolding through event without a plan\nKnow your exit before you enter. Set price alerts.\n\nIgnoring after-hours moves\nMany earnings happen AMC. Stock gaps before you can trade options.',
      },
      {
        title: 'Key Takeaways',
        icon: 'checkmark-circle-outline',
        content: '1. Enter long vol EARLY (T-7 to T-5) before IV peaks\n\n2. Enter short vol LATE (T-2 to T-1) at peak IV\n\n3. IV crush is immediate and significant—plan exits accordingly\n\n4. Have your exit plan BEFORE the event, not during',
      },
    ],
  },
  'eh-lesson-8': {
    sections: [
      {
        title: 'Event Horizons Mastery',
        icon: 'trophy-outline',
        content: 'You\'ve learned to see two markets. You\'ve studied the patterns. Now prove your mastery and earn your place among the Chameleon\'s hunters.',
      },
      {
        title: 'Your Journey',
        icon: 'book-outline',
        content: 'What you\'ve learned:\n\nTwo Markets: Probability + Volatility\n4 Event Types: Earnings, FDA, Macro, Corporate\nGap Analysis: Finding opportunity zones\nTiming: Entry, exit, IV crush',
      },
      {
        title: 'The Mastery Challenge',
        icon: 'locate-outline',
        content: 'To earn the CHAMELEON APPRENTICE badge:\n\n1. Pass the Assessment Quiz\nAnswer 8/10 questions correctly\n\n2. Identify 3 Gaps\nFind events with Gap Score > 0.5\n\n3. Complete 3 Event Replays\nStep through earnings, FDA, and macro events\n\n4. Paper Trade 3 Events\nUse the simulator to execute trades',
      },
      {
        title: 'Cameron\'s Final Words',
        icon: 'chatbubble-outline',
        content: '"You came to the jungle seeing one market. Now you see two. That\'s not just knowledge—it\'s an edge. The crowd watches options OR prediction markets. You watch both. Use this power wisely, young hunter."\n\n— Cameron the Chameleon',
      },
      {
        title: 'The Chameleon\'s Rules',
        icon: 'document-text-outline',
        content: '1. Never trade events blind—check both markets\n\n2. Respect the crowd\'s wisdom, but verify with options\n\n3. IV crush is certain; direction is not\n\n4. Resolution timing is everything',
      },
      {
        title: 'Chameleon Apprentice',
        icon: 'ribbon-outline',
        content: 'Complete all challenges to unlock the Chameleon Apprentice badge!\n\nThis badge recognizes your mastery of dual-market analysis and event-based trading strategies.\n\nYou are now ready to hunt in both jungles.',
      },
    ],
  },
};

const LessonDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { lessonId } = route.params;

  const lesson = useMemo(
    () => EVENT_HORIZONS_LESSONS.find((l) => l.id === lessonId),
    [lessonId]
  );

  const quizQuestions = useMemo(
    () => EVENT_HORIZONS_QUIZ_QUESTIONS.filter((q) => q.lessonId === lessonId),
    [lessonId]
  );

  // Get new quiz data
  const lessonQuiz = useMemo(() => getQuizByLessonId(lessonId), [lessonId]);

  const content = LESSON_CONTENT[lessonId] || { sections: [] };
  const [currentSection, setCurrentSection] = useState(0);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
          <GlowButton title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const mentor = getMentorInfo(lesson.mentor);
  const totalSections = content.sections.length;
  const isLastSection = currentSection === totalSections - 1;
  const hasQuiz = !!lessonQuiz || quizQuestions.length > 0;

  const handleNext = () => {
    if (isLastSection) {
      if (hasQuiz) {
        // Navigate to quiz
        navigation.navigate('EventHorizonsQuiz', { lessonId });
      } else {
        navigation.goBack();
      }
    } else {
      setCurrentSection((prev) => Math.min(prev + 1, totalSections - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Lesson {lesson.number}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {lesson.title}
          </Text>
        </View>
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {currentSection + 1}/{totalSections}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={mentor.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              { width: `${((currentSection + 1) / totalSections) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mentor Card */}
        <LinearGradient
          colors={[`${mentor.color}30`, 'transparent']}
          style={styles.mentorCard}
        >
          <View style={styles.mentorRow}>
            <LinearGradient colors={mentor.gradient as [string, string]} style={styles.mentorAvatar}>
              <InlineIcon name={mentor.animal} size={28} />
            </LinearGradient>
            <View style={styles.mentorInfo}>
              <Text style={styles.mentorName}>{mentor.name} says:</Text>
              <Text style={styles.mentorQuote}>
                {lesson.number === 1
                  ? '"Welcome to Event Horizons. Let me show you how to see what others miss."'
                  : `"Let's dive into ${lesson.title.toLowerCase()}."`}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content Section */}
        {content.sections.length > 0 ? (
          <View style={styles.contentCard}>
            <View style={styles.sectionHeader}>
              {content.sections[currentSection].icon && (
                <Ionicons
                  name={content.sections[currentSection].icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={mentor.color}
                />
              )}
              <Text style={styles.sectionTitle}>
                {content.sections[currentSection].title}
              </Text>
            </View>
            <Text style={styles.sectionContent}>
              {content.sections[currentSection].content}
            </Text>
          </View>
        ) : (
          <View style={styles.contentCard}>
            <Text style={styles.sectionTitle}>{lesson.title}</Text>
            <Text style={styles.sectionContent}>{lesson.subtitle}</Text>
            <View style={styles.objectivesList}>
              <Text style={styles.objectivesTitle}>Learning Objectives:</Text>
              {lesson.objectives.map((objective, index) => (
                <View key={index} style={styles.objectiveItem}>
                  <Text style={styles.objectiveBullet}>•</Text>
                  <Text style={styles.objectiveText}>{objective}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Section Dots */}
        {totalSections > 1 && (
          <View style={styles.dotsContainer}>
            {content.sections.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  index === currentSection && styles.dotActive,
                  index === currentSection && { backgroundColor: mentor.color },
                ]}
                onPress={() => setCurrentSection(index)}
              />
            ))}
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresRow}>
          {lesson.hasQuiz && (
            <View style={[styles.featureBadge, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
              <Ionicons name="document-text-outline" size={14} color="#8b5cf6" />
              <Text style={[styles.featureText, { color: '#8b5cf6' }]}>Quiz Available</Text>
            </View>
          )}
          {lesson.hasSimulation && (
            <View style={[styles.featureBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <Ionicons name="game-controller-outline" size={14} color="#f59e0b" />
              <Text style={[styles.featureText, { color: '#f59e0b' }]}>Simulation</Text>
            </View>
          )}
          {lesson.hasTool && (
            <View style={[styles.featureBadge, { backgroundColor: 'rgba(20, 184, 166, 0.2)' }]}>
              <Ionicons name="build-outline" size={14} color="#14b8a6" />
              <Text style={[styles.featureText, { color: '#14b8a6' }]}>Tool Access</Text>
            </View>
          )}
        </View>

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, currentSection === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentSection === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentSection === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonPrimary]}
          onPress={handleNext}
        >
          <LinearGradient
            colors={mentor.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.navButtonGradient}
          >
            <Text style={styles.navButtonPrimaryText}>
              {isLastSection ? (hasQuiz ? 'Take Quiz' : 'Complete') : 'Next →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  progressIndicator: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: '#8b5cf6',
  },
  progressBarContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  mentorCard: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mentorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorEmoji: {
    fontSize: 28, // kept for layout spacing
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  mentorQuote: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  contentCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  sectionContent: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  objectivesList: {
    marginTop: spacing.lg,
  },
  objectivesTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  objectiveBullet: {
    fontSize: typography.sizes.md,
    color: '#8b5cf6',
    marginRight: spacing.sm,
  },
  objectiveText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 24,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  featureIcon: {
    fontSize: 14,
  },
  featureText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
  },
  navigationBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonPrimary: {
    backgroundColor: 'transparent',
    padding: 0,
    overflow: 'hidden',
  },
  navButtonGradient: {
    width: '100%',
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  navButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
  },
  navButtonTextDisabled: {
    color: colors.text.muted,
  },
  navButtonPrimaryText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.medium,
    color: colors.text.muted,
    marginBottom: spacing.lg,
  },
});

export default LessonDetailScreen;
