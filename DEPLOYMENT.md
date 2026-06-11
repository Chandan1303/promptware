# 🚀 Deployment Guide

Complete guide for deploying EcoGuide AI to Google Cloud Platform.

---

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed: https://cloud.google.com/sdk/docs/install
3. **Docker** installed (for local testing)
4. **Project built**: Run `npm run build` successfully

---

## Option 1: Google Cloud Run (Recommended)

### Step 1: Setup Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create new project (or use existing)
gcloud projects create ecoguide-ai-prod --name="EcoGuide AI"

# Set as active project
gcloud config set project ecoguide-ai-prod

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.gcr.io
gcloud services enable cloudbuild.googleapis.com
```

### Step 2: Configure Environment Variables

Create `cloudbuild.yaml` substitutions or set them directly:

```bash
# Option A: Using gcloud secrets (recommended for production)
echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key --data-file=-
echo -n "G-XXXXXXXXXX" | gcloud secrets create ga-measurement-id --data-file=-

# Option B: Set as build substitutions in cloudbuild.yaml
# Edit cloudbuild.yaml and update _GEMINI_API_KEY and _GA_MEASUREMENT_ID
```

### Step 3: Build and Deploy

**Method A: Using Cloud Build (Automated)**

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Build will automatically:
# 1. Build Docker image
# 2. Push to Container Registry
# 3. Deploy to Cloud Run
```

**Method B: Manual Docker Build**

```bash
# Build Docker image locally
docker build -t gcr.io/ecoguide-ai-prod/ecoguide-ai:v1 .

# Test locally (optional)
docker run -p 8080:8080 gcr.io/ecoguide-ai-prod/ecoguide-ai:v1

# Push to Google Container Registry
docker push gcr.io/ecoguide-ai-prod/ecoguide-ai:v1

# Deploy to Cloud Run
gcloud run deploy ecoguide-ai \
  --image gcr.io/ecoguide-ai-prod/ecoguide-ai:v1 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

### Step 4: Get Deployment URL

```bash
# Cloud Run will output the URL, or retrieve it:
gcloud run services describe ecoguide-ai --region us-central1 --format 'value(status.url)'

# Example output: https://ecoguide-ai-xxxxxxxxx-uc.a.run.app
```

### Step 5: Configure Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service ecoguide-ai \
  --domain ecoguide.example.com \
  --region us-central1

# Follow DNS instructions provided by Cloud Run
```

---

## Option 2: Google Cloud Storage + CDN

Perfect for static hosting with global CDN.

### Step 1: Build Production Assets

```bash
npm run build
# Output will be in dist/ directory
```

### Step 2: Create Cloud Storage Bucket

```bash
# Create bucket (name must be globally unique)
gsutil mb gs://ecoguide-ai-app

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://ecoguide-ai-app

# Configure for website hosting
gsutil web set -m index.html -e index.html gs://ecoguide-ai-app
```

### Step 3: Upload Files

```bash
# Upload all files from dist/
gsutil -m cp -r dist/* gs://ecoguide-ai-app

# Set cache control for assets (1 year for hashed files)
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" \
  gs://ecoguide-ai-app/assets/**

# Set cache control for index.html (no cache)
gsutil setmeta -h "Cache-Control:no-cache, no-store, must-revalidate" \
  gs://ecoguide-ai-app/index.html
```

### Step 4: Enable Cloud CDN (Optional)

```bash
# Create load balancer with CDN
gcloud compute backend-buckets create ecoguide-backend \
  --gcs-bucket-name=ecoguide-ai-app \
  --enable-cdn

# Create URL map
gcloud compute url-maps create ecoguide-url-map \
  --default-backend-bucket=ecoguide-backend

# Create target HTTP proxy
gcloud compute target-http-proxies create ecoguide-http-proxy \
  --url-map=ecoguide-url-map

# Create forwarding rule
gcloud compute forwarding-rules create ecoguide-forwarding-rule \
  --global \
  --target-http-proxy=ecoguide-http-proxy \
  --ports=80
```

### Step 5: Get URL

```bash
# Bucket URL (direct)
echo "http://ecoguide-ai-app.storage.googleapis.com"

# With load balancer (get IP)
gcloud compute forwarding-rules describe ecoguide-forwarding-rule --global --format="value(IPAddress)"
```

---

## Option 3: Vercel (Quick Alternative)

Fastest deployment for testing:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# VITE_GEMINI_API_KEY
# VITE_GA_MEASUREMENT_ID
```

---

## Environment Variables

### Required

- `VITE_GEMINI_API_KEY` - Get from: https://makersuite.google.com/app/apikey

### Optional

- `VITE_GA_MEASUREMENT_ID` - Format: `G-XXXXXXXXXX`

### Setting in Cloud Run

```bash
gcloud run services update ecoguide-ai \
  --region us-central1 \
  --set-env-vars="VITE_GEMINI_API_KEY=your-key-here,VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX"
```

---

## CI/CD Setup

### GitHub Actions + Cloud Run

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ecoguide-ai-prod
      
      - name: Build and Deploy
        run: |
          gcloud builds submit --config cloudbuild.yaml
```

---

## Monitoring & Logs

### View Logs

```bash
# Cloud Run logs
gcloud run services logs read ecoguide-ai --region us-central1 --limit 50

# Follow logs in real-time
gcloud run services logs tail ecoguide-ai --region us-central1
```

### Monitoring Dashboard

- **Cloud Console**: https://console.cloud.google.com/run
- **Metrics**: Request count, latency, error rate, CPU/memory usage

---

## Cost Estimation

### Cloud Run Pricing (us-central1)

- **Free Tier**: 2 million requests/month
- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million

**Estimated Monthly Cost** (10,000 users, 5 page views each):
- Requests: 50,000 → **Free**
- CPU/Memory: ~$2-5
- **Total: $2-5/month**

### Cloud Storage + CDN

- **Storage**: $0.020 per GB/month
- **Bandwidth**: $0.12 per GB (first 10 TB)
- **CDN Cache Egress**: $0.08 per GB (first 10 TB)

**Estimated Monthly Cost** (1M page views):
- Storage (1GB): $0.02
- Bandwidth (50GB): $6
- **Total: ~$6/month**

---

## Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')

# Common issues:
# - Missing dependencies: Run npm install locally
# - Build errors: Run npm run build locally first
# - Memory limits: Increase machine type in cloudbuild.yaml
```

### Deployment Fails

```bash
# Check service status
gcloud run services describe ecoguide-ai --region us-central1

# Common issues:
# - Port mismatch: Ensure Dockerfile exposes port 8080
# - Health check fails: Add HEALTHCHECK to Dockerfile
# - Permissions: Enable Cloud Run API
```

### Application Errors

```bash
# Check logs
gcloud run services logs read ecoguide-ai --region us-central1

# Common issues:
# - Missing env vars: Set VITE_* variables
# - CORS errors: Configure nginx headers if needed
# - 404 on routes: Ensure SPA routing configured
```

---

## Security Checklist

- [ ] Environment variables set securely (Cloud Secrets Manager)
- [ ] HTTPS enforced (automatic with Cloud Run)
- [ ] IAM permissions configured (least privilege)
- [ ] API keys restricted (HTTP referrer restrictions)
- [ ] Cloud Armor enabled (DDoS protection)
- [ ] Security headers configured (CSP, HSTS)

---

## Rollback

```bash
# List revisions
gcloud run revisions list --service ecoguide-ai --region us-central1

# Rollback to previous revision
gcloud run services update-traffic ecoguide-ai \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

---

## Support

For deployment issues:
- **Google Cloud Support**: https://cloud.google.com/support
- **Community**: https://stackoverflow.com/questions/tagged/google-cloud-run
- **Documentation**: https://cloud.google.com/run/docs

---

**Happy Deploying! 🚀**
