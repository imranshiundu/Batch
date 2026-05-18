import { fail, ok } from "@/lib/api-response";
import { getBatchDepth } from "@/lib/market/market-service";

export async function GET(request: Request, context: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await context.params;
  const depth = getBatchDepth(symbol);
  if (!depth) return fail({ code: "INSTRUMENT_NOT_FOUND", message: "Batch instrument depth was not found." }, 404);

  return ok(depth, { market: "batch-commitments", url: request.url });
}
