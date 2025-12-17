import { chatCompletion } from '../services/groqService.js';
import { MarketAgent } from './marketAgent.js';
import { PatentAgent } from './patentAgent.js';
import { ClinicalAgent } from './clinicalAgent.js';
import { SocialAgent } from './socialAgent.js';
import { CompetitorAgent } from './competitorAgent.js';
import { WebAgent } from './webAgent.js';
import { EXIMAgent } from './eximAgent.js';
import { InternalAgent } from './internalAgent.js';
import db from '../database/db.js';
import { ConversationService } from '../services/conversationService.js';

export class MasterAgent {
  constructor() {
    this.agents = {
      market: new MarketAgent(),
      patent: new PatentAgent(),
      clinical: new ClinicalAgent(),
      social: new SocialAgent(),
      competitor: new CompetitorAgent(),
      web: new WebAgent(),
      exim: new EXIMAgent(),
      internal: new InternalAgent()
    };
  }

  isPharmaceuticalQuery(query) {
    // Validate that the query is related to pharmaceuticals, drugs, or medical research
    const pharmaKeywords = [
      // Drugs and molecules
      'drug', 'molecule', 'compound', 'medication', 'medicine', 'pharmaceutical', 'pharma',
      // Medical terms
      'disease', 'indication', 'therapy', 'treatment', 'clinical', 'trial', 'patient',
      // Business terms
      'market', 'patent', 'cagr', 'competition', 'generic', 'brand', 'launch',
      // Research terms
      'repurpose', 'repurposing', 'formulation', 'dosage', 'efficacy', 'safety',
      // Specific molecules (common ones)
      'metformin', 'sitagliptin', 'pembrolizumab', 'rivaroxaban', 'atorvastatin',
      'lisinopril', 'amlodipine', 'omeprazole', 'aspirin', 'ibuprofen',
      // Therapy areas
      'oncology', 'diabetes', 'cardiovascular', 'respiratory', 'neurology',
      'psychiatry', 'dermatology', 'gastroenterology', 'rheumatology',
      // Regulatory
      'fda', 'ema', 'regulatory', 'approval', 'ind', 'nda', 'pivotal',
      // Market intelligence
      'iqvia', 'market size', 'whitespace', 'unmet need', 'patient burden',
      // Trade
      'exim', 'import', 'export', 'trade', 'supply chain', 'sourcing'
    ];

    const queryLower = query.toLowerCase();

    // Check if query contains pharmaceutical-related keywords
    const hasPharmaKeyword = pharmaKeywords.some(keyword => queryLower.includes(keyword));

    // Also check for common non-pharma topics to reject
    const nonPharmaTopics = [
      'weather', 'sports', 'cooking', 'recipe', 'movie', 'music', 'game',
      'joke', 'jokes', 'funny', 'entertainment', 'news', 'politics',
      'history', 'geography', 'math', 'physics', 'chemistry (general)',
      'programming', 'coding', 'software', 'technology (general)',
      'travel', 'vacation', 'hotel', 'restaurant'
    ];

    const hasNonPharmaTopic = nonPharmaTopics.some(topic => queryLower.includes(topic));

    // Reject if it's clearly not pharmaceutical-related
    if (hasNonPharmaTopic && !hasPharmaKeyword) {
      return false;
    }

    // Accept if it has pharmaceutical keywords
    return hasPharmaKeyword;
  }

  async processQuery(query, userId) {
    const startTime = Date.now();
    const queryLower = query.toLowerCase();
    let agentResults = {};
    let agentsUsed = [];

    // Validate query is pharmaceutical-related
    if (!this.isPharmaceuticalQuery(query)) {
      const errorMessage = `This system is specialized for pharmaceutical research and regulatory decision support. 

Your query doesn't appear to be related to pharmaceutical or life sciences domain.

Please reframe your question within a drug development or clinical context, such as:
- Drug repurposing & lifecycle management
- Approved molecules, new indications, dosage forms
- Clinical trials, medical literature & evidence synthesis
- Regulatory science (FDA, EMA, CDSCO, ICH, WHO)
- Patents, exclusivity & freedom-to-operate
- Pharmacology, safety, efficacy, RWE
- Market access & unmet medical needs

Examples:
- "Find repurposing opportunities for Metformin"
- "What is the regulatory pathway for a new indication?"
- "Assess patent landscape for cardiovascular drugs"
- "Evaluate clinical evidence for drug X in indication Y"`;

      this.trackQuery(userId, query, [], Date.now() - startTime, false, 'Non-pharmaceutical query');
      throw new Error(errorMessage);
    }

    try {
      // Step 1: Route to appropriate agent(s) and collect results with error handling
      if (this.shouldUseMarketAgent(queryLower)) {
        try {
          const result = await this.agents.market.process(query);
          agentResults.market = result;
          agentsUsed.push('Market');
        } catch (error) {
          console.error('Market Agent error:', error);
        }
      }

      if (this.shouldUsePatentAgent(queryLower)) {
        try {
          const result = await this.agents.patent.process(query);
          agentResults.patent = result;
          agentsUsed.push('Patent');
        } catch (error) {
          console.error('Patent Agent error:', error);
        }
      }

      if (this.shouldUseClinicalAgent(queryLower)) {
        try {
          const result = await this.agents.clinical.process(query);
          agentResults.clinical = result;
          agentsUsed.push('Clinical');
        } catch (error) {
          console.error('Clinical Agent error:', error);
        }
      }

      if (this.shouldUseSocialAgent(queryLower)) {
        try {
          const result = await this.agents.social.process(query);
          agentResults.social = result;
          agentsUsed.push('Social');
        } catch (error) {
          console.error('Social Agent error:', error);
        }
      }

      if (this.shouldUseCompetitorAgent(queryLower)) {
        try {
          const result = await this.agents.competitor.process(query);
          agentResults.competitor = result;
          agentsUsed.push('Competitor');
        } catch (error) {
          console.error('Competitor Agent error:', error);
        }
      }

      if (this.shouldUseEXIMAgent(queryLower)) {
        try {
          const result = await this.agents.exim.process(query);
          agentResults.exim = result;
          agentsUsed.push('EXIM');
        } catch (error) {
          console.error('EXIM Agent error:', error);
        }
      }

      if (this.shouldUseInternalAgent(queryLower)) {
        try {
          const result = await this.agents.internal.process(query);
          agentResults.internal = result;
          agentsUsed.push('Internal');
        } catch (error) {
          console.error('Internal Agent error:', error);
        }
      }

      // Always try web search for additional context
      try {
        const webResult = await this.agents.web.search(query);
        if (webResult) {
          agentResults.web = webResult;
          agentsUsed.push('Web');
        }
      } catch (error) {
        console.error('Web Agent error:', error);
      }

      // Step 2: For end-to-end journey queries, ensure comprehensive analysis
      if (this.isEndToEndQuery(queryLower)) {
        // Ensure we get data from all relevant agents for complete analysis
        if (!agentResults.market) {
          try {
            agentResults.market = await this.agents.market.process(query);
            agentsUsed.push('Market');
          } catch (error) {
            console.error('Market Agent error in end-to-end:', error);
          }
        }
        if (!agentResults.patent) {
          try {
            agentResults.patent = await this.agents.patent.process(query);
            agentsUsed.push('Patent');
          } catch (error) {
            console.error('Patent Agent error in end-to-end:', error);
          }
        }
        if (!agentResults.clinical) {
          try {
            agentResults.clinical = await this.agents.clinical.process(query);
            agentsUsed.push('Clinical');
          } catch (error) {
            console.error('Clinical Agent error in end-to-end:', error);
          }
        }
        if (!agentResults.web) {
          try {
            const webRes = await this.agents.web.search(query);
            if (webRes) {
              agentResults.web = webRes;
              agentsUsed.push('Web');
            }
          } catch (error) {
            console.error('Web Agent error in end-to-end:', error);
          }
        }
      }

      // Step 3: Synthesize all agent results into coherent response
      let response = '';
      if (Object.keys(agentResults).length > 0) {
        try {
          response = await this.synthesizeResponse(query, agentResults, agentsUsed);
        } catch (error) {
          console.error('Synthesis error:', error);
          // Fallback: combine results manually
          response = this.combineResultsManually(query, agentResults, agentsUsed);
        }
      } else {
        // If no specific agent matched, use general AI but only for pharmaceutical queries
        try {
          response = await this.generateAIResponse(query, agentResults.web);
          agentsUsed = ['AI Assistant', ...(agentResults.web ? ['Web Search'] : [])];
        } catch (error) {
          console.error('AI Response error:', error);
          response = `I understand you're asking about: "${query}". However, I'm a Pharmaceutical Intelligence Platform specialized in drug repurposing, market analysis, clinical trials, and patents. 

Please rephrase your question to focus on:
- Pharmaceutical molecules and drugs
- Market intelligence and competitive analysis
- Clinical trials and regulatory information
- Patent landscapes
- Drug repurposing opportunities
- Trade and supply chain data

If your question is pharmaceutical-related but I'm having trouble processing it, please try being more specific or contact support.`;
        }
      }

      // Track query
      const responseTime = Date.now() - startTime;
      this.trackQuery(userId, query, agentsUsed, responseTime, true);

      // Save to conversation
      let conversationId = null;
      if (userId) {
        try {
          conversationId = ConversationService.createConversation(userId);
          ConversationService.addMessage(conversationId, 'user', query);
          ConversationService.addMessage(conversationId, 'assistant', response, agentsUsed);
        } catch (error) {
          console.error('Error saving conversation:', error);
        }
      }

      return {
        response,
        agents: agentsUsed,
        conversationId
      };
    } catch (error) {
      this.trackQuery(userId, query, [], Date.now() - startTime, false, error.message);
      throw error;
    }
  }

  async processQueryStream(query, userId, onChunk) {
    // Similar to processQuery but streams response
    const result = await this.processQuery(query, userId);

    // Stream the response word by word
    const words = result.response.split(' ');
    for (const word of words) {
      onChunk(word + ' ');
      await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for streaming effect
    }
  }

  shouldUseMarketAgent(query) {
    return /market|whitespace|competition|cagr|market size|growth rate|unmet need|opportunity/i.test(query);
  }

  shouldUsePatentAgent(query) {
    return /patent|expiry|fto|freedom to operate|ip|intellectual property|filed/i.test(query);
  }

  shouldUseClinicalAgent(query) {
    return /trial|clinical|repurpos|pipeline|phase|indication|disease|other diseases/i.test(query);
  }

  shouldUseSocialAgent(query) {
    return /patient|complaint|sentiment|feedback|voice/i.test(query);
  }

  shouldUseCompetitorAgent(query) {
    return /competitor|war game|simulate|launch|threat/i.test(query);
  }

  shouldUseEXIMAgent(query) {
    return /exim|trade|import|export|supply chain|sourcing/i.test(query);
  }

  shouldUseInternalAgent(query) {
    return /internal|document|strategy|corporate|knowledge base/i.test(query);
  }

  isEndToEndQuery(query) {
    // Detect queries that require full end-to-end analysis
    return /find.*molecule|identify.*unmet|check.*trial|explore.*disease|determine.*patent|product story|innovative product/i.test(query);
  }

  async synthesizeResponse(query, agentResults, agentsUsed) {
    // Build comprehensive context from all agent results
    let context = `ORIGINAL QUERY: ${query}\n\n`;
    context += `AGENTS CONSULTED: ${agentsUsed.join(', ')}\n\n`;
    context += `AGENT FINDINGS:\n`;
    context += `${'='.repeat(50)}\n\n`;

    // CRITICAL FIX: Truncate agent results to prevent token overflow
    Object.entries(agentResults).forEach(([agent, result]) => {
      // Limit each agent result to 500 characters max
      const truncatedResult = result.length > 500
        ? result.substring(0, 500) + '... (truncated for brevity)'
        : result;
      context += `[${agent.toUpperCase()} AGENT]\n${truncatedResult}\n\n`;
    });

    const synthesisPrompt = `You are "RepurposeIQ", an enterprise-grade Agentic AI assistant for pharmaceutical and life sciences domain.

DOMAIN BOUNDARY (HARD RULE):
- ONLY respond to queries related to: drug repurposing, approved molecules, clinical trials, regulatory science (FDA/EMA/CDSCO), patents, pharmacology, market access, unmet medical needs
- If query is outside scope: Politely decline and suggest pharma-relevant reframing

ADAPTIVE RESPONSE INTELLIGENCE:
Before answering, classify the query as:
- Conceptual (What/Why) → Expert explanation format
- Process-oriented (How/Workflow) → Step-by-step or flow diagram
- Decision-support (Should we/Compare) → Comparison matrix or scorecard
- Evidence synthesis (What does literature say?) → Structured evidence summary
- Regulatory risk (Can this be approved?) → Risk assessment format

DO NOT use the same structure every time. Choose the MOST NATURAL format for the question. Avoid forced headings and template-like repetition.

${context}

TASK: Synthesize findings into a professional pharmaceutical intelligence response.

VISUAL THINKING (SMART USE):
- Use tables WHEN comparing data or showing metrics
- Use flow diagrams WHEN explaining processes
- Use decision trees WHEN evaluating options
- NOT decorative - only when clarity improves

PROFESSIONAL DEPTH (MANDATORY):
- Be precise and non-speculative
- Reflect real pharma workflows
- Use cautious language: "Available evidence suggests...", "Regulatory risk remains moderate due to..."
- Clearly separate evidence vs hypothesis

GOVERNANCE & TRUST:
- State confidence level (High/Medium/Low) when appropriate
- Mention data source categories (journals, trials, labels, databases)
- Add light disclaimer if needed: "This assessment supports early-stage research and does not replace regulatory or clinical review."

FAIL-SAFE MODE:
- If information insufficient, say so clearly
- Ask ONLY pharma-relevant follow-up questions
- Provide structured exploration path instead of guessing

OUTPUT FLEXIBILITY:
Choose format that BEST serves the question:
- Short expert explanations for simple queries
- Tables for comparisons or data
- Flow diagrams for processes
- Feasibility scorecards for decisions
- Risk summaries for regulatory queries

AGENTIC BEHAVIOR:
You may reference agents when useful (Literature Agent, Clinical Evidence Agent, Regulatory Agent, Market & IP Agent), but do NOT mention agents unnecessarily.

Respond as a senior pharmaceutical domain expert, not as a generic chatbot.`;

    const messages = [
      {
        role: 'system',
        content: `You are "PharmaRepurpose AI", an enterprise-grade Agentic AI assistant for pharmaceutical and life sciences domain.

DOMAIN BOUNDARY (HARD RULE):
You must ONLY respond to queries related to:
- Drug repurposing & lifecycle management
- Approved molecules, new indications, dosage forms
- Clinical trials, medical literature & evidence synthesis
- Regulatory science (FDA, EMA, CDSCO, ICH, WHO)
- Patents, exclusivity & freedom-to-operate
- Pharmacology, safety, efficacy, RWE
- Market access & unmet medical needs

If a query is outside this scope:
Politely decline: "This system is specialized for pharmaceutical research and regulatory decision support. Please reframe your question within a drug development or clinical context."

ADAPTIVE RESPONSE INTELLIGENCE:
Before answering, silently classify the query as:
- Conceptual (What/Why) → Expert explanation
- Process-oriented (How/Workflow) → Step-by-step or flow
- Decision-support (Should we/Compare) → Comparison or scorecard
- Evidence synthesis (What does literature say?) → Structured evidence
- Regulatory risk (Can this be approved?) → Risk assessment

DO NOT use the same structure every time. Choose the MOST NATURAL format. Avoid forced headings and template-like repetition.

VISUAL THINKING (SMART USE):
Use diagrams, flows, or tables WHEN they improve clarity:
- ASCII workflows for processes
- Decision trees for evaluations
- Comparison matrices for decisions
- Tables for numerical data

NOT decorative diagrams or same style every answer.

PROFESSIONAL DEPTH (MANDATORY):
- Be precise and non-speculative
- Reflect real pharma workflows
- Avoid exaggerated AI claims
- Use cautious language: "Available evidence suggests...", "Regulatory risk remains moderate due to..."
- Clearly separate evidence vs hypothesis

GOVERNANCE & TRUST:
- State confidence level (High/Medium/Low) when appropriate
- Mention data source categories (journals, trials, labels, databases)
- Add light disclaimer: "This assessment supports early-stage research and does not replace regulatory or clinical review."

FAIL-SAFE MODE:
If information is insufficient:
- Say so clearly
- Ask ONLY pharma-relevant follow-up questions
- Provide structured exploration path instead of guessing

OUTPUT FLEXIBILITY:
Choose format that BEST serves the question - not a fixed template.

AGENTIC BEHAVIOR:
You operate as a coordinated Agentic system. Reference agents (Literature Agent, Clinical Evidence Agent, Regulatory Agent, Market & IP Agent) when useful, but do NOT mention agents unnecessarily.

Respond as a senior pharmaceutical domain expert, not as a generic chatbot.`
      },
      {
        role: 'user',
        content: synthesisPrompt
      }
    ];

    return await chatCompletion(messages);
  }

  async generateAIResponse(query, webContext) {
    // Double-check query is pharmaceutical-related
    if (!this.isPharmaceuticalQuery(query)) {
      return `This system is specialized for pharmaceutical research and regulatory decision support. 

Please reframe your question within a drug development or clinical context, focusing on:
- Drug repurposing & lifecycle management
- Clinical trials & evidence synthesis
- Regulatory science (FDA, EMA, CDSCO)
- Patents & freedom-to-operate
- Pharmacology, safety, efficacy
- Market access & unmet medical needs`;
    }

    const messages = [
      {
        role: 'system',
        content: `You are "PharmaRepurpose AI", an enterprise-grade Agentic AI assistant for pharmaceutical and life sciences domain.

DOMAIN BOUNDARY (HARD RULE):
You must ONLY respond to queries related to:
- Drug repurposing & lifecycle management
- Approved molecules, new indications, dosage forms
- Clinical trials, medical literature & evidence synthesis
- Regulatory science (FDA, EMA, CDSCO, ICH, WHO)
- Patents, exclusivity & freedom-to-operate
- Pharmacology, safety, efficacy, RWE
- Market access & unmet medical needs

If a query is outside this scope:
Politely decline: "This system is specialized for pharmaceutical research and regulatory decision support. Please reframe your question within a drug development or clinical context."

ADAPTIVE RESPONSE INTELLIGENCE:
Classify query type and choose MOST NATURAL format:
- Conceptual → Expert explanation
- Process-oriented → Step-by-step or flow diagram
- Decision-support → Comparison matrix or scorecard
- Evidence synthesis → Structured evidence summary
- Regulatory risk → Risk assessment format

DO NOT use template-like repetition. Avoid forced headings.

VISUAL THINKING:
Use tables/diagrams WHEN they improve clarity - not decoratively.

PROFESSIONAL DEPTH:
- Precise and non-speculative
- Reflect real pharma workflows
- Use cautious language: "Available evidence suggests...", "Regulatory risk remains moderate..."
- Separate evidence vs hypothesis

GOVERNANCE & TRUST:
- State confidence level when appropriate
- Mention data sources
- Light disclaimer: "This assessment supports early-stage research and does not replace regulatory or clinical review."

FAIL-SAFE MODE:
If information insufficient, say so clearly and provide structured exploration path.

Respond as a senior pharmaceutical domain expert, not as a generic chatbot.`
      }
    ];

    if (webContext) {
      messages.push({
        role: 'user',
        content: `Pharmaceutical Question: ${query}\n\nContext from web search (pharmaceutical sources only): ${webContext}\n\nPlease provide a comprehensive pharmaceutical intelligence answer based on the context. If the context is not pharmaceutical-related, indicate that you need pharmaceutical-specific information.`
      });
    } else {
      messages.push({
        role: 'user',
        content: `Pharmaceutical Question: ${query}\n\nPlease provide a comprehensive answer focused on pharmaceutical intelligence, drug development, market analysis, or related pharmaceutical topics.`
      });
    }

    return await chatCompletion(messages);
  }

  combineResultsManually(query, agentResults, agentsUsed) {
    // Fallback method to combine results when LLM synthesis fails
    let response = `## Pharmaceutical Intelligence Analysis\n\n`;
    response += `**Query:** ${query}\n\n`;
    response += `**Agents Consulted:** ${agentsUsed.join(', ')}\n\n`;

    Object.entries(agentResults).forEach(([agent, result]) => {
      response += `### ${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent Findings\n`;
      response += `${result}\n\n`;
    });

    response += `### Summary\n`;
    response += `Based on the pharmaceutical intelligence analysis from ${agentsUsed.length} specialized agent(s), the above findings provide comprehensive insights related to your pharmaceutical query. `;
    response += `All information is focused on pharmaceutical intelligence: drug molecules, market analysis, clinical trials, patents, and pharmaceutical strategy.`;

    return response;
  }

  trackQuery(userId, queryText, agentsUsed, responseTime, success, errorMessage = null) {
    try {
      db.prepare(`
        INSERT INTO query_tracking (user_id, query_text, agents_used, response_time_ms, success, error_message)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        queryText,
        JSON.stringify(agentsUsed),
        responseTime,
        success ? 1 : 0,
        errorMessage
      );
    } catch (error) {
      console.error('Error tracking query:', error);
    }
  }
}

