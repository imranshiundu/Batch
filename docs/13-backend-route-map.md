# Backend Route Map

This document tracks the first connected backend surface for Batch.

The current implementation is demo-wired. It uses seeded data and mock payment adapters, but the route boundaries are intentionally shaped for real database, payment, logistics, and mobile integrations.

## Public routes

```txt
GET /api/health
GET /api/public/batches
GET /api/public/batches/:slug
```

Purpose:

- health checks
- public batch browsing
- batch deal room reads

## Auth and profile routes

```txt
GET /api/auth/me
GET /api/profile
PATCH /api/profile
GET /api/supplier/profile
PATCH /api/supplier/profile
```

Purpose:

- current user context
- buyer profile completion
- supplier profile completion
- notification settings later
- default currency and delivery preferences later

## Buyer routes

```txt
GET /api/buyer/dashboard
GET /api/buyer/commitments
POST /api/buyer/commitments
```

Purpose:

- buyer dashboard
- active commitments
- commitment creation
- mock payment intent
- ledger draft creation

The POST commitment route already calls the core rule layer through `createCommitmentService`.

## Supplier routes

```txt
GET /api/supplier/batches
POST /api/supplier/batches
POST /api/supplier/proofs
```

Purpose:

- supplier batch drafts
- supplier batch management
- milestone proof submission

## Operator routes

```txt
GET /api/operator/overview
GET /api/operator/escrow
GET /api/operator/disputes
POST /api/operator/disputes
POST /api/operator/batches/:slug/transition
```

Purpose:

- operator queue visibility
- escrow ledger visibility
- dispute intake
- controlled state transitions

The transition route calls the core state machine through `assertTransition`.

## Payment routes

```txt
POST /api/payments/webhooks/:provider
```

Supported provider slugs:

```txt
circle
arc
mock
local
```

The route accepts provider events now but does not verify signatures yet. Signature verification belongs in the next security phase before live money is allowed.

## Integration expansion points

The backend is prepared for these adapters:

```txt
payments: Circle, Arc, local rails, mock
logistics: direct delivery, hub pickup, courier APIs
notifications: email, SMS, WhatsApp
identity: password auth, OAuth, passkeys, admin roles
risk: supplier scoring, dispute patterns, blocked batches
```

## Required next rule

No route should directly invent state or money behavior.

Correct path:

```txt
route handler
→ service action
→ @batch/core rule
→ database transaction
→ payment/logistics adapter
→ audit event
→ response envelope
```

## Current limitation

The current endpoints are intentionally demo-wired. They prove route shape and service boundaries, not persistence.

Before production:

- connect Prisma client
- add auth middleware
- add request validation
- add permission checks
- add idempotency storage
- add webhook signature verification
- add transaction-safe service actions
- add automated tests
