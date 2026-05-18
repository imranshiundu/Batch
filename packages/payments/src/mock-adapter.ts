import type { MoneyMovementResult, PaymentAdapter, PaymentIntentRequest, PaymentIntentResult, PayoutRequest, RefundRequest } from "./types";

export function createMockPaymentAdapter(): PaymentAdapter {
  return {
    provider: "MOCK",
    async createCommitmentIntent(input: PaymentIntentRequest): Promise<PaymentIntentResult> {
      return {
        provider: "MOCK",
        externalId: `mock_intent_${stableSuffix(input.idempotencyKey)}`,
        status: "HELD",
        nextAction: {
          type: "NONE",
          message: "Mock funds held. No live money moved.",
        },
      };
    },
    async refund(input: RefundRequest): Promise<MoneyMovementResult> {
      return {
        provider: "MOCK",
        externalId: `mock_refund_${stableSuffix(input.idempotencyKey)}`,
        status: "COMPLETED",
        message: "Mock refund completed. No live money moved.",
      };
    },
    async payout(input: PayoutRequest): Promise<MoneyMovementResult> {
      return {
        provider: "MOCK",
        externalId: `mock_payout_${stableSuffix(input.idempotencyKey)}`,
        status: "COMPLETED",
        message: "Mock payout completed. No live money moved.",
      };
    },
  };
}

function stableSuffix(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").slice(-16) || "unknown";
}
