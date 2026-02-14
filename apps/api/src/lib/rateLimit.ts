import { env } from "./env.js";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function enforceRateLimit(key: string): void {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + env.RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (current.count >= env.RATE_LIMIT_MAX_REQUESTS) {
    throw new Error("RATE_LIMITED");
  }

  current.count += 1;
  buckets.set(key, current);
}
