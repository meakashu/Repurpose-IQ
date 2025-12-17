# 🚀 Top 3 Innovations - Quick Implementation Guide

## Overview

This guide provides **step-by-step implementation** for the **3 most impactful innovations** that can be added quickly to RepurposeIQ:

1. **Real-Time Clinical Trial Monitoring** ⚡
2. **Predictive Analytics Dashboard** 📊
3. **Knowledge Graph Integration** 🔗

---

## 1. ⚡ Real-Time Clinical Trial Monitoring

### Why This Innovation?
- **High Impact**: Never miss important trial updates
- **Moderate Complexity**: Can be built in 2-3 weeks
- **Differentiator**: Most competitors don't have real-time monitoring

### Implementation Steps

#### Step 1: Create Real-Time Monitoring Service

**File**: `server/services/clinicalTrialMonitor.js`

```javascript
import EventEmitter from 'events';
import axios from 'axios';
import db from '../database/db.js';

class ClinicalTrialMonitor extends EventEmitter {
  constructor() {
    super();
    this.isMonitoring = false;
    this.checkInterval = 60 * 60 * 1000; // 1 hour
    this.trackedMolecules = new Set();
    this.lastCheckTime = new Date();
  }

  async startMonitoring(molecules = []) {
    this.isMonitoring = true;
    molecules.forEach(mol => this.trackedMolecules.add(mol.toLowerCase()));
    
    // Initial check
    await this.checkForUpdates();
    
    // Schedule periodic checks
    this.monitorInterval = setInterval(() => {
      this.checkForUpdates();
    }, this.checkInterval);
    
    console.log(`Started monitoring ${this.trackedMolecules.size} molecules`);
  }

  async checkForUpdates() {
    const updates = [];
    
    for (const molecule of this.trackedMolecules) {
      try {
        const newTrials = await this.fetchNewTrials(molecule);
        if (newTrials.length > 0) {
          updates.push({
            molecule,
            trials: newTrials,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error(`Error checking trials for ${molecule}:`, error);
      }
    }
    
    if (updates.length > 0) {
      this.emit('trials-updated', updates);
      await this.saveUpdates(updates);
    }
    
    this.lastCheckTime = new Date();
  }

  async fetchNewTrials(molecule) {
    // Use ClinicalTrials.gov API
    const response = await axios.get('https://clinicaltrials.gov/api/v2/studies', {
      params: {
        'query.cond': molecule,
        'filter.overallStatus': 'RECRUITING|ACTIVE_NOT_RECRUITING',
        'pageSize': 10
      }
    });
    
    const studies = response.data?.studies || [];
    const newTrials = [];
    
    for (const study of studies) {
      const nctId = study.protocolSection?.identificationModule?.nctId;
      
      // Check if we've seen this trial before
      const exists = db.prepare(`
        SELECT id FROM clinical_trial_alerts 
        WHERE nct_id = ? AND molecule = ?
      `).get(nctId, molecule);
      
      if (!exists) {
        newTrials.push({
          nctId,
          title: study.protocolSection?.identificationModule?.briefTitle,
          status: study.protocolSection?.statusModule?.overallStatus,
          phase: study.protocolSection?.designModule?.phases?.[0],
          startDate: study.protocolSection?.statusModule?.startDateStruct?.date
        });
      }
    }
    
    return newTrials;
  }

  async saveUpdates(updates) {
    const insert = db.prepare(`
      INSERT INTO clinical_trial_alerts 
      (nct_id, molecule, title, status, phase, alert_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    for (const update of updates) {
      for (const trial of update.trials) {
        insert.run(
          trial.nctId,
          update.molecule,
          trial.title,
          trial.status,
          trial.phase,
          new Date().toISOString()
        );
      }
    }
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
  }
}

export default new ClinicalTrialMonitor();
```

#### Step 2: Add WebSocket Support

**File**: `server/services/websocketService.js`

```javascript
import { Server } from 'socket.io';
import clinicalTrialMonitor from './clinicalTrialMonitor.js';

export function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Listen for trial updates
  clinicalTrialMonitor.on('trials-updated', (updates) => {
    io.emit('clinical-trial-update', updates);
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Subscribe to molecule monitoring
    socket.on('subscribe-molecule', (molecule) => {
      clinicalTrialMonitor.trackedMolecules.add(molecule.toLowerCase());
      socket.emit('subscribed', { molecule });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
```

#### Step 3: Update Server to Include WebSocket

**File**: `server/index.js` (add to existing file)

```javascript
import { createServer } from 'http';
import { setupWebSocket } from './services/websocketService.js';

// ... existing code ...

const httpServer = createServer(app);
const io = setupWebSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});
```

#### Step 4: Create Frontend Component

**File**: `client/src/components/ClinicalTrialAlerts.jsx`

```javascript
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { FaFlask, FaBell } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ClinicalTrialAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    
    newSocket.on('clinical-trial-update', (updates) => {
      setAlerts(prev => [...updates, ...prev]);
      toast.success(`New clinical trial updates for ${updates.length} molecule(s)!`);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const subscribeToMolecule = (molecule) => {
    if (socket) {
      socket.emit('subscribe-molecule', molecule);
      toast.success(`Now monitoring ${molecule}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-4">
        <FaBell className="text-blue-600" />
        <h3 className="font-semibold">Clinical Trial Alerts</h3>
      </div>
      
      {alerts.length === 0 ? (
        <p className="text-gray-500 text-sm">No new trial updates</p>
      ) : (
        <div className="space-y-2">
          {alerts.slice(0, 5).map((alert, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2">
              <div className="font-medium text-sm">{alert.molecule}</div>
              <div className="text-xs text-gray-600">
                {alert.trials.length} new trial(s) found
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Step 5: Database Migration

**File**: `server/database/migrations/add_trial_alerts.sql`

```sql
CREATE TABLE IF NOT EXISTS clinical_trial_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nct_id TEXT NOT NULL,
  molecule TEXT NOT NULL,
  title TEXT,
  status TEXT,
  phase TEXT,
  alert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  viewed BOOLEAN DEFAULT 0,
  UNIQUE(nct_id, molecule)
);

CREATE INDEX idx_molecule_alerts ON clinical_trial_alerts(molecule);
CREATE INDEX idx_alert_time ON clinical_trial_alerts(alert_time);
```

---

## 2. 📊 Predictive Analytics Dashboard

### Why This Innovation?
- **High Business Value**: Data-driven decision making
- **Moderate Complexity**: Can leverage existing ML libraries
- **Competitive Advantage**: Predictive insights differentiate from basic search

### Implementation Steps

#### Step 1: Create Prediction Service

**File**: `python-service/app/services/prediction_service.py`

```python
"""
Predictive Analytics Service for Drug Repurposing
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os
from loguru import logger

class PredictionService:
    """Service for predictive analytics"""
    
    def __init__(self):
        self.models_dir = "models"
        os.makedirs(self.models_dir, exist_ok=True)
        self.models = {}
        self._load_models()
    
    def _load_models(self):
        """Load pre-trained models"""
        try:
            if os.path.exists(f"{self.models_dir}/repurposing_success.pkl"):
                self.models['repurposing_success'] = joblib.load(
                    f"{self.models_dir}/repurposing_success.pkl"
                )
            if os.path.exists(f"{self.models_dir}/market_forecast.pkl"):
                self.models['market_forecast'] = joblib.load(
                    f"{self.models_dir}/market_forecast.pkl"
                )
        except Exception as e:
            logger.warning(f"Could not load models: {e}")
    
    def predict_repurposing_success(
        self,
        molecule: str,
        indication: str,
        therapy_area: str,
        market_size: float,
        competition_level: float,
        patent_risk: str,
        clinical_evidence: float
    ) -> Dict[str, Any]:
        """Predict success probability of repurposing opportunity"""
        
        # Feature engineering
        features = {
            'market_size_log': np.log1p(market_size),
            'competition_level': competition_level,
            'patent_risk_high': 1 if patent_risk == 'high' else 0,
            'patent_risk_medium': 1 if patent_risk == 'medium' else 0,
            'clinical_evidence': clinical_evidence,
            'therapy_area_oncology': 1 if therapy_area.lower() == 'oncology' else 0,
            'therapy_area_diabetes': 1 if therapy_area.lower() == 'diabetes' else 0,
        }
        
        # If model exists, use it; otherwise use heuristic
        if 'repurposing_success' in self.models:
            model = self.models['repurposing_success']
            features_array = np.array([list(features.values())])
            probability = model.predict_proba(features_array)[0][1]
        else:
            # Heuristic-based prediction
            probability = self._heuristic_success_score(features)
        
        return {
            'success_probability': float(probability),
            'confidence': 'high' if probability > 0.7 else 'medium' if probability > 0.5 else 'low',
            'key_factors': self._identify_key_factors(features),
            'recommendation': self._generate_recommendation(probability)
        }
    
    def _heuristic_success_score(self, features: Dict) -> float:
        """Heuristic-based success scoring"""
        score = 0.5  # Base score
        
        # Market size impact
        if features['market_size_log'] > 10:
            score += 0.15
        elif features['market_size_log'] > 8:
            score += 0.10
        
        # Competition impact (lower is better)
        if features['competition_level'] < 0.3:
            score += 0.15
        elif features['competition_level'] < 0.5:
            score += 0.10
        
        # Patent risk impact
        if features['patent_risk_high'] == 0:
            score += 0.10
        
        # Clinical evidence impact
        score += features['clinical_evidence'] * 0.15
        
        return min(1.0, max(0.0, score))
    
    def _identify_key_factors(self, features: Dict) -> List[str]:
        """Identify key factors affecting prediction"""
        factors = []
        
        if features['market_size_log'] > 10:
            factors.append("Large market opportunity")
        if features['competition_level'] < 0.3:
            factors.append("Low competition")
        if features['patent_risk_high'] == 0:
            factors.append("Low patent risk")
        if features['clinical_evidence'] > 0.7:
            factors.append("Strong clinical evidence")
        
        return factors if factors else ["Moderate opportunity"]
    
    def _generate_recommendation(self, probability: float) -> str:
        """Generate recommendation based on probability"""
        if probability > 0.7:
            return "Strong candidate - Recommend pursuing"
        elif probability > 0.5:
            return "Moderate candidate - Further analysis recommended"
        else:
            return "Weak candidate - Consider alternative opportunities"
    
    def forecast_market_size(
        self,
        molecule: str,
        indication: str,
        current_market_size: float,
        cagr: float,
        years: int = 5
    ) -> Dict[str, Any]:
        """Forecast market size over time"""
        
        forecast = []
        current = current_market_size
        
        for year in range(1, years + 1):
            # Compound growth
            forecasted = current * (1 + cagr / 100) ** year
            
            # Add some uncertainty
            uncertainty = np.random.normal(0, 0.1) * forecasted
            
            forecast.append({
                'year': year,
                'forecasted_size': float(forecasted + uncertainty),
                'lower_bound': float(forecasted * 0.85),
                'upper_bound': float(forecasted * 1.15),
                'cagr': cagr
            })
        
        return {
            'molecule': molecule,
            'indication': indication,
            'forecast': forecast,
            'current_size': current_market_size,
            'projected_size_5yr': forecast[-1]['forecasted_size']
        }
    
    def train_repurposing_model(self, training_data: List[Dict]) -> bool:
        """Train model on historical data"""
        try:
            df = pd.DataFrame(training_data)
            
            # Feature engineering
            X = df[['market_size', 'competition_level', 'patent_risk_encoded', 
                   'clinical_evidence', 'therapy_area_encoded']]
            y = df['success']  # Binary: 1 = success, 0 = failure
            
            # Train model
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            model = GradientBoostingClassifier(n_estimators=100, random_state=42)
            model.fit(X_train, y_train)
            
            # Save model
            joblib.dump(model, f"{self.models_dir}/repurposing_success.pkl")
            self.models['repurposing_success'] = model
            
            accuracy = model.score(X_test, y_test)
            logger.info(f"Model trained with accuracy: {accuracy:.2%}")
            
            return True
        except Exception as e:
            logger.error(f"Error training model: {e}")
            return False

# Singleton instance
prediction_service = PredictionService()
```

#### Step 2: Create API Endpoint

**File**: `python-service/app/api/routes.py` (add to existing)

```python
@agent_router.post("/predict/repurposing")
async def predict_repurposing_success(request: dict):
    """Predict repurposing success probability"""
    from app.services.prediction_service import prediction_service
    
    result = prediction_service.predict_repurposing_success(
        molecule=request.get('molecule'),
        indication=request.get('indication'),
        therapy_area=request.get('therapy_area'),
        market_size=request.get('market_size', 0),
        competition_level=request.get('competition_level', 0.5),
        patent_risk=request.get('patent_risk', 'medium'),
        clinical_evidence=request.get('clinical_evidence', 0.5)
    )
    
    return result

@agent_router.post("/predict/market-forecast")
async def forecast_market(request: dict):
    """Forecast market size"""
    from app.services.prediction_service import prediction_service
    
    result = prediction_service.forecast_market_size(
        molecule=request.get('molecule'),
        indication=request.get('indication'),
        current_market_size=request.get('current_market_size', 0),
        cagr=request.get('cagr', 5.0),
        years=request.get('years', 5)
    )
    
    return result
```

#### Step 3: Create Frontend Dashboard Component

**File**: `client/src/components/PredictiveDashboard.jsx`

```javascript
import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import api from '../utils/api';
import { FaChartLine, FaLightbulb } from 'react-icons/fa';

export default function PredictiveDashboard({ molecule, indication }) {
  const [prediction, setPrediction] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (molecule && indication) {
      fetchPredictions();
    }
  }, [molecule, indication]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      // Fetch repurposing success prediction
      const predResponse = await api.post('/api/agent/predict/repurposing', {
        molecule,
        indication,
        therapy_area: 'oncology', // Get from context
        market_size: 1000, // Get from market agent
        competition_level: 0.3,
        patent_risk: 'low',
        clinical_evidence: 0.7
      });
      setPrediction(predResponse.data);

      // Fetch market forecast
      const forecastResponse = await api.post('/api/agent/predict/market-forecast', {
        molecule,
        indication,
        current_market_size: 1000,
        cagr: 8.5,
        years: 5
      });
      setForecast(forecastResponse.data);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading predictions...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Success Probability Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaChartLine className="text-blue-600" />
          <h3 className="font-semibold">Repurposing Success Probability</h3>
        </div>
        
        {prediction && (
          <>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {(prediction.success_probability * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Confidence: <span className="font-medium">{prediction.confidence}</span>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Key Factors:</div>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {prediction.key_factors.map((factor, idx) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm font-medium text-blue-900">
                {prediction.recommendation}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Market Forecast Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaLightbulb className="text-green-600" />
          <h3 className="font-semibold">5-Year Market Forecast</h3>
        </div>
        
        {forecast && (
          <>
            <div className="text-2xl font-bold text-green-600 mb-4">
              ${(forecast.projected_size_5yr / 1000).toFixed(1)}B
            </div>
            
            <Line
              data={{
                labels: forecast.forecast.map(f => `Year ${f.year}`),
                datasets: [{
                  label: 'Forecasted Market Size',
                  data: forecast.forecast.map(f => f.forecasted_size / 1000),
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Market Size (Billions USD)' }
                  }
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 3. 🔗 Knowledge Graph Integration

### Why This Innovation?
- **High Value**: Discover hidden connections
- **Moderate Complexity**: Can use Neo4j or build custom graph
- **Differentiator**: Enables complex multi-hop queries

### Implementation Steps

#### Step 1: Set Up Neo4j (or use in-memory graph)

**File**: `python-service/app/services/knowledge_graph.py`

```python
"""
Knowledge Graph Service for Pharmaceutical Intelligence
"""

from typing import Dict, Any, List, Optional
from loguru import logger
import networkx as nx
import json

# Try to import Neo4j, fallback to NetworkX
try:
    from neo4j import GraphDatabase
    HAS_NEO4J = True
except ImportError:
    HAS_NEO4J = False
    logger.warning("Neo4j not available. Using NetworkX in-memory graph.")

class KnowledgeGraph:
    """Pharmaceutical knowledge graph"""
    
    def __init__(self):
        if HAS_NEO4J:
            uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
            user = os.getenv("NEO4J_USER", "neo4j")
            password = os.getenv("NEO4J_PASSWORD", "password")
            self.driver = GraphDatabase.driver(uri, auth=(user, password))
            self.use_neo4j = True
        else:
            self.graph = nx.MultiDiGraph()
            self.use_neo4j = False
            logger.info("Using in-memory NetworkX graph")
    
    def add_drug(self, drug_id: str, properties: Dict[str, Any]):
        """Add drug node to graph"""
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MERGE (d:Drug {id: $id}) SET d += $props",
                    id=drug_id, props=properties
                )
        else:
            self.graph.add_node(drug_id, type='Drug', **properties)
    
    def add_disease(self, disease_id: str, properties: Dict[str, Any]):
        """Add disease node to graph"""
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MERGE (d:Disease {id: $id}) SET d += $props",
                    id=disease_id, props=properties
                )
        else:
            self.graph.add_node(disease_id, type='Disease', **properties)
    
    def add_trial(self, trial_id: str, properties: Dict[str, Any]):
        """Add clinical trial node"""
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MERGE (t:Trial {id: $id}) SET t += $props",
                    id=trial_id, props=properties
                )
        else:
            self.graph.add_node(trial_id, type='Trial', **properties)
    
    def add_relationship(
        self,
        source_id: str,
        target_id: str,
        relationship_type: str,
        properties: Dict[str, Any] = None
    ):
        """Add relationship between nodes"""
        if self.use_neo4j:
            with self.driver.session() as session:
                query = f"""
                MATCH (a), (b)
                WHERE a.id = $source AND b.id = $target
                MERGE (a)-[r:{relationship_type}]->(b)
                SET r += $props
                """
                session.run(query, source=source_id, target=target_id, props=properties or {})
        else:
            self.graph.add_edge(source_id, target_id, type=relationship_type, **(properties or {}))
    
    def find_repurposing_paths(
        self,
        drug_id: str,
        target_disease: str,
        max_hops: int = 3
    ) -> List[Dict[str, Any]]:
        """Find paths from drug to disease (repurposing opportunities)"""
        if self.use_neo4j:
            with self.driver.session() as session:
                query = f"""
                MATCH path = (d:Drug {{id: $drug}})-[*1..{max_hops}]-(dis:Disease {{id: $disease}})
                RETURN path, length(path) as path_length
                ORDER BY path_length
                LIMIT 10
                """
                result = session.run(query, drug=drug_id, disease=target_disease)
                return [{"path": record["path"], "length": record["path_length"]} 
                       for record in result]
        else:
            try:
                paths = list(nx.all_simple_paths(
                    self.graph, drug_id, target_disease, cutoff=max_hops
                ))
                return [{"path": path, "length": len(path) - 1} for path in paths[:10]]
            except:
                return []
    
    def find_similar_drugs(self, drug_id: str, similarity_threshold: float = 0.7) -> List[str]:
        """Find similar drugs based on graph structure"""
        if self.use_neo4j:
            with self.driver.session() as session:
                query = """
                MATCH (d:Drug {id: $drug})-[r1]-(shared)-[r2]-(similar:Drug)
                WHERE similar.id <> $drug
                WITH similar, count(shared) as shared_count
                WHERE shared_count >= $threshold
                RETURN similar.id as drug_id, shared_count
                ORDER BY shared_count DESC
                LIMIT 10
                """
                result = session.run(query, drug=drug_id, threshold=int(similarity_threshold * 10))
                return [record["drug_id"] for record in result]
        else:
            # NetworkX implementation
            if drug_id not in self.graph:
                return []
            
            neighbors = set(self.graph.neighbors(drug_id))
            similar = {}
            
            for neighbor in neighbors:
                for other_drug in self.graph.neighbors(neighbor):
                    if other_drug != drug_id and self.graph.nodes[other_drug].get('type') == 'Drug':
                        similar[other_drug] = similar.get(other_drug, 0) + 1
            
            threshold = int(similarity_threshold * len(neighbors))
            return [drug for drug, count in sorted(similar.items(), key=lambda x: x[1], reverse=True)
                   if count >= threshold][:10]
    
    def get_drug_network(self, drug_id: str, depth: int = 2) -> Dict[str, Any]:
        """Get network around a drug"""
        if self.use_neo4j:
            with self.driver.session() as session:
                query = f"""
                MATCH (d:Drug {{id: $drug}})-[*0..{depth}]-(connected)
                RETURN DISTINCT connected, labels(connected) as types
                LIMIT 100
                """
                result = session.run(query, drug=drug_id)
                nodes = []
                for record in result:
                    node = dict(record["connected"])
                    node["type"] = record["types"][0] if record["types"] else "Unknown"
                    nodes.append(node)
                return {"nodes": nodes}
        else:
            if drug_id not in self.graph:
                return {"nodes": []}
            
            subgraph = nx.ego_graph(self.graph, drug_id, radius=depth)
            nodes = [{"id": node, **self.graph.nodes[node]} for node in subgraph.nodes()]
            return {"nodes": nodes}
    
    def close(self):
        """Close connections"""
        if self.use_neo4j and self.driver:
            self.driver.close()

# Singleton instance
knowledge_graph = KnowledgeGraph()
```

#### Step 2: Create Graph API Endpoint

**File**: `python-service/app/api/routes.py` (add)

```python
@agent_router.post("/graph/repurposing-paths")
async def find_repurposing_paths(request: dict):
    """Find repurposing paths in knowledge graph"""
    from app.services.knowledge_graph import knowledge_graph
    
    paths = knowledge_graph.find_repurposing_paths(
        drug_id=request.get('drug_id'),
        target_disease=request.get('target_disease'),
        max_hops=request.get('max_hops', 3)
    )
    
    return {"paths": paths}

@agent_router.get("/graph/drug-network/{drug_id}")
async def get_drug_network(drug_id: str, depth: int = 2):
    """Get network around a drug"""
    from app.services.knowledge_graph import knowledge_graph
    
    network = knowledge_graph.get_drug_network(drug_id, depth)
    return network
```

#### Step 3: Create Graph Visualization Component

**File**: `client/src/components/KnowledgeGraphViewer.jsx`

```javascript
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import api from '../utils/api';

export default function KnowledgeGraphViewer({ drugId }) {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!drugId) return;

    fetchGraphData();
  }, [drugId]);

  const fetchGraphData = async () => {
    try {
      const response = await api.get(`/api/agent/graph/drug-network/${drugId}?depth=2`);
      renderGraph(response.data);
    } catch (error) {
      console.error('Graph fetch error:', error);
    }
  };

  const renderGraph = (data) => {
    const width = containerRef.current?.clientWidth || 800;
    const height = 600;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink().id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Add nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter().append("circle")
      .attr("r", 8)
      .attr("fill", d => {
        const type = d.type || 'Unknown';
        const colors = {
          'Drug': '#3b82f6',
          'Disease': '#ef4444',
          'Trial': '#10b981',
          'Patent': '#f59e0b'
        };
        return colors[type] || '#6b7280';
      })
      .call(drag(simulation));

    // Add labels
    const label = svg.append("g")
      .selectAll("text")
      .data(data.nodes)
      .enter().append("text")
      .text(d => d.id.substring(0, 20))
      .attr("font-size", "10px")
      .attr("dx", 12)
      .attr("dy", 4);

    simulation.on("tick", () => {
      node.attr("cx", d => d.x).attr("cy", d => d.y);
      label.attr("x", d => d.x).attr("y", d => d.y);
    });

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow p-4">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
```

---

## 📦 Installation Requirements

### For Real-Time Monitoring:
```bash
npm install socket.io socket.io-client
```

### For Predictive Analytics:
```bash
pip install scikit-learn pandas numpy joblib
```

### For Knowledge Graph:
```bash
# Option 1: Neo4j (recommended for production)
pip install neo4j

# Option 2: NetworkX (lightweight, in-memory)
pip install networkx
```

---

## 🎯 Next Steps

1. **Choose one innovation** to start with
2. **Set up the required dependencies**
3. **Implement step-by-step**
4. **Test thoroughly**
5. **Deploy and monitor**

These innovations will significantly enhance RepurposeIQ's capabilities and provide competitive advantages!
