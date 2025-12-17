"""
Knowledge Graph Service for Pharmaceutical Intelligence
Builds and queries a knowledge graph connecting drugs, diseases, trials, patents
"""

from typing import Dict, Any, List, Optional
from loguru import logger
import networkx as nx
import json
import os
from datetime import datetime

# Try to import Neo4j, fallback to NetworkX
try:
    from neo4j import GraphDatabase
    HAS_NEO4J = True
except ImportError:
    HAS_NEO4J = False
    logger.warning("Neo4j not available. Using NetworkX in-memory graph.")

class KnowledgeGraph:
    """Pharmaceutical knowledge graph for relationship discovery"""
    
    def __init__(self):
        if HAS_NEO4J:
            uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
            user = os.getenv("NEO4J_USER", "neo4j")
            password = os.getenv("NEO4J_PASSWORD", "password")
            try:
                self.driver = GraphDatabase.driver(uri, auth=(user, password))
                self.use_neo4j = True
                logger.info("Connected to Neo4j")
            except Exception as e:
                logger.warning(f"Could not connect to Neo4j: {e}. Using NetworkX.")
                self.use_neo4j = False
                self.graph = nx.MultiDiGraph()
        else:
            self.graph = nx.MultiDiGraph()
            self.use_neo4j = False
            logger.info("Using in-memory NetworkX graph")
    
    def add_drug(self, drug_id: str, properties: Dict[str, Any]):
        """Add drug node to graph"""
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MERGE (d:Drug {id: $id}) SET d += $props",
                    id=drug_id, props=properties
                )
        else:
            self.graph.add_node(drug_id, type='Drug', **properties)
    
    def add_disease(self, disease_id: str, properties: Dict[str, Any]):
        """Add disease node to graph"""
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MERGE (d:Disease {id: $id}) SET d += $props",
                    id=disease_id, props=properties
                )
        else:
            self.graph.add_node(disease_id, type='Disease', **properties)
    
    def add_trial(self, trial_id: str, properties: Dict[str, Any]):
        """Add clinical trial node"""
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MERGE (t:Trial {id: $id}) SET t += $props",
                    id=trial_id, props=properties
                )
        else:
            self.graph.add_node(trial_id, type='Trial', **properties)
    
    def add_patent(self, patent_id: str, properties: Dict[str, Any]):
        """Add patent node"""
        if self.use_neo4j:
            with self.driver.session() as session:
                session.run(
                    "MERGE (p:Patent {id: $id}) SET p += $props",
                    id=patent_id, props=properties
                )
        else:
            self.graph.add_node(patent_id, type='Patent', **properties)
    
    def add_relationship(
        self,
        source_id: str,
        target_id: str,
        relationship_type: str,
        properties: Dict[str, Any] = None
    ):
        """Add relationship between nodes"""
        if self.use_neo4j:
            with self.driver.session() as session:
                query = f"""
                MATCH (a), (b)
                WHERE a.id = $source AND b.id = $target
                MERGE (a)-[r:{relationship_type}]->(b)
                SET r += $props
                """
                session.run(query, source=source_id, target=target_id, props=properties or {})
        else:
            self.graph.add_edge(
                source_id, target_id, 
                type=relationship_type, 
                **(properties or {})
            )
    
    def find_repurposing_paths(
        self,
        drug_id: str,
        target_disease: str,
        max_hops: int = 3
    ) -> List[Dict[str, Any]]:
        """Find paths from drug to disease (repurposing opportunities)"""
        if self.use_neo4j:
            with self.driver.session() as session:
                query = f"""
                MATCH path = (d:Drug {{id: $drug}})-[*1..{max_hops}]-(dis:Disease {{id: $disease}})
                RETURN path, length(path) as path_length
                ORDER BY path_length
                LIMIT 10
                """
                result = session.run(query, drug=drug_id, disease=target_disease)
                return [{"path": record["path"], "length": record["path_length"]} 
                       for record in result]
        else:
            try:
                if drug_id not in self.graph or target_disease not in self.graph:
                    return []
                
                paths = list(nx.all_simple_paths(
                    self.graph, drug_id, target_disease, cutoff=max_hops
                ))
                return [{"path": path, "length": len(path) - 1} for path in paths[:10]]
            except Exception as e:
                logger.error(f"Error finding paths: {e}")
                return []
    
    def find_similar_drugs(self, drug_id: str, similarity_threshold: float = 0.7) -> List[str]:
        """Find similar drugs based on graph structure"""
        if self.use_neo4j:
            with self.driver.session() as session:
                query = """
                MATCH (d:Drug {id: $drug})-[r1]-(shared)-[r2]-(similar:Drug)
                WHERE similar.id <> $drug
                WITH similar, count(shared) as shared_count
                WHERE shared_count >= $threshold
                RETURN similar.id as drug_id, shared_count
                ORDER BY shared_count DESC
                LIMIT 10
                """
                result = session.run(query, drug=drug_id, threshold=int(similarity_threshold * 10))
                return [record["drug_id"] for record in result]
        else:
            if drug_id not in self.graph:
                return []
            
            neighbors = set(self.graph.neighbors(drug_id))
            similar = {}
            
            for neighbor in neighbors:
                for other_drug in self.graph.neighbors(neighbor):
                    if (other_drug != drug_id and 
                        self.graph.nodes[other_drug].get('type') == 'Drug'):
                        similar[other_drug] = similar.get(other_drug, 0) + 1
            
            threshold = int(similarity_threshold * len(neighbors)) if neighbors else 0
            return [drug for drug, count in sorted(similar.items(), key=lambda x: x[1], reverse=True)
                   if count >= threshold][:10]
    
    def get_drug_network(self, drug_id: str, depth: int = 2) -> Dict[str, Any]:
        """Get network around a drug"""
        if self.use_neo4j:
            with self.driver.session() as session:
                query = f"""
                MATCH (d:Drug {{id: $drug}})-[*0..{depth}]-(connected)
                RETURN DISTINCT connected, labels(connected) as types
                LIMIT 100
                """
                result = session.run(query, drug=drug_id)
                nodes = []
                edges = []
                for record in result:
                    node = dict(record["connected"])
                    node["type"] = record["types"][0] if record["types"] else "Unknown"
                    nodes.append(node)
                return {"nodes": nodes, "edges": edges}
        else:
            if drug_id not in self.graph:
                return {"nodes": [], "edges": []}
            
            subgraph = nx.ego_graph(self.graph, drug_id, radius=depth)
            nodes = []
            edges = []
            
            for node_id in subgraph.nodes():
                node_data = self.graph.nodes[node_id]
                nodes.append({
                    "id": node_id,
                    "type": node_data.get("type", "Unknown"),
                    **{k: v for k, v in node_data.items() if k != "type"}
                })
            
            for source, target, data in subgraph.edges(data=True):
                edges.append({
                    "source": source,
                    "target": target,
                    "type": data.get("type", "related"),
                    **{k: v for k, v in data.items() if k != "type"}
                })
            
            return {"nodes": nodes, "edges": edges}
    
    def build_from_database(self, db_session):
        """Build graph from database records"""
        try:
            # This would query your database and build the graph
            # For now, using mock data structure
            logger.info("Building knowledge graph from database...")
            
            # Example: Add drugs from market data
            # drugs = db_session.query(MarketData).distinct(MarketData.molecule).all()
            # for drug in drugs:
            #     self.add_drug(drug.molecule, {"therapy_area": drug.therapy_area})
            
            logger.info("Knowledge graph built successfully")
        except Exception as e:
            logger.error(f"Error building graph: {e}")
    
    def close(self):
        """Close connections"""
        if self.use_neo4j and self.driver:
            self.driver.close()

# Singleton instance
knowledge_graph = KnowledgeGraph()
