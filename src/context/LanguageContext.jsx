import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateText } from '../services/googleTranslate';
import { UI_CONSTANTS, STORAGE_KEYS } from '../constants';
import { isValidLanguageCode } from '../utils/validators';
import { logError } from '../utils/errorHandler';

const LanguageContext = createContext();

/**
 * Custom hook to access language context
 * @returns {Object} Language context value
 * @throws {Error} If used outside LanguageProvider
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations cache to avoid re-translating the same text
const translationCache = new Map();

/**
 * Language Provider Component
 * Manages application language state and translation functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved && isValidLanguageCode(saved) ? saved : 'en';
  });

  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  /**
   * Changes the current language
   * @param {string} langCode - ISO language code
   */
  const changeLanguage = (langCode) => {
    if (!isValidLanguageCode(langCode)) {
      logError(new Error(`Invalid language code: ${langCode}`));
      return;
    }
    
    setCurrentLanguage(langCode);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, langCode);
    
    // Clear translations when language changes
    setTranslations({});
  };

  /**
   * Translates text to current language
   * @param {string} text - Text to translate
   * @returns {string} Translated text or original if translation fails
   */
  const t = (text) => {
    // If English or invalid input, return original
    if (currentLanguage === 'en' || !text || typeof text !== 'string') {
      return text;
    }

    // Check cache first
    const cacheKey = `${currentLanguage}_${text}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    // Check if we have translation in state
    if (translations[text]) {
      return translations[text];
    }

    // Return original text while translation loads
    // Translation will happen in background
    if (text.length < UI_CONSTANTS.MAX_TRANSLATION_LENGTH) {
      translateText(text, currentLanguage, 'en')
        .then(result => {
          if (result.success && result.translatedText && result.translatedText !== text) {
            translationCache.set(cacheKey, result.translatedText);
            setTranslations(prev => ({
              ...prev,
              [text]: result.translatedText,
            }));
          }
        })
        .catch(err => {
          logError(err, { text: text.substring(0, 50), targetLang: currentLanguage });
        });
    }

    return text; // Return original while translating
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isTranslating
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
