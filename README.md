# Batch

**Buy together. Pay only when the deal clears.**

Batch is an app-first conditional commerce platform. Buyers commit funds into live group deals. If enough demand forms before the deadline, the batch clears, suppliers fulfill the order, and each buyer receives their own allocation. If the deal fails, funds return automatically.

Batch is not a small-store ecommerce template. It is a deal-clearing app built around commitments, thresholds, escrow, milestones, delivery, and refunds.

## Product thesis

People already group-buy, preorder, import together, collect money in chats, and coordinate with suppliers manually. The failure is not demand. The failure is trust, timing, payment discipline, and delivery proof.

Batch turns scattered demand into committed money.

## First wedge

Start with small merchant inventory batches:

- phone accessories
- beauty stock
- electronics accessories
- school supplies
- spare parts
- tools
- uniforms

These categories are planned purchases. Waiting can create a real price advantage. Goods are easier to inspect than perishable produce.

## App surfaces

- Buyer app: live batches, commitments, wallet, delivery, refunds, disputes
- Supplier app: create batches, proof uploads, milestones, payouts, allocation
- Operator app: escrow ledger, supplier verification, dispute center, payment events, audit logs
- Public website: serious product explanation for buyers, suppliers, partners, grants, and judges

## Architecture direction

Batch is API-first so the same backend can serve web, mobile, partner integrations, and future native apps.

```txt
apps/web       Web/PWA app and public site
apps/api       API service boundary and route contracts
packages/ui    Shared app design system
packages/core  Batch state machine and business rules
packages/db    Prisma schema and seed data
packages/payments Circle, Arc, local payment adapters
packages/logistics Delivery, pickup, tracking primitives
packages/notifications Email/SMS/WhatsApp adapters
packages/config Shared TypeScript, lint, env, constants
```

## Starting template decision

Batch should start from a modern app/dashboard foundation, not an ecommerce storefront.

Recommended path:

```txt
fresh Next.js app
+ shadcn/ui blocks
+ Batch-specific dashboard screens
+ Prisma/Postgres
+ mock ledger
+ Circle/Arc adapters later
```

Read `docs/11-starting-template.md` before scaffolding UI.

## Start reading

1. `docs/00-product-brief.md`
2. `docs/01-architecture.md`
3. `docs/02-api-contract.md`
4. `docs/03-database.md`
5. `docs/04-ui-rules.md`
6. `docs/11-starting-template.md`
7. `AGENTS.md`
