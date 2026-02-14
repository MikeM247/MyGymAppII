import { prisma } from "../lib/prisma.js";

export const statsRepository = {
  async volumeByExercise(userId: string) {
    const rows = await prisma.workoutSet.findMany({
      where: { session: { userId, deletedAt: null } },
      include: { exercise: true, session: true },
      orderBy: { completedAt: "asc" }
    });

    return rows.map((row) => ({
      date: row.completedAt.toISOString(),
      exerciseId: row.exerciseId,
      exerciseName: row.exercise.name,
      volumeKg: row.volumeKg
    }));
  },

  prProgression(userId: string) {
    return prisma.personalRecord.findMany({
      where: { userId },
      include: { exercise: true },
      orderBy: { achievedAt: "asc" }
    });
  },

  async weeklyFrequency(userId: string) {
    const sessions = await prisma.workoutSession.findMany({
      where: { userId, deletedAt: null },
      select: { startedAt: true }
    });

    const bucket = new Map<string, number>();

    for (const session of sessions) {
      const date = new Date(session.startedAt);
      const first = new Date(date);
      first.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
      const key = first.toISOString().slice(0, 10);
      bucket.set(key, (bucket.get(key) ?? 0) + 1);
    }

    return Array.from(bucket.entries())
      .map(([weekStart, count]) => ({ weekStart, count }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  }
};
