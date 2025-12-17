"""
Report generator for structured scientific reports
"""

from typing import Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.governance import ReportVersion
from loguru import logger
import uuid

class ReportGenerator:
    """Generate structured reports"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def generate_report(
        self,
        audit_id: str,
        result: Dict[str, Any]
    ) -> str:
        """Generate structured report"""
        try:
            report_id = str(uuid.uuid4())
            
            # Generate executive summary
            executive_summary = self._generate_executive_summary(result)
            
            # Generate detailed report
            detailed_report = self._generate_detailed_report(result)
            
            # Generate regulatory report
            regulatory_report = self._generate_regulatory_report(result)
            
            # Save reports
            reports = [
                {
                    "type": "executive",
                    "content": executive_summary
                },
                {
                    "type": "detailed",
                    "content": detailed_report
                },
                {
                    "type": "regulatory",
                    "content": regulatory_report
                }
            ]
            
            for i, report_data in enumerate(reports, 1):
                report_version = ReportVersion(
                    id=str(uuid.uuid4()),
                    query_audit_id=audit_id,
                    version=i,
                    report_type=report_data["type"],
                    content=report_data["content"]
                )
                self.db.add(report_version)
            
            self.db.commit()
            
            logger.info(f"Report generated: {report_id}")
            return report_id
            
        except Exception as e:
            logger.error(f"Error generating report: {e}")
            raise
    
    def _generate_executive_summary(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate executive summary"""
        return {
            "title": "Executive Summary",
            "generated_at": datetime.utcnow().isoformat(),
            "sections": [
                {
                    "title": "Overview",
                    "content": result.get("response", "Analysis completed.")
                },
                {
                    "title": "Key Metrics",
                    "content": {
                        "confidence_score": result.get("confidence_score", 0.0),
                        "regulatory_readiness": result.get("regulatory_readiness"),
                        "patent_risk": result.get("patent_risk"),
                        "agents_used": result.get("agents_used", [])
                    }
                }
            ]
        }
    
    def _generate_detailed_report(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed report"""
        return {
            "title": "Detailed Analysis Report",
            "generated_at": datetime.utcnow().isoformat(),
            "sections": [
                {
                    "title": "Full Response",
                    "content": result.get("response", "")
                },
                {
                    "title": "Evidence Sources",
                    "content": result.get("evidence_sources", [])
                },
                {
                    "title": "Agent Actions",
                    "content": "See audit trail for detailed agent actions"
                }
            ]
        }
    
    def _generate_regulatory_report(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate regulatory-focused report"""
        return {
            "title": "Regulatory Readiness Report",
            "generated_at": datetime.utcnow().isoformat(),
            "sections": [
                {
                    "title": "Regulatory Readiness Score",
                    "content": result.get("regulatory_readiness", 0.5)
                },
                {
                    "title": "Patent Risk Assessment",
                    "content": result.get("patent_risk", "unknown")
                },
                {
                    "title": "Recommendations",
                    "content": "Based on the analysis, consult regulatory experts for approval pathway."
                }
            ]
        }

