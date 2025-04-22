import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
    userData: User | null;
    isLoggedIn: boolean;
}
interface AuthActions {
    login: (payload: User) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
    userData: null,
    isLoggedIn: false,
    login: (payload) => {
        set({ isLoggedIn: true, userData: payload });
    },
}));
