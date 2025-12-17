"""
Literature Agent - Searches PubMed, Semantic Scholar, Europe PMC
"""

import httpx
from typing import Dict, Any, List
from app.services.workers.base_agent import BaseAgent
from app.core.config import settings
from loguru import logger

class LiteratureAgent(BaseAgent):
    """Agent for literature search and analysis"""
    
    def __init__(self):
        super().__init__("literature")
        self.pubmed_base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
        self.semantic_scholar_base = "https://api.semanticscholar.org/graph/v1"
        self.europe_pmc_base = "https://www.ebi.ac.uk/europepmc/webservices/rest"
    
    async def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Search literature databases"""
        self.logger.info(f"Processing literature query: {query[:100]}...")
        
        evidence = []
        molecule = self.extract_molecule(query)
        
        # Search PubMed
        pubmed_results = await self._search_pubmed(query, molecule)
        evidence.extend(pubmed_results)
        
        # Search Semantic Scholar
        semantic_results = await self._search_semantic_scholar(query, molecule)
        evidence.extend(semantic_results)
        
        # Search Europe PMC
        epmc_results = await self._search_europe_pmc(query, molecule)
        evidence.extend(epmc_results)
        
        # Generate summary
        summary = self._generate_summary(evidence, query)
        
        return {
            "summary": summary,
            "evidence": evidence[:20],  # Limit to top 20
            "confidence": min(0.9, 0.5 + len(evidence) * 0.02),
            "metadata": {
                "total_results": len(evidence),
                "sources": ["pubmed", "semantic_scholar", "europe_pmc"]
            }
        }
    
    async def _search_pubmed(self, query: str, molecule: str) -> List[Dict[str, Any]]:
        """Search PubMed"""
        try:
            # Construct search query
            search_query = f"{molecule} {query}" if molecule else query
            
            async with httpx.AsyncClient() as client:
                # Search
                search_url = f"{self.pubmed_base}/esearch.fcgi"
                search_params = {
                    "db": "pubmed",
                    "term": search_query,
                    "retmax": 10,
                    "retmode": "json"
                }
                
                search_response = await client.get(search_url, params=search_params, timeout=10.0)
                search_data = search_response.json()
                
                if "esearchresult" not in search_data or not search_data["esearchresult"].get("idlist"):
                    return []
                
                pmids = search_data["esearchresult"]["idlist"]
                
                # Fetch details
                fetch_url = f"{self.pubmed_base}/efetch.fcgi"
                fetch_params = {
                    "db": "pubmed",
                    "id": ",".join(pmids),
                    "retmode": "xml"
                }
                
                # For simplicity, return basic info
                # In production, parse XML to extract full details
                evidence = []
                for pmid in pmids[:10]:
                    evidence.append({
                        "source_type": "pubmed",
                        "source_id": pmid,
                        "source_url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                        "title": f"PubMed Article {pmid}",
                        "relevance_score": 0.8,
                        "extracted_data": {"pmid": pmid, "query": query}
                    })
                
                return evidence
                
        except Exception as e:
            self.logger.error(f"Error searching PubMed: {e}")
            return []
    
    async def _search_semantic_scholar(self, query: str, molecule: str) -> List[Dict[str, Any]]:
        """Search Semantic Scholar"""
        try:
            search_query = f"{molecule} {query}" if molecule else query
            
            async with httpx.AsyncClient() as client:
                url = f"{self.semantic_scholar_base}/paper/search"
                params = {
                    "query": search_query,
                    "limit": 10,
                    "fields": "title,abstract,url,year,authors"
                }
                
                headers = {}
                if settings.SEMANTIC_SCHOLAR_API_KEY:
                    headers["x-api-key"] = settings.SEMANTIC_SCHOLAR_API_KEY
                
                response = await client.get(url, params=params, headers=headers, timeout=10.0)
                data = response.json()
                
                evidence = []
                for paper in data.get("data", [])[:10]:
                    evidence.append({
                        "source_type": "semantic_scholar",
                        "source_id": paper.get("paperId", ""),
                        "source_url": paper.get("url", ""),
                        "title": paper.get("title", ""),
                        "abstract": paper.get("abstract", ""),
                        "relevance_score": self.calculate_relevance_score(
                            paper.get("abstract", "") + " " + paper.get("title", ""),
                            query
                        ),
                        "extracted_data": {
                            "year": paper.get("year"),
                            "authors": [a.get("name") for a in paper.get("authors", [])]
                        }
                    })
                
                return evidence
                
        except Exception as e:
            self.logger.error(f"Error searching Semantic Scholar: {e}")
            return []
    
    async def _search_europe_pmc(self, query: str, molecule: str) -> List[Dict[str, Any]]:
        """Search Europe PMC"""
        try:
            search_query = f"{molecule} {query}" if molecule else query
            
            async with httpx.AsyncClient() as client:
                url = f"{self.europe_pmc_base}/search"
                params = {
                    "query": search_query,
                    "resultType": "core",
                    "pageSize": 10,
                    "format": "json"
                }
                
                response = await client.get(url, params=params, timeout=10.0)
                data = response.json()
                
                evidence = []
                for result in data.get("resultList", {}).get("result", [])[:10]:
                    evidence.append({
                        "source_type": "europe_pmc",
                        "source_id": result.get("id", ""),
                        "source_url": result.get("fullTextUrlList", {}).get("fullTextUrl", [{}])[0].get("url", ""),
                        "title": result.get("title", ""),
                        "abstract": result.get("abstractText", ""),
                        "relevance_score": self.calculate_relevance_score(
                            result.get("abstractText", "") + " " + result.get("title", ""),
                            query
                        ),
                        "extracted_data": {
                            "doi": result.get("doi"),
                            "journal": result.get("journalTitle")
                        }
                    })
                
                return evidence
                
        except Exception as e:
            self.logger.error(f"Error searching Europe PMC: {e}")
            return []
    
    def _generate_summary(self, evidence: List[Dict], query: str) -> str:
        """Generate summary from evidence"""
        if not evidence:
            return f"No literature found for query: {query}"
        
        summary = f"## Literature Review\n\n"
        summary += f"Found {len(evidence)} relevant publications across PubMed, Semantic Scholar, and Europe PMC.\n\n"
        
        # Group by source
        by_source = {}
        for e in evidence:
            source = e["source_type"]
            if source not in by_source:
                by_source[source] = []
            by_source[source].append(e)
        
        for source, items in by_source.items():
            summary += f"### {source.replace('_', ' ').title()}\n"
            summary += f"- Found {len(items)} relevant articles\n"
            if items:
                top_item = items[0]
                summary += f"- Top result: {top_item.get('title', 'N/A')}\n"
            summary += "\n"
        
        return summary

