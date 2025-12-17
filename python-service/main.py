"""
FastAPI service for Agentic AI Drug Repurposing Copilot
Main entry point for Python-based agent orchestration
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.routes import agent_router, health_router, prediction_router, graph_router
from app.core.database import init_db, close_db
from app.core.redis_client import init_redis, close_redis

# Setup logging
logger = setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    # Startup
    logger.info("Starting Python Agent Service...")
    await init_db()
    await init_redis()
    logger.info("✅ Python Agent Service started successfully")
    yield
    # Shutdown
    logger.info("Shutting down Python Agent Service...")
    await close_db()
    await close_redis()
    logger.info("✅ Python Agent Service shut down")

# Create FastAPI app
app = FastAPI(
    title="Pharma Agentic AI - Python Service",
    description="Agent orchestration service for drug repurposing copilot",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(agent_router, prefix="/api/agents", tags=["agents"])
app.include_router(prediction_router, prefix="/api/predictions", tags=["predictions"])
app.include_router(graph_router, prefix="/api/graph", tags=["knowledge-graph"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Pharma Agentic AI - Python Service",
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "agents": "/api/agents",
            "predictions": "/api/predictions",
            "graph": "/api/graph",
            "docs": "/docs"
        }
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
        log_level=settings.LOG_LEVEL.lower()
    )

