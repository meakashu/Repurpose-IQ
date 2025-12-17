"""
Clinical Trial Agent - Searches ClinicalTrials.gov
"""

import httpx
from typing import Dict, Any, List
from app.services.workers.base_agent import BaseAgent
from loguru import logger

class ClinicalAgent(BaseAgent):
    """Agent for clinical trial search and analysis"""
    
    def __init__(self):
        super().__init__("clinical")
        self.clinicaltrials_base = "https://clinicaltrials.gov/api/v2"
    
    async def process(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Search clinical trials"""
        self.logger.info(f"Processing clinical trial query: {query[:100]}...")
        
        molecule = self.extract_molecule(query)
        evidence = []
        
        # Search for trials
        trials = await self._search_trials(query, molecule)
        evidence.extend(trials)
        
        # Analyze repurposing opportunities
        repurposing = await self._find_repurposing_opportunities(molecule, trials)
        
        # Generate summary
        summary = self._generate_summary(trials, repurposing, query)
        
        return {
            "summary": summary,
            "evidence": evidence[:20],
            "confidence": min(0.9, 0.5 + len(evidence) * 0.03),
            "metadata": {
                "total_trials": len(trials),
                "repurposing_opportunities": len(repurposing),
                "source": "clinicaltrials.gov"
            }
        }
    
    async def _search_trials(self, query: str, molecule: str) -> List[Dict[str, Any]]:
        """Search ClinicalTrials.gov"""
        try:
            search_query = f"{molecule} {query}" if molecule else query
            
            async with httpx.AsyncClient() as client:
                url = f"{self.clinicaltrials_base}/studies"
                params = {
                    "query.cond": search_query,
                    "pageSize": 20,
                    "format": "json"
                }
                
                response = await client.get(url, params=params, timeout=15.0)
                data = response.json()
                
                evidence = []
                for study in data.get("studies", [])[:20]:
                    protocol = study.get("protocolSection", {})
                    identification = protocol.get("identificationModule", {})
                    status = protocol.get("statusModule", {})
                    design = protocol.get("designModule", {})
                    
                    evidence.append({
                        "source_type": "clinical_trial",
                        "source_id": identification.get("nctId", ""),
                        "source_url": f"https://clinicaltrials.gov/study/{identification.get('nctId', '')}",
                        "title": identification.get("briefTitle", ""),
                        "abstract": identification.get("briefSummary", ""),
                        "relevance_score": self.calculate_relevance_score(
                            identification.get("briefTitle", "") + " " + identification.get("briefSummary", ""),
                            query
                        ),
                        "extracted_data": {
                            "nct_id": identification.get("nctId"),
                            "status": status.get("overallStatus"),
                            "phase": design.get("phases", []),
                            "conditions": [c.get("name") for c in protocol.get("conditionsModule", {}).get("conditions", [])],
                            "interventions": [i.get("name") for i in protocol.get("armsInterventionsModule", {}).get("interventions", [])]
                        }
                    })
                
                return evidence
                
        except Exception as e:
            self.logger.error(f"Error searching ClinicalTrials.gov: {e}")
            return []
    
    async def _find_repurposing_opportunities(self, molecule: str, trials: List[Dict]) -> List[Dict]:
        """Find repurposing opportunities from trials"""
        if not molecule:
            return []
        
        repurposing = []
        seen_conditions = set()
        
        for trial in trials:
            conditions = trial.get("extracted_data", {}).get("conditions", [])
            for condition in conditions:
                if condition and condition.lower() not in seen_conditions:
                    seen_conditions.add(condition.lower())
                    repurposing.append({
                        "molecule": molecule,
                        "indication": condition,
                        "trial_id": trial.get("source_id"),
                        "phase": trial.get("extracted_data", {}).get("phase", [])
                    })
        
        return repurposing
    
    def _generate_summary(self, trials: List[Dict], repurposing: List[Dict], query: str) -> str:
        """Generate summary"""
        summary = f"## Clinical Trial Analysis\n\n"
        
        if not trials:
            return summary + f"No clinical trials found for query: {query}\n"
        
        summary += f"Found {len(trials)} relevant clinical trials.\n\n"
        
        # Group by phase
        by_phase = {}
        for trial in trials:
            phases = trial.get("extracted_data", {}).get("phase", [])
            for phase in phases:
                if phase not in by_phase:
                    by_phase[phase] = []
                by_phase[phase].append(trial)
        
        if by_phase:
            summary += "### Trials by Phase\n"
            for phase, phase_trials in by_phase.items():
                summary += f"- Phase {phase}: {len(phase_trials)} trials\n"
            summary += "\n"
        
        # Repurposing opportunities
        if repurposing:
            summary += f"### Repurposing Opportunities\n"
            summary += f"Found {len(repurposing)} potential new indications:\n"
            for opp in repurposing[:5]:
                summary += f"- {opp['molecule']} for {opp['indication']} (Trial: {opp['trial_id']})\n"
            summary += "\n"
        
        return summary

