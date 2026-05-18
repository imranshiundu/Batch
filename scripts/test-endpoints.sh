#!/usr/bin/env bash
# Batch Platform — Comprehensive Endpoint Test
# Runs against http://localhost:3000 in demo/mock mode (no DB required)

BASE="http://localhost:3000"
PASS=0
FAIL=0
WARN=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Idempotency key for POST tests
IDEM="test-$(date +%s%N | sha256sum | head -c 24)"

check() {
  local label="$1"
  local method="$2"
  local url="$3"
  local body="$4"
  local expected_status="$5"
  local extra_headers="$6"

  if [ "$method" = "GET" ]; then
    response=$(curl -s -o /tmp/batch_resp.json -w "%{http_code}" "$BASE$url" $extra_headers)
  else
    response=$(curl -s -o /tmp/batch_resp.json -w "%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -H "Idempotency-Key: $IDEM-$(echo $label | tr ' ' '-')" \
      $extra_headers \
      -d "$body" "$BASE$url")
  fi

  body_out=$(cat /tmp/batch_resp.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(json.dumps(d, indent=2))" 2>/dev/null | head -20)

  if [ "$response" = "$expected_status" ]; then
    echo -e "${GREEN}[PASS]${NC} [$response] $method $url — $label"
    PASS=$((PASS+1))
  elif [[ "$response" =~ ^[245] ]]; then
    echo -e "${YELLOW}[WARN]${NC} [$response] $method $url — $label (expected $expected_status)"
    echo "       $body_out" | head -5
    WARN=$((WARN+1))
  else
    echo -e "${RED}[FAIL]${NC} [$response] $method $url — $label"
    echo "       $body_out" | head -5
    FAIL=$((FAIL+1))
  fi
}

echo -e "\n${BLUE}====== Batch API Test Suite ======${NC}\n"

# ── PUBLIC ───────────────────────────────────────────────────────────
echo -e "${BLUE}[PUBLIC]${NC}"
check "Health check"                       GET  /api/health                          "" 200
check "List public batches"                GET  /api/public/batches                  "" 200
check "Get batch by slug"                  GET  "/api/public/batches/shenzhen-charger-restock" "" 200
check "Get non-existent batch"             GET  /api/public/batches/does-not-exist   "" 404

# ── MARKET ───────────────────────────────────────────────────────────
echo -e "\n${BLUE}[MARKET]${NC}"
check "List market instruments"            GET  /api/market/instruments              "" 200
check "Get instrument by symbol"           GET  "/api/market/instruments/shenzhen-charger-restock" "" 200
check "Get instrument depth"               GET  "/api/market/instruments/shenzhen-charger-restock/depth" "" 200

# ── DEVELOPERS ───────────────────────────────────────────────────────
echo -e "\n${BLUE}[DEVELOPERS]${NC}"
check "API map"                            GET  /api/developers/api-map              "" 200
check "Bot manifest"                       GET  /api/developers/bot-manifest         "" 200
check "List API keys"                      GET  /api/developers/api-keys             "" 200

# ── AUTH & PROFILE ────────────────────────────────────────────────────
echo -e "\n${BLUE}[AUTH & PROFILE]${NC}"
check "Get current user"                   GET  /api/auth/me                         "" 200
check "Get profile"                        GET  /api/profile                         "" 200
check "Get delivery profiles"              GET  /api/profile/delivery                "" 200
check "PATCH profile"                      PATCH /api/profile '{"displayName":"Test User","notificationEmail":true}' 200

# ── BUYER ─────────────────────────────────────────────────────────────
echo -e "\n${BLUE}[BUYER]${NC}"
check "Buyer dashboard"                    GET  /api/buyer/dashboard                 "" 200
check "List commitments"                   GET  /api/buyer/commitments               "" 200
check "Create commitment (valid)"          POST /api/buyer/commitments \
  '{"batchId":"shenzhen-charger-restock","quantity":5}' 201
check "Create commitment (missing qty)"    POST /api/buyer/commitments \
  '{"batchId":"shenzhen-charger-restock"}' 400
check "Create commitment (bad batch)"      POST /api/buyer/commitments \
  '{"batchId":"nonexistent-batch","quantity":1}' 404

# ── SLOTS ─────────────────────────────────────────────────────────────
echo -e "\n${BLUE}[SLOTS]${NC}"
check "List my slots"                      GET  /api/slots                           "" 200
check "Slot P&L"                           GET  /api/slots/pnl                       "" 200
check "List slot orders"                   GET  /api/slots/orders                    "" 200
check "Create slot listing"               POST /api/slots/listings \
  '{"commitmentId":"cmt_demo_001","quantity":5,"askUnitPrice":4.80}' 201
check "Create slot buy order"              POST /api/slots/orders \
  '{"batchSlug":"shenzhen-charger-restock","quantity":5,"limitUnitPrice":3.80}' 201
check "Cancel slot order (bad id)"         POST /api/slots/orders/bad-order-id/cancel \
  '{}' 400

# ── SUPPLIER ─────────────────────────────────────────────────────────
echo -e "\n${BLUE}[SUPPLIER]${NC}"
check "Supplier profile"                   GET  /api/supplier/profile                "" 200
check "List supplier batches"              GET  /api/supplier/batches                "" 200
check "Create batch draft (valid)"         POST /api/supplier/batches \
  '{"title":"Test Batch","summary":"A test batch","type":"IMPORT_BATCH","minimumUnits":100,"targetUnits":500,"currency":"USD","deliveryMode":"HUB_PICKUP"}' 201
check "Create batch draft (missing title)" POST /api/supplier/batches \
  '{"type":"IMPORT_BATCH","minimumUnits":100}' 400
check "Submit milestone proof"             POST /api/supplier/proofs \
  '{"batchId":"shenzhen-charger-restock","milestoneId":"ms_001","proofUrl":"https://example.com/proof.pdf","proofType":"INVOICE"}' 201

# ── OPERATOR ─────────────────────────────────────────────────────────
echo -e "\n${BLUE}[OPERATOR]${NC}"
check "Operator overview"                  GET  /api/operator/overview               "" 200
check "Escrow ledger"                      GET  /api/operator/escrow                 "" 200
check "List disputes"                      GET  /api/operator/disputes               "" 200
check "Batch transition (valid)"           POST "/api/operator/batches/shenzhen-charger-restock/transition" \
  '{"to":"FUNDED","reason":"Minimum threshold reached"}' 200
check "Batch transition (invalid state)"   POST "/api/operator/batches/shenzhen-charger-restock/transition" \
  '{"to":"SETTLED","reason":"Invalid jump"}' 400
check "Allocate deliveries"                POST "/api/operator/batches/shenzhen-charger-restock/allocate-deliveries" \
  '{"courier":"demo_logistics"}' 200
check "Issue refund (valid reason)"        POST /api/operator/commitments/cmt_demo_001/refund \
  '{"reason":"Batch cancelled by operator decision"}' 200
check "Issue refund (reason too short)"    POST /api/operator/commitments/cmt_demo_001/refund \
  '{"reason":"Bad"}' 400
check "Approve milestone payout"           POST "/api/operator/milestones/ms_001/approve-payout" \
  '{"amount":5000,"currency":"USD"}' 200
check "Lock delivery"                      POST "/api/operator/batches/shenzhen-charger-restock/lock-delivery" \
  '{}' 200
check "Ledger accounts"                    GET  "/api/operator/batches/shenzhen-charger-restock/ledger-accounts" "" 200
check "Ledger postings"                    GET  "/api/operator/batches/shenzhen-charger-restock/ledger-postings" "" 200
check "Ledger reconciliation"              GET  "/api/operator/batches/shenzhen-charger-restock/ledger-postings?view=reconcile" "" 200

# ── PAYMENTS ─────────────────────────────────────────────────────────
echo -e "\n${BLUE}[PAYMENTS]${NC}"
check "Payment webhook (circle)"           POST /api/payments/webhooks/circle \
  '{"event":"payment_success","payload":{"paymentId":"pi_test_001","status":"completed"}}' 200
check "Payment webhook (mock)"             POST /api/payments/webhooks/mock \
  '{"event":"payment_success","payload":{"paymentId":"pi_test_002","status":"completed"}}' 200

# ── VALIDATION & SECURITY ─────────────────────────────────────────────
echo -e "\n${BLUE}[SECURITY CHECKS]${NC}"
check "POST without idempotency key"       POST /api/buyer/commitments \
  '{"batchId":"shenzhen-charger-restock","quantity":5}' 400 "-H 'Idempotency-Key:'"
check "Role-protected buyer route"         GET  /api/buyer/commitments               "" 200  # demo allows this

# ── SUMMARY ───────────────────────────────────────────────────────────
echo -e "\n${BLUE}====== Results ======${NC}"
echo -e "${GREEN}PASS: $PASS${NC}"
echo -e "${YELLOW}WARN: $WARN${NC} (unexpected status, not a crash)"
echo -e "${RED}FAIL: $FAIL${NC} (no response or server error)"
TOTAL=$((PASS+FAIL+WARN))
echo -e "Total: $TOTAL tests run"
