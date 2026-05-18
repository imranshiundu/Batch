import { fail, ok } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.milestoneId !== "string" || typeof body.proofType !== "string") {
    return fail({ code: "INVALID_PROOF_SUBMISSION", message: "milestoneId and proofType are required." }, 400);
  }

  return ok({ id: `proof_${Date.now()}`, supplierId: "supplier_demo", milestoneId: body.milestoneId, proofType: body.proofType, status: "SUBMITTED", notes: body.notes ?? null }, { persisted: false }, 201);
}
