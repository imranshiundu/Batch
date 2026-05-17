# Batch Build Phases

## Phase 0: Foundation

Goal: make the repo safe for multi-agent vibecoding.

Deliverables:

- product brief
- architecture plan
- API contract
- database plan
- UI rules
- state machine
- payments plan
- operations plan
- brand system
- workspace skeleton
- PR and issue templates

## Phase 1: App prototype

Goal: make Batch visible and reviewable.

Deliverables:

- public landing page
- buyer dashboard
- live batches page
- batch detail deal room
- commitment flow
- my commitments
- supplier dashboard
- create batch wizard
- operator console shell
- seeded demo data
- SVG illustrations
- light animations

No live payments.

## Phase 2: Domain logic

Goal: make the product rules real.

Deliverables:

- batch state machine
- commitment logic
- threshold clearing
- price tiers
- deadline jobs
- buyer allocations
- refund simulation
- milestone logic
- audit event model

## Phase 3: Database and API

Goal: make the app data-driven.

Deliverables:

- Prisma schema
- Postgres setup
- API routes
- validation
- auth roles
- seed data
- admin controls

## Phase 4: Payment sandbox

Goal: prove escrow-like money movement safely.

Deliverables:

- mock ledger
- Circle sandbox adapter
- Arc sandbox adapter
- payment events
- refund path
- milestone release path
- supplier payout path

## Phase 5: Pilot operations

Goal: test one real-world wedge.

Pilot category:

- small merchant inventory batches

Deliverables:

- supplier verification flow
- proof upload
- delivery allocation
- hub pickup
- dispute flow
- refund exceptions
- supplier reputation

## Phase 6: Growth surfaces

Goal: expand without bloating the core.

Possible additions:

- private batches
- invite-only groups
- supplier bonds
- slot transfers
- WhatsApp notifications
- mobile app
- partner API
- logistics partner portal
- analytics dashboard

## Rule

Do not add features before the phase that needs them.
