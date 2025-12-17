#!/bin/bash

# RepurposeIQ Quick Start Script
# This script helps you get RepurposeIQ up and running quickly

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}"
cat << "EOF"
╦═╗┌─┐┌─┐┬ ┬┬─┐┌─┐┌─┐┌─┐╔═╗╔═╗
╠╦╝├┤ ├─┘│ │├┬┘├─┘│ │└─┐║╣ ║═╬╗
╩╚═└─┘┴  └─┘┴└─┴  └─┘└─┘╚═╝╚══╝
EOF
echo -e "${NC}"
echo -e "${GREEN}RepurposeIQ - AI-Powered Drug Repurposing Platform${NC}"
echo ""

# Function to print step
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check prerequisites
print_step "Step 1/5: Checking prerequisites..."

if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: v$NPM_VERSION"
else
    print_error "npm not found. Please install npm."
    exit 1
fi

if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
else
    print_warning "Python3 not found. Python service will not be available."
fi

if command_exists pip3; then
    print_success "pip3 found"
else
    print_warning "pip3 not found. Python dependencies cannot be installed."
fi

echo ""

# Step 2: Install dependencies
print_step "Step 2/5: Installing dependencies..."

print_step "Installing Node.js dependencies..."
npm install --silent

print_step "Installing client dependencies..."
cd client && npm install --silent && cd ..

if command_exists pip3; then
    print_step "Installing Python dependencies..."
    cd python-service && pip3 install -r requirements.txt --quiet && cd ..
fi

print_success "All dependencies installed"
echo ""

# Step 3: Configure environment
print_step "Step 3/5: Configuring environment..."

if [ ! -f .env ]; then
    cp .env.example .env
    print_success "Created .env file from template"
    
    print_warning "⚠️  IMPORTANT: You need to configure your API keys in .env file"
    echo ""
    echo -e "${YELLOW}Required configuration:${NC}"
    echo "  1. GROQ_API_KEY - Get from https://console.groq.com/"
    echo "  2. JWT_SECRET - Generate with: openssl rand -hex 32"
    echo ""
    
    # Prompt user to edit .env
    read -p "Do you want to open .env file now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command_exists code; then
            code .env
        elif command_exists nano; then
            nano .env
        elif command_exists vim; then
            vim .env
        else
            print_warning "No editor found. Please manually edit .env file."
        fi
    fi
else
    print_success ".env file already exists"
fi

echo ""

# Step 4: Database setup
print_step "Step 4/5: Setting up database..."

mkdir -p data
mkdir -p uploads
mkdir -p reports

print_success "Created data directories"
echo ""

# Step 5: Verify installation
print_step "Step 5/5: Verifying installation..."

# Check if .env has required variables
if grep -q "GROQ_API_KEY=your-groq-api-key-here" .env; then
    print_warning "⚠️  GROQ_API_KEY not configured in .env"
    print_warning "   Get your API key from https://console.groq.com/"
fi

if grep -q "JWT_SECRET=your-secure-secret-key" .env; then
    print_warning "⚠️  JWT_SECRET not configured in .env"
    print_warning "   Generate with: openssl rand -hex 32"
fi

print_success "Installation complete!"
echo ""

# Final instructions
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  🎉 RepurposeIQ is ready!                             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "  1. Configure API keys in .env file (if not done yet)"
echo ""
echo "  2. Start the application:"
echo -e "     ${GREEN}npm run dev${NC}"
echo ""
echo "  3. Access the application:"
echo "     Frontend: http://localhost:5173"
echo "     Backend:  http://localhost:3000"
echo ""
echo "  4. Default test credentials:"
echo "     Email:    demo@repurposeiq.com"
echo "     Password: demo123"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  • README:        ./README.md"
echo "  • API Docs:      ./docs/API.md"
echo "  • Deployment:    ./docs/DEPLOYMENT.md"
echo "  • Contributing:  ./CONTRIBUTING.md"
echo ""
echo -e "${BLUE}Need help?${NC}"
echo "  • Discord: https://discord.gg/repurposeiq"
echo "  • Email:   support@repurposeiq.com"
echo "  • Issues:  https://github.com/yourusername/RepurposeIQ/issues"
echo ""
echo -e "${GREEN}Happy drug repurposing! 💊🧬${NC}"
echo ""
