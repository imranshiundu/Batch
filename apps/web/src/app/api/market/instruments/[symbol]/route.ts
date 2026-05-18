import { fail, ok } from "@/lib/api-response";
import { findInstrumentBySlug } from "@/lib/market/market-service";

export async function GET(request: Request, context: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await context.params;
  const instrument = findInstrumentBySlug(symbol);
  if (!instrument) return fail({ code: "INSTRUMENT_NOT_FOUND", message: "Batch instrument was not found." }, 404);

  return ok(instrument, { market: "batch-commitments", url: request.url });
}
