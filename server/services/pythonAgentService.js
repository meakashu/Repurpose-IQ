/**
 * Python Agent Service Integration
 * Connects Node.js backend to Python agent orchestration service
 */

import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

class PythonAgentService {
  constructor() {
    this.baseURL = `${PYTHON_SERVICE_URL}/api/agents`;
    this.timeout = 300000; // 5 minutes for complex queries
  }

  /**
   * Process query through Python agent service
   * @param {string} query - User query
   * @param {string} userId - User ID
   * @param {string} conversationId - Optional conversation ID
   * @param {Object} context - Optional context
   * @returns {Promise<Object>} Agent response
   */
  async processQuery(query, userId, conversationId = null, context = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/process`,
        {
          query,
          user_id: userId,
          conversation_id: conversationId,
          context
        },
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        response: response.data.response,
        agents: response.data.agents_used,
        confidenceScore: response.data.confidence_score,
        regulatoryReadiness: response.data.regulatory_readiness,
        patentRisk: response.data.patent_risk,
        evidenceSources: response.data.evidence_sources,
        reportId: response.data.report_id,
        conversationId: response.data.conversation_id || conversationId
      };
    } catch (error) {
      console.error('Python Agent Service Error:', error.message);
      
      // Fallback to existing Node.js agents if Python service is unavailable
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new Error('Python agent service unavailable. Falling back to Node.js agents.');
      }
      
      throw error;
    }
  }

  /**
   * Get query status
   * @param {string} auditId - Audit ID
   * @returns {Promise<Object>} Query status
   */
  async getQueryStatus(auditId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/status/${auditId}`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting query status:', error.message);
      throw error;
    }
  }

  /**
   * Get audit trail
   * @param {string} auditId - Audit ID
   * @returns {Promise<Object>} Audit trail
   */
  async getAuditTrail(auditId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/audit/${auditId}`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting audit trail:', error.message);
      throw error;
    }
  }

  /**
   * Check if Python service is available
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    try {
      const response = await axios.get(
        `${PYTHON_SERVICE_URL}/api/health`,
        { timeout: 5000 }
      );
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

export default new PythonAgentService();

