import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// Middleware to verify auth
const verifyAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Find repurposing paths
router.post('/repurposing-paths', verifyAuth, async (req, res) => {
  try {
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/graph/repurposing-paths`,
      req.body,
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Graph API error (repurposing-paths):', error.message);
    
    // Fallback to mock data if Python service unavailable
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('Python service unavailable, returning mock data');
      res.json({
        paths: [
          {
            length: 2,
            path: [
              { id: req.body.drug_id || 'Metformin', type: 'Drug' },
              { id: 'AMPK Activation', type: 'Mechanism' },
              { id: req.body.target_disease || 'Fibrosis', type: 'Disease' }
            ]
          }
        ],
        count: 1,
        note: 'Mock data - Python service unavailable'
      });
    } else {
      res.status(500).json({ error: error.message || 'Failed to find repurposing paths' });
    }
  }
});

// Get drug network
router.get('/drug-network/:drug_id', verifyAuth, async (req, res) => {
  try {
    const { drug_id } = req.params;
    const depth = parseInt(req.query.depth) || 2;
    
    const response = await axios.get(
      `${PYTHON_SERVICE_URL}/api/graph/drug-network/${drug_id}?depth=${depth}`,
      {
        timeout: 30000
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Graph API error (drug-network):', error.message);
    
    // Fallback to mock data
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.json({
        nodes: [
          { id: req.params.drug_id, type: 'Drug', name: req.params.drug_id },
          { id: 'Disease1', type: 'Disease', name: 'Related Disease 1' },
          { id: 'Trial1', type: 'Trial', name: 'Clinical Trial 1' }
        ],
        note: 'Mock data - Python service unavailable'
      });
    } else {
      res.status(500).json({ error: error.message || 'Failed to get drug network' });
    }
  }
});

// Find similar drugs
router.get('/similar-drugs/:drug_id', verifyAuth, async (req, res) => {
  try {
    const { drug_id } = req.params;
    const threshold = parseFloat(req.query.threshold) || 0.7;
    
    const response = await axios.get(
      `${PYTHON_SERVICE_URL}/api/graph/similar-drugs/${drug_id}?threshold=${threshold}`,
      {
        timeout: 30000
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Graph API error (similar-drugs):', error.message);
    
    // Fallback to mock data
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.json({
        similar_drugs: ['Rapamycin', 'Resveratrol', 'Berberine', 'Acarbose'],
        count: 4,
        note: 'Mock data - Python service unavailable'
      });
    } else {
      res.status(500).json({ error: error.message || 'Failed to find similar drugs' });
    }
  }
});

// Add node to graph
router.post('/add-node', verifyAuth, async (req, res) => {
  try {
    const { node_type, node_id, properties } = req.body;
    
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/graph/add-node`,
      {
        node_type,
        node_id,
        properties
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Graph API error (add-node):', error.message);
    res.status(500).json({ error: error.message || 'Failed to add node' });
  }
});

// Add relationship to graph
router.post('/add-relationship', verifyAuth, async (req, res) => {
  try {
    const { source_id, target_id, relationship_type, properties } = req.body;
    
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/graph/add-relationship`,
      {
        source_id,
        target_id,
        relationship_type,
        properties
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Graph API error (add-relationship):', error.message);
    res.status(500).json({ error: error.message || 'Failed to add relationship' });
  }
});

export default router;
