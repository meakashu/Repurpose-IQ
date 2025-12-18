import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../utils/api';
import { FaChartLine, FaLightbulb, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function PredictiveDashboard({ molecule, indication, onClose }) {
  const [prediction, setPrediction] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('success'); // 'success', 'forecast', 'patent'

  useEffect(() => {
    if (molecule && indication) {
      fetchPredictions();
    }
  }, [molecule, indication]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      // Fetch repurposing success prediction
      const predResponse = await api.post('/predictions/repurposing-success', {
        molecule,
        indication,
        therapy_area: 'oncology', // Could be extracted from context
        market_size: 1000,
        competition_level: 0.3,
        patent_risk: 'low',
        clinical_evidence: 0.7,
        existing_indications: 1
      }).catch(() => {
        // Fallback if Python service not available
        return { data: null };
      });

      if (predResponse?.data) {
        setPrediction(predResponse.data);
      }

      // Fetch market forecast
      const forecastResponse = await api.post('/predictions/market-forecast', {
        molecule,
        indication,
        current_market_size: 1000,
        cagr: 8.5,
        years: 5
      }).catch(() => {
        return { data: null };
      });

      if (forecastResponse?.data) {
        setForecast(forecastResponse.data);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to load predictions. Python service may not be running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading predictions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Predictive Analytics</h2>
          <p className="text-gray-600 text-sm mt-1">
            {molecule} - {indication}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('success')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'success'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Success Prediction
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'forecast'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Market Forecast
        </button>
        <button
          onClick={() => setActiveTab('patent')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'patent'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Patent Impact
        </button>
      </div>

      {/* Success Prediction Tab */}
      {activeTab === 'success' && prediction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Success Probability Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-blue-600" />
              <h3 className="font-semibold">Repurposing Success Probability</h3>
            </div>
            
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {(prediction.success_probability * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Confidence: <span className="font-medium capitalize">{prediction.confidence}</span>
            </div>
            
            {/* Probability Gauge */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${prediction.success_probability * 100}%` }}
              ></div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Key Factors:</div>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {prediction.key_factors?.map((factor, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-xs" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg ${
              prediction.success_probability > 0.7
                ? 'bg-green-50 border border-green-200'
                : prediction.success_probability > 0.5
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="text-sm font-medium mb-1">Recommendation:</div>
              <div className="text-sm text-gray-700">{prediction.recommendation}</div>
            </div>
          </div>

          {/* Risk Factors Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaExclamationTriangle className="text-orange-600" />
              <h3 className="font-semibold">Risk Factors</h3>
            </div>
            
            {prediction.risk_factors && prediction.risk_factors.length > 0 ? (
              <ul className="space-y-3">
                {prediction.risk_factors.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                    <FaExclamationTriangle className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaCheckCircle className="mx-auto text-3xl text-green-500 mb-2" />
                <p className="text-sm">No significant risk factors identified</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Forecast Tab */}
      {activeTab === 'forecast' && forecast && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Current Market Size</div>
              <div className="text-2xl font-bold text-blue-600">
                ${(forecast.current_size / 1000).toFixed(1)}B
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">5-Year Projection</div>
              <div className="text-2xl font-bold text-green-600">
                ${(forecast.projected_size_5yr / 1000).toFixed(1)}B
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Growth</div>
              <div className="text-2xl font-bold text-purple-600">
                {forecast.total_growth_percent?.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Forecast Chart */}
          {forecast.forecast && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">5-Year Market Forecast</h3>
              <Line
                data={{
                  labels: forecast.forecast.map(f => `Year ${f.year}`),
                  datasets: [
                    {
                      label: 'Forecasted Market Size',
                      data: forecast.forecast.map(f => f.forecasted_size / 1000),
                      borderColor: 'rgb(34, 197, 94)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      fill: true,
                      tension: 0.4
                    },
                    {
                      label: 'Lower Bound',
                      data: forecast.forecast.map(f => f.lower_bound / 1000),
                      borderColor: 'rgb(239, 68, 68)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderDash: [5, 5],
                      fill: false
                    },
                    {
                      label: 'Upper Bound',
                      data: forecast.forecast.map(f => f.upper_bound / 1000),
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderDash: [5, 5],
                      fill: false
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Market Size Forecast (Billions USD)'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Market Size (Billions USD)' }
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Patent Impact Tab */}
      {activeTab === 'patent' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Patent Expiry Impact Analysis</h3>
          <p className="text-gray-600 text-sm mb-4">
            Enter patent expiry details to analyze market impact
          </p>
          <div className="text-center py-8 text-gray-500">
            <FaLightbulb className="mx-auto text-3xl mb-2" />
            <p className="text-sm">Patent impact analysis coming soon</p>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!prediction && !forecast && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaLightbulb className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No prediction data available</p>
          <p className="text-sm text-gray-500">
            {molecule && indication
              ? 'Python prediction service may not be running'
              : 'Please select a molecule and indication'}
          </p>
        </div>
      )}
    </div>
  );
}
