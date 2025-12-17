import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FaChartLine, FaRobot, FaDatabase, FaSearch } from 'react-icons/fa';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="medical-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaChartLine />
          System Analytics
        </h1>
        <p className="text-gray-600 mt-1">Query patterns, API usage, and system performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Queries', 
            value: stats?.total_queries || 0, 
            delta: 'all time',
            icon: FaSearch,
            color: 'blue'
          },
          { 
            label: 'Queries Today', 
            value: stats?.queries_today || 0, 
            delta: 'today',
            icon: FaChartLine,
            color: 'green'
          },
          { 
            label: 'Avg Response Time', 
            value: `${Math.round(stats?.avg_response_time || 0)}ms`, 
            delta: 'average',
            icon: FaDatabase,
            color: 'purple'
          },
          { 
            label: 'API Calls Today', 
            value: Object.values(stats?.api_usage || {}).reduce((sum, u) => sum + (u.global_calls || 0), 0), 
            delta: 'total',
            icon: FaRobot,
            color: 'orange'
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="medical-stat-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="medical-icon">
                  <Icon className="text-white" />
                </div>
              </div>
              <div className="medical-stat-label">{kpi.label}</div>
              <div className="medical-stat-value mt-2">{kpi.value}</div>
              <div className="medical-stat-change stat-positive mt-2">{kpi.delta}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Usage */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="medical-card"
        >
          <div className="medical-card-header">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaRobot />
              Agent Usage
            </h3>
          </div>
          <div className="medical-card-body">
            {stats?.agent_usage && Object.keys(stats.agent_usage).length > 0 ? (
              <BarChart width={500} height={300} data={Object.entries(stats.agent_usage).map(([agent, count]) => ({ agent, count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="agent" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#0066cc" radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : (
              <div className="medical-empty-state py-8">
                <p className="medical-empty-state-text">No agent usage data yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* API Usage */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="medical-card"
        >
          <div className="medical-card-header">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaDatabase />
              API Usage
            </h3>
          </div>
          <div className="medical-card-body">
            {stats?.api_usage && Object.keys(stats.api_usage).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.api_usage).map(([api, data]) => {
                  const pct = (data.global_calls / data.global_limit) * 100;
                  return (
                    <div key={api}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">{api.toUpperCase()}</span>
                        <span className="text-sm text-gray-600">{data.global_calls}/{data.global_limit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            pct < 70 ? 'bg-green-500' : pct < 90 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="medical-empty-state py-8">
                <p className="medical-empty-state-text">No API usage data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Popular Terms */}
      {stats?.popular_terms && stats.popular_terms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medical-card"
        >
          <div className="medical-card-header">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaSearch />
              Popular Search Terms
            </h3>
          </div>
          <div className="medical-card-body">
            <div className="space-y-2">
              {stats.popular_terms.slice(0, 10).map((term, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <span className="font-medium text-gray-900">{term.term}</span>
                  <span className="medical-badge badge-primary">{term.count} queries</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
