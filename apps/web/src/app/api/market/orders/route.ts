import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { validateMarketOrder } from "@/lib/market/market-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { rateLimit } from "@/lib/security/rate-limit";
import { parseJson } from "@/lib/security/validation";

const marketOrderSchema = z.object({
  symbol: z.string().min(1).max(120),
  side: z.enum(["BUY_COMMITMENT", "SELL_SLOT"]),
  orderType: z.enum(["MARKET", "LIMIT"]),
  quantity: z.number().int().positive().max(100000),
  limitPrice: z.number().positive().optional(),
}).strict();

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "market-orders", limit: 60, windowMs: 60_000 });
  if (limited) return limited;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, marketOrderSchema);
  if (!parsed.ok) return parsed.response;

  const validation = validateMarketOrder(parsed.data);
  if (!validation.ok) return fail(validation.error, 400);

  return ok({
    orderId: `mord_${Date.now()}`,
    status: "ACCEPTED_FOR_ROUTING",
    actorId: user.id,
    requested: parsed.data,
    routing: validation.data,
    nextAction: parsed.data.side === "BUY_COMMITMENT"
      ? "Route to POST /api/buyer/commitments for real commitment creation."
      : "Route to slot-transfer service once transferable slots are enabled.",
  }, { market: "batch-commitments", idempotencyKey: idempotency.key }, 202);
}
