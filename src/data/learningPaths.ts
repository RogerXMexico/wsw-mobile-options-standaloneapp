// Learning Paths for Wall Street Wildlife Mobile
// Defines recommended study sequences for different experience levels

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startTier: number;
  tierSequence: number[];
  estimatedTime: string;
  color: string;
  icon: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'beginner',
    title: 'Complete Beginner',
    subtitle: 'Never traded options before',
    description: 'Start from the absolute basics. Learn what options are, how they work, and execute your first trade with confidence.',
    startTier: 0,
    tierSequence: [0, 1, 2, 3],
    estimatedTime: '2-3 weeks',
    color: '#22c55e', // emerald
    icon: 'book-outline',
  },
  {
    id: 'express-lane',
    title: 'Express Lane',
    subtitle: '30-minute crash course',
    description: 'Get the essentials fast. A condensed overview of key concepts to get you trading quickly. Perfect for experienced investors new to options.',
    startTier: 0.5,
    tierSequence: [0.5],
    estimatedTime: '30-60 minutes',
    color: '#eab308', // yellow
    icon: 'flash-outline',
  },
  {
    id: 'some-experience',
    title: 'Some Experience',
    subtitle: 'Bought/sold a few options',
    description: 'You know the basics but want to go deeper. Learn proper strategy selection, risk management, and how to manage positions.',
    startTier: 1,
    tierSequence: [1, 2, 3, 4],
    estimatedTime: '1-2 weeks',
    color: '#f59e0b', // amber
    icon: 'pulse-outline',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Comfortable with spreads',
    description: 'Master advanced strategies. Dive into volatility plays, ratio spreads, earnings trades, and exotic structures.',
    startTier: 4,
    tierSequence: [4, 5, 6],
    estimatedTime: '3-4 weeks',
    color: '#8b5cf6', // violet
    icon: 'trophy-outline',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'Expert in complex strategies',
    description: 'Master the most sophisticated approaches. Deep dive into advanced volatility modeling, portfolio optimization, and professional-grade tactics.',
    startTier: 7,
    tierSequence: [7, 8, 9, 10],
    estimatedTime: '4-6 weeks',
    color: '#ef4444', // red
    icon: 'ribbon-outline',
  },
];
