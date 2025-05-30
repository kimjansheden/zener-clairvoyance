#!/bin/bash
# Security validation for Clairvoyance ESP Test
# Run this script before every production deploy

echo "🔒 CLAIRVOYANCE SECURITY VALIDATION"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to report test results
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

echo -e "\n${YELLOW}1. Building application...${NC}"
npm run build > /dev/null 2>&1
test_result $? "Build process completed"

echo -e "\n${YELLOW}2. Checking console.log in production...${NC}"
CONSOLE_COUNT=$(grep -r "console\.log" dist/ 2>/dev/null | wc -l)
test_result $CONSOLE_COUNT "No console.log in production build ($CONSOLE_COUNT found)"

echo -e "\n${YELLOW}3. Checking source maps...${NC}"
SOURCEMAP_COUNT=$(find dist/ -name "*.map" 2>/dev/null | wc -l)
test_result $SOURCEMAP_COUNT "No source maps in production ($SOURCEMAP_COUNT found)"

echo -e "\n${YELLOW}4. Checking debug comments in source code...${NC}"
DEBUG_COUNT=$(grep -r -i "TODO\|FIXME\|HACK\|DEBUG" src/ 2>/dev/null | grep -v "// " | wc -l)
if [ $DEBUG_COUNT -le 2 ]; then
    test_result 0 "Minimal debug comments in source ($DEBUG_COUNT found)"
else
    test_result 1 "Too many debug comments in source ($DEBUG_COUNT found)"
fi

echo -e "\n${YELLOW}5. Testing prototype pollution protection...${NC}"
if [ -f "src/utils/protectionUtils.ts" ]; then
    test_result 0 "Prototype pollution protection exists"
else
    test_result 1 "Prototype pollution protection missing"
fi

echo -e "\n${YELLOW}6. Checking security initialization...${NC}"
if grep -q "initializeSecurity" src/main.tsx 2>/dev/null; then
    test_result 0 "Security initialization found in main.tsx"
else
    test_result 1 "Security initialization missing from main.tsx"
fi

echo -e "\n${YELLOW}7. Validating build configuration...${NC}"
if grep -q "drop_console.*true" vite.config.ts 2>/dev/null; then
    test_result 0 "Console removal configured in Vite"
else
    test_result 1 "Console removal not configured in Vite"
fi

echo -e "\n${YELLOW}8. Checking file sizes...${NC}"
JS_SIZE=$(du -k dist/assets/*.js 2>/dev/null | awk '{print $1}' | head -1)
if [ -n "$JS_SIZE" ] && [ $JS_SIZE -lt 1000 ]; then
    test_result 0 "JS bundle size acceptable ($JS_SIZE KB)"
else
    test_result 1 "JS bundle size large ($JS_SIZE KB)"
fi

# Summary
echo -e "\n🔒 SECURITY VALIDATION COMPLETE"
echo "================================"
echo -e "${GREEN}✅ Passed tests: $PASSED${NC}"
echo -e "${RED}❌ Failed tests: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL SECURITY TESTS PASSED!${NC}"
    echo -e "${GREEN}Application is ready for production deploy.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  SECURITY ISSUES DETECTED!${NC}"
    echo -e "${RED}Fix the issues before deploy.${NC}"
    exit 1
fi
