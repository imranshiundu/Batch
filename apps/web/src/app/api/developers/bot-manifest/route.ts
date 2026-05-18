import { ok } from "@/lib/api-response";

export function GET() {
  return ok({
    name: "Batch Bot Access Manifest",
    version: "0.1",
    model: "batch-commitment-market",
    description: "Bots can read batch instruments, inspect batch depth, and route buyer commitments without changing the core Batch clearing model.",
    basePath: "/api",
    auth: {
      current: "demo-role-header",
      production: "api-key-or-oauth-client",
      requiredHeaders: ["Idempotency-Key for mutating requests"],
    },
    allowedActions: [
      "READ_BATCH_INSTRUMENTS",
      "READ_BATCH_DEPTH",
      "CREATE_BUY_COMMITMENT_ORDER",
      "CREATE_SLOT_TRANSFER_INTENT_LATER",
    ],
    routes: [
      { method: "GET", path: "/market/instruments", purpose: "List tradable batch instruments." },
      { method: "GET", path: "/market/instruments/:symbol", purpose: "Read one batch instrument." },
      { method: "GET", path: "/market/instruments/:symbol/depth", purpose: "Read commitment depth and available batch capacity." },
      { method: "POST", path: "/market/orders", purpose: "Submit a market-style instruction for a batch commitment or future slot transfer." },
      { method: "GET", path: "/public/batches", purpose: "Read public batch details for app display." },
      { method: "POST", path: "/buyer/commitments", purpose: "Create the actual buyer commitment once order routing is confirmed." },
    ],
    riskRules: [
      "Bots do not custody funds directly.",
      "Bots cannot bypass batch clearing rules.",
      "Bots cannot force supplier payout.",
      "Bots cannot create live settlement without idempotency and permissions.",
      "Market orders are instructions over batch commitments, not synthetic securities.",
    ],
  }, { audience: "developers" });
}
