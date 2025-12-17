# 🚀 Running RepurposeIQ with Demo Account

## ✅ Setup Complete!

The application is now properly configured and ready to run with demo accounts.

## 🎯 Quick Start

### Option 1: Use the Startup Script
```bash
./start.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Client:**
```bash
npm run client
```

## 🔐 Demo Accounts

The following demo accounts are available:

| Username | Password | Role |
|----------|----------|------|
| `demo` | `demo` | Analyst |
| `admin` | `admin123` | Administrator |
| `analyst` | `analyst123` | Research Analyst |
| `manager` | `manager123` | Project Manager |

## 🌐 Access the Application

1. **Open your browser:** http://localhost:5173
2. **Click on the "Demo" tab** in the login page
3. **Click on any demo account** to login instantly
   - Or manually enter:
     - Username: `demo`
     - Password: `demo`

## ✅ Verification

### Check Backend Health:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "version": "2.0.0"
}
```

### Check Frontend:
- Open http://localhost:5173
- You should see the login page

### Test Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo"}'
```

## 🎯 Features Available

Once logged in, you can access:

- ✅ **Dashboard** - Overview of your research
- ✅ **Chat Interface** - Ask questions to AI agents
- ✅ **Monitoring** - Real-time clinical trial monitoring
- ✅ **Analytics** - Predictive analytics and insights
- ✅ **Knowledge Graph** - Explore drug relationships
- ✅ **Reports** - Generate PDF/Excel reports

## 🔧 Troubleshooting

### Server Not Starting?
1. Check if port 3000 is available:
   ```bash
   lsof -i :3000
   ```

2. Check if port 5173 is available:
   ```bash
   lsof -i :5173
   ```

3. Make sure .env file exists:
   ```bash
   ls -la .env
   ```

### Database Issues?
The database auto-initializes on server start. If you need to reset:
```bash
rm data/pharma.db
node -e "import('./server/database/db.js').then(m => { m.initDatabase(); m.seedDatabase(); })"
```

### Login Not Working?
1. Verify database has demo users:
   ```bash
   sqlite3 data/pharma.db "SELECT username, role FROM users;"
   ```

2. Check server logs for errors

## 📝 Environment Variables

The `.env` file has been created with:
- ✅ JWT_SECRET configured
- ✅ Port configurations
- ✅ Database path
- ✅ CORS settings

Optional: Add your API keys for enhanced features:
- `GROQ_API_KEY` - For LLM features
- `OPENAI_API_KEY` - For vision features

## 🎉 You're All Set!

The application is now running and ready to use with demo accounts!
