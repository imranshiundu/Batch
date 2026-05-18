import { fail, ok } from "@/lib/api-response";
import { rateLimit } from "@/lib/security/rate-limit";
import { verifyWebhookRequest, type WebhookProvider } from "@/lib/security/webhooks";

const allowed = new Set(["circle", "arc", "mock", "local"]);

export async function POST(request: Request, context: { params: Promise<{ provider: string }> }) {
  const limited = rateLimit(request, { key: "payment-webhook", limit: 120, windowMs: 60_000 });
  if (limited) return limited;

  const { provider } = await context.params;
  if (!allowed.has(provider)) return fail({ code: "UNKNOWN_PAYMENT_PROVIDER", message: "Payment provider is not supported." }, 404);

  const verification = await verifyWebhookRequest(request, provider as WebhookProvider);
  if (!verification.ok) return verification.response;

  const payload = JSON.parse(verification.rawBody || "{}");

  return ok({
    provider,
    accepted: true,
    eventId: payload.id ?? `event_${Date.now()}`,
    verification: verification.verification,
  }, { persisted: false }, 202);
}
