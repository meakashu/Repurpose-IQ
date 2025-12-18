import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Extract data from markdown tables or structured text
export function PatentExpiryChart({ data }) {
  // Parse patent data from text/markdown
  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Try to extract patent expiry data
    const years = {};
    const lines = data.split('\n');
    
    lines.forEach(line => {
      // Look for patent expiry patterns
      const expiryMatch = line.match(/(\d{4}-\d{2}-\d{2})|(\d{4})/);
      if (expiryMatch) {
        const year = expiryMatch[1] ? expiryMatch[1].split('-')[0] : expiryMatch[2];
        years[year] = (years[year] || 0) + 1;
      }
    });
    
    return Object.entries(years)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year))
      .slice(0, 10);
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div className="medical-card bg-white border-2 border-black rounded-xl p-4 mb-4">
      <h3 className="font-bold text-black mb-4 font-space-grotesk">Patent Expiry Timeline</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000" />
          <XAxis dataKey="year" stroke="#000" />
          <YAxis stroke="#000" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#FFFC00" stroke="#000" strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MarketSizeChart({ data }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const molecules = [];
    const lines = data.split('\n');
    
    lines.forEach(line => {
      // Look for market size patterns: "| Molecule | Market Size |"
      if (line.includes('|') && line.includes('Market Size')) {
        const parts = line.split('|').filter(p => p.trim());
        if (parts.length >= 2) {
          const molecule = parts[0].trim();
          const sizeMatch = parts[1].match(/(\d+)/);
          if (sizeMatch) {
            molecules.push({
              molecule,
              marketSize: parseInt(sizeMatch[1])
            });
          }
        }
      }
    });
    
    return molecules.slice(0, 10);
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div className="medical-card bg-white border-2 border-black rounded-xl p-4 mb-4">
      <h3 className="font-bold text-black mb-4 font-space-grotesk">Market Size by Molecule</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#000" />
          <XAxis type="number" stroke="#000" />
          <YAxis dataKey="molecule" type="category" stroke="#000" width={120} />
          <Tooltip />
          <Legend />
          <Bar dataKey="marketSize" fill="#FFFC00" stroke="#000" strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrialPhaseChart({ data }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    
    const phases = {};
    const lines = data.split('\n');
    
    lines.forEach(line => {
      // Look for phase patterns
      const phaseMatch = line.match(/Phase\s*(\d+|4)/i);
      if (phaseMatch) {
        const phase = `Phase ${phaseMatch[1]}`;
        phases[phase] = (phases[phase] || 0) + 1;
      }
    });
    
    return Object.entries(phases).map(([phase, count]) => ({ phase, count }));
  }, [data]);

  if (chartData.length === 0) return null;

  const COLORS = ['#FFFC00', '#000000', '#FFD700', '#FFA500', '#FF6347'];

  return (
    <div className="medical-card bg-white border-2 border-black rounded-xl p-4 mb-4">
      <h3 className="font-bold text-black mb-4 font-space-grotesk">Clinical Trials by Phase</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ phase, percent }) => `${phase}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            stroke="#000"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

import MultiCriteriaRadarChart from './RadarChart';
import DecisionHeatmap from './DecisionHeatmap';

// Auto-detect and render appropriate charts
export function AutoChartRenderer({ content, agentType, chartData }) {
  if (!content) return null;

  // Check for structured chart data first (from backend)
  if (chartData) {
    if (chartData.radarChart) {
      return <MultiCriteriaRadarChart data={chartData.radarChart} />;
    }
    if (chartData.heatmap) {
      return <DecisionHeatmap data={chartData.heatmap} />;
    }
  }

  // Try to extract JSON chart data from content
  const jsonMatches = content.match(/```json\s*({[\s\S]*?})\s*```/g);
  if (jsonMatches) {
    for (const match of jsonMatches) {
      try {
        const jsonStr = match.replace(/```json\s*|\s*```/g, '');
        const parsed = JSON.parse(jsonStr);
        
        if (parsed.radarChart) {
          return <MultiCriteriaRadarChart data={parsed.radarChart} />;
        }
        if (parsed.heatmap) {
          return <DecisionHeatmap data={parsed.heatmap} />;
        }
      } catch (e) {
        // Continue to next match
      }
    }
  }

  // Fallback to agent-specific charts
  if (agentType === 'patent' || content.includes('Patent') || content.includes('expiry')) {
    return <PatentExpiryChart data={content} />;
  }
  
  if (agentType === 'market' || content.includes('Market Size') || content.includes('CAGR')) {
    return <MarketSizeChart data={content} />;
  }
  
  if (agentType === 'clinical' || content.includes('Phase') || content.includes('Trial')) {
    return <TrialPhaseChart data={content} />;
  }

  return null;
}

