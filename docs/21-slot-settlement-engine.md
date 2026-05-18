# Slot Settlement Engine

This phase turns Batch Slots from a model into an operational flow.

## Added

```txt
automatic slot creation after buyer commitment
commitment delivery profile selection
commitment delivery snapshots
slot listing purchase route
internal slot transfer completion service
partial slot split behavior
operator delivery lock endpoint
bot permission scope definitions
slot rule tests
```

## Commitment to slot flow

When a database-backed buyer commitment is created, the system now also creates:

```txt
Commitment
BatchSlot
DeliverySnapshot if the buyer has a selected/default delivery profile
EscrowLedgerEntry
AuditEvent
```

A slot represents the buyer's transferable position in the batch.

## Delivery profile selection

`POST /api/buyer/commitments` now accepts:

```json
{
  "batchId": "shenzhen-charger-restock",
  "quantity": 10,
  "deliveryProfileId": "optional_delivery_profile_id"
}
```

If no delivery profile is passed, the system uses the buyer's default profile when available.

## Slot listing purchase

Added route:

```txt
POST /api/slots/listings/:listingId/purchase
```

This completes an internal slot transfer record and attaches a buyer delivery snapshot when available.

It does not dispatch provider funds directly.

## Partial split behavior

If a listing sells only part of a slot:

```txt
seller keeps the remaining quantity on the original slot
buyer receives a new slot for the purchased quantity
```

If a listing sells the full slot:

```txt
slot ownership moves to buyer
entry price updates to buyer's purchase price
```

## Delivery lock

Added route:

```txt
POST /api/operator/batches/:slug/lock-delivery
```

Delivery lock:

```txt
sets batch.deliveryLockAt
locks active/listed/reserved slots
locks active delivery snapshots
locks open/reserved slot listings
writes audit event
```

After delivery lock, users should not change delivery details or transfer slots without operator exception.

## Bot scopes

Added:

```txt
market:read
market:depth:read
orders:create
orders:cancel
slots:read
slots:listings:create
slots:listings:purchase
slots:pnl:read
delivery:read
delivery:write
```

These are definitions only for now. Production enforcement still needs API-key auth.

## Tests

Added slot rule tests for:

```txt
listing before lock
blocking listing after lock
order cancellation
P/L calculation
transfer fee calculation
delivery change blocking
```

## Remaining work

```txt
add API-key auth and enforce bot scopes
create slot order matching instead of direct listing purchase only
add provider-side payment hold/release integration for slot transfer purchases
add operator exception route for locked delivery changes
add OpenAPI spec
run Prisma migration locally
run typecheck locally
add integration tests against a real database
```
