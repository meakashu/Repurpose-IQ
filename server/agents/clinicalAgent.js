import db from '../database/db.js';
import clinicalTrialsAPIStub from '../services/clinicalTrialsAPIStub.js';

export class ClinicalAgent {
  async process(query) {
    const queryLower = query.toLowerCase();
    
    if (/repurpos/i.test(queryLower)) {
      const molecule = this.extractMolecule(query);
      if (molecule) {
        return this.getRepurposingOpportunities(molecule);
      }
      return this.findRepurposingOpportunities(query);
    }
    
    if (/indication|disease/i.test(queryLower)) {
      const indication = this.extractIndication(query);
      if (indication) {
        return this.getTrialsByIndication(indication);
      }
    }
    
    if (/therapy.*area|therapy-area/i.test(queryLower)) {
      const therapyArea = this.extractTherapyArea(query);
      if (therapyArea) {
        return this.getTrialsByTherapyArea(therapyArea);
      }
    }
    
    const molecule = this.extractMolecule(query);
    if (molecule) {
      return this.getTrialsByDrug(molecule);
    }
    
    return this.generalTrialInfo();
  }

  extractIndication(query) {
    const indications = ['diabetes', 'cancer', 'hypertension', 'copd', 'asthma', 'heart disease'];
    for (const ind of indications) {
      if (query.toLowerCase().includes(ind)) {
        return ind;
      }
    }
    return null;
  }

  extractTherapyArea(query) {
    const areas = ['oncology', 'diabetes', 'cardiovascular', 'respiratory'];
    for (const area of areas) {
      if (query.toLowerCase().includes(area)) {
        return area;
      }
    }
    return null;
  }

  getRepurposingOpportunities(molecule) {
    const data = clinicalTrialsAPIStub.getRepurposingOpportunities(molecule);
    
    if (data.total_opportunities === 0) {
      return `No repurposing opportunities found for ${molecule}.`;
    }
    
    let result = `## Repurposing Opportunities: ${molecule}\n\n`;
    result += `**Total Opportunities:** ${data.total_opportunities}\n\n`;
    
    result += `**Opportunities (Ranked by Score):**\n\n`;
    result += "| New Indication | Therapy Area | Phase | Unmet Need Score | Opportunity Rank |\n";
    result += "|----------------|--------------|------|------------------|------------------|\n";
    
    data.repurposing_opportunities.slice(0, 10).forEach(opp => {
      result += `| ${opp.new_indication} | ${opp.therapy_area} | ${opp.phase} | ${opp.unmet_need_score.toFixed(2)} | ${opp.opportunity_rank.toFixed(1)} |\n`;
    });
    
    return result;
  }

  getTrialsByDrug(drugName) {
    const data = clinicalTrialsAPIStub.getTrialsByDrug(drugName);
    
    let result = `## Clinical Trials: ${drugName}\n\n`;
    result += `**Summary:**\n`;
    result += `- Total Trials: ${data.total_trials}\n`;
    result += `**Trials by Phase:**\n`;
    Object.entries(data.trials_by_phase).forEach(([phase, count]) => {
      result += `- ${phase}: ${count}\n`;
    });
    result += `\n`;
    
    result += `**Trials:**\n\n`;
    result += "| NCT ID | Indication | Phase | Sponsor | Unmet Need | Opportunity Score |\n";
    result += "|--------|------------|------|---------|------------|-------------------|\n";
    
    data.trials.slice(0, 10).forEach(t => {
      result += `| ${t.nct_id || 'N/A'} | ${t.indication || 'N/A'} | ${t.phase} | ${t.sponsor || 'N/A'} | ${t.unmet_need ? t.unmet_need.toFixed(2) : 'N/A'} | ${t.opportunity_score.toFixed(1)} |\n`;
    });
    
    return result;
  }

  getTrialsByIndication(indication) {
    const data = clinicalTrialsAPIStub.getTrialsByIndication(indication);
    
    let result = `## Clinical Trials: ${indication}\n\n`;
    result += `**Summary:**\n`;
    result += `- Total Trials: ${data.total_trials}\n\n`;
    
    result += `**Top Sponsors:**\n\n`;
    result += "| Sponsor | Trial Count | Phases | Therapy Areas |\n";
    result += "|---------|------------|--------|---------------|\n";
    
    data.sponsors.slice(0, 5).forEach(s => {
      result += `| ${s.name} | ${s.trial_count} | ${s.phases.join(', ')} | ${s.therapy_areas.join(', ')} |\n`;
    });
    
    return result;
  }

  getTrialsByTherapyArea(therapyArea) {
    const data = clinicalTrialsAPIStub.getTrialsByTherapyArea(therapyArea);
    
    let result = `## Clinical Trials: ${therapyArea}\n\n`;
    result += `**Summary:**\n`;
    result += `- Total Trials: ${data.total_trials}\n\n`;
    
    result += `**Phase Distribution:**\n`;
    Object.entries(data.phase_distribution).forEach(([phase, count]) => {
      result += `- ${phase}: ${count}\n`;
    });
    result += `\n`;
    
    result += `**Top Indications by Unmet Need:**\n\n`;
    result += "| Indication | Trial Count | Average Unmet Need | Phases |\n";
    result += "|-----------|------------|-------------------|--------|\n";
    
    data.top_indications.forEach(ind => {
      result += `| ${ind.indication} | ${ind.trial_count} | ${ind.average_unmet_need.toFixed(2)} | ${ind.phases.join(', ')} |\n`;
    });
    
    return result;
  }

  findRepurposingOpportunities(query) {
    const molecule = this.extractMolecule(query);
    const trials = db.prepare(`
      SELECT * FROM clinical_trials 
      WHERE drug_name LIKE ? OR indication LIKE ?
    `).all(`%${molecule || ''}%`, `%${molecule || ''}%`);

    if (trials.length === 0) {
      return "No repurposing opportunities found.";
    }

    let result = `## Repurposing Opportunities\n\n`;
    result += "| Drug Name | Indication | Phase | Therapy Area | Unmet Need Score |\n";
    result += "|-----------|------------|------|--------------|------------------|\n";
    
    trials.slice(0, 5).forEach(t => {
      result += `| ${t.drug_name} | ${t.indication || 'N/A'} | ${t.phase} | ${t.therapy_area || 'N/A'} | ${t.unmet_need ? t.unmet_need.toFixed(2) : 'N/A'} |\n`;
    });

    return result;
  }

  extractMolecule(query) {
    // Extended molecule list
    const molecules = [
      'pembrolizumab', 'sitagliptin', 'rivaroxaban', 'metformin',
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

  generalTrialInfo() {
    const total = db.prepare('SELECT COUNT(*) as count FROM clinical_trials').get();
    return `## Clinical Trials Overview\n\n- **Total Trials**: ${total.count}\n`;
  }
}

