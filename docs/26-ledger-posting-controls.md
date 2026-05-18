# Ledger Posting Controls

This phase makes Batch behave more like financial infrastructure.

The previous phase created segregated ledger accounts.

This phase adds controlled posting rules.

## Why this matters

A serious escrow and batch-clearing system cannot treat balances as loose numbers.

Every movement must have:

```txt
account purpose
entry type
amount
currency
direction
source
destination
idempotency key
audit event
negative balance protection
```

## Added backend

```txt
apps/web/src/lib/persistence/ledger-posting-service.ts
apps/web/src/app/api/operator/batches/[slug]/ledger-postings/route.ts
```

## Added routes

```txt
GET  /api/operator/batches/:slug/ledger-postings
GET  /api/operator/batches/:slug/ledger-postings?view=reconcile
POST /api/operator/batches/:slug/ledger-postings
```

## Posting rules

```txt
amount must be positive
account must exist
account must be ACTIVE
posting must use a valid ledger entry type
posting must use a valid account type
operator role is required
idempotency key is required
negative account balances are blocked
successful posting writes an audit event
```

## Account types supported

```txt
BATCH_ESCROW
SUPPLIER_PAYABLE
LOGISTICS_PAYABLE
PLATFORM_FEE
REFUND_RESERVE
SPV_CONTROL
```

## Ledger entry types supported

```txt
BUYER_COMMITMENT_HOLD
BUYER_COMMITMENT_CAPTURE
PLATFORM_FEE
SUPPLIER_MILESTONE_RELEASE
LOGISTICS_PAYOUT
REFUND
SUPPLIER_BOND_HOLD
SUPPLIER_BOND_RELEASE
SUPPLIER_BOND_PENALTY
SLOT_TRANSFER_HOLD
SLOT_TRANSFER_SETTLEMENT
SLOT_TRANSFER_FEE
```

## Reconciliation route

The reconciliation view currently reports:

```txt
batch id
batch slug
batch currency
account count
posted entry count
account balance total
posted entry total
```

This is an operational check, not final double-entry accounting.

Final double-entry settlement mapping should be added when provider adapters are connected.

## Added frontend/API connector work

```txt
operatorLedgerPostings(slug)
operatorLedgerReconciliation(slug)
listLedgerPostings(slug)
reconcileLedger(slug)
postLedgerEntry(slug, body, idempotencyKey)
```

## Updated UI

```txt
/operator/finance
```

The finance page now explains posting discipline and lists the ledger posting routes.

## Guardrail

This phase still does not move live provider funds.

It controls internal ledger state.

Live provider movement should only happen after:

```txt
provider adapter exists
provider account mapping exists
webhook confirmation exists
ledger post is idempotent
provider event is stored
reconciliation can compare internal ledger and provider balance
```

## Remaining work

```txt
create Prisma migration locally
regenerate Prisma client locally
fix entryType casting with generated Prisma types if needed
add account balance helper for automatic service postings
connect commitment holds to BATCH_ESCROW credits
connect refunds to REFUND_RESERVE debits
connect supplier payouts to SUPPLIER_PAYABLE debits
connect logistics payouts to LOGISTICS_PAYABLE debits
add provider account mapping table
add double-entry ledger mapping
add reconciliation reports per provider
add finance tables and forms
add integration tests against Postgres
```
