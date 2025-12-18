import { useState, useEffect } from 'react';
import SentimentDashboard from '../components/SentimentDashboard';
import { FaSmile, FaChartLine } from 'react-icons/fa';
import api from '../utils/api';

export default function Sentiment() {
  const [selectedMolecule, setSelectedMolecule] = useState('Metformin');
  const [molecules, setMolecules] = useState(['Metformin', 'Pembrolizumab', 'Sitagliptin', 'Rivaroxaban', 'Atorvastatin']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMolecules();
  }, []);

  const fetchMolecules = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/data');
      const uniqueMolecules = [...new Set(response.data.marketData.map(d => d.molecule))];
      if (uniqueMolecules.length > 0) {
        setMolecules(uniqueMolecules.filter(Boolean));
        // Set first molecule as default if current selection not in list
        if (!uniqueMolecules.includes(selectedMolecule)) {
          setSelectedMolecule(uniqueMolecules[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load molecules:', error);
      // Keep default hardcoded list on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaChartLine className="text-blue-600" />
            Market Sentiment Analysis
          </h1>
          <p className="text-gray-600">
            Monitor social media, news, and market sentiment for pharmaceutical molecules
          </p>
        </div>

        {/* Molecule Selector */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Molecule:
          </label>
          <select
            value={selectedMolecule}
            onChange={(e) => setSelectedMolecule(e.target.value)}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {molecules.map((mol) => (
              <option key={mol} value={mol}>
                {mol}
              </option>
            ))}
          </select>
        </div>

        {/* Sentiment Dashboard */}
        <SentimentDashboard molecule={selectedMolecule} />
      </div>
    </div>
  );
}
