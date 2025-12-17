import { useEffect, useRef, useState } from 'react';
import { FaFlask, FaDownload } from 'react-icons/fa';

/**
 * 3D Molecular Structure Viewer
 * Uses 3Dmol.js for molecular visualization
 */
export default function MolecularViewer({ molecule, smiles }) {
  const containerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load 3Dmol.js dynamically
    const load3DMol = async () => {
      try {
        // For now, using a placeholder - in production, load 3Dmol.js library
        // const script = document.createElement('script');
        // script.src = 'https://3dmol.csb.pitt.edu/build/3Dmol-min.js';
        // script.onload = () => initializeViewer();
        // document.head.appendChild(script);
        
        // Placeholder implementation
        initializeViewer();
      } catch (error) {
        console.error('Error loading 3Dmol:', error);
        setLoading(false);
      }
    };

    load3DMol();
  }, [molecule, smiles]);

  const initializeViewer = () => {
    // Placeholder for 3Dmol viewer
    // In production, this would initialize the actual 3Dmol viewer
    setLoading(false);
  };

  const downloadStructure = () => {
    // Download molecular structure
    toast.success('Molecular structure download feature coming soon');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FaFlask className="mx-auto text-4xl text-blue-600 mb-4 animate-pulse" />
        <p className="text-gray-600">Loading molecular structure...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Molecular Structure</h3>
          <p className="text-sm text-gray-600">{molecule || 'Unknown molecule'}</p>
        </div>
        <button
          onClick={downloadStructure}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
        >
          <FaDownload />
          Download
        </button>
      </div>

      {/* 3D Viewer Container */}
      <div
        ref={containerRef}
        className="border border-gray-200 rounded-lg bg-gray-50"
        style={{ height: '500px', width: '100%' }}
      >
        <div className="h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <FaFlask className="mx-auto text-4xl mb-4 opacity-50" />
            <p className="text-sm">3D Molecular Viewer</p>
            <p className="text-xs mt-2">
              {smiles 
                ? `SMILES: ${smiles.substring(0, 50)}...`
                : 'Enter SMILES notation to view structure'}
            </p>
            <p className="text-xs mt-2 text-gray-400">
              (3Dmol.js integration coming soon)
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
          Rotate
        </button>
        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
          Zoom
        </button>
        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
          Reset
        </button>
      </div>
    </div>
  );
}
