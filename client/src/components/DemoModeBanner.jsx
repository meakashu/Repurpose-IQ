import { FaInfoCircle, FaDatabase } from 'react-icons/fa';

export default function DemoModeBanner() {
  return (
    <div className="mb-4 medical-card bg-yellow-100 border-2 border-yellow-600 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <FaInfoCircle className="text-yellow-800 text-xl flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-bold text-yellow-900 font-space-grotesk mb-1">
            Demo Mode - Mock Data Sources
          </div>
          <div className="text-sm text-yellow-800 font-inter">
            This system is currently using <strong>mock/simulated data</strong> for demonstration purposes.
            Data sources include:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white border-2 border-yellow-600 rounded-full text-xs font-semibold text-yellow-900 flex items-center gap-1">
              <FaDatabase className="text-xs" />
              USPTO Patent API Clone
            </span>
            <span className="px-3 py-1 bg-white border-2 border-yellow-600 rounded-full text-xs font-semibold text-yellow-900 flex items-center gap-1">
              <FaDatabase className="text-xs" />
              IQVIA Mock API
            </span>
            <span className="px-3 py-1 bg-white border-2 border-yellow-600 rounded-full text-xs font-semibold text-yellow-900 flex items-center gap-1">
              <FaDatabase className="text-xs" />
              ClinicalTrials.gov Stub
            </span>
            <span className="px-3 py-1 bg-white border-2 border-yellow-600 rounded-full text-xs font-semibold text-yellow-900 flex items-center gap-1">
              <FaDatabase className="text-xs" />
              Web Search (Tavily API)
            </span>
          </div>
          <div className="mt-2 text-xs text-yellow-700 font-inter italic">
            For production use, real API integrations would be required.
          </div>
        </div>
      </div>
    </div>
  );
}

