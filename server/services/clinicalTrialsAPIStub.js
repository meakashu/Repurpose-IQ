/**
 * Clinical Trials API Stub
 * Simulated access to ongoing trials and their sponsors
 */

import db from '../database/db.js';

export class ClinicalTrialsAPIStub {
  /**
   * Get trials by drug name
   */
  getTrialsByDrug(drugName) {
    const trials = db.prepare(`
      SELECT * FROM clinical_trials 
      WHERE drug_name LIKE ?
      ORDER BY phase ASC
    `).all(`%${drugName}%`);

    return {
      drug_name: drugName,
      total_trials: trials.length,
      trials_by_phase: this.groupByPhase(trials),
      trials: trials.map(t => ({
        nct_id: t.nct_id,
        indication: t.indication,
        therapy_area: t.therapy_area,
        phase: t.phase,
        sponsor: t.sponsor,
        patient_burden_score: t.patient_burden_score,
        competition_density: t.competition_density,
        unmet_need: t.unmet_need,
        opportunity_score: this.calculateOpportunityScore(t)
      }))
    };
  }

  /**
   * Get trials by indication
   */
  getTrialsByIndication(indication) {
    const trials = db.prepare(`
      SELECT * FROM clinical_trials 
      WHERE indication LIKE ?
      ORDER BY unmet_need DESC
    `).all(`%${indication}%`);

    return {
      indication,
      total_trials: trials.length,
      trials_by_phase: this.groupByPhase(trials),
      sponsors: this.getSponsorProfile(trials),
      trials: trials
    };
  }

  /**
   * Get trials by therapy area
   */
  getTrialsByTherapyArea(therapyArea) {
    const trials = db.prepare(`
      SELECT * FROM clinical_trials 
      WHERE therapy_area LIKE ?
    `).all(`%${therapyArea}%`);

    return {
      therapy_area: therapyArea,
      total_trials: trials.length,
      phase_distribution: this.groupByPhase(trials),
      top_indications: this.getTopIndications(trials),
      unmet_need_analysis: this.analyzeUnmetNeeds(trials)
    };
  }

  /**
   * Get repurposing opportunities
   */
  getRepurposingOpportunities(drugName) {
    const trials = db.prepare(`
      SELECT * FROM clinical_trials 
      WHERE drug_name LIKE ? AND indication NOT LIKE ?
      ORDER BY unmet_need DESC
    `).all(`%${drugName}%`, `%${drugName}%`);

    const opportunities = trials.map(t => ({
      drug_name: t.drug_name,
      new_indication: t.indication,
      therapy_area: t.therapy_area,
      phase: t.phase,
      unmet_need_score: t.unmet_need,
      opportunity_rank: this.rankOpportunity(t)
    }));

    return {
      drug_name: drugName,
      repurposing_opportunities: opportunities.sort((a, b) => b.opportunity_rank - a.opportunity_rank),
      total_opportunities: opportunities.length
    };
  }

  /**
   * Get sponsor profile
   */
  getSponsorProfile(trials) {
    const sponsors = {};
    trials.forEach(trial => {
      const sponsor = trial.sponsor || 'Unknown';
      if (!sponsors[sponsor]) {
        sponsors[sponsor] = {
          name: sponsor,
          trial_count: 0,
          phases: new Set(),
          therapy_areas: new Set()
        };
      }
      sponsors[sponsor].trial_count++;
      sponsors[sponsor].phases.add(trial.phase);
      sponsors[sponsor].therapy_areas.add(trial.therapy_area);
    });

    return Object.values(sponsors).map(s => ({
      name: s.name,
      trial_count: s.trial_count,
      phases: Array.from(s.phases),
      therapy_areas: Array.from(s.therapy_areas)
    }));
  }

  /**
   * Group trials by phase
   */
  groupByPhase(trials) {
    const phases = {};
    trials.forEach(trial => {
      const phase = trial.phase || 'Unknown';
      phases[phase] = (phases[phase] || 0) + 1;
    });
    return phases;
  }

  /**
   * Get top indications by unmet need
   */
  getTopIndications(trials, limit = 5) {
    const indications = {};
    trials.forEach(trial => {
      const indication = trial.indication || 'Unknown';
      if (!indications[indication]) {
        indications[indication] = {
          indication,
          trial_count: 0,
          unmet_need_sum: 0,
          phases: new Set()
        };
      }
      indications[indication].trial_count++;
      indications[indication].unmet_need_sum += trial.unmet_need || 0;
      indications[indication].phases.add(trial.phase);
    });

    return Object.values(indications)
      .map(i => ({
        indication: i.indication,
        trial_count: i.trial_count,
        average_unmet_need: i.unmet_need_sum / i.trial_count,
        phases: Array.from(i.phases)
      }))
      .sort((a, b) => b.average_unmet_need - a.average_unmet_need)
      .slice(0, limit);
  }

  /**
   * Analyze unmet needs
   */
  analyzeUnmetNeeds(trials) {
    const unmetNeeds = trials.map(t => t.unmet_need || 0).filter(n => n > 0);
    const avgUnmetNeed = unmetNeeds.reduce((sum, n) => sum + n, 0) / (unmetNeeds.length || 1);

    return {
      average_unmet_need: avgUnmetNeed,
      high_unmet_need_trials: trials.filter(t => (t.unmet_need || 0) > 0.7).length,
      total_trials: trials.length
    };
  }

  /**
   * Calculate opportunity score
   */
  calculateOpportunityScore(trial) {
    const unmetNeed = trial.unmet_need || 0;
    const patientBurden = trial.patient_burden_score || 0;
    const competition = 1 - (trial.competition_density || 0);
    
    return (unmetNeed * 0.4 + patientBurden * 0.3 + competition * 0.3) * 100;
  }

  /**
   * Rank opportunity
   */
  rankOpportunity(trial) {
    return this.calculateOpportunityScore(trial);
  }
}

export default new ClinicalTrialsAPIStub();

