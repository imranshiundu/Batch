# Batch Database Plan

## Database principle

Postgres is the source of truth. Payments, escrow, refunds, delivery, and milestones must be represented as auditable records.

## Core models

### User

Represents a person or operator account.

Fields:

- id
- name
- email
- phone
- role
- status
- createdAt
- updatedAt

Roles:

- BUYER
- SUPPLIER
- OPERATOR
- ADMIN

### Supplier

Represents a supplier, producer, importer, farmer, wholesaler, or distributor.

Fields:

- id
- userId
- businessName
- country
- verificationStatus
- riskLevel
- rating
- completedBatches
- failedBatches
- bondRequired

### Batch

Represents one conditional deal.

Fields:

- id
- slug
- supplierId
- title
- summary
- category
- type
- status
- minimumUnits
- targetUnits
- committedUnits
- minimumAmount
- committedAmount
- currency
- opensAt
- deadlineAt
- estimatedDeliveryStart
- estimatedDeliveryEnd
- riskLevel
- deliveryMode
- escrowPlanId

Batch types:

- IMPORT_BATCH
- LOCAL_SUPPLY_BATCH
- MERCHANT_RESTOCK_BATCH
- COMMUNITY_BATCH
- PRIVATE_BATCH
- HARVEST_BATCH

### BatchTier

Price tiers by quantity.

Fields:

- id
- batchId
- minUnits
- unitPrice
- label

### Commitment

Buyer-backed commitment to a batch.

Fields:

- id
- batchId
- buyerId
- quantity
- unitPrice
- totalAmount
- status
- paymentStatus
- escrowStatus
- refundStatus
- cancellableUntil

Statuses:

- PENDING_PAYMENT
- ACTIVE
- CANCELLED
- LOCKED
- ALLOCATED
- DELIVERED
- REFUNDED
- DISPUTED

### OrderAllocation

The buyer's individual product allocation after a batch clears.

Fields:

- id
- batchId
- commitmentId
- buyerId
- quantity
- deliveryMode
- deliveryStatus
- trackingCode
- pickupCode
- deliveryId

### EscrowLedgerEntry

Auditable movement of value.

Fields:

- id
- batchId
- commitmentId
- milestoneId
- type
- amount
- currency
- sourceType
- sourceId
- destinationType
- destinationId
- status
- externalReference
- idempotencyKey
- createdAt

Entry types:

- BUYER_COMMITMENT_HOLD
- BUYER_COMMITMENT_CAPTURE
- PLATFORM_FEE
- SUPPLIER_MILESTONE_RELEASE
- LOGISTICS_PAYOUT
- REFUND
- SUPPLIER_BOND_HOLD
- SUPPLIER_BOND_RELEASE
- SUPPLIER_BOND_PENALTY

### Milestone

Supplier payout stage.

Fields:

- id
- batchId
- name
- sequence
- releasePercent
- requiredProofType
- status
- dueAt
- approvedAt
- releasedAt

Statuses:

- WAITING
- SUBMITTED
- APPROVED
- RELEASED
- REJECTED
- OVERDUE

### MilestoneProof

Proof uploaded for a milestone.

Fields:

- id
- milestoneId
- supplierId
- fileUrl
- proofType
- notes
- status
- reviewedBy
- reviewedAt

Proof types:

- INVOICE
- PRODUCTION_PHOTO
- INSPECTION_REPORT
- WAREHOUSE_RECEIPT
- SHIPPING_DOCUMENT
- CUSTOMS_DOCUMENT
- DELIVERY_SCAN

### Delivery

Tracks delivery or pickup.

Fields:

- id
- batchId
- carrier
- hubLocation
- status
- estimatedArrival
- actualArrival

### Dispute

Tracks buyer or operator disputes.

Fields:

- id
- batchId
- commitmentId
- buyerId
- type
- status
- reason
- resolution
- openedAt
- closedAt

### Refund

Tracks refunds.

Fields:

- id
- commitmentId
- batchId
- amount
- currency
- reason
- status
- externalReference

### Payout

Tracks supplier payouts.

Fields:

- id
- supplierId
- batchId
- milestoneId
- amount
- currency
- status
- externalReference

### BatchSlotTransfer

Allows a buyer to exit a cleared batch by transferring their allocation slot.

Fields:

- id
- batchId
- fromBuyerId
- toBuyerId
- commitmentId
- quantity
- transferAmount
- status

### PaymentEvent

Raw payment provider events.

Fields:

- id
- provider
- eventType
- externalId
- payload
- processedAt
- status

### AuditEvent

Every sensitive action.

Fields:

- id
- actorId
- actorRole
- action
- targetType
- targetId
- before
- after
- createdAt

## Data safety rules

- Do not delete payment, ledger, dispute, refund, payout, or audit records.
- Use soft cancellation statuses instead.
- Every external payment event must be stored raw.
- Every admin action must be auditable.
- Every buyer commitment must create an allocation after clearing.
