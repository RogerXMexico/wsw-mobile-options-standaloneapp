// Event Horizons Module - Interactive Quizzes
// Quiz questions for each lesson

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  mentor: 'chameleon' | 'cheetah' | 'owl';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LessonQuiz {
  lessonId: string;
  title: string;
  passingScore: number; // percentage (0-100)
  questions: QuizQuestion[];
}

export const EVENT_HORIZONS_QUIZZES: LessonQuiz[] = [
  // ============ LESSON 1 QUIZ ============
  {
    lessonId: 'eh-lesson-1',
    title: 'Two Jungles, One Hunter',
    passingScore: 70,
    questions: [
      {
        id: 'l1-q1',
        question: 'What does options Implied Volatility (IV) primarily tell you?',
        options: [
          { id: 'a', text: 'The direction a stock will move', isCorrect: false },
          { id: 'b', text: 'How much the market expects a stock to move', isCorrect: true },
          { id: 'c', text: 'The probability of an earnings beat', isCorrect: false },
          { id: 'd', text: 'The current stock price', isCorrect: false },
        ],
        explanation: 'IV tells you the MAGNITUDE of expected movement, not the direction. A stock with 50% IV is expected to move more than one with 20% IV, but neither tells you up or down.',
        mentor: 'chameleon',
        difficulty: 'beginner',
      },
      {
        id: 'l1-q2',
        question: 'What does Polymarket primarily provide?',
        options: [
          { id: 'a', text: 'Stock price predictions', isCorrect: false },
          { id: 'b', text: 'Options pricing data', isCorrect: false },
          { id: 'c', text: 'Probability estimates for specific outcomes', isCorrect: true },
          { id: 'd', text: 'Historical volatility data', isCorrect: false },
        ],
        explanation: 'Polymarket is a prediction market where real-money bets create probability estimates for specific future events, like "Will Company X beat earnings?"',
        mentor: 'chameleon',
        difficulty: 'beginner',
      },
      {
        id: 'l1-q3',
        question: 'According to the Chameleon, when does opportunity exist?',
        options: [
          { id: 'a', text: 'When both markets agree completely', isCorrect: false },
          { id: 'b', text: 'When prediction markets and options volatility disagree', isCorrect: true },
          { id: 'c', text: 'Only during earnings season', isCorrect: false },
          { id: 'd', text: 'When IV is at its lowest point', isCorrect: false },
        ],
        explanation: 'The Chameleon looks for gaps between what prediction markets say (probability) and what options markets price (volatility). Disagreement = potential opportunity.',
        mentor: 'chameleon',
        difficulty: 'beginner',
      },
      {
        id: 'l1-q4',
        question: 'If options are pricing ±8% expected move but Polymarket shows 85% chance of an earnings beat, what might this suggest?',
        options: [
          { id: 'a', text: 'Options are overpriced', isCorrect: false },
          { id: 'b', text: 'Options may be underpricing the potential move', isCorrect: true },
          { id: 'c', text: 'You should sell all your positions', isCorrect: false },
          { id: 'd', text: 'The stock will definitely go up', isCorrect: false },
        ],
        explanation: 'High probability of a specific outcome (85% beat) combined with moderate IV suggests options might not be fully pricing in the conviction the market has about direction.',
        mentor: 'owl',
        difficulty: 'intermediate',
      },
    ],
  },

  // ============ LESSON 2 QUIZ ============
  {
    lessonId: 'eh-lesson-2',
    title: 'Reading the Gap',
    passingScore: 70,
    questions: [
      {
        id: 'l2-q1',
        question: 'What does IV Rank measure?',
        options: [
          { id: 'a', text: 'Current IV compared to its historical range', isCorrect: true },
          { id: 'b', text: 'The absolute level of implied volatility', isCorrect: false },
          { id: 'c', text: 'How much a stock moved last earnings', isCorrect: false },
          { id: 'd', text: 'The probability of profit', isCorrect: false },
        ],
        explanation: 'IV Rank shows where current IV sits relative to its 52-week range. IV Rank 80 means current IV is higher than 80% of readings in the past year.',
        mentor: 'owl',
        difficulty: 'intermediate',
      },
      {
        id: 'l2-q2',
        question: 'A "long volatility" opportunity typically exists when:',
        options: [
          { id: 'a', text: 'IV Rank is above 90', isCorrect: false },
          { id: 'b', text: 'Prediction probability is high but IV Rank is low', isCorrect: true },
          { id: 'c', text: 'Both markets show low expectations', isCorrect: false },
          { id: 'd', text: 'The stock price is at all-time highs', isCorrect: false },
        ],
        explanation: 'Long vol opportunities arise when the prediction market shows high conviction (high probability) but options are relatively cheap (low IV Rank). You\'re buying "cheap" volatility.',
        mentor: 'chameleon',
        difficulty: 'intermediate',
      },
      {
        id: 'l2-q3',
        question: 'What is "IV Crush"?',
        options: [
          { id: 'a', text: 'When IV increases before an event', isCorrect: false },
          { id: 'b', text: 'The rapid decline in IV after an event resolves', isCorrect: true },
          { id: 'c', text: 'When options expire worthless', isCorrect: false },
          { id: 'd', text: 'A type of options spread', isCorrect: false },
        ],
        explanation: 'IV Crush is the rapid decline in implied volatility that occurs after an anticipated event (like earnings) passes. The uncertainty is resolved, so IV drops quickly.',
        mentor: 'cheetah',
        difficulty: 'beginner',
      },
      {
        id: 'l2-q4',
        question: 'If IV Rank is 85 and Polymarket shows only 52% probability for a key outcome, this suggests:',
        options: [
          { id: 'a', text: 'A potential short volatility opportunity', isCorrect: true },
          { id: 'b', text: 'You should buy calls immediately', isCorrect: false },
          { id: 'c', text: 'The stock will definitely move big', isCorrect: false },
          { id: 'd', text: 'Both markets are in perfect agreement', isCorrect: false },
        ],
        explanation: 'High IV Rank (options expensive) + near 50/50 probability (uncertainty) can mean options are overpricing the expected move. Selling premium might be attractive.',
        mentor: 'owl',
        difficulty: 'advanced',
      },
    ],
  },

  // ============ LESSON 3 QUIZ ============
  {
    lessonId: 'eh-lesson-3',
    title: 'Earnings Events',
    passingScore: 70,
    questions: [
      {
        id: 'l3-q1',
        question: 'When does IV typically peak around earnings?',
        options: [
          { id: 'a', text: 'Weeks before the announcement', isCorrect: false },
          { id: 'b', text: 'Just before the earnings announcement', isCorrect: true },
          { id: 'c', text: 'The day after earnings', isCorrect: false },
          { id: 'd', text: 'IV stays constant throughout', isCorrect: false },
        ],
        explanation: 'IV builds up as earnings approaches, peaks right before the announcement when uncertainty is highest, then crushes immediately after results are known.',
        mentor: 'cheetah',
        difficulty: 'beginner',
      },
      {
        id: 'l3-q2',
        question: 'What typically happens to options value even if you correctly predict the earnings direction?',
        options: [
          { id: 'a', text: 'They always profit', isCorrect: false },
          { id: 'b', text: 'IV crush can offset directional gains', isCorrect: true },
          { id: 'c', text: 'Nothing changes', isCorrect: false },
          { id: 'd', text: 'They automatically double in value', isCorrect: false },
        ],
        explanation: 'IV Crush is the earnings trader\'s enemy. Even with the right direction, if the move isn\'t big enough to overcome the IV collapse, you can still lose money.',
        mentor: 'cheetah',
        difficulty: 'intermediate',
      },
      {
        id: 'l3-q3',
        question: 'Why might Polymarket\'s earnings beat probability be useful alongside IV data?',
        options: [
          { id: 'a', text: 'It tells you exactly how much the stock will move', isCorrect: false },
          { id: 'b', text: 'It provides directional probability that IV lacks', isCorrect: true },
          { id: 'c', text: 'It replaces the need for technical analysis', isCorrect: false },
          { id: 'd', text: 'It guarantees profitable trades', isCorrect: false },
        ],
        explanation: 'Options IV only tells you magnitude. Polymarket adds a directional probability layer, helping you understand not just how much but which way the crowd expects movement.',
        mentor: 'owl',
        difficulty: 'intermediate',
      },
      {
        id: 'l3-q4',
        question: 'For the Cheetah\'s earnings play, what is the ideal setup?',
        options: [
          { id: 'a', text: 'High IV Rank + High Polymarket probability', isCorrect: false },
          { id: 'b', text: 'Low IV Rank + Low Polymarket probability', isCorrect: false },
          { id: 'c', text: 'Gap between what options price and what prediction markets suggest', isCorrect: true },
          { id: 'd', text: 'Always sell premium regardless of conditions', isCorrect: false },
        ],
        explanation: 'The Cheetah looks for gaps - situations where options might be mispricing the event relative to what prediction market probability suggests.',
        mentor: 'cheetah',
        difficulty: 'advanced',
      },
    ],
  },

  // ============ LESSON 4 QUIZ ============
  {
    lessonId: 'eh-lesson-4',
    title: 'FDA & Regulatory Events',
    passingScore: 70,
    questions: [
      {
        id: 'l4-q1',
        question: 'How do FDA events typically differ from earnings events in terms of IV behavior?',
        options: [
          { id: 'a', text: 'FDA events have lower IV', isCorrect: false },
          { id: 'b', text: 'FDA events can have extreme IV (100%+) due to binary outcomes', isCorrect: true },
          { id: 'c', text: 'IV behaves exactly the same', isCorrect: false },
          { id: 'd', text: 'FDA events have no IV crush', isCorrect: false },
        ],
        explanation: 'FDA decisions are binary (approved/rejected) with massive stock implications, leading to extreme IV levels often exceeding 100% before the decision.',
        mentor: 'owl',
        difficulty: 'intermediate',
      },
      {
        id: 'l4-q2',
        question: 'What makes position sizing especially critical for FDA events?',
        options: [
          { id: 'a', text: 'They happen more frequently', isCorrect: false },
          { id: 'b', text: 'The all-or-nothing outcome can mean huge gains or total loss', isCorrect: true },
          { id: 'c', text: 'FDA events always result in small moves', isCorrect: false },
          { id: 'd', text: 'Position sizing doesn\'t matter for FDA plays', isCorrect: false },
        ],
        explanation: 'FDA outcomes are binary - approval can send stocks soaring, rejection can crater them. The extreme nature demands conservative position sizing.',
        mentor: 'chameleon',
        difficulty: 'intermediate',
      },
      {
        id: 'l4-q3',
        question: 'If Polymarket shows 75% approval probability but IV is at historical lows (IV Rank 15), what might this indicate?',
        options: [
          { id: 'a', text: 'Options are definitely overpriced', isCorrect: false },
          { id: 'b', text: 'Options may be underpricing a high-conviction outcome', isCorrect: true },
          { id: 'c', text: 'You should sell all options immediately', isCorrect: false },
          { id: 'd', text: 'The FDA will definitely approve', isCorrect: false },
        ],
        explanation: 'High probability conviction from prediction markets + low IV suggests options might be underpricing the potential move. This could be a long vol opportunity.',
        mentor: 'owl',
        difficulty: 'advanced',
      },
      {
        id: 'l4-q4',
        question: 'What happens to IV after an FDA decision regardless of the outcome?',
        options: [
          { id: 'a', text: 'IV increases dramatically', isCorrect: false },
          { id: 'b', text: 'IV stays elevated for weeks', isCorrect: false },
          { id: 'c', text: 'Massive IV crush occurs as uncertainty resolves', isCorrect: true },
          { id: 'd', text: 'IV behavior is unpredictable', isCorrect: false },
        ],
        explanation: 'Once the binary outcome is known, the uncertainty that justified high IV disappears instantly, causing dramatic IV crush regardless of approval or rejection.',
        mentor: 'cheetah',
        difficulty: 'beginner',
      },
    ],
  },

  // ============ LESSON 5 QUIZ ============
  {
    lessonId: 'eh-lesson-5',
    title: 'Macro Events',
    passingScore: 70,
    questions: [
      {
        id: 'l5-q1',
        question: 'How do macro events (Fed, CPI) differ from single-stock events?',
        options: [
          { id: 'a', text: 'They only affect one stock', isCorrect: false },
          { id: 'b', text: 'They have market-wide impact affecting indices and multiple sectors', isCorrect: true },
          { id: 'c', text: 'They have no impact on options', isCorrect: false },
          { id: 'd', text: 'Macro events are always predictable', isCorrect: false },
        ],
        explanation: 'Macro events like Fed decisions or CPI releases affect the entire market, not just individual stocks. This creates opportunities across indices and sectors.',
        mentor: 'owl',
        difficulty: 'beginner',
      },
      {
        id: 'l5-q2',
        question: 'What does Polymarket typically price for Fed events?',
        options: [
          { id: 'a', text: 'Stock prices', isCorrect: false },
          { id: 'b', text: 'Specific outcomes like rate cuts, holds, or hikes', isCorrect: true },
          { id: 'c', text: 'Only VIX levels', isCorrect: false },
          { id: 'd', text: 'Individual company earnings', isCorrect: false },
        ],
        explanation: 'Polymarket offers prediction markets on specific Fed outcomes - probability of a 25bp cut, 50bp cut, hold, or hike - giving precise probability data.',
        mentor: 'chameleon',
        difficulty: 'beginner',
      },
      {
        id: 'l5-q3',
        question: 'After a Fed announcement, how quickly does VIX typically normalize?',
        options: [
          { id: 'a', text: 'It takes several weeks', isCorrect: false },
          { id: 'b', text: 'Relatively quickly as the uncertainty resolves', isCorrect: true },
          { id: 'c', text: 'VIX never changes after Fed events', isCorrect: false },
          { id: 'd', text: 'It increases for months', isCorrect: false },
        ],
        explanation: 'Unlike FDA events with extreme IV, macro events see more moderate IV elevation that normalizes relatively quickly once the announcement is made.',
        mentor: 'cheetah',
        difficulty: 'intermediate',
      },
      {
        id: 'l5-q4',
        question: 'When trading macro events, why might you use index options instead of individual stocks?',
        options: [
          { id: 'a', text: 'Index options are always cheaper', isCorrect: false },
          { id: 'b', text: 'Macro events affect the whole market, making broad exposure logical', isCorrect: true },
          { id: 'c', text: 'Individual stocks don\'t react to Fed news', isCorrect: false },
          { id: 'd', text: 'Index options have no IV crush', isCorrect: false },
        ],
        explanation: 'Since macro events move the entire market, trading SPX or QQQ options gives you direct exposure to the market-wide reaction without single-stock risk.',
        mentor: 'owl',
        difficulty: 'intermediate',
      },
    ],
  },

  // ============ LESSON 6 QUIZ ============
  {
    lessonId: 'eh-lesson-6',
    title: 'Corporate Events',
    passingScore: 70,
    questions: [
      {
        id: 'l6-q1',
        question: 'What makes corporate events (M&A, leadership changes) different from earnings?',
        options: [
          { id: 'a', text: 'They always have higher IV', isCorrect: false },
          { id: 'b', text: 'They often have longer, uncertain timelines', isCorrect: true },
          { id: 'c', text: 'They have no impact on stock prices', isCorrect: false },
          { id: 'd', text: 'Prediction markets don\'t track them', isCorrect: false },
        ],
        explanation: 'Corporate events like M&A can drag on for months with regulatory approvals, due diligence, etc. This extended timeline creates different trading dynamics.',
        mentor: 'chameleon',
        difficulty: 'intermediate',
      },
      {
        id: 'l6-q2',
        question: 'Why might prediction market gaps persist longer for corporate events?',
        options: [
          { id: 'a', text: 'Because they\'re always wrong', isCorrect: false },
          { id: 'b', text: 'Incomplete information and uncertain timelines create persistent inefficiencies', isCorrect: true },
          { id: 'c', text: 'Corporate events don\'t affect options', isCorrect: false },
          { id: 'd', text: 'The gaps close immediately', isCorrect: false },
        ],
        explanation: 'Unlike scheduled earnings with known dates, corporate events have uncertain timelines and often incomplete public information, allowing gaps to persist.',
        mentor: 'owl',
        difficulty: 'advanced',
      },
      {
        id: 'l6-q3',
        question: 'When a major CEO departure is announced unexpectedly, what typically happens to IV?',
        options: [
          { id: 'a', text: 'IV decreases immediately', isCorrect: false },
          { id: 'b', text: 'IV spikes as uncertainty about company direction increases', isCorrect: true },
          { id: 'c', text: 'IV stays completely unchanged', isCorrect: false },
          { id: 'd', text: 'Only put options are affected', isCorrect: false },
        ],
        explanation: 'Unexpected leadership changes create immediate uncertainty about company direction, strategy, and future performance, causing IV to spike.',
        mentor: 'cheetah',
        difficulty: 'intermediate',
      },
      {
        id: 'l6-q4',
        question: 'For merger arbitrage situations, what role can prediction markets play?',
        options: [
          { id: 'a', text: 'None - they only track political events', isCorrect: false },
          { id: 'b', text: 'Provide probability estimates for deal completion that inform options positioning', isCorrect: true },
          { id: 'c', text: 'Replace all fundamental analysis', isCorrect: false },
          { id: 'd', text: 'Guarantee the deal will close', isCorrect: false },
        ],
        explanation: 'Prediction markets can price the probability of deal completion, regulatory approval, or deal terms changing - valuable data for options positions in M&A situations.',
        mentor: 'owl',
        difficulty: 'advanced',
      },
    ],
  },

  // ============ LESSON 7 QUIZ ============
  {
    lessonId: 'eh-lesson-7',
    title: 'Building Your System',
    passingScore: 70,
    questions: [
      {
        id: 'l7-q1',
        question: 'What is the first step in the Chameleon\'s systematic approach?',
        options: [
          { id: 'a', text: 'Place trades immediately', isCorrect: false },
          { id: 'b', text: 'Identify events where prediction markets and options data both exist', isCorrect: true },
          { id: 'c', text: 'Only look at IV', isCorrect: false },
          { id: 'd', text: 'Ignore prediction markets entirely', isCorrect: false },
        ],
        explanation: 'The system starts with finding tradeable events that have both prediction market coverage AND liquid options - both data sources must exist for the gap analysis to work.',
        mentor: 'chameleon',
        difficulty: 'beginner',
      },
      {
        id: 'l7-q2',
        question: 'Why is journaling trades important in the Event Horizons framework?',
        options: [
          { id: 'a', text: 'It\'s not important', isCorrect: false },
          { id: 'b', text: 'To track which gap patterns lead to profitable outcomes over time', isCorrect: true },
          { id: 'c', text: 'Only for tax purposes', isCorrect: false },
          { id: 'd', text: 'To impress other traders', isCorrect: false },
        ],
        explanation: 'Journaling helps you learn which types of gaps (long vol vs short vol, by event type) produce the best results for your trading style over time.',
        mentor: 'owl',
        difficulty: 'intermediate',
      },
      {
        id: 'l7-q3',
        question: 'What percentage of capital should you risk on any single Event Horizons trade according to best practices?',
        options: [
          { id: 'a', text: '50% or more for big opportunities', isCorrect: false },
          { id: 'b', text: 'A small percentage (1-5%) to survive inevitable losses', isCorrect: true },
          { id: 'c', text: '100% when you\'re confident', isCorrect: false },
          { id: 'd', text: 'Risk amount doesn\'t matter', isCorrect: false },
        ],
        explanation: 'Even the best gaps can fail. Small position sizing ensures you can survive a string of losses and remain in the game to capture the wins.',
        mentor: 'chameleon',
        difficulty: 'beginner',
      },
      {
        id: 'l7-q4',
        question: 'How should you handle a situation where prediction probability and IV both suggest the same direction (no gap)?',
        options: [
          { id: 'a', text: 'Trade anyway with maximum size', isCorrect: false },
          { id: 'b', text: 'Recognize there\'s no edge and consider waiting for better setups', isCorrect: true },
          { id: 'c', text: 'Always short volatility in this case', isCorrect: false },
          { id: 'd', text: 'Double your position', isCorrect: false },
        ],
        explanation: 'When markets agree, there\'s no gap to exploit. The Chameleon waits patiently for disagreement rather than forcing trades without edge.',
        mentor: 'chameleon',
        difficulty: 'intermediate',
      },
    ],
  },

  // ============ LESSON 8 QUIZ (CAPSTONE) ============
  {
    lessonId: 'eh-lesson-8',
    title: 'Capstone: The Adaptive Trader',
    passingScore: 80, // Higher passing score for capstone
    questions: [
      {
        id: 'l8-q1',
        question: 'A stock shows: 82% Polymarket earnings beat probability, IV Rank of 25, historical crush average of 45%. What does the Chameleon likely see?',
        options: [
          { id: 'a', text: 'A short volatility opportunity', isCorrect: false },
          { id: 'b', text: 'A potential long volatility opportunity - options may be underpriced', isCorrect: true },
          { id: 'c', text: 'No tradeable signal', isCorrect: false },
          { id: 'd', text: 'Time to exit all positions', isCorrect: false },
        ],
        explanation: 'High probability conviction (82%) + low IV Rank (25) = potential underpriced volatility. The market has conviction but options are cheap relative to history.',
        mentor: 'chameleon',
        difficulty: 'advanced',
      },
      {
        id: 'l8-q2',
        question: 'You have a long straddle before earnings. The company beats expectations (as Polymarket predicted), stock moves +6%, but your trade loses money. What happened?',
        options: [
          { id: 'a', text: 'The market is broken', isCorrect: false },
          { id: 'b', text: 'IV crush exceeded the value of the directional move', isCorrect: true },
          { id: 'c', text: 'You used the wrong broker', isCorrect: false },
          { id: 'd', text: 'This is impossible', isCorrect: false },
        ],
        explanation: 'Classic IV crush scenario. The +6% move wasn\'t large enough to offset the collapse in implied volatility. This is why understanding expected move vs actual move matters.',
        mentor: 'cheetah',
        difficulty: 'advanced',
      },
      {
        id: 'l8-q3',
        question: 'FDA decision tomorrow: 65% Polymarket approval probability, IV at 120%, IV Rank 95. What\'s the Chameleon\'s likely assessment?',
        options: [
          { id: 'a', text: 'Strong long volatility opportunity', isCorrect: false },
          { id: 'b', text: 'Potential short volatility - options may be overpriced given uncertain outcome', isCorrect: true },
          { id: 'c', text: 'Ignore FDA events completely', isCorrect: false },
          { id: 'd', text: 'Both markets agree perfectly', isCorrect: false },
        ],
        explanation: '65% is only moderate conviction, but IV Rank 95 means options are extremely expensive. The uncertain probability doesn\'t justify the premium being charged.',
        mentor: 'owl',
        difficulty: 'advanced',
      },
      {
        id: 'l8-q4',
        question: 'What is the core principle Cameron the Chameleon teaches about market adaptation?',
        options: [
          { id: 'a', text: 'Always follow the crowd', isCorrect: false },
          { id: 'b', text: 'Stick to one strategy regardless of conditions', isCorrect: false },
          { id: 'c', text: 'Adapt your approach based on what both markets are telling you', isCorrect: true },
          { id: 'd', text: 'Prediction markets are always right', isCorrect: false },
        ],
        explanation: 'Like a chameleon adapts to its environment, traders should adapt their strategy based on the signals from both prediction markets AND options volatility.',
        mentor: 'chameleon',
        difficulty: 'intermediate',
      },
      {
        id: 'l8-q5',
        question: 'After completing Event Horizons, what should be your ongoing practice?',
        options: [
          { id: 'a', text: 'Never trade events again', isCorrect: false },
          { id: 'b', text: 'Trade every single event with maximum size', isCorrect: false },
          { id: 'c', text: 'Continuously compare prediction probabilities with options data to find gaps', isCorrect: true },
          { id: 'd', text: 'Only use prediction markets and ignore options', isCorrect: false },
        ],
        explanation: 'The Event Horizons framework is an ongoing practice - constantly scanning for gaps between what prediction markets say and what options are pricing.',
        mentor: 'chameleon',
        difficulty: 'intermediate',
      },
    ],
  },
];

// ============ Helper Functions ============

export const getQuizByLessonId = (lessonId: string): LessonQuiz | undefined => {
  return EVENT_HORIZONS_QUIZZES.find((quiz) => quiz.lessonId === lessonId);
};

export const calculateQuizScore = (
  answers: Record<string, string>,
  quiz: LessonQuiz
): { score: number; total: number; percentage: number; passed: boolean } => {
  let correct = 0;
  const total = quiz.questions.length;

  quiz.questions.forEach((question) => {
    const selectedAnswer = answers[question.id];
    const correctOption = question.options.find((opt) => opt.isCorrect);
    if (selectedAnswer === correctOption?.id) {
      correct++;
    }
  });

  const percentage = Math.round((correct / total) * 100);
  return {
    score: correct,
    total,
    percentage,
    passed: percentage >= quiz.passingScore,
  };
};

export const getQuestionsByDifficulty = (
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): QuizQuestion[] => {
  return EVENT_HORIZONS_QUIZZES.flatMap((quiz) =>
    quiz.questions.filter((q) => q.difficulty === difficulty)
  );
};

export const getQuestionsByMentor = (
  mentor: 'chameleon' | 'cheetah' | 'owl'
): QuizQuestion[] => {
  return EVENT_HORIZONS_QUIZZES.flatMap((quiz) =>
    quiz.questions.filter((q) => q.mentor === mentor)
  );
};
