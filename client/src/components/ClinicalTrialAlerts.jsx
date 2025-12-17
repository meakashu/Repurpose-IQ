import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FaFlask, FaBell, FaTimes, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function ClinicalTrialAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [monitoringStatus, setMonitoringStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [moleculeInput, setMoleculeInput] = useState('');

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    newSocket.on('connect', () => {
      console.log('🔌 Connected to WebSocket server');
      setIsConnected(true);
      newSocket.emit('get-monitoring-status');
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket server');
      setIsConnected(false);
    });

    // Listen for trial updates
    newSocket.on('clinical-trial-update', (data) => {
      console.log('📢 Received trial update:', data);
      if (data.data && data.data.length > 0) {
        const totalTrials = data.data.reduce((sum, update) => sum + update.trials.length, 0);
        toast.success(`🔔 ${totalTrials} new clinical trial(s) found!`, {
          duration: 5000,
          icon: '🔬'
        });
        loadAlerts(); // Reload alerts
      }
    });

    // Listen for monitoring status updates
    newSocket.on('monitoring-status', (status) => {
      setMonitoringStatus(status);
    });

    // Listen for subscription confirmations
    newSocket.on('subscribed', (data) => {
      toast.success(data.message || `Now monitoring ${data.molecule}`);
      loadAlerts();
    });

    newSocket.on('unsubscribed', (data) => {
      toast.success(data.message || `Stopped monitoring ${data.molecule}`);
    });

    setSocket(newSocket);

    // Load initial alerts
    loadAlerts();

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await api.get('/api/monitoring/alerts?viewed=false&limit=20');
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const subscribeToMolecule = () => {
    if (!moleculeInput.trim()) {
      toast.error('Please enter a molecule name');
      return;
    }

    if (socket) {
      socket.emit('subscribe-molecule', moleculeInput.trim());
      setMoleculeInput('');
    } else {
      // Fallback to REST API
      api.post('/api/monitoring/add-molecule', { molecule: moleculeInput.trim() })
        .then(() => {
          toast.success(`Now monitoring ${moleculeInput.trim()}`);
          loadAlerts();
          setMoleculeInput('');
        })
        .catch(error => {
          toast.error(error.response?.data?.error || 'Failed to subscribe');
        });
    }
  };

  const unsubscribeFromMolecule = (molecule) => {
    if (socket) {
      socket.emit('unsubscribe-molecule', molecule);
    } else {
      api.post('/api/monitoring/remove-molecule', { molecule })
        .then(() => {
          toast.success(`Stopped monitoring ${molecule}`);
          loadAlerts();
        })
        .catch(error => {
          toast.error(error.response?.data?.error || 'Failed to unsubscribe');
        });
    }
  };

  const markAlertAsRead = async (alertId) => {
    try {
      await api.post(`/api/monitoring/alerts/${alertId}/read`);
      setAlerts(alerts.filter(a => a.id !== alertId));
      toast.success('Alert marked as read');
    } catch (error) {
      toast.error('Failed to mark alert as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/api/monitoring/alerts/read-all');
      setAlerts([]);
      toast.success('All alerts marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
            <FaBell className={`text-lg ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Clinical Trial Alerts</h3>
            <p className="text-xs text-gray-500">
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </p>
          </div>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <FaCheck /> Mark all read
          </button>
        )}
      </div>

      {/* Monitoring Status */}
      {monitoringStatus && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm">
            <span className="font-medium">Monitoring:</span>{' '}
            {monitoringStatus.trackedMolecules.length > 0 ? (
              <span className="text-blue-600">
                {monitoringStatus.trackedMolecules.join(', ')}
              </span>
            ) : (
              <span className="text-gray-500">No molecules being monitored</span>
            )}
          </div>
        </div>
      )}

      {/* Add Molecule Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={moleculeInput}
          onChange={(e) => setMoleculeInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && subscribeToMolecule()}
          placeholder="Enter molecule name (e.g., Metformin)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={subscribeToMolecule}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Monitor
        </button>
      </div>

      {/* Tracked Molecules */}
      {monitoringStatus?.trackedMolecules?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {monitoringStatus.trackedMolecules.map((mol) => (
            <span
              key={mol}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
            >
              {mol}
              <button
                onClick={() => unsubscribeFromMolecule(mol)}
                className="hover:text-blue-600"
              >
                <FaTimes className="text-xs" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaFlask className="mx-auto text-4xl mb-2 opacity-50" />
            <p className="text-sm">No new trial alerts</p>
            <p className="text-xs mt-1">Subscribe to molecules to get real-time updates</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">
                      {alert.molecule}
                    </span>
                    {alert.phase && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                        {alert.phase}
                      </span>
                    )}
                    {alert.status && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                        {alert.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{alert.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {alert.start_date && (
                      <span>Started: {new Date(alert.start_date).toLocaleDateString()}</span>
                    )}
                    <span>Alert: {new Date(alert.alert_time).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {alert.url && (
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                      title="View on ClinicalTrials.gov"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  )}
                  <button
                    onClick={() => markAlertAsRead(alert.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                    title="Mark as read"
                  >
                    <FaCheck className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t text-center">
          <button
            onClick={loadAlerts}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Refresh alerts
          </button>
        </div>
      )}
    </div>
  );
}
