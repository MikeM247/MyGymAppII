import type { LogWorkoutInput } from "@my-gym-app/shared";
import { personalRecordRepository } from "../repositories/personalRecordRepository.js";
import { workoutRepository } from "../repositories/workoutRepository.js";

export const workoutService = {
  async logWorkout(userId: string, input: LogWorkoutInput) {
    const result = await workoutRepository.createSessionWithSets(userId, input);

    const prs = [] as Array<{ exerciseId: string; weightKg: number; reps: number }>;

    for (const set of result.sets) {
      const prResult = await personalRecordRepository.upsertIfPR(
        userId,
        set.exerciseId,
        set.weightKg,
        set.reps,
        set.completedAt,
        result.session.id
      );

      if (prResult.isPr) {
        prs.push({
          exerciseId: set.exerciseId,
          weightKg: set.weightKg,
          reps: set.reps
        });
      }
    }

    return {
      sessionId: result.session.id,
      totalVolumeKg: result.totalVolumeKg,
      personalRecords: prs
    };
  }
};

