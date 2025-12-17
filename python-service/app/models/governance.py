"""
Governance and versioning models
"""

from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import uuid

class ReportVersion(Base):
    """Versioned reports for auditability"""
    __tablename__ = "report_versions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    query_audit_id = Column(String, ForeignKey("query_audit.id"), nullable=False, index=True)
    version = Column(Integer, nullable=False, default=1)
    report_type = Column(String, nullable=False)  # executive, detailed, regulatory
    content = Column(JSON, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "version": self.version,
            "report_type": self.report_type,
            "content": self.content,
            "generated_at": self.generated_at.isoformat() if self.generated_at else None
        }

