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

const LOCAL_TRANSLATIONS = {
  es: {
    "Sustainability Dashboard": "Tablero de Sostenibilidad",
    "Keep track of your carbon balance and evaluate ongoing eco objectives.": "Realice un seguimiento de su saldo de carbono y evalúe los objetivos ecológicos en curso.",
    "Annual Footprint": "Huella Anual",
    "kg CO2 / year equivalent": "kg CO2 / año equivalente",
    "Ranked": "Clasificado",
    "Leaves": "Hojas",
    "vs Global Target": "vs Objetivo Global",
    "Relative to the ideal 2,000 kg target": "Relativo al objetivo ideal de 2.000 kg",
    "Global average": "Promedio global",
    "Action Completion": "Completado de Acciones",
    "of": "de",
    "actions active": "acciones activas",
    "Weekly Goal Score": "Puntuación de Objetivos Semanales",
    "commitments met": "compromisos cumplidos",
    "Emission Category Breakdown": "Desglose por Categoría de Emisión",
    "Sustainability Trajectory (1-Year Prediction)": "Trayectoria de Sostenibilidad (Predicción a 1 Año)",
    "Carbon Log (Historical Trend)": "Registro de Carbono (Tendencia Histórica)",
    "Weekly Commitments & Goals": "Compromisos y Objetivos Semanales",
    "Commit to simple weekly changes to gradually build clean daily habits.": "Comprométase con cambios semanales simples para desarrollar gradualmente hábitos diarios limpios.",
    "No custom goals set. Type a goal above and click Add!": "No se han establecido objetivos personalizados. ¡Escriba un objetivo arriba y haga clic en Agregar!",
    "Dashboard": "Tablero",
    "Carbon Analyzer": "Analizador de Carbono",
    "AI Coach Chat": "Chat de Entrenador AI",
    "Route Calculator": "Calculadora de Rutas",
    "Receipt Scanner": "Escáner de Recibos",
    "Action Engine": "Motor de Acciones",
    "Google Services": "Servicios de Google",
    "Accessibility Settings": "Ajustes de Accesibilidad",
    "Google Sign-In": "Iniciar Sesión con Google",
    "Log out": "Cerrar sesión",
    "Go to": "Ir a",
    "Please enter both origin and destination": "Por favor ingrese origen y destino",
    "Compare carbon emissions across different transportation modes using Google Maps API.": "Compare las emisiones de carbono en diferentes modos de transporte utilizando la API de Google Maps.",
    "Starting Location": "Ubicación de Inicio",
    "Destination": "Destino",
    "Transportation Mode": "Modo de Transporte",
    "Calculate Carbon Footprint": "Calcular Huella de Carbono",
    "Calculate Route Carbon Footprint": "Calcular Huella de Carbono de la Ruta",
    "Upload shopping receipts to automatically calculate carbon footprint using Google Vision AI.": "Suba recibos de compras para calcular automáticamente la huella de carbono con Google Vision AI.",
    "Choose Receipt Image": "Elegir Imagen de Recibo",
    "Upload Receipt Image": "Subir Imagen de Recibo",
    "Take a photo or upload an existing receipt image. Our AI will extract items and estimate carbon emissions.": "Tome una foto o suba una imagen de recibo existente. Nuestra IA extraerá los artículos y estimará las emisiones de carbono.",
    "Analysis Complete": "Análisis Completado",
    "Google Vision AI extracted {result.items.length} items": "Google Vision AI extrajo artículos",
    "Total Items": "Artículos Totales",
    "Total Cost": "Costo Total",
    "CO2 equivalent": "Equivalente de CO2",
    "Detected Items": "Artículos Detectados",
    "Scan Another Receipt": "Escanear Otro Recibo",
    "How It Works": "Cómo Funciona",
    "1. Upload Receipt": "1. Subir Recibo",
    "Take a clear photo of your shopping receipt": "Tome una foto clara de su recibo de compra",
    "2. AI Analysis": "2. Análisis de IA",
    "Google Vision extrae artículos y precios usando OCR": "Google Vision extrae artículos y precios usando OCR",
    "3. Carbon Estimate": "3. Estimación de Carbono",
    "Calculate emissions based on product categories": "Calcule las emisiones según las categorías de productos",
    "Hi! I am your AI Sustainability Coach. I have analyzed your carbon analyzer answers. Ask me why your footprint is high, what your largest contributors are, or how to reduce them next month!": "¡Hola! Soy tu entrenador de sostenibilidad de IA. He analizado tus respuestas. ¡Pregúntame por qué tu huella es alta, cuáles son tus mayores contribuyentes o cómo reducirlos el próximo mes!"
  },
  fr: {
    "Sustainability Dashboard": "Tableau de bord de durabilité",
    "Keep track of your carbon balance and evaluate ongoing eco objectives.": "Suivez votre bilan carbone et évaluez les objectifs écologiques en cours.",
    "Annual Footprint": "Empreinte annuelle",
    "kg CO2 / year equivalent": "kg CO2 / an équivalent",
    "Ranked": "Classé",
    "Leaves": "Feuilles",
    "vs Global Target": "vs Cible globale",
    "Relative to the ideal 2,000 kg target": "Par rapport à la cible idéale de 2 000 kg",
    "Global average": "Moyenne mondiale",
    "Action Completion": "Achèvement des actions",
    "of": "de",
    "actions active": "actions actives",
    "Weekly Goal Score": "Score d'objectifs hebdomadaires",
    "commitments met": "engagements tenus",
    "Emission Category Breakdown": "Répartition des émissions par catégorie",
    "Sustainability Trajectory (1-Year Prediction)": "Trajectoire de durabilité (prédiction sur 1 an)",
    "Carbon Log (Historical Trend)": "Journal carbone (tendance historique)",
    "Weekly Commitments & Goals": "Engagements et objectifs hebdomadaires",
    "Commit to simple weekly changes to gradually build clean daily habits.": "Engagez-vous dans des changements hebdomadaires simples pour acquérir progressivement des habitudes quotidiennes saines.",
    "No custom goals set. Type a goal above and click Add!": "Aucun objectif personnalisé défini. Saisissez un objectif ci-dessus et cliquez sur Ajouter !",
    "Dashboard": "Tableau de bord",
    "Carbon Analyzer": "Analyseur de carbone",
    "AI Coach Chat": "Chat de coach IA",
    "Route Calculator": "Calculateur de route",
    "Receipt Scanner": "Scanner de reçus",
    "Action Engine": "Moteur d'actions",
    "Google Services": "Services Google",
    "Accessibility Settings": "Paramètres d'accessibilité",
    "Google Sign-In": "Connexion Google",
    "Log out": "Se déconnecter",
    "Go to": "Aller à",
    "Please enter both origin and destination": "Veuillez entrer l'origine et la destination",
    "Compare carbon emissions across different transportation modes using Google Maps API.": "Comparez les émissions de carbone de différents modes de transport à l'aide de l'API Google Maps.",
    "Starting Location": "Lieu de départ",
    "Destination": "Destination",
    "Transportation Mode": "Mode de transport",
    "Calculate Carbon Footprint": "Calculer l'empreinte carbone",
    "Calculate Route Carbon Footprint": "Calculer l'empreinte carbone de l'itinéraire",
    "Upload shopping receipts to automatically calculate carbon footprint using Google Vision AI.": "Téléchargez des reçus d'achat pour calculer automatiquement l'empreinte carbone avec Google Vision AI.",
    "Choose Receipt Image": "Choisir une image de reçu",
    "Upload Receipt Image": "Téléverser une image de reçu",
    "Take a photo or upload an existing receipt image. Our AI will extract items and estimate carbon emissions.": "Prenez une photo ou téléchargez une image de reçu existante. Notre IA extraira les articles et estimera les émissions de carbone.",
    "Analysis Complete": "Analyse Complète",
    "Google Vision AI extracted {result.items.length} items": "Google Vision AI a extrait des articles",
    "Total Items": "Total des articles",
    "Total Cost": "Coût total",
    "CO2 equivalent": "Équivalent CO2",
    "Detected Items": "Articles détectés",
    "Scan Another Receipt": "Scanner un autre reçu",
    "How It Works": "Comment ça fonctionne",
    "1. Upload Receipt": "1. Téléverser le reçu",
    "Take a clear photo of your shopping receipt": "Prenez une photo claire de votre reçu d'achat",
    "2. AI Analysis": "2. Analyse IA",
    "Google Vision extracts items and prices using OCR": "Google Vision extrait les articles et les prix à l'aide de l'OCR",
    "3. Carbon Estimate": "3. Estimation carbone",
    "Calculate emissions based on product categories": "Calculez les émissions en fonction des catégories de produits",
    "Hi! I am your AI Sustainability Coach. I have analyzed your carbon analyzer answers. Ask me why your footprint is high, what your largest contributors are, or how to reduce them next month!": "Salut! Je suis ton coach de durabilité IA. J'ai analysé tes réponses. Demande-moi pourquoi ton empreinte est élevée, quels sont tes plus grands contributeurs ou comment les réduire le mois prochain !"
  }
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
    console.warn('Google Translate API key not configured, checking local translations');
    if (LOCAL_TRANSLATIONS[targetLang] && LOCAL_TRANSLATIONS[targetLang][text]) {
      return { translatedText: LOCAL_TRANSLATIONS[targetLang][text], detectedLanguage: sourceLang || 'en', success: true };
    }
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
