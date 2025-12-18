# Deploy with New Project Name

## Quick Fix for "Project already exists" Error

If you see the error: **"Project 'repurpose-iq-821z' already exists, please use a new name"**

### Option 1: Change Name in Vercel UI (Easiest)
1. On the Vercel "New Project" page
2. Find the project name field (usually at the top)
3. Change it to a unique name like:
   - `repurpose-iq-production`
   - `repurpose-iq-main`
   - `repurpose-iq-v2`
   - `repurpose-iq-2024`
4. Click "Deploy"

### Option 2: Use Vercel CLI
```bash
cd "/Volumes/Winner 1/Repurpose-IQ-"
vercel link
```
When prompted:
- **Link to existing project?** → **No** (create new)
- **Project name?** → Enter a unique name (e.g., `repurpose-iq-production`)
- **Directory?** → `./` (current directory)

Then deploy:
```bash
vercel --prod
```

### Option 3: Delete Existing Project First
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Find the project "repurpose-iq-821z"
3. Go to Settings → Delete Project
4. Then deploy again with the original name

---

**Recommended:** Use Option 1 (change name in UI) - it's the quickest!

