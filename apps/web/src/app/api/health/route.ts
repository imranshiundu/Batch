import { ok } from "@/lib/api-response";

export function GET() {
  return ok({ service: "batch-web-api", status: "ok", mode: "demo-wired" });
}
