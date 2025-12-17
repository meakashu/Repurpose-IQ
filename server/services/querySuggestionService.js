import db from '../database/db.js';
import { chatCompletion } from './groqService.js';

/**
 * Smart Query Suggestion Service
 * Provides context-aware query suggestions based on user history and embeddings
 */
class QuerySuggestionService {
  constructor() {
    this.similarityThreshold = 0.7;
  }

  /**
   * Get query suggestions based on current input
   */
  async getSuggestions(currentQuery, limit = 5) {
    try {
      // Get similar queries from database
      const similarQueries = this.findSimilarQueries(currentQuery, limit);
      
      // Generate AI-powered suggestions
      const aiSuggestions = await this.generateAISuggestions(currentQuery, limit);
      
      // Combine and deduplicate
      const allSuggestions = [...similarQueries, ...aiSuggestions];
      const unique = Array.from(
        new Map(allSuggestions.map(s => [s.query, s])).values()
      );

      return unique.slice(0, limit);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return this.getDefaultSuggestions();
    }
  }

  /**
   * Find similar queries from history
   */
  findSimilarQueries(query, limit) {
    try {
      // Simple text similarity (in production, use embeddings)
      const queries = db.prepare(`
        SELECT DISTINCT query_text, usage_count
        FROM query_suggestions
        WHERE query_text LIKE ?
        ORDER BY usage_count DESC
        LIMIT ?
      `).all(`%${query}%`, limit);

      return queries.map(q => ({
        query: q.query_text,
        type: 'similar',
        score: 0.8,
        usageCount: q.usage_count || 0
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Generate AI-powered suggestions
   */
  async generateAISuggestions(query, limit) {
    try {
      const prompt = `You are a pharmaceutical research assistant. Based on this query: "${query}"

Generate ${limit} related pharmaceutical research questions that would be valuable for drug repurposing analysis. Focus on:
- Drug molecules and repurposing opportunities
- Clinical trials and indications
- Market analysis and competition
- Patent landscapes
- Regulatory pathways

Return only the questions, one per line, without numbering.`;

      const response = await chatCompletion([
        {
          role: 'system',
          content: 'You are a pharmaceutical research assistant. Generate concise, relevant research questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      const suggestions = response
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 10)
        .slice(0, limit)
        .map(query => ({
          query,
          type: 'ai_generated',
          score: 0.9
        }));

      return suggestions;
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return [];
    }
  }

  /**
   * Get default suggestions
   */
  getDefaultSuggestions() {
    return [
      { query: 'Find repurposing opportunities for Metformin', type: 'default', score: 0.5 },
      { query: 'What is the market size for Pembrolizumab?', type: 'default', score: 0.5 },
      { query: 'Check clinical trials for Sitagliptin', type: 'default', score: 0.5 },
      { query: 'Analyze patent landscape for Rivaroxaban', type: 'default', score: 0.5 },
      { query: 'Compare market opportunities in diabetes vs oncology', type: 'default', score: 0.5 }
    ];
  }

  /**
   * Save query for future suggestions
   */
  saveQuery(query, category = null) {
    try {
      db.prepare(`
        INSERT INTO query_suggestions (query_text, category, usage_count)
        VALUES (?, ?, 1)
        ON CONFLICT(query_text) DO UPDATE SET usage_count = usage_count + 1
      `).run(query, category);
    } catch (error) {
      // Table might not exist or query might be too long
      console.error('Error saving query:', error);
    }
  }

  /**
   * Get popular queries
   */
  getPopularQueries(limit = 10) {
    try {
      const queries = db.prepare(`
        SELECT query_text, usage_count, category
        FROM query_suggestions
        ORDER BY usage_count DESC
        LIMIT ?
      `).all(limit);

      return queries.map(q => ({
        query: q.query_text,
        usageCount: q.usage_count || 0,
        category: q.category
      }));
    } catch (error) {
      return [];
    }
  }
}

export default new QuerySuggestionService();
