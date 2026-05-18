# Batch Starting Template Decision

## Decision

Batch should start from a modern app/dashboard foundation, not an ecommerce storefront.

The strongest starting path is:

```txt
Next.js app shell
+ shadcn/ui blocks
+ custom Batch domain screens
+ Prisma/Postgres backend
+ API-first route contracts
+ later Expo mobile app
```

## Why not ecommerce templates

Ecommerce templates think in:

- products
- carts
- checkout
- coupons
- orders

Batch thinks in:

- commitments
- thresholds
- clearing
- escrow ledger
- supplier milestones
- buyer allocations
- refunds
- slot transfers

A store template will create wrong UX and wrong backend assumptions.

## Recommended source bases

### 1. shadcn/ui Blocks

Use for immediate app UI pieces:

- dashboard shell
- sidebar
- login/signup screens
- data tables
- charts
- cards
- forms

Why it fits:

- copy-paste components
- open-source
- clean professional look
- works with React/Next.js
- easy to strip down

How Batch uses it:

- buyer dashboard
- supplier portal
- operator console
- admin tables
- status cards
- batch timelines

Do not copy the default wording. Replace every generic dashboard concept with Batch-specific language.

### 2. satnaing/shadcn-admin

Use as visual/admin reference, not as the full codebase.

Good for:

- admin layout
- responsive sidebar
- global search
- tables
- profile/settings patterns
- operator console structure

Risk:

- it is Vite/TanStack Router, not Next.js
- it is a dashboard UI, not a full backend product

Use it for visual reference and component ideas only.

### 3. mickasmt/next-saas-stripe-starter

Use as a possible web app starter if speed matters.

Good for:

- Next.js app structure
- Auth.js
- Prisma
- Neon
- shadcn/ui
- Stripe payments
- admin/user-role foundation

Risk:

- SaaS billing and Stripe subscription logic must be removed or isolated
- Batch payment flows are not SaaS subscriptions

Use it only if we want a ready Next/Auth/Prisma shell quickly.

### 4. ixartz/SaaS-Boilerplate

Use only if we need a mature full-stack foundation.

Good for:

- auth
- roles and permissions
- multi-tenancy
- testing
- logging
- i18n
- landing pages

Risk:

- heavier than Batch needs right now
- multi-tenancy and i18n can slow the first prototype

Use later or cherry-pick patterns.

### 5. Tremor Blocks

Use for operational analytics and admin views.

Good for:

- KPI cards
- charts
- tables
- status monitoring
- financial dashboards

Use for:

- escrow ledger dashboard
- batch risk dashboard
- payment event monitoring
- supplier performance metrics

### 6. Magic UI

Use lightly for public landing page polish.

Good for:

- subtle animations
- landing components
- micro-interactions

Risk:

- easy to overdo
- Batch should not look like a hype site

Use only for restrained movement.

### 7. Expo Router / React Native template later

Do not start native on day one.

Start with a mobile-first web/PWA. Once the core loop works, create `apps/mobile` with Expo Router and shared API contracts.

Possible mobile base:

- Expo Router official setup
- Obytes React Native template if a serious mobile scaffold is needed

## Final build recommendation

Do not clone one repo wholesale.

Use this hybrid:

```txt
1. Start with a fresh Next.js app in apps/web.
2. Add shadcn/ui.
3. Import shadcn dashboard/sidebar/login blocks.
4. Build Batch-specific screens from the first day.
5. Add Prisma/Postgres and core state machine.
6. Add mock ledger before real Circle/Arc payment integration.
7. Add Expo mobile only after the web/PWA proves the loop.
```

## First UI screens to scaffold

```txt
/                         Landing page
/demo                     Demo scenario
/app                      Buyer dashboard
/batches                  Live batches
/batches/[slug]           Batch deal room
/commit/[batchId]         Commit flow
/app/my-batches           My commitments
/app/wallet               Wallet and escrow
/app/deliveries           Delivery tracking
/supplier                 Supplier dashboard
/supplier/batches/new     Create batch
/admin                    Operator console
/admin/escrow             Escrow ledger
/admin/disputes           Disputes
```

## UI reference direction

The app should feel like:

```txt
Circle + Linear + Cash App + Flexport operations dashboard
```

Not:

```txt
Shopify + Jumia + Amazon + Kickstarter
```

## Hard rule for agents

Agents may use templates for shell, layout, and components.

Agents may not import store/cart/checkout assumptions into Batch's core product.
