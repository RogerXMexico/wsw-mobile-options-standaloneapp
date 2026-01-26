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
  // ============ LESSON 1 ============
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
  // ============ LESSON 2 ============
  {
    id: 'eh-lesson-2',
    number: 2,
    title: 'The Earnings Arena',
    subtitle: 'Mastering earnings events with dual-market analysis',
    mentor: 'cheetah',
    estimatedMinutes: 20,
    objectives: [
      'Understand how earnings events work on Polymarket',
      'Learn to read beat/miss probability signals',
      'Compare prediction confidence to options IV',
      'Execute your first earnings gap analysis',
    ],
    caseStudyIds: ['nvda-q4-2024', 'tsla-q3-2024', 'meta-q2-2024'],
    hasQuiz: true,
    hasSimulation: true,
    hasTool: false,
  },
  // ============ LESSON 3 ============
  {
    id: 'eh-lesson-3',
    number: 3,
    title: 'Binary Catalysts',
    subtitle: 'FDA and regulatory binary outcome strategies',
    mentor: 'chameleon',
    estimatedMinutes: 18,
    objectives: [
      'Understand binary event characteristics',
      'Learn FDA PDUFA date dynamics',
      'Recognize extreme IV environments',
      'Apply defined-risk strategies to binary outcomes',
    ],
    caseStudyIds: ['biotech-fda-approval-2024', 'biotech-fda-rejection-2024', 'advisory-committee-shift'],
    hasQuiz: true,
    hasSimulation: true,
    hasTool: false,
  },
  // ============ LESSON 4 ============
  {
    id: 'eh-lesson-4',
    number: 4,
    title: 'Macro Currents',
    subtitle: 'Fed decisions and economic events',
    mentor: 'owl',
    estimatedMinutes: 18,
    objectives: [
      'Understand macro event characteristics',
      'Learn Fed decision prediction dynamics',
      'Apply index options for macro plays',
      'Recognize "good news is bad news" scenarios',
    ],
    caseStudyIds: ['fed-rate-hold-sept-2024', 'cpi-surprise-oct-2024', 'jobs-report-miss-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: false,
  },
  // ============ LESSON 5 ============
  {
    id: 'eh-lesson-5',
    number: 5,
    title: 'Corporate Tectonic Shifts',
    subtitle: 'M&A, leadership changes, and product launches',
    mentor: 'chameleon',
    estimatedMinutes: 15,
    objectives: [
      'Understand corporate event characteristics',
      'Learn M&A completion probability dynamics',
      'Recognize events without prediction markets',
      'Apply strategies to surprise announcements',
    ],
    caseStudyIds: ['mega-tech-acquisition-2024', 'ceo-transition-2024', 'product-launch-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: false,
  },
  // ============ LESSON 6 ============
  {
    id: 'eh-lesson-6',
    number: 6,
    title: "The Gap Hunter's Toolkit",
    subtitle: 'Finding IV-probability discrepancies',
    mentor: 'owl',
    estimatedMinutes: 20,
    objectives: [
      'Master the Gap Score calculation',
      'Use the Gap Analyzer tool effectively',
      'Identify high-probability opportunities',
      'Avoid false positives and low-edge setups',
    ],
    caseStudyIds: ['nvda-q4-2024', 'googl-q4-2024'],
    hasQuiz: true,
    hasSimulation: false,
    hasTool: true,
  },
  // ============ LESSON 7 ============
  {
    id: 'eh-lesson-7',
    number: 7,
    title: 'Resolution & The Crush',
    subtitle: 'Timing entries and exits around event resolution',
    mentor: 'cheetah',
    estimatedMinutes: 18,
    objectives: [
      'Master event resolution timing',
      'Understand IV crush patterns',
      'Learn entry and exit strategies',
      'Avoid common timing mistakes',
    ],
    caseStudyIds: ['nvda-q4-2024', 'tsla-q3-2024', 'meta-q2-2024'],
    hasQuiz: true,
    hasSimulation: true,
    hasTool: false,
  },
  // ============ LESSON 8: CAPSTONE ============
  {
    id: 'eh-lesson-8',
    number: 8,
    title: 'Event Horizons Mastery',
    subtitle: 'Assessment and paper trading challenge',
    mentor: 'chameleon',
    estimatedMinutes: 25,
    objectives: [
      'Synthesize all Event Horizons concepts',
      'Complete the mastery assessment',
      'Execute paper trades across event types',
      'Earn the Chameleon Apprentice badge',
    ],
    caseStudyIds: [],
    hasQuiz: true,
    hasSimulation: true,
    hasTool: true,
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
  // Lesson 1 Quiz: Two Jungles, One Hunter
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
  // Lesson 2 Quiz: The Earnings Arena
  {
    id: 'eh-q2-1',
    lessonId: 'eh-lesson-2',
    question: 'What does Polymarket predict for earnings events?',
    options: [
      'The exact stock price after earnings',
      'Whether the company will beat earnings estimates',
      'How much IV will crush',
      'The direction the stock will move',
    ],
    correctIndex: 1,
    explanation: 'Polymarket predicts whether a company will beat earnings estimates (EPS vs consensus), NOT the stock direction. A company can beat and still drop.',
  },
  {
    id: 'eh-q2-2',
    lessonId: 'eh-lesson-2',
    question: 'High uncertainty (near 50%) + Low IV suggests:',
    options: [
      'Short volatility opportunity',
      'No trade opportunity',
      'Long volatility opportunity',
      'Directional trade only',
    ],
    correctIndex: 2,
    explanation: 'When the crowd is uncertain but options are cheap, volatility may be underpriced. This is a long vol opportunity (straddles, strangles).',
  },
  // Lesson 3 Quiz: Binary Catalysts
  {
    id: 'eh-q3-1',
    lessonId: 'eh-lesson-3',
    question: 'What makes FDA events different from earnings?',
    options: [
      'They have lower IV',
      'They are purely binary (approved/rejected)',
      'They never affect stock prices',
      'Prediction markets don\'t cover them',
    ],
    correctIndex: 1,
    explanation: 'FDA decisions are purely binary - approved or rejected. There\'s no "beat by 2%" like earnings. This creates extreme IV and asymmetric payoffs.',
  },
  {
    id: 'eh-q3-2',
    lessonId: 'eh-lesson-3',
    question: 'What should you NEVER do on FDA binary events?',
    options: [
      'Buy straddles',
      'Use defined-risk spreads',
      'Sell naked premium',
      'Watch advisory committee meetings',
    ],
    correctIndex: 2,
    explanation: 'Never sell naked premium on FDA events. A 28% probability of -65% move can wipe out years of premium. Use defined-risk strategies only.',
  },
  // Lesson 4 Quiz: Macro Currents
  {
    id: 'eh-q4-1',
    lessonId: 'eh-lesson-4',
    question: 'Why might stocks drop on a strong jobs report?',
    options: [
      'Strong jobs are always bad for stocks',
      'Strong economy means Fed keeps rates high',
      'Traders panic on any news',
      'Jobs data is always priced in',
    ],
    correctIndex: 1,
    explanation: 'Strong economy → Fed keeps rates high → Higher rates hurt stocks. In macro events, "good news" can be bad for stocks if it means tighter Fed policy.',
  },
  // Lesson 5 Quiz: Corporate Tectonic Shifts
  {
    id: 'eh-q5-1',
    lessonId: 'eh-lesson-5',
    question: 'When a CEO suddenly departs, IV typically:',
    options: [
      'Stays the same',
      'Crushes immediately',
      'Spikes higher',
      'Becomes irrelevant',
    ],
    correctIndex: 2,
    explanation: 'Surprise events cause IV to SPIKE, not crush. Unlike scheduled events, the uncertainty increases after surprise announcements.',
  },
  // Lesson 6 Quiz: The Gap Hunter\'s Toolkit
  {
    id: 'eh-q6-1',
    lessonId: 'eh-lesson-6',
    question: 'A Gap Score above 0.7 indicates:',
    options: [
      'Markets are aligned, no opportunity',
      'Moderate disagreement, needs monitoring',
      'Strong disagreement, potential opportunity',
      'The event has already passed',
    ],
    correctIndex: 2,
    explanation: 'Gap Score 0.7+ indicates strong disagreement between prediction markets and options pricing - this is where opportunities live.',
  },
  // Lesson 7 Quiz: Resolution & The Crush
  {
    id: 'eh-q7-1',
    lessonId: 'eh-lesson-7',
    question: 'When should you enter long volatility positions?',
    options: [
      'Right before the event (T-1)',
      'After the event (T+1)',
      'Early, before IV peaks (T-7 to T-5)',
      'It doesn\'t matter when',
    ],
    correctIndex: 2,
    explanation: 'Enter long vol early (T-7 to T-5) before IV peaks. Buying at peak IV means you pay max premium and IV crush hurts even if direction is right.',
  },
  {
    id: 'eh-q7-2',
    lessonId: 'eh-lesson-7',
    question: 'IV crush is largest when pre-event IV is:',
    options: [
      'Low (30-50%)',
      'Medium (60-90%)',
      'High (100%+)',
      'IV crush is always the same',
    ],
    correctIndex: 2,
    explanation: 'Higher pre-event IV = larger crush. High IV (100%+) can see crush of -50% to -75% after the event resolves.',
  },
  // Lesson 8 Quiz: Event Horizons Mastery (Capstone)
  {
    id: 'eh-q8-1',
    lessonId: 'eh-lesson-8',
    question: 'The Chameleon\'s core advantage is:',
    options: [
      'Trading more frequently than others',
      'Using the highest leverage possible',
      'Seeing both prediction markets AND options',
      'Ignoring prediction markets entirely',
    ],
    correctIndex: 2,
    explanation: 'The Chameleon watches BOTH markets - prediction markets for probability, options for volatility. When they disagree, opportunity exists.',
  },
];

// ============ Helper Functions ============

export const getLessonById = (id: string): EventHorizonsLesson | undefined => {
  return EVENT_HORIZONS_LESSONS.find((lesson) => lesson.id === id);
};

export const getLessonByNumber = (num: number): EventHorizonsLesson | undefined => {
  return EVENT_HORIZONS_LESSONS.find((lesson) => lesson.number === num);
};

export const getLessonsByMentor = (mentor: 'chameleon' | 'cheetah' | 'owl'): EventHorizonsLesson[] => {
  return EVENT_HORIZONS_LESSONS.filter((lesson) => lesson.mentor === mentor);
};

export const getTotalEstimatedTime = (): number => {
  return EVENT_HORIZONS_LESSONS.reduce((total, lesson) => total + lesson.estimatedMinutes, 0);
};

export const getQuizQuestionsForLesson = (lessonId: string): QuizQuestion[] => {
  return EVENT_HORIZONS_QUIZ_QUESTIONS.filter((q) => q.lessonId === lessonId);
};
