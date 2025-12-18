import { useMemo } from 'react';

export default function DecisionHeatmap({ data }) {
  const heatmapData = useMemo(() => {
    if (!data || !data.molecules || !data.criteria || !data.scores) {
      return null;
    }

    return {
      molecules: data.molecules,
      criteria: data.criteria,
      scores: data.scores
    };
  }, [data]);

  if (!heatmapData) return null;

  // Color scale function (green = high, red = low, but inverted for competition)
  const getColor = (value, criterion) => {
    const isCompetition = criterion.toLowerCase().includes('competition');
    // For competition, lower is better (green), higher is worse (red)
    // For others, higher is better (green), lower is worse (red)
    const normalizedValue = isCompetition ? 1 - value : value;
    
    if (normalizedValue >= 0.7) return 'bg-green-500';
    if (normalizedValue >= 0.5) return 'bg-yellow-400';
    if (normalizedValue >= 0.3) return 'bg-orange-400';
    return 'bg-red-500';
  };

  // Get text color based on background
  const getTextColor = (value, criterion) => {
    const isCompetition = criterion.toLowerCase().includes('competition');
    const normalizedValue = isCompetition ? 1 - value : value;
    return normalizedValue >= 0.5 ? 'text-white' : 'text-black';
  };

  return (
    <div className="medical-card bg-white border-2 border-black rounded-xl p-6 mb-6">
      <h3 className="font-bold text-black mb-4 font-space-grotesk text-lg">Decision Heatmap: Molecules vs Criteria</h3>
      <p className="text-sm text-gray-600 mb-4">
        Color intensity indicates performance: <span className="text-green-600 font-bold">Green</span> = High, 
        <span className="text-yellow-600 font-bold"> Yellow</span> = Medium, 
        <span className="text-red-600 font-bold"> Red</span> = Low
      </p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-black">
          <thead>
            <tr className="bg-black text-yellow-400">
              <th className="border-2 border-black p-3 text-left font-bold sticky left-0 bg-black z-10">
                Molecule
              </th>
              {heatmapData.criteria.map((criterion, idx) => (
                <th key={idx} className="border-2 border-black p-3 text-center font-bold min-w-[150px]">
                  {criterion}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.molecules.map((molecule, molIdx) => (
              <tr key={molIdx} className="hover:bg-gray-50">
                <td className="border-2 border-black p-3 font-bold bg-gray-100 sticky left-0 z-10">
                  {molecule.label || molecule.id || `Molecule ${molIdx + 1}`}
                </td>
                {heatmapData.scores[molIdx]?.map((score, critIdx) => {
                  const criterion = heatmapData.criteria[critIdx];
                  // Handle patent life (can be in years or normalized 0-1)
                  let displayValue;
                  if (criterion.toLowerCase().includes('patent')) {
                    // If score is > 1, it's already in years; otherwise normalize
                    displayValue = score > 1 ? `${score.toFixed(1)} years` : `${(score * 20).toFixed(1)} years`;
                  } else {
                    displayValue = score.toFixed(2);
                  }
                  
                  return (
                    <td
                      key={critIdx}
                      className={`border-2 border-black p-4 text-center font-semibold ${getColor(score, criterion)} ${getTextColor(score, criterion)}`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-600 space-y-1">
        <p><strong>Note:</strong> Patent life shown in years (normalized from 0-1 scale)</p>
        <p><strong>Competition:</strong> Lower values (green) indicate less competition (better)</p>
        <p><strong>Other criteria:</strong> Higher values (green) indicate better performance</p>
      </div>
    </div>
  );
}
