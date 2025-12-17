import { useState } from 'react';
import MolecularViewer from '../components/MolecularViewer';
import TemporalDashboard from '../components/TemporalDashboard';
import GeographicHeatmap from '../components/GeographicHeatmap';
import { FaFlask, FaChartLine, FaMap } from 'react-icons/fa';

export default function Visualizations() {
  const [activeTab, setActiveTab] = useState('molecular');
  const [selectedMolecule, setSelectedMolecule] = useState('Metformin');

  return (
    <div className="min-h-screen p-6">
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
          <select
            value={selectedMolecule}
            onChange={(e) => setSelectedMolecule(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Metformin">Metformin</option>
            <option value="Pembrolizumab">Pembrolizumab</option>
            <option value="Sitagliptin">Sitagliptin</option>
            <option value="Rivaroxaban">Rivaroxaban</option>
            <option value="Atorvastatin">Atorvastatin</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('molecular')}
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
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
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
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
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
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
            <MolecularViewer 
              molecule={selectedMolecule}
              smiles="CN1C=NC2=C1C(=O)N(C(=O)N2C)C" // Example SMILES for caffeine
            />
          )}
          
          {activeTab === 'temporal' && (
            <TemporalDashboard molecule={selectedMolecule} />
          )}
          
          {activeTab === 'geographic' && (
            <GeographicHeatmap molecule={selectedMolecule} />
          )}
        </div>
      </div>
    </div>
  );
}
