# packages/payments

Payment adapters for Batch.

Planned adapters:

- mock ledger adapter
- Circle adapter
- Arc adapter
- local payment adapter later

Rules:

- every payment event must be recorded
- every write must be idempotent
- never release funds without a milestone rule
- never refund without a ledger entry
