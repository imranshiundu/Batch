# Batch State Machine

## Principle

Batch cannot use vague statuses. Every state must control what buyers, suppliers, operators, and payment systems can do.

## Batch states

```txt
DRAFT
UNDER_REVIEW
OPEN
FUNDED
SUPPLIER_CONFIRMING
ACTIVE
PRODUCTION
SHIPPED
RECEIVED_AT_HUB
ALLOCATING
DELIVERING
DELIVERED
SETTLED
FAILED
REFUNDING
REFUNDED
DISPUTED
CANCELLED
```

## State meanings

### DRAFT
Supplier is preparing the batch. Buyers cannot see it.

### UNDER_REVIEW
Operator reviews supplier, pricing, delivery plan, and escrow plan.

### OPEN
Buyers can commit funds. Batch has not cleared yet.

### FUNDED
Minimum threshold is reached. New buyer commitments may still be allowed until deadline depending on settings.

### SUPPLIER_CONFIRMING
Supplier must confirm price, quantity, timeline, and terms.

### ACTIVE
Supplier confirmed. Buyer commitments are locked. Supplier milestones can begin.

### PRODUCTION
Supplier is producing or procuring goods.

### SHIPPED
Supplier submitted shipping proof.

### RECEIVED_AT_HUB
Logistics or hub received goods.

### ALLOCATING
Goods are being split into buyer allocations.

### DELIVERING
Buyer deliveries or pickups are active.

### DELIVERED
All required delivery confirmations are complete or delivery window closed.

### SETTLED
Final supplier payout and platform fee are complete.

### FAILED
Batch cannot continue. Refund process required.

### REFUNDING
Refunds are being processed.

### REFUNDED
Refunds are complete.

### DISPUTED
Batch or allocation has active dispute.

### CANCELLED
Batch was cancelled before commitments locked.

## Allowed buyer actions

```txt
OPEN: commit, cancel commitment
FUNDED: commit if still open, cancel if before lock time
ACTIVE+: track, dispute, transfer slot if enabled
DELIVERING: confirm delivery, dispute
FAILED/REFUNDING: track refund
```

## Allowed supplier actions

```txt
DRAFT: edit batch
UNDER_REVIEW: respond to operator
OPEN: view demand progress
SUPPLIER_CONFIRMING: confirm terms
ACTIVE/PRODUCTION/SHIPPED: upload proofs
RECEIVED_AT_HUB+: view allocation and payout status
```

## Allowed operator actions

Operators can:

- approve batch
- pause batch
- cancel batch
- reject proof
- approve milestone release
- trigger refund review
- open dispute
- suspend supplier

All operator actions must create AuditEvent records.

## Transition guards

- DRAFT to UNDER_REVIEW requires complete batch data.
- UNDER_REVIEW to OPEN requires operator approval.
- OPEN to FUNDED requires minimum threshold reached.
- FUNDED to SUPPLIER_CONFIRMING requires deadline or auto-clear rule.
- SUPPLIER_CONFIRMING to ACTIVE requires supplier confirmation.
- ACTIVE to PRODUCTION requires milestone plan active.
- Any state to FAILED requires reason.
- FAILED to REFUNDING requires refund plan.
- REFUNDING to REFUNDED requires ledger confirmation.
- DELIVERED to SETTLED requires final payout rules satisfied.

## Timeout rules

Every critical state must have a deadline:

- commit deadline
- supplier confirmation deadline
- production proof deadline
- shipping proof deadline
- hub receipt deadline
- delivery confirmation deadline
- dispute deadline

No open-ended waiting.
