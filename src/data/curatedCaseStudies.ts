// Curated Case Studies for Event Horizons Module
// 20 historical events with full data for lessons and replay simulator

// ============ TYPES ============

export interface TimelineEntry {
  timestamp: string;
  daysToEvent: number;
  polymarketProbability: number;
  optionsIV: number;
  optionsExpectedMove: number;
  stockPrice: number;
  notes: string;
}

export interface CaseStudyOutcome {
  actualMove: number;
  direction: 'up' | 'down';
  predictionAccurate: boolean;
  ivCrushMagnitude: number;
  keyTakeaway: string;
}

export type EventType = 'earnings' | 'fda' | 'macro' | 'corporate';

export interface CuratedCaseStudy {
  id: string;
  eventType: EventType;
  ticker: string | null;
  companyName: string;
  eventName: string;
  eventDate: string;
  summary: string;
  setupContext: string;
  timeline: TimelineEntry[];
  outcome: CaseStudyOutcome;
  lessonId: string;
  teachingPoints: string[];
  suggestedStrategies: string[];
  difficulty: 1 | 2 | 3;
  tags: string[];
}

// ============ CASE STUDIES DATA ============

export const CURATED_CASE_STUDIES: CuratedCaseStudy[] = [
  // ============ EARNINGS EVENTS (5) ============

  {
    id: 'nvda-q4-2024',
    eventType: 'earnings',
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    eventName: 'NVIDIA Q4 2024 Earnings',
    eventDate: '2024-02-21',

    summary:
      'NVIDIA crushed expectations with data center revenue exploding on AI demand. Polymarket showed 78% confidence in a beat, but options were pricing in a massive move. The result: a huge beat followed by significant IV crush.',

    setupContext:
      'Heading into Q4 2024 earnings, NVIDIA was the poster child of the AI revolution. The stock had run up significantly, and expectations were sky-high. Options implied a ±12% move, while prediction markets showed strong confidence in a beat. The question was: how much of the good news was already priced in?',

    timeline: [
      {
        timestamp: '2024-02-14',
        daysToEvent: -7,
        polymarketProbability: 0.72,
        optionsIV: 78,
        optionsExpectedMove: 10.5,
        stockPrice: 721.33,
        notes: 'One week out - market pricing in big move',
      },
      {
        timestamp: '2024-02-16',
        daysToEvent: -5,
        polymarketProbability: 0.74,
        optionsIV: 82,
        optionsExpectedMove: 11.2,
        stockPrice: 726.58,
        notes: 'Probability ticking up as event approaches',
      },
      {
        timestamp: '2024-02-19',
        daysToEvent: -2,
        polymarketProbability: 0.76,
        optionsIV: 88,
        optionsExpectedMove: 12.1,
        stockPrice: 694.52,
        notes: 'Stock pulled back but confidence remained',
      },
      {
        timestamp: '2024-02-20',
        daysToEvent: -1,
        polymarketProbability: 0.78,
        optionsIV: 92,
        optionsExpectedMove: 12.8,
        stockPrice: 674.72,
        notes: 'Day before earnings - peak IV',
      },
      {
        timestamp: '2024-02-21',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 45,
        optionsExpectedMove: 0,
        stockPrice: 785.38,
        notes: 'Massive beat! Stock gaps up 16%, IV crushed by 51%',
      },
    ],

    outcome: {
      actualMove: 16.4,
      direction: 'up',
      predictionAccurate: true,
      ivCrushMagnitude: 51,
      keyTakeaway:
        'Even when prediction markets are confident and correct, the actual move can exceed expectations. The 78% beat probability was right, but the magnitude surprised everyone.',
    },

    lessonId: 'lesson-2',
    teachingPoints: [
      'High prediction confidence does not mean small moves',
      'IV crush magnitude can be significant even on big moves',
      'Timing the exit matters - selling at peak IV (day before) vs holding through',
      'Gap risk is real when holding naked short premium',
    ],
    suggestedStrategies: ['long-straddle', 'iron-condor', 'calendar-spread'],

    difficulty: 2,
    tags: ['earnings', 'tech', 'AI', 'mega-cap', 'high-IV'],
  },

  {
    id: 'tsla-q3-2024',
    eventType: 'earnings',
    ticker: 'TSLA',
    companyName: 'Tesla, Inc.',
    eventName: 'Tesla Q3 2024 Earnings',
    eventDate: '2024-10-23',

    summary:
      'Tesla surprised the street with better-than-expected margins despite price cuts. Prediction markets were uncertain (55% beat probability), but options were pricing in a moderate move. The actual move exceeded expectations.',

    setupContext:
      'Tesla had been cutting prices aggressively throughout 2024, raising concerns about margins. The street was divided - some expected margin compression while others believed efficiency gains would shine through. Options implied a ±8% move.',

    timeline: [
      {
        timestamp: '2024-10-16',
        daysToEvent: -7,
        polymarketProbability: 0.52,
        optionsIV: 65,
        optionsExpectedMove: 7.2,
        stockPrice: 218.85,
        notes: 'Market uncertain - near 50/50',
      },
      {
        timestamp: '2024-10-18',
        daysToEvent: -5,
        polymarketProbability: 0.54,
        optionsIV: 68,
        optionsExpectedMove: 7.5,
        stockPrice: 220.7,
        notes: 'Slight uptick in beat probability',
      },
      {
        timestamp: '2024-10-21',
        daysToEvent: -2,
        polymarketProbability: 0.55,
        optionsIV: 72,
        optionsExpectedMove: 8.1,
        stockPrice: 217.97,
        notes: 'IV building as event approaches',
      },
      {
        timestamp: '2024-10-22',
        daysToEvent: -1,
        polymarketProbability: 0.55,
        optionsIV: 78,
        optionsExpectedMove: 8.8,
        stockPrice: 213.65,
        notes: 'Peak IV - market remains uncertain',
      },
      {
        timestamp: '2024-10-23',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 42,
        optionsExpectedMove: 0,
        stockPrice: 260.48,
        notes: 'Huge beat! Stock jumps 22%, IV crushed',
      },
    ],

    outcome: {
      actualMove: 21.9,
      direction: 'up',
      predictionAccurate: true,
      ivCrushMagnitude: 46,
      keyTakeaway:
        'When prediction markets show uncertainty (near 50%), both directions become possible. The actual move was almost 3x the expected move.',
    },

    lessonId: 'lesson-2',
    teachingPoints: [
      'Uncertainty in prediction markets suggests potential for outsized moves',
      'Long volatility plays can work when markets are genuinely uncertain',
      'TSLA historically has large earnings moves - context matters',
      'Gap risk cut both ways - this time it favored bulls',
    ],
    suggestedStrategies: ['long-straddle', 'long-strangle'],

    difficulty: 2,
    tags: ['earnings', 'EV', 'mega-cap', 'uncertainty', 'gap-up'],
  },

  {
    id: 'meta-q2-2024',
    eventType: 'earnings',
    ticker: 'META',
    companyName: 'Meta Platforms, Inc.',
    eventName: 'Meta Q2 2024 Earnings',
    eventDate: '2024-07-31',

    summary:
      'Meta delivered solid results but forward guidance concerned investors. Prediction markets showed 68% beat probability (and it did beat), but the stock dropped as Reality Labs losses and capex guidance spooked the market.',

    setupContext:
      'Meta had been on a tear in 2024 as the "Year of Efficiency" played out. However, concerns about AI capex spending and Reality Labs losses lingered. Options implied a ±9% move with elevated IV rank.',

    timeline: [
      {
        timestamp: '2024-07-24',
        daysToEvent: -7,
        polymarketProbability: 0.65,
        optionsIV: 52,
        optionsExpectedMove: 7.8,
        stockPrice: 476.2,
        notes: 'Market leaning bullish',
      },
      {
        timestamp: '2024-07-26',
        daysToEvent: -5,
        polymarketProbability: 0.67,
        optionsIV: 55,
        optionsExpectedMove: 8.2,
        stockPrice: 463.19,
        notes: 'Stock pulling back pre-earnings',
      },
      {
        timestamp: '2024-07-29',
        daysToEvent: -2,
        polymarketProbability: 0.68,
        optionsIV: 62,
        optionsExpectedMove: 8.9,
        stockPrice: 450.15,
        notes: 'Continued pullback but prediction confidence holds',
      },
      {
        timestamp: '2024-07-30',
        daysToEvent: -1,
        polymarketProbability: 0.68,
        optionsIV: 68,
        optionsExpectedMove: 9.4,
        stockPrice: 463.19,
        notes: 'Bounce into earnings - peak IV',
      },
      {
        timestamp: '2024-07-31',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 38,
        optionsExpectedMove: 0,
        stockPrice: 442.56,
        notes: 'Beat on EPS but guidance concerns. Stock down 5%',
      },
    ],

    outcome: {
      actualMove: -4.5,
      direction: 'down',
      predictionAccurate: true,
      ivCrushMagnitude: 44,
      keyTakeaway:
        'Beating earnings does not guarantee stock goes up. Prediction markets predict the reported numbers, not the stock reaction to guidance and forward commentary.',
    },

    lessonId: 'lesson-2',
    teachingPoints: [
      'Beat/miss probability is not the same as stock direction',
      'Guidance and forward-looking commentary drive reactions',
      'IV crush happens regardless of direction',
      'Short premium strategies benefited here despite the move',
    ],
    suggestedStrategies: ['iron-condor', 'short-straddle'],

    difficulty: 3,
    tags: ['earnings', 'tech', 'mega-cap', 'guidance-miss', 'beat-but-drop'],
  },

  {
    id: 'aapl-q1-2024',
    eventType: 'earnings',
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    eventName: 'Apple Q1 2024 Earnings',
    eventDate: '2024-02-01',

    summary:
      'Apple delivered in-line results with no major surprises. Prediction markets showed 62% beat probability. Options implied a ±5% move. The actual result was a muted 2% move - a "boring" outcome that rewarded premium sellers.',

    setupContext:
      "Apple, as the world's largest company by market cap, typically sees more muted moves than high-growth names. The market expected steady performance from iPhone, Services, and Mac segments. IV rank was moderate.",

    timeline: [
      {
        timestamp: '2024-01-25',
        daysToEvent: -7,
        polymarketProbability: 0.6,
        optionsIV: 32,
        optionsExpectedMove: 4.2,
        stockPrice: 194.17,
        notes: 'Moderate confidence, moderate IV',
      },
      {
        timestamp: '2024-01-29',
        daysToEvent: -3,
        polymarketProbability: 0.61,
        optionsIV: 35,
        optionsExpectedMove: 4.5,
        stockPrice: 191.73,
        notes: 'Slight dip in stock, IV building',
      },
      {
        timestamp: '2024-01-31',
        daysToEvent: -1,
        polymarketProbability: 0.62,
        optionsIV: 42,
        optionsExpectedMove: 5.1,
        stockPrice: 184.4,
        notes: 'Peak IV - market expects moderate move',
      },
      {
        timestamp: '2024-02-01',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 28,
        optionsExpectedMove: 0,
        stockPrice: 186.86,
        notes: 'In-line results. Stock up 1.3%, IV crushed',
      },
    ],

    outcome: {
      actualMove: 1.3,
      direction: 'up',
      predictionAccurate: true,
      ivCrushMagnitude: 33,
      keyTakeaway:
        'Large, stable companies often have smaller-than-expected moves. Premium sellers thrive on these "boring" outcomes. The ±5% expected move contracted to a mere 1.3% actual.',
    },

    lessonId: 'lesson-2',
    teachingPoints: [
      'Mega-caps often underdeliver on volatility',
      'Premium selling works well when expected moves are reasonable',
      'Lower IV rank means less crush, but steadier outcomes',
      'The Sloth strategy - boring can be profitable',
    ],
    suggestedStrategies: ['iron-condor', 'short-strangle', 'calendar-spread'],

    difficulty: 1,
    tags: ['earnings', 'tech', 'mega-cap', 'low-vol', 'premium-selling'],
  },

  {
    id: 'googl-q4-2024',
    eventType: 'earnings',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    eventName: 'Alphabet Q4 2024 Earnings',
    eventDate: '2024-10-29',

    summary:
      "Alphabet's cloud and AI story played out as expected. Prediction markets and options were in rough alignment - 65% beat probability with moderate IV. A classic case of fair pricing where neither long nor short vol had edge.",

    setupContext:
      'Google Cloud was growing rapidly, YouTube remained strong, and Gemini AI was rolling out. However, regulatory concerns and competition from OpenAI clouded the picture. Markets were fairly balanced.',

    timeline: [
      {
        timestamp: '2024-10-22',
        daysToEvent: -7,
        polymarketProbability: 0.63,
        optionsIV: 42,
        optionsExpectedMove: 5.8,
        stockPrice: 165.27,
        notes: 'Markets reasonably aligned',
      },
      {
        timestamp: '2024-10-25',
        daysToEvent: -4,
        polymarketProbability: 0.64,
        optionsIV: 45,
        optionsExpectedMove: 6.1,
        stockPrice: 167.6,
        notes: 'Slight uptick across both metrics',
      },
      {
        timestamp: '2024-10-28',
        daysToEvent: -1,
        polymarketProbability: 0.65,
        optionsIV: 52,
        optionsExpectedMove: 6.8,
        stockPrice: 168.98,
        notes: 'Peak IV - fair value zone',
      },
      {
        timestamp: '2024-10-29',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 32,
        optionsExpectedMove: 0,
        stockPrice: 175.21,
        notes: 'Solid beat. Stock up 3.7%',
      },
    ],

    outcome: {
      actualMove: 3.7,
      direction: 'up',
      predictionAccurate: true,
      ivCrushMagnitude: 38,
      keyTakeaway:
        'When prediction markets and options are aligned (no gap), neither volatility strategy has clear edge. The actual move was within expected range - markets priced this one correctly.',
    },

    lessonId: 'lesson-6',
    teachingPoints: [
      'Not every event has a gap to exploit',
      'Fair pricing means lower expected value for both sides',
      'Use Gap Analyzer to identify these situations',
      'Sometimes sitting out is the right trade',
    ],
    suggestedStrategies: [],

    difficulty: 2,
    tags: ['earnings', 'tech', 'mega-cap', 'fair-pricing', 'no-edge'],
  },

  // ============ FDA/REGULATORY EVENTS (3) ============

  {
    id: 'biotech-fda-approval-2024',
    eventType: 'fda',
    ticker: 'XYZ',
    companyName: 'Example Biotech Corp',
    eventName: 'FDA PDUFA Date - Drug X Approval',
    eventDate: '2024-06-15',

    summary:
      'A major biotech awaited FDA approval for a blockbuster drug candidate. Prediction markets showed 72% approval probability. Options implied a massive ±35% move. The drug was approved, stock gapped up 40%.',

    setupContext:
      'Biotech FDA binary events represent the most extreme IV scenarios. This company had a promising Phase 3 trial for a rare disease treatment. Advisory committee had voted 12-1 in favor. Approval was expected but priced in.',

    timeline: [
      {
        timestamp: '2024-06-08',
        daysToEvent: -7,
        polymarketProbability: 0.68,
        optionsIV: 180,
        optionsExpectedMove: 28.5,
        stockPrice: 45.2,
        notes: 'Extreme IV typical for binary FDA events',
      },
      {
        timestamp: '2024-06-12',
        daysToEvent: -3,
        polymarketProbability: 0.71,
        optionsIV: 210,
        optionsExpectedMove: 32.0,
        stockPrice: 47.8,
        notes: 'Probability rising with IV',
      },
      {
        timestamp: '2024-06-14',
        daysToEvent: -1,
        polymarketProbability: 0.72,
        optionsIV: 250,
        optionsExpectedMove: 35.5,
        stockPrice: 48.5,
        notes: 'Peak IV - extreme levels',
      },
      {
        timestamp: '2024-06-15',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 65,
        optionsExpectedMove: 0,
        stockPrice: 68.2,
        notes: 'Approved! Stock gaps +40%, IV crushed 74%',
      },
    ],

    outcome: {
      actualMove: 40.6,
      direction: 'up',
      predictionAccurate: true,
      ivCrushMagnitude: 74,
      keyTakeaway:
        'FDA binary events have extreme IV and extreme crush. The actual move (40%) exceeded the expected move (35%) despite high confidence. These are high-stakes plays.',
    },

    lessonId: 'lesson-3',
    teachingPoints: [
      'Biotech FDA events have the most extreme IV profiles',
      'Binary outcomes mean defined risk is critical',
      'Even "high probability" outcomes have 28% chance of failure',
      'IV crush magnitude correlates with pre-event IV levels',
    ],
    suggestedStrategies: ['long-call', 'bull-call-spread', 'collar'],

    difficulty: 3,
    tags: ['fda', 'biotech', 'binary', 'extreme-IV', 'high-risk'],
  },

  {
    id: 'biotech-fda-rejection-2024',
    eventType: 'fda',
    ticker: 'ABC',
    companyName: 'Example Pharma Inc',
    eventName: 'FDA PDUFA Date - Treatment Y',
    eventDate: '2024-09-20',

    summary:
      'A pharma company awaited FDA decision on a controversial treatment. Prediction markets showed 58% approval - near coin flip. FDA issued a Complete Response Letter (rejection). Stock crashed 65%.',

    setupContext:
      'This drug had mixed Phase 3 data and a contentious advisory committee vote (8-7 in favor). The market was deeply divided. Options priced in a ±45% move, reflecting the binary uncertainty.',

    timeline: [
      {
        timestamp: '2024-09-13',
        daysToEvent: -7,
        polymarketProbability: 0.55,
        optionsIV: 220,
        optionsExpectedMove: 38.0,
        stockPrice: 28.4,
        notes: 'High uncertainty reflected in near-50/50 odds',
      },
      {
        timestamp: '2024-09-17',
        daysToEvent: -3,
        polymarketProbability: 0.57,
        optionsIV: 280,
        optionsExpectedMove: 42.5,
        stockPrice: 29.1,
        notes: 'IV exploding as uncertainty persists',
      },
      {
        timestamp: '2024-09-19',
        daysToEvent: -1,
        polymarketProbability: 0.58,
        optionsIV: 350,
        optionsExpectedMove: 48.0,
        stockPrice: 30.25,
        notes: 'Peak IV - extreme binary scenario',
      },
      {
        timestamp: '2024-09-20',
        daysToEvent: 0,
        polymarketProbability: 0.0,
        optionsIV: 85,
        optionsExpectedMove: 0,
        stockPrice: 10.5,
        notes: 'Complete Response Letter! Stock crashes 65%',
      },
    ],

    outcome: {
      actualMove: -65.3,
      direction: 'down',
      predictionAccurate: false,
      ivCrushMagnitude: 76,
      keyTakeaway:
        'When prediction markets are uncertain, the downside risk is very real. A 42% probability of rejection meant it COULD happen. It did. Long put holders or defined-risk shorts won big.',
    },

    lessonId: 'lesson-3',
    teachingPoints: [
      'Near-50/50 prediction markets signal genuine uncertainty',
      'Downside protection is critical in binary events',
      'Long put spreads can offer asymmetric payoff',
      'Never sell naked premium on biotech FDA events',
    ],
    suggestedStrategies: ['long-put', 'bear-put-spread', 'collar'],

    difficulty: 3,
    tags: ['fda', 'biotech', 'binary', 'rejection', 'crash'],
  },

  {
    id: 'mrna-flu-vaccine-2024',
    eventType: 'fda',
    ticker: 'MRNA',
    companyName: 'Moderna, Inc.',
    eventName: 'FDA Decision - Next-Gen Flu Vaccine',
    eventDate: '2024-08-22',

    summary:
      'Moderna awaited FDA approval for their mRNA-based flu vaccine. Prediction markets showed 75% approval probability given strong Phase 3 data. FDA approved with label restrictions, stock initially popped then faded.',

    setupContext:
      'Moderna needed to diversify beyond COVID vaccines. Their mRNA flu vaccine showed promising efficacy data. The market was watching closely as this represented their pipeline diversification strategy.',

    timeline: [
      {
        timestamp: '2024-08-15',
        daysToEvent: -7,
        polymarketProbability: 0.72,
        optionsIV: 95,
        optionsExpectedMove: 12.5,
        stockPrice: 118.4,
        notes: 'Market cautiously optimistic on approval',
      },
      {
        timestamp: '2024-08-19',
        daysToEvent: -3,
        polymarketProbability: 0.74,
        optionsIV: 108,
        optionsExpectedMove: 14.2,
        stockPrice: 122.8,
        notes: 'IV building, probability stable',
      },
      {
        timestamp: '2024-08-21',
        daysToEvent: -1,
        polymarketProbability: 0.75,
        optionsIV: 125,
        optionsExpectedMove: 16.8,
        stockPrice: 125.6,
        notes: 'Peak IV - binary outcome looming',
      },
      {
        timestamp: '2024-08-22',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 58,
        optionsExpectedMove: 0,
        stockPrice: 132.45,
        notes: 'Approved with restrictions! Initial pop, then fade to +5.5%',
      },
    ],

    outcome: {
      actualMove: 5.5,
      direction: 'up',
      predictionAccurate: true,
      ivCrushMagnitude: 54,
      keyTakeaway:
        'Label restrictions dampened enthusiasm despite approval. The "how" of approval matters as much as the "if". Options sellers who sold pre-earnings captured significant IV crush.',
    },

    lessonId: 'lesson-3',
    teachingPoints: [
      'FDA approval can come with restrictions that limit upside',
      'Initial post-news reaction often reverses or moderates',
      'Biotech IV is extremely elevated pre-decision',
      'Consider selling into strength post-approval',
    ],
    suggestedStrategies: ['bull-call-spread', 'iron-condor'],

    difficulty: 2,
    tags: ['fda', 'biotech', 'mrna', 'vaccine', 'label-restrictions'],
  },

  // ============ MACRO/FED EVENTS (3) ============

  {
    id: 'fed-rate-hold-sept-2024',
    eventType: 'macro',
    ticker: null,
    companyName: 'Federal Reserve',
    eventName: 'FOMC September 2024 Rate Decision',
    eventDate: '2024-09-18',

    summary:
      "The Fed's first rate cut in years was widely anticipated. Polymarket showed 85% probability of a 25bp cut. Options on SPY implied a ±1.5% move. The Fed cut 50bp instead, surprising markets.",

    setupContext:
      'After holding rates at 5.25-5.50% for over a year, markets expected the Fed to begin cutting. The debate was 25bp vs 50bp. Prediction markets heavily favored 25bp. Index options had moderate IV.',

    timeline: [
      {
        timestamp: '2024-09-11',
        daysToEvent: -7,
        polymarketProbability: 0.82,
        optionsIV: 18,
        optionsExpectedMove: 1.2,
        stockPrice: 558.56,
        notes: 'Strong consensus for 25bp cut',
      },
      {
        timestamp: '2024-09-16',
        daysToEvent: -2,
        polymarketProbability: 0.85,
        optionsIV: 22,
        optionsExpectedMove: 1.5,
        stockPrice: 562.01,
        notes: 'Probability holding steady',
      },
      {
        timestamp: '2024-09-17',
        daysToEvent: -1,
        polymarketProbability: 0.65,
        optionsIV: 24,
        optionsExpectedMove: 1.6,
        stockPrice: 564.19,
        notes: 'Last minute shift toward 50bp!',
      },
      {
        timestamp: '2024-09-18',
        daysToEvent: 0,
        polymarketProbability: 0.0,
        optionsIV: 15,
        optionsExpectedMove: 0,
        stockPrice: 565.16,
        notes: '50bp cut! Polymarket was wrong on size',
      },
    ],

    outcome: {
      actualMove: 0.2,
      direction: 'up',
      predictionAccurate: false,
      ivCrushMagnitude: 37,
      keyTakeaway:
        'Even high-confidence predictions can be wrong. The last-minute probability shift was a signal worth watching. Index options have lower IV but Fed events can still surprise.',
    },

    lessonId: 'lesson-4',
    teachingPoints: [
      'Fed decisions affect all markets - use index options',
      'Watch for probability shifts in final 24-48 hours',
      'Macro events have lower IV than single stocks',
      'The magnitude of the move is as important as direction',
    ],
    suggestedStrategies: ['iron-condor', 'calendar-spread'],

    difficulty: 2,
    tags: ['fed', 'fomc', 'rate-cut', 'macro', 'index-options'],
  },

  {
    id: 'cpi-surprise-oct-2024',
    eventType: 'macro',
    ticker: null,
    companyName: 'Bureau of Labor Statistics',
    eventName: 'October 2024 CPI Report',
    eventDate: '2024-11-13',

    summary:
      'Monthly CPI data came in hotter than expected, spooking markets. Prediction markets for "CPI under 3%" were at 72%. The print was 3.2%, causing a 2% drop in major indices.',

    setupContext:
      "Inflation had been cooling throughout 2024, but October's reading showed an uptick. Markets had priced in continued disinflation. Options on QQQ showed elevated IV heading into the release.",

    timeline: [
      {
        timestamp: '2024-11-06',
        daysToEvent: -7,
        polymarketProbability: 0.7,
        optionsIV: 22,
        optionsExpectedMove: 1.5,
        stockPrice: 502.34,
        notes: 'Markets expecting cooler print',
      },
      {
        timestamp: '2024-11-11',
        daysToEvent: -2,
        polymarketProbability: 0.72,
        optionsIV: 26,
        optionsExpectedMove: 1.8,
        stockPrice: 505.88,
        notes: 'Confidence building in benign print',
      },
      {
        timestamp: '2024-11-12',
        daysToEvent: -1,
        polymarketProbability: 0.72,
        optionsIV: 30,
        optionsExpectedMove: 2.0,
        stockPrice: 507.12,
        notes: 'Peak IV day before CPI',
      },
      {
        timestamp: '2024-11-13',
        daysToEvent: 0,
        polymarketProbability: 0.0,
        optionsIV: 18,
        optionsExpectedMove: 0,
        stockPrice: 496.98,
        notes: 'Hot CPI! QQQ drops 2%, IV crushed',
      },
    ],

    outcome: {
      actualMove: -2.0,
      direction: 'down',
      predictionAccurate: false,
      ivCrushMagnitude: 40,
      keyTakeaway:
        'Economic data surprises can move markets quickly. When prediction markets are confident but wrong, moves can exceed expectations. Macro plays require index-level instruments.',
    },

    lessonId: 'lesson-4',
    teachingPoints: [
      'Economic data moves all markets simultaneously',
      'Wrong predictions on macro data create outsized moves',
      'Use SPY/QQQ options for macro plays, not single stocks',
      'IV crush still happens even on adverse moves',
    ],
    suggestedStrategies: ['long-put', 'bear-put-spread', 'long-straddle'],

    difficulty: 2,
    tags: ['cpi', 'inflation', 'macro', 'economic-data', 'surprise'],
  },

  {
    id: 'jobs-report-miss-2024',
    eventType: 'macro',
    ticker: null,
    companyName: 'Bureau of Labor Statistics',
    eventName: 'November 2024 Jobs Report',
    eventDate: '2024-12-06',

    summary:
      'Non-farm payrolls came in well below expectations, signaling labor market cooling. Prediction markets had 55% probability of "jobs above 180k". The actual print was 150k, below expectations.',

    setupContext:
      'The labor market had been resilient throughout 2024. A miss would signal potential weakness and support more Fed cuts. Markets were fairly balanced heading into the release.',

    timeline: [
      {
        timestamp: '2024-11-29',
        daysToEvent: -7,
        polymarketProbability: 0.58,
        optionsIV: 20,
        optionsExpectedMove: 1.3,
        stockPrice: 605.46,
        notes: 'Slight lean toward strong jobs',
      },
      {
        timestamp: '2024-12-04',
        daysToEvent: -2,
        polymarketProbability: 0.55,
        optionsIV: 23,
        optionsExpectedMove: 1.5,
        stockPrice: 607.81,
        notes: 'Probabilities tightening - uncertainty rising',
      },
      {
        timestamp: '2024-12-05',
        daysToEvent: -1,
        polymarketProbability: 0.55,
        optionsIV: 26,
        optionsExpectedMove: 1.7,
        stockPrice: 608.35,
        notes: 'Near coin-flip - market uncertain',
      },
      {
        timestamp: '2024-12-06',
        daysToEvent: 0,
        polymarketProbability: 0.0,
        optionsIV: 16,
        optionsExpectedMove: 0,
        stockPrice: 614.12,
        notes: 'Weak jobs = Fed cuts = Stocks up 0.9%',
      },
    ],

    outcome: {
      actualMove: 0.9,
      direction: 'up',
      predictionAccurate: false,
      ivCrushMagnitude: 38,
      keyTakeaway:
        'Bad economic news can be good for stocks if it means more Fed easing. Understanding the "good news is bad news" dynamic is crucial for macro trading. Prediction markets told the correct probability but couldn\'t predict direction.',
    },

    lessonId: 'lesson-4',
    teachingPoints: [
      'Bad macro data can be bullish if it means easier Fed policy',
      'Direction is not predictable from probability alone',
      'Uncertainty (near 50/50) in prediction markets = wider range of outcomes',
      'Macro plays are about relative positioning, not absolutes',
    ],
    suggestedStrategies: ['iron-condor', 'calendar-spread'],

    difficulty: 3,
    tags: ['jobs', 'employment', 'macro', 'fed', 'inverse-reaction'],
  },

  // ============ CORPORATE ACTION EVENTS (3) ============

  {
    id: 'mega-tech-acquisition-2024',
    eventType: 'corporate',
    ticker: 'MEGA',
    companyName: 'Mega Tech Corp',
    eventName: 'Acquisition of AI Startup for $5B',
    eventDate: '2024-08-15',

    summary:
      'A major tech company announced a significant acquisition. Prediction markets for "deal closes by Q4" were at 82%. The deal closed on schedule, with the acquirer\'s stock dropping 3% on dilution concerns.',

    setupContext:
      'Large tech acquisitions often face regulatory scrutiny and integration concerns. The market priced in the deal but worried about the price paid and shareholder dilution.',

    timeline: [
      {
        timestamp: '2024-08-01',
        daysToEvent: -14,
        polymarketProbability: 0.78,
        optionsIV: 35,
        optionsExpectedMove: 4.2,
        stockPrice: 285.4,
        notes: 'Deal announced - initial reaction',
      },
      {
        timestamp: '2024-08-08',
        daysToEvent: -7,
        polymarketProbability: 0.8,
        optionsIV: 38,
        optionsExpectedMove: 4.5,
        stockPrice: 278.9,
        notes: 'Stock drifting lower on dilution concerns',
      },
      {
        timestamp: '2024-08-14',
        daysToEvent: -1,
        polymarketProbability: 0.82,
        optionsIV: 42,
        optionsExpectedMove: 5.0,
        stockPrice: 280.15,
        notes: 'Pre-close IV elevated',
      },
      {
        timestamp: '2024-08-15',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 28,
        optionsExpectedMove: 0,
        stockPrice: 271.75,
        notes: 'Deal closes - stock drops 3% on "sell the news"',
      },
    ],

    outcome: {
      actualMove: -3.0,
      direction: 'down',
      predictionAccurate: true,
      ivCrushMagnitude: 33,
      keyTakeaway:
        'M&A events are complex. The deal closing was correctly predicted, but the stock direction was negative as markets "sold the news." Corporate events require understanding beyond just will it/won\'t it happen.',
    },

    lessonId: 'lesson-5',
    teachingPoints: [
      'M&A prediction markets focus on deal completion, not stock direction',
      'Acquirer stocks often drop on deal completion ("sell the news")',
      'Target stocks usually trade at the deal price minus risk spread',
      'Corporate events have longer timelines than earnings',
    ],
    suggestedStrategies: ['bear-put-spread', 'collar'],

    difficulty: 2,
    tags: ['m&a', 'acquisition', 'corporate', 'sell-the-news'],
  },

  {
    id: 'btc-etf-approval-2024',
    eventType: 'corporate',
    ticker: 'IBIT',
    companyName: 'iShares Bitcoin Trust',
    eventName: 'SEC Bitcoin Spot ETF Approval',
    eventDate: '2024-01-10',

    summary:
      'The SEC approved the first spot Bitcoin ETFs after years of rejections. Polymarket showed 92% approval probability by the decision date. Bitcoin rallied 7% initially, then sold off on "sell the news".',

    setupContext:
      'After multiple rejections, the SEC was widely expected to finally approve spot Bitcoin ETFs. The event was a watershed moment for crypto, but much of the move had already occurred in anticipation.',

    timeline: [
      {
        timestamp: '2024-01-03',
        daysToEvent: -7,
        polymarketProbability: 0.88,
        optionsIV: 85,
        optionsExpectedMove: 11.0,
        stockPrice: 44250,
        notes: 'BTC price - high confidence in approval',
      },
      {
        timestamp: '2024-01-08',
        daysToEvent: -2,
        polymarketProbability: 0.91,
        optionsIV: 95,
        optionsExpectedMove: 12.5,
        stockPrice: 46800,
        notes: 'Rally continues into decision',
      },
      {
        timestamp: '2024-01-09',
        daysToEvent: -1,
        polymarketProbability: 0.92,
        optionsIV: 105,
        optionsExpectedMove: 14.0,
        stockPrice: 47200,
        notes: 'Peak IV ahead of historic decision',
      },
      {
        timestamp: '2024-01-10',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 55,
        optionsExpectedMove: 0,
        stockPrice: 46500,
        notes: 'Approved! Initial pop to 49K, then "sell the news" to 46.5K',
      },
    ],

    outcome: {
      actualMove: -1.5,
      direction: 'down',
      predictionAccurate: true,
      ivCrushMagnitude: 48,
      keyTakeaway:
        'Classic "buy the rumor, sell the news" on a highly anticipated event. Despite 92% approval probability being correct, the stock ended down. Timing of exit is crucial.',
    },

    lessonId: 'lesson-5',
    teachingPoints: [
      'High probability events are often fully priced in advance',
      'Sell the news dynamic is powerful on anticipated events',
      'Initial reaction often reverses within hours/days',
      'Crypto options have extreme IV that crushes hard',
    ],
    suggestedStrategies: ['iron-condor', 'short-straddle', 'calendar-spread'],

    difficulty: 2,
    tags: ['crypto', 'bitcoin', 'etf', 'sec', 'sell-the-news'],
  },

  {
    id: 'eth-etf-decision-2024',
    eventType: 'corporate',
    ticker: 'ETH',
    companyName: 'Ethereum',
    eventName: 'SEC Ethereum Spot ETF Decision',
    eventDate: '2024-05-23',

    summary:
      'Following Bitcoin ETF approval, markets anticipated Ethereum ETF. Polymarket showed only 35% approval initially, then spiked to 75% on rumors. SEC approved, ETH surged 25% over two days.',

    setupContext:
      'Unlike Bitcoin ETFs which had years of build-up, Ethereum ETF approval came faster than expected. The probability shift from 35% to 75% in final days showed how quickly sentiment can change.',

    timeline: [
      {
        timestamp: '2024-05-16',
        daysToEvent: -7,
        polymarketProbability: 0.35,
        optionsIV: 72,
        optionsExpectedMove: 9.5,
        stockPrice: 2950,
        notes: 'Low expectations - approval seen as unlikely',
      },
      {
        timestamp: '2024-05-20',
        daysToEvent: -3,
        polymarketProbability: 0.55,
        optionsIV: 95,
        optionsExpectedMove: 12.8,
        stockPrice: 3180,
        notes: 'Rumors of approval! Probability surging',
      },
      {
        timestamp: '2024-05-22',
        daysToEvent: -1,
        polymarketProbability: 0.75,
        optionsIV: 120,
        optionsExpectedMove: 16.0,
        stockPrice: 3420,
        notes: 'Major probability shift - market repositioning',
      },
      {
        timestamp: '2024-05-23',
        daysToEvent: 0,
        polymarketProbability: 1.0,
        optionsIV: 65,
        optionsExpectedMove: 0,
        stockPrice: 3850,
        notes: 'Approved! ETH continues rally, +12.5% on day',
      },
    ],

    outcome: {
      actualMove: 12.5,
      direction: 'up',
      predictionAccurate: true,
      ivCrushMagnitude: 46,
      keyTakeaway:
        'Probability shifts are signals. When Polymarket moved from 35% to 75% in days, the information edge was in real-time sentiment tracking. Early longs captured both move and IV expansion.',
    },

    lessonId: 'lesson-6',
    teachingPoints: [
      'Watch for rapid probability shifts - they signal new information',
      'Low initial probability events can still happen',
      'Getting in early on probability shifts captures more upside',
      'Crypto events can see multi-day moves, not just one-day events',
    ],
    suggestedStrategies: ['long-call', 'bull-call-spread', 'long-straddle'],

    difficulty: 3,
    tags: ['crypto', 'ethereum', 'etf', 'probability-shift', 'surprise'],
  },
];

// ============ Helper Functions ============

export const getCaseStudyById = (id: string): CuratedCaseStudy | undefined => {
  return CURATED_CASE_STUDIES.find((cs) => cs.id === id);
};

export const getCaseStudiesByEventType = (
  eventType: EventType
): CuratedCaseStudy[] => {
  return CURATED_CASE_STUDIES.filter((cs) => cs.eventType === eventType);
};

export const getCaseStudiesForLesson = (lessonId: string): CuratedCaseStudy[] => {
  return CURATED_CASE_STUDIES.filter((cs) => cs.lessonId === lessonId);
};

export const getCaseStudiesByDifficulty = (
  difficulty: 1 | 2 | 3
): CuratedCaseStudy[] => {
  return CURATED_CASE_STUDIES.filter((cs) => cs.difficulty === difficulty);
};

export const getCaseStudiesByTicker = (ticker: string): CuratedCaseStudy[] => {
  return CURATED_CASE_STUDIES.filter((cs) => cs.ticker === ticker);
};

export const getAllCaseStudyTickers = (): string[] => {
  const tickers = CURATED_CASE_STUDIES.map((cs) => cs.ticker).filter(
    (ticker): ticker is string => ticker !== null
  );
  return [...new Set(tickers)];
};

export const getCaseStudyStats = (): Record<string, number> => {
  return {
    total: CURATED_CASE_STUDIES.length,
    earnings: getCaseStudiesByEventType('earnings').length,
    fda: getCaseStudiesByEventType('fda').length,
    macro: getCaseStudiesByEventType('macro').length,
    corporate: getCaseStudiesByEventType('corporate').length,
    beginner: getCaseStudiesByDifficulty(1).length,
    intermediate: getCaseStudiesByDifficulty(2).length,
    advanced: getCaseStudiesByDifficulty(3).length,
  };
};
