import { ok } from "@/lib/api-response";
import { describeBotScopes } from "@/lib/security/bot-scopes";

export function GET() {
  return ok({
    name: "Batch Bot Access Manifest",
    version: "0.4",
    model: "batch-slot-market",
    description: "Bots can read batch instruments, inspect depth, create commitment instructions, and manage transferable batch slots without changing the core Batch clearing model.",
    basePath: "/api",
    auth: {
      current: "demo-role-header plus optional x-batch-bot-key or x-batch-bot-scopes",
      production: "api-key-or-oauth-client",
      requiredHeaders: ["Idempotency-Key for mutating requests"],
      scopes: describeBotScopes(),
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
      "CREATE_SLOT_BUY_ORDER",
      "RESERVE_MATCHED_SLOT_ORDER",
      "CREATE_SLOT_LISTING",
      "PURCHASE_SLOT_LISTING",
      "MARK_SLOT_TRANSFER_HOLD_POSTED",
      "COMPLETE_HELD_SLOT_TRANSFER",
      "CANCEL_OPEN_SLOT_ORDER",
      "READ_SLOT_PNL",
      "READ_DELIVERY_PROFILES",
      "CREATE_DELIVERY_PROFILE"
    ],
    routes: [
      { method: "GET", path: "/market/instruments", scope: "market:read", purpose: "List tradable batch instruments." },
      { method: "GET", path: "/market/instruments/:symbol", scope: "market:read", purpose: "Read one batch instrument." },
      { method: "GET", path: "/market/instruments/:symbol/depth", scope: "market:depth:read", purpose: "Read commitment depth and available batch capacity." },
      { method: "POST", path: "/market/orders", scope: "orders:create", purpose: "Route a buy commitment into the commitment pipeline. Slot sales must use slot listing routes." },
      { method: "GET", path: "/slots", scope: "slots:read", purpose: "Read owned batch slots." },
      { method: "POST", path: "/slots/orders", scope: "orders:create", purpose: "Create a slot buy order tied to a batch." },
      { method: "POST", path: "/slots/orders/:orderId/reserve", scope: "orders:create", purpose: "Reserve a matched slot order before payment hold." },
      { method: "POST", path: "/slots/orders/:orderId/cancel", scope: "orders:cancel", purpose: "Cancel an open or partially filled slot order." },
      { method: "POST", path: "/slots/listings", scope: "slots:listings:create", purpose: "List an owned slot for transfer before delivery lock." },
      { method: "POST", path: "/slots/listings/:listingId/purchase", scope: "slots:listings:purchase", purpose: "Purchase a listed batch slot and attach buyer delivery snapshot." },
      { method: "POST", path: "/slots/transfers/:transferId/hold", scope: "orders:create", purpose: "Record that a transfer payment hold has been posted." },
      { method: "POST", path: "/slots/transfers/:transferId/complete", scope: "orders:create", purpose: "Complete a held transfer and move slot ownership." },
      { method: "GET", path: "/slots/pnl", scope: "slots:pnl:read", purpose: "Read realized and listed-slot P/L." },
      { method: "GET", path: "/profile/delivery", scope: "delivery:read", purpose: "Read delivery profiles." },
      { method: "POST", path: "/profile/delivery", scope: "delivery:write", purpose: "Create delivery profile used for commitment snapshots." },
    ],
    riskRules: [
      "Bots do not custody funds directly.",
      "Bots cannot bypass batch clearing rules.",
      "Bots cannot force supplier payout.",
      "Bots cannot create live provider settlement without idempotency and permissions.",
      "Slots must map to a real batch, real quantity, delivery rights, and refund path.",
      "Transfers close once the batch reaches delivery lock.",
      "Market sell orders intentionally route to slot listings instead of naked sell exposure."
    ],
  }, { audience: "developers" });
}
