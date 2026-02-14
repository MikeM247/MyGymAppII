import type { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpError, handleError, sendJson } from "../lib/http.js";
import { enforceRateLimit } from "../lib/rateLimit.js";
import { verifyToken } from "../lib/jwt.js";

export type AuthenticatedRequest = VercelRequest & {
  user?: {
    id: string;
    email: string;
  };
};

type HandlerOptions = {
  methods: Array<"GET" | "POST" | "PUT" | "DELETE">;
  auth?: boolean;
};

export function withHandler(
  options: HandlerOptions,
  handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: VercelResponse): Promise<void> => {
    try {
      if (!req.method || !options.methods.includes(req.method as HandlerOptions["methods"][number])) {
        throw new HttpError(405, "Method not allowed");
      }

      const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] ?? "unknown";
      try {
        enforceRateLimit(`${ip}:${req.url ?? "unknown"}`);
      } catch {
        throw new HttpError(429, "Too many requests");
      }

      if (options.auth) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          throw new HttpError(401, "Missing bearer token");
        }

        const token = authHeader.slice("Bearer ".length);
        const payload = verifyToken(token);
        req.user = { id: payload.sub, email: payload.email };
      }

      await handler(req, res);
    } catch (error) {
      handleError(res, error);
    }
  };
}

export function ensureBody<T>(input: unknown): T {
  if (!input || typeof input !== "object") {
    throw new HttpError(400, "Invalid JSON body");
  }
  return input as T;
}

export function ok(res: VercelResponse, payload: unknown): void {
  sendJson(res, 200, payload);
}
