// Jungle Trading Academy - Animal Mentors for Mobile
// Ported from web app

export interface MentorToolkitItem {
  calculatorId: string;
  label: string;
  reason: string;
}

export interface MentorTip {
  trigger: string;
  message: string;
}

export interface MentorChallenge {
  id: string;
  title: string;
  description: string;
  criteria: string;
  difficulty: 1 | 2 | 3;
}

export interface JungleAnimal {
  id: string;
  name: string;
  characterName: string;
  emoji: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  riskStars: number;
  personality: string;
  catchphrase: string;
  philosophy: string;
  colors: {
    primary: string;
    accent: string;
    bg: string;
  };
  dialogues: {
    greeting: string;
    encouragement: string;
    quizCorrect: string;
    quizIncorrect: string;
    lessonComplete: string;
    strategyComplete: string;
  };
  favoriteStrategies: string[];

  // Extended mentor profile fields (ported from desktop)
  extendedBio?: string;
  tradingPhilosophy?: string;
  realWorldAnalogy?: string;
  coreStrategies?: string[];
  advancedStrategies?: string[];
  learningOrder?: string[];
  mentorToolkit?: MentorToolkitItem[];
  contextualTips?: MentorTip[];
  tribeAffinity?: string;
  mentorChallenges?: MentorChallenge[];
  unlocked?: boolean;
  warningMessage?: string;
  collaboratingMentors?: string[];
}

export const JUNGLE_ANIMALS: Record<string, JungleAnimal> = {
  turtle: {
    id: 'turtle',
    name: 'The Patient Protector',
    characterName: 'Terry',
    emoji: 'turtle',
    riskLevel: 'conservative',
    riskStars: 1,
    personality: 'Patient, protective, steady. Terry believes slow and steady wins the race.',
    catchphrase: 'Slow and steady wins the race.',
    philosophy: 'Never rush, never panic. Sleep soundly knowing your downside is protected.',
    colors: {
      primary: '#22c55e',
      accent: '#86efac',
      bg: 'rgba(34, 197, 94, 0.1)',
    },
    dialogues: {
      greeting: 'Welcome, friend. No need to rush. Let\'s take our time.',
      encouragement: 'Patience is a superpower in trading. You\'re doing well.',
      quizCorrect: 'Excellent. Slow and steady understanding leads to consistent profits.',
      quizIncorrect: 'No worries. The market will be there tomorrow. Let\'s review.',
      lessonComplete: 'Another step forward. Small steps lead to big journeys.',
      strategyComplete: 'You\'ve mastered a conservative strategy. Your portfolio thanks you.',
    },
    favoriteStrategies: ['covered-call', 'protective-put', 'collar'],
    unlocked: true,
    extendedBio: `Terry the Turtle has been crawling through markets since before most traders were born. A former pension fund advisor who watched the dot-com bubble pop, the 2008 financial crisis unfold, and every "once-in-a-generation" crash in between, Terry realized early that survival is the only edge that matters. While flashier traders blew up their accounts chasing triple-digit returns, Terry was quietly compounding at 8-12% a year — and still standing when the dust settled.

Born in the marshlands of conservative capital management, Terry earned his shell through decades of disciplined position management. He never takes a trade without knowing his worst-case scenario. He never risks more than he can afford to lose. And he never, ever panics. His students joke that his heart rate has never exceeded 60 BPM — not even during a flash crash.

What makes Terry special is not brilliance or speed — it's the radical simplicity of his approach. He buys quality stocks, sells covered calls against them, and uses protective puts like insurance policies. It's not sexy. It will never make headlines. But Terry's students sleep soundly at night, and their portfolios grow like old oak trees — slowly, steadily, and with deep roots.`,
    tradingPhilosophy: `The cornerstone of Terry's philosophy is that capital preservation IS alpha. In a world obsessed with returns, most traders overlook the mathematics of loss: a 50% drawdown requires a 100% gain just to break even. Terry sidesteps this trap entirely by building positions that generate income while limiting downside. Covered calls reduce cost basis on stocks he already loves. Protective puts act as insurance against catastrophe. Collars lock in a range where he can't lose big — even if he caps his upside.

This approach works because it aligns with how markets actually behave over long periods. Stocks trend upward over decades, but they do so through gut-wrenching volatility. Terry's strategies smooth that ride. By selling premium against his holdings, he gets paid to wait. By buying protection, he ensures no single event can knock him out of the game. It's the trading equivalent of wearing a seatbelt — boring until the day it saves your life.

The psychological advantage is just as important as the mathematical one. Traders who fear every red candle make terrible decisions. They sell at bottoms, chase at tops, and overtrade their way to ruin. Terry's protected positions give him the emotional stability to do nothing when doing nothing is the right move — which, in markets, is most of the time.`,
    realWorldAnalogy: `Terry trades like a retirement fund manager at a conservative pension fund. He's not trying to beat the market in any given year — he's trying to make sure the money is there in thirty years. Imagine a farmer who plants the same reliable crops every season, takes out weather insurance, and sells forward contracts on his harvest. He'll never get rich overnight, but he'll never go hungry either. That's Terry: slow compounding, never flashy, always growing.`,
    coreStrategies: ['covered-call', 'protective-put', 'collar', 'cash-secured-put'],
    advancedStrategies: [],
    learningOrder: ['cash-secured-put', 'covered-call', 'protective-put', 'collar'],
    mentorToolkit: [
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Before I enter any trade, I want to know my odds. No guessing — just math. This calculator tells me whether the probability is in my favor.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'I need to see the payoff diagram. Every trade should have a clear picture of where I make money and where I lose it. No surprises.',
      },
      {
        calculatorId: 'position-sizing-calculator',
        label: 'Position Sizing',
        reason: 'The most important decision in any trade is how much capital to allocate. This tool keeps me from ever betting too big on a single position.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome, friend. Take a deep breath. There\'s no rush here. The first rule of trading is to survive — everything else comes second.' },
      { trigger: 'completed_first_strategy', message: 'You\'ve learned your first strategy. That\'s a shell on your back now — protection you carry with you. Keep building.' },
      { trigger: 'completed_all_core', message: 'You now have a complete conservative toolkit. These four strategies are all most investors ever need. Master them before seeking more.' },
      { trigger: 'quiz_failed', message: 'No worries at all. The market will be there tomorrow, and the day after. Review the material slowly and try again when you\'re ready.' },
      { trigger: 'quiz_perfect', message: 'Perfect score. That\'s the patience paying off. You understood every concept because you took the time to truly learn it.' },
      { trigger: 'streak_3_days', message: 'Three days in a row. Consistency is the most underrated skill in trading. Small steps, every day, add up to extraordinary results.' },
      { trigger: 'returning_user', message: 'Welcome back, old friend. Ready to pick up where we left off? No need to rush — steady progress is the fastest path.' },
      { trigger: 'viewing_advanced', message: 'Advanced strategies can be tempting, but remember — the simplest strategy executed well beats a complex one executed poorly.' },
    ],
    tribeAffinity: 'lion-pride',
    mentorChallenges: [
      {
        id: 'turtle-challenge-1',
        title: 'The Income Generator',
        description: 'Paper trade a covered call on a stock you\'d be happy to own for 10 years. Pick a strike price above your purchase price and calculate the annualized return from the premium collected. Does it beat a savings account?',
        criteria: 'Calculate the annualized premium yield and compare it to a 5% benchmark. Document your strike selection reasoning.',
        difficulty: 1,
      },
      {
        id: 'turtle-challenge-2',
        title: 'The Insurance Policy',
        description: 'You own 100 shares of a stock and earnings are next week. Use the Profit Calculator to compare: (A) holding with no protection, (B) buying a protective put, (C) putting on a collar. Which approach lets you sleep at night?',
        criteria: 'Compare max loss, max gain, and breakeven for all three approaches. Explain which you\'d choose and why.',
        difficulty: 2,
      },
      {
        id: 'turtle-challenge-3',
        title: 'The Full Shell',
        description: 'Design a complete conservative portfolio using only Terry\'s four strategies. Allocate a hypothetical $50,000 across 3-5 positions. Each position must use one of the core strategies. Calculate the portfolio\'s maximum drawdown if every stock drops 20%.',
        criteria: 'Show position sizing, strategy selection per position, and total portfolio risk. Max drawdown must be under 10%.',
        difficulty: 3,
      },
    ],
  },

  owl: {
    id: 'owl',
    name: 'The Analytical Scholar',
    characterName: 'Oliver',
    emoji: 'owl',
    riskLevel: 'moderate',
    riskStars: 3,
    personality: 'Analytical, scholarly, thorough. Oliver spends hours analyzing volatility surfaces.',
    catchphrase: 'Knowledge is the ultimate edge.',
    philosophy: 'Never enter a trade without understanding every Greek.',
    colors: {
      primary: '#3b82f6',
      accent: '#93c5fd',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    dialogues: {
      greeting: 'Ah, a fellow seeker of knowledge! Let\'s dive into the data.',
      encouragement: 'Your analytical skills are improving. The numbers tell the story.',
      quizCorrect: 'Precisely calculated! Your understanding is mathematically sound.',
      quizIncorrect: 'Hmm, let\'s re-examine the variables. There\'s always more to learn.',
      lessonComplete: 'Excellent scholarship. Another theorem added to your knowledge.',
      strategyComplete: 'This strategy is now fully understood. Your analytical edge grows.',
    },
    favoriteStrategies: ['iron-condor', 'iron-butterfly', 'diagonal-spread', 'long-straddle'],
    unlocked: false,
    extendedBio: `Oliver the Owl didn't become the Analytical Scholar by accident. A former quantitative researcher who spent seven years building volatility models at a derivatives desk, Oliver left the institutional world because he believed every retail trader deserved access to the same analytical rigor the big firms used. He doesn't trade on gut feelings, rumors, or chart patterns drawn with crayons. He trades on math — and he'll teach you to do the same.

From his perch high above the trading floor, Oliver sees what others miss: the interplay between implied and realized volatility, the subtle shifts in skew that signal fear or complacency, and the Greek interactions that turn a mediocre position into a precisely calibrated probability machine. His students call him "The Professor" because every lesson feels like a graduate seminar — dense, rigorous, and worth every minute.

What sets Oliver apart is his insistence that complexity is not the enemy — ignorance is. An iron condor isn't complicated when you understand each leg. A double diagonal isn't intimidating when you can read its Greek profile like a spreadsheet. Oliver's gift is making the complex feel logical, turning intimidation into understanding, one variable at a time.`,
    tradingPhilosophy: `Oliver's core thesis is that options are mispriced probability distributions, and the informed trader's job is to exploit the gap between implied and realized outcomes. Every option price encodes a market expectation. When those expectations are wrong — and they frequently are — the analytical trader profits. But you can't exploit mispricings you can't measure, which is why Oliver insists on fluency in the Greeks before anything else.

Iron condors and iron butterflies work because volatility is mean-reverting. Markets spend most of their time in ranges, and selling premium at the edges of those ranges collects the "fear tax" that nervous participants overpay. Butterflies and condors work because they define risk precisely — you always know your max loss, your max gain, and your breakeven. There are no ambiguous outcomes, only well-defined probability spaces.

The psychological discipline Oliver teaches is equally important: the ability to be wrong gracefully. An analytical trader with a 60% win rate and proper position sizing will compound steadily. The key is managing losers quickly, letting winners decay to expiration, and never letting a single trade exceed your risk budget. Data over ego, probability over conviction, process over outcome — that's the Oliver way.`,
    realWorldAnalogy: `Oliver trades like an actuary at an insurance company. An actuary doesn't predict whether YOUR house will burn down — they know the probability across ten thousand houses and price premiums accordingly. Oliver does the same with options: he doesn't predict where a stock will go, he prices the range of outcomes, sells overpriced insurance to nervous traders, and profits from the law of large numbers. Over enough trades, the math always wins.`,
    coreStrategies: ['iron-condor', 'iron-butterfly', 'long-straddle', 'diagonal-spread'],
    advancedStrategies: ['long-put-butterfly', 'double-diagonal'],
    learningOrder: ['iron-condor', 'long-straddle', 'iron-butterfly', 'diagonal-spread', 'long-put-butterfly', 'double-diagonal'],
    mentorToolkit: [
      {
        calculatorId: 'greeks-visualizer',
        label: 'Greeks Visualizer',
        reason: 'Understanding the Greeks is non-negotiable. This tool shows you how delta, gamma, theta, and vega interact across your position. It\'s the analytical foundation for everything I teach.',
      },
      {
        calculatorId: 'iv-crush-calculator',
        label: 'IV Crush Calculator',
        reason: 'The difference between implied and realized volatility is where the edge lives. This calculator shows you how much volatility needs to collapse for your position to profit.',
      },
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Every trade is a probability. Before you enter, you should know the exact likelihood of profit based on current implied volatility. No guessing allowed in my classroom.',
      },
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'This tells you what the market is pricing in. If you\'re selling an iron condor, you need to know whether your wings are inside or outside the expected move. Data drives decisions.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome, scholar. Before we touch any strategy, we need to build your analytical foundation. Do you know your Greeks? If not, start with the Greeks Visualizer.' },
      { trigger: 'completed_first_strategy', message: 'One strategy understood analytically. Good. Notice how every variable connects to every other? That\'s the beauty of options math.' },
      { trigger: 'completed_all_core', message: 'You\'ve mastered the core analytical strategies. You now understand probability selling, volatility trading, and defined-risk positioning. The advanced material will build on this foundation.' },
      { trigger: 'quiz_failed', message: 'Hmm. The data suggests a gap in understanding. Let\'s identify the specific variable you missed and re-examine it. Precision matters.' },
      { trigger: 'quiz_perfect', message: 'Mathematically flawless. Every answer calculated correctly. Your analytical framework is sound — now it\'s about repetition and application.' },
      { trigger: 'streak_3_days', message: 'Three consecutive days of study. Research shows that spaced repetition is the most effective learning method. Your consistency will compound like theta decay.' },
      { trigger: 'returning_user', message: 'Welcome back. Your knowledge doesn\'t decay as fast as theta — but a review never hurts. Where shall we pick up the analysis?' },
      { trigger: 'viewing_advanced', message: 'Advanced strategies are just combinations of the basics. If you understand each leg individually, the multi-leg structure reveals itself logically.' },
    ],
    tribeAffinity: 'owl-parliament',
    mentorChallenges: [
      {
        id: 'owl-challenge-1',
        title: 'The Greek Profile',
        description: 'Open the Greeks Visualizer and build an iron condor with 30 DTE. Document the position\'s delta, gamma, theta, and vega at entry. Now move the underlying price up 5% and down 5%. How do the Greeks change? Which Greek matters most?',
        criteria: 'Record all four Greeks at three price points (current, +5%, -5%). Identify which Greek drives the position\'s P&L the most and explain why.',
        difficulty: 1,
      },
      {
        id: 'owl-challenge-2',
        title: 'The Volatility Edge',
        description: 'Find a stock with IV Rank above 50 using the IV Rank Tool. Construct an iron condor with strikes at the expected move boundaries. Use the POP calculator to verify your probability of profit exceeds 60%. Paper trade the position and track it to expiration.',
        criteria: 'Document IV Rank at entry, strike selection logic, POP calculation, and final P&L. Explain whether the volatility premium was justified.',
        difficulty: 2,
      },
      {
        id: 'owl-challenge-3',
        title: 'The Butterfly Lab',
        description: 'Compare a long call butterfly, iron butterfly, and iron condor on the same underlying with the same expiration. Use the Profit Calculator to overlay all three payoff diagrams. Analyze which structure offers the best risk/reward at the current IV level.',
        criteria: 'Create side-by-side comparison of max profit, max loss, breakeven range width, and probability of profit for all three structures. Recommend one with full reasoning.',
        difficulty: 3,
      },
    ],
  },

  cheetah: {
    id: 'cheetah',
    name: 'The Speed Demon',
    characterName: 'Chase',
    emoji: 'cheetah',
    riskLevel: 'aggressive',
    riskStars: 4,
    personality: 'Fast, focused, fearless. Chase lives for 0DTE options and momentum plays.',
    catchphrase: 'Speed kills—hesitation kills faster.',
    philosophy: 'In the jungle of trading, the fastest predator eats.',
    colors: {
      primary: '#f59e0b',
      accent: '#fcd34d',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    dialogues: {
      greeting: 'Ready to move fast? The market waits for no one. Let\'s go!',
      encouragement: 'Quick thinking! That\'s the speed we need.',
      quizCorrect: 'Lightning fast and correct! You\'ve got the instincts.',
      quizIncorrect: 'Too slow on that one. Speed comes with practice. Again!',
      lessonComplete: 'Fast learner! You\'re building reflexes of a true momentum trader.',
      strategyComplete: 'This strategy is now muscle memory. Execute with confidence!',
    },
    favoriteStrategies: ['long-call', 'long-put', 'bull-call-spread', 'long-strangle'],
    unlocked: false,
    extendedBio: `Chase the Cheetah doesn't walk — he sprints. A former proprietary trader who cut his teeth in the lightning-fast world of 0DTE options, Chase discovered that the shortest timeframes hold the biggest opportunities — if you're fast enough to grab them. While other mentors talk about patience and waiting, Chase talks about conviction, execution speed, and the kill zone where momentum traders feast.

Before the jungle, Chase ran a day-trading desk where hesitation was a firing offense. He learned that in fast markets, the first mover wins and the hesitator becomes the exit liquidity. That edge didn't come from recklessness — it came from preparation. Chase spends hours before the market open studying levels, identifying catalysts, and building decision trees so that when the bell rings, he can act on instinct instead of deliberation.

What makes Chase dangerous — in the best possible way — is his ability to combine raw speed with surgical risk management. He never sprints without a stop loss. He never enters without knowing his exit. And he never lets a winning trade turn into a loser. His motto isn't just "speed kills" — it's that speed combined with discipline creates an edge that slower traders simply cannot replicate.`,
    tradingPhilosophy: `Chase's trading philosophy is built on the observation that markets are not efficient in the short term. News, momentum, and crowd psychology create predictable patterns in the minutes and hours after a catalyst. Earnings surprises, Fed announcements, sector rotations — these events create directional waves that a fast trader can ride for quick, defined profits. The key word is "defined." Chase doesn't gamble on direction blindly; he buys calls or puts when the risk/reward is asymmetric, and he uses spreads to cap his cost when the setup demands it.

The mathematical edge in momentum trading comes from convexity. A long call costs a fixed premium but has theoretically unlimited upside. When you identify a high-conviction directional move early, the leverage embedded in options amplifies your returns far beyond what stock trading offers. Bull call spreads reduce the cost of entry while still capturing the meat of the move. Backspreads give you asymmetric payoffs in volatile environments. Every tool in Chase's arsenal is designed to maximize the upside of being right while strictly limiting the cost of being wrong.

The biggest risk in momentum trading isn't being wrong — it's being undisciplined when you're wrong. Chase teaches strict stop losses, predetermined position sizes, and the emotional discipline to cut a loser instantly without ego. A cheetah that misses its prey doesn't chase it for miles — it stops, conserves energy, and waits for the next opportunity. That's the mindset: win fast, lose small, move on.`,
    realWorldAnalogy: `Chase trades like a professional poker player at a high-stakes table. He folds most hands (most setups aren't worth the risk), but when he sees a monster hand (a high-conviction catalyst), he bets aggressively and fast. He doesn't stay married to a position — he takes the pot and moves to the next hand. The best poker players don't play every hand; they play the RIGHT hands with maximum conviction. That's Chase.`,
    coreStrategies: ['long-call', 'long-put', 'bull-call-spread', 'long-strangle', 'call-backspread'],
    advancedStrategies: ['put-backspread', 'strap'],
    learningOrder: ['long-call', 'long-put', 'bull-call-spread', 'long-strangle', 'call-backspread', 'put-backspread', 'strap'],
    mentorToolkit: [
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'Before I sprint, I need to know how far the prey can run. The expected move tells me if my target is realistic or if I\'m chasing a ghost.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'I need to see the payoff NOW — not after the trade. Quick visualization, quick decision. This tool shows me the risk/reward in seconds.',
      },
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Even speed traders need probabilities. I don\'t sprint unless the odds are at least reasonable. This keeps me from chasing bad setups.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'High IV means expensive options. I need to know if I\'m overpaying for my calls before I commit. Timing volatility is part of timing the trade.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome to the fast lane! Before we start sprinting, here\'s rule one: speed without discipline is just recklessness. We\'re going to be fast AND smart.' },
      { trigger: 'completed_first_strategy', message: 'First strategy down! You\'re building the reflexes. Remember — the goal isn\'t to trade constantly, it\'s to strike decisively when the setup is right.' },
      { trigger: 'completed_all_core', message: 'You\'ve got the core weapons. Long calls for conviction, spreads for cost efficiency, strangles for volatility. Now it\'s about reading setups and pulling the trigger without hesitation.' },
      { trigger: 'quiz_failed', message: 'Missed that one. No big deal — even the fastest hunters miss sometimes. Review, reload, and come back sharper. Speed comes from understanding, not guessing.' },
      { trigger: 'quiz_perfect', message: 'LIGHTNING fast and flawless! That\'s the instinct I\'m talking about. When you know the material cold, execution becomes automatic.' },
      { trigger: 'streak_3_days', message: 'Three days of consistent training. You\'re building muscle memory. A cheetah doesn\'t think about running — it just runs. That\'s what we\'re building here.' },
      { trigger: 'returning_user', message: 'Back in the hunt! Markets don\'t wait, and neither do we. Let\'s pick up the pace right where we left off.' },
      { trigger: 'viewing_advanced', message: 'Advanced momentum strategies amplify everything — the wins AND the risk. Make sure your core strategies are muscle memory before you add these to your arsenal.' },
    ],
    tribeAffinity: 'cheetah-sprint',
    mentorChallenges: [
      {
        id: 'cheetah-challenge-1',
        title: 'The Quick Strike',
        description: 'Find an upcoming earnings announcement. Before the report, use the Expected Move calculator to determine the implied move. Buy a long straddle or strangle at those levels (paper trade). After earnings, compare the actual move to the expected move.',
        criteria: 'Document the expected move pre-earnings, your entry price, the actual move, and your P&L. Did the actual move exceed the expected move? Would the trade have been profitable?',
        difficulty: 1,
      },
      {
        id: 'cheetah-challenge-2',
        title: 'The Spread Sprint',
        description: 'Paper trade three bull call spreads on the same underlying with different width between strikes (narrow, medium, wide). Track each for one week. Which width provided the best risk/reward ratio? Consider win rate vs. magnitude of gains.',
        criteria: 'Compare the three spreads on cost of entry, max profit, max loss, breakeven, and final P&L. Explain which width you\'d use in the future and why.',
        difficulty: 2,
      },
      {
        id: 'cheetah-challenge-3',
        title: 'The Backspread Blitz',
        description: 'Identify a stock with elevated IV Rank that you expect to make a large directional move. Construct a call backspread (sell 1 lower strike call, buy 2 higher strike calls) for near-zero cost. Use the Profit Calculator to map the payoff. Paper trade through the catalyst.',
        criteria: 'Show the position\'s construction, net debit/credit, breakeven points, and unlimited upside potential. Track the actual move and calculate theoretical P&L.',
        difficulty: 3,
      },
    ],
  },

  fox: {
    id: 'fox',
    name: 'The Cunning Strategist',
    characterName: 'Fiona',
    emoji: 'fox',
    riskLevel: 'moderate',
    riskStars: 3,
    personality: 'Cunning, strategic, precise. Fiona always has an angle.',
    catchphrase: 'There\'s always an angle.',
    philosophy: 'Find the angle that others miss, and profit from their blindness.',
    colors: {
      primary: '#a855f7',
      accent: '#c4b5fd',
      bg: 'rgba(168, 85, 247, 0.1)',
    },
    dialogues: {
      greeting: 'Looking for an edge? I know where to find them. Follow me.',
      encouragement: 'Clever thinking! You\'re starting to see the angles.',
      quizCorrect: 'Cunningly correct! You found the hidden insight.',
      quizIncorrect: 'There\'s a subtlety you missed. Look from another angle.',
      lessonComplete: 'Another secret revealed. Your strategic toolkit expands.',
      strategyComplete: 'This strategy is now your secret weapon. Use it wisely.',
    },
    favoriteStrategies: ['pmcc', 'diagonal-spread', 'broken-wing-butterfly', 'calendar-spread'],
    unlocked: false,
    extendedBio: `Fiona the Fox is the trader that market makers lose sleep over. A former volatility arbitrageur who spent a decade trading exotic structures on the institutional side, Fiona sees angles in options markets that most retail traders don't even know exist. Skew trades, calendar mispricings, broken-wing butterflies that collect credit while limiting risk — these aren't just strategies to Fiona, they're art forms.

Fiona earned her reputation in the jungle by doing what foxes do best: finding opportunities that others walk right past. When everyone is fixated on directional bets, Fiona is analyzing the volatility term structure. When the crowd chases earnings plays, she's constructing diagonal spreads that profit whether the stock moves or sits still. Her edge isn't in predicting direction — it's in understanding the structure of options pricing better than the person on the other side of the trade.

What makes Fiona truly special as a mentor is her ability to teach nuance. Options aren't just bullish or bearish bets — they're multi-dimensional instruments affected by time, volatility, skew, and the Greeks in ways that create hidden edges. Fiona teaches her students to stop thinking in two dimensions (up or down) and start thinking in four (direction, magnitude, time, and volatility). Once you see markets through Fiona's eyes, you'll never look at a simple call or put the same way again.`,
    tradingPhilosophy: `Fiona's philosophy rests on a contrarian insight: the biggest edges in options trading aren't in predicting direction — they're in structure. Two traders can have the exact same market view and wildly different outcomes, purely based on how they structure their positions. A poor man's covered call captures the same bullish thesis as buying stock, but with a fraction of the capital and defined downside. A broken-wing butterfly collects a credit while maintaining an asymmetric payoff. Structure IS the edge.

This works because options pricing is inherently complex, and complexity creates mispricings. The volatility smile isn't flat — it's skewed, and that skew changes over time and across expirations. Calendar spreads exploit differences in time decay between near and far expirations. Diagonals combine directional and time-based edges in a single structure. Jade lizards collect premium with no upside risk. Each of these strategies exists because options pricing creates nooks and crannies where patient, analytical traders find value.

The psychological dimension of Fiona's approach is patience combined with precision. She doesn't trade every day — she waits for specific structural setups where the risk/reward is genuinely asymmetric. When a calendar spread trades at a discount to fair value, she strikes. When skew is unusually steep, she builds a broken-wing butterfly. The fox doesn't chase rabbits — she identifies the one rabbit that can't escape and takes the optimal angle of approach.`,
    realWorldAnalogy: `Fiona trades like a real estate developer who sees value where others see a run-down building. While everyone else focuses on the fancy new condo downtown, Fiona finds the underpriced fixer-upper in an up-and-coming neighborhood. She doesn't just buy it — she restructures it, adding value through clever design, converting dead space into rental units, and creating income streams others didn't realize were possible. The profit isn't in the obvious play; it's in the angle no one else thought to look at.`,
    coreStrategies: ['pmcc', 'diagonal-spread', 'calendar-spread', 'broken-wing-butterfly', 'jade-lizard'],
    advancedStrategies: ['double-diagonal', 'ratio-spread'],
    learningOrder: ['calendar-spread', 'diagonal-spread', 'pmcc', 'broken-wing-butterfly', 'jade-lizard', 'double-diagonal', 'ratio-spread'],
    mentorToolkit: [
      {
        calculatorId: 'iv-crush-calculator',
        label: 'IV Crush Calculator',
        reason: 'Darling, if you don\'t understand how volatility collapse affects your position, you\'re playing blind. This tool reveals the hidden variable that separates amateurs from pros.',
      },
      {
        calculatorId: 'greeks-visualizer',
        label: 'Greeks Visualizer',
        reason: 'My strategies have complex Greek profiles. You need to see how delta, theta, and vega interact across a diagonal or calendar. This visualizer is your x-ray vision.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'Multi-leg strategies have non-obvious payoff curves. Before you enter any of my structures, you should see exactly what the P&L looks like across all price points.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'Many of my strategies depend on whether volatility is high or low relative to history. The IV Rank tells me whether to buy premium or sell it — and that changes everything about the structure.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Ah, a new student with fresh eyes. Good. The first thing I want you to forget is that options are just bullish or bearish bets. There\'s so much more to the puzzle.' },
      { trigger: 'completed_first_strategy', message: 'You\'ve learned your first structural strategy. Did you notice how the payoff is different from a simple directional bet? That asymmetry is where the edge hides.' },
      { trigger: 'completed_all_core', message: 'Now you\'re thinking like a fox. You understand calendars, diagonals, and asymmetric structures. The advanced material will show you how to combine these angles for even greater precision.' },
      { trigger: 'quiz_failed', message: 'There\'s a subtlety you missed — and subtlety is everything in this game. Go back, look at it from another angle. The answer is hiding in plain sight.' },
      { trigger: 'quiz_perfect', message: 'Flawless. You spotted every angle, every nuance. That\'s the cunning eye of a true strategist. I\'m impressed.' },
      { trigger: 'streak_3_days', message: 'Three days of sharpening your edge. The foxes who succeed aren\'t the ones who trade the most — they\'re the ones who prepare the most.' },
      { trigger: 'returning_user', message: 'Welcome back, clever one. I\'ve been thinking about some new angles to show you. Ready to see what others miss?' },
      { trigger: 'viewing_advanced', message: 'These advanced structures are where it gets truly elegant. Seagulls, twisted sisters, ratio spreads — each one exploits a specific market condition. Take them one at a time.' },
    ],
    tribeAffinity: 'fox-skulk',
    mentorChallenges: [
      {
        id: 'fox-challenge-1',
        title: 'The Calendar Edge',
        description: 'Find a stock where front-month IV is significantly higher than back-month IV (check earnings dates). Construct a calendar spread that sells the expensive front month and buys the cheaper back month. Use the IV Crush Calculator to estimate the impact of volatility convergence.',
        criteria: 'Document IV levels for both expirations, the calendar spread\'s cost, and the projected profit if IV normalizes. Explain why the term structure makes this trade attractive.',
        difficulty: 1,
      },
      {
        id: 'fox-challenge-2',
        title: 'The Poor Man\'s Advantage',
        description: 'Compare a PMCC (poor man\'s covered call) to an actual covered call on the same stock. Calculate the capital required, max loss, and annualized return potential for both approaches. Which offers better capital efficiency?',
        criteria: 'Side-by-side comparison of capital requirements, risk profiles, and return on capital. Explain when you\'d choose each approach.',
        difficulty: 2,
      },
      {
        id: 'fox-challenge-3',
        title: 'The Broken Wing',
        description: 'Construct a broken-wing butterfly for a credit on a stock you\'re neutral-to-bullish on. Calculate the no-risk side, the risk side, breakeven, and max loss. Paper trade it through expiration. Then compare to a standard iron condor with similar width.',
        criteria: 'Show the full P&L diagram for both the BWB and the iron condor. Explain the structural advantage of the broken wing — where does the "free" profit zone come from?',
        difficulty: 3,
      },
    ],
  },

  retriever: {
    id: 'retriever',
    name: 'The Loyal Learner',
    characterName: 'Goldie',
    emoji: 'goldenretriever',
    riskLevel: 'moderate',
    riskStars: 2,
    personality: 'Eager, loyal, optimistic. Goldie follows her playbook faithfully.',
    catchphrase: 'Every mistake is a lesson in disguise!',
    philosophy: 'Stay loyal to your trading plan. Celebrate wins, learn from losses.',
    colors: {
      primary: '#eab308',
      accent: '#fde047',
      bg: 'rgba(234, 179, 8, 0.1)',
    },
    dialogues: {
      greeting: 'Hey there! So excited to learn together! Let\'s fetch some knowledge!',
      encouragement: 'Great job! Every step forward is progress worth celebrating!',
      quizCorrect: 'Yes! Good job! You nailed it!',
      quizIncorrect: 'Oops! That\'s okay - mistakes are learning treats in disguise!',
      lessonComplete: 'Woohoo! Another lesson learned! You\'re doing amazing!',
      strategyComplete: 'You fetched that strategy perfectly! So proud of you!',
    },
    favoriteStrategies: ['bull-put-spread', 'bear-call-spread', 'bull-call-spread'],
    unlocked: false,
    extendedBio: `Goldie the Retriever is the mentor you didn't know you needed — the one who makes you feel like you CAN do this, even when the markets feel overwhelming. A former financial literacy educator who spent a decade teaching first-generation investors how to build wealth, Goldie discovered options trading when she realized her students needed more tools than just "buy index funds and wait." She believes that every person deserves access to options education, and that the biggest barrier isn't complexity — it's confidence.

Goldie's origin story is simple and powerful: she blew up her first options account. Lost every penny in three weeks trying to trade like the gurus on social media. But instead of walking away, she did what retrievers do — she went back, fetched the lesson from the wreckage, and started over with humility. That experience shaped her teaching forever. She knows what it feels like to be scared, confused, and tempted to quit. And she knows that the students who stay, learn, and follow a system are the ones who eventually succeed.

What makes Goldie extraordinary is her gift for making options trading feel accessible. She breaks every strategy down into plain language. She celebrates small wins like they're championship trophies. She never shames a mistake — she reframes it as data. Her classroom is the safest place in the jungle, and her students have the highest completion rates of any mentor's program. Because when learning is joyful, people don't quit.`,
    tradingPhilosophy: `Goldie's philosophy is that consistency beats brilliance. She doesn't teach sexy trades or home-run strategies — she teaches a systematic approach to generating income and managing risk that any disciplined person can follow. Covered calls on stocks you already own. Cash-secured puts on stocks you'd love to buy cheaper. Simple spreads with defined risk and clear profit targets. Nothing complicated. Nothing fancy. Just a process.

This approach works because it removes the two biggest killers of retail traders: indecision and emotion. When you have a system, you don't agonize over entries and exits. When you follow a checklist, you don't revenge-trade after a loss. Goldie's students trade like pilots — pre-flight checklist, defined procedures, and no improvisation mid-flight. It's not creative, and that's the point. Creativity in trading usually means deviation from the plan, and deviation from the plan usually means losses.

The compounding effect of small, consistent wins is radically underestimated. A trader who makes 2% per month on a covered call program might sound boring, but that's 26.8% annualized — more than double what the S&P 500 averages. Goldie teaches her students to respect the power of small edges applied consistently over time, and to resist the siren song of strategies they don't fully understand. Loyalty to the process is the ultimate edge.`,
    realWorldAnalogy: `Goldie trades like a disciplined personal trainer running a group fitness class. She doesn't ask you to do Olympic lifts on day one — she starts with bodyweight exercises, celebrates your first push-up, and gradually builds your strength until those Olympic lifts feel natural. There's no ego, no shame, and no one left behind. Every workout (trade) follows a plan, every rep (position) has proper form, and progress is measured in consistency, not in any single max effort.`,
    coreStrategies: ['covered-call', 'cash-secured-put', 'bull-put-spread', 'bear-call-spread', 'iron-condor'],
    advancedStrategies: ['protective-put', 'bull-call-spread'],
    learningOrder: ['covered-call', 'cash-secured-put', 'protective-put', 'bull-put-spread', 'bull-call-spread', 'bear-call-spread', 'iron-condor'],
    mentorToolkit: [
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'I LOVE this tool! It shows you exactly what your trade looks like in a picture. Before every trade, I pull up the payoff diagram — it\'s like a map for your money!',
      },
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Want to know if a trade is a good idea? This calculator tells you your chances! I use it before every single trade. It\'s like checking the weather before a walk!',
      },
      {
        calculatorId: 'position-sizing-calculator',
        label: 'Position Sizing',
        reason: 'This is SO important! It tells you how much to invest in each trade so you never bet too much on one thing. It\'s like portion control for your portfolio!',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Hey there, welcome!! I\'m SO glad you\'re here! Don\'t worry about knowing everything right away — we\'re going to learn this step by step, and I\'ll be right here with you the whole time!' },
      { trigger: 'completed_first_strategy', message: 'YOU DID IT! Your first strategy! I\'m so proud! See? It wasn\'t that scary, was it? You\'ve got this. One strategy at a time, one step at a time!' },
      { trigger: 'completed_all_core', message: 'Look at you!! Five strategies under your belt! You now have a complete trading toolkit. Most people never get this far. I\'m SO proud of your persistence!' },
      { trigger: 'quiz_failed', message: 'Hey, no worries at all! Every single great trader has failed quizzes, blown trades, and felt confused. It\'s part of the learning process. Let\'s review together — I bet it\'ll click this time!' },
      { trigger: 'quiz_perfect', message: 'PERFECT SCORE!! Oh my goodness, you absolutely crushed it!! All that studying paid off! I\'m doing a happy dance for you right now!' },
      { trigger: 'streak_3_days', message: 'Three days in a row! That\'s a STREAK! Consistency is the secret ingredient to trading success. Keep showing up every day and you\'ll be amazed at how far you go!' },
      { trigger: 'returning_user', message: 'You came back! I knew you would! Let\'s pick up right where we left off. Every time you return, you\'re proving that you\'re serious about this. Let\'s go!' },
      { trigger: 'viewing_advanced', message: 'Ooh, looking at the advanced stuff! That\'s great — just make sure you\'re really comfortable with the basics first. A strong foundation makes everything easier!' },
    ],
    tribeAffinity: 'lion-pride',
    mentorChallenges: [
      {
        id: 'retriever-challenge-1',
        title: 'The First Fetch',
        description: 'Pick a stock you already own (or would like to own). Use the Profit Calculator to model a covered call at a strike price 5-10% above the current price with 30-45 days to expiration. Calculate the premium income as a percentage of the stock price.',
        criteria: 'Document the stock, strike, premium, and annualized return. Explain why you picked that strike price and what happens if the stock goes above it.',
        difficulty: 1,
      },
      {
        id: 'retriever-challenge-2',
        title: 'The Income Playbook',
        description: 'Create a weekly trading checklist for a cash-secured put strategy. Include: how to screen for stocks, what IV Rank to look for, how to pick the strike price, what delta to target, and when to close the trade. Then paper trade one position following your own checklist.',
        criteria: 'Produce a written checklist of at least 8 steps. Paper trade one position following the checklist exactly. Document whether you deviated from the plan and why.',
        difficulty: 2,
      },
      {
        id: 'retriever-challenge-3',
        title: 'The Spread Master',
        description: 'Paper trade all three spread types: a bull put spread, a bear call spread, and an iron condor on the same underlying. Track all three positions simultaneously for 2 weeks. Use the POP calculator to verify probability of profit before entry.',
        criteria: 'Track entry prices, probabilities, daily P&L, and exits for all three positions. Compare final results and explain which spread type you found most intuitive and why.',
        difficulty: 2,
      },
    ],
  },

  sloth: {
    id: 'sloth',
    name: 'The Passive Income King',
    characterName: 'Stanley',
    emoji: 'sloth',
    riskLevel: 'conservative',
    riskStars: 1,
    personality: 'Zen-like, patient, passive. Stanley trades maybe once a week—if he feels like it.',
    catchphrase: 'Why rush? Theta works while I nap.',
    philosophy: 'Let time decay work for you. Best trades make money while you sleep.',
    colors: {
      primary: '#14b8a6',
      accent: '#5eead4',
      bg: 'rgba(20, 184, 166, 0.1)',
    },
    dialogues: {
      greeting: 'Ahhhh... welcome. No rush... we\'ll get there... eventually.',
      encouragement: 'Remember... the market rewards... patience...',
      quizCorrect: 'Mmmmm... correct. Good things come... to those who wait.',
      quizIncorrect: 'No worries... time heals all... let\'s try again... slowly.',
      lessonComplete: 'Another lesson... absorbed. Take a moment... to rest.',
      strategyComplete: 'This strategy... will work while you sleep. Beautiful.',
    },
    favoriteStrategies: ['cash-secured-put', 'covered-call', 'short-strangle', 'calendar-spread'],
    unlocked: false,
    extendedBio: `Stanley the Sloth is living proof that the best traders are often the laziest — on purpose. A former high-frequency trader who burned out at 32, Stanley had an epiphany: the traders making the most money per hour of effort weren't the ones glued to screens all day. They were the ones selling premium, collecting theta, and checking their positions once a day over coffee. So Stanley hung up his Bloomberg terminal, moved to the canopy, and never looked back.

Stanley's transformation from overtrading speed demon to zen-like premium seller wasn't easy. He had to unlearn everything the trading culture taught him — that more activity means more profit, that you need to "work hard" to succeed, that missing a move is the same as losing money. In Stanley's world, the best trade is the one you don't make. The second-best trade is selling premium to someone who's panicking and letting time do the rest.

What makes Stanley a beloved mentor is his calming presence in a jungle full of noise. While other mentors hype up their students with urgency and intensity, Stanley teaches the art of doing less. His students learn to set up positions that decay in their favor over time, check them once a day, and spend the rest of their time doing literally anything else. His most advanced students joke that they've become better at napping than trading — and their P&L proves that's a feature, not a bug.`,
    tradingPhilosophy: `Stanley's philosophy is rooted in one mathematical truth: options are wasting assets, and time is on the seller's side. Every day that passes, the premium in an option erodes a little more — this is theta decay, and it accelerates as expiration approaches. Sellers collect this decay as income. It's like owning a parking meter: you don't need anyone to park for it to make money, you just need time to pass.

This approach works because option buyers systematically overpay for protection. Implied volatility is, on average, higher than realized volatility — meaning options are priced for more drama than actually occurs. Sellers capture this "volatility risk premium" by writing options and collecting the difference between what the market fears and what actually happens. Short strangles, covered calls, and jade lizards all exploit this same structural edge: the market pays too much for insurance, and Stanley happily sells it.

The lifestyle advantage of theta-based trading cannot be overstated. Stanley's students spend 15-30 minutes per day managing their positions. They don't need to predict direction, time entries to the minute, or stare at candles all day. They set up high-probability positions on Mondays, manage by exception, and let theta do the work. The reduced screen time also means reduced stress, fewer impulsive decisions, and better long-term results. As Stanley says: the less you do, the more you make.`,
    realWorldAnalogy: `Stanley trades like a landlord who collects rent. He doesn't renovate the building every week or panic when a tenant complains about the plumbing. He bought the property (set up the position), collects the rent check (theta decay), and deals with problems only when they actually arise. Most months, the rent just shows up. That's passive income — and it's why Stanley can nap while his portfolio works for him.`,
    coreStrategies: ['cash-secured-put', 'covered-call', 'short-strangle', 'calendar-spread', 'jade-lizard'],
    advancedStrategies: ['short-straddle', 'covered-short-straddle'],
    learningOrder: ['covered-call', 'cash-secured-put', 'calendar-spread', 'short-strangle', 'jade-lizard', 'short-straddle', 'covered-short-straddle'],
    mentorToolkit: [
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'I only... take trades where the math is in my favor. This calculator confirms... that time is on my side. High probability... is the only way I nap in peace.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'Selling premium when IV is low... is like selling umbrellas on a sunny day. This tool tells me... when the rain is coming and premiums are fat enough to sell.',
      },
      {
        calculatorId: 'greeks-visualizer',
        label: 'Greeks Visualizer',
        reason: 'Theta is my best friend... but I need to watch gamma. This visualizer shows me... how much theta I collect each day and whether gamma might wake me from my nap.',
      },
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'Before I sell a strangle... I need to know the expected range. If my strikes are outside that range... I can sleep soundly knowing the odds are with me.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Ahhhh... welcome... to the slow lane. Here\'s the first lesson... the traders who make the most per hour of effort... are the ones who trade the least. Let that sink in...' },
      { trigger: 'completed_first_strategy', message: 'Your first premium-selling strategy... beautiful. Did you notice... how time works in your favor? That feeling... is theta decay. Get used to it... it\'s addictive.' },
      { trigger: 'completed_all_core', message: 'You now have... a complete passive income toolkit. Five strategies... that work while you sleep. That\'s all most traders... ever need. Take a nap... you\'ve earned it.' },
      { trigger: 'quiz_failed', message: 'No rush... no stress. The premium will still be there... tomorrow. Review slowly... absorb deeply. Understanding takes... whatever time it takes.' },
      { trigger: 'quiz_perfect', message: 'Perfect... and unhurried. That\'s exactly how we do things... in the canopy. You understand the material... at a deep level.' },
      { trigger: 'streak_3_days', message: 'Three days... of showing up. You know what else compounds... over three days? Theta. Small, quiet, relentless. Just like your learning.' },
      { trigger: 'returning_user', message: 'Ahhhh... you\'re back. I barely noticed you were gone... because the positions kept working. That\'s the beauty... of passive strategies.' },
      { trigger: 'viewing_advanced', message: 'Advanced theta strategies... require more babysitting. Short straddles and covered straddles... need a watchful eye. Make sure the basics are... second nature first.' },
    ],
    tribeAffinity: 'lion-pride',
    mentorChallenges: [
      {
        id: 'sloth-challenge-1',
        title: 'The Passive Paycheck',
        description: 'Sell a 30-day cash-secured put on a stock you\'d be happy to own at the strike price. Calculate the annualized premium yield. Then... take the rest of the day off. Check the position tomorrow. That\'s the whole exercise.',
        criteria: 'Document the stock, strike, premium, annualized yield, and probability of profit. Explain what happens if you get assigned. Check the position only once per day for 5 days and record P&L each day.',
        difficulty: 1,
      },
      {
        id: 'sloth-challenge-2',
        title: 'The Strangle Nap',
        description: 'Sell a short strangle on a high-IV stock with strikes at the expected move boundaries (use the Expected Move calculator). Paper trade the position. Set a management rule: close at 50% of max profit. Track how many days it takes.',
        criteria: 'Document strike selection, IV Rank at entry, expected move range, premium collected, and the day you hit 50% profit target. Calculate your annualized return based on time in trade.',
        difficulty: 2,
      },
      {
        id: 'sloth-challenge-3',
        title: 'The Theta Farm',
        description: 'Build a portfolio of 3 theta-positive positions using different strategies: one covered call, one jade lizard, and one calendar spread. Each on a different underlying. Manage all three for 2 weeks with a maximum of 15 minutes of screen time per day.',
        criteria: 'Log your total daily screen time, positions, adjustments made, and final P&L for each. Calculate your "dollars earned per hour of effort." That ratio is the real scorecard.',
        difficulty: 3,
      },
    ],
  },

  badger: {
    id: 'badger',
    name: 'The Strategic Digger',
    characterName: 'Luke',
    emoji: 'badger',
    riskLevel: 'moderate',
    riskStars: 2,
    personality: 'Analytical, strategic, thorough. Luke digs deep into every trade setup.',
    catchphrase: 'Let\'s dig into this and understand every angle.',
    philosophy: 'Every trade should have defined risk. Know your max loss before you enter.',
    colors: {
      primary: '#3b82f6',
      accent: '#93c5fd',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    dialogues: {
      greeting: 'Ah, a fellow strategist! Let\'s dig into the details.',
      encouragement: 'Good analysis! Keep examining all the angles.',
      quizCorrect: 'Precisely! Your analytical thinking is sharp.',
      quizIncorrect: 'Hmm, let\'s dig a little deeper here.',
      lessonComplete: 'Excellent work. Another tool in your strategic arsenal.',
      strategyComplete: 'This strategy is now in your burrow of knowledge.',
    },
    favoriteStrategies: ['bull-put-spread', 'iron-condor', 'bear-put-spread'],
    unlocked: false,
    extendedBio: `Luke the Badger is the methodical mastermind of the jungle — the trader who never enters a position without knowing exactly what can go wrong, how much it'll cost, and where the exit is. A former risk manager at a mid-size hedge fund, Luke spent years watching brilliant traders blow up because they got sloppy with position sizing, ignored correlation risk, or simply didn't do the homework. When he finally started teaching, he made one vow: every student who leaves his burrow will know their max loss BEFORE they press the button.

Luke earned his stripes by digging. He digs into balance sheets, he digs into volatility surfaces, he digs into the fine print of every strategy. Nothing gets past him because he looks at every angle before committing. His approach isn't flashy — it's the opposite. Where other mentors celebrate big winners, Luke celebrates positions that worked exactly as planned, with no surprises. His students don't have "war stories" about trades gone wrong, because Luke doesn't let trades go wrong in the first place.

What makes Luke an exceptional mentor is his ability to teach structured thinking. Every trade follows a framework: thesis, structure, defined risk, profit target, and exit plan. There are no "let's see what happens" moments in Luke's world. His students often say that learning from Luke changed not just their trading, but their decision-making in all areas of life. When you learn to think in probabilities, define your risk, and plan your exits, you become a better thinker — period.`,
    tradingPhilosophy: `Luke's trading philosophy centers on one principle: defined risk is the foundation of sustainable trading. An iron condor with defined max loss is inherently safer than a naked short, even if the expected return is lower, because the defined-risk trader can never be wiped out by a single event. Spreads are not just risk management tools — they're survival tools. And in trading, survival is everything.

This philosophy works because the math of ruin is brutal and unforgiving. A trader with undefined risk who gets hit by a black swan event can lose years of profits in a single day. Luke's spread-based approach caps every loss at a known amount, which means his students can calculate their worst-case scenario for their entire portfolio at any moment. Bull put spreads profit from bullish views with capped downside. Iron condors profit from range-bound markets with defined wings. PMCCs provide leveraged upside with known max loss. Every tool in Luke's belt has a built-in safety mechanism.

The discipline of defined risk also unlocks better position sizing. When you know your exact max loss on every position, you can size intelligently. Luke teaches the 2% rule: never risk more than 2% of your total portfolio on a single trade. With defined-risk spreads, calculating that 2% is simple math. With undefined risk, it's a guess. And guesses kill traders.`,
    realWorldAnalogy: `Luke trades like a structural engineer designing a bridge. Before a single piece of steel is placed, every load is calculated, every stress point is analyzed, and every failure mode is planned for. The bridge doesn't collapse because the engineer didn't just hope it would hold — they proved it mathematically. Luke does the same with trades: he proves the risk is acceptable before building the position. No bridge is sexy, but every bridge that stands is a masterpiece of invisible discipline.`,
    coreStrategies: ['bull-put-spread', 'iron-condor', 'bear-put-spread', 'calendar-spread', 'broken-wing-butterfly'],
    advancedStrategies: ['pmcc', 'bear-put-ladder'],
    learningOrder: ['bull-put-spread', 'bear-put-spread', 'iron-condor', 'calendar-spread', 'broken-wing-butterfly', 'pmcc', 'bear-put-ladder'],
    mentorToolkit: [
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'Every trade needs a blueprint. This tool shows me the exact payoff structure at every price point. I don\'t enter a position without seeing the full picture first.',
      },
      {
        calculatorId: 'position-sizing-calculator',
        label: 'Position Sizing',
        reason: 'Position sizing is where most traders fail. This calculator enforces the discipline of never risking too much on a single trade. It\'s the foundation of portfolio risk management.',
      },
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'I want to know my probability of profit before I enter. If the math doesn\'t support the trade, the trade doesn\'t happen. Simple as that.',
      },
      {
        calculatorId: 'greeks-visualizer',
        label: 'Greeks Visualizer',
        reason: 'Spreads have complex Greek profiles that change as the underlying moves. I need to understand how my delta, theta, and gamma shift so I know exactly when to adjust or exit.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome to the burrow. Before we learn any strategies, let\'s establish one rule: you will always know your maximum loss BEFORE entering a trade. If you remember nothing else, remember that.' },
      { trigger: 'completed_first_strategy', message: 'Your first defined-risk strategy. Did you notice how you knew exactly what your worst case was before you entered? That clarity is your edge over 90% of traders.' },
      { trigger: 'completed_all_core', message: 'Five strategies, all with defined risk. You now have tools for bullish, bearish, neutral, and volatility environments. Every angle is covered. That\'s strategic completeness.' },
      { trigger: 'quiz_failed', message: 'Let\'s dig into where the misunderstanding happened. Every mistake has a root cause, and finding it makes you stronger. Let\'s re-examine the details together.' },
      { trigger: 'quiz_perfect', message: 'Every question answered with precision. That\'s the methodical thinking I\'m looking for. You analyzed each question like a trade setup — and it paid off.' },
      { trigger: 'streak_3_days', message: 'Three days of strategic study. Discipline compounds just like returns. Every day you show up and dig deeper, your analytical foundation gets stronger.' },
      { trigger: 'returning_user', message: 'Good to see you back in the burrow. Consistent study is like consistent position management — it compounds over time. Let\'s pick up where we left off.' },
      { trigger: 'viewing_advanced', message: 'PMCCs and bear put ladders are powerful but require deeper understanding of the Greeks. Make sure your spread fundamentals are solid before adding these to your playbook.' },
    ],
    tribeAffinity: 'badgers-set',
    mentorChallenges: [
      {
        id: 'badger-challenge-1',
        title: 'The Risk Budget',
        description: 'Take a hypothetical $25,000 portfolio. Using the 2% rule (max $500 risk per trade), construct a bull put spread where the width of the strikes times 100 minus the credit received equals no more than $500. Use the Position Sizing Calculator to verify.',
        criteria: 'Show the math: strike width, credit received, max loss per contract, and number of contracts that fit within the $500 risk budget. Verify with the Position Sizing Calculator.',
        difficulty: 1,
      },
      {
        id: 'badger-challenge-2',
        title: 'The All-Weather Portfolio',
        description: 'Design a three-position portfolio using: one bullish spread (bull put spread), one bearish spread (bear put spread), and one neutral position (iron condor). All on different underlyings. Calculate the portfolio\'s total max loss if ALL three trades go against you simultaneously.',
        criteria: 'Show each position\'s max loss, the combined portfolio max loss, and prove it stays under 5% of total portfolio value. Explain the directional diversification benefit.',
        difficulty: 2,
      },
      {
        id: 'badger-challenge-3',
        title: 'The Adjustment Protocol',
        description: 'Paper trade an iron condor for 3 weeks. Create a written adjustment plan BEFORE entry: (1) what do you do if the stock hits your short call strike? (2) your short put strike? (3) if IV spikes 20%? Follow your plan exactly — no improvisation.',
        criteria: 'Document your pre-trade adjustment plan, the actual market events that occurred, adjustments made (if any), and final P&L. Did sticking to the plan help or hurt? Would you change the plan next time?',
        difficulty: 3,
      },
    ],
  },

  monkey: {
    id: 'monkey',
    name: 'The Swing Trading Swinger',
    characterName: 'Krzysztof',
    emoji: 'monkey',
    riskLevel: 'aggressive',
    riskStars: 4,
    personality: 'Energetic, opportunistic, quick-thinking. Always swinging from opportunity to opportunity.',
    catchphrase: 'Ooh ooh! See that opportunity? Let\'s swing for it!',
    philosophy: 'Fortune favors the bold - but the smart bold. Catch the big moves!',
    colors: {
      primary: '#f59e0b',
      accent: '#fcd34d',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    dialogues: {
      greeting: 'Hey hey! Ready to catch some moves? Let\'s find opportunities!',
      encouragement: 'That\'s the spirit! Keep that energy up!',
      quizCorrect: 'OOH OOH! Nailed it! True swing trader instincts!',
      quizIncorrect: 'Whoops! Even the best swingers miss a branch. Try again!',
      lessonComplete: 'Awesome! You\'re getting faster at spotting setups!',
      strategyComplete: 'YES! Another weapon in your arsenal!',
    },
    favoriteStrategies: ['long-call', 'bull-call-spread', 'pmcc', 'long-straddle'],
    unlocked: false,
    extendedBio: `Krzysztof the Monkey is the wildest, most electrifying mentor in the entire jungle — and he wouldn't have it any other way. A self-taught trader who went from zero to a six-figure portfolio by swinging for the fences on momentum plays, Krzysztof embodies the spirit of bold, conviction-based trading. He doesn't nibble at opportunities — he grabs them with both hands, swings to the next vine, and looks for the next setup before most traders have finished their morning coffee.

Krzysztof's journey started in the most unlikely place: a college dorm room where he turned a $2,000 stimulus check into a trading education. He lost it all twice. Then he found his edge: momentum. He realized that the biggest money in options isn't made by predicting subtle moves — it's made by identifying when something BIG is about to happen and positioning aggressively with defined risk. Earnings surprises, sector rotations, breakouts from long consolidations — Krzysztof trades the moments when the jungle erupts.

What makes Krzysztof magnetic as a mentor is his infectious energy and radical honesty. He'll tell you about the trades that made him scream with joy AND the ones that made him want to throw his laptop. He doesn't pretend trading is easy or that his approach works every time. But he'll teach you that when you have conviction, size your positions right, and manage your losers quickly, the winners more than pay for the losers. Swing trading isn't for everyone — but for those who thrive on action, Krzysztof is the mentor who turns energy into edge.`,
    tradingPhilosophy: `Krzysztof's philosophy is that concentrated, conviction-based bets with defined risk are the fastest path to growing a small account. While diversification is great for large portfolios, a trader with $5,000-$50,000 needs to make meaningful bets to generate meaningful returns. The key is defined risk: a long call can only lose its premium. A bull call spread can only lose the debit paid. A PMCC has a known max loss. These structures let Krzysztof swing aggressively while knowing exactly what he stands to lose.

The momentum edge works because markets trend. Academic finance has tried to explain away momentum for decades, but the data is clear: stocks that are going up tend to keep going up, and stocks that are going down tend to keep going down — at least in the short term. Krzysztof positions into these trends using leveraged instruments (options) that amplify the move. A stock that rallies 10% might produce a 50-200% return on a well-timed long call or bull call spread. That convexity is what makes swing trading with options so powerful.

The risk management side is just as critical as the conviction side. Krzysztof uses strict rules: never risk more than 5% of the portfolio on a single trade, always use defined-risk structures, cut losers at 50% of premium paid, and let winners run until momentum fades. The math works because one 200% winner pays for four 50% losers with money to spare. It's not about being right all the time — it's about making more when you're right than you lose when you're wrong. That asymmetry is the swing trader's holy grail.`,
    realWorldAnalogy: `Krzysztof trades like a venture capital investor. A VC doesn't expect every startup investment to succeed — they expect most to fail. But the one that becomes a unicorn pays for all the losers ten times over. Krzysztof approaches each trade the same way: small, defined-risk bets on high-conviction ideas. Most will be modest wins or small losses. But when he catches a momentum wave at the right time with the right leverage, the payoff is massive. It's the portfolio approach to conviction trading — lose small, win BIG.`,
    coreStrategies: ['long-call', 'bull-call-spread', 'pmcc', 'long-straddle', 'long-strangle'],
    advancedStrategies: ['strap', 'twisted-sister'],
    learningOrder: ['long-call', 'bull-call-spread', 'long-straddle', 'long-strangle', 'pmcc', 'strap', 'twisted-sister'],
    mentorToolkit: [
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'Ooh ooh! Before I swing, I need to know how far this thing can move! The expected move tells me if my target is realistic or if I\'m dreaming. Gotta know the range!',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'I need to see the payoff curve! Where\'s the breakeven? Where does it go parabolic? This tool shows me the exact shape of the opportunity before I grab the vine!',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'If IV is sky-high, my calls are expensive and my breakeven is far away. I need to know if I\'m buying cheap options or overpaying. IV Rank is the reality check before I swing!',
      },
      {
        calculatorId: 'position-sizing-calculator',
        label: 'Position Sizing',
        reason: 'Even a monkey knows not to bet the whole banana stash on one trade! This calculator keeps me honest with position sizes so one bad swing doesn\'t wipe me out.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'HEY HEY! Welcome to the canopy! Listen, I\'m going to teach you how to swing for the fences — but SMART swinging, not reckless gambling. Rule one: always know what you can lose before you chase what you can gain!' },
      { trigger: 'completed_first_strategy', message: 'OOH OOH! Your first swing! Did you feel that? The leverage, the defined risk, the potential for BIG moves? That\'s what swing trading is all about! Now let\'s add more weapons!' },
      { trigger: 'completed_all_core', message: 'You\'ve got five core swing strategies! Long calls for pure conviction, spreads for cost efficiency, straddles and strangles for volatility. You\'re officially dangerous in the best way possible!' },
      { trigger: 'quiz_failed', message: 'Whoops! Missed that branch! No worries — even the best swingers miss sometimes. The difference between a good trader and a blown-up trader is what you do AFTER the miss. Review and try again!' },
      { trigger: 'quiz_perfect', message: 'OOH OOH OOH! PERFECT SCORE! That\'s the instinct of a true swing trader! You understood every concept! Now let\'s put that knowledge to work!' },
      { trigger: 'streak_3_days', message: 'Three days swinging through the material! Momentum in learning works just like momentum in markets — once you get going, keep going! Don\'t let the streak break!' },
      { trigger: 'returning_user', message: 'You\'re BACK! The canopy missed you! Let\'s pick up where we left off — there are opportunities swinging by and we need to be ready to grab them!' },
      { trigger: 'viewing_advanced', message: 'Ooh, the advanced stuff! Synthetic futures, straps, bull call ladders — these are POWERFUL tools. But they need solid fundamentals. Make sure you\'ve mastered the basics before you grab these vines!' },
    ],
    tribeAffinity: 'banana-stand',
    mentorChallenges: [
      {
        id: 'monkey-challenge-1',
        title: 'The Conviction Swing',
        description: 'Find a stock breaking out of a 30+ day consolidation range. Buy a long call with 45-60 days to expiration and a strike near the money. Set a rule: sell at +100% profit or -50% loss, whichever comes first. Paper trade it.',
        criteria: 'Document the breakout setup, your conviction thesis, the option selected, and the outcome. Did the momentum thesis play out? What would you do differently?',
        difficulty: 1,
      },
      {
        id: 'monkey-challenge-2',
        title: 'The Spread vs. Naked Showdown',
        description: 'Pick a bullish setup. Paper trade BOTH a naked long call AND a bull call spread on the same underlying and expiration. Track both positions side by side. Which one produces a better return on capital? Which one lets you sleep at night?',
        criteria: 'Compare cost of entry, breakeven, max profit, max loss, and actual P&L for both positions. Calculate return on risk (profit divided by max loss) for each. Explain when you\'d use each approach.',
        difficulty: 2,
      },
      {
        id: 'monkey-challenge-3',
        title: 'The PMCC Swing',
        description: 'Build a Poor Man\'s Covered Call on a stock you\'re bullish on long-term. Buy a deep ITM LEAPS call (delta > 0.70, 6+ months to expiration). Sell a short-term OTM call against it (30-45 DTE). Manage the short call for 3 cycles (close and re-sell monthly).',
        criteria: 'Document the LEAPS entry, each short call cycle (strike, premium, outcome), total premium collected over 3 cycles, and net P&L. Calculate the annualized return on the LEAPS investment from selling calls alone.',
        difficulty: 3,
      },
    ],
  },

  bull: {
    id: 'bull',
    name: 'The Eternal Optimist',
    characterName: 'Bruno',
    emoji: 'bull',
    riskLevel: 'aggressive',
    riskStars: 4,
    personality: 'Bold, bullish, unwavering. Bruno only sees one direction: UP.',
    catchphrase: 'Bears? What bears?',
    philosophy: 'The market always goes up eventually. Be positioned for the rally.',
    colors: {
      primary: '#ef4444',
      accent: '#fca5a5',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
    dialogues: {
      greeting: 'Ready to charge? The market\'s going up - let\'s ride it!',
      encouragement: 'That\'s bullish thinking! Stay strong!',
      quizCorrect: 'Bullseye! You understand the power of optimism!',
      quizIncorrect: 'Don\'t let the bears get in your head. Let\'s review.',
      lessonComplete: 'Another bullish lesson mastered! The trend is your friend!',
      strategyComplete: 'This bullish strategy is now yours. Charge forward!',
    },
    favoriteStrategies: ['long-call', 'bull-call-spread', 'bull-put-spread', 'cash-secured-put'],
    unlocked: false,
    extendedBio: `Bruno the Bull has never met a dip he didn't want to buy. A former equity analyst who spent fifteen years covering growth stocks on Wall Street, Bruno realized early in his career that the single most powerful force in financial markets is the long-term upward trend. While the bears howled about every correction, Bruno was quietly loading up — and history proved him right every single time. The S&P 500 has gone up in roughly 75% of all calendar years. Bruno doesn't fight that math. He rides it.

What transformed Bruno from a stock picker into an options maestro was the leverage. A stock that rallies 10% is nice. A well-timed call option on that same stock returning 150% is magnificent. Bruno discovered that bullish options strategies let him express his conviction with far less capital at risk than buying shares outright. Bull call spreads, cash-secured puts, even synthetic longs — every tool in his arsenal is designed to profit from the one thing markets do best: go up over time.

Bruno's critics call him naive. They say he ignores risk. Nothing could be further from the truth. Bruno uses defined-risk structures on almost every trade. His bull call spreads cap his downside. His cash-secured puts only commit him to stocks he'd happily own. Bruno isn't blindly optimistic — he's strategically optimistic, with a risk management framework that keeps him in the game through every correction.`,
    tradingPhilosophy: `Bruno's philosophy is grounded in one of the most robust findings in financial history: markets have an upward bias. Over any 20-year rolling period in the history of the S&P 500, stocks have never produced a negative return. This doesn't mean every year is positive — it means that the long-term direction is up, and traders who position accordingly are swimming with the current rather than against it. Bruno's bullish strategies are simply the options expression of this structural edge.

The specific strategies Bruno favors all exploit this upward bias in different ways. Long calls provide pure leveraged upside exposure. Bull call spreads reduce cost and define risk while still capturing most of the rally. Bull put spreads collect premium from the fear of declines that statistically rarely materialize. Cash-secured puts get paid to wait for stocks at prices Bruno would happily buy anyway. Each strategy is a different lens on the same thesis: markets go up, and getting paid to be positioned for that is the most natural trade in finance.

The psychological advantage of bullish trading is underappreciated. Bears live in constant anxiety, always bracing for the next crash. Bulls like Bruno operate from a place of abundance — they expect good outcomes and manage the exceptions. This emotional baseline leads to better decision-making: Bruno doesn't panic-sell during corrections because he views them as opportunities. He sleeps soundly because his defined-risk structures mean no single trade can threaten his portfolio. Optimism, when combined with discipline, is the ultimate trading edge.`,
    realWorldAnalogy: `Bruno trades like a real estate investor in a growing city. Sure, there are recessions, housing dips, and the occasional scare — but over time, property values in good locations go up. Bruno buys properties (bullish positions) in good neighborhoods (quality companies), collects rent along the way (premium from puts and spreads), and never panics when the market dips because he knows the long-term trend is his friend. The bears keep predicting the housing crash. Bruno keeps collecting the rent.`,
    coreStrategies: ['long-call', 'bull-call-spread', 'bull-put-spread', 'cash-secured-put', 'zebra'],
    advancedStrategies: ['long-synthetic-future', 'bull-call-ladder', 'strap'],
    learningOrder: ['long-call', 'bull-call-spread', 'cash-secured-put', 'bull-put-spread', 'zebra', 'strap', 'long-synthetic-future', 'bull-call-ladder'],
    mentorToolkit: [
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'I want to see that beautiful upward-sloping payoff curve before I charge in. This tool shows me exactly where my profit starts running — and running is what bulls do best.',
      },
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'When I\'m buying calls or building spreads, I need to know how much upside the market is pricing in. If the expected move supports my thesis, I charge. If not, I wait for a better entry.',
      },
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Even an eternal optimist checks the odds. This calculator tells me whether my bullish trade has the probability wind at its back. I like trades where time AND direction favor me.',
      },
      {
        calculatorId: 'position-sizing-calculator',
        label: 'Position Sizing',
        reason: 'Being bullish doesn\'t mean being reckless. This tool keeps my position sizes rational so that no single trade can put me out of the game. Live to charge another day.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome to the bull pen! Here\'s the first thing you need to know: the market has gone up in about 75% of all years. We\'re not gambling on direction — we\'re positioning for the most likely outcome.' },
      { trigger: 'completed_first_strategy', message: 'Your first bullish strategy is locked and loaded! Did you feel that? The confidence of knowing that time and trend are on your side? That\'s the bull advantage.' },
      { trigger: 'completed_all_core', message: 'Five core bullish weapons in your arsenal. Long calls for conviction, spreads for efficiency, cash-secured puts for income. You\'re a fully equipped bull now. The bears don\'t stand a chance.' },
      { trigger: 'quiz_failed', message: 'Don\'t let the bears get in your head! Everyone stumbles. The important thing is you get back up and charge again. Review the material and come back stronger.' },
      { trigger: 'quiz_perfect', message: 'BULLSEYE! Perfect score! That\'s the confidence and preparation of a true bull. You know your strategies inside and out. Now go make the market your pasture.' },
      { trigger: 'streak_3_days', message: 'Three days of bullish education! Consistency is like compound interest — it builds on itself. Keep showing up, keep learning, and the gains will follow.' },
      { trigger: 'returning_user', message: 'The bull is back! Markets have been moving while you were away — and they moved UP, as usual. Ready to learn more ways to profit from the trend?' },
      { trigger: 'viewing_advanced', message: 'Synthetic futures and bull call ladders are powerful weapons, but they require deeper understanding. Make sure your core bullish strategies are second nature before charging into these.' },
    ],
    tribeAffinity: 'bull-herd',
    mentorChallenges: [
      {
        id: 'bull-challenge-1',
        title: 'The Dip Buyer',
        description: 'Find a quality stock that has pulled back at least 5% from its recent high while the overall market trend remains bullish. Buy a long call with 60 days to expiration at a strike near the current price. Set a target: sell at +75% profit or -40% loss. Paper trade it.',
        criteria: 'Document your thesis for why the dip is a buying opportunity, the option selected, and the outcome. Did the bullish thesis play out? Would buying the stock outright have been better or worse?',
        difficulty: 1,
      },
      {
        id: 'bull-challenge-2',
        title: 'The Income Bull',
        description: 'Sell a cash-secured put on a stock you\'re bullish on at a strike price where you\'d happily buy shares. If assigned, immediately sell a covered call against the shares. Track this "wheel" strategy for one full cycle.',
        criteria: 'Document each step: CSP premium collected, assignment price, covered call premium collected, and final disposition. Calculate total return including all premiums. Compare to simply buying the stock at the start.',
        difficulty: 2,
      },
      {
        id: 'bull-challenge-3',
        title: 'The Bull Arsenal',
        description: 'On the same bullish underlying, simultaneously paper trade: (1) a long call, (2) a bull call spread, and (3) a ZEBRA (zero-extrinsic-back-ratio spread). Track all three positions through the same price move. Which structure gives the best risk-adjusted return?',
        criteria: 'Compare all three structures on capital required, max risk, breakeven, actual P&L, and return on risk. Explain which you\'d use for a high-conviction vs. moderate-conviction bullish thesis.',
        difficulty: 3,
      },
    ],
  },

  bear: {
    id: 'bear',
    name: 'The Skeptical Sentinel',
    characterName: 'Bertha',
    emoji: 'bear',
    riskLevel: 'moderate',
    riskStars: 3,
    personality: 'Cautious, protective, prepared. Bertha sees risk everywhere.',
    catchphrase: 'Pessimism is just realism with better hedges.',
    philosophy: 'The crash is always coming. The question is: are you prepared?',
    colors: {
      primary: '#f97316',
      accent: '#fdba74',
      bg: 'rgba(249, 115, 22, 0.1)',
    },
    dialogues: {
      greeting: 'Before we start - do you have hedges in place? Let\'s fix that.',
      encouragement: 'Smart thinking about risk. Most traders ignore defense.',
      quizCorrect: 'Correct! You understand that protection comes first.',
      quizIncorrect: 'You left yourself exposed there. Let\'s review the hedge.',
      lessonComplete: 'Another defensive tool in your arsenal. Sleep better tonight.',
      strategyComplete: 'This protective strategy could save your portfolio someday.',
    },
    favoriteStrategies: ['long-put', 'protective-put', 'bear-put-spread', 'put-backspread'],
    unlocked: false,
    extendedBio: `Bertha the Bear is the mentor nobody wants to listen to — until the crash comes. A former risk analyst at a major insurance company, Bertha spent twenty years modeling catastrophic scenarios: what happens when earthquakes hit, when financial systems seize up, when the "impossible" happens. She brought that same mindset to trading, and it made her the most prepared trader in the jungle. While the bulls celebrate every all-time high, Bertha is quietly accumulating hedges, calculating tail risk, and making sure she — and her students — survive whatever comes next.

Bertha's defining moment was 2008. Not because she predicted the crash — she didn't. But because while everyone around her was panicking, liquidating at the worst possible prices, and watching their accounts go to zero, Bertha's portfolio was protected. Her protective puts paid off. Her bear put spreads printed money. She didn't just survive — she thrived. And she vowed to spend the rest of her career teaching others to be that prepared.

What makes Bertha controversial is her permanent skepticism. She doesn't believe in "this time is different." She doesn't trust rallies that lack breadth. She always assumes the worst-case scenario is closer than you think. Her critics call her a pessimist. Her students call her a lifesaver. Because when the market drops 30% in three weeks — and it will, eventually — Bertha's students are the ones buying at the bottom while everyone else is selling in terror.`,
    tradingPhilosophy: `Bertha's philosophy is that defense wins championships — in sports and in markets. The mathematics of loss are brutal and asymmetric: a 50% decline requires a 100% gain just to break even. A 75% decline requires a 300% gain. Most traders never recover from catastrophic losses, not because they can't — but because the psychological damage destroys their decision-making. Bertha's entire approach is designed to prevent that catastrophe from ever happening. Hedging isn't a cost; it's insurance against financial ruin.

The strategies Bertha teaches serve two purposes: protecting existing portfolios and profiting from declines. Protective puts are the simplest form of portfolio insurance — they guarantee a floor on your losses no matter how far the market falls. Bear put spreads provide leveraged downside exposure at a defined cost. Put backspreads create convex payoffs that accelerate as markets crash. Each tool has a specific use case, and Bertha's students learn to match the tool to the threat.

The psychological edge of bearish preparation is profound. A trader who knows their portfolio is hedged doesn't make fear-based decisions during sell-offs. They don't panic-sell at the bottom. They don't miss the recovery because they were too shaken to buy. Bertha's students approach corrections with clarity instead of terror — and that clarity is worth more than any single profitable trade. The bear market specialist doesn't just survive the storm; she turns it into her hunting season.`,
    realWorldAnalogy: `Bertha trades like a wildfire prevention specialist. While everyone else is enjoying the sunny day and dry weather, she's clearing brush, creating firebreaks, and positioning water tankers. When the inevitable fire erupts, she doesn't panic — she executes the plan she prepared months ago. Bertha knows that the fire isn't a question of "if" — it's a question of "when." And when it comes, preparation is everything.`,
    coreStrategies: ['long-put', 'protective-put', 'bear-put-spread', 'put-backspread', 'long-put-butterfly'],
    advancedStrategies: ['strip', 'bear-put-ladder'],
    learningOrder: ['protective-put', 'long-put', 'bear-put-spread', 'long-put-butterfly', 'put-backspread', 'strip', 'bear-put-ladder'],
    mentorToolkit: [
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'Before I build a hedge, I need to know what the market expects. If my protective puts are inside the expected move, they\'re real protection. If they\'re outside, they\'re just a false sense of security.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'I need to see exactly where my protection kicks in. A hedge that activates too late is useless. This tool shows me the precise price level where my defense turns into profit.',
      },
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Even bears need probabilities. I want to know the likelihood my hedge pays off — not to avoid hedging, but to size it correctly. A 15% probability event still needs protection if it means portfolio ruin.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'When IV is low, protection is cheap — that\'s when I load up on puts. When IV is high, the market is already scared and hedges are expensive. Timing your defense purchases is just as important as having them.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Before we start, answer me this: if the market dropped 30% tomorrow, what would happen to your portfolio? If the answer is "I don\'t know," then you\'ve come to the right place. Let\'s fix that.' },
      { trigger: 'completed_first_strategy', message: 'Your first defensive strategy. That\'s one layer of armor. But remember — a single hedge isn\'t a plan. We need to build a complete defense system, layer by layer.' },
      { trigger: 'completed_all_core', message: 'Five defensive weapons mastered. You now have tools for portfolio protection, directional bearish bets, leveraged downside exposure, and structured risk management. The crashes won\'t catch you off guard.' },
      { trigger: 'quiz_failed', message: 'You left a gap in your defense. In the real market, gaps in understanding become gaps in your P&L. Let\'s go back and shore up that weak point. Your portfolio will thank you.' },
      { trigger: 'quiz_perfect', message: 'Flawless defensive thinking. You understood every risk, every hedge, every escape route. When the storm comes — and it will — you\'ll be the calm one in the room.' },
      { trigger: 'streak_3_days', message: 'Three days of building your defenses. Most traders only think about risk after they\'ve lost money. You\'re thinking about it before. That\'s the difference between surviving and thriving.' },
      { trigger: 'returning_user', message: 'Welcome back. While you were away, the market probably went up — which means puts are cheaper now. That\'s not a reason to be complacent. It\'s a reason to buy protection while it\'s on sale.' },
      { trigger: 'viewing_advanced', message: 'Short synthetic futures and bear put ladders are powerful bearish tools, but they require precise timing and management. Make sure your basic hedging strategies are rock solid first.' },
    ],
    tribeAffinity: 'bear-den',
    mentorChallenges: [
      {
        id: 'bear-challenge-1',
        title: 'The Insurance Policy',
        description: 'You own (or hypothetically own) 100 shares of a stock. Buy a protective put 5-10% below the current price with 60 days to expiration. Calculate the cost of protection as a percentage of your stock value. Is this "insurance premium" worth the peace of mind?',
        criteria: 'Document the stock price, put strike, premium paid, and the cost as an annualized percentage of portfolio value. Compare this "insurance cost" to the historical frequency of 10%+ drawdowns in that stock.',
        difficulty: 1,
      },
      {
        id: 'bear-challenge-2',
        title: 'The Bear Spread Arsenal',
        description: 'On a stock you believe is overvalued, construct three bearish positions: a long put, a bear put spread, and a put backspread. Paper trade all three simultaneously. Compare cost of entry, breakeven, max profit, and max loss for each.',
        criteria: 'Side-by-side comparison of all three structures. Identify which is cheapest to enter, which has the highest max profit, and which performs best in a moderate decline vs. a crash. Explain when you\'d choose each.',
        difficulty: 2,
      },
      {
        id: 'bear-challenge-3',
        title: 'The Portfolio Fortress',
        description: 'Build a complete defensive portfolio overlay for a hypothetical $100,000 stock portfolio. Allocate no more than 3% of portfolio value ($3,000) to hedges. Use a combination of protective puts and bear put spreads to create maximum downside protection within that budget.',
        criteria: 'Show the hedge portfolio, total cost, protected downside level, and the comparison of drawdown with vs. without hedges. Prove that the hedges reduce max drawdown by at least 50% during a 20% market decline scenario.',
        difficulty: 3,
      },
    ],
  },

  dolphin: {
    id: 'dolphin',
    name: 'The Balanced Navigator',
    characterName: 'Diana',
    emoji: 'dolphin',
    riskLevel: 'conservative',
    riskStars: 2,
    personality: 'Graceful, intelligent, balanced. Diana balances risk and reward perfectly.',
    catchphrase: 'Grace under pressure.',
    philosophy: 'The market is an ocean. Learn to navigate it with grace.',
    colors: {
      primary: '#6366f1',
      accent: '#a5b4fc',
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    dialogues: {
      greeting: 'Welcome! Let\'s find the balance between risk and reward.',
      encouragement: 'Beautiful balance! You\'re navigating the market with grace.',
      quizCorrect: 'Perfectly balanced answer! You understand the harmony.',
      quizIncorrect: 'A bit off-balance there. Let\'s find the equilibrium.',
      lessonComplete: 'You\'ve learned to navigate these waters. Gracefully done.',
      strategyComplete: 'This balanced strategy is now part of your navigation toolkit.',
    },
    favoriteStrategies: ['collar', 'iron-condor', 'calendar-spread'],
    unlocked: false,
    extendedBio: `Diana the Dolphin is the mentor who proves you don't have to choose between risk and reward — you just have to navigate skillfully. A former portfolio manager at a family office, Diana spent twelve years managing multigenerational wealth where the mandate was simple: grow the capital, but never put it at serious risk. That dual mandate forced her to develop a trading style that blends income generation with downside protection, bullish exposure with hedging, and growth with safety. She calls it "balanced navigation," and it's the approach that lets her students sleep well AND grow their portfolios.

Diana's gift is her ability to see the market as a multidimensional ocean rather than a one-directional highway. While bulls fixate on the rally and bears brace for the crash, Diana positions for both — simultaneously. A collar generates income while providing a price floor. An iron condor profits from quiet markets with defined risk on both sides. A butterfly captures profits from a specific price zone with minimal capital at risk. Every position in Diana's repertoire balances competing forces, creating harmony where others see conflict.

What makes Diana extraordinary as a mentor is her grace under pressure. When markets get volatile and other mentors start shouting, Diana glides calmly through the turbulence. Her students learn that the best response to market chaos isn't panic or aggression — it's adaptation. Adjust the position. Roll the strikes. Rebalance the Greeks. Diana teaches that flexibility is strength, and that the trader who can adapt to any market condition is the trader who thrives in all of them.`,
    tradingPhilosophy: `Diana's trading philosophy is rooted in the concept of balance — not as a compromise, but as a strategic advantage. The options market offers a unique ability to create positions that profit from multiple scenarios simultaneously. A collar protects your downside while funding the protection by selling upside. An iron condor collects premium from a wide range of expected outcomes. A calendar spread profits from both time decay and a specific price zone. These aren't half-measures — they're optimized structures that extract the maximum edge from each market environment.

This approach works because markets spend the vast majority of their time in transition, not in trend. The extreme moves that bulls and bears optimize for — massive rallies or devastating crashes — happen infrequently. Most of the time, markets drift, consolidate, rotate, and oscillate within ranges. Diana's balanced strategies are designed for this reality: they generate income during quiet periods, provide protection during volatile ones, and adapt gracefully when conditions change.

The psychological power of balance cannot be overstated. Traders who are all-in on one direction suffer extreme emotional swings with every tick. Diana's students experience far less volatility in their emotional state because their positions are designed to perform reasonably well across a range of outcomes. This emotional stability leads to better decision-making, fewer impulsive trades, and the ability to stick to a plan when others are abandoning theirs. In the ocean of markets, the smoothest swimmer travels the farthest.`,
    realWorldAnalogy: `Diana trades like a skilled yacht captain navigating open ocean. She doesn't fight the wind or the waves — she adjusts her sails to use them. When the wind shifts, she tacks. When the seas get rough, she reefs the sails. She always has a compass heading (investment thesis), but she's flexible about the exact route she takes to get there. The captains who insist on sailing straight into the wind capsize. Diana arrives at her destination — maybe not the fastest, but always safely and consistently.`,
    coreStrategies: ['collar', 'covered-call', 'iron-condor', 'calendar-spread', 'diagonal-spread'],
    advancedStrategies: ['long-call-butterfly', 'seagull'],
    learningOrder: ['covered-call', 'collar', 'iron-condor', 'calendar-spread', 'diagonal-spread', 'long-call-butterfly', 'seagull'],
    mentorToolkit: [
      {
        calculatorId: 'greeks-visualizer',
        label: 'Greeks Visualizer',
        reason: 'Balance requires understanding every force acting on your position. The Greeks Visualizer shows me whether my delta is neutral, my theta is positive, and my vega exposure is where I want it. It\'s my navigational chart.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'My strategies create elegant payoff curves with defined risk zones. Before entering any position, I map out the full profit and loss landscape — every scenario accounted for, no surprises.',
      },
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Balanced doesn\'t mean uncertain. I want to know my probability of profit so I can position with confidence. A well-balanced trade should have a clear statistical edge.',
      },
      {
        calculatorId: 'iv-crush-calculator',
        label: 'IV Crush Calculator',
        reason: 'Many of my strategies have vega exposure that needs managing around events. The IV Crush calculator shows me how volatility changes will affect my balanced positions.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome, navigator. The first thing I want to teach you is that you don\'t have to choose between making money and protecting your portfolio. With the right structures, you can do both. Let\'s find your balance.' },
      { trigger: 'completed_first_strategy', message: 'You\'ve learned your first balanced strategy. Notice how it doesn\'t rely on the market doing just one thing? That flexibility is your secret weapon. Markets change. You should be ready for all of it.' },
      { trigger: 'completed_all_core', message: 'Five balanced navigation tools mastered. Collars for protection, condors for income, calendars for time decay, diagonals for directional lean. You can now navigate any market condition with grace.' },
      { trigger: 'quiz_failed', message: 'A bit off-balance on that one. Every strategy has multiple dimensions — direction, time, volatility. Let\'s revisit and make sure you understand how they all interact.' },
      { trigger: 'quiz_perfect', message: 'Perfectly balanced, as all things should be. You understood every dimension of the strategy. That holistic thinking is what separates navigators from passengers.' },
      { trigger: 'streak_3_days', message: 'Three days of building your navigation skills. Like ocean sailing, consistency in practice builds the instincts you\'ll need when conditions change unexpectedly.' },
      { trigger: 'returning_user', message: 'Welcome back to the water. Markets are always shifting currents, and a navigator must stay current with conditions. Let\'s pick up where we left off and adjust our sails.' },
      { trigger: 'viewing_advanced', message: 'Butterflies, condors, and seagulls are precision instruments — they profit from very specific market outcomes. Master them, and you\'ll have the finest navigation toolkit in the ocean.' },
    ],
    tribeAffinity: 'owl-parliament',
    mentorChallenges: [
      {
        id: 'dolphin-challenge-1',
        title: 'The Balanced Position',
        description: 'Construct a collar on a stock you own (or hypothetically own). Buy a put 5% below current price, sell a call 5% above. Calculate the net cost of the collar (premium paid for put minus premium received from call). Paper trade through one expiration cycle.',
        criteria: 'Document the collar construction, net cost/credit, maximum upside, maximum downside, and the actual outcome. Compare your emotional state holding the collar vs. holding the stock unprotected.',
        difficulty: 1,
      },
      {
        id: 'dolphin-challenge-2',
        title: 'The All-Weather Strategy',
        description: 'Paper trade an iron condor with 30-45 DTE on a broad market index (SPY, QQQ, or IWM). Set your short strikes at the expected move boundaries. Manage the position: close at 50% of max profit or adjust if either short strike is breached. Track the daily P&L and Greeks.',
        criteria: 'Document strike selection logic, daily P&L, management actions taken, and final result. Explain how the iron condor performed during both quiet and volatile days. Calculate your actual profit as a percentage of max risk.',
        difficulty: 2,
      },
      {
        id: 'dolphin-challenge-3',
        title: 'The Navigator\'s Portfolio',
        description: 'Build a three-position balanced portfolio: one collar for protection, one iron condor for income, and one diagonal spread for directional lean. All on different underlyings. Manage for 3 weeks. The goal: positive total return with a maximum drawdown under 5%.',
        criteria: 'Show each position\'s construction, the portfolio\'s daily aggregate P&L, max drawdown during the period, and final return. Explain how the positions complemented each other during different market conditions.',
        difficulty: 3,
      },
    ],
  },

  octopus: {
    id: 'octopus',
    name: 'The Multi-Tasking Master',
    characterName: 'Oscar',
    emoji: 'octopus',
    riskLevel: 'aggressive',
    riskStars: 5,
    personality: 'Complex, multi-dimensional, adaptable. Oscar manages 50+ positions.',
    catchphrase: 'Eight arms, fifty positions.',
    philosophy: 'Diversification is strategies, timeframes, and approaches. Thrive in complexity.',
    colors: {
      primary: '#06b6d4',
      accent: '#67e8f9',
      bg: 'rgba(6, 182, 212, 0.1)',
    },
    dialogues: {
      greeting: 'Welcome to the deep end! Ready to manage multiple strategies?',
      encouragement: 'You\'re developing multi-dimensional thinking. Excellent!',
      quizCorrect: 'All eight arms agree - that\'s correct!',
      quizIncorrect: 'One tentacle missed. Let\'s get all arms aligned.',
      lessonComplete: 'Another strategy added to your repertoire!',
      strategyComplete: 'This strategy is now one of your many tentacles.',
    },
    favoriteStrategies: ['ratio-spread', 'call-backspread', 'short-straddle', 'short-strangle'],
    unlocked: false,
    warningMessage: 'ADVANCED: Oscar\'s strategies involve managing multiple complex positions. Recommended for experienced traders only.',
    extendedBio: `Oscar the Octopus is the most complex, most demanding, and most rewarding mentor in the entire jungle. A former head of derivatives at a multi-strategy hedge fund, Oscar managed portfolios with hundreds of overlapping positions across equities, indexes, and volatility products — simultaneously. Where other traders see a single stock, Oscar sees a web of correlations, Greeks, and risk exposures that span entire sectors. Each of his eight tentacles manages a different dimension of the portfolio: delta, gamma, theta, vega, correlation, skew, term structure, and tail risk. He doesn't just trade — he orchestrates.

Oscar's departure from the institutional world wasn't retirement — it was evolution. He realized that the most dangerous thing in finance isn't complexity; it's the illusion of simplicity. Traders who think they understand their risk because they can see their P&L are like sailors who think they understand the ocean because they can see the surface. Oscar teaches what lies beneath: the hidden interdependencies between positions, the gamma risk that explodes during black swan events, the correlation breakdowns that turn diversified portfolios into concentrated bets.

What makes Oscar legendary is that he's the mentor other mentors learn from. Terry consults him on hedging. Fiona discusses skew trades with him. Even Wolfgang respects his ability to manage a dozen positions without breaking a sweat. Oscar's eight arms aren't just a metaphor — they represent the multidimensional thinking required to manage real portfolio-level complexity.`,
    tradingPhilosophy: `Oscar's philosophy is built on portfolio theory at its most sophisticated: the idea that individual positions are less important than how they interact with each other. A short straddle on one stock combined with a long strangle on a correlated stock creates a fundamentally different risk profile than either position alone. Oscar thinks in terms of net portfolio Greeks, correlation-adjusted risk, and cross-asset hedging — not in terms of individual trades. This is the level of thinking that separates retail traders from institutional professionals.

The strategies Oscar teaches — ratio spreads, backspreads, jade lizards, iron butterflies, and twisted sisters — all serve different roles in a complex portfolio. Short straddles and strangles generate theta income but carry tail risk. Backspreads provide convex payoffs that hedge against extreme moves. Ratio spreads create asymmetric exposures. Jade lizards remove one side of risk entirely. When combined thoughtfully, these strategies create a self-hedging portfolio where the gains from one position offset the losses from another across most market scenarios.

The key psychological discipline Oscar teaches is the ability to hold multiple truths simultaneously. A position can be losing money and still be serving its purpose in the portfolio. A winning trade might need to be closed because it's creating an unbalanced Greek exposure. Oscar's students learn to evaluate performance at the portfolio level, not the position level. This shift — from "did this trade make money?" to "is my portfolio properly positioned?" — is the single most important evolution a trader can make.`,
    realWorldAnalogy: `Oscar manages a portfolio like a symphony conductor manages an orchestra. Each musician (position) plays their own part, but the conductor's job is to make sure they all work together to create something greater than the sum of its parts. A violin solo might sound beautiful alone, but if the brass section is drowning it out, the conductor adjusts. Oscar does the same: when one position's Greek exposure overwhelms the portfolio, he rebalances. The audience never hears the individual instruments — they hear the symphony.`,
    coreStrategies: ['ratio-spread', 'short-straddle', 'short-strangle', 'iron-butterfly', 'jade-lizard'],
    advancedStrategies: ['call-backspread', 'broken-wing-butterfly', 'twisted-sister'],
    learningOrder: ['short-strangle', 'short-straddle', 'iron-butterfly', 'ratio-spread', 'jade-lizard', 'call-backspread', 'broken-wing-butterfly', 'twisted-sister'],
    mentorToolkit: [
      {
        calculatorId: 'greeks-visualizer',
        label: 'Greeks Visualizer',
        reason: 'When you\'re managing eight tentacles of exposure, you MUST understand how every Greek interacts across your portfolio. This tool is non-negotiable. If you can\'t read a Greek profile, you can\'t trade with me.',
      },
      {
        calculatorId: 'iv-crush-calculator',
        label: 'IV Crush Calculator',
        reason: 'Half my strategies involve selling premium around events. The IV Crush calculator shows exactly how much volatility needs to collapse for your position to profit. Without this, you\'re flying blind through an earnings storm.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'Multi-leg positions have payoff curves that would confuse most traders. This visualizer shows you the full picture — every kink, every breakeven, every risk zone. Study it before you trade.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'Whether I\'m selling premium or buying convexity depends entirely on where implied volatility sits relative to its history. The IV Rank Tool is the compass that tells me which tentacle to deploy.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome to the deep end. I should be upfront: my strategies are the most complex in this academy. If you\'re here, I expect commitment. We start with the fundamentals and build toward portfolio-level thinking. Ready to dive deep?' },
      { trigger: 'completed_first_strategy', message: 'One tentacle activated. You now understand one piece of the puzzle. But remember — in my world, individual positions don\'t matter. What matters is how they interact. Keep building.' },
      { trigger: 'completed_all_core', message: 'Five core strategies mastered. You can now sell premium, create asymmetric payoffs, and remove directional risk from positions. The advanced strategies will teach you to combine these into self-hedging portfolios.' },
      { trigger: 'quiz_failed', message: 'Complexity demands precision. One misunderstood variable can cascade through a portfolio. Go back, re-study the Greeks on this strategy, and come back when you can explain every leg\'s purpose.' },
      { trigger: 'quiz_perfect', message: 'All eight arms agree — flawless execution. You understood every dimension of the strategy. That multi-variable thinking is exactly what separates portfolio managers from position traders.' },
      { trigger: 'streak_3_days', message: 'Three days of deep study. Complex strategies require consistent immersion — you can\'t master portfolio-level thinking in sporadic bursts. Your dedication is showing.' },
      { trigger: 'returning_user', message: 'The deep end hasn\'t gotten any shallower while you were away. Let\'s make sure your previous knowledge is solid before we add more tentacles to the operation.' },
      { trigger: 'viewing_advanced', message: 'These advanced strategies — guts, twisted sisters, covered straddles — are powerful but dangerous in isolation. They only make sense as part of a broader portfolio. Understand the core strategies thoroughly first.' },
    ],
    tribeAffinity: 'owl-parliament',
    mentorChallenges: [
      {
        id: 'octopus-challenge-1',
        title: 'The Multi-Leg Machine',
        description: 'Construct a jade lizard (short put + short call spread) on a stock with IV Rank above 40. Use the Greeks Visualizer to document the position\'s full Greek profile. Identify: which Greek is your primary risk, and which Greek is generating your income?',
        criteria: 'Document the jade lizard construction, net credit received, the fact that there\'s no upside risk, max downside risk, and the full Greek profile at entry. Explain the structural advantage over a simple short put.',
        difficulty: 1,
      },
      {
        id: 'octopus-challenge-2',
        title: 'The Correlation Hedge',
        description: 'Build two positions on correlated underlyings: a short strangle on one and a long strangle on the other. The goal: create a portfolio where a large move in the sector is partially hedged. Use the Greeks Visualizer to verify the net portfolio delta is near zero.',
        criteria: 'Show both positions, their individual Greeks, and the combined portfolio Greeks. Explain how the correlation between the underlyings provides a natural hedge. Identify what scenario would cause both positions to lose simultaneously.',
        difficulty: 2,
      },
      {
        id: 'octopus-challenge-3',
        title: 'The Full Octopus',
        description: 'Manage a 5-position portfolio simultaneously for 2 weeks. Include at least: one theta-positive position (short strangle or iron butterfly), one convex position (backspread), one neutral position (iron condor or jade lizard), and two directional hedges. Rebalance if any Greek exposure exceeds your predetermined limits.',
        criteria: 'Document all 5 positions at entry, daily portfolio Greeks, any rebalancing events, and final portfolio P&L. Explain how the positions interacted during actual market moves.',
        difficulty: 3,
      },
    ],
  },

  chameleon: {
    id: 'chameleon',
    name: 'The Event Horizon Hunter',
    characterName: 'Cameron',
    emoji: 'chameleon',
    riskLevel: 'moderate',
    riskStars: 3,
    personality: 'Adaptive, observant, patient. Cameron sees what others miss.',
    catchphrase: 'The jungle whispers before it roars—listen to both markets.',
    philosophy: 'Options tell you volatility expectations. Prediction markets tell you probability.',
    colors: {
      primary: '#8b5cf6',
      accent: '#14b8a6',
      bg: 'rgba(139, 92, 246, 0.1)',
    },
    dialogues: {
      greeting: 'Ah, a new hunter. Let me show you how to see what others cannot.',
      encouragement: 'Your pattern recognition is sharpening.',
      quizCorrect: 'Excellent observation! You read both market signals perfectly.',
      quizIncorrect: 'One market was speaking louder than the other. Listen carefully.',
      lessonComplete: 'Another layer of the jungle revealed. You\'re becoming a two-market trader.',
      strategyComplete: 'This event-driven strategy is now in your arsenal.',
    },
    favoriteStrategies: ['long-straddle', 'long-strangle', 'iron-condor', 'iron-butterfly'],
    unlocked: false,
    collaboratingMentors: ['cheetah', 'owl'],
    extendedBio: `Cameron the Chameleon is the jungle's most unconventional mentor — the one who watches two markets simultaneously and sees what everyone else misses. While traditional options traders analyze stock charts and implied volatility in isolation, Cameron cross-references options pricing with prediction market probabilities to identify moments when the two markets disagree. When options imply one thing and prediction markets signal another, Cameron strikes. He calls these divergences "Event Horizons" — the moments before catalysts where informed traders have a genuine edge.

Cameron's background is unlike any other mentor's. He started as a political risk analyst at a geopolitical consulting firm, where he spent years modeling election outcomes, regulatory decisions, and policy changes for institutional clients. When prediction markets emerged as a real-time probability engine, Cameron realized they contained information that options markets were slow to price in. A prediction market showing 80% probability of an FDA approval while options implied a 50/50 binary move was a screaming buy signal for call spreads. That insight became the foundation of his entire trading approach.

What makes Cameron a fascinating mentor is his insistence that context matters more than charts. He doesn't teach technical analysis or pattern recognition — he teaches students to read the informational ecosystem around an event. What are prediction markets saying? What is the options volatility skew telling us about tail risk? Are the two signals aligned or divergent? Cameron's students develop a unique skill: the ability to synthesize information from multiple sources into a single, actionable trading thesis.`,
    tradingPhilosophy: `Cameron's philosophy is built on the principle of informational arbitrage: when different markets price the same event differently, there's an opportunity for the trader who can reconcile the discrepancy. Options markets price events through implied volatility — a high IV before earnings means the market expects a big move. Prediction markets price events through probability — an 85% contract on a policy decision means the market is confident about the outcome. When these two signals conflict, Cameron exploits the gap.

The specific strategies Cameron uses are all event-driven. Long straddles and strangles position for events where the actual move will exceed what options are pricing. Iron condors and iron butterflies capture premium when prediction markets suggest the actual outcome will be less dramatic than options imply. Calendar spreads exploit differences in event timing. Broken-wing butterflies create asymmetric exposures around specific outcome scenarios. Every strategy is selected based on the cross-market signal — never on gut feeling.

The psychological edge of Cameron's approach is that it removes the ego from trading decisions. Cameron doesn't need to have an opinion about whether a stock goes up or down. He needs to have an opinion about whether the options market is correctly pricing the magnitude of a move relative to what prediction markets suggest about the probability. This reframing — from "what direction?" to "is the pricing correct?" — eliminates emotional attachment and focuses the mind on structural edge.`,
    realWorldAnalogy: `Cameron trades like a professional sports bettor who watches multiple sportsbooks simultaneously. If one sportsbook has Team A as a 3-point favorite and another has Team A as a 7-point favorite, the sharp bettor doesn't need to know who wins — they just need to bet the discrepancy. Cameron does the same with options and prediction markets: when the two markets disagree on the same event, the disagreement itself is the trade. The chameleon doesn't predict the future — it reads the present better than anyone else.`,
    coreStrategies: ['long-straddle', 'long-strangle', 'iron-condor', 'iron-butterfly', 'calendar-spread'],
    advancedStrategies: ['broken-wing-butterfly', 'double-diagonal'],
    learningOrder: ['long-straddle', 'long-strangle', 'iron-condor', 'iron-butterfly', 'calendar-spread', 'broken-wing-butterfly', 'double-diagonal'],
    mentorToolkit: [
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'This is my primary weapon. The expected move tells me what options are pricing in. When I compare that to what prediction markets are saying, the discrepancy reveals the trade. This calculator is step one of every analysis.',
      },
      {
        calculatorId: 'iv-crush-calculator',
        label: 'IV Crush Calculator',
        reason: 'Most of my trades are around events — earnings, FDA decisions, elections. The IV Crush calculator shows me exactly how much volatility needs to collapse post-event for my position to profit. Essential for event-driven trading.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'Is the current IV elevated because of a specific event, or is it structurally high? The IV Rank helps me distinguish between event-driven volatility and normal market conditions. That distinction drives my strategy selection.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'Event-driven strategies need precise breakeven mapping. I need to see exactly what price range produces a profit, because that range needs to align with my prediction market probability assessment.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome, observer. I\'m going to teach you something most traders never learn: how to read two markets at once. Options tell you what the crowd expects. Prediction markets tell you what informed bettors believe. The gap between the two is where the money hides.' },
      { trigger: 'completed_first_strategy', message: 'Your first event-driven strategy. Notice how we didn\'t start with a directional opinion — we started with what the market was pricing and whether it was correct. That shift in thinking is the foundation of everything I teach.' },
      { trigger: 'completed_all_core', message: 'Five core event-driven strategies mastered. You can now position for events that exceed expectations, underperform expectations, or resolve within a range. The full adaptive toolkit is yours.' },
      { trigger: 'quiz_failed', message: 'The signals were misread. In event-driven trading, every input matters — the expected move, the prediction probability, the IV level, the timing. Go back and re-examine which input you weighted incorrectly.' },
      { trigger: 'quiz_perfect', message: 'Every signal read perfectly. You synthesized options pricing, probability assessment, and strategy selection into a flawless analysis. That\'s the eye of the chameleon — seeing the full spectrum.' },
      { trigger: 'streak_3_days', message: 'Three days of building cross-market awareness. The best event traders spend more time analyzing than trading. Your consistent preparation is sharpening your ability to read the jungle\'s whispers.' },
      { trigger: 'returning_user', message: 'Welcome back, observer. While you were away, the jungle kept whispering. Let\'s catch up on what the prediction markets and options chains are saying — there may be new divergences to explore.' },
      { trigger: 'viewing_advanced', message: 'Double diagonals, broken-wing butterflies, and guts are precision event tools. They require a deep understanding of how volatility behaves around catalysts. Master the core event strategies first.' },
    ],
    tribeAffinity: 'fox-skulk',
    mentorChallenges: [
      {
        id: 'chameleon-challenge-1',
        title: 'The Signal Reader',
        description: 'Find an upcoming binary event (earnings, FDA decision, economic report). Use the Expected Move calculator to determine what options are pricing. Then research prediction market or analyst consensus probabilities for the event outcome. Do the two signals agree or diverge?',
        criteria: 'Document the event, the options expected move, any available probability assessments, and your analysis of whether the options market is over- or under-pricing the event. Propose a strategy based on the divergence (or lack thereof).',
        difficulty: 1,
      },
      {
        id: 'chameleon-challenge-2',
        title: 'The Event Straddle',
        description: 'Paper trade a long straddle before a major earnings announcement. Use the IV Crush Calculator to estimate the post-event IV collapse. Calculate the breakeven move required for the straddle to profit. After the event, compare the actual move to your breakeven.',
        criteria: 'Document pre-event IV, expected move, straddle cost, breakeven move, post-event IV, actual move, and final P&L. Was the actual move bigger or smaller than the expected move? Did the straddle profit or did IV crush kill it?',
        difficulty: 2,
      },
      {
        id: 'chameleon-challenge-3',
        title: 'The Adaptive Portfolio',
        description: 'Over a 2-week period, trade 3 different events using 3 different strategies: (1) a long straddle for an event where you expect the actual move to exceed expectations, (2) an iron condor for an event where you expect the outcome to disappoint, and (3) a calendar spread for an event where timing is key.',
        criteria: 'For each trade: document the event, your cross-market analysis, strategy selected and why, entry/exit, and P&L. Across all three trades, calculate your total return and evaluate whether your cross-market analysis added value vs. trading without it.',
        difficulty: 3,
      },
    ],
  },

  lion: {
    id: 'lion',
    name: 'The Confident King',
    characterName: 'Leo',
    emoji: 'lion',
    riskLevel: 'aggressive',
    riskStars: 4,
    personality: 'Confident, commanding, decisive. Leo rules his portfolio with conviction.',
    catchphrase: 'Fortune favors the bold.',
    philosophy: 'Lead with confidence. Know your edge and execute without hesitation.',
    colors: {
      primary: '#f59e0b',
      accent: '#fcd34d',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    dialogues: {
      greeting: 'Welcome to the jungle. Ready to claim your territory?',
      encouragement: 'That\'s the confidence of a true leader!',
      quizCorrect: 'Roar! A king\'s answer! You command the knowledge.',
      quizIncorrect: 'Even kings learn. Let\'s review and conquer this.',
      lessonComplete: 'Another victory. Your kingdom of knowledge grows.',
      strategyComplete: 'This strategy is now part of your royal arsenal.',
    },
    favoriteStrategies: ['long-call', 'bull-call-spread', 'zebra', 'ratio-spread'],
    unlocked: false,
    extendedBio: `Leo the Lion is the undisputed king of the trading jungle — not because he was born into royalty, but because he earned it. A former floor trader who made his name during some of the most volatile market periods in history, Leo developed a trading style built on conviction, decisiveness, and the understanding that hesitation is the most expensive mistake a trader can make. He doesn't wonder if a trade is good. He knows. And he acts.

Leo's philosophy was forged on the trading floor where split-second decisions determined profit or ruin. While academic traders debated models and strategies, Leo was executing. That experience gave him an unshakeable confidence in his own judgment — and an equally unshakeable commitment to defining his risk before every trade. Bold doesn't mean reckless in Leo's world. It means knowing your edge, sizing correctly, and executing with full conviction.

What makes Leo an exceptional mentor is his ability to inspire confidence in his students. Many traders know the strategies but can't pull the trigger. Leo teaches the mental framework of the decisive leader: analyze, decide, act. No second-guessing, no paralysis, no crying over spilled milk. You make the best decision with the information you have, you define your risk, and you execute. That mindset, more than any specific strategy, is Leo's greatest gift to his students.`,
    tradingPhilosophy: `Leo's philosophy is that confidence without competence is recklessness, but competence without confidence is waste. His students learn both. They build genuine knowledge of bullish strategies — long calls for maximum leverage, bull call spreads for defined risk, ZEBRAs for synthetic leverage. Then they learn to act on that knowledge with decisive confidence, because in markets, a correct analysis executed too late is just as bad as a wrong one.

The specific strategies Leo teaches are designed for high-conviction situations. Long calls provide maximum leverage when you're certain of a move. Bull call spreads define your risk while still capturing most of the upside. ZEBRAs provide stock-like exposure with dramatically less capital at risk. Ratio spreads create asymmetric payoffs when you expect a move but want to lower your cost basis. Every tool is a different expression of the same underlying thesis: when you see the setup, strike decisively.

The leadership mindset Leo instills is his most lasting contribution. Markets reward decisive action at key moments. The traders who hesitate at the open of a breakout, who wait for "one more confirmation," who second-guess themselves out of winning trades — they don't succeed. Leo's students learn to trust their preparation, trust their analysis, and pull the trigger when the setup is right. That's what kings do.`,
    realWorldAnalogy: `Leo trades like a general commanding troops in a battle with perfect intelligence. He's studied the terrain (the chart), he knows his enemy's weakness (the technical setup), and he's pre-positioned his forces (sized his positions) for maximum impact. When the moment arrives, he gives the order without hesitation. Victory or defeat, he executed with precision. The great generals in history weren't the ones who had the best plans — they were the ones who executed decisively when it mattered.`,
    coreStrategies: ['long-call', 'bull-call-spread', 'zebra', 'ratio-spread'],
    advancedStrategies: ['long-synthetic-future', 'strap'],
    learningOrder: ['long-call', 'bull-call-spread', 'zebra', 'ratio-spread', 'strap', 'long-synthetic-future'],
    mentorToolkit: [
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'A king knows the terrain before the battle. This tool shows me the exact payoff landscape so I can commit with full conviction, knowing every outcome in advance.',
      },
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'I need to know if my target is within reach. The expected move tells me whether the market agrees with my thesis or if I\'m expecting too much. A king doesn\'t overextend.',
      },
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Confidence is not the same as certainty. This calculator keeps me honest about my edge. I only act with conviction when the odds are genuinely in my favor.',
      },
      {
        calculatorId: 'position-sizing-calculator',
        label: 'Position Sizing',
        reason: 'Even the boldest king protects his kingdom. This tool ensures I never risk too much on a single battle — because the war is won over many campaigns, not one.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome to the pride. In this jungle, knowledge is power — but only when acted upon with conviction. We build both here. Let\'s start with the foundation of every great trade: a clear thesis.' },
      { trigger: 'completed_first_strategy', message: 'First strategy mastered. You know the mechanics. Now we develop the confidence to execute when the setup appears. Knowledge without action is just potential.' },
      { trigger: 'completed_all_core', message: 'Four core bullish weapons. Long calls for conviction, spreads for efficiency, ZEBRAs for leverage, ratio spreads for asymmetry. You\'re fully armed. Now train your eye to spot the setups.' },
      { trigger: 'quiz_failed', message: 'Even kings learn. Identify exactly where the gap in your knowledge is, close it, and return stronger. Weakness in knowledge creates hesitation in execution. Eliminate both.' },
      { trigger: 'quiz_perfect', message: 'Perfect score. That\'s the preparation of a true leader. When you know the material this well, your trades will be executed with complete confidence. The pride is proud.' },
      { trigger: 'streak_3_days', message: 'Three consecutive days of preparation. Great leaders don\'t improvise — they prepare so thoroughly that execution becomes instinct. You\'re building that instinct.' },
      { trigger: 'returning_user', message: 'The king returns. The market has been active while you were away. Let\'s review what\'s changed and identify the new opportunities that await a prepared mind.' },
      { trigger: 'viewing_advanced', message: 'Synthetic futures and advanced ratio trades are powerful weapons, but they require precise execution. Make sure your core strategies are instinctive before adding these to your arsenal.' },
    ],
    tribeAffinity: 'lion-pride',
    mentorChallenges: [
      {
        id: 'lion-challenge-1',
        title: 'The Royal Strike',
        description: 'Identify a stock at a clear technical breakout level with strong bullish momentum. Execute a long call with 45-60 DTE without second-guessing your entry. Set your exit rules before you enter: +80% profit target, -40% stop loss. Paper trade it.',
        criteria: 'Document your breakout thesis, the option selected, your pre-defined exit rules, and whether you followed them exactly. The primary evaluation is decisiveness of execution, not just P&L.',
        difficulty: 1,
      },
      {
        id: 'lion-challenge-2',
        title: 'The ZEBRA Hunt',
        description: 'Construct a ZEBRA (zero-extrinsic-back-ratio spread) on a stock you\'re bullish on. Compare it to simply buying the stock — analyze capital efficiency, leverage, and max loss. Paper trade the ZEBRA through a significant price move.',
        criteria: 'Show the ZEBRA construction, capital required vs. buying stock, leverage ratio, max loss, and actual P&L during the trade. Explain when you\'d use a ZEBRA instead of the stock or a simple call.',
        difficulty: 2,
      },
      {
        id: 'lion-challenge-3',
        title: 'The Pride Portfolio',
        description: 'Build a high-conviction portfolio of 3 bullish positions: one long call for maximum leverage, one bull call spread for risk-efficiency, and one cash-secured put for income. All on different high-quality stocks you\'re genuinely bullish on. Manage for one month with decisive adjustment decisions.',
        criteria: 'Document the conviction thesis for each position, entry details, any adjustments made and why, and final P&L. Evaluate not just returns but whether your decision-making was appropriately decisive throughout.',
        difficulty: 3,
      },
    ],
  },

  tiger: {
    id: 'tiger',
    name: 'The Self-Aware Hunter',
    characterName: 'Tanya',
    emoji: 'tiger',
    riskLevel: 'moderate',
    riskStars: 3,
    personality: 'Introspective, disciplined, powerful. Tanya knows her strengths and weaknesses.',
    catchphrase: 'Know thyself, know thy edge.',
    philosophy: 'Self-awareness is the foundation of trading success. Understand your psychology.',
    colors: {
      primary: '#f97316',
      accent: '#fb923c',
      bg: 'rgba(249, 115, 22, 0.1)',
    },
    dialogues: {
      greeting: 'Before we hunt, let\'s understand what kind of hunter you are.',
      encouragement: 'Good self-reflection. Understanding yourself is power.',
      quizCorrect: 'You know yourself well. That\'s true trading wisdom.',
      quizIncorrect: 'Let\'s look inward again. Self-awareness takes practice.',
      lessonComplete: 'Another layer of self-knowledge revealed.',
      strategyComplete: 'This strategy aligns with your trading personality.',
    },
    favoriteStrategies: ['iron-condor', 'calendar-spread', 'diagonal-spread'],
    unlocked: false,
    extendedBio: `Tanya the Tiger is the most introspective mentor in the entire jungle — and her students are often surprised to discover that self-knowledge is the most powerful trading edge of all. A former behavioral finance researcher who spent years studying how cognitive biases destroy trading performance, Tanya came to a radical conclusion: most traders fail not because they lack strategy, but because they don't understand themselves well enough to apply any strategy consistently.

Tanya's own journey began with a spectacular failure. A classically trained economist with a perfect academic record, she entered the markets convinced her intellectual rigor would be her edge. Instead, she discovered that her analytical precision disappeared under the pressure of live trading. She would hold losing trades too long (loss aversion), exit winning trades too early (fear of giving back gains), and overtrade when bored (need for stimulation). Understanding these patterns — and building strategies that accommodated them — transformed her results.

What makes Tanya exceptional as a mentor is her ability to help each student understand their own psychological profile. Are you prone to overconfidence? She has strategies for that. Do you freeze under pressure? She has solutions. Does uncertainty make you overtrade? She has structure for that too. Tanya doesn't teach one approach — she teaches students to match their strategy to their psychology, so that the trading plan works with their nature rather than against it.`,
    tradingPhilosophy: `Tanya's philosophy is that sustainable trading performance requires alignment between psychology and strategy. A highly analytical trader who runs a discretionary momentum system will struggle not because the system is wrong, but because their psychology demands more structure. A highly intuitive trader forced to follow rigid rules will sabotage themselves by finding exceptions. The right strategy isn't the one with the highest expected return — it's the one the individual trader can execute consistently under pressure.

The strategies Tanya teaches — iron condors, calendar spreads, and diagonal spreads — share a common trait: they perform best when managed systematically with predefined rules. This makes them ideal for traders who struggle with emotional decision-making, because the management rules are established before the trade is live. Entry criteria. Adjustment triggers. Profit targets. Stop losses. Everything is defined in advance, which removes the need for real-time emotional decision-making. That's not a limitation — it's a superpower for the self-aware trader.

Tanya's ultimate lesson is that the market is a mirror. It reflects your psychological strengths and weaknesses with ruthless honesty. The traders who thrive are the ones who look into that mirror without flinching, understand what they see, and build their approach around their true self rather than the idealized trader they wish they were. Self-awareness doesn't just improve your trading — it improves your life.`,
    realWorldAnalogy: `Tanya trades like a master chef who knows their own palate deeply. The chef who knows they prefer clean, precise flavors doesn't try to force themselves to cook chaotic fusion cuisine — they build a menu around their genuine strengths. The chef who knows they're impatient doesn't attempt dishes that require eight hours of slow braising — they design their kitchen around rapid-fire technique. Tanya does the same with trading: she helps each student build a system designed for who they actually are, not who they think they should be.`,
    coreStrategies: ['iron-condor', 'calendar-spread', 'diagonal-spread'],
    advancedStrategies: ['double-diagonal', 'broken-wing-butterfly'],
    learningOrder: ['iron-condor', 'calendar-spread', 'diagonal-spread', 'broken-wing-butterfly', 'double-diagonal'],
    mentorToolkit: [
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Knowing your probability of profit before entry removes the guesswork that leads to emotional decisions. When you know the math, you can follow the plan without second-guessing.',
      },
      {
        calculatorId: 'greeks-visualizer',
        label: 'Greeks Visualizer',
        reason: 'Self-aware traders understand their positions at a deep level. This tool shows you exactly how your position will behave as conditions change — no surprises, no panic, just informed management.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'Seeing the full payoff diagram in advance eliminates the emotional shock of unexpected outcomes. When you know what every scenario looks like before it happens, you can manage with clarity.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'Knowing the volatility environment prevents you from fighting market conditions. This tool tells me whether conditions favor my strategies or if I should wait — and waiting is sometimes the wisest trade.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Before we discuss strategies, I want to ask you something: what kind of trader are you? Not what kind you want to be — what kind you actually are right now. Self-knowledge is the foundation of everything we\'ll build here.' },
      { trigger: 'completed_first_strategy', message: 'Your first systematic strategy. Notice how having predefined rules changes the emotional experience of trading? That structure is protecting you from yourself — in the best possible way.' },
      { trigger: 'completed_all_core', message: 'Three core strategies, each with systematic management rules. You now have a framework that accommodates your psychology instead of fighting it. That alignment is where consistent performance lives.' },
      { trigger: 'quiz_failed', message: 'Let\'s look inward here. Was this a knowledge gap, or was it a focus gap? Understanding WHY you missed the answer is more valuable than just finding the right answer. Reflect on the process, not just the result.' },
      { trigger: 'quiz_perfect', message: 'Perfect score and full self-awareness — you knew what you knew and you knew what you didn\'t. That metacognitive clarity is the mark of a truly excellent trader.' },
      { trigger: 'streak_3_days', message: 'Three days of consistent practice. Consistency reveals patterns in your behavior — both good and bad. Pay attention to how you feel during your study sessions. Your emotional patterns in learning mirror your patterns in trading.' },
      { trigger: 'returning_user', message: 'Welcome back. While you were away, your unconscious mind was processing what you\'ve learned. Self-knowledge deepens with reflection — so the time away may have been more valuable than you realize.' },
      { trigger: 'viewing_advanced', message: 'Advanced strategies require even more self-awareness — they have more variables, more decision points, more opportunities for psychological interference. Make sure your core strategies are truly automatic before adding complexity.' },
    ],
    tribeAffinity: 'wolf-pack',
    mentorChallenges: [
      {
        id: 'tiger-challenge-1',
        title: 'The Psychological Audit',
        description: 'Before your first trade, write a one-page psychological self-assessment: What are your three biggest psychological weaknesses as a trader? What situations trigger emotional decision-making for you? Then design one rule for each weakness that prevents it from affecting your trading.',
        criteria: 'Produce the self-assessment and the three corresponding rules. Paper trade an iron condor for 2 weeks and track whether any of your identified weaknesses showed up. Did your rules help?',
        difficulty: 1,
      },
      {
        id: 'tiger-challenge-2',
        title: 'The Trade Journal Mirror',
        description: 'Maintain a detailed trade journal for 3 weeks — not just the numbers, but your emotional state before, during, and after each trade. At the end of 3 weeks, analyze your journal: when were you calmest? When were you most anxious? Do your emotional states correlate with your best and worst decisions?',
        criteria: 'Complete journal with at least 10 entries including emotional states. Written analysis identifying at least 3 patterns in your emotional decision-making. One concrete rule change you\'re making based on what the mirror showed you.',
        difficulty: 2,
      },
      {
        id: 'tiger-challenge-3',
        title: 'The Personalized System',
        description: 'Design your complete personal trading system based on your psychological profile. Include: strategy selection rationale (why this strategy fits your psychology), entry criteria, management rules, exit criteria, position sizing, and maximum positions. Then paper trade the system for one month without deviating from the rules.',
        criteria: 'Document the full system with psychological reasoning for each rule. Track every deviation from the system during the month (there should be zero). Final P&L and reflection on how the system felt to execute.',
        difficulty: 3,
      },
    ],
  },

  wolf: {
    id: 'wolf',
    name: 'The Patient Predator',
    characterName: 'Wolfgang',
    emoji: 'wolf',
    riskLevel: 'aggressive',
    riskStars: 4,
    personality: 'Ruthless, calculated, patient. Wolfgang waits in the shadows, studying his prey for days before striking with lethal precision.',
    catchphrase: 'The pack waits. The pack watches. The pack strikes.',
    philosophy: 'The hunt is won before the strike. Study your prey. Know the terrain. Wait for weakness. Then attack without mercy.',
    colors: {
      primary: '#64748b',
      accent: '#94a3b8',
      bg: 'rgba(100, 116, 139, 0.1)',
    },
    dialogues: {
      greeting: 'You seek to join the pack? First, you must learn to wait.',
      encouragement: 'Good. You\'re learning discipline. The weak chase—the strong wait.',
      quizCorrect: 'Precise. Cold. Correct. You think like a predator.',
      quizIncorrect: 'Impatience. That\'s how prey thinks. Let\'s try again.',
      lessonComplete: 'Another weapon sharpened. The pack grows stronger.',
      strategyComplete: 'This strategy requires patience and precision. You have both now.',
    },
    favoriteStrategies: ['bear-put-spread', 'bear-call-spread', 'long-put', 'short-strangle', 'iron-condor', 'ratio-spread'],
    unlocked: false,
    extendedBio: `Wolfgang the Wolf is the mentor that other traders whisper about with a mixture of fear and respect. A former military intelligence analyst who transitioned into proprietary trading, Wolfgang brought the discipline, patience, and cold analytical precision of the battlefield to the trading floor. He doesn't chase. He doesn't hope. He doesn't trade for excitement. Wolfgang identifies high-conviction setups, calculates the exact risk-to-reward ratio, sizes the position to his specifications, and executes without a flicker of emotion. Then he waits — sometimes for days, sometimes for weeks — until the prey walks into his trap.

Wolfgang's transformation into a trading legend happened over a single three-month period where he made exactly seven trades. Seven. While other traders on his desk fired off dozens of orders daily, Wolfgang sat motionless, studying order flow, mapping support and resistance, and waiting for the precise moment when risk was lowest and reward was highest. Those seven trades produced more profit than the entire desk combined that quarter. His manager asked what his secret was. Wolfgang's answer: "I wait."

What makes Wolfgang a demanding but transformative mentor is his refusal to tolerate mediocrity. He doesn't sugarcoat. He doesn't celebrate participation. He celebrates precision. His students learn that trading is not about frequency — it's about selectivity. A wolf doesn't chase every rabbit in the field; it selects the weakest, most exposed target and takes it down with a single, coordinated strike. Wolfgang's students trade less, stress less, and profit more — because they learn to wait for the setups where the odds are overwhelmingly in their favor.`,
    tradingPhilosophy: `Wolfgang's philosophy is rooted in the concept of asymmetric risk-reward with extreme selectivity. He will not take a trade unless the potential reward is at least three times the potential risk — and ideally five times. This means he rejects the vast majority of setups. Most traders see this as a weakness; Wolfgang sees it as his greatest strength. By only taking trades with heavily skewed payoffs, he can be wrong more than half the time and still be extremely profitable.

The strategies Wolfgang employs reflect his predatory patience. Bear put spreads and bear call spreads provide defined-risk directional exposure with known max loss. Short strangles collect premium when he believes the market will stay range-bound. Iron condors profit from time decay in precise price channels. Ratio spreads create asymmetric payoffs that reward large moves. Calendar spreads exploit time decay differentials. Each strategy is selected for a specific market condition, and Wolfgang never forces a strategy onto the wrong environment.

The psychological discipline Wolfgang teaches is arguably the most valuable lesson in this entire academy. Most traders lose money because they trade too often, driven by boredom, FOMO, or the need to feel productive. Wolfgang teaches the radical discipline of doing nothing. Sitting on your hands while others trade is emotionally difficult — it feels lazy, irresponsible, unproductive. But the data is clear: the most profitable traders are the most selective. Wolfgang's students learn that the decision NOT to trade is itself a trade — and it's often the most profitable one they'll make all week.`,
    realWorldAnalogy: `Wolfgang trades like a sniper, not a machine gunner. A machine gunner sprays bullets everywhere, hoping to hit something. A sniper waits for hours — sometimes days — for the perfect shot. One bullet, one kill. Wolfgang's approach to trading is identical: he doesn't fire unless the target is in the crosshairs, the wind conditions are accounted for, and the probability of a clean hit is overwhelming. While other traders measure success by how many trades they make, Wolfgang measures it by how few.`,
    coreStrategies: ['bear-put-spread', 'bear-call-spread', 'long-put', 'short-strangle', 'iron-condor'],
    advancedStrategies: ['put-backspread', 'ratio-spread', 'calendar-spread'],
    learningOrder: ['long-put', 'bear-put-spread', 'bear-call-spread', 'iron-condor', 'short-strangle', 'put-backspread', 'ratio-spread', 'calendar-spread'],
    mentorToolkit: [
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'The pack doesn\'t strike unless the probability is in our favor. This calculator tells me whether the hunt is worth initiating. Anything below 55% probability stays in the shadows.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'Before the strike, I study the terrain. This tool maps out every price scenario — where the kill zone is, where the breakeven lies, where the risk begins. No ambiguity. No surprises.',
      },
      {
        calculatorId: 'position-sizing-calculator',
        label: 'Position Sizing',
        reason: 'A wolf who bets everything on one hunt is a fool. This calculator ensures every position is sized to survive even if the hunt fails. Survive first. Feast second.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'Whether I\'m selling premium or buying it depends entirely on the volatility environment. This tool tells me whether the conditions favor the hunter or the hunted.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'You want to join the pack. Good. The first lesson is the hardest: learn to do nothing. Most traders lose money because they can\'t sit still. I will teach you the discipline of patience — the predator\'s greatest weapon.' },
      { trigger: 'completed_first_strategy', message: 'One weapon sharpened. But a weapon is only as good as the hand that wields it — and the mind that decides when to strike. Don\'t rush to the next lesson. Let this one sink in.' },
      { trigger: 'completed_all_core', message: 'Five core strategies mastered. You now have tools for directional bets, premium selling, and range-bound markets. The advanced strategies will add precision to your arsenal — but only if you\'ve truly mastered these.' },
      { trigger: 'quiz_failed', message: 'Imprecision. In the field, imprecision gets you killed. Identify exactly where your understanding broke down, fix it, and come back clean. The pack doesn\'t accept sloppy thinking.' },
      { trigger: 'quiz_perfect', message: 'Cold. Precise. Flawless. That\'s the mind of a predator. Every answer calculated, not guessed. The pack would be proud.' },
      { trigger: 'streak_3_days', message: 'Three consecutive days of discipline. Consistency is the wolf\'s hidden weapon. The prey never sees us coming because we prepare relentlessly, day after day, without fanfare.' },
      { trigger: 'returning_user', message: 'The pack remembers those who leave and those who return. You\'re back. Good. Let\'s continue sharpening the weapons. The market doesn\'t reward those who take breaks from discipline.' },
      { trigger: 'viewing_advanced', message: 'Ratio spreads, synthetic futures, and bear ladders are the heavy artillery. Mishandled, they can wound the pack. Ensure your core strategies are instinctive before deploying these.' },
    ],
    tribeAffinity: 'wolf-pack',
    mentorChallenges: [
      {
        id: 'wolf-challenge-1',
        title: 'The Patient Setup',
        description: 'For one full week, watch a stock without trading it. Document daily: key support and resistance levels, IV Rank, and whether you see a high-conviction setup forming. At the end of the week, decide: trade or no trade. If you trade, execute a bear put spread or short strangle. If not, explain why no setup met your criteria.',
        criteria: 'Daily logs for 5 trading days showing your analysis. A clear decision at the end with full reasoning. If traded, document the position, rationale, and risk/reward ratio. The goal is to demonstrate patience, not activity.',
        difficulty: 1,
      },
      {
        id: 'wolf-challenge-2',
        title: 'The Risk-Reward Filter',
        description: 'Identify 10 potential trade setups over a 2-week period. For each, calculate the risk-to-reward ratio. Only paper trade the setups where the reward is at least 3x the risk. Track all 10 (traded and not traded) to expiration. Compare the results of the selective approach vs. trading all 10.',
        criteria: 'Document all 10 setups with risk/reward calculations. Show which were traded and which were rejected. Track all 10 to expiration. Compare the P&L of the selective portfolio (only 3:1+ trades) vs. the unfiltered portfolio (all 10 trades).',
        difficulty: 2,
      },
      {
        id: 'wolf-challenge-3',
        title: 'The Predator\'s Journal',
        description: 'Maintain a detailed trading journal for 3 weeks. For every trade taken AND every trade considered but rejected, document: thesis, strategy, risk/reward, IV conditions, entry/exit rules, and emotional state. At the end of 3 weeks, analyze: were your best trades the ones you took, or the ones you avoided?',
        criteria: 'Complete journal with at least 15 entries (trades taken + trades rejected). Self-analysis at the end identifying patterns in your best and worst decisions. Calculate whether your selectivity filter added value. The most important insight is about discipline, not profit.',
        difficulty: 3,
      },
    ],
  },

  kangaroo: {
    id: 'kangaroo',
    name: 'The Volatile Jumper',
    characterName: 'Joey',
    emoji: 'kangaroo',
    riskLevel: 'aggressive',
    riskStars: 5,
    personality: 'Wild, explosive, thrives on volatility. Joey loves the chaos—big moves, big swings, big payoffs.',
    catchphrase: 'When the market jumps, I jump higher!',
    philosophy: 'Volatility is not risk—it\'s opportunity. The bigger the jump, the bigger the profit.',
    colors: {
      primary: '#dc2626',
      accent: '#f87171',
      bg: 'rgba(220, 38, 38, 0.1)',
    },
    dialogues: {
      greeting: 'G\'day mate! Ready to catch some wild moves? Let\'s bounce!',
      encouragement: 'That\'s the spirit! Embrace the volatility!',
      quizCorrect: 'BOING! Nailed it! You think like a true jumper!',
      quizIncorrect: 'Woah, missed that landing. Let\'s hop back and try again!',
      lessonComplete: 'Another big move mastered! You\'re learning to fly!',
      strategyComplete: 'This volatility weapon is now in your pouch. Use it when chaos erupts!',
    },
    favoriteStrategies: ['long-straddle', 'long-strangle', 'call-backspread', 'put-backspread', 'iron-butterfly'],
    unlocked: false,
    warningMessage: 'HIGH VOLATILITY: Joey\'s strategies thrive on big moves but can lose quickly in quiet markets. Not for the faint-hearted.',
    extendedBio: `Joey the Kangaroo is pure adrenaline wrapped in fur. A former volatility trader at a commodities hedge fund, Joey spent eight years trading natural gas options — one of the most volatile instruments on the planet — where a quiet day meant a 3% move and an exciting day meant 15%. That experience forged a trader who doesn't just tolerate volatility; he craves it. While other mentors teach students to avoid wild markets, Joey teaches them to thrive in them. When the VIX spikes, when earnings shock, when black swans land — that's Joey's hunting ground.

Joey's approach to volatility is fundamentally different from everyone else's in the jungle. Most traders view volatility as risk — something to hedge away or avoid. Joey views it as fuel. His straddles and strangles are gasoline-soaked positions that ignite when markets move big. His backspreads create convex payoffs that accelerate as moves get more extreme. His strips and straps are directional volatility bets that pay off when the move comes and comes hard. Every instrument in Joey's pouch is designed for one thing: capturing the explosive energy of market dislocations.

What makes Joey both thrilling and dangerous as a mentor is his honesty about the other side of the coin. His strategies can lose money quickly in quiet, range-bound markets. Theta decay eats away at long straddles when nothing happens. Backspreads bleed when volatility contracts. Joey doesn't hide this — he celebrates it. "The cost of a straddle is the price of admission to the rollercoaster," he says. His students learn to manage the drought between volatility events, size positions to survive the calm, and pounce with maximum force when the market finally explodes.`,
    tradingPhilosophy: `Joey's trading philosophy is built on a statistical insight that most traders get backwards: volatility clusters. Markets don't distribute their moves evenly across time — they bunch them together. A period of low volatility is followed by a period of high volatility, and vice versa. This clustering effect means that buying volatility when it's cheap (during quiet periods) and positioning for the inevitable explosion can be extraordinarily profitable. Joey doesn't predict WHEN the big move will happen — he positions for IF, knowing that "if" always becomes "when" eventually.

The strategies Joey uses all share one characteristic: positive gamma. Long straddles, long strangles, backspreads, and guts all benefit from large moves in either direction. The bigger the move, the more they make. This convex payoff profile is the mathematical opposite of selling premium — and it's what allows Joey to produce outsized returns during market dislocations. While premium sellers get crushed during crashes and spikes, Joey's positions accelerate. A single day where the VIX jumps 50% can pay for months of theta decay on his long volatility positions.

The discipline Joey teaches is counter-intuitive: learn to be comfortable losing small amounts consistently. Most of Joey's positions will lose money due to time decay. That's expected and budgeted for. What matters is the sizing and the payout when volatility explodes. A long straddle that loses $200 over three weeks but gains $2,000 on a single gap event is a wildly profitable strategy — it just doesn't feel like it day-to-day. Joey's students learn to measure performance over months, not days, and to trust the math of convexity even when the daily P&L is red.`,
    realWorldAnalogy: `Joey trades like a storm chaser. A storm chaser drives hundreds of miles through boring blue sky, burning gas and time, waiting for the moment the atmosphere erupts into a tornado. Most days are uneventful. Most drives end in nothing. But when the supercell forms, when the funnel drops, the storm chaser is in exactly the right position to capture something extraordinary. Joey's straddles are the gas in the truck — they cost money every day the market is quiet. But when the storm hits, he's positioned for the ride of a lifetime.`,
    coreStrategies: ['long-straddle', 'long-strangle', 'call-backspread', 'put-backspread', 'iron-butterfly'],
    advancedStrategies: ['strap', 'strip'],
    learningOrder: ['long-straddle', 'long-strangle', 'call-backspread', 'put-backspread', 'iron-butterfly', 'strap', 'strip'],
    mentorToolkit: [
      {
        calculatorId: 'expected-move-calculator',
        label: 'Expected Move',
        reason: 'Before I jump, I need to know how far the market thinks it\'ll move. If my straddle breakeven is inside the expected move, the odds are with me. If it\'s outside, I might need bigger legs for the jump!',
      },
      {
        calculatorId: 'iv-crush-calculator',
        label: 'IV Crush Calculator',
        reason: 'This is CRITICAL for vol trading. If I\'m buying straddles before earnings, I need to know exactly how much IV needs to drop to kill my position. The crush calculator is the difference between a profitable jump and a painful landing.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'Am I buying volatility cheap or expensive? This tool tells me! When IV Rank is low, vol is on sale and my straddles are cheap. When it\'s high, I might switch to selling premium instead. Timing the vol cycle is everything!',
      },
      {
        calculatorId: 'greeks-visualizer',
        label: 'Greeks Visualizer',
        reason: 'Gamma is my best mate — it\'s what makes my positions accelerate when the market moves big. This visualizer shows me my gamma exposure so I know exactly how much my position will gain per point of movement.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome to the wild side! Before we start bouncing, here\'s the deal: my strategies are designed for BIG moves. They lose a little when things are quiet and win a LOT when things get crazy. If that sounds like your style, hop in!' },
      { trigger: 'completed_first_strategy', message: 'Your first volatility weapon! Did you see that payoff curve? The way it accelerates as the move gets bigger? That\'s convexity, mate, and it\'s the most beautiful thing in all of options trading!' },
      { trigger: 'completed_all_core', message: 'Five volatility strategies in the pouch! Straddles, strangles, backspreads, and butterflies — you\'ve got tools for every volatility scenario. When the market decides to jump, you\'ll be ready to jump higher!' },
      { trigger: 'quiz_failed', message: 'Missed that landing! No worries, mate — volatility trading has a lot of moving parts. The Greeks, the breakevens, the theta decay — it\'s complex. Review and hop back at it!' },
      { trigger: 'quiz_perfect', message: 'Perfect score! You understand volatility inside and out! The math, the Greeks, the payoffs — all of it! When the market erupts, you\'ll be the one everyone else wishes they were!' },
      { trigger: 'streak_3_days', message: 'Three days of volatility training! Here\'s a secret: the best vol traders study during the QUIET periods so they\'re fully prepared when the explosion comes. Your preparation will pay off — I promise!' },
      { trigger: 'returning_user', message: 'The kangaroo bounces back! While you were away, volatility was either brewing or erupting — it always is. Let\'s make sure you\'re positioned for the next big jump!' },
      { trigger: 'viewing_advanced', message: 'Ratio spreads, guts, and twisted sisters are heavy-duty volatility tools. They can produce massive returns but require deep understanding of gamma, vega, and the volatility smile. Master the basics first, mate!' },
    ],
    tribeAffinity: 'cheetah-sprint',
    mentorChallenges: [
      {
        id: 'kangaroo-challenge-1',
        title: 'The Vol Watch',
        description: 'Track the VIX (or a stock\'s IV Rank) daily for one week. When IV Rank drops below 20, paper trade a long straddle with 45 DTE. Set a rule: close at +50% profit or -30% loss. Document the daily theta decay and track how the position responds to any market movement.',
        criteria: 'Daily log of VIX/IV Rank, the straddle\'s daily P&L, and the Greeks. Calculate daily theta decay as a percentage of the position. Evaluate whether buying volatility at a low IV Rank provided an edge.',
        difficulty: 1,
      },
      {
        id: 'kangaroo-challenge-2',
        title: 'The Earnings Explosion',
        description: 'Paper trade a long strangle before earnings on a stock with a history of big earnings moves. Use the IV Crush Calculator to estimate post-earnings IV collapse. Calculate the breakeven move. After earnings, compare the actual move to your breakeven. Did the explosion exceed the crush?',
        criteria: 'Document pre-earnings IV, expected move, strangle cost, breakeven move required, post-earnings IV collapse, actual move, and final P&L. Analyze whether the market\'s pre-earnings volatility pricing was accurate.',
        difficulty: 2,
      },
      {
        id: 'kangaroo-challenge-3',
        title: 'The Convexity Portfolio',
        description: 'Build a volatility portfolio with three positions: (1) a long straddle on a high-beta stock, (2) a call backspread on a stock approaching a catalyst, and (3) a strap on a stock you\'re bullish-volatile on. Manage all three for 3 weeks. The goal: one big winner that pays for all the theta decay on the others.',
        criteria: 'Document all three positions, daily portfolio P&L, total theta decay over the period, and any explosive moves captured. Calculate whether the convexity payout from winners exceeded the theta cost of the full portfolio.',
        difficulty: 3,
      },
    ],
  },

  panda: {
    id: 'panda',
    name: 'The Zen Investor',
    characterName: 'Puffy',
    emoji: 'panda',
    riskLevel: 'conservative',
    riskStars: 1,
    personality: 'Calm, steady, unshakeable. Puffy doesn\'t chase excitement—she collects premium while others panic.',
    catchphrase: 'Inner peace... and consistent premium.',
    philosophy: 'The market is chaos. You don\'t have to be. Collect your premium, manage your risk, and let time do the work.',
    colors: {
      primary: '#059669',
      accent: '#6ee7b7',
      bg: 'rgba(5, 150, 105, 0.1)',
    },
    dialogues: {
      greeting: 'Welcome, friend. Take a breath. The market will wait. Let\'s learn in peace.',
      encouragement: 'Very good. Patience and calm lead to consistent profits.',
      quizCorrect: 'Excellent. Your mind is clear, your answer is correct.',
      quizIncorrect: 'Hmm. Let go of the stress. Clear your mind and try again.',
      lessonComplete: 'Another peaceful lesson absorbed. Your trading becomes more zen.',
      strategyComplete: 'This strategy brings calm and income. A perfect combination.',
    },
    favoriteStrategies: ['covered-call', 'cash-secured-put', 'protective-put', 'collar', 'calendar-spread'],
    unlocked: false,
    extendedBio: `Puffy the Panda is the calmest creature in the entire jungle — and her portfolio reflects that serenity. A former yoga instructor who turned to trading after discovering that covered calls funded her studio expenses better than class fees, Puffy brought her zen philosophy directly into the markets. She doesn't chase excitement. She doesn't track every tick. She doesn't argue with bears or race with cheetahs. Puffy collects premium, manages risk, and spends the rest of her time doing things that actually make her happy. Her trading philosophy is simple: if a strategy causes stress, it's the wrong strategy.

Puffy's journey to becoming a mentor began when she noticed something extraordinary: her simple, boring, conservative approach consistently outperformed most of the aggressive traders in the jungle. While they were leveraging up, blowing accounts, and rebuilding from the ashes, Puffy was steadily compounding at 10-15% annually with almost no drawdowns. She realized that the biggest edge in trading isn't intelligence, speed, or information — it's emotional stability. And emotional stability comes from trading strategies that are boring enough to let you live your life.

What makes Puffy a beloved mentor is her radical simplicity and warmth. She doesn't believe options trading needs to be complicated to be profitable. She teaches six strategies. She trades thirty minutes a day. She checks her portfolio once in the morning and once before bed. Her students are the happiest in the academy — not because they make the most money, but because they make excellent money while maintaining their peace of mind.`,
    tradingPhilosophy: `Puffy's philosophy is that the best trade is the one that doesn't require you to think about it. Covered calls on quality stocks generate steady income while you go about your life. Cash-secured puts earn premium for agreeing to buy stocks you already want to own at lower prices. Protective puts let you hold positions through turbulence without losing sleep. Collars define your maximum gain and maximum loss, eliminating uncertainty. These aren't sophisticated strategies — and that's precisely the point. Sophistication in trading is overrated. Consistency is underrated.

This approach works because it harnesses the most reliable edge in options trading — the volatility risk premium — without the complexity and stress of managing multi-leg, multi-dimensional positions. Options, on average, are priced for more volatility than actually occurs. This means sellers of options — Puffy's bread and butter — have a structural advantage over time. Covered calls sell that overpriced volatility against shares you own. Cash-secured puts sell it against cash you'd deploy anyway. The edge isn't flashy, but it's persistent and well-documented across decades of market history.

The lifestyle dimension of Puffy's philosophy is integral, not incidental. Research consistently shows that the more time traders spend watching screens, the worse their returns — because screen time leads to overtrading, emotional decisions, and stress-induced errors. Puffy's minimal-touch approach produces better returns precisely because it reduces the opportunities for human error. Set up the position on Monday. Check it briefly each day. Manage by exception. The bamboo grows whether you watch it or not. Your portfolio can too.`,
    realWorldAnalogy: `Puffy trades like a beekeeper tending a hive. She doesn't micromanage every bee or stress about every flower. She set up the hive (the portfolio), she checks on it periodically (position management), and the bees do the work (theta decay, premium collection). Most days, the honey just accumulates. Occasionally she needs to calm a disturbance or add a new frame, but 90% of the time, the system runs itself. The beekeeper's job is to maintain the conditions for honey production — not to tell every bee where to fly. That's zen investing.`,
    coreStrategies: ['covered-call', 'cash-secured-put', 'protective-put', 'collar', 'calendar-spread'],
    advancedStrategies: ['iron-condor', 'short-straddle'],
    learningOrder: ['covered-call', 'cash-secured-put', 'protective-put', 'collar', 'calendar-spread', 'iron-condor', 'short-straddle'],
    mentorToolkit: [
      {
        calculatorId: 'pop-calculator',
        label: 'Probability of Profit',
        reason: 'Peace of mind starts with knowing your odds. Before any trade, I check my probability of profit. High probability trades let me relax. Low probability trades cause stress. I choose peace.',
      },
      {
        calculatorId: 'profit-calculator',
        label: 'Profit/Loss Visualizer',
        reason: 'I like to see the shape of my trade before I enter it. A calm, well-defined payoff curve means a calm, well-defined trading experience. No surprises. Just gentle, predictable income.',
      },
      {
        calculatorId: 'position-sizing-calculator',
        label: 'Position Sizing',
        reason: 'Nothing disrupts inner peace faster than having too much money in a single position. This calculator keeps my positions small, balanced, and proportional to my portfolio. Small positions, small stress.',
      },
      {
        calculatorId: 'iv-rank-tool',
        label: 'IV Rank Tool',
        reason: 'Even a zen investor checks the volatility weather. When IV Rank is elevated, my premiums are richer and my covered calls generate more income. When it\'s low, I practice patience and wait for better conditions.',
      },
    ],
    contextualTips: [
      { trigger: 'first_visit', message: 'Welcome, friend. Take a deep breath. The market is noisy, chaotic, and full of people shouting. But in here, we trade quietly. We trade simply. And we trade profitably. Let\'s begin with calm and clarity.' },
      { trigger: 'completed_first_strategy', message: 'Your first zen strategy. Notice how simple it was? No complex Greeks to monitor, no multi-leg adjustments, no screen watching. Just a clean, income-generating position. That\'s the way.' },
      { trigger: 'completed_all_core', message: 'Five peaceful strategies mastered. You can now generate income, protect your portfolio, and manage risk — all with about thirty minutes of effort per day. The bamboo forest of consistent returns awaits you.' },
      { trigger: 'quiz_failed', message: 'Let go of any frustration. A missed question is not a failure — it\'s simply a signal that more peaceful study is needed. Clear your mind, revisit the material, and try again when you feel ready.' },
      { trigger: 'quiz_perfect', message: 'Your mind was clear and your answers were precise. That\'s the power of calm, focused study. When there is no stress, there is no confusion. Well done, peaceful trader.' },
      { trigger: 'streak_3_days', message: 'Three days of consistent, calm practice. Like meditation, the benefits of daily study compound silently. You won\'t notice the change day to day, but over time, your understanding deepens like roots in quiet soil.' },
      { trigger: 'returning_user', message: 'Welcome back, friend. There is no rush. Your portfolio has been quietly collecting premium while you were away. Let\'s continue our peaceful journey through the options garden.' },
      { trigger: 'viewing_advanced', message: 'Iron condors and covered straddles require more attention than our basic strategies. Before adding complexity, ask yourself: will this strategy let me sleep peacefully? If the answer is no, perhaps the simpler path is wiser.' },
    ],
    tribeAffinity: 'lion-pride',
    mentorChallenges: [
      {
        id: 'panda-challenge-1',
        title: 'The Peaceful Income',
        description: 'Sell a covered call on a stock you own (or hypothetically own) at a strike 5-8% above the current price with 30-45 DTE. After entering the trade, set a timer: you may only check the position once per day, for no more than 5 minutes. Track for 2 weeks.',
        criteria: 'Document the position, premium collected, your daily 5-minute check-in notes, and final outcome. Record your stress level (1-10) each day. The goal is not just profit — it\'s proving that profitable trading doesn\'t require constant attention.',
        difficulty: 1,
      },
      {
        id: 'panda-challenge-2',
        title: 'The Zen Wheel',
        description: 'Execute one full "wheel" cycle in paper trading: (1) sell a cash-secured put, (2) if assigned, sell a covered call on the shares, (3) if called away, start over. The entire cycle should require no more than 15 minutes of work per week. Track total premium collected and total time spent.',
        criteria: 'Document each step of the wheel cycle, all premiums collected, total time spent trading, and final return. Calculate your "dollars per hour of trading effort." Compare this to an active trading approach. Which produces more return per unit of stress?',
        difficulty: 2,
      },
      {
        id: 'panda-challenge-3',
        title: 'The Bamboo Garden',
        description: 'Build a portfolio of 4 income-generating positions across different underlyings: two covered calls, one cash-secured put, and one collar. Manage the entire portfolio for one month with a strict rule: no more than 30 minutes of total trading activity per day, including research.',
        criteria: 'Monthly summary of all positions, total premium income, total time invested (must be under 10 hours for the month), daily stress ratings, and portfolio return. The ultimate measure of success is the ratio of return to time-and-stress invested.',
        difficulty: 3,
      },
    ],
  },
};

// Map strategies to their primary mentor
export const STRATEGY_MENTORS: Record<string, string> = {
  // Tier 0 - Foundations
  'course-goals': 'owl',
  'what-are-options': 'owl',
  'stocks-vs-options': 'owl',
  'who-are-options-for': 'retriever',
  'know-thyself': 'tiger',
  'rules-of-the-jungle': 'lion',

  // Tier 3 - Anchors
  'long-call': 'cheetah',
  'long-put': 'bear',
  'covered-call': 'turtle',
  'cash-secured-put': 'sloth',
  'protective-put': 'turtle',
  'collar': 'dolphin',

  // Tier 4 - Verticals
  'bull-call-spread': 'bull',
  'bear-put-spread': 'bear',
  'bull-put-spread': 'badger',
  'bear-call-spread': 'badger',

  // Tier 5 - Volatility
  'long-straddle': 'chameleon',
  'long-strangle': 'chameleon',
  'short-straddle': 'octopus',
  'short-strangle': 'sloth',
  'iron-condor': 'owl',
  'iron-butterfly': 'owl',

  // Tier 6 - Time/Skew
  'calendar-spread': 'fox',
  'pmcc': 'fox',
  'diagonal-spread': 'fox',

  // Tier 7 - Ratios
  'ratio-spread': 'octopus',
  'call-backspread': 'kangaroo',
  'put-backspread': 'kangaroo',
  'broken-wing-butterfly': 'fox',
  'jade-lizard': 'sloth',
  'zebra': 'lion',

  // Default
  'default': 'owl',
};

export const getAnimalById = (id: string): JungleAnimal | undefined => {
  return JUNGLE_ANIMALS[id];
};

export const getMentorForStrategy = (strategyId: string): JungleAnimal => {
  const mentorId = STRATEGY_MENTORS[strategyId] || STRATEGY_MENTORS['default'];
  return JUNGLE_ANIMALS[mentorId] || JUNGLE_ANIMALS['owl'];
};

export const getAllAnimals = (): JungleAnimal[] => {
  return Object.values(JUNGLE_ANIMALS);
};
