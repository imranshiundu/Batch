# Database Integration

This phase connects the backend to database-backed behavior behind a safe feature flag.

## Feature flag

```txt
BATCH_PERSISTENCE=database
```

When the flag is not set, the app continues to use seeded demo data.

When the flag is set to `database`, these routes start reading or writing through Prisma-backed services.

## Database-backed routes

```txt
GET /api/public/batches
GET /api/public/batches/:slug
POST /api/buyer/commitments
GET /api/profile
PATCH /api/profile
POST /api/payments/webhooks/:provider
```

## Seed workflow

```bash
pnpm db:generate
pnpm db:migrate
pnpm --filter @batch/db prisma:seed
```

Seed data creates:

```txt
buyer@batch.local
supplier@batch.local
Demo Supplier Co
shenzhen-charger-restock batch
batch tiers
milestone plan
```

## Why the flag matters

The product must stay runnable during development even when no database is configured.

The flag allows:

```txt
frontend demo mode
backend database mode
safe phased rollout
mobile app reuse later
integration testing later
```

## Persistence added

```txt
batch serializer
profile repository
payment event store
seed script
persistence mode switch
public batch reads from database
profile reads and updates from database
commitment creation from database transaction
webhook event persistence
```

## Current production limitation

The database-backed mode needs a real database URL and generated Prisma client before it can run.

This phase adds the integration path. It does not claim production readiness.

## Next work

```txt
fix TypeScript and Prisma generation issues after install
add database-backed supplier batch creation
add database-backed proof submission
add database-backed disputes
add webhook replay protection
add Circle-specific webhook verifier
add Arc-specific webhook verifier
add service tests
add CI command for typecheck and build
```
