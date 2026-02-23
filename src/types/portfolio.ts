// Portfolio Tracking Types for Event Horizons Module
// Ported from desktop types/portfolio.ts

// ============ Position Types ============

export interface StockPosition {
  id: string;
  ticker: string;
  companyName?: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  sector?: string;
  // Computed
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  // Meta
  openedAt: string;
  status: 'open' | 'closed';
  closedAt?: string;
}

export interface OptionsPosition {
  id: string;
  ticker: string;
  optionType: 'call' | 'put';
  strike: number;
  expiration: string;
  quantity: number; // positive = long, negative = short
  avgCost: number; // per contract
  currentPrice: number;
  // Greeks (fetched from Tradier)
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  iv?: number;
  // Computed
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  daysToExpiration: number;
  // Meta
  openedAt: string;
  status: 'open' | 'closed';
  closedAt?: string;
  underlyingCostBasis?: number; // cost basis of underlying shares
}

// ============ Polymarket Position Types ============

export interface PolymarketPosition {
  id: string;
  eventId: string;
  eventName: string;
  ticker: string | null; // Associated stock ticker if applicable
  outcome: 'yes' | 'no';
  shares: number;
  avgCost: number; // Entry price 0-1
  currentPrice: number; // Current price 0-1
  // Computed
  costBasis: number; // In dollars
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  // Meta
  eventDate?: string;
  status: 'open' | 'closed' | 'resolved';
  openedAt: string;
  closedAt?: string;
  resolvedAt?: string;
  exitPrice?: number;
  realizedPnL?: number;
}

// ============ Trade Record Types ============

export interface PortfolioTrade {
  id: string;
  positionId: string;
  type: 'buy' | 'sell';
  assetType: 'stock' | 'option' | 'polymarket';
  ticker: string;
  quantity: number;
  price: number;
  total: number;
  fees?: number;
  timestamp: string;
  notes?: string;
  // Option-specific fields
  optionType?: 'call' | 'put';
  strike?: number;
  expiration?: string;
  underlyingCostBasis?: number;
  // Polymarket-specific fields
  outcome?: 'yes' | 'no';
  eventId?: string;
  eventName?: string;
}

// ============ Portfolio Snapshot Types ============

export interface PortfolioSnapshot {
  date: string;
  totalValue: number;
  cashBalance: number;
  stocksValue: number;
  optionsValue: number;
  polymarketValue: number;
  dailyPnL: number;
}

// ============ Portfolio State Types ============

export interface PortfolioSettings {
  defaultSector: string;
  showClosedPositions: boolean;
}

export interface PortfolioState {
  cashBalance: number;
  stockPositions: StockPosition[];
  optionsPositions: OptionsPosition[];
  polymarketPositions: PolymarketPosition[];
  trades: PortfolioTrade[];
  snapshots: PortfolioSnapshot[];
  settings: PortfolioSettings;
}

// ============ Analytics Types ============

export interface PortfolioGreeksExposure {
  totalDelta: number;
  totalGamma: number;
  totalTheta: number;
  totalVega: number;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  positions: number;
}

export interface WinLossStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  totalRealizedPnL: number;
  largestWin: number;
  largestLoss: number;
}

export interface PortfolioSummary {
  totalValue: number;
  cashBalance: number;
  stocksValue: number;
  optionsValue: number;
  polymarketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dayPnL: number;
  dayPnLPercent: number;
  greeksExposure: PortfolioGreeksExposure;
}

// ============ Trade Form Types ============

export interface AddStockTradeForm {
  assetType: 'stock';
  tradeType: 'buy' | 'sell';
  ticker: string;
  shares: number;
  price: number;
  fees?: number;
  notes?: string;
}

export interface AddOptionTradeForm {
  assetType: 'option';
  tradeType: 'buy' | 'sell';
  ticker: string;
  optionType: 'call' | 'put';
  strike: number;
  expiration: string;
  contracts: number;
  price: number; // per contract
  fees?: number;
  notes?: string;
  underlyingCostBasis?: number;
}

export interface AddPolymarketTradeForm {
  assetType: 'polymarket';
  tradeType: 'buy' | 'sell';
  eventId: string;
  eventName: string;
  ticker: string | null;
  outcome: 'yes' | 'no';
  shares: number;
  price: number; // 0-1 probability price
  eventDate?: string;
  notes?: string;
}

export type AddTradeForm = AddStockTradeForm | AddOptionTradeForm | AddPolymarketTradeForm;

// ============ Default Values ============

export const DEFAULT_PORTFOLIO_STATE: PortfolioState = {
  cashBalance: 10000,
  stockPositions: [],
  optionsPositions: [],
  polymarketPositions: [],
  trades: [],
  snapshots: [],
  settings: {
    defaultSector: 'Technology',
    showClosedPositions: false,
  },
};

export const SECTOR_OPTIONS = [
  'Technology',
  'Healthcare',
  'Financial',
  'Consumer Discretionary',
  'Consumer Staples',
  'Energy',
  'Industrials',
  'Materials',
  'Real Estate',
  'Utilities',
  'Communication Services',
  'Other',
] as const;

export type Sector = typeof SECTOR_OPTIONS[number];
