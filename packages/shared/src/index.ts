import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(80)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(120),
  notes: z.string().max(500).optional(),
  exercises: z.array(z.object({
    exerciseId: z.string().uuid(),
    targetSets: z.number().int().positive().max(20),
    targetReps: z.number().int().positive().max(100),
    targetRpe: z.number().min(1).max(10).optional(),
    restSeconds: z.number().int().min(0).max(1800).optional()
  })).min(1)
});

export const logWorkoutSchema = z.object({
  templateId: z.string().uuid().optional(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  sets: z.array(z.object({
    exerciseId: z.string().uuid(),
    setNumber: z.number().int().positive(),
    weightKg: z.number().nonnegative(),
    reps: z.number().int().positive(),
    rpe: z.number().min(1).max(10).optional(),
    restSeconds: z.number().int().min(0).max(1800).optional(),
    completedAt: z.string().datetime().optional()
  })).min(1)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type LogWorkoutInput = z.infer<typeof logWorkoutSchema>;

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type OfflineQueueItem = {
  id: string;
  route: "/api/workouts" | "/api/templates";
  method: "POST" | "PUT" | "DELETE";
  body: unknown;
  createdAt: string;
};
