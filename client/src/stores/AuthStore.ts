import { create } from "zustand";
import { User } from "../types";

type State = {
    isLoggedIn: boolean;
    userData: User | null;
};
type Actions = {
    login: () => void;
    logout: () => void;
    setUserData: () => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
    isLoggedIn: false,
    userData: null,
    login: () => {
        set({ isLoggedIn: true });
    },
    logout: () => {
        set({ isLoggedIn: false, userData: null });
    },
    setUserData: () => {},
}));
