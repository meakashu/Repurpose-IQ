import { useState } from 'react';
import KnowledgeGraphViewer from '../components/KnowledgeGraphViewer';
import { FaNetworkWired, FaSearch, FaLightbulb } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function KnowledgeGraph() {
  const [selectedDrug, setSelectedDrug] = useState('Metformin');
  const [repurposingPaths, setRepurposingPaths] = useState([]);
  const [similarDrugs, setSimilarDrugs] = useState([]);
  const [loading, setLoading] = useState(false);

  const findRepurposingPaths = async (drugId, targetDisease) => {
    if (!drugId || !targetDisease) {
      toast.error('Please provide both drug and target disease');
      return;
    }

    setLoading(true);
    try {
      // Note: This endpoint may need to be proxied through Node.js backend
      // For now, we'll use the Python service endpoint pattern
      const response = await api.post('/graph/repurposing-paths', {
        drug_id: drugId,
        target_disease: targetDisease,
        max_hops: 3
      });
      setRepurposingPaths(response.data.paths || []);
      toast.success(`Found ${response.data.count || response.data.paths?.length || 0} repurposing path(s)`);
    } catch (error) {
      console.error('Error finding paths:', error);
      toast.error('Failed to find repurposing paths. The Python service may not be running.');
    } finally {
      setLoading(false);
    }
  };

  const findSimilarDrugs = async (drugId) => {
    setLoading(true);
    try {
      // Note: This endpoint may need to be proxied through Node.js backend
      const response = await api.get(`/graph/similar-drugs/${drugId}?threshold=0.7`);
      setSimilarDrugs(response.data.similar_drugs || []);
      toast.success(`Found ${response.data.count || response.data.similar_drugs?.length || 0} similar drug(s)`);
    } catch (error) {
      console.error('Error finding similar drugs:', error);
      toast.error('Failed to find similar drugs. The Python service may not be running.');
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
            <FaNetworkWired className="text-blue-600" />
            Knowledge Graph Explorer
          </h1>
          <p className="text-gray-600">
            Discover hidden relationships between drugs, diseases, trials, and patents
          </p>
        </div>

        {/* Main Graph View */}
        <div className="mb-6">
          <KnowledgeGraphViewer 
            drugId={selectedDrug}
            onNodeClick={(node) => {
              if (node.type === 'Drug') {
                setSelectedDrug(node.id);
              }
            }}
          />
        </div>

        {/* Sidebar with Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repurposing Paths */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaLightbulb className="text-yellow-600" />
              <h3 className="font-semibold">Repurposing Paths</h3>
            </div>
            
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Drug (e.g., Metformin)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                id="repurposing-drug"
              />
              <input
                type="text"
                placeholder="Target Disease (e.g., PCOS)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                id="repurposing-disease"
              />
              <button
                onClick={() => {
                  const drug = document.getElementById('repurposing-drug').value;
                  const disease = document.getElementById('repurposing-disease').value;
                  findRepurposingPaths(drug, disease);
                }}
                disabled={loading}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
              >
                Find Paths
              </button>
            </div>

            {repurposingPaths.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {repurposingPaths.map((path, idx) => (
                  <div key={idx} className="p-3 bg-yellow-50 rounded-lg text-sm">
                    <div className="font-medium mb-1">Path {idx + 1} (Length: {path.length})</div>
                    <div className="text-gray-600 text-xs">
                      {Array.isArray(path.path) 
                        ? path.path.map(n => n.id || n).join(' → ')
                        : 'Path details'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Similar Drugs */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaSearch className="text-blue-600" />
              <h3 className="font-semibold">Similar Drugs</h3>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                value={selectedDrug}
                onChange={(e) => setSelectedDrug(e.target.value)}
                placeholder="Drug name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              />
              <button
                onClick={() => findSimilarDrugs(selectedDrug)}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Find Similar
              </button>
            </div>

            {similarDrugs.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {similarDrugs.map((drug, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedDrug(drug)}
                    className="p-3 bg-blue-50 rounded-lg text-sm cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    {drug}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedDrug('Metformin')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm text-left"
              >
                Explore Metformin
              </button>
              <button
                onClick={() => setSelectedDrug('Pembrolizumab')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm text-left"
              >
                Explore Pembrolizumab
              </button>
              <button
                onClick={() => setSelectedDrug('Sitagliptin')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm text-left"
              >
                Explore Sitagliptin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
