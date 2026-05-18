# SPV-ready Ledger Accounts and Slot Payment Holds

This phase adds the accounting structure needed for serious batch commerce.

It does not create legal SPVs automatically.

It creates segregated internal ledger accounts that can later map to:

```txt
formal SPV entity
bank account
Circle wallet
Arc settlement account
M-Pesa settlement rail
Stripe balance path
local escrow provider
```

## Why not create legal SPVs for every batch now?

Because that would slow down the product and create legal overhead before there is enough deal volume.

The correct first step is account segregation.

Batch can support normal deals with internal ledger accounts, then upgrade larger or regulated deals into formal SPV structures when needed.

## Added database model

```prisma
model LedgerAccount {
  id String @id @default(cuid())
  batchId String
  type LedgerAccountType
  label String
  currency String @default("USD")
  balance Decimal @default(0) @db.Decimal(18, 2)
  status LedgerAccountStatus @default(ACTIVE)
  externalProvider PaymentProvider?
  externalReference String?
  legalEntityName String?
  jurisdiction String?
  metadata Json?
}
```

## Account types

```txt
BATCH_ESCROW
SUPPLIER_PAYABLE
LOGISTICS_PAYABLE
PLATFORM_FEE
REFUND_RESERVE
SPV_CONTROL
```

## Meaning

```txt
BATCH_ESCROW
Buyer money held for the batch before release or refund.

SUPPLIER_PAYABLE
Money owed to the supplier after approved milestones.

LOGISTICS_PAYABLE
Money owed to freight, hub, customs, or last-mile operators.

PLATFORM_FEE
Fees earned by Batch.

REFUND_RESERVE
Money reserved for failed deals, cancellations, disputes, and refunds.

SPV_CONTROL
Operational account that can later map to a formal SPV or external wallet.
It is not a legal SPV by itself.
```

## Added backend routes

```txt
GET  /api/operator/batches/:slug/ledger-accounts
POST /api/operator/batches/:slug/ledger-accounts
POST /api/slots/transfers/:transferId/hold
POST /api/slots/transfers/:transferId/complete
```

## Added frontend

```txt
/operator/finance
```

The page explains the segregated account structure and shows the API connection points.

## Slot transfer lifecycle now

```txt
order created
listing matched
listing reserved
transfer record created as HELD
payment hold marked posted
slot transfer completed
seller credited in ledger
platform fee posted in ledger
buyer receives the slot
listing marked completed
transfer marked completed
```

## Important guardrail

This is still internal ledger state.

It does not move live provider funds yet.

External money movement must still be added through provider adapters.

## Provider direction

Circle and Arc should benefit because the account model gives each batch a clean settlement structure.

Instead of random payments, every settlement can map to a specific account purpose:

```txt
buyer hold -> batch escrow
slot fee -> platform fee
supplier milestone -> supplier payable
freight release -> logistics payable
failed deal -> refund reserve
larger deal -> SPV control account
```

That makes the platform easier to fund, audit, and explain to payment partners.

## Remaining work

```txt
create Prisma migration locally
regenerate Prisma client locally
add provider wallet/account mapping table if needed
connect Circle payment intents to BATCH_ESCROW
connect Arc settlement references to ledger accounts
add M-Pesa/Stripe provider adapter interface
add account balance posting helper
prevent negative ledger account balances
add reconciliation reports
add finance operator tables and forms
add integration tests against Postgres
```
