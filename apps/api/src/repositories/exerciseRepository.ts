import { prisma } from "../lib/prisma.js";

export const exerciseRepository = {
  list(filters: { q?: string; muscleGroup?: string; equipment?: string }) {
    return prisma.exercise.findMany({
      where: {
        deletedAt: null,
        name: filters.q ? { contains: filters.q, mode: "insensitive" } : undefined,
        muscleGroup: filters.muscleGroup,
        equipment: filters.equipment
      },
      orderBy: { name: "asc" }
    });
  }
};
