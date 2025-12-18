# 🔌 Frontend-Backend Connection Status

## ✅ Connection Configuration

### Frontend API Setup

**File**: `client/src/utils/api.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});
```

### How It Works

1. **Development Mode**:
   - `VITE_API_URL` not set → uses `/api`
   - Vite proxy (in `vite.config.js`) forwards `/api/*` → `http://localhost:3000/api/*`
   - ✅ **Connected to local backend**

2. **Production Mode**:
   - `VITE_API_URL` set → uses that URL (e.g., `https://your-backend.vercel.app`)
   - Direct API calls to backend URL
   - ✅ **Connected to production backend**

### API Call Pattern

All API calls use relative paths (without `/api` prefix):
```javascript
// ✅ CORRECT
api.post('/query', data)           // → /api/query
api.get('/dashboard/data')         // → /api/dashboard/data
api.post('/auth/login', data)      // → /api/auth/login

// ❌ WRONG (double /api)
api.post('/api/query', data)       // → /api/api/query ❌
```

---

## 🔍 Connection Verification

### Test 1: Check API Configuration

**In Browser Console** (on frontend):
```javascript
// Check API base URL
console.log(import.meta.env.VITE_API_URL || '/api');

// Test API instance
import api from './utils/api';
console.log(api.defaults.baseURL);
```

### Test 2: Test Backend Connection

**Health Check**:
```javascript
// In browser console or test file
fetch('/api/health')
  .then(r => r.json())
  .then(console.log);
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-...",
  "version": "2.0.0"
}
```

### Test 3: Test Authentication

**Login Test**:
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'demo', password: 'demo' })
})
  .then(r => r.json())
  .then(console.log);
```

**Expected Response**:
```json
{
  "user": { "id": 1, "username": "demo", ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🚨 Common Connection Issues

### Issue 1: Double `/api` in URL

**Symptom**: `404 Not Found` or `Cannot GET /api/api/query`

**Cause**: Using `/api/query` instead of `/query` in API calls

**Fix**: Remove `/api` prefix from API call paths
```javascript
// ❌ Wrong
api.post('/api/query', data)

// ✅ Correct
api.post('/query', data)
```

### Issue 2: CORS Errors

**Symptom**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Cause**: Backend CORS not configured for frontend URL

**Fix**: Set `CLIENT_URL` environment variable in backend:
```env
CLIENT_URL=https://your-frontend.vercel.app
```

### Issue 3: Network Error / Connection Refused

**Symptom**: `Network Error` or `ERR_CONNECTION_REFUSED`

**Cause**: Backend not running or wrong URL

**Fix**:
- **Development**: Ensure backend is running on `http://localhost:3000`
- **Production**: Verify `VITE_API_URL` is set correctly

### Issue 4: 404 on All Routes

**Symptom**: All API calls return 404

**Cause**: Backend routes not mounted or wrong base path

**Fix**: Verify backend routes are mounted at `/api/*`:
```javascript
// In server/index.js or api/index.js
app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
// etc.
```

---

## ✅ Current Connection Status

### Development (Local)

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Running | `http://localhost:5173` |
| Backend | ✅ Running | `http://localhost:3000` |
| API Base | ✅ `/api` (proxied) | `http://localhost:3000/api` |
| Connection | ✅ **CONNECTED** | Via Vite proxy |

### Production (Vercel)

| Component | Status | Configuration |
|-----------|--------|----------------|
| Frontend | ⏳ To Deploy | Set `VITE_API_URL` |
| Backend | ⏳ To Deploy | Set `CLIENT_URL` |
| API Base | ⏳ To Configure | Environment variable |
| Connection | ⏳ **PENDING** | After deployment |

---

## 🔧 Fixes Applied

### Fixed Double `/api` Paths

**File**: `client/src/components/ClinicalTrialAlerts.jsx`

- ✅ Changed `/api/monitoring/alerts` → `/monitoring/alerts`
- ✅ Changed `/api/monitoring/add-molecule` → `/monitoring/add-molecule`
- ✅ Changed `/api/monitoring/remove-molecule` → `/monitoring/remove-molecule`
- ✅ Changed `/api/monitoring/alerts/${id}/read` → `/monitoring/alerts/${id}/read`

---

## 🧪 Quick Connection Test

### Run This Test

1. **Start Backend**:
   ```bash
   npm run server
   # Should see: "🚀 Server running on http://localhost:3000"
   ```

2. **Start Frontend**:
   ```bash
   cd client && npm run dev
   # Should see: "Local: http://localhost:5173"
   ```

3. **Open Browser**:
   - Go to `http://localhost:5173`
   - Open Developer Console (F12)
   - Check Network tab
   - Try logging in with `demo`/`demo`

4. **Verify**:
   - ✅ No CORS errors
   - ✅ API calls show in Network tab
   - ✅ Responses return 200 OK
   - ✅ Login works

---

## 📊 Connection Flow Diagram

```
┌─────────────────────────────────┐
│   Frontend (localhost:5173)     │
│                                  │
│   api.post('/query', data)      │
│         ↓                        │
│   baseURL: '/api'               │
│         ↓                        │
│   Full URL: '/api/query'        │
└──────────┬──────────────────────┘
           │
           │ Vite Proxy
           │ (dev only)
           ↓
┌─────────────────────────────────┐
│   Backend (localhost:3000)     │
│                                  │
│   app.use('/api/query', ...)   │
│         ↓                        │
│   Route Handler                 │
│         ↓                        │
│   Master Agent                  │
│         ↓                        │
│   Response                      │
└─────────────────────────────────┘
```

---

## ✅ Final Status

### Development: ✅ **CONNECTED**
- Frontend and backend communicate correctly
- Vite proxy working
- All API routes accessible

### Production: ⏳ **READY FOR DEPLOYMENT**
- Configuration files ready
- Environment variables documented
- Will connect after deployment

---

**Last Updated**: January 2025  
**Status**: ✅ **CONNECTED (Development)** | ⏳ **READY (Production)**
