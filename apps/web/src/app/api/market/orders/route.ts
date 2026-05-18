import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { batches } from "@/lib/data";
import { validateMarketOrder } from "@/lib/market/market-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { createCommitmentService } from "@/lib/services/commitment-service";
import { createPersistentCommitment } from "@/lib/services/persistent-commitment-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { rateLimit } from "@/lib/security/rate-limit";
import { parseJson } from "@/lib/security/validation";

const marketOrderSchema = z.object({
  symbol: z.string().min(1).max(120),
  side: z.enum(["BUY_COMMITMENT", "SELL_SLOT"]),
  orderType: z.enum(["MARKET", "LIMIT"]),
  quantity: z.number().int().positive().max(100000),
  limitPrice: z.number().positive().optional(),
  deliveryProfileId: z.string().min(1).optional(),
}).strict();

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "market-orders", limit: 60, windowMs: 60_000 });
  if (limited) return limited;

  const botForbidden = await requireBotScope(request, "orders:create");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, marketOrderSchema);
  if (!parsed.ok) return parsed.response;

  const validation = validateMarketOrder(parsed.data);
  if (!validation.ok) return fail(validation.error, 400);

  const { instrument } = validation.data;

  if (parsed.data.orderType === "LIMIT" && parsed.data.limitPrice !== undefined && parsed.data.limitPrice < instrument.lastUnitPrice) {
    return fail({ code: "LIMIT_PRICE_NOT_FILLABLE", message: "Limit price is below the current batch unit price." }, 400);
  }

  if (parsed.data.side === "SELL_SLOT") {
    return fail({
      code: "SLOT_SELL_REQUIRES_SLOT_LISTING",
      message: "Selling a slot requires an owned slotId. Use POST /api/slots/listings so the sale stays tied to a real slot, quantity, delivery right, and refund path.",
    }, 409);
  }

  if (useDatabasePersistence()) {
    const routed = await createPersistentCommitment({
      idempotencyKey: idempotency.key,
      buyerId: user.id,
      batchSlug: instrument.batchSlug,
      quantity: parsed.data.quantity,
      deliveryProfileId: parsed.data.deliveryProfileId,
    });

    if (!routed.ok) return fail(routed.error, 400);

    return ok({
      orderId: `mord_${Date.now()}`,
      status: routed.replayed ? "REPLAYED_COMMITMENT" : "FILLED_AS_COMMITMENT",
      actorId: user.id,
      requested: parsed.data,
      routing: validation.data,
      result: routed.data,
    }, { market: "batch-commitments", source: "database", idempotencyKey: idempotency.key }, routed.replayed ? 200 : 201);
  }

  const batch = batches.find((item) => item.slug === instrument.batchSlug);
  if (!batch) return fail({ code: "BATCH_NOT_FOUND", message: "Batch was not found." }, 404);

  const result = await createCommitmentService({
    buyerId: user.id,
    batch: {
      id: batch.slug,
      status: batch.status === "OPEN" ? "OPEN" : "FUNDED",
      type: batch.type,
      minimumUnits: batch.minimumUnits,
      targetUnits: batch.targetUnits,
      committedUnits: batch.committedUnits,
      minimumAmount: batch.minimumUnits * batch.batchPrice,
      committedAmount: batch.committedUnits * batch.batchPrice,
      deadlineAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      riskLevel: batch.riskLevel.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "BLOCKED",
      supplierConfirmed: false,
    },
    quantity: parsed.data.quantity,
    unitPrice: batch.batchPrice,
    currency: batch.currency,
  });

  if (!result.ok) return fail(result.error, 400);

  return ok({
    orderId: `mord_${Date.now()}`,
    status: "FILLED_AS_COMMITMENT",
    actorId: user.id,
    requested: parsed.data,
    routing: validation.data,
    result: result.data,
  }, { market: "batch-commitments", source: "seeded-demo", idempotencyKey: idempotency.key }, 201);
}
