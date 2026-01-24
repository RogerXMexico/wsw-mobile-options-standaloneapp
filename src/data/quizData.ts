// Quiz Data for Wall Street Wildlife Mobile
// Organized by tier with multiple questions per tier

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tier: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizTier {
  tierId: number;
  tierName: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
}

export const QUIZ_DATA: QuizTier[] = [
  {
    tierId: 0,
    tierName: 'Foundations',
    passingScore: 70,
    questions: [
      {
        id: 't0-q1',
        question: 'What gives you the RIGHT but not the OBLIGATION to buy stock?',
        options: ['Put option', 'Call option', 'Stock', 'Bond'],
        correctAnswer: 1,
        explanation: 'A call option gives the holder the right, but not the obligation, to BUY stock at the strike price.',
        tier: 0,
        difficulty: 'easy',
      },
      {
        id: 't0-q2',
        question: 'What is the strike price?',
        options: [
          'The current stock price',
          'The price you pay for the option',
          'The price at which you can buy/sell the stock',
          'The expiration date',
        ],
        correctAnswer: 2,
        explanation: 'The strike price is the predetermined price at which you can exercise your option to buy (call) or sell (put) the underlying stock.',
        tier: 0,
        difficulty: 'easy',
      },
      {
        id: 't0-q3',
        question: 'What does "in the money" (ITM) mean for a call option?',
        options: [
          'The option is profitable',
          'Stock price is above strike price',
          'Stock price is below strike price',
          'The option has expired',
        ],
        correctAnswer: 1,
        explanation: 'A call option is "in the money" when the stock price is ABOVE the strike price, meaning it has intrinsic value.',
        tier: 0,
        difficulty: 'easy',
      },
      {
        id: 't0-q4',
        question: 'How many shares does one standard options contract control?',
        options: ['10 shares', '50 shares', '100 shares', '1000 shares'],
        correctAnswer: 2,
        explanation: 'One standard options contract controls 100 shares of the underlying stock.',
        tier: 0,
        difficulty: 'easy',
      },
      {
        id: 't0-q5',
        question: 'What happens to an option at expiration if it is out of the money (OTM)?',
        options: [
          'It gets automatically exercised',
          'It expires worthless',
          'It converts to stock',
          'It rolls to the next month',
        ],
        correctAnswer: 1,
        explanation: 'An out of the money option has no intrinsic value and expires worthless at expiration.',
        tier: 0,
        difficulty: 'medium',
      },
    ],
  },
  {
    tierId: 1,
    tierName: 'Market Structure',
    passingScore: 70,
    questions: [
      {
        id: 't1-q1',
        question: 'What does the bid-ask spread represent?',
        options: [
          'The profit on a trade',
          'The difference between buying and selling prices',
          'The daily price movement',
          'The option premium',
        ],
        correctAnswer: 1,
        explanation: 'The bid-ask spread is the difference between what buyers are willing to pay (bid) and what sellers are asking (ask). This is a cost of trading.',
        tier: 1,
        difficulty: 'easy',
      },
      {
        id: 't1-q2',
        question: 'What is open interest?',
        options: [
          'The number of trades today',
          'Total outstanding contracts',
          'The interest rate',
          'Volume of calls vs puts',
        ],
        correctAnswer: 1,
        explanation: 'Open interest is the total number of outstanding option contracts that have not been settled or closed.',
        tier: 1,
        difficulty: 'medium',
      },
      {
        id: 't1-q3',
        question: 'Higher liquidity in an options market typically means:',
        options: [
          'Wider bid-ask spreads',
          'Tighter bid-ask spreads',
          'Higher premiums',
          'Lower volume',
        ],
        correctAnswer: 1,
        explanation: 'Higher liquidity means more buyers and sellers competing, which results in tighter (narrower) bid-ask spreads and better fills.',
        tier: 1,
        difficulty: 'medium',
      },
    ],
  },
  {
    tierId: 2,
    tierName: 'Risk Management',
    passingScore: 75,
    questions: [
      {
        id: 't2-q1',
        question: 'What is the maximum loss on a long call option?',
        options: [
          'Unlimited',
          'The premium paid',
          'The strike price',
          'The stock price',
        ],
        correctAnswer: 1,
        explanation: 'When you buy a call option, your maximum loss is limited to the premium you paid for the option.',
        tier: 2,
        difficulty: 'easy',
      },
      {
        id: 't2-q2',
        question: 'Which strategy has unlimited risk?',
        options: [
          'Long call',
          'Long put',
          'Naked short call',
          'Covered call',
        ],
        correctAnswer: 2,
        explanation: 'A naked short call has unlimited risk because the stock can theoretically rise to infinity, and you must deliver shares at the strike price.',
        tier: 2,
        difficulty: 'medium',
      },
      {
        id: 't2-q3',
        question: 'What percentage of your portfolio should typically be risked on a single trade?',
        options: ['1-2%', '10-15%', '25-30%', '50%'],
        correctAnswer: 0,
        explanation: 'Most professional traders recommend risking only 1-2% of your portfolio on any single trade to ensure longevity.',
        tier: 2,
        difficulty: 'easy',
      },
      {
        id: 't2-q4',
        question: 'A protective put is used to:',
        options: [
          'Generate income',
          'Protect gains on a long stock position',
          'Bet on volatility',
          'Reduce cost basis',
        ],
        correctAnswer: 1,
        explanation: 'A protective put is bought to limit downside risk on a stock you own, acting like insurance.',
        tier: 2,
        difficulty: 'medium',
      },
    ],
  },
  {
    tierId: 3,
    tierName: 'The Anchors',
    passingScore: 75,
    questions: [
      {
        id: 't3-q1',
        question: 'In a covered call strategy, you:',
        options: [
          'Buy calls and puts',
          'Own stock and sell calls',
          'Buy stock and buy calls',
          'Sell stock and buy calls',
        ],
        correctAnswer: 1,
        explanation: 'A covered call involves owning 100 shares of stock and selling a call option against it to generate income.',
        tier: 3,
        difficulty: 'easy',
      },
      {
        id: 't3-q2',
        question: 'What is the ideal market outlook for a covered call?',
        options: [
          'Very bullish',
          'Very bearish',
          'Neutral to slightly bullish',
          'High volatility expected',
        ],
        correctAnswer: 2,
        explanation: 'Covered calls work best when you expect the stock to stay flat or rise slightly - enough to collect premium but not so much that you miss out on gains.',
        tier: 3,
        difficulty: 'medium',
      },
      {
        id: 't3-q3',
        question: 'A cash-secured put means you:',
        options: [
          'Buy puts with borrowed money',
          'Have cash ready to buy stock if assigned',
          'Sell puts without collateral',
          'Buy puts and calls together',
        ],
        correctAnswer: 1,
        explanation: 'Cash-secured means you have the full cash amount to purchase the shares if assigned (strike price × 100).',
        tier: 3,
        difficulty: 'easy',
      },
    ],
  },
  {
    tierId: 4,
    tierName: 'Vertical Spreads',
    passingScore: 80,
    questions: [
      {
        id: 't4-q1',
        question: 'A bull call spread involves:',
        options: [
          'Buying a call, selling a higher strike call',
          'Buying a call, selling a lower strike call',
          'Buying two calls at same strike',
          'Selling two calls',
        ],
        correctAnswer: 0,
        explanation: 'A bull call spread buys a lower strike call and sells a higher strike call, both same expiration. This reduces cost but caps profit.',
        tier: 4,
        difficulty: 'medium',
      },
      {
        id: 't4-q2',
        question: 'What is the maximum profit on a credit spread?',
        options: [
          'Unlimited',
          'The net credit received',
          'The width of the strikes',
          'Strike price × 100',
        ],
        correctAnswer: 1,
        explanation: 'The maximum profit on a credit spread is limited to the net premium (credit) received when opening the trade.',
        tier: 4,
        difficulty: 'medium',
      },
      {
        id: 't4-q3',
        question: 'A bear put spread is a:',
        options: [
          'Bullish strategy',
          'Bearish strategy',
          'Neutral strategy',
          'Volatility strategy',
        ],
        correctAnswer: 1,
        explanation: 'A bear put spread profits when the stock goes down. You buy a put and sell a lower strike put.',
        tier: 4,
        difficulty: 'easy',
      },
    ],
  },
  {
    tierId: 5,
    tierName: 'Volatility Plays',
    passingScore: 80,
    questions: [
      {
        id: 't5-q1',
        question: 'What does high implied volatility (IV) typically indicate?',
        options: [
          'Options are cheap',
          'Options are expensive',
          'The stock will go up',
          'The stock will go down',
        ],
        correctAnswer: 1,
        explanation: 'High IV means the market expects big moves, making options more expensive. This is good for sellers, challenging for buyers.',
        tier: 5,
        difficulty: 'easy',
      },
      {
        id: 't5-q2',
        question: 'A long straddle profits when:',
        options: [
          'The stock stays flat',
          'The stock makes a big move in either direction',
          'IV decreases',
          'Time passes',
        ],
        correctAnswer: 1,
        explanation: 'A long straddle buys both a call and put at the same strike. It profits from big moves regardless of direction.',
        tier: 5,
        difficulty: 'medium',
      },
      {
        id: 't5-q3',
        question: 'IV Crush typically happens:',
        options: [
          'During earnings season',
          'After earnings announcements',
          'At market open',
          'At market close',
        ],
        correctAnswer: 1,
        explanation: 'IV Crush occurs after anticipated events (like earnings) when uncertainty is resolved and IV drops rapidly.',
        tier: 5,
        difficulty: 'medium',
      },
    ],
  },
];

// Helper functions
export const getQuizByTier = (tierId: number): QuizTier | undefined => {
  return QUIZ_DATA.find(q => q.tierId === tierId);
};

export const getAllQuestions = (): QuizQuestion[] => {
  return QUIZ_DATA.flatMap(tier => tier.questions);
};

export const getRandomQuestions = (tierId: number, count: number): QuizQuestion[] => {
  const tier = getQuizByTier(tierId);
  if (!tier) return [];

  const shuffled = [...tier.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
