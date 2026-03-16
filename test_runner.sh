#!/bin/bash

# test_runner.sh
# Comprehensive testing script for SmartForecast AI

echo "==============================================="
echo "   SMARTFORECAST AI - AUTOMATED TEST RUNNER    "
echo "==============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Run Backend Pytest Tests
echo -e "${GREEN}==> Starting Backend API and Model Tests (Pytest)...${NC}"
cd backend || exit 1

# Check if vitual env exists
if [ -d "venv" ]; then
    source venv/Scripts/activate 2>/dev/null || source venv/bin/activate 2>/dev/null
fi

pytest tests/ -v --tb=short
BACKEND_STATUS=$?

echo ""
cd ..

# 2. Run Frontend React Tests
echo -e "${GREEN}==> Starting Frontend React UI Tests (Vitest)...${NC}"
cd frontend || exit 1
npx vitest run
FRONTEND_STATUS=$?

echo ""
cd ..

# 3. Summary
echo "==============================================="
echo "                 TEST SUMMARY                  "
echo "==============================================="

FAILURES=0

if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "Backend Tests (Python) : ${GREEN}[PASS]${NC}"
else
    echo -e "Backend Tests (Python) : ${RED}[FAIL]${NC}"
    FAILURES=$((FAILURES + 1))
fi

if [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "Frontend Tests (React) : ${GREEN}[PASS]${NC}"
else
    echo -e "Frontend Tests (React) : ${RED}[FAIL]${NC}"
    FAILURES=$((FAILURES + 1))
fi

echo "==============================================="

if [ $FAILURES -gt 0 ]; then
    echo -e "${RED}Workflow failed. $FAILURES test suite(s) encountered errors.${NC}"
    exit 1
else
    echo -e "${GREEN}All test suites passed successfully!${NC}"
    exit 0
fi
