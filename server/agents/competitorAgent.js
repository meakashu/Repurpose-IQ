import db from '../database/db.js';
import iqviaMockAPI from '../services/iqviaMockAPI.js';

export class CompetitorAgent {
  async process(query) {
    const queryLower = query.toLowerCase();
    const molecule = this.extractMolecule(query);
    const therapyArea = this.extractTherapyArea(query);
    
    if (molecule && therapyArea) {
      return this.analyzeCompetitiveThreat(molecule, therapyArea);
    }
    
    if (therapyArea) {
      return this.getCompetitiveLandscape(therapyArea);
    }
    
    if (molecule) {
      return this.analyzeMoleculeCompetition(molecule);
    }
    
    if (/launch|scenario|war.*game/i.test(queryLower)) {
      return this.simulateLaunchScenario(query);
    }
    
    return this.generalCompetitiveInfo();
  }
  
  extractMolecule(query) {
    const molecules = [
      'metformin', 'sitagliptin', 'pembrolizumab', 'rivaroxaban',
      'atorvastatin', 'lisinopril', 'amlodipine', 'omeprazole',
      'semaglutide', 'adalimumab'
    ];
    for (const mol of molecules) {
      if (query.toLowerCase().includes(mol.toLowerCase())) {
        return mol;
      }
    }
    return null;
  }
  
  extractTherapyArea(query) {
    const areas = ['respiratory', 'diabetes', 'oncology', 'cardiovascular', 'gastroenterology'];
    for (const area of areas) {
      if (query.toLowerCase().includes(area)) {
        return area;
      }
    }
    return null;
  }
  
  analyzeCompetitiveThreat(molecule, therapyArea) {
    const competitiveData = iqviaMockAPI.getCompetitiveAnalysis(therapyArea);
    const moleculeData = competitiveData.competitors.find(c => 
      c.molecule.toLowerCase() === molecule.toLowerCase()
    );
    
    if (!moleculeData) {
      return `## Competitive Analysis: ${molecule} in ${therapyArea}\n\n` +
             `No competitive data found for ${molecule} in ${therapyArea} market.`;
    }
    
    const marketShare = moleculeData.market_share_percent;
    const competitionLevel = moleculeData.competition_level || 0;
    const genericPenetration = moleculeData.generic_penetration || 0;
    
    // Calculate threat level
    let threatLevel = 'Low';
    let threatScore = 0;
    
    if (genericPenetration > 0.5) {
      threatLevel = 'High';
      threatScore = 0.8;
    } else if (genericPenetration > 0.3) {
      threatLevel = 'Moderate';
      threatScore = 0.5;
    } else if (competitionLevel > 0.6) {
      threatLevel = 'Moderate';
      threatScore = 0.4;
    }
    
    let result = `## Competitive Threat Analysis: ${molecule}\n\n`;
    result += `**Therapy Area:** ${therapyArea}\n`;
    result += `**Market Share:** ${marketShare.toFixed(1)}%\n`;
    result += `**Competition Level:** ${(competitionLevel * 100).toFixed(1)}%\n`;
    result += `**Generic Penetration:** ${(genericPenetration * 100).toFixed(1)}%\n`;
    result += `**Threat Level:** ${threatLevel}\n\n`;
    
    result += `**Competitive Landscape:**\n\n`;
    result += "| Molecule | Market Share (%) | Competition Level | Generic Penetration |\n";
    result += "|----------|------------------|-------------------|---------------------|\n";
    
    competitiveData.competitors.slice(0, 5).forEach(c => {
      result += `| ${c.molecule} | ${c.market_share_percent.toFixed(1)} | ${((c.competition_level || 0) * 100).toFixed(1)}% | ${((c.generic_penetration || 0) * 100).toFixed(1)}% |\n`;
    });
    
    result += `\n**Strategic Recommendations:**\n`;
    if (threatLevel === 'High') {
      result += `- Accelerate differentiation strategy\n`;
      result += `- Consider lifecycle management initiatives\n`;
      result += `- Monitor generic entry timelines closely\n`;
    } else if (threatLevel === 'Moderate') {
      result += `- Strengthen market position\n`;
      result += `- Develop competitive response plan\n`;
      result += `- Invest in brand loyalty programs\n`;
    } else {
      result += `- Maintain competitive advantage\n`;
      result += `- Continue market expansion\n`;
      result += `- Monitor emerging competitors\n`;
    }
    
    return result;
  }
  
  getCompetitiveLandscape(therapyArea) {
    const competitiveData = iqviaMockAPI.getCompetitiveAnalysis(therapyArea);
    
    let result = `## Competitive Landscape: ${therapyArea}\n\n`;
    result += `**Market Overview:**\n`;
    result += `- Total Market Size: $${competitiveData.total_market_size.toFixed(0)}M\n`;
    result += `- Market Concentration: ${competitiveData.market_concentration.concentration}\n`;
    result += `- HHI Index: ${competitiveData.market_concentration.hhi.toFixed(0)}\n\n`;
    
    result += `**Top Competitors:**\n\n`;
    result += "| Rank | Molecule | Market Share (%) | Competition Level |\n";
    result += "|------|----------|------------------|-------------------|\n";
    
    competitiveData.competitors
      .sort((a, b) => b.market_share_percent - a.market_share_percent)
      .slice(0, 10)
      .forEach((c, idx) => {
        result += `| ${idx + 1} | ${c.molecule} | ${c.market_share_percent.toFixed(1)} | ${((c.competition_level || 0) * 100).toFixed(1)}% |\n`;
      });
    
    return result;
  }
  
  analyzeMoleculeCompetition(molecule) {
    const marketData = db.prepare(`
      SELECT * FROM market_data 
      WHERE molecule LIKE ?
      ORDER BY market_size_usd_mn DESC
    `).all(`%${molecule}%`);
    
    if (marketData.length === 0) {
      return `## Competitive Analysis: ${molecule}\n\nNo market data found for ${molecule}.`;
    }
    
    // Group by therapy area
    const byTherapyArea = {};
    marketData.forEach(d => {
      if (!byTherapyArea[d.therapy_area]) {
        byTherapyArea[d.therapy_area] = [];
      }
      byTherapyArea[d.therapy_area].push(d);
    });
    
    let result = `## Competitive Analysis: ${molecule}\n\n`;
    result += `**Market Presence:**\n\n`;
    
    Object.entries(byTherapyArea).forEach(([area, data]) => {
      const totalMarket = data.reduce((sum, d) => sum + (d.market_size_usd_mn || 0), 0);
      const avgCompetition = data.reduce((sum, d) => sum + (d.competition_level || 0), 0) / data.length;
      
      result += `**${area}:**\n`;
      result += `- Market Size: $${totalMarket.toFixed(0)}M\n`;
      result += `- Competition Level: ${(avgCompetition * 100).toFixed(1)}%\n`;
      result += `- Regions: ${[...new Set(data.map(d => d.region))].join(', ')}\n\n`;
    });
    
    return result;
  }
  
  simulateLaunchScenario(query) {
    // Extract scenario details from query
    const isGeneric = /generic/i.test(query);
    const molecule = this.extractMolecule(query);
    
    let result = `## Launch Scenario Simulation\n\n`;
    
    if (isGeneric && molecule) {
      result += `**Scenario:** Generic Launch for ${molecule}\n\n`;
      result += `**Market Impact Analysis:**\n`;
      result += `- Expected Market Share Loss: 30-50% within 12 months\n`;
      result += `- Price Erosion: 40-60% price reduction expected\n`;
      result += `- Timeline to Market Entry: 6-12 months post-patent expiry\n\n`;
      result += `**Competitive Response:**\n`;
      result += `- Branded competitors likely to reduce prices\n`;
      result += `- Market consolidation may occur\n`;
      result += `- Focus shifts to differentiation and patient loyalty\n\n`;
      result += `**Recommendation:**\n`;
      result += `- Accelerate lifecycle management initiatives\n`;
      result += `- Develop combination therapies\n`;
      result += `- Strengthen patient support programs\n`;
    } else {
      result += `**Scenario:** New Product Launch\n\n`;
      result += `**Market Entry Strategy:**\n`;
      result += `- Identify whitespace opportunities\n`;
      result += `- Assess competitive landscape\n`;
      result += `- Develop differentiation strategy\n\n`;
      result += `**Key Considerations:**\n`;
      result += `- Patent landscape and FTO risks\n`;
      result += `- Market size and growth potential\n`;
      result += `- Competitive response scenarios\n`;
    }
    
    return result;
  }
  
  generalCompetitiveInfo() {
    return `## Competitive Intelligence\n\n` +
           `Competitive analysis provides insights into:\n` +
           `- Market share and positioning\n` +
           `- Competitive threats and opportunities\n` +
           `- Launch scenario simulations\n` +
           `- War-gaming competitive responses\n\n` +
           `**Usage:** Ask about competition for a molecule or therapy area, e.g., "Analyze competition for Metformin in diabetes"`;
  }
}

