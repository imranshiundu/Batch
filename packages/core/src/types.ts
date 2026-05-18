export type BatchStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "OPEN"
  | "FUNDED"
  | "SUPPLIER_CONFIRMING"
  | "ACTIVE"
  | "PRODUCTION"
  | "SHIPPED"
  | "RECEIVED_AT_HUB"
  | "ALLOCATING"
  | "DELIVERING"
  | "DELIVERED"
  | "SETTLED"
  | "FAILED"
  | "REFUNDING"
  | "REFUNDED"
  | "DISPUTED"
  | "CANCELLED";

export type BatchType =
  | "IMPORT_BATCH"
  | "LOCAL_SUPPLY_BATCH"
  | "MERCHANT_RESTOCK_BATCH"
  | "COMMUNITY_BATCH"
  | "PRIVATE_BATCH"
  | "HARVEST_BATCH";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "BLOCKED";

export type CommitmentStatus =
  | "PENDING_PAYMENT"
  | "ACTIVE"
  | "CANCELLED"
  | "LOCKED"
  | "ALLOCATED"
  | "DELIVERED"
  | "REFUNDED"
  | "DISPUTED";

export type LedgerEntryType =
  | "BUYER_COMMITMENT_HOLD"
  | "BUYER_COMMITMENT_CAPTURE"
  | "PLATFORM_FEE"
  | "SUPPLIER_MILESTONE_RELEASE"
  | "LOGISTICS_PAYOUT"
  | "REFUND"
  | "SUPPLIER_BOND_HOLD"
  | "SUPPLIER_BOND_RELEASE"
  | "SUPPLIER_BOND_PENALTY";

export type LedgerStatus = "PENDING" | "POSTED" | "FAILED" | "REVERSED";

export type MilestoneStatus =
  | "WAITING"
  | "SUBMITTED"
  | "APPROVED"
  | "RELEASED"
  | "REJECTED"
  | "OVERDUE";

export type ProofType =
  | "INVOICE"
  | "PRODUCTION_PHOTO"
  | "INSPECTION_REPORT"
  | "WAREHOUSE_RECEIPT"
  | "SHIPPING_DOCUMENT"
  | "CUSTOMS_DOCUMENT"
  | "DELIVERY_SCAN";

export type BatchSnapshot = {
  id: string;
  status: BatchStatus;
  type: BatchType;
  minimumUnits: number;
  targetUnits: number;
  committedUnits: number;
  minimumAmount: number;
  committedAmount: number;
  deadlineAt: Date;
  supplierConfirmationDueAt?: Date;
  riskLevel: RiskLevel;
  supplierConfirmed: boolean;
};

export type CommitmentInput = {
  buyerId: string;
  batchId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  now: Date;
};

export type LedgerEntryInput = {
  batchId: string;
  commitmentId?: string;
  milestoneId?: string;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  sourceType: string;
  sourceId: string;
  destinationType: string;
  destinationId: string;
  idempotencyKey: string;
};

export type MilestoneRule = {
  id: string;
  name: string;
  sequence: number;
  releasePercent: number;
  requiredProofType: ProofType;
  status: MilestoneStatus;
  dueAt: Date;
};

export type DomainResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: DomainError };

export type DomainError = {
  code: string;
  message: string;
  detail?: Record<string, unknown>;
};
