/**
 * EXIM Mock Server
 * Simulated export or import volumes of APIs or formulations
 */

export class EXIMMockServer {
  constructor() {
    this.tradeData = {
      metformin: {
        api: {
          import: {
            total_volume_kg: 125000,
            average_price_per_kg: 45.50,
            major_sources: [
              { country: 'China', volume_kg: 80000, percentage: 64, price_per_kg: 42.00 },
              { country: 'India', volume_kg: 35000, percentage: 28, price_per_kg: 48.00 },
              { country: 'Germany', volume_kg: 10000, percentage: 8, price_per_kg: 52.00 }
            ],
            trends: {
              yoy_growth: 5.2,
              price_trend: 'stable'
            }
          },
          export: {
            total_volume_kg: 45000,
            average_price_per_kg: 55.00,
            major_destinations: [
              { country: 'USA', volume_kg: 20000, percentage: 44 },
              { country: 'Brazil', volume_kg: 15000, percentage: 33 },
              { country: 'Mexico', volume_kg: 10000, percentage: 23 }
            ]
          }
        },
        formulation: {
          import: {
            total_volume_units: 5000000,
            average_price_per_unit: 0.15,
            major_sources: [
              { country: 'India', volume_units: 3000000, percentage: 60 },
              { country: 'China', volume_units: 1500000, percentage: 30 },
              { country: 'Bangladesh', volume_units: 500000, percentage: 10 }
            ]
          }
        }
      },
      sitagliptin: {
        api: {
          import: {
            total_volume_kg: 8500,
            average_price_per_kg: 1250.00,
            major_sources: [
              { country: 'China', volume_kg: 5000, percentage: 59, price_per_kg: 1200.00 },
              { country: 'India', volume_kg: 2500, percentage: 29, price_per_kg: 1300.00 },
              { country: 'Italy', volume_kg: 1000, percentage: 12, price_per_kg: 1350.00 }
            ],
            trends: {
              yoy_growth: -2.3,
              price_trend: 'declining'
            }
          }
        }
      },
      rivaroxaban: {
        api: {
          import: {
            total_volume_kg: 12000,
            average_price_per_kg: 850.00,
            major_sources: [
              { country: 'China', volume_kg: 7000, percentage: 58, price_per_kg: 820.00 },
              { country: 'Germany', volume_kg: 3000, percentage: 25, price_per_kg: 900.00 },
              { country: 'India', volume_kg: 2000, percentage: 17, price_per_kg: 880.00 }
            ],
            trends: {
              yoy_growth: 8.1,
              price_trend: 'increasing'
            }
          }
        }
      },
      pembrolizumab: {
        formulation: {
          import: {
            total_volume_units: 50000,
            average_price_per_unit: 4500.00,
            major_sources: [
              { country: 'USA', volume_units: 30000, percentage: 60 },
              { country: 'Germany', volume_units: 15000, percentage: 30 },
              { country: 'Switzerland', volume_units: 5000, percentage: 10 }
            ],
            trends: {
              yoy_growth: 15.5,
              price_trend: 'stable'
            }
          }
        }
      }
    };
  }

  /**
   * Get trade data for a molecule
   */
  getTradeData(molecule, type = 'api', direction = 'import') {
    const moleculeData = this.tradeData[molecule.toLowerCase()];
    if (!moleculeData) {
      return null;
    }

    const typeData = moleculeData[type];
    if (!typeData) {
      return null;
    }

    const directionData = typeData[direction];
    if (!directionData) {
      return null;
    }

    return {
      molecule,
      type,
      direction,
      ...directionData
    };
  }

  /**
   * Get import dependency analysis
   */
  getImportDependency(molecule) {
    const importData = this.getTradeData(molecule, 'api', 'import');
    if (!importData) {
      return null;
    }

    const topSource = importData.major_sources[0];
    const dependencyRisk = topSource.percentage > 70 ? 'High' : topSource.percentage > 50 ? 'Moderate' : 'Low';

    return {
      molecule,
      top_source_country: topSource.country,
      dependency_percentage: topSource.percentage,
      dependency_risk: dependencyRisk,
      diversification_score: 100 - topSource.percentage,
      recommendations: this.getDiversificationRecommendations(molecule, importData)
    };
  }

  /**
   * Get diversification recommendations
   */
  getDiversificationRecommendations(molecule, importData) {
    const recommendations = [];
    
    if (importData.major_sources[0].percentage > 70) {
      recommendations.push('High dependency on single source. Consider diversifying suppliers.');
    }
    
    if (importData.trends.price_trend === 'increasing') {
      recommendations.push('Price trend is increasing. Consider long-term supply contracts.');
    }

    if (importData.major_sources.length < 3) {
      recommendations.push('Limited supplier base. Explore additional sourcing options.');
    }

    return recommendations;
  }

  /**
   * Get trade volume trends
   */
  getTradeVolumeTrends(molecule, years = 5) {
    const importData = this.getTradeData(molecule, 'api', 'import');
    if (!importData) {
      return null;
    }

    const currentVolume = importData.total_volume_kg;
    const growthRate = importData.trends.yoy_growth / 100;
    
    const trends = [];
    for (let year = 1; year <= years; year++) {
      trends.push({
        year: new Date().getFullYear() + year,
        projected_volume_kg: currentVolume * Math.pow(1 + growthRate, year),
        growth_rate: importData.trends.yoy_growth
      });
    }

    return {
      molecule,
      current_volume_kg: currentVolume,
      growth_rate_percent: importData.trends.yoy_growth,
      projected_trends: trends
    };
  }
}

export default new EXIMMockServer();

