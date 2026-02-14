import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export type HistorySession = {
  id: string;
  startedAt: string;
  totalVolumeKg: number;
  sets: Array<{ id: string; reps: number; weightKg: number; exercise: { name: string } }>;
};

export function useHistory() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);

  useEffect(() => {
    apiFetch<{ data: HistorySession[] }>("/api/workouts")
      .then((response) => setSessions(response.data))
      .catch(() => null);
  }, []);

  return sessions;
}
