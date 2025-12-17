# Python Agent Service

FastAPI-based agent orchestration service for RepurposeIQ - Intelligent Drug Repurposing Platform.

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run service
uvicorn main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Architecture

- **FastAPI**: Web framework
- **LangGraph**: Agent orchestration
- **ChromaDB**: Vector embeddings
- **PostgreSQL**: Audit trails
- **Redis**: Caching

## Agents

All agents are in `app/services/workers/`:
- Literature Agent
- Clinical Trial Agent
- Patent Agent
- Regulatory Agent
- Market Agent
- Internal Knowledge Agent

## Configuration

See `.env.example` for all configuration options.

