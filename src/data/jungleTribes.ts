// Jungle Trading Academy - Tribes
// Community groups for social competition

export interface JungleTribe {
  id: string;
  name: string;
  leader: string;
  leaderEmoji: string;
  description: string;
  motto: string;
  memberCount: number;
  totalXP: number;
  color: string;
  bgColor: string;
  rank?: number;
}

export const JUNGLE_TRIBES: JungleTribe[] = [
  {
    id: 'badgers-set',
    name: "Badger's Set",
    leader: 'badger',
    leaderEmoji: '',
    description: 'Strategic diggers who analyze every angle before committing. Methodical, patient, and always prepared.',
    motto: 'Dig deep, trade smart.',
    memberCount: 847,
    totalXP: 2450000,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  {
    id: 'banana-stand',
    name: "Monkey's Banana Stand",
    leader: 'monkey',
    leaderEmoji: '',
    description: 'Energetic swingers who catch opportunities on the move. Bold, quick-thinking, and always hunting for the next big play.',
    motto: "There's always money in the banana stand!",
    memberCount: 1203,
    totalXP: 3120000,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  {
    id: 'owls-parliament',
    name: "Owl's Parliament",
    leader: 'owl',
    leaderEmoji: '',
    description: 'Wise observers who see what others miss. Knowledge-focused traders who study before they strike.',
    motto: 'Wisdom is the ultimate edge.',
    memberCount: 621,
    totalXP: 1890000,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
  {
    id: 'bulls-charge',
    name: "Bull's Charge",
    leader: 'bull',
    leaderEmoji: '',
    description: 'Optimistic traders who see opportunity everywhere. Momentum-driven and always pushing forward.',
    motto: 'Fortune favors the bold.',
    memberCount: 932,
    totalXP: 2780000,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  {
    id: 'bears-den',
    name: "Bear's Den",
    leader: 'bear',
    leaderEmoji: '',
    description: 'Cautious traders who profit from uncertainty. Masters of downside protection and risk management.',
    motto: 'Protect the den at all costs.',
    memberCount: 578,
    totalXP: 1650000,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
  },
  {
    id: 'chameleons-color',
    name: "Chameleon's Collective",
    leader: 'chameleon',
    leaderEmoji: '',
    description: 'Adaptive traders who change strategy with the market. Masters of versatility and market timing.',
    motto: 'Adapt or fade.',
    memberCount: 445,
    totalXP: 1320000,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
];

// Rank tribes by total XP
export const getRankedTribes = (): JungleTribe[] => {
  return [...JUNGLE_TRIBES]
    .sort((a, b) => b.totalXP - a.totalXP)
    .map((tribe, index) => ({ ...tribe, rank: index + 1 }));
};

export const getTribeById = (id: string): JungleTribe | undefined => {
  return JUNGLE_TRIBES.find(t => t.id === id);
};
