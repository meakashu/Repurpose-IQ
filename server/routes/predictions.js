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

// Market forecast
router.post('/market-forecast', verifyAuth, async (req, res) => {
  try {
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/predictions/market-forecast`,
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
    console.error('Predictions API error (market-forecast):', error.message);
    
    // Fallback to mock data if Python service unavailable
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('Python service unavailable, returning mock forecast data');
      const { molecule, years = 5, current_market_size = 1000, cagr = 8.5 } = req.body;
      
      const forecast = [];
      let size = current_market_size;
      for (let year = 1; year <= years; year++) {
        size = size * (1 + cagr / 100);
        forecast.push({
          year,
          forecasted_size: Math.round(size),
          lower_bound: Math.round(size * 0.95),
          upper_bound: Math.round(size * 1.05)
        });
      }
      
      res.json({
        forecast,
        molecule,
        note: 'Mock data - Python service unavailable'
      });
    } else {
      res.status(500).json({ error: error.message || 'Failed to forecast market' });
    }
  }
});

// Repurposing success prediction
router.post('/repurposing-success', verifyAuth, async (req, res) => {
  try {
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/predictions/repurposing-success`,
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
    console.error('Predictions API error (repurposing-success):', error.message);
    
    // Fallback to mock data
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      const { molecule, indication } = req.body;
      res.json({
        success_probability: 0.72,
        confidence: 0.85,
        factors: {
          market_size: 'favorable',
          competition: 'moderate',
          patent_risk: 'low',
          clinical_evidence: 'strong'
        },
        molecule,
        indication,
        note: 'Mock data - Python service unavailable'
      });
    } else {
      res.status(500).json({ error: error.message || 'Failed to predict repurposing success' });
    }
  }
});

// Patent expiry impact
router.post('/patent-expiry-impact', verifyAuth, async (req, res) => {
  try {
    const { molecule, expiry_date, current_market_size } = req.body;
    
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/predictions/patent-expiry-impact`,
      {
        molecule,
        expiry_date,
        current_market_size
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
    console.error('Predictions API error (patent-expiry-impact):', error.message);
    
    // Fallback to mock data
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      const { molecule, current_market_size = 1000 } = req.body;
      res.json({
        impact_score: 0.65,
        projected_decline: 0.35,
        timeline: {
          year_1: current_market_size * 0.9,
          year_2: current_market_size * 0.75,
          year_3: current_market_size * 0.6
        },
        molecule,
        note: 'Mock data - Python service unavailable'
      });
    } else {
      res.status(500).json({ error: error.message || 'Failed to predict patent expiry impact' });
    }
  }
});

export default router;
