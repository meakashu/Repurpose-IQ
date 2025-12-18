# ⚡ Quick Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
vercel login
```

### Step 2: Deploy Backend
```bash
# From project root
vercel --prod
```
**Note the backend URL** (e.g., `https://repurposeiq-api.vercel.app`)

### Step 3: Deploy Frontend
```bash
cd client
vercel --prod
```
**Note the frontend URL** (e.g., `https://repurposeiq.vercel.app`)

### Step 4: Set Environment Variables

**In Vercel Dashboard → Backend Project → Settings → Environment Variables:**

```env
GROQ_API_KEY=your_groq_key
JWT_SECRET=your_secure_secret
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

**In Vercel Dashboard → Frontend Project → Settings → Environment Variables:**

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

### Step 5: Redeploy
```bash
# Backend
vercel --prod

# Frontend
cd client && vercel --prod
```

### Step 6: Verify
1. Open frontend URL
2. Login: `demo` / `demo`
3. Test query: "Find repurposing opportunities for Metformin"
4. Generate report

## ✅ Done!

Your RepurposeIQ is live! 🎉

---

**For detailed instructions, see `DEPLOYMENT_GUIDE.md`**
