# 🔑 Complete Guide: How to Get All Google API Keys

## Overview
You need **6 API keys** total. Follow these steps for each service.

---

## ✅ 1. Google Gemini AI (DONE!)

**Status:** ✅ Already have it!

```env
VITE_GEMINI_API_KEY=AIzaSyB-pJuo4X7CUmTC4_YC7YPeRzfj3poOsw0
```

---

## 📊 2. Google Analytics 4

**What it does:** Tracks user engagement, events, and analytics

### Step-by-Step:

1. **Go to Google Analytics**
   - Visit: https://analytics.google.com/

2. **Sign in** with your Google account

3. **Create a Property** (if you don't have one)
   - Click "Admin" (bottom left gear icon)
   - Click "Create Property"
   - Enter property name: `EcoGuide AI`
   - Click "Next"

4. **Create a Data Stream**
   - Select "Web"
   - Enter website URL: `http://localhost:5173` (for development)
   - Enter stream name: `EcoGuide AI Dev`
   - Click "Create stream"

5. **Copy Measurement ID**
   - You'll see: `G-XXXXXXXXXX`
   - Copy this ID

6. **Add to .env**
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

**Time:** 3-5 minutes  
**Cost:** FREE (forever)

---

## 🗺️ 3. Google Maps API

**What it does:** Calculate carbon footprint for routes, place autocomplete

### Step-by-Step:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project** (if you don't have one)
   - Click project dropdown (top bar)
   - Click "New Project"
   - Project name: `EcoGuide AI`
   - Click "Create"

3. **Enable APIs**
   - Go to: https://console.cloud.google.com/apis/library
   - Search and enable these 4 APIs:
     - ✅ Maps JavaScript API
     - ✅ Places API
     - ✅ Distance Matrix API
     - ✅ Geocoding API

4. **Create API Key**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API key"
   - Copy the key (starts with `AIza`)

5. **Restrict the Key (IMPORTANT for security)**
   - Click the key you just created
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add: `http://localhost:5173/*` (for dev)
     - Add: `https://yourdomain.com/*` (for production)
   - Under "API restrictions":
     - Select "Restrict key"
     - Select the 4 APIs you enabled above
   - Click "Save"

6. **Add to .env**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
   ```

**Time:** 5-7 minutes  
**Cost:** FREE ($200 monthly credit)

---

## 🌍 4. Google Cloud Translation API

**What it does:** Translate text to 100+ languages

### Step-by-Step:

1. **Enable Translation API**
   - Go to: https://console.cloud.google.com/apis/library/translate.googleapis.com
   - Click "Enable"

2. **Create API Key**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API key"
   - Copy the key

3. **Restrict the Key**
   - Click the key
   - Under "API restrictions":
     - Select "Restrict key"
     - Select "Cloud Translation API"
   - Click "Save"

4. **Add to .env**
   ```env
   VITE_GOOGLE_TRANSLATE_API_KEY=AIzaSy...
   ```

**Time:** 3 minutes  
**Cost:** FREE (500,000 characters/month)

---

## 📷 5. Google Cloud Vision API

**What it does:** OCR text extraction, receipt analysis

### Step-by-Step:

1. **Enable Vision API**
   - Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com
   - Click "Enable"

2. **Create API Key**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API key"
   - Copy the key

3. **Restrict the Key**
   - Click the key
   - Under "API restrictions":
     - Select "Restrict key"
     - Select "Cloud Vision API"
   - Click "Save"

4. **Add to .env**
   ```env
   VITE_GOOGLE_VISION_API_KEY=AIzaSy...
   ```

**Time:** 3 minutes  
**Cost:** FREE (1,000 requests/month)

---

## 🔒 6. Google reCAPTCHA v3

**What it does:** Bot protection without user interaction

### Step-by-Step:

1. **Go to reCAPTCHA Admin**
   - Visit: https://www.google.com/recaptcha/admin

2. **Register a New Site**
   - Click the "+" button
   - Label: `EcoGuide AI`
   - reCAPTCHA type: Select **"reCAPTCHA v3"**
   - Domains:
     - Add: `localhost` (for development)
     - Add: `yourdomain.com` (for production)
   - Accept terms
   - Click "Submit"

3. **Copy Site Key** (NOT Secret Key!)
   - You'll see two keys:
     - ✅ **Site key** - This is what you need (use in browser)
     - ❌ Secret key - Don't use this in .env (backend only)
   - Copy the **Site key**

4. **Add to .env**
   ```env
   VITE_RECAPTCHA_SITE_KEY=6Lc...
   ```

**Time:** 2 minutes  
**Cost:** FREE (1 million assessments/month)

---

## 💾 7. Google Cloud Storage (Optional)

**What it does:** Store user-uploaded files

### Step-by-Step:

1. **Create a Bucket**
   - Go to: https://console.cloud.google.com/storage
   - Click "Create Bucket"
   - Bucket name: `ecoguide-ai-uploads` (must be globally unique)
   - Location: Choose nearest region
   - Storage class: Standard
   - Access control: Fine-grained
   - Click "Create"

2. **Set CORS** (allow browser uploads)
   - Click your bucket
   - Click "Permissions" tab
   - Click "CORS" → "Edit CORS configuration"
   - Add this JSON:
   ```json
   [
     {
       "origin": ["http://localhost:5173", "https://yourdomain.com"],
       "method": ["GET", "POST", "PUT"],
       "responseHeader": ["Content-Type"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   - Click "Save"

3. **Get Project ID**
   - Go to: https://console.cloud.google.com/
   - Look at top bar for project dropdown
   - Your project ID is shown there

4. **Add to .env**
   ```env
   VITE_GCS_BUCKET_NAME=ecoguide-ai-uploads
   VITE_GCS_PROJECT_ID=your-project-id
   ```

**Time:** 5 minutes  
**Cost:** FREE (5GB storage/month)

---

## 📝 Your Complete .env File

After getting all keys, your `.env` should look like this:

```env
# ==================================================
# EcoGuide AI - Environment Variables
# ==================================================

# ===== GOOGLE GEMINI AI API ===== ✅
VITE_GEMINI_API_KEY=AIzaSyB-pJuo4X7CUmTC4_YC7YPeRzfj3poOsw0

# ===== GOOGLE ANALYTICS 4 =====
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ===== GOOGLE MAPS API =====
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...

# ===== GOOGLE TRANSLATE API =====
VITE_GOOGLE_TRANSLATE_API_KEY=AIzaSy...

# ===== GOOGLE VISION API =====
VITE_GOOGLE_VISION_API_KEY=AIzaSy...

# ===== GOOGLE RECAPTCHA v3 =====
VITE_RECAPTCHA_SITE_KEY=6Lc...

# ===== GOOGLE CLOUD STORAGE (Optional) =====
VITE_GCS_BUCKET_NAME=ecoguide-ai-uploads
VITE_GCS_PROJECT_ID=your-project-id
```

---

## ⚡ Quick Setup Order

### Minimum (App works with just these):
1. ✅ VITE_GEMINI_API_KEY (already done!)
2. VITE_GA_MEASUREMENT_ID

**Time:** 3 minutes total  
**Features:** AI coaching + analytics

### Recommended (Full features):
1. ✅ VITE_GEMINI_API_KEY (already done!)
2. VITE_GA_MEASUREMENT_ID
3. VITE_GOOGLE_MAPS_API_KEY
4. VITE_RECAPTCHA_SITE_KEY

**Time:** 15 minutes total  
**Features:** AI + analytics + maps + security

### Complete (All services):
All 8 keys above

**Time:** 30 minutes total  
**Features:** Everything!

---

## 🔐 Security Tips

1. **Never commit .env file**
   - Already in `.gitignore` ✅

2. **Restrict all API keys**
   - Add domain restrictions
   - Limit to specific APIs

3. **Monitor usage**
   - Set up billing alerts
   - Check quota usage regularly

4. **Rotate keys periodically**
   - Create new keys every 3-6 months
   - Delete old keys

5. **Different keys for dev/prod**
   - Use separate keys for development and production
   - Easier to track and manage

---

## 💰 Total Cost Summary

| Service | Free Tier | Cost After Free Tier |
|---------|-----------|---------------------|
| Gemini AI | 1,500 req/day | $0.00025/request |
| Analytics | Unlimited | Always FREE |
| Maps | $200/month | Pay-as-you-go |
| Translate | 500K chars/month | $20/million chars |
| Vision | 1,000 req/month | $1.50/1K requests |
| reCAPTCHA | 1M/month | Always FREE |
| Cloud Storage | 5GB | $0.02/GB/month |

**Expected monthly cost:**
- Hobby/Dev: **$0** (free tier covers it)
- Small app: **$5-15**
- Medium app: **$50-100**

---

## 🆘 Troubleshooting

### "API not enabled"
→ Go to APIs Library and enable the specific API

### "API key invalid"
→ Check you copied the entire key (no spaces)

### "Quota exceeded"
→ Enable billing or wait for quota reset

### "Access denied"
→ Add domain restrictions properly

### "Key not found in environment"
→ Restart dev server: `npm run dev`

---

## ✅ Verification

After adding keys, verify they work:

1. **Restart dev server**
   ```bash
   npm run dev
   ```

2. **Visit the app**
   - Go to: http://localhost:5173/

3. **Check Google Services page**
   - Go to: http://localhost:5173/google-services
   - You should see green "Active" chips for configured services

4. **Test features**
   - Try AI Assistant (Gemini)
   - Check if Maps loads (if configured)
   - Test translations (if configured)

---

## 📞 Need Help?

**Common Issues:**
- Can't find API in console? Search for it in APIs Library
- Billing required? Some APIs need billing enabled (still free tier)
- Key not working? Make sure API is enabled first

**Documentation Links:**
- Gemini: https://ai.google.dev/docs
- Maps: https://developers.google.com/maps/documentation
- Translation: https://cloud.google.com/translate/docs
- Vision: https://cloud.google.com/vision/docs
- reCAPTCHA: https://developers.google.com/recaptcha/docs/v3

---

**Total Time to Get All Keys:** 20-30 minutes  
**Total Cost:** $0/month (free tier)  
**Difficulty:** Easy 😊

Good luck! 🚀
