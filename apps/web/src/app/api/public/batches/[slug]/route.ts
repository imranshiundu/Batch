import { fail, ok } from "@/lib/api-response";
import { batches } from "@/lib/data";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const batch = batches.find((item) => item.slug === slug);

  if (!batch) {
    return fail({ code: "BATCH_NOT_FOUND", message: "Batch was not found." }, 404);
  }

  return ok(batch, { source: "seeded-demo", url: request.url });
}
