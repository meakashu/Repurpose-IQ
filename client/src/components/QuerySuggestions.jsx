import { useState, useEffect } from 'react';
import { FaLightbulb, FaChartLine } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function QuerySuggestions({ currentQuery = '', onSelectSuggestion }) {
  const [suggestions, setSuggestions] = useState([]);
  const [popularQueries, setPopularQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentQuery.trim().length > 2) {
      loadSuggestions();
    } else {
      loadPopularQueries();
    }
  }, [currentQuery]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/suggestions?query=${encodeURIComponent(currentQuery)}&limit=5`);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularQueries = async () => {
    try {
      const response = await api.get('/suggestions/popular?limit=5');
      setPopularQueries(response.data.queries || []);
    } catch (error) {
      console.error('Error loading popular queries:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const query = typeof suggestion === 'string' ? suggestion : suggestion.query;
    if (onSelectSuggestion) {
      onSelectSuggestion(query);
    }
    toast.success('Query selected');
  };

  const displaySuggestions = currentQuery.trim().length > 2 ? suggestions : popularQueries;

  if (displaySuggestions.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        {currentQuery.trim().length > 2 ? (
          <FaLightbulb className="text-yellow-600" />
        ) : (
          <FaChartLine className="text-blue-600" />
        )}
        <h4 className="font-medium text-sm">
          {currentQuery.trim().length > 2 ? 'Suggestions' : 'Popular Queries'}
        </h4>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500 text-sm">
          Loading suggestions...
        </div>
      ) : (
        <div className="space-y-2">
          {displaySuggestions.map((suggestion, idx) => {
            const query = typeof suggestion === 'string' ? suggestion : suggestion.query;
            return (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-colors flex items-center justify-between"
              >
                <span>{query}</span>
                {suggestion.usageCount && (
                  <span className="text-xs text-gray-500">
                    {suggestion.usageCount} uses
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
