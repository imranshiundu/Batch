import { ok } from "@/lib/api-response";
import { batches } from "@/lib/data";

export function GET() {
  return ok(batches, { source: "seeded-demo", count: batches.length });
}
