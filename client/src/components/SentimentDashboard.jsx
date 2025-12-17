import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaSmile, FaFrown, FaMeh, FaChartLine } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SentimentDashboard({ molecule }) {
  const [sentiment, setSentiment] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (molecule) {
      loadSentiment();
      loadHistory();
    }
  }, [molecule]);

  const loadSentiment = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/sentiment/analyze', {
        molecule,
        sources: ['news', 'social']
      });
      setSentiment(response.data.result);
    } catch (error) {
      console.error('Error loading sentiment:', error);
      toast.error('Failed to load sentiment analysis');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await api.get(`/api/sentiment/history/${molecule}?days=30`);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <FaSmile className="text-green-600 text-3xl" />;
      case 'negative':
        return <FaFrown className="text-red-600 text-3xl" />;
      default:
        return <FaMeh className="text-yellow-600 text-3xl" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'negative':
        return 'bg-red-100 border-red-500 text-red-700';
      default:
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    }
  };

  if (loading && !sentiment) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Analyzing sentiment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Market Sentiment Analysis</h3>
          <p className="text-sm text-gray-600">{molecule || 'Select a molecule'}</p>
        </div>
        {molecule && (
          <button
            onClick={loadSentiment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Refresh
          </button>
        )}
      </div>

      {/* Overall Sentiment */}
      {sentiment && (
        <div className={`bg-white rounded-lg shadow p-6 border-2 ${getSentimentColor(sentiment.overallSentiment)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getSentimentIcon(sentiment.overallSentiment)}
              <div>
                <div className="text-sm font-medium mb-1">Overall Sentiment</div>
                <div className="text-2xl font-bold capitalize">
                  {sentiment.overallSentiment || 'Neutral'}
                </div>
                <div className="text-sm mt-1">
                  Score: {(sentiment.sentimentScore * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Sources Analyzed</div>
              <div className="text-lg font-semibold">
                {Object.keys(sentiment.sources || {}).length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Breakdown */}
      {sentiment?.sources && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(sentiment.sources).map(([source, data]) => (
            <div key={source} className="bg-white rounded-lg shadow p-4">
              <div className="font-medium mb-2 capitalize">{source}</div>
              <div className="text-sm text-gray-600 mb-3">
                Sentiment: <span className="font-medium capitalize">{data.sentiment || 'Neutral'}</span>
              </div>
              {data.keyPoints && data.keyPoints.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 mb-1">Key Points:</div>
                  {data.keyPoints.slice(0, 3).map((point, idx) => (
                    <div key={idx} className="text-xs text-gray-700">• {point}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sentiment History Chart */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <FaChartLine />
            Sentiment Trend (30 days)
          </h4>
          <Line
            data={{
              labels: history.map(h => new Date(h.created_at).toLocaleDateString()),
              datasets: [{
                label: 'Sentiment Score',
                data: history.map(h => (h.sentiment_score || 0) * 100),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  min: -100,
                  max: 100,
                  title: { display: true, text: 'Sentiment Score (%)' }
                }
              }
            }}
          />
        </div>
      )}

      {/* Key Topics */}
      {sentiment?.keyTopics && sentiment.keyTopics.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium mb-4">Key Topics</h4>
          <div className="flex flex-wrap gap-2">
            {sentiment.keyTopics.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {!sentiment && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaMeh className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">No sentiment data available</p>
          <p className="text-sm text-gray-500 mt-2">
            {molecule ? 'Click Refresh to analyze' : 'Select a molecule to analyze sentiment'}
          </p>
        </div>
      )}
    </div>
  );
}
