# Operational Persistence

This phase moves supplier and operations workflows from demo-only responses toward database-backed behavior behind the existing persistence flag.

## Feature flag

```txt
BATCH_PERSISTENCE=database
```

## Added

```txt
supplier batch persistence service
supplier batch route switching
milestone proof persistence service
proof submission route switching
dispute persistence service
dispute route switching
webhook replay protection state
```

## Routes affected

```txt
GET /api/supplier/batches
POST /api/supplier/batches
POST /api/supplier/proofs
GET /api/operator/disputes
POST /api/operator/disputes
POST /api/payments/webhooks/:provider
```

## Supplier batch creation

Database mode now creates supplier batch drafts through a transaction.

The service:

```txt
finds supplier profile
creates a draft batch
audit logs the draft creation
returns the batch record
```

## Proof submission

Database mode now stores milestone proof submissions.

The service:

```txt
finds supplier profile
finds milestone
creates milestone proof
marks milestone as submitted
audit logs proof submission
```

## Dispute intake

Database mode now opens disputes through the database.

The service:

```txt
finds batch by id or slug
creates dispute record
audit logs dispute opening
```

## Webhook replay protection

Payment events now track whether an event was replayed or already processed.

Current behavior:

```txt
new event → RECEIVED → PROCESSED
replayed unprocessed event → REPLAYED → PROCESSED
replayed processed event → alreadyProcessed=true
```

## Remaining work

```txt
fix TypeScript and Prisma generation issues after install
add explicit service tests
add database-backed operator transitions
add payout approval workflow
add refund workflow
add delivery allocation workflow
add file upload storage and scanning
replace demo auth with real auth
replace in-memory rate limit with shared storage
```
