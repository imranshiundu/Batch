import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { createSlotBuyOrder } from "@/lib/persistence/slot-matching-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({
  batchSlug: z.string().min(1),
  quantity: z.number().int().positive(),
  limitUnitPrice: z.number().positive().optional(),
  expiresAt: z.string().datetime().optional(),
}).strict();

export async function POST(request: Request) {
  const botForbidden = await requireBotScope(request, "orders:create");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  if (!useDatabasePersistence()) {
    return ok({ id: `slot_order_${Date.now()}`, buyerId: user.id, ...parsed.data, status: "OPEN" }, { persisted: false, idempotencyKey: idempotency.key }, 201);
  }

  try {
    const result = await createSlotBuyOrder({
      buyerId: user.id,
      batchSlug: parsed.data.batchSlug,
      quantity: parsed.data.quantity,
      limitUnitPrice: parsed.data.limitUnitPrice,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    });

    return ok(result, { source: "database", idempotencyKey: idempotency.key }, 201);
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "SLOT_ORDER_CREATE_FAILED", message: "Slot order could not be created." }, 400);
  }
}
