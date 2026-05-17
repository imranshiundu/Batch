# Payments, Arc, and Circle Plan

## Payment principle

Normal users should not need to understand crypto to use Batch.

User-facing payment options can include card, bank transfer, mobile money, and USDC. Backend settlement can use USDC and Arc where it gives Batch real benefits: conditional escrow, refunds, supplier payouts, predictable fees, and cross-border settlement.

## Why Arc and Circle benefit

Batch creates repeated payment activity tied to real goods:

- buyer commitment holds
- escrow funding
- failed-batch refunds
- milestone releases
- supplier payouts
- logistics payouts
- supplier bonds
- slot transfer settlement
- recurring merchant restock batches

This is non-speculative stablecoin usage.

## Payment layers

### Layer 1: Mock ledger

Used in local development and early demos. It must still behave like real money with idempotency keys, ledger entries, event logs, refund states, and payout states.

### Layer 2: Circle sandbox

Used for USDC flows, wallet/payment testing, and event handling.

### Layer 3: Arc sandbox/testnet

Used for settlement demonstrations and grant alignment.

### Layer 4: Local payment rails

Used later for user-facing regional adoption.

## Escrow flow

1. Buyer creates commitment.
2. Payment intent is created.
3. Funds are held or captured according to payment method.
4. Escrow ledger entry is created.
5. Batch progresses toward threshold.
6. If threshold fails, refund entries are created.
7. If batch clears, funds are locked into batch escrow.
8. Supplier receives milestone releases based on proof.

## Milestone release example

Import batch:

```txt
20% supplier confirmation
30% production proof or inspection
30% shipping proof or hub receipt
20% buyer delivery confirmation
```

Risky supplier:

```txt
0% supplier confirmation
0% production proof
20% shipping proof
50% hub receipt
30% delivery confirmation
```

Trusted supplier:

```txt
10% supplier confirmation
30% production proof
30% shipping proof
30% delivery confirmation
```

## Payment safety rules

- No supplier gets full payment upfront.
- No release without milestone rule.
- No refund without ledger entry.
- No payout without audit trail.
- Every webhook is stored before processing.
- Every external payment event must be idempotent.
- Failed payment events must enter retry queue.

## Future partner value

For Circle:

- more USDC utility
- real commerce settlement
- payout and refund volume
- possible wallet infrastructure use
- possible cross-chain transfer use later

For Arc:

- real-world financial flow
- predictable fee use case
- settlement logic for conditional commerce
- commercial app reference beyond trading and agents
