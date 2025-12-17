"""
API routes for agent service
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.master_agent import MasterAgent
from app.services.governance import GovernanceService
from loguru import logger

# Create routers
health_router = APIRouter()
agent_router = APIRouter()
prediction_router = APIRouter()
graph_router = APIRouter()

# Request/Response models
class QueryRequest(BaseModel):
    query: str
    user_id: str
    conversation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    response: str
    agents_used: List[str]
    confidence_score: float
    regulatory_readiness: Optional[float] = None
    patent_risk: Optional[str] = None
    evidence_sources: List[Dict[str, Any]]
    report_id: Optional[str] = None
    conversation_id: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

@health_router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "python-agent-service",
        "version": "2.0.0"
    }

@agent_router.post("/process", response_model=AgentResponse)
async def process_query(
    request: QueryRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Process a drug repurposing query through the agent orchestration system
    """
    try:
        logger.info(f"Processing query from user {request.user_id}: {request.query[:100]}...")
        
        # Initialize services
        master_agent = MasterAgent()
        governance = GovernanceService(db)
        
        # Log query initiation
        audit_id = await governance.log_query_start(
            user_id=request.user_id,
            query=request.query,
            conversation_id=request.conversation_id
        )
        
        # Process query through master agent
        result = await master_agent.process_query(
            query=request.query,
            user_id=request.user_id,
            context=request.context or {}
        )
        
        # Log query completion
        await governance.log_query_complete(
            audit_id=audit_id,
            result=result,
            success=True
        )
        
        # Generate report in background
        background_tasks.add_task(
            governance.generate_report,
            audit_id=audit_id,
            result=result
        )
        
        logger.info(f"Query processed successfully. Audit ID: {audit_id}")
        
        return AgentResponse(
            response=result["response"],
            agents_used=result["agents_used"],
            confidence_score=result.get("confidence_score", 0.0),
            regulatory_readiness=result.get("regulatory_readiness"),
            patent_risk=result.get("patent_risk"),
            evidence_sources=result.get("evidence_sources", []),
            report_id=result.get("report_id"),
            conversation_id=result.get("conversation_id", request.conversation_id)
        )
        
    except Exception as e:
        logger.error(f"Error processing query: {e}", exc_info=True)
        
        # Log error
        if 'audit_id' in locals():
            await governance.log_query_complete(
                audit_id=audit_id,
                result={"error": str(e)},
                success=False
            )
        
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@agent_router.get("/status/{audit_id}")
async def get_query_status(
    audit_id: str,
    db: Session = Depends(get_db)
):
    """Get status of a query processing"""
    try:
        governance = GovernanceService(db)
        status = await governance.get_query_status(audit_id)
        return status
    except Exception as e:
        logger.error(f"Error getting query status: {e}")
        raise HTTPException(status_code=404, detail="Query not found")

@agent_router.get("/audit/{audit_id}")
async def get_audit_trail(
    audit_id: str,
    db: Session = Depends(get_db)
):
    """Get complete audit trail for a query"""
    try:
        governance = GovernanceService(db)
        trail = await governance.get_audit_trail(audit_id)
        return trail
    except Exception as e:
        logger.error(f"Error getting audit trail: {e}")
        raise HTTPException(status_code=404, detail="Audit trail not found")

# Prediction endpoints
class RepurposingPredictionRequest(BaseModel):
    molecule: str
    indication: str
    therapy_area: str
    market_size: float = 0
    competition_level: float = 0.5
    patent_risk: str = "medium"
    clinical_evidence: float = 0.5
    existing_indications: int = 1

class MarketForecastRequest(BaseModel):
    molecule: str
    indication: str
    current_market_size: float
    cagr: float
    years: int = 5
    volatility: float = 0.1

@prediction_router.post("/repurposing-success")
async def predict_repurposing_success(request: RepurposingPredictionRequest):
    """Predict repurposing success probability"""
    try:
        from app.services.prediction_service import prediction_service
        
        result = prediction_service.predict_repurposing_success(
            molecule=request.molecule,
            indication=request.indication,
            therapy_area=request.therapy_area,
            market_size=request.market_size,
            competition_level=request.competition_level,
            patent_risk=request.patent_risk,
            clinical_evidence=request.clinical_evidence,
            existing_indications=request.existing_indications
        )
        
        return result
    except Exception as e:
        logger.error(f"Error predicting repurposing success: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@prediction_router.post("/market-forecast")
async def forecast_market(request: MarketForecastRequest):
    """Forecast market size over time"""
    try:
        from app.services.prediction_service import prediction_service
        
        result = prediction_service.forecast_market_size(
            molecule=request.molecule,
            indication=request.indication,
            current_market_size=request.current_market_size,
            cagr=request.cagr,
            years=request.years,
            volatility=request.volatility
        )
        
        return result
    except Exception as e:
        logger.error(f"Error forecasting market: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@prediction_router.post("/patent-expiry-impact")
async def predict_patent_expiry_impact(
    molecule: str,
    expiry_date: str,
    current_market_size: float
):
    """Predict market impact when patent expires"""
    try:
        from app.services.prediction_service import prediction_service
        
        result = prediction_service.predict_patent_expiry_impact(
            molecule=molecule,
            expiry_date=expiry_date,
            current_market_size=current_market_size
        )
        
        return result
    except Exception as e:
        logger.error(f"Error predicting patent expiry impact: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Knowledge Graph endpoints
class GraphQueryRequest(BaseModel):
    drug_id: str
    target_disease: Optional[str] = None
    max_hops: int = 3

@graph_router.post("/repurposing-paths")
async def find_repurposing_paths(request: GraphQueryRequest):
    """Find repurposing paths in knowledge graph"""
    try:
        from app.services.knowledge_graph import knowledge_graph
        
        paths = knowledge_graph.find_repurposing_paths(
            drug_id=request.drug_id,
            target_disease=request.target_disease or "",
            max_hops=request.max_hops
        )
        
        return {"paths": paths, "count": len(paths)}
    except Exception as e:
        logger.error(f"Error finding repurposing paths: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@graph_router.get("/drug-network/{drug_id}")
async def get_drug_network(drug_id: str, depth: int = 2):
    """Get network around a drug"""
    try:
        from app.services.knowledge_graph import knowledge_graph
        
        network = knowledge_graph.get_drug_network(drug_id, depth)
        return network
    except Exception as e:
        logger.error(f"Error getting drug network: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@graph_router.get("/similar-drugs/{drug_id}")
async def get_similar_drugs(drug_id: str, threshold: float = 0.7):
    """Find similar drugs based on graph structure"""
    try:
        from app.services.knowledge_graph import knowledge_graph
        
        similar = knowledge_graph.find_similar_drugs(drug_id, threshold)
        return {"similar_drugs": similar, "count": len(similar)}
    except Exception as e:
        logger.error(f"Error finding similar drugs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@graph_router.post("/add-node")
async def add_node(
    node_type: str,
    node_id: str,
    properties: Dict[str, Any]
):
    """Add a node to the knowledge graph"""
    try:
        from app.services.knowledge_graph import knowledge_graph
        
        if node_type == "Drug":
            knowledge_graph.add_drug(node_id, properties)
        elif node_type == "Disease":
            knowledge_graph.add_disease(node_id, properties)
        elif node_type == "Trial":
            knowledge_graph.add_trial(node_id, properties)
        elif node_type == "Patent":
            knowledge_graph.add_patent(node_id, properties)
        else:
            raise HTTPException(status_code=400, detail=f"Unknown node type: {node_type}")
        
        return {"message": f"Added {node_type} node: {node_id}"}
    except Exception as e:
        logger.error(f"Error adding node: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@graph_router.post("/add-relationship")
async def add_relationship(
    source_id: str,
    target_id: str,
    relationship_type: str,
    properties: Optional[Dict[str, Any]] = None
):
    """Add a relationship to the knowledge graph"""
    try:
        from app.services.knowledge_graph import knowledge_graph
        
        knowledge_graph.add_relationship(
            source_id, target_id, relationship_type, properties or {}
        )
        
        return {"message": f"Added relationship: {source_id} -[{relationship_type}]-> {target_id}"}
    except Exception as e:
        logger.error(f"Error adding relationship: {e}")
        raise HTTPException(status_code=500, detail=str(e))

