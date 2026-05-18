import { fail, ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { findUserProfile, updateUserProfile } from "@/lib/persistence/profile-repository";
import { getDemoProfile } from "@/lib/services/profile-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { createAuditDraft } from "@/lib/security/audit";
import { profilePatchSchema, parseJson } from "@/lib/security/validation";

export async function GET(request: Request) {
  const user = getRequestUser(request);

  if (useDatabasePersistence()) {
    const profile = await findUserProfile(user.id);
    if (!profile) return fail({ code: "PROFILE_NOT_FOUND", message: "Profile was not found." }, 404);
    return ok(profile, { mode: "database-profile", actor: user.id });
  }

  return ok(getDemoProfile(user.id), { mode: "demo-profile", actor: user.id });
}

export async function PATCH(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "SUPPLIER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const parsed = await parseJson(request, profilePatchSchema);
  if (!parsed.ok) return parsed.response;

  if (useDatabasePersistence()) {
    const updated = await updateUserProfile({ userId: user.id, ...parsed.data });
    return ok(updated, { mode: "database-profile-update", persisted: true });
  }

  return ok({
    ...getDemoProfile(user.id),
    requestedUpdate: parsed.data,
    audit: createAuditDraft({ actorId: user.id, actorRole: user.role, action: "PROFILE_UPDATE", targetType: "USER", targetId: user.id, after: parsed.data }),
  }, { mode: "demo-profile-update", persisted: false });
}
