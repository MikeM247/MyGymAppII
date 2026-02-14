import { create } from "zustand";
import { clearToken, getToken, saveToken } from "@/lib/storage/secureStore";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  isReady: boolean;
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => Promise<void>;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isReady: false,
  token: null,
  user: null,
  setAuth: async (token, user) => {
    await saveToken(token);
    set({ token, user });
  },
  bootstrap: async () => {
    const token = await getToken();
    set({ token, isReady: true });
  },
  logout: async () => {
    await clearToken();
    set({ token: null, user: null });
  }
}));
