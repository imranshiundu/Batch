# Batch User Flows

Batch has three primary users: buyer, supplier, and operator. The product only works if their flows are coordinated by the backend state machine.

## Flow 1: Buyer joins a live batch

```txt
Buyer opens app
→ views live batches
→ opens batch deal room
→ reviews price, threshold, deadline, supplier, delivery, escrow, refund rules
→ chooses quantity
→ receives commitment quote
→ creates payment intent
→ funds are held or captured by provider
→ ledger entry is created
→ commitment becomes ACTIVE
→ batch progress updates
```

Backend rules:

- batch must be OPEN or FUNDED
- deadline must not have passed
- risk level must not be BLOCKED
- quantity must be positive
- price must come from current batch tier
- every commitment must create a ledger draft
- payment event must be stored before state mutation

## Flow 2: Batch clears

```txt
Commitments reach minimum units and minimum amount
→ batch status changes OPEN → FUNDED
→ buyer commitments lock
→ supplier confirmation window starts
→ operator can watch confirmation risk
```

Backend rules:

- committedUnits >= minimumUnits
- committedAmount >= minimumAmount
- transition must pass state machine
- locked commitments cannot be cancelled directly
- buyer cancellation now requires refund/slot-transfer rules

## Flow 3: Supplier confirms

```txt
Supplier receives funded batch alert
→ confirms price, quantity, and delivery timeline
→ batch status changes FUNDED → SUPPLIER_CONFIRMING → ACTIVE
→ milestone clock starts
```

Backend rules:

- supplier must be verified enough for batch risk level
- confirmation must happen before deadline
- no supplier payout happens at confirmation unless milestone plan allows it
- confirmation creates audit event

## Flow 4: Supplier submits proof

```txt
Supplier opens milestone
→ uploads required proof
→ proof becomes SUBMITTED
→ operator reviews proof
→ milestone becomes APPROVED or REJECTED
```

Backend rules:

- proof type must match milestone required proof type
- rejected proof does not release funds
- overdue proof flags the batch
- all reviews must be audited

## Flow 5: Milestone payout release

```txt
Operator approves milestone
→ backend calculates release amount
→ ledger entry is created
→ payout record is created
→ payment adapter attempts release
→ payment event is stored
→ milestone becomes RELEASED after confirmation
```

Backend rules:

- milestone must be APPROVED
- release percentage must be part of valid 100% milestone plan
- release cannot exceed available escrow
- release must be idempotent
- every external payment response is stored

## Flow 6: Delivery allocation

```txt
Goods arrive or delivery is ready
→ backend creates buyer allocations from commitments
→ allocation receives delivery status
→ buyer sees tracking or pickup code
→ buyer confirms delivery
→ allocation becomes DELIVERED
```

Backend rules:

- every active commitment gets an allocation
- allocation quantity must match commitment quantity
- pickup codes must be unique
- delivery confirmation is per buyer allocation, not per bulk batch

## Flow 7: Failed batch refund

```txt
Batch misses threshold or supplier confirmation fails
→ batch status changes FAILED
→ refund plan is created
→ ledger refund entries are created
→ payment adapter processes refunds
→ refund events stored
→ batch becomes REFUNDED when complete
```

Backend rules:

- no silent failure
- no manual money movement outside ledger
- every refund must connect to commitment and batch
- failed refunds enter retry queue

## Flow 8: Buyer dispute

```txt
Buyer opens dispute
→ dispute links to batch and commitment
→ operator reviews evidence
→ resolution updates refund, delivery, payout, or supplier risk
```

Backend rules:

- dispute cannot be orphaned
- supplier payout may be paused during relevant dispute
- resolution must be audited
- repeat dispute patterns affect supplier risk

## Flow 9: Slot transfer

```txt
Buyer cannot wait after batch clears
→ buyer lists allocation slot for transfer
→ another buyer accepts
→ transfer payment settles
→ allocation ownership updates
```

Backend rules:

- only locked/allocated commitments can transfer
- transfer does not change supplier quantity
- original buyer exits without forcing batch refund
- platform must record transfer amount and ownership change

## Flow 10: Operator risk intervention

```txt
Operator sees risk flag
→ pauses batch or supplier
→ reviews proof, payment event, or dispute
→ resumes, fails, refunds, or escalates
```

Backend rules:

- every intervention writes AuditEvent
- paused batches cannot accept new commitments unless explicitly resumed
- payout release must stop when risk is BLOCKED
