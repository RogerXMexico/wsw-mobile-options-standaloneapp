// Types for Wall Street Wildlife Mobile App
// Ported from web app with mobile-specific additions

export type StrategyTier = 0 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export enum Outlook {
  BULLISH = "Bullish",
  BEARISH = "Bearish",
  NEUTRAL = "Neutral",
  VOLATILE = "Volatile",
  EDUCATIONAL = "Educational",
  RANGE = "Range",
  EXPLOSIVE = "Explosive"
}

export interface OptionLeg {
  type: 'call' | 'put' | 'stock';
  action: 'buy' | 'sell';
  strikeOffset?: number; // relative to stock price 100. e.g. 10 = 110 strike
  quantity: number;
  expirationOffset?: number; // days difference for calendar/diagonal spreads
}

// Trade scenario path for Discovery Mode walkthrough
export interface TradeDay {
  day: number;
  stockPrice: number;
  optionValue: number;
  pnlPercent: number;
  pnlDollar: number;
  narrative: string;
}

export interface TradePath {
  id: string;
  name: string;           // "The Rocket", "The Slow Bleed"
  description: string;    // What happens in this scenario
  days: TradeDay[];
  outcome: 'win' | 'loss' | 'breakeven';
  keyLesson: string;
}

// Extended strategy with educational content
export interface StrategyEducation {
  whatItDoes: string;           // Core concept explanation
  realWorldExample?: {
    ticker: string;
    stockPrice: number;
    strikePrice: number;
    premium: number;
    expiration: string;
  };
  tradePaths?: TradePath[];     // 3-4 scenarios for trade walkthrough
  keyLessons: string[];         // What you learn
  greekInsights?: {
    delta: string;
    theta: string;
    vega: string;
    gamma: string;
  };
}

export interface Strategy {
  id: string;
  name: string;
  tier: number;
  tierName?: string;
  category?: 'basic' | 'income' | 'directional' | 'volatility' | 'hedging' | 'educational' | 'tools';
  outlook: string;
  objective?: string;
  riskLevel?: 'defined' | 'reduced' | 'undefined' | 'significant' | 'unlimited';
  risk?: string;
  maxProfit?: string;
  maxLoss?: string;
  breakeven?: string;
  description: string;
  whenToUse?: string;
  advantages?: string[];
  disadvantages?: string[];
  greeks?: {
    delta: string;
    gamma: string;
    theta: string;
    vega: string;
  };
  isPremium: boolean;
  // Strategy legs for payoff charts
  legs?: OptionLeg[];
  // Rich educational content
  education?: StrategyEducation;
  analogy?: string;
  nuance?: string;
  example?: string;
  bestUsedWhen?: string;
  // Display controls
  hideSimulator?: boolean;
  hideAnalyst?: boolean;
  hidePayoffChart?: boolean;
  estimatedReadTime?: number;
}

export interface TierInfo {
  tier: StrategyTier;
  name: string;
  color: string;
  description?: string;
  strategyCount?: number;
  isEventHorizons?: boolean;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: string;
}

// Quiz types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  strategyId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  tierId: number;
  tierName: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  xpReward: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  completedAt: Date;
  xpEarned: number;
}

// User & Progress types
export interface UserProgress {
  completedStrategies: string[];
  completedQuizzes: string[];
  currentTier: number;
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  badges: string[];
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarAnimal?: AnimalMascot;
  createdAt: string;
  subscriptionTier: 'free' | 'premium' | 'pro';
  progress: UserProgress;
}

// Animal mascots
export type AnimalMascot =
  | 'owl'       // Wisdom/Fundamentals
  | 'bull'      // Bullish strategies
  | 'bear'      // Bearish strategies
  | 'fox'       // Advanced tactics
  | 'eagle'     // Portfolio overview
  | 'badger'    // Moderate risk
  | 'monkey'    // Higher risk/swing
  | 'sloth'     // Conservative
  | 'tiger'     // Aggressive
  | 'chameleon' // Event Horizons - Adapts to market conditions
  | 'cheetah';  // Fast execution

export interface MascotInfo {
  id: AnimalMascot;
  name: string;
  description: string;
  specialty: string;
  riskLevel: 'low' | 'moderate' | 'high';
  color: string;
}

// Paper Trading types
export interface PaperTrade {
  id: string;
  symbol: string;
  type: 'call' | 'put' | 'stock';
  action: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  strikePrice?: number;
  expirationDate?: string;
  openedAt: string;
  closedAt?: string;
  pnl: number;
  status: 'open' | 'closed';
}

export interface PaperTradingAccount {
  balance: number;
  startingBalance: number;
  openPositions: PaperTrade[];
  closedTrades: PaperTrade[];
  totalPnl: number;
  totalTrades: number;
  winRate: number;
}

// Gamification types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'learning' | 'trading' | 'streak' | 'social';
  xpValue: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'strategy' | 'trade' | 'streak';
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  expiresAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarAnimal: AnimalMascot;
  xp: number;
  level: number;
  rank: number;
  streak: number;
}

// Notification types
export interface AppNotification {
  id: string;
  type: 'streak' | 'achievement' | 'reminder' | 'market' | 'content';
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}
