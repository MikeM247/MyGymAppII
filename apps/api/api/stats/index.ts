import type { VercelResponse } from "@vercel/node";
import { withHandler, ok } from "../../src/middleware/withHandler.js";
import { statsRepository } from "../../src/repositories/statsRepository.js";

export default withHandler({ methods: ["GET"], auth: true }, async (req, res: VercelResponse) => {
  const userId = req.user!.id;

  const [volumeByExercise, prProgression, weeklyFrequency] = await Promise.all([
    statsRepository.volumeByExercise(userId),
    statsRepository.prProgression(userId),
    statsRepository.weeklyFrequency(userId)
  ]);

  ok(res, {
    data: {
      volumeByExercise,
      prProgression,
      weeklyFrequency
    }
  });
});
