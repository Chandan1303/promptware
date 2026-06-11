# 🌱 EcoGuide AI - Your Personal AI Sustainability Coach

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.6-blue.svg)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-9.1.0-blue.svg)](https://mui.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-orange.svg)](https://ai.google.dev/)

> **Tagline:** Your Personal AI Sustainability Coach

A production-ready, intelligent Carbon Footprint Awareness Platform that helps users understand, analyze, and reduce their environmental impact through AI-powered personalized recommendations.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Assumptions Made](#-assumptions-made)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Google Services Integration](#-google-services-integration)
- [Architecture](#-architecture)
- [AI Workflow](#-ai-workflow)
- [Accessibility Features](#-accessibility-features)
- [Security Measures](#-security-measures)
- [Performance Optimizations](#-performance-optimizations)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Future Improvements](#-future-improvements)

---

## 🎯 Problem Statement

Climate change is accelerating, and individual carbon footprints play a crucial role. However, most people:
- Don't understand their personal carbon impact
- Lack actionable insights on how to reduce emissions
- Need personalized guidance based on their specific lifestyle
- Want real-time AI assistance to make sustainable choices

**Target Vertical:** Environmental Sustainability & Personal Carbon Management

---

## 💡 Solution Overview

EcoGuide AI is an intelligent web application that acts as a personal sustainability advisor, providing:

1. **Smart Carbon Analysis** - Calculates daily, monthly, and annual carbon footprints based on lifestyle questionnaires
2. **AI-Powered Coaching** - Uses Google Gemini AI to provide personalized, context-aware sustainability advice
3. **Actionable Recommendations** - Generates prioritized action plans with impact estimates and difficulty levels
4. **Predictive Modeling** - Projects future carbon emissions under different lifestyle scenarios
5. **Progress Tracking** - Monitors user commitments, goals, and historical carbon trends

### Core Differentiators:
- **Truly Personalized:** AI analyzes actual user data, not generic advice
- **Privacy-First:** All data stored locally in browser (LocalStorage)
- **No Backend Required:** Fully client-side architecture
- **Accessible:** WCAG 2.1 AA compliant with extensive accessibility features
- **Google-Powered:** Leverages Google Gemini AI and Material Design 3

---

## 📝 Assumptions Made

1. **Carbon Calculation Co-efficients**: The carbon footprint calculation uses standardized metrics (e.g., 0.2 kg CO2 per km for average gasoline cars, standard consumption averages for household utilities). Actual emissions may vary by vehicle efficiency and local utility grid resource mix.
2. **Local Storage Lifetime**: Since no backend is used, it is assumed that the user's data remains persisted in their browser's LocalStorage. Clearing browser cache/cookies will reset the user's profile and progress.
3. **API Key Fallback**: The system assumes the presence of a Gemini API key. If the key is not provided (locally or via environment variables), the app runs in an offline simulation mode with predefined data-driven patterns.
4. **Google Translate Usage**: Translating dynamic text assumes access to the Google Cloud Translation API. When not available, the application defaults back to English without throwing breaking errors.

---

## ✨ Key Features

### 1. Smart Carbon Analyzer
- **Multi-Step Questionnaire:** Transportation, Diet, Home Utilities, Shopping & Waste
- **Real-Time Calculations:** Instant carbon footprint breakdown
- **Rating System:** 5-tier "Leaf Rating" (Eco Hero → Critically High)
- **Visual Feedback:** Responsive forms with Material Design 3 components

### 2. AI Assistant (Gemini-Powered)
- **Conversational Interface:** Natural language Q&A about carbon footprint
- **Context-Aware Responses:** AI knows your specific lifestyle data
- **Preset Questions:** Quick access to common queries
- **Fallback Simulation:** Works without API key using intelligent local simulation

### 3. Personalized Action Engine
- **Dynamic Recommendations:** Actions generated from questionnaire answers
- **Impact Metrics:** Shows annual CO2 savings for each action
- **Difficulty & Priority Ratings:** Easy/Medium/Hard, High/Medium/Low
- **Filtering & Search:** Category, difficulty, and text search
- **Progress Tracking:** Mark actions as committed and track total savings

### 4. Dashboard & Visualizations
- **Carbon Score Cards:** Annual footprint, global comparison, action progress
- **Emission Breakdown:** Pie chart showing category distribution
- **Prediction Chart:** 1-year trajectory (Business as Usual vs. Eco Path)
- **Historical Trends:** Bar chart tracking carbon output over time
- **Weekly Goals:** Custom commitment tracker with add/delete/toggle

### 5. Accessibility Configuration
- **Font Size Control:** Small/Medium/Large/Extra Large options
- **High Contrast Mode:** Enhanced visibility for low vision users
- **Reduced Motion:** Disables animations for vestibular disorder support
- **Screen Reader Enhancements:** Extended ARIA labels and graph descriptions
- **Keyboard Navigation:** Full keyboard accessibility throughout

---

## 🛠 Technology Stack

### Frontend Framework
- **React 19.2.6** - Modern UI library with concurrent features
- **Vite 8.0.12** - Lightning-fast build tool and dev server

### UI/UX
- **Material-UI 9.1.0** - Google's Material Design 3 component library
- **@mui/icons-material** - Comprehensive icon set
- **Recharts 3.8.1** - Declarative charting library for data visualization

### AI & Google Services
- **@google/generative-ai 0.24.1** - Google Gemini API client
- **Google Analytics 4** - User engagement and event tracking
- **Material Design 3** - Google's design system

### Development Tools
- **Vitest 4.1.8** - Fast unit testing framework
- **@testing-library/react 16.3.2** - Component testing utilities
- **ESLint 10.3.0** - Code quality and consistency

### Styling
- **@emotion/react & @emotion/styled** - CSS-in-JS styling solution
- **Custom CSS** - Accessibility enhancements (high contrast, reduced motion)

---

## 🚀 Google Services Integration

### 1. **Gemini 1.5 Flash API** ⭐
**Purpose:** Personalized AI sustainability coaching

**Implementation:**
- Loads user carbon profile into prompt context
- Provides conversational analysis of carbon footprint
- Generates actionable reduction strategies
- Fallback to intelligent simulation if no API key

**File:** `src/services/gemini.js`

```javascript
// Context-aware prompting
const profileContext = `
[USER SUSTAINABILITY PROFILE]
- Daily Transportation: ${answers.transportType} (${answers.transportKm} km/day)
- Total Footprint: ${breakdown.total} kg CO2/year
`;
```

### 2. **Material Design 3** 🎨
**Purpose:** Google's design language for clean, accessible UI

**Implementation:**
- MUI components with Material Design 3 theming
- Dynamic dark/light mode with high contrast support
- Responsive layouts and fluid animations
- Typography system (Outfit + Inter fonts)

**File:** `src/App.jsx` - Theme configuration

### 3. **Google Analytics 4** 📊
**Purpose:** User engagement and accessibility tracking

**Implementation:**
- Custom event tracking (analyzer_calculated, goal_added, etc.)
- Privacy-compliant (no PII stored)
- Page view tracking
- Accessibility feature usage analytics

**File:** `src/services/analytics.js`

### 4. **Google Cloud Deployment** ☁️
**Recommended Platform:** Google Cloud Run or Cloud Storage + CDN

**Benefits:**
- Serverless, auto-scaling infrastructure
- Global CDN distribution
- HTTPS by default
- Cost-effective for static sites

---

## 🏗 Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                         │
├─────────────────────────────────────────────────────────┤
│  React App (Client-Side Only)                           │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Dashboard   │  │   Analyzer   │  │  AI Coach    │ │
│  └───────────────┘  └──────────────┘  └──────────────┘ │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Action Engine │  │Google Services│  │Accessibility │ │
│  └───────────────┘  └──────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────┤
│  LocalStorage (User Data + Preferences)                 │
└─────────────────────────────────────────────────────────┘
           │                              │
           ↓                              ↓
   ┌────────────────┐           ┌─────────────────┐
   │ Gemini AI API  │           │ Google Analytics│
   │ (Coaching)     │           │ (Tracking)      │
   └────────────────┘           └─────────────────┘
```

### Data Flow

1. **User Input** → Carbon Analyzer questionnaire
2. **Calculation** → `carbonCalculations.js` computes footprint
3. **Storage** → LocalStorage saves answers + results
4. **AI Analysis** → Gemini API receives context + user question
5. **Recommendations** → Action Engine generates prioritized tasks
6. **Visualization** → Recharts renders Dashboard graphs
7. **Tracking** → Google Analytics logs user interactions

### State Management

- **React Context API** for global state:
  - `CarbonContext` - Carbon data, actions, goals
  - `AuthContext` - User session (optional login)
- **LocalStorage** for persistence:
  - `ecoguide_answers` - Questionnaire responses
  - `ecoguide_actions` - Action commitments
  - `ecoguide_goals` - Weekly goals
  - `ecoguide_history` - Historical carbon data
  - `eco_*` - Accessibility preferences

---

## 🤖 AI Workflow

### Gemini Integration Process

1. **Context Building**
```javascript
const profileContext = `
[USER SUSTAINABILITY PROFILE]
- Transportation: ${transportType} (${km} km/day) → ${transport} kg CO2/year
- Diet: ${diet} → ${food} kg CO2/year
- Utilities: ${electricity} + ${water} → ${utilities} kg CO2/year
- Shopping: ${shopping} → ${shopping} kg CO2/year
- Waste: ${waste} → ${waste} kg CO2/year
- TOTAL: ${total} kg CO2/year
`;
```

2. **System Instructions**
```javascript
const systemInstruction = `
You are EcoGuide AI, an elite carbon footprint analyst.
- Provide personalized, actionable advice
- Use user profile data directly
- Be encouraging and professional
- Format responses in Markdown
- Limit to 2-3 impactful paragraphs
`;
```

3. **Query Processing**
- User asks question (e.g., "Why is my footprint high?")
- Context + question sent to Gemini API
- AI analyzes lifestyle data
- Returns personalized response

4. **Fallback Simulation**
- If no API key, local simulation activates
- Pattern matching on common queries
- Data-driven responses using actual carbon values
- Maintains user experience without external API

### Example AI Responses

**Query:** "Why is my carbon footprint high?"

**Response:**
```markdown
### Understanding Your Carbon Footprint

Your annual footprint is **4,850 kg CO2/year**.

The main contributor is **Transportation** at **2,190 kg CO2/year**,
driven by your car usage (30 km/day) and mixed diet.

Key areas pushing your footprint up:
1. **Transportation**: High carbon output from daily car commutes
2. **Diet**: Mixed diet including regular meat consumption
3. **Utilities**: Medium electricity + water usage

To make immediate impact, focus on Transportation by carpooling
2 days/week or switching to public transit.
```

---

## ♿ Accessibility Features (WCAG 2.1 AA Compliant)

### Visual Accessibility
- ✅ **Font Size Control** - 4 levels (14px → 20px)
- ✅ **High Contrast Mode** - Enhanced color contrast ratios
- ✅ **Color-Independent UI** - Icons + text labels (not just color)
- ✅ **Focus Indicators** - Visible 3px outlines on all interactive elements
- ✅ **Minimum Touch Targets** - 44x44px buttons for mobile

### Motor Accessibility
- ✅ **Full Keyboard Navigation** - Tab, Enter, Space, Arrow keys
- ✅ **Skip Links** - "Skip to main content" at page top
- ✅ **Large Click Areas** - Generous padding on buttons/links
- ✅ **No Time Limits** - Users can take unlimited time on forms

### Cognitive Accessibility
- ✅ **Clear Language** - Simple, direct instructions
- ✅ **Progressive Disclosure** - Multi-step forms (4 steps)
- ✅ **Consistent Navigation** - Predictable menu structure
- ✅ **Error Prevention** - Validation before submission

### Screen Reader Support
- ✅ **ARIA Labels** - Comprehensive labeling on all inputs
- ✅ **ARIA Live Regions** - Dynamic content announcements
- ✅ **Semantic HTML** - Proper heading hierarchy (h1→h6)
- ✅ **Alt Text** - Descriptive labels for icons
- ✅ **Graph Descriptions** - Text summaries of charts (optional)

### Motion Sensitivity
- ✅ **Reduced Motion Mode** - Disables animations
- ✅ **prefers-reduced-motion** - Respects OS setting
- ✅ **Static Alternatives** - No auto-playing content

### Testing Methods
- Manual keyboard navigation testing
- Screen reader testing (NVDA/JAWS simulation)
- Color contrast verification (4.5:1 minimum)
- Lighthouse accessibility audits

**Note:** Full WCAG validation requires expert review and assistive technology testing.

---

## 🔒 Security Measures

### Data Privacy
- ✅ **Local-Only Storage** - No data sent to backend servers
- ✅ **No PII Collection** - Analytics tracks events, not personal info
- ✅ **Client-Side Processing** - All calculations in browser
- ✅ **No Cookies** - Uses LocalStorage only

### API Security
- ✅ **Environment Variables** - API keys in `.env` (not committed)
- ✅ **API Key Validation** - Checks before requests
- ✅ **Rate Limiting Awareness** - Gemini API has built-in limits
- ✅ **Error Handling** - Graceful degradation on API failures

### Input Validation
- ✅ **Type Checking** - Number inputs validated
- ✅ **Range Validation** - Min/max constraints on forms
- ✅ **XSS Prevention** - React escapes user input automatically
- ✅ **Sanitization** - No direct HTML injection

### Dependency Security
- ✅ **Minimal Dependencies** - Only essential packages
- ✅ **Version Pinning** - Exact versions in package.json
- ✅ **Regular Updates** - Latest stable versions
- ✅ **No Deprecated Packages** - Modern, maintained libraries

### Code Security
- ✅ **ESLint Rules** - Catches common vulnerabilities
- ✅ **No Eval/InnerHTML** - Safe code practices
- ✅ **HTTPS Only** - Production deployment on HTTPS
- ✅ **CSP Headers** - Content Security Policy (deployment)

---

## ⚡ Performance Optimizations

### Build Optimizations
- ✅ **Vite Build Tool** - Fast HMR and optimized bundles
- ✅ **Code Splitting** - Dynamic imports for large components
- ✅ **Tree Shaking** - Removes unused code
- ✅ **Minification** - Terser for JS, CSS minimizer
- ✅ **Compression** - Gzip/Brotli in production

### Runtime Optimizations
- ✅ **React Memoization** - `useMemo` for expensive calculations
- ✅ **Lazy Loading** - Charts load on demand
- ✅ **Efficient Rerenders** - Context optimization
- ✅ **LocalStorage Caching** - Reduces recalculations

### Asset Optimizations
- ✅ **SVG Icons** - Vector graphics (scalable, small)
- ✅ **Font Optimization** - Google Fonts with display=swap
- ✅ **Image Optimization** - Compressed assets
- ✅ **Minimal Bundle Size** - <500KB initial load

### Monitoring
- ✅ **Lighthouse Audits** - Target: 95+ performance score
- ✅ **Core Web Vitals** - LCP, FID, CLS optimized
- ✅ **Bundle Analysis** - Regular size audits

### Target Metrics
- **Initial Load:** <2 seconds
- **Time to Interactive:** <3 seconds
- **Bundle Size:** <500KB (gzipped)
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (recommended: 20.x)
- **npm** 9+ or **yarn** 1.22+
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ecoguide-ai.git
cd ecoguide-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Getting API Keys:**
- **Gemini API:** https://makersuite.google.com/app/apikey
- **Google Analytics:** https://analytics.google.com/ → Admin → Data Streams

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Run linter
npm run lint

# Run tests in watch mode
npm run test:watch
```

---

## 🌐 Deployment

### Option 1: Google Cloud Run (Recommended)

1. **Build Docker image**
```bash
docker build -t ecoguide-ai .
```

2. **Push to Google Container Registry**
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ecoguide-ai
```

3. **Deploy to Cloud Run**
```bash
gcloud run deploy ecoguide-ai \
  --image gcr.io/YOUR_PROJECT_ID/ecoguide-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: Google Cloud Storage + CDN

1. **Build production bundle**
```bash
npm run build
```

2. **Create Cloud Storage bucket**
```bash
gsutil mb gs://ecoguide-ai
gsutil web set -m index.html -e index.html gs://ecoguide-ai
```

3. **Upload files**
```bash
gsutil -m cp -r dist/* gs://ecoguide-ai
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://ecoguide-ai/**
```

4. **Make bucket public**
```bash
gsutil iam ch allUsers:objectViewer gs://ecoguide-ai
```

### Option 3: Vercel/Netlify (Alternative)

```bash
# Vercel
npm install -g vercel
vercel deploy

# Netlify
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables in Production
Set via platform-specific methods:
- **Cloud Run:** `--set-env-vars` flag
- **Vercel/Netlify:** Dashboard → Settings → Environment Variables

---

## 🧪 Testing

### Test Coverage
- **Unit Tests:** Carbon calculations, utility functions
- **Component Tests:** Dashboard, Analyzer, AI Assistant
- **Accessibility Tests:** ARIA labels, keyboard navigation
- **Integration Tests:** Context providers, data flow

### Running Tests

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test -- --coverage

# Run specific test file
npm run test src/tests/carbonCalculations.test.js

# Watch mode for development
npm run test -- --watch
```

### Test Files
- `src/tests/carbonCalculations.test.js` - Calculation logic
- `src/tests/CarbonAnalyzer.test.jsx` - Analyzer component
- `src/tests/Dashboard.test.jsx` - Dashboard component
- `src/tests/setup.js` - Test configuration

### Coverage Target
- **Statements:** 90%+
- **Branches:** 85%+
- **Functions:** 90%+
- **Lines:** 90%+

---

## 📁 Project Structure

```
ecoguide-ai/
├── public/
│   ├── favicon.svg              # App icon
│   └── icons.svg                # SVG icon sprites
├── src/
│   ├── assets/                  # Static assets
│   ├── components/
│   │   ├── AccessibilityConfig.jsx  # A11y settings panel
│   │   ├── ActionEngine.jsx         # Recommendations view
│   │   ├── AIAssistant.jsx          # Gemini chat interface
│   │   ├── CarbonAnalyzer.jsx       # Questionnaire form
│   │   ├── Dashboard.jsx            # Main dashboard
│   │   ├── GoogleTech.jsx           # Google services info
│   │   ├── Layout.jsx               # App shell
│   │   └── Navigation.jsx           # Sidebar menu
│   ├── context/
│   │   ├── AuthContext.jsx          # User auth state
│   │   └── CarbonContext.jsx        # Carbon data state
│   ├── services/
│   │   ├── analytics.js             # Google Analytics
│   │   └── gemini.js                # Gemini API client
│   ├── tests/
│   │   ├── carbonCalculations.test.js
│   │   ├── CarbonAnalyzer.test.jsx
│   │   ├── Dashboard.test.jsx
│   │   └── setup.js
│   ├── utils/
│   │   └── carbonCalculations.js    # Core logic
│   ├── App.css                  # Global styles
│   ├── App.jsx                  # Root component
│   ├── index.css                # Base styles
│   └── main.jsx                 # Entry point
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── README.md                    # This file
└── vite.config.js               # Vite configuration
```

---

## 🔮 Future Improvements

### Phase 2 Features
- [ ] **Multi-Language Support** - i18n for global reach
- [ ] **Export Reports** - PDF carbon reports
- [ ] **Social Sharing** - Share achievements on social media
- [ ] **Leaderboards** - Community carbon reduction challenges
- [ ] **Gamification** - Badges, streaks, achievement system

### Technical Enhancements
- [ ] **Progressive Web App** - Offline support, installable
- [ ] **Service Workers** - Caching, background sync
- [ ] **TypeScript Migration** - Type safety
- [ ] **E2E Testing** - Playwright/Cypress tests
- [ ] **CI/CD Pipeline** - Automated testing + deployment

### AI Enhancements
- [ ] **Image Analysis** - Upload receipts for carbon tracking
- [ ] **Voice Interface** - Voice commands for accessibility
- [ ] **Predictive Recommendations** - ML-based suggestions
- [ ] **Trend Analysis** - Long-term pattern recognition

### Integrations
- [ ] **Carbon Offset APIs** - Direct offset purchases
- [ ] **Smart Home Integration** - Real-time energy tracking
- [ ] **Transportation APIs** - Google Maps route carbon
- [ ] **E-commerce Integration** - Carbon labels on products

---

## 📄 License

MIT License - feel free to use this project for learning and hackathons.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for conversational intelligence
- **Material-UI** for beautiful, accessible components
- **Recharts** for elegant data visualization
- **React Team** for the amazing framework
- **Vite** for blazing-fast development experience

---

## 📞 Contact & Support

- **GitHub Issues:** [Report bugs](https://github.com/your-username/ecoguide-ai/issues)
- **Documentation:** This README
- **Demo:** [Live Demo Link](https://your-demo-url.com)

---

**Built with ❤️ and ♻️ for a sustainable future**

*EcoGuide AI - Making sustainability personal, actionable, and intelligent.*
