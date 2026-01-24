// Event Horizons Lessons Data
// Ported from web app - educational content for prediction market + options

export interface EventHorizonsLesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  mentor: 'chameleon' | 'cheetah' | 'owl';
  estimatedMinutes: number;
  objectives: string[];
  caseStudyIds: string[];
  hasQuiz: boolean;
  hasSimulation: boolean;
  hasTool: boolean;
}

export const EVENT_HORIZONS_LESSONS: EventHorizonsLesson[] = [
  {
    id: 'eh-lesson-1',
    number: 1,
    title: 'Two Jungles, One Hunter',
    subtitle: 'Introduction to prediction markets for options traders',
    mentor: 'chameleon',
    estimatedMinutes: 15,
    objectives: [
      'Understand what prediction markets are and how they work',
      'Learn why Polymarket data matters for options traders',
      'Recognize the difference between probability and volatility',
      'See your first example of market disagreement',
    ],
    caseStudyIds: ['nvda-q4-2024', 'aapl-q1-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: false,
  },
  {
    id: 'eh-lesson-2',
    number: 2,
    title: 'Reading the Gap',
    subtitle: 'Understanding probability vs implied volatility',
    mentor: 'chameleon',
    estimatedMinutes: 20,
    objectives: [
      'Calculate the gap between prediction probability and IV',
      'Identify long-vol and short-vol opportunity zones',
      'Understand when markets are mispricing uncertainty',
      'Learn to use the Gap Analyzer tool effectively',
    ],
    caseStudyIds: ['tsla-earnings-2024', 'meta-q3-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: true,
  },
  {
    id: 'eh-lesson-3',
    number: 3,
    title: 'Event Types & Their Signatures',
    subtitle: 'Earnings, FDA, Fed, and corporate events',
    mentor: 'owl',
    estimatedMinutes: 25,
    objectives: [
      'Categorize different types of market-moving events',
      'Understand typical IV patterns for each event type',
      'Learn how prediction markets price different event types',
      'Recognize the unique signature of each event category',
    ],
    caseStudyIds: ['mrna-fda-2024', 'fed-rate-sept-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: false,
  },
  {
    id: 'eh-lesson-4',
    number: 4,
    title: 'The Chameleon Strategy',
    subtitle: 'Adapting your approach based on market conditions',
    mentor: 'chameleon',
    estimatedMinutes: 20,
    objectives: [
      'Learn when to buy volatility (straddles, strangles)',
      'Learn when to sell volatility (iron condors, butterflies)',
      'Understand how to size positions based on edge',
      'Develop a framework for trade selection',
    ],
    caseStudyIds: ['googl-earnings-2024', 'amzn-q4-2024'],
    hasQuiz: true,
    hasSimulation: true,
    hasTool: false,
  },
  {
    id: 'eh-lesson-5',
    number: 5,
    title: 'IV Crush Mechanics',
    subtitle: 'What happens to options after events resolve',
    mentor: 'cheetah',
    estimatedMinutes: 18,
    objectives: [
      'Understand why IV collapses after events',
      'Calculate expected IV crush magnitude',
      'Learn to profit from (or avoid) IV crush',
      'Compare pre-event vs post-event option values',
    ],
    caseStudyIds: ['nflx-earnings-2024', 'coin-earnings-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: true,
  },
  {
    id: 'eh-lesson-6',
    number: 6,
    title: 'Paper Trading Predictions',
    subtitle: 'Practice with real market scenarios',
    mentor: 'chameleon',
    estimatedMinutes: 30,
    objectives: [
      'Execute paper trades on historical events',
      'Track your prediction accuracy over time',
      'Build confidence before trading real money',
      'Learn from both wins and losses',
    ],
    caseStudyIds: ['spy-fomc-2024', 'qqq-cpi-2024'],
    hasQuiz: false,
    hasSimulation: true,
    hasTool: true,
  },
  {
    id: 'eh-lesson-7',
    number: 7,
    title: 'Advanced Gap Analysis',
    subtitle: 'Multi-factor edge identification',
    mentor: 'owl',
    estimatedMinutes: 25,
    objectives: [
      'Combine multiple signals for stronger conviction',
      'Understand historical gap resolution patterns',
      'Learn to weight different factors appropriately',
      'Build a systematic approach to opportunity scanning',
    ],
    caseStudyIds: ['msft-build-2024', 'aapl-wwdc-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: true,
  },
  {
    id: 'eh-lesson-8',
    number: 8,
    title: 'Risk Management for Events',
    subtitle: 'Position sizing and portfolio considerations',
    mentor: 'owl',
    estimatedMinutes: 22,
    objectives: [
      'Size event trades appropriately for your portfolio',
      'Understand maximum loss scenarios',
      'Learn when NOT to trade an event',
      'Build a diversified event trading portfolio',
    ],
    caseStudyIds: ['vix-spike-2024', 'market-crash-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: false,
  },
  {
    id: 'eh-lesson-9',
    number: 9,
    title: 'AI-Assisted Analysis',
    subtitle: 'Using the Signal Synthesizer effectively',
    mentor: 'chameleon',
    estimatedMinutes: 20,
    objectives: [
      'Understand how the AI analyzes market gaps',
      'Interpret AI-generated trading signals',
      'Combine AI insights with your own analysis',
      'Know the limitations of AI recommendations',
    ],
    caseStudyIds: ['ai-signal-example-1', 'ai-signal-example-2'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: true,
  },
  {
    id: 'eh-lesson-10',
    number: 10,
    title: 'Putting It All Together',
    subtitle: 'Building your Event Horizons workflow',
    mentor: 'chameleon',
    estimatedMinutes: 25,
    objectives: [
      'Create a daily scanning routine',
      'Build your personal event watchlist',
      'Develop a trade journaling system',
      'Graduate to live trading with confidence',
    ],
    caseStudyIds: [],
    hasQuiz: true,
    hasSimulation: true,
    hasTool: false,
  },
];

// Case study data for Event Horizons
export interface CaseStudy {
  id: string;
  title: string;
  ticker: string;
  eventType: 'earnings' | 'fda' | 'fed' | 'corporate' | 'macro';
  eventDate: string;
  predictionProbability: number;
  ivRank: number;
  outcome: 'beat' | 'miss' | 'inline' | 'approved' | 'rejected' | 'hike' | 'cut' | 'hold';
  stockMove: number; // percentage
  optimalStrategy: string;
}

export const EVENT_HORIZONS_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'nvda-q4-2024',
    title: 'NVIDIA Q4 2024 Earnings',
    ticker: 'NVDA',
    eventType: 'earnings',
    eventDate: '2024-02-21',
    predictionProbability: 82,
    ivRank: 78,
    outcome: 'beat',
    stockMove: 16.4,
    optimalStrategy: 'Long Straddle',
  },
  {
    id: 'aapl-q1-2024',
    title: 'Apple Q1 2024 Earnings',
    ticker: 'AAPL',
    eventType: 'earnings',
    eventDate: '2024-02-01',
    predictionProbability: 65,
    ivRank: 45,
    outcome: 'beat',
    stockMove: -2.8,
    optimalStrategy: 'Iron Condor',
  },
  {
    id: 'tsla-earnings-2024',
    title: 'Tesla Q1 2024 Earnings',
    ticker: 'TSLA',
    eventType: 'earnings',
    eventDate: '2024-04-23',
    predictionProbability: 45,
    ivRank: 88,
    outcome: 'miss',
    stockMove: 12.1,
    optimalStrategy: 'Long Strangle',
  },
  {
    id: 'meta-q3-2024',
    title: 'Meta Q3 2024 Earnings',
    ticker: 'META',
    eventType: 'earnings',
    eventDate: '2024-10-30',
    predictionProbability: 78,
    ivRank: 62,
    outcome: 'beat',
    stockMove: -4.1,
    optimalStrategy: 'Bull Put Spread',
  },
  {
    id: 'fed-rate-sept-2024',
    title: 'Fed Rate Decision Sept 2024',
    ticker: 'SPY',
    eventType: 'fed',
    eventDate: '2024-09-18',
    predictionProbability: 92,
    ivRank: 35,
    outcome: 'cut',
    stockMove: 1.7,
    optimalStrategy: 'Short Strangle',
  },
];

// Quiz questions for Event Horizons lessons
export interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const EVENT_HORIZONS_QUIZ_QUESTIONS: QuizQuestion[] = [
  // Lesson 1 Quiz
  {
    id: 'eh-q1-1',
    lessonId: 'eh-lesson-1',
    question: 'What do prediction markets primarily tell you?',
    options: [
      'How much a stock will move',
      'The probability of specific outcomes',
      'The current stock price',
      'Historical volatility',
    ],
    correctIndex: 1,
    explanation: 'Prediction markets tell you the probability of specific outcomes, not the magnitude of moves. That\'s what options/IV tell you.',
  },
  {
    id: 'eh-q1-2',
    lessonId: 'eh-lesson-1',
    question: 'When prediction markets and options markets disagree, this creates:',
    options: [
      'Confusion and uncertainty',
      'A signal to avoid trading',
      'Potential trading opportunities',
      'No actionable information',
    ],
    correctIndex: 2,
    explanation: 'Market disagreements often create trading opportunities. The Chameleon strategy is built on finding and exploiting these gaps.',
  },
  // Lesson 2 Quiz
  {
    id: 'eh-q2-1',
    lessonId: 'eh-lesson-2',
    question: 'A "long-vol" opportunity zone exists when:',
    options: [
      'Both probability and IV are high',
      'Probability suggests uncertainty but IV is low',
      'IV is extremely high regardless of probability',
      'The market is trending strongly',
    ],
    correctIndex: 1,
    explanation: 'Long-vol opportunities exist when prediction markets show uncertainty (probability near 50%) but options are cheap (low IV). The market may be underpricing the expected move.',
  },
  // Lesson 5 Quiz
  {
    id: 'eh-q5-1',
    lessonId: 'eh-lesson-5',
    question: 'IV crush occurs because:',
    options: [
      'The stock price dropped',
      'Event uncertainty has been resolved',
      'Option sellers closed their positions',
      'The market is bearish',
    ],
    correctIndex: 1,
    explanation: 'IV crush happens when event uncertainty resolves. Options were priced for potential large moves; once the event passes, that premium evaporates.',
  },
];
