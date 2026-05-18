import { fail, ok } from "@/lib/api-response";
import { reserveMatchedSlotOrder } from "@/lib/persistence/slot-order-lifecycle-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";
import { requireIdempotencyKey } from "@/lib/security/idempotency";

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const botForbidden = await requireBotScope(request, "orders:create");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const { orderId } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ orderId, status: "RESERVED", transferStatus: "HELD" }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const result = await reserveMatchedSlotOrder({ buyerId: user.id, orderId, idempotencyKey: idempotency.key });
    return ok(result, { source: "database", idempotencyKey: idempotency.key }, 201);
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "SLOT_ORDER_RESERVE_FAILED", message: "Slot order could not be reserved." }, 400);
  }
}
