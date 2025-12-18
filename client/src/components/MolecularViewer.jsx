import { useEffect, useRef, useState } from 'react';
import { FaFlask, FaDownload, FaUndo, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Common SMILES notation for popular molecules
 * In production, this should be fetched from an API or database
 */
const MOLECULE_SMILES = {
  'Metformin': 'CN(C)C(=N)N=C(N)N',
  'Pembrolizumab': 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)NC(Cc2ccc(C(C)(C)C(=O)O)cc2)C(=O)O',
  'Sitagliptin': 'CC1=C(C(=CC=C1CC(=O)N2CCCC2C3=NC(=CS3)C4=CC=CC=C4)F)F',
  'Rivaroxaban': 'CC(=O)N1CCN(CC1)C(=O)C2=C(C3=C(C=C2OC4=CC=CC=C4)OCO3)N5C=NC=N5',
  'Atorvastatin': 'CC(C)C(=O)OC(Cc1ccc(C(C)(C)C(=O)O)cc1)c2ccc(C(C)(C)C(=O)O)cc2',
  'Aspirin': 'CC(=O)OC1=CC=CC=C1C(=O)O',
  'Ibuprofen': 'CC(C)Cc1ccc(C(C)C(=O)O)cc1',
  'Caffeine': 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C'
};

/**
 * 3D Molecular Structure Viewer
 * Uses 3Dmol.js for molecular visualization
 */
export default function MolecularViewer({ molecule, smiles }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeViewer = () => {
    try {
      if (!window.$3Dmol) {
        console.error('window.$3Dmol is not available');
        setError('3Dmol.js library not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      if (!containerRef.current) {
        console.error('Container ref is not available');
        setLoading(false);
        return;
      }

      // Get SMILES notation
      const moleculeSmiles = smiles || MOLECULE_SMILES[molecule] || null;

      if (!moleculeSmiles) {
        console.warn(`SMILES not found for molecule: ${molecule}`);
        setError(`SMILES notation not available for ${molecule}. Please provide SMILES data.`);
        setLoading(false);
        return;
      }

      console.log(`Initializing viewer for ${molecule} with SMILES: ${moleculeSmiles.substring(0, 50)}...`);

      // Clear previous viewer if exists
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
        } catch (e) {
          console.warn('Error clearing previous viewer:', e);
        }
      }

      // Create new viewer
      const viewer = window.$3Dmol.createViewer(containerRef.current, {
        defaultcolors: window.$3Dmol.rasmolElementColors,
        backgroundColor: 0xffffff
      });

      if (!viewer) {
        throw new Error('Failed to create 3Dmol viewer');
      }

      // Add model from SMILES
      viewer.addModel(moleculeSmiles, 'smi');
      
      // Set style - use ball and stick representation
      viewer.setStyle({}, {
        stick: { radius: 0.15, colorscheme: 'default' },
        sphere: { radius: 0.5, colorscheme: 'default' }
      });

      // Center and zoom to molecule
      viewer.zoomTo();
      viewer.render();

      viewerRef.current = viewer;
      setViewer(viewer);
      setLoading(false);
      setError(null);
      
      console.log('Viewer initialized successfully');
    } catch (err) {
      console.error('Error initializing 3Dmol viewer:', err);
      setError(`Failed to initialize molecular viewer: ${err.message}. Please try again or refresh the page.`);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    let retryCount = 0;
    const MAX_RETRIES = 50; // 5 seconds max (50 * 100ms)
    let retryTimer = null;
    let cleanupTimer = null;

    // Wait for 3Dmol.js to be available
    const checkAndInitialize = () => {
      retryCount++;
      
      // Check if 3Dmol.js is loaded
      if (window.$3Dmol) {
        console.log('3Dmol.js loaded successfully');
        
        // Check if container is ready
        if (containerRef.current) {
          console.log('Container ready, initializing viewer...');
          initializeViewer();
          return; // Success, stop retrying
        } else {
          console.warn('Container not ready yet, retrying...');
        }
      } else {
        console.log(`Waiting for 3Dmol.js... (attempt ${retryCount}/${MAX_RETRIES})`);
      }

      // If we've exceeded max retries, show error
      if (retryCount >= MAX_RETRIES) {
        console.error('3Dmol.js failed to load after maximum retries');
        setError('3Dmol.js library failed to load. Please check your internet connection and refresh the page.');
        setLoading(false);
        return;
      }

      // Retry after a short delay
      retryTimer = setTimeout(checkAndInitialize, 100);
    };

    // Start checking after component mounts
    cleanupTimer = setTimeout(checkAndInitialize, 100);

    return () => {
      // Clear all timers on unmount
      if (retryTimer) clearTimeout(retryTimer);
      if (cleanupTimer) clearTimeout(cleanupTimer);
      
      // Cleanup viewer on unmount
      if (viewerRef.current) {
        try {
          viewerRef.current.clear();
        } catch (e) {
          console.warn('Error clearing viewer:', e);
        }
        viewerRef.current = null;
      }
    };
  }, [molecule, smiles]);

  const handleRotate = () => {
    if (viewerRef.current) {
      // Rotate the molecule by 90 degrees around Y axis
      viewerRef.current.rotate(90, 'y');
      viewerRef.current.render();
    }
  };

  const handleZoomIn = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(1.2);
      viewerRef.current.render();
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      viewerRef.current.zoom(0.8);
      viewerRef.current.render();
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.zoomTo();
      viewerRef.current.render();
    }
  };

  const downloadStructure = () => {
    if (!viewerRef.current) {
      toast.error('No molecular structure to download');
      return;
    }

    try {
      // Get the SMILES notation
      const moleculeSmiles = smiles || MOLECULE_SMILES[molecule] || 'N/A';
      
      // Create a text file with molecule information
      const content = `Molecular Structure Data\n` +
        `Molecule: ${molecule}\n` +
        `SMILES: ${moleculeSmiles}\n` +
        `Generated: ${new Date().toISOString()}\n\n` +
        `You can use this SMILES notation to view the molecule in other tools.`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${molecule || 'molecule'}_structure.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Molecular structure data downloaded successfully');
    } catch (error) {
      console.error('Error downloading structure:', error);
      toast.error('Failed to download structure');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FaFlask className="mx-auto text-4xl text-blue-600 mb-4 animate-pulse" />
        <p className="text-gray-600">Loading molecular structure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-red-600">Error Loading Structure</h3>
            <p className="text-sm text-gray-600">{molecule || 'Unknown molecule'}</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
          <p className="text-xs text-gray-600 mt-2">
            SMILES: {smiles || MOLECULE_SMILES[molecule] || 'Not available'}
          </p>
        </div>
      </div>
    );
  }

  const moleculeSmiles = smiles || MOLECULE_SMILES[molecule] || 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Molecular Structure</h3>
          <p className="text-sm text-gray-600">{molecule || 'Unknown molecule'}</p>
          {moleculeSmiles && moleculeSmiles !== 'N/A' && (
            <p className="text-xs text-gray-500 mt-1">
              SMILES: {moleculeSmiles.length > 60 ? `${moleculeSmiles.substring(0, 60)}...` : moleculeSmiles}
            </p>
          )}
        </div>
        <button
          onClick={downloadStructure}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2 transition-colors"
        >
          <FaDownload />
          Download
        </button>
      </div>

      {/* 3D Viewer Container */}
      <div
        ref={containerRef}
        className="border border-gray-200 rounded-lg bg-white"
        style={{ height: '500px', width: '100%', position: 'relative' }}
      >
        {/* Loading overlay will be replaced by 3Dmol viewer */}
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={handleRotate}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2 transition-colors"
          title="Rotate molecule"
        >
          <FaUndo />
          Rotate
        </button>
        <button
          onClick={handleZoomIn}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2 transition-colors"
          title="Zoom in"
        >
          <FaSearchPlus />
          Zoom In
        </button>
        <button
          onClick={handleZoomOut}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2 transition-colors"
          title="Zoom out"
        >
          <FaSearchMinus />
          Zoom Out
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2 transition-colors"
          title="Reset view"
        >
          <FaUndo />
          Reset View
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Click and drag to rotate, scroll to zoom, right-click and drag to pan.
        </p>
      </div>
    </div>
  );
}
