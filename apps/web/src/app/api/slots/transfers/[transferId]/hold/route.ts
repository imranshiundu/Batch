import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { markSlotTransferHoldPosted } from "@/lib/persistence/slot-payment-lifecycle-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({ externalReference: z.string().min(3).max(200).optional() }).strict();

export async function POST(request: Request, context: { params: Promise<{ transferId: string }> }) {
  const botForbidden = await requireBotScope(request, "orders:create");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const { transferId } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ transferId, holdPosted: true, externalReference: parsed.data.externalReference ?? null }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const result = await markSlotTransferHoldPosted({ buyerId: user.id, transferId, externalReference: parsed.data.externalReference, idempotencyKey: idempotency.key });
    return ok(result, { source: "database", idempotencyKey: idempotency.key });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "SLOT_TRANSFER_HOLD_FAILED", message: "Slot transfer hold could not be marked posted." }, 400);
  }
}
