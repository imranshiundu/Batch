# Bot Access and Slot Matching

This phase adds controlled bot access and the first slot order-matching layer.

## What changed

```txt
bot access enforcement helper
bot scope checks on market routes
bot scope checks on slot routes
slot buy order intake route
internal slot matching service
OpenAPI spec
```

## Guardrail

This is not full production API-key auth yet.

Current enforcement uses:

```txt
x-batch-bot-key
x-batch-bot-scopes
```

If a request does not include bot headers, the normal demo role path still works.

If a request includes bot headers, the route checks the required scope.

## Scopes

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

## New route

```txt
POST /api/slots/orders
```

Request:

```json
{
  "batchSlug": "shenzhen-charger-restock",
  "quantity": 5,
  "limitUnitPrice": 3.8
}
```

The route creates a slot buy order and tries to match it against the cheapest open listing in that batch that fits the quantity and limit price.

## Matching behavior

Current matching is simple:

```txt
find open listing
same batch
quantity >= requested quantity
ask price <= limit price if provided
choose cheapest ask
create order
attach matched listing id when found
```

This is not yet a full exchange engine.

Still missing:

```txt
order book priority queue
partial fill engine
maker/taker fee logic
provider-side payment hold for matched orders
automatic purchase completion from matched order
order expiry worker
market surveillance and abuse checks
```

## OpenAPI

Added:

```txt
docs/openapi/batch-api.yaml
```

This gives web, app, bot, and future SDK agents one shared API contract.

## Bot rules

Bots can help users:

```txt
read batch markets
read batch depth
create commitment instructions
read slots
list slots
purchase slots
create slot buy orders
cancel open orders
read slot P/L
manage delivery profiles
```

Bots still cannot:

```txt
bypass escrow
force supplier payout
change locked delivery
trade detached price exposure
custody funds directly
```

## Remaining work

```txt
replace header-only bot access with hashed API keys in database
enforce scopes from stored key records
add API-key management endpoints
connect matched orders to internal slot purchase completion
add provider-side payment hold/release for slot purchases
add order expiry worker
add abuse/risk checks
run typecheck locally
run Prisma migration locally
```
