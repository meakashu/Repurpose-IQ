import db from '../database/db.js';

export class RateLimiter {
  static LIMITS = {
    groq: {
      analyst: 100,
      manager: 200,
      executive: 500,
      admin: 1000,
      global: 5000
    },
    tavily: {
      analyst: 50,
      manager: 100,
      executive: 200,
      admin: 500,
      global: 1000
    }
  };

  static checkLimit(apiName, userId, userRole = 'analyst') {
    const today = new Date().toISOString().split('T')[0];
    
    // Get user usage
    const userUsage = db.prepare(`
      SELECT COUNT(*) as count FROM api_usage
      WHERE api_name = ? AND user_id = ? AND date = ?
    `).get(apiName, userId, today);

    // Get global usage
    const globalUsage = db.prepare(`
      SELECT COUNT(*) as count FROM api_usage
      WHERE api_name = ? AND date = ?
    `).get(apiName, today);

    const userLimit = this.LIMITS[apiName]?.[userRole] || 100;
    const globalLimit = this.LIMITS[apiName]?.global || 1000;

    const userAllowed = (userUsage?.count || 0) < userLimit;
    const globalAllowed = (globalUsage?.count || 0) < globalLimit;

    return {
      allowed: userAllowed && globalAllowed,
      userUsed: userUsage?.count || 0,
      userLimit,
      globalUsed: globalUsage?.count || 0,
      globalLimit
    };
  }

  static recordUsage(apiName, userId) {
    const today = new Date().toISOString().split('T')[0];
    
    db.prepare(`
      INSERT INTO api_usage (api_name, user_id, date, created_at)
      VALUES (?, ?, ?, ?)
    `).run(apiName, userId, today, new Date().toISOString());
  }

  static getUsageStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {};
    for (const api of Object.keys(this.LIMITS)) {
      const usage = db.prepare(`
        SELECT COUNT(*) as count FROM api_usage
        WHERE api_name = ? AND date = ?
      `).get(api, today);

      stats[api] = {
        global_calls: usage?.count || 0,
        global_limit: this.LIMITS[api].global
      };
    }

    return stats;
  }
}

