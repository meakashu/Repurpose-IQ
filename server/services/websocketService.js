import { Server } from 'socket.io';
import clinicalTrialMonitor from './clinicalTrialMonitor.js';

/**
 * WebSocket Service for Real-Time Updates
 * Handles WebSocket connections and broadcasts real-time updates
 */
export function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Listen for trial updates from monitor
  clinicalTrialMonitor.on('trials-updated', (updates) => {
    console.log(`📢 Broadcasting ${updates.length} trial update(s) to all clients`);
    io.emit('clinical-trial-update', {
      type: 'trials-updated',
      data: updates,
      timestamp: new Date().toISOString()
    });
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Send current monitoring status
    socket.emit('monitoring-status', clinicalTrialMonitor.getStatus());

    // Subscribe to molecule monitoring
    socket.on('subscribe-molecule', (molecule) => {
      if (molecule && typeof molecule === 'string') {
        clinicalTrialMonitor.addMolecule(molecule);
        socket.emit('subscribed', { 
          molecule,
          message: `Now monitoring ${molecule}` 
        });
        
        // Broadcast to all clients
        io.emit('monitoring-status', clinicalTrialMonitor.getStatus());
      }
    });

    // Unsubscribe from molecule monitoring
    socket.on('unsubscribe-molecule', (molecule) => {
      if (molecule && typeof molecule === 'string') {
        clinicalTrialMonitor.removeMolecule(molecule);
        socket.emit('unsubscribed', { 
          molecule,
          message: `Stopped monitoring ${molecule}` 
        });
        
        // Broadcast to all clients
        io.emit('monitoring-status', clinicalTrialMonitor.getStatus());
      }
    });

    // Get monitoring status
    socket.on('get-monitoring-status', () => {
      socket.emit('monitoring-status', clinicalTrialMonitor.getStatus());
    });

    // Start monitoring (admin only - can be enhanced with auth)
    socket.on('start-monitoring', ({ molecules, interval }) => {
      if (molecules && Array.isArray(molecules)) {
        clinicalTrialMonitor.startMonitoring(molecules, interval);
        io.emit('monitoring-status', clinicalTrialMonitor.getStatus());
      }
    });

    // Stop monitoring
    socket.on('stop-monitoring', () => {
      clinicalTrialMonitor.stopMonitoring();
      io.emit('monitoring-status', clinicalTrialMonitor.getStatus());
    });

    // Get unread alerts
    socket.on('get-alerts', async () => {
      const alerts = await getUnreadAlerts();
      socket.emit('alerts', alerts);
    });

    // Mark alert as read
    socket.on('mark-alert-read', async (alertId) => {
      await markAlertAsRead(alertId);
      socket.emit('alert-read', { alertId });
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
}

/**
 * Get unread alerts from database
 */
async function getUnreadAlerts() {
  const db = (await import('../database/db.js')).default;
  return db.prepare(`
    SELECT * FROM clinical_trial_alerts 
    WHERE viewed = 0 
    ORDER BY alert_time DESC 
    LIMIT 50
  `).all();
}

/**
 * Mark alert as read
 */
async function markAlertAsRead(alertId) {
  const db = (await import('../database/db.js')).default;
  db.prepare(`
    UPDATE clinical_trial_alerts 
    SET viewed = 1 
    WHERE id = ?
  `).run(alertId);
}
