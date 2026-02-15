import { useOfflineQueueStore } from "@/store/offlineQueueStore";
import { apiFetch } from "@/lib/api/client";

export async function syncOfflineQueue(): Promise<void> {
  const state = useOfflineQueueStore.getState();

  for (const item of state.queue) {
    try {
      await apiFetch(item.route, {
        method: item.method,
        body: JSON.stringify(item.body)
      });
      await state.dequeue(item.id);
    } catch {
      break;
    }
  }
}
