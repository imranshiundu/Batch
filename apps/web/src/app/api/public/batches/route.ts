import { ok } from "@/lib/api-response";
import { batches } from "@/lib/data";
import { listOpenBatches } from "@/lib/persistence/batch-repository";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { serializeBatch } from "@/lib/serializers/batch";

export async function GET() {
  if (useDatabasePersistence()) {
    const records = await listOpenBatches();
    return ok(records.map(serializeBatch), { source: "database", count: records.length });
  }

  return ok(batches, { source: "seeded-demo", count: batches.length });
}
