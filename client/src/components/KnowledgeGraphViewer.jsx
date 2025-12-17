import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import api from '../utils/api';
import { FaNetworkWired, FaSearch, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function KnowledgeGraphViewer({ drugId, onNodeClick }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(drugId || '');
  const graphRef = useRef();

  useEffect(() => {
    if (drugId) {
      loadGraphData(drugId);
    }
  }, [drugId]);

  const loadGraphData = async (drug) => {
    if (!drug) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/graph/drug-network/${drug}?depth=2`);
      const data = response.data;
      
      // Transform data for force graph
      const nodes = (data.nodes || []).map(node => ({
        id: node.id || node.name || String(node),
        label: node.id || node.name || String(node),
        type: node.type || 'Unknown',
        ...node
      }));
      
      const links = (data.edges || []).map(edge => ({
        source: edge.source,
        target: edge.target,
        type: edge.type || 'related',
        ...edge
      }));
      
      setGraphData({ nodes, links });
    } catch (error) {
      console.error('Error loading graph data:', error);
      toast.error('Failed to load knowledge graph. Python service may not be running.');
      // Fallback: create sample graph
      setGraphData({
        nodes: [
          { id: drug, label: drug, type: 'Drug', group: 1 },
          { id: 'Disease1', label: 'Type 2 Diabetes', type: 'Disease', group: 2 },
          { id: 'Trial1', label: 'NCT12345', type: 'Trial', group: 3 }
        ],
        links: [
          { source: drug, target: 'Disease1', type: 'treats' },
          { source: drug, target: 'Trial1', type: 'studied_in' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      loadGraphData(searchTerm.trim());
    }
  };

  const getNodeColor = (node) => {
    const colors = {
      'Drug': '#3b82f6',
      'Disease': '#ef4444',
      'Trial': '#10b981',
      'Patent': '#f59e0b',
      'Unknown': '#6b7280'
    };
    return colors[node.type] || colors['Unknown'];
  };

  const getNodeSize = (node) => {
    // Larger nodes for drugs
    if (node.type === 'Drug') return 12;
    if (node.type === 'Disease') return 10;
    return 8;
  };

  if (loading && graphData.nodes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FaSpinner className="mx-auto text-4xl text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading knowledge graph...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaNetworkWired className="text-2xl text-blue-600" />
          <div>
            <h3 className="font-semibold text-lg">Knowledge Graph</h3>
            <p className="text-xs text-gray-600">Explore drug relationships</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter drug name (e.g., Metformin)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
        >
          <FaSearch />
          Search
        </button>
      </div>

      {/* Graph Visualization */}
      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel={(node) => `${node.label} (${node.type})`}
            nodeColor={(node) => getNodeColor(node)}
            nodeVal={(node) => getNodeSize(node)}
            linkLabel={(link) => link.type}
            linkColor={() => 'rgba(0, 0, 0, 0.2)'}
            linkWidth={2}
            onNodeClick={(node) => {
              if (onNodeClick) {
                onNodeClick(node);
              }
              toast.success(`Selected: ${node.label}`);
            }}
            onNodeHover={(node) => {
              if (node) {
                graphRef.current?.pauseAnimation();
              } else {
                graphRef.current?.resumeAnimation();
              }
            }}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.label || node.id;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = getNodeColor(node);
              ctx.fillText(label, node.x, node.y);
            }}
            cooldownTicks={100}
            onEngineStop={() => graphRef.current?.zoomToFit(400)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaNetworkWired className="mx-auto text-4xl mb-4 opacity-50" />
              <p>No graph data available</p>
              <p className="text-sm mt-2">Enter a drug name to explore relationships</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600"></div>
          <span>Drug</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600"></div>
          <span>Disease</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-600"></div>
          <span>Trial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
          <span>Patent</span>
        </div>
      </div>
    </div>
  );
}
