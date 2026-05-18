import { assertTransition } from "@batch/core";
import { fail, ok } from "@/lib/api-response";
import { batches } from "@/lib/data";

type CoreStatus = Parameters<typeof assertTransition>[0];

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const body = await request.json().catch(() => null);
  const batch = batches.find((item) => item.slug === slug);

  if (!batch) return fail({ code: "BATCH_NOT_FOUND", message: "Batch was not found." }, 404);
  if (!body || typeof body.to !== "string") return fail({ code: "INVALID_TRANSITION", message: "Target status is required." }, 400);

  const from = mapStatus(batch.status);
  const to = body.to as CoreStatus;
  const transition = assertTransition(from, to);

  if (!transition.ok) return fail(transition.error, 400);

  return ok({ batchId: slug, from, to, auditRequired: true, persisted: false }, { mode: "operator-transition-demo" });
}

function mapStatus(status: string): CoreStatus {
  if (status === "OPEN") return "OPEN";
  if (status === "FUNDED") return "FUNDED";
  if (status === "ACTIVE") return "ACTIVE";
  if (status === "PRODUCTION") return "PRODUCTION";
  if (status === "SHIPPED") return "SHIPPED";
  if (status === "RECEIVED_AT_HUB") return "RECEIVED_AT_HUB";
  if (status === "FAILED") return "FAILED";
  return "OPEN";
}
