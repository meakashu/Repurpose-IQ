import db from '../database/db.js';
import eximMockServer from '../services/eximMockServer.js';

export class EXIMAgent {
  async process(query) {
    const queryLower = query.toLowerCase();
    const molecule = this.extractMolecule(query);
    
    if (molecule) {
      // Use EXIM Mock Server for enhanced data
      if (/import.*dependency|dependency|sourcing/i.test(queryLower)) {
        return this.getImportDependencyAnalysis(molecule);
      }
      
      if (/trend|projection|forecast/i.test(queryLower)) {
        return this.getTradeTrends(molecule);
      }
      
      return this.queryTradeData(molecule);
    }
    
    return this.generalTradeInfo();
  }

  getImportDependencyAnalysis(molecule) {
    const data = eximMockServer.getImportDependency(molecule);
    if (!data) {
      return `No import dependency data found for ${molecule}.`;
    }
    
    let result = `## Import Dependency Analysis: ${molecule}\n\n`;
    result += `**Key Metrics:**\n`;
    result += `- Top Source Country: ${data.top_source_country}\n`;
    result += `- Dependency Percentage: ${data.dependency_percentage}%\n`;
    result += `- Dependency Risk: ${data.dependency_risk}\n`;
    result += `- Diversification Score: ${data.diversification_score.toFixed(1)}%\n\n`;
    
    if (data.recommendations.length > 0) {
      result += `**Recommendations:**\n`;
      data.recommendations.forEach((rec, idx) => {
        result += `${idx + 1}. ${rec}\n`;
      });
    }
    
    return result;
  }

  getTradeTrends(molecule) {
    const data = eximMockServer.getTradeVolumeTrends(molecule);
    if (!data) {
      return `No trade trend data found for ${molecule}.`;
    }
    
    let result = `## Trade Volume Trends: ${molecule}\n\n`;
    result += `**Current Status:**\n`;
    result += `- Current Volume: ${data.current_volume_kg.toLocaleString()} kg\n`;
    result += `- Growth Rate: ${data.growth_rate_percent}% YoY\n\n`;
    
    result += `**5-Year Projection:**\n\n`;
    result += "| Year | Projected Volume (kg) | Growth Rate (%) |\n";
    result += "|------|----------------------|-----------------|\n";
    
    data.projected_trends.forEach(t => {
      result += `| ${t.year} | ${t.projected_volume_kg.toLocaleString()} | ${t.growth_rate} |\n`;
    });
    
    return result;
  }

  extractMolecule(query) {
    // Extended molecule list
    const molecules = [
      'metformin', 'sitagliptin', 'rivaroxaban', 'pembrolizumab',
      'atorvastatin', 'lisinopril', 'amlodipine', 'omeprazole'
    ];
    for (const mol of molecules) {
      if (query.toLowerCase().includes(mol.toLowerCase())) {
        return mol;
      }
    }
    return null;
  }

  queryTradeData(molecule) {
    // Mock trade data - in production, this would query real EXIM APIs
    const mockData = {
      metformin: {
        total_import_volume_kg: 125000,
        average_price_per_kg: 45.50,
        major_sources: [
          { country: 'China', volume_kg: 80000, percentage: 64 },
          { country: 'India', volume_kg: 35000, percentage: 28 },
          { country: 'Germany', volume_kg: 10000, percentage: 8 }
        ]
      }
    };

    const data = mockData[molecule.toLowerCase()];
    if (!data) {
      return `No EXIM trade data found for ${molecule}.`;
    }

    const totalValue = data.total_import_volume_kg * data.average_price_per_kg;

    let result = `## EXIM Trade Data for ${molecule}\n\n`;
    result += `**Summary Metrics:**\n`;
    result += `- Import Volume: ${data.total_import_volume_kg.toLocaleString()} kg\n`;
    result += `- Average Price: $${data.average_price_per_kg.toFixed(2)}/kg\n`;
    result += `- Estimated Total Value: $${totalValue.toLocaleString()}\n\n`;
    
    result += `**Major Source Countries:**\n\n`;
    result += "| Country | Volume (kg) | Percentage |\n";
    result += "|---------|-------------|------------|\n";

    data.major_sources.forEach(source => {
      result += `| ${source.country} | ${source.volume_kg.toLocaleString()} | ${source.percentage}% |\n`;
    });

    return result;
  }

  generalTradeInfo() {
    return `## EXIM Trade Overview\n\nImport/export trade data analysis for pharmaceutical molecules.\n`;
  }
}

