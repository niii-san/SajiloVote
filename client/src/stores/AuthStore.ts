import { create } from "zustand";

export const useAuthStore = create((set) => ({
  userData: null,
  isLoggedIn: false,
  login: ({}) => {
    set({ isLoggedIn: true });
  },
}));

