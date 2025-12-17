"""
Vector store for embeddings using ChromaDB
"""

import chromadb
from chromadb.config import Settings
from app.core.config import settings
from loguru import logger
from typing import List, Dict, Any
import os

# Optional sentence transformers import
try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False
    logger.warning("sentence-transformers not available. Vector store will use ChromaDB's default embeddings.")

class VectorStore:
    """Vector store for semantic search"""
    
    def __init__(self):
        # Initialize embedding model if available
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
            except Exception as e:
                logger.warning(f"Could not load embedding model: {e}. Using ChromaDB default.")
                self.embedding_model = None
        else:
            self.embedding_model = None
        
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="pharma_documents",
            metadata={"description": "Pharmaceutical R&D documents"}
        )
        
        try:
            doc_count = len(self.collection.get()['ids'])
        except:
            doc_count = 0
        logger.info(f"Vector store initialized: {doc_count} documents")
    
    async def add_document(
        self,
        document_id: str,
        text: str,
        metadata: Dict[str, Any] = None
    ):
        """Add document to vector store"""
        try:
            # Prepare metadata
            doc_metadata = metadata or {}
            doc_metadata["text_length"] = len(text)
            
            # Generate embedding if model available, otherwise let ChromaDB handle it
            if self.embedding_model:
                embedding = self.embedding_model.encode(text).tolist()
                self.collection.add(
                    ids=[document_id],
                    embeddings=[embedding],
                    documents=[text],
                    metadatas=[doc_metadata]
                )
            else:
                # ChromaDB will use its default embedding function
                self.collection.add(
                    ids=[document_id],
                    documents=[text],
                    metadatas=[doc_metadata]
                )
            
            logger.debug(f"Document added to vector store: {document_id}")
            
        except Exception as e:
            logger.error(f"Error adding document to vector store: {e}")
            raise
    
    async def search(
        self,
        query: str,
        top_k: int = 10,
        filter_metadata: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Search vector store"""
        try:
            # Generate query embedding if model available
            if self.embedding_model:
                query_embedding = self.embedding_model.encode(query).tolist()
                results = self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k,
                    where=filter_metadata
                )
            else:
                # Use ChromaDB's default query (text-based)
                results = self.collection.query(
                    query_texts=[query],
                    n_results=top_k,
                    where=filter_metadata
                )
            
            # Format results
            formatted_results = []
            if results["ids"] and len(results["ids"][0]) > 0:
                for i, doc_id in enumerate(results["ids"][0]):
                    formatted_results.append({
                        "id": doc_id,
                        "content": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "score": 1.0 - results["distances"][0][i] if results["distances"] else 0.0,
                        "title": results["metadatas"][0][i].get("title", "") if results["metadatas"] else "",
                        "type": results["metadatas"][0][i].get("type", "unknown") if results["metadatas"] else "unknown"
                    })
            
            logger.debug(f"Vector search returned {len(formatted_results)} results")
            return formatted_results
            
        except Exception as e:
            logger.error(f"Error searching vector store: {e}")
            return []
    
    async def delete_document(self, document_id: str):
        """Delete document from vector store"""
        try:
            self.collection.delete(ids=[document_id])
            logger.debug(f"Document deleted from vector store: {document_id}")
        except Exception as e:
            logger.error(f"Error deleting document: {e}")

