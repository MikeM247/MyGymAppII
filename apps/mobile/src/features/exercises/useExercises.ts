import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export type ExerciseListItem = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  youtubeUrl?: string;
};

export function useExercises(search: string) {
  const [items, setItems] = useState<ExerciseListItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      apiFetch<{ data: ExerciseListItem[] }>(`/api/exercises${search ? `?q=${encodeURIComponent(search)}` : ""}`)
        .then((response) => setItems(response.data))
        .catch(() => null);
    }, 180);

    return () => clearTimeout(timer);
  }, [search]);

  return items;
}
