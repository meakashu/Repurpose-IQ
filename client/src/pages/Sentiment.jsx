import { useState } from 'react';
import SentimentDashboard from '../components/SentimentDashboard';
import { FaSmile, FaChartLine } from 'react-icons/fa';

export default function Sentiment() {
  const [selectedMolecule, setSelectedMolecule] = useState('Metformin');

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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Metformin">Metformin</option>
            <option value="Pembrolizumab">Pembrolizumab</option>
            <option value="Sitagliptin">Sitagliptin</option>
            <option value="Rivaroxaban">Rivaroxaban</option>
            <option value="Atorvastatin">Atorvastatin</option>
          </select>
        </div>

        {/* Sentiment Dashboard */}
        <SentimentDashboard molecule={selectedMolecule} />
      </div>
    </div>
  );
}
