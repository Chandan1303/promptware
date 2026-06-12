/**
 * Application-wide constants
 * Centralizes all magic numbers and configuration values
 */

// Carbon Calculation Constants
export const CARBON_CONSTANTS = {
  // Transportation emission factors (kg CO2 per km)
  TRANSPORT_FACTORS: {
    walk: 0,
    bike: 0,
    bus: 0.089,
    train: 0.041,
    car: 0.192,
    flight: 0.255,
  },
  
  // Diet emission factors (kg CO2 per day)
  DIET_FACTORS: {
    vegan: 2.89,
    vegetarian: 3.81,
    mixed: 5.63,
    meat: 7.19,
  },
  
  // Utilities emission factors (kg CO2 per month)
  UTILITIES_FACTORS: {
    electricity: {
      low: 150,
      medium: 300,
      high: 600,
    },
    water: {
      low: 30,
      medium: 60,
      high: 120,
    },
  },
  
  // Shopping emission factors (kg CO2 per month)
  SHOPPING_FACTORS: {
    low: 100,
    medium: 300,
    high: 600,
  },
  
  // Waste emission factors (kg CO2 per month)
  WASTE_FACTORS: {
    low: 50,
    medium: 150,
    high: 300,
  },
};

// Leaf Rating Thresholds
export const LEAF_RATING_THRESHOLDS = {
  EXCELLENT: 2000,
  GOOD: 4000,
  AVERAGE: 6000,
  POOR: 8000,
};

// Global Carbon Targets
export const CARBON_TARGETS = {
  GLOBAL_TARGET: 2000,
  GLOBAL_AVERAGE: 4700,
};

// UI Constants
export const UI_CONSTANTS = {
  CHART_HEIGHT: 280,
  MAX_TRANSLATION_LENGTH: 500,
  DEBOUNCE_DELAY: 300,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'ecoguide_user',
  LANGUAGE: 'eco_language',
  ACCESSIBILITY: 'eco_sr_hints',
  CARBON_DATA: 'ecoguide_carbon_data',
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Language Codes
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Português', flag: '🇧🇷' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
  ar: { name: 'العربية', flag: '🇸🇦' },
};

// Error Messages
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'API key not configured',
  NETWORK_ERROR: 'Network request failed',
  INVALID_INPUT: 'Invalid input provided',
  TRANSLATION_FAILED: 'Translation service unavailable',
};
