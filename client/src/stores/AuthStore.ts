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

export const useAuthStore = create<State & Actions>((set, get) => ({
    isLoggedIn: false,
    userData: null,
    login: () => {
        const { setUserData } = get();
        set({ isLoggedIn: true });
        setUserData();
    },
    logout: () => {
        set({ isLoggedIn: false, userData: null });
    },
    setUserData: () => {},
}));
