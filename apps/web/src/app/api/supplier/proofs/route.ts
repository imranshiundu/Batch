import { fail, ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { submitMilestoneProof } from "@/lib/persistence/proof-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson, proofSubmissionSchema } from "@/lib/security/validation";

export async function POST(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["SUPPLIER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, proofSubmissionSchema);
  if (!parsed.ok) return parsed.response;

  if (useDatabasePersistence()) {
    const proof = await submitMilestoneProof({ supplierUserId: user.id, ...parsed.data });
    return ok(proof, { source: "database", persisted: true, idempotencyKey: idempotency.key }, 201);
  }

  if (!parsed.data.milestoneId || !parsed.data.proofType) {
    return fail({ code: "INVALID_PROOF_SUBMISSION", message: "milestoneId and proofType are required." }, 400);
  }

  return ok({ id: `proof_${Date.now()}`, supplierId: user.id, milestoneId: parsed.data.milestoneId, proofType: parsed.data.proofType, status: "SUBMITTED", notes: parsed.data.notes ?? null }, { persisted: false, idempotencyKey: idempotency.key }, 201);
}
