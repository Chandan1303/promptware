/**
 * Performance optimization utilities
 * Provides memoization, debouncing, and throttling functions
 */

/**
 * Creates a debounced function that delays invoking func
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeoutId;
  
  return function debounced(...args) {
    const context = this;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

/**
 * Creates a throttled function that only invokes func at most once per period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function throttled(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Memoizes a function to cache results
 * @param {Function} func - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (func) => {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
};

/**
 * Measures function execution time
 * @param {Function} func - Function to measure
 * @param {string} label - Label for console output
 * @returns {Function} Wrapped function
 */
export const measurePerformance = (func, label) => {
  return function measured(...args) {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    
    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
    
    return result;
  };
};

/**
 * Lazy loads a component
 * @param {Function} importFunc - Dynamic import function
 * @returns {Object} Lazy loaded component
 */
export const lazyLoad = (importFunc) => {
  return {
    loader: importFunc,
    loading: () => null,
  };
};
