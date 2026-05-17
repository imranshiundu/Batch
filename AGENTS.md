# Batch Agent Operating Rules

Batch will be built by multiple agents working in parallel. Every agent must keep the platform app-first, API-first, lightweight, and honest.

## Non-negotiables

1. Batch is not a small-store ecommerce site.
2. Do not build a Shopify/Jumia clone.
3. The core action is `Commit`, not `Add to cart`.
4. Every buyer commitment must map to an individual allocation.
5. Every payment movement must produce a ledger event.
6. Every batch state transition must be explicit.
7. No fake escrow language in production code.
8. No silent fallback data in production paths.
9. No bulky UI libraries unless they clearly reduce development risk.
10. Keep the system modular so web, mobile, and partner APIs can share the same backend.

## Work lanes

### Agent A — Backend/API
Owns API routes, state machines, validation, database models, payment events, and admin controls.

Must read:
- docs/01-architecture.md
- docs/02-api-contract.md
- docs/03-database.md
- docs/05-batch-state-machine.md
- docs/06-payments-arc-circle.md

### Agent B — Buyer Web/App
Owns public app shell, buyer dashboard, live batches, batch detail, commitment flow, wallet, orders, delivery, refunds, and disputes.

Must read:
- docs/00-product-brief.md
- docs/04-ui-rules.md
- docs/07-demo-data.md

### Agent C — Supplier Portal
Owns supplier dashboard, create batch flow, proof uploads, milestones, payouts, allocation view, and supplier reputation.

Must read:
- docs/02-api-contract.md
- docs/03-database.md
- docs/04-ui-rules.md

### Agent D — Operator/Admin
Owns internal control room: escrow ledger, supplier verification, batch risk, disputes, refunds, payout approvals, and audit logs.

Must read:
- docs/01-architecture.md
- docs/03-database.md
- docs/05-batch-state-machine.md
- docs/08-operations.md

### Agent E — Design/Brand
Owns SVGs, illustrations, motion rules, landing copy, empty states, icons, and visual consistency.

Must read:
- docs/04-ui-rules.md
- docs/09-brand-system.md

## Branching rules

Use one branch per work lane:

- `feature/api-core`
- `feature/buyer-app`
- `feature/supplier-portal`
- `feature/operator-console`
- `feature/design-system`
- `feature/payments-sandbox`

Never mix backend, buyer app, supplier portal, and admin changes in one PR unless the change is a shared contract update.

## PR rules

Every PR must explain:

- what changed
- which app surface it affects
- which API contract it uses or changes
- which database models it touches
- screenshots for UI work
- test notes or manual verification

## Naming rules

Use these words consistently:

- Batch
- Commitment
- Clearing
- Allocation
- Escrow Ledger
- Milestone
- Proof
- Refund
- Payout
- Slot Transfer

Avoid these words in core UX:

- cart
- checkout cart
- product store
- tokenomics
- web3 native
- revolutionize
- ecosystem

## UI rule

The app must feel like a live deal dashboard, not a shop.
