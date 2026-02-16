// Navigation types for Wall Street Wildlife Mobile
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Root stack params
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
};

// Auth stack params
export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main tab params
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  LearnTab: NavigatorScreenParams<LearnStackParamList>;
  ToolsTab: NavigatorScreenParams<ToolsStackParamList>;
  PracticeTab: NavigatorScreenParams<PracticeStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Home stack params
export type HomeStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
  SocialFeed: undefined;
};

// Learn stack params
export type LearnStackParamList = {
  Strategies: undefined;
  StrategyDetail: { strategyId: string };
  StrategyTier: { tier: number; tierName: string };
  Quiz: { tierId: number; strategyId?: string };
  QuizResults: { score: number; total: number; tierId: number };
  OptionsVocabulary: undefined;
  OptionChainTutorial: undefined;
  FirstTradeTutorial: undefined;
  AssignmentExercise: undefined;
  BeginnerMistakes: undefined;
  RollingAdjusting: undefined;
  // Event Horizons (Tier 8)
  EventHorizonsHub: undefined;
  EventHorizonsLessons: undefined;
  LessonDetail: { lessonId: string };
  EventHorizonsQuiz: { lessonId: string };
  PredictionScanner: undefined;
  GapAnalyzer: undefined;
  EventReplay: { eventId?: string };
  EventHorizonsPaperTrading: undefined;
  EventHorizonsProgress: undefined;
  AISignalAnalyzer: undefined;
  EarningsCalendar: undefined;
  OptionsChainViewer: { ticker?: string };
  // Options Encyclopedia
  OptionsEncyclopedia: undefined;
  // Phase 4 additions
  LearningPathSelector: undefined;
  ChallengePaths: undefined;
  VideoLessons: undefined;
};

// Event Horizons stack params (for nested navigation)
export type EventHorizonsStackParamList = {
  EventHorizonsHub: undefined;
  EventHorizonsLessons: undefined;
  LessonDetail: { lessonId: string };
  EventHorizonsQuiz: { lessonId: string };
  PredictionScanner: undefined;
  GapAnalyzer: undefined;
  EventReplay: { eventId?: string };
  EventHorizonsPaperTrading: undefined;
  EventHorizonsProgress: undefined;
  AISignalAnalyzer: undefined;
  EarningsCalendar: undefined;
  OptionsChainViewer: { ticker?: string };
};

// Tools stack params
export type ToolsStackParamList = {
  ToolsDashboard: undefined;
  GreeksVisualizer: undefined;
  PositionSizing: undefined;
  POPCalculator: undefined;
  ExpectedMove: undefined;
  IVCrush: undefined;
  RiskReward: undefined;
  IVRankTool: undefined;
  OptionsScreener: undefined;
  OptionsChain: { ticker?: string };
  Watchlist: undefined;
  OptionsSurface3D: undefined;
  OptionsFlow: undefined;
  ProfitCalculator: undefined;
};

// Practice stack params
export type PracticeStackParamList = {
  PracticeDashboard: undefined;
  PaperTrading: undefined;
  StrategyBuilder: undefined;
  TradeJournal: undefined;
};

// Profile stack params
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  JungleAcademy: undefined;
  SpiritAnimalQuiz: undefined;
  Leaderboard: undefined;
  Badges: undefined;
  BadgeDetail: { badgeId: string };
  DailyMissions: undefined;
  JungleTribes: undefined;
  TribeDetail: { tribeId: string };
  // Settings screens
  Subscription: undefined;
  NotificationSettings: undefined;
  AppearanceSettings: undefined;
  PrivacySettings: undefined;
  About: undefined;
};

// Screen props types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

export type LearnStackScreenProps<T extends keyof LearnStackParamList> =
  NativeStackScreenProps<LearnStackParamList, T>;

export type ToolsStackScreenProps<T extends keyof ToolsStackParamList> =
  NativeStackScreenProps<ToolsStackParamList, T>;

export type PracticeStackScreenProps<T extends keyof PracticeStackParamList> =
  NativeStackScreenProps<PracticeStackParamList, T>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>;

export type EventHorizonsStackScreenProps<T extends keyof EventHorizonsStackParamList> =
  NativeStackScreenProps<EventHorizonsStackParamList, T>;

// Declare global for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
