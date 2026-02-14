import type { VercelResponse } from "@vercel/node";
import { createTemplateSchema } from "@my-gym-app/shared";
import { withHandler, ensureBody, ok } from "../../src/middleware/withHandler.js";
import { templateRepository } from "../../src/repositories/templateRepository.js";
import { HttpError } from "../../src/lib/http.js";

export default withHandler({ methods: ["GET", "POST", "DELETE"], auth: true }, async (req, res: VercelResponse) => {
  const userId = req.user!.id;

  if (req.method === "GET") {
    const data = await templateRepository.listByUser(userId);
    ok(res, { data });
    return;
  }

  if (req.method === "POST") {
    const input = createTemplateSchema.parse(ensureBody(req.body));
    const data = await templateRepository.create(userId, input);
    ok(res, { data });
    return;
  }

  const templateId = typeof req.query.templateId === "string" ? req.query.templateId : undefined;
  if (!templateId) {
    throw new HttpError(400, "templateId is required");
  }

  await templateRepository.softDelete(templateId, userId);
  ok(res, { success: true });
});

