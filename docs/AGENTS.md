# 🤖 RepurposeIQ Agent Architecture

This document provides detailed information about the multi-agent system architecture, agent design patterns, and orchestration workflows.

---

## Table of Contents

1. [Overview](#overview)
2. [Master Agent Orchestrator](#master-agent-orchestrator)
3. [Specialized Agents](#specialized-agents)
4. [LangGraph Workflows](#langgraph-workflows)
5. [Agent Communication](#agent-communication)
6. [RAG Implementation](#rag-implementation)
7. [Agent Development Guide](#agent-development-guide)

---

## Overview

RepurposeIQ employs a **hub-and-spoke multi-agent architecture** where:

- **Hub (Master Agent)**: Orchestrates workflow, delegates tasks, synthesizes results
- **Spokes (Worker Agents)**: Specialized domain experts with narrow responsibilities
- **State Management**: LangGraph maintains conversation state across agent interactions
- **Memory**: ChromaDB (long-term) + Redis (short-term) for caching and retrieval

### Architecture Principles

1. **Single Responsibility**: Each agent handles ONE domain (market, patents, clinical, etc.)
2. **Loose Coupling**: Agents communicate through standardized message format
3. **Fail-Safe**: If one agent fails, others continue; Master Agent provides graceful degradation
4. **Stateful Workflows**: LangGraph tracks dependencies and execution history
5. **Cyclic Reasoning**: Agents can backtrack and self-correct based on new information

---

## Master Agent Orchestrator

### Purpose
The Master Agent is the **brain** of RepurposeIQ. It:
- Classifies user intent
- Decomposes complex queries into sub-tasks
- Creates execution plans with dependencies
- Delegates work to specialized agents
- Synthesizes results into cohesive insights

### Workflow

```python
# python-service/agents/master_agent.py

from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Sequence
import operator

class AgentState(TypedDict):
    """Shared state across all agents"""
    query: str
    intent: str
    drug_name: str
    results: dict
    errors: list
    execution_plan: dict
    final_report: str

class MasterAgent:
    def __init__(self):
        self.workflow = self.build_workflow()
    
    def build_workflow(self):
        """Build LangGraph workflow with conditional routing"""
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("classify_intent", self.classify_intent)
        workflow.add_node("plan_execution", self.plan_execution)
        workflow.add_node("execute_agents", self.execute_agents)
        workflow.add_node("validate_results", self.validate_results)
        workflow.add_node("synthesize_report", self.synthesize_report)
        
        # Define edges
        workflow.set_entry_point("classify_intent")
        workflow.add_edge("classify_intent", "plan_execution")
        workflow.add_edge("plan_execution", "execute_agents")
        
        # Conditional: Re-execute if validation fails
        workflow.add_conditional_edges(
            "execute_agents",
            self.should_revalidate,
            {
                "validate": "validate_results",
                "synthesize": "synthesize_report"
            }
        )
        
        workflow.add_conditional_edges(
            "validate_results",
            self.should_retry,
            {
                "retry": "execute_agents",  # Backtrack
                "continue": "synthesize_report"
            }
        )
        
        workflow.add_edge("synthesize_report", END)
        
        return workflow.compile()
    
    def classify_intent(self, state: AgentState) -> AgentState:
        """
        Classify user query intent using LLM.
        
        Possible intents:
        - REPURPOSING_DISCOVERY: Find new indications
        - MARKET_ANALYSIS: Competitive landscape
        - IP_LANDSCAPE: Patent analysis
        - SUPPLY_CHAIN: Sourcing risks
        - REGULATORY_CHECK: Compliance assessment
        """
        from groq import Groq
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        prompt = f"""
        Classify the user's intent for this pharmaceutical query:
        Query: {state['query']}
        
        Return JSON:
        {{
            "intent": "REPURPOSING_DISCOVERY" | "MARKET_ANALYSIS" | "IP_LANDSCAPE" | "SUPPLY_CHAIN" | "REGULATORY_CHECK",
            "drug_name": "extracted drug name",
            "parameters": {{}}
        }}
        """
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        state['intent'] = result['intent']
        state['drug_name'] = result['drug_name']
        
        return state
    
    def plan_execution(self, state: AgentState) -> AgentState:
        """
        Create execution plan with agent dependencies.
        
        Example plan:
        {
            "phase_1": {
                "agents": ["iqvia", "patent"],  # Parallel
                "parallel": True
            },
            "phase_2": {
                "agents": ["exim"],
                "parallel": False,
                "condition": "if patent_expired == True"
            }
        }
        """
        intent = state['intent']
        
        # Predefined execution plans for each intent
        plans = {
            "REPURPOSING_DISCOVERY": {
                "phase_1": {
                    "agents": ["iqvia", "patent", "clinical"],
                    "parallel": True
                },
                "phase_2": {
                    "agents": ["exim", "web"],
                    "parallel": True,
                    "condition": "if market_viable == True"
                },
                "phase_3": {
                    "agents": ["knowledge", "report"],
                    "parallel": False
                }
            },
            "MARKET_ANALYSIS": {
                "phase_1": {
                    "agents": ["iqvia", "clinical"],
                    "parallel": True
                },
                "phase_2": {
                    "agents": ["report"],
                    "parallel": False
                }
            }
            # ... other intents
        }
        
        state['execution_plan'] = plans.get(intent, plans["REPURPOSING_DISCOVERY"])
        
        return state
    
    def execute_agents(self, state: AgentState) -> AgentState:
        """Execute agents according to plan"""
        import asyncio
        from .iqvia_agent import IQVIAAgent
        from .patent_agent import PatentAgent
        from .clinical_agent import ClinicalAgent
        # ... import other agents
        
        plan = state['execution_plan']
        results = {}
        
        for phase_name, phase in plan.items():
            agents = phase['agents']
            
            # Check condition if exists
            if 'condition' in phase:
                if not self.evaluate_condition(phase['condition'], state):
                    continue
            
            if phase['parallel']:
                # Execute agents in parallel
                tasks = [self.run_agent(agent, state) for agent in agents]
                phase_results = asyncio.run(asyncio.gather(*tasks))
            else:
                # Execute agents sequentially
                phase_results = [self.run_agent(agent, state) for agent in agents]
            
            # Merge results
            for agent, result in zip(agents, phase_results):
                results[agent] = result
        
        state['results'] = results
        return state
    
    async def run_agent(self, agent_name: str, state: AgentState):
        """Execute a specific agent"""
        agent_map = {
            "iqvia": IQVIAAgent(),
            "patent": PatentAgent(),
            "clinical": ClinicalAgent(),
            # ... other agents
        }
        
        agent = agent_map.get(agent_name)
        if agent:
            return await agent.execute(state)
        else:
            return {"error": f"Unknown agent: {agent_name}"}
    
    def should_revalidate(self, state: AgentState) -> str:
        """Decide if results need validation"""
        # Simple heuristic: validate if high-stakes intent
        high_stakes = ["REPURPOSING_DISCOVERY", "REGULATORY_CHECK"]
        
        if state['intent'] in high_stakes:
            return "validate"
        else:
            return "synthesize"
    
    def validate_results(self, state: AgentState) -> AgentState:
        """Validate agent results for consistency"""
        results = state['results']
        errors = []
        
        # Cross-validation rules
        if 'iqvia' in results and 'patent' in results:
            # Check: If market growing but patent expired, flag risk
            if results['iqvia'].get('cagr_5yr', 0) > 5.0:
                if results['patent'].get('status') == 'Expired':
                    errors.append({
                        "type": "COMPETITIVE_RISK",
                        "message": "High market growth + expired patent = generic competition risk"
                    })
        
        state['errors'] = errors
        return state
    
    def should_retry(self, state: AgentState) -> str:
        """Decide if agents should re-execute"""
        # Retry if critical errors found
        critical_errors = [e for e in state['errors'] if e.get('severity') == 'critical']
        
        if critical_errors:
            return "retry"
        else:
            return "continue"
    
    def synthesize_report(self, state: AgentState) -> AgentState:
        """Synthesize all agent results into final report"""
        from .report_agent import ReportAgent
        
        report_agent = ReportAgent()
        final_report = report_agent.generate(state)
        
        state['final_report'] = final_report
        return state
```

---

## Specialized Agents

### 1. IQVIA Insights Agent

**Purpose**: Fetch market intelligence and sales trends

```python
# python-service/agents/iqvia_agent.py

class IQVIAAgent:
    def __init__(self):
        self.api_base = os.getenv("IQVIA_API_URL", "http://localhost:3000/api/mock/iqvia")
    
    async def execute(self, state: AgentState):
        """
        Query IQVIA API for market data
        
        Returns:
        {
            "cagr_5yr": float,
            "market_size_usd": str,
            "top_competitors": list,
            "regional_breakdown": dict
        }
        """
        drug_name = state['drug_name']
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_base}/sales-trends",
                params={"drug": drug_name}
            )
        
        data = response.json()
        
        # Analyze trends
        insights = self.analyze_trends(data)
        
        return {
            "raw_data": data,
            "insights": insights,
            "timestamp": datetime.now().isoformat()
        }
    
    def analyze_trends(self, data):
        """Extract insights from market data"""
        cagr = data.get('cagr_5yr', 0)
        
        if cagr > 8.0:
            growth_signal = "High growth opportunity"
        elif cagr > 4.0:
            growth_signal = "Moderate growth"
        else:
            growth_signal = "Mature market"
        
        return {
            "growth_signal": growth_signal,
            "market_attractiveness": "High" if cagr > 6.0 else "Medium"
        }
```

### 2. Patent Landscape Agent

**Purpose**: Analyze IP freedom and patent expiry

```python
# python-service/agents/patent_agent.py

class PatentAgent:
    def __init__(self):
        self.api_base = os.getenv("PATENT_API_URL", "http://localhost:3000/api/mock/patent")
    
    async def execute(self, state: AgentState):
        """
        Query USPTO for patent data
        
        Returns:
        {
            "patents": list,
            "freedom_to_operate": bool,
            "next_expiry_date": str,
            "risk_score": int
        }
        """
        drug_name = state['drug_name']
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_base}/search",
                params={"drug": drug_name, "includeExpired": True}
            )
        
        patents = response.json().get('patents', [])
        
        # Calculate FTO (Freedom to Operate)
        active_patents = [p for p in patents if p['status'] == 'Active']
        fto = len(active_patents) == 0
        
        # Find next expiry
        future_expiries = [p for p in patents if p['status'] == 'Active']
        next_expiry = min([p['expiryDate'] for p in future_expiries]) if future_expiries else None
        
        return {
            "patents": patents,
            "freedom_to_operate": fto,
            "next_expiry_date": next_expiry,
            "risk_score": self.calculate_ip_risk(patents)
        }
    
    def calculate_ip_risk(self, patents):
        """Score IP risk (0-100, higher = more risk)"""
        active = len([p for p in patents if p['status'] == 'Active'])
        
        if active == 0:
            return 10  # Low risk
        elif active <= 3:
            return 50  # Medium risk
        else:
            return 90  # High risk
```

### 3. Clinical Trials Agent

**Purpose**: Analyze clinical pipeline and trial data

```python
# python-service/agents/clinical_agent.py

class ClinicalAgent:
    def __init__(self):
        self.api_base = os.getenv("CLINICAL_API_URL", "http://localhost:3000/api/mock/clinicaltrials")
    
    async def execute(self, state: AgentState):
        """
        Query ClinicalTrials.gov
        
        Returns:
        {
            "total_trials": int,
            "phase_distribution": dict,
            "top_indications": list,
            "pipeline_strength": str
        }
        """
        drug_name = state['drug_name']
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.api_base}/search",
                params={"drug": drug_name}
            )
        
        data = response.json()
        
        # Analyze pipeline strength
        phase_3_4 = data['phase_distribution'].get('Phase 3', 0) + data['phase_distribution'].get('Phase 4', 0)
        
        if phase_3_4 > 50:
            strength = "Strong"
        elif phase_3_4 > 20:
            strength = "Moderate"
        else:
            strength = "Weak"
        
        return {
            "total_trials": data['total_trials'],
            "phase_distribution": data['phase_distribution'],
            "top_indications": data['top_indications'],
            "pipeline_strength": strength
        }
```

### 4-7. Other Agents

Similar implementations for:
- **EXIM Trends Agent**: Supply chain and API sourcing
- **Web Intelligence Agent**: Real-time validation and news scraping
- **Internal Knowledge Agent**: RAG-based retrieval from ChromaDB
- **Report Generator Agent**: Synthesize results into PDF/Excel

---

## LangGraph Workflows

### Cyclic Reasoning Example

```python
# Example: Self-correcting workflow

def should_refine(state):
    """Check if results need refinement"""
    confidence = state['results'].get('confidence_score', 0)
    return confidence < 0.8  # Threshold

workflow = StateGraph(AgentState)

workflow.add_node("initial_analysis", analyze)
workflow.add_node("refine_analysis", refine)
workflow.add_node("finalize", finalize)

workflow.set_entry_point("initial_analysis")

# Conditional: Loop back if confidence low
workflow.add_conditional_edges(
    "initial_analysis",
    should_refine,
    {
        True: "refine_analysis",
        False: "finalize"
    }
)

# Can retry up to 3 times
workflow.add_conditional_edges(
    "refine_analysis",
    lambda s: s.get('retry_count', 0) < 3,
    {
        True: "initial_analysis",  # Backtrack
        False: "finalize"
    }
)

workflow.add_edge("finalize", END)
```

---

## Agent Communication

### Message Format

All agents use standardized message format:

```python
class AgentMessage(BaseModel):
    agent_id: str
    timestamp: datetime
    status: Literal["running", "completed", "failed"]
    data: dict
    metadata: dict
    
# Example
message = AgentMessage(
    agent_id="iqvia_agent_001",
    timestamp=datetime.now(),
    status="completed",
    data={
        "cagr_5yr": 5.4,
        "market_size_usd": "2.3B"
    },
    metadata={
        "execution_time_ms": 1250,
        "api_calls": 3,
        "cache_hit": False
    }
)
```

---

## RAG Implementation

### ChromaDB Setup

```python
# python-service/rag/chromadb_client.py

from chromadb import Client
from chromadb.config import Settings

class RAGClient:
    def __init__(self):
        self.client = Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_db"
        ))
        
        self.collection = self.client.get_or_create_collection(
            name="pharma_knowledge",
            metadata={"description": "Pharmaceutical strategy documents"}
        )
    
    def add_document(self, text, metadata):
        """Add document to vector store"""
        self.collection.add(
            documents=[text],
            metadatas=[metadata],
            ids=[metadata['id']]
        )
    
    def query(self, query_text, n_results=3):
        """Semantic search"""
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        
        return results
```

---

## Agent Development Guide

### Creating a New Agent

**Step 1: Create Agent Class**

```python
# python-service/agents/your_agent.py

class YourAgent:
    def __init__(self):
        self.name = "YourAgent"
    
    async def execute(self, state: AgentState):
        """Main execution logic"""
        # 1. Extract parameters from state
        drug_name = state['drug_name']
        
        # 2. Call external API or perform computation
        data = await self.fetch_data(drug_name)
        
        # 3. Analyze and extract insights
        insights = self.analyze(data)
        
        # 4. Return standardized result
        return {
            "raw_data": data,
            "insights": insights,
            "metadata": {
                "agent": self.name,
                "timestamp": datetime.now().isoformat()
            }
        }
    
    async def fetch_data(self, drug_name):
        """Fetch data from external source"""
        pass
    
    def analyze(self, data):
        """Extract insights from raw data"""
        pass
```

**Step 2: Register in Master Agent**

```python
# In master_agent.py

agent_map = {
    "iqvia": IQVIAAgent(),
    "patent": PatentAgent(),
    "your_agent": YourAgent(),  # Add here
}
```

**Step 3: Add to Execution Plan**

```python
plans = {
    "YOUR_INTENT": {
        "phase_1": {
            "agents": ["your_agent"],
            "parallel": False
        }
    }
}
```

---

## Best Practices

1. **Idempotency**: Agents should produce same result for same input
2. **Error Handling**: Always return partial results even if agent fails
3. **Caching**: Use Redis for expensive computations
4. **Timeouts**: Set reasonable timeouts for external API calls
5. **Logging**: Log all agent interactions for debugging
6. **Testing**: Write unit tests for each agent

---

## Monitoring Agent Performance

```python
# Track agent execution metrics
from prometheus_client import Histogram

agent_execution_time = Histogram(
    'agent_execution_seconds',
    'Time spent executing agent',
    ['agent_name']
)

@agent_execution_time.labels(agent_name='iqvia').time()
async def execute(self, state):
    # ... agent logic
    pass
```

---

For more details, see:
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Main README](../README.md)
