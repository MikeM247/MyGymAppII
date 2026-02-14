import { prisma } from "../lib/prisma.js";
import type { LogWorkoutInput } from "@my-gym-app/shared";

export const workoutRepository = {
  async createSessionWithSets(userId: string, input: LogWorkoutInput) {
    return prisma.$transaction(async (tx) => {
      const session = await tx.workoutSession.create({
        data: {
          userId,
          templateId: input.templateId,
          startedAt: new Date(input.startedAt),
          endedAt: input.endedAt ? new Date(input.endedAt) : null,
          notes: input.notes
        }
      });

      const sets = await Promise.all(
        input.sets.map((set) =>
          tx.workoutSet.create({
            data: {
              sessionId: session.id,
              exerciseId: set.exerciseId,
              setNumber: set.setNumber,
              weightKg: set.weightKg,
              reps: set.reps,
              rpe: set.rpe,
              restSeconds: set.restSeconds,
              volumeKg: set.weightKg * set.reps,
              completedAt: set.completedAt ? new Date(set.completedAt) : new Date()
            }
          })
        )
      );

      const totalVolumeKg = sets.reduce((sum, set) => sum + set.volumeKg, 0);

      await tx.workoutSession.update({
        where: { id: session.id },
        data: { totalVolumeKg }
      });

      return { session, sets, totalVolumeKg };
    });
  },

  listHistory(userId: string) {
    return prisma.workoutSession.findMany({
      where: { userId, deletedAt: null },
      include: {
        sets: {
          include: { exercise: true },
          orderBy: [{ exerciseId: "asc" }, { setNumber: "asc" }]
        }
      },
      orderBy: { startedAt: "desc" }
    });
  }
};

