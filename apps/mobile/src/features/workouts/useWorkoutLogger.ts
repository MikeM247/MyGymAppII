import { useState } from "react";
import type { LogWorkoutInput } from "@my-gym-app/shared";
import { apiFetch } from "@/lib/api/client";
import { useOfflineQueueStore } from "@/store/offlineQueueStore";

export function useWorkoutLogger() {
  const [status, setStatus] = useState("");
  const enqueue = useOfflineQueueStore((state) => state.enqueue);

  const logWorkout = async (payload: LogWorkoutInput) => {
    try {
      const response = await apiFetch<{ data: { totalVolumeKg: number } }>("/api/workouts", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setStatus(`Saved. Volume: ${response.data.totalVolumeKg.toFixed(1)} kg`);
    } catch {
      await enqueue({
        id: `${Date.now()}`,
        route: "/api/workouts",
        method: "POST",
        body: payload,
        createdAt: new Date().toISOString()
      });
      setStatus("Offline. Workout queued for sync.");
    }
  };

  return { status, logWorkout };
}
