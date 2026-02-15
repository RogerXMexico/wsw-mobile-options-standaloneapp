// Jungle Trading Academy - Animal Mentors for Mobile
// Ported from web app

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
}

export const JUNGLE_ANIMALS: Record<string, JungleAnimal> = {
  turtle: {
    id: 'turtle',
    name: 'The Patient Protector',
    characterName: 'Terry',
    emoji: '🐢',
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
  },

  owl: {
    id: 'owl',
    name: 'The Analytical Scholar',
    characterName: 'Oliver',
    emoji: '🦉',
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
  },

  cheetah: {
    id: 'cheetah',
    name: 'The Speed Demon',
    characterName: 'Chase',
    emoji: '🐆',
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
  },

  fox: {
    id: 'fox',
    name: 'The Cunning Strategist',
    characterName: 'Fiona',
    emoji: '🦊',
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
  },

  retriever: {
    id: 'retriever',
    name: 'The Loyal Learner',
    characterName: 'Goldie',
    emoji: '🐕',
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
  },

  sloth: {
    id: 'sloth',
    name: 'The Passive Income King',
    characterName: 'Stanley',
    emoji: '🦥',
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
  },

  badger: {
    id: 'badger',
    name: 'The Strategic Digger',
    characterName: 'Luke',
    emoji: '🦡',
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
  },

  monkey: {
    id: 'monkey',
    name: 'The Swing Trading Swinger',
    characterName: 'Krzysztof',
    emoji: '🐒',
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
  },

  bull: {
    id: 'bull',
    name: 'The Eternal Optimist',
    characterName: 'Bruno',
    emoji: '🐂',
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
  },

  bear: {
    id: 'bear',
    name: 'The Skeptical Sentinel',
    characterName: 'Bertha',
    emoji: '🐻',
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
  },

  dolphin: {
    id: 'dolphin',
    name: 'The Balanced Navigator',
    characterName: 'Diana',
    emoji: '🐬',
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
  },

  octopus: {
    id: 'octopus',
    name: 'The Multi-Tasking Master',
    characterName: 'Oscar',
    emoji: '🐙',
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
  },

  chameleon: {
    id: 'chameleon',
    name: 'The Event Horizon Hunter',
    characterName: 'Cameron',
    emoji: '🦎',
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
  },

  lion: {
    id: 'lion',
    name: 'The Confident King',
    characterName: 'Leo',
    emoji: '🦁',
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
  },

  tiger: {
    id: 'tiger',
    name: 'The Self-Aware Hunter',
    characterName: 'Tanya',
    emoji: '🐯',
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
  },

  wolf: {
    id: 'wolf',
    name: 'The Patient Predator',
    characterName: 'Wolfgang',
    emoji: '🐺',
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
  },

  kangaroo: {
    id: 'kangaroo',
    name: 'The Volatile Jumper',
    characterName: 'Joey',
    emoji: '🦘',
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
  },

  panda: {
    id: 'panda',
    name: 'The Zen Investor',
    characterName: 'Puffy',
    emoji: '🐼',
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
