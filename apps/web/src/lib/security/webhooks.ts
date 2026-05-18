import { createHmac, timingSafeEqual } from "node:crypto";
import { fail } from "@/lib/api-response";

export type WebhookProvider = "circle" | "arc" | "mock" | "local";

export async function verifyWebhookRequest(request: Request, provider: WebhookProvider) {
  if (provider === "mock" || provider === "local") {
    return { ok: true as const, rawBody: await request.text(), verification: "demo-provider" };
  }

  const signature = request.headers.get("x-batch-signature") ?? request.headers.get("x-circle-signature");
  const secret = process.env[`WEBHOOK_${provider.toUpperCase()}_SECRET`];
  const rawBody = await request.text();

  if (!secret) {
    return {
      ok: false as const,
      response: fail({ code: "WEBHOOK_SECRET_NOT_CONFIGURED", message: "Webhook secret is not configured for this provider." }, 500),
    };
  }

  if (!signature) {
    return {
      ok: false as const,
      response: fail({ code: "WEBHOOK_SIGNATURE_REQUIRED", message: "Webhook signature header is required." }, 401),
    };
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = signature.replace(/^sha256=/, "");

  const valid = safeCompare(expected, provided);
  if (!valid) {
    return {
      ok: false as const,
      response: fail({ code: "WEBHOOK_SIGNATURE_INVALID", message: "Webhook signature did not verify." }, 401),
    };
  }

  return { ok: true as const, rawBody, verification: "hmac-sha256" };
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
