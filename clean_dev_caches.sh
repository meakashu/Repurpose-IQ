#!/bin/bash

# Development Cache Cleanup Utility for macOS
# ===========================================

echo "========================================================"
echo "      DEVELOPMENT CACHE CLEANUP UTILITY (macOS)"
echo "========================================================"
echo ""
echo "This script will clear caches for:"
echo "- Node.js (Current Project & Global NPM/Yarn/pnpm)"
echo "- Python (Current Project & Global Pip/Pycache)"
echo "- VS Code (Code Cache, CachedData)"
echo "- System (User Caches, Trash)"
echo "- Build Tools (Homebrew, CocoaPods, Gradle, Docker)"
echo ""
read -p "Press Enter to start cleanup..."

# ----------------------------------------------------------
# 1. Project Level Cleanup (Current Directory)
# ----------------------------------------------------------
echo "[1/7] Cleaning Project Specific Caches..."

# Python __pycache__
echo "   - Removing __pycache__ directories..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null

# Python .pyc files
echo "   - Removing .pyc files..."
find . -name "*.pyc" -delete 2>/dev/null

# Node_modules/.cache
if [ -d "node_modules/.cache" ]; then
    echo "   - Removing node_modules/.cache..."
    rm -rf node_modules/.cache
fi

# ----------------------------------------------------------
# 2. Node.js & JavaScript Ecosystem
# ----------------------------------------------------------
echo ""
echo "[2/7] Cleaning Node.js & JS Ecosystem..."

# NPM
echo "   - Cleaning NPM Cache..."
npm cache clean --force >/dev/null 2>&1
rm -rf ~/.npm >/dev/null 2>&1

# Yarn
echo "   - Cleaning Yarn Cache..."
yarn cache clean >/dev/null 2>&1
rm -rf ~/Library/Caches/Yarn >/dev/null 2>&1

# pnpm
echo "   - Cleaning pnpm Store..."
pnpm store prune >/dev/null 2>&1
rm -rf ~/Library/pnpm/store >/dev/null 2>&1

# ----------------------------------------------------------
# 3. Python Ecosystem
# ----------------------------------------------------------
echo ""
echo "[3/7] Cleaning Python Ecosystem..."

# Pip
echo "   - Cleaning Pip Cache..."
pip cache purge >/dev/null 2>&1
rm -rf ~/Library/Caches/pip >/dev/null 2>&1

# Conda/Poetry/uv
echo "   - Cleaning Tool Caches (Conda, Poetry, uv)..."
rm -rf ~/.conda/pkgs >/dev/null 2>&1
rm -rf ~/Library/Caches/pypoetry >/dev/null 2>&1
rm -rf ~/Library/Caches/uv >/dev/null 2>&1

# ----------------------------------------------------------
# 4. IDEs & Editors (VS Code)
# ----------------------------------------------------------
echo ""
echo "[4/7] Cleaning VS Code Caches..."

rm -rf ~/Library/Application\ Support/Code/Cache >/dev/null 2>&1
rm -rf ~/Library/Application\ Support/Code/CachedData >/dev/null 2>&1
rm -rf ~/Library/Application\ Support/Code/User/workspaceStorage >/dev/null 2>&1

# ----------------------------------------------------------
# 5. Build Tools & Package Managers
# ----------------------------------------------------------
echo ""
echo "[5/7] Cleaning Build Tools & Package Managers..."

# Homebrew
if command -v brew &> /dev/null; then
    echo "   - Cleaning Homebrew..."
    brew cleanup -s >/dev/null 2>&1
    rm -rf "$(brew --cache)" >/dev/null 2>&1
fi

# CocoaPods
echo "   - Cleaning CocoaPods Cache..."
rm -rf ~/Library/Caches/CocoaPods >/dev/null 2>&1
if command -v pod &> /dev/null; then
    pod cache clean --all >/dev/null 2>&1
fi

# Gradle / Maven
echo "   - Cleaning Gradle/Maven Caches..."
rm -rf ~/.gradle/caches >/dev/null 2>&1
rm -rf ~/.m2/repository >/dev/null 2>&1

# Rust (Cargo)
echo "   - Cleaning Cargo Registry..."
rm -rf ~/.cargo/registry >/dev/null 2>&1

# ----------------------------------------------------------
# 6. Docker (Optional)
# ----------------------------------------------------------
echo ""
echo "[6/7] Checking Docker..."
if command -v docker &> /dev/null; then
    echo "   - Pruning Docker System (Volumes excluded for safety)..."
    # Removing unused containers, networks, images (not volumes)
    docker system prune -f >/dev/null 2>&1
else
    echo "   - Docker not found."
fi

# ----------------------------------------------------------
# 7. System Caches (User Level)
# ----------------------------------------------------------
echo ""
echo "[7/7] Cleaning User Caches..."

# General .cache (Linux style, used by many tools on Mac)
rm -rf ~/.cache >/dev/null 2>&1

# User Library Caches (Careful selection)
# Removing generic caches from ~/Library/Caches is usually safe but aggressive
# We will target specific ones or let the user know
echo "   - Note: Skipping broad '~/Library/Caches' delete for safety."
echo "   - You can manually clear: ~/Library/Caches"

echo ""
echo "========================================================"
echo "               CLEANUP COMPLETE"
echo "========================================================"
echo ""
