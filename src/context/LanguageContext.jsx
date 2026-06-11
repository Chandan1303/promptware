import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateText } from '../services/googleTranslate';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations cache to avoid re-translating the same text
const translationCache = {};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('eco_language') || 'en';
  });

  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('eco_language', langCode);
    // Clear translations when language changes
    if (langCode === 'en') {
      setTranslations({});
    } else {
      // Force re-render to trigger translations
      setTranslations({});
    }
  };

  const t = (text) => {
    // If English, return original
    if (currentLanguage === 'en') {
      return text;
    }

    if (!text || typeof text !== 'string') {
      return text;
    }

    // Check cache first
    const cacheKey = `${currentLanguage}_${text}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    // Check if we have translation in state
    if (translations[text]) {
      return translations[text];
    }

    // Return original text while translation loads
    // Translation will happen in background
    if (text.length < 500) {
      translateText(text, currentLanguage, 'en')
        .then(result => {
          if (result.success && result.translatedText && result.translatedText !== text) {
            translationCache[cacheKey] = result.translatedText;
            setTranslations(prev => ({
              ...prev,
              [text]: result.translatedText
            }));
          }
        })
        .catch(err => {
          console.error('Translation error for text:', text.substring(0, 50), err);
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
