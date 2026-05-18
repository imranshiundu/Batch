import { fail, ok } from "@/lib/api-response";
import { demoCommitments } from "@/lib/api-demo-store";
import { batches } from "@/lib/data";
import { createCommitmentService } from "@/lib/services/commitment-service";

export function GET() {
  return ok(demoCommitments, { source: "seeded-demo" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.batchId !== "string") {
    return fail({ code: "INVALID_COMMITMENT_REQUEST", message: "batchId is required." }, 400);
  }

  const batch = batches.find((item) => item.slug === body.batchId);
  if (!batch) return fail({ code: "BATCH_NOT_FOUND", message: "Batch was not found." }, 404);

  const result = await createCommitmentService({
    buyerId: "buyer_demo",
    batch: {
      id: batch.slug,
      status: batch.status === "OPEN" ? "OPEN" : "FUNDED",
      type: batch.type,
      minimumUnits: batch.minimumUnits,
      targetUnits: batch.targetUnits,
      committedUnits: batch.committedUnits,
      minimumAmount: batch.minimumUnits * batch.batchPrice,
      committedAmount: batch.committedUnits * batch.batchPrice,
      deadlineAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      riskLevel: batch.riskLevel.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "BLOCKED",
      supplierConfirmed: false,
    },
    quantity: Number(body.quantity ?? 1),
    unitPrice: batch.batchPrice,
    currency: batch.currency,
  });

  if (!result.ok) return fail(result.error, 400);
  return ok(result.data, { mode: "mock-payment" }, 201);
}
