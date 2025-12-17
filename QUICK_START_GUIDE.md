# 🚀 Quick Start Guide - New Innovations

## Overview

This guide helps you get started with the newly implemented innovations in RepurposeIQ.

---

## ✅ What's Been Implemented

### 1. Real-Time Clinical Trial Monitoring ⚡
- **WebSocket-based** real-time alerts
- Automatic monitoring of clinical trials
- Subscribe to molecules for instant updates
- Alert management dashboard

### 2. Predictive Analytics 📊
- ML-based repurposing success prediction
- Market size forecasting (5-year projections)
- Patent expiry impact analysis
- Risk factor identification

---

## 🛠️ Setup Instructions

### Step 1: Install Dependencies

**Backend (Node.js):**
```bash
npm install socket.io socket.io-client
```

**Backend (Python):**
```bash
cd python-service
pip install scikit-learn joblib
pip install -r requirements.txt
```

**Frontend:**
```bash
cd client
npm install socket.io-client
```

### Step 2: Start Services

**Terminal 1 - Node.js Server:**
```bash
npm run server
# or
node server/index.js
```

**Terminal 2 - Python Service:**
```bash
cd python-service
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Frontend:**
```bash
npm run client
# or
cd client && npm run dev
```

### Step 3: Access the Application

1. Open browser: `http://localhost:5173`
2. Login with credentials:
   - Username: `demo`
   - Password: `demo`

---

## 🎯 Using the New Features

### Real-Time Monitoring

1. **Navigate to Monitoring:**
   - Click "Monitoring" in the sidebar
   - Or go to `/monitoring`

2. **Subscribe to Molecules:**
   - Enter molecule name (e.g., "Metformin")
   - Click "Monitor" button
   - System will start checking for new trials

3. **View Alerts:**
   - New trial alerts appear automatically
   - Click external link to view on ClinicalTrials.gov
   - Mark alerts as read when done

4. **Monitoring Status:**
   - See connection status (🟢 Connected / 🔴 Disconnected)
   - View tracked molecules
   - Check last update time

### Predictive Analytics

**Via API (Python Service):**

```bash
# Predict repurposing success
curl -X POST http://localhost:8000/api/predictions/repurposing-success \
  -H "Content-Type: application/json" \
  -d '{
    "molecule": "Metformin",
    "indication": "Polycystic Ovary Syndrome",
    "therapy_area": "Endocrinology",
    "market_size": 500,
    "competition_level": 0.3,
    "patent_risk": "low",
    "clinical_evidence": 0.7,
    "existing_indications": 1
  }'

# Forecast market size
curl -X POST http://localhost:8000/api/predictions/market-forecast \
  -H "Content-Type: application/json" \
  -d '{
    "molecule": "Metformin",
    "indication": "Type 2 Diabetes",
    "current_market_size": 3500,
    "cagr": 5.2,
    "years": 5
  }'
```

**Via Chat Interface:**
- Ask questions like:
  - "What is the success probability of repurposing Metformin for PCOS?"
  - "Forecast the market size for Pembrolizumab in oncology over 5 years"

---

## 📊 API Endpoints

### Monitoring Endpoints (Node.js)

- `GET /api/monitoring/status` - Get monitoring status
- `POST /api/monitoring/start` - Start monitoring
- `POST /api/monitoring/stop` - Stop monitoring
- `POST /api/monitoring/add-molecule` - Add molecule to track
- `POST /api/monitoring/remove-molecule` - Remove molecule
- `GET /api/monitoring/alerts` - Get alerts
- `POST /api/monitoring/alerts/:id/read` - Mark alert as read

### Prediction Endpoints (Python)

- `POST /api/predictions/repurposing-success` - Predict success
- `POST /api/predictions/market-forecast` - Forecast market
- `POST /api/predictions/patent-expiry-impact` - Patent impact

---

## 🔧 Configuration

### Environment Variables

Create/update `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Client
CLIENT_URL=http://localhost:5173

# Python Service
PYTHON_SERVICE_URL=http://localhost:8000

# Database
DB_PATH=./data/pharma.db

# WebSocket (auto-configured)
```

---

## 🐛 Troubleshooting

### WebSocket Not Connecting

1. **Check server is running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Check CORS settings:**
   - Ensure `CLIENT_URL` in `.env` matches frontend URL

3. **Check browser console:**
   - Look for WebSocket connection errors
   - Check network tab for WebSocket upgrade

### Python Service Not Responding

1. **Check service is running:**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check dependencies:**
   ```bash
   cd python-service
   pip list | grep scikit-learn
   ```

3. **Check logs:**
   - Look for errors in Python service console

### Database Issues

1. **Reset database:**
   ```bash
   rm data/pharma.db
   npm run server  # Auto-creates new DB
   ```

2. **Check migrations:**
   - Database auto-initializes on server start
   - Check `server/database/db.js` for schema

---

## 📝 Next Steps

1. **Explore Monitoring Dashboard:**
   - Subscribe to multiple molecules
   - Watch for real-time alerts
   - Test alert management

2. **Test Predictive Analytics:**
   - Try different molecules and indications
   - Compare predictions
   - Review key factors and recommendations

3. **Integrate with Chat:**
   - Ask predictive questions in chat
   - Get AI-powered insights

4. **Check Implementation Status:**
   - See `IMPLEMENTATION_STATUS.md` for progress
   - Review `INNOVATION_ROADMAP.md` for future features

---

## 🎓 Example Queries

### For Monitoring:
- "Monitor Metformin for new clinical trials"
- "Track Pembrolizumab trials"
- "Show me unread alerts"

### For Predictions:
- "What's the success probability of repurposing Metformin for PCOS?"
- "Forecast the 5-year market size for Pembrolizumab"
- "What's the patent expiry impact for Sitagliptin?"

---

## 📚 Documentation

- **Implementation Status:** `IMPLEMENTATION_STATUS.md`
- **Innovation Roadmap:** `INNOVATION_ROADMAP.md`
- **Top 3 Implementation Guide:** `TOP_3_INNOVATIONS_IMPLEMENTATION.md`

---

## ✅ Verification Checklist

- [ ] Dependencies installed
- [ ] Node.js server running (port 3000)
- [ ] Python service running (port 8000)
- [ ] Frontend running (port 5173)
- [ ] Can login to application
- [ ] Monitoring page accessible
- [ ] WebSocket connection shows "🟢 Connected"
- [ ] Can subscribe to molecules
- [ ] Predictive API responds

---

**Happy Innovating! 🚀**
