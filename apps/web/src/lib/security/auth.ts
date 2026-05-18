import { fail } from "@/lib/api-response";

export type Role = "BUYER" | "SUPPLIER" | "OPERATOR" | "ADMIN";

export type AuthUser = {
  id: string;
  role: Role;
  email: string;
  name: string;
};

const demoUsers: Record<Role, AuthUser> = {
  BUYER: { id: "buyer_demo", role: "BUYER", email: "buyer@batch.local", name: "Demo Buyer" },
  SUPPLIER: { id: "supplier_demo", role: "SUPPLIER", email: "supplier@batch.local", name: "Demo Supplier" },
  OPERATOR: { id: "operator_demo", role: "OPERATOR", email: "operator@batch.local", name: "Demo Operator" },
  ADMIN: { id: "admin_demo", role: "ADMIN", email: "admin@batch.local", name: "Demo Admin" },
};

export function getRequestUser(request: Request): AuthUser {
  const roleHeader = request.headers.get("x-batch-demo-role")?.toUpperCase() as Role | undefined;
  return demoUsers[roleHeader && roleHeader in demoUsers ? roleHeader : "BUYER"];
}

export function requireRole(user: AuthUser, allowed: Role[]) {
  if (!allowed.includes(user.role)) {
    return fail({ code: "FORBIDDEN", message: "Your role cannot access this endpoint.", detail: { role: user.role, allowed } }, 403);
  }

  return null;
}

export function requireActiveUser(user: AuthUser | null) {
  if (!user) {
    return fail({ code: "UNAUTHENTICATED", message: "Authentication is required." }, 401);
  }

  return null;
}
