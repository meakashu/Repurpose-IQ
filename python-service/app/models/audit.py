"""
Audit trail models for governance and explainability
"""

from sqlalchemy import Column, String, Text, DateTime, Float, Integer, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import uuid

class QueryAudit(Base):
    """Main query audit record"""
    __tablename__ = "query_audit"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    conversation_id = Column(String, nullable=True, index=True)
    query_text = Column(Text, nullable=False)
    status = Column(String, default="processing")  # processing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Results
    response = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    regulatory_readiness = Column(Float, nullable=True)
    patent_risk = Column(String, nullable=True)
    report_id = Column(String, nullable=True)
    
    # Relationships
    agent_actions = relationship("AgentAction", back_populates="query_audit", cascade="all, delete-orphan")
    evidence_sources = relationship("EvidenceSource", back_populates="query_audit", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "conversation_id": self.conversation_id,
            "query_text": self.query_text,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "confidence_score": self.confidence_score,
            "regulatory_readiness": self.regulatory_readiness,
            "patent_risk": self.patent_risk,
            "report_id": self.report_id
        }

class AgentAction(Base):
    """Individual agent action log"""
    __tablename__ = "agent_actions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    query_audit_id = Column(String, ForeignKey("query_audit.id"), nullable=False, index=True)
    agent_name = Column(String, nullable=False, index=True)
    action_type = Column(String, nullable=False)  # search, analyze, synthesize, validate
    input_data = Column(JSON, nullable=True)
    output_data = Column(JSON, nullable=True)
    reasoning = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    execution_time_ms = Column(Integer, nullable=True)
    success = Column(Boolean, default=True)
    error_message = Column(Text, nullable=True)
    
    # Relationships
    query_audit = relationship("QueryAudit", back_populates="agent_actions")
    
    def to_dict(self):
        return {
            "id": self.id,
            "agent_name": self.agent_name,
            "action_type": self.action_type,
            "reasoning": self.reasoning,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "execution_time_ms": self.execution_time_ms,
            "success": self.success,
            "error_message": self.error_message
        }

class EvidenceSource(Base):
    """Evidence sources and citations"""
    __tablename__ = "evidence_sources"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    query_audit_id = Column(String, ForeignKey("query_audit.id"), nullable=False, index=True)
    agent_name = Column(String, nullable=False)
    source_type = Column(String, nullable=False)  # pubmed, clinical_trial, patent, regulatory, market, internal
    source_url = Column(String, nullable=True)
    source_id = Column(String, nullable=True)  # PubMed ID, NCT ID, Patent Number, etc.
    title = Column(String, nullable=True)
    abstract = Column(Text, nullable=True)
    relevance_score = Column(Float, nullable=True)
    extracted_data = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    query_audit = relationship("QueryAudit", back_populates="evidence_sources")
    
    def to_dict(self):
        return {
            "id": self.id,
            "agent_name": self.agent_name,
            "source_type": self.source_type,
            "source_url": self.source_url,
            "source_id": self.source_id,
            "title": self.title,
            "relevance_score": self.relevance_score,
            "extracted_data": self.extracted_data,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }

