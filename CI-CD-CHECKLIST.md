# CI/CD Deployment Checklist

## ✅ GitHub Secrets Required

Based on the deploy-main.yml workflow, ensure these secrets are set in GitHub repository:

### Docker Hub Secrets
- `DOCKERHUB_USERNAME` ✅ (Set)
- `DOCKERHUB_TOKEN` ✅ (Set)

### Google Cloud Secrets  
- `GOOGLECLOUD_CREDENTIALS` ✅ (Set)
- `GOOGLECLOUD_REGION` ✅ (Set)
- `GOOGLECLOUD_SERVICE_ACCOUNT` ✅ (Set - but may be redundant)

### Application Secrets
- `MONGODB_URI` ✅ (Set) - MongoDB Atlas connection string
- `JWT_SECRET` ✅ (Set) - JWT token secret

## 🔧 Fixes Applied for CI/CD

### 1. Backend Dockerfile
- **Fixed**: Changed `EXPOSE 5000` to `EXPOSE 8080` to match Cloud Run port
- **Reason**: Cloud Run expects port 8080

### 2. CI/CD Pipeline (deploy-main.yml)
- **Fixed**: Added `DATABASE_URL=${{ secrets.MONGODB_URI }}` to backend env_vars
- **Reason**: Backend code checks for both MONGODB_URI and DATABASE_URL
- **Fixed**: Simplified test commands to avoid multi-line issues

### 3. Environment Variables
Backend receives in Cloud Run:
```yaml
env_vars: |
  DATABASE_URL=${{ secrets.MONGODB_URI }}
  MONGODB_URI=${{ secrets.MONGODB_URI }}
  JWT_SECRET=${{ secrets.JWT_SECRET }}
  NODE_ENV=production
```

## 🚀 Deployment Flow

1. **Push to main branch** → Triggers deployment
2. **Test phase**: Frontend build + Backend tests with in-memory MongoDB
3. **Build phase**: 
   - Backend: `alicemf/recipe-backend:${github.sha}`
   - Frontend: `alicemf/recipe-frontend:${github.sha}` (with dynamic backend URL)
4. **Deploy phase**:
   - Backend → Cloud Run → Gets URL (e.g., https://recipe-backend-xyz.run.app)
   - Frontend → Rebuilt with backend URL → Cloud Run

## 🎯 Key Improvements

1. **Dynamic Backend URL**: Frontend gets the actual deployed backend URL
2. **Proper Environment Variables**: Both DATABASE_URL and MONGODB_URI set
3. **Correct Port Mapping**: Backend exposes 8080 (Cloud Run standard)
4. **MongoDB Atlas**: Production database ready
5. **Security**: JWT_SECRET and database credentials in GitHub Secrets

## 🧪 Testing Recommendations

1. **Test locally first**: Use Docker containers with proper environment variables
2. **Test CI/CD**: Push to main branch and monitor GitHub Actions
3. **Verify deployment**: Check both frontend and backend URLs work
4. **Test authentication**: Ensure login/signup works end-to-end

## ⚠️ Potential Issues to Monitor

1. **Cold starts**: Cloud Run may have initial delay
2. **Database connections**: MongoDB Atlas IP restrictions  
3. **CORS**: Frontend/backend communication across domains
4. **Environment variables**: Typos in secret names or values

## 🔍 Debugging Commands

If deployment fails:
```bash
# Check GitHub Actions logs
# Check Cloud Run logs in Google Console
# Test Docker images locally:
docker run -e DATABASE_URL="mongodb+srv://..." alicemf/recipe-backend:latest
```