import { fail, ok } from "@/lib/api-response";

const allowed = new Set(["circle", "arc", "mock", "local"]);

export async function POST(request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  if (!allowed.has(provider)) return fail({ code: "UNKNOWN_PAYMENT_PROVIDER", message: "Payment provider is not supported." }, 404);

  const payload = await request.json().catch(() => null);
  if (!payload) return fail({ code: "INVALID_WEBHOOK_PAYLOAD", message: "Webhook payload must be valid JSON." }, 400);

  return ok({ provider, accepted: true, eventId: payload.id ?? `event_${Date.now()}` }, { persisted: false, verification: "not-enabled-yet" }, 202);
}
