import EventEmitter from 'events';
import axios from 'axios';
import db from '../database/db.js';

/**
 * Real-Time Clinical Trial Monitoring Service
 * Monitors ClinicalTrials.gov for updates on tracked molecules
 */
class ClinicalTrialMonitor extends EventEmitter {
  constructor() {
    super();
    this.isMonitoring = false;
    this.checkInterval = 60 * 60 * 1000; // 1 hour default
    this.trackedMolecules = new Set();
    this.lastCheckTime = new Date();
    this.monitorInterval = null;
  }

  /**
   * Start monitoring specific molecules
   * @param {string[]} molecules - Array of molecule names to monitor
   * @param {number} intervalMs - Check interval in milliseconds
   */
  async startMonitoring(molecules = [], intervalMs = null) {
    this.isMonitoring = true;
    if (intervalMs) {
      this.checkInterval = intervalMs;
    }
    
    molecules.forEach(mol => this.trackedMolecules.add(mol.toLowerCase()));
    
    // Initial check
    await this.checkForUpdates();
    
    // Schedule periodic checks
    this.monitorInterval = setInterval(() => {
      this.checkForUpdates();
    }, this.checkInterval);
    
    console.log(`🔍 Started monitoring ${this.trackedMolecules.size} molecules (checking every ${this.checkInterval / 1000 / 60} minutes)`);
  }

  /**
   * Check for new or updated clinical trials
   */
  async checkForUpdates() {
    if (this.trackedMolecules.size === 0) {
      return;
    }

    const updates = [];
    
    for (const molecule of this.trackedMolecules) {
      try {
        const newTrials = await this.fetchNewTrials(molecule);
        if (newTrials.length > 0) {
          updates.push({
            molecule,
            trials: newTrials,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Error checking trials for ${molecule}:`, error.message);
      }
    }
    
    if (updates.length > 0) {
      this.emit('trials-updated', updates);
      await this.saveUpdates(updates);
    }
    
    this.lastCheckTime = new Date();
  }

  /**
   * Fetch new trials from ClinicalTrials.gov API
   * @param {string} molecule - Molecule name to search for
   * @returns {Promise<Array>} Array of new trial objects
   */
  async fetchNewTrials(molecule) {
    try {
      // Use ClinicalTrials.gov API v2
      const response = await axios.get('https://clinicaltrials.gov/api/v2/studies', {
        params: {
          'query.cond': molecule,
          'filter.overallStatus': 'RECRUITING|ACTIVE_NOT_RECRUITING|COMPLETED',
          'pageSize': 20,
          'format': 'json'
        },
        timeout: 15000
      });
      
      const studies = response.data?.studies || [];
      const newTrials = [];
      
      for (const study of studies) {
        const protocol = study.protocolSection || {};
        const identification = protocol.identificationModule || {};
        const status = protocol.statusModule || {};
        const design = protocol.designModule || {};
        
        const nctId = identification.nctId;
        const title = identification.briefTitle || 'N/A';
        const overallStatus = status.overallStatus || 'UNKNOWN';
        const phases = design.phases || [];
        const phase = phases.length > 0 ? phases[0] : 'N/A';
        const startDate = status.startDateStruct?.date || null;
        
        if (!nctId) continue;
        
        // Check if we've seen this trial before
        const exists = db.prepare(`
          SELECT id FROM clinical_trial_alerts 
          WHERE nct_id = ? AND molecule = ?
        `).get(nctId, molecule);
        
        if (!exists) {
          newTrials.push({
            nctId,
            title,
            status: overallStatus,
            phase,
            startDate,
            url: `https://clinicaltrials.gov/study/${nctId}`
          });
        }
      }
      
      return newTrials;
    } catch (error) {
      // Fallback to database if API fails
      console.warn(`ClinicalTrials.gov API error for ${molecule}, using database fallback:`, error.message);
      return this.fetchFromDatabase(molecule);
    }
  }

  /**
   * Fallback: Fetch from local database
   */
  fetchFromDatabase(molecule) {
    const trials = db.prepare(`
      SELECT DISTINCT nct_id, indication, phase, drug_name, sponsor
      FROM clinical_trials 
      WHERE drug_name LIKE ? 
      AND nct_id NOT IN (
        SELECT nct_id FROM clinical_trial_alerts WHERE molecule = ?
      )
      LIMIT 5
    `).all(`%${molecule}%`, molecule);

    return trials.map(t => ({
      nctId: t.nct_id,
      title: `${t.drug_name} - ${t.indication}`,
      status: 'ACTIVE',
      phase: t.phase,
      startDate: null,
      url: t.nct_id ? `https://clinicaltrials.gov/study/${t.nct_id}` : null
    }));
  }

  /**
   * Save updates to database
   */
  async saveUpdates(updates) {
    const insert = db.prepare(`
      INSERT INTO clinical_trial_alerts 
      (nct_id, molecule, title, status, phase, start_date, url, alert_time, viewed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);
    
    const insertMany = db.transaction((updates) => {
      for (const update of updates) {
        for (const trial of update.trials) {
          try {
            insert.run(
              trial.nctId,
              update.molecule,
              trial.title,
              trial.status,
              trial.phase,
              trial.startDate,
              trial.url,
              new Date().toISOString()
            );
          } catch (error) {
            // Ignore duplicate errors
            if (!error.message.includes('UNIQUE constraint')) {
              console.error('Error saving trial alert:', error);
            }
          }
        }
      }
    });

    insertMany(updates);
  }

  /**
   * Add molecule to monitoring list
   */
  addMolecule(molecule) {
    this.trackedMolecules.add(molecule.toLowerCase());
    console.log(`➕ Added ${molecule} to monitoring list`);
  }

  /**
   * Remove molecule from monitoring list
   */
  removeMolecule(molecule) {
    this.trackedMolecules.delete(molecule.toLowerCase());
    console.log(`➖ Removed ${molecule} from monitoring list`);
  }

  /**
   * Get list of tracked molecules
   */
  getTrackedMolecules() {
    return Array.from(this.trackedMolecules);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    console.log('🛑 Stopped clinical trial monitoring');
  }

  /**
   * Get monitoring status
   */
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      trackedMolecules: this.getTrackedMolecules(),
      lastCheckTime: this.lastCheckTime,
      checkInterval: this.checkInterval
    };
  }
}

export default new ClinicalTrialMonitor();
