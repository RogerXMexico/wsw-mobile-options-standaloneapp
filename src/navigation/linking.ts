// Deep linking configuration for Wall Street Wildlife Mobile
// Handles: password reset, payment callbacks, shared trades, strategy deep links

import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

const PREFIX = 'wsw://';
const WEB_PREFIX = 'https://wallstreetwildlife.com';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [PREFIX, WEB_PREFIX],
  config: {
    screens: {
      Auth: {
        screens: {
          Landing: 'welcome',
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Dashboard: 'home',
              SocialFeed: 'social',
            },
          },
          LearnTab: {
            screens: {
              Strategies: 'learn',
              StrategyDetail: 'strategy/:strategyId',
              Quiz: 'quiz/:tier',
              LearningPathSelector: 'learning-paths',
              ChallengePaths: 'challenges',
              VideoLessons: 'videos',
              EventHorizonsHub: 'event-horizons',
            },
          },
          ToolsTab: {
            screens: {
              ToolsDashboard: 'tools',
              GreeksVisualizer: 'tools/greeks',
              PositionSizing: 'tools/position-sizing',
              RiskReward: 'tools/risk-reward',
              OptionsFlow: 'tools/options-flow',
              IVRankTool: 'tools/iv-rank',
            },
          },
          PracticeTab: {
            screens: {
              PracticeDashboard: 'practice',
              PaperTrading: 'paper-trading',
              StrategyBuilder: 'strategy-builder',
              TradeJournal: 'trade-journal',
            },
          },
          ProfileTab: {
            screens: {
              ProfileMain: 'profile',
              Leaderboard: 'leaderboard',
              Badges: 'badges',
              JungleTribes: 'tribes',
              DailyMissions: 'missions',
              Subscription: 'subscription',
            },
          },
        },
      },
    },
  },
};

export default linking;
