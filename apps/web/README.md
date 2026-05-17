# apps/web

Next.js web/PWA surface for Batch.

Owns:

- public website
- buyer app
- supplier portal
- operator console

## Planned route groups

```txt
/                         Public landing
/demo                     Demo batch story
/batches                  Live batches
/batches/[slug]           Batch deal room
/commit/[batchId]         Commitment flow
/app                      Buyer dashboard
/app/my-batches           Buyer commitments
/app/deliveries           Delivery tracking
/app/wallet               Wallet and payments
/supplier                 Supplier dashboard
/supplier/batches/new     Create batch
/admin                    Operator console
/admin/escrow             Escrow ledger
/admin/disputes           Dispute center
```

## Rule

This app must feel like a live deal dashboard, not an ecommerce storefront.
