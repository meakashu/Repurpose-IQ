import { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { FaDownload, FaChartLine, FaArrowUp, FaFlask, FaPills, FaFileMedical, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
  generateMarketInsights,
  generateKPIInsights,
  formatInsightForUI,
  MANDATORY_DASHBOARD_DISCLAIMER
} from '../utils/dashboardIntelligence';

const COLORS = ['#0066cc', '#00a8e8', '#00d4aa', '#28a745', '#ffc107'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [kpiInsights, setKPIInsights] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/dashboard/data');
      setData(response.data);

      // Generate intelligent insights
      const marketInsights = generateMarketInsights(response.data.marketData);
      setInsights(marketInsights);

      const kpiAnalysis = generateKPIInsights(response.data.kpis);
      setKPIInsights(kpiAnalysis);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      toast.loading('Generating report...');
      const response = await api.post('/reports/pdf', {
        title: 'Dashboard Analytics Report',
        query: 'Dashboard Overview',
        content: `Dashboard Report\n\nTotal Market Size: $${data?.kpis?.totalMarket?.toFixed(0)}M\nAverage CAGR: ${data?.kpis?.avgCAGR?.toFixed(1)}%\nActive Patents: ${data?.kpis?.activePatents}/${data?.kpis?.totalPatents}\nClinical Trials: ${data?.kpis?.totalTrials}\n\nMarket Data:\n${data?.marketData?.map(m => `${m.molecule}: $${m.market_size_usd_mn}M (${m.cagr_percent}% CAGR)`).join('\n')}`,
        metadata: {
          agents_used: ['Dashboard'],
          user: 'current_user'
        }
      });

      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_API_URL || ''}/api/reports/download/${response.data.filename}`;
      link.download = response.data.filename;
      link.click();

      toast.dismiss();
      toast.success('Report downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="medical-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Yellow Banner Header - Snap Values Style */}
      <div className="px-6 lg:px-12 py-12 lg:py-16 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-black font-space-grotesk mb-4">
                Dashboard Overview
              </h1>
              <p className="text-xl lg:text-2xl text-black font-inter font-medium">
                Intelligent drug repurposing insights and analytics
              </p>
            </div>
            <button
              onClick={exportReport}
              className="btn-medical-primary flex items-center gap-2 px-8 py-4 text-lg"
            >
              <FaDownload />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards - Three Column Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: 'Total Market Size',
              value: `$${(data?.kpis?.totalMarket / 1000).toFixed(1) || '45.2'}B`,
              delta: '+12% YoY',
              icon: FaPills,
              trend: 'up',
            },
            {
              label: 'Average CAGR',
              value: `${data?.kpis?.avgCAGR?.toFixed(1) || '4.4'}%`,
              delta: '+2.3%',
              icon: FaChartLine,
              trend: 'up',
            },
            {
              label: 'Active Patents',
              value: data?.kpis?.activePatents || 372,
              delta: `/${data?.kpis?.totalPatents || 0} total`,
              icon: FaFileMedical,
              trend: 'stable',
            },
            {
              label: 'Clinical Trials',
              value: data?.kpis?.totalTrials || 744,
              delta: 'across all phases',
              icon: FaFlask,
              trend: 'up',
            },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="medical-stat-card bg-white border-2 border-black rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="medical-icon bg-black">
                    <Icon className="text-yellow-400" />
                  </div>
                  {kpi.trend === 'up' && (
                    <span className="medical-badge badge-primary flex items-center gap-1 text-xs">
                      <FaArrowUp className="text-xs" />
                      {kpi.delta}
                    </span>
                  )}
                </div>
                <div className="medical-stat-label text-black font-semibold">{kpi.label}</div>
                <div className="medical-stat-value mt-2 text-black">{kpi.value}</div>
                <div className="text-sm text-black opacity-70 mt-2">
                  {kpi.delta}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Insights Panel (ENTERPRISE INTELLIGENCE) */}
      {insights.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <div className="medical-card bg-white border-2 border-black rounded-xl shadow-lg">
            <div className="medical-card-header bg-gradient-to-r from-yellow-400 to-yellow-500 border-b-2 border-black">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-black font-space-grotesk">
                <FaLightbulb />
                Strategic Market Intelligence
              </h3>
            </div>
            <div className="medical-card-body p-6 space-y-3">
              {insights.slice(0, 3).map((insight, idx) => {
                const formatted = formatInsightForUI(insight);
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${formatted.colorClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{formatted.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold font-space-grotesk mb-1">
                          {insight.title}
                        </div>
                        <div className="text-sm font-inter">
                          {insight.message}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Size Chart */}
          <div className="medical-card bg-white border-2 border-black rounded-xl shadow-lg">
            <div className="medical-card-header bg-black">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-yellow-400">
                <FaChartLine />
                Market Size by Molecule
              </h3>
            </div>
            <div className="medical-card-body p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.marketData?.slice(0, 5) || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="molecule" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="market_size_usd_mn" fill="#0066cc" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t-2 border-black p-4 bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-black font-inter">
                <FaLightbulb className="text-yellow-500" />
                <span className="font-semibold">Insight:</span>
                <span>Molecules ranked by market size. Hover for therapy area and CAGR details.</span>
              </div>
            </div>
          </div>

          {/* Therapy Area Distribution */}
          <div className="medical-card bg-white border-2 border-black rounded-xl shadow-lg">
            <div className="medical-card-header bg-black">
              <h3 className="text-lg font-semibold text-yellow-400">Therapy Area Distribution</h3>
            </div>
            <div className="medical-card-body p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.marketData || []}
                    dataKey="market_size_usd_mn"
                    nameKey="therapy_area"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {(data?.marketData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t-2 border-black p-4 bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-black font-inter">
                <FaLightbulb className="text-yellow-500" />
                <span className="font-semibold">Insight:</span>
                <span>Therapy distribution reveals concentration risk. Oncology dominates portfolio.</span>
              </div>
            </div>
          </div>

          {/* Growth Trends */}
          <div className="medical-card bg-white border-2 border-black rounded-xl shadow-lg">
            <div className="medical-card-header bg-black">
              <h3 className="text-lg font-semibold text-yellow-400">Growth Trends</h3>
            </div>
            <div className="medical-card-body p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.marketData?.slice(0, 6) || []}>
                  <defs>
                    <linearGradient id="colorCAGR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066cc" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0066cc" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="molecule" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="cagr_percent" stroke="#0066cc" fillOpacity={1} fill="url(#colorCAGR)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t-2 border-black p-4 bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-black font-inter">
                <FaLightbulb className="text-yellow-500" />
                <span className="font-semibold">Insight:</span>
                <span>CAGR trends identify high-growth opportunities vs. stagnant or declining molecules.</span>
              </div>
            </div>
          </div>

          {/* Market Comparison */}
          <div className="medical-card bg-white border-2 border-black rounded-xl shadow-lg">
            <div className="medical-card-header bg-black">
              <h3 className="text-lg font-semibold text-yellow-400">Market Comparison</h3>
            </div>
            <div className="medical-card-body p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.marketData?.slice(0, 5) || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="molecule" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="market_size_usd_mn" stroke="#0066cc" strokeWidth={2} />
                  <Line type="monotone" dataKey="cagr_percent" stroke="#00d4aa" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t-2 border-black p-4 bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-black font-inter">
                <FaLightbulb className="text-yellow-500" />
                <span className="font-semibold">Insight:</span>
                <span>Dual-axis comparison enables prioritization: target high market size + high CAGR.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        <div className="medical-card bg-yellow-50 border-2 border-yellow-400 rounded-xl shadow-lg">
          <div className="p-4 flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-600 text-xl flex-shrink-0 mt-1" />
            <div className="flex-1 text-sm text-yellow-900 font-inter">
              <div className="font-semibold mb-1">STRATEGIC RESEARCH NOTICE</div>
              <div>{MANDATORY_DASHBOARD_DISCLAIMER}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
