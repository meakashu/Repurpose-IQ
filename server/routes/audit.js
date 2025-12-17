/**
 * Audit trail routes for governance and explainability
 */

import express from 'express';
import pythonAgentService from '../services/pythonAgentService.js';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';

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

// Get audit logs
router.get('/logs', verifyAuth, (req, res) => {
  try {
    const userId = req.user?.userId;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // Get query tracking logs
    let logs;
    let totalResult;
    
    try {
      if (userId) {
        logs = db.prepare(`
          SELECT * FROM query_tracking 
          WHERE user_id = ? OR user_id IS NULL
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `).all(userId, limit, offset);
        
        totalResult = db.prepare(`
          SELECT COUNT(*) as count FROM query_tracking 
          WHERE user_id = ? OR user_id IS NULL
        `).get(userId);
      } else {
        logs = db.prepare(`
          SELECT * FROM query_tracking 
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `).all(limit, offset);
        
        totalResult = db.prepare(`
          SELECT COUNT(*) as count FROM query_tracking
        `).get();
      }

      const total = totalResult?.count || 0;

      res.json({
        logs: logs || [],
        total: total,
        limit,
        offset
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return empty result if table doesn't exist or query fails
      res.json({
        logs: [],
        total: 0,
        limit,
        offset
      });
    }
  } catch (error) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({ error: error.message || 'Failed to get audit logs' });
  }
});

// Get audit trail for a query
router.get('/:auditId', verifyAuth, async (req, res) => {
  try {
    const { auditId } = req.params;
    const auditTrail = await pythonAgentService.getAuditTrail(auditId);
    res.json(auditTrail);
  } catch (error) {
    console.error('Error getting audit trail:', error);
    res.status(500).json({ error: error.message || 'Failed to get audit trail' });
  }
});

// Get query status
router.get('/status/:auditId', verifyAuth, async (req, res) => {
  try {
    const { auditId } = req.params;
    const status = await pythonAgentService.getQueryStatus(auditId);
    res.json(status);
  } catch (error) {
    console.error('Error getting query status:', error);
    res.status(500).json({ error: error.message || 'Failed to get query status' });
  }
});

export default router;

