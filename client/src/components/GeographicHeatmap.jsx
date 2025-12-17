import { useState, useEffect } from 'react';
import { FaMap, FaGlobe } from 'react-icons/fa';
import api from '../utils/api';

/**
 * Geographic Market Heatmap
 * Visualizes market opportunities by geography
 */
export default function GeographicHeatmap({ molecule }) {
  const [marketData, setMarketData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    if (molecule) {
      loadGeographicData();
    }
  }, [molecule]);

  const loadGeographicData = async () => {
    try {
      // Mock geographic data - in production, fetch from API
      setMarketData({
        regions: [
          { name: 'North America', marketSize: 5000, growth: 8.5, color: 'high' },
          { name: 'Europe', marketSize: 3500, growth: 6.2, color: 'high' },
          { name: 'Asia Pacific', marketSize: 4500, growth: 12.3, color: 'very-high' },
          { name: 'Latin America', marketSize: 1200, growth: 9.1, color: 'medium' },
          { name: 'Middle East & Africa', marketSize: 800, growth: 7.5, color: 'medium' }
        ]
      });
    } catch (error) {
      console.error('Error loading geographic data:', error);
    }
  };

  const getColorClass = (color) => {
    const colors = {
      'very-high': 'bg-green-600',
      'high': 'bg-green-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-orange-500',
      'very-low': 'bg-red-500'
    };
    return colors[color] || colors.medium;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaGlobe className="text-2xl text-blue-600" />
        <div>
          <h3 className="font-semibold text-lg">Geographic Market Analysis</h3>
          <p className="text-sm text-gray-600">{molecule || 'Global markets'}</p>
        </div>
      </div>

      {/* Map Visualization Placeholder */}
      <div className="border border-gray-200 rounded-lg bg-gray-50 mb-6" style={{ height: '400px' }}>
        <div className="h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <FaMap className="mx-auto text-4xl mb-4 opacity-50" />
            <p className="text-sm">Interactive World Map</p>
            <p className="text-xs mt-2 text-gray-400">
              (Map visualization library integration coming soon)
            </p>
          </div>
        </div>
      </div>

      {/* Regional Data Table */}
      {marketData && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700 mb-3">Regional Market Data</h4>
          {marketData.regions.map((region, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedRegion(region)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRegion?.name === region.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full ${getColorClass(region.color)}`}></div>
                    <span className="font-medium">{region.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 ml-7">
                    <div>
                      <span className="text-gray-500">Market Size: </span>
                      <span className="font-semibold">${(region.marketSize / 1000).toFixed(1)}B</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Growth: </span>
                      <span className="font-semibold text-green-600">+{region.growth}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Region Details */}
      {selectedRegion && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Selected: {selectedRegion.name}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Market Size:</span>
              <div className="font-semibold text-lg">${(selectedRegion.marketSize / 1000).toFixed(1)}B</div>
            </div>
            <div>
              <span className="text-gray-600">Growth Rate:</span>
              <div className="font-semibold text-lg text-green-600">+{selectedRegion.growth}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
