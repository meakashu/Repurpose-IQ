# Vercel Build Command Configuration

## Quick Fix for "Missing script: vercel-build" Error

Since Vercel is using the GitHub version that doesn't have `vercel-build` yet, use these settings:

### Option 1: Use Existing Build Script (Recommended)

In Vercel "Build and Output Settings":

1. **Install Command:**
   ```
   npm install
   ```

2. **Build Command:**
   ```
   npm run build
   ```
   (This runs: `cd client && npm install && npm run build`)

3. **Output Directory:**
   ```
   client/dist
   ```

### Option 2: Use Inline Build Command

1. **Install Command:**
   ```
   npm install
   ```

2. **Build Command:**
   ```
   cd client && npm install && npm run build
   ```

3. **Output Directory:**
   ```
   client/dist
   ```

### Option 3: Push Changes to GitHub First

If you want to use `vercel-build`:

1. Push the changes to GitHub:
   ```bash
   git add package.json vercel.json .vercelignore
   git commit -m "Add vercel-build script and fix Vercel config"
   git push
   ```

2. Then in Vercel, use:
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `client/dist`

---

**Recommended:** Use Option 1 - it works immediately with the current GitHub version.

