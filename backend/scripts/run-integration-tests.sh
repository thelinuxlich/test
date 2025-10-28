#!/bin/bash

# Integration Tests Runner Script
# This script sets up the database and runs integration tests

set -e

echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║                    Students Module Integration Tests                           ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "${BLUE}[1/5]${NC} Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if docker-compose is running
echo -e "${BLUE}[2/5]${NC} Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

# Start PostgreSQL
echo -e "${BLUE}[3/5]${NC} Starting PostgreSQL database..."
cd "$(dirname "$0")/../.."
docker-compose up -d
echo -e "${GREEN}✓ PostgreSQL started${NC}"

# Wait for database to be ready
echo -e "${BLUE}[4/5]${NC} Waiting for database to be ready..."
sleep 5
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Database is ready${NC}"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}✗ Database failed to start${NC}"
        docker-compose logs postgres
        exit 1
    fi
    sleep 1
done

# Run integration tests
echo -e "${BLUE}[5/5]${NC} Running integration tests..."
cd backend
npm run test:integration

# Check test results
if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    ${GREEN}✓ All Integration Tests Passed${NC}                          ║"
    echo "╚════════════════════════════════════════════════════════════════════════════════╝"
    exit 0
else
    echo ""
    echo "╔════════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    ${RED}✗ Integration Tests Failed${NC}                             ║"
    echo "╚════════════════════════════════════════════════════════════════════════════════╝"
    exit 1
fi

