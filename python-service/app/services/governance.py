"""
Governance and audit service for explainability and compliance
"""

from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.models.audit import QueryAudit, AgentAction, EvidenceSource
from app.models.governance import ReportVersion
from loguru import logger
import uuid

class GovernanceService:
    """Service for governance, audit trails, and explainability"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def log_query_start(
        self,
        user_id: str,
        query: str,
        conversation_id: Optional[str] = None
    ) -> str:
        """Log the start of a query"""
        audit = QueryAudit(
            id=str(uuid.uuid4()),
            user_id=user_id,
            conversation_id=conversation_id,
            query_text=query,
            status="processing"
        )
        self.db.add(audit)
        self.db.commit()
        logger.info(f"Query audit started: {audit.id}")
        return audit.id
    
    async def log_agent_action(
        self,
        query_audit_id: str,
        agent_name: str,
        action_type: str,
        input_data: Optional[Dict] = None,
        output_data: Optional[Dict] = None,
        reasoning: Optional[str] = None,
        execution_time_ms: Optional[int] = None,
        success: bool = True,
        error_message: Optional[str] = None
    ):
        """Log an agent action"""
        action = AgentAction(
            id=str(uuid.uuid4()),
            query_audit_id=query_audit_id,
            agent_name=agent_name,
            action_type=action_type,
            input_data=input_data,
            output_data=output_data,
            reasoning=reasoning,
            execution_time_ms=execution_time_ms,
            success=success,
            error_message=error_message
        )
        self.db.add(action)
        self.db.commit()
        logger.debug(f"Agent action logged: {agent_name} - {action_type}")
    
    async def log_evidence_source(
        self,
        query_audit_id: str,
        agent_name: str,
        source_type: str,
        source_url: Optional[str] = None,
        source_id: Optional[str] = None,
        title: Optional[str] = None,
        abstract: Optional[str] = None,
        relevance_score: Optional[float] = None,
        extracted_data: Optional[Dict] = None
    ):
        """Log an evidence source"""
        evidence = EvidenceSource(
            id=str(uuid.uuid4()),
            query_audit_id=query_audit_id,
            agent_name=agent_name,
            source_type=source_type,
            source_url=source_url,
            source_id=source_id,
            title=title,
            abstract=abstract,
            relevance_score=relevance_score,
            extracted_data=extracted_data
        )
        self.db.add(evidence)
        self.db.commit()
        logger.debug(f"Evidence source logged: {source_type} - {source_id}")
    
    async def log_query_complete(
        self,
        audit_id: str,
        result: Dict[str, Any],
        success: bool = True
    ):
        """Log query completion"""
        audit = self.db.query(QueryAudit).filter(QueryAudit.id == audit_id).first()
        if not audit:
            logger.error(f"Query audit not found: {audit_id}")
            return
        
        audit.status = "completed" if success else "failed"
        audit.completed_at = datetime.utcnow()
        audit.response = result.get("response")
        audit.confidence_score = result.get("confidence_score")
        audit.regulatory_readiness = result.get("regulatory_readiness")
        audit.patent_risk = result.get("patent_risk")
        audit.report_id = result.get("report_id")
        
        self.db.commit()
        logger.info(f"Query audit completed: {audit_id}")
    
    async def get_query_status(self, audit_id: str) -> Dict[str, Any]:
        """Get status of a query"""
        audit = self.db.query(QueryAudit).filter(QueryAudit.id == audit_id).first()
        if not audit:
            raise ValueError(f"Query audit not found: {audit_id}")
        
        return {
            "id": audit.id,
            "status": audit.status,
            "created_at": audit.created_at.isoformat() if audit.created_at else None,
            "completed_at": audit.completed_at.isoformat() if audit.completed_at else None,
            "agents_used": [action.agent_name for action in audit.agent_actions],
            "evidence_count": len(audit.evidence_sources)
        }
    
    async def get_audit_trail(self, audit_id: str) -> Dict[str, Any]:
        """Get complete audit trail"""
        audit = self.db.query(QueryAudit).filter(QueryAudit.id == audit_id).first()
        if not audit:
            raise ValueError(f"Query audit not found: {audit_id}")
        
        return {
            "query": audit.to_dict(),
            "agent_actions": [action.to_dict() for action in audit.agent_actions],
            "evidence_sources": [source.to_dict() for source in audit.evidence_sources],
            "reports": [report.to_dict() for report in self.db.query(ReportVersion)
                       .filter(ReportVersion.query_audit_id == audit_id).all()]
        }
    
    async def generate_report(
        self,
        audit_id: str,
        result: Dict[str, Any]
    ) -> str:
        """Generate structured report"""
        from app.services.report_generator import ReportGenerator
        
        report_gen = ReportGenerator(self.db)
        report_id = await report_gen.generate_report(audit_id, result)
        
        # Update audit with report ID
        audit = self.db.query(QueryAudit).filter(QueryAudit.id == audit_id).first()
        if audit:
            audit.report_id = report_id
            self.db.commit()
        
        return report_id

