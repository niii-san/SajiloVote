import { create } from "zustand";
import { User } from "../types";
import { api } from "../utils";

type State = {
    isLoggedIn: boolean;
    userData: User | null;
    verifyLoading: boolean;
};
type Actions = {
    login: () => void;
    logout: () => void;
    setUserData: () => void;
    verify: () => void;
};

export const useAuthStore = create<State & Actions>((set, get) => ({
    isLoggedIn: false,
    userData: null,
    verifyLoading: false,
    login: () => {
        const { setUserData } = get();
        set({ isLoggedIn: true });
        setUserData();
    },
    logout: () => {
        set({ isLoggedIn: false, userData: null });
    },
    setUserData: async () => {},

    verify: async () => {
        set({ verifyLoading: true });
        console.log("runned verify token fn");
        try {
            const res = await api.get("/api/v1/auth/verify-token");
            if (res.data?.success) {
                set({ isLoggedIn: true });
            } else {
                set({ isLoggedIn: false });
            }
        } catch (_) {
            set({ isLoggedIn: false });
        } finally {
            set({ verifyLoading: false });
        }
    },
}));
