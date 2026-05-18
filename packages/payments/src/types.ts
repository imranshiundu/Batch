export type PaymentProvider = "MOCK" | "CIRCLE" | "ARC" | "LOCAL_RAIL";

export type PaymentIntentRequest = {
  buyerId: string;
  commitmentId: string;
  batchId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
};

export type PaymentIntentResult = {
  provider: PaymentProvider;
  externalId: string;
  status: "INTENT_CREATED" | "HELD" | "FAILED";
  nextAction?: {
    type: "REDIRECT" | "DISPLAY_INSTRUCTIONS" | "NONE";
    url?: string;
    message?: string;
  };
};

export type RefundRequest = {
  refundId: string;
  commitmentId: string;
  batchId: string;
  buyerId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
};

export type PayoutRequest = {
  payoutId: string;
  supplierId: string;
  batchId: string;
  milestoneId?: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
};

export type MoneyMovementResult = {
  provider: PaymentProvider;
  externalId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  message?: string;
};

export type PaymentAdapter = {
  provider: PaymentProvider;
  createCommitmentIntent(input: PaymentIntentRequest): Promise<PaymentIntentResult>;
  refund(input: RefundRequest): Promise<MoneyMovementResult>;
  payout(input: PayoutRequest): Promise<MoneyMovementResult>;
};
