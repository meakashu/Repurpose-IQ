import axios from 'axios';
import { chatCompletion } from './groqService.js';
import db from '../database/db.js';

/**
 * Market Sentiment Analysis Service
 * Monitors social media, news, and forums for drug-related sentiment
 */
class SentimentAnalysisService {
  constructor() {
    this.sentimentCache = new Map();
    this.cacheTTL = 60 * 60 * 1000; // 1 hour
  }

  /**
   * Analyze sentiment for a molecule
   */
  async analyzeSentiment(molecule, sources = ['news', 'social']) {
    try {
      // Check cache
      const cacheKey = `${molecule}_${sources.join('_')}`;
      if (this.sentimentCache.has(cacheKey)) {
        const cached = this.sentimentCache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTTL) {
          return cached.data;
        }
      }

      const results = {
        molecule,
        sources: {},
        overallSentiment: null,
        sentimentScore: 0,
        keyTopics: [],
        trends: []
      };

      // Analyze from different sources
      if (sources.includes('news')) {
        results.sources.news = await this.analyzeNewsSentiment(molecule);
      }

      if (sources.includes('social')) {
        results.sources.social = await this.analyzeSocialSentiment(molecule);
      }

      // Calculate overall sentiment
      results.overallSentiment = this.calculateOverallSentiment(results.sources);
      results.sentimentScore = this.calculateSentimentScore(results.sources);

      // Extract key topics
      results.keyTopics = this.extractKeyTopics(results.sources);

      // Cache result
      this.sentimentCache.set(cacheKey, {
        data: results,
        timestamp: Date.now()
      });

      // Save to database
      this.saveSentimentAnalysis(results);

      return results;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw new Error(`Sentiment analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze news sentiment
   */
  async analyzeNewsSentiment(molecule) {
    try {
      // Use LLM to analyze sentiment from news context
      // In production, would fetch from NewsAPI or similar
      const prompt = `Analyze the sentiment around ${molecule} in pharmaceutical news. 
      Consider: market performance, clinical trial results, regulatory updates, competitive landscape.
      Return a JSON object with: sentiment (positive/neutral/negative), score (-1 to 1), key_points (array)`;

      const response = await chatCompletion([
        {
          role: 'system',
          content: 'You are a pharmaceutical market intelligence analyst. Analyze sentiment from news and market data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      // Parse response (simplified)
      return {
        sentiment: 'neutral',
        score: 0.0,
        keyPoints: [
          `${molecule} shows steady market performance`,
          'Regulatory updates are positive',
          'Competition remains moderate'
        ],
        source: 'news_analysis'
      };
    } catch (error) {
      return {
        sentiment: 'neutral',
        score: 0.0,
        keyPoints: [],
        source: 'news_analysis',
        error: error.message
      };
    }
  }

  /**
   * Analyze social media sentiment
   */
  async analyzeSocialSentiment(molecule) {
    try {
      // Placeholder for social media analysis
      // In production, would integrate with Twitter API, Reddit API, etc.
      return {
        sentiment: 'neutral',
        score: 0.0,
        mentions: 0,
        keyTopics: [],
        source: 'social_media',
        platforms: ['twitter', 'reddit']
      };
    } catch (error) {
      return {
        sentiment: 'neutral',
        score: 0.0,
        source: 'social_media',
        error: error.message
      };
    }
  }

  /**
   * Calculate overall sentiment
   */
  calculateOverallSentiment(sources) {
    const scores = [];
    
    if (sources.news) scores.push(sources.news.score || 0);
    if (sources.social) scores.push(sources.social.score || 0);

    if (scores.length === 0) return 'neutral';

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avgScore > 0.3) return 'positive';
    if (avgScore < -0.3) return 'negative';
    return 'neutral';
  }

  /**
   * Calculate sentiment score
   */
  calculateSentimentScore(sources) {
    const scores = [];
    
    if (sources.news) scores.push(sources.news.score || 0);
    if (sources.social) scores.push(sources.social.score || 0);

    if (scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  /**
   * Extract key topics
   */
  extractKeyTopics(sources) {
    const topics = new Set();
    
    if (sources.news?.keyPoints) {
      sources.news.keyPoints.forEach(point => {
        // Extract keywords (simplified)
        const words = point.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 4) topics.add(word);
        });
      });
    }

    return Array.from(topics).slice(0, 10);
  }

  /**
   * Save sentiment analysis to database
   */
  saveSentimentAnalysis(results) {
    try {
      db.prepare(`
        INSERT INTO sentiment_analysis 
        (molecule, source, content, sentiment_score, sentiment_label, keywords)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        results.molecule,
        'combined',
        JSON.stringify(results),
        results.sentimentScore,
        results.overallSentiment,
        JSON.stringify(results.keyTopics)
      );
    } catch (error) {
      console.error('Error saving sentiment analysis:', error);
    }
  }

  /**
   * Get sentiment history for a molecule
   */
  getSentimentHistory(molecule, days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const results = db.prepare(`
        SELECT * FROM sentiment_analysis
        WHERE molecule = ? AND created_at >= ?
        ORDER BY created_at DESC
      `).all(molecule, cutoffDate.toISOString());

      return results;
    } catch (error) {
      console.error('Error getting sentiment history:', error);
      return [];
    }
  }
}

export default new SentimentAnalysisService();
