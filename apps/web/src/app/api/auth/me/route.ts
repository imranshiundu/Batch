import { ok } from "@/lib/api-response";
import { demoUsers } from "@/lib/api-demo-store";

export function GET() {
  return ok({ user: demoUsers[0], profileRequired: false }, { auth: "demo-user" });
}
