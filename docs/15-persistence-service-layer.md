# Persistence and Service Layer

This phase introduces the database-backed service boundary for Batch.

The goal is to move from demo-wired API routes toward transaction-safe backend actions without mixing product rules directly into route handlers.

## Added in this phase

```txt
Prisma client wrapper
persistent idempotency records
audit reason support
idempotency store
batch repository
audit store
transactional commitment service
```

## Database changes

Added `IdempotencyRecord`:

```txt
key
actorId
route
requestHash
responseBody
status
createdAt
completedAt
expiresAt
```

Added `reason` to `AuditEvent`.

## Service boundary

Correct backend shape:

```txt
route
→ validation
→ auth and role guard
→ idempotency check
→ service action
→ core rule
→ database transaction
→ payment adapter
→ audit event
→ response
```

## Transactional commitment creation

`createPersistentCommitment` now handles:

```txt
idempotency start
batch lookup
price tier selection
core commitment quote
commitment creation
ledger entry creation
batch committed amount update
audit event write
mock payment intent
idempotency completion
```

## Important note

The existing buyer commitment route still uses the demo service until the database can be tested with a real `DATABASE_URL` and generated Prisma client.

This keeps the app runnable while introducing the persistence layer safely.

## Next work

```txt
wire persistent service into route behind env flag
add Prisma seed script
add migration workflow
add service tests
add database-backed profile reads/writes
add database-backed supplier batch drafts
add database-backed proof uploads
add database-backed dispute lifecycle
add webhook event persistence and replay protection
```

## Professional rule

No route should create commitments, payouts, refunds, or transitions directly.

Routes should stay thin. Services should own transactions. Core should own rules.
