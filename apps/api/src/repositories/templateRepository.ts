import { prisma } from "../lib/prisma.js";
import type { CreateTemplateInput } from "@my-gym-app/shared";

export const templateRepository = {
  async listByUser(userId: string) {
    return prisma.workoutTemplate.findMany({
      where: { userId, deletedAt: null },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { orderIndex: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async create(userId: string, input: CreateTemplateInput) {
    return prisma.workoutTemplate.create({
      data: {
        userId,
        name: input.name,
        notes: input.notes,
        exercises: {
          create: input.exercises.map((exercise, index) => ({
            exerciseId: exercise.exerciseId,
            orderIndex: index,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps,
            targetRpe: exercise.targetRpe,
            restSeconds: exercise.restSeconds
          }))
        }
      },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { orderIndex: "asc" }
        }
      }
    });
  },

  async softDelete(templateId: string, userId: string) {
    return prisma.workoutTemplate.updateMany({
      where: { id: templateId, userId, deletedAt: null },
      data: { deletedAt: new Date() }
    });
  }
};

