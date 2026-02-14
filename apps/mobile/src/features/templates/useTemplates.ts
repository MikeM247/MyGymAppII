import { useCallback, useEffect, useState } from "react";
import type { CreateTemplateInput } from "@my-gym-app/shared";
import { apiFetch } from "@/lib/api/client";
import { useOfflineQueueStore } from "@/store/offlineQueueStore";

export type TemplateItem = {
  id: string;
  name: string;
  notes?: string;
};

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const enqueue = useOfflineQueueStore((state) => state.enqueue);

  const loadTemplates = useCallback(() => {
    apiFetch<{ data: TemplateItem[] }>("/api/templates")
      .then((response) => setTemplates(response.data))
      .catch(() => null);
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const createTemplate = async (payload: CreateTemplateInput) => {
    try {
      await apiFetch("/api/templates", { method: "POST", body: JSON.stringify(payload) });
      loadTemplates();
    } catch {
      await enqueue({
        id: `${Date.now()}`,
        route: "/api/templates",
        method: "POST",
        body: payload,
        createdAt: new Date().toISOString()
      });
    }
  };

  return { templates, createTemplate };
}
