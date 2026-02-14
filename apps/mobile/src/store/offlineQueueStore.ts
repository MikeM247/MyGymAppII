import { create } from "zustand";
import type { OfflineQueueItem } from "@my-gym-app/shared";
import { getItem, setItem } from "@/lib/storage/asyncStorage";

const KEY = "offline-queue-v1";

type QueueState = {
  queue: OfflineQueueItem[];
  hydrate: () => Promise<void>;
  enqueue: (item: OfflineQueueItem) => Promise<void>;
  dequeue: (id: string) => Promise<void>;
};

export const useOfflineQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  hydrate: async () => {
    const saved = await getItem<OfflineQueueItem[]>(KEY);
    set({ queue: saved ?? [] });
  },
  enqueue: async (item) => {
    const next = [...get().queue, item];
    set({ queue: next });
    await setItem(KEY, next);
  },
  dequeue: async (id) => {
    const next = get().queue.filter((item) => item.id !== id);
    set({ queue: next });
    await setItem(KEY, next);
  }
}));
