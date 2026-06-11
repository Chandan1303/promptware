// Google Cloud Translation API Integration
// Provides multi-language support for the application

const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  hi: 'हिन्दी',
  ar: 'العربية'
};

/**
 * Translate text using Google Cloud Translation API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'es', 'fr')
 * @param {string} sourceLang - Source language code (optional, auto-detect if not provided)
 * @returns {Promise<Object>} Translation result
 */
export async function translateText(text, targetLang, sourceLang = null) {
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_translate_api_key_here') {
    console.warn('Google Translate API key not configured');
    return { translatedText: text, detectedLanguage: null, error: 'API key not configured' };
  }

  if (!text || text.trim() === '') {
    return { translatedText: '', detectedLanguage: null };
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const requestBody = {
      q: text,
      target: targetLang,
      format: 'text'
    };

    if (sourceLang) {
      requestBody.source = sourceLang;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translation = data.data.translations[0];

    return {
      translatedText: translation.translatedText,
      detectedLanguage: translation.detectedSourceLanguage || sourceLang,
      success: true
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: text,
      detectedLanguage: null,
      error: error.message
    };
  }
}

/**
 * Detect language of text
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Detected language info
 */
export async function detectLanguage(text) {
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_translate_api_key_here') {
    return { language: 'en', confidence: 0, error: 'API key not configured' };
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: text })
    });

    if (!response.ok) {
      throw new Error(`Detection API error: ${response.status}`);
    }

    const data = await response.json();
    const detection = data.data.detections[0][0];

    return {
      language: detection.language,
      confidence: detection.confidence,
      languageName: SUPPORTED_LANGUAGES[detection.language] || detection.language
    };

  } catch (error) {
    console.error('Language detection error:', error);
    return { language: 'en', confidence: 0, error: error.message };
  }
}

/**
 * Get list of supported languages
 * @returns {Object} Supported languages object
 */
export function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

/**
 * Translate multiple texts in batch
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<Array>} Array of translations
 */
export async function translateBatch(texts, targetLang) {
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_translate_api_key_here') {
    return texts.map(text => ({ translatedText: text, error: 'API key not configured' }));
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: texts,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data.translations.map(translation => ({
      translatedText: translation.translatedText,
      detectedLanguage: translation.detectedSourceLanguage
    }));

  } catch (error) {
    console.error('Batch translation error:', error);
    return texts.map(text => ({ translatedText: text, error: error.message }));
  }
}
