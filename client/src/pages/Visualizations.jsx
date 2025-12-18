import { useState, useEffect } from 'react';
import MolecularViewer from '../components/MolecularViewer';
import TemporalDashboard from '../components/TemporalDashboard';
import GeographicHeatmap from '../components/GeographicHeatmap';
import { FaFlask, FaChartLine, FaMap } from 'react-icons/fa';
import api from '../utils/api';

export default function Visualizations() {
  const [activeTab, setActiveTab] = useState('molecular');
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
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Visualizations</h1>
          <p className="text-gray-600">
            Interactive visualizations for molecular structures, temporal trends, and geographic markets
          </p>
        </div>

        {/* Molecule Selector */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Molecule:
          </label>
          <div className="relative">
            <select
              value={selectedMolecule}
              onChange={(e) => setSelectedMolecule(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
            >
              {molecules.length === 0 ? (
                <option value="">No molecules available</option>
              ) : (
                molecules.map((mol) => (
                  <option key={mol} value={mol}>
                    {mol}
                  </option>
                ))
              )}
            </select>
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {molecules.length === 0 && !loading && (
            <p className="mt-2 text-sm text-gray-500">
              No molecules found. Please check your data connection.
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('molecular')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTab('molecular');
              }
            }}
            role="tab"
            aria-selected={activeTab === 'molecular'}
            aria-controls="molecular-panel"
            tabIndex={activeTab === 'molecular' ? 0 : -1}
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'molecular'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaFlask />
            Molecular Structure
          </button>
          <button
            onClick={() => setActiveTab('temporal')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTab('temporal');
              }
            }}
            role="tab"
            aria-selected={activeTab === 'temporal'}
            aria-controls="temporal-panel"
            tabIndex={activeTab === 'temporal' ? 0 : -1}
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'temporal'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaChartLine />
            Temporal Analysis
          </button>
          <button
            onClick={() => setActiveTab('geographic')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTab('geographic');
              }
            }}
            role="tab"
            aria-selected={activeTab === 'geographic'}
            aria-controls="geographic-panel"
            tabIndex={activeTab === 'geographic' ? 0 : -1}
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'geographic'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaMap />
            Geographic Markets
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'molecular' && (
            <div id="molecular-panel" role="tabpanel" aria-labelledby="molecular-tab">
              <MolecularViewer 
                molecule={selectedMolecule}
                smiles={null} // Let MolecularViewer use its internal SMILES lookup
              />
            </div>
          )}
          
          {activeTab === 'temporal' && (
            <div id="temporal-panel" role="tabpanel" aria-labelledby="temporal-tab">
              <TemporalDashboard molecule={selectedMolecule} />
            </div>
          )}
          
          {activeTab === 'geographic' && (
            <div id="geographic-panel" role="tabpanel" aria-labelledby="geographic-tab">
              <GeographicHeatmap molecule={selectedMolecule} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
