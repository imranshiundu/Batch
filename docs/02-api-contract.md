# Batch API Contract

## API principle

Every app surface must talk to the backend through stable route contracts.

The backend must support:

- web app
- future mobile app
- supplier portal
- operator console
- partner integrations

## Route groups

### Public

```txt
GET  /api/health
GET  /api/public/batches
GET  /api/public/batches/:slug
GET  /api/public/categories
GET  /api/public/demo
POST /api/public/waitlist
```

### Auth

```txt
GET  /api/auth/me
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/verify
```

### Buyer

```txt
GET  /api/buyer/dashboard
GET  /api/buyer/commitments
GET  /api/buyer/commitments/:id
POST /api/buyer/commitments
POST /api/buyer/commitments/:id/cancel
POST /api/buyer/commitments/:id/confirm-delivery
GET  /api/buyer/orders
GET  /api/buyer/orders/:id
GET  /api/buyer/wallet
GET  /api/buyer/refunds
POST /api/buyer/disputes
```

### Batch

```txt
GET  /api/batches
GET  /api/batches/:id
GET  /api/batches/:id/timeline
GET  /api/batches/:id/progress
GET  /api/batches/:id/tiers
GET  /api/batches/:id/proofs
GET  /api/batches/:id/delivery-plan
```

### Supplier

```txt
GET  /api/supplier/dashboard
POST /api/supplier/batches
GET  /api/supplier/batches
GET  /api/supplier/batches/:id
PATCH /api/supplier/batches/:id
POST /api/supplier/batches/:id/submit-for-review
POST /api/supplier/milestones/:id/proofs
GET  /api/supplier/payouts
GET  /api/supplier/reputation
```

### Operator/Admin

```txt
GET  /api/admin/dashboard
GET  /api/admin/batches
GET  /api/admin/batches/:id
POST /api/admin/batches/:id/approve
POST /api/admin/batches/:id/pause
POST /api/admin/batches/:id/cancel
GET  /api/admin/suppliers
POST /api/admin/suppliers/:id/verify
POST /api/admin/suppliers/:id/suspend
GET  /api/admin/escrow/ledger
GET  /api/admin/payments/events
POST /api/admin/milestones/:id/approve-release
POST /api/admin/refunds/:id/approve
GET  /api/admin/disputes
PATCH /api/admin/disputes/:id
GET  /api/admin/audit
```

### Payments

```txt
POST /api/payments/commitment-intent
POST /api/payments/webhooks/circle
POST /api/payments/webhooks/arc
GET  /api/payments/events/:id
POST /api/payments/refunds/:id/retry
POST /api/payments/payouts/:id/retry
```

### Logistics

```txt
GET  /api/logistics/deliveries
GET  /api/logistics/deliveries/:id
POST /api/logistics/deliveries/:id/scan
POST /api/logistics/deliveries/:id/mark-picked-up
POST /api/logistics/deliveries/:id/mark-delivered
```

## API design rules

- All write endpoints must be idempotent.
- All payment webhooks must create PaymentEvent records before side effects.
- All state transitions must go through `packages/core`.
- All admin actions must write AuditEvent records.
- Never release supplier funds without a milestone rule.
- Never refund without ledger entry.
- Never mark delivered without allocation and delivery record.

## Response envelope

```json
{
  "ok": true,
  "data": {},
  "meta": {},
  "error": null
}
```

Error:

```json
{
  "ok": false,
  "data": null,
  "meta": {},
  "error": {
    "code": "BATCH_NOT_CLEARABLE",
    "message": "This batch has not reached its minimum commitment threshold."
  }
}
```
