// Error Handling Utilities for Wall Street Wildlife Mobile
import { Alert, Platform } from 'react-native';

// Error types for categorization
export type ErrorType =
  | 'network'
  | 'auth'
  | 'validation'
  | 'permission'
  | 'server'
  | 'unknown';

// Error with additional metadata
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error | unknown;
  userFriendlyMessage: string;
  recoverable: boolean;
}

// Common error messages
const ERROR_MESSAGES: Record<ErrorType, { title: string; message: string }> = {
  network: {
    title: 'Connection Error',
    message: 'Please check your internet connection and try again.',
  },
  auth: {
    title: 'Authentication Error',
    message: 'Your session has expired. Please sign in again.',
  },
  validation: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
  },
  permission: {
    title: 'Permission Denied',
    message: 'You do not have permission to perform this action.',
  },
  server: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  },
  unknown: {
    title: 'Error',
    message: 'Something went wrong. Please try again.',
  },
};

/**
 * Categorize an error based on its message or type
 */
export const categorizeError = (error: Error | unknown): ErrorType => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('connection')
    ) {
      return 'network';
    }

    // Auth errors
    if (
      message.includes('auth') ||
      message.includes('unauthorized') ||
      message.includes('token') ||
      message.includes('session') ||
      message.includes('login') ||
      message.includes('credential')
    ) {
      return 'auth';
    }

    // Validation errors
    if (
      message.includes('valid') ||
      message.includes('required') ||
      message.includes('invalid')
    ) {
      return 'validation';
    }

    // Permission errors
    if (
      message.includes('permission') ||
      message.includes('forbidden') ||
      message.includes('access denied')
    ) {
      return 'permission';
    }

    // Server errors
    if (
      message.includes('server') ||
      message.includes('500') ||
      message.includes('internal')
    ) {
      return 'server';
    }
  }

  return 'unknown';
};

/**
 * Create a standardized AppError from any error
 */
export const createAppError = (
  error: Error | unknown,
  customMessage?: string
): AppError => {
  const type = categorizeError(error);
  const errorMessages = ERROR_MESSAGES[type];

  return {
    type,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
    userFriendlyMessage: customMessage || errorMessages.message,
    recoverable: type !== 'server',
  };
};

/**
 * Show an alert with error information
 */
export const showErrorAlert = (
  error: AppError | Error | unknown,
  options?: {
    title?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
  }
): void => {
  const appError =
    'type' in (error as object)
      ? (error as AppError)
      : createAppError(error);

  const errorMessages = ERROR_MESSAGES[appError.type];
  const title = options?.title || errorMessages.title;
  const message = appError.userFriendlyMessage;

  const buttons: { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' | 'default' }[] = [];

  if (options?.onRetry && appError.recoverable) {
    buttons.push({
      text: 'Retry',
      onPress: options.onRetry,
    });
  }

  buttons.push({
    text: 'OK',
    onPress: options?.onDismiss,
    style: 'cancel',
  });

  Alert.alert(title, message, buttons);
};

/**
 * Log error for debugging (development only)
 */
export const logError = (
  error: Error | unknown,
  context?: string
): void => {
  if (__DEV__) {
    console.group(`Error${context ? ` in ${context}` : ''}`);
    console.error(error);
    if (error instanceof Error) {
      console.log('Message:', error.message);
      console.log('Stack:', error.stack);
    }
    console.groupEnd();
  }
};

/**
 * Handle an error with logging and optional alert
 */
export const handleError = (
  error: Error | unknown,
  options?: {
    context?: string;
    showAlert?: boolean;
    alertTitle?: string;
    customMessage?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
  }
): AppError => {
  const appError = createAppError(error, options?.customMessage);

  // Log in development
  logError(error, options?.context);

  // Show alert if requested
  if (options?.showAlert !== false) {
    showErrorAlert(appError, {
      title: options?.alertTitle,
      onRetry: options?.onRetry,
      onDismiss: options?.onDismiss,
    });
  }

  return appError;
};

/**
 * Wrapper for async functions with error handling
 */
export const withErrorHandler = async <T>(
  fn: () => Promise<T>,
  options?: {
    context?: string;
    showAlert?: boolean;
    customMessage?: string;
    fallbackValue?: T;
  }
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, {
      context: options?.context,
      showAlert: options?.showAlert,
      customMessage: options?.customMessage,
    });
    return options?.fallbackValue;
  }
};

/**
 * Format error for display
 */
export const formatErrorForDisplay = (error: Error | unknown): string => {
  const appError = createAppError(error);
  return appError.userFriendlyMessage;
};

export default {
  categorizeError,
  createAppError,
  showErrorAlert,
  logError,
  handleError,
  withErrorHandler,
  formatErrorForDisplay,
};
