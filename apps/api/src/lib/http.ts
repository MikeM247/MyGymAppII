import type { VercelResponse } from "@vercel/node";

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function sendJson(res: VercelResponse, statusCode: number, data: unknown): void {
  res.status(statusCode).json(data);
}

export function handleError(res: VercelResponse, error: unknown): void {
  if (error instanceof HttpError) {
    sendJson(res, error.statusCode, { error: error.message });
    return;
  }

  console.error(error);
  sendJson(res, 500, { error: "Internal server error" });
}
