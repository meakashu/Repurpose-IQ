# 🚀 Complete Installation Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Groq API key (for LLM)
- OpenAI API key (optional, for vision features)

---

## Step 1: Install All Dependencies

### Root Directory (Node.js Backend)
```bash
npm install socket.io socket.io-client node-cron chart.js react-chartjs-2 d3 react-force-graph
```

### Python Service
```bash
cd python-service
pip install scikit-learn joblib networkx neo4j
pip install -r requirements.txt
```

### Client (Frontend)
```bash
cd client
npm install socket.io-client chart.js react-chartjs-2 d3 react-force-graph
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

# Python Service
PYTHON_SERVICE_URL=http://localhost:8000

# APIs
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key  # Optional, for vision features

# Database
DB_PATH=./data/pharma.db

# Neo4j (Optional)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

---

## Step 3: Initialize Database

```bash
# Database auto-initializes on server start, or manually:
node server/database/init.js
```

---

## Step 4: Start All Services

### Terminal 1: Node.js Server
```bash
npm run server
# or
node server/index.js
```

### Terminal 2: Python Service
```bash
cd python-service
uvicorn main:app --reload --port 8000
```

### Terminal 3: Frontend
```bash
npm run client
# or
cd client && npm run dev
```

---

## Step 5: Access Application

1. Open browser: `http://localhost:5173`
2. Login with:
   - Username: `demo`
   - Password: `demo`

---

## ✅ Verification

Check all services are running:

1. **Node.js Server:** `http://localhost:3000/api/health`
2. **Python Service:** `http://localhost:8000/api/health`
3. **Frontend:** `http://localhost:5173`

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
