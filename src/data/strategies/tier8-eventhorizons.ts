// Tier 8: Event Horizons - Prediction markets and event-based trading
// 2 strategies

import { Strategy } from '../types';

export const tier8Strategies: Strategy[] = [
  {
    id: 'event-horizons-course',
    name: 'Event Horizons Course',
    tier: 9,
    tierName: 'Event Horizons',
    category: 'educational',
    outlook: 'Educational',
    objective: 'Event Trading',
    risk: 'Knowledge',
    description: 'Master the art of trading around known events: earnings, FDA approvals, elections, and economic releases.',
    isPremium: true,
    hideSimulator: true,
    hidePayoffChart: true,
    education: {
      whatItDoes: 'Comprehensive course on event-based options trading strategies and prediction market analysis.',
      keyLessons: [
        'Events create IV spikes and opportunity',
        'IV crush: Options lose value after event regardless of direction',
        'Expected move: What the market is pricing in',
        'Earnings: IV highest, crush most severe',
        'Binary events: FDA, elections, major announcements',
        'Event calendar: Know what\'s coming before it happens',
      ],
    },
    analogy: 'Event Horizons is like being a storm chaser—you know where the action will be and prepare accordingly.',
    nuance: 'The edge is not predicting the event outcome, but understanding how options are priced around events.',
  },
  {
    id: 'event-horizons',
    name: 'Event Horizons Analysis',
    tier: 9,
    tierName: 'Event Horizons',
    category: 'tools',
    outlook: 'Educational',
    objective: 'Event Analysis',
    risk: 'Knowledge',
    description: 'Interactive tool to analyze upcoming events and their expected impact on options pricing.',
    isPremium: true,
    hideSimulator: true,
    hidePayoffChart: true,
    education: {
      whatItDoes: 'Analyzes upcoming events and helps you plan option strategies around them.',
      keyLessons: [
        'Track earnings dates and expected moves',
        'Monitor IV percentile heading into events',
        'Compare implied vs historical moves',
        'Identify mispriced events',
        'Plan entry and exit around events',
        'Understand term structure around events',
      ],
    },
  },
];
