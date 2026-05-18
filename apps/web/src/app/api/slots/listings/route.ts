import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { createSlotListing } from "@/lib/persistence/slot-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({
  slotId: z.string().min(1),
  quantity: z.number().int().positive(),
  askUnitPrice: z.number().positive(),
  expiresAt: z.string().datetime().optional(),
}).strict();

export async function POST(request: Request) {
  const botForbidden = await requireBotScope(request, "slots:listings:create");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  if (!useDatabasePersistence()) {
    return ok({ id: `slot_listing_${Date.now()}`, sellerId: user.id, ...parsed.data, status: "OPEN" }, { persisted: false, idempotencyKey: idempotency.key }, 201);
  }

  try {
    const listing = await createSlotListing({
      sellerId: user.id,
      slotId: parsed.data.slotId,
      quantity: parsed.data.quantity,
      askUnitPrice: parsed.data.askUnitPrice,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    });
    return ok(listing, { source: "database", idempotencyKey: idempotency.key }, 201);
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "SLOT_LISTING_FAILED", message: "Slot listing could not be created." }, 400);
  }
}
