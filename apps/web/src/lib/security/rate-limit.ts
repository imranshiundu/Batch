import { fail } from "@/lib/api-response";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: Request, options: { key: string; limit: number; windowMs: number }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${options.key}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  if (bucket.count >= options.limit) {
    return fail({ code: "RATE_LIMITED", message: "Too many requests. Try again later." }, 429);
  }

  bucket.count += 1;
  return null;
}
