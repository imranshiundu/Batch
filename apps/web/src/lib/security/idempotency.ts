import { fail } from "@/lib/api-response";

const seen = new Set<string>();

export function getIdempotencyKey(request: Request, fallback?: string) {
  return request.headers.get("idempotency-key") ?? fallback ?? null;
}

export function requireIdempotencyKey(request: Request) {
  const key = getIdempotencyKey(request);
  if (!key || key.length < 12) {
    return {
      ok: false as const,
      response: fail({ code: "IDEMPOTENCY_KEY_REQUIRED", message: "Mutating money or state endpoints require an Idempotency-Key header." }, 400),
    };
  }

  if (seen.has(key)) {
    return {
      ok: false as const,
      response: fail({ code: "DUPLICATE_IDEMPOTENCY_KEY", message: "This idempotency key has already been used in this demo process." }, 409),
    };
  }

  seen.add(key);
  return { ok: true as const, key };
}
