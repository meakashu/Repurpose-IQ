import { useEffect, useState } from 'react';
import { FaServer, FaKey, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../utils/api';

export default function BackendStatusCard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/health');
        if (isMounted) {
          setStatus(res.data);
        }
      } catch (err) {
        console.error('Failed to load backend health:', err);
        if (isMounted) {
          setError(err.response?.data?.error || err.message || 'Failed to load backend status');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60000); // refresh every 60s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="medical-card">
      <div className="medical-card-header flex items-center gap-3">
        <FaServer className="text-xl" />
        <h2 className="text-xl font-bold font-space-grotesk">Backend System Status</h2>
      </div>
      <div className="medical-card-body space-y-3 text-sm">
        {loading && <div className="text-gray-600">Checking backend health…</div>}
        {error && (
          <div className="flex items-start gap-2 text-red-600">
            <FaExclamationTriangle className="mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {status && !loading && !error && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Status</span>
              <span className="font-medium">
                {status.status === 'ok' ? (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <FaCheckCircle /> Healthy
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600">
                    <FaExclamationTriangle /> {status.status || 'Degraded'}
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Environment</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {status.environment || 'unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Groq AI</span>
              <span className="font-medium">
                {status.groqConfigured ? (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <FaKey /> Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-orange-500">
                    <FaKey /> Demo / Not configured
                  </span>
                )}
              </span>
            </div>
            {status.clientUrl && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Frontend URL</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded max-w-[60%] text-right">
                  {status.clientUrl}
                </span>
              </div>
            )}
            <div className="border-t border-dashed border-gray-200 pt-3 mt-2">
              <div className="text-xs text-gray-600 mb-1 font-semibold">Enabled Features</div>
              <div className="flex flex-wrap gap-2">
                {status.features &&
                  Object.entries(status.features).map(([key, value]) => (
                    <span
                      key={key}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${
                        value ? 'border-black bg-black text-yellow-400' : 'border-gray-300 text-gray-400'
                      }`}
                    >
                      {key}
                    </span>
                  ))}
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                Last checked:{' '}
                {status.timestamp ? new Date(status.timestamp).toLocaleString() : 'N/A'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


