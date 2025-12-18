import express from 'express';
import { chatCompletion } from '../services/groqService.js';
import { MasterAgent } from '../agents/masterAgent.js';
import { RateLimiter } from '../services/rateLimiter.js';
import pythonAgentService from '../services/pythonAgentService.js';

const router = express.Router();

// Middleware to verify auth
import jwt from 'jsonwebtoken';

const verifyAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper to detect follow-up questions
function isFollowUpQuestion(query, previousMessages) {
  if (!previousMessages || previousMessages.length === 0) return false;
  
  const followUpPatterns = [
    /^(what about|tell me more|how about|what is|can you|show me|explain)/i,
    /^(and|also|additionally|furthermore|moreover)/i,
    /^(what|how|why|when|where|which|who).*\?/i
  ];
  
  const queryLower = query.toLowerCase();
  const isShort = query.split(' ').length < 5;
  
  return followUpPatterns.some(pattern => pattern.test(query)) || 
         (isShort && previousMessages.length > 0);
}

// Process query
router.post('/', verifyAuth, async (req, res) => {
  try {
    const { query, conversationId } = req.body;
    const userId = req.user.userId;
    
    // Get conversation context for follow-up questions
    let conversationContext = null;
    let isFollowUp = false;
    
    if (conversationId) {
      try {
        const { ConversationService } = await import('../services/conversationService.js');
        const conversation = ConversationService.getConversation(conversationId);
        if (conversation && conversation.messages) {
          conversationContext = conversation.messages.slice(-5); // Last 5 messages
          
          // Detect if this is a follow-up question
          isFollowUp = isFollowUpQuestion(query, conversationContext);
          
          if (isFollowUp) {
            console.log('Follow-up question detected, enriching query with context');
          }
        }
      } catch (error) {
        console.warn('Failed to load conversation context:', error);
      }
    }

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Check rate limits
    const userRole = req.user.role || 'analyst';
    const groqLimit = RateLimiter.checkLimit('groq', userId, userRole);
    if (!groqLimit.allowed) {
      return res.status(429).json({ 
        error: `Rate limit exceeded. Used ${groqLimit.userUsed}/${groqLimit.userLimit} today.` 
      });
    }

    // Try Python agent service first, fallback to Node.js agents
    let result;
    const usePythonService = process.env.USE_PYTHON_AGENTS !== 'false';
    
    if (usePythonService && await pythonAgentService.isAvailable()) {
      try {
        // Use Python agent service for comprehensive analysis
        result = await pythonAgentService.processQuery(query, userId, conversationId);
        
        res.json({
          response: result.response,
          agents: result.agents,
          conversationId: result.conversationId || conversationId,
          confidenceScore: result.confidenceScore,
          regulatoryReadiness: result.regulatoryReadiness,
          patentRisk: result.patentRisk,
          evidenceSources: result.evidenceSources,
          reportId: result.reportId,
          service: 'python'
        });
        return;
      } catch (error) {
        console.warn('Python service failed, falling back to Node.js agents:', error.message);
        // Fall through to Node.js agents
      }
    }
    
    // Fallback to Node.js Master Agent
    try {
      console.log(`[QueryRoute] Processing query via Master Agent`);
      const masterAgent = new MasterAgent();
      result = await masterAgent.processQuery(query, userId, conversationContext, conversationId);
      console.log(`[QueryRoute] ✓ Query processed successfully`);
      
      // Record API usage
      RateLimiter.recordUsage('groq', userId);

      res.json({
        response: result.response,
        agents: result.agents,
        conversationId: result.conversationId || conversationId,
        service: 'nodejs',
        agentOutputs: result.agentOutputs,
        masterAgentFlow: result.masterAgentFlow,
        strategicReasoning: result.strategicReasoning,
        chartData: result.chartData || null, // Include chart data
        isFollowUp: isFollowUp || false
      });
    } catch (agentError) {
      console.error('Master Agent error:', agentError);
      // Provide a helpful error response
      res.status(500).json({ 
        error: agentError.message || 'Query processing failed',
        details: 'The system encountered an error while processing your query. Please try rephrasing or contact support.',
        suggestion: 'Try asking: "Find repurposing opportunities for Metformin" or "Check patent status for Pembrolizumab"'
      });
    }
  } catch (error) {
    console.error('Query route error:', error);
    res.status(500).json({ 
      error: error.message || 'Query processing failed',
      details: 'An unexpected error occurred. Please try again.'
    });
  }
});

// Stream query (for real-time responses)
router.post('/stream', verifyAuth, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.userId;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const masterAgent = new MasterAgent();
    await masterAgent.processQueryStream(query, userId, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

