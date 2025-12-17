import db from '../database/db.js';

export class AnalyticsService {
  static getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    
    // Total queries
    const totalQueries = db.prepare('SELECT COUNT(*) as count FROM query_tracking').get();
    
    // Queries today
    const queriesToday = db.prepare(`
      SELECT COUNT(*) as count FROM query_tracking
      WHERE DATE(created_at) = ?
    `).get(today);
    
    // Average response time
    const avgResponse = db.prepare(`
      SELECT AVG(response_time_ms) as avg FROM query_tracking
      WHERE response_time_ms IS NOT NULL
    `).get();
    
    // Agent usage
    const agentUsage = db.prepare(`
      SELECT agents_used, COUNT(*) as count
      FROM query_tracking
      WHERE agents_used IS NOT NULL
      GROUP BY agents_used
    `).all();
    
    const agentUsageMap = {};
    agentUsage.forEach(row => {
      try {
        const agents = JSON.parse(row.agents_used);
        agents.forEach(agent => {
          agentUsageMap[agent] = (agentUsageMap[agent] || 0) + row.count;
        });
      } catch (e) {
        // Ignore parse errors
      }
    });
    
    // Popular terms (simplified)
    const popularTerms = db.prepare(`
      SELECT query_text, COUNT(*) as count
      FROM query_tracking
      GROUP BY query_text
      ORDER BY count DESC
      LIMIT 10
    `).all();
    
    return {
      total_queries: totalQueries?.count || 0,
      queries_today: queriesToday?.count || 0,
      avg_response_time: avgResponse?.avg || 0,
      agent_usage: agentUsageMap,
      popular_terms: popularTerms.map(t => ({
        term: t.query_text.substring(0, 50),
        count: t.count
      }))
    };
  }
}

