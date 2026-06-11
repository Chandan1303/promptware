# 🗺️ API Usage Map - Where Each API is Used

This document shows exactly WHERE and HOW each Google API key is used in the codebase.

---

## 1️⃣ VITE_GEMINI_API_KEY (Google Gemini AI)

### 📁 Files Using This API:

#### ✅ **src/services/gemini.js** (PRIMARY USAGE)
**Purpose:** AI-powered sustainability coaching

**What it does:**
- Sends user carbon footprint data to Gemini AI
- Gets personalized recommendations
- Provides context-aware responses
- Fallback to simulation mode if no key

**Code:**
```javascript
const apiKey = customApiKey || import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });
const response = await ai.models.generateContent({...});
```

**Features powered:**
- AI Assistant chat interface
- "Why is my footprint high?" analysis
- Personalized reduction strategies
- Smart carbon advice

---

#### ✅ **src/components/AIAssistant.jsx** (UI COMPONENT)
**Purpose:** Shows connection status to users

**What it does:**
- Checks if API key is configured
- Shows "Connected" or "Simulation mode" message
- Allows users to enter custom API key

**Code:**
```javascript
{import.meta.env.VITE_GEMINI_API_KEY
  ? "Connected to live Google Gemini service."
  : "Running in local simulation mode."}
```

---

#### ✅ **src/components/GoogleTech.jsx** (STATUS DISPLAY)
**Purpose:** Shows if Gemini AI service is active

**What it does:**
- Checks if key is configured
- Displays green "Active" or gray "Available" chip

---

### 🎯 User-Facing Features:
1. **AI Coach Tab** - Chat with AI about carbon footprint
2. **Personalized Advice** - Custom recommendations based on your data
3. **Natural Language Q&A** - Ask questions, get smart answers

---

## 2️⃣ VITE_GA_MEASUREMENT_ID (Google Analytics 4)

### 📁 Files Using This API:

#### ✅ **src/services/analytics.js** (PRIMARY USAGE)
**Purpose:** Track user engagement and events

**What it does:**
- Initializes Google Analytics
- Tracks page views
- Logs custom events (goal_added, action_completed, etc.)
- Privacy-compliant (no PII)

**Code:**
```javascript
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
window.gtag('config', measurementId);
```

**Events tracked:**
- `analyzer_calculated` - User completes carbon calculator
- `goal_added` - User adds a weekly goal
- `action_completed` - User marks action as done
- `accessibility_enabled` - User enables accessibility features

---

#### ✅ **src/main.jsx** (INITIALIZATION)
**Purpose:** Start analytics when app loads

**What it does:**
- Checks if Measurement ID exists
- Initializes analytics service
- Loads gtag.js script

**Code:**
```javascript
if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  initializeAnalytics();
}
```

---

#### ✅ **index.html** (SCRIPT LOADING)
**Purpose:** Load Google Analytics script

**Location:** HTML `<head>` section
**What it loads:** gtag.js from Google servers

---

### 🎯 User-Facing Features:
1. **Usage Analytics** - Track how users engage with app
2. **Feature Analytics** - Which features are most used
3. **Accessibility Tracking** - Monitor a11y feature adoption

---

## 3️⃣ VITE_GOOGLE_MAPS_API_KEY (Google Maps)

### 📁 Files Using This API:

#### ✅ **src/services/googleMaps.js** (PRIMARY USAGE)
**Purpose:** Calculate route carbon footprint

**What it does:**
- Initialize Google Maps JavaScript API
- Calculate distance between locations
- Estimate carbon emissions per transport mode
- Place autocomplete for location input

**Code:**
```javascript
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const loader = new Loader({ apiKey, libraries: ['places', 'geometry'] });
```

**Functions available:**
- `calculateRouteCarbonFootprint(origin, dest, mode)` - Get route emissions
- `getPlaceAutocomplete(input)` - Location suggestions

---

### 🎯 User-Facing Features (Future):
1. **Route Carbon Calculator** - Compare car vs transit vs bike
2. **Commute Optimizer** - Find lowest-emission routes
3. **Location Search** - Autocomplete for addresses

**Status:** API configured, UI components can be added to use it

---

## 4️⃣ VITE_GOOGLE_TRANSLATE_API_KEY (Translation)

### 📁 Files Using This API:

#### ✅ **src/services/googleTranslate.js** (PRIMARY USAGE)
**Purpose:** Multi-language support

**What it does:**
- Translate text to 100+ languages
- Detect language automatically
- Batch translation for UI elements

**Code:**
```javascript
const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const response = await fetch(`https://translation.googleapis.com/...?key=${apiKey}`);
```

**Functions available:**
- `translateText(text, targetLang)` - Translate to language
- `detectLanguage(text)` - Auto-detect language
- `translateBatch(texts, targetLang)` - Translate multiple texts

**Supported languages:**
- English, Spanish, French, German, Italian, Portuguese
- Chinese, Japanese, Korean, Hindi, Arabic
- 100+ more languages

---

### 🎯 User-Facing Features (Future):
1. **Language Selector** - Switch app language
2. **AI Responses** - Get advice in your language
3. **Dashboard** - View charts/data in your language

**Status:** API configured, language switcher can be added

---

## 5️⃣ VITE_GOOGLE_VISION_API_KEY (Vision AI)

### 📁 Files Using This API:

#### ✅ **src/services/googleVision.js** (PRIMARY USAGE)
**Purpose:** Receipt scanning and OCR

**What it does:**
- Extract text from images (OCR)
- Analyze receipts for purchase items
- Detect product labels
- Estimate carbon footprint from purchases

**Code:**
```javascript
const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`);
```

**Functions available:**
- `analyzeReceipt(image)` - Extract items & estimate carbon
- `detectText(image)` - OCR text extraction
- `detectLabels(image)` - Identify objects in image

**Carbon estimation:**
- Beef: 0.027 kg CO2 per dollar
- Electronics: 0.015 kg CO2 per dollar
- Clothing: 0.012 kg CO2 per dollar
- Vegetables: 0.002 kg CO2 per dollar

---

### 🎯 User-Facing Features (Future):
1. **Receipt Scanner** - Upload receipt, auto-calculate carbon
2. **Product Analysis** - Scan product labels for carbon data
3. **Shopping Tracker** - Track carbon from purchases

**Status:** API configured, upload UI can be added

---

## 6️⃣ VITE_RECAPTCHA_SITE_KEY (reCAPTCHA v3)

### 📁 Files Using This API:

#### ✅ **Future Usage - Form Protection**
**Purpose:** Bot protection without user interaction

**What it does:**
- Invisible security (no "I'm not a robot" challenges)
- Score-based risk assessment
- Protect forms from spam
- Adaptive security

**Where it can be used:**
- Contact forms (if added)
- User feedback forms
- API endpoint protection
- Report submission

**Integration (when needed):**
```javascript
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

<GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
  <YourComponent />
</GoogleReCaptchaProvider>
```

---

### 🎯 User-Facing Features:
1. **Spam Prevention** - Protect forms from bots
2. **Security** - No annoying CAPTCHA challenges
3. **Invisible Protection** - Users don't notice it

**Status:** API configured, ready to integrate when forms are added

---

## 7️⃣ VITE_GCS_BUCKET_NAME / VITE_GCS_PROJECT_ID (Cloud Storage)

### 📁 Files Using This API:

#### ⚠️ **Not Currently Implemented - Optional**
**Purpose:** Store user-uploaded files

**What it would do:**
- Store receipt images
- Store profile pictures
- Store exported reports
- CDN delivery

**Future implementation:**
```javascript
const bucketName = import.meta.env.VITE_GCS_BUCKET_NAME;
const projectId = import.meta.env.VITE_GCS_PROJECT_ID;
// Upload files to gs://bucketName/...
```

---

### 🎯 User-Facing Features (Future):
1. **Receipt Storage** - Save scanned receipts
2. **Profile Pictures** - User avatars
3. **Export Reports** - Store generated PDFs

**Status:** API not configured, optional feature

---

## 📊 Summary - What's ACTUALLY Being Used

### ✅ Active & Fully Integrated (2):
1. **Gemini AI** - AI Assistant tab, personalized coaching
2. **Google Analytics** - Background tracking, user engagement

### ✅ Configured & Ready to Use (4):
3. **Google Maps** - Service files ready, needs UI component
4. **Google Translate** - Service files ready, needs language selector
5. **Google Vision** - Service files ready, needs upload UI
6. **reCAPTCHA** - Package installed, needs form integration

### ⚠️ Optional (1):
7. **Cloud Storage** - Not needed unless file uploads required

---

## 🎯 How to Use These APIs in Your App

### To use Maps API:
```javascript
import { calculateRouteCarbonFootprint } from './services/googleMaps';

const result = await calculateRouteCarbonFootprint(
  'San Francisco',
  'Los Angeles', 
  'driving'
);
console.log(`Carbon: ${result.carbonKg} kg`);
```

### To use Translation API:
```javascript
import { translateText } from './services/googleTranslate';

const result = await translateText('Hello World', 'es');
console.log(result.translatedText); // "Hola Mundo"
```

### To use Vision API:
```javascript
import { analyzeReceipt } from './services/googleVision';

const file = event.target.files[0]; // From file input
const result = await analyzeReceipt(file);
console.log(`Total Carbon: ${result.totalCarbon} kg`);
```

---

## 🚀 Next Steps to Activate More Features

### Phase 1 (Quick - 1 hour):
1. Add "Route Calculator" component using Maps API
2. Add language selector dropdown using Translate API

### Phase 2 (Medium - 2-3 hours):
1. Add receipt upload UI using Vision API
2. Add reCAPTCHA to any forms

### Phase 3 (Optional):
1. Set up Cloud Storage bucket
2. Add file upload features

---

**All APIs are configured and ready to use! Service files are already created - just need UI components to expose features to users.** 🎉
