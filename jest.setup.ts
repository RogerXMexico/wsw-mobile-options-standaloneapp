// Jest setup file for Wall Street Wildlife Mobile
// Mocks for native modules and external services

// ---------------------------------------------------------------------------
// Mock AsyncStorage
// ---------------------------------------------------------------------------
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ---------------------------------------------------------------------------
// Mock expo-secure-store
// ---------------------------------------------------------------------------
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// ---------------------------------------------------------------------------
// Mock @react-navigation/native
// ---------------------------------------------------------------------------
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    reset: mockReset,
    dispatch: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useRoute: () => ({
    params: {},
    name: 'MockRoute',
    key: 'mock-key',
  }),
  useIsFocused: jest.fn().mockReturnValue(true),
  useFocusEffect: jest.fn(),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

// ---------------------------------------------------------------------------
// Mock Supabase client (src/lib/supabase)
// ---------------------------------------------------------------------------
jest.mock('./src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signUp: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
  },
  isSupabaseConfigured: jest.fn().mockReturnValue(false),
}));
