// Auth slice for Wall Street Wildlife Mobile
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../data/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateUserProgress: (state, action: PayloadAction<Partial<User['progress']>>) => {
      if (state.user) {
        state.user.progress = {
          ...state.user.progress,
          ...action.payload,
        };
      }
    },
    updateSubscription: (state, action: PayloadAction<User['subscriptionTier']>) => {
      if (state.user) {
        state.user.subscriptionTier = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  updateUserProgress,
  updateSubscription,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
