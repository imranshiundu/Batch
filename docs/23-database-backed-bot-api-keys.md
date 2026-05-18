# Database-backed Bot API Keys

This phase replaces loose bot scope headers with stored API-key verification when database persistence is enabled.

## Added

```txt
BotApiKey Prisma model
ApiKeyStatus enum
API-key generation helper
SHA-256 API-key hashing helper
API-key persistence service
stored API-key verification
API-key create/list route
API-key revoke route
OpenAPI update
```

## New model

```prisma
model BotApiKey {
  id String @id @default(cuid())
  ownerId String
  name String
  prefix String
  keyHash String @unique
  scopes String[]
  status ApiKeyStatus @default(ACTIVE)
  lastUsedAt DateTime?
  expiresAt DateTime?
  revokedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## New routes

```txt
GET  /api/developers/api-keys
POST /api/developers/api-keys
POST /api/developers/api-keys/:keyId/revoke
```

## Create key request

```json
{
  "name": "Market making bot",
  "scopes": ["market:read", "market:depth:read", "orders:create"],
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

The raw key is returned once.

The database stores only:

```txt
prefix
keyHash
scopes
status
expiry
usage timestamps
```

## Verification behavior

When database persistence is enabled:

```txt
x-batch-bot-key -> SHA-256 hash -> BotApiKey lookup -> status check -> expiry check -> scope check
```

When database persistence is disabled:

```txt
x-batch-bot-key + x-batch-bot-scopes remain available for demo/local work
```

## Protected routes now await stored-key verification

```txt
GET  /api/market/instruments
GET  /api/market/instruments/:symbol/depth
GET  /api/slots
POST /api/slots/orders
POST /api/slots/listings
POST /api/slots/listings/:listingId/purchase
POST /api/slots/orders/:orderId/cancel
GET  /api/slots/pnl
```

## Guardrails

API keys can authorize route access.

API keys still cannot:

```txt
bypass escrow
force supplier payout
move live provider funds directly
change locked delivery details
trade detached price exposure
```

## Remaining work

```txt
create Prisma migration locally
regenerate Prisma client locally
add rate limits per key
add key usage logs
add key IP allowlist optional field
add frontend developer settings screen
connect matched slot orders to purchase completion
add payment hold/release path for slot transfers
add integration tests against Postgres
```
