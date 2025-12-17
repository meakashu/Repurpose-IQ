import db from '../database/db.js';
import iqviaMockAPI from '../services/iqviaMockAPI.js';

export class MarketAgent {
  async process(query) {
    const queryLower = query.toLowerCase();
    
    // Use IQVIA Mock API for enhanced data
    if (/therapy area|therapy-area|respiratory|diabetes|oncology|cardiovascular/i.test(query)) {
      const therapyArea = this.extractTherapyArea(query);
      if (therapyArea) {
        return this.getTherapyAreaAnalysis(therapyArea);
      }
    }
    
    if (/molecule|drug|compound/i.test(query)) {
      const molecule = this.extractMolecule(query);
      if (molecule) {
        return this.getMoleculeAnalysis(molecule);
      }
    }
    
    // Load market data
    const marketData = db.prepare('SELECT * FROM market_data').all();
    
    if (/low competition|whitespace|respiratory/i.test(query)) {
      return this.findLowCompetitionMarkets(marketData);
    }
    
    if (/market size|cagr|growth/i.test(query)) {
      return this.analyzeMarketSize(marketData);
    }
    
    if (/competitive|competition|competitor/i.test(query)) {
      const therapyArea = this.extractTherapyArea(query);
      if (therapyArea) {
        return this.getCompetitiveAnalysis(therapyArea);
      }
    }
    
    return this.generalMarketAnalysis(marketData);
  }

  extractTherapyArea(query) {
    const areas = ['respiratory', 'diabetes', 'oncology', 'cardiovascular', 'gastroenterology', 'neurology'];
    for (const area of areas) {
      if (query.toLowerCase().includes(area)) {
        return area;
      }
    }
    return null;
  }

  extractMolecule(query) {
    const molecules = ['metformin', 'sitagliptin', 'pembrolizumab', 'rivaroxaban', 'atorvastatin', 'lisinopril'];
    for (const mol of molecules) {
      if (query.toLowerCase().includes(mol)) {
        return mol;
      }
    }
    return null;
  }

  getTherapyAreaAnalysis(therapyArea) {
    const data = iqviaMockAPI.getMarketDataByTherapyArea(therapyArea);
    
    let result = `## Market Analysis: ${therapyArea}\n\n`;
    result += `**Summary:**\n`;
    result += `- Total Market Size: $${data.total_market_size_usd_mn.toFixed(0)}M\n`;
    result += `- Average CAGR: ${data.average_cagr.toFixed(1)}%\n`;
    result += `- Number of Molecules: ${data.number_of_molecules}\n\n`;
    
    result += `**Molecules:**\n\n`;
    result += "| Molecule | Market Size (USD M) | CAGR (%) | Competition Level |\n";
    result += "|----------|---------------------|----------|-------------------|\n";
    
    data.molecules.forEach(m => {
      result += `| ${m.molecule} | ${m.market_size_usd_mn.toFixed(0)} | ${m.cagr_percent.toFixed(1)} | ${((m.competition_level || 0) * 100).toFixed(1)}% |\n`;
    });
    
    return result;
  }

  getMoleculeAnalysis(molecule) {
    const data = iqviaMockAPI.getMarketDataByMolecule(molecule);
    if (!data) {
      return `No market data found for ${molecule}.`;
    }
    
    let result = `## Market Analysis: ${molecule}\n\n`;
    result += `**Regions:**\n\n`;
    result += "| Region | Therapy Area | Indication | Market Size (USD M) | CAGR (%) |\n";
    result += "|--------|-------------|------------|---------------------|----------|\n";
    
    data.regions.forEach(r => {
      result += `| ${r.region} | ${r.therapy_area} | ${r.indication || 'N/A'} | ${r.market_size_usd_mn.toFixed(0)} | ${r.cagr_percent.toFixed(1)} |\n`;
    });
    
    return result;
  }

  getCompetitiveAnalysis(therapyArea) {
    const data = iqviaMockAPI.getCompetitiveAnalysis(therapyArea);
    
    let result = `## Competitive Analysis: ${therapyArea}\n\n`;
    result += `**Market Overview:**\n`;
    result += `- Total Market Size: $${data.total_market_size.toFixed(0)}M\n`;
    result += `- Market Concentration: ${data.market_concentration.concentration} (HHI: ${data.market_concentration.hhi.toFixed(0)})\n\n`;
    
    result += `**Competitors:**\n\n`;
    result += "| Molecule | Market Share (%) | Competition Level | Generic Penetration |\n";
    result += "|----------|------------------|-------------------|---------------------|\n";
    
    data.competitors.forEach(c => {
      result += `| ${c.molecule} | ${c.market_share_percent.toFixed(1)} | ${((c.competition_level || 0) * 100).toFixed(1)}% | ${((c.generic_penetration || 0) * 100).toFixed(1)}% |\n`;
    });
    
    return result;
  }

  findLowCompetitionMarkets(data) {
    const lowComp = data.filter(d => 
      (d.competition_level || d.generic_penetration) < 0.3 && 
      d.patient_burden > 0.5
    );

    if (lowComp.length === 0) {
      return "No low-competition markets found matching the criteria.";
    }

    let result = "## Low Competition Markets (Whitespace Opportunities)\n\n";
    result += "| Molecule | Therapy Area | Market Size (USD M) | CAGR (%) | Competition Level (%) | Patient Burden (%) |\n";
    result += "|----------|-------------|---------------------|----------|----------------------|-------------------|\n";
    
    lowComp.slice(0, 5).forEach(m => {
      const compLevel = ((m.competition_level || m.generic_penetration) * 100).toFixed(1);
      const patientBurden = (m.patient_burden * 100).toFixed(1);
      result += `| ${m.molecule} | ${m.therapy_area} | ${(m.market_size_usd_mn || 0).toFixed(0)} | ${(m.cagr_percent || 0).toFixed(1)} | ${compLevel} | ${patientBurden} |\n`;
    });

    return result;
  }

  analyzeMarketSize(data) {
    if (!data || data.length === 0) {
      return `## Market Analysis\n\nNo market data available.`;
    }

    const total = data.reduce((sum, d) => sum + (d.market_size_usd_mn || 0), 0);
    const avgCAGR = data.reduce((sum, d) => sum + (d.cagr_percent || 0), 0) / data.length;
    const topMarkets = data
      .sort((a, b) => (b.market_size_usd_mn || 0) - (a.market_size_usd_mn || 0))
      .slice(0, 5);

    let result = `## Market Analysis\n\n`;
    result += `**Summary Metrics:**\n`;
    result += `- Total Market Size: $${total.toFixed(0)}M\n`;
    result += `- Average CAGR: ${avgCAGR.toFixed(1)}%\n`;
    result += `- Number of Markets: ${data.length}\n\n`;
    
    result += `**Top 5 Markets by Size:**\n\n`;
    result += "| Rank | Molecule | Therapy Area | Market Size (USD M) | CAGR (%) |\n";
    result += "|------|----------|-------------|---------------------|----------|\n";
    
    topMarkets.forEach((m, idx) => {
      result += `| ${idx + 1} | ${m.molecule} | ${m.therapy_area} | ${(m.market_size_usd_mn || 0).toFixed(0)} | ${(m.cagr_percent || 0).toFixed(1)} |\n`;
    });

    return result;
  }

  generalMarketAnalysis(data) {
    return this.analyzeMarketSize(data) + "\n" + this.findLowCompetitionMarkets(data);
  }
}

