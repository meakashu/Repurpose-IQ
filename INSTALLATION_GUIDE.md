# 🚀 Complete Installation Guide

## Prerequisites

- Node.js 18+ and npm
- Groq API key (for LLM)
- OpenAI API key (optional, for vision features)

---

## Step 1: Install All Dependencies

### Root Directory (Node.js Backend)
```bash
npm install
```

### Python Service (Optional)
```bash
cd python-service
pip install -r requirements.txt
```

### Client (Frontend)
```bash
cd client
npm install
```

---

## Step 2: Configure Environment

Create `.env` file in root directory:

```env
# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-here

# Client
CLIENT_URL=http://localhost:5173

# APIs
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key  # Optional, for vision features

# Database
DB_PATH=./data/pharma.db
```

---

## Step 3: Initialize Database

```bash
# Database auto-initializes on server start, or manually:
node server/database/init.js
```

---

## Step 4: Start Services

### Terminal 1: Node.js Server (Backend + API)
```bash
npm run server
# or
node server/index.js
```

### Terminal 2: Frontend
```bash
npm run client
# or
cd client && npm run dev
```

**Note:** Python service is optional. The system works with Node.js backend only. Python service provides additional features but has fallbacks.

---

## Step 5: Access Application

1. Open browser: `http://localhost:5173`
2. Login with:
   - Username: `demo`
   - Password: `demo`

---

## ✅ Verification

Check services are running:

1. **Node.js Server:** `http://localhost:3000/api/health`
2. **Frontend:** `http://localhost:5173`

---

## 🎯 All Features Available

- ✅ Real-Time Monitoring (`/monitoring`)
- ✅ Predictive Analytics (via API)
- ✅ Knowledge Graph (`/knowledge-graph`)
- ✅ Visualizations (`/visualizations`)
- ✅ Workflows (`/workflows`)
- ✅ Sentiment Analysis (`/sentiment`)
- ✅ Multi-Modal Analysis (in Chat)
- ✅ Smart Suggestions (in Chat)

---

**All innovations are now fully implemented and ready to use!** 🎉
