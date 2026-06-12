#!/bin/bash

# EcoGuide AI - Production Deployment to Google Cloud Run
# This script securely deploys the application with environment variables

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🌱 EcoGuide AI - Cloud Run Deployment${NC}"
echo "=========================================="

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No project set. Run: gcloud config set project PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Using project: $PROJECT_ID${NC}"

# Load environment variables from .env file
if [ -f .env ]; then
    echo -e "${BLUE}📦 Loading environment variables from .env${NC}"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi

# Build and submit to Cloud Build
echo -e "${BLUE}🏗️  Building container image...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/ecoguide-ai --timeout=20m

# Deploy to Cloud Run with environment variables
echo -e "${BLUE}🚀 Deploying to Cloud Run...${NC}"
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
  --set-env-vars "VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY},VITE_GA_MEASUREMENT_ID=${VITE_GA_MEASUREMENT_ID},VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY},VITE_GOOGLE_TRANSLATE_API_KEY=${VITE_GOOGLE_TRANSLATE_API_KEY},VITE_GOOGLE_VISION_API_KEY=${VITE_GOOGLE_VISION_API_KEY},VITE_RECAPTCHA_SITE_KEY=${VITE_RECAPTCHA_SITE_KEY}"

# Get service URL
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
SERVICE_URL=$(gcloud run services describe ecoguide-ai --platform managed --region us-central1 --format 'value(status.url)')
echo -e "${GREEN}🌐 Your app is live at:${NC}"
echo -e "${BLUE}$SERVICE_URL${NC}"
echo ""

# Test health endpoint
echo -e "${BLUE}🔍 Testing health endpoint...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $SERVICE_URL/health)
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed!${NC}"
else
    echo -e "${YELLOW}⚠ Health check returned: $HTTP_CODE${NC}"
fi

echo ""
echo -e "${BLUE}📊 Useful commands:${NC}"
echo "View logs: gcloud logging read 'resource.type=cloud_run_revision' --limit 50"
echo "Update env: gcloud run services update ecoguide-ai --update-env-vars KEY=VALUE"
echo "Describe: gcloud run services describe ecoguide-ai --region us-central1"
echo ""
