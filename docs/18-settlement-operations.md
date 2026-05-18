# Settlement Operations

This phase adds the first settlement and operational control layer.

## Added

```txt
database-backed operator transitions
milestone payout approval service
commitment refund service
delivery allocation service
proof upload validation boundary
core service tests
```

## Routes added or upgraded

```txt
POST /api/operator/batches/:slug/transition
POST /api/operator/milestones/:milestoneId/approve-payout
POST /api/operator/commitments/:commitmentId/refund
POST /api/operator/batches/:slug/allocate-deliveries
POST /api/uploads/proofs
```

## Operator transitions

Database mode now updates batch status through a transaction.

The transition still passes through the core state machine before the database is changed.

## Payout approval

Milestone payout approval now:

```txt
loads milestone and batch
calculates release amount through core rules
marks milestone as approved
creates escrow ledger entry
creates payout record
writes audit event
```

## Refund creation

Commitment refund creation now:

```txt
loads commitment
creates refund ledger entry
creates refund record
marks commitment as refunded/refunding
writes audit event
```

## Delivery allocation

Delivery allocation now:

```txt
checks batch readiness
creates delivery record
creates buyer allocations
creates pickup codes
moves batch to delivering
writes audit event
```

## Upload boundary

Proof upload requests now validate:

```txt
filename
mime type
file size
owner role
idempotency key
```

Storage is not implemented yet. The endpoint returns a pending upload object and storage key for the future storage adapter.

Allowed proof formats:

```txt
JPEG
PNG
WebP
PDF
```

Max file size:

```txt
10 MB
```

## Tests

Core tests now cover:

```txt
valid state transition
invalid state transition
commitment quote
batch clearing detection
```

## Remaining work

```txt
fix TypeScript and Prisma generation issues after install
replace demo auth
persist upload records
add real storage adapter
add virus/file scanning
add payout provider dispatch
add refund provider dispatch
add delivery tracking updates
add end-to-end integration tests
```
