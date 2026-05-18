import type { DomainResult } from "./types";

export type ProfileRole = "BUYER" | "SUPPLIER" | "OPERATOR" | "ADMIN";

export type ProfileCompletion = {
  role: ProfileRole;
  required: string[];
  missing: string[];
  complete: boolean;
};

export function evaluateProfileCompletion(input: { role: ProfileRole; name?: string | null; email?: string | null; phone?: string | null; country?: string | null; businessName?: string | null; }): DomainResult<ProfileCompletion> {
  const required = input.role === "SUPPLIER" ? ["name", "email", "phone", "country", "businessName"] : ["name", "email", "phone"];
  const values: Record<string, string | null | undefined> = { name: input.name, email: input.email, phone: input.phone, country: input.country, businessName: input.businessName };
  const missing = required.filter((field) => !values[field] || values[field]?.trim().length === 0);
  return { ok: true, data: { role: input.role, required, missing, complete: missing.length === 0 } };
}
