// Paper Trading slice for Wall Street Wildlife Mobile
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaperTrade, PaperTradingAccount } from '../../data/types';
import { APP_CONFIG } from '../../data/constants';

const initialState: PaperTradingAccount = {
  balance: APP_CONFIG.paperTradingStartingBalance,
  startingBalance: APP_CONFIG.paperTradingStartingBalance,
  openPositions: [],
  closedTrades: [],
  totalPnl: 0,
  totalTrades: 0,
  winRate: 0,
};

const paperTradingSlice = createSlice({
  name: 'paperTrading',
  initialState,
  reducers: {
    openPosition: (state, action: PayloadAction<Omit<PaperTrade, 'id' | 'openedAt' | 'pnl' | 'status'>>) => {
      const trade: PaperTrade = {
        ...action.payload,
        id: `trade-${Date.now()}`,
        openedAt: new Date().toISOString(),
        pnl: 0,
        status: 'open',
      };

      // Deduct cost from balance
      const cost = trade.entryPrice * trade.quantity * (trade.type === 'stock' ? 1 : 100);
      state.balance -= cost;
      state.openPositions.push(trade);
    },

    closePosition: (state, action: PayloadAction<{ tradeId: string; closePrice: number }>) => {
      const { tradeId, closePrice } = action.payload;
      const positionIndex = state.openPositions.findIndex(p => p.id === tradeId);

      if (positionIndex !== -1) {
        const position = state.openPositions[positionIndex];
        const multiplier = position.type === 'stock' ? 1 : 100;

        // Calculate P&L
        let pnl: number;
        if (position.action === 'buy') {
          pnl = (closePrice - position.entryPrice) * position.quantity * multiplier;
        } else {
          pnl = (position.entryPrice - closePrice) * position.quantity * multiplier;
        }

        // Update the position
        const closedTrade: PaperTrade = {
          ...position,
          currentPrice: closePrice,
          closedAt: new Date().toISOString(),
          pnl,
          status: 'closed',
        };

        // Add proceeds back to balance
        const proceeds = closePrice * position.quantity * multiplier + pnl;
        state.balance += closePrice * position.quantity * multiplier;

        // Move to closed trades
        state.openPositions.splice(positionIndex, 1);
        state.closedTrades.push(closedTrade);

        // Update stats
        state.totalPnl += pnl;
        state.totalTrades += 1;

        // Recalculate win rate
        const wins = state.closedTrades.filter(t => t.pnl > 0).length;
        state.winRate = state.totalTrades > 0 ? (wins / state.totalTrades) * 100 : 0;
      }
    },

    updatePositionPrice: (state, action: PayloadAction<{ tradeId: string; currentPrice: number }>) => {
      const { tradeId, currentPrice } = action.payload;
      const position = state.openPositions.find(p => p.id === tradeId);

      if (position) {
        position.currentPrice = currentPrice;
        const multiplier = position.type === 'stock' ? 1 : 100;

        if (position.action === 'buy') {
          position.pnl = (currentPrice - position.entryPrice) * position.quantity * multiplier;
        } else {
          position.pnl = (position.entryPrice - currentPrice) * position.quantity * multiplier;
        }
      }
    },

    resetAccount: (state) => {
      state.balance = APP_CONFIG.paperTradingStartingBalance;
      state.openPositions = [];
      state.closedTrades = [];
      state.totalPnl = 0;
      state.totalTrades = 0;
      state.winRate = 0;
    },

    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
      state.startingBalance = action.payload;
    },
  },
});

export const {
  openPosition,
  closePosition,
  updatePositionPrice,
  resetAccount,
  setBalance,
} = paperTradingSlice.actions;

export default paperTradingSlice.reducer;
