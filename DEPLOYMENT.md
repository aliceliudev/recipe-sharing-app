# CI/CD Setup Guide for Cloud Run Deployment

This guide will help you set up the complete CI/CD pipeline for deploying the Recipe Sharing App to Google Cloud Run.

## Prerequisites

1. **Google Cloud Project**: Create a Google Cloud project
2. **Google Cloud CLI**: Install and configure `gcloud` CLI
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Set up Google Cloud Resources

### 1.1 Enable Required APIs
```bash
# Enable required Google Cloud APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 1.2 Create Artifact Registry Repository
```bash
# Create a repository for storing Docker images
gcloud artifacts repositories create recipe-sharing-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Recipe sharing app container images"
```

### 1.3 Create Service Account
```bash
# Create service account for GitHub Actions
gcloud iam service-accounts create github-actions-sa \
  --description="Service account for GitHub Actions" \
  --display-name="GitHub Actions SA"

# Get your project ID
export PROJECT_ID=$(gcloud config get-value project)

# Grant necessary permissions to the service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download service account key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com
```

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

### Required Secrets:
- **`GCP_PROJECT_ID`**: Your Google Cloud project ID
- **`GCP_SA_KEY`**: Contents of the `key.json` file (paste the entire JSON)
- **`MONGODB_URI`**: Your MongoDB Atlas connection string
  ```
  mongodb+srv://joyce-db:Admin111@cluster0.bqds8ko.mongodb.net/recipe-sharing
  ```
- **`JWT_SECRET`**: A secure random string for JWT token signing
  ```bash
  # Generate a secure JWT secret
  openssl rand -base64 32
  ```

## Step 3: Update MongoDB Atlas Network Access

1. Go to MongoDB Atlas Dashboard
2. Navigate to Network Access
3. Add IP Address: `0.0.0.0/0` (for Cloud Run access)
   - **Note**: For production, consider using more restrictive IP ranges

## Step 4: Deploy the Pipeline

### 4.1 Push to Main Branch
The CI/CD pipeline will automatically trigger when you push to the `main` branch:

```bash
git add .
git commit -m "Add CI/CD pipeline for Cloud Run deployment"
git push origin main
```

### 4.2 Monitor Deployment
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Watch the deployment progress

## Step 5: Access Your Deployed Application

After successful deployment, you'll find the URLs in the GitHub Actions logs:
- **Frontend URL**: `https://recipe-frontend-[hash]-uc.a.run.app`
- **Backend URL**: `https://recipe-backend-[hash]-uc.a.run.app`

## Local Development vs Production

### Environment Variables:
- **Local Development**: Uses `.env` file with localhost URLs
- **Production**: Uses GitHub Secrets with Cloud Run URLs

### Database:
- **Local Development**: Can use local MongoDB or Atlas
- **Production**: Uses MongoDB Atlas

## Troubleshooting

### Common Issues:

1. **Permission Denied Errors**:
   - Verify service account has correct IAM roles
   - Check that service account key is valid

2. **Docker Build Failures**:
   - Ensure Dockerfile syntax is correct
   - Check that all dependencies are properly specified

3. **MongoDB Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes `0.0.0.0/0`

4. **Frontend Can't Reach Backend**:
   - Check that frontend is built with correct backend URL
   - Verify CORS configuration in backend

### Useful Commands:

```bash
# Check service deployments
gcloud run services list

# View service logs
gcloud run services logs read recipe-backend --region=us-central1
gcloud run services logs read recipe-frontend --region=us-central1

# Update service manually (if needed)
gcloud run deploy recipe-backend --source=./backend --region=us-central1
```

## Security Best Practices

1. **Use IAM roles with least privilege**
2. **Rotate service account keys regularly**
3. **Use environment-specific secrets**
4. **Monitor deployments and logs**
5. **Restrict MongoDB Atlas network access**

## Cost Optimization

1. **Set appropriate memory/CPU limits**
2. **Configure auto-scaling (min/max instances)**
3. **Use regional deployment**
4. **Monitor usage in Google Cloud Console**

---

## Pipeline Overview

The CI/CD pipeline includes:

1. **Testing**: Runs frontend and backend tests
2. **Backend Deployment**: Builds and deploys backend to Cloud Run
3. **Frontend Deployment**: Builds frontend with correct backend URL and deploys
4. **Artifact Storage**: Stores Docker images in Artifact Registry
5. **Automatic Scaling**: Configures Cloud Run auto-scaling

The entire deployment process is automated and will complete in approximately 5-10 minutes.