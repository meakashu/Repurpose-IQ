# Vercel Build Configuration Fix

## Issue
The deployment is failing because Vercel needs to install dependencies for both root and client directories before building.

## Solution: Configure Build Settings in Vercel UI

When deploying on Vercel, you need to configure the following in the **"Build and Output Settings"** section:

### Required Settings:

1. **Root Directory:** `./` (project root - default)

2. **Framework Preset:** `Other` or `Vite` (if available)

3. **Install Command:** 
   ```
   npm install && cd client && npm install
   ```
   OR use the script:
   ```
   npm run install-all
   ```

4. **Build Command:**
   ```
   npm run build
   ```
   This will run `cd client && npm install && npm run build`

5. **Output Directory:**
   ```
   client/dist
   ```

## Alternative: Use vercel-build Script

I've added a `vercel-build` script to `package.json` that Vercel will automatically detect. This script:
- Installs root dependencies
- Installs client dependencies  
- Builds the client

If you use this, you can set:
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `client/dist`

## Steps to Fix:

1. Go to Vercel "New Project" page
2. Click "Edit" next to "Build and Output Settings"
3. Configure the settings as shown above
4. Click "Deploy"

## What Happens:

1. ✅ Vercel installs root dependencies (`npm install`)
2. ✅ Vercel installs client dependencies (`cd client && npm install`)
3. ✅ Vercel builds the frontend (`cd client && npm run build`)
4. ✅ Output is in `client/dist`
5. ✅ API routes are automatically detected from `/api` folder

