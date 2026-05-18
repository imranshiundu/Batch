import { fail, ok } from "@/lib/api-response";
import { allocateBatchDeliveries } from "@/lib/persistence/delivery-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";
import { z } from "zod";

const schema = z.object({
  carrier: z.string().min(2).max(120).optional(),
  hubLocation: z.string().min(2).max(160).optional(),
}).strict();

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const { slug } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ batchId: slug, status: "DELIVERING", allocationsCreated: 0, carrier: parsed.data.carrier ?? null, hubLocation: parsed.data.hubLocation ?? null }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const result = await allocateBatchDeliveries({ actorId: user.id, batchSlug: slug, ...parsed.data });
    return ok(result, { source: "database", persisted: true, idempotencyKey: idempotency.key });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "DELIVERY_ALLOCATION_FAILED", message: "Delivery allocation could not be completed." }, 400);
  }
}
