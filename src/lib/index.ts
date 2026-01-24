// Library exports for Wall Street Wildlife Mobile
export { supabase, isSupabaseConfigured } from './supabase';
export type { Database } from './supabase';
export {
  categorizeError,
  createAppError,
  showErrorAlert,
  logError,
  handleError,
  withErrorHandler,
  formatErrorForDisplay,
} from './errorHandler';
export type { ErrorType, AppError } from './errorHandler';
