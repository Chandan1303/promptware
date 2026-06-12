/**
 * Centralized error handling utilities
 * Provides consistent error handling and logging across the application
 */

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(message, severity = ErrorSeverity.MEDIUM, context = {}) {
    super(message);
    this.name = 'AppError';
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Logs error with context
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  const errorLog = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    severity: error.severity || ErrorSeverity.MEDIUM,
    context,
    timestamp: new Date().toISOString(),
  };
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service (e.g., Sentry)
    console.error('Production Error:', errorLog);
  } else {
    console.error('Development Error:', errorLog);
  }
  
  return errorLog;
};

/**
 * Handles API errors gracefully
 * @param {Error} error - Error from API call
 * @returns {Object} Formatted error response
 */
export const handleApiError = (error) => {
  let message = 'An unexpected error occurred';
  let statusCode = 500;
  
  if (error.response) {
    // Server responded with error status
    statusCode = error.response.status;
    message = error.response.data?.message || error.message;
  } else if (error.request) {
    // Request made but no response
    message = 'Network error. Please check your connection.';
    statusCode = 0;
  } else {
    // Error in request setup
    message = error.message;
  }
  
  return {
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Wraps async functions with error handling
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
export const withErrorHandling = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, { function: fn.name, args });
      throw error;
    }
  };
};

/**
 * Retries a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Result of function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw new AppError(
    `Failed after ${maxRetries} attempts: ${lastError.message}`,
    ErrorSeverity.HIGH,
    { originalError: lastError }
  );
};
