#!/bin/bash

# RepurposeIQ - System Verification Script
# This script verifies that all components are properly installed and configured

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╦  ╦┌─┐┬─┐┬┌─┐┬┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
╚╗╔╝├┤ ├┬┘│├┤ ││  ├─┤ │ ││ ││││
 ╚╝ └─┘┴└─┴└  ┴└─┘┴ ┴ ┴ ┴└─┘┘└┘
EOF
echo -e "${NC}"
echo -e "${GREEN}RepurposeIQ System Verification${NC}"
echo ""

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Test function
test_component() {
    local name=$1
    local command=$2
    local expected=$3
    local level=$4  # "required" or "optional"
    
    echo -n "Testing $name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        if [ "$level" = "required" ]; then
            echo -e "${RED}✗ FAIL${NC}"
            ((FAILED++))
            return 1
        else
            echo -e "${YELLOW}⚠ WARNING (Optional)${NC}"
            ((WARNINGS++))
            return 0
        fi
    fi
}

# Version check function
check_version() {
    local name=$1
    local command=$2
    local min_version=$3
    
    echo -n "Checking $name version... "
    
    if command -v ${command%% *} >/dev/null 2>&1; then
        version=$(eval "$command")
        echo -e "${GREEN}✓ $version${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Not installed${NC}"
        ((FAILED++))
    fi
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1. System Prerequisites${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_version "Node.js" "node --version" "18.0.0"
check_version "npm" "npm --version" "9.0.0"
check_version "Python" "python3 --version" "3.9.0"
check_version "pip" "pip3 --version" "21.0.0"

test_component "Git" "git --version" "" "required"
test_component "Docker" "docker --version" "" "optional"
test_component "Redis" "redis-cli --version" "" "optional"

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2. Project Structure${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_component "Root package.json" "test -f package.json" "" "required"
test_component "Client directory" "test -d client" "" "required"
test_component "Server directory" "test -d server" "" "required"
test_component "Python service directory" "test -d python-service" "" "required"
test_component ".env file" "test -f .env" "" "required"
test_component "README.md" "test -f README.md" "" "required"

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3. Node.js Dependencies${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_component "Root node_modules" "test -d node_modules" "" "required"
test_component "Client node_modules" "test -d client/node_modules" "" "required"

# Check key packages
test_component "Express installed" "npm list express --depth=0" "" "required"
test_component "React installed" "cd client && npm list react --depth=0" "" "required"
test_component "Socket.io installed" "npm list socket.io --depth=0" "" "required"

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}4. Python Dependencies${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if command -v pip3 >/dev/null 2>&1; then
    test_component "FastAPI" "pip3 show fastapi" "" "optional"
    test_component "LangChain" "pip3 show langchain" "" "optional"
    test_component "ChromaDB" "pip3 show chromadb" "" "optional"
    test_component "Groq SDK" "pip3 show groq" "" "optional"
else
    echo -e "${YELLOW}⚠ pip3 not available, skipping Python checks${NC}"
fi

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}5. Environment Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f .env ]; then
    echo -n "Checking PORT variable... "
    if grep -q "PORT=" .env; then
        echo -e "${GREEN}✓ Set${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Missing${NC}"
        ((FAILED++))
    fi
    
    echo -n "Checking GROQ_API_KEY... "
    if grep -q "GROQ_API_KEY=" .env && ! grep -q "GROQ_API_KEY=your-groq-api-key-here" .env; then
        echo -e "${GREEN}✓ Configured${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ Not configured${NC}"
        ((WARNINGS++))
    fi
    
    echo -n "Checking JWT_SECRET... "
    if grep -q "JWT_SECRET=" .env && ! grep -q "JWT_SECRET=your-secure-secret" .env; then
        echo -e "${GREEN}✓ Configured${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ Not configured${NC}"
        ((WARNINGS++))
    fi
    
    echo -n "Checking CLIENT_URL... "
    if grep -q "CLIENT_URL=" .env; then
        echo -e "${GREEN}✓ Set${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Missing${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
    ((FAILED++))
fi

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}6. Data Directories${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_component "data directory" "test -d data" "" "required"
test_component "uploads directory" "test -d uploads" "" "required"
test_component "reports directory" "test -d reports" "" "required"

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}7. Port Availability${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_port() {
    local port=$1
    local name=$2
    
    echo -n "Checking port $port ($name)... "
    
    if command -v lsof >/dev/null 2>&1; then
        if lsof -i :$port >/dev/null 2>&1; then
            echo -e "${YELLOW}⚠ In use${NC}"
            ((WARNINGS++))
        else
            echo -e "${GREEN}✓ Available${NC}"
            ((PASSED++))
        fi
    else
        echo -e "${YELLOW}⚠ Cannot check (lsof not available)${NC}"
        ((WARNINGS++))
    fi
}

check_port 3000 "Backend"
check_port 5173 "Frontend"
check_port 5000 "Python Service"

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}8. Documentation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_component "README.md" "test -f README.md" "" "required"
test_component "API documentation" "test -f docs/API.md" "" "required"
test_component "Deployment guide" "test -f docs/DEPLOYMENT.md" "" "required"
test_component "Contributing guide" "test -f CONTRIBUTING.md" "" "required"
test_component "License" "test -f LICENSE" "" "required"
test_component "Changelog" "test -f CHANGELOG.md" "" "optional"

echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Tests Passed:    ${GREEN}$PASSED${NC}"
echo -e "Tests Failed:    ${RED}$FAILED${NC}"
echo -e "Warnings:        ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✓ All critical checks passed!                        ║${NC}"
    echo -e "${GREEN}║  Your RepurposeIQ installation is ready to use.       ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Review any warnings above"
    echo "  2. Start the application: ${GREEN}npm run dev${NC}"
    echo "  3. Access at: http://localhost:5173"
    echo ""
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ✗ Some critical checks failed!                       ║${NC}"
    echo -e "${RED}║  Please fix the errors above before proceeding.       ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Common fixes:${NC}"
    echo "  • Install missing dependencies: ${GREEN}npm run install-all${NC}"
    echo "  • Configure environment: ${GREEN}cp .env.example .env${NC}"
    echo "  • Create data directories: ${GREEN}mkdir -p data uploads reports${NC}"
    echo ""
    echo "For detailed setup instructions, see: ${BLUE}README.md${NC}"
    echo ""
    exit 1
fi
