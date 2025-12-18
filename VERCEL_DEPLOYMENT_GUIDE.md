# 🚀 Vercel Deployment Guide - RepurposeIQ

**Complete guide to deploy RepurposeIQ frontend and backend to Vercel**

---

## ✅ Pre-Deployment Checklist

### 1. Code Fixes Applied ✅

All Vercel-specific fixes have been implemented:

- ✅ **Database paths** - Uses `/tmp` on Vercel
- ✅ **Report storage** - Uses `/tmp/reports` on Vercel
- ✅ **Upload storage** - Uses `/tmp/uploads` on Vercel
- ✅ **API routing** - Serverless function configured
- ✅ **CORS** - Configured for Vercel domains
- ✅ **Frontend build** - Vite build configured
- ✅ **WebSocket** - Graceful fallback (REST API on Vercel)

---

## 📋 Step-by-Step Deployment

### Step 1: Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Navigate to Project Root

```bash
cd "/Users/akashsingh/Downloads/RepurposeIQ 2"
```

### Step 4: Deploy to Vercel

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time) or Yes (if updating)
- **Project name?** → `repurposeiq` (or your choice)
- **Directory?** → `./` (current directory)

### Step 5: Set Environment Variables

After deployment, set these in Vercel Dashboard:

**Required:**
```
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
```

**Optional (but recommended):**
```
TAVILY_API_KEY=your_tavily_key_here
CLIENT_URL=https://your-project.vercel.app
```

**How to set:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable for **Production**, **Preview**, and **Development**

---

## 🔧 Vercel Configuration Files

### Root `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "functions": {
    "api/index.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

### Client `client/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## 📁 Project Structure for Vercel

```
RepurposeIQ 2/
├── api/
│   └── index.js          # Serverless function entry point
├── client/
│   ├── src/              # React source
│   ├── dist/             # Build output (generated)
│   ├── package.json
│   └── vercel.json
├── server/               # Backend code (imported by api/index.js)
├── vercel.json           # Root Vercel config
└── package.json
```

---

## 🔑 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GROQ_API_KEY` | Groq AI API key | `gsk_...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `NODE_ENV` | Environment | `production` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TAVILY_API_KEY` | Tavily web search API | (optional) |
| `CLIENT_URL` | Frontend URL | Auto-detected |
| `DB_PATH` | Database path | `/tmp/pharma.db` (Vercel) |
| `DEBUG` | Debug mode | `false` |

---

## 🎯 How It Works on Vercel

### Backend (Serverless Functions)

1. **API Routes** → `/api/*` → `api/index.js` (serverless function)
2. **Database** → Stored in `/tmp/pharma.db` (ephemeral)
3. **Reports** → Stored in `/tmp/reports/` (ephemeral)
4. **Uploads** → Stored in `/tmp/uploads/` (ephemeral)

**Note:** Files in `/tmp` are ephemeral and reset between deployments. For production, consider:
- External database (PostgreSQL, MongoDB)
- Object storage (AWS S3, Cloudinary) for reports/uploads

### Frontend (Static Site)

1. **Build** → `client/dist/` (Vite build output)
2. **Serve** → Static files from `client/dist/`
3. **Routing** → All routes → `index.html` (React Router)

---

## ⚠️ Vercel Limitations & Workarounds

### 1. WebSocket Not Supported

**Issue:** Socket.io WebSocket doesn't work on Vercel serverless

**Solution:** ✅ Already handled
- Frontend gracefully falls back to REST API
- Real-time features use polling or REST endpoints
- No breaking changes

### 2. Ephemeral Storage

**Issue:** `/tmp` files are deleted between deployments

**Solution:** 
- ✅ Database re-seeds on first request
- ✅ Reports/uploads are temporary (expected)
- For production: Use external storage

### 3. Function Timeout

**Issue:** Default timeout is 10s, max 60s

**Solution:** ✅ Configured
- `maxDuration: 60` in `vercel.json`
- Long queries may timeout (consider streaming)

### 4. Cold Starts

**Issue:** First request may be slow (cold start)

**Solution:**
- Database initialization is cached per instance
- Subsequent requests are fast

---

## 🧪 Testing Deployment

### 1. Test Health Endpoint

```bash
curl https://your-project.vercel.app/api/health
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "version": "2.0.0",
  "environment": "production",
  "vercel": true
}
```

### 2. Test Query Endpoint

```bash
# Get auth token first (login via frontend)
curl -X POST https://your-project.vercel.app/api/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"Find repurposing opportunities for Metformin"}'
```

### 3. Test Frontend

1. Open `https://your-project.vercel.app`
2. Login: `demo` / `demo`
3. Submit a query
4. Generate a report
5. Verify all features work

---

## 🔍 Troubleshooting

### Issue: Build Fails

**Check:**
- Node version (Vercel uses Node 20.x)
- Build logs in Vercel dashboard
- `client/package.json` has `vercel-build` script

**Fix:**
```bash
# Test build locally
cd client
npm run build
```

### Issue: API Returns 500

**Check:**
- Environment variables set correctly
- `GROQ_API_KEY` is valid
- Database initialization logs

**Fix:**
- Check Vercel function logs
- Verify environment variables
- Test database initialization

### Issue: CORS Errors

**Check:**
- `CLIENT_URL` environment variable
- CORS configuration in `api/index.js`

**Fix:**
- Set `CLIENT_URL` to your Vercel domain
- Or allow all Vercel domains (already configured)

### Issue: Database Not Working

**Check:**
- Database path uses `/tmp` on Vercel
- Database initialization logs

**Fix:**
- Database auto-initializes on first request
- Check logs for initialization errors

---

## 📊 Deployment Status

### ✅ Fixed for Vercel

- [x] Database paths → `/tmp/pharma.db`
- [x] Report paths → `/tmp/reports/`
- [x] Upload paths → `/tmp/uploads/`
- [x] API routing → Serverless function
- [x] CORS configuration → Vercel domains
- [x] Frontend build → Vite output
- [x] WebSocket fallback → REST API
- [x] Environment variables → Documented

### ⚠️ Known Limitations

- [ ] WebSocket (not supported, uses REST fallback)
- [ ] Ephemeral storage (files reset on deploy)
- [ ] Function timeout (max 60s)

---

## 🚀 Production Recommendations

### For Production Use:

1. **Database:** Use external database (PostgreSQL, MongoDB)
2. **Storage:** Use object storage (S3, Cloudinary) for reports/uploads
3. **Caching:** Use Redis for session/cache
4. **Monitoring:** Set up Vercel Analytics
5. **CDN:** Vercel CDN is automatic

### Current Setup (Hackathon/Demo):

- ✅ Works perfectly for demo
- ✅ All features functional
- ✅ Ephemeral storage acceptable for demo
- ✅ WebSocket fallback works

---

## 📝 Quick Deploy Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View deployment logs
vercel logs

# Open deployment in browser
vercel open
```

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Environment variables set in Vercel dashboard
- [ ] `GROQ_API_KEY` configured
- [ ] `JWT_SECRET` configured
- [ ] Frontend builds successfully (`cd client && npm run build`)
- [ ] All file paths use `/tmp` on Vercel
- [ ] CORS allows Vercel domains
- [ ] Test health endpoint
- [ ] Test query endpoint
- [ ] Test frontend loads
- [ ] Test report generation

---

## 🎯 Post-Deployment

### 1. Get Your URLs

After deployment, Vercel provides:
- **Frontend URL:** `https://your-project.vercel.app`
- **API URL:** `https://your-project.vercel.app/api`

### 2. Update Frontend API URL

The frontend automatically uses `/api` (relative path), which works on Vercel.

If needed, set `VITE_API_URL` environment variable in Vercel.

### 3. Test All Features

1. ✅ Login
2. ✅ Submit query
3. ✅ View agent outputs
4. ✅ Generate PDF report
5. ✅ Generate Excel report
6. ✅ Download reports
7. ✅ Dashboard
8. ✅ Analytics

---

## 📞 Support

If deployment fails:

1. Check Vercel build logs
2. Check function logs
3. Verify environment variables
4. Test locally first
5. Check this guide for common issues

---

**Status:** ✅ **READY FOR VERCEL DEPLOYMENT**

All code has been fixed and tested for Vercel compatibility.
