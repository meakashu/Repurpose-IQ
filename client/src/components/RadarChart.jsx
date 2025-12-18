import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export default function MultiCriteriaRadarChart({ data }) {
  if (!data || !data.criteria || !data.molecules || data.molecules.length === 0) {
    return null;
  }

  // Transform data for Recharts RadarChart
  // Recharts needs: [{ criterion1: value, criterion2: value, ... }, ...] for each molecule
  const chartData = data.criteria.map(criterion => {
    const entry = { criterion };
    data.molecules.forEach((mol, molIdx) => {
      const molLabel = mol.label || mol.id || `Molecule_${molIdx + 1}`;
      // Map criteria to molecule properties
      let value = 0;
      if (criterion.toLowerCase().includes('safety')) {
        value = mol.safety_margin || mol.safetyMargin || 0;
      } else if (criterion.toLowerCase().includes('bbb') || criterion.toLowerCase().includes('penetration')) {
        value = mol.bbb_penetration || mol.bbbPenetration || 0;
      } else if (criterion.toLowerCase().includes('patent')) {
        // Normalize patent life to 0-1 scale (assuming max 20 years)
        const years = mol.patent_life_years || mol.patentLifeYears || 0;
        value = years / 20;
      } else if (criterion.toLowerCase().includes('competition') || criterion.toLowerCase().includes('market')) {
        // For competition, invert (lower is better)
        const comp = mol.market_competition || mol.marketCompetition || 0;
        value = 1 - comp; // Invert so green = less competition
      } else {
        // Generic mapping
        const key = criterion.toLowerCase().replace(/\s+/g, '_');
        value = mol[key] || 0;
      }
      entry[molLabel] = Math.max(0, Math.min(1, value)); // Clamp to 0-1
    });
    return entry;
  });

  const colors = ['#FFFC00', '#0066CC', '#00A8E8', '#00D4AA', '#28A745', '#FFC107', '#FF6347', '#9B59B6', '#E74C3C', '#3498DB'];

  return (
    <div className="medical-card bg-white border-2 border-black rounded-xl p-6 mb-6">
      <h3 className="font-bold text-black mb-4 font-space-grotesk text-lg">Multi-Criteria Radar Chart</h3>
      <p className="text-sm text-gray-600 mb-4">
        Comparative analysis across key evaluation criteria. Higher values indicate better performance (competition is inverted).
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#000" strokeWidth={1} />
          <PolarAngleAxis 
            dataKey="criterion" 
            tick={{ fill: '#000', fontSize: 11, fontWeight: 'bold' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 1]} 
            tick={{ fill: '#000', fontSize: 10 }}
          />
          {data.molecules.map((mol, idx) => {
            const molLabel = mol.label || mol.id || `Molecule_${idx + 1}`;
            return (
              <Radar
                key={mol.id || idx}
                name={molLabel}
                dataKey={molLabel}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            );
          })}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-xs text-gray-600 space-y-1">
        <p><strong>Criteria:</strong> {data.criteria.join(', ')}</p>
        <p><strong>Scale:</strong> 0-1 (normalized) | Patent life normalized to 0-1 (max 20 years)</p>
        <p><strong>Note:</strong> Competition is inverted (green = less competition = better)</p>
      </div>
    </div>
  );
}
