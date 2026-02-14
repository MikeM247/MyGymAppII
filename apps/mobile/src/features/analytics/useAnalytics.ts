import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export type StatsPayload = {
  volumeByExercise: Array<{ date: string; exerciseName: string; volumeKg: number }>;
  prProgression: Array<{ achievedAt: string; exercise: { name: string }; weightKg: number }>;
  weeklyFrequency: Array<{ weekStart: string; count: number }>;
};

export function useAnalytics() {
  const [stats, setStats] = useState<StatsPayload | null>(null);

  useEffect(() => {
    apiFetch<{ data: StatsPayload }>("/api/stats")
      .then((response) => setStats(response.data))
      .catch(() => null);
  }, []);

  return stats;
}
