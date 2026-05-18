import { fail, ok } from "@/lib/api-response";
import { demoDisputes } from "@/lib/api-demo-store";

export function GET() {
  return ok(demoDisputes, { source: "seeded-demo" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.batchId !== "string" || typeof body.reason !== "string") {
    return fail({ code: "INVALID_DISPUTE", message: "batchId and reason are required." }, 400);
  }
  return ok({ id: `dispute_${Date.now()}`, status: "OPEN", ...body }, { persisted: false }, 201);
}
