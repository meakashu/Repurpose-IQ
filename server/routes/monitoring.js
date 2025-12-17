import express from 'express';
import clinicalTrialMonitor from '../services/clinicalTrialMonitor.js';
import db from '../database/db.js';

const router = express.Router();

// Get monitoring status
router.get('/status', (req, res) => {
  try {
    const status = clinicalTrialMonitor.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start monitoring
router.post('/start', (req, res) => {
  try {
    const { molecules, interval } = req.body;
    if (!molecules || !Array.isArray(molecules)) {
      return res.status(400).json({ error: 'molecules array is required' });
    }
    
    clinicalTrialMonitor.startMonitoring(molecules, interval);
    res.json({ 
      message: 'Monitoring started',
      status: clinicalTrialMonitor.getStatus()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop monitoring
router.post('/stop', (req, res) => {
  try {
    clinicalTrialMonitor.stopMonitoring();
    res.json({ message: 'Monitoring stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add molecule to monitoring
router.post('/add-molecule', (req, res) => {
  try {
    const { molecule } = req.body;
    if (!molecule) {
      return res.status(400).json({ error: 'molecule is required' });
    }
    
    clinicalTrialMonitor.addMolecule(molecule);
    res.json({ 
      message: `Added ${molecule} to monitoring`,
      status: clinicalTrialMonitor.getStatus()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove molecule from monitoring
router.post('/remove-molecule', (req, res) => {
  try {
    const { molecule } = req.body;
    if (!molecule) {
      return res.status(400).json({ error: 'molecule is required' });
    }
    
    clinicalTrialMonitor.removeMolecule(molecule);
    res.json({ 
      message: `Removed ${molecule} from monitoring`,
      status: clinicalTrialMonitor.getStatus()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get alerts
router.get('/alerts', (req, res) => {
  try {
    const { viewed, limit = 50 } = req.query;
    
    let query = 'SELECT * FROM clinical_trial_alerts';
    const params = [];
    
    if (viewed !== undefined) {
      query += ' WHERE viewed = ?';
      params.push(viewed === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY alert_time DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const alerts = db.prepare(query).all(...params);
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark alert as read
router.post('/alerts/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE clinical_trial_alerts SET viewed = 1 WHERE id = ?').run(id);
    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all alerts as read
router.post('/alerts/read-all', (req, res) => {
  try {
    db.prepare('UPDATE clinical_trial_alerts SET viewed = 1 WHERE viewed = 0').run();
    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
