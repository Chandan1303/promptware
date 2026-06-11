# 🤖 Gemini API Setup Guide

## Current Status
Your EcoGuide AI app is configured to use Google's Gemini AI for intelligent, personalized carbon footprint analysis.

---

## 🎯 Why Use Real Gemini API?

### Benefits:
- ✅ **Superior accuracy** - Natural language understanding
- ✅ **Contextual responses** - Better comprehension of user questions  
- ✅ **Personalized advice** - Tailored to user's exact situation
- ✅ **Creative suggestions** - More varied and insightful tips
- ✅ **Multi-turn conversations** - Better dialogue flow

### The app works in two modes:
1. **Real API Mode** - Uses Google Gemini AI (requires API key)
2. **Simulation Mode** - Intelligent fallback (works without API key)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your API Key

1. Visit: **https://aistudio.google.com/apikey**
2. Sign in with your Google account
3. Click **"Create API key"**
4. **IMPORTANT:** Select **"Create API key in new project"**
   - This ensures you get proper free-tier quotas (1,500 requests/day)
   - Don't use existing projects with quota issues
5. Copy the API key (starts with `AIza...`)

### Step 2: Add to Your `.env` File

```env
VITE_GEMINI_API_KEY=AIzaSy_YOUR_ACTUAL_KEY_HERE
```

### Step 3: Test It!

```bash
# Test the API connection
npm run test-api

# Or with node directly
node test-api.js
```

### Step 4: Run Your App

```bash
npm run dev
```

Visit `http://localhost:5173` and try the AI Coach Chat! 🎉

---

## 🔧 Updated Features (2026 Models)

Your app now supports the latest Gemini models with automatic fallback:

1. **gemini-2.5-flash** (Primary) - Latest stable from June 2025
2. **gemini-2.0-flash** (Fallback 1) - Released January 2025  
3. **gemini-flash-latest** (Fallback 2) - Auto-updates to latest
4. **gemini-pro-latest** (Fallback 3) - Pro version

The app automatically tries each model until one works!

---

## 🆓 Free Tier Limits

Google provides generous free quotas:
- **1,500 requests per day** (per model)
- **15 requests per minute**
- **1 million tokens per day**
- **Perfect for development and moderate usage!**

---

## ❌ Common Issues & Solutions

### Issue 1: "403 Forbidden" or "Access Denied"

**Cause:** API key from old project without proper quotas or billing

**Solution:**
1. Create a **NEW API key in a NEW project** (not existing project!)
2. Make sure billing is enabled (even for free tier)
3. Wait 2-3 minutes after creating the key

### Issue 2: "404 Not Found - Model not available"

**Cause:** Using outdated model name

**Solution:** ✅ Already fixed! Your app now uses 2026 models with auto-fallback

### Issue 3: "401 Unauthorized" with `AQ.` keys

**Cause:** Authorization keys (`AQ.`) require special setup

**Solution:** 
- Use standard API keys (`AIza...`) instead
- Select "Create API key in new project" (not "Create authorization key")

### Issue 4: "429 Quota Exceeded"

**Cause:** Hit daily/minute rate limits

**Solution:**
- Wait for quota reset (daily at midnight Pacific Time)
- Or upgrade to paid plan for higher limits
- App automatically falls back to simulation mode

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep your `.env` file in `.gitignore` (already configured)
- Never commit API keys to Git
- Restrict API key to Generative Language API only
- Set up billing alerts in Google Cloud Console

### ❌ DON'T:
- Don't share your API key publicly
- Don't hardcode keys in source files
- Don't use production keys for development

---

## 📊 Monitoring Usage

Track your API usage at:
- **Google AI Studio:** https://aistudio.google.com/apikey
- **Google Cloud Console:** https://console.cloud.google.com/apis/dashboard

---

## 🎨 How It Works

### With API Key:
```
User asks question → Gemini AI analyzes with user profile → Personalized response
```

### Without API Key (Simulation):
```
User asks question → Local logic analyzes → Rule-based response
```

Both modes work great! Real API provides more natural, creative responses.

---

## 🧪 Testing Your Setup

### Manual Test:
```bash
# Set the API key temporarily
export VITE_GEMINI_API_KEY="AIzaSy_YOUR_KEY"

# Run the test
node test-api.js
```

### Expected Output:
```
🧪 Testing Gemini API Connection...
🔑 API Key found, testing connection...
📡 Trying model: gemini-2.5-flash...
✅ SUCCESS! Gemini API is working with model: gemini-2.5-flash
📥 Response: Hello from EcoGuide AI, friend!
🌱 Your EcoGuide AI Assistant is ready!
```

---

## 💡 Tips for Best Results

1. **Use specific questions** - "How can I reduce my transport emissions?" vs "Help me"
2. **Ask follow-up questions** - Gemini understands context
3. **Request formats** - "Give me a bulleted list of..." or "Explain in 2 sentences"
4. **Leverage user data** - The AI knows your carbon footprint profile!

---

## 🆘 Need Help?

If you're still having issues:

1. **Check billing** - Even free tier requires billing enabled
2. **Create fresh project** - Old projects may have restrictions  
3. **Wait 2-3 minutes** - API changes take time to propagate
4. **Use simulation mode** - App works great without API too!

---

## 📚 Additional Resources

- **Google AI Studio:** https://aistudio.google.com
- **Gemini API Docs:** https://ai.google.dev/docs
- **Rate Limits:** https://ai.google.dev/gemini-api/docs/rate-limits
- **Pricing:** https://ai.google.dev/pricing

---

## ✨ Your App is Ready!

Whether you use real Gemini API or simulation mode, your EcoGuide AI provides valuable carbon footprint insights to help users live more sustainably! 🌍💚
