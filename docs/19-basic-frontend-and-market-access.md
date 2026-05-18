# Basic Frontend and Market Access

This phase keeps the frontend intentionally basic while making the app easier to connect to APIs and external bots.

The main Batch model is unchanged.

Batch is still:

```txt
commitments
clearing thresholds
escrow ledger
supplier milestones
proof
allocation
refunds
disputes
settlement controls
```

## What changed

```txt
API connector client
market access types
batch instrument service
market instrument endpoints
market depth endpoint
market order endpoint
developer bot manifest endpoint
developer API map endpoint
basic market page
basic developer page
navigation links
```

## Frontend scope

This is not a design pass.

The pages are intentionally simple so the team can later redesign properly without breaking the API structure.

Added pages:

```txt
/market
/developers
```

## API connector

Added:

```txt
apps/web/src/lib/api/client.ts
```

It centralizes route paths and basic GET/POST helpers so pages and future app clients do not hardcode endpoints everywhere.

## Market access model

A Batch market instrument is not a stock and not a synthetic token.

It represents access to a live batch commitment flow.

Bots can:

```txt
read batch instruments
read batch depth
submit commitment instructions
route valid buy commitments
later manage transferable allocation slots
```

Bots cannot:

```txt
bypass escrow
force clearing
force supplier payout
skip supplier proof
custody funds directly
turn Batch into a separate securities exchange
```

## Market endpoints

```txt
GET /api/market/instruments
GET /api/market/instruments/:symbol
GET /api/market/instruments/:symbol/depth
POST /api/market/orders
```

## Developer endpoints

```txt
GET /api/developers/bot-manifest
GET /api/developers/api-map
```

## Market order meaning

Current supported sides:

```txt
BUY_COMMITMENT
SELL_SLOT
```

Current supported order types:

```txt
MARKET
LIMIT
```

`BUY_COMMITMENT` means:

```txt
create or route a buyer commitment into a batch
```

`SELL_SLOT` means:

```txt
future transferable buyer slot intent
```

Slot transfer settlement is not implemented yet.

## Why this matters

This lets Batch behave more like a market without losing the main product idea.

People and bots can inspect demand, pricing, clearing status, and available capacity. But every action still resolves back to the Batch system.

## Next work

```txt
wire /market page to live fetch instead of direct local data
add API-key model for bots
add bot permission scopes
add database-backed market instruments
route BUY_COMMITMENT to persistent buyer commitment service
add slot transfer service
add webhook callbacks for bots
add SDK examples
add OpenAPI spec
```
