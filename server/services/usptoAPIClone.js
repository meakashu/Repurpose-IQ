/**
 * USPTO API Clone
 * Mock API for patent filings, expiry timelines and innovation trends
 */

import db from '../database/db.js';

export class USPTOAPIClone {
  /**
   * Search patents by molecule
   */
  searchPatentsByMolecule(molecule) {
    const patents = db.prepare(`
      SELECT * FROM patents 
      WHERE molecule LIKE ?
      ORDER BY expiry_date ASC
    `).all(`%${molecule}%`);

    return {
      molecule,
      total_patents: patents.length,
      active_patents: patents.filter(p => p.status === 'active').length,
      expired_patents: patents.filter(p => p.status === 'expired').length,
      patents: patents.map(p => ({
        patent_number: p.patent_number,
        patent_type: p.patent_type,
        filing_date: this.estimateFilingDate(p.expiry_date, p.patent_type),
        expiry_date: p.expiry_date,
        status: p.status,
        years_until_expiry: this.calculateYearsUntilExpiry(p.expiry_date),
        fto_risk: this.calculateFTORisk(p)
      }))
    };
  }

  /**
   * Get patent expiry timeline
   */
  getPatentExpiryTimeline(years = 5) {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() + years);

    const patents = db.prepare(`
      SELECT DISTINCT molecule, patent_number, patent_type, expiry_date, status
      FROM patents 
      WHERE status = 'active' AND expiry_date <= ?
      ORDER BY expiry_date ASC
    `).all(cutoffDate.toISOString().split('T')[0]);

    // Additional deduplication by patent_number + molecule
    const seen = new Set();
    const uniquePatents = [];
    patents.forEach(patent => {
      const key = `${patent.molecule}|${patent.patent_number}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePatents.push(patent);
      }
    });

    const timeline = {};
    uniquePatents.forEach(patent => {
      const year = new Date(patent.expiry_date).getFullYear();
      if (!timeline[year]) {
        timeline[year] = [];
      }
      timeline[year].push({
        molecule: patent.molecule,
        patent_number: patent.patent_number,
        expiry_date: patent.expiry_date,
        patent_type: patent.patent_type
      });
    });

    return {
      timeline_years: years,
      expiring_patents: uniquePatents.length,
      timeline_by_year: timeline,
      opportunities: this.identifyOpportunities(uniquePatents)
    };
  }

  /**
   * Get innovation trends
   */
  getInnovationTrends(therapyArea) {
    // Get market data to infer therapy areas
    const marketData = db.prepare(`
      SELECT DISTINCT molecule, therapy_area FROM market_data 
      WHERE therapy_area LIKE ?
    `).all(`%${therapyArea}%`);

    const molecules = marketData.map(d => d.molecule);
    const allPatents = [];

    molecules.forEach(molecule => {
      const patents = db.prepare(`
        SELECT * FROM patents WHERE molecule LIKE ?
      `).all(`%${molecule}%`);
      allPatents.push(...patents);
    });

    const trends = {
      therapy_area: therapyArea,
      total_patents: allPatents.length,
      active_patents: allPatents.filter(p => p.status === 'active').length,
      patent_types: this.groupByPatentType(allPatents),
      filing_trends: this.analyzeFilingTrends(allPatents),
      expiry_trends: this.analyzeExpiryTrends(allPatents)
    };

    return trends;
  }

  /**
   * Calculate FTO (Freedom to Operate) risk
   */
  calculateFTORisk(patent) {
    if (patent.status === 'expired') {
      return 'Low';
    }

    const yearsUntilExpiry = this.calculateYearsUntilExpiry(patent.expiry_date);
    
    if (yearsUntilExpiry > 5) {
      return 'High';
    } else if (yearsUntilExpiry > 2) {
      return 'Moderate';
    } else {
      return 'Low';
    }
  }

  /**
   * Calculate years until expiry
   */
  calculateYearsUntilExpiry(expiryDate) {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
    
    return Math.max(0, Math.round(diffYears * 10) / 10);
  }

  /**
   * Estimate filing date based on expiry and type
   */
  estimateFilingDate(expiryDate, patentType) {
    if (!expiryDate) return null;
    
    // Typical patent term is 20 years from filing
    const expiry = new Date(expiryDate);
    expiry.setFullYear(expiry.getFullYear() - 20);
    
    return expiry.toISOString().split('T')[0];
  }

  /**
   * Identify opportunities from expiring patents
   */
  identifyOpportunities(patents) {
    const opportunities = [];
    
    patents.forEach(patent => {
      const yearsUntilExpiry = this.calculateYearsUntilExpiry(patent.expiry_date);
      if (yearsUntilExpiry <= 3 && yearsUntilExpiry > 0) {
        opportunities.push({
          molecule: patent.molecule,
          patent_number: patent.patent_number,
          expiry_date: patent.expiry_date,
          years_until_expiry: yearsUntilExpiry,
          opportunity_type: 'Generic Entry',
          recommendation: `Plan generic entry strategy for ${patent.molecule}`
        });
      }
    });

    return opportunities;
  }

  /**
   * Group patents by type
   */
  groupByPatentType(patents) {
    const grouped = {};
    patents.forEach(patent => {
      const type = patent.patent_type || 'Unknown';
      grouped[type] = (grouped[type] || 0) + 1;
    });
    return grouped;
  }

  /**
   * Analyze filing trends
   */
  analyzeFilingTrends(patents) {
    // Mock trend analysis
    return {
      recent_filings: patents.filter(p => p.status === 'active').length,
      trend: 'Stable',
      average_patents_per_molecule: patents.length / new Set(patents.map(p => p.molecule)).size
    };
  }

  /**
   * Analyze expiry trends
   */
  analyzeExpiryTrends(patents) {
    const expiringSoon = patents.filter(p => {
      const years = this.calculateYearsUntilExpiry(p.expiry_date);
      return years !== null && years <= 3 && years > 0;
    });

    return {
      expiring_in_3_years: expiringSoon.length,
      expiring_in_5_years: patents.filter(p => {
        const years = this.calculateYearsUntilExpiry(p.expiry_date);
        return years !== null && years <= 5 && years > 0;
      }).length,
      peak_expiry_year: this.findPeakExpiryYear(patents)
    };
  }

  /**
   * Find peak expiry year
   */
  findPeakExpiryYear(patents) {
    const expiryYears = {};
    patents.forEach(patent => {
      if (patent.expiry_date) {
        const year = new Date(patent.expiry_date).getFullYear();
        expiryYears[year] = (expiryYears[year] || 0) + 1;
      }
    });

    const maxCount = Math.max(...Object.values(expiryYears));
    const peakYear = Object.keys(expiryYears).find(year => expiryYears[year] === maxCount);

    return {
      year: parseInt(peakYear),
      count: maxCount
    };
  }
}

export default new USPTOAPIClone();

