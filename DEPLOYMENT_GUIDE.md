# Deployment Guide - Google Cloud Run

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed and authenticated
3. **Docker** installed (for local testing)
4. **GitHub Repository** (already set up)

## Security Best Practices

### ⚠️ NEVER commit API keys to Git
- API keys are stored in `.env` file (which is git-ignored)
- Use Cloud Run environment variables for production
- Use GitHub Secrets for CI/CD pipelines

## Deployment Options

### Option 1: Manual Deployment (Recommended for first deploy)

```bash
# 1. Authenticate with Google Cloud
gcloud auth login

# 2. Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# 3. Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# 4. Build and submit
gcloud builds submit --tag gcr.io/$PROJECT_ID/ecoguide-ai

# 5. Deploy to Cloud Run
gcloud run deploy ecoguide-ai \
  --image gcr.io/$PROJECT_ID/ecoguide-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080 \
  --set-env-vars VITE_GEMINI_API_KEY=YOUR_KEY_HERE,\
VITE_GA_MEASUREMENT_ID=YOUR_GA_ID,\
VITE_GOOGLE_MAPS_API_KEY=YOUR_MAPS_KEY,\
VITE_GOOGLE_TRANSLATE_API_KEY=YOUR_TRANSLATE_KEY,\
VITE_GOOGLE_VISION_API_KEY=YOUR_VISION_KEY
```

### Option 2: Using Deployment Script

```bash
# Make script executable
chmod +x deploy-gcloud.sh

# Run deployment
./deploy-gcloud.sh
```

### Option 3: Automated CI/CD with Cloud Build

1. **Set up Cloud Build Trigger**:
   ```bash
   # Create trigger from GitHub
   gcloud builds triggers create github \
     --repo-name=promptware \
     --repo-owner=YOUR_GITHUB_USERNAME \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

2. **Add Secret Manager secrets**:
   ```bash
   # Create secrets
   echo -n "YOUR_GEMINI_KEY" | gcloud secrets create gemini-api-key --data-file=-
   echo -n "YOUR_GA_ID" | gcloud secrets create ga-measurement-id --data-file=-
   
   # Grant Cloud Build access
   PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
   gcloud secrets add-iam-policy-binding gemini-api-key \
     --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
     --role=roles/secretmanager.secretAccessor
   ```

## Environment Variables

Set these in Cloud Run:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID | Yes |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |
| `VITE_GOOGLE_TRANSLATE_API_KEY` | Google Translate API key | Yes |
| `VITE_GOOGLE_VISION_API_KEY` | Google Vision API key | Yes |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key | Optional |

### Update Environment Variables

```bash
gcloud run services update ecoguide-ai \
  --region us-central1 \
  --update-env-vars VITE_GEMINI_API_KEY=new_key_here
```

## Verification

### 1. Check Deployment Status
```bash
gcloud run services describe ecoguide-ai \
  --platform managed \
  --region us-central1
```

### 2. Get Service URL
```bash
gcloud run services describe ecoguide-ai \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

### 3. Test Health Endpoint
```bash
curl https://your-service-url/health
# Should return: healthy
```

### 4. Check Logs
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ecoguide-ai" \
  --limit 50 \
  --format json
```

## Cost Optimization

### Current Configuration
- **Memory**: 512Mi
- **CPU**: 1 vCPU
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10

### Estimated Costs
- **Free Tier**: 2 million requests/month
- **After Free Tier**: ~$0.40 per million requests
- **With scale-to-zero**: Only pay when app is used

### Reduce Costs
```bash
# Update to minimum resources
gcloud run services update ecoguide-ai \
  --region us-central1 \
  --memory 256Mi \
  --cpu 1 \
  --max-instances 5
```

## Custom Domain (Optional)

### 1. Map Custom Domain
```bash
gcloud run domain-mappings create \
  --service ecoguide-ai \
  --domain your-domain.com \
  --region us-central1
```

### 2. Update DNS Records
Follow the instructions shown after running the above command.

## Troubleshooting

### Build Fails
```bash
# Check build logs
gcloud builds list --limit=5

# View specific build
gcloud builds log BUILD_ID
```

### Service Not Responding
```bash
# Check service status
gcloud run services describe ecoguide-ai --region us-central1

# View recent logs
gcloud logging read "resource.type=cloud_run_revision" --limit 100
```

### Environment Variables Not Working
```bash
# Verify environment variables
gcloud run services describe ecoguide-ai \
  --region us-central1 \
  --format 'value(spec.template.spec.containers[0].env)'
```

## Security Checklist

- [x] API keys not in source code
- [x] `.env` file in `.gitignore`
- [x] `.env` file in `.dockerignore`
- [x] Environment variables set in Cloud Run
- [x] HTTPS enabled (automatic with Cloud Run)
- [x] Security headers configured in nginx
- [x] CORS properly configured
- [x] Input validation implemented
- [x] XSS protection enabled

## Monitoring

### Set Up Alerts
```bash
# Create uptime check
gcloud monitoring uptime-checks create https \
  --display-name="EcoGuide AI Uptime" \
  --resource-type=uptime-url \
  --monitored-resource-hostname=your-service-url
```

### View Metrics
- **Cloud Console**: https://console.cloud.google.com/run
- **Metrics**: Request count, latency, errors
- **Logs**: Real-time application logs

## Rollback

```bash
# List revisions
gcloud run revisions list --service ecoguide-ai --region us-central1

# Rollback to specific revision
gcloud run services update-traffic ecoguide-ai \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

## Cleanup

```bash
# Delete service
gcloud run services delete ecoguide-ai --region us-central1

# Delete container images
gcloud container images delete gcr.io/$PROJECT_ID/ecoguide-ai --quiet
```

## Support

For issues:
1. Check logs: `gcloud logging read`
2. Review Cloud Run docs: https://cloud.google.com/run/docs
3. Check GitHub Issues: https://github.com/YOUR_USERNAME/promptware/issues
