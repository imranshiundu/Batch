# Backend Readiness Roadmap

Batch is ready enough for frontend wiring and controlled demos.

It is not yet ready for public money movement, high-concurrency trading, or large-volume production traffic.

This document defines the next backend tasks before a real launch.

## Current phase status

```txt
Ready for frontend integration: yes
Ready for controlled internal demo: yes
Ready for grant or investor review: yes
Ready for limited pilot with fake/provider-sandbox money: yes
Ready for real public deposits: no
Ready for 1,000 simultaneous hot-batch transactions: no
Ready for 1M users: no
```

## Core backend principle

Do not add random new features before the transaction spine is hardened.

The next backend work must protect:

```txt
money
inventory
slot ownership
delivery rights
currency correctness
provider reconciliation
operator auditability
high-concurrency safety
```

## Phase 1 — Database migration and generated-client discipline

### Goal

Make the schema deployable and reproducible on every machine and environment.

### Tasks

```txt
create Prisma migration files for current schema
regenerate Prisma client
add migration status check to CI
add schema drift check to CI
add seed script for demo batches, users, slots, delivery profiles, and ledger accounts
add reset script for local development
```

### Acceptance criteria

```txt
pnpm db:migrate works locally
pnpm db:generate works locally
fresh clone can create the database from migrations
CI fails if schema changes without migration
no route depends on demo fallback when BATCH_PERSISTENCE=database
```

## Phase 2 — Hot-batch concurrency control

### Problem

If 1,000 users buy the same batch at the same time, the system must not oversell the batch or create inconsistent committed units.

### Required design

Batch purchase must become an atomic operation.

Use one of these patterns:

```txt
Postgres row-level lock with SELECT ... FOR UPDATE
conditional update where committedUnits + quantity <= targetUnits
reservation table with expiration
queue-based batch commitment worker
```

### Recommended MVP approach

Use Postgres transaction plus conditional update.

Flow:

```txt
begin transaction
validate idempotency key atomically
lock batch row or run conditional update
reject if quantity exceeds remaining available units
create commitment
create batch slot
create delivery snapshot
post escrow ledger entry
increment BATCH_ESCROW account
write audit event
commit transaction
```

### Tasks

```txt
replace read-then-increment batch update with atomic capacity reservation
block oversubscription at database level
add conflict response for sold-out or changed capacity
add tests for 10, 100, and 1,000 concurrent commitment attempts
add test for same idempotency key under concurrency
add test for different idempotency keys racing on same batch
```

### Acceptance criteria

```txt
batch committedUnits never exceeds targetUnits
same idempotency key never creates duplicate commitments
failed capacity attempts leave no partial slot, ledger, or audit state
concurrent requests produce deterministic accepted/rejected totals
```

## Phase 3 — Atomic idempotency

### Problem

Idempotency currently protects intent, but the create flow must be hardened against high-speed duplicate requests.

### Tasks

```txt
change idempotency begin flow to create-first or upsert-first
handle unique constraint conflicts safely
store request hash
store response body after completion
store failure body for failed operations
block same key with different body
allow replay of same completed request
add idempotency expiry policy
```

### Acceptance criteria

```txt
same key + same body returns original response
same key + different body returns conflict
same key sent 100 times creates one operation only
failed operation state is observable
stale processing operation can be recovered by operator
```

## Phase 4 — Multi-currency architecture

### Problem

Batch must work across countries. But money cannot be treated as simple display text.

Currencies affect:

```txt
pricing
escrow
fees
refunds
supplier payouts
logistics payouts
ledger accounts
provider settlement
FX conversion
rounding
taxes
reporting
```

### Rules

```txt
store all monetary amounts as Decimal
store currency code with every amount
never mix currencies inside one ledger account
never convert currency without an explicit FX quote record
never show estimated converted value as settled money
round per currency rules
track provider currency separately from display currency
```

### New models to add

```txt
CurrencyProfile
FxQuote
FxConversion
UserCurrencyPreference
ProviderCurrencyRail
```

### CurrencyProfile fields

```txt
code
name
symbol
decimalPlaces
minimumAmount
cashRoundingIncrement
countryHints
isSettlementSupported
isDisplaySupported
```

### FxQuote fields

```txt
baseCurrency
quoteCurrency
rate
provider
expiresAt
sourceReference
spreadBps
createdAt
```

### Tasks

```txt
add supported currency registry
add buyer display currency preference
add supplier settlement currency preference
add batch currency validation
add provider rail validation by currency
add explicit FX quote creation flow
add converted display amounts without changing ledger truth
add tests for USD, KES, EUR, GBP, NGN, ZAR, INR, CNY
```

### Acceptance criteria

```txt
a USD batch cannot accidentally settle into a KES ledger account without FX conversion
user can view estimated local currency without changing stored settlement amount
refunds use original payment currency unless explicit conversion is approved
ledger reconciliation groups by currency
operator finance screen shows currency-separated balances
```

## Phase 5 — Provider adapters and settlement workers

### Goal

Connect internal ledger truth to real provider events without letting providers directly corrupt internal state.

### Providers

```txt
Circle
Arc
M-Pesa Daraja
Stripe
local escrow provider
mock provider for tests
```

### Required adapter interface

```txt
createPaymentIntent
confirmPaymentIntent
releasePayout
createRefund
readBalance
readTransaction
verifyWebhookSignature
normalizeWebhookEvent
```

### Worker jobs

```txt
payment_intent_create
payment_webhook_process
escrow_hold_confirm
supplier_payout_release
logistics_payout_release
refund_create
provider_reconcile
failed_event_retry
```

### Tasks

```txt
add PaymentProviderAccount model
add ProviderSettlementEvent model
add provider account mapping per ledger account
add webhook signature verification
add outbox table for provider jobs
add retry policy with dead-letter status
add provider reconciliation report
```

### Acceptance criteria

```txt
provider event cannot update commitment state without verification
webhook replay is idempotent
provider failure does not lose internal ledger state
operator can see unmatched provider events
operator can retry failed provider jobs
```

## Phase 6 — Distributed rate limiting and abuse protection

### Problem

In-memory rate limiting works only on one server process.

### Tasks

```txt
replace in-memory rate limiter with Redis/Upstash-backed limiter
rate limit by user id, IP, bot key, route group, and action type
add stricter limits for mutating financial routes
add bot key velocity limits
add suspicious-order detection
add operator kill switch for hot batch
```

### Acceptance criteria

```txt
limits work across multiple app instances
bot cannot bypass limits by hitting another server instance
financial routes have stricter limits than public read routes
operator can pause trading for a specific batch
```

## Phase 7 — Queues and background jobs

### Goal

Move slow and failure-prone work out of request handlers.

### Queue candidates

```txt
payment provider calls
webhook processing
email/SMS notifications
delivery allocation
supplier proof review
provider reconciliation
ledger reports
upload processing
risk scoring
```

### Tasks

```txt
add queue package
add worker process
add job table or Redis queue
add job status dashboard
add retry and dead-letter policy
add idempotency per job
```

### Acceptance criteria

```txt
checkout request does not wait on slow provider call longer than configured timeout
failed provider jobs are visible
retries do not duplicate money movement
worker can restart without losing jobs
```

## Phase 8 — Read scalability

### Problem

Dashboards, markets, and public browsing can become heavier than writes.

### Tasks

```txt
add pagination to every list route
add cursor-based pagination for large tables
add caching for public batch reads
add market depth cache
add dashboard read models
add read replica support for non-critical reads
add database indexes for high-volume query patterns
```

### High-volume indexes to review

```txt
Commitment(batchId, status, createdAt)
Commitment(buyerId, status, createdAt)
BatchSlot(batchId, status, ownerId)
BatchSlotListing(batchId, status, askUnitPrice, createdAt)
BatchSlotOrder(batchId, status, bidUnitPrice, createdAt)
BatchSlotTransfer(batchId, status, createdAt)
EscrowLedgerEntry(batchId, status, postedAt)
AuditEvent(targetType, targetId, createdAt)
PaymentEvent(provider, status, createdAt)
```

### Acceptance criteria

```txt
list routes do not return unbounded data
public batch page can be cached safely
operator dashboard does not scan full tables on every request
market depth endpoint remains fast under active trading
```

## Phase 9 — Delivery and slot transfer cutoffs

### Problem

Users can trade slots only until delivery lock. Once delivery is locked, ownership, shipping, and payout logic must stop changing casually.

### Tasks

```txt
enforce transfer cutoff based on batch deliveryLockAt
block listing creation after delivery lock
block listing purchase after delivery lock
block slot order reservation after delivery lock
allow operator-only exceptions with audit reason
snapshot final delivery owners
generate delivery allocation manifest
```

### Acceptance criteria

```txt
no normal buyer can trade a slot after delivery lock
operator exception requires reason and audit event
final delivery manifest matches final slot owners
refund and dispute paths remain available after delivery lock
```

## Phase 10 — Security and production auth

### Tasks

```txt
replace demo role header with real auth
add user sessions
add role-based access control
add bot key hashing and rotation hardening
add scoped service tokens
add CSRF protection where needed
add webhook signature verification
add audit log read routes
add admin permission model
add secrets management documentation
```

### Acceptance criteria

```txt
demo role headers are disabled in production
buyers cannot access operator routes
suppliers cannot access buyer private data
bot keys cannot access routes outside their scopes
operator actions are auditable
```

## Phase 11 — Observability

### Tasks

```txt
structured logging
request id per request
trace id through provider jobs
metrics for route latency
metrics for transaction success/failure
metrics for provider webhook lag
alerts for failed payout/refund jobs
alerts for negative reconciliation differences
```

### Acceptance criteria

```txt
operator can answer: what happened, who did it, when, and why
engineering can see slow routes before users complain
failed financial events are visible without reading raw database rows
```

## Phase 12 — Load testing

### Test scenarios

```txt
100 users browse batches
1,000 users browse batches
10,000 users browse public batch pages
100 users commit to same batch
1,000 users commit to same batch
1,000 users create slot buy orders
1,000 users reserve slot orders
1,000 webhook events replayed twice
100 provider failures and retries
10,000 dashboard reads
```

### Metrics to capture

```txt
p50 latency
p95 latency
p99 latency
error rate
DB CPU
DB connection count
lock wait time
queue delay
provider job retry count
oversell count
idempotency duplicate count
```

### Acceptance criteria

```txt
zero oversells
zero duplicate idempotency results
zero negative ledger balances
p95 under target for read routes
financial writes degrade safely instead of corrupting data
```

## Recommended order of execution

```txt
1. migrations and generated-client discipline
2. hot-batch concurrency control
3. atomic idempotency
4. delivery lock enforcement across slot routes
5. multi-currency registry and validation
6. provider account mapping
7. payment adapter interface
8. webhook state transitions
9. Redis rate limiting
10. queues and workers
11. read pagination and caching
12. production auth
13. observability
14. load testing
```

## Frontend can proceed in parallel

Frontend work can start now against these surfaces:

```txt
public batch browsing
buyer commitment flow
delivery profile flow
slot portfolio
slot listing flow
slot order flow
transfer hold and completion flow
operator finance page
developer bot key page
API map and manifest pages
```

But frontend must label unfinished backend areas honestly:

```txt
payments: sandbox/internal ledger only
uploads: pending upload records only until storage adapter is added
auth: demo role mode only until production auth is added
settlement: internal ledger only until provider adapters are connected
scale: controlled pilot only until concurrency tests pass
```

## Definition of backend launch readiness

Batch is launch-ready only when all of the following are true:

```txt
migrations are clean
high-concurrency commitment test passes
idempotency race test passes
ledger cannot go negative
delivery lock cannot be bypassed
payments are verified by provider webhook
refunds are idempotent
provider reconciliation exists
production auth is enabled
rate limiting is distributed
operator audit log is queryable
load tests prove target traffic
```

Until then, Batch is a serious prototype and controlled-pilot system, not a public financial marketplace.
