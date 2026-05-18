import { ok } from "@/lib/api-response";

export function GET() {
  return ok({
    name: "Batch Bot Access Manifest",
    version: "0.2",
    model: "batch-slot-market",
    description: "Bots can read batch instruments, inspect depth, create commitment instructions, and manage transferable batch slots without changing the core Batch clearing model.",
    basePath: "/api",
    auth: {
      current: "demo-role-header",
      production: "api-key-or-oauth-client",
      requiredHeaders: ["Idempotency-Key for mutating requests"],
    },
    tradingObject: {
      name: "Batch Slot",
      meaning: "A transferable allocation right inside a real batch, tied to quantity, entry price, delivery rights, refund rules, and batch status.",
      forbidden: "No naked price exposure, no synthetic token, no trade detached from delivery rights.",
    },
    allowedActions: [
      "READ_BATCH_INSTRUMENTS",
      "READ_BATCH_DEPTH",
      "CREATE_BUY_COMMITMENT_ORDER",
      "READ_USER_SLOTS",
      "CREATE_SLOT_LISTING",
      "CANCEL_OPEN_SLOT_ORDER",
      "READ_SLOT_PNL",
    ],
    routes: [
      { method: "GET", path: "/market/instruments", purpose: "List tradable batch instruments." },
      { method: "GET", path: "/market/instruments/:symbol", purpose: "Read one batch instrument." },
      { method: "GET", path: "/market/instruments/:symbol/depth", purpose: "Read commitment depth and available batch capacity." },
      { method: "POST", path: "/market/orders", purpose: "Submit a market-style instruction for a batch commitment or slot transfer." },
      { method: "GET", path: "/slots", purpose: "Read owned batch slots." },
      { method: "POST", path: "/slots/listings", purpose: "List an owned slot for transfer before delivery lock." },
      { method: "POST", path: "/slots/orders/:orderId/cancel", purpose: "Cancel an open or partially filled slot order." },
      { method: "GET", path: "/slots/pnl", purpose: "Read realized and listed-slot P/L." },
      { method: "GET", path: "/profile/delivery", purpose: "Read delivery profiles." },
      { method: "POST", path: "/profile/delivery", purpose: "Create delivery profile used for commitment snapshots." },
    ],
    riskRules: [
      "Bots do not custody funds directly.",
      "Bots cannot bypass batch clearing rules.",
      "Bots cannot force supplier payout.",
      "Bots cannot create live settlement without idempotency and permissions.",
      "Slots must map to a real batch, real quantity, delivery rights, and refund path.",
      "Transfers close once the batch reaches delivery lock.",
    ],
  }, { audience: "developers" });
}
