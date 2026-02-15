// Main Tab Navigator for Wall Street Wildlife Mobile
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, HomeStackParamList, LearnStackParamList, ToolsStackParamList, PracticeStackParamList, ProfileStackParamList } from './types';
import { colors, typography, layout, shadows } from '../theme';

// Import screens
import DashboardScreen from '../screens/home/DashboardScreen';
import SocialFeedScreen from '../screens/social/SocialFeedScreen';
import StrategiesScreen from '../screens/learn/StrategiesScreen';
import StrategyDetailScreen from '../screens/learn/StrategyDetailScreen';
import QuizScreen from '../screens/learn/QuizScreen';
import QuizResultsScreen from '../screens/learn/QuizResultsScreen';
// Tutorial screens
import OptionsVocabularyScreen from '../screens/learn/OptionsVocabularyScreen';
import FirstTradeTutorialScreen from '../screens/learn/FirstTradeTutorialScreen';
import BeginnerMistakesScreen from '../screens/learn/BeginnerMistakesScreen';
import AssignmentExerciseScreen from '../screens/learn/AssignmentExerciseScreen';
import RollingAdjustingScreen from '../screens/learn/RollingAdjustingScreen';
// Phase 4 learn screens
import LearningPathSelectorScreen from '../screens/learn/LearningPathSelectorScreen';
import ChallengePathsScreen from '../screens/learn/ChallengePathsScreen';
import VideoLessonsScreen from '../screens/learn/VideoLessonsScreen';
import ToolsDashboardScreen from '../screens/tools/ToolsDashboardScreen';
import GreeksVisualizerScreen from '../screens/tools/GreeksVisualizerScreen';
import PositionSizingScreen from '../screens/tools/PositionSizingScreen';
import RiskRewardScreen from '../screens/tools/RiskRewardScreen';
import POPCalculatorScreen from '../screens/tools/POPCalculatorScreen';
import ExpectedMoveScreen from '../screens/tools/ExpectedMoveScreen';
import IVCrushScreen from '../screens/tools/IVCrushScreen';
import IVRankToolScreen from '../screens/tools/IVRankToolScreen';
import OptionsScreenerScreen from '../screens/tools/OptionsScreenerScreen';
import WatchlistScreen from '../screens/tools/WatchlistScreen';
import OptionsSurface3DScreen from '../screens/tools/OptionsSurface3DScreen';
import OptionsFlowScreen from '../screens/tools/OptionsFlowScreen';
import PracticeDashboardScreen from '../screens/practice/PracticeDashboardScreen';
import PaperTradingScreen from '../screens/practice/PaperTradingScreen';
import StrategyBuilderScreen from '../screens/practice/StrategyBuilderScreen';
import TradeJournalScreen from '../screens/practice/TradeJournalScreen';
// Profile screens
import {
  ProfileMainScreen,
  JungleAcademyScreen,
  SpiritAnimalQuizScreen,
  LeaderboardScreen,
  BadgesScreen,
  JungleTribesScreen,
  DailyMissionsScreen,
} from '../screens/profile';
// Settings screens
import {
  EditProfileScreen,
  NotificationSettingsScreen,
  AppearanceSettingsScreen,
  SubscriptionScreen,
  PrivacySettingsScreen,
  AboutScreen,
} from '../screens/settings';
// Event Horizons screens
import {
  EventHorizonsHubScreen,
  EventHorizonsLessonsScreen,
  LessonDetailScreen,
  PredictionScannerScreen,
  GapAnalyzerScreen,
  EventReplayScreen,
  EventHorizonsPaperTradingScreen,
  EventHorizonsProgressScreen,
  AISignalAnalyzerScreen,
  EarningsCalendarScreen,
  OptionsChainViewerScreen,
} from '../screens/eventHorizons';
import EventHorizonsQuizScreen from '../screens/eventHorizons/EventHorizonsQuizScreen';

// Create stack navigators for each tab
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const LearnStack = createNativeStackNavigator<LearnStackParamList>();
const ToolsStack = createNativeStackNavigator<ToolsStackParamList>();
const PracticeStack = createNativeStackNavigator<PracticeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const Tab = createBottomTabNavigator<MainTabParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background.primary },
  animation: 'slide_from_right' as const,
};

// Home Stack Navigator
const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
    <HomeStack.Screen name="SocialFeed" component={SocialFeedScreen} />
  </HomeStack.Navigator>
);

// Learn Stack Navigator
const LearnStackNavigator: React.FC = () => (
  <LearnStack.Navigator screenOptions={screenOptions}>
    <LearnStack.Screen name="Strategies" component={StrategiesScreen} />
    <LearnStack.Screen name="StrategyDetail" component={StrategyDetailScreen} />
    <LearnStack.Screen name="Quiz" component={QuizScreen} />
    <LearnStack.Screen name="QuizResults" component={QuizResultsScreen} />
    {/* Tutorials */}
    <LearnStack.Screen name="OptionsVocabulary" component={OptionsVocabularyScreen} />
    <LearnStack.Screen name="FirstTradeTutorial" component={FirstTradeTutorialScreen} />
    <LearnStack.Screen name="BeginnerMistakes" component={BeginnerMistakesScreen} />
    <LearnStack.Screen name="AssignmentExercise" component={AssignmentExerciseScreen} />
    <LearnStack.Screen name="RollingAdjusting" component={RollingAdjustingScreen} />
    {/* Event Horizons - Tier 8 */}
    <LearnStack.Screen name="EventHorizonsHub" component={EventHorizonsHubScreen} />
    <LearnStack.Screen name="EventHorizonsLessons" component={EventHorizonsLessonsScreen} />
    <LearnStack.Screen name="LessonDetail" component={LessonDetailScreen} />
    <LearnStack.Screen name="EventHorizonsQuiz" component={EventHorizonsQuizScreen} />
    <LearnStack.Screen name="PredictionScanner" component={PredictionScannerScreen} />
    <LearnStack.Screen name="GapAnalyzer" component={GapAnalyzerScreen} />
    <LearnStack.Screen name="EventReplay" component={EventReplayScreen} />
    <LearnStack.Screen name="EventHorizonsPaperTrading" component={EventHorizonsPaperTradingScreen} />
    <LearnStack.Screen name="EventHorizonsProgress" component={EventHorizonsProgressScreen} />
    <LearnStack.Screen name="AISignalAnalyzer" component={AISignalAnalyzerScreen} />
    <LearnStack.Screen name="EarningsCalendar" component={EarningsCalendarScreen} />
    <LearnStack.Screen name="OptionsChainViewer" component={OptionsChainViewerScreen} />
    <LearnStack.Screen name="LearningPathSelector" component={LearningPathSelectorScreen} />
    <LearnStack.Screen name="ChallengePaths" component={ChallengePathsScreen} />
    <LearnStack.Screen name="VideoLessons" component={VideoLessonsScreen} />
  </LearnStack.Navigator>
);

// Tools Stack Navigator
const ToolsStackNavigator: React.FC = () => (
  <ToolsStack.Navigator screenOptions={screenOptions}>
    <ToolsStack.Screen name="ToolsDashboard" component={ToolsDashboardScreen} />
    <ToolsStack.Screen name="GreeksVisualizer" component={GreeksVisualizerScreen} />
    <ToolsStack.Screen name="PositionSizing" component={PositionSizingScreen} />
    <ToolsStack.Screen name="RiskReward" component={RiskRewardScreen} />
    <ToolsStack.Screen name="POPCalculator" component={POPCalculatorScreen} />
    <ToolsStack.Screen name="ExpectedMove" component={ExpectedMoveScreen} />
    <ToolsStack.Screen name="IVCrush" component={IVCrushScreen} />
    <ToolsStack.Screen name="IVRankTool" component={IVRankToolScreen} />
    <ToolsStack.Screen name="OptionsScreener" component={OptionsScreenerScreen} />
    <ToolsStack.Screen name="Watchlist" component={WatchlistScreen} />
    <ToolsStack.Screen name="OptionsSurface3D" component={OptionsSurface3DScreen} />
    <ToolsStack.Screen name="OptionsFlow" component={OptionsFlowScreen} />
  </ToolsStack.Navigator>
);

// Practice Stack Navigator
const PracticeStackNavigator: React.FC = () => (
  <PracticeStack.Navigator screenOptions={screenOptions}>
    <PracticeStack.Screen name="PracticeDashboard" component={PracticeDashboardScreen} />
    <PracticeStack.Screen name="PaperTrading" component={PaperTradingScreen} />
    <PracticeStack.Screen name="StrategyBuilder" component={StrategyBuilderScreen} />
    <PracticeStack.Screen name="TradeJournal" component={TradeJournalScreen} />
  </PracticeStack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator: React.FC = () => (
  <ProfileStack.Navigator screenOptions={screenOptions}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileMainScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="JungleAcademy" component={JungleAcademyScreen} />
    <ProfileStack.Screen name="SpiritAnimalQuiz" component={SpiritAnimalQuizScreen} />
    <ProfileStack.Screen name="Leaderboard" component={LeaderboardScreen} />
    <ProfileStack.Screen name="Badges" component={BadgesScreen} />
    <ProfileStack.Screen name="JungleTribes" component={JungleTribesScreen} />
    <ProfileStack.Screen name="DailyMissions" component={DailyMissionsScreen} />
    {/* Settings screens */}
    <ProfileStack.Screen name="Subscription" component={SubscriptionScreen} />
    <ProfileStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    <ProfileStack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} />
    <ProfileStack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
    <ProfileStack.Screen name="About" component={AboutScreen} />
  </ProfileStack.Navigator>
);

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.neon.green,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconWrapper}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
              {focused && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: colors.neon.green },
                    shadows.neonGreenSubtle,
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="LearnTab"
        component={LearnStackNavigator}
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconWrapper}>
              <Ionicons name={focused ? 'book' : 'book-outline'} size={24} color={color} />
              {focused && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: colors.neon.green },
                    shadows.neonGreenSubtle,
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ToolsTab"
        component={ToolsStackNavigator}
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconWrapper}>
              <Ionicons name={focused ? 'construct' : 'construct-outline'} size={24} color={color} />
              {focused && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: colors.neon.green },
                    shadows.neonGreenSubtle,
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="PracticeTab"
        component={PracticeStackNavigator}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconWrapper}>
              <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={24} color={color} />
              {focused && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: colors.neon.green },
                    shadows.neonGreenSubtle,
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconWrapper}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
              {focused && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: colors.neon.green },
                    shadows.neonGreenSubtle,
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.primary,
    borderTopColor: colors.glass.border,
    borderTopWidth: 1,
    height: layout.tabBarHeight,
    paddingBottom: layout.tabBarPaddingBottom,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    marginTop: 4,
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  tabIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    position: 'absolute',
    bottom: -8,
  },
});

export default MainTabNavigator;
