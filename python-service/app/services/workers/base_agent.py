"""
Base class for worker agents
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.core.config import settings
from loguru import logger

class BaseAgent(ABC):
    """Base class for all worker agents"""
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logger.bind(agent=name)
    
    @abstractmethod
    async def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process a query and return results
        
        Returns:
            Dict with keys:
                - summary: str - Summary of findings
                - evidence: List[Dict] - Evidence sources
                - confidence: float - Confidence score (0-1)
                - metadata: Dict - Additional metadata
        """
        pass
    
    def extract_molecule(self, query: str) -> str:
        """Extract molecule name from query (simple implementation)"""
        # Common pharmaceutical molecules
        molecules = [
            "pembrolizumab", "sitagliptin", "rivaroxaban", "metformin",
            "atorvastatin", "lisinopril", "amlodipine", "metoprolol",
            "omeprazole", "simvastatin", "losartan", "albuterol"
        ]
        
        query_lower = query.lower()
        for molecule in molecules:
            if molecule in query_lower:
                return molecule
        
        return ""
    
    def calculate_relevance_score(self, text: str, query: str) -> float:
        """Calculate relevance score between text and query"""
        query_words = set(query.lower().split())
        text_words = set(text.lower().split())
        
        if not query_words:
            return 0.0
        
        intersection = query_words.intersection(text_words)
        return len(intersection) / len(query_words)

