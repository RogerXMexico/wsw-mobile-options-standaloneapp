// Hooks exports for Wall Street Wildlife Mobile
// useAuth is now provided by AuthContext — re-export for any code that imports from hooks
export { useAuth } from '../contexts';
export { useSubscription } from './useSubscription';
export type { AccessLevel } from './useSubscription';
export { useProgress } from './useProgress';
export { useBookmarksHook } from './useBookmarks';
export { useTribeChat } from './useTribeChat';
export type { TribeChatMessage } from './useTribeChat';

// Phase 2A: Ported hooks from desktop
export { usePaperTrading } from './usePaperTrading';
export type { Position, PaperTrade, ExecuteTradeParams } from './usePaperTrading';

export { useTradeJournal } from './useTradeJournal';
export type { Trade, SyncStatus } from './useTradeJournal';

export { useMissions, DAILY_MISSIONS, WEEKLY_MISSIONS, getMissionById, getMonday, getDefaultMissionsState } from './useMissions';
export type { Mission, MissionProgress, DailyMissionsState, MissionType, MissionDifficulty, MissionPeriod, MissionRequirement } from './useMissions';

export { useNotifications } from './useNotifications';
export type { AppNotification } from './useNotifications';

// Phase 2C: Ported data hooks from desktop
export { useOptionsChain } from './useOptionsChain';
export { useTradierOptionsData, useTradierBatchOptionsData } from './useTradierOptionsData';
export { useIVHistory } from './useIVHistory';
export { useVolatilitySurface } from './useVolatilitySurface';
export { usePortfolio } from './usePortfolio';
export { usePolymarketData, usePolymarketEvent } from './usePolymarketData';
export { useBullflowStream } from './useBullflowStream';
export { useFollows } from './useFollows';

// Phase 7A: Strategy animations
export { useStrategyAnimations } from './useStrategyAnimations';
export type { StrategyAnimations } from './useStrategyAnimations';
