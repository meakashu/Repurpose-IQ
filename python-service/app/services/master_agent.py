"""
Master Agent for orchestrating worker agents using LangGraph
"""

from typing import Dict, Any, List, Optional
from loguru import logger
from langgraph.graph import StateGraph, END
from app.core.config import settings

# Optional LLM imports (for local model inference)
try:
    from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
    from langchain_community.llms import HuggingFacePipeline
    from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
    HAS_LOCAL_LLM = True
except ImportError:
    HAS_LOCAL_LLM = False
    logger.warning("Local LLM dependencies not available. Using API-based LLMs instead.")
from app.services.workers.literature_agent import LiteratureAgent
from app.services.workers.clinical_agent import ClinicalAgent
from app.services.workers.patent_agent import PatentAgent
from app.services.workers.regulatory_agent import RegulatoryAgent
from app.services.workers.market_agent import MarketAgent
from app.services.workers.internal_agent import InternalAgent
from app.services.vector_store import VectorStore
import asyncio

class AgentState:
    """State for agent orchestration"""
    def __init__(self):
        self.query: str = ""
        self.user_id: str = ""
        self.context: Dict[str, Any] = {}
        self.intent: Optional[str] = None
        self.subtasks: List[str] = []
        self.agent_results: Dict[str, Any] = {}
        self.evidence: List[Dict[str, Any]] = []
        self.confidence_score: float = 0.0
        self.regulatory_readiness: Optional[float] = None
        self.patent_risk: Optional[str] = None
        self.final_response: Optional[str] = None
        self.agents_used: List[str] = []
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "query": self.query,
            "user_id": self.user_id,
            "intent": self.intent,
            "subtasks": self.subtasks,
            "agent_results": self.agent_results,
            "evidence": self.evidence,
            "confidence_score": self.confidence_score,
            "regulatory_readiness": self.regulatory_readiness,
            "patent_risk": self.patent_risk,
            "final_response": self.final_response,
            "agents_used": self.agents_used
        }

class MasterAgent:
    """Master agent for orchestrating drug repurposing analysis"""
    
    def __init__(self):
        self.llm = self._init_llm()
        self.vector_store = VectorStore()
        
        # Initialize worker agents
        self.workers = {
            "literature": LiteratureAgent(),
            "clinical": ClinicalAgent(),
            "patent": PatentAgent(),
            "regulatory": RegulatoryAgent(),
            "market": MarketAgent(),
            "internal": InternalAgent()
        }
        
        # Build orchestration graph
        self.graph = self._build_graph()
    
    def _init_llm(self):
        """Initialize LLM (using HuggingFace open models)"""
        if not HAS_LOCAL_LLM:
            logger.info("Local LLM not available. System will use API-based LLMs via Node.js backend.")
            return None
            
        try:
            tokenizer = AutoTokenizer.from_pretrained(settings.HUGGINGFACE_MODEL)
            model = AutoModelForCausalLM.from_pretrained(
                settings.HUGGINGFACE_MODEL,
                device_map="auto",
                torch_dtype="auto"
            )
            
            pipe = pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                max_length=2048,
                temperature=0.3
            )
            
            return HuggingFacePipeline(pipeline=pipe)
        except Exception as e:
            logger.warning(f"Could not load HuggingFace model: {e}. Using API-based LLMs instead.")
            return None
    
    def _build_graph(self) -> StateGraph:
        """Build LangGraph orchestration graph"""
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("parse_intent", self._parse_intent)
        workflow.add_node("decompose_task", self._decompose_task)
        workflow.add_node("execute_agents", self._execute_agents)
        workflow.add_node("validate_evidence", self._validate_evidence)
        workflow.add_node("synthesize_response", self._synthesize_response)
        workflow.add_node("generate_report", self._generate_report)
        
        # Define edges
        workflow.set_entry_point("parse_intent")
        workflow.add_edge("parse_intent", "decompose_task")
        workflow.add_edge("decompose_task", "execute_agents")
        workflow.add_edge("execute_agents", "validate_evidence")
        workflow.add_edge("validate_evidence", "synthesize_response")
        workflow.add_edge("synthesize_response", "generate_report")
        workflow.add_edge("generate_report", END)
        
        return workflow.compile()
    
    async def process_query(
        self,
        query: str,
        user_id: str,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Process a query through the agent orchestration system"""
        try:
            logger.info(f"Master Agent processing query: {query[:100]}...")
            
            # Initialize state
            state = AgentState()
            state.query = query
            state.user_id = user_id
            state.context = context or {}
            
            # Execute graph
            final_state = await self.graph.ainvoke(state)
            
            # Extract results
            result = {
                "response": final_state.final_response or "Analysis completed.",
                "agents_used": final_state.agents_used,
                "confidence_score": final_state.confidence_score,
                "regulatory_readiness": final_state.regulatory_readiness,
                "patent_risk": final_state.patent_risk,
                "evidence_sources": final_state.evidence,
                "report_id": final_state.context.get("report_id")
            }
            
            logger.info(f"Master Agent completed. Agents used: {final_state.agents_used}")
            return result
            
        except Exception as e:
            logger.error(f"Error in Master Agent: {e}", exc_info=True)
            raise
    
    def _parse_intent(self, state: AgentState) -> AgentState:
        """Parse user intent from natural language query"""
        logger.debug("Parsing user intent...")
        
        # Simple intent parsing (can be enhanced with LLM)
        query_lower = state.query.lower()
        
        if any(word in query_lower for word in ["repurpose", "repurposing", "new indication"]):
            state.intent = "drug_repurposing"
        elif any(word in query_lower for word in ["patent", "ip", "freedom to operate"]):
            state.intent = "patent_analysis"
        elif any(word in query_lower for word in ["regulatory", "fda", "ema", "approval"]):
            state.intent = "regulatory_analysis"
        elif any(word in query_lower for word in ["market", "opportunity", "whitespace"]):
            state.intent = "market_analysis"
        else:
            state.intent = "comprehensive_analysis"
        
        logger.debug(f"Intent parsed: {state.intent}")
        return state
    
    def _decompose_task(self, state: AgentState) -> AgentState:
        """Decompose task into subtasks"""
        logger.debug("Decomposing task into subtasks...")
        
        # Determine which agents to use based on intent
        if state.intent == "drug_repurposing":
            state.subtasks = [
                "literature_review",
                "clinical_trial_analysis",
                "patent_landscape",
                "regulatory_pathway",
                "market_opportunity"
            ]
        elif state.intent == "patent_analysis":
            state.subtasks = ["patent_search", "freedom_to_operate"]
        elif state.intent == "regulatory_analysis":
            state.subtasks = ["regulatory_guidance", "approval_pathway"]
        elif state.intent == "market_analysis":
            state.subtasks = ["market_size", "competition_analysis"]
        else:
            # Comprehensive analysis - use all agents
            state.subtasks = [
                "literature_review",
                "clinical_trial_analysis",
                "patent_landscape",
                "regulatory_pathway",
                "market_opportunity",
                "internal_knowledge"
            ]
        
        logger.debug(f"Subtasks: {state.subtasks}")
        return state
    
    async def _execute_agents(self, state: AgentState) -> AgentState:
        """Execute worker agents in parallel"""
        logger.debug("Executing worker agents...")
        
        # Map subtasks to agents
        agent_mapping = {
            "literature_review": "literature",
            "clinical_trial_analysis": "clinical",
            "patent_landscape": "patent",
            "patent_search": "patent",
            "freedom_to_operate": "patent",
            "regulatory_pathway": "regulatory",
            "regulatory_guidance": "regulatory",
            "approval_pathway": "regulatory",
            "market_opportunity": "market",
            "market_size": "market",
            "competition_analysis": "market",
            "internal_knowledge": "internal"
        }
        
        # Execute agents in parallel
        tasks = []
        for subtask in state.subtasks:
            agent_name = agent_mapping.get(subtask)
            if agent_name and agent_name in self.workers:
                tasks.append(self._run_agent(agent_name, state.query, state.context))
        
        # Wait for all agents to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Collect results
        for i, result in enumerate(results):
            if not isinstance(result, Exception):
                agent_name = list(agent_mapping.values())[i]
                state.agent_results[agent_name] = result
                state.agents_used.append(agent_name)
                if result.get("evidence"):
                    state.evidence.extend(result["evidence"])
        
        logger.debug(f"Agents executed. Results from {len(state.agent_results)} agents")
        return state
    
    async def _run_agent(self, agent_name: str, query: str, context: Dict) -> Dict[str, Any]:
        """Run a single agent"""
        try:
            agent = self.workers[agent_name]
            result = await agent.process(query, context)
            return result
        except Exception as e:
            logger.error(f"Error in {agent_name} agent: {e}")
            return {"error": str(e), "evidence": []}
    
    def _validate_evidence(self, state: AgentState) -> AgentState:
        """Cross-validate evidence from multiple sources"""
        logger.debug("Validating evidence...")
        
        # Calculate confidence score based on evidence quality
        evidence_count = len(state.evidence)
        agent_count = len(state.agents_used)
        
        # Simple confidence scoring (can be enhanced)
        if evidence_count > 10 and agent_count >= 3:
            state.confidence_score = 0.9
        elif evidence_count > 5 and agent_count >= 2:
            state.confidence_score = 0.7
        elif evidence_count > 0:
            state.confidence_score = 0.5
        else:
            state.confidence_score = 0.3
        
        # Assess patent risk
        patent_results = state.agent_results.get("patent", {})
        if patent_results.get("active_patents", 0) > 0:
            state.patent_risk = "high"
        elif patent_results.get("expiring_soon", False):
            state.patent_risk = "medium"
        else:
            state.patent_risk = "low"
        
        # Assess regulatory readiness
        regulatory_results = state.agent_results.get("regulatory", {})
        state.regulatory_readiness = regulatory_results.get("readiness_score", 0.5)
        
        logger.debug(f"Evidence validated. Confidence: {state.confidence_score}")
        return state
    
    def _synthesize_response(self, state: AgentState) -> AgentState:
        """Synthesize final response from all agent results"""
        logger.debug("Synthesizing response...")
        
        # Build comprehensive response
        response_parts = []
        
        # Executive summary
        response_parts.append("## Executive Summary\n")
        response_parts.append(f"Analysis of '{state.query}' completed using {len(state.agents_used)} specialized agents.\n")
        
        # Key findings from each agent
        for agent_name, result in state.agent_results.items():
            if "error" not in result:
                response_parts.append(f"\n### {agent_name.title()} Agent Findings\n")
                response_parts.append(result.get("summary", "No summary available."))
        
        # Strategic analysis
        response_parts.append("\n### Strategic Analysis\n")
        response_parts.append(f"Confidence Score: {state.confidence_score:.1%}\n")
        response_parts.append(f"Patent Risk: {state.patent_risk}\n")
        if state.regulatory_readiness:
            response_parts.append(f"Regulatory Readiness: {state.regulatory_readiness:.1%}\n")
        
        # Recommendations
        response_parts.append("\n### Recommendations\n")
        response_parts.append("Based on the comprehensive analysis, consider the following next steps:\n")
        response_parts.append("- Review evidence sources for detailed information\n")
        response_parts.append("- Conduct deeper patent analysis if patent risk is high\n")
        response_parts.append("- Consult regulatory experts for approval pathway\n")
        
        state.final_response = "\n".join(response_parts)
        logger.debug("Response synthesized")
        return state
    
    def _generate_report(self, state: AgentState) -> AgentState:
        """Generate structured report"""
        logger.debug("Generating report...")
        # Report generation is handled by GovernanceService
        # This is a placeholder
        return state

