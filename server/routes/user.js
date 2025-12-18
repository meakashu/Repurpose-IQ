import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';

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

// Get user preferences
router.get('/preferences', verifyAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Try to get preferences from database
    // For now, return defaults if not found
    const preferences = db.prepare(`
      SELECT preferences FROM user_preferences WHERE user_id = ?
    `).get(userId);

    if (preferences) {
      res.json(JSON.parse(preferences.preferences));
    } else {
      // Return default preferences
      res.json({
        notifications: {
          email: true,
          push: false,
          sms: false
        },
        preferences: {
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          dateFormat: 'MM/DD/YYYY'
        }
      });
    }
  } catch (error) {
    console.error('Error getting preferences:', error);
    // Return defaults on error
    res.json({
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      preferences: {
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: 'MM/DD/YYYY'
      }
    });
  }
});

// Save user preferences
router.post('/preferences', verifyAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notifications, preferences } = req.body;

    // Ensure user_preferences table exists
    try {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS user_preferences (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          preferences TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
        )
      `).run();
    } catch (e) {
      // Table might already exist
    }

    // Insert or update preferences
    const stmt = db.prepare(`
      INSERT INTO user_preferences (user_id, preferences)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        preferences = excluded.preferences,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(userId, JSON.stringify({ notifications, preferences }));

    res.json({
      success: true,
      message: 'Preferences saved successfully'
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

export default router;
