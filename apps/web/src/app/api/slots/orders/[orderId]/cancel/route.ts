import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { cancelSlotOrder } from "@/lib/persistence/slot-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({ reason: z.string().min(3).max(500).optional() }).strict();

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const botForbidden = await requireBotScope(request, "orders:cancel");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const { orderId } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ orderId, status: "CANCELLED", reason: parsed.data.reason ?? null }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const order = await cancelSlotOrder({ actorId: user.id, orderId, reason: parsed.data.reason });
    return ok(order, { source: "database", idempotencyKey: idempotency.key });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "SLOT_ORDER_CANCEL_FAILED", message: "Slot order could not be cancelled." }, 400);
  }
}
