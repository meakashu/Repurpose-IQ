"""
Internal Knowledge Agent - Pluggable module for enterprise R&D documents
"""

from typing import Dict, Any, List
from app.services.workers.base_agent import BaseAgent
from app.services.vector_store import VectorStore
from loguru import logger

class InternalAgent(BaseAgent):
    """Agent for internal knowledge base search"""
    
    def __init__(self):
        super().__init__("internal")
        self.vector_store = VectorStore()
    
    async def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Search internal knowledge base"""
        self.logger.info(f"Processing internal knowledge query: {query[:100]}...")
        
        # Search vector store
        results = await self._search_vector_store(query)
        
        # Generate summary
        summary = self._generate_summary(results, query)
        
        evidence = []
        for result in results:
            evidence.append({
                "source_type": "internal",
                "source_id": result.get("id", ""),
                "title": result.get("title", ""),
                "relevance_score": result.get("score", 0.0),
                "extracted_data": {
                    "document_type": result.get("type", "unknown"),
                    "content": result.get("content", "")[:500]  # Truncate
                }
            })
        
        return {
            "summary": summary,
            "evidence": evidence[:20],
            "confidence": min(0.9, 0.5 + len(results) * 0.05),
            "metadata": {
                "total_documents": len(results),
                "source": "internal_knowledge_base"
            }
        }
    
    async def _search_vector_store(self, query: str) -> List[Dict[str, Any]]:
        """Search vector store for internal documents"""
        try:
            # Use vector store to find similar documents
            results = await self.vector_store.search(query, top_k=20)
            return results
        except Exception as e:
            self.logger.error(f"Error searching vector store: {e}")
            return []
    
    def _generate_summary(self, results: List[Dict], query: str) -> str:
        """Generate summary"""
        summary = f"## Internal Knowledge Base Search\n\n"
        
        if not results:
            return summary + f"No internal documents found for query: {query}\n"
        
        summary += f"Found {len(results)} relevant internal documents.\n\n"
        
        # Group by document type
        by_type = {}
        for result in results:
            doc_type = result.get("type", "unknown")
            if doc_type not in by_type:
                by_type[doc_type] = []
            by_type[doc_type].append(result)
        
        if by_type:
            summary += "### Documents by Type\n"
            for doc_type, docs in by_type.items():
                summary += f"- {doc_type}: {len(docs)} documents\n"
        
        if results:
            summary += f"\n### Top Result\n"
            top = results[0]
            summary += f"- {top.get('title', 'N/A')} (Relevance: {top.get('score', 0):.2f})\n"
        
        return summary

