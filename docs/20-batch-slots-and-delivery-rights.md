# Batch Slots and Delivery Rights

This phase adds the foundation for a real trading layer without changing Batch into a synthetic exchange.

## Core rule

Users do not trade fake price exposure.

Users trade transferable allocation rights inside real batches.

A Batch Slot always maps back to:

```txt
real batch
real quantity
entry price
delivery right
refund path
batch status
transfer lock rules
```

## Why slots exist

If Batch only helps users buy products together, users only return when they need a product.

Batch Slots create daily market behavior:

```txt
find early batches
enter before demand clears
hold allocation rights
resell slots before delivery lock
track realized and listed-slot P/L
```

## Delivery profiles

Users can create reusable delivery profiles.

Routes:

```txt
GET /api/profile/delivery
POST /api/profile/delivery
```

A user can choose the default delivery profile or create a new one.

## Delivery snapshots

Delivery details must be snapshotted onto the commitment or slot.

The platform must not silently change old commitments when a user edits their profile later.

Snapshot fields include:

```txt
recipient name
phone
country
city
address / hub
delivery mode
status
lock time
```

## Delivery lock

Slot transfer and delivery changes should stop once the batch reaches delivery lock.

Delivery lock may be triggered by:

```txt
batch status reaches ALLOCATING
batch status reaches DELIVERING
batch.deliveryLockAt time passes
operator locks delivery manually later
```

## Slot models

Added database models:

```txt
DeliveryProfile
DeliverySnapshot
BatchSlot
BatchSlotListing
BatchSlotOrder
```

Expanded:

```txt
BatchSlotTransfer
Batch
Commitment
User
EscrowLedgerEntry
```

## Slot status flow

```txt
ACTIVE
LISTED
RESERVED
TRANSFERRING
TRANSFERRED
CANCELLED
LOCKED
DELIVERED
REFUNDED
DISPUTED
```

## Listing rules

A slot can be listed only when:

```txt
slot is active/listed
batch has not reached allocation/delivery/settlement/failure
batch delivery lock has not passed
quantity remains transferable
```

## Order cancellation rules

Open slot orders can be cancelled.

Filled, expired, rejected, or completed orders cannot be cancelled normally.

## P/L tracking

Route:

```txt
GET /api/slots/pnl
```

P/L tracks:

```txt
realized profit from completed slot transfers
unrealized listed-slot profit based on active ask price
transfer fees
net result
```

## Slot routes

```txt
GET /api/slots
POST /api/slots/listings
POST /api/slots/orders/:orderId/cancel
GET /api/slots/pnl
```

## Bot rules

Bots may:

```txt
read market instruments
read depth
read owned slots
create slot listings
cancel open slot orders
read P/L
```

Bots may not:

```txt
bypass clearing
bypass escrow
force payout
change locked delivery details
trade naked price exposure
custody funds directly
```

## Current limits

This phase creates the structure.

Still needed:

```txt
create slots automatically after commitment hold/capture
route market BUY_COMMITMENT to persistent commitment creation
create actual slot transfer settlement
split slots on partial transfer
replace delivery snapshot on buyer transfer before lock
operator delivery lock endpoint
API key scopes for bots
service tests for slot rules
database migration generated locally
```
