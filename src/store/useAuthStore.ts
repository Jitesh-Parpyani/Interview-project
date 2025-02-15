import create from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  email: string;
}

interface AuthState {
  token: string | null;
  user: UserInfo | null;

  login: (token: string, user: UserInfo) => void;
  logout: () => void;

  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
      isAuthenticated: false,
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);
