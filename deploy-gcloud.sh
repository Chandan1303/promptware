#!/bin/bash

# EcoGuide AI - Google Cloud Deployment Script
# This script deploys the application to Google Cloud Run

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌱 EcoGuide AI - Google Cloud Deployment${NC}"
echo "============================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project ID is required${NC}"
    exit 1
fi

# Set project
echo -e "${GREEN}✓ Setting project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${BLUE}📦 Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push container
echo -e "${BLUE}🏗️  Building container image...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/ecoguide-ai

# Deploy to Cloud Run
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
  --port 8080

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Your application is now live at:"
gcloud run services describe ecoguide-ai --platform managed --region us-central1 --format 'value(status.url)'
echo ""
echo -e "${BLUE}📊 Next steps:${NC}"
echo "1. Add your Gemini API key as an environment variable"
echo "2. Configure Google Analytics measurement ID"
echo "3. Set up custom domain (optional)"
echo ""
echo "To update environment variables:"
echo "gcloud run services update ecoguide-ai --update-env-vars VITE_GEMINI_API_KEY=your_key_here"
