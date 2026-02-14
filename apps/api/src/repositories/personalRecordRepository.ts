import { prisma } from "../lib/prisma.js";

export const personalRecordRepository = {
  async upsertIfPR(userId: string, exerciseId: string, weightKg: number, reps: number, achievedAt: Date, sessionId: string) {
    const existing = await prisma.personalRecord.findUnique({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId
        }
      }
    });

    if (!existing || weightKg > existing.weightKg) {
      const record = await prisma.personalRecord.upsert({
        where: {
          userId_exerciseId: {
            userId,
            exerciseId
          }
        },
        create: {
          userId,
          exerciseId,
          weightKg,
          reps,
          achievedAt,
          sessionId
        },
        update: {
          weightKg,
          reps,
          achievedAt,
          sessionId
        }
      });

      return { isPr: true, record };
    }

    return { isPr: false, record: existing };
  }
};
