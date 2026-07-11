/**
 * Simple in-memory rate limiter for sensitive endpoints (login, etc.).
 *
 * This is intentionally lightweight: the CRM runs as a single Next.js
 * process without a shared cache/queue, so an in-memory Map keyed by a
 * client identifier (IP) is enough to stop naive brute-force scripts.
 *
 * Limitation: state resets on process restart and isn't shared across
 * multiple instances. If this app is ever deployed behind multiple
 * server instances, replace this with a shared store (e.g. Redis).
 */

type Bucket = {
  count: number;
  windowStart: number;
  blockedUntil?: number;
};

const buckets = new Map<string, Bucket>();

// Nettoyage périodique pour éviter une fuite mémoire sur un process longue durée.
setInterval(
  () => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (now - bucket.windowStart > 60 * 60 * 1000) buckets.delete(key);
    }
  },
  15 * 60 * 1000
).unref?.();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/**
 * @param key identifiant du client (IP, ou IP+email)
 * @param maxAttempts nombre de tentatives autorisées dans la fenêtre
 * @param windowMs durée de la fenêtre glissante en ms
 * @param blockMs durée du blocage une fois la limite atteinte
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 60_000,
  blockMs = 5 * 60_000
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (bucket?.blockedUntil && bucket.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  bucket.count += 1;

  if (bucket.count > maxAttempts) {
    bucket.blockedUntil = now + blockMs;
    return { allowed: false, retryAfterSeconds: Math.ceil(blockMs / 1000) };
  }

  return { allowed: true };
}

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || "unknown";
}
