import type { VercelResponse } from "@vercel/node";
import { logWorkoutSchema } from "@my-gym-app/shared";
import { withHandler, ensureBody, ok } from "../../src/middleware/withHandler.js";
import { workoutService } from "../../src/services/workoutService.js";
import { workoutRepository } from "../../src/repositories/workoutRepository.js";

export default withHandler({ methods: ["GET", "POST"], auth: true }, async (req, res: VercelResponse) => {
  const userId = req.user!.id;

  if (req.method === "GET") {
    const data = await workoutRepository.listHistory(userId);
    ok(res, { data });
    return;
  }

  const input = logWorkoutSchema.parse(ensureBody(req.body));
  const data = await workoutService.logWorkout(userId, input);
  ok(res, { data });
});

