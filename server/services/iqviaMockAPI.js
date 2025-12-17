/**
 * IQVIA Mock API
 * Returns market size, growth and competitor data per therapy area
 */

import db from '../database/db.js';

export class IQVIAMockAPI {
  /**
   * Get market data by therapy area
   */
  getMarketDataByTherapyArea(therapyArea) {
    const data = db.prepare(`
      SELECT * FROM market_data 
      WHERE therapy_area LIKE ?
      ORDER BY market_size_usd_mn DESC
    `).all(`%${therapyArea}%`);

    return {
      therapy_area: therapyArea,
      total_market_size_usd_mn: data.reduce((sum, d) => sum + (d.market_size_usd_mn || 0), 0),
      average_cagr: data.reduce((sum, d) => sum + (d.cagr_percent || 0), 0) / (data.length || 1),
      number_of_molecules: data.length,
      molecules: data.map(d => ({
        molecule: d.molecule,
        market_size_usd_mn: d.market_size_usd_mn,
        cagr_percent: d.cagr_percent,
        competition_level: d.competition_level,
        generic_penetration: d.generic_penetration,
        patient_burden: d.patient_burden
      }))
    };
  }

  /**
   * Get market data by molecule
   */
  getMarketDataByMolecule(molecule) {
    const data = db.prepare(`
      SELECT * FROM market_data 
      WHERE molecule LIKE ?
    `).all(`%${molecule}%`);

    if (data.length === 0) {
      return null;
    }

    return {
      molecule: data[0].molecule,
      regions: data.map(d => ({
        region: d.region,
        therapy_area: d.therapy_area,
        indication: d.indication,
        market_size_usd_mn: d.market_size_usd_mn,
        cagr_percent: d.cagr_percent,
        competition_level: d.competition_level,
        generic_penetration: d.generic_penetration
      }))
    };
  }

  /**
   * Get competitive analysis
   */
  getCompetitiveAnalysis(therapyArea) {
    const data = db.prepare(`
      SELECT * FROM market_data 
      WHERE therapy_area LIKE ?
      ORDER BY market_size_usd_mn DESC
    `).all(`%${therapyArea}%`);

    const competitors = data.map(d => ({
      molecule: d.molecule,
      market_share_percent: (d.market_size_usd_mn / data.reduce((sum, d) => sum + (d.market_size_usd_mn || 0), 0)) * 100,
      competition_level: d.competition_level,
      generic_penetration: d.generic_penetration
    }));

    return {
      therapy_area: therapyArea,
      total_market_size: data.reduce((sum, d) => sum + (d.market_size_usd_mn || 0), 0),
      competitors: competitors,
      market_concentration: this.calculateMarketConcentration(competitors)
    };
  }

  /**
   * Get growth trends
   */
  getGrowthTrends(therapyArea, years = 5) {
    const data = db.prepare(`
      SELECT * FROM market_data 
      WHERE therapy_area LIKE ?
    `).all(`%${therapyArea}%`);

    const trends = data.map(d => ({
      molecule: d.molecule,
      current_market_size: d.market_size_usd_mn,
      cagr_percent: d.cagr_percent,
      projected_market_size_5y: d.market_size_usd_mn * Math.pow(1 + (d.cagr_percent / 100), years)
    }));

    return {
      therapy_area: therapyArea,
      current_total: data.reduce((sum, d) => sum + (d.market_size_usd_mn || 0), 0),
      projected_total_5y: trends.reduce((sum, t) => sum + t.projected_market_size_5y, 0),
      trends: trends
    };
  }

  /**
   * Calculate market concentration (HHI)
   */
  calculateMarketConcentration(competitors) {
    const hhi = competitors.reduce((sum, c) => sum + Math.pow(c.market_share_percent, 2), 0);
    let concentration;
    if (hhi < 1500) concentration = 'Low';
    else if (hhi < 2500) concentration = 'Moderate';
    else concentration = 'High';
    
    return { hhi, concentration };
  }

  /**
   * Get whitespace opportunities
   */
  getWhitespaceOpportunities(region = 'Global') {
    const data = db.prepare(`
      SELECT * FROM market_data 
      WHERE region = ? AND competition_level < 0.3 AND patient_burden > 0.5
      ORDER BY market_size_usd_mn DESC
    `).all(region);

    return {
      region,
      opportunities: data.map(d => ({
        molecule: d.molecule,
        therapy_area: d.therapy_area,
        indication: d.indication,
        market_size_usd_mn: d.market_size_usd_mn,
        competition_level: d.competition_level,
        patient_burden: d.patient_burden,
        opportunity_score: (d.market_size_usd_mn / 1000) * (1 - d.competition_level) * d.patient_burden
      }))
    };
  }
}

export default new IQVIAMockAPI();

