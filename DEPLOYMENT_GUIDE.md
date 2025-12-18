# 🚀 RepurposeIQ - Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying RepurposeIQ to Vercel for production use.

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare your API keys
4. **Node.js 20+**: For local testing

---

## 🔧 Part 1: Pre-Deployment Setup

### 1.1 Environment Variables

Create a `.env.production` file with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secure-jwt-secret-key-change-this

# Client Configuration
CLIENT_URL=https://your-frontend-domain.vercel.app
VITE_API_URL=https://your-backend-domain.vercel.app

# Python Service (Optional)
PYTHON_SERVICE_URL=https://your-python-service.vercel.app

# API Keys
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional, for vision features
TAVILY_API_KEY=your_tavily_api_key_here  # Optional, for web intelligence

# Database Configuration
DB_PATH=/tmp/pharma.db  # Use /tmp for Vercel serverless

# Neo4j Configuration (Optional)
NEO4J_URI=bolt://your-neo4j-instance:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

### 1.2 Update API Configuration

The frontend is already configured to use environment variables:
- `VITE_API_URL` - Backend API URL (auto-detects in production)
- Falls back to relative paths if not set

### 1.3 Database Considerations

**Important**: SQLite on Vercel serverless functions:
- Use `/tmp` directory for database files (ephemeral storage)
- Database resets on each cold start
- For production, consider:
  - PostgreSQL (Vercel Postgres)
  - Supabase
  - PlanetScale
  - MongoDB Atlas

---

## 🌐 Part 2: Vercel Deployment

### 2.1 Deploy Backend API

1. **Connect Repository to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Backend Project**:
   - **Project Name**: `repurposeiq-api` (or your choice)
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (or set to project root)
   - **Build Command**: Leave empty (not needed for serverless)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Environment Variables**:
   - Add all variables from `.env.production`
   - Set `CLIENT_URL` to your frontend URL (will be set after frontend deployment)
   - Set `VITE_API_URL` to your backend URL (will be set after backend deployment)

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the deployment URL (e.g., `https://repurposeiq-api.vercel.app`)

### 2.2 Deploy Frontend

1. **Create New Vercel Project**:
   - Click "New Project" again
   - Import the same repository

2. **Configure Frontend Project**:
   - **Project Name**: `repurposeiq` (or your choice)
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   - `VITE_API_URL`: Set to your backend URL from step 2.1
   - Add any other frontend-specific variables

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the deployment URL (e.g., `https://repurposeiq.vercel.app`)

### 2.3 Update Environment Variables

After both deployments:

1. **Update Backend**:
   - Go to backend project settings
   - Update `CLIENT_URL` to frontend URL
   - Redeploy if needed

2. **Update Frontend**:
   - Go to frontend project settings
   - Update `VITE_API_URL` to backend URL
   - Redeploy if needed

---

## ✅ Part 3: Post-Deployment Verification

### 3.1 Health Check

Test backend health endpoint:
```bash
curl https://your-backend-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "version": "2.0.0",
  "environment": "production",
  "vercel": true
}
```

### 3.2 Frontend Load Test

1. Open frontend URL in browser
2. Verify UI loads without errors
3. Check browser console for errors

### 3.3 API Endpoint Test

Test key endpoints:
```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Auth (should return 401 without token)
curl https://your-backend-url.vercel.app/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo"}'
```

### 3.4 End-to-End Flow Test

1. **Login**:
   - Go to frontend
   - Login with demo credentials (demo/demo)
   - Verify authentication works

2. **Query Processing**:
   - Submit a test query: "Find repurposing opportunities for Metformin"
   - Verify agents execute
   - Verify response is received

3. **Report Generation**:
   - After receiving a response, click "Download PDF"
   - Verify PDF is generated and downloaded

4. **Download Test**:
   - Verify report download works
   - Check file is not corrupted

---

## 🔍 Part 4: Troubleshooting

### Issue: CORS Errors

**Solution**:
- Verify `CLIENT_URL` in backend environment variables
- Check CORS configuration in `api/index.js`
- Ensure frontend URL matches exactly

### Issue: Database Errors

**Solution**:
- SQLite on Vercel is ephemeral
- Consider migrating to PostgreSQL (Vercel Postgres)
- Or use external database service

### Issue: WebSocket Not Working

**Solution**:
- Vercel serverless functions don't support WebSocket
- Consider using:
  - Vercel Edge Functions
  - Separate WebSocket service (Railway, Render)
  - Polling as fallback (already implemented)

### Issue: Environment Variables Not Loading

**Solution**:
- Verify variables are set in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding variables
- Use `process.env.VARIABLE_NAME` in code

### Issue: Build Failures

**Solution**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Check Node.js version (should be 20+)
- Ensure build commands are correct

---

## 📊 Part 5: Production Checklist

### Before Going Live

- [ ] All environment variables configured
- [ ] Backend deployed and health check passes
- [ ] Frontend deployed and loads correctly
- [ ] Authentication working
- [ ] Query processing working
- [ ] Report generation working
- [ ] Download functionality working
- [ ] Error handling tested
- [ ] CORS configured correctly
- [ ] Security headers set
- [ ] Rate limiting enabled
- [ ] Database backup strategy (if using external DB)
- [ ] Monitoring set up (optional)

### Performance Optimization

- [ ] Enable Vercel Edge Caching
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up CDN (automatic with Vercel)
- [ ] Monitor API response times

---

## 🔐 Part 6: Security Considerations

### Production Security

1. **API Keys**:
   - Never commit API keys to repository
   - Use Vercel environment variables
   - Rotate keys regularly

2. **JWT Secret**:
   - Use strong, random JWT secret
   - Different secret for production
   - Store in environment variables

3. **CORS**:
   - Restrict to specific domains
   - Don't use wildcard (`*`) in production

4. **Rate Limiting**:
   - Already implemented
   - Adjust limits based on usage

5. **HTTPS**:
   - Automatic with Vercel
   - Verify SSL certificate

---

## 📈 Part 7: Monitoring & Analytics

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor:
   - Page views
   - API response times
   - Error rates
   - Function execution times

### Custom Monitoring

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM
- Custom analytics dashboard

---

## 🚀 Part 8: Deployment URLs

After deployment, you'll have:

- **Frontend URL**: `https://repurposeiq.vercel.app`
- **Backend URL**: `https://repurposeiq-api.vercel.app`
- **API Health**: `https://repurposeiq-api.vercel.app/api/health`

---

## 📝 Part 9: Deployment Commands

### Manual Deployment (CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy backend
cd /path/to/project
vercel --prod

# Deploy frontend
cd client
vercel --prod
```

### Environment Variables (CLI)

```bash
# Set environment variable
vercel env add VARIABLE_NAME production

# List environment variables
vercel env ls
```

---

## 🎯 Part 10: Final Verification

### Test Checklist

1. ✅ Frontend loads at production URL
2. ✅ Backend health check passes
3. ✅ Login works with demo credentials
4. ✅ Query submission works
5. ✅ Agents execute and return results
6. ✅ Report generation works
7. ✅ Report download works
8. ✅ No console errors
9. ✅ No CORS errors
10. ✅ All features functional

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review browser console errors
3. Verify environment variables
4. Test API endpoints directly
5. Check database connectivity (if using external DB)

---

## 🎉 Success!

Once all checks pass, your RepurposeIQ platform is live and ready for demo!

**Frontend**: https://your-frontend.vercel.app  
**Backend**: https://your-backend.vercel.app

---

**Last Updated**: January 2025  
**Version**: 2.0.0
