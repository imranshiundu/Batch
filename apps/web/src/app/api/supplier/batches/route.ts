import { fail, ok } from "@/lib/api-response";
import { batches } from "@/lib/data";

export function GET() {
  return ok(batches.map((batch) => ({ ...batch, supplierEditable: batch.status === "OPEN" || batch.status === "FUNDED" })), { source: "seeded-demo" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string") {
    return fail({ code: "INVALID_BATCH_DRAFT", message: "title is required to create a supplier batch draft." }, 400);
  }

  const draft = {
    id: `draft_${Date.now()}`,
    status: "DRAFT",
    supplierId: "supplier_demo",
    title: body.title,
    summary: body.summary ?? "Draft batch pending supplier completion and operator review.",
    type: body.type ?? "MERCHANT_RESTOCK_BATCH",
    minimumUnits: Number(body.minimumUnits ?? 0),
    targetUnits: Number(body.targetUnits ?? body.minimumUnits ?? 0),
    currency: body.currency ?? "USD",
    deliveryMode: body.deliveryMode ?? "UNSET",
  };

  return ok(draft, { persisted: false, next: "complete-pricing-delivery-milestones" }, 201);
}
