import { fail, ok } from "@/lib/api-response";
import { completeHeldSlotTransfer } from "@/lib/persistence/slot-payment-lifecycle-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";
import { requireIdempotencyKey } from "@/lib/security/idempotency";

export async function POST(request: Request, context: { params: Promise<{ transferId: string }> }) {
  const botForbidden = await requireBotScope(request, "orders:create");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const { transferId } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ transferId, status: "COMPLETED" }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const result = await completeHeldSlotTransfer({ buyerId: user.id, transferId, idempotencyKey: idempotency.key });
    return ok(result, { source: "database", idempotencyKey: idempotency.key });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "SLOT_TRANSFER_COMPLETE_FAILED", message: "Slot transfer could not be completed." }, 400);
  }
}
