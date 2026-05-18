import { ok } from "@/lib/api-response";
import { getDemoProfile } from "@/lib/services/profile-service";

export function GET() {
  return ok(getDemoProfile("supplier_demo"), { verification: "UNVERIFIED", riskLevel: "MEDIUM" });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  return ok({ profile: getDemoProfile("supplier_demo"), requestedUpdate: body }, { persisted: false });
}
