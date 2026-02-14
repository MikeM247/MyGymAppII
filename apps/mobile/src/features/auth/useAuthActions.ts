import { useState } from "react";
import type { AuthResponse, LoginInput, RegisterInput } from "@my-gym-app/shared";
import { apiFetch } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (payload: LoginInput) => {
    setLoading(true);
    try {
      const response = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      await setAuth(response.token, response.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterInput) => {
    setLoading(true);
    try {
      const response = await apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      await setAuth(response.token, response.user);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login, register };
}
