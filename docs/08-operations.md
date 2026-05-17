# Batch Operations Plan

## Why operations matter

Batch handles buyer funds, supplier commitments, delivery proof, refunds, and disputes. The operator console is not optional.

## Operator responsibilities

- approve suppliers
- review batch submissions
- verify pricing logic
- review delivery plans
- monitor escrow ledger
- approve milestone releases
- process refund exceptions
- handle disputes
- suspend suppliers
- inspect payment events
- maintain audit logs

## Risk flags

A batch should be flagged when:

- supplier is new
- price discount is unrealistic
- delivery timeline is vague
- proof is overdue
- dispute rate is high
- refund rate is high
- payment webhook failed
- supplier changes terms after buyers commit
- buyer allocations do not match committed quantity

## Supplier verification levels

### Level 0: Unverified

- can draft batches
- cannot receive early release
- may require bond

### Level 1: Reviewed

- can open limited batches
- small milestone releases allowed after proof

### Level 2: Verified

- higher batch limits
- standard milestone releases

### Level 3: Trusted

- recurring batches
- faster approvals
- better payout schedule

## Dispute types

- item not received
- item damaged
- wrong quantity
- wrong specification
- delivery late
- supplier proof rejected
- refund delayed

## Operator dashboard cards

- batches closing today
- funded batches waiting supplier confirmation
- overdue milestones
- pending proof reviews
- pending payout approvals
- refund queue
- open disputes
- failed payment events

## Audit rule

Every sensitive action must write an AuditEvent:

- approving supplier
- approving batch
- pausing batch
- cancelling batch
- approving payout
- rejecting proof
- approving refund
- changing risk level
- resolving dispute
