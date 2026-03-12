#!/bin/bash

# Test script for Real Intelligence Services
echo "🧪 Testing Bastion Real Intelligence Services"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"
ORG_ID="demo-org"

echo -e "${BLUE}Test 1: Analyze Real Event with AI${NC}"
echo "----------------------------------------"
curl -X POST "${BASE_URL}/api/intelligence/analyze-event" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "'"${ORG_ID}"'",
    "source": "TechCrunch",
    "title": "Major competitor announces 30% price cut in enterprise software market",
    "content": "Leading competitor XYZ Corp announced today a dramatic 30% price reduction across their entire enterprise software portfolio, directly targeting market leaders. Industry analysts predict this could trigger a price war in the $50B enterprise software market. The move comes as XYZ Corp seeks to gain market share from established players."
  }' \
  2>/dev/null | python3 -m json.tool
echo ""

echo -e "${BLUE}Test 2: Get Real-Time Intelligence Metrics${NC}"
echo "----------------------------------------"
curl -s "${BASE_URL}/api/intelligence/real-time/${ORG_ID}?hoursBack=72" | python3 -m json.tool
echo ""

echo -e "${BLUE}Test 3: Calculate Real Preparedness Score${NC}"
echo "----------------------------------------"
curl -s "${BASE_URL}/api/preparedness/real-score/${ORG_ID}" | python3 -m json.tool
echo ""

echo -e "${BLUE}Test 4: Get Real ROI Metrics${NC}"
echo "----------------------------------------"
curl -s "${BASE_URL}/api/roi/real-metrics/${ORG_ID}" | python3 -m json.tool
echo ""

echo -e "${GREEN}✅ Tests Complete!${NC}"
echo ""
echo "📊 What's Different:"
echo "  - Event analysis uses GPT-4o (real AI)"
echo "  - Preparedness scores calculated from actual data"
echo "  - ROI metrics based on real activations"
echo "  - Intelligence metrics from actual alerts"
echo ""
echo "🔧 Next Steps:"
echo "  1. Add NEWS_API_KEY to secrets for automatic event ingestion"
echo "  2. Create triggers in the UI"
echo "  3. Run playbook activations to build ROI history"
echo "  4. Generate AI briefings from real intelligence"
