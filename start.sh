#!/bin/bash

# RepurposeIQ Startup Script
echo "🚀 Starting RepurposeIQ..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating default .env..."
    cat > .env << 'EOF'
# Server Configuration
PORT=3000
NODE_ENV=development
JWT_SECRET=repurposeiq-secret-key-change-in-production-2024

# Client Configuration
CLIENT_URL=http://localhost:5173

# Python Service Configuration
PYTHON_SERVICE_URL=http://localhost:8000

# API Keys (Optional - for enhanced features)
GROQ_API_KEY=
OPENAI_API_KEY=

# Database Configuration
DB_PATH=./data/pharma.db

# Neo4j Configuration (Optional)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
EOF
    echo "✅ Created .env file"
fi

# Initialize database if needed
if [ ! -f data/pharma.db ]; then
    echo "📊 Initializing database..."
    node -e "import('./server/database/db.js').then(m => { m.initDatabase(); m.seedDatabase(); console.log('✅ Database initialized'); })"
fi

# Start server
echo "🔧 Starting Node.js server on port 3000..."
npm run server
