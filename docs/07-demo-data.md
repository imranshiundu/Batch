# Demo Data Plan

## Purpose

Demo data must make Batch feel like a real app without pretending that live payments or live suppliers exist.

Use seeded examples that show the whole workflow.

## Demo batches

### 1. Shenzhen Charger Restock

Type: Import Batch

- Product: 20W fast chargers
- Supplier: Shenzhen verified exporter
- Normal local price: 8.00 USD
- Batch price: 4.20 USD
- Minimum: 500 units
- Target: 1,000 units
- Committed: 382 units
- Deadline: 2 days left
- Delivery: Nairobi hub or direct delivery
- Status: OPEN

### 2. School Uniform Batch

Type: Local Supply Batch

- Product: school uniform sets
- Supplier: local garment workshop
- Minimum: 200 sets
- Target: 600 sets
- Status: FUNDED
- Delivery: school pickup hub

### 3. Salon Beauty Stock

Type: Merchant Restock Batch

- Product: hair oils and salon consumables
- Supplier: regional distributor
- Minimum: 150 cartons
- Status: ACTIVE
- Milestone: supplier confirmation complete

### 4. Solar Lantern Community Batch

Type: Community Batch

- Product: solar lanterns
- Minimum: 100 units
- Status: PRODUCTION
- Delivery: estate pickup point

### 5. Spare Parts Import Batch

Type: Import Batch

- Product: motorcycle brake pads
- Minimum: 1,000 units
- Status: SHIPPED
- Delivery: merchant allocation

## Demo users

- Buyer: small shop owner
- Buyer: parent group representative
- Supplier: importer
- Supplier: local producer
- Operator: Batch admin

## Demo states to show

- open batch
- funded batch
- active batch
- production proof uploaded
- shipped batch
- hub received
- delivery allocation
- failed batch refund

## Seed data rule

Seed data should be obviously demo data in code and admin screens.

Never label fake suppliers as real verified businesses.
