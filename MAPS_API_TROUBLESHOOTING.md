# 🗺️ Google Maps API Troubleshooting Guide

## Error: "InvalidKeyMapError"

This error means your API key exists but has restrictions that block localhost.

---

## ✅ Quick Fix Steps

### Step 1: Check API Key Settings

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Find your key: `AIzaSyDln_279CvlYrmToNv8bMvxVj_FrOodIJAs`
3. Click on it

### Step 2: Check "Application Restrictions"

You'll see one of these options:

#### Option A: "None" (Unrestricted)
✅ **This is fine for development**
- If already set to "None", wait 2-3 minutes for propagation
- Then refresh your browser

#### Option B: "HTTP referrers (web sites)"
⚠️ **Need to add localhost**

Add these referrers:
```
http://localhost:*
http://localhost:5173/*
http://127.0.0.1:*
http://127.0.0.1:5173/*
```

**How to add:**
1. Click "+ ADD AN ITEM"
2. Paste one referrer at a time
3. Click "DONE"
4. Click "SAVE" at bottom
5. Wait 2-3 minutes

#### Option C: "IP addresses"
⚠️ **Change to "None" or "HTTP referrers"**
- IP restrictions don't work for JavaScript API

---

### Step 3: Check "API Restrictions"

Scroll down to **"API restrictions"** section:

#### Option A: "Don't restrict key"
✅ **This is fine for development**

#### Option B: "Restrict key"
✅ **Make sure these APIs are selected:**
- Maps JavaScript API ✅
- Directions API ✅
- Places API ✅
- Geocoding API ✅
- Distance Matrix API ✅

If any are missing:
1. Check the boxes
2. Click "SAVE"
3. Wait 2-3 minutes

---

### Step 4: Verify APIs Are Enabled

1. Go to: **https://console.cloud.google.com/apis/dashboard**
2. Check if these show "API enabled":
   - ✅ **Maps JavaScript API**
   - ✅ **Directions API**
   - ✅ **Places API**
   - ✅ **Geocoding API**

If any are missing:
1. Click "ENABLE APIS AND SERVICES"
2. Search for the API name
3. Click "ENABLE"

---

## 🧪 Test After Changes

1. **Wait 2-3 minutes** (API changes take time to propagate)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Reload app** (Ctrl+R or F5)
4. Try route calculation again

---

## 🔍 Common Issues

### Issue 1: "API key not valid"
**Cause:** Wrong API key format or deleted key
**Fix:** Generate new key in Google Cloud Console

### Issue 2: "InvalidKeyMapError" 
**Cause:** HTTP referrer restrictions blocking localhost
**Fix:** Add localhost referrers (see Step 2)

### Issue 3: "REQUEST_DENIED"
**Cause:** Maps JavaScript API not enabled
**Fix:** Enable it in API Library (see Step 4)

### Issue 4: Works in production but not localhost
**Cause:** Referrer restrictions only allow production domain
**Fix:** Add localhost to allowed referrers

### Issue 5: "Billing not enabled"
**Cause:** Google Maps requires billing account
**Fix:** 
1. Go to: https://console.cloud.google.com/billing
2. Link a billing account
3. Don't worry - **$200/month free credit** covers most development use

---

## 📋 Recommended Settings for Development

```
Application restrictions: None
API restrictions: Don't restrict key (or select all Maps APIs)
Referrers: Not applicable when "None" is selected
Billing: Must be enabled
```

## 📋 Recommended Settings for Production

```
Application restrictions: HTTP referrers
Allowed referrers:
  - https://yourdomain.com/*
  - https://www.yourdomain.com/*
  
API restrictions: Restrict key
Allowed APIs:
  ✅ Maps JavaScript API
  ✅ Directions API
  ✅ Places API
  ✅ Geocoding API
  
Billing: Enabled
```

---

## 🆘 Still Not Working?

### Check Browser Console

Press **F12** → **Console** tab

Look for one of these errors:

1. **"InvalidKeyMapError"** → Referrer restriction issue
2. **"API key not valid"** → Wrong key or deleted
3. **"REQUEST_DENIED"** → API not enabled
4. **"OVER_QUERY_LIMIT"** → Too many requests (billing issue)

### Try This Test URL

Open in browser:
```
https://maps.googleapis.com/maps/api/js?key=AIzaSyDln_279CvlYrmToNv8bMvxVj_FrOodIJAs&libraries=places
```

**Expected result:**
- Should load without errors
- Shows JavaScript code

**If you see error:**
- Check the error message for clues
- Usually referrer or billing issue

---

## ✅ Current Configuration Check

Your key: `AIzaSyDln_279CvlYrmToNv8bMvxVj_FrOodIJAs`

**To verify settings:**

1. **Check Application Restrictions:**
   - [ ] Set to "None" (easiest for dev)
   - [ ] OR has `http://localhost:*` in referrers

2. **Check API Restrictions:**
   - [ ] "Don't restrict key" (easiest for dev)  
   - [ ] OR has Maps JavaScript API selected

3. **Check APIs Enabled:**
   - [ ] Maps JavaScript API enabled
   - [ ] Directions API enabled
   - [ ] Places API enabled

4. **Check Billing:**
   - [ ] Billing account linked to project

5. **Wait Time:**
   - [ ] Waited 2-3 minutes after any changes

---

## 🎯 Quickest Fix (For Development)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your API key
3. **Application restrictions:** Select **"None"**
4. **API restrictions:** Select **"Don't restrict key"**
5. Click **SAVE**
6. Wait **3 minutes**
7. Clear browser cache
8. Reload app

This removes all restrictions - fine for development!

---

## 📞 Need More Help?

**Google Maps API Documentation:**
https://developers.google.com/maps/documentation/javascript/error-messages

**API Key Best Practices:**
https://developers.google.com/maps/api-security-best-practices

**Billing FAQ:**
https://developers.google.com/maps/billing-and-pricing/billing

---

**After fixing, the Route Calculator should work perfectly!** 🗺️✅
