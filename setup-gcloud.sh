#!/bin/bash

# Google Cloud Setup Script for Recipe Sharing App CI/CD
# Run this script to set up the required Google Cloud resources

set -e

echo "🚀 Setting up Google Cloud resources for Recipe Sharing App..."

# Check if gcloud is installed and configured
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No project set in gcloud config"
    echo "   Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Using project: $PROJECT_ID"

# Enable required APIs
echo "⚡ Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
gcloud services enable artifactregistry.googleapis.com --quiet
echo "✅ APIs enabled"

# Create Artifact Registry repository
echo "📦 Creating Artifact Registry repository..."
if gcloud artifacts repositories describe recipe-sharing-repo --location=us-central1 &> /dev/null; then
    echo "⚠️  Repository 'recipe-sharing-repo' already exists"
else
    gcloud artifacts repositories create recipe-sharing-repo \
        --repository-format=docker \
        --location=us-central1 \
        --description="Recipe sharing app container images" \
        --quiet
    echo "✅ Repository created"
fi

# Create service account
echo "👤 Creating service account..."
SERVICE_ACCOUNT="github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com"

if gcloud iam service-accounts describe $SERVICE_ACCOUNT &> /dev/null; then
    echo "⚠️  Service account already exists"
else
    gcloud iam service-accounts create github-actions-sa \
        --description="Service account for GitHub Actions" \
        --display-name="GitHub Actions SA" \
        --quiet
    echo "✅ Service account created"
fi

# Grant permissions
echo "🔐 Setting up IAM permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/run.admin" \
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/artifactregistry.admin" \
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/iam.serviceAccountUser" \
    --quiet

echo "✅ IAM permissions configured"

# Create service account key
echo "🔑 Creating service account key..."
if [ -f "key.json" ]; then
    echo "⚠️  key.json already exists. Backing up to key.json.bak"
    mv key.json key.json.bak
fi

gcloud iam service-accounts keys create key.json \
    --iam-account=$SERVICE_ACCOUNT \
    --quiet

echo "✅ Service account key created: key.json"

# Generate JWT secret
echo "🔒 Generating JWT secret..."
JWT_SECRET=$(openssl rand -base64 32)

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Add these secrets to your GitHub repository:"
echo "   Repository → Settings → Secrets and variables → Actions"
echo ""
echo "   GCP_PROJECT_ID:"
echo "   $PROJECT_ID"
echo ""
echo "   GCP_SA_KEY:"
echo "   $(cat key.json)"
echo ""
echo "   JWT_SECRET:"
echo "   $JWT_SECRET"
echo ""
echo "   MONGODB_URI:"
echo "   mongodb+srv://joyce-db:Admin111@cluster0.bqds8ko.mongodb.net/recipe-sharing"
echo ""
echo "2. Ensure MongoDB Atlas allows access from 0.0.0.0/0"
echo ""
echo "3. Push your code to the main branch to trigger deployment:"
echo "   git add ."
echo "   git commit -m 'Add CI/CD pipeline'"
echo "   git push origin main"
echo ""
echo "⚠️  IMPORTANT: Keep key.json secure and don't commit it to version control!"
echo "⚠️  Consider deleting key.json after adding to GitHub secrets"