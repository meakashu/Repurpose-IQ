"""
Market Agent - Analyzes market opportunities using open datasets
"""

from typing import Dict, Any, List
from app.services.workers.base_agent import BaseAgent
from loguru import logger

class MarketAgent(BaseAgent):
    """Agent for market analysis and opportunity assessment"""
    
    def __init__(self):
        super().__init__("market")
    
    async def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze market opportunities"""
        self.logger.info(f"Processing market query: {query[:100]}...")
        
        molecule = self.extract_molecule(query)
        
        # Analyze market size
        market_size = await self._analyze_market_size(molecule, query)
        
        # Analyze competition
        competition = await self._analyze_competition(molecule, query)
        
        # Identify opportunities
        opportunities = await self._identify_opportunities(molecule, query, market_size, competition)
        
        # Generate summary
        summary = self._generate_summary(market_size, competition, opportunities, query)
        
        evidence = []
        if market_size:
            evidence.append({
                "source_type": "market",
                "source_id": f"MARKET-{molecule}",
                "title": f"Market Analysis for {molecule}",
                "extracted_data": market_size
            })
        
        return {
            "summary": summary,
            "evidence": evidence,
            "confidence": 0.7,
            "metadata": {
                "market_size": market_size,
                "competition_level": competition.get("level", "unknown"),
                "opportunities": len(opportunities)
            }
        }
    
    async def _analyze_market_size(self, molecule: str, query: str) -> Dict[str, Any]:
        """Analyze market size (using heuristic scoring)"""
        # In production, integrate with real market data APIs
        # For now, use heuristic scoring
        
        if not molecule:
            return {"size_usd_mn": 0, "cagr": 0}
        
        # Mock market data (in production, use real data)
        market_data = {
            "pembrolizumab": {"size_usd_mn": 20000, "cagr": 15.5},
            "sitagliptin": {"size_usd_mn": 5000, "cagr": -2.3},
            "metformin": {"size_usd_mn": 3000, "cagr": 5.2}
        }
        
        return market_data.get(molecule.lower(), {"size_usd_mn": 1000, "cagr": 3.0})
    
    async def _analyze_competition(self, molecule: str, query: str) -> Dict[str, Any]:
        """Analyze competition level"""
        # Heuristic scoring
        competition_levels = {
            "pembrolizumab": "high",
            "sitagliptin": "medium",
            "metformin": "low"
        }
        
        level = competition_levels.get(molecule.lower(), "medium")
        
        return {
            "level": level,
            "competitor_count": 5 if level == "high" else 3 if level == "medium" else 1
        }
    
    async def _identify_opportunities(self, molecule: str, query: str, market_size: Dict, competition: Dict) -> List[Dict]:
        """Identify market opportunities"""
        opportunities = []
        
        if market_size.get("cagr", 0) > 10:
            opportunities.append({
                "type": "high_growth",
                "description": f"High growth market (CAGR: {market_size['cagr']}%)",
                "score": 0.8
            })
        
        if competition.get("level") == "low":
            opportunities.append({
                "type": "low_competition",
                "description": "Low competition market - good entry opportunity",
                "score": 0.9
            })
        
        return opportunities
    
    def _generate_summary(self, market_size: Dict, competition: Dict, opportunities: List[Dict], query: str) -> str:
        """Generate summary"""
        summary = f"## Market Analysis\n\n"
        
        summary += f"### Market Size\n"
        summary += f"- Market Size: ${market_size.get('size_usd_mn', 0):,.0f}M\n"
        summary += f"- CAGR: {market_size.get('cagr', 0):.1f}%\n"
        
        summary += f"\n### Competition\n"
        summary += f"- Competition Level: {competition.get('level', 'unknown').title()}\n"
        summary += f"- Competitors: {competition.get('competitor_count', 0)}\n"
        
        if opportunities:
            summary += f"\n### Opportunities\n"
            for opp in opportunities:
                summary += f"- {opp['description']} (Score: {opp['score']:.1f})\n"
        
        return summary

