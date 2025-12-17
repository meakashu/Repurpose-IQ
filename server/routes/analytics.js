import express from 'express';
import jwt from 'jsonwebtoken';
import { AnalyticsService } from '../services/analyticsService.js';
import { RateLimiter } from '../services/rateLimiter.js';

const router = express.Router();

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

// Get analytics data (root route for compatibility)
router.get('/', verifyAuth, (req, res) => {
  try {
    const stats = AnalyticsService.getDashboardStats();
    const apiUsage = RateLimiter.getUsageStats();
    
    res.json({
      ...stats,
      api_usage: apiUsage
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Get analytics data
router.get('/stats', verifyAuth, (req, res) => {
  try {
    const stats = AnalyticsService.getDashboardStats();
    const apiUsage = RateLimiter.getUsageStats();
    
    res.json({
      ...stats,
      api_usage: apiUsage
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Get analytics overview (alias for root)
router.get('/overview', verifyAuth, (req, res) => {
  try {
    const stats = AnalyticsService.getDashboardStats();
    const apiUsage = RateLimiter.getUsageStats();
    
    res.json({
      ...stats,
      api_usage: apiUsage
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Get query statistics
router.get('/query-stats', verifyAuth, (req, res) => {
  try {
    const stats = AnalyticsService.getDashboardStats();
    res.json({
      queryStats: stats.queryStats || {},
      totalQueries: stats.totalQueries || 0,
      successRate: stats.successRate || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load query stats' });
  }
});

export default router;

