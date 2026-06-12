/**
 * Input validation utilities
 * Provides reusable validation functions for form inputs and API responses
 */

/**
 * Validates if a string is not empty
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid
 */
export const isNotEmpty = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validates if a number is within a range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if valid
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validates API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid
 */
export const isValidApiKey = (apiKey) => {
  return (
    typeof apiKey === 'string' &&
    apiKey.length > 10 &&
    apiKey !== 'your_api_key_here' &&
    !/placeholder|example|test/i.test(apiKey)
  );
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates language code
 * @param {string} code - Language code to validate
 * @returns {boolean} True if valid
 */
export const isValidLanguageCode = (code) => {
  const validCodes = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'hi', 'ar'];
  return validCodes.includes(code);
};

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validates carbon calculation input
 * @param {Object} data - Carbon calculation data
 * @returns {Object} Validation result with errors
 */
export const validateCarbonInput = (data) => {
  const errors = {};
  
  if (!data.transportType) {
    errors.transportType = 'Transportation type is required';
  }
  
  if (!isInRange(data.transportKm, 0, 1000)) {
    errors.transportKm = 'Distance must be between 0 and 1000 km';
  }
  
  if (!['vegan', 'vegetarian', 'mixed', 'meat'].includes(data.diet)) {
    errors.diet = 'Invalid diet type';
  }
  
  if (!['low', 'medium', 'high'].includes(data.electricity)) {
    errors.electricity = 'Invalid electricity usage level';
  }
  
  if (!['low', 'medium', 'high'].includes(data.water)) {
    errors.water = 'Invalid water usage level';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
