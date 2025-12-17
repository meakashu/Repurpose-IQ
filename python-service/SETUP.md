# Python Service Setup Guide

## Quick Setup (macOS/Linux)

```bash
# Navigate to python-service directory
cd python-service

# Create virtual environment (use python3, not python)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Setup environment file
cp .env.example .env
# Edit .env with your configuration

# Test the service
uvicorn main:app --reload --port 8000
```

## Windows Setup

```bash
cd python-service
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
# Edit .env
uvicorn main:app --reload --port 8000
```

## Verify Installation

```bash
# Check Python version (should be 3.11+)
python --version

# Check installed packages
pip list | grep -E "(fastapi|langgraph|chromadb)"

# Test service
curl http://localhost:8000/api/health
```

## Common Issues

### Issue: `python: command not found`
**Solution**: Use `python3` instead of `python` on macOS/Linux

### Issue: `torch` installation fails
**Solution**: This is optional. The system works without local LLM models. Install from `requirements-optional.txt` only if needed.

### Issue: PostgreSQL connection fails
**Solution**: 
- Make sure PostgreSQL is running
- Check connection settings in `.env`
- For development, you can use SQLite instead (modify `app/core/database.py`)

## Next Steps

1. Configure `.env` file with your settings
2. Start PostgreSQL and Redis (or use Docker Compose)
3. Run the service: `uvicorn main:app --reload`
4. Test: Visit http://localhost:8000/docs for API documentation

