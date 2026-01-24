// Risk Assessment Quiz - Spirit Animal Matching
// Determines user's trading style based on risk tolerance

export interface QuizOption {
  text: string;
  scores: {
    sloth: number;
    badger: number;
    monkey: number;
    tiger: number;
  };
}

export interface RiskAssessmentQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const RISK_ASSESSMENT_QUESTIONS: RiskAssessmentQuestion[] = [
  {
    id: 'ra-1',
    question: 'You have $10,000 to invest in options. A stock you like has been volatile. What do you do?',
    options: [
      {
        text: 'Buy the stock and sell covered calls for steady income',
        scores: { sloth: 3, badger: 1, monkey: 0, tiger: 0 },
      },
      {
        text: 'Use a bull put spread to define my risk while collecting premium',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Buy call options to maximize my upside potential',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Sell naked puts to collect premium and potentially buy at a discount',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-2',
    question: 'Your option trade is down 30%. What\'s your reaction?',
    options: [
      {
        text: 'Close immediately - capital preservation is my priority',
        scores: { sloth: 3, badger: 1, monkey: 0, tiger: 0 },
      },
      {
        text: 'I would have had a stop-loss in place already',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Hold and reassess - my thesis might still be valid',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Consider doubling down - this is now a better entry',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-3',
    question: 'What\'s your ideal holding period for an options trade?',
    options: [
      {
        text: 'Weeks to months - let time decay work in my favor',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: 'Days to weeks - capture the move, manage risk',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Days - quick in and out on momentum plays',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Hours to days - strike fast, take profits quickly',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-4',
    question: 'How do you feel about undefined risk trades (like naked puts)?',
    options: [
      {
        text: 'Never - I always need to know my maximum loss',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: 'Rarely - only with very small position sizes',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Sometimes - if the probability of success is high',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Often - bigger risk can mean bigger reward',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-5',
    question: 'What percentage of your trading capital would you risk on a single trade?',
    options: [
      {
        text: '1-2% maximum - preserve capital at all costs',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: '3-5% - balanced risk management',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: '5-10% - willing to take larger bets on high conviction plays',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: '10%+ - go big or go home',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-6',
    question: 'How do you react when a trade goes in your favor quickly?',
    options: [
      {
        text: 'Take profits at my predetermined target',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: 'Adjust my position to lock in some gains',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Let it ride - momentum could continue',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Add to the position - winners keep winning',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-7',
    question: 'How would you describe your emotional response to market volatility?',
    options: [
      {
        text: 'I prefer stability - volatility makes me uncomfortable',
        scores: { sloth: 3, badger: 1, monkey: 0, tiger: 0 },
      },
      {
        text: 'I\'m cautious but can handle moderate swings',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'I get excited - volatility means opportunity',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'I thrive in chaos - that\'s where the money is made',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-8',
    question: 'What\'s your primary goal with options trading?',
    options: [
      {
        text: 'Generate steady income while protecting my portfolio',
        scores: { sloth: 3, badger: 1, monkey: 0, tiger: 0 },
      },
      {
        text: 'Grow my account with calculated, defined-risk trades',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Capture significant gains from market movements',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Maximum returns - I\'m willing to take big swings',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-9',
    question: 'How much options trading experience do you have?',
    options: [
      {
        text: 'Beginner - I\'m just learning the basics',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: 'Intermediate - I understand the fundamentals',
        scores: { sloth: 1, badger: 3, monkey: 2, tiger: 0 },
      },
      {
        text: 'Advanced - I\'ve traded various strategies',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 2 },
      },
      {
        text: 'Expert - I\'m comfortable with complex strategies',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-10',
    question: 'A friend tells you about a "sure thing" options trade. What do you do?',
    options: [
      {
        text: 'Ignore it - there\'s no such thing as a sure thing',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: 'Research it thoroughly before making any decision',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Consider it if the setup looks good technically',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Jump in - sometimes you have to trust your gut',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-11',
    question: 'How do you feel about using leverage in your trading?',
    options: [
      {
        text: 'I avoid it - leverage amplifies losses too much',
        scores: { sloth: 3, badger: 1, monkey: 0, tiger: 0 },
      },
      {
        text: 'I use it conservatively with strict limits',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'I embrace it - that\'s the whole point of options',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Maximum leverage for maximum returns',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-12',
    question: 'If you lost 50% of your trading account, how would you respond?',
    options: [
      {
        text: 'Step back, re-evaluate, and possibly stop trading',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: 'Analyze what went wrong and adjust my strategy',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Take a short break then get back in more carefully',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Try to make it back - maybe with bigger bets',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-13',
    question: 'What type of options strategy appeals to you most?',
    options: [
      {
        text: 'Simple single-leg trades like covered calls or protective puts',
        scores: { sloth: 3, badger: 1, monkey: 0, tiger: 0 },
      },
      {
        text: 'Defined-risk spreads like vertical spreads or iron condors',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Directional plays like long calls or puts with leverage',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Complex multi-leg strategies like ratios, butterflies, or calendars',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-14',
    question: 'How do you prefer to make money with options?',
    options: [
      {
        text: 'Collecting steady premium income while I sleep',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: 'High-probability trades with defined risk and reward',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'Catching big directional moves for explosive gains',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'Exploiting volatility and complex market inefficiencies',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
  {
    id: 'ra-15',
    question: 'What is your general market outlook?',
    options: [
      {
        text: 'I don\'t try to predict direction - I focus on protection and income',
        scores: { sloth: 3, badger: 2, monkey: 0, tiger: 0 },
      },
      {
        text: 'I\'m neutral - I prefer range-bound strategies that profit from time decay',
        scores: { sloth: 1, badger: 3, monkey: 1, tiger: 0 },
      },
      {
        text: 'I\'m usually bullish and like to position for upside moves',
        scores: { sloth: 0, badger: 1, monkey: 3, tiger: 1 },
      },
      {
        text: 'I trade both directions aggressively based on my analysis',
        scores: { sloth: 0, badger: 0, monkey: 1, tiger: 3 },
      },
    ],
  },
];

// Spirit Animal profiles with descriptions
export interface SpiritAnimalProfile {
  id: string;
  name: string;
  emoji: string;
  color: string;
  riskLevel: number; // 1-5
  title: string;
  description: string;
  tradingStyle: string;
  strengths: string[];
  recommendedStrategies: string[];
}

export const SPIRIT_ANIMALS: SpiritAnimalProfile[] = [
  {
    id: 'turtle',
    name: 'Turtle',
    emoji: '',
    color: '#10B981',
    riskLevel: 1,
    title: 'The Patient Guardian',
    description: 'Slow and steady wins the race. You prioritize capital preservation above all else.',
    tradingStyle: 'Ultra-conservative income generation with maximum protection',
    strengths: ['Patience', 'Discipline', 'Capital preservation'],
    recommendedStrategies: ['Covered Calls', 'Cash-Secured Puts', 'Protective Puts'],
  },
  {
    id: 'sloth',
    name: 'Sloth',
    emoji: '',
    color: '#6B7280',
    riskLevel: 1,
    title: 'The Relaxed Earner',
    description: 'Why rush? You let time and theta do the heavy lifting while you relax.',
    tradingStyle: 'Passive income through premium collection with minimal activity',
    strengths: ['Low maintenance', 'Consistent returns', 'Stress-free trading'],
    recommendedStrategies: ['Covered Calls', 'The Wheel Strategy', 'Collars'],
  },
  {
    id: 'panda',
    name: 'Panda',
    emoji: '',
    color: '#1F2937',
    riskLevel: 1,
    title: 'The Gentle Giant',
    description: 'Peaceful and methodical. You take only the safest opportunities.',
    tradingStyle: 'Conservative approach focusing on quality over quantity',
    strengths: ['Selectivity', 'Risk awareness', 'Long-term focus'],
    recommendedStrategies: ['LEAPS Covered Calls', 'Protective Puts', 'Collar Strategy'],
  },
  {
    id: 'retriever',
    name: 'Golden Retriever',
    emoji: '',
    color: '#F59E0B',
    riskLevel: 2,
    title: 'The Loyal Companion',
    description: 'Faithful to your strategy. You stick to what works with unwavering discipline.',
    tradingStyle: 'Systematic trading with defined rules and consistent execution',
    strengths: ['Loyalty to rules', 'Emotional stability', 'Reliability'],
    recommendedStrategies: ['Iron Condors', 'Credit Spreads', 'Cash-Secured Puts'],
  },
  {
    id: 'badger',
    name: 'Badger',
    emoji: '',
    color: '#6366F1',
    riskLevel: 2,
    title: 'The Determined Strategist',
    description: 'Tenacious and calculated. You dig deep into analysis before making a move.',
    tradingStyle: 'Methodical spread trading with thorough risk assessment',
    strengths: ['Research', 'Persistence', 'Risk management'],
    recommendedStrategies: ['Bull Put Spreads', 'Bear Call Spreads', 'Iron Condors'],
  },
  {
    id: 'dolphin',
    name: 'Dolphin',
    emoji: '',
    color: '#0EA5E9',
    riskLevel: 2,
    title: 'The Smart Navigator',
    description: 'Intelligent and adaptable. You read market currents and flow with them.',
    tradingStyle: 'Flexible approach that adapts to market conditions',
    strengths: ['Intelligence', 'Adaptability', 'Pattern recognition'],
    recommendedStrategies: ['Calendar Spreads', 'Diagonal Spreads', 'Iron Butterflies'],
  },
  {
    id: 'owl',
    name: 'Owl',
    emoji: '',
    color: '#8B5CF6',
    riskLevel: 3,
    title: 'The Wise Analyst',
    description: 'All-seeing and analytical. You study the market before making calculated moves.',
    tradingStyle: 'Data-driven decision making with multiple timeframe analysis',
    strengths: ['Analysis', 'Patience', 'Wisdom'],
    recommendedStrategies: ['Butterflies', 'Calendar Spreads', 'Ratio Spreads'],
  },
  {
    id: 'fox',
    name: 'Fox',
    emoji: '',
    color: '#EA580C',
    riskLevel: 3,
    title: 'The Cunning Opportunist',
    description: 'Quick-witted and shrewd. You spot opportunities others miss.',
    tradingStyle: 'Tactical trading that exploits market inefficiencies',
    strengths: ['Opportunism', 'Quick thinking', 'Creativity'],
    recommendedStrategies: ['Strangles', 'Jade Lizards', 'Skip Strike Butterflies'],
  },
  {
    id: 'bear',
    name: 'Bear',
    emoji: '',
    color: '#DC2626',
    riskLevel: 3,
    title: 'The Powerful Defender',
    description: 'Strong and protective. You\'re always ready to capitalize on market weakness.',
    tradingStyle: 'Balanced approach with strong defensive positioning',
    strengths: ['Protection', 'Patience', 'Opportunistic bearishness'],
    recommendedStrategies: ['Bear Put Spreads', 'Protective Puts', 'Put Ratio Spreads'],
  },
  {
    id: 'chameleon',
    name: 'Chameleon',
    emoji: '',
    color: '#14B8A6',
    riskLevel: 3,
    title: 'The Adaptive Trader',
    description: 'Ever-changing and versatile. You seamlessly adapt to any market environment.',
    tradingStyle: 'Multi-strategy approach that changes with market conditions',
    strengths: ['Versatility', 'Awareness', 'Flexibility'],
    recommendedStrategies: ['Straddles', 'Strangles', 'Iron Condors'],
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    emoji: '',
    color: '#EAB308',
    riskLevel: 4,
    title: 'The Swift Hunter',
    description: 'Fast and focused. You strike quickly when you spot your prey.',
    tradingStyle: 'Short-term momentum trading with quick entries and exits',
    strengths: ['Speed', 'Focus', 'Timing'],
    recommendedStrategies: ['Long Calls', 'Long Puts', 'Debit Spreads'],
  },
  {
    id: 'monkey',
    name: 'Monkey',
    emoji: '',
    color: '#F97316',
    riskLevel: 4,
    title: 'The Agile Swinger',
    description: 'Playful and opportunistic. You swing from trade to trade with energy.',
    tradingStyle: 'Active trading with multiple positions and quick adjustments',
    strengths: ['Agility', 'Energy', 'Quick reflexes'],
    recommendedStrategies: ['Long Calls', 'Straddles', 'Back Ratio Spreads'],
  },
  {
    id: 'bull',
    name: 'Bull',
    emoji: '',
    color: '#22C55E',
    riskLevel: 4,
    title: 'The Charging Optimist',
    description: 'Powerful and confident. You charge into opportunities with conviction.',
    tradingStyle: 'Aggressive bullish positioning with leverage',
    strengths: ['Confidence', 'Conviction', 'Momentum'],
    recommendedStrategies: ['Call Debit Spreads', 'Naked Puts', 'LEAPS Calls'],
  },
  {
    id: 'wolf',
    name: 'Wolf',
    emoji: '',
    color: '#475569',
    riskLevel: 4,
    title: 'The Pack Leader',
    description: 'Strategic and social. You follow the smart money and hunt in groups.',
    tradingStyle: 'Flow-following with institutional tracking',
    strengths: ['Social intelligence', 'Strategy', 'Leadership'],
    recommendedStrategies: ['Unusual Activity Plays', 'Momentum Calls', 'Calendar Spreads'],
  },
  {
    id: 'octopus',
    name: 'Octopus',
    emoji: '',
    color: '#E11D48',
    riskLevel: 5,
    title: 'The Multi-Armed Master',
    description: 'Complex and calculated. You manage multiple complex positions simultaneously.',
    tradingStyle: 'Advanced multi-leg strategies with sophisticated risk management',
    strengths: ['Complexity', 'Multitasking', 'Precision'],
    recommendedStrategies: ['Broken Wing Butterflies', 'Ratio Spreads', 'Box Spreads'],
  },
  {
    id: 'kangaroo',
    name: 'Kangaroo',
    emoji: '',
    color: '#9333EA',
    riskLevel: 5,
    title: 'The Bold Leaper',
    description: 'Bold and explosive. You make big leaps for potentially massive gains.',
    tradingStyle: 'High-risk, high-reward momentum plays',
    strengths: ['Boldness', 'Conviction', 'Big-picture thinking'],
    recommendedStrategies: ['0DTE Options', 'Earnings Plays', 'YOLO Calls'],
  },
];

// Calculate the user's spirit animal based on their answers
export const calculateRiskProfile = (answers: number[]): {
  primary: SpiritAnimalProfile;
  secondary: SpiritAnimalProfile;
  scores: Record<string, number>;
  confidence: number;
} => {
  // Initialize scores for all 16 animals
  const scores: Record<string, number> = {
    turtle: 0, owl: 0, cheetah: 0, fox: 0, retriever: 0, sloth: 0,
    badger: 0, monkey: 0, bull: 0, octopus: 0, bear: 0, dolphin: 0,
    chameleon: 0, wolf: 0, kangaroo: 0, panda: 0
  };

  // Map scores to animals based on risk profiles
  answers.forEach((answerIndex, questionIndex) => {
    const question = RISK_ASSESSMENT_QUESTIONS[questionIndex];
    if (question && question.options[answerIndex]) {
      const opt = question.options[answerIndex].scores;
      // Conservative animals (1 star)
      scores.turtle += opt.sloth;
      scores.sloth += opt.sloth;
      scores.panda += opt.sloth;
      // Moderate-Conservative animals (2 stars)
      scores.retriever += Math.round((opt.sloth + opt.badger) / 2);
      scores.badger += opt.badger;
      scores.dolphin += Math.round((opt.sloth + opt.badger) / 2);
      // Moderate animals (3 stars)
      scores.owl += opt.badger;
      scores.fox += opt.badger;
      scores.bear += opt.badger;
      scores.chameleon += opt.badger;
      // Aggressive animals (4 stars)
      scores.cheetah += opt.monkey;
      scores.monkey += opt.monkey;
      scores.bull += opt.monkey;
      scores.wolf += opt.monkey;
      // Very aggressive (5 stars)
      scores.octopus += opt.tiger;
      scores.kangaroo += opt.tiger;
    }
  });

  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primaryId = sortedScores[0][0];
  const secondaryId = sortedScores[1][0];
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? sortedScores[0][1] / totalScore : 0.25;

  const primary = SPIRIT_ANIMALS.find(a => a.id === primaryId) || SPIRIT_ANIMALS[0];
  const secondary = SPIRIT_ANIMALS.find(a => a.id === secondaryId) || SPIRIT_ANIMALS[1];

  return { primary, secondary, scores, confidence };
};
