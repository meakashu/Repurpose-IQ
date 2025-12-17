import db from '../database/db.js';
import usptoAPIClone from '../services/usptoAPIClone.js';

export class PatentAgent {
  async process(query) {
    const queryLower = query.toLowerCase();
    const molecule = this.extractMolecule(query);
    
    if (molecule) {
      // Use USPTO API Clone for enhanced data
      if (/expir|timeline|expiring/i.test(queryLower)) {
        return this.getPatentExpiryTimeline(molecule);
      }
      
      if (/fto|freedom.*operate|risk/i.test(queryLower)) {
        return this.getFTORiskAnalysis(molecule);
      }
      
      return this.checkPatentExpiry(molecule);
    }
    
    if (/expir|timeline|expiring.*year/i.test(queryLower)) {
      const years = this.extractYears(query);
      return this.getExpiryTimeline(years || 3);
    }
    
    if (/innovation|trend|filing/i.test(queryLower)) {
      const therapyArea = this.extractTherapyArea(query);
      if (therapyArea) {
        return this.getInnovationTrends(therapyArea);
      }
    }
    
    return this.generalPatentInfo();
  }

  extractYears(query) {
    const match = query.match(/(\d+)\s*year/i);
    return match ? parseInt(match[1]) : null;
  }

  extractTherapyArea(query) {
    const areas = ['respiratory', 'diabetes', 'oncology', 'cardiovascular'];
    for (const area of areas) {
      if (query.toLowerCase().includes(area)) {
        return area;
      }
    }
    return null;
  }

  getPatentExpiryTimeline(molecule) {
    const data = usptoAPIClone.searchPatentsByMolecule(molecule);
    
    let result = `## Patent Expiry Timeline: ${molecule}\n\n`;
    result += `**Summary:**\n`;
    result += `- Total Patents: ${data.total_patents}\n`;
    result += `- Active Patents: ${data.active_patents}\n`;
    result += `- Expired Patents: ${data.expired_patents}\n\n`;
    
    result += `**Active Patents:**\n\n`;
    result += "| Patent Number | Type | Filing Date | Expiry Date | Years Until Expiry | FTO Risk |\n";
    result += "|--------------|------|-------------|-------------|-------------------|----------|\n";
    
    data.patents.filter(p => p.status === 'active').forEach(p => {
      result += `| ${p.patent_number} | ${p.patent_type} | ${p.filing_date || 'N/A'} | ${p.expiry_date} | ${p.years_until_expiry || 'N/A'} | ${p.fto_risk} |\n`;
    });
    
    return result;
  }

  getFTORiskAnalysis(molecule) {
    const data = usptoAPIClone.searchPatentsByMolecule(molecule);
    
    const highRisk = data.patents.filter(p => p.fto_risk === 'High').length;
    const moderateRisk = data.patents.filter(p => p.fto_risk === 'Moderate').length;
    const lowRisk = data.patents.filter(p => p.fto_risk === 'Low').length;
    
    let result = `## FTO Risk Analysis: ${molecule}\n\n`;
    result += `**Risk Assessment:**\n`;
    result += `- High Risk: ${highRisk} patents\n`;
    result += `- Moderate Risk: ${moderateRisk} patents\n`;
    result += `- Low Risk: ${lowRisk} patents\n\n`;
    
    if (highRisk > 0) {
      result += `**High Risk Patents:**\n\n`;
      result += "| Patent Number | Expiry Date | Years Until Expiry |\n";
      result += "|--------------|-------------|-------------------|\n";
      
      data.patents.filter(p => p.fto_risk === 'High').forEach(p => {
        result += `| ${p.patent_number} | ${p.expiry_date} | ${p.years_until_expiry} |\n`;
      });
    }
    
    return result;
  }

  getExpiryTimeline(years) {
    const data = usptoAPIClone.getPatentExpiryTimeline(years);
    
    let result = `## Patent Expiry Timeline (Next ${years} Years)\n\n`;
    result += `**Summary:**\n`;
    result += `- Patents Expiring: ${data.expiring_patents}\n\n`;
    
    result += `**Timeline by Year:**\n\n`;
    Object.entries(data.timeline_by_year).forEach(([year, patents]) => {
      result += `**${year}:** ${patents.length} patents expiring\n`;
      patents.forEach(p => {
        result += `- ${p.molecule} (${p.patent_number}) - Expires: ${p.expiry_date}\n`;
      });
      result += `\n`;
    });
    
    if (data.opportunities.length > 0) {
      result += `**Opportunities:**\n\n`;
      result += "| Molecule | Patent Number | Expiry Date | Years Until Expiry | Opportunity Type |\n";
      result += "|----------|--------------|-------------|-------------------|------------------|\n";
      
      data.opportunities.forEach(opp => {
        result += `| ${opp.molecule} | ${opp.patent_number} | ${opp.expiry_date} | ${opp.years_until_expiry} | ${opp.opportunity_type} |\n`;
      });
    }
    
    return result;
  }

  getInnovationTrends(therapyArea) {
    const data = usptoAPIClone.getInnovationTrends(therapyArea);
    
    let result = `## Innovation Trends: ${therapyArea}\n\n`;
    result += `**Summary:**\n`;
    result += `- Total Patents: ${data.total_patents}\n`;
    result += `- Active Patents: ${data.active_patents}\n\n`;
    
    result += `**Patent Types:**\n`;
    Object.entries(data.patent_types).forEach(([type, count]) => {
      result += `- ${type}: ${count}\n`;
    });
    
    return result;
  }

  extractMolecule(query) {
    // Extended molecule list
    const molecules = [
      'sitagliptin', 'pembrolizumab', 'rivaroxaban', 'metformin',
      'atorvastatin', 'lisinopril', 'amlodipine', 'omeprazole',
      'metoprolol', 'simvastatin', 'losartan', 'albuterol'
    ];
    for (const mol of molecules) {
      if (query.toLowerCase().includes(mol.toLowerCase())) {
        return mol;
      }
    }
    return null;
  }

  checkPatentExpiry(molecule) {
    const patents = db.prepare(`
      SELECT * FROM patents 
      WHERE molecule LIKE ? AND status = 'active'
    `).all(`%${molecule}%`);

    if (patents.length === 0) {
      return `No active patents found for ${molecule}.`;
    }

    let result = `## Patent Status for ${molecule}\n\n`;
    result += "| Patent Number | Type | Expiry Date | Status |\n";
    result += "|--------------|------|-------------|--------|\n";
    
    patents.forEach(p => {
      result += `| ${p.patent_number || 'N/A'} | ${p.patent_type || 'N/A'} | ${p.expiry_date || 'N/A'} | ${p.status} |\n`;
    });

    return result;
  }

  generalPatentInfo() {
    const total = db.prepare('SELECT COUNT(*) as count FROM patents WHERE status = ?').get('active');
    return `## Patent Overview\n\n- **Active Patents**: ${total.count}\n`;
  }
}

