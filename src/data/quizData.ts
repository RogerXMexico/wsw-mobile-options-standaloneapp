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
      {
        id: 't5-q4',
        question: 'An iron condor profits most when:',
        options: [
          'The stock makes a big move up',
          'The stock makes a big move down',
          'The stock stays within a range',
          'Implied volatility increases',
        ],
        correctAnswer: 2,
        explanation: 'An iron condor is a neutral strategy that profits when the stock stays between the two short strikes. It benefits from time decay and decreasing IV.',
        tier: 5,
        difficulty: 'medium',
      },
      {
        id: 't5-q5',
        question: 'What is the primary risk of selling a short strangle?',
        options: [
          'Limited profit potential',
          'Theoretically unlimited loss on the call side',
          'High commissions',
          'Low premium collected',
        ],
        correctAnswer: 1,
        explanation: 'A short strangle has theoretically unlimited risk on the call side (stock can rise infinitely) and substantial risk on the put side (stock can fall to zero).',
        tier: 5,
        difficulty: 'hard',
      },
    ],
  },
  {
    tierId: 6,
    tierName: 'Time & Skew',
    passingScore: 80,
    questions: [
      {
        id: 't6-q1',
        question: 'A calendar spread profits primarily from:',
        options: [
          'A big directional move',
          'The difference in time decay between two expirations',
          'Increasing interest rates',
          'Stock splits',
        ],
        correctAnswer: 1,
        explanation: 'Calendar spreads sell a near-term option and buy a longer-term option at the same strike. The near-term option decays faster, creating profit.',
        tier: 6,
        difficulty: 'medium',
      },
      {
        id: 't6-q2',
        question: 'What is a Poor Man\'s Covered Call (PMCC)?',
        options: [
          'Buying stock on margin and selling calls',
          'Using a deep ITM LEAPS call instead of stock, then selling short-term calls',
          'Selling naked calls',
          'Buying OTM calls and selling ATM calls',
        ],
        correctAnswer: 1,
        explanation: 'A PMCC replaces the 100 shares in a covered call with a deep ITM LEAPS call, requiring much less capital while maintaining a similar payoff.',
        tier: 6,
        difficulty: 'medium',
      },
      {
        id: 't6-q3',
        question: 'A diagonal spread differs from a calendar spread because:',
        options: [
          'It uses different expirations only',
          'It uses different strikes AND different expirations',
          'It uses the same expiration',
          'It only uses puts',
        ],
        correctAnswer: 1,
        explanation: 'A diagonal spread uses both different strike prices AND different expiration dates, combining elements of vertical and calendar spreads.',
        tier: 6,
        difficulty: 'medium',
      },
      {
        id: 't6-q4',
        question: 'When is the best time to enter a calendar spread?',
        options: [
          'When IV is at its highest',
          'When IV is low and expected to rise',
          'Right before earnings',
          'When the stock is trending strongly',
        ],
        correctAnswer: 1,
        explanation: 'Calendar spreads benefit from rising IV because the long-dated option gains more from IV increases than the short-dated option. Entering when IV is low provides an edge.',
        tier: 6,
        difficulty: 'hard',
      },
      {
        id: 't6-q5',
        question: 'Volatility skew refers to:',
        options: [
          'The difference in IV between calls and puts at the same strike',
          'The pattern where OTM puts have higher IV than equidistant OTM calls',
          'The speed of price changes',
          'The difference between historical and implied volatility',
        ],
        correctAnswer: 1,
        explanation: 'Volatility skew is the pattern where OTM puts typically have higher IV than equidistant OTM calls, reflecting the market pricing crash risk more aggressively.',
        tier: 6,
        difficulty: 'hard',
      },
    ],
  },
  {
    tierId: 7,
    tierName: 'Ratios & Backspreads',
    passingScore: 80,
    questions: [
      {
        id: 't7-q1',
        question: 'A ratio spread typically involves:',
        options: [
          'Buying and selling equal numbers of options',
          'Buying fewer options than you sell',
          'Only buying options',
          'Only selling options',
        ],
        correctAnswer: 1,
        explanation: 'A ratio spread buys a smaller number of options at one strike and sells a larger number at another strike, creating an unequal ratio (e.g., 1:2).',
        tier: 7,
        difficulty: 'medium',
      },
      {
        id: 't7-q2',
        question: 'A call backspread involves:',
        options: [
          'Selling more calls than you buy',
          'Buying more calls than you sell',
          'Buying calls and puts equally',
          'Selling calls and buying puts',
        ],
        correctAnswer: 1,
        explanation: 'A call backspread buys more calls at a higher strike than it sells at a lower strike (e.g., sell 1, buy 2). It profits from large upward moves.',
        tier: 7,
        difficulty: 'medium',
      },
      {
        id: 't7-q3',
        question: 'What is a broken-wing butterfly?',
        options: [
          'A butterfly with unequal wing widths',
          'A butterfly that has expired',
          'A butterfly using only puts',
          'A butterfly with weekly options',
        ],
        correctAnswer: 0,
        explanation: 'A broken-wing butterfly has asymmetric wings (different widths on each side), often entered for a credit and eliminating risk on one side.',
        tier: 7,
        difficulty: 'hard',
      },
      {
        id: 't7-q4',
        question: 'A jade lizard is designed to:',
        options: [
          'Maximize directional profit',
          'Collect premium with no upside risk',
          'Hedge a stock position',
          'Profit from high volatility',
        ],
        correctAnswer: 1,
        explanation: 'A jade lizard combines a short put with a short call spread, structured so the total credit received exceeds the call spread width, eliminating upside risk.',
        tier: 7,
        difficulty: 'hard',
      },
      {
        id: 't7-q5',
        question: 'What does ZEBRA stand for in options trading?',
        options: [
          'Zero Expected Beta Risk Approach',
          'Zero Extrinsic Back Ratio',
          'Zero Exposure Balanced Risk Assessment',
          'Zero Entry Bull Risk Adjustment',
        ],
        correctAnswer: 1,
        explanation: 'ZEBRA stands for Zero Extrinsic Back Ratio. It creates a synthetic long stock position with defined downside risk by using a ratio of calls.',
        tier: 7,
        difficulty: 'hard',
      },
    ],
  },
  {
    tierId: 8,
    tierName: 'Event Horizons',
    passingScore: 75,
    questions: [
      {
        id: 't8-q1',
        question: 'What is the "expected move" derived from?',
        options: [
          'Historical price data only',
          'Analyst price targets',
          'The ATM straddle price and implied volatility',
          'Trading volume',
        ],
        correctAnswer: 2,
        explanation: 'The expected move is calculated from the ATM straddle price (or IV), representing roughly a one standard deviation move the market is pricing in.',
        tier: 8,
        difficulty: 'medium',
      },
      {
        id: 't8-q2',
        question: 'When prediction markets show high probability for an event, and options show low IV, a trader might:',
        options: [
          'Avoid the trade entirely',
          'Buy straddles because options may be underpricing the event',
          'Sell premium aggressively',
          'Buy stock instead of options',
        ],
        correctAnswer: 1,
        explanation: 'When prediction markets signal high event probability but options IV is low, options may be underpricing the potential move, creating an opportunity to buy volatility.',
        tier: 8,
        difficulty: 'hard',
      },
      {
        id: 't8-q3',
        question: 'IV Crush is most dangerous for:',
        options: [
          'Premium sellers',
          'Premium buyers who hold through the event',
          'Stock holders',
          'Index fund investors',
        ],
        correctAnswer: 1,
        explanation: 'IV Crush hurts premium buyers because the rapid drop in IV deflates option values, even if the stock moves in the right direction. The move must exceed what IV was pricing in.',
        tier: 8,
        difficulty: 'medium',
      },
      {
        id: 't8-q4',
        question: 'Binary events in options trading refer to:',
        options: [
          'Computer-generated trades',
          'Events with two possible outcomes that cause sharp price moves',
          'Options with only two legs',
          'Trades that expire in two days',
        ],
        correctAnswer: 1,
        explanation: 'Binary events (like earnings, FDA decisions) have discrete outcomes that cause sharp, gap-like price movements, making them unique for options positioning.',
        tier: 8,
        difficulty: 'easy',
      },
      {
        id: 't8-q5',
        question: 'The "implied move" for earnings is calculated by:',
        options: [
          'Averaging past earnings moves',
          'Looking at the ATM straddle price for the nearest post-earnings expiration',
          'Checking analyst estimates',
          'Measuring the VIX level',
        ],
        correctAnswer: 1,
        explanation: 'The implied move is extracted from the ATM straddle price for the nearest expiration after earnings. If a $100 stock has a $5 straddle, the market implies a +/-5% move.',
        tier: 8,
        difficulty: 'medium',
      },
    ],
  },
  {
    tierId: 9,
    tierName: 'Strategy Tools',
    passingScore: 80,
    questions: [
      {
        id: 't9-q1',
        question: 'Position sizing based on the 2% rule means:',
        options: [
          'Only trade 2% of the time',
          'Never risk more than 2% of total portfolio on a single trade',
          'Use 2% margin',
          'Target 2% daily returns',
        ],
        correctAnswer: 1,
        explanation: 'The 2% rule limits maximum loss on any single trade to 2% of total portfolio value, ensuring that a string of losses cannot destroy the account.',
        tier: 9,
        difficulty: 'easy',
      },
      {
        id: 't9-q2',
        question: 'Delta-neutral positioning means:',
        options: [
          'You have no options positions',
          'Your portfolio has near-zero directional exposure',
          'You only trade delta-one products',
          'You hedge with futures only',
        ],
        correctAnswer: 1,
        explanation: 'A delta-neutral portfolio has a net delta near zero, meaning small moves in the underlying have minimal impact on portfolio value.',
        tier: 9,
        difficulty: 'medium',
      },
      {
        id: 't9-q3',
        question: 'Rolling an option position means:',
        options: [
          'Exercising it early',
          'Closing the current position and opening a new one at a different strike or expiration',
          'Converting it to stock',
          'Adding more contracts to the position',
        ],
        correctAnswer: 1,
        explanation: 'Rolling involves closing an existing option and simultaneously opening a new position, typically to extend duration, adjust strike, or avoid assignment.',
        tier: 9,
        difficulty: 'easy',
      },
      {
        id: 't9-q4',
        question: 'Gamma risk is highest for:',
        options: [
          'Deep OTM options with months to expiration',
          'ATM options near expiration',
          'ITM LEAPS options',
          'Index options only',
        ],
        correctAnswer: 1,
        explanation: 'Gamma peaks for ATM options as expiration approaches. This means delta can change rapidly, causing large P&L swings in short timeframes.',
        tier: 9,
        difficulty: 'hard',
      },
      {
        id: 't9-q5',
        question: 'The "Wheel" strategy involves cycling between:',
        options: [
          'Calls and puts on different stocks',
          'Cash-secured puts and covered calls on the same stock',
          'Buying and selling the same option repeatedly',
          'Trading options on different indexes',
        ],
        correctAnswer: 1,
        explanation: 'The Wheel strategy sells cash-secured puts until assigned, then sells covered calls on the shares until called away, collecting premium at each step.',
        tier: 9,
        difficulty: 'medium',
      },
    ],
  },
  {
    tierId: 10,
    tierName: "Let's Play",
    passingScore: 75,
    questions: [
      {
        id: 't10-q1',
        question: 'You expect a stock to stay between $95 and $105 for the next 30 days. The best strategy is:',
        options: [
          'Buy a long straddle',
          'Sell an iron condor with short strikes near $95 and $105',
          'Buy a long call',
          'Sell naked puts',
        ],
        correctAnswer: 1,
        explanation: 'An iron condor with short strikes near the expected range boundaries profits from the stock staying within that range while defining your risk.',
        tier: 10,
        difficulty: 'medium',
      },
      {
        id: 't10-q2',
        question: 'Earnings are tomorrow and IV Rank is at 90. You want to sell premium. You should:',
        options: [
          'Sell a naked straddle',
          'Sell an iron condor or iron butterfly with defined risk',
          'Buy a long straddle',
          'Wait until after earnings',
        ],
        correctAnswer: 1,
        explanation: 'High IV Rank means elevated premiums, favoring sellers. Using an iron condor or butterfly defines your risk while capturing the IV crush after earnings.',
        tier: 10,
        difficulty: 'medium',
      },
      {
        id: 't10-q3',
        question: 'A stock gaps down 15% on bad earnings. You hold a bull put spread. What likely happened?',
        options: [
          'You profited from the decline',
          'Your short put is deep ITM, approaching max loss',
          'Nothing, spreads are immune to gaps',
          'Your long put expired worthless',
        ],
        correctAnswer: 1,
        explanation: 'A 15% gap down likely pushed the stock below both strikes. Your short put is deep ITM, and the spread is at or near maximum loss (width minus credit received).',
        tier: 10,
        difficulty: 'hard',
      },
      {
        id: 't10-q4',
        question: 'You want bullish exposure with less capital than buying 100 shares. The most capital-efficient approach is:',
        options: [
          'Buying 50 shares',
          'A PMCC (Poor Man\'s Covered Call)',
          'Selling a naked put',
          'Buying a deep OTM call',
        ],
        correctAnswer: 1,
        explanation: 'A PMCC uses a deep ITM LEAPS call (high delta) as a stock substitute, requiring a fraction of the capital while allowing you to sell short-term calls for income.',
        tier: 10,
        difficulty: 'medium',
      },
      {
        id: 't10-q5',
        question: 'Your iron condor\'s short call is being tested. The stock is approaching the short call strike. You should:',
        options: [
          'Do nothing and hope it reverses',
          'Consider rolling the tested side up/out or closing the position',
          'Double down and sell more calls',
          'Exercise your long call',
        ],
        correctAnswer: 1,
        explanation: 'When a short strike is being tested, rolling the position (adjusting strikes or extending expiration) or closing helps manage risk before max loss is reached.',
        tier: 10,
        difficulty: 'hard',
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
