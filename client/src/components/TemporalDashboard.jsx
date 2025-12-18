import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TemporalDashboard({ molecule, timeRange = '5years' }) {
  const [marketData, setMarketData] = useState(null);
  const [trialData, setTrialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (molecule) {
      loadTemporalData();
    }
  }, [molecule, timeRange]);

  const loadTemporalData = async () => {
    setLoading(true);
    try {
      // First, fetch real market data for the molecule
      let currentMarketSize = 1000;
      let cagr = 8.5;
      
      try {
        const dashboardRes = await api.get('/dashboard/data');
        const moleculeData = dashboardRes.data.marketData.find(d => d.molecule === molecule);
        if (moleculeData) {
          currentMarketSize = moleculeData.market_size_usd_mn || 1000;
          cagr = moleculeData.cagr_percent || 8.5;
        }
      } catch (error) {
        console.warn('Failed to load market data, using defaults:', error);
      }

      // Fetch market forecast with real data
      const forecastRes = await api.post('/predictions/market-forecast', {
        molecule,
        indication: 'Various',
        current_market_size: currentMarketSize,
        cagr: cagr,
        years: 5
      }).catch(() => ({ data: null }));

      if (forecastRes?.data) {
        setMarketData(forecastRes.data);
      }

      // Mock trial data over time
      setTrialData({
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        trials: [5, 8, 12, 15, 18, 20],
        phases: {
          'Phase 1': [2, 3, 4, 5, 6, 7],
          'Phase 2': [1, 2, 3, 4, 5, 6],
          'Phase 3': [1, 2, 3, 4, 5, 5],
          'Phase 4': [1, 1, 2, 2, 2, 2]
        }
      });
    } catch (error) {
      console.error('Error loading temporal data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading temporal analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-2xl text-blue-600" />
          <div>
            <h3 className="font-semibold text-lg">Temporal Analysis</h3>
            <p className="text-sm text-gray-600">{molecule} - {timeRange}</p>
          </div>
        </div>
      </div>

      {/* Market Size Over Time */}
      {marketData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium mb-4">Market Size Evolution</h4>
          <Line
            data={{
              labels: marketData.forecast.map(f => `Year ${f.year}`),
              datasets: [
                {
                  label: 'Forecasted Market Size',
                  data: marketData.forecast.map(f => f.forecasted_size / 1000),
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  fill: true,
                  tension: 0.4
                },
                {
                  label: 'Lower Bound',
                  data: marketData.forecast.map(f => f.lower_bound / 1000),
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderDash: [5, 5],
                  fill: false
                },
                {
                  label: 'Upper Bound',
                  data: marketData.forecast.map(f => f.upper_bound / 1000),
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

      {/* Clinical Trials Over Time */}
      {trialData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium mb-4">Clinical Trials Timeline</h4>
          <Bar
            data={{
              labels: trialData.labels,
              datasets: Object.entries(trialData.phases).map(([phase, data], idx) => ({
                label: phase,
                data: data,
                backgroundColor: [
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(239, 68, 68, 0.8)'
                ][idx]
              }))
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: {
                  display: true,
                  text: 'Clinical Trials by Phase Over Time'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Number of Trials' },
                  stacked: true
                },
                x: {
                  stacked: true
                }
              }
            }}
          />
        </div>
      )}

      {/* Patent Expiry Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-medium mb-4">Patent Expiry Timeline</h4>
        <div className="space-y-3">
          {[
            { year: '2025', patents: 2, molecules: ['Molecule A', 'Molecule B'] },
            { year: '2026', patents: 3, molecules: ['Molecule C', 'Molecule D', 'Molecule E'] },
            { year: '2027', patents: 1, molecules: ['Molecule F'] }
          ].map((item) => (
            <div key={item.year} className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
              <div className="w-20 text-center font-semibold text-orange-700">{item.year}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.patents} patent(s) expiring</div>
                <div className="text-xs text-gray-600">{item.molecules.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
