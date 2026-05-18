import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { completeSlotListingPurchase } from "@/lib/persistence/slot-transfer-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({ deliveryProfileId: z.string().min(1).optional() }).strict();

export async function POST(request: Request, context: { params: Promise<{ listingId: string }> }) {
  const botForbidden = requireBotScope(request, "slots:listings:purchase");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const { listingId } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ listingId, buyerId: user.id, status: "COMPLETED", deliveryProfileId: parsed.data.deliveryProfileId ?? null }, { persisted: false, idempotencyKey: idempotency.key }, 201);
  }

  try {
    const result = await completeSlotListingPurchase({
      buyerId: user.id,
      listingId,
      deliveryProfileId: parsed.data.deliveryProfileId,
      idempotencyKey: idempotency.key,
    });

    return ok(result, { source: "database", idempotencyKey: idempotency.key }, 201);
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "SLOT_PURCHASE_FAILED", message: "Slot listing could not be purchased." }, 400);
  }
}
