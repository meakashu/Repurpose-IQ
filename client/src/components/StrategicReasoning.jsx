import { FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';

export default function StrategicReasoning({ reasoning, confidenceScore, decisionFactors }) {
  if (!reasoning && !decisionFactors) return null;

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (score) => {
    if (score >= 0.8) return 'High Confidence';
    if (score >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="medical-card bg-gradient-to-br from-yellow-50 to-white border-2 border-black rounded-xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <FaLightbulb className="text-yellow-600 text-xl" />
        <h3 className="font-bold text-black font-space-grotesk text-lg">Strategic Reasoning</h3>
      </div>

      {reasoning && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-black mb-2 font-inter">Why This Molecule is Promising:</div>
          <div className="text-black leading-relaxed font-inter whitespace-pre-wrap">{reasoning}</div>
        </div>
      )}

      {confidenceScore !== undefined && (
        <div className="mb-4 p-3 bg-white border-2 border-black rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaChartLine className="text-black" />
              <span className="font-semibold text-black font-inter">Confidence Score:</span>
            </div>
            <div className={`font-bold text-lg ${getConfidenceColor(confidenceScore)}`}>
              {(confidenceScore * 100).toFixed(0)}% - {getConfidenceLabel(confidenceScore)}
            </div>
          </div>
        </div>
      )}

      {decisionFactors && decisionFactors.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-black mb-3 font-inter">Decision Factors:</div>
          <div className="space-y-2">
            {decisionFactors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-white border border-black rounded">
                <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-black text-sm font-inter">{factor.factor}</div>
                  {factor.impact && (
                    <div className="text-xs text-black opacity-70 font-inter mt-1">
                      Impact: {factor.impact}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!reasoning && !decisionFactors && (
        <div className="text-sm text-black opacity-70 font-inter italic">
          Strategic reasoning will be displayed here when available.
        </div>
      )}
    </div>
  );
}

