import express from 'express';
import db from '../database/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

// Get dashboard data (root route for compatibility)
router.get('/', verifyAuth, async (req, res) => {
  try {
    const marketData = db.prepare('SELECT * FROM market_data').all();
    const patentData = db.prepare('SELECT * FROM patents').all();
    const clinicalData = db.prepare('SELECT * FROM clinical_trials').all();

    // Calculate KPIs
    const totalMarket = marketData.reduce((sum, d) => sum + (d.market_size_usd_mn || 0), 0);
    const avgCAGR = marketData.length > 0
      ? marketData.reduce((sum, d) => sum + (d.cagr_percent || 0), 0) / marketData.length
      : 0;
    const activePatents = patentData.filter(p => p.status === 'active').length;
    const totalTrials = clinicalData.length;

    res.json({
      kpis: {
        totalMarket,
        avgCAGR,
        activePatents,
        totalTrials
      },
      marketData,
      patentData,
      clinicalData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Get dashboard data
router.get('/data', verifyAuth, async (req, res) => {
  try {
    const marketData = db.prepare('SELECT * FROM market_data').all();
    const patentData = db.prepare('SELECT * FROM patents').all();
    const clinicalData = db.prepare('SELECT * FROM clinical_trials').all();

    // Calculate KPIs
    const totalMarket = marketData.reduce((sum, d) => sum + (d.market_size_usd_mn || 0), 0);
    const avgCAGR = marketData.length > 0
      ? marketData.reduce((sum, d) => sum + (d.cagr_percent || 0), 0) / marketData.length
      : 0;
    const activePatents = patentData.filter(p => p.status === 'active').length;
    const totalPatents = patentData.length;
    const totalTrials = clinicalData.length;

    res.json({
      kpis: {
        totalMarket,
        avgCAGR,
        activePatents,
        totalPatents,
        totalTrials
      },
      marketData,
      patentData,
      clinicalData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

export default router;
