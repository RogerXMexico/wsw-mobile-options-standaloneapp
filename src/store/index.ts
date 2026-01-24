// Redux Store configuration for Wall Street Wildlife Mobile
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import progressReducer from './slices/progressSlice';
import paperTradingReducer from './slices/paperTradingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    paperTrading: paperTradingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Date serialization
        ignoredActions: ['progress/updateLastActivity'],
        ignoredPaths: ['progress.lastActivityDate'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
