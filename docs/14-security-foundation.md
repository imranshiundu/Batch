# Security Foundation

This document defines the first security layer for Batch before real users or live money are allowed.

## Current security additions

```txt
auth context
role guards
request validation
idempotency guard
audit draft helper
rate limit boundary
webhook verification helper
```

## Auth context

The current implementation uses `x-batch-demo-role` to simulate roles during development.

Supported demo roles:

```txt
BUYER
SUPPLIER
OPERATOR
ADMIN
```

This is not production authentication. It is a development guard so routes are no longer open by default.

Production replacement:

```txt
session/JWT/passkey auth
→ verified user
→ role and permission lookup
→ route guard
```

## Role guard policy

Buyer endpoints:

```txt
BUYER
OPERATOR
ADMIN for read support where needed
```

Supplier endpoints:

```txt
SUPPLIER
OPERATOR
ADMIN for oversight
```

Operator endpoints:

```txt
OPERATOR
ADMIN
```

Admin-only endpoints should be added later for platform configuration, risk policy, payment provider setup, and account suspension.

## Validation policy

Mutating endpoints must validate request bodies with schemas before calling services.

Current schemas:

```txt
createCommitmentSchema
profilePatchSchema
supplierBatchDraftSchema
proofSubmissionSchema
disputeSchema
transitionSchema
```

## Idempotency policy

Any endpoint that changes money, state, or ownership requires:

```txt
Idempotency-Key: stable-client-generated-key
```

Current implementation uses an in-memory demo set. Production must persist idempotency keys in the database.

Required database behavior later:

```txt
unique key
request hash
response snapshot
status
createdAt
expiresAt
```

## Audit policy

Important mutations return an audit draft now.

Production must persist audit records inside the same database transaction as the state mutation.

Audit events must include:

```txt
actorId
actorRole
action
targetType
targetId
before
after
reason
createdAt
```

## Webhook policy

The payment webhook route now uses a verification boundary.

Current providers:

```txt
circle
arc
mock
local
```

For `circle` and `arc`, production must configure provider secrets and validate the real provider signature format.

Current helper supports HMAC SHA-256 style verification using:

```txt
WEBHOOK_CIRCLE_SECRET
WEBHOOK_ARC_SECRET
```

## Rate limiting

A lightweight in-memory limiter protects sensitive demo routes.

Production must use shared storage such as Redis or managed edge rate limiting.

## Protected routes now

```txt
POST /api/buyer/commitments
PATCH /api/profile
GET /api/supplier/batches
POST /api/supplier/batches
GET /api/operator/disputes
POST /api/operator/disputes
POST /api/operator/batches/:slug/transition
POST /api/payments/webhooks/:provider
```

## Still required before live money

```txt
real auth
password/passkey/session security
role permissions from database
CSRF policy for browser-mutating requests
persistent idempotency table
Prisma transaction service layer
real audit writes
webhook replay protection
provider-specific signature verification
file upload scanning
supplier KYB/KYC flow
buyer verification rules
admin action approval for payouts
unit and integration tests
```

## Hard rule

No live payment provider should be enabled until all mutating money endpoints have:

```txt
role guard
validation
idempotency
transactional ledger write
audit event
rate limit
provider verification
error logging
```
