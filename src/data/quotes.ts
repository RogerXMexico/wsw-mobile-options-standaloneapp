// Wisdom Quotes for Wall Street Wildlife Mobile
// Displayed throughout the learning experience

export interface WisdomQuote {
  text: string;
  author: string;
  source?: string;
  category: 'trading' | 'wisdom' | 'discipline' | 'risk' | 'patience' | 'psychology';
}

// Course Goals quotes
export const COURSE_QUOTES: WisdomQuote[] = [
  {
    text: "It is better to be lucky. But I would rather be exact. Then when luck comes you are ready.",
    author: "Ernest Hemingway",
    source: "The Old Man and the Sea",
    category: 'discipline',
  },
  {
    text: "A ship in port is safe but that is not what ships are built for.",
    author: "Grace Hopper",
    category: 'wisdom',
  },
  {
    text: "He who would learn to fly one day must first learn to stand and walk and run and climb and dance; one cannot fly into flying.",
    author: "Nietzsche",
    category: 'patience',
  },
];

// Trading wisdom quotes
export const TRADING_QUOTES: WisdomQuote[] = [
  {
    text: "The stock market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett",
    category: 'patience',
  },
  {
    text: "In investing, what is comfortable is rarely profitable.",
    author: "Robert Arnott",
    category: 'trading',
  },
  {
    text: "The market can remain irrational longer than you can remain solvent.",
    author: "John Maynard Keynes",
    category: 'risk',
  },
  {
    text: "Risk comes from not knowing what you're doing.",
    author: "Warren Buffett",
    category: 'risk',
  },
  {
    text: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.",
    author: "George Soros",
    category: 'trading',
  },
  {
    text: "The goal of a successful trader is to make the best trades. Money is secondary.",
    author: "Alexander Elder",
    category: 'psychology',
  },
  {
    text: "Cut your losses short and let your profits run.",
    author: "Trading Proverb",
    category: 'discipline',
  },
  {
    text: "The elements of good trading are: cutting losses, cutting losses, and cutting losses.",
    author: "Ed Seykota",
    category: 'discipline',
  },
];

// Strategy-specific quotes
export const STRATEGY_QUOTES: Record<string, WisdomQuote[]> = {
  'long-call': [
    {
      text: "Bulls make money, bears make money, pigs get slaughtered.",
      author: "Wall Street Proverb",
      category: 'trading',
    },
  ],
  'long-put': [
    {
      text: "In the short run, the market is a voting machine. In the long run, it's a weighing machine.",
      author: "Benjamin Graham",
      category: 'wisdom',
    },
  ],
  'covered-call': [
    {
      text: "The secret to investment success is no secret at all: boring, consistent, diversified strategies work.",
      author: "Morgan Housel",
      category: 'discipline',
    },
  ],
  'iron-condor': [
    {
      text: "Wide diversification is only required when investors do not understand what they are doing.",
      author: "Warren Buffett",
      category: 'wisdom',
    },
  ],
  'long-straddle': [
    {
      text: "The big money is not in the buying or selling, but in the waiting.",
      author: "Charlie Munger",
      category: 'patience',
    },
  ],
};

// Know Thyself module quotes
export const PSYCHOLOGY_QUOTES: WisdomQuote[] = [
  {
    text: "Know thyself.",
    author: "Temple of Apollo at Delphi",
    category: 'psychology',
  },
  {
    text: "The investor's chief problem—and even his worst enemy—is likely to be himself.",
    author: "Benjamin Graham",
    category: 'psychology',
  },
  {
    text: "If you don't know who you are, the stock market is an expensive place to find out.",
    author: "Adam Smith",
    source: "The Money Game",
    category: 'psychology',
  },
  {
    text: "The market is a reflection of collective psychology. Understanding yourself is understanding the market.",
    author: "Trading Wisdom",
    category: 'psychology',
  },
];

// Risk management quotes
export const RISK_QUOTES: WisdomQuote[] = [
  {
    text: "Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1.",
    author: "Warren Buffett",
    category: 'risk',
  },
  {
    text: "The first rule of compounding: Never interrupt it unnecessarily.",
    author: "Charlie Munger",
    category: 'risk',
  },
  {
    text: "Diversification is protection against ignorance. It makes little sense if you know what you're doing.",
    author: "Warren Buffett",
    category: 'risk',
  },
];

// Get a random quote from a category
export const getRandomQuote = (category?: WisdomQuote['category']): WisdomQuote => {
  const allQuotes = [...TRADING_QUOTES, ...PSYCHOLOGY_QUOTES, ...RISK_QUOTES];
  const filtered = category ? allQuotes.filter(q => q.category === category) : allQuotes;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// Get quotes for a specific strategy
export const getQuotesForStrategy = (strategyId: string): WisdomQuote[] => {
  return STRATEGY_QUOTES[strategyId] || [];
};

// Get all course opening quotes
export const getCourseQuotes = (): WisdomQuote[] => {
  return COURSE_QUOTES;
};
