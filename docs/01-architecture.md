# Batch Architecture

## Architecture principle

Batch is API-first and app-first.

The web app, future mobile app, supplier portal, operator console, and partner integrations should all consume the same backend contracts.

## Monorepo shape

```txt
Batch/
  apps/
    web/                 # Next.js web/PWA app: public site, buyer, supplier, admin surfaces
    api/                 # API boundary docs and future standalone service option

  packages/
    ui/                  # shared UI components, icons, SVGs, motion primitives
    core/                # batch state machine, escrow rules, pricing, deadlines
    db/                  # Prisma schema, migrations, seeds
    payments/            # Circle, Arc, local payment adapters
    logistics/           # delivery modes, tracking, pickup codes
    notifications/       # email, SMS, WhatsApp adapters
    config/              # eslint, tsconfig, env schema, shared constants

  docs/                  # product, architecture, API, DB, UI, operations
```

## Runtime layers

### 1. Client apps

- Public landing site
- Buyer app
- Supplier portal
- Operator console

### 2. API layer

Owns route contracts, validation, auth checks, rate limits, and idempotency keys.

### 3. Core domain layer

Owns business rules:

- batch state transitions
- clearing thresholds
- price tiers
- escrow release rules
- refund rules
- slot transfer rules
- milestone logic

### 4. Data layer

Postgres is the source of truth.

No payment or escrow logic should rely only on third-party dashboard data.

### 5. Payment layer

Adapters:

- mock ledger for local development
- Circle adapter
- Arc adapter
- local payment adapter later

### 6. Operations layer

Admin tools for supplier verification, disputes, refunds, payout approvals, risk flags, and audit logs.

## Lightweight rule

Avoid heavy dependencies until the product proves the need.

Start with:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui components copied into the repo
- Prisma
- Postgres
- Zod
- TanStack Query only if client fetching becomes complex

Avoid early:

- microservices
- Kubernetes
- blockchain indexing services
- full ecommerce engines
- complex CMS
- native app before web/PWA proof

## Deployment direction

Early:

- Web/API: Vercel or Render/Fly depending API needs
- Database: Supabase Postgres or Neon
- Storage: Supabase Storage or S3-compatible

Later:

- API can be split into a standalone service if mobile/partner usage grows.
