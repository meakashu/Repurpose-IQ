import { useState, useEffect } from 'react';
import ClinicalTrialAlerts from '../components/ClinicalTrialAlerts';
import api from '../utils/api';
import { FaFlask, FaChartLine, FaBell } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Monitoring() {
  const [monitoringStatus, setMonitoringStatus] = useState(null);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    unreadAlerts: 0,
    trackedMolecules: 0
  });

  useEffect(() => {
    loadMonitoringStatus();
    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadMonitoringStatus = async () => {
    try {
      const response = await api.get('/monitoring/status');
      setMonitoringStatus(response.data);
    } catch (error) {
      console.error('Failed to load monitoring status:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [alertsRes, statusRes] = await Promise.all([
        api.get('/monitoring/alerts?limit=1000'),
        api.get('/monitoring/status')
      ]);

      const allAlerts = alertsRes.data.alerts || [];
      const unreadAlerts = allAlerts.filter(a => !a.viewed);

      setStats({
        totalAlerts: allAlerts.length,
        unreadAlerts: unreadAlerts.length,
        trackedMolecules: statusRes.data.trackedMolecules?.length || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const startMonitoring = async (molecules, interval) => {
    try {
      await api.post('/monitoring/start', { molecules, interval });
      toast.success('Monitoring started');
      loadMonitoringStatus();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start monitoring');
    }
  };

  const stopMonitoring = async () => {
    try {
      await api.post('/monitoring/stop');
      toast.success('Monitoring stopped');
      loadMonitoringStatus();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to stop monitoring');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Real-Time Monitoring Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor clinical trials, patents, and market updates in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tracked Molecules</p>
                <p className="text-3xl font-bold text-blue-600">{stats.trackedMolecules}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaFlask className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unread Alerts</p>
                <p className="text-3xl font-bold text-orange-600">{stats.unreadAlerts}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FaBell className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalAlerts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaChartLine className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Status */}
        {monitoringStatus && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Monitoring Status</h2>
              <div className="flex gap-2">
                {monitoringStatus.isMonitoring ? (
                  <button
                    onClick={stopMonitoring}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Stop Monitoring
                  </button>
                ) : (
                  <button
                    onClick={() => startMonitoring(monitoringStatus.trackedMolecules || [])}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Start Monitoring
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Status:</span>{' '}
                <span className={`font-medium ${monitoringStatus.isMonitoring ? 'text-green-600' : 'text-gray-400'}`}>
                  {monitoringStatus.isMonitoring ? '🟢 Active' : '🔴 Inactive'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Check Interval:</span>{' '}
                <span className="font-medium">
                  {monitoringStatus.checkInterval ? `${monitoringStatus.checkInterval / 1000 / 60} minutes` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last Check:</span>{' '}
                <span className="font-medium">
                  {monitoringStatus.lastCheckTime 
                    ? new Date(monitoringStatus.lastCheckTime).toLocaleString() 
                    : 'Never'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Tracked Molecules:</span>{' '}
                <span className="font-medium">
                  {monitoringStatus.trackedMolecules?.length || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Trial Alerts */}
        <ClinicalTrialAlerts />
      </div>
    </div>
  );
}
