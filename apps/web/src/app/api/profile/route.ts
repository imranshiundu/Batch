import { ok } from "@/lib/api-response";
import { getDemoProfile } from "@/lib/services/profile-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { createAuditDraft } from "@/lib/security/audit";
import { profilePatchSchema, parseJson } from "@/lib/security/validation";

export function GET(request: Request) {
  const user = getRequestUser(request);
  return ok(getDemoProfile(user.id), { mode: "demo-profile", actor: user.id });
}

export async function PATCH(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "SUPPLIER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const parsed = await parseJson(request, profilePatchSchema);
  if (!parsed.ok) return parsed.response;

  return ok({
    ...getDemoProfile(user.id),
    requestedUpdate: parsed.data,
    audit: createAuditDraft({ actorId: user.id, actorRole: user.role, action: "PROFILE_UPDATE", targetType: "USER", targetId: user.id, after: parsed.data }),
  }, { mode: "demo-profile-update", persisted: false });
}
