# Slot Order Lifecycle and Basic UI

This phase connects the slot market backend to visible frontend entry points.

## Added backend

```txt
slot order lifecycle service
GET /api/slots/orders
POST /api/slots/orders/:orderId/reserve
```

## Added frontend API connector paths

```txt
/api/slots
/api/slots/listings
/api/slots/listings/:listingId/purchase
/api/slots/orders
/api/slots/orders/:orderId/reserve
/api/slots/orders/:orderId/cancel
/api/slots/pnl
/api/profile/delivery
/api/developers/api-keys
/api/developers/api-keys/:keyId/revoke
```

## Added frontend pages

```txt
/app/slots
/app/slot-orders
/developers/api-keys
```

## Updated navigation

The app shell now links to:

```txt
My slots
Slot orders
API keys
```

## Slot order lifecycle

Current flow:

```txt
Create slot order
Find compatible listing
Reserve matched listing
Create HELD transfer record
Create pending slot-transfer ledger hold
Audit reservation
```

## What reserve means

Reserve does not mean final ownership transfer.

Reserve means:

```txt
buyer has matched a listing
listing is no longer open to other buyers
transfer record exists
ledger hold draft exists
final completion still needs payment/escrow confirmation
```

## Guardrail

This phase does not enable live provider funds movement.

It creates the internal market state needed before provider hold/release is added.

## Known limit

Operator order expiry route was deferred because the connector blocked that write. It should be added in a smaller follow-up PR.

## Remaining work

```txt
connect reservation to payment provider hold
connect payment confirmation to slot transfer completion
add operator expiry route
add order expiry worker
add frontend forms and tables using the connector methods
add Prisma migration locally
run typecheck locally
run integration tests against Postgres
```
