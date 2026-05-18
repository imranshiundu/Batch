import { ok } from "@/lib/api-response";
import { getDemoProfile } from "@/lib/services/profile-service";

export function GET() {
  return ok(getDemoProfile(), { mode: "demo-profile" });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  return ok({ ...getDemoProfile(), requestedUpdate: body }, { mode: "demo-profile-update", persisted: false });
}
