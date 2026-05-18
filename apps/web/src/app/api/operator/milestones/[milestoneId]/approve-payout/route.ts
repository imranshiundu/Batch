import { fail, ok } from "@/lib/api-response";
import { approveMilestonePayout } from "@/lib/persistence/settlement-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";
import { z } from "zod";

const schema = z.object({ reason: z.string().min(5).max(1000).optional() }).strict();

export async function POST(request: Request, context: { params: Promise<{ milestoneId: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const { milestoneId } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ milestoneId, status: "APPROVED", payoutStatus: "PENDING", reason: parsed.data.reason ?? null }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const result = await approveMilestonePayout({ actorId: user.id, milestoneId, reason: parsed.data.reason });
    return ok(result, { source: "database", persisted: true, idempotencyKey: idempotency.key });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "PAYOUT_APPROVAL_FAILED", message: "Milestone payout could not be approved." }, 400);
  }
}
