import { fail, ok } from "@/lib/api-response";
import { batches } from "@/lib/data";
import { findBatchBySlug } from "@/lib/persistence/batch-repository";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { serializeBatch } from "@/lib/serializers/batch";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  if (useDatabasePersistence()) {
    const record = await findBatchBySlug(slug);
    if (!record) return fail({ code: "BATCH_NOT_FOUND", message: "Batch was not found." }, 404);
    return ok(serializeBatch(record), { source: "database", url: request.url });
  }

  const batch = batches.find((item) => item.slug === slug);
  if (!batch) return fail({ code: "BATCH_NOT_FOUND", message: "Batch was not found." }, 404);

  return ok(batch, { source: "seeded-demo", url: request.url });
}
