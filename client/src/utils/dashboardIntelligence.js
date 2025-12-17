/**
 * Dashboard Intelligence Orchestrator
 * Generates contextual insights and strategic recommendations for pharma decision-making
 */

const MANDATORY_DASHBOARD_DISCLAIMER = `
⚠️ **STRATEGIC RESEARCH NOTICE**
This dashboard is intended for pharmaceutical strategy and innovation research only. Data shown may include simulated sources and must be validated before regulatory or commercial decisions.
`.trim();

/**
 * Generates strategic insights for market data
 */
export function generateMarketInsights(marketData) {
    if (!marketData || marketData.length === 0) return [];

    const insights = [];

    // Find high-growth, high-value molecules
    const highGrowthMolecules = marketData
        .filter(m => m.cagr_percent > 10)
        .sort((a, b) => b.market_size_usd_mn - a.market_size_usd_mn);

    if (highGrowthMolecules.length > 0) {
        const top = highGrowthMolecules[0];
        insights.push({
            type: 'opportunity',
            title: 'High-Growth Leader Identified',
            message: `${top.molecule} demonstrates exceptional market dynamics with $${(top.market_size_usd_mn / 1000).toFixed(1)}B market size and ${top.cagr_percent}% CAGR, indicating strong commercial potential in ${top.therapy_area}.`,
            priority: 'high'
        });
    }

    // Detect patent cliff risks (negative CAGR)
    const patentCliff = marketData.filter(m => m.cagr_percent < 0);
    if (patentCliff.length > 0) {
        const molecules = patentCliff.map(m => m.molecule).join(', ');
        insights.push({
            type: 'risk',
            title: 'Patent Cliff Alert',
            message: `${molecules} showing market erosion (negative CAGR), signaling biosimilar competition and repurposing opportunities.`,
            priority: 'critical'
        });
    }

    // Identify therapy white-space opportunities
    const therapyMap = {};
    marketData.forEach(m => {
        if (!therapyMap[m.therapy_area]) {
            therapyMap[m.therapy_area] = [];
        }
        therapyMap[m.therapy_area].push(m);
    });

    const lowCompetitionTherapies = Object.entries(therapyMap)
        .filter(([_, molecules]) => molecules.length <= 2)
        .map(([therapy]) => therapy);

    if (lowCompetitionTherapies.length > 0) {
        insights.push({
            type: 'opportunity',
            title: 'White-Space Therapy Areas',
            message: `${lowCompetitionTherapies.join(', ')} exhibit low competitive density, presenting potential for value-added differentiation and orphan indication exploration.`,
            priority: 'medium'
        });
    }

    // Detect stagnant molecule (low CAGR < 2%)
    const stagnant = marketData.filter(m => m.cagr_percent < 2 && m.cagr_percent >= 0);
    if (stagnant.length > 0) {
        const displayMolecules = stagnant.slice(0, 2).map(m => m.molecule).join(', ');
        const additionalCount = stagnant.length > 2 ? ` (+${stagnant.length - 2} others)` : '';
        insights.push({
            type: 'warning',
            title: 'Market Stagnation Detected',
            message: `${displayMolecules}${additionalCount} showing minimal growth (<2% CAGR), suggesting saturated markets or generic erosion. Consider lifecycle management strategies.`,
            priority: 'medium'
        });
    }

    return insights;
}

/**
 * Generates KPI-specific insights
 */
export function generateKPIInsights(kpis) {
    const insights = [];

    if (kpis.totalMarket > 40000) {
        insights.push({
            type: 'highlight',
            message: `Portfolio spans $${(kpis.totalMarket / 1000).toFixed(1)}B aggregate market, positioning for diversified revenue streams across therapy areas.`
        });
    }

    if (kpis.avgCAGR > 6) {
        insights.push({
            type: 'positive',
            message: `Average CAGR of ${kpis.avgCAGR.toFixed(1)}% exceeds industry benchmark (4-5%), indicating portfolio momentum.`
        });
    }

    const patentUtilization = ((kpis.activePatents / kpis.totalPatents) * 100).toFixed(0);
    if (patentUtilization < 50) {
        insights.push({
            type: 'warning',
            message: `Only ${patentUtilization}% patent utilization. Opportunity exists to monetize dormant IP through out-licensing or repurposing.`
        });
    }

    return insights;
}

/**
 * Generates therapy-specific strategic recommendations
 */
export function generateTherapyRecommendations(marketData) {
    if (!marketData || marketData.length === 0) return [];

    const recommendations = [];
    const therapyGroups = {};

    // Group by therapy
    marketData.forEach(m => {
        if (!therapyGroups[m.therapy_area]) {
            therapyGroups[m.therapy_area] = {
                molecules: [],
                totalMarket: 0,
                avgCAGR: 0
            };
        }
        therapyGroups[m.therapy_area].molecules.push(m);
        therapyGroups[m.therapy_area].totalMarket += m.market_size_usd_mn;
    });

    // Calculate avg CAGR per therapy
    Object.values(therapyGroups).forEach(group => {
        group.avgCAGR = group.molecules.reduce((sum, m) => sum + m.cagr_percent, 0) / group.molecules.length;
    });

    // Generate recommendations
    Object.entries(therapyGroups).forEach(([therapy, data]) => {
        if (data.avgCAGR > 10) {
            recommendations.push({
                therapy,
                action: 'Accelerate Investment',
                rationale: `${therapy} demonstrates ${data.avgCAGR.toFixed(1)}% avg growth. Prioritize pipeline expansion and M&A in this segment.`,
                priority: 'high'
            });
        } else if (data.avgCAGR < 2) {
            recommendations.push({
                therapy,
                action: 'Portfolio Optimization',
                rationale: `${therapy} showing limited growth (${data.avgCAGR.toFixed(1)}% CAGR). Consider divest-or-differentiate strategy.`,
                priority: 'medium'
            });
        }
    });

    return recommendations;
}

/**
 * Formats insight for UI display
 */
export function formatInsightForUI(insight) {
    const icons = {
        opportunity: '💡',
        risk: '⚠️',
        warning: '⚡',
        highlight: '✨',
        positive: '📈'
    };

    const colors = {
        opportunity: 'bg-green-50 border-green-500 text-green-800',
        risk: 'bg-red-50 border-red-500 text-red-800',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
        highlight: 'bg-blue-50 border-blue-500 text-blue-800',
        positive: 'bg-emerald-50 border-emerald-500 text-emerald-800',
        critical: 'bg-red-100 border-red-600 text-red-900'
    };

    return {
        ...insight,
        icon: icons[insight.type] || '📊',
        colorClass: colors[insight.type] || colors[insight.priority] || 'bg-gray-50 border-gray-500 text-gray-800'
    };
}

export { MANDATORY_DASHBOARD_DISCLAIMER };
