import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FaBalanceScale, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Compare() {
  const [molecules, setMolecules] = useState([]);
  const [selectedMolecules, setSelectedMolecules] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMolecules();
  }, []);

  useEffect(() => {
    if (selectedMolecules.length >= 2) {
      compareMolecules();
    }
  }, [selectedMolecules]);

  const fetchMolecules = async () => {
    try {
      const response = await api.get('/dashboard/data');
      const uniqueMolecules = [...new Set(response.data.marketData.map(d => d.molecule))];
      setMolecules(uniqueMolecules.filter(Boolean));
    } catch (error) {
      console.error('Failed to load molecules:', error);
    } finally {
      setLoading(false);
    }
  };

  const compareMolecules = async () => {
    try {
      const response = await api.get('/dashboard/data');
      const data = response.data.marketData.filter(d => 
        selectedMolecules.includes(d.molecule)
      );
      setComparisonData(data);
    } catch (error) {
      console.error('Failed to compare molecules:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="medical-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading molecules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaBalanceScale />
          Molecule Comparison
        </h1>
        <p className="text-gray-600 mt-1">Compare drug molecules and repurposing opportunities side-by-side</p>
      </div>

      {/* Molecule Selection */}
      <div className="medical-card">
        <div className="medical-card-header">
          <h3 className="text-lg font-semibold">Select Molecules to Compare</h3>
        </div>
        <div className="medical-card-body">
          <p className="text-sm text-gray-600 mb-4">Select 2-4 molecules to compare (currently: {selectedMolecules.length})</p>
          <div className="flex flex-wrap gap-3">
            {molecules.map((mol) => {
              const isSelected = selectedMolecules.includes(mol);
              return (
                <button
                  key={mol}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedMolecules(selectedMolecules.filter(m => m !== mol));
                    } else if (selectedMolecules.length < 4) {
                      setSelectedMolecules([...selectedMolecules, mol]);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? <FaCheckCircle /> : <FaTimesCircle />}
                  {mol}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Charts */}
      {comparisonData && comparisonData.length >= 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="medical-card"
          >
            <div className="medical-card-header">
              <h3 className="text-lg font-semibold">Market Size Comparison</h3>
            </div>
            <div className="medical-card-body">
              <BarChart width={500} height={300} data={comparisonData}>
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
                <Bar dataKey="market_size_usd_mn" fill="#0066cc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="medical-card"
          >
            <div className="medical-card-header">
              <h3 className="text-lg font-semibold">CAGR Comparison</h3>
            </div>
            <div className="medical-card-body">
              <BarChart width={500} height={300} data={comparisonData}>
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
                <Bar dataKey="cagr_percent" fill="#00d4aa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="medical-card">
          <div className="medical-card-body">
            <div className="medical-empty-state">
              <div className="medical-empty-state-icon">⚖️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Comparison Selected</h3>
              <p className="medical-empty-state-text">
                Please select at least 2 molecules from the list above to compare their metrics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {comparisonData && comparisonData.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medical-card"
        >
          <div className="medical-card-header">
            <h3 className="text-lg font-semibold">Detailed Comparison</h3>
          </div>
          <div className="medical-card-body p-0">
            <div className="overflow-x-auto">
              <table className="medical-table">
                <thead>
                  <tr>
                    <th>Molecule</th>
                    <th>Market Size (USD M)</th>
                    <th>CAGR (%)</th>
                    <th>Therapy Area</th>
                    <th>Indication</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold">{item.molecule}</td>
                      <td>${item.market_size_usd_mn?.toFixed(2)}M</td>
                      <td>{item.cagr_percent?.toFixed(2)}%</td>
                      <td>{item.therapy_area}</td>
                      <td>{item.indication || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
