import type { VercelResponse } from "@vercel/node";
import { withHandler, ok } from "../../src/middleware/withHandler.js";
import { exerciseRepository } from "../../src/repositories/exerciseRepository.js";

export default withHandler({ methods: ["GET"], auth: true }, async (req, res: VercelResponse) => {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const muscleGroup = typeof req.query.muscleGroup === "string" ? req.query.muscleGroup : undefined;
  const equipment = typeof req.query.equipment === "string" ? req.query.equipment : undefined;

  const data = await exerciseRepository.list({ q, muscleGroup, equipment });
  ok(res, { data });
});
